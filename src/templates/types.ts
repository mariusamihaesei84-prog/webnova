/**
 * Renderer Configuration
 */
export interface RendererConfig {
  /**
   * Base URL for the website (for canonical URLs and absolute links)
   */
  baseUrl: string;

  /**
   * Site name for branding
   */
  siteName: string;

  /**
   * Contact information for footer and schema
   */
  contact?: {
    email?: string;
    phone?: string;
    address?: string;
  };

  /**
   * Social media profiles for Open Graph
   */
  social?: {
    facebook?: string;
    twitter?: string;
    linkedin?: string;
  };

  /**
   * Default Open Graph image URL
   */
  defaultOgImage?: string;

  /**
   * Google Analytics or tracking IDs
   */
  analytics?: {
    googleAnalytics?: string;
    googleTagManager?: string;
  };
}

/**
 * Meta Tags Configuration
 */
export interface MetaTags {
  title: string;
  description: string;
  canonical: string;
  ogTitle?: string;
  ogDescription?: string;
  ogImage?: string;
  ogUrl?: string;
  twitterCard?: 'summary' | 'summary_large_image';
  twitterTitle?: string;
  twitterDescription?: string;
  twitterImage?: string;
  locale?: string;
  keywords?: string[];
}
