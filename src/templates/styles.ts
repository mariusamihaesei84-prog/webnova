/**
 * Modern CSS Styles - Clean Professional Theme
 * Consistent colors, typography, and spacing
 */
export const CSS_STYLES = `
:root {
  --primary: #6366f1;
  --primary-dark: #4f46e5;
  --accent: #ec4899;
  --success: #10b981;
  --dark: #0f172a;
  --dark-light: #1e293b;
  --text: #1e293b;
  --text-light: #64748b;
  --text-muted: #94a3b8;
  --border: #e2e8f0;
  --bg: #ffffff;
  --bg-alt: #f8fafc;
  --radius: 12px;
  --radius-lg: 20px;
  --shadow: 0 4px 6px -1px rgba(0,0,0,0.1);
  --shadow-lg: 0 10px 25px -5px rgba(0,0,0,0.1);
}

* { margin: 0; padding: 0; box-sizing: border-box; }

html { scroll-behavior: smooth; }

body {
  font-family: 'Inter', -apple-system, BlinkMacSystemFont, sans-serif;
  font-size: 16px;
  line-height: 1.6;
  color: var(--text);
  background: var(--bg);
}

/* Typography */
h1, h2, h3, h4 {
  font-weight: 700;
  line-height: 1.2;
  color: var(--text);
}
h1 { font-size: 3rem; }
h2 { font-size: 2.25rem; }
h3 { font-size: 1.5rem; }
h4 { font-size: 1.125rem; }

p { color: var(--text-light); margin-bottom: 1rem; }

a { color: var(--primary); text-decoration: none; }
a:hover { color: var(--primary-dark); }

.container { max-width: 1140px; margin: 0 auto; padding: 0 1.5rem; }

/* Header */
header {
  background: var(--bg);
  border-bottom: 1px solid var(--border);
  position: sticky;
  top: 0;
  z-index: 100;
}

.main-nav {
  display: flex;
  justify-content: center;
  gap: 2.5rem;
  padding: 1rem 0;
}

.nav-link {
  color: var(--text-light);
  font-weight: 500;
  font-size: 0.9rem;
  transition: var(--transition);
}
.nav-link:hover { color: var(--primary); }

/* Breadcrumbs */
.breadcrumbs {
  background: var(--bg-alt);
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.breadcrumb-list {
  display: flex;
  list-style: none;
  gap: 0.5rem;
  font-size: 0.875rem;
}

.breadcrumb-item a { color: var(--text-muted); }
.breadcrumb-item.active { color: var(--text); font-weight: 500; }
.separator { color: var(--text-muted); }

/* Hero */
.hero {
  background: var(--dark);
  padding: 5rem 1.5rem;
  text-align: center;
}

.hero-content { max-width: 800px; margin: 0 auto; }

.hero-badge {
  display: inline-block;
  background: rgba(99,102,241,0.15);
  color: var(--primary);
  padding: 0.5rem 1rem;
  border-radius: 50px;
  font-size: 0.875rem;
  font-weight: 600;
  margin-bottom: 1.5rem;
}

.hero-title {
  color: #fff;
  font-size: 2.75rem;
  margin-bottom: 1rem;
}

.hero-subtitle {
  color: var(--text-muted);
  font-size: 1.125rem;
  margin-bottom: 2rem;
  max-width: 600px;
  margin-left: auto;
  margin-right: auto;
}

.hero-cta {
  display: flex;
  gap: 1rem;
  justify-content: center;
  flex-wrap: wrap;
}

.stats-row {
  display: flex;
  justify-content: center;
  gap: 4rem;
  margin-top: 3rem;
  padding-top: 3rem;
  border-top: 1px solid rgba(255,255,255,0.1);
}

.stat-item { text-align: center; }

.stat-number {
  font-size: 2.5rem;
  font-weight: 800;
  color: #fff;
}
.stat-number .accent { color: var(--primary); }

.stat-label {
  font-size: 0.75rem;
  color: var(--text-muted);
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

/* Buttons */
.btn {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.875rem 1.75rem;
  font-size: 0.95rem;
  font-weight: 600;
  border-radius: var(--radius);
  border: none;
  cursor: pointer;
  transition: var(--transition);
}

.btn-primary {
  background: var(--primary);
  color: #fff;
}
.btn-primary:hover {
  background: var(--primary-dark);
  transform: translateY(-2px);
  box-shadow: var(--shadow-lg);
}

.btn-secondary {
  background: transparent;
  color: #fff;
  border: 1px solid rgba(255,255,255,0.3);
}
.btn-secondary:hover {
  background: rgba(255,255,255,0.1);
  border-color: rgba(255,255,255,0.5);
}

.btn-lg { padding: 1rem 2rem; font-size: 1rem; }

/* Sections */
section { padding: 5rem 1.5rem; }

.section-header {
  text-align: center;
  margin-bottom: 3rem;
}

.section-label {
  display: inline-block;
  color: var(--primary);
  font-size: 0.8rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  margin-bottom: 0.75rem;
}

.section-title { margin-bottom: 0.5rem; }
.section-subtitle { color: var(--text-light); font-size: 1.1rem; }

/* AIO Definition */
.aio-definition { background: var(--bg-alt); }

.definition-card {
  background: var(--bg);
  border-radius: var(--radius-lg);
  padding: 2.5rem;
  max-width: 800px;
  margin: 0 auto;
  border: 1px solid var(--border);
  box-shadow: var(--shadow);
}

.definition-card::before {
  content: '';
  display: block;
  width: 50px;
  height: 4px;
  background: var(--primary);
  border-radius: 2px;
  margin-bottom: 1.5rem;
}

.definition-icon { display: none; }

.definition-content h2 { margin-bottom: 1rem; font-size: 1.5rem; }

.definition-text { color: var(--text-light); line-height: 1.8; }

/* Pain Agitation */
.pain-agitation {
  background: var(--dark);
  color: #fff;
}

.pain-agitation .section-label { color: var(--accent); }
.pain-agitation .section-title { color: #fff; }

.pain-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
  max-width: 900px;
  margin: 0 auto;
}

.pain-card {
  background: var(--dark-light);
  border-radius: var(--radius);
  padding: 1.75rem;
  border: 1px solid rgba(255,255,255,0.1);
  transition: var(--transition);
}

.pain-card:hover {
  border-color: var(--accent);
  transform: translateY(-4px);
}

.pain-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.pain-card h4 {
  color: #fff;
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.pain-card p {
  color: var(--text-muted);
  font-size: 0.9rem;
  margin: 0;
}

/* Comparison */
.comparison-section { background: var(--bg); }

.comparison-content { max-width: 1000px; margin: 0 auto; }

.comparison-wrapper {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 2rem;
}

.comparison-card {
  border-radius: var(--radius-lg);
  padding: 2rem;
  border: 2px solid var(--border);
}

.comparison-card.negative { background: var(--bg-alt); }

.comparison-card.positive {
  background: var(--bg);
  border-color: var(--success);
}

.comparison-header {
  margin-bottom: 1.5rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--border);
}

.comparison-badge {
  display: inline-block;
  padding: 0.4rem 0.8rem;
  border-radius: 50px;
  font-size: 0.7rem;
  font-weight: 700;
  text-transform: uppercase;
}

.comparison-card.negative .comparison-badge {
  background: var(--bg);
  color: var(--text-muted);
}

.comparison-card.positive .comparison-badge {
  background: rgba(16,185,129,0.1);
  color: var(--success);
}

.comparison-list { list-style: none; }

.comparison-item {
  display: flex;
  align-items: flex-start;
  gap: 0.75rem;
  padding: 0.75rem 0;
  border-bottom: 1px solid var(--border);
}

.comparison-item:last-child { border: none; }

.comparison-icon {
  width: 22px;
  height: 22px;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.7rem;
  flex-shrink: 0;
}

.comparison-card.negative .comparison-icon {
  background: var(--bg);
  color: var(--text-muted);
}

.comparison-card.positive .comparison-icon {
  background: rgba(16,185,129,0.1);
  color: var(--success);
}

.comparison-text {
  color: var(--text-light);
  font-size: 0.95rem;
}

.comparison-card.positive .comparison-text {
  color: var(--text);
}

/* Table */
.table-wrapper {
  margin-top: 2rem;
  border-radius: var(--radius);
  overflow: hidden;
  box-shadow: var(--shadow);
}

.comparison-table {
  width: 100%;
  border-collapse: collapse;
  background: var(--bg);
}

.comparison-table th,
.comparison-table td {
  padding: 1rem 1.25rem;
  text-align: left;
}

.comparison-table thead th {
  background: var(--dark);
  color: #fff;
  font-weight: 600;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.03em;
}

.comparison-table tbody tr {
  border-bottom: 1px solid var(--border);
}

.comparison-table tbody tr:hover {
  background: var(--bg-alt);
}

.comparison-table tbody th {
  font-weight: 600;
  background: var(--bg-alt);
}

.cell-positive { color: var(--success); font-weight: 600; }
.cell-negative { color: var(--text-muted); }

/* Technical Solution */
.technical-solution { background: var(--bg-alt); }

.solution-content { max-width: 1000px; margin: 0 auto; }

.features-grid {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 1.5rem;
}

.feature-card {
  background: var(--bg);
  border-radius: var(--radius);
  padding: 1.75rem;
  border: 1px solid var(--border);
  transition: var(--transition);
}

.feature-card:hover {
  box-shadow: var(--shadow-lg);
  transform: translateY(-4px);
}

.feature-icon {
  font-size: 2rem;
  margin-bottom: 1rem;
}

.feature-card h4 {
  margin-bottom: 0.5rem;
  font-size: 1rem;
}

.feature-card p {
  color: var(--text-light);
  font-size: 0.9rem;
  margin: 0;
}

/* FAQ */
.faq-section { background: var(--bg); }

.faq-content { max-width: 700px; margin: 0 auto; }

.faq-list { margin-top: 2rem; }

.faq-item {
  background: var(--bg-alt);
  border-radius: var(--radius);
  margin-bottom: 0.75rem;
  border: 1px solid var(--border);
  overflow: hidden;
}

.faq-question {
  width: 100%;
  padding: 1.25rem 1.5rem;
  background: none;
  border: none;
  text-align: left;
  font-size: 1rem;
  font-weight: 600;
  color: var(--text);
  cursor: pointer;
  display: flex;
  justify-content: space-between;
  align-items: center;
  transition: var(--transition);
}

.faq-question:hover { color: var(--primary); }

.faq-icon {
  width: 28px;
  height: 28px;
  background: var(--bg);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.25rem;
  color: var(--text-muted);
  transition: var(--transition);
}

.faq-question[aria-expanded="true"] .faq-icon {
  background: var(--primary);
  color: #fff;
  transform: rotate(45deg);
}

.faq-answer {
  max-height: 0;
  overflow: hidden;
  transition: max-height 0.3s ease;
}

.faq-answer:not([hidden]) {
  padding: 0 1.5rem 1.25rem;
  max-height: 500px;
}

.faq-answer p {
  color: var(--text-light);
  font-size: 0.95rem;
  margin: 0;
}

/* CTA */
.cta-section {
  background: var(--dark);
  color: #fff;
}

.cta-section .section-label { color: var(--primary); }

.cta-content { max-width: 600px; margin: 0 auto; text-align: center; }

.cta-headline { color: #fff; margin-bottom: 1rem; }

.cta-body {
  color: var(--text-muted);
  font-size: 1.1rem;
  margin-bottom: 2rem;
}

.cta-actions {
  display: flex;
  gap: 1rem;
  justify-content: center;
  margin-bottom: 3rem;
}

/* Contact Form */
.contact-form-wrapper {
  background: var(--dark-light);
  border-radius: var(--radius-lg);
  padding: 2rem;
  max-width: 400px;
  margin: 0 auto 2rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.form-title {
  color: #fff;
  font-size: 1.25rem;
  margin-bottom: 1.5rem;
  text-align: center;
}

.contact-form { display: flex; flex-direction: column; gap: 1rem; }

.form-group { display: flex; flex-direction: column; }

.form-group label {
  font-size: 0.85rem;
  font-weight: 500;
  color: var(--text-muted);
  margin-bottom: 0.4rem;
}

.form-input {
  padding: 0.875rem 1rem;
  background: rgba(255,255,255,0.05);
  border: 1px solid rgba(255,255,255,0.15);
  border-radius: var(--radius);
  color: #fff;
  font-size: 0.95rem;
  transition: var(--transition);
}

.form-input::placeholder { color: var(--text-muted); }

.form-input:focus {
  outline: none;
  border-color: var(--primary);
  background: rgba(255,255,255,0.08);
}

textarea.form-input { resize: vertical; min-height: 80px; }

.checkbox-label {
  display: flex;
  align-items: flex-start;
  gap: 0.5rem;
  font-size: 0.85rem;
  color: var(--text-muted);
  cursor: pointer;
}

.checkbox-label input { margin-top: 3px; accent-color: var(--primary); }

.btn-block { width: 100%; justify-content: center; }

/* Related Links */
.related-links {
  background: var(--dark-light);
  border-radius: var(--radius);
  padding: 1.5rem;
  border: 1px solid rgba(255,255,255,0.1);
}

.related-links h3 {
  color: #fff;
  font-size: 1rem;
  margin-bottom: 1rem;
}

.links-list {
  list-style: none;
  display: flex;
  gap: 0.75rem;
  flex-wrap: wrap;
}

.internal-link {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.6rem 1rem;
  background: rgba(255,255,255,0.05);
  border-radius: var(--radius);
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: var(--transition);
}

.internal-link:hover {
  background: rgba(255,255,255,0.1);
  color: #fff;
}

.link-arrow { color: var(--primary); }

/* Footer */
.site-footer {
  background: #0a0f1a;
  color: var(--text-muted);
  padding: 4rem 1.5rem 2rem;
}

.footer-content {
  display: grid;
  grid-template-columns: 2fr 1fr 1fr 1fr;
  gap: 2rem;
  max-width: 1140px;
  margin: 0 auto 3rem;
}

.footer-brand p {
  font-size: 0.9rem;
  margin-top: 0.5rem;
}

.footer-section h4 {
  color: #fff;
  font-size: 0.85rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  margin-bottom: 1rem;
}

.footer-links { list-style: none; }

.footer-links li { margin-bottom: 0.5rem; }

.footer-links a {
  color: var(--text-muted);
  font-size: 0.9rem;
  transition: var(--transition);
}

.footer-links a:hover { color: #fff; }

.footer-bottom {
  border-top: 1px solid rgba(255,255,255,0.1);
  padding-top: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
  max-width: 1140px;
  margin: 0 auto;
  font-size: 0.85rem;
}

.footer-legal {
  display: flex;
  gap: 1.5rem;
}

.footer-legal a { color: var(--text-muted); }
.footer-legal a:hover { color: #fff; }

/* Responsive */
@media (max-width: 768px) {
  h1 { font-size: 2rem; }
  h2 { font-size: 1.75rem; }

  .hero { padding: 3rem 1rem; }
  .hero-title { font-size: 2rem; }

  .stats-row { flex-direction: column; gap: 1.5rem; }

  section { padding: 3rem 1rem; }

  .pain-grid,
  .features-grid { grid-template-columns: 1fr; }

  .comparison-wrapper { grid-template-columns: 1fr; }

  .hero-cta,
  .cta-actions { flex-direction: column; }

  .footer-content { grid-template-columns: 1fr; text-align: center; }

  .footer-bottom { flex-direction: column; gap: 1rem; text-align: center; }

  .footer-legal { justify-content: center; }
}
`;
