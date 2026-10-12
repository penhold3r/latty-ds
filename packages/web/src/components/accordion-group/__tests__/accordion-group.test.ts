import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { AccordionGroup } from '../accordion-group';
import '../accordion-group';
import '../../accordion/accordion';
import type { Accordion } from '../../accordion/accordion';

describe('<lt-accordion-group>', () => {
  let el: AccordionGroup;

  beforeEach(async () => {
    el = document.createElement('lt-accordion-group') as AccordionGroup;
    el.innerHTML = `
      <lt-accordion label="A" open>Content A</lt-accordion>
      <lt-accordion label="B">Content B</lt-accordion>
      <lt-accordion label="C">Content C</lt-accordion>
    `;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  const accordions = () => [...el.querySelectorAll('lt-accordion')] as Accordion[];

  it('renders a shadow root', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('projects slotted accordions', () => {
    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();
    expect(accordions()).toHaveLength(3);
  });

  it('is not multiple by default', () => {
    expect(el.multiple).toBe(false);
    expect(el.getAttribute('multiple')).toBe(null);
  });

  it('reflects multiple to attribute', async () => {
    el.multiple = true;
    await el.updateComplete;
    expect(el.hasAttribute('multiple')).toBe(true);
  });

  describe('exclusive mode (default)', () => {
    it('closes the previously open accordion when another one opens', async () => {
      const [a, b] = accordions();
      expect(a.open).toBe(true);

      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(a.open).toBe(false);
      expect(b.open).toBe(true);
    });

    it('dispatches a toggle event on the accordion it force-closes', async () => {
      const [a, b] = accordions();
      const handler = vi.fn();
      a.addEventListener('toggle', handler);

      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ open: false });
    });

    it('does not touch accordions that are already closed', async () => {
      const [a, b, c] = accordions();
      const handler = vi.fn();
      c.addEventListener('toggle', handler);

      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(a.open).toBe(false);
      expect(c.open).toBe(false);
      expect(handler).not.toHaveBeenCalled(); // c was already closed — nothing to force-close
    });

    it('a close event (open: false) does not close any other accordion', async () => {
      const [a, b] = accordions();
      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;
      expect(a.open).toBe(false);

      // Now close B — should not have any side effect on A (which is already closed) or itself re-triggering.
      b.open = false;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: false }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(a.open).toBe(false);
      expect(b.open).toBe(false);
    });
  });

  describe('multiple mode', () => {
    beforeEach(async () => {
      el.multiple = true;
      await el.updateComplete;
    });

    it('leaves other open accordions alone when another one opens', async () => {
      const [a, b] = accordions();
      expect(a.open).toBe(true);

      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(a.open).toBe(true);
      expect(b.open).toBe(true);
    });

    it('does not dispatch any toggle event on other accordions', async () => {
      const [a, b] = accordions();
      const handler = vi.fn();
      a.addEventListener('toggle', handler);

      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(handler).not.toHaveBeenCalled();
    });
  });

  describe('dynamic children', () => {
    it('wires a newly-slotted accordion via slotchange', async () => {
      const [a] = accordions();
      expect(a.open).toBe(true);

      const d = document.createElement('lt-accordion') as Accordion;
      d.label = 'D';
      el.appendChild(d);
      await el.updateComplete;
      el.shadowRoot!.querySelector('slot')!.dispatchEvent(new Event('slotchange'));

      d.open = true;
      d.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(a.open).toBe(false);
      expect(d.open).toBe(true);
    });

    it('re-wires after being moved in the DOM (reconnected)', async () => {
      const otherParent = document.createElement('div');
      document.body.appendChild(otherParent);
      otherParent.appendChild(el); // disconnects then reconnects `el`
      await el.updateComplete;

      const [a, b] = accordions();
      b.open = true;
      b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));
      await el.updateComplete;

      expect(a.open).toBe(false);
      expect(b.open).toBe(true);
      otherParent.remove();
    });
  });

  it('removes its toggle listeners on disconnect', async () => {
    const [a, b] = accordions();
    el.remove();
    await el.updateComplete;

    const handler = vi.fn();
    a.addEventListener('toggle', handler);
    b.open = true;
    b.dispatchEvent(new CustomEvent('toggle', { detail: { open: true }, bubbles: true, composed: true }));

    // With the group disconnected (and its listeners removed), nothing should force-close `a` anymore.
    expect(a.open).toBe(true);
    expect(handler).not.toHaveBeenCalled();
  });
});
