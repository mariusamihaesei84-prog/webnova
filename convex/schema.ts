import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

/**
 * WebNova.ro Database Schema
 *
 * Tables:
 * 1. niches - Catalog of target industries
 * 2. generated_pages - AI-generated landing pages for each niche
 * 3. indexing_logs - Google Indexing API logs
 * 4. generation_jobs - Batch generation job tracking (CLI pipeline)
 */

export default defineSchema({
  // Catalog of target niches (e.g., Dentists, Lawyers, etc.)
  niches: defineTable({
    name: v.string(), // e.g., "Medic Stomatolog"
    slug: v.string(), // e.g., "medic-stomatolog" (URL-friendly)
    pain_points_cache: v.array(v.string()), // Cached pain points to avoid regeneration
    created_at: v.number(),
  })
    .index("by_slug", ["slug"]), // Fast lookup by slug

  // AI-generated landing pages
  generated_pages: defineTable({
    niche_id: v.optional(v.id("niches")), // Optional reference to niche
    slug: v.string(), // e.g., "solutii/site-pentru-dentisti"
    title: v.string(), // H1 title for SEO
    meta_description: v.string(), // Meta description for SEO
    content_json: v.any(), // Complex JSON structure with all page content
    status: v.union(
      v.literal("published"),
      v.literal("draft")
    ),
    indexing_status: v.union(
      v.literal("pending"),
      v.literal("submitted"),
      v.literal("indexed")
    ),
    aio_score: v.number(), // AI Optimization score (0-100)
    created_at: v.number(),
    updated_at: v.number(),
    indexed_at: v.optional(v.number()), // When Google indexed the page
  })
    .index("by_slug", ["slug"]) // Fast lookup by slug
    .index("by_niche", ["niche_id"]) // Fast lookup by niche
    .index("by_status", ["status"]) // Fast lookup by publish status
    .index("by_indexing_status", ["indexing_status"]), // For cron job processing

  // Google Indexing API logs
  indexing_logs: defineTable({
    page_id: v.id("generated_pages"), // Reference to the page being indexed
    url: v.string(), // Full URL submitted to Google
    request_type: v.string(), // "URL_UPDATED" or "URL_DELETED"
    status: v.union(
      v.literal("success"),
      v.literal("failed"),
      v.literal("pending")
    ),
    response_data: v.optional(v.any()), // API response from Google
    error_message: v.optional(v.string()),
    created_at: v.number(),
  })
    .index("by_page", ["page_id"])
    .index("by_status", ["status"]),

  // Batch generation jobs (for CLI pipeline)
  generation_jobs: defineTable({
    status: v.union(
      v.literal("pending"),
      v.literal("in_progress"),
      v.literal("completed"),
      v.literal("failed")
    ),
    total_pages: v.number(),
    completed_pages: v.number(),
    failed_pages: v.number(),
    niches_data: v.array(v.object({
      businessType: v.string(),
      painPoint: v.string(),
      targetAudience: v.string(),
    })),
    results: v.optional(v.array(v.object({
      slug: v.string(),
      success: v.boolean(),
      error: v.optional(v.string()),
    }))),
    started_at: v.optional(v.number()),
    completed_at: v.optional(v.number()),
    created_at: v.number(),
  })
    .index("by_status", ["status"]),
});
