"use node";
import { action } from "../_generated/server";
import { internal } from "../_generated/api";
import { v } from "convex/values";
import { GoogleGenerativeAI } from "@google/generative-ai";

// Transliterare diacritice românești → ASCII
function transliterate(text: string): string {
  const diacriticMap: Record<string, string> = {
    'ă': 'a', 'Ă': 'A',
    'â': 'a', 'Â': 'A',
    'î': 'i', 'Î': 'I',
    'ș': 's', 'Ș': 'S', 'ş': 's', 'Ş': 'S',
    'ț': 't', 'Ț': 'T', 'ţ': 't', 'Ţ': 'T',
  };
  return text.replace(/[ăĂâÂîÎșȘşŞțȚţŢ]/g, char => diacriticMap[char] || char);
}

// Generare slug SEO-friendly
function generateSlug(text: string): string {
  return transliterate(text)
    .toLowerCase()
    .trim()
    .replace(/[^a-z0-9\s-]/g, '')  // elimina caractere speciale
    .replace(/\s+/g, '-')           // spații → cratime
    .replace(/-+/g, '-')            // cratime multiple → una singură
    .replace(/^-|-$/g, '');         // elimina cratime la început/sfârșit
}

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
CONTEXT: Ești copywriter pentru WEBNOVA, o agenție care creează site-uri web profesionale cu SEO inclus.

OBIECTIV: Scrie o landing page B2B care VINDE servicii de web design către proprietarii de ${args.nicheName}.

TARGET: Proprietari de ${args.nicheName} din România care au nevoie de site web profesional.

TONUL: Dan Kennedy direct response - agresiv pe problemă, empatic pe soluție.

IMPORTANT:
- NU scrie despre serviciile ${args.nicheName} (nu despre tratamente dentare, reparații auto, etc.)
- SCRIE despre cum Webnova ajută ${args.nicheName} să atragă clienți prin site web
- Toate beneficiile sunt despre SITE-UL WEB, nu despre business-ul clientului
- Pain points = probleme legate de lipsa vizibilității online, site vechi, pierdere clienți
- Soluția = site Webnova cu SEO, programări online, Google Maps, viteză

Limba: Română cu diacritice corecte (ș, ț, ă, î, â).

RETURNEAZĂ DOAR JSON VALID (fără markdown, fără comentarii):
{
  "theme_type": "medical|legal|industrial|beauty",
  "image_prompt": "professional web designer working on laptop, modern office, 4k",
  "seo_title": "Web Design ${args.nicheName} + SEO Inclus | Webnova",
  "seo_desc": "Creăm site-uri profesionale pentru ${args.nicheName} cu SEO inclus. Atrageți clienți noi din Google. Programări online 24/7.",
  "hero_h1": "Site Web Profesional pentru ${args.nicheName} cu SEO Inclus",
  "hero_sub": "Transformă vizitatorii în clienți. Site optimizat Google + programări online în 14 zile.",
  "hero_cta": "Vreau Ofertă Gratuită",
  "aio_summary": {
    "heading": "De ce ai nevoie de un site profesional?",
    "text": "Text 100-150 cuvinte despre importanța prezenței online pentru ${args.nicheName}..."
  },
  "detailed_guide": {
    "title": "Cum te ajută Webnova să atragi clienți noi",
    "content": "Text 200-300 cuvinte despre beneficiile site-ului Webnova pentru ${args.nicheName}..."
  },
  "pain_points": [
    {"title": "Invizibil pe Google?", "desc": "Clienții caută online dar te găsesc pe concurență.", "icon": "search"},
    {"title": "Site vechi sau inexistent?", "desc": "Pierzi credibilitate și clienți zilnic.", "icon": "alert-triangle"},
    {"title": "Fără programări online?", "desc": "Clienții pleacă la cine oferă comoditate.", "icon": "calendar"},
    {"title": "Nu știi dacă funcționează?", "desc": "Fără date, nu poți îmbunătăți.", "icon": "bar-chart"}
  ],
  "comparison_table": {
    "headers": ["Fără Site Webnova", "Cu Site Webnova", "Rezultat"],
    "rows": [
      ["Invizibil pe Google", "Prima pagină în căutări locale", "Clienți noi zilnic"],
      ["Programări doar telefonic", "Sistem online 24/7", "Rezervări non-stop"],
      ["Site lent, neoptimizat", "Viteză sub 2 secunde", "Vizitatori rămân pe site"],
      ["Fără Google Maps", "Integrare completă", "Găsit ușor de clienți"],
      ["Design învechit", "Design modern, responsive", "Credibilitate crescută"],
      ["Fără analiză", "Dashboard cu statistici", "Decizii bazate pe date"]
    ]
  },
  "faq": [
    {"q": "Cât durează crearea site-ului?", "a": "Site-ul complet este gata în 7-14 zile, inclusiv SEO și conținut."},
    {"q": "Cât costă un site pentru ${args.nicheName}?", "a": "Oferim pachete de la X RON. Solicită ofertă personalizată gratuită."},
    {"q": "Includ și optimizare SEO?", "a": "Da, toate site-urile includ SEO on-page, Google My Business și Schema markup."},
    {"q": "Pot modifica site-ul singur?", "a": "Da, primești acces la un panou simplu de administrare."},
    {"q": "Oferiți suport după lansare?", "a": "Da, suport tehnic inclus 12 luni + actualizări de securitate."}
  ]
}
    `;

    try {
      const result = await model.generateContent(systemPrompt);
      const jsonContent = JSON.parse(result.response.text());

      // Generam slug cu transliterare corecta
      const slug = args.nicheSlug || generateSlug(args.nicheName);


      // SALVAREA OBLIGATORIE
      await ctx.runMutation((internal as any).pages.saveGeneratedPage, {
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
