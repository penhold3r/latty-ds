import { test, expect } from '@playwright/test';

// Browser-verification for the shared `FormControlElement` base class (the layer every form-associated
// Latty control now extends).
//
// jsdom cannot prove any of this:
//   - it never checks `static formAssociated` before `attachInternals()`, so a base class that failed to
//     declare it (or a subclass that failed to inherit it) would look fine in unit tests and throw
//     `NotSupportedError` in every real browser;
//   - it never runs the form-associated reset/restore lifecycle, so `formResetCallback` and
//     `formStateRestoreCallback` can only be called by hand;
//   - it does not implement `ElementInternals.form`, so form association itself is unverifiable.
//
// So the assertions below run against Chromium, through a real `<form>`.

const FORM_CONTROLS = [
  'lt-button',
  'lt-checkbox',
  'lt-color-input',
  'lt-combobox',
  'lt-date-input',
  'lt-datepicker',
  'lt-radio',
  'lt-select',
  'lt-slider',
  'lt-switch',
  'lt-textfield'
];

test.describe('the shared form-control base class', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/components/textfield');
    await page.evaluate(async () => {
      await Promise.all(
        [
          'lt-button',
          'lt-checkbox',
          'lt-color-input',
          'lt-combobox',
          'lt-date-input',
          'lt-datepicker',
          'lt-radio',
          'lt-radio-group',
          'lt-select',
          'lt-slider',
          'lt-switch',
          'lt-textfield'
        ].map((tag) => customElements.whenDefined(tag))
      );
    });
  });

  test('every form control attaches to the form through the inherited `formAssociated` static', async ({ page }) => {
    const results = await page.evaluate(async (tags) => {
      const form = document.createElement('form');
      document.body.append(form);

      return Promise.all(
        tags.map(async (tag) => {
          const el = document.createElement(tag);
          form.append(el);
          try {
            await (el as unknown as { updateComplete: Promise<void> }).updateComplete;
          } catch {
            return { tag, ok: false, reason: 'update rejected' };
          }
          const owner = (el as unknown as { form?: HTMLFormElement | null }).form ?? null;
          return { tag, ok: owner === form, reason: owner === form ? '' : 'not form-associated' };
        })
      );
    }, FORM_CONTROLS);

    const failures = results.filter((r) => !r.ok);
    expect(failures.map((f) => `${f.tag}: ${f.reason}`)).toEqual([]);
  });

  test('a form reset restores each control to the value its markup asked for', async ({ page }) => {
    const restored = await page.evaluate(async () => {
      const form = document.createElement('form');
      document.body.append(form);

      const textfield = document.createElement('lt-textfield') as HTMLElement & { value: string };
      textfield.setAttribute('name', 'q');
      textfield.setAttribute('value', 'initial');
      form.append(textfield);

      const checkbox = document.createElement('lt-checkbox') as HTMLElement & { checked: boolean };
      checkbox.setAttribute('name', 'c');
      checkbox.setAttribute('checked', '');
      form.append(checkbox);

      const select = document.createElement('lt-select') as HTMLElement & { value: string };
      select.setAttribute('name', 's');
      select.setAttribute('value', 'b');
      form.append(select);

      await Promise.all(
        [textfield, checkbox, select].map((el) => (el as unknown as { updateComplete: Promise<void> }).updateComplete)
      );

      // Change every control away from its markup default…
      (textfield as unknown as { value: string }).value = 'changed';
      (checkbox as unknown as { checked: boolean }).checked = false;
      (select as unknown as { value: string }).value = 'a';
      await Promise.all(
        [textfield, checkbox, select].map((el) => (el as unknown as { updateComplete: Promise<void> }).updateComplete)
      );

      form.reset();
      await new Promise((r) => setTimeout(r, 50));

      return {
        textfield: (textfield as unknown as { value: string }).value,
        checkbox: (checkbox as unknown as { checked: boolean }).checked,
        select: (select as unknown as { value: string }).value
      };
    });

    expect(restored).toEqual({ textfield: 'initial', checkbox: true, select: 'b' });
  });

  test('an empty text field still submits its name, the way a native input does', async ({ page }) => {
    const entries = await page.evaluate(async () => {
      const form = document.createElement('form');
      document.body.append(form);

      const textfield = document.createElement('lt-textfield') as HTMLElement & { value: string };
      textfield.setAttribute('name', 'q');
      form.append(textfield);

      const native = document.createElement('input');
      native.setAttribute('name', 'q');
      form.append(native);

      await (textfield as unknown as { updateComplete: Promise<void> }).updateComplete;

      const data = new FormData(form);
      return {
        has: data.has('q'),
        value: data.get('q'),
        // The native input is in the same form, so a single `get` can only report one of the two — assert
        // the native behaviour separately, on its own form.
        nativeHas: new FormData(
          (() => {
            const nativeForm = document.createElement('form');
            const nativeInput = document.createElement('input');
            nativeInput.setAttribute('name', 'q');
            nativeForm.append(nativeInput);
            document.body.append(nativeForm);
            return nativeForm;
          })()
        ).has('q')
      };
    });

    expect(entries.has).toBe(true);
    expect(entries.value).toBe('');
    expect(entries.nativeHas).toBe(true);
  });

  test('a radio group follows the browser back to the radio the markup had checked', async ({ page }) => {
    const state = await page.evaluate(async () => {
      const form = document.createElement('form');
      document.body.append(form);

      const group = document.createElement('lt-radio-group') as HTMLElement & { value: string };
      group.setAttribute('name', 'plan');
      form.append(group);

      for (const [value, checked] of [
        ['free', false],
        ['pro', true]
      ] as const) {
        const radio = document.createElement('lt-radio') as HTMLElement & { value: string };
        radio.setAttribute('value', value);
        radio.setAttribute('label', value);
        if (checked) radio.setAttribute('checked', '');
        group.append(radio);
      }

      await (group as unknown as { updateComplete: Promise<void> }).updateComplete;

      const radios = [...group.querySelectorAll('lt-radio')] as (HTMLElement & {
        value: string;
        checked: boolean;
      })[];
      const before = {
        groupValue: (group as unknown as { value: string }).value,
        checked: radios.map((r) => r.checked)
      };

      // Select the other radio, the way a user would. The click has to land on the native input inside
      // the radio's shadow root — clicking the host element never reaches down into it.
      (radios[0].shadowRoot!.querySelector('input') as HTMLInputElement).click();
      await new Promise((r) => setTimeout(r, 50));
      const afterClick = {
        groupValue: (group as unknown as { value: string }).value,
        checked: radios.map((r) => r.checked)
      };

      form.reset();
      await new Promise((r) => setTimeout(r, 50));

      return {
        before,
        afterClick,
        afterReset: {
          groupValue: (group as unknown as { value: string }).value,
          checked: radios.map((r) => r.checked)
        }
      };
    });

    // Seeded from the markup: the `pro` radio is the checked one.
    expect(state.before.groupValue).toBe('pro');
    expect(state.before.checked).toEqual([false, true]);

    // The user picks the other one, and the group follows.
    expect(state.afterClick.groupValue).toBe('free');
    expect(state.afterClick.checked).toEqual([true, false]);

    // A reset puts the browser back to the markup default — and the group's `value` has to follow, or it
    // would keep pointing at a radio that is no longer checked (and re-check it on the next sync).
    expect(state.afterReset.groupValue).toBe('pro');
    expect(state.afterReset.checked).toEqual([false, true]);
  });

  test('the browser restores a control from its saved form state', async ({ page }) => {
    const restored = await page.evaluate(async () => {
      const form = document.createElement('form');
      document.body.append(form);

      const textfield = document.createElement('lt-textfield') as HTMLElement & { value: string };
      textfield.setAttribute('name', 'q');
      form.append(textfield);

      const checkbox = document.createElement('lt-checkbox') as HTMLElement & {
        checked: boolean;
        value: string;
      };
      checkbox.setAttribute('name', 'c');
      checkbox.setAttribute('value', 'yes');
      form.append(checkbox);

      await Promise.all(
        [textfield, checkbox].map((el) => (el as unknown as { updateComplete: Promise<void> }).updateComplete)
      );

      // The browser calls this on the element when it restores the form's state (back/forward-cache
      // restore, autofill). jsdom never does, so the callback is invoked the way the browser would.
      const restore = (
        el: HTMLElement & { formStateRestoreCallback?: (s: File | string | FormData | null) => void },
        state: string | null
      ) => el.formStateRestoreCallback?.(state);

      restore(textfield, 'restored');
      restore(checkbox, 'yes');

      await Promise.all(
        [textfield, checkbox].map((el) => (el as unknown as { updateComplete: Promise<void> }).updateComplete)
      );

      return {
        textfield: (textfield as unknown as { value: string }).value,
        checkboxChecked: (checkbox as unknown as { checked: boolean }).checked
      };
    });

    expect(restored.textfield).toBe('restored');
    expect(restored.checkboxChecked).toBe(true);
  });
});
