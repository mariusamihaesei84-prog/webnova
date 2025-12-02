import { LandingPageRenderer } from './renderer';
import { RendererConfig } from './types';
import { LandingPage } from '../types/landing-page';

/**
 * Example: Rendering a Landing Page
 *
 * Demonstrates how to use the LandingPageRenderer to generate
 * production-ready HTML from a LandingPage object.
 */

// Configure the renderer
const config: RendererConfig = {
  baseUrl: 'https://webnova.ro',
  siteName: 'Webnova - Site Optimizat pentru Afaceri',
  contact: {
    email: 'contact@webnova.ro',
    phone: '+40 123 456 789',
    address: 'București, România',
  },
  social: {
    facebook: '@webnova',
    twitter: '@webnova',
    linkedin: 'company/webnova',
  },
  defaultOgImage: 'https://webnova.ro/images/og-default.jpg',
  analytics: {
    googleAnalytics: 'G-XXXXXXXXXX',
    googleTagManager: 'GTM-XXXXXXX',
  },
};

// Example landing page data (from WriterAgent)
const examplePage: LandingPage = {
  slug: 'cabinet-stomatologic',
  metaTitle: 'Site Optimizat pentru Cabinet Stomatologic - Atrage Pacienți Noi din Google',
  metaDescription:
    'Transformă cabinetul tău stomatologic cu un site optimizat SEO. Atrage pacienți noi, crește vizibilitatea și domină căutările locale. Consultație gratuită.',

  heroSection: {
    h1: 'Site Optimizat pentru Cabinet Stomatologic',
    subheadline:
      'Atrage mai mulți pacienți prin Google și domină căutările locale cu un site web profesional optimizat SEO',
  },

  aioDefinition:
    'Un Cabinet Stomatologic modern atrage pacienți prin Google folosind tehnici avansate de optimizare SEO. Site-ul web devine cel mai eficient angajat, funcționând 24/7 pentru a genera programări noi și a construi încredere în comunitatea locală. Optimizarea include Google Maps, recenzii verificate și conținut educațional care răspunde la întrebările frecvente ale pacienților.',

  painAgitation: `## Realitatea Dură

Majoritatea cabinetelor stomatologice pierd clienți în fiecare zi fără să știe.

**Problemele pe care le întâmpini:**

- Dependență totală de recomandări personale
- Competitori care domină primele rezultate Google
- Pacienți care te caută dar găsesc alte cabinete
- Lipsă de vizibilitate în Google Maps
- Website învechit sau inexistent
- Zero controlul asupra reputației online

**Consecințele:**

În timp ce aștepți, competitorii tăi investesc în SEO și atrag pacienții pe care tu îi pierzi. Fiecare zi fără optimizare înseamnă bani lăsați pe masă și un calendar de programări gol.`,

  comparisonTable: {
    headers: ['Aspect', 'Fără Site Optimizat', 'Cu Site Optimizat SEO'],
    rows: [
      ['Vizibilitate Google', 'Inexistentă sau pagina 3+', 'Top 3 rezultate locale'],
      ['Programări noi/lună', '5-10 (doar recomandări)', '30-50 (Google + recomandări)'],
      ['Google Maps', 'Lipsă sau fără recenzii', 'Optimizat cu 20+ recenzii'],
      ['Încredere pacienți', 'Scăzută (lipsă prezență)', 'Ridicată (site profesional)'],
      ['Costuri marketing', 'Reclame scumpe offline', 'Trafic organic gratuit'],
      ['Disponibilitate', 'Program limitat', '24/7 generare lead-uri'],
    ],
  },

  technicalSolution: `## Cum Funcționează Site-ul Optimizat

Transformăm cabinetul tău stomatologic într-o mașinărie de atragere pacienți:

### 1. Optimizare SEO Locală

✓ Poziționare pe primele locuri pentru "cabinet stomatologic [oraș]"
✓ Optimizare Google Maps și Google Business Profile
✓ Conținut optimizat pentru căutări locale

### 2. Design Profesional

✓ Design modern care inspiră încredere
✓ Mobile-friendly pentru 70% din vizitatori
✓ Viteza de încărcare sub 2 secunde

### 3. Generare Automată de Lead-uri

✓ Formulare de programare online
✓ Butoane de apel direct
✓ Chat automatizat pentru întrebări frecvente

### 4. Construire Autoritate

✓ Blog cu articole educaționale
✓ Secțiune cu recenzii verificate
✓ Prezentare echipă și clinică

### 5. Tracking și Îmbunătățire

✓ Analiză trafic și comportament vizitatori
✓ A/B testing pentru conversii mai bune
✓ Rapoarte lunare de performanță`,

  faqSection: [
    {
      question: 'Cât timp durează să ajung pe prima pagină Google?',
      answer:
        'De obicei, vezi rezultate în 3-6 luni. Căutările locale (ex: "dentist București") pot apărea mai repede, în 1-2 luni, mai ales dacă optimizezi și Google Maps.',
    },
    {
      question: 'Cât costă un site optimizat SEO pentru cabinet stomatologic?',
      answer:
        'Investiția inițială este între 2.000-5.000 EUR, cu mentenanță lunară de 200-500 EUR. Costurile se recuperează rapid prin pacienți noi - un singur tratament complex poate acoperi investiția.',
    },
    {
      question: 'Am nevoie de cunoștințe tehnice?',
      answer:
        'Nu! Ne ocupăm de tot: design, optimizare, conținut, mentenanță. Tu doar primești rapoarte și pacienți noi. Interface-ul este simplu pentru actualizare program sau servicii.',
    },
    {
      question: 'Ce se întâmplă cu recenziile negative?',
      answer:
        'Răspunsul profesionist la recenzii negative construiește încredere. Te ajutăm să creezi strategii de răspuns și să obții recenzii pozitive de la pacienți mulțumiți.',
    },
    {
      question: 'Cum măsurăm succesul?',
      answer:
        'Tracking complet: poziții Google, trafic website, programări online, apeluri telefonice, cost per achiziție pacient. Rapoarte lunare clare cu metrici concrete.',
    },
  ],

  callToAction: {
    headline: 'Gata să Atragi Mai Mulți Pacienți?',
    body: 'Programează o consultație gratuită și descoperă cum un site optimizat poate transforma cabinetul tău stomatologic.',
    buttonText: 'Solicită Consultație Gratuită',
  },

  schemaData: {
    product: {
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: 'Site Optimizat pentru Cabinet Stomatologic',
      description:
        'Servicii complete de design și optimizare SEO pentru cabinete stomatologice',
      provider: {
        '@type': 'Organization',
        name: 'Webnova',
      },
      areaServed: 'România',
    },
    faq: {
      '@context': 'https://schema.org',
      '@type': 'FAQPage',
      mainEntity: [],
    },
    breadcrumb: {
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: [],
    },
  },

  internalLinks: [
    {
      text: 'Site Optimizat pentru Cabinet Medical',
      slug: 'cabinet-medical',
    },
    {
      text: 'Site Optimizat pentru Clinică Veterinară',
      slug: 'clinica-veterinara',
    },
    {
      text: 'Optimizare SEO Locală pentru Afaceri',
      slug: 'seo-local',
    },
  ],
};

/**
 * Generate HTML
 */
function generateHTML() {
  // Initialize renderer
  const renderer = new LandingPageRenderer(config);

  // Validate page data
  const validation = renderer.validate(examplePage);
  if (!validation.valid) {
    console.error('Validation errors:');
    validation.errors.forEach(error => console.error(`  - ${error}`));
    return;
  }

  // Render complete HTML
  const html = renderer.render(examplePage);

  // Get suggested filename
  const filename = LandingPageRenderer.getFileName(examplePage);

  console.log(`Generated HTML for: ${filename}`);
  console.log(`HTML length: ${html.length} characters`);
  console.log('\nPreview (first 500 chars):');
  console.log(html.substring(0, 500));
  console.log('...\n');

  return {
    html,
    filename,
  };
}

/**
 * Example: Render individual section
 */
function renderIndividualSection() {
  const renderer = new LandingPageRenderer(config);

  // Render just the hero section
  const heroHtml = renderer.renderSection('hero', examplePage.heroSection);
  console.log('Hero Section HTML:');
  console.log(heroHtml);

  // Render just the FAQ section
  const faqHtml = renderer.renderSection('faq', examplePage.faqSection);
  console.log('\nFAQ Section HTML:');
  console.log(faqHtml);
}

// Run examples
if (require.main === module) {
  console.log('=== Landing Page Renderer Example ===\n');

  console.log('1. Generating complete HTML page...\n');
  const result = generateHTML();

  console.log('\n2. Rendering individual sections...\n');
  renderIndividualSection();

  console.log('\n=== Done ===');
  console.log(`\nTo save the HTML file, write it to: output/${result?.filename}`);
}

export { generateHTML, renderIndividualSection, config, examplePage };
