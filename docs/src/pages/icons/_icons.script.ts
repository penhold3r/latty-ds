import '@latty/icons';
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

const iconApiTable = document.getElementById('icon-api-table') as any;
if (iconApiTable) {
  iconApiTable.columns = [
    { key: 'name', label: 'Property', render: codeEl('var(--lt-color-primary-700)', true) },
    { key: 'type', label: 'Type', render: codeEl('var(--lt-color-secondary-700)') },
    { key: 'default', label: 'Default', render: codeEl('var(--lt-color-neutral-600)', true) },
    { key: 'description', label: 'Description' }
  ];
  iconApiTable.data = [
    {
      name: 'name',
      type: 'string',
      default: '—',
      description: "Icon identifier (e.g. 'arrow-left', 'check-circle')."
    },
    {
      name: 'size',
      type: "'xs' | 'sm' | 'md' | 'lg' | 'xl'",
      default: "'md'",
      description: 'Rendered size — 12 / 16 / 20 / 24 / 32 px.'
    }
  ];
}

let activeSize = 'md';

document.querySelectorAll<HTMLButtonElement>('.size-btn').forEach((btn) => {
  if (btn.dataset.size === activeSize) btn.setAttribute('aria-pressed', 'true');

  btn.addEventListener('click', () => {
    activeSize = btn.dataset.size!;
    document.querySelectorAll<HTMLButtonElement>('.size-btn').forEach((b) => {
      b.setAttribute('aria-pressed', b.dataset.size === activeSize ? 'true' : 'false');
    });
    document.querySelectorAll<any>('.icon-preview').forEach((el) => {
      el.size = activeSize;
    });
  });
});

const toast = document.querySelector<HTMLElement>('.copy-toast')!;
let toastTimer: ReturnType<typeof setTimeout>;

document.querySelectorAll<HTMLButtonElement>('.icon-tile').forEach((tile) => {
  tile.addEventListener('click', async () => {
    const name = tile.dataset.name!;
    const snippet = `<lt-icon name="${name}" />`;
    await navigator.clipboard.writeText(snippet);

    clearTimeout(toastTimer);
    toast.textContent = `Copied: ${snippet}`;
    toast.classList.add('is-visible');
    toastTimer = setTimeout(() => toast.classList.remove('is-visible'), 2000);
  });
});
