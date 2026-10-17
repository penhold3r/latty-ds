import React, { useEffect, useRef } from 'react';
import manifest from '@latty-ds/web/manifest.json';

interface MemberShapeEntry {
  name: string;
  type: string;
  description: string;
  default?: string;
}

interface Member {
  name: string;
  type: string;
  options?: string[];
  default?: unknown;
  description?: string;
  /** Raw TS type text, `type: 'complex'` only — see ComponentPlayground.types.ts. */
  valueType?: string;
  /** For a `Partial<XLabels>`-shaped member only: XLabels's own fields, resolved from its *.types.ts interface
   * (name/type/description/`@default`) — lets the API table show what an i18n `labels` override actually
   * accepts, not just the bare "Partial<XLabels>" type text. See build-manifest.mjs's resolveInterfaceShape(). */
  shape?: MemberShapeEntry[];
}

interface Props {
  tag: string;
}

const formatType = (member: Member): string => {
  if (member.type === 'select' && member.options) {
    return member.options.map((o) => `'${o}'`).join(' | ');
  }
  if (member.type === 'complex') return member.valueType ?? member.type;
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

// Appends a key/type/description list under the plain description text for a `labels`-style member — the shape
// data is JSDoc already written once on the XLabels interface itself (see build-manifest.mjs), just not
// previously surfaced anywhere a consumer would see it without opening the source.
const renderDescription = (value: unknown, row: { shape?: MemberShapeEntry[] }): HTMLElement => {
  const wrapper = document.createElement('div');
  wrapper.textContent = String(value ?? '');

  if (row.shape?.length) {
    // Stacked, not a two-column grid: a function-typed key (e.g. "resizeColumn: (column: TableColumn<T>) =>
    // string") can be long enough that forcing it alongside a description column either clips it or squeezes
    // the description into an unreadably narrow strip — a key on its own line always has the table cell's full
    // width to wrap into instead.
    const list = document.createElement('dl');
    list.style.cssText = 'margin: 0.625rem 0 0;';
    for (const entry of row.shape) {
      const dt = document.createElement('dt');
      dt.style.cssText = 'margin: 0;';
      const code = document.createElement('code');
      code.style.cssText = 'color: var(--lt-text-primary); font-family: monospace; font-size: 0.8125rem;';
      code.textContent = `${entry.name}: ${entry.type}`;
      dt.appendChild(code);

      const dd = document.createElement('dd');
      dd.style.cssText = 'color: var(--lt-text-subtle); font-size: 0.8125rem; margin: 0 0 0.5rem;';
      dd.textContent = entry.default ? `${entry.description} (default: ${entry.default})` : entry.description;

      list.append(dt, dd);
    }
    list.lastElementChild!.setAttribute('style', `${list.lastElementChild!.getAttribute('style')} margin-bottom: 0;`);
    wrapper.appendChild(list);
  }

  return wrapper;
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
      description: m.description ?? '',
      shape: m.shape
    }));
    if (!ref.current) return;
    ref.current.columns = [
      { key: 'name', label: 'Property', render: codeEl('var(--lt-text-primary)', true) },
      { key: 'type', label: 'Type', render: codeEl('var(--lt-text-secondary)') },
      { key: 'default', label: 'Default', render: codeEl('var(--lt-text-subtle)', true) },
      { key: 'description', label: 'Description', render: renderDescription }
    ];
    ref.current.data = rows;
  }, [tag]);

  return <lt-table ref={ref} class="api-table" hoverable></lt-table>;
}
