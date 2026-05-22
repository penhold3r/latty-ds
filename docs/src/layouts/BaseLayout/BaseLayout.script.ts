import '@latty/web';
import { iconRegistry, lattyIcons } from '@latty/icons';
iconRegistry.registerIcons(lattyIcons);

import type { SidePanel } from '@latty/web';

const themeBtn = document.getElementById('theme-toggle') as HTMLButtonElement | null;

themeBtn?.addEventListener('click', () => {
  const current = document.documentElement.getAttribute('data-theme');
  const osPrefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const effective = current ?? (osPrefersDark ? 'dark' : 'light');
  const next = effective === 'dark' ? 'light' : 'dark';
  document.documentElement.setAttribute('data-theme', next);
  localStorage.setItem('lt-theme', next);
});

const toggle = document.getElementById('menu-toggle') as HTMLButtonElement | null;
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
