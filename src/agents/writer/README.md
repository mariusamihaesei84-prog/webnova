# Writer Agent (Phase B)

Content execution component that transforms strategic briefs into persuasive Romanian landing pages.

## Overview

The Writer Agent is Phase B of the Double-Agent generation engine. It takes an `ArchitectBrief` (from Phase A) and writes 1,500+ words of Dan Kennedy-style direct response marketing content in Romanian.

## Features

- **Dan Kennedy Style**: Short, punchy sentences with aggressive focus on solution
- **Romanian Language**: Mandatory correct diacritics (ș, ț, ă, î, â)
- **1,500+ Words**: Comprehensive content across all sections
- **SEO Optimized**: Meta tags, Schema.org markup, LSI keywords
- **Modular Architecture**: Individual generators for each section

## Architecture

```
writer/
├── index.ts                    # Main WriterAgent class
├── types.ts                    # Writer-specific types
├── prompts.ts                  # Dan Kennedy-style prompts
├── sections/
│   ├── hero.ts                # Hero section generator
│   ├── aio-definition.ts      # AI Overview block generator
│   ├── pain-agitation.ts      # Pain section generator
│   ├── comparison-table.ts    # Comparison table generator
│   ├── technical-solution.ts  # Technical explanation generator
│   ├── faq.ts                 # FAQ generator (from objections)
│   └── cta.ts                 # Call to action generator
├── example.ts                 # Usage examples
└── test.ts                    # Test suite
```

## Usage

### Basic Usage

```typescript
import { WriterAgent } from './agents/writer';
import { ArchitectBrief } from './types/architect-brief';

// Initialize Writer Agent
const writer = new WriterAgent({
  language: 'ro',
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-20241022',
  minWordCount: 1500,
  danKennedyStyle: true,
});

// Generate landing page from architect brief
const landingPage = await writer.write(architectBrief);

// Export to JSON
const json = writer.exportLandingPage(landingPage);
```

### Mock Mode (Testing)

```typescript
const writer = new WriterAgent({
  language: 'ro',
  mockMode: true, // No API calls, uses mock responses
  minWordCount: 1500,
});

const landingPage = await writer.write(brief);
```

### Test Connection

```typescript
const connected = await writer.testConnection();
if (!connected) {
  console.error('Failed to connect to AI service');
}
```

## Configuration

```typescript
interface WriterConfig {
  apiKey?: string;           // Anthropic API key
  model?: string;            // AI model (default: claude-3-5-sonnet-20241022)
  language: 'ro' | 'en';     // Output language
  mockMode?: boolean;        // Enable mock mode for testing
  minWordCount?: number;     // Minimum total words (default: 1500)
  danKennedyStyle?: boolean; // Enable Dan Kennedy style (default: true)
}
```

## Landing Page Structure

The Writer Agent generates a complete `LandingPage` object with these sections:

### 1. Meta Tags
- **metaTitle**: 50-60 characters, includes keyword + "SEO" + "Webnova"
- **metaDescription**: 150-160 characters with benefits

### 2. Hero Section
- **H1**: "Web Design pentru [Business Entity] cu SEO Inclus"
- **Subheadline**: Pain point transformation promise

### 3. AIO Definition Block
- 150-200 words optimized for Google AI Overview
- Answers: "Ce trebuie să aibă un site modern pentru [Business]?"
- Includes LSI keywords naturally

### 4. Pain Agitation
- 300-400 words in Dan Kennedy style
- Exposes why old websites fail
- Calculates lost money with concrete RON amounts
- Creates urgency without fear-mongering

### 5. Comparison Table
- 3 columns: Generic Agency | Webnova | Result for You
- 6-8 rows showing concrete feature differences
- Translates tech features into business outcomes

### 6. Technical Solution
- 350-450 words explaining technical features
- Translates jargon into business language:
  - Core Web Vitals → Speed that prevents abandonment
  - Schema Markup → Rich results in Google
  - Mobile-First → 70% of clients search on phone
  - Semantic HTML → Google understands and ranks higher

### 7. FAQ Section
- Exactly 5 questions from skeptical objections
- 80-120 words per answer
- Structure: Validation + Reversal + Proof + Action
- Direct, conversational tone

### 8. Call to Action
- **Headline**: 8-12 words with emotional urgency
- **Body**: 120-180 words recapping journey and next step
- **Button**: 3-5 words with specific action

### 9. Schema Data
- Product Schema for the offering
- FAQ Schema for Q&A pairs
- Breadcrumb Schema for navigation

### 10. Internal Links
- Contextual links to related niche pages
- Natural anchor text (not "click here")

## Content Requirements

### Tone of Voice (Dan Kennedy Style)

1. **Short, Punchy Sentences**
   - One idea per sentence
   - Maximum 25 words per sentence
   - Vary length for rhythm

2. **Specificity Over Generality**
   - Use concrete numbers: "15 pacienți × 500 RON = 7,500 RON pierdut/lună"
   - Real examples: "Un pacient caută pe Google la ora 22:00..."
   - Avoid vague claims: "servicii de calitate", "cel mai bun"

3. **Aggressive on Solution**
   - Don't apologize for the problem
   - Present solution with confidence
   - Make it feel inevitable: "Când faci X, obții Y"

4. **Empathetic to Pain**
   - Validate the struggle
   - Show you understand their world
   - "Știu că investești în echipamente..."

### Romanian Language Rules

1. **Mandatory Diacritics**
   - ș, ț (correct: "această", "programări")
   - NOT s, t (wrong: "aceasta", "programari")
   - ă, â, î (correct: "către", "într-un", "înseamnă")

2. **Industry Terminology**
   - Use LSI keywords naturally
   - Mix Romanian and accepted English terms
   - Example: "Core Web Vitals înseamnă viteza site-ului..."

3. **Avoid Excessive Anglicisms**
   - Prefer: "programare online" over "booking online"
   - But OK: "SEO", "Google", "mobile" (widely understood)

## Word Count Tracking

The Writer Agent automatically tracks word counts per section:

```typescript
{
  totalWordCount: 1847,
  sectionWordCounts: {
    metaTitle: 9,
    metaDescription: 23,
    heroH1: 8,
    heroSubheadline: 18,
    aioDefinition: 187,
    painAgitation: 394,
    comparisonTable: 142,
    technicalSolution: 421,
    faqSection: 512,
    ctaHeadline: 11,
    ctaBody: 156,
    ctaButton: 4
  }
}
```

## Testing

### Run All Tests

```bash
npm run build
node dist/agents/writer/test.js
```

### Run Example

```bash
npm run build
node dist/agents/writer/example.js
```

### Test Suite Includes

1. **Initialization Test**: Writer Agent setup and connection
2. **Landing Page Generation**: Complete page with all sections
3. **Romanian Language**: Diacritics and language validation
4. **Meta Tags Length**: SEO-optimal character counts
5. **FAQ Section**: 5 items with proper structure

## Examples

### Example 1: Dental Clinic

```bash
node dist/agents/writer/example.js
```

Generates a complete landing page for "Cabinet Stomatologic" with:
- Pain point: "Scaun gol și programări ratate"
- Hook angle: Mobile-first optimization
- 1,500+ words of persuasive content

### Example 2: Law Firm

See `test.ts` for law firm example with different pain points and objections.

## Integration with Phase A (Architect Agent)

```typescript
import { ArchitectAgent } from './agents/architect';
import { WriterAgent } from './agents/writer';

// Phase A: Strategic reasoning
const architect = new ArchitectAgent({
  language: 'ro',
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const brief = await architect.analyze(nicheInput);

// Phase B: Content execution
const writer = new WriterAgent({
  language: 'ro',
  apiKey: process.env.ANTHROPIC_API_KEY,
});

const landingPage = await writer.write(brief);
```

## Performance

- **Generation Time**: ~30-60 seconds (with API)
- **Token Usage**: ~15,000-25,000 tokens per page
- **Word Count**: 1,500-2,000 words typical output
- **API Calls**: 9 sequential calls (one per section)

## Error Handling

The Writer Agent includes validation for:

- Missing required fields
- Word count minimums per section
- Character limits (meta tags, H1)
- Romanian diacritics presence
- FAQ structure (exactly 5 items)
- Comparison table format (3 columns)

Warnings are logged but don't stop generation.

## Customization

### Override Prompts

```typescript
import { generateHeroPrompt } from './agents/writer/prompts';

// Customize the hero prompt
const customPrompt = generateHeroPrompt(
  businessEntity,
  painPoint,
  hookAngle,
  lsiKeywords
);
```

### Custom Section Generator

```typescript
import { AIService } from './services/ai-service';

async function myCustomSection(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<string> {
  // Your custom generation logic
}
```

## Troubleshooting

### "Word count below minimum"
- Check mock mode responses (they may be shorter)
- Increase `maxTokens` in prompts
- Adjust temperature for more verbose output

### "Meta title too long"
- Automatic trimming to 60 characters
- Check business entity name length
- Simplify title structure in prompt

### "Missing Romanian diacritics"
- Ensure system prompt emphasizes diacritics
- Use real API (mock mode may not have diacritics)
- Validate with regex: `/[ăâîșț]/i`

## Best Practices

1. **Always use real API for production**: Mock mode is for testing only
2. **Validate output**: Check word count and language requirements
3. **Cache briefs**: Architect briefs can be reused for A/B testing
4. **Monitor token usage**: Track costs in production
5. **Version control**: Export landing pages as JSON for versioning

## License

Part of the Webnova Programmatic SEO project.
