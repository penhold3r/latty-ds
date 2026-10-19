import { test, expect } from '@playwright/test';

// Regression guard for a bug found 2026-10-19 (reported against a published 1.1.0 by a consumer's own repro):
// a form-associated component that starts disabled, then has `disabled` set back to `false`, stayed stuck
// disabled — the component's own `disabled` property read `false`, but the inner native control (`<button>`,
// `<input>`, etc.) never lost its `disabled` attribute.
//
// Root cause: `formDisabledCallback` fires for the component's *own* `disabled` changing, not only for an
// ancestor `<fieldset>` (confirmed in Chromium — the spec's form-associated "disabled state" is the union of
// both, not fieldset-only). Setting `host.disabled = false` makes Lit reflect the now-missing attribute, which
// synchronously fires this callback *from inside that same update's commit phase* — calling
// `FormDisabledController.setFieldsetDisabled()`, whose own `requestUpdate()` call was reentrant with the update
// already in flight and reliably got dropped instead of scheduling a fresh pass. jsdom never calls
// `formDisabledCallback` automatically at all (it has no model of the browser's form-associated "disabled state"
// algorithm), so this can only be verified in a real browser — this is that verification, kept as a permanent
// guard. Fixed by deferring `FormDisabledController`'s `requestUpdate()` to a microtask
// (`packages/web/src/components/shared/form-disabled.ts`), so it's never reentrant with the update that
// triggered it.
test.describe('a form-associated component re-enables cleanly after starting disabled', () => {
  test('lt-button', async ({ page }) => {
    await page.goto('/components/button');
    await page.evaluate(() => customElements.whenDefined('lt-button'));

    const stillDisabled = await page.evaluate(async () => {
      const el = document.createElement('lt-button');
      el.setAttribute('disabled', '');
      el.textContent = 'Test';
      document.body.prepend(el);
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;

      (el as unknown as { disabled: boolean }).disabled = false;
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
      // Give any dropped/async update a further chance to resolve before asserting — the bug isn't a timing
      // fluke that passes with a longer wait, but this rules that possibility out explicitly.
      await new Promise((r) => setTimeout(r, 50));

      return el.shadowRoot!.querySelector('button')!.disabled;
    });

    expect(stillDisabled).toBe(false);
  });

  test('lt-checkbox', async ({ page }) => {
    await page.goto('/components/button');
    await page.evaluate(() => customElements.whenDefined('lt-checkbox'));

    const stillDisabled = await page.evaluate(async () => {
      const el = document.createElement('lt-checkbox');
      el.setAttribute('disabled', '');
      document.body.prepend(el);
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;

      (el as unknown as { disabled: boolean }).disabled = false;
      await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
      await new Promise((r) => setTimeout(r, 50));

      return el.shadowRoot!.querySelector('input')!.disabled;
    });

    expect(stillDisabled).toBe(false);
  });
});
