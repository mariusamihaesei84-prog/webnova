/**
 * Writer Agent Types
 * Content execution component for landing page generation
 */

export interface WriterConfig {
  apiKey?: string;
  model?: string;
  language: 'ro' | 'en';
  mockMode?: boolean;
  minWordCount?: number; // Minimum total word count (default: 1500)
  danKennedyStyle?: boolean; // Enable Dan Kennedy direct response style (default: true)
}

export interface SectionGenerationParams {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
}

export interface SectionGenerationResult {
  content: string;
  wordCount: number;
  tokensUsed?: number;
}

export interface WriterMetrics {
  totalWordCount: number;
  sectionWordCounts: Record<string, number>;
  totalTokensUsed: number;
  generationTimeMs: number;
}
