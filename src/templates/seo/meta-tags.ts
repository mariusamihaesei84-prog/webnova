import { LandingPage } from '../../types/landing-page';
import { RendererConfig, MetaTags } from '../types';

/**
 * Generate Meta Tags for Landing Page
 *
 * Creates all necessary meta tags including:
 * - Basic SEO (title, description, keywords)
 * - Open Graph tags for social sharing
 * - Twitter Card tags
 * - Canonical URL
 * - Language and locale settings
 */
export class MetaTagGenerator {
  constructor(private config: RendererConfig) {}

  /**
   * Generate complete meta tags configuration
   */
  generate(page: LandingPage): MetaTags {
    const canonical = `${this.config.baseUrl}/${page.slug}`;
    const ogImage = this.config.defaultOgImage || `${this.config.baseUrl}/images/og-default.jpg`;

    return {
      title: page.metaTitle,
      description: page.metaDescription,
      canonical,
      ogTitle: page.metaTitle,
      ogDescription: page.metaDescription,
      ogImage,
      ogUrl: canonical,
      twitterCard: 'summary_large_image',
      twitterTitle: page.metaTitle,
      twitterDescription: page.metaDescription,
      twitterImage: ogImage,
      locale: 'ro_RO',
      keywords: this.extractKeywords(page),
    };
  }

  /**
   * Render meta tags as HTML string
   */
  render(metaTags: MetaTags): string {
    const tags: string[] = [];

    // Basic SEO tags
    tags.push(`<title>${this.escapeHtml(metaTags.title)}</title>`);
    tags.push(`<meta name="description" content="${this.escapeHtml(metaTags.description)}">`);

    if (metaTags.keywords && metaTags.keywords.length > 0) {
      tags.push(`<meta name="keywords" content="${this.escapeHtml(metaTags.keywords.join(', '))}">`);
    }

    // Canonical URL
    tags.push(`<link rel="canonical" href="${metaTags.canonical}">`);

    // Language and locale
    if (metaTags.locale) {
      tags.push(`<meta property="og:locale" content="${metaTags.locale}">`);
    }

    // Open Graph tags
    tags.push(`<meta property="og:type" content="website">`);
    tags.push(`<meta property="og:title" content="${this.escapeHtml(metaTags.ogTitle || metaTags.title)}">`);
    tags.push(`<meta property="og:description" content="${this.escapeHtml(metaTags.ogDescription || metaTags.description)}">`);

    if (metaTags.ogUrl) {
      tags.push(`<meta property="og:url" content="${metaTags.ogUrl}">`);
    }

    if (metaTags.ogImage) {
      tags.push(`<meta property="og:image" content="${metaTags.ogImage}">`);
      tags.push(`<meta property="og:image:width" content="1200">`);
      tags.push(`<meta property="og:image:height" content="630">`);
    }

    tags.push(`<meta property="og:site_name" content="${this.escapeHtml(this.config.siteName)}">`);

    // Twitter Card tags
    tags.push(`<meta name="twitter:card" content="${metaTags.twitterCard || 'summary_large_image'}">`);
    tags.push(`<meta name="twitter:title" content="${this.escapeHtml(metaTags.twitterTitle || metaTags.title)}">`);
    tags.push(`<meta name="twitter:description" content="${this.escapeHtml(metaTags.twitterDescription || metaTags.description)}">`);

    if (metaTags.twitterImage) {
      tags.push(`<meta name="twitter:image" content="${metaTags.twitterImage}">`);
    }

    if (this.config.social?.twitter) {
      tags.push(`<meta name="twitter:site" content="${this.config.social.twitter}">`);
    }

    // Additional SEO tags
    tags.push(`<meta name="robots" content="index, follow">`);
    tags.push(`<meta name="googlebot" content="index, follow">`);
    tags.push(`<meta name="viewport" content="width=device-width, initial-scale=1.0">`);
    tags.push(`<meta charset="UTF-8">`);

    return tags.join('\n    ');
  }

  /**
   * Extract keywords from landing page content
   */
  private extractKeywords(page: LandingPage): string[] {
    const keywords = new Set<string>();

    // Extract from H1
    const h1Words = page.heroSection.h1.toLowerCase().split(/\s+/);
    h1Words.forEach(word => {
      if (word.length > 4) keywords.add(word);
    });

    // Add business entity type (extracted from slug)
    keywords.add(page.slug.replace(/-/g, ' '));

    // Add "SEO" and related terms
    keywords.add('seo');
    keywords.add('optimizare');
    keywords.add('site web');
    keywords.add('google');

    return Array.from(keywords).slice(0, 10);
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }
}
