# WebNova.ro - SaaS Platform

Platformă SaaS de tip "Website-as-a-Service" care generează automat site-uri optimizate pentru Google și AI Search folosind Google Gemini AI.

## Tech Stack

- **Frontend:** Next.js 15 (App Router) + Tailwind CSS + Shadcn/UI + Lucide React
- **Backend:** Convex (Backend-as-a-Service)
- **AI Engine:** Google Gemini 1.5 Flash
- **Indexing:** Google Indexing API

## Configurare Inițială

### 1. Instalare dependențe

```bash
npm install
```

### 2. Configurare Convex

Convex este deja configurat! URL-ul de deployment este:
- **Deployment:** `tough-fly-260`
- **URL:** `https://tough-fly-260.convex.cloud`

Accesați dashboard-ul Convex: https://dashboard.convex.dev/d/tough-fly-260

### 3. Variabile de mediu

Trebuie să configurați următoarele variabile în fișierul `.env.local`:

#### Google Gemini API Key

1. Accesați: https://aistudio.google.com/app/apikey
2. Creați un API key nou
3. Adăugați în `.env.local`:

```bash
GOOGLE_GEMINI_API_KEY=your_api_key_here
```

#### Google Indexing API

1. Accesați Google Cloud Console: https://console.cloud.google.com
2. Creați un proiect nou sau selectați unul existent
3. Activați "Indexing API" din APIs & Services
4. Creați un Service Account cu rol "Indexing API"
5. Generați o cheie JSON pentru Service Account
6. Adăugați JSON-ul complet (ca string) în `.env.local`:

```bash
GOOGLE_INDEXING_KEY='{"type":"service_account",...}'
```

### 4. Inițializarea bazei de date

Pentru a popula baza de date cu cele 10 nișe românești:

1. Accesați Convex Dashboard: https://dashboard.convex.dev/d/tough-fly-260
2. Navigați la "Functions" → "mutations" → "init" → "seedNiches"
3. Apăsați "Run" (fără argumente)

Aceasta va adăuga:
- Medic Stomatolog
- Avocat Drept Penal
- Instalator Sanitar
- Panouri Fotovoltaice
- Service Auto & ITP
- Clinică Estetică
- Agent Imobiliar
- Arhitect & Design
- Service GSM
- Contabil

## Rulare Development

```bash
# Terminal 1: Convex backend
npx convex dev

# Terminal 2: Next.js frontend
npm run dev
```

Accesați aplicația la: http://localhost:3000

## Generare Landing Pages

### Metoda 1: Din Convex Dashboard

1. Accesați dashboard-ul Convex
2. Navigați la "Functions" → "actions" → "gemini" → "generateLandingPage"
3. Furnizați argumentele:
   ```json
   {
     "nicheName": "Medic Stomatolog (Clinică Dentară)",
     "nicheSlug": "medic-stomatolog"
   }
   ```
4. Apăsați "Run"
5. Copiați răspunsul JSON
6. Navigați la "mutations" → "admin" → "createPageFromContent"
7. Furnizați:
   ```json
   {
     "nicheId": "id_from_niches_table",
     "content": {/* paste JSON from step 5 */}
   }
   ```
8. Publicați pagina: "mutations" → "pages" → "publishPage"

### Metoda 2: Programatic (viitor)

Vom adăuga un endpoint API sau admin panel pentru automatizare completă.

## Structura proiectului

```
webnova/
├── app/
│   ├── layout.tsx                 # Root layout cu Convex provider
│   └── solutii/[slug]/page.tsx   # Dynamic landing pages
├── components/
│   └── landing/
│       ├── HeroSection.tsx       # Hero cu gradient
│       ├── AIOSnippet.tsx        # Snippet pentru AI Search
│       ├── PainPoints.tsx        # Grid de probleme
│       ├── ComparisonTable.tsx   # Tabel comparativ
│       └── FAQAccordion.tsx      # FAQ accordion
├── convex/
│   ├── schema.ts                 # Schema DB
│   ├── actions/
│   │   ├── gemini.ts            # AI Engine
│   │   └── indexing.ts          # Google Indexing API
│   ├── mutations/
│   │   ├── pages.ts             # CRUD pagini
│   │   ├── init.ts              # Seed data
│   │   └── admin.ts             # Admin utilities
│   ├── queries/
│   │   └── pages.ts             # Query-uri
│   ├── crons.ts                 # Cron jobs
│   └── crons/
│       └── processPendingIndexing.ts
├── lib/
│   └── json-ld.ts               # SEO schemas
└── providers/
    └── ConvexClientProvider.tsx  # Convex wrapper
```

## Deployment

### Frontend (Vercel)

```bash
npm run build
vercel deploy --prod
```

### Backend (Convex)

```bash
npx convex deploy
```

## Funcționalități implementate

✅ **Module 1:** Schema bază de date cu niches și generated_pages  
✅ **Module 2:** Gemini AIO Engine cu sistem de copywriting românesc  
✅ **Module 3:** Frontend cu componente AIO-optimizate și JSON-LD  
✅ **Module 4:** Auto-indexing cu Google Indexing API (cron hourly)  
✅ **Module 5:** Seed data cu 10 nișe românești profitabile  

## Următorii pași

1. ⏳ Adăugați API keys în `.env.local`
2. ⏳ Rulați seed data pentru nișe
3. ⏳ Generați prima landing page de test
4. ⏳ Testați SEO și JSON-LD cu Google Rich Results Test
5. ⏳ Configurați domeniul webnova.ro pentru production

## Suport

Pentru întrebări sau probleme, consultați documentația:
- Convex: https://docs.convex.dev
- Next.js: https://nextjs.org/docs
- Google Gemini: https://ai.google.dev/docs
# webnova
