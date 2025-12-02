/**
 * Convex Service
 *
 * Service layer for interacting with Convex database
 * Wraps Convex client and provides typed methods for the pipeline
 */

import { ConvexHttpClient } from "convex/browser";
import { LandingPage } from "../../types/landing-page";
import { generateSlug } from "../../utils/slug";

export interface ConvexServiceConfig {
  convexUrl: string;
}

export interface SavePageInput {
  businessType: string;
  targetAudience: string;
  painPoint: string;
  page: LandingPage;
  htmlContent?: string;
  lsiKeywords?: string[];
}

export interface PageStats {
  total: number;
  draft: number;
  published: number;
  archived: number;
  indexed: number;
  totalClicks: number;
  totalImpressions: number;
}

/**
 * Convex Service for database operations
 *
 * Note: This service requires Convex to be initialized with `npx convex dev`
 * which will generate the API types in convex/_generated/
 */
export class ConvexService {
  private client: ConvexHttpClient;

  constructor(config: ConvexServiceConfig) {
    this.client = new ConvexHttpClient(config.convexUrl);
  }

  /**
   * Save a generated landing page to Convex
   */
  async savePage(input: SavePageInput): Promise<string> {
    const slug = generateSlug(input.businessType);

    // Convert page sections to storage format
    const sections = this.convertSectionsForStorage(input.page);

    // Use dynamic function reference since types may not be generated yet
    const pageId = await this.client.mutation("landingPages:create" as any, {
      slug,
      businessType: input.businessType,
      targetAudience: input.targetAudience,
      painPoint: input.painPoint,
      title: input.page.metaTitle,
      metaDescription: input.page.metaDescription,
      heroHeadline: input.page.heroSection.h1,
      heroSubheadline: input.page.heroSection.subheadline,
      sections,
      lsiKeywords: input.lsiKeywords ?? [],
      htmlContent: input.htmlContent,
      status: "draft",
    });

    return pageId;
  }

  /**
   * Update an existing landing page
   */
  async updatePage(
    pageId: string,
    updates: Partial<SavePageInput>
  ): Promise<void> {
    const updateData: Record<string, unknown> = {};

    if (updates.page) {
      updateData.title = updates.page.metaTitle;
      updateData.metaDescription = updates.page.metaDescription;
      updateData.heroHeadline = updates.page.heroSection.h1;
      updateData.heroSubheadline = updates.page.heroSection.subheadline;
      updateData.sections = this.convertSectionsForStorage(updates.page);
    }

    if (updates.htmlContent) {
      updateData.htmlContent = updates.htmlContent;
    }

    if (updates.lsiKeywords) {
      updateData.lsiKeywords = updates.lsiKeywords;
    }

    await this.client.mutation("landingPages:update" as any, {
      id: pageId,
      ...updateData,
    });
  }

  /**
   * Get page by slug
   */
  async getPageBySlug(slug: string) {
    return await this.client.query("landingPages:getBySlug" as any, { slug });
  }

  /**
   * Get page by ID
   */
  async getPage(id: string) {
    return await this.client.query("landingPages:get" as any, { id });
  }

  /**
   * List all pages
   */
  async listPages(options?: {
    status?: "draft" | "published" | "archived";
    limit?: number;
  }) {
    return await this.client.query("landingPages:list" as any, options ?? {});
  }

  /**
   * Get page statistics
   */
  async getStats(): Promise<PageStats> {
    return await this.client.query("landingPages:getStats" as any, {});
  }

  /**
   * Publish a page
   */
  async publishPage(id: string): Promise<void> {
    await this.client.mutation("landingPages:updateStatus" as any, {
      id,
      status: "published",
    });
  }

  /**
   * Archive a page
   */
  async archivePage(id: string): Promise<void> {
    await this.client.mutation("landingPages:updateStatus" as any, {
      id,
      status: "archived",
    });
  }

  /**
   * Delete a page
   */
  async deletePage(id: string): Promise<void> {
    await this.client.mutation("landingPages:remove" as any, { id });
  }

  /**
   * Update indexing status
   */
  async updateIndexingStatus(id: string, indexed: boolean): Promise<void> {
    await this.client.mutation("landingPages:updateIndexingStatus" as any, {
      id,
      indexingRequested: true,
      indexedAt: indexed ? Date.now() : undefined,
    });
  }

  /**
   * Update page metrics from GSC
   */
  async updateMetrics(
    id: string,
    metrics: {
      clicks: number;
      impressions: number;
      ctr: number;
      avgPosition: number;
    }
  ): Promise<void> {
    await this.client.mutation("landingPages:updateMetrics" as any, {
      id,
      metrics: {
        ...metrics,
        lastUpdated: Date.now(),
      },
    });
  }

  // ============ NICHES ============

  /**
   * List all niches
   */
  async listNiches(options?: { category?: string; activeOnly?: boolean }) {
    return await this.client.query("niches:list" as any, options ?? {});
  }

  /**
   * Add a new niche
   */
  async addNiche(niche: {
    businessType: string;
    painPoint: string;
    targetAudience: string;
    category?: string;
  }) {
    return await this.client.mutation("niches:create" as any, niche);
  }

  /**
   * Bulk import niches
   */
  async importNiches(
    niches: Array<{
      businessType: string;
      painPoint: string;
      targetAudience: string;
      category?: string;
    }>
  ) {
    return await this.client.mutation("niches:bulkImport" as any, { niches });
  }

  // ============ GENERATION JOBS ============

  /**
   * Create a new generation job
   */
  async createJob(
    niches: Array<{
      businessType: string;
      painPoint: string;
      targetAudience: string;
    }>
  ) {
    return await this.client.mutation("generationJobs:create" as any, { niches });
  }

  /**
   * Start a job
   */
  async startJob(id: string): Promise<void> {
    await this.client.mutation("generationJobs:start" as any, { id });
  }

  /**
   * Update job progress
   */
  async updateJobProgress(
    id: string,
    progress: {
      completedPages: number;
      failedPages: number;
      result?: {
        slug: string;
        success: boolean;
        error?: string;
      };
    }
  ): Promise<void> {
    await this.client.mutation("generationJobs:updateProgress" as any, {
      id,
      ...progress,
    });
  }

  /**
   * Complete a job
   */
  async completeJob(id: string): Promise<void> {
    await this.client.mutation("generationJobs:complete" as any, { id });
  }

  /**
   * Get active jobs
   */
  async getActiveJobs() {
    return await this.client.query("generationJobs:getActive" as any, {});
  }

  /**
   * Get job by ID
   */
  async getJob(id: string) {
    return await this.client.query("generationJobs:get" as any, { id });
  }

  // ============ HELPERS ============

  /**
   * Convert LandingPage sections to storage format
   */
  private convertSectionsForStorage(page: LandingPage): Array<{
    type: string;
    content: unknown;
  }> {
    const sections: Array<{ type: string; content: unknown }> = [];

    // Hero section
    sections.push({
      type: "hero",
      content: page.heroSection,
    });

    // AIO Definition
    if (page.aioDefinition) {
      sections.push({
        type: "aioDefinition",
        content: page.aioDefinition,
      });
    }

    // Pain agitation
    if (page.painAgitation) {
      sections.push({
        type: "painAgitation",
        content: page.painAgitation,
      });
    }

    // Comparison table
    if (page.comparisonTable) {
      sections.push({
        type: "comparison",
        content: page.comparisonTable,
      });
    }

    // Technical solution
    if (page.technicalSolution) {
      sections.push({
        type: "technicalSolution",
        content: page.technicalSolution,
      });
    }

    // FAQ section
    if (page.faqSection && page.faqSection.length > 0) {
      sections.push({
        type: "faq",
        content: page.faqSection,
      });
    }

    // CTA section
    if (page.callToAction) {
      sections.push({
        type: "cta",
        content: page.callToAction,
      });
    }

    return sections;
  }
}

/**
 * Mock Convex Service for testing
 */
export class MockConvexService extends ConvexService {
  private mockPages: Map<string, unknown> = new Map();

  constructor() {
    // Use a fake URL for mock
    super({ convexUrl: "https://mock.convex.cloud" });
  }

  async savePage(input: SavePageInput): Promise<string> {
    const slug = generateSlug(input.businessType);
    const id = `mock_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

    this.mockPages.set(id, {
      _id: id,
      slug,
      businessType: input.businessType,
      status: "draft",
      createdAt: Date.now(),
    });

    return id;
  }

  async getPageBySlug(slug: string) {
    for (const page of this.mockPages.values()) {
      if ((page as { slug: string }).slug === slug) {
        return page;
      }
    }
    return null;
  }

  async listPages() {
    return Array.from(this.mockPages.values());
  }

  async getStats(): Promise<PageStats> {
    return {
      total: this.mockPages.size,
      draft: this.mockPages.size,
      published: 0,
      archived: 0,
      indexed: 0,
      totalClicks: 0,
      totalImpressions: 0,
    };
  }
}
