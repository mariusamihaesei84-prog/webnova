#!/usr/bin/env node
/**
 * Webnova SEO CLI
 *
 * Command-line interface for the Webnova Programmatic SEO Pipeline
 *
 * Usage:
 *   npx ts-node src/cli.ts generate --niche "cabinet stomatologic"
 *   npx ts-node src/cli.ts batch --input niches.json
 *   npx ts-node src/cli.ts feedback --url https://webnova.ro/cabinet-stomatologic
 */

import { WebnovaPipeline, PipelineConfig, PipelineEvent } from './pipeline';
import { NicheInput } from './agents/architect/types';
import * as fs from 'fs';
import * as path from 'path';

// ANSI colors for terminal output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  dim: '\x1b[2m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  red: '\x1b[31m',
};

function log(message: string, color: string = colors.reset): void {
  console.log(`${color}${message}${colors.reset}`);
}

function logSuccess(message: string): void {
  log(`✅ ${message}`, colors.green);
}

function logError(message: string): void {
  log(`❌ ${message}`, colors.red);
}

function logInfo(message: string): void {
  log(`ℹ️  ${message}`, colors.cyan);
}

function logPhase(phase: string): void {
  log(`\n🔄 ${phase}`, colors.magenta);
}

function logProgress(current: number, total: number, label: string): void {
  const percentage = Math.round((current / total) * 100);
  const bar = '█'.repeat(Math.floor(percentage / 5)) + '░'.repeat(20 - Math.floor(percentage / 5));
  process.stdout.write(`\r${colors.blue}[${bar}] ${percentage}% - ${label}${colors.reset}`);
}

/**
 * Print CLI banner
 */
function printBanner(): void {
  console.log(`
${colors.cyan}╔══════════════════════════════════════════════════════════════╗
║                                                              ║
║   ${colors.bright}WEBNOVA${colors.reset}${colors.cyan} - Programmatic SEO Pipeline                     ║
║                                                              ║
║   Generate thousands of high-performance landing pages       ║
║   optimized for Romanian B2B market                          ║
║                                                              ║
╚══════════════════════════════════════════════════════════════╝${colors.reset}
`);
}

/**
 * Print usage help
 */
function printHelp(): void {
  console.log(`
${colors.bright}USAGE:${colors.reset}
  webnova <command> [options]

${colors.bright}COMMANDS:${colors.reset}
  ${colors.cyan}generate${colors.reset}    Generate a single landing page
  ${colors.cyan}batch${colors.reset}       Generate multiple landing pages from JSON file
  ${colors.cyan}feedback${colors.reset}    Run feedback loop analysis on generated pages
  ${colors.cyan}index${colors.reset}       Request Google indexing for URLs
  ${colors.cyan}help${colors.reset}        Show this help message

${colors.bright}OPTIONS:${colors.reset}
  --niche, -n     Business entity name (for generate command)
  --input, -i     Input JSON file path (for batch command)
  --output, -o    Output directory (default: ./output)
  --url, -u       URL to analyze (for feedback command)
  --mock          Run in mock mode (no AI API calls)
  --config, -c    Path to config JSON file

${colors.bright}EXAMPLES:${colors.reset}
  ${colors.dim}# Generate a single page${colors.reset}
  webnova generate --niche "cabinet stomatologic"

  ${colors.dim}# Generate pages from a JSON file${colors.reset}
  webnova batch --input niches.json --output ./pages

  ${colors.dim}# Run feedback analysis${colors.reset}
  webnova feedback --url https://webnova.ro/cabinet-stomatologic

  ${colors.dim}# Generate with custom config${colors.reset}
  webnova generate --niche "salon auto" --config config.json
`);
}

/**
 * Parse command line arguments
 */
function parseArgs(args: string[]): {
  command: string;
  options: Record<string, string | boolean>;
} {
  const command = args[0] || 'help';
  const options: Record<string, string | boolean> = {};

  for (let i = 1; i < args.length; i++) {
    const arg = args[i];

    if (arg.startsWith('--')) {
      const key = arg.slice(2);
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        options[key] = nextArg;
        i++;
      } else {
        options[key] = true;
      }
    } else if (arg.startsWith('-')) {
      const key = arg.slice(1);
      const keyMap: Record<string, string> = {
        n: 'niche',
        i: 'input',
        o: 'output',
        u: 'url',
        c: 'config',
      };

      const fullKey = keyMap[key] || key;
      const nextArg = args[i + 1];

      if (nextArg && !nextArg.startsWith('-')) {
        options[fullKey] = nextArg;
        i++;
      } else {
        options[fullKey] = true;
      }
    }
  }

  return { command, options };
}

/**
 * Load config from file or defaults
 */
function loadConfig(configPath?: string): Partial<PipelineConfig> {
  const defaultConfig: Partial<PipelineConfig> = {
    baseUrl: 'https://webnova.ro',
    siteName: 'Webnova',
    outputDir: './output',
    mockMode: true,
    enableIndexing: false,
    enableGSCFeedback: false,
    enableConvex: false,
  };

  if (configPath && fs.existsSync(configPath)) {
    try {
      const fileConfig = JSON.parse(fs.readFileSync(configPath, 'utf-8'));
      return { ...defaultConfig, ...fileConfig };
    } catch (e) {
      logError(`Failed to load config from ${configPath}`);
    }
  }

  // Check for environment variables
  if (process.env.OPENAI_API_KEY) {
    defaultConfig.aiProvider = 'openai';
    defaultConfig.aiApiKey = process.env.OPENAI_API_KEY;
    defaultConfig.mockMode = false;
  } else if (process.env.ANTHROPIC_API_KEY) {
    defaultConfig.aiProvider = 'anthropic';
    defaultConfig.aiApiKey = process.env.ANTHROPIC_API_KEY;
    defaultConfig.mockMode = false;
  }

  if (process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON) {
    defaultConfig.googleCredentials = process.env.GOOGLE_APPLICATION_CREDENTIALS_JSON;
  }

  return defaultConfig;
}

/**
 * Create event handler for progress display
 */
function createEventHandler(): (event: PipelineEvent) => void {
  return (event: PipelineEvent) => {
    switch (event.type) {
      case 'start':
        logInfo(`Starting generation of ${event.totalNiches} pages...`);
        break;

      case 'niche_start':
        logPhase(`Processing: ${event.niche.businessType} (${event.index + 1})`);
        break;

      case 'architect_complete':
        logSuccess('Architect phase complete');
        break;

      case 'writer_complete':
        logSuccess('Writer phase complete');
        break;

      case 'render_complete':
        logSuccess(`Rendered: ${event.outputPath}`);
        break;

      case 'niche_complete':
        if (event.result.success) {
          logSuccess(`Generated: ${event.result.url}`);
          log(`   Timing: Architect ${event.result.timing.architectMs}ms | Writer ${event.result.timing.writerMs}ms | Render ${event.result.timing.renderMs}ms`, colors.dim);
        }
        break;

      case 'niche_error':
        logError(`Failed: ${event.niche.businessType} - ${event.error}`);
        break;

      case 'indexing_start':
        logPhase(`Requesting indexing for ${event.urls.length} URLs...`);
        break;

      case 'indexing_complete':
        logSuccess(`Indexing complete: ${event.result.successful.length}/${event.result.totalRequests} successful`);
        break;

      case 'feedback_start':
        logPhase(`Analyzing ${event.urls.length} pages...`);
        break;

      case 'feedback_complete':
        logSuccess(`Feedback analysis complete`);
        log(`   Healthy: ${event.result.summary.healthy} | Needs attention: ${event.result.summary.needsAttention} | Underperforming: ${event.result.summary.underperforming}`, colors.dim);
        break;

      case 'complete':
        console.log('');
        log(`\n${'═'.repeat(60)}`, colors.cyan);
        logSuccess(`Generation complete!`);
        log(`   Total: ${event.result.totalPages} | Success: ${event.result.successful} | Failed: ${event.result.failed}`, colors.dim);
        log(`   Time: ${(event.result.timing.totalMs / 1000).toFixed(2)}s (avg ${(event.result.timing.avgPerPage / 1000).toFixed(2)}s per page)`, colors.dim);
        log(`${'═'.repeat(60)}\n`, colors.cyan);
        break;
    }
  };
}

/**
 * Generate single page command
 */
async function commandGenerate(options: Record<string, string | boolean>): Promise<void> {
  const niche = options.niche as string;
  if (!niche) {
    logError('Missing --niche option');
    printHelp();
    process.exit(1);
  }

  const config = loadConfig(options.config as string);
  if (options.output) {
    config.outputDir = options.output as string;
  }
  if (options.mock) {
    config.mockMode = true;
  }

  const nicheInput: NicheInput = {
    businessType: niche,
    painPoint: `Lipsa de vizibilitate online și clienți noi pentru ${niche.toLowerCase()}`,
    targetAudience: `Proprietari de ${niche.toLowerCase()} din România`,
  };

  const pipeline = new WebnovaPipeline(config);
  pipeline.onEvent(createEventHandler());

  const result = await pipeline.generatePage(nicheInput);

  if (result.success) {
    logInfo(`\nOpen in browser: file://${path.resolve(result.outputPath!)}`);
  } else {
    process.exit(1);
  }
}

/**
 * Batch generate command
 */
async function commandBatch(options: Record<string, string | boolean>): Promise<void> {
  const inputFile = options.input as string;
  if (!inputFile) {
    logError('Missing --input option');
    printHelp();
    process.exit(1);
  }

  if (!fs.existsSync(inputFile)) {
    logError(`Input file not found: ${inputFile}`);
    process.exit(1);
  }

  let niches: NicheInput[];
  try {
    niches = JSON.parse(fs.readFileSync(inputFile, 'utf-8'));
  } catch (e) {
    logError(`Failed to parse input file: ${e}`);
    process.exit(1);
  }

  const config = loadConfig(options.config as string);
  if (options.output) {
    config.outputDir = options.output as string;
  }
  if (options.mock) {
    config.mockMode = true;
  }

  const pipeline = new WebnovaPipeline(config);
  pipeline.onEvent(createEventHandler());

  const result = await pipeline.generatePages(niches);

  if (result.failed > 0) {
    process.exit(1);
  }
}

/**
 * Feedback analysis command
 */
async function commandFeedback(options: Record<string, string | boolean>): Promise<void> {
  const url = options.url as string;
  if (!url) {
    logError('Missing --url option');
    printHelp();
    process.exit(1);
  }

  const config = loadConfig(options.config as string);
  const pipeline = new WebnovaPipeline(config);
  pipeline.onEvent(createEventHandler());

  const result = await pipeline.runFeedbackLoop([url]);

  console.log('\n');
  log('FEEDBACK ANALYSIS RESULTS', colors.bright);
  log('═'.repeat(60), colors.cyan);

  for (const analysis of result.analyses) {
    log(`\nURL: ${analysis.url}`, colors.bright);
    log(`Status: ${analysis.status}`, analysis.status === 'healthy' ? colors.green : colors.yellow);
    log(`Metrics:`, colors.dim);
    log(`  - Indexed: ${analysis.metrics.indexed ? 'Yes' : 'No'}`);
    log(`  - Clicks: ${analysis.metrics.clicks}`);
    log(`  - Impressions: ${analysis.metrics.impressions}`);
    log(`  - CTR: ${(analysis.metrics.ctr * 100).toFixed(2)}%`);
    log(`  - Avg Position: ${analysis.metrics.avgPosition.toFixed(1)}`);

    if (analysis.recommendations.length > 0) {
      log(`\nRecommendations:`, colors.yellow);
      for (const rec of analysis.recommendations) {
        log(`  • ${rec}`);
      }
    }
  }

  console.log('\n');
}

/**
 * Index URLs command
 */
async function commandIndex(options: Record<string, string | boolean>): Promise<void> {
  const url = options.url as string;
  if (!url) {
    logError('Missing --url option');
    printHelp();
    process.exit(1);
  }

  const config = loadConfig(options.config as string);
  config.enableIndexing = true;

  const pipeline = new WebnovaPipeline(config);
  pipeline.onEvent(createEventHandler());

  const result = await pipeline.requestIndexing([url]);

  if (result.successful.length > 0) {
    logSuccess(`Successfully requested indexing for ${result.successful.length} URL(s)`);
  }
  if (result.failed.length > 0) {
    logError(`Failed to index ${result.failed.length} URL(s)`);
    for (const failure of result.failed) {
      log(`  - ${failure.url}: ${failure.error}`, colors.dim);
    }
  }
}

/**
 * Main entry point
 */
async function main(): Promise<void> {
  printBanner();

  const args = process.argv.slice(2);
  const { command, options } = parseArgs(args);

  try {
    switch (command) {
      case 'generate':
        await commandGenerate(options);
        break;

      case 'batch':
        await commandBatch(options);
        break;

      case 'feedback':
        await commandFeedback(options);
        break;

      case 'index':
        await commandIndex(options);
        break;

      case 'help':
      default:
        printHelp();
        break;
    }
  } catch (error) {
    logError(`Error: ${error instanceof Error ? error.message : String(error)}`);
    process.exit(1);
  }
}

main();
