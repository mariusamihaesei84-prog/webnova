import { LandingPage, SchemaData } from '../../types/landing-page';
import { RendererConfig } from '../types';

/**
 * Schema.org Structured Data Generator
 *
 * Generates JSON-LD structured data for:
 * - Product/Service schema
 * - FAQ schema
 * - Breadcrumb schema
 * - WebPage schema
 * - LocalBusiness schema (optional)
 */
export class SchemaGenerator {
  constructor(private config: RendererConfig) {}

  /**
   * Generate all schemas and render as JSON-LD script tag
   */
  render(page: LandingPage): string {
    const schemas = this.generateAllSchemas(page);

    // Combine all schemas into a single JSON-LD block
    const jsonLd = JSON.stringify(schemas, null, 2);

    return `<script type="application/ld+json">
${jsonLd}
</script>`;
  }

  /**
   * Generate all schemas for the page
   */
  private generateAllSchemas(page: LandingPage): any[] {
    const schemas: any[] = [];

    // Product/Service Schema
    schemas.push(this.generateProductSchema(page));

    // FAQ Schema
    if (page.faqSection && page.faqSection.length > 0) {
      schemas.push(this.generateFAQSchema(page));
    }

    // Breadcrumb Schema
    schemas.push(this.generateBreadcrumbSchema(page));

    // WebPage Schema
    schemas.push(this.generateWebPageSchema(page));

    // LocalBusiness Schema (if contact info is provided)
    if (this.config.contact) {
      schemas.push(this.generateLocalBusinessSchema(page));
    }

    return schemas;
  }

  /**
   * Generate Product/Service Schema
   */
  private generateProductSchema(page: LandingPage): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.heroSection.h1,
      description: page.metaDescription,
      provider: {
        '@type': 'Organization',
        name: this.config.siteName,
        url: this.config.baseUrl,
      },
      areaServed: {
        '@type': 'Country',
        name: 'România',
      },
      serviceType: 'SEO și Optimizare Web',
      offers: {
        '@type': 'Offer',
        availability: 'https://schema.org/InStock',
        price: '0',
        priceCurrency: 'RON',
        description: 'Consultație gratuită pentru optimizare SEO',
      },
      url: `${this.config.baseUrl}/${page.slug}`,
    };
  }

  /**
   * Generate FAQ Schema
   */
  private generateFAQSchema(page: LandingPage): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: page.faqSection.map(faq => ({
        '@type': 'Question',
        name: faq.question,
        acceptedAnswer: {
          '@type': 'Answer',
          text: this.stripHtml(faq.answer),
        },
      })),
    };
  }

  /**
   * Generate Breadcrumb Schema
   */
  private generateBreadcrumbSchema(page: LandingPage): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [
        {
          '@type': 'ListItem',
          position: 1,
          name: 'Acasă',
          item: this.config.baseUrl,
        },
        {
          '@type': 'ListItem',
          position: 2,
          name: 'Site Optimizat',
          item: `${this.config.baseUrl}/site-optimizat`,
        },
        {
          '@type': 'ListItem',
          position: 3,
          name: page.heroSection.h1,
          item: `${this.config.baseUrl}/${page.slug}`,
        },
      ],
    };
  }

  /**
   * Generate WebPage Schema
   */
  private generateWebPageSchema(page: LandingPage): any {
    return {
      '@context': 'https://schema.org',
      '@type': 'WebPage',
      name: page.metaTitle,
      description: page.metaDescription,
      url: `${this.config.baseUrl}/${page.slug}`,
      inLanguage: 'ro-RO',
      isPartOf: {
        '@type': 'WebSite',
        name: this.config.siteName,
        url: this.config.baseUrl,
      },
      about: {
        '@type': 'Thing',
        name: 'Optimizare SEO',
        description: 'Servicii de optimizare pentru motoarele de căutare',
      },
      primaryImageOfPage: {
        '@type': 'ImageObject',
        url: this.config.defaultOgImage || `${this.config.baseUrl}/images/og-default.jpg`,
      },
    };
  }

  /**
   * Generate LocalBusiness Schema (optional)
   */
  private generateLocalBusinessSchema(page: LandingPage): any {
    const schema: any = {
      '@context': 'https://schema.org',
      '@type': 'ProfessionalService',
      name: this.config.siteName,
      description: 'Servicii profesionale de optimizare SEO pentru afaceri românești',
      url: this.config.baseUrl,
      areaServed: {
        '@type': 'Country',
        name: 'România',
      },
    };

    if (this.config.contact?.phone) {
      schema.telephone = this.config.contact.phone;
    }

    if (this.config.contact?.email) {
      schema.email = this.config.contact.email;
    }

    if (this.config.contact?.address) {
      schema.address = {
        '@type': 'PostalAddress',
        addressCountry: 'RO',
        streetAddress: this.config.contact.address,
      };
    }

    return schema;
  }

  /**
   * Strip HTML tags from text
   */
  private stripHtml(html: string): string {
    return html.replace(/<[^>]*>/g, '').trim();
  }
}
