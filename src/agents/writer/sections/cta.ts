/**
 * Call to Action Generator
 * Emotional, urgent closing that drives action
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { CallToAction } from '../../../types/landing-page';
import { WRITER_SYSTEM_PROMPT, generateCTAPrompt } from '../prompts';

export async function generateCTA(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<CallToAction> {
  console.log('[Writer/CTA] Generating call to action...');

  const prompt = generateCTAPrompt(
    brief.niche.businessEntity,
    brief.niche.primaryPainPoint,
    brief.niche.professionalSingular
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.8,
    maxTokens: 768,
  });

  const ctaData = aiService.parseJSON<CallToAction>(response.content);

  // Validation
  if (!ctaData.headline || !ctaData.body || !ctaData.buttonText) {
    throw new Error('CTA must include headline, body, and buttonText');
  }

  const headlineWords = ctaData.headline.split(/\s+/).length;
  if (headlineWords < 6 || headlineWords > 15) {
    console.warn(
      `[Writer/CTA] Headline should be 8-12 words, got ${headlineWords}`
    );
  }

  const bodyWordCount = ctaData.body.split(/\s+/).length;
  if (bodyWordCount < 100) {
    console.warn(`[Writer/CTA] Body is too short: ${bodyWordCount} words`);
  }
  if (bodyWordCount > 200) {
    console.warn(`[Writer/CTA] Body is too long: ${bodyWordCount} words`);
  }

  const buttonWords = ctaData.buttonText.split(/\s+/).length;
  if (buttonWords < 2 || buttonWords > 6) {
    console.warn(
      `[Writer/CTA] Button text should be 3-5 words, got ${buttonWords}`
    );
  }

  console.log('[Writer/CTA] CTA generated successfully');
  console.log(`  - Headline: "${ctaData.headline}" (${headlineWords} words)`);
  console.log(`  - Body: ${bodyWordCount} words`);
  console.log(`  - Button: "${ctaData.buttonText}" (${buttonWords} words)`);

  return ctaData;
}
