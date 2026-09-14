import React, { useEffect, useRef } from 'react';
import './SemanticTokenTable.styles.css';

interface Props {
  rows: { tok: string; ref: string }[];
}

function codeEl(text: string): HTMLElement {
  const el = document.createElement('code');
  el.style.fontFamily = 'monospace';
  el.textContent = text;
  return el;
}

// Ported from docs/src/pages/tokens/semantic-tokens.astro's inline <script>.
// The Astro version applied one shared column config to every `.token-table`
// via querySelectorAll; here each group gets its own component instance
// (rendered once per group by the page), which is simpler in React than
// replicating the shared-selector approach.
export default function SemanticTokenTable({ rows }: Props): JSX.Element {
  const ref = useRef<HTMLElement & { columns?: unknown[]; data?: unknown[] }>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.columns = [
      { key: 'tok', label: 'Token', render: (v: unknown) => codeEl(`--lt-${v}`) },
      { key: 'ref', label: 'References', render: (v: unknown) => codeEl(`var(--lt-${v})`) },
      {
        key: 'ref',
        label: 'Preview',
        render: (v: unknown) => {
          const span = document.createElement('span');
          span.style.cssText = `display: inline-block; width: 28px; height: 28px; border-radius: 6px; vertical-align: middle; background: var(--lt-${v}); border: 1px solid var(--lt-color-neutral-200);`;
          return span;
        }
      }
    ];
    ref.current.data = rows;
  }, [rows]);

  return <lt-table ref={ref} class="token-table" density="compact"></lt-table>;
}
