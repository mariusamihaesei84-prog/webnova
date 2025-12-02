/**
 * FAQ Section Generator
 * Transforms objections into Q&A format, addressing skepticism directly
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { FAQItem } from '../../../types/landing-page';
import { WRITER_SYSTEM_PROMPT, generateFAQPrompt } from '../prompts';

export async function generateFAQSection(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<FAQItem[]> {
  console.log('[Writer/FAQ] Generating FAQ section from objections...');

  // Convert string objections to the format expected by the prompt
  const objections = brief.skepticalObjections.map((text, index) => ({
    text,
    category: 'general' as const,
    rebuttalStrategy: 'Address directly with empathy and authority',
  }));

  const prompt = generateFAQPrompt(
    brief.niche.businessEntity,
    objections
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 2048,
  });

  const faqData = aiService.parseJSON<{ faqSection: FAQItem[] }>(response.content);

  // Validation
  if (!faqData.faqSection || !Array.isArray(faqData.faqSection)) {
    throw new Error('FAQ section must be an array');
  }

  if (faqData.faqSection.length !== 5) {
    console.warn(
      `[Writer/FAQ] Expected exactly 5 FAQ items, got ${faqData.faqSection.length}`
    );
  }

  // Validate each FAQ item
  faqData.faqSection.forEach((item, index) => {
    if (!item.question || !item.answer) {
      throw new Error(`FAQ item ${index + 1} is missing question or answer`);
    }

    const answerWordCount = item.answer.split(/\s+/).length;
    if (answerWordCount < 60) {
      console.warn(
        `[Writer/FAQ] FAQ answer ${index + 1} is too short: ${answerWordCount} words`
      );
    }
    if (answerWordCount > 150) {
      console.warn(
        `[Writer/FAQ] FAQ answer ${index + 1} is too long: ${answerWordCount} words`
      );
    }
  });

  console.log('[Writer/FAQ] FAQ section generated successfully');
  console.log(`  - FAQ items: ${faqData.faqSection.length}`);
  faqData.faqSection.forEach((item, i) => {
    const wordCount = item.answer.split(/\s+/).length;
    console.log(`  - Q${i + 1}: "${item.question.substring(0, 50)}..." (${wordCount} words)`);
  });

  return faqData.faqSection;
}
