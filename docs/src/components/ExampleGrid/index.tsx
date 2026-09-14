import React from 'react';
import './ExampleGrid.styles.css';

const EXAMPLES = [
  {
    href: '/examples/coffee-shop/',
    swatch: 'example-swatch--coffee',
    name: 'Ember Coffee & Co.',
    desc: 'Warm artisan café landing page with hero, menu cards, story section, and newsletter signup.',
    meta: 'Amber palette · Playfair Display'
  },
  {
    href: '/examples/pulse-analytics/',
    swatch: 'example-swatch--pulse',
    name: 'Meridian Analytics',
    desc: 'SaaS dashboard shell with KPI cards, sortable data table, filters, and sidebar navigation.',
    meta: 'Indigo palette · Inter'
  },
  {
    href: '/examples/forma-studio/',
    swatch: 'example-swatch--forma',
    name: 'Forma Studio',
    desc: 'Dark-mode creative agency with project grid, team section, and contact form.',
    meta: 'Cyan palette · Space Grotesk · Dark theme'
  }
];

// Ported from docs/src/pages/examples/introduction/index.astro's grid. Unlike
// ComponentGrid/RecipeGrid, this uses a plain <a> (not @docusaurus/Link) —
// these targets are standalone static HTML files under static/examples/
// (copied verbatim, not Docusaurus routes), so a full page navigation is
// correct, matching what the original Astro site (itself fully MPA) did.
export default function ExampleGrid(): JSX.Element {
  return (
    <div className="example-grid">
      {EXAMPLES.map((ex, i) => (
        <a key={ex.href} className="example-card" href={ex.href}>
          <lt-surface elevation="1">
            <div className={`example-swatch ${ex.swatch}`} />
            <div className="example-card-body">
              <div className="example-card-title-row">
                <lt-text variant="label">{ex.name}</lt-text>
                <lt-badge content={`Site ${i + 1}`} variant="neutral" size="sm" />
              </div>
              <lt-text variant="caption">{ex.desc}</lt-text>
              <div className="example-card-meta">
                <lt-text variant="caption" tag="span" class="text-muted">
                  {ex.meta}
                </lt-text>
              </div>
            </div>
          </lt-surface>
        </a>
      ))}
    </div>
  );
}
