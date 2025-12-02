/**
 * AIO Definition Block Generator
 * Optimized for Google AI Overview - structured, clear, authoritative
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { WRITER_SYSTEM_PROMPT, generateAIOPrompt } from '../prompts';

export async function generateAIODefinition(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<string> {
  console.log('[Writer/AIO] Generating AI Overview definition block...');

  const prompt = generateAIOPrompt(
    brief.niche.businessEntity,
    brief.niche.technicalBenefit,
    brief.lsiKeywords
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.6,
    maxTokens: 512,
  });

  const aioDefinition = response.content.trim();

  // Validation
  const wordCount = aioDefinition.split(/\s+/).length;
  if (wordCount < 100) {
    console.warn('[Writer/AIO] AIO definition is too short:', wordCount, 'words');
  }
  if (wordCount > 250) {
    console.warn('[Writer/AIO] AIO definition is too long:', wordCount, 'words');
  }

  console.log('[Writer/AIO] AIO definition generated successfully');
  console.log(`  - Word count: ${wordCount}`);
  console.log(`  - Preview: "${aioDefinition.substring(0, 100)}..."`);

  return aioDefinition;
}
