/**
 * Architect Agent - Strategic Reasoning Component
 * Phase A of the Double-Agent generation engine
 *
 * Creates content blueprint and strategy before any writing happens
 */

import { AIService } from '../../services/ai-service';
import {
  ArchitectConfig,
  NicheInput,
  ArchitectBrief,
  HookAngle,
  Objection,
  ContentSection,
} from './types';
import {
  SYSTEM_PROMPT,
  generateLSIKeywordsPrompt,
  generateHookAnglePrompt,
  generateObjectionsPrompt,
  generateContentOutlinePrompt,
  generateCompetitorInsightsPrompt,
  generateCallToActionPrompt,
} from './prompts';

export class ArchitectAgent {
  private config: ArchitectConfig;
  private aiService: AIService;

  constructor(config: ArchitectConfig) {
    this.config = config;

    // Initialize AI service based on config (Google Gemini)
    const provider = config.mockMode ? 'mock' : 'gemini';
    this.aiService = new AIService({
      provider,
      apiKey: config.apiKey,
      model: config.model || 'gemini-2.5-flash',
      defaultTemperature: 0.7,
      defaultMaxTokens: 4096,
    });
  }

  /**
   * Main analysis method - generates complete strategic brief
   */
  async analyze(niche: NicheInput): Promise<ArchitectBrief> {
    console.log(`[Architect Agent] Starting analysis for: ${niche.businessType}`);

    try {
      // Step 1: Generate LSI Keywords
      console.log('[Architect Agent] Step 1: Generating LSI keywords...');
      const lsiKeywords = await this.generateLSIKeywords(niche);

      // Step 2: Generate Competitor Insights
      console.log('[Architect Agent] Step 2: Analyzing competitive landscape...');
      const competitorInsights = await this.generateCompetitorInsights(niche);

      // Step 3: Create Hook Angle
      console.log('[Architect Agent] Step 3: Creating hook angle...');
      const hookAngle = await this.generateHookAngle(niche);

      // Step 4: Generate Objections
      console.log('[Architect Agent] Step 4: Generating skeptical objections...');
      const objections = await this.generateObjections(niche);

      // Step 5: Create Content Outline
      console.log('[Architect Agent] Step 5: Structuring content outline...');
      const contentOutline = await this.generateContentOutline(
        niche,
        hookAngle,
        objections,
        lsiKeywords
      );

      // Step 6: Generate Call to Action
      console.log('[Architect Agent] Step 6: Crafting call to action...');
      const callToAction = await this.generateCallToAction(niche);

      // Calculate metadata
      const targetWordCount = this.calculateTargetWordCount(contentOutline);
      const estimatedReadTime = Math.ceil(targetWordCount / 200); // Average reading speed

      const brief: ArchitectBrief = {
        niche,
        lsiKeywords,
        competitorInsights,
        hookAngle,
        objections,
        contentOutline,
        targetWordCount,
        estimatedReadTime,
        callToAction,
        generatedAt: new Date(),
        version: '1.0.0',
      };

      console.log('[Architect Agent] Analysis complete!');
      console.log(`  - LSI Keywords: ${lsiKeywords.length}`);
      console.log(`  - Objections: ${objections.length}`);
      console.log(`  - Content Sections: ${contentOutline.length}`);
      console.log(`  - Target Word Count: ${targetWordCount}`);

      return brief;
    } catch (error) {
      console.error('[Architect Agent] Error during analysis:', error);
      throw new Error(`Architect Agent failed: ${error}`);
    }
  }

  /**
   * Generate industry-specific LSI keywords
   */
  private async generateLSIKeywords(niche: NicheInput): Promise<string[]> {
    const prompt = generateLSIKeywordsPrompt(niche.businessType, niche.painPoint);

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.8,
      maxTokens: 1024,
    });

    const keywords = this.aiService.parseJSON<string[]>(response.content);
    return keywords.slice(0, 20); // Limit to 20 keywords
  }

  /**
   * Analyze competitive landscape
   */
  private async generateCompetitorInsights(niche: NicheInput): Promise<string[]> {
    const prompt = generateCompetitorInsightsPrompt(niche.businessType, niche.painPoint);

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 1024,
    });

    const insights = this.aiService.parseJSON<string[]>(response.content);
    return insights.slice(0, 7); // Limit to 7 insights
  }

  /**
   * Create controversial/engaging hook angle
   */
  private async generateHookAngle(niche: NicheInput): Promise<HookAngle> {
    const prompt = generateHookAnglePrompt(
      niche.businessType,
      niche.painPoint,
      niche.targetAudience
    );

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.8,
      maxTokens: 512,
    });

    return this.aiService.parseJSON<HookAngle>(response.content);
  }

  /**
   * Generate 5 skeptical objections
   */
  private async generateObjections(niche: NicheInput): Promise<Objection[]> {
    const prompt = generateObjectionsPrompt(
      niche.businessType,
      niche.businessType,
      niche.targetAudience
    );

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 2048,
    });

    const objections = this.aiService.parseJSON<Objection[]>(response.content);
    return objections.slice(0, 5); // Ensure exactly 5 objections
  }

  /**
   * Create content outline with section-specific notes
   */
  private async generateContentOutline(
    niche: NicheInput,
    hookAngle: HookAngle,
    objections: Objection[],
    lsiKeywords: string[]
  ): Promise<ContentSection[]> {
    const prompt = generateContentOutlinePrompt(
      niche.businessType,
      niche.businessType,
      hookAngle.statement,
      objections.map((o) => o.text),
      lsiKeywords
    );

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.6,
      maxTokens: 3072,
    });

    return this.aiService.parseJSON<ContentSection[]>(response.content);
  }

  /**
   * Generate call to action recommendation
   */
  private async generateCallToAction(niche: NicheInput): Promise<string> {
    const prompt = generateCallToActionPrompt(niche.businessType, niche.painPoint);

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: SYSTEM_PROMPT,
      temperature: 0.7,
      maxTokens: 256,
    });

    return response.content.trim();
  }

  /**
   * Calculate target word count based on outline
   */
  private calculateTargetWordCount(outline: ContentSection[]): number {
    // Base calculation: ~300-400 words per section
    const baseWordsPerSection = 350;
    const sectionCount = outline.length;

    // Add buffer for intro and conclusion
    const introWords = 200;
    const conclusionWords = 150;

    return introWords + sectionCount * baseWordsPerSection + conclusionWords;
  }

  /**
   * Test AI service connection
   */
  async testConnection(): Promise<boolean> {
    return this.aiService.testConnection();
  }

  /**
   * Export brief as JSON
   */
  exportBrief(brief: ArchitectBrief): string {
    return JSON.stringify(brief, null, 2);
  }

  /**
   * Import brief from JSON
   */
  importBrief(json: string): ArchitectBrief {
    const brief = JSON.parse(json) as ArchitectBrief;
    // Convert date string back to Date object
    brief.generatedAt = new Date(brief.generatedAt);
    return brief;
  }
}

// Export types for external use
export * from './types';
