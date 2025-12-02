/**
 * Comparison Table Generator
 * Shows transformation: Generic Agency vs Webnova
 */

import { AIService } from '../../../services/ai-service';
import { ArchitectBrief } from '../../../types/architect-brief';
import { ComparisonTable } from '../../../types/landing-page';
import { WRITER_SYSTEM_PROMPT, generateComparisonTablePrompt } from '../prompts';

export async function generateComparisonTable(
  brief: ArchitectBrief,
  aiService: AIService
): Promise<ComparisonTable> {
  console.log('[Writer/Comparison] Generating comparison table...');

  // Extract competitive insights from content outline
  const competitorInsights = [
    brief.contentOutline.hero,
    brief.contentOutline.comparisonTable,
    brief.contentOutline.technicalSolution,
  ].slice(0, 7);

  const prompt = generateComparisonTablePrompt(
    brief.niche.businessEntity,
    competitorInsights,
    brief.niche.technicalBenefit
  );

  const response = await aiService.generate({
    prompt,
    systemPrompt: WRITER_SYSTEM_PROMPT,
    temperature: 0.7,
    maxTokens: 1536,
  });

  const tableData = aiService.parseJSON<ComparisonTable>(response.content);

  // Validation
  if (!tableData.headers || tableData.headers.length !== 3) {
    throw new Error('Comparison table must have exactly 3 headers');
  }

  if (!tableData.rows || tableData.rows.length < 6 || tableData.rows.length > 8) {
    console.warn(
      `[Writer/Comparison] Table should have 6-8 rows, got ${tableData.rows?.length || 0}`
    );
  }

  // Validate each row has 3 columns
  const invalidRows = tableData.rows.filter((row) => row.length !== 3);
  if (invalidRows.length > 0) {
    throw new Error(`All rows must have 3 columns. Found ${invalidRows.length} invalid rows.`);
  }

  console.log('[Writer/Comparison] Comparison table generated successfully');
  console.log(`  - Headers: ${tableData.headers.join(' | ')}`);
  console.log(`  - Rows: ${tableData.rows.length}`);
  console.log(`  - Sample row: ${tableData.rows[0].join(' | ')}`);

  return tableData;
}
