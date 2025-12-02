/**
 * Webnova Programmatic SEO Engine
 *
 * A powerful system for generating thousands of high-performance,
 * SEO-optimized landing pages for the Romanian B2B market.
 *
 * Features:
 * - Double-Agent Generation (Architect + Writer)
 * - Dan Kennedy Direct Response Marketing style
 * - Full Technical SEO (Schema.org, meta tags, internal linking)
 * - Google Indexing API integration
 * - Google Search Console feedback loop
 *
 * @example
 * ```typescript
 * import { WebnovaPipeline, NicheInput } from 'webnova';
 *
 * const pipeline = new WebnovaPipeline({
 *   baseUrl: 'https://webnova.ro',
 *   siteName: 'Webnova',
 *   mockMode: false,
 *   aiApiKey: process.env.OPENAI_API_KEY,
 * });
 *
 * const niche: NicheInput = {
 *   businessEntity: 'cabinet stomatologic',
 *   targetAudience: 'Proprietari de cabinete stomatologice',
 *   primaryKeyword: 'site cabinet stomatologic',
 *   secondaryKeywords: ['seo stomatologie', 'web design dentar'],
 *   locale: 'ro-RO',
 * };
 *
 * const result = await pipeline.generatePage(niche);
 * console.log('Generated:', result.url);
 * ```
 */

// Main Pipeline
export { WebnovaPipeline } from './pipeline';
export type {
  PipelineConfig,
  PageGenerationResult,
  BatchGenerationResult,
  PipelineStatus,
  PipelineEvent,
  PipelineEventHandler,
  FeedbackLoopResult,
} from './pipeline/types';

// Types
export type {
  NicheInput,
  ArchitectBrief,
  LandingPage,
  HeroSection,
  FAQItem,
  ComparisonTable,
  CallToAction,
  InternalLink,
  SchemaData,
} from './types';

// Agents
export { ArchitectAgent } from './agents/architect';
export { WriterAgent } from './agents/writer';

// Templates
export {
  LandingPageRenderer,
  MetaTagGenerator,
  SchemaGenerator,
  InternalLinkingSystem,
} from './templates';
export type { RendererConfig, MetaTags } from './templates/types';

// Google Services
export {
  GoogleIndexingAPI,
  MockGoogleIndexingAPI,
  GoogleSearchConsole,
  MockGoogleSearchConsole,
} from './services/google';
export type {
  GoogleCredentials,
  IndexingRequest,
  IndexingResponse,
  BatchIndexingResult,
  GSCQueryParams,
  GSCQueryResponse,
  PagePerformance,
  URLInspectionResult,
  FeedbackAnalysis,
} from './services/google/types';

// Utilities
export { generateSlug } from './utils/slug';

// Version
export const VERSION = '1.0.0';
