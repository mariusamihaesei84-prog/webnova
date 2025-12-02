import * as fs from 'fs';
import * as path from 'path';
import { LandingPageRenderer } from './renderer';
import { RendererConfig } from './types';
import { examplePage } from './example';

/**
 * Generate Sample HTML Output
 *
 * Creates a complete HTML file for the dental clinic example
 */

const config: RendererConfig = {
  baseUrl: 'https://webnova.ro',
  siteName: 'Webnova - Site Optimizat pentru Afaceri',
  contact: {
    email: 'contact@webnova.ro',
    phone: '+40 123 456 789',
    address: 'București, România',
  },
  social: {
    facebook: '@webnova',
    twitter: '@webnova',
    linkedin: 'company/webnova',
  },
  defaultOgImage: 'https://webnova.ro/images/og-default.jpg',
  analytics: {
    googleAnalytics: 'G-XXXXXXXXXX',
  },
};

function generateSample() {
  console.log('📝 Generating sample HTML output...\n');

  // Initialize renderer
  const renderer = new LandingPageRenderer(config);

  // Validate page
  const validation = renderer.validate(examplePage);
  if (!validation.valid) {
    console.warn('⚠️  Validation warnings:');
    validation.errors.forEach(error => console.warn(`   - ${error}`));
    console.log('');
  }

  // Render HTML
  const html = renderer.render(examplePage);

  // Get filename
  const filename = LandingPageRenderer.getFileName(examplePage);
  const outputPath = path.join(__dirname, '..', '..', 'output', filename);

  // Ensure output directory exists
  const outputDir = path.dirname(outputPath);
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }

  // Write file
  fs.writeFileSync(outputPath, html, 'utf-8');

  console.log('✅ Sample HTML generated successfully!');
  console.log(`📄 File: ${outputPath}`);
  console.log(`📏 Size: ${Math.round(html.length / 1024)}KB`);
  console.log(`🔗 URL: ${config.baseUrl}/${examplePage.slug}`);
  console.log('');

  // Generate stats
  const stats = {
    totalSections: 7,
    htmlSize: html.length,
    metaTitle: examplePage.metaTitle,
    metaTitleLength: examplePage.metaTitle.length,
    metaDescription: examplePage.metaDescription,
    metaDescriptionLength: examplePage.metaDescription.length,
    faqCount: examplePage.faqSection.length,
    internalLinksCount: examplePage.internalLinks.length,
    hasSchema: html.includes('application/ld+json'),
    hasOpenGraph: html.includes('property="og:'),
    hasTwitterCard: html.includes('name="twitter:'),
  };

  console.log('📊 Page Statistics:');
  console.log(`   - HTML Size: ${Math.round(stats.htmlSize / 1024)}KB`);
  console.log(`   - Meta Title: ${stats.metaTitleLength} chars`);
  console.log(`   - Meta Description: ${stats.metaDescriptionLength} chars`);
  console.log(`   - FAQ Items: ${stats.faqCount}`);
  console.log(`   - Internal Links: ${stats.internalLinksCount}`);
  console.log(`   - Schema.org: ${stats.hasSchema ? '✅' : '❌'}`);
  console.log(`   - Open Graph: ${stats.hasOpenGraph ? '✅' : '❌'}`);
  console.log(`   - Twitter Card: ${stats.hasTwitterCard ? '✅' : '❌'}`);
  console.log('');

  console.log('🌐 Open the file in a browser to see the result:');
  console.log(`   file://${outputPath}`);
  console.log('');

  return outputPath;
}

if (require.main === module) {
  generateSample();
}

export { generateSample };
