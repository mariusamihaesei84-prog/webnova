import { HeroSection } from '../../types/landing-page';

/**
 * Hero Section Template
 *
 * Renders the above-the-fold hero section with:
 * - H1 headline (primary keyword)
 * - Subheadline
 * - Primary CTA button
 */
export class HeroSectionTemplate {
  render(hero: HeroSection): string {
    return `<section class="hero">
      <div class="hero-content">
        <div class="hero-badge">
          <span>✦</span> Site + SEO Inclus
        </div>
        <h1 class="hero-title">${this.escapeHtml(hero.h1)}</h1>
        <p class="hero-subtitle">${this.escapeHtml(hero.subheadline)}</p>
        <div class="hero-cta">
          <a href="#contact" class="btn btn-primary btn-lg">Solicită Consultație Gratuită</a>
          <a href="#comparison" class="btn btn-secondary btn-lg">Vezi Diferența</a>
        </div>
        <div class="stats-row">
          <div class="stat-item">
            <div class="stat-number">500<span class="accent">+</span></div>
            <div class="stat-label">Site-uri Livrate</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">98<span class="accent">%</span></div>
            <div class="stat-label">Clienți Mulțumiți</div>
          </div>
          <div class="stat-item">
            <div class="stat-number">Top <span class="accent">3</span></div>
            <div class="stat-label">Poziții Google</div>
          </div>
        </div>
      </div>
    </section>`;
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
