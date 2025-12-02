"use node";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

export const generateLandingPage = action({
  args: {
    nicheName: v.string(),
    nicheSlug: v.optional(v.string())
  },
  handler: async (ctx, args) => {
    const apiKey = process.env.GOOGLE_GEMINI_API_KEY;
    if (!apiKey) throw new Error("Lipseste cheia API Gemini");

    const genAI = new GoogleGenerativeAI(apiKey);
    const model = genAI.getGenerativeModel({
      model: "gemini-2.5-flash",
      generationConfig: { responseMimeType: "application/json" }
    });

    const systemPrompt = `
      Ești Expert SEO & Copywriter. Scrie pentru: ${args.nicheName}.
      Limba: Română cu diacritice.
      JSON STRICT (fara markdown):
      {
        "theme_type": "medical", 
        "image_prompt": "modern office interior 4k",
        "seo_title": "Titlu SEO",
        "seo_desc": "Descriere",
        "hero_h1": "Titlu H1",
        "hero_sub": "Subtitlu",
        "hero_cta": "Contact",
        "aio_summary": { "heading": "Info", "text": "Text scurt..." },
        "detailed_guide": { "title": "Ghid", "content": "Text lung..." },
        "pain_points": [{"title": "A", "desc": "B", "icon": "check"}],
        "comparison_table": {"headers": ["A","B"], "rows": [["1","2"]]},
        "faq": [{"q": "A", "a": "B"}]
      }
    `;

    try {
      const result = await model.generateContent(systemPrompt);
      const jsonContent = JSON.parse(result.response.text());

      // Generam slug simplu
      const slug = args.nicheSlug || ("solutii/" + args.nicheName.toLowerCase().replace(/[^a-z0-9]+/g, '-'));

      // SALVAREA OBLIGATORIE
      await ctx.runMutation(internal.pages.saveGeneratedPage, {
        slug: slug,
        nicheName: args.nicheName,
        content: jsonContent
      });

      return { success: true, slug: slug };
    } catch (e: any) {
      throw new Error(e.message);
    }
  },
});
