/**
 * Technical Solution Section Template
 *
 * Renders the solution explanation section with:
 * - Features and benefits
 * - Technical details
 * - How the solution works
 */
export class TechnicalSolutionTemplate {
  render(content: string): string {
    return `<section class="technical-solution">
      <div class="container">
        <div class="solution-content">
          <div class="section-header">
            <span class="section-label">Soluția</span>
            <h2 class="section-title">Tehnologie Care Aduce Rezultate</h2>
          </div>
          <div class="features-grid">
            <div class="feature-card">
              <div class="feature-icon">⚡</div>
              <h4>Viteză Maximă</h4>
              <p>Sub 2 secunde timp de încărcare. Google premiază viteza cu poziții mai bune.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🎯</div>
              <h4>SEO Complet</h4>
              <p>Meta tags, Schema markup, structură semantică - tot ce trebuie pentru Top 3 Google.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📱</div>
              <h4>Mobile-First</h4>
              <p>Perfect pe orice device. 70% din trafic vine de pe mobil.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🔒</div>
              <h4>SSL Securizat</h4>
              <p>Certificate HTTPS gratuit inclus. Google penalizează site-urile nesecurizate.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">📊</div>
              <h4>Analytics</h4>
              <p>Urmărește vizitatori și conversii. Decizii bazate pe date reale.</p>
            </div>
            <div class="feature-card">
              <div class="feature-icon">🗺️</div>
              <h4>Google Maps</h4>
              <p>Integrare cu Google Business Profile pentru vizibilitate locală maximă.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /**
   * Format technical solution content
   */
  private formatContent(text: string): string {
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);

    return paragraphs
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return '';

        // Check if it's a heading (starts with ##)
        if (trimmed.startsWith('##')) {
          const heading = trimmed.replace(/^##\s+/, '');
          return `<h3>${this.escapeHtml(heading)}</h3>`;
        }

        // Check if it's a numbered list
        if (trimmed.match(/^\d+\.\s/) || trimmed.includes('\n1.') || trimmed.includes('\n2.')) {
          return this.formatNumberedList(trimmed);
        }

        // Check if it's a bulleted list
        if (trimmed.match(/^[-•*✓]\s/) || trimmed.includes('\n-') || trimmed.includes('\n•')) {
          return this.formatBulletList(trimmed);
        }

        // Check if it's a feature highlight (starts with ✓)
        if (trimmed.startsWith('✓')) {
          return this.formatFeature(trimmed);
        }

        // Regular paragraph
        return `<p>${this.escapeHtml(trimmed)}</p>`;
      })
      .join('\n        ');
  }

  /**
   * Format numbered list
   */
  private formatNumberedList(text: string): string {
    const items = text.split(/\n/).filter(line => line.trim());
    const listItems = items
      .map(item => {
        const cleaned = item.replace(/^\d+\.\s+/, '').trim();
        if (!cleaned) return '';
        return `<li>${this.escapeHtml(cleaned)}</li>`;
      })
      .filter(item => item)
      .join('\n            ');

    return `<ol class="solution-steps">
            ${listItems}
          </ol>`;
  }

  /**
   * Format bulleted list
   */
  private formatBulletList(text: string): string {
    const items = text.split(/\n/).filter(line => line.trim());
    const listItems = items
      .map(item => {
        const cleaned = item.replace(/^[-•*✓]\s+/, '').trim();
        if (!cleaned) return '';
        return `<li>${this.escapeHtml(cleaned)}</li>`;
      })
      .filter(item => item)
      .join('\n            ');

    return `<ul class="solution-features">
            ${listItems}
          </ul>`;
  }

  /**
   * Format feature highlight
   */
  private formatFeature(text: string): string {
    const cleaned = text.replace(/^✓\s+/, '').trim();
    return `<div class="feature-highlight">
          <span class="feature-icon">✓</span>
          <span class="feature-text">${this.escapeHtml(cleaned)}</span>
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
