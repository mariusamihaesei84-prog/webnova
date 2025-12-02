# Webnova Type Definitions

This directory contains all TypeScript interfaces and type definitions for the Webnova Programmatic SEO engine.

## File Structure

### `/types/niche.ts`
**Core Niche Interface**

Defines the input data structure (`NicheInput`) that captures all essential information about a business niche:
- Professional titles (singular/plural)
- Business entity and URL slug
- Target customer description
- Pain points and benefits
- Related niches for internal linking

This is the foundation that all other agents build upon.

### `/types/architect-brief.ts`
**Architect Agent Output**

Defines the `ArchitectBrief` interface - the strategic document created by the Architect agent:
- LSI keywords for SEO relevance
- Hook angles for engagement
- Skeptical objections to address
- Section-by-section content strategy
- Content outline structure

### `/types/landing-page.ts`
**Final Landing Page Structure**

Defines the complete `LandingPage` interface with all sections:
- SEO metadata (title, description)
- Hero section
- AI Overview optimized definition
- Pain agitation
- Comparison tables
- Technical solutions
- FAQ section
- Call-to-action
- Schema.org structured data
- Internal links

### `/types/index.ts`
**Export Barrel**

Central export point for all type definitions. Import from here for cleaner code:

```typescript
import { NicheInput, ArchitectBrief, LandingPage } from './types';
```

## Usage Example

```typescript
import { NicheInput } from './types';
import { generateSlug } from './utils/slug';

const niche: NicheInput = {
  professionalSingular: 'Stomatolog',
  professionalPlural: 'Stomatologi',
  businessEntity: 'Cabinet Stomatologic',
  businessEntitySlug: generateSlug('Cabinet Stomatologic'),
  endClient: 'Pacienți cu dureri dentare',
  primaryPainPoint: 'Scaun gol și programări ratate',
  technicalBenefit: 'Programări online și vizibilitate pe Google Maps',
  relatedNiches: ['cabinet-veterinar', 'clinica-oftalmologie'],
};
```

## Design Principles

1. **Strict Typing**: All interfaces use TypeScript strict mode
2. **Rich Documentation**: Every field has JSDoc comments explaining its purpose
3. **Romanian Context**: Examples use proper Romanian diacritics
4. **SEO-Focused**: Structure designed for programmatic SEO generation
5. **Extensible**: Easy to add new fields without breaking existing code

## Related Files

- `/utils/slug.ts` - Utility functions for generating URL-safe slugs
- `/examples/niche-example.ts` - Example niche data for common Romanian B2B markets
