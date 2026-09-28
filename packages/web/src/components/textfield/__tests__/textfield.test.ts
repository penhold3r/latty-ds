import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { axe } from 'vitest-axe';
import type { Textfield } from '../textfield';
import '../textfield';

describe('<lt-textfield>', () => {
  let el: Textfield;

  beforeEach(async () => {
    el = document.createElement('lt-textfield') as Textfield;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('has no axe violations', async () => {
    el.label = 'Test field';
    await el.updateComplete;
    expect(await axe(el)).toHaveNoViolations();
  });

  it('renders an input element in shadow DOM', () => {
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeTruthy();
  });

  it('forwards name to the native input', async () => {
    el.name = 'email';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('name')).toBe('email');
  });

  it('omits the name attribute on the native input when unset', () => {
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.hasAttribute('name')).toBe(false);
  });

  it('forwards name to the native textarea for multiline type', async () => {
    el.type = 'multiline';
    el.name = 'bio';
    await el.updateComplete;
    const textarea = el.shadowRoot!.querySelector('textarea')!;
    expect(textarea.getAttribute('name')).toBe('bio');
  });

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
  });

  it('has default type of text', () => {
    expect(el.type).toBe('text');
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.type).toBe('text');
  });

  it('can change variant', async () => {
    el.variant = 'error';
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe('error');
  });

  it('can change size', async () => {
    el.size = 'lg';
    await el.updateComplete;
    expect(el.getAttribute('size')).toBe('lg');
  });

  it('can change type', async () => {
    el.type = 'email';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.type).toBe('email');
  });

  it('renders label when provided', async () => {
    el.label = 'Username';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('label');
    expect(label?.textContent).toContain('Username');
  });

  it('does not render label when not provided', () => {
    const label = el.shadowRoot!.querySelector('label');
    expect(label).toBeFalsy();
  });

  it('renders helper text when provided', async () => {
    el.helperText = 'Enter your username';
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText?.textContent).toBe('Enter your username');
  });

  it('does not render helper text when not provided', () => {
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText).toBeFalsy();
  });

  it('renders helper text from function with error=false when valid', async () => {
    el.helperText = (error) => (error ? 'Invalid email' : 'Enter your email');
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText?.textContent).toBe('Enter your email');
  });

  it('renders helper text from function with error=true when variant is error', async () => {
    el.helperText = (error) => (error ? 'Invalid email' : 'Enter your email');
    el.variant = 'error';
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText?.textContent).toBe('Invalid email');
  });

  it('renders helper text from function with error=true on auto-error', async () => {
    el.type = 'email';
    el.helperText = (error) => (error ? 'Invalid email' : 'Enter your email');
    await el.updateComplete;
    const native = el.shadowRoot!.querySelector('input')!;
    native.value = 'notanemail';
    native.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    native.dispatchEvent(new Event('blur'));
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText?.textContent).toBe('Invalid email');
  });

  it('shows required indicator when required', async () => {
    el.label = 'Username';
    el.required = true;
    await el.updateComplete;
    const indicator = el.shadowRoot!.querySelector('.required-indicator');
    expect(indicator?.textContent).toBe('*');
  });

  it('sets placeholder attribute', async () => {
    el.placeholder = 'Enter text...';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.placeholder).toBe('Enter text...');
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.hasAttribute('disabled')).toBe(true);
  });

  describe('formDisabledCallback (a disabled ancestor <fieldset>, X1)', () => {
    it('disables the inner input without touching the disabled property/attribute', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('input')!.hasAttribute('disabled')).toBe(true);
      expect(el.disabled).toBe(false);
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('re-enables the inner input once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('input')!.hasAttribute('disabled')).toBe(false);
    });

    it('does not re-enable the input if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false); // fieldset re-enabled, but el.disabled is still true
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('input')!.hasAttribute('disabled')).toBe(true);
    });

    it('disables the password toggle too', async () => {
      el.type = 'password';
      await el.updateComplete;
      el.formDisabledCallback(true);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.password-toggle')!.hasAttribute('disabled')).toBe(true);
    });
  });

  it('can be readonly', async () => {
    el.readonly = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.hasAttribute('readonly')).toBe(true);
  });

  it('can be required', async () => {
    el.required = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.hasAttribute('required')).toBe(true);
  });

  it('updates value on input', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test value';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;
    expect(el.value).toBe('test value');
  });

  it('emits custom input event', async () => {
    const inputHandler = vi.fn();
    el.addEventListener('input', inputHandler);

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test';
    input.dispatchEvent(new Event('input', { bubbles: true }));
    await el.updateComplete;

    expect(inputHandler).toHaveBeenCalled();
    expect(inputHandler.mock.calls[0][0].detail.value).toBe('test');
  });

  it('emits custom change event', async () => {
    const changeHandler = vi.fn();
    el.addEventListener('change', changeHandler);

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test';
    input.dispatchEvent(new Event('change', { bubbles: true }));
    await el.updateComplete;

    expect(changeHandler).toHaveBeenCalled();
    expect(changeHandler.mock.calls[0][0].detail.value).toBe('test');
  });

  it('does not double-fire input for consumers listening on the host', async () => {
    // Real browser input/change events on the native <input> are composed
    // (cross the shadow boundary), so without stopPropagation() a consumer
    // listening on the host would see both our CustomEvent and the original
    // native event re-arriving — this reproduces that with composed: true.
    const inputHandler = vi.fn();
    el.addEventListener('input', inputHandler);

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test';
    input.dispatchEvent(new Event('input', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(inputHandler).toHaveBeenCalledTimes(1);
    expect(inputHandler.mock.calls[0][0].detail.value).toBe('test');
  });

  it('does not double-fire change for consumers listening on the host', async () => {
    const changeHandler = vi.fn();
    el.addEventListener('change', changeHandler);

    const input = el.shadowRoot!.querySelector('input')!;
    input.value = 'test';
    input.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(changeHandler).toHaveBeenCalledTimes(1);
    expect(changeHandler.mock.calls[0][0].detail.value).toBe('test');
  });

  it('sets aria-invalid when variant is error', async () => {
    el.variant = 'error';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('true');
  });

  it('sets aria-invalid to false when variant is not error', async () => {
    el.variant = 'success';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.getAttribute('aria-invalid')).toBe('false');
  });

  it('sets aria-label from label or placeholder', async () => {
    el.label = 'Username';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.getAttribute('aria-label')).toBe('Username');
  });

  it('supports all variants', async () => {
    const variants = ['default', 'success', 'warning', 'error'] as const;

    for (const variant of variants) {
      el.variant = variant;
      await el.updateComplete;
      expect(el.getAttribute('variant')).toBe(variant);
    }
  });

  it('supports all sizes', async () => {
    const sizes = ['sm', 'md', 'lg'] as const;

    for (const size of sizes) {
      el.size = size;
      await el.updateComplete;
      expect(el.getAttribute('size')).toBe(size);
    }
  });

  it('supports all input types', async () => {
    const types = ['text', 'email', 'password', 'tel', 'url', 'number'] as const;

    for (const type of types) {
      el.type = type;
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.type).toBe(type);
    }
  });

  it('binds value property to input', async () => {
    el.value = 'initial value';
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input');
    expect(input?.value).toBe('initial value');
  });

  describe('value is not reflected as an attribute (TFD-1)', () => {
    it('does not put a typed password value in the DOM', async () => {
      el.type = 'password';
      el.value = 'hunter2';
      await el.updateComplete;
      expect(el.hasAttribute('value')).toBe(false);
      expect(el.outerHTML).not.toContain('hunter2');
    });

    it('does not reflect a plain text value either, for consistency', async () => {
      el.value = 'some text';
      await el.updateComplete;
      expect(el.hasAttribute('value')).toBe(false);
    });
  });

  // jsdom doesn't implement the form-associated custom element reset lifecycle (verified: form.reset() never
  // calls formResetCallback at all), so these call it directly — the same thing a real form reset does, per the
  // HTML spec's "reset the form owner" algorithm. The wiring from a real <form>'s reset button to this callback
  // is native browser behavior for any formAssociated element, not something this component implements itself.
  describe('formResetCallback restores the markup default (TFD-1, TFD-7)', () => {
    beforeEach(async () => {
      el.remove();
      el = document.createElement('lt-textfield') as Textfield;
      el.setAttribute('value', 'initial value');
      document.body.appendChild(el);
      await el.updateComplete;
    });

    it('restores the value set in markup, not empty', async () => {
      el.value = 'typed by the user';
      await el.updateComplete;
      el.formResetCallback();
      expect(el.value).toBe('initial value');
    });

    it('clears the touched/auto-error state along with the value', async () => {
      el.type = 'email';
      el.value = 'not-an-email';
      await el.updateComplete;
      el.shadowRoot!.querySelector('input')!.dispatchEvent(new Event('blur'));
      await el.updateComplete;
      expect(el.hasAttribute('data-invalid')).toBe(true);

      el.formResetCallback();
      await el.updateComplete;
      expect(el.hasAttribute('data-invalid')).toBe(false);
    });
  });

  describe('Enter submits the containing form (TFD-2)', () => {
    it('calls form.requestSubmit() on Enter in the input', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);
      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.shadowRoot!.querySelector('input')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(requestSubmit).toHaveBeenCalledOnce();
      form.remove();
    });

    it('does not submit on other keys', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);
      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.shadowRoot!.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key: 'a', bubbles: true }));

      expect(requestSubmit).not.toHaveBeenCalled();
      form.remove();
    });

    it('does not submit while composing (IME)', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);
      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.shadowRoot!.querySelector('input')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', isComposing: true, bubbles: true })
      );

      expect(requestSubmit).not.toHaveBeenCalled();
      form.remove();
    });

    it('does not submit while disabled', async () => {
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);
      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.disabled = true;
      await el.updateComplete;
      el.shadowRoot!.querySelector('input')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(requestSubmit).not.toHaveBeenCalled();
      form.remove();
    });

    it('does not submit on Enter in the multiline textarea', async () => {
      el.type = 'multiline';
      await el.updateComplete;
      const form = document.createElement('form');
      form.appendChild(el);
      document.body.appendChild(form);
      const requestSubmit = vi.fn();
      vi.spyOn(form, 'requestSubmit').mockImplementation(requestSubmit);

      el.shadowRoot!.querySelector('textarea')!.dispatchEvent(
        new KeyboardEvent('keydown', { key: 'Enter', bubbles: true })
      );

      expect(requestSubmit).not.toHaveBeenCalled();
      form.remove();
    });
  });

  describe('password visibility toggle (TFD-5)', () => {
    // A real <button>, not a bare <lt-icon>: the icon itself only carries the visual name now.
    const toggle = () => el.shadowRoot!.querySelector<HTMLButtonElement>('.password-toggle')!;
    const toggleIconName = () => toggle().querySelector('lt-icon')!.getAttribute('name');

    it('is a real button, reachable by Tab and operable with the keyboard', async () => {
      el.type = 'password';
      await el.updateComplete;
      expect(toggle().tagName).toBe('BUTTON');
      expect(toggle().type).toBe('button');
    });

    it('shows eye icon for password fields', async () => {
      el.type = 'password';
      await el.updateComplete;
      expect(toggleIconName()).toBe('eye');
    });

    it('has an accessible name that reflects the current state', async () => {
      el.type = 'password';
      await el.updateComplete;
      expect(toggle().getAttribute('aria-label')).toBe('Show password');
      expect(toggle().getAttribute('aria-pressed')).toBe('false');

      toggle().click();
      await el.updateComplete;
      expect(toggle().getAttribute('aria-label')).toBe('Hide password');
      expect(toggle().getAttribute('aria-pressed')).toBe('true');
    });

    it('toggles to eye-off icon when clicked', async () => {
      el.type = 'password';
      await el.updateComplete;
      toggle().click();
      await el.updateComplete;
      expect(toggleIconName()).toBe('eye-off');
    });

    it('changes input type to text when password is visible', async () => {
      el.type = 'password';
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input');

      expect(input?.type).toBe('password');

      toggle().click();
      await el.updateComplete;

      expect(input?.type).toBe('text');
    });

    it('toggles back to password type when eye-off is clicked', async () => {
      el.type = 'password';
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input');

      toggle().click();
      await el.updateComplete;
      expect(input?.type).toBe('text');

      toggle().click();
      await el.updateComplete;
      expect(input?.type).toBe('password');
      expect(toggleIconName()).toBe('eye');
    });

    it('has password-toggle class alongside icon-end', async () => {
      el.type = 'password';
      await el.updateComplete;
      expect(toggle().classList.contains('icon-end')).toBe(true);
    });

    // jsdom doesn't implement the browser default action this guards against (a real .click() there never
    // moves focus to begin with, unlike real browsers), so this only confirms the guard is wired up; the actual
    // behavior — the input keeps focus through a real mouse click on the toggle — is verified in Chromium.
    it('suppresses the mousedown default action that would otherwise steal focus', async () => {
      el.type = 'password';
      await el.updateComplete;
      const event = new MouseEvent('mousedown', { bubbles: true, cancelable: true });
      toggle().dispatchEvent(event);
      expect(event.defaultPrevented).toBe(true);
    });
  });

  describe('variant icons', () => {
    it('shows check-circle icon for success variant', async () => {
      el.variant = 'success';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.getAttribute('name')).toBe('check-circle');
    });

    it('shows warning-triangle icon for warning variant', async () => {
      el.variant = 'warning';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.getAttribute('name')).toBe('warning-triangle');
    });

    it('shows xmark-circle icon for error variant', async () => {
      el.variant = 'error';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.getAttribute('name')).toBe('xmark-circle');
    });

    it('does not show icon for default variant', async () => {
      el.variant = 'default';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon).toBeFalsy();
    });

    it('has variant-icon class on variant icons', async () => {
      el.variant = 'success';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.classList.contains('variant-icon')).toBe(true);
    });

    it('variant icons are not clickable', async () => {
      el.variant = 'success';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.classList.contains('password-toggle')).toBe(false);
    });
  });

  describe('icon start', () => {
    it('renders start icon when provided', async () => {
      el.iconStart = 'search';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-start');
      expect(icon?.getAttribute('name')).toBe('search');
    });

    it('does not render start icon when not provided', () => {
      const icon = el.shadowRoot!.querySelector('.icon-start');
      expect(icon).toBeFalsy();
    });

    it('adds has-start-icon class to input', async () => {
      el.iconStart = 'search';
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.classList.contains('has-start-icon')).toBe(true);
    });
  });

  describe('validation', () => {
    const typeAndLeave = async (value: string) => {
      const native = el.shadowRoot!.querySelector('input, textarea') as HTMLInputElement;
      native.value = value;
      native.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      native.dispatchEvent(new Event('blur'));
      await el.updateComplete;
    };

    const typeOnly = async (value: string) => {
      const native = el.shadowRoot!.querySelector('input, textarea') as HTMLInputElement;
      native.value = value;
      native.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
    };

    it('has no auto-error before blur', async () => {
      el.type = 'email';
      await el.updateComplete;
      await typeOnly('not-an-email');
      expect(el.hasAttribute('data-invalid')).toBeFalsy();
    });

    it('shows auto-error on blur with invalid value', async () => {
      el.type = 'email';
      await el.updateComplete;
      await typeAndLeave('not-an-email');
      expect(el.hasAttribute('data-invalid')).toBeTruthy();
    });

    it('sets aria-invalid on auto-error', async () => {
      el.type = 'email';
      await el.updateComplete;
      await typeAndLeave('bad');
      const input = el.shadowRoot!.querySelector('input');
      expect(input?.getAttribute('aria-invalid')).toBe('true');
    });

    it('clears auto-error when value becomes valid after blur', async () => {
      el.type = 'email';
      await el.updateComplete;
      await typeAndLeave('bad');
      expect(el.hasAttribute('data-invalid')).toBeTruthy();

      const input = el.shadowRoot!.querySelector('input')!;
      input.value = 'good@example.com';
      input.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      expect(el.hasAttribute('data-invalid')).toBeFalsy();
    });

    it('empty value is always valid', async () => {
      el.type = 'email';
      await el.updateComplete;
      await typeAndLeave('');
      expect(el.hasAttribute('data-invalid')).toBeFalsy();
    });

    it.each([
      ['good@example.com', false],
      ['bad-email', true],
      ['@no-local.com', true],
      ['no-at-sign', true]
    ] as const)('email "%s" → auto-error=%s', async (value, expectError) => {
      el.type = 'email';
      await el.updateComplete;
      await typeAndLeave(value);
      expect(Boolean(el.hasAttribute('data-invalid'))).toBe(expectError);
    });

    it.each([
      ['https://example.com', false],
      ['http://foo.bar/path?q=1', false],
      ['example.com', true],
      ['not a url', true]
    ] as const)('url "%s" → auto-error=%s', async (value, expectError) => {
      el.type = 'url';
      await el.updateComplete;
      await typeAndLeave(value);
      expect(Boolean(el.hasAttribute('data-invalid'))).toBe(expectError);
    });

    it.each([
      ['+1 (555) 000-1234', false],
      ['555-0100', false],
      ['abc', true],
      ['12', true]
    ] as const)('tel "%s" → auto-error=%s', async (value, expectError) => {
      el.type = 'tel';
      await el.updateComplete;
      await typeAndLeave(value);
      expect(Boolean(el.hasAttribute('data-invalid'))).toBe(expectError);
    });

    describe('min/max on number type', () => {
      it('shows error when value is below min', async () => {
        el.type = 'number';
        el.min = 10;
        await el.updateComplete;
        await typeAndLeave('5');
        expect(el.hasAttribute('data-invalid')).toBeTruthy();
      });

      it('shows error when value is above max', async () => {
        el.type = 'number';
        el.max = 100;
        await el.updateComplete;
        await typeAndLeave('150');
        expect(el.hasAttribute('data-invalid')).toBeTruthy();
      });

      it('no error when value is within min/max', async () => {
        el.type = 'number';
        el.min = 10;
        el.max = 100;
        await el.updateComplete;
        await typeAndLeave('50');
        expect(el.hasAttribute('data-invalid')).toBeFalsy();
      });

      it('passes min/max as native attributes', async () => {
        el.type = 'number';
        el.min = 1;
        el.max = 99;
        await el.updateComplete;
        const input = el.shadowRoot!.querySelector('input');
        expect(input?.getAttribute('min')).toBe('1');
        expect(input?.getAttribute('max')).toBe('99');
      });
    });

    describe('min/max as length on text types', () => {
      it('shows error when value is shorter than min', async () => {
        el.type = 'text';
        el.min = 5;
        await el.updateComplete;
        await typeAndLeave('hi');
        expect(el.hasAttribute('data-invalid')).toBeTruthy();
      });

      it('shows error when value is longer than max', async () => {
        el.type = 'text';
        el.max = 5;
        await el.updateComplete;
        await typeAndLeave('toolongvalue');
        expect(el.hasAttribute('data-invalid')).toBeTruthy();
      });

      it('no error when length is within min/max', async () => {
        el.type = 'text';
        el.min = 2;
        el.max = 10;
        await el.updateComplete;
        await typeAndLeave('hello');
        expect(el.hasAttribute('data-invalid')).toBeFalsy();
      });

      it('passes minlength/maxlength as native attributes', async () => {
        el.type = 'text';
        el.min = 2;
        el.max = 50;
        await el.updateComplete;
        const input = el.shadowRoot!.querySelector('input');
        expect(input?.getAttribute('minlength')).toBe('2');
        expect(input?.getAttribute('maxlength')).toBe('50');
      });
    });
  });

  describe('multiline type', () => {
    it('renders textarea when type is multiline', async () => {
      el.type = 'multiline';
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      const input = el.shadowRoot!.querySelector('input');
      expect(textarea).toBeTruthy();
      expect(input).toBeFalsy();
    });

    it('sets rows attribute on textarea', async () => {
      el.type = 'multiline';
      el.rows = 5;
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.rows).toBe(5);
    });

    it('has default rows of 3', async () => {
      el.type = 'multiline';
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.rows).toBe(3);
    });

    it('binds value to textarea', async () => {
      el.type = 'multiline';
      el.value = 'multi\nline\ntext';
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.value).toBe('multi\nline\ntext');
    });

    it('updates value on textarea input', async () => {
      el.type = 'multiline';
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'new value';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;
      expect(el.value).toBe('new value');
    });

    it('emits custom input event for textarea', async () => {
      el.type = 'multiline';
      await el.updateComplete;
      const inputHandler = vi.fn();
      el.addEventListener('input', inputHandler);

      const textarea = el.shadowRoot!.querySelector('textarea')!;
      textarea.value = 'test';
      textarea.dispatchEvent(new Event('input', { bubbles: true }));
      await el.updateComplete;

      expect(inputHandler).toHaveBeenCalled();
      expect(inputHandler.mock.calls[0][0].detail.value).toBe('test');
    });

    it('can be disabled', async () => {
      el.type = 'multiline';
      el.disabled = true;
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.hasAttribute('disabled')).toBe(true);
    });

    it('can be readonly', async () => {
      el.type = 'multiline';
      el.readonly = true;
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.hasAttribute('readonly')).toBe(true);
    });

    it('can be required', async () => {
      el.type = 'multiline';
      el.required = true;
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.hasAttribute('required')).toBe(true);
    });

    it('sets placeholder on textarea', async () => {
      el.type = 'multiline';
      el.placeholder = 'Enter text...';
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.placeholder).toBe('Enter text...');
    });

    it('sets aria-invalid on textarea when variant is error', async () => {
      el.type = 'multiline';
      el.variant = 'error';
      await el.updateComplete;
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(textarea?.getAttribute('aria-invalid')).toBe('true');
    });

    it('works with start icon', async () => {
      el.type = 'multiline';
      el.iconStart = 'edit';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-start');
      const textarea = el.shadowRoot!.querySelector('textarea');
      expect(icon?.getAttribute('name')).toBe('edit');
      expect(textarea?.classList.contains('has-start-icon')).toBe(true);
    });

    it('works with variant icons', async () => {
      el.type = 'multiline';
      el.variant = 'success';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.getAttribute('name')).toBe('check-circle');
    });
  });

  describe('end icon', () => {
    const input = () => el.shadowRoot!.querySelector('input')!;

    it('gets room for the password toggle so typed text cannot run under it', async () => {
      el.type = 'password';
      await el.updateComplete;
      expect(input().classList.contains('has-end-icon')).toBe(true);
    });

    it.each(['success', 'warning', 'error'] as const)('gets room for the %s status icon', async (variant) => {
      el.variant = variant;
      await el.updateComplete;
      expect(input().classList.contains('has-end-icon')).toBe(true);
    });

    it('has no end-icon padding when there is no end icon', async () => {
      expect(input().classList.contains('has-end-icon')).toBe(false);
    });

    it('marks both sides when there is a start icon and an end icon, and the textarea too', async () => {
      el.iconStart = 'search';
      el.variant = 'error';
      await el.updateComplete;
      expect([...input().classList].sort()).toEqual(['has-end-icon', 'has-start-icon']);

      el.type = 'multiline';
      await el.updateComplete;
      const area = el.shadowRoot!.querySelector('textarea')!;
      expect([...area.classList].sort()).toEqual(['has-end-icon', 'has-start-icon']);
    });
  });
});
