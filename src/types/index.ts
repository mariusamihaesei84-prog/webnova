/**
 * Central export barrel for all TypeScript types and interfaces
 *
 * This file provides a single import point for all type definitions
 * used throughout the Webnova Programmatic SEO engine.
 */

// Niche input types
export type { NicheInput } from './niche';

// Architect brief types
export type {
  ArchitectBrief,
  ContentOutline
} from './architect-brief';

// Landing page types
export type {
  LandingPage,
  HeroSection,
  FAQItem,
  ComparisonTable,
  CallToAction,
  InternalLink,
  SchemaData,
} from './landing-page';
