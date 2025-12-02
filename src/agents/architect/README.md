# Architect Agent - Phase A

The **Architect Agent** is the strategic reasoning component of the Webnova Programmatic SEO engine. It creates a comprehensive content blueprint BEFORE any writing happens.

## Purpose

Instead of generating content directly, the Architect Agent:
1. Analyzes the target niche and audience
2. Researches industry-specific terminology (LSI keywords)
3. Creates a controversial/engaging hook angle
4. Identifies and structures 5 common objections
5. Designs a strategic content outline

This ensures every piece of content is backed by research and strategy, following Dan Kennedy's direct response marketing principles.

## Architecture

```
src/agents/architect/
├── index.ts       # Main ArchitectAgent class
├── types.ts       # TypeScript interfaces and types
├── prompts.ts     # AI prompt templates
├── example.ts     # Usage examples
└── README.md      # This file

src/services/
└── ai-service.ts  # AI provider abstraction layer
```

## Installation

```bash
npm install @anthropic-ai/sdk
```

## Usage

### Basic Example

```typescript
import { ArchitectAgent } from './agents/architect';

// Initialize agent
const architect = new ArchitectAgent({
  apiKey: process.env.ANTHROPIC_API_KEY,
  model: 'claude-3-5-sonnet-20241022',
  language: 'ro',
});

// Define niche
const niche = {
  businessType: 'cabinet stomatologic',
  painPoint: 'lipsa pacienților noi',
  targetAudience: 'proprietari cabinete dentare',
};

// Generate strategic brief
const brief = await architect.analyze(niche);

console.log(brief.hookAngle.statement);
// => "90% din cabinetele stomatologice pierd minimum 15 pacienți pe lună..."
```

### Mock Mode (No API Key Required)

```typescript
const architect = new ArchitectAgent({
  language: 'ro',
  mockMode: true, // Uses pre-built mock responses
});

const brief = await architect.analyze(niche);
```

### Export/Import Briefs

```typescript
// Export to JSON
const json = architect.exportBrief(brief);
await fs.writeFile('brief.json', json);

// Import from JSON
const imported = architect.importBrief(json);
```

## Output Structure

The `ArchitectBrief` contains:

### 1. LSI Keywords (15-20)
Industry-specific terms with commercial intent:
```typescript
["implant dentar", "albire profesională", "detartraj ultrasonic"]
```

### 2. Hook Angle
Controversial opening statement:
```typescript
{
  statement: "90% din cabinetele stomatologice...",
  emotion: "fear",
  reasoning: "Creates urgency by highlighting lost revenue"
}
```

### 3. Objections (5)
Common skeptical responses:
```typescript
[
  {
    id: 1,
    text: "Nu am timp să mă ocup de un site",
    category: "time",
    rebuttalStrategy: "Show how automation saves time"
  }
]
```

### 4. Content Outline
Strategic structure with 6-8 sections:
```typescript
[
  {
    title: "De ce majoritatea cabinetelor pierd pacienți",
    purpose: "Agitate the problem",
    keyPoints: ["Stat 1", "Stat 2", "Real case"],
    lsiKeywords: ["implant dentar", "pacienți noi"],
    tone: "urgent"
  }
]
```

### 5. Competitor Insights
Strategic advantages to highlight:
```typescript
["Transparent pricing increases conversions by 40%", ...]
```

### 6. Call to Action
Low-commitment lead generation:
```typescript
"Primește un audit gratuit - descoperă unde pierzi clienți..."
```

## Configuration Options

```typescript
interface ArchitectConfig {
  apiKey?: string;        // Anthropic API key
  model?: string;         // Default: 'claude-3-5-sonnet-20241022'
  language: 'ro' | 'en';  // Content language
  mockMode?: boolean;     // Use mock responses (testing)
}
```

## Niche Input Format

```typescript
interface NicheInput {
  businessType: string;   // "cabinet stomatologic", "salon beauty"
  painPoint: string;      // Main business challenge
  targetAudience: string; // Who we're writing for
  location?: string;      // Optional geographic targeting
}
```

## Dan Kennedy Principles Applied

The Architect Agent follows direct response marketing principles:

1. **Problem-Agitation-Solution**: Content flows from pain to solution
2. **Specificity**: Uses exact numbers and data points
3. **Objection Handling**: Anticipates and addresses skepticism
4. **Authority Building**: Demonstrates industry expertise
5. **Urgency**: Shows cost of inaction, not artificial scarcity
6. **Call to Value**: Low-commitment first step

## Processing Flow

```
Input (Niche)
    ↓
Generate LSI Keywords (20 terms)
    ↓
Analyze Competitors (7 insights)
    ↓
Create Hook Angle (emotional trigger)
    ↓
Generate Objections (5 skeptical responses)
    ↓
Build Content Outline (6-8 sections)
    ↓
Craft CTA (low-commitment)
    ↓
Output (ArchitectBrief)
```

## Error Handling

```typescript
try {
  const brief = await architect.analyze(niche);
} catch (error) {
  if (error.message.includes('API key')) {
    // Handle authentication error
  } else if (error.message.includes('parse')) {
    // Handle JSON parsing error
  } else {
    // Handle general error
  }
}
```

## Testing Connection

```typescript
const isConnected = await architect.testConnection();
if (!isConnected) {
  console.error('Failed to connect to AI service');
}
```

## Performance

- **Average execution time**: 30-45 seconds
- **Token usage**: ~8,000-12,000 tokens per brief
- **Cost**: ~$0.10-0.15 per brief (Anthropic pricing)

## Next Steps: Phase B - Writer Agent

The output of the Architect Agent (ArchitectBrief) will be fed into the Writer Agent, which will:
1. Take the strategic brief
2. Generate actual content for each section
3. Integrate LSI keywords naturally
4. Maintain consistent tone and style
5. Output final 2000-2500 word article

## Examples

See `example.ts` for complete working examples:
- Dental clinic niche
- Beauty salon niche
- Law firm niche

Run examples:
```bash
npm run example:architect
# or
ts-node src/agents/architect/example.ts
```

## Romanian Language Notes

All generated content uses:
- Correct diacritics (ă, â, î, ș, ț)
- B2B formal tone (professional but approachable)
- Industry-specific terminology
- Local market context (Romanian business environment)

## Dependencies

- `@anthropic-ai/sdk` - Claude API integration
- TypeScript 5.x
- Node.js 18+

## License

Proprietary - Webnova Internal Tool
