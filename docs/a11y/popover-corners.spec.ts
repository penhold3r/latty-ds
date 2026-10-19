import { test, expect } from '@playwright/test';

// Regression guard for a bug found 2026-10-19: native `[popover]` elements get a UA-default, square-cornered
// `background-color` painted directly on the popover host itself. `lt-select`'s and `lt-dropdown`'s floating panel
// is a separate `<lt-surface popover>` custom element — the actual rounded shape + background live one shadow root
// deeper, on `.surface` inside `lt-surface`'s own template, which never clips the host's own UA background. The
// result: a solid square corner poking out from behind the rounded border at each corner of the popup (most visible
// in dark mode, where the UA default resolves to a near-black `Canvas` colour distinct from the component's own
// background). `lt-date-input` has the same shape (a plain `.dropdown` div with no background/radius of its own,
// relying entirely on the slotted `lt-calendar`'s inner rounded surface). `lt-combobox` never had this bug — its
// `.dropdown` div sets `border-radius`/`background` directly on the same element that carries `popover`, which
// overrides the UA default on that one element.
//
// Fixed by adding `background: transparent` to the shared `[popover]` reset (`shared/floating.ts`'s
// `floatingPanelReset`), which every one of these components' stylesheets includes. jsdom has no `showPopover`/UA
// stylesheet for `[popover]` at all, so this can only be verified in a real browser — this is that verification,
// kept as a permanent guard.
test.describe('popover floating panels have no UA-default background behind their rounded corners', () => {
  test('lt-select', async ({ page }) => {
    await page.goto('/components/button');
    await page.evaluate(() => customElements.whenDefined('lt-select'));
    const bg = await page.evaluate(async () => {
      const el = document.createElement('lt-select');
      (el as unknown as { options: unknown }).options = [
        { value: 'us', label: 'United States' },
        { value: 'ca', label: 'Canada' }
      ];
      document.body.prepend(el);
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>('.select-trigger')!.click();
      await new Promise((r) => setTimeout(r, 200));
      const host = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.dropdown')!;
      return getComputedStyle(host).backgroundColor;
    });
    expect(bg).toBe('rgba(0, 0, 0, 0)');
  });

  test('lt-dropdown', async ({ page }) => {
    await page.goto('/components/button');
    await page.evaluate(() => customElements.whenDefined('lt-dropdown'));
    const bg = await page.evaluate(async () => {
      const el = document.createElement('lt-dropdown');
      el.innerHTML = '<lt-button slot="trigger">Options</lt-button><lt-dropdown-item>Profile</lt-dropdown-item>';
      document.body.prepend(el);
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
      (el as unknown as { open: boolean }).open = true;
      await new Promise((r) => setTimeout(r, 200));
      const host = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.menu')!;
      return getComputedStyle(host).backgroundColor;
    });
    expect(bg).toBe('rgba(0, 0, 0, 0)');
  });

  test('lt-date-input', async ({ page }) => {
    await page.goto('/components/button');
    await page.evaluate(() => customElements.whenDefined('lt-date-input'));
    const bg = await page.evaluate(async () => {
      const el = document.createElement('lt-date-input');
      document.body.prepend(el);
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>('.field-btn')!.click();
      await new Promise((r) => setTimeout(r, 200));
      const host = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
      return getComputedStyle(host).backgroundColor;
    });
    expect(bg).toBe('rgba(0, 0, 0, 0)');
  });

  test('lt-combobox (already correct — same .dropdown element carries its own background)', async ({ page }) => {
    await page.goto('/components/button');
    await page.evaluate(() => customElements.whenDefined('lt-combobox'));
    const bg = await page.evaluate(async () => {
      const el = document.createElement('lt-combobox');
      (el as unknown as { options: unknown }).options = [{ value: 'us', label: 'United States' }];
      document.body.prepend(el);
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!.click();
      await new Promise((r) => setTimeout(r, 200));
      const host = el.shadowRoot!.querySelector<HTMLElement>('.dropdown')!;
      return getComputedStyle(host).backgroundColor;
    });
    expect(bg).not.toBe('rgba(0, 0, 0, 0)'); // this one paints its own background deliberately — not transparent
  });
});
