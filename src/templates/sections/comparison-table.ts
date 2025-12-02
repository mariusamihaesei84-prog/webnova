import { ComparisonTable } from '../../types/landing-page';

/**
 * Comparison Table Section Template
 *
 * Renders a responsive comparison table showing:
 * - Traditional vs. Modern approaches
 * - Without vs. With optimization
 * - Before vs. After results
 */
export class ComparisonTableTemplate {
  render(table: ComparisonTable): string {
    return `<section class="comparison-section" id="comparison">
      <div class="container">
        <div class="comparison-content">
          <div class="section-header">
            <span class="section-label">Comparație</span>
            <h2 class="section-title">Agenție Generică vs. Webnova</h2>
            <p class="section-subtitle">Diferența dintre un site care stă și unul care vinde</p>
          </div>
          <div class="comparison-wrapper">
            <div class="comparison-card negative">
              <div class="comparison-header">
                <span class="comparison-badge">Agenție Generică</span>
              </div>
              <ul class="comparison-list">
                <li class="comparison-item">
                  <span class="comparison-icon">✗</span>
                  <span class="comparison-text">Template-uri generice, fără personalizare</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✗</span>
                  <span class="comparison-text">SEO "extra" sau inexistent</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✗</span>
                  <span class="comparison-text">Livrare în 2-3 luni</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✗</span>
                  <span class="comparison-text">Suport doar prin ticket</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✗</span>
                  <span class="comparison-text">Fără garanție de rezultate</span>
                </li>
              </ul>
            </div>
            <div class="comparison-card positive">
              <div class="comparison-header">
                <span class="comparison-badge">Webnova</span>
              </div>
              <ul class="comparison-list">
                <li class="comparison-item">
                  <span class="comparison-icon">✓</span>
                  <span class="comparison-text">Design unic, creat pentru nișa ta</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✓</span>
                  <span class="comparison-text">SEO complet inclus în preț</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✓</span>
                  <span class="comparison-text">Livrare în 7-14 zile</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✓</span>
                  <span class="comparison-text">Suport direct pe WhatsApp</span>
                </li>
                <li class="comparison-item">
                  <span class="comparison-icon">✓</span>
                  <span class="comparison-text">Garanție poziționare Top 10</span>
                </li>
              </ul>
            </div>
          </div>
          ${this.renderTable(table)}
        </div>
      </div>
    </section>`;
  }

  /**
   * Render the comparison table
   */
  private renderTable(table: ComparisonTable): string {
    const headers = this.renderHeaders(table.headers);
    const rows = this.renderRows(table.rows);

    return `<div class="table-wrapper">
          <table class="comparison-table">
            <thead>
              ${headers}
            </thead>
            <tbody>
              ${rows}
            </tbody>
          </table>
        </div>`;
  }

  /**
   * Render table headers
   */
  private renderHeaders(headers: string[]): string {
    const headerCells = headers
      .map(header => `<th>${this.escapeHtml(header)}</th>`)
      .join('\n                ');

    return `<tr>
                ${headerCells}
              </tr>`;
  }

  /**
   * Render table rows
   */
  private renderRows(rows: string[][]): string {
    return rows
      .map((row, index) => {
        const cells = row
          .map((cell, cellIndex) => {
            // First column might be a header for the row
            if (cellIndex === 0) {
              return `<th scope="row">${this.escapeHtml(cell)}</th>`;
            }

            // Apply styling based on content (e.g., positive/negative indicators)
            const cellClass = this.getCellClass(cell);
            return `<td class="${cellClass}">${this.escapeHtml(cell)}</td>`;
          })
          .join('\n                ');

        return `<tr>
                ${cells}
              </tr>`;
      })
      .join('\n              ');
  }

  /**
   * Determine cell class based on content
   */
  private getCellClass(content: string): string {
    const lowerContent = content.toLowerCase();

    // Positive indicators
    if (
      lowerContent.includes('✓') ||
      lowerContent.includes('da') ||
      lowerContent.includes('creștere') ||
      lowerContent.includes('+') ||
      lowerContent.includes('mai mult')
    ) {
      return 'cell-positive';
    }

    // Negative indicators
    if (
      lowerContent.includes('✗') ||
      lowerContent.includes('nu') ||
      lowerContent.includes('scădere') ||
      lowerContent.includes('-') ||
      lowerContent.includes('lipsă')
    ) {
      return 'cell-negative';
    }

    return 'cell-neutral';
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
