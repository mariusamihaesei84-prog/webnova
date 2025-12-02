/**
 * Hero Section Generator
 * Creates H1 and subheadline that hit pain point immediately
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { HeroSection } from '../../../types/landing-page';
import { WRITER_SYSTEM_PROMPT, generateHeroPrompt } from '../prompts';

export async function generateHeroSection(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<HeroSection> {
  console.log('[Writer/Hero] Generating hero section...');

  const prompt = generateHeroPrompt(
    brief.niche.businessEntity,
    brief.niche.primaryPainPoint,
    brief.hookAngle,
    brief.lsiKeywords
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.8,
    maxTokens: 512,
  });

  const heroData = aiService.parseJSON<HeroSection>(response.content);

  // Validation
  if (!heroData.h1 || !heroData.subheadline) {
    throw new Error('Hero section generation failed: missing required fields');
  }

  if (heroData.h1.length > 70) {
    console.warn('[Writer/Hero] H1 exceeds 70 characters, trimming...');
    heroData.h1 = heroData.h1.substring(0, 67) + '...';
  }

  if (heroData.subheadline.length > 160) {
    console.warn('[Writer/Hero] Subheadline exceeds 160 characters, trimming...');
    heroData.subheadline = heroData.subheadline.substring(0, 157) + '...';
  }

  console.log('[Writer/Hero] Hero section generated successfully');
  console.log(`  - H1: "${heroData.h1}" (${heroData.h1.length} chars)`);
  console.log(`  - Subheadline: "${heroData.subheadline}" (${heroData.subheadline.length} chars)`);

  return heroData;
}
