import { mutation } from "../_generated/server";
import { v } from "convex/values";

export const saveGeneratedPage = mutation({
    args: {
        slug: v.string(),
        nicheName: v.optional(v.string()),
        content: v.any(),
    },
    handler: async (ctx, args) => {
        // Verificam daca pagina exista
        const existing = await ctx.db
            .query("generated_pages")
            .withIndex("by_slug", (q) => q.eq("slug", args.slug))
            .first();

        if (existing) {
            await ctx.db.patch(existing._id, {
                content_json: args.content,
                status: "published",
                updated_at: Date.now(),
            });
        } else {
            await ctx.db.insert("generated_pages", {
                slug: args.slug,
                niche_id: undefined, // Optional momentan
                title: args.content.seo_title || "Titlu Generat",
                meta_description: args.content.seo_desc || "",
                content_json: args.content,
                status: "published",
                indexing_status: "pending",
                aio_score: 85,
                created_at: Date.now(),
            });
        }
    },
});
