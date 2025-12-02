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

  if (!tableData.rows || tableData.rows.length < 4) {
    throw new Error(`Comparison table must have at least 4 rows, got ${tableData.rows?.length || 0}`);
  }

  // Filter and fix rows - keep only valid 3-column rows
  const validRows = tableData.rows.filter((row) => Array.isArray(row) && row.length === 3);

  if (validRows.length < 4) {
    console.error('[Writer/Comparison] Invalid rows received:', JSON.stringify(tableData.rows));
    throw new Error(`Not enough valid rows. Need at least 4 rows with 3 columns each. Got ${validRows.length} valid rows.`);
  }

  // Use only valid rows (up to 8)
  tableData.rows = validRows.slice(0, 8);

  console.log('[Writer/Comparison] Comparison table generated successfully');
  console.log(`  - Headers: ${tableData.headers.join(' | ')}`);
  console.log(`  - Rows: ${tableData.rows.length}`);
  console.log(`  - Sample row: ${tableData.rows[0].join(' | ')}`);

  return tableData;
}
