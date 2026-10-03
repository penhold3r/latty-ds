import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Combobox } from '../combobox';
import '../combobox';
import { autoUpdate } from '@floating-ui/dom';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

const OPTIONS = [
  { value: 'us', label: 'United States' },
  { value: 'ca', label: 'Canada' },
  { value: 'mx', label: 'Mexico', disabled: true }
];

describe('<lt-combobox>', () => {
  let el: Combobox;

  beforeEach(async () => {
    el = document.createElement('lt-combobox') as Combobox;
    el.options = OPTIONS;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders in shadow DOM', () => {
    expect(el.shadowRoot).toBeTruthy();
  });

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it.each(['default', 'success', 'warning', 'error'] as const)('reflects %s variant to attribute', async (variant) => {
    el.variant = variant;
    await el.updateComplete;
    expect(el.getAttribute('variant')).toBe(variant);
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

  it('renders a label when set', async () => {
    el.label = 'Country';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('label')!.textContent!.trim()).toContain('Country');
  });

  it('renders helper text when set', async () => {
    el.helperText = 'Choose your country';
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.helper-text')!.textContent).toBe('Choose your country');
  });

  it('opens dropdown on input focus', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dropdown')).toBeTruthy();
  });

  it('filters options when typing', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    input.value = 'can';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;

    const options = el.shadowRoot!.querySelectorAll('.option');
    expect(options.length).toBe(1);
    expect(options[0].textContent!.trim()).toBe('Canada');
  });

  it('shows no-results when filter has no matches', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    input.value = 'zzz';
    input.dispatchEvent(new Event('input'));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.no-results')).toBeTruthy();
  });

  it('dispatches lt-change when an option is selected', async () => {
    const events: Array<{ value: string; label: string }> = [];
    el.addEventListener('change', (e) => events.push((e as CustomEvent).detail));

    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    const firstOption = el.shadowRoot!.querySelector('.option') as HTMLButtonElement;
    firstOption.click();

    expect(events).toHaveLength(1);
    expect(events[0].value).toBe('us');
  });

  it('does not open when disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const input = el.shadowRoot!.querySelector('input')!;
    input.dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.dropdown')).toBeNull();
  });

  describe('opening', () => {
    it('starts one floating autoUpdate when the field is focused and clicked in the same gesture', async () => {
      vi.mocked(autoUpdate).mockClear();
      const input = el.shadowRoot!.querySelector('input')!;

      // A real click on the field fires focus, then click — both call openDropdown.
      input.dispatchEvent(new FocusEvent('focus'));
      el.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!.click();
      await new Promise((r) => setTimeout(r, 30));
      await el.updateComplete;

      expect(autoUpdate).toHaveBeenCalledTimes(1);
    });

    it('opens again after it has been closed', async () => {
      vi.mocked(autoUpdate).mockClear();
      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new FocusEvent('focus'));
      await new Promise((r) => setTimeout(r, 30));
      input.dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape' }));
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!.click();
      await new Promise((r) => setTimeout(r, 30));

      expect(autoUpdate).toHaveBeenCalledTimes(2);
    });
  });

  describe('reopening and closing (CMB-4)', () => {
    const input = () => el.shadowRoot!.querySelector('input')!;
    const keydown = (key: string) => input().dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));

    it('ArrowDown reopens after Escape closed it', async () => {
      input().focus();
      await el.updateComplete;
      keydown('Escape');
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(false);

      keydown('ArrowDown');
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('ArrowUp also reopens after Escape closed it', async () => {
      input().focus();
      await el.updateComplete;
      keydown('Escape');
      await el.updateComplete;

      keydown('ArrowUp');
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(true);
    });

    it('closes when focus moves away from the input', async () => {
      input().focus();
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(true);

      const outside = document.createElement('button');
      document.body.appendChild(outside);
      outside.focus();
      await el.updateComplete;

      expect(el.hasAttribute('open')).toBe(false);
      outside.remove();
    });

    it('Escape prevents default when it has something to close (so an ancestor lt-dialog does not also close)', async () => {
      input().focus();
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(true);

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      input().dispatchEvent(event);
      await el.updateComplete;

      expect(el.hasAttribute('open')).toBe(false);
      expect(event.defaultPrevented).toBe(true);
    });

    it('Escape does not prevent default when the dropdown is already closed', async () => {
      input().focus();
      await el.updateComplete;
      keydown('Escape'); // closes it
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(false);

      const event = new KeyboardEvent('keydown', { key: 'Escape', cancelable: true });
      input().dispatchEvent(event);
      await el.updateComplete;

      expect(event.defaultPrevented).toBe(false);
    });
  });

  describe('keyboard navigation and ARIA (CMB-1, CMB-2)', () => {
    // A disabled option in the middle is what actually exposes CMB-2: activeIndex counted positions in the
    // enabled-only list, but the render compared it against the unfiltered one, so the two only ever agreed
    // when nothing disabled came before the active option.
    const withMiddleDisabled = [
      { value: 'a', label: 'Alpha' },
      { value: 'b', label: 'Beta', disabled: true },
      { value: 'c', label: 'Gamma' }
    ];

    const open = async () => {
      el.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!.click();
      await el.updateComplete;
    };

    const arrow = async (key: string) => {
      el.shadowRoot!.querySelector('input')!.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true }));
      await el.updateComplete;
    };

    beforeEach(async () => {
      el.options = withMiddleDisabled;
      await open();
    });

    it('ArrowDown skips the disabled option and highlights the one after it', async () => {
      await arrow('ArrowDown'); // Alpha
      await arrow('ArrowDown'); // skips Beta (disabled), lands on Gamma
      const active = el.shadowRoot!.querySelector('[data-active="true"]')!;
      expect(active.textContent?.trim()).toBe('Gamma');
    });

    it('Enter selects the same option that is highlighted', async () => {
      await arrow('ArrowDown');
      await arrow('ArrowDown');
      await arrow('Enter');
      expect(el.value).toBe('c');
    });

    it('gives the highlighted option a stable id and points aria-activedescendant at it', async () => {
      await arrow('ArrowDown');
      const active = el.shadowRoot!.querySelector('[data-active="true"]')!;
      const input = el.shadowRoot!.querySelector('input')!;
      expect(active.id).toBeTruthy();
      expect(input.getAttribute('aria-activedescendant')).toBe(active.id);
    });

    it('every option has a distinct id, disabled ones included', () => {
      const ids = [...el.shadowRoot!.querySelectorAll('.option')].map((o) => o.id);
      expect(ids).toHaveLength(3);
      expect(new Set(ids).size).toBe(3);
      expect(ids.every(Boolean)).toBe(true);
    });

    it('sets aria-controls on the input pointing at the listbox', () => {
      const input = el.shadowRoot!.querySelector('input')!;
      const listbox = el.shadowRoot!.querySelector('[role="listbox"]')!;
      expect(input.getAttribute('aria-controls')).toBe(listbox.id);
    });

    it('omits aria-activedescendant when nothing is highlighted', () => {
      const input = el.shadowRoot!.querySelector('input')!;
      expect(input.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('options are not in the tab order (aria-activedescendant keeps focus on the input)', () => {
      const options = [...el.shadowRoot!.querySelectorAll('.option')] as HTMLButtonElement[];
      expect(options.every((o) => o.tabIndex === -1)).toBe(true);
    });
  });

  describe('value is not reflected, and formResetCallback restores the markup default (TFD-1)', () => {
    it('does not reflect value as an attribute', async () => {
      el.value = 'ca';
      await el.updateComplete;
      expect(el.hasAttribute('value')).toBe(false);
    });

    // jsdom doesn't implement the form-associated custom element reset lifecycle (form.reset() never calls
    // formResetCallback), so this calls it directly — the same thing a real form reset does per the HTML spec.
    it('restores the value set in markup, not empty', async () => {
      const fresh = document.createElement('lt-combobox') as Combobox;
      fresh.options = OPTIONS;
      fresh.setAttribute('value', 'ca');
      document.body.appendChild(fresh);
      await fresh.updateComplete;

      fresh.value = 'us';
      await fresh.updateComplete;
      fresh.formResetCallback();
      expect(fresh.value).toBe('ca');
      fresh.remove();
    });
  });

  describe('formDisabledCallback (a disabled ancestor <fieldset>, X1)', () => {
    it('disables the inner input without touching the disabled property/attribute', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
      expect(el.disabled).toBe(false);
      expect(el.hasAttribute('disabled')).toBe(false);
    });

    it('re-enables once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(false);
    });

    it('does not re-enable if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input') as HTMLInputElement;
      expect(input.disabled).toBe(true);
    });

    it('stops the dropdown from opening while fieldset-disabled', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.dropdown')).toBeNull();
    });
  });

  describe('labels (i18n, X5)', () => {
    it('defaults the no-results text to English', async () => {
      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
      input.value = 'zzz';
      input.dispatchEvent(new Event('input'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.no-results')?.textContent).toBe('No results');
    });

    it('overrides the no-results text via labels', async () => {
      el.labels = { noResults: 'Aucun résultat' };
      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
      input.value = 'zzz';
      input.dispatchEvent(new Event('input'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.no-results')?.textContent).toBe('Aucun résultat');
    });

    // jsdom's ElementInternals.setValidity is a stubbed no-op (see vitest.setup.ts), so these spy on the call our
    // component makes rather than reading back a real validationMessage.
    it('defaults the required-field validation message to English', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Please select an option');
    });

    it('overrides the required-field validation message via labels', async () => {
      const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
      el.labels = { validationMessage: 'Veuillez sélectionner une option' };
      el.required = true;
      await el.updateComplete;
      expect(spy.mock.lastCall?.[1]).toBe('Veuillez sélectionner une option');
    });
  });
});

describe('helper text is described by its control (aria-describedby)', () => {
  let el: Combobox;

  beforeEach(async () => {
    el = document.createElement('lt-combobox') as Combobox;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('points the control at the rendered helper text', async () => {
    el.helperText = 'Pick one';
    await el.updateComplete;
    const control = el.shadowRoot!.querySelector('input')!;
    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(control.getAttribute('aria-describedby')).toBe(helper.id);
    expect(helper.textContent!.trim()).toBe('Pick one');
  });

  it('omits aria-describedby when there is no helper text', () => {
    const control = el.shadowRoot!.querySelector('input')!;
    expect(control.hasAttribute('aria-describedby')).toBe(false);
  });
});
