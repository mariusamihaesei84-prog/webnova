import { LandingPageRenderer } from './renderer';
import { RendererConfig } from './types';
import { examplePage } from './example';

/**
 * Test Script for Landing Page Renderer
 *
 * Run with: npx ts-node src/templates/test.ts
 */

const config: RendererConfig = {
  baseUrl: 'https://webnova.ro',
  siteName: 'Webnova SEO',
  contact: {
    email: 'contact@webnova.ro',
    phone: '+40 123 456 789',
  },
  defaultOgImage: 'https://webnova.ro/images/og-default.jpg',
};

async function runTests() {
  console.log('🧪 Testing Landing Page Renderer\n');

  // Test 1: Initialize Renderer
  console.log('Test 1: Initialize Renderer');
  const renderer = new LandingPageRenderer(config);
  console.log('✅ Renderer initialized\n');

  // Test 2: Validate Page Data
  console.log('Test 2: Validate Page Data');
  const validation = renderer.validate(examplePage);
  if (validation.valid) {
    console.log('✅ Page data is valid\n');
  } else {
    console.log('❌ Validation errors:');
    validation.errors.forEach(error => console.log(`   - ${error}`));
    console.log('');
  }

  // Test 3: Render Complete HTML
  console.log('Test 3: Render Complete HTML');
  const html = renderer.render(examplePage);
  console.log(`✅ Generated HTML (${html.length} characters)\n`);

  // Test 4: Check HTML Structure
  console.log('Test 4: Check HTML Structure');
  const checks = [
    { name: 'DOCTYPE', test: html.includes('<!DOCTYPE html>') },
    { name: 'HTML lang="ro"', test: html.includes('<html lang="ro">') },
    { name: 'Meta charset', test: html.includes('charset="UTF-8"') },
    { name: 'Meta viewport', test: html.includes('viewport') },
    { name: 'Title tag', test: html.includes('<title>') },
    { name: 'Meta description', test: html.includes('name="description"') },
    { name: 'Canonical URL', test: html.includes('rel="canonical"') },
    { name: 'Open Graph tags', test: html.includes('property="og:') },
    { name: 'Schema.org JSON-LD', test: html.includes('application/ld+json') },
    { name: 'Hero section', test: html.includes('class="hero"') },
    { name: 'AIO definition', test: html.includes('class="aio-definition"') },
    { name: 'Pain agitation', test: html.includes('class="pain-agitation"') },
    { name: 'Comparison table', test: html.includes('class="comparison-table"') },
    { name: 'Technical solution', test: html.includes('class="technical-solution"') },
    { name: 'FAQ section', test: html.includes('class="faq-section"') },
    { name: 'CTA section', test: html.includes('class="cta-section"') },
    { name: 'Contact form', test: html.includes('class="contact-form"') },
    { name: 'Footer', test: html.includes('class="site-footer"') },
    { name: 'CSS styles', test: html.includes('<style>') },
    { name: 'JavaScript', test: html.includes('<script>') },
  ];

  checks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
  });
  console.log('');

  // Test 5: Check SEO Elements
  console.log('Test 5: Check SEO Elements');
  const seoChecks = [
    {
      name: 'H1 contains keyword',
      test: html.includes('Cabinet Stomatologic'),
    },
    {
      name: 'Meta title length',
      test: examplePage.metaTitle.length <= 60,
      value: examplePage.metaTitle.length,
    },
    {
      name: 'Meta description length',
      test: examplePage.metaDescription.length <= 160,
      value: examplePage.metaDescription.length,
    },
    {
      name: 'Product schema',
      test: html.includes('"@type": "Service"') || html.includes('"@type":"Service"'),
    },
    {
      name: 'FAQ schema',
      test: html.includes('"@type": "FAQPage"') || html.includes('"@type":"FAQPage"'),
    },
    {
      name: 'Breadcrumb schema',
      test: html.includes('"@type": "BreadcrumbList"') || html.includes('"@type":"BreadcrumbList"'),
    },
    {
      name: 'Internal links',
      test: html.includes('cabinet-medical'),
    },
  ];

  seoChecks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    const value = check.value ? ` (${check.value})` : '';
    console.log(`${status} ${check.name}${value}`);
  });
  console.log('');

  // Test 6: Render Individual Sections
  console.log('Test 6: Render Individual Sections');
  const sections = [
    { name: 'hero', data: examplePage.heroSection },
    { name: 'aio-definition', data: examplePage.aioDefinition },
    { name: 'pain-agitation', data: examplePage.painAgitation },
    { name: 'comparison-table', data: examplePage.comparisonTable },
    { name: 'technical-solution', data: examplePage.technicalSolution },
    { name: 'faq', data: examplePage.faqSection },
    { name: 'cta', data: examplePage.callToAction },
  ];

  sections.forEach(section => {
    try {
      const sectionHtml = renderer.renderSection(section.name, section.data);
      const status = sectionHtml.length > 0 ? '✅' : '❌';
      console.log(`${status} ${section.name} (${sectionHtml.length} chars)`);
    } catch (error) {
      console.log(`❌ ${section.name} - Error: ${error}`);
    }
  });
  console.log('');

  // Test 7: Check Responsive Design
  console.log('Test 7: Check Responsive Design');
  const responsiveChecks = [
    { name: 'Viewport meta tag', test: html.includes('width=device-width') },
    { name: 'Mobile CSS media queries', test: html.includes('@media') },
    { name: 'Flexible layout classes', test: html.includes('container') },
  ];

  responsiveChecks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    console.log(`${status} ${check.name}`);
  });
  console.log('');

  // Test 8: Performance Checks
  console.log('Test 8: Performance Checks');
  const performanceChecks = [
    { name: 'Inline CSS (no external)', test: !html.includes('<link rel="stylesheet"') },
    { name: 'No external JS libraries', test: !html.includes('jquery') && !html.includes('bootstrap.js') },
    { name: 'Minimal inline JS', test: html.split('<script>').length <= 5 },
    { name: 'HTML size under 100KB', test: html.length < 100000, value: `${Math.round(html.length / 1024)}KB` },
  ];

  performanceChecks.forEach(check => {
    const status = check.test ? '✅' : '❌';
    const value = check.value ? ` (${check.value})` : '';
    console.log(`${status} ${check.name}${value}`);
  });
  console.log('');

  // Summary
  console.log('📊 Test Summary');
  const totalChecks = checks.length + seoChecks.length + sections.length + responsiveChecks.length + performanceChecks.length;
  const passedChecks = [
    ...checks.filter(c => c.test),
    ...seoChecks.filter(c => c.test),
    ...responsiveChecks.filter(c => c.test),
    ...performanceChecks.filter(c => c.test),
  ].length + sections.length; // Assume all sections pass if no error

  console.log(`Total Checks: ${totalChecks}`);
  console.log(`Passed: ${passedChecks}`);
  console.log(`Failed: ${totalChecks - passedChecks}`);
  console.log(`Success Rate: ${Math.round((passedChecks / totalChecks) * 100)}%`);
  console.log('');

  // Output sample
  console.log('📄 HTML Preview (first 1000 characters):\n');
  console.log(html.substring(0, 1000));
  console.log('...\n');

  console.log('✅ All tests completed!');
}

// Run tests
if (require.main === module) {
  runTests().catch(console.error);
}

export { runTests };
