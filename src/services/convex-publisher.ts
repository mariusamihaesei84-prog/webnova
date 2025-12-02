/**
 * Convex Publisher Service
 * Saves generated landing pages directly to Convex database
 */

import { ConvexHttpClient } from 'convex/browser';
import { api } from '../../convex/_generated/api';
import { LandingPage } from '../types/landing-page';

export interface PublishResult {
  success: boolean;
  slug: string;
  url: string;
  error?: string;
}

export class ConvexPublisher {
  private client: ConvexHttpClient;
  private baseUrl: string;

  constructor(convexUrl?: string) {
    const url = convexUrl || process.env.NEXT_PUBLIC_CONVEX_URL || 'https://opulent-elk-138.convex.cloud';
    this.client = new ConvexHttpClient(url);
    this.baseUrl = 'https://webnova.ro';
  }

  /**
   * Transform pipeline LandingPage format to Convex content_json format
   */
  private transformToConvexFormat(landingPage: LandingPage): Record<string, any> {
    return {
      // Theme detection from slug
      theme_type: this.detectThemeType(landingPage.slug),

      // SEO fields
      seo_title: landingPage.metaTitle,
      seo_desc: landingPage.metaDescription,

      // Hero section
      hero_h1: landingPage.heroSection.h1,
      hero_sub: landingPage.heroSection.subheadline,
      hero_cta: landingPage.callToAction.buttonText,

      // Image prompt for AI-generated hero image
      image_prompt: `professional web design agency office, modern laptop showing website for ${landingPage.slug.replace(/-/g, ' ')}, 4k quality`,

      // AIO Summary (from aioDefinition)
      aio_summary: {
        heading: 'De ce ai nevoie de un site profesional?',
        text: landingPage.aioDefinition,
      },

      // Detailed Guide (from painAgitation + technicalSolution)
      detailed_guide: {
        title: 'Cum te ajută Webnova să atragi clienți noi',
        content: `${landingPage.painAgitation}\n\n${landingPage.technicalSolution}`,
      },

      // Pain Points - extract key points from painAgitation
      pain_points: [
        { title: 'Invizibil pe Google?', desc: 'Clienții te caută dar găsesc concurența.', icon: 'search' },
        { title: 'Site vechi sau inexistent?', desc: 'Pierzi credibilitate și clienți zilnic.', icon: 'alert-triangle' },
        { title: 'Fără programări online?', desc: 'Clienții pleacă la cine oferă comoditate.', icon: 'calendar' },
        { title: 'Nu ai date concrete?', desc: 'Fără analiză, nu poți îmbunătăți.', icon: 'bar-chart' },
      ],

      // Comparison Table
      comparison_table: {
        headers: landingPage.comparisonTable.headers,
        rows: landingPage.comparisonTable.rows,
      },

      // FAQ - transform from FAQItem[] to {q, a}[]
      faq: landingPage.faqSection.map(item => ({
        q: item.question,
        a: item.answer,
      })),

      // CTA
      cta: {
        headline: landingPage.callToAction.headline,
        body: landingPage.callToAction.body,
        buttonText: landingPage.callToAction.buttonText,
      },

      // Internal Links
      internal_links: landingPage.internalLinks,

      // Schema Data
      schema_data: landingPage.schemaData,
    };
  }

  /**
   * Detect theme type from slug
   */
  private detectThemeType(slug: string): string {
    const normalized = slug.toLowerCase();

    if (normalized.includes('medical') || normalized.includes('clinic') ||
        normalized.includes('stomatolog') || normalized.includes('doctor') ||
        normalized.includes('veterinar')) {
      return 'medical';
    }

    if (normalized.includes('avocat') || normalized.includes('notar') ||
        normalized.includes('contabil') || normalized.includes('juridic')) {
      return 'legal';
    }

    if (normalized.includes('auto') || normalized.includes('reparatii') ||
        normalized.includes('construct') || normalized.includes('instalat')) {
      return 'industrial';
    }

    if (normalized.includes('salon') || normalized.includes('beauty') ||
        normalized.includes('spa') || normalized.includes('coafor')) {
      return 'beauty';
    }

    return 'medical'; // default
  }

  /**
   * Publish a landing page to Convex
   */
  async publish(landingPage: LandingPage): Promise<PublishResult> {
    try {
      console.log(`[ConvexPublisher] Publishing ${landingPage.slug} to Convex...`);

      const contentJson = this.transformToConvexFormat(landingPage);

      await this.client.mutation(api.pages.saveGeneratedPage, {
        slug: landingPage.slug,
        nicheName: landingPage.slug.replace(/-/g, ' '),
        content: contentJson,
      });

      const url = `${this.baseUrl}/${landingPage.slug}`;

      console.log(`[ConvexPublisher] Successfully published to ${url}`);

      return {
        success: true,
        slug: landingPage.slug,
        url,
      };
    } catch (error) {
      console.error('[ConvexPublisher] Failed to publish:', error);
      return {
        success: false,
        slug: landingPage.slug,
        url: '',
        error: String(error),
      };
    }
  }

  /**
   * Check if a page exists in Convex
   */
  async pageExists(slug: string): Promise<boolean> {
    try {
      const page = await this.client.query(api.pages.getPageBySlug, { slug });
      return page !== null;
    } catch {
      return false;
    }
  }
}
