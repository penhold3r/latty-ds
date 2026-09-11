import React, { useEffect, useRef } from 'react';
import manifest from '@latty-ds/web/manifest.json';

interface Member {
  name: string;
  type: string;
  options?: string[];
  default?: unknown;
  description?: string;
}

interface Props {
  tag: string;
}

const formatType = (member: Member): string => {
  if (member.type === 'select' && member.options) {
    return member.options.map((o) => `'${o}'`).join(' | ');
  }
  return member.type;
};

const formatDefault = (member: Member): string => {
  const d = member.default;
  if (d === undefined || d === '') return '—';
  if (typeof d === 'boolean') return String(d);
  return `'${d}'`;
};

const codeEl =
  (color: string, nowrap = false) =>
  (v: unknown): HTMLElement => {
    const el = document.createElement('code');
    el.style.color = color;
    el.style.fontFamily = 'monospace';
    el.style.fontSize = '0.875rem';
    if (nowrap) el.style.whiteSpace = 'nowrap';
    el.textContent = String(v ?? '');
    return el;
  };

// Setting `data`/`columns` on the ref in an effect (not as JSX props) is
// required either way: arrays/render-functions can't be passed to a custom
// element through a JSX attribute, and `useEffect` never runs during SSR, so
// this needs no <BrowserOnly> wrapper — the table just renders empty
// server-side until this runs on the client.
export default function ApiTable({ tag }: Props): JSX.Element {
  const ref = useRef<HTMLElement & { data?: unknown[]; columns?: unknown[] }>(null);

  useEffect(() => {
    const component = (manifest as Record<string, { members?: Member[] }>)[tag];
    const members = component?.members ?? [];
    const rows = members.map((m) => ({
      name: m.name,
      type: formatType(m),
      default: formatDefault(m),
      description: m.description ?? ''
    }));
    if (!ref.current) return;
    ref.current.columns = [
      { key: 'name', label: 'Property', render: codeEl('var(--lt-text-primary)', true) },
      { key: 'type', label: 'Type', render: codeEl('var(--lt-text-secondary)') },
      { key: 'default', label: 'Default', render: codeEl('var(--lt-text-subtle)', true) },
      { key: 'description', label: 'Description' }
    ];
    ref.current.data = rows;
  }, [tag]);

  return <lt-table ref={ref} class="api-table" hoverable></lt-table>;
}
