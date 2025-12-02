import * as fs from 'fs';
import * as path from 'path';
import { LandingPageRenderer } from './renderer';
import { RendererConfig } from './types';
import { LandingPage } from '../types/landing-page';

/**
 * Pipeline Integration Example
 *
 * Shows how to integrate the renderer into the complete pipeline:
 * ArchitectAgent -> WriterAgent -> LandingPageRenderer -> HTML Output
 */

/**
 * Phase C: HTML Generation and Export
 *
 * Takes the LandingPage from WriterAgent (Phase B)
 * and generates production-ready HTML files
 */
export class HTMLGenerationPipeline {
  private renderer: LandingPageRenderer;

  constructor(private config: RendererConfig) {
    this.renderer = new LandingPageRenderer(config);
  }

  /**
   * Generate HTML for a single landing page
   */
  async generatePage(
    page: LandingPage,
    outputDir: string = 'output'
  ): Promise<{ success: boolean; filename: string; errors?: string[] }> {
    console.log(`\n🎨 Rendering HTML for: ${page.slug}`);

    // Step 1: Validate
    const validation = this.renderer.validate(page);
    if (!validation.valid) {
      console.warn('⚠️  Validation warnings:');
      validation.errors.forEach(error => console.warn(`   - ${error}`));
    }

    // Step 2: Render
    console.log('📝 Generating HTML...');
    const html = this.renderer.render(page);

    // Step 3: Save to file
    const filename = LandingPageRenderer.getFileName(page);
    const outputPath = path.resolve(outputDir, filename);

    // Ensure output directory exists
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    fs.writeFileSync(outputPath, html, 'utf-8');

    console.log(`✅ Generated: ${outputPath}`);
    console.log(`   Size: ${Math.round(html.length / 1024)}KB`);

    return {
      success: true,
      filename: outputPath,
      errors: validation.errors.length > 0 ? validation.errors : undefined,
    };
  }

  /**
   * Generate HTML for multiple landing pages (batch processing)
   */
  async generateBatch(
    pages: LandingPage[],
    outputDir: string = 'output'
  ): Promise<{
    success: number;
    failed: number;
    results: Array<{ slug: string; filename?: string; errors?: string[] }>;
  }> {
    console.log(`\n🚀 Batch processing ${pages.length} landing pages...\n`);

    const results: Array<{ slug: string; filename?: string; errors?: string[] }> = [];
    let success = 0;
    let failed = 0;

    for (const page of pages) {
      try {
        const result = await this.generatePage(page, outputDir);
        results.push({
          slug: page.slug,
          filename: result.filename,
          errors: result.errors,
        });
        success++;
      } catch (error) {
        console.error(`❌ Failed to generate ${page.slug}:`, error);
        results.push({
          slug: page.slug,
          errors: [error instanceof Error ? error.message : String(error)],
        });
        failed++;
      }
    }

    console.log(`\n📊 Batch Summary:`);
    console.log(`   ✅ Success: ${success}`);
    console.log(`   ❌ Failed: ${failed}`);
    console.log(`   📁 Output: ${path.resolve(outputDir)}`);

    return { success, failed, results };
  }

  /**
   * Generate sitemap.xml for all pages
   */
  generateSitemap(pages: LandingPage[], outputDir: string = 'output'): string {
    console.log('\n🗺️  Generating sitemap.xml...');

    const urls = pages
      .map(page => {
        const url = `${this.config.baseUrl}/${page.slug}`;
        const lastmod = new Date().toISOString().split('T')[0];
        return `  <url>
    <loc>${url}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.8</priority>
  </url>`;
      })
      .join('\n');

    const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls}
</urlset>`;

    const sitemapPath = path.resolve(outputDir, 'sitemap.xml');
    fs.writeFileSync(sitemapPath, sitemap, 'utf-8');

    console.log(`✅ Sitemap generated: ${sitemapPath}`);

    return sitemapPath;
  }

  /**
   * Generate robots.txt
   */
  generateRobotsTxt(outputDir: string = 'output'): string {
    console.log('\n🤖 Generating robots.txt...');

    const robots = `User-agent: *
Allow: /

Sitemap: ${this.config.baseUrl}/sitemap.xml
`;

    const robotsPath = path.resolve(outputDir, 'robots.txt');
    fs.writeFileSync(robotsPath, robots, 'utf-8');

    console.log(`✅ robots.txt generated: ${robotsPath}`);

    return robotsPath;
  }

  /**
   * Generate index page with links to all landing pages
   */
  generateIndexPage(pages: LandingPage[], outputDir: string = 'output'): string {
    console.log('\n📑 Generating index page...');

    const links = pages
      .map(page => {
        const url = `${page.slug}.html`;
        return `    <li><a href="${url}">${page.heroSection.h1}</a> - ${page.metaDescription}</li>`;
      })
      .join('\n');

    const html = `<!DOCTYPE html>
<html lang="ro">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Site Optimizat - Index</title>
  <style>
    body {
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
      max-width: 1200px;
      margin: 0 auto;
      padding: 2rem;
      line-height: 1.6;
    }
    h1 {
      color: #333;
      border-bottom: 3px solid #0066cc;
      padding-bottom: 0.5rem;
    }
    ul {
      list-style: none;
      padding: 0;
    }
    li {
      margin: 1rem 0;
      padding: 1rem;
      background: #f8f9fa;
      border-left: 4px solid #0066cc;
      border-radius: 4px;
    }
    a {
      color: #0066cc;
      text-decoration: none;
      font-weight: 600;
      font-size: 1.1rem;
    }
    a:hover {
      text-decoration: underline;
    }
    .meta {
      color: #666;
      font-size: 0.9rem;
      margin-top: 0.5rem;
    }
  </style>
</head>
<body>
  <h1>Site Optimizat - Landing Pages</h1>
  <p>Generated: ${new Date().toLocaleDateString('ro-RO')}</p>
  <p>Total Pages: ${pages.length}</p>

  <h2>All Landing Pages</h2>
  <ul>
${links}
  </ul>
</body>
</html>`;

    const indexPath = path.resolve(outputDir, 'index.html');
    fs.writeFileSync(indexPath, html, 'utf-8');

    console.log(`✅ Index page generated: ${indexPath}`);

    return indexPath;
  }

  /**
   * Complete pipeline: Generate all assets
   */
  async generateAll(
    pages: LandingPage[],
    outputDir: string = 'output'
  ): Promise<{
    pages: Array<{ slug: string; filename?: string; errors?: string[] }>;
    sitemap: string;
    robots: string;
    index: string;
  }> {
    console.log('🚀 Running complete HTML generation pipeline...');

    // Generate all landing pages
    const batchResult = await this.generateBatch(pages, outputDir);

    // Generate sitemap
    const sitemap = this.generateSitemap(pages, outputDir);

    // Generate robots.txt
    const robots = this.generateRobotsTxt(outputDir);

    // Generate index page
    const index = this.generateIndexPage(pages, outputDir);

    console.log('\n✅ Pipeline complete!');
    console.log(`📁 All files saved to: ${path.resolve(outputDir)}`);

    return {
      pages: batchResult.results,
      sitemap,
      robots,
      index,
    };
  }
}

/**
 * Example usage with the full pipeline
 */
export async function runFullPipeline() {
  // Configuration
  const config: RendererConfig = {
    baseUrl: 'https://webnova.ro',
    siteName: 'Webnova - Site Optimizat',
    contact: {
      email: 'contact@webnova.ro',
      phone: '+40 123 456 789',
    },
    defaultOgImage: 'https://webnova.ro/images/og-default.jpg',
  };

  // Initialize pipeline
  const pipeline = new HTMLGenerationPipeline(config);

  // In a real scenario, these would come from:
  // 1. ArchitectAgent.generateBrief(niche)
  // 2. WriterAgent.generateLandingPage(brief)
  // For now, we'll use example data
  const { examplePage } = await import('./example');

  // Generate all assets
  const result = await pipeline.generateAll([examplePage], 'output');

  console.log('\n📊 Final Results:');
  console.log(`   Landing Pages: ${result.pages.length}`);
  console.log(`   Sitemap: ${result.sitemap}`);
  console.log(`   Robots.txt: ${result.robots}`);
  console.log(`   Index: ${result.index}`);

  return result;
}

// Run if executed directly
if (require.main === module) {
  runFullPipeline().catch(console.error);
}
