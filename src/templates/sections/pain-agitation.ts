/**
 * Pain & Agitation Section Template
 *
 * Renders the problem amplification section that:
 * - Identifies the pain points
 * - Agitates the problem
 * - Creates urgency for the solution
 */
export class PainAgitationTemplate {
  render(content: string): string {
    return `<section class="pain-agitation">
      <div class="container">
        <div class="pain-content">
          <div class="section-header">
            <span class="section-label">Problema</span>
            <h2 class="section-title">De Ce Site-urile Vechi Nu Mai Funcționează</h2>
          </div>
          <div class="pain-grid">
            <div class="pain-card">
              <div class="pain-icon">📉</div>
              <h4>Vizibilitate Zero</h4>
              <p>Fără SEO modern, ești invizibil pe Google. Concurenții îți fură clienții zilnic.</p>
            </div>
            <div class="pain-card">
              <div class="pain-icon">📱</div>
              <h4>Incompatibil Mobile</h4>
              <p>70% din căutări vin de pe mobil. Site neoptimizat = bani pierduți.</p>
            </div>
            <div class="pain-card">
              <div class="pain-icon">⏱️</div>
              <h4>Încărcare Lentă</h4>
              <p>3+ secunde de așteptare și 53% din vizitatori pleacă la concurență.</p>
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /**
   * Format pain agitation content with proper structure
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

        // Check if it's a list
        if (trimmed.match(/^[-•*]\s/) || trimmed.includes('\n-') || trimmed.includes('\n•')) {
          return this.formatList(trimmed);
        }

        // Check if it's a quote or emphasis
        if (trimmed.startsWith('>')) {
          const quote = trimmed.replace(/^>\s+/, '');
          return `<blockquote>${this.escapeHtml(quote)}</blockquote>`;
        }

        // Regular paragraph
        return `<p>${this.escapeHtml(trimmed)}</p>`;
      })
      .join('\n        ');
  }

  /**
   * Format list items
   */
  private formatList(text: string): string {
    const items = text.split(/\n/).filter(line => line.trim());
    const listItems = items
      .map(item => {
        const cleaned = item.replace(/^[-•*]\s+/, '').trim();
        if (!cleaned) return '';
        return `<li>${this.escapeHtml(cleaned)}</li>`;
      })
      .filter(item => item)
      .join('\n            ');

    return `<ul class="pain-list">
            ${listItems}
          </ul>`;
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
