/**
 * AIO (AI Overview) Definition Section Template
 *
 * Renders a structured definition block optimized for:
 * - Google's AI Overview snippets
 * - Featured snippets
 * - Quick answers
 *
 * Uses semantic HTML and clear formatting for maximum snippet visibility
 */
export class AIODefinitionTemplate {
  render(definition: string): string {
    return `<section class="aio-definition">
      <div class="container">
        <div class="definition-card">
          <div class="definition-icon">💡</div>
          <div class="definition-content">
            <h2>Ce Trebuie Să Știi</h2>
            <div class="definition-text">
              ${this.formatDefinition(definition)}
            </div>
          </div>
        </div>
      </div>
    </section>`;
  }

  /**
   * Format definition text with proper paragraphs
   */
  private formatDefinition(text: string): string {
    // Split by double newlines for paragraphs
    const paragraphs = text.split(/\n\n+/);

    return paragraphs
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return '';

        // Check if it's a list item
        if (trimmed.match(/^[-•*]\s/)) {
          return this.formatList(trimmed);
        }

        return `<p>${this.escapeHtml(trimmed)}</p>`;
      })
      .join('\n          ');
  }

  /**
   * Format list items
   */
  private formatList(text: string): string {
    const items = text.split(/\n/).filter(line => line.trim());
    const listItems = items
      .map(item => {
        const cleaned = item.replace(/^[-•*]\s+/, '').trim();
        return `<li>${this.escapeHtml(cleaned)}</li>`;
      })
      .join('\n              ');

    return `<ul>
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
