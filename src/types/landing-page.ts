/**
 * Hero Section Structure
 *
 * Defines the above-the-fold content
 */
export interface HeroSection {
  /**
   * Primary H1 headline (includes main keyword)
   */
  h1: string;

  /**
   * Supporting subheadline that expands on the value proposition
   */
  subheadline: string;
}

/**
 * FAQ Item Structure
 */
export interface FAQItem {
  /**
   * The question text
   */
  question: string;

  /**
   * The answer text (supports HTML formatting)
   */
  answer: string;
}

/**
 * Comparison Table Structure
 *
 * Used for "Traditional vs. Modern" or "Without vs. With" comparisons
 */
export interface ComparisonTable {
  /**
   * Column headers (typically 2-3 columns)
   * Example: ["Fără site web", "Cu site web optimizat", "Rezultate"]
   */
  headers: string[];

  /**
   * Array of row data, where each row is an array of cell values
   * Example: [["Dependență de recomandări", "Clienți noi din Google", "Creștere 40%"]]
   */
  rows: string[][];
}

/**
 * Call-to-Action Structure
 */
export interface CallToAction {
  /**
   * CTA headline
   */
  headline: string;

  /**
   * Supporting body text
   */
  body: string;

  /**
   * Button text
   */
  buttonText: string;
}

/**
 * Internal Link Structure
 */
export interface InternalLink {
  /**
   * Anchor text for the link
   */
  text: string;

  /**
   * Target slug (relative URL)
   */
  slug: string;
}

/**
 * Schema.org Structured Data
 *
 * SEO-critical JSON-LD schemas for rich snippets
 */
export interface SchemaData {
  /**
   * Product/Service schema for the offering
   */
  product: {
    '@context': string;
    '@type': string;
    name: string;
    description: string;
    provider: {
      '@type': string;
      name: string;
    };
    areaServed: string;
    [key: string]: any;
  };

  /**
   * FAQ schema for question-answer pairs
   */
  faq: {
    '@context': string;
    '@type': string;
    mainEntity: Array<{
      '@type': string;
      name: string;
      acceptedAnswer: {
        '@type': string;
        text: string;
      };
    }>;
  };

  /**
   * Breadcrumb schema for navigation
   */
  breadcrumb: {
    '@context': string;
    '@type': string;
    itemListElement: Array<{
      '@type': string;
      position: number;
      name: string;
      item: string;
    }>;
  };
}

/**
 * Complete Landing Page Structure
 *
 * Represents the final, fully-generated landing page with all content sections
 * and SEO optimizations for Romanian B2B markets.
 */
export interface LandingPage {
  /**
   * URL slug for the page (e.g., "cabinet-stomatologic")
   */
  slug: string;

  /**
   * SEO meta title (50-60 characters optimal)
   */
  metaTitle: string;

  /**
   * SEO meta description (150-160 characters optimal)
   */
  metaDescription: string;

  /**
   * Hero section content
   */
  heroSection: HeroSection;

  /**
   * AI Overview optimized definition block
   * Structured to appear in Google's AI-generated overview
   * Example: "Un Cabinet Stomatologic modern atrage pacienți prin..."
   */
  aioDefinition: string;

  /**
   * Pain agitation section
   * Amplifies the problem before presenting the solution
   */
  painAgitation: string;

  /**
   * Comparison table showing before/after or traditional/modern approaches
   */
  comparisonTable: ComparisonTable;

  /**
   * Technical solution explanation
   * How the offering solves the identified pain points
   */
  technicalSolution: string;

  /**
   * FAQ section with question-answer pairs
   */
  faqSection: FAQItem[];

  /**
   * Call-to-action section
   */
  callToAction: CallToAction;

  /**
   * Structured data for SEO (Schema.org JSON-LD)
   */
  schemaData: SchemaData;

  /**
   * Array of internal links to related niche pages
   */
  internalLinks: InternalLink[];
}
