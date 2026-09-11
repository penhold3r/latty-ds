import React, { useEffect, useRef } from 'react';

interface ColDef {
  key: string;
  label: string;
  code?: boolean;
}

interface Props {
  columns: ColDef[];
  rows: Record<string, string>[];
}

function codeEl(v: unknown): HTMLElement {
  const el = document.createElement('code');
  el.style.fontFamily = 'monospace';
  el.style.fontSize = '0.875rem';
  el.textContent = String(v ?? '');
  return el;
}

// Ported from docs/src/components/StaticTable (the Astro site) — same
// useRef+useEffect pattern as ApiTable/PropConventionsTable. Simpler here
// since React passes `columns`/`rows` straight through as props instead of
// round-tripping through a `data-cols` JSON attribute.
export default function StaticTable({ columns, rows }: Props): JSX.Element {
  const ref = useRef<HTMLElement & { columns?: unknown[]; data?: unknown[] }>(null);

  useEffect(() => {
    if (!ref.current) return;
    ref.current.columns = columns.map((col) => ({
      key: col.key,
      label: col.label,
      ...(col.code ? { render: codeEl } : {})
    }));
    ref.current.data = rows;
  }, [columns, rows]);

  return <lt-table ref={ref} hoverable></lt-table>;
}
