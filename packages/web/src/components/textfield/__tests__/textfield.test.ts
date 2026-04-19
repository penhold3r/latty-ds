import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
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

  it('renders an input element in shadow DOM', () => {
    const input = el.shadowRoot!.querySelector('input');
    expect(input).toBeTruthy();
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

  describe('password visibility toggle', () => {
    it('shows eye icon for password fields', async () => {
      el.type = 'password';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.getAttribute('name')).toBe('eye');
    });

    it('toggles to eye-off icon when clicked', async () => {
      el.type = 'password';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end') as HTMLElement;
      icon.click();
      await el.updateComplete;
      expect(icon.getAttribute('name')).toBe('eye-off');
    });

    it('changes input type to text when password is visible', async () => {
      el.type = 'password';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end') as HTMLElement;
      const input = el.shadowRoot!.querySelector('input');

      expect(input?.type).toBe('password');

      icon.click();
      await el.updateComplete;

      expect(input?.type).toBe('text');
    });

    it('toggles back to password type when eye-off is clicked', async () => {
      el.type = 'password';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end') as HTMLElement;
      const input = el.shadowRoot!.querySelector('input');

      icon.click();
      await el.updateComplete;
      expect(input?.type).toBe('text');

      icon.click();
      await el.updateComplete;
      expect(input?.type).toBe('password');
      expect(icon.getAttribute('name')).toBe('eye');
    });

    it('has password-toggle class on icon', async () => {
      el.type = 'password';
      await el.updateComplete;
      const icon = el.shadowRoot!.querySelector('.icon-end');
      expect(icon?.classList.contains('password-toggle')).toBe(true);
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
});
