import { describe, it, expect, beforeEach, afterEach } from 'vitest';
import type { Accordion } from '../accordion';
import '../accordion';

describe('<lt-accordion>', () => {
  let el: Accordion;

  beforeEach(async () => {
    el = document.createElement('lt-accordion') as Accordion;
    el.label = 'Test accordion';
    el.textContent = 'Accordion content';
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a details element in shadow DOM', () => {
    const details = el.shadowRoot!.querySelector('details');
    expect(details).toBeTruthy();
  });

  it('renders a summary element', () => {
    const summary = el.shadowRoot!.querySelector('summary');
    expect(summary).toBeTruthy();
  });

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it('is not open by default', () => {
    expect(el.open).toBe(false);
    const details = el.shadowRoot!.querySelector('details') as HTMLDetailsElement;
    expect(details.open).toBe(false);
  });

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
  });

  it('can be opened', async () => {
    el.open = true;
    await el.updateComplete;
    const details = el.shadowRoot!.querySelector('details') as HTMLDetailsElement;
    expect(details.open).toBe(true);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    expect(el.hasAttribute('disabled')).toBe(true);
  });

  it('renders label in summary', () => {
    const summaryText = el.shadowRoot!.querySelector('.summary-text');
    expect(summaryText?.textContent).toContain('Test accordion');
  });

  it('renders chevron icon', () => {
    const chevron = el.shadowRoot!.querySelector('.chevron');
    expect(chevron).toBeTruthy();
  });

  it('renders content in default slot', () => {
    const slot = el.shadowRoot!.querySelector('slot:not([name])');
    expect(slot).toBeTruthy();
  });

  it('supports all variants', async () => {
    const variants = ['default', 'filled', 'outlined'] as const;

    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('can change variant', async () => {
    el.variant = 'filled';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('filled');
  });

  it('dispatches toggle event when opened', async () => {
    let eventFired = false;
    let eventOpen = false;

    el.addEventListener('toggle', ((e: CustomEvent) => {
      eventFired = true;
      eventOpen = e.detail.open;
    }) as EventListener);

    const summary = el.shadowRoot!.querySelector('summary') as HTMLElement;
    summary.click();

    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(eventFired).toBe(true);
    expect(eventOpen).toBe(true);
    expect(el.open).toBe(true);
  });

  it('dispatches toggle event when closed', async () => {
    el.open = true;
    await el.updateComplete;

    let eventFired = false;
    let eventOpen = true;

    el.addEventListener('toggle', ((e: CustomEvent) => {
      eventFired = true;
      eventOpen = e.detail.open;
    }) as EventListener);

    const summary = el.shadowRoot!.querySelector('summary') as HTMLElement;
    summary.click();

    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 50));

    expect(eventFired).toBe(true);
    expect(eventOpen).toBe(false);
    expect(el.open).toBe(false);
  });

  it('syncs open property with details element', async () => {
    const details = el.shadowRoot!.querySelector('details') as HTMLDetailsElement;

    expect(details.open).toBe(false);

    el.open = true;
    await el.updateComplete;
    expect(details.open).toBe(true);

    el.open = false;
    await el.updateComplete;
    expect(details.open).toBe(false);
  });
});
