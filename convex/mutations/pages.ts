import { v } from "convex/values";
import { mutation } from "../_generated/server";

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
