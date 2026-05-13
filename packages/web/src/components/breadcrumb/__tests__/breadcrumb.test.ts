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

  it('sets --lt-breadcrumb-separator when separator property changes', async () => {
    el.separator = '>';
    await el.updateComplete;
    expect(el.style.getPropertyValue('--lt-breadcrumb-separator')).toBe('">"');
  });

  it('removes --lt-breadcrumb-separator when separator is null', async () => {
    el.separator = '>';
    await el.updateComplete;
    // @ts-expect-error - testing null handling
    el.separator = null;
    await el.updateComplete;
    expect(el.style.getPropertyValue('--lt-breadcrumb-separator')).toBe('');
  });

  it('removes --lt-breadcrumb-separator when separator is undefined', async () => {
    el.separator = '>';
    await el.updateComplete;
    // @ts-expect-error - testing undefined handling
    el.separator = undefined;
    await el.updateComplete;
    expect(el.style.getPropertyValue('--lt-breadcrumb-separator')).toBe('');
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

  it('renders default separator', async () => {
    const sep = el.shadowRoot!.querySelector('[part="separator"]');
    expect(sep).toBeTruthy();
    // Default value in render is '/'
    expect(sep?.textContent).toBe(''); // Text content is empty because it uses ::after
  });

  it('applies local separator override style', async () => {
    el.separator = '>>';
    await el.updateComplete;
    const sep = el.shadowRoot!.querySelector('[part="separator"]') as HTMLElement;
    expect(sep.style.getPropertyValue('--lt-breadcrumb-separator')).toBe('">>"');
  });

  it('does not apply local override style when separator is empty string', async () => {
    el.separator = '';
    await el.updateComplete;
    const sep = el.shadowRoot!.querySelector('[part="separator"]') as HTMLElement;
    expect(sep.style.getPropertyValue('--lt-breadcrumb-separator')).toBe('');
  });

  it('does not apply local override style when separator is null', async () => {
    // @ts-expect-error - testing null handling
    el.separator = null;
    await el.updateComplete;
    const sep = el.shadowRoot!.querySelector('[part="separator"]') as HTMLElement;
    expect(sep.style.getPropertyValue('--lt-breadcrumb-separator')).toBe('');
  });
});
