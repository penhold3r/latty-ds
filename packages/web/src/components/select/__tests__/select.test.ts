import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { Select } from '../select';
import type { SelectOption } from '../select.types';
import '../select';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 0, y: 0 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

describe('<lt-select>', () => {
  let el: Select;
  const mockOptions: SelectOption[] = [
    { value: 'apple', label: 'Apple' },
    { value: 'banana', label: 'Banana' },
    { value: 'orange', label: 'Orange' },
    { value: 'grape', label: 'Grape', disabled: true }
  ];

  beforeEach(async () => {
    el = document.createElement('lt-select') as Select;
    el.options = mockOptions;
    document.body.appendChild(el);
    await el.updateComplete;
    // Stub Popover API — not supported in jsdom
    const listbox = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.dropdown')!;
    (listbox as any).showPopover = vi.fn();
    (listbox as any).hidePopover = vi.fn();
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a select trigger in shadow DOM', () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger');
    expect(trigger).toBeTruthy();
  });

  it('has default variant of default', () => {
    expect(el.variant).toBe('default');
    expect(el.getAttribute('variant')).toBe('default');
  });

  it('has default size of md', () => {
    expect(el.size).toBe('md');
    expect(el.getAttribute('size')).toBe('md');
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

  it('is not disabled by default', () => {
    expect(el.disabled).toBe(false);
    expect(el.hasAttribute('disabled')).toBe(false);
  });

  it('can be disabled', async () => {
    el.disabled = true;
    await el.updateComplete;
    const trigger = el.shadowRoot!.querySelector('.select-trigger')!;
    expect(trigger.getAttribute('aria-disabled')).toBe('true');
  });

  describe('formDisabledCallback (a disabled ancestor <fieldset>, X1)', () => {
    it('marks the trigger disabled without touching the disabled property/attribute', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      const trigger = el.shadowRoot!.querySelector('.select-trigger')!;
      expect(trigger.getAttribute('aria-disabled')).toBe('true');
      expect(trigger.getAttribute('tabindex')).toBe('-1');
      expect(el.disabled).toBe(false);
    });

    it('re-enables once the fieldset is enabled again', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.select-trigger')!.getAttribute('aria-disabled')).toBe('false');
    });

    it('does not re-enable if it was also explicitly disabled', async () => {
      el.disabled = true;
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.formDisabledCallback(false);
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.select-trigger')!.getAttribute('aria-disabled')).toBe('true');
    });

    it('stops the dropdown from opening while fieldset-disabled', async () => {
      el.formDisabledCallback(true);
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLElement>('.select-trigger')!.click();
      await el.updateComplete;
      expect(el.hasAttribute('open')).toBe(false);
    });
  });

  it('is not required by default', () => {
    expect(el.required).toBe(false);
  });

  it('shows required indicator when required', async () => {
    el.label = 'Select';
    el.required = true;
    await el.updateComplete;
    const indicator = el.shadowRoot!.querySelector('.required-indicator');
    expect(indicator).toBeTruthy();
  });

  it('renders all options in dropdown', () => {
    const options = el.shadowRoot!.querySelectorAll('.option');
    expect(options.length).toBe(mockOptions.length);
  });

  it('exposes the listbox surface via part="listbox" and defaults it to an outlined appearance', () => {
    const listbox = el.shadowRoot!.querySelector('lt-surface.dropdown');
    expect(listbox?.getAttribute('part')).toBe('listbox');
    expect(listbox?.getAttribute('appearance')).toBe('outlined');
  });

  it('keeps an opaque background on the outlined listbox surface', () => {
    // outlined appearance resets Surface's background to transparent unless a
    // background prop is set explicitly — without this the popover would be see-through.
    const listbox = el.shadowRoot!.querySelector('lt-surface.dropdown');
    expect(listbox?.getAttribute('background')).toBe('--lt-bg-default');
  });

  it('shows placeholder when no value is selected', () => {
    const valueSpan = el.shadowRoot!.querySelector('.select-value');
    expect(valueSpan?.classList.contains('placeholder')).toBe(true);
    expect(valueSpan?.textContent?.trim()).toBe('Select an option');
  });

  it('shows selected label when value is set', async () => {
    el.value = 'apple';
    await el.updateComplete;
    const valueSpan = el.shadowRoot!.querySelector('.select-value');
    expect(valueSpan?.classList.contains('placeholder')).toBe(false);
    expect(valueSpan?.textContent?.trim()).toBe('Apple');
  });

  it('opens dropdown when trigger is clicked — sets display:block inline', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.dropdown')!;
    expect(dropdown.style.display).toBe('');

    trigger.click();
    await el.updateComplete;
    await Promise.resolve(); // flush openFloating's async computePosition

    expect(el.hasAttribute('open')).toBe(true);
    expect(dropdown.style.display).toBe('block');
  });

  it('closing resets display so CSS display:none takes over', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    const dropdown = el.shadowRoot!.querySelector<HTMLElement>('lt-surface.dropdown')!;

    trigger.click();
    await el.updateComplete;
    await Promise.resolve();

    // Simulate click outside
    document.body.click();
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(false);
    expect(dropdown.style.display).toBe('');
  });

  it('selects an option when clicked', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    const option = el.shadowRoot!.querySelectorAll('.option')[1] as HTMLButtonElement;

    let eventFired = false;
    let eventValue = '';
    el.addEventListener('change', ((e: CustomEvent) => {
      eventFired = true;
      eventValue = e.detail.value;
    }) as EventListener);

    option.click();
    await el.updateComplete;

    expect(el.value).toBe('banana');
    expect(eventFired).toBe(true);
    expect(eventValue).toBe('banana');
    expect(el.hasAttribute('open')).toBe(false);
  });

  it('does not select disabled option', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    trigger.click();
    await el.updateComplete;

    const disabledOption = el.shadowRoot!.querySelectorAll('.option')[3] as HTMLButtonElement;
    const initialValue = el.value;

    disabledOption.click();
    await el.updateComplete;

    expect(el.value).toBe(initialValue);
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

  it('renders label when provided', async () => {
    el.label = 'Choose a fruit';
    await el.updateComplete;
    const label = el.shadowRoot!.querySelector('label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Choose a fruit');
  });

  it('renders helper text when provided', async () => {
    el.helperText = 'Select your favorite fruit';
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText).toBeTruthy();
    expect(helperText?.textContent).toBe('Select your favorite fruit');
  });

  it('opens dropdown with Enter key', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
    expect(el.hasAttribute('open')).toBe(false);

    const event = new KeyboardEvent('keydown', { key: 'Enter' });
    trigger.dispatchEvent(event);
    await el.updateComplete;

    expect(el.hasAttribute('open')).toBe(true);
  });

  it('closes dropdown with Escape key', async () => {
    const trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;

    trigger.click();
    await el.updateComplete;
    expect(el.hasAttribute('open')).toBe(true);

    const event = new KeyboardEvent('keydown', { key: 'Escape' });
    trigger.dispatchEvent(event);
    await el.updateComplete;

    expect(el.hasAttribute('open')).toBe(false);
  });

  describe('keyboard navigation without moving focus off the trigger (SEL-1, SEL-2, SEL-3)', () => {
    let trigger: HTMLElement;

    const arrow = async (key: string) => {
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key, cancelable: true, bubbles: true }));
      await el.updateComplete;
    };

    beforeEach(async () => {
      trigger = el.shadowRoot!.querySelector('.select-trigger') as HTMLElement;
      trigger.click();
      await el.updateComplete;
      trigger.focus();
    });

    it('ArrowDown highlights the next option without moving DOM focus', async () => {
      await arrow('ArrowDown');
      expect(document.activeElement).toBe(el);
      expect(el.shadowRoot!.activeElement).toBe(trigger);
      const active = el.shadowRoot!.querySelector('[data-active="true"]')!;
      expect(active.textContent?.trim()).toBe('Apple');
    });

    it('ArrowDown skips a disabled option', async () => {
      el.options = [
        { value: 'a', label: 'Alpha' },
        { value: 'b', label: 'Beta', disabled: true },
        { value: 'c', label: 'Gamma' }
      ];
      await el.updateComplete;
      await arrow('ArrowDown'); // Alpha
      await arrow('ArrowDown'); // skips Beta, lands on Gamma
      const active = el.shadowRoot!.querySelector('[data-active="true"]')!;
      expect(active.textContent?.trim()).toBe('Gamma');
    });

    it('wraps at both ends', async () => {
      // 3 enabled options (grape is disabled): Apple, Banana, Orange.
      await arrow('ArrowUp'); // wraps from nothing-active to the last enabled one
      expect(el.shadowRoot!.querySelector('[data-active="true"]')!.textContent?.trim()).toBe('Orange');
      await arrow('ArrowDown'); // wraps back to the first
      expect(el.shadowRoot!.querySelector('[data-active="true"]')!.textContent?.trim()).toBe('Apple');
    });

    it('Enter selects the highlighted option and keeps focus on the trigger, not <body>', async () => {
      await arrow('ArrowDown');
      await arrow('ArrowDown');
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter', cancelable: true, bubbles: true }));
      await el.updateComplete;

      expect(el.value).toBe('banana');
      expect(document.activeElement).toBe(el);
      expect(el.shadowRoot!.activeElement).toBe(trigger);
    });

    it('gives the highlighted option a stable id and points aria-activedescendant at it', async () => {
      await arrow('ArrowDown');
      const active = el.shadowRoot!.querySelector('[data-active="true"]')!;
      expect(active.id).toBeTruthy();
      expect(trigger.getAttribute('aria-activedescendant')).toBe(active.id);
    });

    it('omits aria-activedescendant when nothing is highlighted yet', () => {
      expect(trigger.hasAttribute('aria-activedescendant')).toBe(false);
    });

    it('options are not in the tab order', () => {
      const options = [...el.shadowRoot!.querySelectorAll('.option')] as HTMLButtonElement[];
      expect(options.every((o) => o.tabIndex === -1)).toBe(true);
    });
  });

  describe('value is not reflected, and formResetCallback restores the markup default (TFD-1)', () => {
    it('does not reflect value as an attribute', async () => {
      el.value = 'banana';
      await el.updateComplete;
      expect(el.hasAttribute('value')).toBe(false);
    });

    // jsdom doesn't implement the form-associated custom element reset lifecycle (form.reset() never calls
    // formResetCallback), so this calls it directly — the same thing a real form reset does per the HTML spec.
    it('restores the value set in markup, not empty', async () => {
      const fresh = document.createElement('lt-select') as Select;
      fresh.options = mockOptions;
      fresh.setAttribute('value', 'banana');
      document.body.appendChild(fresh);
      await fresh.updateComplete;

      fresh.value = 'orange';
      await fresh.updateComplete;
      fresh.formResetCallback();
      expect(fresh.value).toBe('banana');
      fresh.remove();
    });
  });

  // jsdom's ElementInternals.setValidity is a stubbed no-op (see vitest.setup.ts), so these spy on the call our
  // component makes rather than reading back a real validationMessage.
  describe('labels (i18n, X5)', () => {
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

  describe('clearable', () => {
    it('does not render a clear button by default, even with a value selected', async () => {
      el.value = 'banana';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeNull();
    });

    it('does not render a clear button when clearable but nothing is selected', async () => {
      el.clearable = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeNull();
    });

    it('renders a clear button once clearable and a value is selected', async () => {
      el.clearable = true;
      el.value = 'banana';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeTruthy();
    });

    it('resets value and fires change when the clear button is clicked', async () => {
      const handler = vi.fn();
      el.addEventListener('change', handler);
      el.clearable = true;
      el.value = 'banana';
      await el.updateComplete;
      el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
      await el.updateComplete;
      expect(el.value).toBe('');
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeNull();
      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe('');
    });

    it('does not render a clear button while disabled, even with a value selected', async () => {
      el.clearable = true;
      el.value = 'banana';
      el.disabled = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeNull();
    });

    it('uses the default English accessible label', async () => {
      el.clearable = true;
      el.value = 'banana';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')!.getAttribute('aria-label')).toBe('Clear');
    });

    it('overrides the clear button label via labels', async () => {
      el.labels = { clear: 'Effacer' };
      el.clearable = true;
      el.value = 'banana';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')!.getAttribute('aria-label')).toBe('Effacer');
    });
  });

  describe('loading', () => {
    it('does not render a loading state by default', async () => {
      expect(el.shadowRoot!.querySelector('.loading-state')).toBeNull();
    });

    it('renders a loading state instead of the option list when loading', async () => {
      el.loading = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.loading-state')).toBeTruthy();
      expect(el.shadowRoot!.querySelectorAll('.option')).toHaveLength(0);
    });

    it('marks the listbox aria-busy while loading', async () => {
      el.loading = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('[role="listbox"]')!.getAttribute('aria-busy')).toBe('true');
    });

    it('omits aria-busy when not loading', () => {
      expect(el.shadowRoot!.querySelector('[role="listbox"]')!.hasAttribute('aria-busy')).toBe(false);
    });

    it('restores the option list once loading finishes', async () => {
      el.loading = true;
      await el.updateComplete;
      el.loading = false;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.loading-state')).toBeNull();
      expect(el.shadowRoot!.querySelectorAll('.option').length).toBeGreaterThan(0);
    });

    it('uses the default English loading text', async () => {
      el.loading = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.loading-state')!.textContent).toContain('Loading…');
    });

    it('overrides the loading text via labels', async () => {
      el.labels = { loading: 'Chargement…' };
      el.loading = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.loading-state')!.textContent).toContain('Chargement…');
    });
  });
});

describe('helper text is described by its control (aria-describedby)', () => {
  let el: Select;

  beforeEach(async () => {
    el = document.createElement('lt-select') as Select;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('points the control at the rendered helper text', async () => {
    el.helperText = 'Pick one';
    await el.updateComplete;
    const control = el.shadowRoot!.querySelector('.select-trigger')!;
    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(control.getAttribute('aria-describedby')).toBe(helper.id);
    expect(helper.textContent!.trim()).toBe('Pick one');
  });

  it('omits aria-describedby when there is no helper text', () => {
    const control = el.shadowRoot!.querySelector('.select-trigger')!;
    expect(control.hasAttribute('aria-describedby')).toBe(false);
  });
});

describe('multiple selection (value becomes an array)', () => {
  let el: Select;
  const opts = () => Array.from(el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option'));
  const optionFor = (value: string) =>
    opts().find((o) => o.id.endsWith(`-option-${el.options.findIndex((x) => x.value === value)}`))!;
  const trigger = () => el.shadowRoot!.querySelector<HTMLElement>('.select-trigger')!;

  beforeEach(async () => {
    el = document.createElement('lt-select') as Select;
    el.options = [
      { value: 'a', label: 'Apple' },
      { value: 'b', label: 'Banana' },
      { value: 'c', label: 'Cherry' }
    ];
    el.multiple = true;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('starts with an empty array and reflects the multiple attribute', async () => {
    expect(el.value).toEqual([]);
    expect(el.hasAttribute('multiple')).toBe(true);
  });

  it('adds and removes values on click, and keeps the list open', async () => {
    trigger().click();
    await el.updateComplete;
    optionFor('a').click();
    await el.updateComplete;
    expect(el.value).toEqual(['a']);
    expect(el.hasAttribute('open')).toBe(true);
    optionFor('c').click();
    await el.updateComplete;
    expect(el.value).toEqual(['a', 'c']);
    optionFor('a').click();
    await el.updateComplete;
    expect(el.value).toEqual(['c']);
  });

  it('reports the array in the change event detail', async () => {
    const detail: unknown[] = [];
    el.addEventListener('change', (e) => detail.push((e as CustomEvent).detail.value));
    optionFor('b').click();
    await el.updateComplete;
    expect(detail).toEqual([['b']]);
  });

  it('shows the selected labels in the trigger', async () => {
    el.value = ['a', 'c'];
    await el.updateComplete;
    expect(el.shadowRoot!.querySelector('.select-trigger')!.textContent).toContain('Apple, Cherry');
  });

  it('marks each selected option with aria-selected and the listbox as multiselectable', async () => {
    el.value = ['b'];
    await el.updateComplete;
    expect(optionFor('b').getAttribute('aria-selected')).toBe('true');
    expect(optionFor('a').getAttribute('aria-selected')).toBe('false');
    expect(el.shadowRoot!.querySelector('[role="listbox"]')!.getAttribute('aria-multiselectable')).toBe('true');
  });

  it('is invalid when required and nothing is selected', async () => {
    const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
    el.required = true;
    await el.updateComplete;
    expect(spy.mock.lastCall?.[0]).toMatchObject({ valueMissing: true });
    el.value = ['a'];
    await el.updateComplete;
    expect(spy.mock.lastCall?.[0]).toEqual({});
  });

  it('submits one form entry per selected value', async () => {
    const spy = vi.spyOn(ElementInternals.prototype, 'setFormValue');
    el.name = 'fruit';
    el.value = ['a', 'b'];
    await el.updateComplete;
    const data = spy.mock.lastCall?.[0] as FormData;
    expect(data.getAll('fruit')).toEqual(['a', 'b']);
  });

  it('clear button resets the whole array at once, not one value', async () => {
    el.clearable = true;
    el.value = ['a', 'c'];
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
    await el.updateComplete;
    expect(el.value).toEqual([]);
  });
});
