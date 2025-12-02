/**
 * Core Niche Input Interface
 *
 * Defines the structured input data required for generating programmatic SEO landing pages.
 * This rich data structure prevents robotic outputs by capturing nuanced business context.
 */
export interface NicheInput {
  /**
   * Singular form of the professional title (e.g., "Stomatolog", "Arhitect")
   * Used for direct address and personalized messaging
   */
  professionalSingular: string;

  /**
   * Plural form of the professional title (e.g., "Stomatologi", "Arhitecți")
   * Used for market context and industry references
   */
  professionalPlural: string;

  /**
   * Primary business entity name (e.g., "Cabinet Stomatologic", "Birou Arhitectură")
   * This is the main keyword used for URL generation and H1 tags
   */
  businessEntity: string;

  /**
   * URL-safe slug version of the business entity (e.g., "cabinet-stomatologic")
   * Generated automatically from businessEntity if not provided
   */
  businessEntitySlug: string;

  /**
   * Target customer description (e.g., "Pacienți cu dureri dentare", "Clienți care vor să construiască case")
   * Defines the end-user that the business serves
   */
  endClient: string;

  /**
   * Primary emotional pain point of the business owner (e.g., "Scaun gol și programări ratate")
   * Used as the emotional hook in the opening sections
   */
  primaryPainPoint: string;

  /**
   * Technical benefit/solution offering (e.g., "Programări online și vizibilitate pe Google Maps")
   * The rational solution that addresses the pain point
   */
  technicalBenefit: string;

  /**
   * Array of related niche slugs for internal linking (2-3 recommended)
   * Example: ["cabinet-veterinar", "clinica-oftalmologie"]
   */
  relatedNiches: string[];
}
