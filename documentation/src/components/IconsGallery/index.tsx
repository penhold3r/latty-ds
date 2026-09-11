import React, { useRef, useState } from 'react';
import { iconGroups, sizes } from '../../data/icons';
import './IconsGallery.styles.css';

// Ported from docs/src/pages/icons/_icons.data.ts + _icons.script.ts (the
// Astro site) — just the filter/grid/copy-toast piece. The size filter and
// copy-to-clipboard toast map more naturally onto React state here
// (activeSize drives every <lt-icon>'s size prop directly, no manual DOM
// re-querying needed) than a blind port of the imperative querySelectorAll
// version. The "Sizes" demo row and "API" table live directly in
// docs/icons/introduction.mdx instead of inside this component, so their
// headings stay real markdown (Docusaurus's TOC only picks up actual
// heading elements, not dynamically-rendered ones — see the
// SemanticTokenTable/ComponentGrid precedent in this migration).
export default function IconsGallery(): JSX.Element {
  const [activeSize, setActiveSize] = useState('md');
  const [toast, setToast] = useState<{ text: string; visible: boolean }>({ text: '', visible: false });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | undefined>(undefined);

  const copyIcon = async (name: string) => {
    const snippet = `<lt-icon name="${name}" />`;
    await navigator.clipboard.writeText(snippet);
    clearTimeout(toastTimer.current);
    setToast({ text: `Copied: ${snippet}`, visible: true });
    toastTimer.current = setTimeout(() => setToast((t) => ({ ...t, visible: false })), 2000);
  };

  return (
    <>
      <div className="size-filter">
        <span className="size-filter-label">Size</span>
        {sizes.map((s) => (
          <button
            key={s.name}
            className="size-btn"
            aria-pressed={s.name === activeSize}
            onClick={() => setActiveSize(s.name)}
          >
            {s.name}
          </button>
        ))}
      </div>

      {iconGroups.map((group) => (
        <div key={group.label} className="icon-group">
          <lt-text variant="overline">{group.label}</lt-text>
          <div className="icon-grid">
            {group.icons.map((name) => (
              <button
                key={name}
                className="icon-tile"
                title={`Copy <lt-icon name="${name}" />`}
                aria-label={`Copy usage for ${name}`}
                onClick={() => copyIcon(name)}
              >
                <span className="icon-wrapper">
                  <lt-icon name={name} size={activeSize} class="icon-preview" />
                </span>
                <span className="icon-name">{name}</span>
              </button>
            ))}
          </div>
        </div>
      ))}

      <div className={`copy-toast${toast.visible ? ' is-visible' : ''}`} aria-live="polite" aria-atomic="true">
        {toast.text}
      </div>
    </>
  );
}
