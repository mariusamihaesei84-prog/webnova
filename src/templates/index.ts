/**
 * Templates Module
 *
 * Exports all template components and the main renderer
 */

// Main Renderer
export { LandingPageRenderer } from './renderer';

// Configuration Types
export type { RendererConfig, MetaTags } from './types';

// SEO Components
export { MetaTagGenerator } from './seo/meta-tags';
export { SchemaGenerator } from './seo/schema';
export { InternalLinkingSystem } from './seo/internal-links';

// Section Templates
export { HeroSectionTemplate } from './sections/hero';
export { AIODefinitionTemplate } from './sections/aio-definition';
export { PainAgitationTemplate } from './sections/pain-agitation';
export { ComparisonTableTemplate } from './sections/comparison-table';
export { TechnicalSolutionTemplate } from './sections/technical-solution';
export { FAQTemplate } from './sections/faq';
export { CTATemplate } from './sections/cta';

// Layout
export { LayoutTemplate } from './layout';

// Styles
export { CSS_STYLES } from './styles';
