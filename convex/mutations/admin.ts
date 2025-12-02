import { internalMutation } from "../_generated/server";
import { internal, api } from "../_generated/api";
import { v } from "convex/values";

/**
 * Admin utilities for managing the WebNova platform
 * 
 * These are internal functions that can only be called from the Convex dashboard
 * or other internal actions.
 */

/**
 * Generate a new landing page for a niche
 * 
 * Usage: Call this from the Convex dashboard or a server action
 */
export const generatePageForNiche = internalMutation({
    args: {
        nicheSlug: v.string(),
    },
    handler: async (ctx, args) => {
        // 1. Get the niche
        const niche = await ctx.db
            .query("niches")
            .withIndex("by_slug", (q) => q.eq("slug", args.nicheSlug))
            .first();

        if (!niche) {
            throw new Error(`Niche not found: ${args.nicheSlug}`);
        }

        // 2. Generate content using Gemini AI
        const generatedContent = await ctx.scheduler.runAfter(
            0,
            api.actions.gemini.generateLandingPage,
            {
                nicheName: niche.name,
                nicheSlug: niche.slug,
                nicheId: niche._id,
            }
        );

        console.log(`Generated content for ${niche.name}`);

        // Note: The actual page creation happens in a separate action
        // because we need to wait for the AI response

        return {
            message: `Page generation scheduled for ${niche.name}`,
            nicheId: niche._id,
        };
    },
});

/**
 * Create a page from generated content
 * (This would be called after AI generation completes)
 */
export const createPageFromContent = internalMutation({
    args: {
        nicheId: v.id("niches"),
        content: v.any(),
    },
    handler: async (ctx, args) => {
        const niche = await ctx.db.get(args.nicheId);

        if (!niche) {
            throw new Error("Niche not found");
        }

        const now = Date.now();
        const slug = `solutii/site-pentru-${niche.slug}`;

        // Check if page already exists
        const existingPage = await ctx.db
            .query("generated_pages")
            .withIndex("by_slug", (q) => q.eq("slug", slug))
            .first();

        if (existingPage) {
            // Update existing page
            await ctx.db.patch(existingPage._id, {
                content_json: args.content,
                title: args.content.seo.title,
                meta_description: args.content.seo.description,
                updated_at: now,
            });

            return {
                message: "Page updated",
                pageId: existingPage._id,
                slug,
            };
        }

        // Create new page
        const pageId = await ctx.db.insert("generated_pages", {
            niche_id: args.nicheId,
            slug,
            title: args.content.seo.title,
            meta_description: args.content.seo.description,
            content_json: args.content,
            status: "draft",
            indexing_status: "pending",
            aio_score: 85, // Default AIO score
            created_at: now,
            updated_at: now,
        });

        return {
            message: "Page created",
            pageId,
            slug,
        };
    },
});
