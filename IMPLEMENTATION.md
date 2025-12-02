# WebNova.ro Core Implementation - Complete

## Overview
This document describes the complete implementation of the WebNova.ro "Website-as-a-Service" system that generates B2B landing pages with adaptive design, SEO-optimized content, and dynamic images.

---

## 🎨 MODULE 1: Design System (`lib/design-system.ts`)

### Purpose
Dictates the "Visual Psychology" of each landing page based on the target niche.

### Theme Types

1. **CLINICAL TRUST** (Medical, Dental)
   - Background: White
   - Primary: Blue-600
   - Font: Sans-serif
   - Border Radius: rounded-2xl
   - Vibe: Sterile, Safe

2. **LEGAL AUTHORITY** (Lawyers, Accountants)
   - Background: Slate-50
   - Primary: Slate-900
   - Font: Serif (headings)
   - Border Radius: rounded-none
   - Vibe: Traditional, Powerful

3. **INDUSTRIAL ACTION** (Plumbers, Construction, Auto)
   - Background: Zinc-50
   - Primary: Orange-700
   - Font: Bold Sans
   - Border Radius: rounded-md
   - Vibe: Robust, Urgent

4. **AESTHETIC LUXURY** (Beauty, Architects)
   - Background: Stone-50
   - Primary: Rose-900
   - Font: Light Sans
   - Border Radius: rounded-lg
   - Vibe: Elegant

### Key Function
```typescript
getTheme(nicheSlug: string): Theme
```
Returns the appropriate theme configuration based on keywords in the niche slug.

---

## 🗄️ MODULE 4: Database Schema (`convex/schema.ts`)

### Tables

#### `niches`
- `name`: string (e.g., "Medic Stomatolog")
- `slug`: string (e.g., "medic-stomatolog")
- `pain_points_cache`: array of strings
- `created_at`: number

**Indexes:**
- `by_slug`

#### `generated_pages`
- `niche_id`: id reference to niches
- `slug`: string (e.g., "solutii/site-pentru-dentisti")
- `title`: string (H1 for SEO)
- `meta_description`: string
- `content_json`: any (complete page content)
- `status`: "published" | "draft"
- `indexing_status`: "pending" | "submitted" | "indexed"
- `aio_score`: number (0-100)
- `created_at`: number
- `updated_at`: number
- `indexed_at`: optional number

**Indexes:**
- `by_slug`
- `by_niche`
- `by_status`
- `by_indexing_status`

#### `indexing_logs` *(NEW)*
- `page_id`: id reference to generated_pages
- `url`: string (full URL submitted)
- `request_type`: string ("URL_UPDATED" | "URL_DELETED")
- `status`: "success" | "failed" | "pending"
- `response_data`: optional any
- `error_message`: optional string
- `created_at`: number

**Indexes:**
- `by_page`
- `by_status`

---

## 🤖 MODULE 2: SEO & Content Engine (`convex/actions/gemini.ts`)

### Key Components

#### Model
- **Google Gemini 2.5 Flash** via `@google/generative-ai`
- JSON output mode
- Temperature: 0.9 (creative but controlled)
- Max tokens: 4096

#### System Prompt Structure
The prompt follows a 3-step process:

**STEP 1: SEO Research (Internal)**
- Identifies 1 Main Keyword (short-tail)
- Identifies 3 Long-tail Keywords (commercial intent)
- Identifies 5 Semantic Entities (for AIO)

**STEP 2: Visual Direction**
- Generates an English prompt for dynamic image generation
- Photorealistic, professional
- Example: "Modern dental clinic interior, bright, professional equipment, 4k"

**STEP 3: Copywriting**
- Direct Response Marketing (PAS Framework)
- Romanian with proper diacritics (ș, ț, ă)
- AIO-optimized content

### Output Structure
```typescript
{
  theme_type: 'medical' | 'legal' | 'industrial' | 'beauty',
  image_prompt: string, // English prompt for image generation
  seo: {
    title: string,
    description: string
  },
  hero: {
    headline: string,
    subheadline: string,
    cta: string
  },
  aio_snippet: {
    heading: string,
    text: string // 50 words, encyclopedic
  },
  pain_points: Array<{
    icon: string, // Lucide React icon name
    title: string,
    desc: string
  }>,
  comparison_table: {
    headers: string[],
    rows: string[][]
  },
  faq: Array<{
    q: string,
    a: string
  }>
}
```

### Action: `generateLandingPage`
**Args:**
- `nicheName`: string
- `nicheSlug`: string
- `nicheId`: optional id

**Returns:** `GeneratedLandingPageContent`

---

## 🎨 MODULE 3: Frontend (`app/solutii/[slug]/page.tsx`)

### Key Features

1. **Dynamic Theme Application**
   - Uses `getTheme()` from design system
   - Applies theme colors, fonts, and border radius dynamically

2. **Dynamic Image Generation**
   - Uses Pollinations.ai API
   - URL format: `https://image.pollinations.ai/prompt/{encoded_prompt}?width=1200&height=600&nologo=true`
   - Image prompt comes from Gemini AI output

3. **Sections**
   - **Hero**: Dynamic image + headline + CTA
   - **AIO Box**: `<section id="ai-summary">` with fact-based content
   - **Bento Grid**: Pain points with Lucide icons
   - **Comparison Table**: HTML `<table>` (SEO-friendly)
   - **FAQ Accordion**: Using `<details>` elements
   - **Final CTA**: Theme-colored call-to-action

4. **SEO Features**
   - JSON-LD Schema.org markup
   - Canonical URLs
   - Semantic HTML
   - Meta tags

---

## ⏰ MODULE 5: Auto-Indexing (`convex/crons.ts` + `convex/crons/processPendingIndexing.ts`)

### Cron Schedule
- **Frequency:** Every hour (at minute 0)
- **Name:** "submit-to-google-indexing"

### Process Flow
1. Query all `generated_pages` with:
   - `status = "published"`
   - `indexing_status = "pending"`

2. For each page:
   - Construct full URL
   - Call Google Indexing API
   - Create log entry in `indexing_logs`
   - Update page `indexing_status` to "submitted" (if successful)

3. Return count of processed pages

### Logging
Every API call creates an entry in `indexing_logs` with:
- Success/failure status
- API response data
- Error messages (if any)

### Mutation: `createLog` (`convex/mutations/indexing.ts`)
Internal mutation to create indexing log entries.

---

## 🔌 Integration Points

### Environment Variables Required
```
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

### Google Indexing API Setup
- Service account JSON key required
- Implementation in `convex/actions/indexing.ts`
- Called by cron job hourly

---

## 🚀 Usage Flow

### 1. Generate Content
```typescript
// Call from Convex dashboard or code
const content = await ctx.runAction(api.actions.gemini.generateLandingPage, {
  nicheName: "Medic Stomatolog",
  nicheSlug: "medic-stomatolog",
  nicheId: someNicheId
});
```

### 2. Content is Saved
- Automatically saved to `generated_pages` table
- `indexing_status` set to "pending"

### 3. Page is Accessible
- Visit: `https://webnova.ro/solutii/medic-stomatolog`
- Dynamic rendering with theme + image

### 4. Auto-Indexing
- Cron runs hourly
- Submits to Google Indexing API
- Logs all attempts

---

## ✅ Verification Checklist

- [x] Design System: 4 themes defined
- [x] Schema: `indexing_logs` table added
- [x] Gemini Action: Updated with `theme_type` and `image_prompt`
- [x] Frontend: Dynamic image + theme integration
- [x] Cron: Logging to `indexing_logs`
- [x] Mutations: `createLog` for indexing logs

---

## 📝 Notes

### Image Generation
The system uses **Pollinations.ai** which:
- Is free and unlimited
- Generates images from text prompts
- No API key required
- Deterministic (same prompt = same image)

### Theme Mapping Logic
The `getTheme()` function uses simple keyword matching:
- "medic", "dentist", "clinica" → Clinical
- "avocat", "contabil", "juridic" → Legal
- "construct", "instalator", "auto" → Industrial
- "beauty", "salon", "arhitect" → Luxury

### Romanian Diacritics
The system enforces proper Romanian diacritics:
- ș, ț, ă, â, î must be used
- Gemini is specifically instructed to use them

### AIO Optimization
The "AIO Snippet" is specifically designed to be:
- Factual and encyclopedic
- 50 words exactly
- Quotable by AI systems (ChatGPT, Perplexity, Google SGE)

---

## 🎯 Future Enhancements

1. **A/B Testing**: Test different prompts and themes
2. **Analytics**: Track which themes perform best
3. **Image Caching**: Cache generated images locally
4. **Custom Prompts**: Allow manual override of image prompts
5. **Multi-language**: Expand beyond Romanian

---

**Status:** ✅ All 5 modules implemented and integrated
**Last Updated:** 2025-12-02
