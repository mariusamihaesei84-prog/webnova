/**
 * Webnova SEO Pipeline
 *
 * Main orchestration pipeline that coordinates:
 * 1. Architect Agent - Strategy & content planning
 * 2. Writer Agent - Content generation
 * 3. Template Renderer - HTML generation
 * 4. Google Indexing API - Forced indexing
 * 5. Google Search Console - Feedback loop
 *
 * Usage:
 *   const pipeline = new WebnovaPipeline(config);
 *   const result = await pipeline.generatePages(niches);
 */

import * as fs from 'fs';
import * as path from 'path';
import { NicheInput } from '../agents/architect/types';
import { ArchitectBrief } from '../agents/architect/types';
import { LandingPage } from '../types/landing-page';
import { ArchitectBrief as WriterBrief } from '../types/architect-brief';
import { NicheInput as WriterNiche } from '../types/niche';
import { ArchitectAgent } from '../agents/architect';
import { WriterAgent } from '../agents/writer';
import { LandingPageRenderer, RendererConfig } from '../templates';
import { GoogleIndexingAPI, MockGoogleIndexingAPI } from '../services/google/indexing-api';
import { GoogleSearchConsole, MockGoogleSearchConsole } from '../services/google/search-console';
import { ConvexService, MockConvexService } from '../services/convex';
import { generateSlug } from '../utils/slug';
import {
  PipelineConfig,
  DEFAULT_PIPELINE_CONFIG,
  PageGenerationResult,
  BatchGenerationResult,
  PipelineStatus,
  PipelineEvent,
  PipelineEventHandler,
  FeedbackLoopResult,
} from './types';

export class WebnovaPipeline {
  private config: PipelineConfig;
  private architectAgent!: ArchitectAgent;
  private writerAgent!: WriterAgent;
  private renderer!: LandingPageRenderer;
  private indexingApi!: GoogleIndexingAPI;
  private searchConsole!: GoogleSearchConsole;
  private convexService?: ConvexService;
  private status: PipelineStatus;
  private eventHandlers: PipelineEventHandler[] = [];

  constructor(config: Partial<PipelineConfig> = {}) {
    this.config = { ...DEFAULT_PIPELINE_CONFIG, ...config };
    this.status = this.createInitialStatus();

    // Initialize components
    this.initializeComponents();
  }

  /**
   * Initialize all pipeline components
   */
  private initializeComponents(): void {
    // Initialize AI agents
    this.architectAgent = new ArchitectAgent({
      apiKey: this.config.aiApiKey,
      model: this.config.aiModel,
      mockMode: this.config.mockMode,
      language: 'ro',
    });

    this.writerAgent = new WriterAgent({
      apiKey: this.config.aiApiKey,
      model: this.config.aiModel,
      mockMode: this.config.mockMode,
      language: 'ro',
    });

    // Initialize template renderer
    const rendererConfig: RendererConfig = {
      baseUrl: this.config.baseUrl,
      siteName: this.config.siteName,
      contact: this.config.contact,
      social: this.config.social,
    };
    this.renderer = new LandingPageRenderer(rendererConfig);

    // Initialize Google APIs
    if (this.config.mockMode) {
      this.indexingApi = new MockGoogleIndexingAPI();
      this.searchConsole = new GoogleSearchConsole(this.config.baseUrl); // Use base class even in mock
    } else {
      this.indexingApi = new GoogleIndexingAPI();
      this.searchConsole = new GoogleSearchConsole(this.config.baseUrl);

      if (this.config.googleCredentials) {
        this.indexingApi.setCredentials(this.config.googleCredentials);
        this.searchConsole.setCredentials(this.config.googleCredentials);
      }
    }

    // Ensure output directory exists
    if (!fs.existsSync(this.config.outputDir)) {
      fs.mkdirSync(this.config.outputDir, { recursive: true });
    }

    // Initialize Convex service if enabled
    if (this.config.enableConvex) {
      if (this.config.mockMode) {
        this.convexService = new MockConvexService();
      } else if (this.config.convexUrl) {
        this.convexService = new ConvexService({ convexUrl: this.config.convexUrl });
      }
    }
  }

  /**
   * Create initial status object
   */
  private createInitialStatus(): PipelineStatus {
    return {
      phase: 'idle',
      progress: { current: 0, total: 0, percentage: 0 },
    };
  }

  /**
   * Register event handler
   */
  onEvent(handler: PipelineEventHandler): void {
    this.eventHandlers.push(handler);
  }

  /**
   * Emit event to all handlers
   */
  private emit(event: PipelineEvent): void {
    for (const handler of this.eventHandlers) {
      try {
        handler(event);
      } catch (e) {
        console.error('Event handler error:', e);
      }
    }
  }

  /**
   * Get current pipeline status
   */
  getStatus(): PipelineStatus {
    return { ...this.status };
  }

  /**
   * Generate a single landing page
   */
  async generatePage(niche: NicheInput): Promise<PageGenerationResult> {
    const startTime = Date.now();
    const slug = generateSlug(niche.businessType);
    const timing = { architectMs: 0, writerMs: 0, renderMs: 0, totalMs: 0 };

    try {
      // Phase A: Architect Agent
      this.status.phase = 'architect';
      const architectStart = Date.now();
      const brief = await this.architectAgent.analyze(niche);
      timing.architectMs = Date.now() - architectStart;
      this.emit({ type: 'architect_complete', niche, brief });

      // Phase B: Writer Agent
      this.status.phase = 'writer';
      const writerStart = Date.now();
      // Convert architect brief to writer-expected format
      const writerBrief = this.convertBriefForWriter(brief, slug);
      const page = await this.writerAgent.write(writerBrief);
      timing.writerMs = Date.now() - writerStart;
      this.emit({ type: 'writer_complete', niche, page });

      // Phase C: Render HTML
      this.status.phase = 'render';
      const renderStart = Date.now();
      const html = this.renderer.render(page);
      timing.renderMs = Date.now() - renderStart;

      // Write to file
      const outputPath = path.join(this.config.outputDir, `${slug}.html`);
      fs.writeFileSync(outputPath, html, 'utf-8');
      this.emit({ type: 'render_complete', niche, outputPath });

      // Save to Convex if enabled
      let convexPageId: string | undefined;
      if (this.convexService) {
        try {
          convexPageId = await this.convexService.savePage({
            businessType: niche.businessType,
            targetAudience: niche.targetAudience,
            painPoint: niche.painPoint,
            page,
            htmlContent: html,
            lsiKeywords: brief.lsiKeywords,
          });
        } catch (e) {
          console.error('Failed to save to Convex:', e);
        }
      }

      timing.totalMs = Date.now() - startTime;

      const result: PageGenerationResult = {
        success: true,
        niche,
        slug,
        outputPath,
        url: `${this.config.baseUrl}/${slug}`,
        brief,
        page,
        convexPageId,
        timing,
      };

      this.emit({ type: 'niche_complete', result });
      return result;

    } catch (error) {
      timing.totalMs = Date.now() - startTime;
      const errorMessage = error instanceof Error ? error.message : String(error);

      this.emit({ type: 'niche_error', niche, error: errorMessage });

      return {
        success: false,
        niche,
        slug,
        error: errorMessage,
        timing,
      };
    }
  }

  /**
   * Generate multiple landing pages in batch
   */
  async generatePages(niches: NicheInput[]): Promise<BatchGenerationResult> {
    const startTime = Date.now();
    const results: PageGenerationResult[] = [];

    this.status = {
      phase: 'idle',
      progress: { current: 0, total: niches.length, percentage: 0 },
    };

    this.emit({ type: 'start', totalNiches: niches.length });

    for (let i = 0; i < niches.length; i++) {
      const niche = niches[i];
      this.status.currentNiche = niche.businessType;
      this.status.progress.current = i + 1;
      this.status.progress.percentage = ((i + 1) / niches.length) * 100;

      this.emit({ type: 'niche_start', niche, index: i });

      const result = await this.generatePage(niche);
      results.push(result);

      // Delay between pages (to avoid rate limits)
      if (i < niches.length - 1 && this.config.delayBetweenPages > 0) {
        await this.delay(this.config.delayBetweenPages);
      }
    }

    const successful = results.filter(r => r.success).length;
    const totalMs = Date.now() - startTime;

    const batchResult: BatchGenerationResult = {
      totalPages: niches.length,
      successful,
      failed: niches.length - successful,
      results,
      timing: {
        totalMs,
        avgPerPage: totalMs / niches.length,
      },
    };

    // Optional: Request indexing for successful pages
    if (this.config.enableIndexing && successful > 0) {
      const urls = results
        .filter(r => r.success && r.url)
        .map(r => r.url!);

      batchResult.indexingResult = await this.requestIndexing(urls);
    }

    this.status.phase = 'complete';
    this.emit({ type: 'complete', result: batchResult });

    return batchResult;
  }

  /**
   * Request Google indexing for URLs
   */
  async requestIndexing(urls: string[]): Promise<import('../services/google/types').BatchIndexingResult> {
    this.status.phase = 'indexing';
    this.emit({ type: 'indexing_start', urls });

    const result = await this.indexingApi.batchIndex(urls, {
      delayMs: 100,
      onProgress: (completed, total) => {
        this.status.progress = {
          current: completed,
          total,
          percentage: (completed / total) * 100,
        };
      },
    });

    this.emit({ type: 'indexing_complete', result });
    return result;
  }

  /**
   * Run feedback loop analysis on generated pages
   */
  async runFeedbackLoop(urls: string[]): Promise<FeedbackLoopResult> {
    this.status.phase = 'feedback';
    this.emit({ type: 'feedback_start', urls });

    const analyses = await this.searchConsole.analyzePages(urls);

    const summary = {
      healthy: analyses.filter(a => a.status === 'healthy').length,
      needsAttention: analyses.filter(a => a.status === 'needs_attention').length,
      underperforming: analyses.filter(a => a.status === 'underperforming').length,
      notIndexed: analyses.filter(a => a.status === 'not_indexed').length,
    };

    // Collect unique recommendations
    const allRecommendations = new Set<string>();
    for (const analysis of analyses) {
      for (const rec of analysis.recommendations) {
        allRecommendations.add(rec);
      }
    }

    const result: FeedbackLoopResult = {
      pagesAnalyzed: urls.length,
      analyses,
      summary,
      recommendations: Array.from(allRecommendations),
    };

    this.emit({ type: 'feedback_complete', result });
    return result;
  }

  /**
   * Get list of generated pages
   */
  getGeneratedPages(): string[] {
    const files = fs.readdirSync(this.config.outputDir);
    return files
      .filter(f => f.endsWith('.html'))
      .map(f => path.join(this.config.outputDir, f));
  }

  /**
   * Convert architect brief to writer-expected format
   */
  private convertBriefForWriter(brief: ArchitectBrief, slug: string): WriterBrief {
    const writerNiche: WriterNiche = {
      professionalSingular: brief.niche.businessType,
      professionalPlural: brief.niche.businessType + 's',
      businessEntity: brief.niche.businessType,
      businessEntitySlug: slug,
      endClient: brief.niche.targetAudience,
      primaryPainPoint: brief.niche.painPoint,
      technicalBenefit: 'Site web profesional optimizat SEO',
      relatedNiches: [],
    };

    return {
      niche: writerNiche,
      lsiKeywords: brief.lsiKeywords,
      hookAngle: brief.hookAngle.statement,
      skepticalObjections: brief.objections.map(o => o.text),
      contentOutline: {
        hero: brief.contentOutline[0]?.purpose || 'Hero section strategy',
        aioStrategy: 'AI Overview optimization',
        painAgitation: brief.contentOutline[1]?.purpose || 'Pain agitation approach',
        comparisonTable: 'Before/after comparison',
        technicalSolution: brief.contentOutline[2]?.purpose || 'Technical solution',
        faq: 'Address common questions',
        cta: brief.callToAction,
      },
      generatedAt: brief.generatedAt,
    };
  }

  /**
   * Delay helper
   */
  private delay(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Re-export types
export * from './types';
