/**
 * Example usage of the Architect Agent
 * Demonstrates how to use the strategic reasoning component
 */

import { ArchitectAgent } from './index';
import type { NicheInput, ArchitectBrief } from './types';

/**
 * Example 1: Dental Clinic niche
 */
async function exampleDentalClinic() {
  // Initialize Architect Agent
  const architect = new ArchitectAgent({
    apiKey: process.env.ANTHROPIC_API_KEY, // Or undefined for mock mode
    model: 'claude-3-5-sonnet-20241022',
    language: 'ro',
    mockMode: !process.env.ANTHROPIC_API_KEY, // Use mock if no API key
  });

  // Test connection (optional)
  const isConnected = await architect.testConnection();
  console.log('AI Service connected:', isConnected);

  // Define niche input
  const nicheInput: NicheInput = {
    businessType: 'cabinet stomatologic',
    painPoint: 'lipsa pacienților noi și dependența de recomandări',
    targetAudience: 'proprietari cabinete dentare din orașe mijlocii',
    location: 'România',
  };

  // Generate strategic brief
  console.log('\n=== Starting Architect Analysis ===\n');
  const brief = await architect.analyze(nicheInput);

  // Display results
  console.log('\n=== ARCHITECT BRIEF ===\n');
  console.log('Generated at:', brief.generatedAt);
  console.log('Target word count:', brief.targetWordCount);
  console.log('Estimated read time:', brief.estimatedReadTime, 'minutes');

  console.log('\n--- LSI Keywords ---');
  brief.lsiKeywords.forEach((keyword, i) => {
    console.log(`${i + 1}. ${keyword}`);
  });

  console.log('\n--- Hook Angle ---');
  console.log('Statement:', brief.hookAngle.statement);
  console.log('Emotion:', brief.hookAngle.emotion);
  console.log('Reasoning:', brief.hookAngle.reasoning);

  console.log('\n--- Objections ---');
  brief.objections.forEach((objection) => {
    console.log(`\n${objection.id}. [${objection.category}]`);
    console.log('   Objection:', objection.text);
    console.log('   Strategy:', objection.rebuttalStrategy);
  });

  console.log('\n--- Content Outline ---');
  brief.contentOutline.forEach((section, i) => {
    console.log(`\n${i + 1}. ${section.title}`);
    console.log('   Purpose:', section.purpose);
    console.log('   Tone:', section.tone);
    console.log('   Key Points:', section.keyPoints.length);
    console.log('   LSI Keywords:', section.lsiKeywords.join(', '));
  });

  console.log('\n--- Call to Action ---');
  console.log(brief.callToAction);

  console.log('\n--- Competitor Insights ---');
  brief.competitorInsights.forEach((insight, i) => {
    console.log(`${i + 1}. ${insight}`);
  });

  // Export to JSON
  const exportedBrief = architect.exportBrief(brief);
  console.log('\n=== Brief exported to JSON (first 500 chars) ===');
  console.log(exportedBrief.substring(0, 500) + '...');

  return brief;
}

/**
 * Example 2: Beauty Salon niche
 */
async function exampleBeautySalon() {
  const architect = new ArchitectAgent({
    language: 'ro',
    mockMode: true, // Using mock mode
  });

  const nicheInput: NicheInput = {
    businessType: 'salon de înfrumusețare',
    painPoint: 'programări anulate și locuri libere neocupate',
    targetAudience: 'proprietare saloane de beauty',
  };

  const brief = await architect.analyze(nicheInput);

  console.log('\n=== Beauty Salon Brief Summary ===');
  console.log('Hook:', brief.hookAngle.statement);
  console.log('Sections:', brief.contentOutline.length);
  console.log('Keywords:', brief.lsiKeywords.length);

  return brief;
}

/**
 * Example 3: Law Firm niche
 */
async function exampleLawFirm() {
  const architect = new ArchitectAgent({
    language: 'ro',
    mockMode: true,
  });

  const nicheInput: NicheInput = {
    businessType: 'cabinet avocatură',
    painPoint: 'clienți care aleg avocatul doar pe bază de preț',
    targetAudience: 'avocați și case de avocatură boutique',
  };

  const brief = await architect.analyze(nicheInput);

  console.log('\n=== Law Firm Brief Summary ===');
  console.log('Hook:', brief.hookAngle.statement);
  console.log('Objections:', brief.objections.map((o) => o.category).join(', '));

  return brief;
}

/**
 * Run all examples
 */
async function runExamples() {
  try {
    // Example 1: Full detailed output for dental clinic
    await exampleDentalClinic();

    // Example 2: Beauty salon
    await exampleBeautySalon();

    // Example 3: Law firm
    await exampleLawFirm();
  } catch (error) {
    console.error('Error running examples:', error);
  }
}

// Run if executed directly
if (require.main === module) {
  runExamples();
}

export { exampleDentalClinic, exampleBeautySalon, exampleLawFirm };
