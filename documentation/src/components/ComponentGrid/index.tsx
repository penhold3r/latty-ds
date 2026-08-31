import Link from '@docusaurus/Link';
import { components } from '../../data/components';
import './ComponentGrid.styles.css';

// Ported from docs/src/pages/components/introduction/index.astro's `.map()`
// block — pure JSX, no `set:html` needed here (unlike VariantPresets) since
// every piece is a real prop/child, not an assembled HTML string. One
// deliberate improvement over the direct port: `@docusaurus/Link` instead of
// a plain `<a>`, so navigating the grid uses Docusaurus's client-side router
// instead of a full page reload.
export default function ComponentGrid(): JSX.Element {
  return (
    <div className="component-grid">
      {components.map((c) => (
        <Link key={c.href} className="component-card" to={c.href}>
          {/* @ts-expect-error -- lt-surface is a custom element, not a typed JSX intrinsic */}
          <lt-surface appearance="outlined" elevation="0">
            <div className="card-body">
              {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
              <lt-text variant="label">{c.name}</lt-text>
              {/* @ts-expect-error -- lt-chip is a custom element, not a typed JSX intrinsic */}
              <lt-chip appearance="outlined" variant="neutral" size="sm">
                {c.tag}
              </lt-chip>
              {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
              <lt-text variant="body-sm">{c.desc}</lt-text>
            </div>
            {/* @ts-expect-error -- lt-surface is a custom element, not a typed JSX intrinsic */}
          </lt-surface>
        </Link>
      ))}
    </div>
  );
}
