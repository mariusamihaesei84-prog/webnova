/**
 * Writer Agent Test Suite
 * Tests for Writer Agent functionality
 */

import { WriterAgent } from './index';
import { ArchitectBrief } from '../../types/architect-brief';
import { NicheInput } from '../../types/niche';

/**
 * Create mock architect brief for testing
 */
function createMockArchitectBrief(overrides?: Partial<ArchitectBrief>): ArchitectBrief {
  const nicheInput: NicheInput = {
    professionalSingular: 'Avocat',
    professionalPlural: 'Avocați',
    businessEntity: 'Cabinet de Avocat',
    businessEntitySlug: 'cabinet-avocat',
    endClient: 'Clienți cu probleme juridice',
    primaryPainPoint: 'Nu găsesc clienți noi și depind de recomandări',
    technicalBenefit: 'Site optimizat pentru căutări juridice locale cu formular contact',
    relatedNiches: ['notar-public', 'executor-judecatoresc', 'consultant-fiscal'],
  };

  return {
    niche: nicheInput,
    lsiKeywords: [
      'avocat drept civil',
      'avocat drept penal',
      'consultanță juridică',
      'divorț',
      'succesiuni',
      'drept comercial',
      'litigii',
      'contract',
      'proces',
      'avocat București',
    ],
    hookAngle:
      '67% din avocații tineri închid cabinetul în primii 3 ani din cauza lipsei de clienți noi.',
    skepticalObjections: [
      'Clienții mei vin prin recomandări, nu prin internet',
      'Nu vreau să par că fac reclamă, nu e profesionist',
      'E prea scump pentru un cabinet mic',
      'Nu am timp să învăț marketing digital',
      'Concurența are reclame mari, nu pot compete',
    ],
    contentOutline: {
      hero: 'Focus on client acquisition pain, promise steady flow of quality leads',
      aioStrategy:
        'Define modern law firm website: trust signals, case results, easy contact, local SEO',
      painAgitation:
        'Show cost of relying only on referrals: unpredictable income, can\'t scale, dependent on others',
      comparisonTable: 'Compare: no web presence vs professional site vs generic marketing agency',
      technicalSolution:
        'Explain local SEO, trust signals (schema, reviews), contact forms as client acquisition system',
      faq: 'Address professional reputation concerns, budget objections, time investment, competition',
      cta: 'Offer free competitive analysis of their online presence vs top 3 local competitors',
    },
    generatedAt: new Date(),
    ...overrides,
  };
}

/**
 * Test 1: Writer Agent initialization
 */
async function testInitialization() {
  console.log('\n=== TEST 1: Writer Agent Initialization ===');

  try {
    const writer = new WriterAgent({
      language: 'ro',
      mockMode: true,
      minWordCount: 1500,
    });

    console.log('✓ Writer Agent initialized successfully');

    const connected = await writer.testConnection();
    console.log(`✓ Connection test: ${connected ? 'PASSED' : 'FAILED'}`);

    return connected;
  } catch (error) {
    console.error('✗ Initialization failed:', error);
    return false;
  }
}

/**
 * Test 2: Complete landing page generation
 */
async function testLandingPageGeneration() {
  console.log('\n=== TEST 2: Landing Page Generation ===');

  const writer = new WriterAgent({
    language: 'ro',
    mockMode: true,
    minWordCount: 1500,
  });

  const brief = createMockArchitectBrief();

  try {
    const landingPage = await writer.write(brief);

    // Validate all required fields
    console.log('\nValidating required fields...');
    const requiredFields = [
      'slug',
      'metaTitle',
      'metaDescription',
      'heroSection',
      'aioDefinition',
      'painAgitation',
      'comparisonTable',
      'technicalSolution',
      'faqSection',
      'callToAction',
      'schemaData',
      'internalLinks',
    ];

    let allFieldsPresent = true;
    for (const field of requiredFields) {
      const present = field in landingPage && landingPage[field as keyof typeof landingPage] !== undefined;
      console.log(`  ${present ? '✓' : '✗'} ${field}`);
      if (!present) allFieldsPresent = false;
    }

    if (!allFieldsPresent) {
      throw new Error('Missing required fields in landing page');
    }

    console.log('\n✓ All required fields present');

    // Validate word count
    const calculateWordCount = (obj: any): number => {
      let count = 0;
      const processValue = (value: any) => {
        if (typeof value === 'string') {
          count += value.split(/\s+/).filter((w) => w.length > 0).length;
        } else if (Array.isArray(value)) {
          value.forEach(processValue);
        } else if (typeof value === 'object' && value !== null) {
          Object.values(value).forEach(processValue);
        }
      };
      processValue(obj);
      return count;
    };

    const totalWords = calculateWordCount({
      metaTitle: landingPage.metaTitle,
      metaDescription: landingPage.metaDescription,
      heroSection: landingPage.heroSection,
      aioDefinition: landingPage.aioDefinition,
      painAgitation: landingPage.painAgitation,
      comparisonTable: landingPage.comparisonTable,
      technicalSolution: landingPage.technicalSolution,
      faqSection: landingPage.faqSection,
      callToAction: landingPage.callToAction,
    });

    console.log(`\nTotal word count: ${totalWords}`);
    console.log(`Minimum required: 1500`);
    console.log(`${totalWords >= 1500 ? '✓' : '✗'} Word count requirement ${totalWords >= 1500 ? 'met' : 'NOT MET'}`);

    return totalWords >= 1500;
  } catch (error) {
    console.error('✗ Landing page generation failed:', error);
    return false;
  }
}

/**
 * Test 3: Validate Romanian language and diacritics
 */
async function testRomanianLanguage() {
  console.log('\n=== TEST 3: Romanian Language Validation ===');

  const writer = new WriterAgent({
    language: 'ro',
    mockMode: true,
  });

  const brief = createMockArchitectBrief();

  try {
    const landingPage = await writer.write(brief);

    // Check for Romanian diacritics (ă, â, î, ș, ț)
    const textContent = JSON.stringify(landingPage);
    const hasDiacritics = /[ăâîșț]/i.test(textContent);

    console.log(`${hasDiacritics ? '✓' : '✗'} Romanian diacritics present`);

    // Check for English words that shouldn't be there (rough check)
    const suspiciousEnglish = /\b(the|and|with|for|design|website|modern)\b/gi;
    const matches = textContent.match(suspiciousEnglish);

    if (matches && matches.length > 5) {
      console.log(`⚠ Warning: Found ${matches.length} potential English words`);
      console.log(`  Examples: ${matches.slice(0, 5).join(', ')}`);
    } else {
      console.log('✓ Language appears to be Romanian');
    }

    return hasDiacritics;
  } catch (error) {
    console.error('✗ Romanian language validation failed:', error);
    return false;
  }
}

/**
 * Test 4: Meta tags length validation
 */
async function testMetaTagsLength() {
  console.log('\n=== TEST 4: Meta Tags Length Validation ===');

  const writer = new WriterAgent({
    language: 'ro',
    mockMode: true,
  });

  const brief = createMockArchitectBrief();

  try {
    const landingPage = await writer.write(brief);

    const titleLength = landingPage.metaTitle.length;
    const descLength = landingPage.metaDescription.length;

    console.log(`Meta Title: ${titleLength} characters (optimal: 50-60)`);
    console.log(`${titleLength <= 60 ? '✓' : '✗'} Title length ${titleLength <= 60 ? 'OK' : 'TOO LONG'}`);

    console.log(`Meta Description: ${descLength} characters (optimal: 150-160)`);
    console.log(`${descLength <= 160 ? '✓' : '✗'} Description length ${descLength <= 160 ? 'OK' : 'TOO LONG'}`);

    return titleLength <= 60 && descLength <= 160;
  } catch (error) {
    console.error('✗ Meta tags validation failed:', error);
    return false;
  }
}

/**
 * Test 5: FAQ section validation
 */
async function testFAQSection() {
  console.log('\n=== TEST 5: FAQ Section Validation ===');

  const writer = new WriterAgent({
    language: 'ro',
    mockMode: true,
  });

  const brief = createMockArchitectBrief();

  try {
    const landingPage = await writer.write(brief);

    console.log(`FAQ items: ${landingPage.faqSection.length}`);
    console.log(`${landingPage.faqSection.length === 5 ? '✓' : '✗'} Expected 5 FAQ items`);

    let allValid = true;
    landingPage.faqSection.forEach((item, i) => {
      const hasQuestion = item.question && item.question.length > 0;
      const hasAnswer = item.answer && item.answer.length > 0;
      const answerLength = item.answer.split(/\s+/).length;

      console.log(`\nFAQ ${i + 1}:`);
      console.log(`  ${hasQuestion ? '✓' : '✗'} Has question`);
      console.log(`  ${hasAnswer ? '✓' : '✗'} Has answer`);
      console.log(`  ${answerLength >= 60 && answerLength <= 150 ? '✓' : '⚠'} Answer length: ${answerLength} words`);

      if (!hasQuestion || !hasAnswer) allValid = false;
    });

    return allValid && landingPage.faqSection.length === 5;
  } catch (error) {
    console.error('✗ FAQ validation failed:', error);
    return false;
  }
}

/**
 * Run all tests
 */
async function runAllTests() {
  console.log('╔════════════════════════════════════════════╗');
  console.log('║   WRITER AGENT TEST SUITE                  ║');
  console.log('╚════════════════════════════════════════════╝');

  const results = {
    initialization: await testInitialization(),
    landingPageGeneration: await testLandingPageGeneration(),
    romanianLanguage: await testRomanianLanguage(),
    metaTagsLength: await testMetaTagsLength(),
    faqSection: await testFAQSection(),
  };

  console.log('\n╔════════════════════════════════════════════╗');
  console.log('║   TEST RESULTS SUMMARY                     ║');
  console.log('╚════════════════════════════════════════════╝\n');

  const passed = Object.values(results).filter((r) => r).length;
  const total = Object.keys(results).length;

  Object.entries(results).forEach(([test, result]) => {
    console.log(`${result ? '✓' : '✗'} ${test}`);
  });

  console.log(`\n${passed}/${total} tests passed`);

  if (passed === total) {
    console.log('\n🎉 All tests passed!');
    return 0;
  } else {
    console.log('\n⚠ Some tests failed');
    return 1;
  }
}

// Run tests if this file is executed directly
if (require.main === module) {
  runAllTests()
    .then((exitCode) => {
      process.exit(exitCode);
    })
    .catch((error) => {
      console.error('\nFatal error:', error);
      process.exit(1);
    });
}

export { runAllTests, createMockArchitectBrief };
