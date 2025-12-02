/**
 * Writer Agent Prompts
 * Dan Kennedy-style direct response copywriting prompts for Romanian B2B markets
 */

/**
 * System prompt for Writer Agent
 * Establishes tone, voice, and writing rules
 */
export const WRITER_SYSTEM_PROMPT = `Tu ești un copywriter specialist în direct response marketing, antrenat în stilul Dan Kennedy.

TONUL VOCAL:
- Scurt, percutant, fără fluff
- Autoritar dar empatic față de durerea clientului
- Agresiv pe soluție, nu pe problemă
- Folosești exemple concrete, nu generalizări
- Vorbești direct, la persoana a 2-a ("tu", "afacerea ta")

REGULI LINGVISTICE (OBLIGATORII):
- Scrii DOAR în limba română
- Folosești diacritice corecte (ș, ț, ă, î, â) - FĂRĂ EXCEPȚII
- Eviti anglicismele inutile
- Folosești termeni din industrie (LSI keywords)

STILUL DAN KENNEDY:
1. Fiecare propoziție trebuie să miște cititorul mai aproape de decizie
2. Agitează durerea înainte să prezinți soluția
3. Folosește specificitate: numere, procente, exemple concrete
4. Creează urgență autentică (nu artificială)
5. Propoziții scurte. Paragrafe scurte. Impact maxim.

INTERZIS:
- Clișee de marketing ("soluție revoluționară", "cel mai bun")
- Generalizări goale ("servicii de calitate")
- Limaj corporate steril
- Propoziții de peste 25 de cuvinte
- Pasiv și condiționali excesivi`;

/**
 * Hero Section Prompt
 * Generates H1 and subheadline that hit the pain point immediately
 */
export function generateHeroPrompt(
  businessEntity: string,
  painPoint: string,
  hookAngle: string,
  lsiKeywords: string[]
): string {
  return `Creează secțiunea HERO pentru o landing page B2B în limba română.

CONTEXT:
- Business Entity: ${businessEntity}
- Pain Point Principal: ${painPoint}
- Hook Angle: ${hookAngle}
- LSI Keywords disponibili: ${lsiKeywords.slice(0, 10).join(', ')}

TASK:
Scrie un H1 și un subheadline care:

1. H1 TREBUIE să includă:
   - "Web Design pentru [Business Entity]"
   - "+ SEO Inclus" sau "cu SEO Inclus"
   - Maxim 70 caractere

2. SUBHEADLINE trebuie să:
   - Lovească pain point-ul direct
   - Promită transformarea specifică
   - Folosească un LSI keyword natural
   - 120-150 caractere

EXEMPLE BUNE:
- H1: "Web Design pentru Cabinet Stomatologic cu SEO Inclus"
- Subheadline: "Transformă scaunul gol în programări pline. Site modern + Google Maps înseamnă pacienți noi în fiecare săptămână."

OUTPUTUL tău trebuie să fie JSON:
{
  "h1": "...",
  "subheadline": "..."
}`;
}

/**
 * AIO Definition Block Prompt
 * Optimized for Google AI Overview - structured, clear, authoritative
 */
export function generateAIOPrompt(
  businessEntity: string,
  technicalBenefit: string,
  lsiKeywords: string[]
): string {
  return `Creează blocul de DEFINIȚIE optimizat pentru Google AI Overview (AIO).

CONTEXT:
- Business Entity: ${businessEntity}
- Technical Benefit: ${technicalBenefit}
- LSI Keywords: ${lsiKeywords.slice(0, 8).join(', ')}

TASK:
Scrie un paragraf de 150-200 cuvinte care răspunde implicit la întrebarea:
"Ce trebuie să aibă un site modern pentru [Business Entity]?"

STRUCTURA:
1. Propoziție de definiție (ce este)
2. De ce contează (importanța)
3. Ce include (componentele cheie - menționează 4-5 LSI keywords natural)
4. Rezultatul final (transformarea)

STILUL AIO:
- Autoritar, educațional
- Structură clară, ușor de scanat
- Optimizat pentru featured snippets
- Include termeni tehnici explicați simplu

IMPORTANT:
- Folosește diacritice corecte
- Încadrează LSI keywords natural în context
- Evită vânzarea directă, concentrează-te pe educație

Returnează DOAR textul paragrafului, fără formatare suplimentară.`;
}

/**
 * Pain Agitation Prompt
 * Amplifies the problem, shows cost of inaction with concrete examples
 */
export function generatePainAgitationPrompt(
  businessEntity: string,
  painPoint: string,
  hookAngle: string,
  professionalSingular: string
): string {
  return `Creează secțiunea de PAIN AGITATION în stilul Dan Kennedy.

CONTEXT:
- Business: ${businessEntity}
- Pain Point: ${painPoint}
- Hook Angle: ${hookAngle}
- Profesia: ${professionalSingular}

TASK:
Scrie 300-400 cuvinte care AGITĂ durerea înainte de soluție.

STRUCTURA NARRATIVĂ:
1. DESCHIDERE: Hook angle sau statistică șocantă
2. PROBLEMA VIZIBILĂ: Ce vede proprietarul (simptome)
3. PROBLEMA REALĂ: Adevărata cauză pe care n-o vede
4. COSTUL CONCRET: Calculează pierderea în RON/lună
5. URGENȚĂ: De ce amânarea costă și mai mult

FORMULA DAN KENNEDY:
- Vorbește ca și cum ai avea conversația la o cafea
- Folosește exemple concrete: "Un pacient care caută pe Google la ora 22:00..."
- Cuantifică pierderea: "15 pacienți pierduți × 500 RON consultație × 3 vizite = 22,500 RON/lună"
- Agitează fără să sperii: empatie + autoritate

STILUL PROPOZIȚIEI:
- Scurte. Percutante.
- Variază lungimea pentru ritm.
- O idee per propoziție.
- Evită "și", "dar", "sau" în exces.

TONUL:
- Serios dar nu apocaliptic
- Empatic față de greutăți
- Autoritar pe soluție

Returnează DOAR textul, formatat cu paragrafe scurte (3-4 propoziții per paragraf).`;
}

/**
 * Comparison Table Prompt
 * Shows transformation: Generic Agency vs Webnova or Old vs New
 */
export function generateComparisonTablePrompt(
  businessEntity: string,
  competitorInsights: string[],
  technicalBenefit: string
): string {
  return `Creează un tabel de COMPARAȚIE pentru landing page B2B în română.

CONTEXT:
- Business: ${businessEntity}
- Insights Competitive: ${competitorInsights.join(' | ')}
- Beneficii Tehnice: ${technicalBenefit}

TASK:
Creează un tabel cu 3 coloane și 6-8 rânduri care compară:

COLOANE:
1. "Agenție Web Generică"
2. "Webnova" (noi)
3. "Rezultat pentru Tine"

RÂNDURI (6-8 comparații):
- Concentrează-te pe features concrete, nu pe promisiuni vagi
- Arată DIFERENȚA clară în abordare
- Coloana 3 trebuie să traducă diferența în rezultat business

STILUL:
- Coloane 1: Problema/lipsa
- Coloana 2: Soluția noastră specifică
- Coloana 3: Impactul măsurabil

EXEMPLE BUNE:
| Agenție Generică | Webnova | Rezultat |
| Site "frumos" care nu aduce clienți | Site optimizat Core Web Vitals + Schema SEO | Apari în top 3 Google în 90 zile |
| Template WordPress cu 40 plugin-uri | Cod custom, 0.8s viteză încărcare | Pacienți nu abandonează site-ul |

OUTPUTUL tău trebuie să fie JSON:
{
  "headers": ["Agenție Web Generică", "Webnova", "Rezultat pentru Tine"],
  "rows": [
    ["...", "...", "..."],
    ["...", "...", "..."]
  ]
}

IMPORTANT: 6-8 rânduri, fiecare cu 3 celule. Fii specific, nu generic.`;
}

/**
 * Technical Solution Prompt
 * Explains Core Web Vitals, Schema, Speed in business terms (money-making features)
 */
export function generateTechnicalSolutionPrompt(
  businessEntity: string,
  technicalBenefit: string,
  lsiKeywords: string[]
): string {
  return `Creează secțiunea SOLUȚIE TEHNICĂ tradusă în limbaj business.

CONTEXT:
- Business: ${businessEntity}
- Beneficiu Tehnic: ${technicalBenefit}
- LSI Keywords: ${lsiKeywords.slice(0, 10).join(', ')}

TASK:
Scrie 350-450 cuvinte care explică TEHNOLOGIA ca "features care aduc bani", nu buzzwords.

FEATURES DE EXPLICAT (în termeni simpli):
1. Core Web Vitals = Viteza site-ului care previne abandonarea
2. Schema.org Markup = Casetele colorate din Google cu stele și program
3. Mobile-First Design = 70% din clienții tăi caută de pe telefon
4. Semantic HTML = Google înțelege ce vinzi, te pune sus

FORMULA DE TRADUCERE:
- "Core Web Vitals" → "Site-ul tău se încarcă în sub 1 secundă, chiar și pe 4G"
- "Schema Markup" → "Apari în Google cu stele, program, telefon - direct vizibil"
- "Mobile Responsive" → "Clientul vede tot perfect pe telefon, nu trebuie să mărească"

STRUCTURA:
1. Introducere: De ce tehnologia contează pentru afacere
2. Feature 1: Nume tehnic + traducere business + exemplu concret
3. Feature 2: Idem
4. Feature 3: Idem
5. Feature 4: Idem
6. Concluzie: Toate împreună = sistem care aduce clienți

STILUL:
- Evită jargonul fără explicație
- Folosește analogii din industria lor
- Conectează fiecare feature la ROI
- Paragrafe de 3-4 propoziții

TONUL:
- Educațional dar accesibil
- Autoritar pe tehnologie
- Empatic cu "nu sunt IT-ist"

Returnează DOAR textul, formatat cu paragrafe clare și heading-uri pentru fiecare feature.`;
}

/**
 * FAQ Prompt
 * Transforms 5 objections into Q&A format, addressing skepticism directly
 */
export function generateFAQPrompt(
  businessEntity: string,
  objections: Array<{ text: string; category: string; rebuttalStrategy: string }>
): string {
  const objectionsText = objections
    .map((obj, i) => `${i + 1}. ${obj.text}\n   Categorie: ${obj.category}\n   Strategie: ${obj.rebuttalStrategy}`)
    .join('\n\n');

  return `Creează secțiunea FAQ din OBIECȚII în stilul Dan Kennedy.

CONTEXT:
- Business: ${businessEntity}
- Obiecții identificate:
${objectionsText}

TASK:
Transformă fiecare obiecție în pereche întrebare-răspuns.

REGULI PENTRU ÎNTREBĂRI:
- Reformulează obiecția ca întrebare pe care și-o pune proprietarul
- Păstrează limbajul natural, nu-l formaliza
- Exemplu: "E prea scump" → "Cât costă un site cu SEO inclus și merită investiția?"

REGULI PENTRU RĂSPUNSURI:
- 80-120 cuvinte per răspuns
- STRUCTURĂ: Validare + Răsturnare + Dovadă + Acțiune
  1. Validare: "Înțeleg, mulți proprietari..."
  2. Răsturnare: "Dar iată ce nu iei în calcul..."
  3. Dovadă: Exemplu concret sau cifre
  4. Acțiune: "Începe cu..." sau "Gândește-te așa..."

STILUL:
- Direct, ca într-o conversație
- Fără evaziuni sau răspunsuri politicoase
- Specificity beats generality
- Adresează frica reală din spatele obiecției

TONUL:
- Empatic dar autoritar
- "Am auzit asta de 100 de ori, iată realitatea..."
- Nu te apăra, educă

OUTPUT JSON:
{
  "faqSection": [
    {
      "question": "...",
      "answer": "..."
    }
  ]
}

Creează EXACT 5 perechi Q&A, una pentru fiecare obiecție.`;
}

/**
 * Call to Action Prompt
 * Emotional, urgent closing that drives action without being pushy
 */
export function generateCTAPrompt(
  businessEntity: string,
  painPoint: string,
  professionalSingular: string
): string {
  return `Creează secțiunea CALL TO ACTION în stilul Dan Kennedy pentru B2B românesc.

CONTEXT:
- Business: ${businessEntity}
- Pain Point: ${painPoint}
- Profesia: ${professionalSingular}

TASK:
Scrie CTA în 3 componente:

1. HEADLINE (8-12 cuvinte):
   - Urgență autentică (nu artificială cu countdown)
   - Conectare emoțională la pain point
   - Promisiunea finală

2. BODY (120-180 cuvinte):
   - Recapitulare emoțională a călătoriei
   - Costul de a nu acționa ACUM
   - Ușurința primului pas
   - Garanția sau risk reversal

3. BUTTON TEXT (3-5 cuvinte):
   - Acțiune specifică, nu "Trimite" sau "Contactează-ne"
   - Exemplu: "Vreau Audit Gratuit" sau "Rezervă Consultația"

FORMULA DAN KENNEDY PENTRU CTA:
- Vorbește despre ei, nu despre tine
- "Tu pierzi X pe zi" nu "Noi oferim Y"
- Urgență: "Fiecare zi înseamnă..." nu "Ofertă limitată!"
- Scade fricția: "15 minute, zero presiune"

TONUL:
- Urgent dar nu disperat
- Empatic cu teama de a decide
- Confident în transformare

OUTPUT JSON:
{
  "headline": "...",
  "body": "...",
  "buttonText": "..."
}

IMPORTANT: Body-ul trebuie să fie un singur paragraf fluid, nu listă de bullet points.`;
}

/**
 * Meta Tags Prompt
 * SEO-optimized title and description
 */
export function generateMetaTagsPrompt(
  businessEntity: string,
  primaryKeyword: string,
  painPoint: string
): string {
  return `Creează meta tags SEO pentru landing page B2B în română.

CONTEXT:
- Business Entity: ${businessEntity}
- Primary Keyword: ${primaryKeyword}
- Pain Point: ${painPoint}

TASK:
Creează meta title și meta description care respectă best practices SEO.

META TITLE (50-60 caractere):
- Trebuie să includă: [Business Entity] + "SEO" + "Webnova"
- Exemplu: "Site Web Cabinet Stomatologic + SEO Inclus | Webnova"
- Încadrează-te strict în 60 caractere

META DESCRIPTION (150-160 caractere):
- Propoziție 1: Ce oferim specific pentru [Business Entity]
- Propoziție 2: Beneficiul principal sau transformarea
- Include 1-2 LSI keywords natural
- Exemplu: "Creăm site-uri pentru cabinete stomatologice cu SEO inclus. Programări online, Google Maps și viteza de încărcare sub 1s. Pacienți noi în 30 de zile."

OUTPUT JSON:
{
  "metaTitle": "...",
  "metaDescription": "..."
}

VERIFICĂRI:
- Meta title: maxim 60 caractere (cu tot cu spații și pipe)
- Meta description: 150-160 caractere
- Diacritice corecte
- Nu folosi ghilimele sau caractere speciale`;
}

/**
 * Schema Data Prompt
 * Generates JSON-LD structured data
 */
export function generateSchemaPrompt(
  businessEntity: string,
  slug: string,
  faqItems: Array<{ question: string; answer: string }>
): string {
  const faqText = faqItems.map((item, i) => `Q${i + 1}: ${item.question}\nA${i + 1}: ${item.answer}`).join('\n\n');

  return `Creează Schema.org JSON-LD pentru landing page.

CONTEXT:
- Business: ${businessEntity}
- URL Slug: ${slug}
- FAQ Items:
${faqText}

TASK:
Generează 3 schema markup objects:

1. PRODUCT SCHEMA:
{
  "@context": "https://schema.org",
  "@type": "Product",
  "name": "Web Design cu SEO pentru [Business Entity]",
  "description": "...",
  "provider": {
    "@type": "Organization",
    "name": "Webnova"
  },
  "areaServed": "România"
}

2. FAQ SCHEMA:
{
  "@context": "https://schema.org",
  "@type": "FAQPage",
  "mainEntity": [
    {
      "@type": "Question",
      "name": "...",
      "acceptedAnswer": {
        "@type": "Answer",
        "text": "..."
      }
    }
  ]
}

3. BREADCRUMB SCHEMA:
{
  "@context": "https://schema.org",
  "@type": "BreadcrumbList",
  "itemListElement": [
    {
      "@type": "ListItem",
      "position": 1,
      "name": "Acasă",
      "item": "https://webnova.ro"
    },
    {
      "@type": "ListItem",
      "position": 2,
      "name": "[Business Entity]",
      "item": "https://webnova.ro/${slug}"
    }
  ]
}

OUTPUT JSON:
{
  "product": { ... },
  "faq": { ... },
  "breadcrumb": { ... }
}

Returnează JSON valid, cu toate câmpurile completate.`;
}

/**
 * Internal Links Prompt
 * Generates contextual internal links to related niche pages
 */
export function generateInternalLinksPrompt(
  businessEntity: string,
  relatedNiches: string[]
): string {
  return `Creează link-uri interne contextuale pentru secțiunea de related services.

CONTEXT:
- Business Principal: ${businessEntity}
- Nișe Conexe: ${relatedNiches.join(', ')}

TASK:
Pentru fiecare nișă conexă, creează anchor text natural și relevant.

REGULI:
- Anchor text trebuie să sune natural în context
- Nu folosi "click aici" sau "vezi aici"
- Include beneficiul sau serviciul specific
- Exemplu: "site optimizat pentru cabinet veterinar" (NU "cabinet veterinar" simplu)

OUTPUT JSON:
{
  "internalLinks": [
    {
      "text": "Web design pentru cabinet veterinar cu programări online",
      "slug": "cabinet-veterinar"
    }
  ]
}

Generează exact ${relatedNiches.length} link-uri, unul pentru fiecare nișă.`;
}
