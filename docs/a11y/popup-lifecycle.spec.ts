import { test, expect } from '@playwright/test';

/**
 * The shared popup lifecycle, verified in a real browser.
 *
 * `lt-select`, `lt-combobox`, `lt-dropdown` and `lt-date-input` each show a floating panel. The
 * lifecycle around it — position the panel, watch for a click outside, tear the positioning down
 * again — is shared (`shared/popup.ts`); what differs between them is which element the panel is
 * anchored to and which pointer event counts as a click outside.
 *
 * jsdom cannot verify any of this: it has no `showPopover`, no UA stylesheet for `[popover]`, and no
 * layout, so "the panel is showing" and "the panel was positioned" are both unobservable there. This
 * spec drives a real browser and reads the popover's own state (`:popover-open`).
 */
const CASES = [
  { tag: 'lt-select', outsideEvent: 'click' },
  { tag: 'lt-combobox', outsideEvent: 'click' },
  { tag: 'lt-dropdown', outsideEvent: 'click' },
  { tag: 'lt-date-input', outsideEvent: 'pointerdown' }
] as const;

interface Snapshot {
  /** The panel was showing as a popover. */
  showing: boolean;
  /** The panel had been given a position (floating-ui writes `left`/`top`). */
  positioned: boolean;
  /** The trigger reported itself as expanded. */
  expanded: boolean;
}

interface Result {
  opened: Snapshot;
  afterOutside: Snapshot;
  afterEscape: Snapshot;
}

for (const { tag, outsideEvent } of CASES) {
  test(`${tag} shows its panel, and closes it again`, async ({ page }) => {
    await page.goto('/components/button');

    const result: Result = await page.evaluate(
      async ([tag, outsideEvent]) => {
        await customElements.whenDefined(tag);
        const el = document.createElement(tag) as HTMLElement & {
          options?: unknown;
          open?: boolean;
          updateComplete: Promise<void>;
        };
        if (tag === 'lt-select' || tag === 'lt-combobox') {
          el.options = [{ value: 'us', label: 'United States' }];
        }
        if (tag === 'lt-dropdown') {
          el.innerHTML = '<lt-button slot="trigger">Options</lt-button><lt-dropdown-item>Profile</lt-dropdown-item>';
        }
        document.body.prepend(el);
        await el.updateComplete;

        const q = (selector: string) => el.shadowRoot!.querySelector<HTMLElement>(selector);
        const panel = (): HTMLElement | null => {
          if (tag === 'lt-select') return q('lt-surface.dropdown');
          if (tag === 'lt-dropdown') return q('lt-surface.menu');
          return q('.dropdown');
        };
        const trigger = (): HTMLElement | null => {
          if (tag === 'lt-select') return q('.select-trigger');
          if (tag === 'lt-combobox') return q('input');
          if (tag === 'lt-date-input') return q('#field-btn');
          return el.querySelector<HTMLElement>('[slot="trigger"]');
        };
        const open = () => {
          if (tag === 'lt-select') q('.select-trigger')!.click();
          else if (tag === 'lt-combobox') q('.input-wrap')!.click();
          else if (tag === 'lt-date-input') q('#field-btn')!.click();
          else el.open = true;
        };
        const escapeTarget = (): EventTarget => {
          if (tag === 'lt-select') return q('.select-trigger')!;
          if (tag === 'lt-combobox') return q('input')!;
          if (tag === 'lt-date-input') return q('.dropdown')!;
          return el.querySelector('[slot="trigger"]')!;
        };
        const snapshot = () => {
          const p = panel();
          return {
            showing: !!p && p.matches(':popover-open'),
            positioned: !!p && p.style.left !== '' && p.style.top !== '',
            expanded: trigger()?.getAttribute('aria-expanded') === 'true'
          };
        };
        const settle = () => new Promise((r) => setTimeout(r, 250));

        open();
        await settle();
        const opened = snapshot();

        document.body.dispatchEvent(new MouseEvent(outsideEvent, { bubbles: true, composed: true }));
        await settle();
        const afterOutside = snapshot();

        open();
        await settle();
        escapeTarget().dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
        await settle();
        const afterEscape = snapshot();

        el.remove();
        return { opened, afterOutside, afterEscape };
      },
      [tag, outsideEvent] as const
    );

    // Opened: the panel is on screen, it was given a position, and the trigger says so.
    expect(result.opened.showing, `${tag} shows its panel`).toBe(true);
    expect(result.opened.positioned, `${tag} positions its panel`).toBe(true);
    expect(result.opened.expanded, `${tag} reports itself as expanded`).toBe(true);

    // Closed by a click outside.
    expect(result.afterOutside.showing, `${tag} closes on a click outside`).toBe(false);
    expect(result.afterOutside.expanded, `${tag} reports itself as closed`).toBe(false);

    // Closed by Escape.
    expect(result.afterEscape.showing, `${tag} closes on Escape`).toBe(false);
    expect(result.afterEscape.expanded, `${tag} reports itself as closed`).toBe(false);
  });
}
