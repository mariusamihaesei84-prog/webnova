/**
 * Pipeline Types
 *
 * Configuration and result types for the main orchestration pipeline
 */

import { NicheInput, ArchitectBrief } from '../agents/architect/types';
import { LandingPage } from '../types/landing-page';
import { FeedbackAnalysis, BatchIndexingResult } from '../services/google/types';

/**
 * Pipeline configuration
 */
export interface PipelineConfig {
  // Base configuration
  baseUrl: string;
  siteName: string;
  outputDir: string;

  // AI configuration (Google Gemini)
  aiProvider: 'gemini' | 'mock';
  aiModel?: string;
  aiApiKey?: string;

  // Google APIs
  googleCredentials?: string;
  enableIndexing: boolean;
  enableGSCFeedback: boolean;

  // Convex database
  convexUrl?: string;
  enableConvex: boolean;

  // Processing options
  batchSize: number;
  delayBetweenPages: number;
  mockMode: boolean;

  // Contact info (for Schema.org)
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };

  // Social (for meta tags)
  social?: {
    twitter?: string;
    facebook?: string;
  };
}

/**
 * Default pipeline configuration
 */
export const DEFAULT_PIPELINE_CONFIG: PipelineConfig = {
  baseUrl: 'https://webnova.ro',
  siteName: 'Webnova',
  outputDir: './output',
  aiProvider: 'mock',
  enableIndexing: false,
  enableGSCFeedback: false,
  enableConvex: false,
  batchSize: 10,
  delayBetweenPages: 1000,
  mockMode: true,
};

/**
 * Single page generation result
 */
export interface PageGenerationResult {
  success: boolean;
  niche: NicheInput;
  slug: string;
  outputPath?: string;
  url?: string;
  brief?: ArchitectBrief;
  page?: LandingPage;
  convexPageId?: string;
  error?: string;
  timing: {
    architectMs: number;
    writerMs: number;
    renderMs: number;
    totalMs: number;
  };
}

/**
 * Batch generation result
 */
export interface BatchGenerationResult {
  totalPages: number;
  successful: number;
  failed: number;
  results: PageGenerationResult[];
  timing: {
    totalMs: number;
    avgPerPage: number;
  };
  indexingResult?: BatchIndexingResult;
}

/**
 * Pipeline status for monitoring
 */
export interface PipelineStatus {
  phase: 'idle' | 'architect' | 'writer' | 'render' | 'indexing' | 'feedback' | 'complete' | 'error';
  currentNiche?: string;
  progress: {
    current: number;
    total: number;
    percentage: number;
  };
  lastError?: string;
}

/**
 * Feedback loop result
 */
export interface FeedbackLoopResult {
  pagesAnalyzed: number;
  analyses: FeedbackAnalysis[];
  summary: {
    healthy: number;
    needsAttention: number;
    underperforming: number;
    notIndexed: number;
  };
  recommendations: string[];
}

/**
 * Event types for pipeline progress
 */
export type PipelineEvent =
  | { type: 'start'; totalNiches: number }
  | { type: 'niche_start'; niche: NicheInput; index: number }
  | { type: 'architect_complete'; niche: NicheInput; brief: ArchitectBrief }
  | { type: 'writer_complete'; niche: NicheInput; page: LandingPage }
  | { type: 'render_complete'; niche: NicheInput; outputPath: string }
  | { type: 'niche_complete'; result: PageGenerationResult }
  | { type: 'niche_error'; niche: NicheInput; error: string }
  | { type: 'indexing_start'; urls: string[] }
  | { type: 'indexing_complete'; result: BatchIndexingResult }
  | { type: 'feedback_start'; urls: string[] }
  | { type: 'feedback_complete'; result: FeedbackLoopResult }
  | { type: 'complete'; result: BatchGenerationResult };

/**
 * Pipeline event handler
 */
export type PipelineEventHandler = (event: PipelineEvent) => void;
