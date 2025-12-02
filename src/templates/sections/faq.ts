import { FAQItem } from '../../types/landing-page';

/**
 * FAQ Section Template
 *
 * Renders an accordion-style FAQ section with:
 * - Semantic HTML structure
 * - Schema.org optimization
 * - Interactive accordion (optional JS)
 */
export class FAQTemplate {
  render(faqs: FAQItem[]): string {
    if (!faqs || faqs.length === 0) {
      return '';
    }

    const faqItems = faqs.map((faq, index) => this.renderFAQItem(faq, index)).join('\n        ');

    return `<section class="faq-section">
      <div class="container">
        <div class="faq-content">
          <div class="section-header">
            <span class="section-label">FAQ</span>
            <h2 class="section-title">Întrebări Frecvente</h2>
            <p class="section-subtitle">Răspunsuri la ce ne întreabă cel mai des clienții</p>
          </div>
          <div class="faq-list">
          ${faqItems}
          </div>
        </div>
      </div>
    </section>`;
  }

  /**
   * Render individual FAQ item
   */
  private renderFAQItem(faq: FAQItem, index: number): string {
    const id = `faq-${index}`;

    return `<div class="faq-item">
            <button class="faq-question" aria-expanded="false" aria-controls="${id}">
              <span class="question-text">${this.escapeHtml(faq.question)}</span>
              <span class="faq-icon" aria-hidden="true">+</span>
            </button>
            <div class="faq-answer" id="${id}" hidden>
              ${this.formatAnswer(faq.answer)}
            </div>
          </div>`;
  }

  /**
   * Format FAQ answer with proper HTML
   */
  private formatAnswer(answer: string): string {
    // Split by double newlines for paragraphs
    const paragraphs = answer.split(/\n\n+/);

    return paragraphs
      .map(para => {
        const trimmed = para.trim();
        if (!trimmed) return '';

        // Check if it's a list
        if (trimmed.match(/^[-•*]\s/) || trimmed.includes('\n-') || trimmed.includes('\n•')) {
          return this.formatList(trimmed);
        }

        // Check if it's a numbered list
        if (trimmed.match(/^\d+\.\s/)) {
          return this.formatNumberedList(trimmed);
        }

        // Check for bold text (surrounded by **)
        const withBold = trimmed.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');

        // Check for italic text (surrounded by *)
        const withItalic = withBold.replace(/\*(.*?)\*/g, '<em>$1</em>');

        return `<p>${this.escapeHtml(withItalic)}</p>`;
      })
      .join('\n              ');
  }

  /**
   * Format bulleted list
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
      .join('\n                  ');

    return `<ul>
                  ${listItems}
                </ul>`;
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
      .join('\n                  ');

    return `<ol>
                  ${listItems}
                </ol>`;
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
