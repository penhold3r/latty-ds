import './TypeScale.styles.css';

interface VariantMeta {
  label: string;
  size: string;
  weight: string;
  extra?: string;
}

// Ported from docs/src/pages/components/text/index.astro's inline <script>,
// which built these rows via imperative `document.createElement` calls —
// that becomes a plain `.map()` here since it's static data with no
// interactivity, simpler than the original and still fully SSR-safe.
const VARIANTS: [string, VariantMeta][] = [
  ['display-2xl', { label: 'Display 2XL', size: '4.5rem', weight: '200' }],
  ['display-xl', { label: 'Display XL', size: '3.75rem', weight: '200' }],
  ['display-lg', { label: 'Display LG', size: '3rem', weight: '200' }],
  ['h1', { label: 'Heading 1', size: '2.5rem', weight: '600' }],
  ['h2', { label: 'Heading 2', size: '2rem', weight: '600' }],
  ['h3', { label: 'Heading 3', size: '1.5rem', weight: '600' }],
  ['h4', { label: 'Heading 4', size: '1.25rem', weight: '600' }],
  ['h5', { label: 'Heading 5', size: '1.125rem', weight: '600' }],
  ['h6', { label: 'Heading 6', size: '1rem', weight: '600' }],
  ['lead', { label: 'Lead', size: '1.25rem', weight: '400' }],
  ['body', { label: 'Body', size: '1rem', weight: '400' }],
  ['body-sm', { label: 'Body SM', size: '0.875rem', weight: '400' }],
  ['caption', { label: 'Caption', size: '0.75rem', weight: '400' }],
  ['overline', { label: 'Overline', size: '0.6875rem', weight: '600', extra: 'uppercase' }]
];

export default function TypeScale(): JSX.Element {
  return (
    <div className="type-scale">
      {VARIANTS.map(([variant, meta]) => (
        <div key={variant} className="scale-row">
          <span className="scale-meta">
            {meta.size} / {meta.weight}
            {meta.extra ? ` / ${meta.extra}` : ''}
          </span>
          {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
          <lt-text variant={variant}>{meta.label}</lt-text>
        </div>
      ))}
    </div>
  );
}
