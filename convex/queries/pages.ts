import { v } from "convex/values";
import { query } from "../_generated/server";

/**
 * Queries for fetching generated pages and niches
 */

/**
 * Get a page by its slug
 */
export const getPageBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const page = await ctx.db
            .query("generated_pages")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (!page) {
            return null;
        }

        // Also fetch the associated niche
        const niche = await ctx.db.get(page.niche_id);

        return {
            ...page,
            niche,
        };
    },
});

/**
 * Get all published pages
 */
export const getPublishedPages = query({
    args: {},
    handler: async (ctx) => {
        const pages = await ctx.db
            .query("generated_pages")
            .withIndex("by_status", (q) => q.eq("status", "published"))
            .collect();

        return pages;
    },
});

/**
 * Get all pages for a specific niche
 */
export const getPagesByNiche = query({
    args: {
        niche_id: v.id("niches"),
    },
    handler: async (ctx, args) => {
        const pages = await ctx.db
            .query("generated_pages")
            .withIndex("by_niche", (q) => q.eq("niche_id", args.niche_id))
            .collect();

        return pages;
    },
});

/**
 * Get pages pending indexing (for cron job)
 */
export const getPendingIndexingPages = query({
    args: {},
    handler: async (ctx) => {
        const pages = await ctx.db
            .query("generated_pages")
            .withIndex("by_indexing_status", (q) => q.eq("indexing_status", "pending"))
            .filter((q) => q.eq(q.field("status"), "published"))
            .collect();

        return pages;
    },
});

/**
 * Get all niches
 */
export const getAllNiches = query({
    args: {},
    handler: async (ctx) => {
        const niches = await ctx.db.query("niches").collect();
        return niches;
    },
});

/**
 * Get a niche by slug
 */
export const getNicheBySlug = query({
    args: {
        slug: v.string(),
    },
    handler: async (ctx, args) => {
        const niche = await ctx.db
            .query("niches")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        return niche;
    },
});
