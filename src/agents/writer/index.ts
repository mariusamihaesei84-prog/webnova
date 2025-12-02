/**
 * Writer Agent - Content Execution Component
 * Phase B of the Double-Agent generation engine
 *
 * Takes ArchitectBrief and writes persuasive Romanian landing page content
 */

import { AIService } from '../../services/ai-service';
import { ArchitectBrief } from '../../types/architect-brief';
import { LandingPage, SchemaData, InternalLink } from '../../types/landing-page';
import { WriterConfig, WriterMetrics } from './types';
import {
  WRITER_SYSTEM_PROMPT,
  generateMetaTagsPrompt,
  generateSchemaPrompt,
  generateInternalLinksPrompt,
} from './prompts';

// Section generators
import { generateHeroSection } from './sections/hero';
import { generateAIODefinition } from './sections/aio-definition';
import { generatePainAgitation } from './sections/pain-agitation';
import { generateComparisonTable } from './sections/comparison-table';
import { generateTechnicalSolution } from './sections/technical-solution';
import { generateFAQSection } from './sections/faq';
import { generateCTA } from './sections/cta';

export class WriterAgent {
  private config: WriterConfig;
  private aiService: AIService;

  constructor(config: WriterConfig) {
    this.config = {
      minWordCount: 1500,
      danKennedyStyle: true,
      ...config,
    };

    // Initialize AI service
    const provider = config.mockMode ? 'mock' : 'anthropic';
    this.aiService = new AIService({
      provider,
      apiKey: config.apiKey,
      model: config.model || 'claude-3-5-sonnet-20241022',
      defaultTemperature: 0.7,
      defaultMaxTokens: 4096,
    });
  }

  /**
   * Main write method - generates complete landing page from architect brief
   */
  async write(brief: ArchitectBrief): Promise<LandingPage> {
    console.log(`[Writer Agent] Starting content generation for: ${brief.niche.businessEntity}`);
    const startTime = Date.now();

    try {
      // Step 1: Generate Meta Tags
      console.log('[Writer Agent] Step 1/9: Generating meta tags...');
      const metaTags = await this.generateMetaTags(brief);

      // Step 2: Generate Hero Section
      console.log('[Writer Agent] Step 2/9: Generating hero section...');
      const heroSection = await generateHeroSection(brief, this.aiService);

      // Step 3: Generate AIO Definition
      console.log('[Writer Agent] Step 3/9: Generating AIO definition...');
      const aioDefinition = await generateAIODefinition(brief, this.aiService);

      // Step 4: Generate Pain Agitation
      console.log('[Writer Agent] Step 4/9: Generating pain agitation...');
      const painAgitation = await generatePainAgitation(brief, this.aiService);

      // Step 5: Generate Comparison Table
      console.log('[Writer Agent] Step 5/9: Generating comparison table...');
      const comparisonTable = await generateComparisonTable(brief, this.aiService);

      // Step 6: Generate Technical Solution
      console.log('[Writer Agent] Step 6/9: Generating technical solution...');
      const technicalSolution = await generateTechnicalSolution(brief, this.aiService);

      // Step 7: Generate FAQ Section
      console.log('[Writer Agent] Step 7/9: Generating FAQ section...');
      const faqSection = await generateFAQSection(brief, this.aiService);

      // Step 8: Generate Call to Action
      console.log('[Writer Agent] Step 8/9: Generating call to action...');
      const callToAction = await generateCTA(brief, this.aiService);

      // Step 9: Generate Schema Data
      console.log('[Writer Agent] Step 9/9: Generating schema data...');
      const schemaData = await this.generateSchemaData(
        brief,
        faqSection.map((item) => ({ question: item.question, answer: item.answer }))
      );

      // Generate Internal Links
      const internalLinks = await this.generateInternalLinks(brief);

      // Assemble complete landing page
      const landingPage: LandingPage = {
        slug: brief.niche.businessEntitySlug,
        metaTitle: metaTags.metaTitle,
        metaDescription: metaTags.metaDescription,
        heroSection,
        aioDefinition,
        painAgitation,
        comparisonTable,
        technicalSolution,
        faqSection,
        callToAction,
        schemaData,
        internalLinks,
      };

      // Calculate metrics
      const metrics = this.calculateMetrics(landingPage, startTime);

      console.log('[Writer Agent] Content generation complete!');
      console.log('='.repeat(50));
      console.log('GENERATION METRICS:');
      console.log(`  - Total Word Count: ${metrics.totalWordCount} words`);
      console.log(`  - Min Required: ${this.config.minWordCount} words`);
      console.log(
        `  - Status: ${metrics.totalWordCount >= this.config.minWordCount! ? 'PASS' : 'FAIL'}`
      );
      console.log(`  - Generation Time: ${metrics.generationTimeMs}ms`);
      console.log(`  - Total Tokens Used: ${metrics.totalTokensUsed}`);
      console.log('\nSECTION WORD COUNTS:');
      Object.entries(metrics.sectionWordCounts).forEach(([section, count]) => {
        console.log(`  - ${section}: ${count} words`);
      });
      console.log('='.repeat(50));

      // Validation
      if (metrics.totalWordCount < this.config.minWordCount!) {
        console.warn(
          `[Writer Agent] WARNING: Total word count (${metrics.totalWordCount}) is below minimum (${this.config.minWordCount})`
        );
      }

      return landingPage;
    } catch (error) {
      console.error('[Writer Agent] Error during content generation:', error);
      throw new Error(`Writer Agent failed: ${error}`);
    }
  }

  /**
   * Generate SEO meta tags
   */
  private async generateMetaTags(
    brief: ArchitectBrief
  ): Promise<{ metaTitle: string; metaDescription: string }> {
    const primaryKeyword = `web design ${brief.niche.businessEntity}`;

    const prompt = generateMetaTagsPrompt(
      brief.niche.businessEntity,
      primaryKeyword,
      brief.niche.primaryPainPoint
    );

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: WRITER_SYSTEM_PROMPT,
      temperature: 0.6,
      maxTokens: 256,
    });

    const metaTags = this.aiService.parseJSON<{
      metaTitle: string;
      metaDescription: string;
    }>(response.content);

    // Validation
    if (metaTags.metaTitle.length > 60) {
      console.warn(
        `[Writer/Meta] Title too long (${metaTags.metaTitle.length} chars), trimming...`
      );
      metaTags.metaTitle = metaTags.metaTitle.substring(0, 57) + '...';
    }

    if (metaTags.metaDescription.length > 160) {
      console.warn(
        `[Writer/Meta] Description too long (${metaTags.metaDescription.length} chars), trimming...`
      );
      metaTags.metaDescription = metaTags.metaDescription.substring(0, 157) + '...';
    }

    console.log(`[Writer/Meta] Meta tags generated`);
    console.log(`  - Title: "${metaTags.metaTitle}" (${metaTags.metaTitle.length} chars)`);
    console.log(
      `  - Description: "${metaTags.metaDescription}" (${metaTags.metaDescription.length} chars)`
    );

    return metaTags;
  }

  /**
   * Generate Schema.org structured data
   */
  private async generateSchemaData(
    brief: ArchitectBrief,
    faqItems: Array<{ question: string; answer: string }>
  ): Promise<SchemaData> {
    const prompt = generateSchemaPrompt(
      brief.niche.businessEntity,
      brief.niche.businessEntitySlug,
      faqItems
    );

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: WRITER_SYSTEM_PROMPT,
      temperature: 0.3, // Lower temperature for structured data
      maxTokens: 2048,
    });

    const schemaData = this.aiService.parseJSON<SchemaData>(response.content);

    console.log('[Writer/Schema] Schema data generated');
    console.log(`  - Product schema: ${schemaData.product['@type']}`);
    console.log(`  - FAQ schema: ${schemaData.faq.mainEntity.length} items`);
    console.log(`  - Breadcrumb schema: ${schemaData.breadcrumb.itemListElement.length} items`);

    return schemaData;
  }

  /**
   * Generate internal links to related niches
   */
  private async generateInternalLinks(brief: ArchitectBrief): Promise<InternalLink[]> {
    const relatedNiches = brief.niche.relatedNiches || [];

    if (relatedNiches.length === 0) {
      console.log('[Writer/Links] No related niches provided, skipping internal links');
      return [];
    }

    const prompt = generateInternalLinksPrompt(brief.niche.businessEntity, relatedNiches);

    const response = await this.aiService.generate({
      prompt,
      systemPrompt: WRITER_SYSTEM_PROMPT,
      temperature: 0.6,
      maxTokens: 512,
    });

    const linksData = this.aiService.parseJSON<{ internalLinks: InternalLink[] }>(
      response.content
    );

    console.log('[Writer/Links] Internal links generated');
    console.log(`  - Links count: ${linksData.internalLinks.length}`);

    return linksData.internalLinks;
  }

  /**
   * Calculate content metrics and word counts
   */
  private calculateMetrics(landingPage: LandingPage, startTime: number): WriterMetrics {
    const countWords = (text: string): number => {
      return text.split(/\s+/).filter((word) => word.length > 0).length;
    };

    const sectionWordCounts = {
      metaTitle: countWords(landingPage.metaTitle),
      metaDescription: countWords(landingPage.metaDescription),
      heroH1: countWords(landingPage.heroSection.h1),
      heroSubheadline: countWords(landingPage.heroSection.subheadline),
      aioDefinition: countWords(landingPage.aioDefinition),
      painAgitation: countWords(landingPage.painAgitation),
      comparisonTable: landingPage.comparisonTable.rows.reduce(
        (sum, row) => sum + row.join(' ').split(/\s+/).length,
        0
      ),
      technicalSolution: countWords(landingPage.technicalSolution),
      faqSection: landingPage.faqSection.reduce(
        (sum, item) => sum + countWords(item.question) + countWords(item.answer),
        0
      ),
      ctaHeadline: countWords(landingPage.callToAction.headline),
      ctaBody: countWords(landingPage.callToAction.body),
      ctaButton: countWords(landingPage.callToAction.buttonText),
    };

    const totalWordCount = Object.values(sectionWordCounts).reduce((sum, count) => sum + count, 0);

    return {
      totalWordCount,
      sectionWordCounts,
      totalTokensUsed: 0, // TODO: Track actual token usage from AI service
      generationTimeMs: Date.now() - startTime,
    };
  }

  /**
   * Test AI service connection
   */
  async testConnection(): Promise<boolean> {
    return this.aiService.testConnection();
  }

  /**
   * Export landing page as JSON
   */
  exportLandingPage(landingPage: LandingPage): string {
    return JSON.stringify(landingPage, null, 2);
  }

  /**
   * Import landing page from JSON
   */
  importLandingPage(json: string): LandingPage {
    return JSON.parse(json) as LandingPage;
  }
}

// Export types for external use
export * from './types';
