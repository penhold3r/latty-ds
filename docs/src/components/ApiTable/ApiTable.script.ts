import '@latty/web';

const codeEl =
  (color: string, nowrap = false) =>
  (v: unknown) => {
    const el = document.createElement('code');
    el.style.color = color;
    el.style.fontFamily = 'monospace';
    el.style.fontSize = '0.875rem';
    if (nowrap) el.style.whiteSpace = 'nowrap';
    el.textContent = String(v ?? '');
    return el;
  };

document.querySelectorAll<any>('lt-table.api-table').forEach((el) => {
  el.columns = [
    { key: 'name', label: 'Property', render: codeEl('var(--lt-color-primary-700)', true) },
    { key: 'type', label: 'Type', render: codeEl('var(--lt-color-secondary-700)') },
    { key: 'default', label: 'Default', render: codeEl('var(--lt-color-neutral-600)', true) },
    { key: 'description', label: 'Description' }
  ];
});
