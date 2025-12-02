/**
 * Pain Agitation Section Generator
 * Amplifies the problem with concrete examples before presenting solution
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { WRITER_SYSTEM_PROMPT, generatePainAgitationPrompt } from '../prompts';

export async function generatePainAgitation(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<string> {
  console.log('[Writer/Pain] Generating pain agitation section...');

  const prompt = generatePainAgitationPrompt(
    brief.niche.businessEntity,
    brief.niche.primaryPainPoint,
    brief.hookAngle,
    brief.niche.professionalSingular
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.75,
    maxTokens: 1024,
  });

  const painSection = response.content.trim();

  // Validation
  const wordCount = painSection.split(/\s+/).length;
  if (wordCount < 250) {
    console.warn('[Writer/Pain] Pain agitation is too short:', wordCount, 'words');
  }
  if (wordCount > 500) {
    console.warn('[Writer/Pain] Pain agitation is too long:', wordCount, 'words');
  }

  // Check for Dan Kennedy style markers
  const hasConcreteness = /\d+/.test(painSection); // Contains numbers
  const hasShortSentences = painSection.split('.').some((s) => s.split(/\s+/).length <= 8);

  if (!hasConcreteness) {
    console.warn('[Writer/Pain] Warning: Pain section lacks concrete numbers/specificity');
  }

  console.log('[Writer/Pain] Pain agitation generated successfully');
  console.log(`  - Word count: ${wordCount}`);
  console.log(`  - Contains numbers: ${hasConcreteness}`);
  console.log(`  - Has short sentences: ${hasShortSentences}`);
  console.log(`  - Preview: "${painSection.substring(0, 150)}..."`);

  return painSection;
}
