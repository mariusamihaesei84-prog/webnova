import { LandingPage } from '../types/landing-page';
import { RendererConfig } from './types';
import { MetaTagGenerator } from './seo/meta-tags';
import { SchemaGenerator } from './seo/schema';
import { InternalLinkingSystem } from './seo/internal-links';
import { CSS_STYLES } from './styles';

/**
 * Base HTML Layout
 *
 * Generates the complete HTML5 document structure with:
 * - Proper DOCTYPE and language
 * - Complete head section with meta tags and schema
 * - Body with header, main content, and footer
 * - Inline CSS for fast loading
 */
export class LayoutTemplate {
  private metaGenerator: MetaTagGenerator;
  private schemaGenerator: SchemaGenerator;
  private linkingSystem: InternalLinkingSystem;

  constructor(private config: RendererConfig) {
    this.metaGenerator = new MetaTagGenerator(config);
    this.schemaGenerator = new SchemaGenerator(config);
    this.linkingSystem = new InternalLinkingSystem(config);
  }

  /**
   * Render complete HTML document
   */
  render(page: LandingPage, bodyContent: string): string {
    const metaTags = this.metaGenerator.generate(page);
    const metaHtml = this.metaGenerator.render(metaTags);
    const schemaHtml = this.schemaGenerator.render(page);

    return `<!DOCTYPE html>
<html lang="ro">
<head>
    ${metaHtml}
    ${schemaHtml}
    ${this.renderCSS()}
    ${this.renderAnalytics()}
</head>
<body>
    ${this.renderHeader(page)}
    ${this.renderBreadcrumbs(page)}
    <main>
        ${bodyContent}
        ${this.renderRelatedLinks(page)}
    </main>
    ${this.renderFooter(page)}
    ${this.renderInteractiveScripts()}
</body>
</html>`;
  }

  /**
   * Render CSS styles
   */
  private renderCSS(): string {
    return `<style>
${CSS_STYLES}
    </style>`;
  }

  /**
   * Render analytics scripts
   */
  private renderAnalytics(): string {
    const scripts: string[] = [];

    // Google Analytics
    if (this.config.analytics?.googleAnalytics) {
      scripts.push(`
    <!-- Google Analytics -->
    <script async src="https://www.googletagmanager.com/gtag/js?id=${this.config.analytics.googleAnalytics}"></script>
    <script>
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', '${this.config.analytics.googleAnalytics}');
    </script>`);
    }

    // Google Tag Manager
    if (this.config.analytics?.googleTagManager) {
      scripts.push(`
    <!-- Google Tag Manager -->
    <script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${this.config.analytics.googleTagManager}');</script>`);
    }

    return scripts.join('\n');
  }

  /**
   * Render header section
   */
  private renderHeader(page: LandingPage): string {
    return `<header>
      <div class="container">
        ${this.linkingSystem.renderNavigation(page)}
      </div>
    </header>`;
  }

  /**
   * Render breadcrumbs
   */
  private renderBreadcrumbs(page: LandingPage): string {
    return `<div class="container">
      ${this.linkingSystem.renderBreadcrumbs(page)}
    </div>`;
  }

  /**
   * Render related links section
   */
  private renderRelatedLinks(page: LandingPage): string {
    const contextualLinks = this.linkingSystem.renderContextualLinks(page);
    if (!contextualLinks) return '';

    return `<div class="container">
      ${contextualLinks}
    </div>`;
  }

  /**
   * Render footer section
   */
  private renderFooter(page: LandingPage): string {
    return this.linkingSystem.renderFooter(page);
  }

  /**
   * Render interactive JavaScript for FAQ accordion and form validation
   */
  private renderInteractiveScripts(): string {
    return `<script>
    // FAQ Accordion
    document.addEventListener('DOMContentLoaded', function() {
      const faqButtons = document.querySelectorAll('.faq-question');

      faqButtons.forEach(function(button) {
        button.addEventListener('click', function() {
          const answerId = this.getAttribute('aria-controls');
          const answer = document.getElementById(answerId);
          const isExpanded = this.getAttribute('aria-expanded') === 'true';

          // Toggle current FAQ
          this.setAttribute('aria-expanded', !isExpanded);
          answer.hidden = isExpanded;
        });
      });

      // Smooth scroll for anchor links
      document.querySelectorAll('a[href^="#"]').forEach(function(anchor) {
        anchor.addEventListener('click', function(e) {
          const href = this.getAttribute('href');
          if (href !== '#') {
            e.preventDefault();
            const target = document.querySelector(href);
            if (target) {
              target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
              });
            }
          }
        });
      });

      // Form validation
      const contactForm = document.querySelector('.contact-form');
      if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
          e.preventDefault();

          // Basic validation
          const formData = new FormData(this);
          let isValid = true;

          // Check required fields
          const requiredFields = ['name', 'email', 'phone', 'business'];
          requiredFields.forEach(function(field) {
            const value = formData.get(field);
            if (!value || value.toString().trim() === '') {
              isValid = false;
              alert('Te rugăm să completezi toate câmpurile obligatorii.');
            }
          });

          // Check consent
          if (!formData.get('consent')) {
            isValid = false;
            alert('Te rugăm să accepți Politica de Confidențialitate.');
          }

          if (isValid) {
            // Submit form (would normally POST to server)
            alert('Mulțumim! Te vom contacta în curând.');
            this.reset();
          }
        });
      }
    });
    </script>`;
  }
}
