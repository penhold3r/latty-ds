import React, { useEffect, useRef } from 'react';
import tokens from '@latty-ds/tokens/tokens.json';
import './SpacingTable.styles.css';

type SpacingScale = Record<string, string>;

const spacing = (tokens as unknown as { spacing: { rem: SpacingScale; px: SpacingScale } }).spacing;
const steps = Object.keys(spacing.rem).sort((a: string, b: string) => Number(a) - Number(b));

const rows = steps.map((step: string) => ({
  step,
  varName: step === '0' ? '--lt-spacing-0' : `--lt-spacing-${step}`,
  rem: spacing.rem[step],
  px: spacing.px[step],
  barPx: Math.min(Number(step) * 4, 320)
}));

function styledEl(tag: string, cssText: string, text: string): HTMLElement {
  const el = document.createElement(tag);
  el.style.cssText = cssText;
  el.textContent = text;
  return el;
}

// Ported from docs/src/pages/tokens/spacing.astro's inline <script> — same
// useRef+useEffect pattern as ApiTable/StaticTable.
export default function SpacingTable(): JSX.Element {
  const ref = useRef<HTMLElement & { columns?: unknown[]; data?: unknown[] }>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.columns = [
      {
        key: 'step',
        label: 'Step',
        width: '52px',
        align: 'right',
        render: (v: unknown) => styledEl('span', 'font-weight: 600; color: var(--lt-text-subtle);', String(v))
      },
      {
        key: 'varName',
        label: 'CSS variable',
        width: '196px',
        render: (v: unknown) =>
          styledEl('code', 'color: var(--lt-text-primary); font-size: 0.8rem; white-space: nowrap;', String(v))
      },
      {
        key: 'rem',
        label: 'Value',
        width: '72px',
        hideOnMobile: true,
        render: (v: unknown) => styledEl('span', 'font-family: monospace; color: var(--lt-text-neutral);', String(v))
      },
      {
        key: 'px',
        label: 'px',
        width: '60px',
        hideOnMobile: true,
        render: (v: unknown) => styledEl('span', 'font-family: monospace; color: var(--lt-text-subtle);', String(v))
      },
      {
        key: 'barPx',
        label: 'Visual',
        render: (v: unknown) => {
          const wrap = document.createElement('div');
          wrap.style.cssText = 'display: flex; align-items: center;';
          const bar = document.createElement('div');
          bar.style.cssText = `height: 8px; background: var(--lt-bg-primary); border-radius: 2px; min-width: 2px; width: ${Math.max(Number(v), 2)}px;`;
          wrap.appendChild(bar);
          return wrap;
        }
      }
    ];
    ref.current.data = rows;
  }, []);

  return <lt-table ref={ref} class="spacing-table" density="compact" hoverable></lt-table>;
}
