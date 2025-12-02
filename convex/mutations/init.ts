import { mutation } from "../_generated/server";

/**
 * Seed Database with Initial Romanian Niches
 * 
 * Populates the database with 10 profitable niches targeted for the Romanian market
 */

export const seedNiches = mutation({
    args: {},
    handler: async (ctx) => {
        const now = Date.now();

        // Check if niches already exist
        const existingNiches = await ctx.db.query("niches").collect();

        if (existingNiches.length > 0) {
            console.log("Niches already seeded, skipping...");
            return { message: "Database already contains niches", count: existingNiches.length };
        }

        // Define the 10 profitable Romanian niches
        const niches = [
            {
                name: "Medic Stomatolog (Clinică Dentară)",
                slug: "medic-stomatolog",
                pain_points_cache: [
                    "Cabinete goale - pacienți puțini online",
                    "Recenzii negative pe Google Maps",
                    "Concurență mare de la clinicile corporate",
                    "Programări telefonice pierdute",
                    "Lipsa vizibilității pentru căutări locale (implant dentar, albire)"
                ],
            },
            {
                name: "Avocat Drept Penal și Divorț",
                slug: "avocat-drept-penal",
                pain_points_cache: [
                    "Clienți noi doar din recomandări - limitat",
                    "Site-uri vechi care nu inspiră încredere",
                    "Concurență de la cabinete mari cu bugete mari",
                    "Lipsa conținutului educațional (blog juridic)",
                    "Nu apar pe Google pentru căutări urgente (avocat divorț, penal)"
                ],
            },
            {
                name: "Instalator Sanitar & Termic",
                slug: "instalator-sanitar",
                pain_points_cache: [
                    "Clienți doar din Facebook/WhatsApp - nesigur",
                    "Nu apar pe Google Maps pentru căutări locale",
                    "Lipsa dovezilor sociale (poze cu lucrări, testimoniale)",
                    "Concurență de la firme mari cu site-uri profesionale",
                    "Pierd comenzi pentru că nu au prezență online credibilă"
                ],
            },
            {
                name: "Firmă Panouri Fotovoltaice & Energie Verde",
                slug: "panouri-fotovoltaice",
                pain_points_cache: [
                    "Piață foarte competitivă - vizibilitate scăzută",
                    "Lipsa conținutului educațional despre ROI și subvenții",
                    "Site-uri vechi care nu arată profesionalism",
                    "Nu captează lead-uri calificate (calculatoare, oferte)",
                    "Costuri mari cu agențiile de marketing"
                ],
            },
            {
                name: "Service Auto & ITP",
                slug: "service-auto-itp",
                pain_points_cache: [
                    "Clienți puțini în afara cartierului",
                    "Concurență de la lanțuri auto (Bosch, etc.)",
                    "Nu apar pe căutări Google Maps pentru 'service auto lângă mine'",
                    "Lipsa sistemului de programări online",
                    "Recenzii negative pe Google - nu le gestionează"
                ],
            },
            {
                name: "Clinică Estetică & Dermatologie",
                slug: "clinica-estetica",
                pain_points_cache: [
                    "Concurență uriașă de la clinici cu bugete mari",
                    "Lipsa conținutului vizual (before/after, video)",
                    "Nu captează lead-uri pentru tratamente premium",
                    "Site vechi care nu inspiră încredere medicală",
                    "Costuri prohibitive cu agențiile de marketing medical"
                ],
            },
            {
                name: "Agent Imobiliar",
                slug: "agent-imobiliar",
                pain_points_cache: [
                    "Dependență totală de portaluri (Storia, Imobiliare.ro) - costuri mari",
                    "Site propriu învechit sau inexistent",
                    "Nu captează lead-uri organice din Google",
                    "Lipsa conținutului cu ghiduri (cumpărare, închiriere, credite)",
                    "Concurență de la agenții mari cu platforme moderne"
                ],
            },
            {
                name: "Arhitect & Design Interior",
                slug: "arhitect-design",
                pain_points_cache: [
                    "Portfolio pe Instagram - nesigur și limitat",
                    "Lipsa site-ului profesional cu proiecte",
                    "Nu apar pe Google pentru căutări locale (arhitect + oraș)",
                    "Pierd clienți premium care verifică online",
                    "Costuri mari cu agențiile de web design"
                ],
            },
            {
                name: "Service GSM & Laptopuri",
                slug: "service-gsm-laptopuri",
                pain_points_cache: [
                    "Clienți doar din cartier - limitat",
                    "Concurență de la lanțuri (iStyle, AROBS, etc.)",
                    "Nu apar pe Google Maps pentru căutări urgente",
                    "Lipsa sistemului de comenzi online (piese, reparații)",
                    "Site vechi sau Facebook ca singură prezență online"
                ],
            },
            {
                name: "Contabil & Expert Financiar",
                slug: "contabil-expert-financiar",
                pain_points_cache: [
                    "Clienți noi doar din recomandări - creștere lentă",
                    "Site vechi (sau inexistent) care nu inspiră profesionalism",
                    "Nu captează lead-uri pentru firme noi (PFA, SRL)",
                    "Lipsa conținutului educațional (ghiduri fiscale, blog)",
                    "Concurență de la platforme automatizate (SmartBill, etc.)"
                ],
            },
        ];

        // Insert all niches
        const insertedIds = [];
        for (const niche of niches) {
            const id = await ctx.db.insert("niches", {
                ...niche,
                created_at: now,
            });
            insertedIds.push(id);
        }

        console.log(`Successfully seeded ${insertedIds.length} niches`);

        return {
            message: "Successfully seeded niches",
            count: insertedIds.length,
            niches: insertedIds,
        };
    },
});

/**
 * Clear all niches (use with caution!)
 */
export const clearNiches = mutation({
    args: {},
    handler: async (ctx) => {
        const allNiches = await ctx.db.query("niches").collect();

        for (const niche of allNiches) {
            await ctx.db.delete(niche._id);
        }

        return { message: "All niches cleared", count: allNiches.length };
    },
});
