import { v } from "convex/values";
import { internalMutation, mutation } from "../_generated/server";

/**
 * Mutations for managing generated pages
 */

/**
 * Create a new generated page
 */
export const createPage = mutation({
    args: {
        niche_id: v.id("niches"),
        slug: v.string(),
        title: v.string(),
        meta_description: v.string(),
        content_json: v.any(),
        aio_score: v.number(),
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        const pageId = await ctx.db.insert("generated_pages", {
            niche_id: args.niche_id,
            slug: args.slug,
            title: args.title,
            meta_description: args.meta_description,
            content_json: args.content_json,
            status: "draft",
            indexing_status: "pending",
            aio_score: args.aio_score,
            created_at: now,
            updated_at: now,
        });

        return pageId;
    },
});

/**
 * Update an existing page
 */
export const updatePage = mutation({
    args: {
        id: v.id("generated_pages"),
        content_json: v.optional(v.any()),
        status: v.optional(v.union(v.literal("published"), v.literal("draft"))),
        aio_score: v.optional(v.number()),
    },
    handler: async (ctx, args) => {
        const { id, ...updates } = args;

        await ctx.db.patch(id, {
            ...updates,
            updated_at: Date.now(),
        });

        return id;
    },
});

/**
 * Publish a page (sets status to published and indexing_status to pending)
 */
export const publishPage = mutation({
    args: {
        id: v.id("generated_pages"),
    },
    handler: async (ctx, args) => {
        await ctx.db.patch(args.id, {
            status: "published",
            indexing_status: "pending",
            updated_at: Date.now(),
        });

        return args.id;
    },
});

/**
 * Update indexing status (used by cron jobs)
 */
export const updateIndexingStatus = mutation({
    args: {
        id: v.id("generated_pages"),
        indexing_status: v.union(
            v.literal("pending"),
            v.literal("submitted"),
            v.literal("indexed")
        ),
    },
    handler: async (ctx, args) => {
        const updates: any = {
            indexing_status: args.indexing_status,
            updated_at: Date.now(),
        };

        if (args.indexing_status === "indexed") {
            updates.indexed_at = Date.now();
        }

        await ctx.db.patch(args.id, updates);

        return args.id;
    },
});

/**
 * Delete a page
 */
export const deletePage = mutation({
    args: {
        id: v.id("generated_pages"),
    },
    handler: async (ctx, args) => {
        await ctx.db.delete(args.id);
    },
});

/**
 * Internal mutation to save AI-generated page content
 * Called automatically by the generateLandingPage action
 */
export const saveGeneratedPage = internalMutation({
    args: {
        nicheId: v.optional(v.id("niches")),
        nicheSlug: v.string(),
        content: v.any(), // GeneratedLandingPageContent
    },
    handler: async (ctx, args) => {
        const now = Date.now();

        // Extract title and meta description from content
        const title = args.content.seo.title;
        const metaDescription = args.content.seo.description;

        // Create the page entry
        const pageId = await ctx.db.insert("generated_pages", {
            niche_id: args.nicheId,
            slug: args.nicheSlug,
            title: title,
            meta_description: metaDescription,
            content_json: args.content,
            status: "published", // Auto-publish AI-generated pages
            indexing_status: "pending",
            aio_score: 95, // High AIO score for AI-generated content
            created_at: now,
            updated_at: now,
        });

        return pageId;
    },
});

