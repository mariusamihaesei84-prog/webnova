import { LandingPage, InternalLink } from '../../types/landing-page';
import { RendererConfig } from '../types';

/**
 * Internal Linking System
 *
 * Generates contextual internal links to:
 * - Root page (/site-optimizat)
 * - Related niche pages
 * - Other relevant content
 *
 * Helps with SEO link equity distribution and site navigation
 */
export class InternalLinkingSystem {
  constructor(private config: RendererConfig) {}

  /**
   * Render navigation with internal links
   */
  renderNavigation(page: LandingPage): string {
    const links: string[] = [];

    // Link to home
    links.push(`<a href="${this.config.baseUrl}" class="nav-link">Acasă</a>`);

    // Link to main SEO page
    links.push(`<a href="${this.config.baseUrl}/site-optimizat" class="nav-link">Site Optimizat</a>`);

    // Add "Services" or "Niches" link
    links.push(`<a href="${this.config.baseUrl}/servicii" class="nav-link">Servicii</a>`);

    // Contact link
    links.push(`<a href="${this.config.baseUrl}/contact" class="nav-link">Contact</a>`);

    return `<nav class="main-nav">
      ${links.join('\n      ')}
    </nav>`;
  }

  /**
   * Render contextual internal links section
   */
  renderContextualLinks(page: LandingPage): string {
    if (!page.internalLinks || page.internalLinks.length === 0) {
      return '';
    }

    const linkItems = page.internalLinks.map(link => {
      const url = link.slug.startsWith('http')
        ? link.slug
        : `${this.config.baseUrl}/${link.slug}`;

      return `<li><a href="${url}" class="internal-link">${this.escapeHtml(link.text)}</a></li>`;
    }).join('\n        ');

    return `<section class="related-links">
      <h2>Citește și:</h2>
      <ul class="links-list">
        ${linkItems}
      </ul>
    </section>`;
  }

  /**
   * Render breadcrumb navigation
   */
  renderBreadcrumbs(page: LandingPage): string {
    const breadcrumbs = [
      { text: 'Acasă', url: this.config.baseUrl },
      { text: 'Site Optimizat', url: `${this.config.baseUrl}/site-optimizat` },
      { text: page.heroSection.h1, url: null }, // Current page, no link
    ];

    const breadcrumbItems = breadcrumbs.map((crumb, index) => {
      if (crumb.url) {
        return `<li class="breadcrumb-item">
          <a href="${crumb.url}">${this.escapeHtml(crumb.text)}</a>
          <span class="separator">/</span>
        </li>`;
      } else {
        return `<li class="breadcrumb-item active">${this.escapeHtml(crumb.text)}</li>`;
      }
    }).join('\n        ');

    return `<nav class="breadcrumbs" aria-label="breadcrumb">
      <ol class="breadcrumb-list">
        ${breadcrumbItems}
      </ol>
    </nav>`;
  }

  /**
   * Render footer with internal links
   */
  renderFooter(page: LandingPage): string {
    const currentYear = new Date().getFullYear();

    return `<footer class="site-footer">
      <div class="footer-content">
        <div class="footer-section">
          <h3>Navigare</h3>
          <ul class="footer-links">
            <li><a href="${this.config.baseUrl}">Acasă</a></li>
            <li><a href="${this.config.baseUrl}/site-optimizat">Site Optimizat</a></li>
            <li><a href="${this.config.baseUrl}/servicii">Servicii</a></li>
            <li><a href="${this.config.baseUrl}/contact">Contact</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h3>Servicii Populare</h3>
          <ul class="footer-links">
            ${this.renderFooterNicheLinks(page)}
          </ul>
        </div>

        <div class="footer-section">
          <h3>Contact</h3>
          <ul class="footer-contact">
            ${this.config.contact?.email ? `<li><a href="mailto:${this.config.contact.email}">${this.config.contact.email}</a></li>` : ''}
            ${this.config.contact?.phone ? `<li><a href="tel:${this.config.contact.phone}">${this.config.contact.phone}</a></li>` : ''}
          </ul>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; ${currentYear} ${this.escapeHtml(this.config.siteName)}. Toate drepturile rezervate.</p>
        <div class="footer-legal">
          <a href="${this.config.baseUrl}/termeni">Termeni și Condiții</a>
          <a href="${this.config.baseUrl}/confidentialitate">Politica de Confidențialitate</a>
        </div>
      </div>
    </footer>`;
  }

  /**
   * Render related niche links in footer
   */
  private renderFooterNicheLinks(page: LandingPage): string {
    // Show up to 4 related links
    const links = page.internalLinks.slice(0, 4);

    return links.map(link => {
      const url = link.slug.startsWith('http')
        ? link.slug
        : `${this.config.baseUrl}/${link.slug}`;

      return `<li><a href="${url}">${this.escapeHtml(link.text)}</a></li>`;
    }).join('\n            ');
  }

  /**
   * Generate anchor text suggestions for internal links
   */
  generateAnchorText(targetNiche: string, businessEntity: string): string {
    const patterns = [
      `Site optimizat ${businessEntity}`,
      `Optimizare SEO pentru ${businessEntity}`,
      `${businessEntity} - ghid complet`,
      `Servicii SEO ${businessEntity}`,
      `Cum să optimizezi ${businessEntity}`,
    ];

    // Return the first pattern (can be randomized or contextual)
    return patterns[0];
  }

  /**
   * Escape HTML special characters
   */
  private escapeHtml(text: string): string {
    const map: { [key: string]: string } = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, char => map[char]);
  }
}
