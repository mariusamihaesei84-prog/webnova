"use node";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";

/**
 * Gemini AIO Engine for WebNova.ro
 * 
 * Generates AIO-optimized landing page content in Romanian
 * using Google Gemini 1.5 Flash with JSON schema mode.
 */

// Type definitions for the generated content
export interface GeneratedLandingPageContent {
  theme_type: 'medical' | 'legal' | 'industrial' | 'beauty';
  image_prompt: string;
  seo: {
    title: string;
    description: string;
  };
  hero: {
    headline: string;
    subheadline: string;
    cta: string;
  };
  aio_snippet: {
    heading: string;
    text: string;
  };
  pain_points: Array<{
    icon: string;
    title: string;
    desc: string;
  }>;
  comparison_table: {
    headers: string[];
    rows: Array<string[]>;
  };
  faq: Array<{
    q: string;
    a: string;
  }>;
}

/**
 * Main action to generate landing page content using Gemini AI
 */
export const generateLandingPage = action({
  args: {
    nicheName: v.string(), // e.g., "Medic Stomatolog"
    nicheSlug: v.string(), // e.g., "medic-stomatolog"
    nicheId: v.optional(v.id("niches")), // Optional: if provided, saves the page
  },
  handler: async (ctx, args): Promise<GeneratedLandingPageContent> => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;

    if (!apiKey) {
      throw new Error("GOOGLE_GEMINI_API_KEY not found in environment variables");
    }

    const genAI = new GoogleGenerativeAI(apiKey);

    // Use Gemini 1.5 Flash with JSON mode
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: {
        responseMimeType: "application/json",
        temperature: 0.9, // Creative but controlled
        maxOutputTokens: 4096,
      },
    });

    // Construct the AIO-optimized system prompt
    const systemPrompt = buildSystemPrompt(args.nicheName);

    try {
      const result = await model.generateContent(systemPrompt);
      const response = result.response;
      const text = response.text();

      // Parse JSON response
      const generatedContent: GeneratedLandingPageContent = JSON.parse(text);

      // Validate that all required fields are present
      validateGeneratedContent(generatedContent);

      // If nicheId is provided, save the page
      if (args.nicheId) {
        await ctx.runMutation(internal.mutations.admin.createPageFromContent, {
          nicheId: args.nicheId,
          content: generatedContent,
        });
      }

      return generatedContent;
    } catch (error) {
      console.error("Error generating landing page:", error);
      throw new Error(`Failed to generate landing page: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  },
});

/**
 * Builds the comprehensive AIO-optimized system prompt
 */
function buildSystemPrompt(nicheName: string): string {
  return `Ești un Expert SEO Strategist și Art Director.
Sarcina: Creează conținutul complet pentru pagina WebNova dedicată nișei: ${nicheName}.

PASUL 1: SEO RESEARCH (Intern)
- Identifică 1 Main Keyword (Short-tail).
- Identifică 3 Long-tail Keywords (Intenție comercială).
- Identifică 5 Entități Semantice (pentru AIO).

PASUL 2: VISUAL DIRECTION
- Scrie un prompt scurt în ENGLEZĂ care descrie o imagine profesională, fotorealistă, perfectă pentru Hero Section-ul acestei nișe.
- Exemplu pentru dentist: 'Modern dental clinic interior, bright, professional equipment, 4k'
- Exemplu pentru avocat: 'Professional law office, elegant wooden desk, legal books, natural lighting'
- Promptul trebuie să fie descriptiv dar concis (maximum 15 cuvinte în engleză).

PASUL 3: REDACTARE (Copywriting)
- H1/H2: Include cuvintele cheie identificate.
- Stil: Direct Response (PAS Framework).
- AIO Snippet: Definiție densă pentru a fi citată de AI.
- Limbă: Română cu DIACRITICE (ș, ț, ă).

OUTPUT JSON STRICT (Flat structure):
{
  "theme_type": "medical", // sau legal, industrial, beauty
  "image_prompt": "prompt-ul in engleza pentru imagine", 
  
  "seo": {
    "title": "Titlu Optimizat | WebNova",
    "description": "Meta description cu CTR mare."
  },
  
  "hero": {
    "headline": "Titlu H1 Masiv",
    "subheadline": "Subtitlu persuasiv",
    "cta": "Solicită Ofertă"
  },
  
  "aio_snippet": {
    "heading": "Analiză de Piață: ${nicheName}",
    "text": "Textul optimizat pentru roboți (50 cuvinte)."
  },
  
  "pain_points": [
    {
      "icon": "trending-down",
      "title": "...",
      "desc": "..."
    },
    {
      "icon": "clock",
      "title": "...",
      "desc": "..."
    },
    {
      "icon": "wallet",
      "title": "...",
      "desc": "..."
    }
  ],
  
  "comparison_table": {
    "headers": ["Criteriu", "Agenție Clasică", "WebNova"],
    "rows": [
      ["Preț", "Ridicat", "Optim"],
      ["Timp", "Luni", "Ore"],
      ["SEO", "Manual", "Automat"],
      ["Actualizări", "Costisitoare", "Incluse"],
      ["AIO Ready", "Nu", "Da"]
    ]
  },
  
  "faq": [
    {
      "q": "...",
      "a": "..."
    },
    {
      "q": "...",
      "a": "..."
    },
    {
      "q": "...",
      "a": "..."
    },
    {
      "q": "...",
      "a": "..."
    }
  ]
}

ATENȚIE CRITICALĂ:
- TOATE textele în română cu diacritice corecte (ș, ț, ă, â, î)
- theme_type trebuie să fie: medical, legal, industrial sau beauty (alege cel mai potrivit pentru ${nicheName})
- image_prompt trebuie să fie în ENGLEZĂ, descriptiv, fotorealist
- Iconițele pentru pain_points: trending-down, clock, wallet, users, alert-circle (nume Lucide React valide)

Generează JSON-ul ACUM:`;
}

/**
 * Validates the generated content structure
 */
function validateGeneratedContent(content: any): void {
  const requiredFields = [
    'theme_type',
    'image_prompt',
    'seo',
    'hero',
    'aio_snippet',
    'pain_points',
    'comparison_table',
    'faq'
  ];

  for (const field of requiredFields) {
    if (!content[field]) {
      throw new Error(`Missing required field: ${field}`);
    }
  }

  // Validate theme_type
  const validThemes = ['medical', 'legal', 'industrial', 'beauty'];
  if (!validThemes.includes(content.theme_type)) {
    throw new Error(`Invalid theme_type: ${content.theme_type}. Must be one of: ${validThemes.join(', ')}`);
  }

  // Validate image_prompt
  if (typeof content.image_prompt !== 'string' || content.image_prompt.length === 0) {
    throw new Error('image_prompt must be a non-empty string');
  }

  // Validate seo
  if (!content.seo.title || !content.seo.description) {
    throw new Error('SEO title and description are required');
  }

  // Validate hero
  if (!content.hero.headline || !content.hero.subheadline || !content.hero.cta) {
    throw new Error('Hero section must have headline, subheadline, and CTA');
  }

  // Validate pain_points
  if (!Array.isArray(content.pain_points) || content.pain_points.length === 0) {
    throw new Error('Pain points must be a non-empty array');
  }

  // Validate comparison_table
  if (!content.comparison_table.headers || !content.comparison_table.rows) {
    throw new Error('Comparison table must have headers and rows');
  }

  // Validate FAQ
  if (!Array.isArray(content.faq) || content.faq.length === 0) {
    throw new Error('FAQ must be a non-empty array');
  }
}
