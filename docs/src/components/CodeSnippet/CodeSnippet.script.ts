import '@latty-ds/web';

document.querySelectorAll('[data-snippet-id]').forEach((icon) => {
  icon.addEventListener('click', async () => {
    const el = icon as HTMLElement;
    const id = el.dataset.snippetId!;
    const code = document.getElementById(id)?.textContent ?? '';
    await navigator.clipboard.writeText(code.trim());
    el.setAttribute('name', 'check');
    setTimeout(() => {
      el.setAttribute('name', 'copy');
    }, 1500);
  });
});
