import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { EmptyState } from '../empty-state';
import '../empty-state';

describe('<lt-empty-state>', () => {
  let el: EmptyState;

  beforeEach(async () => {
    el = document.createElement('lt-empty-state') as EmptyState;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it.each(['sm', 'md', 'lg'] as const)('reflects %s size to attribute', async (size) => {
    el.size = size;
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe(size);
  });

  it('renders title when set', async () => {
    el.title = 'No results';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="title"]')!.textContent).toBe('No results');
  });

  it('does not render title element when title is empty', () => {
    expect(el.shadowRoot!.querySelector('[part="title"]')).toBeNull();
  });

  it('renders description when set', async () => {
    el.description = 'Try a different search.';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="description"]')!.textContent).toBe('Try a different search.');
  });

  it('does not render description element when empty', () => {
    expect(el.shadowRoot!.querySelector('[part="description"]')).toBeNull();
  });

  it('renders icon wrap when icon is set', async () => {
    el.icon = 'folder';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('[part="icon"]')).toBeTruthy();
  });

  it('does not render icon wrap when icon is empty', () => {
    expect(el.shadowRoot!.querySelector('[part="icon"]')).toBeNull();
  });

  it('always renders the actions slot container', () => {
    expect(el.shadowRoot!.querySelector('[part="actions"]')).toBeTruthy();
  });
});
