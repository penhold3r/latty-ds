import '@latty-ds/web';

interface ColDef {
  key: string;
  label: string;
  code?: boolean;
}

document.querySelectorAll<any>('lt-table.static-table').forEach((el) => {
  if (el._initialized) return;
  el._initialized = true;

  const colDefs: ColDef[] = JSON.parse(el.dataset.cols);

  el.columns = colDefs.map((col) => ({
    key: col.key,
    label: col.label,
    ...(col.code
      ? {
          render(v: unknown) {
            const code = document.createElement('code');
            code.style.fontFamily = 'monospace';
            code.style.fontSize = '0.875rem';
            code.textContent = String(v ?? '');
            return code;
          }
        }
      : {})
  }));
});
