import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Breadcrumb, BreadcrumbItem } from '../breadcrumb';
import '../breadcrumb';

describe('<lt-breadcrumb>', () => {
  let el: Breadcrumb;

  beforeEach(async () => {
    el = document.createElement('lt-breadcrumb') as Breadcrumb;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders a nav with aria-label', () => {
    const nav = el.shadowRoot!.querySelector('nav');
    expect(nav).toBeTruthy();
    expect(nav!.getAttribute('aria-label')).toBe('breadcrumb');
  });

  it('renders an ol list part', () => {
    const list = el.shadowRoot!.querySelector('[part="list"]');
    expect(list?.tagName).toBe('OL');
  });
});

describe('<lt-breadcrumb-item>', () => {
  let el: BreadcrumbItem;

  beforeEach(async () => {
    el = document.createElement('lt-breadcrumb-item') as BreadcrumbItem;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('renders as link when href is set', async () => {
    el.href = '/home';
    await el.updateComplete;
    const link = el.shadowRoot!.querySelector('[part="link"]');
    expect(link?.tagName).toBe('A');
    expect(link?.getAttribute('href')).toBe('/home');
  });

  it('renders as span text when current', async () => {
    el.href = '/home';
    el.current = true;
    await el.updateComplete;
    const text = el.shadowRoot!.querySelector('[part="text"]');
    expect(text).toBeTruthy();
    expect(text?.getAttribute('aria-current')).toBe('page');
    expect(el.shadowRoot!.querySelector('[part="link"]')).toBeNull();
  });

  it('renders separator', async () => {
    const sep = el.shadowRoot!.querySelector('[part="separator"]');
    expect(sep).toBeTruthy();
    expect(sep?.textContent).toBe('/');
  });
});
