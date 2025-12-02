import { CallToAction } from '../../types/landing-page';

/**
 * Call-to-Action Section Template
 *
 * Renders the final CTA section with:
 * - Compelling headline
 * - Supporting body text
 * - Primary action button
 * - Contact form placeholder
 */
export class CTATemplate {
  render(cta: CallToAction): string {
    return `<section class="cta-section" id="contact">
      <div class="container">
        <div class="cta-content">
          <span class="section-label" style="color: var(--accent);">Următorul Pas</span>
          <h2 class="cta-headline">${this.escapeHtml(cta.headline)}</h2>
          <p class="cta-body">${this.escapeHtml(cta.body)}</p>
          <div class="cta-actions">
            <a href="#contact-form" class="btn btn-primary btn-lg">${this.escapeHtml(cta.buttonText)}</a>
            <a href="tel:+40123456789" class="btn btn-secondary btn-lg">📞 Sună Acum</a>
          </div>
          ${this.renderContactForm()}
          <div class="related-links">
            <h3>Servicii Similare</h3>
            <ul class="links-list">
              <li><a href="/site-optimizat/cabinet-veterinar" class="internal-link"><span class="link-arrow">→</span> Site Cabinet Veterinar</a></li>
              <li><a href="/site-optimizat/birou-arhitectura" class="internal-link"><span class="link-arrow">→</span> Site Birou Arhitectură</a></li>
              <li><a href="/site-optimizat/salon-infrumusetare" class="internal-link"><span class="link-arrow">→</span> Site Salon Înfrumusețare</a></li>
            </ul>
          </div>
        </div>
      </div>
    </section>`;
  }

  /**
   * Render contact form
   */
  private renderContactForm(): string {
    return `<div class="contact-form-wrapper" id="contact-form">
        <h3 class="form-title">Solicită Oferta Gratuită</h3>
        <form class="contact-form" method="POST" action="/contact">
          <div class="form-group">
            <label for="name">Nume complet *</label>
            <input
              type="text"
              id="name"
              name="name"
              required
              placeholder="Ex: Ion Popescu"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="email">Email *</label>
            <input
              type="email"
              id="email"
              name="email"
              required
              placeholder="Ex: ion@example.com"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="phone">Telefon *</label>
            <input
              type="tel"
              id="phone"
              name="phone"
              required
              placeholder="Ex: 0712345678"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="business">Tip afacere *</label>
            <input
              type="text"
              id="business"
              name="business"
              required
              placeholder="Ex: Cabinet stomatologic"
              class="form-input"
            />
          </div>

          <div class="form-group">
            <label for="message">Mesaj (opțional)</label>
            <textarea
              id="message"
              name="message"
              rows="4"
              placeholder="Spune-ne mai multe despre afacerea ta..."
              class="form-input"
            ></textarea>
          </div>

          <div class="form-group">
            <label class="checkbox-label">
              <input type="checkbox" name="consent" required />
              <span>Accept <a href="/confidentialitate">Politica de Confidențialitate</a> *</span>
            </label>
          </div>

          <button type="submit" class="btn btn-primary btn-block">
            Trimite Solicitarea
          </button>
        </form>
      </div>`;
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
