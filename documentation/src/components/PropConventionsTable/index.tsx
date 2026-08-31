import { useEffect, useRef } from 'react';
import { propConventions, type PropConvention } from '../../data/components';

function codeEl(text: string): HTMLElement {
  const el = document.createElement('code');
  el.textContent = text;
  return el;
}

function valuesCell(values: string[] | undefined, note: string | undefined): HTMLElement {
  const span = document.createElement('span');
  const parts: string[] = [];
  if (values?.length) parts.push(values.map((v) => `<code>${v}</code>`).join(' · '));
  if (note) parts.push(`<em>${note}</em>`);
  span.innerHTML = parts.join(' — ');
  return span;
}

// Ported from docs/src/pages/components/introduction/index.astro's inline
// <script> — same useRef+useEffect pattern as ApiTable, no <BrowserOnly> needed.
export default function PropConventionsTable(): JSX.Element {
  const ref = useRef<HTMLElement & { columns?: unknown[]; data?: unknown[] }>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.columns = [
      { key: 'prop', label: 'Prop', width: '180px', render: (v: string) => codeEl(v) },
      { key: 'controls', label: 'Controls', width: '220px' },
      {
        key: 'values',
        label: 'Allowed values',
        render: (v: string[], row: PropConvention) => valuesCell(v, row.valuesNote)
      },
      { key: 'usedOn', label: 'Used on' }
    ];
    ref.current.data = propConventions;
  }, []);

  // @ts-expect-error -- lt-table is a custom element, not a typed JSX intrinsic
  return <lt-table ref={ref} hoverable responsive-mode="scroll"></lt-table>;
}
