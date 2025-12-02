import { v } from "convex/values";
import { internalMutation } from "../_generated/server";

/**
 * Mutations for indexing_logs table
 */

/**
 * Create an indexing log entry
 */
export const createLog = internalMutation({
    args: {
        page_id: v.id("generated_pages"),
        url: v.string(),
        request_type: v.string(),
        status: v.union(
            v.literal("success"),
            v.literal("failed"),
            v.literal("pending")
        ),
        response_data: v.optional(v.any()),
        error_message: v.optional(v.string()),
    },
    handler: async (ctx, args) => {
        const logId = await ctx.db.insert("indexing_logs", {
            page_id: args.page_id,
            url: args.url,
            request_type: args.request_type,
            status: args.status,
            response_data: args.response_data,
            error_message: args.error_message,
            created_at: Date.now(),
        });

        return logId;
    },
});
