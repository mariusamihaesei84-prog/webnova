/**
 * Technical Solution Generator
 * Explains Core Web Vitals, Schema, Speed in business terms
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { WRITER_SYSTEM_PROMPT, generateTechnicalSolutionPrompt } from '../prompts';

export async function generateTechnicalSolution(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<string> {
  console.log('[Writer/Tech] Generating technical solution section...');

  const prompt = generateTechnicalSolutionPrompt(
    brief.niche.businessEntity,
    brief.niche.technicalBenefit,
    brief.lsiKeywords
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.65,
    maxTokens: 1536,
  });

  const techSection = response.content.trim();

  // Validation
  const wordCount = techSection.split(/\s+/).length;
  if (wordCount < 300) {
    console.warn('[Writer/Tech] Technical solution is too short:', wordCount, 'words');
  }
  if (wordCount > 550) {
    console.warn('[Writer/Tech] Technical solution is too long:', wordCount, 'words');
  }

  // Check for key technical terms that should be explained
  const technicalTerms = [
    'Core Web Vitals',
    'Schema',
    'mobile',
    'vitez',
    'Google',
    'SEO',
  ];
  const mentionedTerms = technicalTerms.filter((term) =>
    techSection.toLowerCase().includes(term.toLowerCase())
  );

  console.log('[Writer/Tech] Technical solution generated successfully');
  console.log(`  - Word count: ${wordCount}`);
  console.log(`  - Technical terms covered: ${mentionedTerms.length}/${technicalTerms.length}`);
  console.log(`  - Terms: ${mentionedTerms.join(', ')}`);
  console.log(`  - Preview: "${techSection.substring(0, 150)}..."`);

  return techSection;
}
