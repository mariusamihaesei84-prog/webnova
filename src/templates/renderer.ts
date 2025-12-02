import { LandingPage } from '../types/landing-page';
import { RendererConfig } from './types';
import { LayoutTemplate } from './layout';
import { HeroSectionTemplate } from './sections/hero';
import { AIODefinitionTemplate } from './sections/aio-definition';
import { PainAgitationTemplate } from './sections/pain-agitation';
import { ComparisonTableTemplate } from './sections/comparison-table';
import { TechnicalSolutionTemplate } from './sections/technical-solution';
import { FAQTemplate } from './sections/faq';
import { CTATemplate } from './sections/cta';

/**
 * Landing Page Renderer
 *
 * Main renderer class that orchestrates the generation of complete HTML pages.
 * It combines all section templates and SEO optimizations into a production-ready
 * HTML document.
 */
export class LandingPageRenderer {
  private layout: LayoutTemplate;
  private heroTemplate: HeroSectionTemplate;
  private aioTemplate: AIODefinitionTemplate;
  private painTemplate: PainAgitationTemplate;
  private comparisonTemplate: ComparisonTableTemplate;
  private solutionTemplate: TechnicalSolutionTemplate;
  private faqTemplate: FAQTemplate;
  private ctaTemplate: CTATemplate;

  constructor(private config: RendererConfig) {
    this.layout = new LayoutTemplate(config);
    this.heroTemplate = new HeroSectionTemplate();
    this.aioTemplate = new AIODefinitionTemplate();
    this.painTemplate = new PainAgitationTemplate();
    this.comparisonTemplate = new ComparisonTableTemplate();
    this.solutionTemplate = new TechnicalSolutionTemplate();
    this.faqTemplate = new FAQTemplate();
    this.ctaTemplate = new CTATemplate();
  }

  /**
   * Render complete landing page HTML
   */
  render(page: LandingPage): string {
    const bodyContent = this.renderBody(page);
    return this.layout.render(page, bodyContent);
  }

  /**
   * Render main body content with all sections
   */
  private renderBody(page: LandingPage): string {
    const sections: string[] = [];

    // Hero section
    sections.push(this.heroTemplate.render(page.heroSection));

    // AIO Definition
    if (page.aioDefinition) {
      sections.push(this.aioTemplate.render(page.aioDefinition));
    }

    // Pain & Agitation
    if (page.painAgitation) {
      sections.push(this.painTemplate.render(page.painAgitation));
    }

    // Comparison Table
    if (page.comparisonTable) {
      sections.push(this.comparisonTemplate.render(page.comparisonTable));
    }

    // Technical Solution
    if (page.technicalSolution) {
      sections.push(this.solutionTemplate.render(page.technicalSolution));
    }

    // FAQ Section
    if (page.faqSection && page.faqSection.length > 0) {
      sections.push(this.faqTemplate.render(page.faqSection));
    }

    // Call to Action
    if (page.callToAction) {
      sections.push(this.ctaTemplate.render(page.callToAction));
    }

    return sections.join('\n    ');
  }

  /**
   * Render a specific section by name
   */
  renderSection(sectionName: string, data: any): string {
    switch (sectionName) {
      case 'hero':
        return this.heroTemplate.render(data);

      case 'aio-definition':
        return this.aioTemplate.render(data);

      case 'pain-agitation':
        return this.painTemplate.render(data);

      case 'comparison-table':
        return this.comparisonTemplate.render(data);

      case 'technical-solution':
        return this.solutionTemplate.render(data);

      case 'faq':
        return this.faqTemplate.render(data);

      case 'cta':
        return this.ctaTemplate.render(data);

      default:
        throw new Error(`Unknown section: ${sectionName}`);
    }
  }

  /**
   * Generate HTML file name from page slug
   */
  static getFileName(page: LandingPage): string {
    return `${page.slug}.html`;
  }

  /**
   * Validate landing page data before rendering
   */
  validate(page: LandingPage): { valid: boolean; errors: string[] } {
    const errors: string[] = [];

    // Required fields
    if (!page.slug) {
      errors.push('Missing required field: slug');
    }

    if (!page.metaTitle) {
      errors.push('Missing required field: metaTitle');
    }

    if (!page.metaDescription) {
      errors.push('Missing required field: metaDescription');
    }

    if (!page.heroSection || !page.heroSection.h1) {
      errors.push('Missing required field: heroSection.h1');
    }

    // SEO validation
    if (page.metaTitle && page.metaTitle.length > 60) {
      errors.push(`Meta title too long (${page.metaTitle.length} chars, max 60 recommended)`);
    }

    if (page.metaDescription && page.metaDescription.length > 160) {
      errors.push(
        `Meta description too long (${page.metaDescription.length} chars, max 160 recommended)`
      );
    }

    // Content validation
    if (!page.callToAction) {
      errors.push('Missing call-to-action section');
    }

    if (!page.faqSection || page.faqSection.length === 0) {
      errors.push('FAQ section is empty (recommended for SEO)');
    }

    return {
      valid: errors.length === 0,
      errors,
    };
  }
}
