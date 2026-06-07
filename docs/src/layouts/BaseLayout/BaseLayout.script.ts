import '@latty-ds/web';

import type { SidePanel } from '@latty-ds/web';

const themeBtn = document.getElementById('theme-toggle') as HTMLElement | null;

function isDarkMode(): boolean {
  const current = document.documentElement.getAttribute('data-theme');
  return current === 'dark' || (!current && window.matchMedia('(prefers-color-scheme: dark)').matches);
}

function syncThemeIcon() {
  themeBtn?.setAttribute('icon', isDarkMode() ? 'sun' : 'moon');
}

syncThemeIcon();

themeBtn?.addEventListener('click', () => {
  const next = isDarkMode() ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('lt-theme', next);
  syncThemeIcon();
});

const toggle = document.getElementById('menu-toggle') as HTMLElement | null;
const navPanel = document.getElementById('nav-panel') as (HTMLElement & SidePanel) | null;

toggle?.addEventListener('click', () => {
  navPanel?.toggle();
  toggle.setAttribute('aria-expanded', String(navPanel?.open ?? false));
});

navPanel?.addEventListener('lt-close', () => {
  toggle?.setAttribute('aria-expanded', 'false');
});

navPanel?.addEventListener('lt-nav-item-click', (e: Event) => {
  const { href } = (e as CustomEvent).detail;
  if (href) navPanel.hide();
});
