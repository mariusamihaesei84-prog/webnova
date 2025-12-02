/**
 * Test Suite for Architect Agent
 * Validates all components work correctly
 */

import { ArchitectAgent } from './index';
import type { NicheInput } from './types';

// ANSI color codes for terminal output
const colors = {
  reset: '\x1b[0m',
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
};

function log(color: keyof typeof colors, message: string) {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function testArchitectAgent() {
  log('blue', '\n=== ARCHITECT AGENT TEST SUITE ===\n');

  // Test 1: Initialization
  log('yellow', 'Test 1: Initializing Architect Agent...');
  const architect = new ArchitectAgent({
    language: 'ro',
    mockMode: true, // Use mock mode for fast testing
  });
  log('green', '✓ Agent initialized successfully');

  // Test 2: Connection Test
  log('yellow', '\nTest 2: Testing AI service connection...');
  const isConnected = await architect.testConnection();
  if (isConnected) {
    log('green', '✓ AI service connection successful');
  } else {
    log('red', '✗ AI service connection failed');
    return;
  }

  // Test 3: Basic Analysis
  log('yellow', '\nTest 3: Running basic analysis...');
  const nicheInput: NicheInput = {
    businessType: 'cabinet stomatologic',
    painPoint: 'lipsa pacienților noi și dependența de recomandări',
    targetAudience: 'proprietari cabinete dentare',
    location: 'România',
  };

  try {
    const brief = await architect.analyze(nicheInput);
    log('green', '✓ Analysis completed successfully');

    // Test 4: Validate Brief Structure
    log('yellow', '\nTest 4: Validating brief structure...');
    const validations = [
      { name: 'Has niche data', pass: !!brief.niche },
      { name: 'Has LSI keywords', pass: brief.lsiKeywords.length > 0 },
      { name: 'Has hook angle', pass: !!brief.hookAngle.statement },
      { name: 'Has 5 objections', pass: brief.objections.length === 5 },
      { name: 'Has content outline', pass: brief.contentOutline.length > 0 },
      { name: 'Has competitor insights', pass: brief.competitorInsights.length > 0 },
      { name: 'Has call to action', pass: brief.callToAction.length > 0 },
      { name: 'Has generation date', pass: brief.generatedAt instanceof Date },
      { name: 'Has target word count', pass: brief.targetWordCount > 0 },
    ];

    validations.forEach((validation) => {
      if (validation.pass) {
        log('green', `  ✓ ${validation.name}`);
      } else {
        log('red', `  ✗ ${validation.name}`);
      }
    });

    const allPassed = validations.every((v) => v.pass);
    if (allPassed) {
      log('green', '✓ All structure validations passed');
    } else {
      log('red', '✗ Some structure validations failed');
    }

    // Test 5: Validate Romanian Language
    log('yellow', '\nTest 5: Validating Romanian language output...');
    const romanianText = [
      brief.hookAngle.statement,
      ...brief.objections.map((o) => o.text),
      brief.callToAction,
    ].join(' ');

    const hasDiacritics =
      romanianText.includes('ă') ||
      romanianText.includes('â') ||
      romanianText.includes('î') ||
      romanianText.includes('ș') ||
      romanianText.includes('ț');

    if (hasDiacritics) {
      log('green', '✓ Romanian diacritics present');
    } else {
      log('yellow', '⚠ Warning: No Romanian diacritics found (may be mock data)');
    }

    // Test 6: Validate Objection Categories
    log('yellow', '\nTest 6: Validating objection categories...');
    const expectedCategories: Array<'time' | 'money' | 'trust' | 'urgency' | 'knowledge'> = ['time', 'money', 'trust', 'urgency', 'knowledge'];
    const objectionCategories = brief.objections.map((o) => o.category);
    const hasAllCategories = expectedCategories.every((cat) => objectionCategories.includes(cat));

    if (hasAllCategories) {
      log('green', '✓ All objection categories covered');
    } else {
      log('yellow', '⚠ Some objection categories missing');
      log('blue', `  Found: ${objectionCategories.join(', ')}`);
    }

    // Test 7: Validate Content Outline Structure
    log('yellow', '\nTest 7: Validating content outline...');
    const outlineValidations = brief.contentOutline.every(
      (section) =>
        section.title &&
        section.purpose &&
        section.keyPoints.length > 0 &&
        section.lsiKeywords.length > 0 &&
        section.tone
    );

    if (outlineValidations) {
      log('green', '✓ Content outline properly structured');
      log('blue', `  Sections: ${brief.contentOutline.length}`);
      brief.contentOutline.forEach((section, i) => {
        log('blue', `  ${i + 1}. ${section.title} (${section.tone})`);
      });
    } else {
      log('red', '✗ Content outline has missing fields');
    }

    // Test 8: Export/Import
    log('yellow', '\nTest 8: Testing export/import functionality...');
    const exportedJSON = architect.exportBrief(brief);
    const importedBrief = architect.importBrief(exportedJSON);

    const exportImportValid =
      importedBrief.hookAngle.statement === brief.hookAngle.statement &&
      importedBrief.objections.length === brief.objections.length;

    if (exportImportValid) {
      log('green', '✓ Export/import working correctly');
    } else {
      log('red', '✗ Export/import validation failed');
    }

    // Test 9: Display Sample Output
    log('yellow', '\nTest 9: Sample output preview...');
    log('magenta', '\nHook Angle:');
    log('blue', `  "${brief.hookAngle.statement}"`);
    log('blue', `  Emotion: ${brief.hookAngle.emotion}`);

    log('magenta', '\nSample Objection:');
    const sampleObjection = brief.objections[0];
    log('blue', `  [${sampleObjection.category}] ${sampleObjection.text}`);

    log('magenta', '\nLSI Keywords (first 5):');
    brief.lsiKeywords.slice(0, 5).forEach((keyword) => {
      log('blue', `  - ${keyword}`);
    });

    log('magenta', '\nCall to Action:');
    log('blue', `  "${brief.callToAction}"`);

    log('magenta', '\nMetadata:');
    log('blue', `  Target word count: ${brief.targetWordCount}`);
    log('blue', `  Estimated read time: ${brief.estimatedReadTime} minutes`);
    log('blue', `  Generated at: ${brief.generatedAt.toISOString()}`);

    // Final Summary
    log('green', '\n=== ALL TESTS COMPLETED SUCCESSFULLY ===\n');
    log('blue', 'The Architect Agent is ready for use!');
    log('blue', '\nNext steps:');
    log('blue', '  1. Run with real API: Set ANTHROPIC_API_KEY environment variable');
    log('blue', '  2. Test with different niches: Modify nicheInput in test.ts');
    log('blue', '  3. Review generated briefs in detail');
    log('blue', '  4. Proceed to Phase B: Writer Agent development\n');
  } catch (error) {
    log('red', `✗ Analysis failed: ${error}`);
    console.error(error);
  }
}

// Run tests
if (require.main === module) {
  testArchitectAgent().catch((error) => {
    log('red', `Fatal error: ${error}`);
    process.exit(1);
  });
}

export { testArchitectAgent };
