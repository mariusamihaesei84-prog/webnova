/**
 * Architect Agent Types
 * Strategic reasoning component for content blueprint generation
 */

export interface ArchitectConfig {
  apiKey?: string;  // For AI service
  model?: string;   // AI model to use (claude-3-5-sonnet-20241022, gpt-4, etc.)
  language: 'ro' | 'en';
  mockMode?: boolean;  // Enable mock mode for testing without API
}

export interface NicheInput {
  businessType: string;  // e.g., "cabinet stomatologic", "salon de înfrumusețare"
  painPoint: string;     // Primary pain point to address
  targetAudience: string; // e.g., "proprietari cabinete dentare"
  location?: string;     // Optional location targeting
}

export interface HookAngle {
  statement: string;     // Controversial/engaging opening statement
  emotion: 'fear' | 'curiosity' | 'urgency' | 'aspiration';
  reasoning: string;     // Why this hook works for the niche
}

export interface Objection {
  id: number;
  text: string;          // The objection statement (Romanian)
  category: 'time' | 'money' | 'trust' | 'urgency' | 'knowledge';
  rebuttalStrategy: string; // How to address this objection
}

export interface ContentSection {
  title: string;
  purpose: string;       // Strategic purpose of this section
  keyPoints: string[];   // Main points to cover
  lsiKeywords: string[]; // LSI keywords specific to this section
  tone: 'authoritative' | 'empathetic' | 'urgent' | 'educational';
}

export interface ArchitectBrief {
  niche: NicheInput;

  // Research Output
  lsiKeywords: string[];        // Industry-specific LSI keywords
  competitorInsights: string[]; // Key competitive advantages to highlight

  // Strategic Components
  hookAngle: HookAngle;
  objections: Objection[];      // 5 skeptical objections

  // Content Structure
  contentOutline: ContentSection[];

  // Meta Information
  targetWordCount: number;
  estimatedReadTime: number; // in minutes
  callToAction: string;      // Recommended CTA approach

  // Generation Metadata
  generatedAt: Date;
  version: string;
}

export interface AIGenerationParams {
  prompt: string;
  temperature?: number;
  maxTokens?: number;
  systemPrompt?: string;
}

export interface AIGenerationResponse {
  content: string;
  model: string;
  tokensUsed?: number;
}
