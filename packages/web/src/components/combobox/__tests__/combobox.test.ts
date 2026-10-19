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

    const activeLabel = () => el.shadowRoot!.querySelector('[data-active="true"]')?.textContent?.trim();

    it('End jumps to the last enabled option, skipping the disabled one (CMB-5)', async () => {
      await arrow('End');
      expect(activeLabel()).toBe('Gamma');
    });

    it('Home jumps back to the first enabled option (CMB-5)', async () => {
      await arrow('End');
      await arrow('Home');
      expect(activeLabel()).toBe('Alpha');
    });

    it('PageDown/PageUp clamp at the edges rather than wrapping, same as Arrow keys (CMB-5)', async () => {
      await arrow('PageDown');
      expect(activeLabel()).toBe('Gamma'); // only 2 enabled options — clamps to the last
      await arrow('PageUp');
      expect(activeLabel()).toBe('Alpha'); // clamps to the first
    });

    it('scrolls the newly-active option into view (CMB-5)', async () => {
      const scrollIntoView = vi.spyOn(HTMLElement.prototype, 'scrollIntoView').mockImplementation(() => {});
      await arrow('ArrowDown');
      expect(scrollIntoView).toHaveBeenCalledWith({ block: 'nearest' });
      scrollIntoView.mockRestore();
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

  describe('clearable', () => {
    it('does not render a clear button by default, even with a value selected', async () => {
      el.value = 'us';
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
      el.value = 'us';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeTruthy();
    });

    it('resets value and query, and fires change, when the clear button is clicked', async () => {
      const handler = vi.fn();
      el.addEventListener('change', handler);
      el.clearable = true;
      el.value = 'us';
      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
      input.value = 'uni';
      input.dispatchEvent(new Event('input'));
      await el.updateComplete;

      el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
      await el.updateComplete;

      expect(el.value).toBe('');
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      expect((el as any).query).toBe('');
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeNull();
      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail.value).toBe('');
    });

    it('does not render a clear button while disabled, even with a value selected', async () => {
      el.clearable = true;
      el.value = 'us';
      el.disabled = true;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')).toBeNull();
    });

    it('uses the default English accessible label', async () => {
      el.clearable = true;
      el.value = 'us';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')!.getAttribute('aria-label')).toBe('Clear');
    });

    it('overrides the clear button label via labels', async () => {
      el.labels = { clear: 'Effacer' };
      el.clearable = true;
      el.value = 'us';
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.clear-button')!.getAttribute('aria-label')).toBe('Effacer');
    });
  });

  describe('loading', () => {
    const openDropdown = async () => {
      el.shadowRoot!.querySelector('input')!.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
    };

    it('renders a loading state instead of the option list when loading', async () => {
      el.loading = true;
      await openDropdown();
      expect(el.shadowRoot!.querySelector('.loading-state')).toBeTruthy();
      expect(el.shadowRoot!.querySelectorAll('.option')).toHaveLength(0);
      expect(el.shadowRoot!.querySelector('.no-results')).toBeNull();
    });

    it('marks the listbox aria-busy while loading', async () => {
      el.loading = true;
      await openDropdown();
      expect(el.shadowRoot!.querySelector('[role="listbox"]')!.getAttribute('aria-busy')).toBe('true');
    });

    it('omits aria-busy when not loading', async () => {
      await openDropdown();
      expect(el.shadowRoot!.querySelector('[role="listbox"]')!.hasAttribute('aria-busy')).toBe(false);
    });

    it('restores the option list once loading finishes', async () => {
      el.loading = true;
      await openDropdown();
      el.loading = false;
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.loading-state')).toBeNull();
      expect(el.shadowRoot!.querySelectorAll('.option').length).toBeGreaterThan(0);
    });

    it('uses the default English loading text', async () => {
      el.loading = true;
      await openDropdown();
      expect(el.shadowRoot!.querySelector('.loading-state')!.textContent).toContain('Loading…');
    });

    it('overrides the loading text via labels', async () => {
      el.labels = { loading: 'Chargement…' };
      el.loading = true;
      await openDropdown();
      expect(el.shadowRoot!.querySelector('.loading-state')!.textContent).toContain('Chargement…');
    });

    it('takes priority over no-results even when the query matches nothing', async () => {
      el.loading = true;
      const input = el.shadowRoot!.querySelector('input')!;
      input.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
      input.value = 'zzz';
      input.dispatchEvent(new Event('input'));
      await el.updateComplete;
      expect(el.shadowRoot!.querySelector('.loading-state')).toBeTruthy();
      expect(el.shadowRoot!.querySelector('.no-results')).toBeNull();
    });
  });

  describe('option groups, descriptions, and icons', () => {
    const openDropdown = async () => {
      el.shadowRoot!.querySelector('input')!.dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
    };

    it('renders no group heading for a flat, ungrouped option list', async () => {
      await openDropdown();
      expect(el.shadowRoot!.querySelectorAll('.option-group-label')).toHaveLength(0);
    });

    it('renders one heading for a contiguous run of grouped options', async () => {
      el.options = [
        { value: 'us', label: 'United States', group: 'North America' },
        { value: 'ca', label: 'Canada', group: 'North America' },
        { value: 'fr', label: 'France', group: 'Europe' }
      ];
      await openDropdown();
      const headings = [...el.shadowRoot!.querySelectorAll('.option-group-label')].map((h) => h.textContent);
      expect(headings).toEqual(['North America', 'Europe']);
      expect(el.shadowRoot!.querySelectorAll('.option')).toHaveLength(3);
    });

    it('renders two separate headings for the same group name interrupted by a different group', async () => {
      el.options = [
        { value: 'us', label: 'United States', group: 'North America' },
        { value: 'fr', label: 'France', group: 'Europe' },
        { value: 'ca', label: 'Canada', group: 'North America' }
      ];
      await openDropdown();
      const headings = [...el.shadowRoot!.querySelectorAll('.option-group-label')].map((h) => h.textContent);
      expect(headings).toEqual(['North America', 'Europe', 'North America']);
    });

    it('wraps a group of options in a labeled role="group"', async () => {
      el.options = [
        { value: 'us', label: 'United States', group: 'North America' },
        { value: 'ca', label: 'Canada', group: 'North America' }
      ];
      await openDropdown();
      const group = el.shadowRoot!.querySelector('[role="group"]')!;
      expect(group.getAttribute('aria-label')).toBe('North America');
      expect(group.querySelectorAll('.option')).toHaveLength(2);
    });

    it('re-groups the filtered list as the search query narrows it down', async () => {
      el.options = [
        { value: 'us', label: 'United States', group: 'North America' },
        { value: 'ca', label: 'Canada', group: 'North America' },
        { value: 'fr', label: 'France', group: 'Europe' }
      ];
      await openDropdown();
      const input = el.shadowRoot!.querySelector('input')!;
      input.value = 'united';
      input.dispatchEvent(new Event('input'));
      await el.updateComplete;
      const headings = [...el.shadowRoot!.querySelectorAll('.option-group-label')].map((h) => h.textContent);
      expect(headings).toEqual(['North America']);
      expect(el.shadowRoot!.querySelectorAll('.option')).toHaveLength(1);
    });

    it('renders an icon for an option with one, and none for an option without', async () => {
      el.options = [
        { value: 'us', label: 'United States', icon: 'globe' },
        { value: 'ca', label: 'Canada' }
      ];
      await openDropdown();
      const options = el.shadowRoot!.querySelectorAll('.option');
      expect(options[0]!.querySelector('.option-icon')).toBeTruthy();
      expect(options[1]!.querySelector('.option-icon')).toBeNull();
    });

    it('renders a description for an option with one, and none for an option without', async () => {
      el.options = [
        { value: 'us', label: 'United States', description: 'North America' },
        { value: 'ca', label: 'Canada' }
      ];
      await openDropdown();
      const options = el.shadowRoot!.querySelectorAll('.option');
      expect(options[0]!.querySelector('.option-description')!.textContent).toBe('North America');
      expect(options[1]!.querySelector('.option-description')).toBeNull();
    });
  });

  describe('creatable (create-new)', () => {
    const input = () => el.shadowRoot!.querySelector('input')!;

    const type = async (text: string) => {
      input().dispatchEvent(new FocusEvent('focus'));
      await el.updateComplete;
      input().value = text;
      input().dispatchEvent(new Event('input'));
      await el.updateComplete;
    };

    it('does not show a create row by default, even for text matching nothing', async () => {
      await type('xyz');
      expect(el.shadowRoot!.querySelector('.option-create')).toBeNull();
    });

    it('shows a create row when creatable and the typed text matches no existing option', async () => {
      el.creatable = true;
      await type('xyz');
      expect(el.shadowRoot!.querySelector('.option-create')).toBeTruthy();
    });

    it('does not show a create row for empty or whitespace-only text', async () => {
      el.creatable = true;
      await type('   ');
      expect(el.shadowRoot!.querySelector('.option-create')).toBeNull();
    });

    it('does not show a create row when the text exactly matches an existing option (case/diacritic-insensitive)', async () => {
      el.creatable = true;
      await type('UNITED STATES');
      expect(el.shadowRoot!.querySelector('.option-create')).toBeNull();
    });

    it('does not show a create row while disabled', async () => {
      el.creatable = true;
      el.disabled = true;
      await type('xyz');
      expect(el.shadowRoot!.querySelector('.option-create')).toBeNull();
    });

    it('uses the default create label with the typed text', async () => {
      el.creatable = true;
      await type('xyz');
      expect(el.shadowRoot!.querySelector('.option-create')!.textContent).toContain('Create "xyz"');
    });

    it('overrides the create label via labels', async () => {
      el.labels = { create: (q) => `Ajouter "${q}"` };
      el.creatable = true;
      await type('xyz');
      expect(el.shadowRoot!.querySelector('.option-create')!.textContent).toContain('Ajouter "xyz"');
    });

    it('clicking the create row fires create and change, sets value, and closes the dropdown', async () => {
      el.creatable = true;
      await type('xyz');
      const createHandler = vi.fn();
      const changeHandler = vi.fn();
      el.addEventListener('create', createHandler);
      el.addEventListener('change', changeHandler);
      el.shadowRoot!.querySelector<HTMLButtonElement>('.option-create')!.click();
      await el.updateComplete;
      expect(createHandler).toHaveBeenCalledOnce();
      expect((createHandler.mock.calls[0]![0] as CustomEvent).detail).toEqual({ value: 'xyz' });
      expect((changeHandler.mock.calls[0]![0] as CustomEvent).detail).toEqual({ value: 'xyz' });
      expect(el.value).toBe('xyz');
      expect(el.shadowRoot!.querySelector('.dropdown')).toBeNull();
    });

    it('displays the raw typed text in the closed field after creating, since it has no entry in options', async () => {
      el.creatable = true;
      await type('xyz');
      el.shadowRoot!.querySelector<HTMLButtonElement>('.option-create')!.click();
      await el.updateComplete;
      expect(input().value).toBe('xyz');
    });

    it('selecting the create row via keyboard (ArrowDown past the last option, then Enter) creates it', async () => {
      el.creatable = true;
      await type('xyz');
      const trigger = input();
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'ArrowDown' }));
      await el.updateComplete;
      trigger.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
      await el.updateComplete;
      expect(el.value).toBe('xyz');
    });

    it('in multiple mode, creating adds the value as a tag, keeps the dropdown open, and clears the query', async () => {
      el.multiple = true;
      el.creatable = true;
      await type('xyz');
      el.shadowRoot!.querySelector<HTMLButtonElement>('.option-create')!.click();
      await el.updateComplete;
      expect(el.value).toEqual(['xyz']);
      expect(el.shadowRoot!.querySelector('.dropdown')).toBeTruthy();
      expect(input().value).toBe('');
    });

    it('does not offer to re-create a value already selected as a tag in multiple mode', async () => {
      el.multiple = true;
      el.creatable = true;
      el.value = ['xyz'];
      await type('xyz');
      expect(el.shadowRoot!.querySelector('.option-create')).toBeNull();
    });

    it('falls back to the raw value for a created tag not present in options', async () => {
      el.multiple = true;
      el.creatable = true;
      el.value = ['xyz'];
      await el.updateComplete;
      const chip = el.shadowRoot!.querySelector('lt-chip')!;
      expect(chip.textContent!.trim()).toBe('xyz');
    });
  });
});

describe('diacritic-insensitive filtering (CMB-5)', () => {
  let el: Combobox;
  const input = () => el.shadowRoot!.querySelector('input')!;
  const optionLabels = () =>
    [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')].map((o) => o.textContent!.trim());

  const type = async (text: string) => {
    input().dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;
    input().value = text;
    input().dispatchEvent(new Event('input'));
    await el.updateComplete;
  };

  beforeEach(async () => {
    el = document.createElement('lt-combobox') as Combobox;
    el.options = [
      { value: 'fr', label: 'Café de Paris' },
      { value: 'ch', label: 'Zürich' },
      { value: 'jp', label: 'Japan' }
    ];
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('matches a plain-ASCII query against a diacritic label', async () => {
    await type('cafe');
    expect(optionLabels()).toEqual(['Café de Paris']);
  });

  it('matches a diacritic query against a diacritic label', async () => {
    await type('café');
    expect(optionLabels()).toEqual(['Café de Paris']);
  });

  it('matches regardless of case, combined with diacritic-insensitivity', async () => {
    await type('ZURICH');
    expect(optionLabels()).toEqual(['Zürich']);
  });

  it('still matches a plain label with no diacritics at all', async () => {
    await type('japan');
    expect(optionLabels()).toEqual(['Japan']);
  });

  it('shows no-results for a query that matches nothing even after normalizing', async () => {
    await type('zzz');
    expect(el.shadowRoot!.querySelector('.no-results')).toBeTruthy();
  });
});

describe('multiple (tags)', () => {
  let el: Combobox;

  const input = () => el.shadowRoot!.querySelector('input')!;
  const tags = () => [...el.shadowRoot!.querySelectorAll('lt-chip')];
  const options = () => [...el.shadowRoot!.querySelectorAll<HTMLButtonElement>('.option')];

  beforeEach(async () => {
    el = document.createElement('lt-combobox') as Combobox;
    el.multiple = true;
    el.options = OPTIONS;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('coerces a string value to an array', async () => {
    el.value = 'us';
    await el.updateComplete;
    expect(el.value).toEqual(['us']);
  });

  it('renders a tag per selected value', async () => {
    el.value = ['us', 'ca'];
    await el.updateComplete;
    expect(tags()).toHaveLength(2);
    expect(tags().map((t) => t.textContent!.trim())).toEqual(['United States', 'Canada']);
  });

  it('renders no tags when nothing is selected', () => {
    expect(tags()).toHaveLength(0);
  });

  it('clicking an option adds it, keeps the dropdown open, and dispatches change with the array', async () => {
    const handler = vi.fn();
    el.addEventListener('change', handler);
    input().dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    options()[0].click();
    await el.updateComplete;

    expect(el.value).toEqual(['us']);
    expect(el.hasAttribute('open')).toBe(true);
    expect(handler.mock.calls[0][0].detail).toEqual({ value: ['us'] });
  });

  it('clicking an already-selected option removes it (toggle)', async () => {
    el.value = ['us'];
    await el.updateComplete;
    input().dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    options()[0].click();
    await el.updateComplete;

    expect(el.value).toEqual([]);
  });

  it('clicking a tag delete button removes just that tag', async () => {
    el.value = ['us', 'ca'];
    await el.updateComplete;
    const handler = vi.fn();
    el.addEventListener('change', handler);

    tags()[0].dispatchEvent(new Event('delete', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toEqual(['ca']);
    expect(handler.mock.calls[0][0].detail).toEqual({ value: ['ca'] });
  });

  it('Backspace in an empty field removes the last tag', async () => {
    el.value = ['us', 'ca'];
    await el.updateComplete;
    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true }));
    await el.updateComplete;
    expect(el.value).toEqual(['us']);
  });

  it('Backspace with typed text does not remove a tag', async () => {
    el.value = ['us'];
    input().dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;
    input().value = 'can';
    input().dispatchEvent(new Event('input'));
    await el.updateComplete;

    input().dispatchEvent(new KeyboardEvent('keydown', { key: 'Backspace', cancelable: true }));
    await el.updateComplete;
    expect(el.value).toEqual(['us']);
  });

  it('marks selected options with aria-selected and the listbox as aria-multiselectable', async () => {
    el.value = ['ca'];
    input().dispatchEvent(new FocusEvent('focus'));
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('[role="listbox"]')!.getAttribute('aria-multiselectable')).toBe('true');
    expect(
      options()
        .find((o) => o.textContent!.trim() === 'Canada')!
        .getAttribute('aria-selected')
    ).toBe('true');
    expect(
      options()
        .find((o) => o.textContent!.trim() === 'United States')!
        .getAttribute('aria-selected')
    ).toBe('false');
  });

  it('does not close the dropdown when focus moves from the input to a tag delete button', async () => {
    el.value = ['us'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any).open = true;
    await el.updateComplete;

    // The delete button lives inside lt-chip's own (nested) shadow root, so this exercises the shadow-walking
    // containment check, not plain Node.contains() (which does not cross shadow boundaries). Invoked directly
    // (matching chip.test.ts's precedent for `_handleDelete`) since jsdom's focus/event-composition emulation
    // for nested custom-element shadow roots is unreliable to drive through a real dispatch.
    const deleteBtn = tags()[0].shadowRoot!.querySelector<HTMLButtonElement>('.delete')!;
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)._onFocusOut({ relatedTarget: deleteBtn } as unknown as FocusEvent);
    await el.updateComplete;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((el as any).open).toBe(true);
  });

  it('closes the dropdown when focus leaves to something outside the component', async () => {
    el.value = ['us'];
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any).open = true;
    await el.updateComplete;

    const outside = document.createElement('button');
    document.body.appendChild(outside);
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (el as any)._onFocusOut({ relatedTarget: outside } as unknown as FocusEvent);
    await el.updateComplete;

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    expect((el as any).open).toBe(false);
    outside.remove();
  });

  it('disables tag delete buttons when the combobox is disabled', async () => {
    el.value = ['us'];
    el.disabled = true;
    await el.updateComplete;
    expect(tags()[0].hasAttribute('disabled')).toBe(true);
  });

  it('submits one form entry per selected value', async () => {
    const spy = vi.spyOn(ElementInternals.prototype, 'setFormValue');
    el.name = 'skills';
    el.value = ['us', 'ca'];
    await el.updateComplete;
    const data = spy.mock.lastCall?.[0] as FormData;
    expect(data.getAll('skills')).toEqual(['us', 'ca']);
  });

  it('is valid once required is satisfied by any number of selections', async () => {
    const spy = vi.spyOn(ElementInternals.prototype, 'setValidity');
    el.required = true;
    await el.updateComplete;
    expect(spy.mock.lastCall?.[0]).toEqual({ valueMissing: true });

    el.value = ['us'];
    await el.updateComplete;
    expect(spy.mock.lastCall?.[0]).toEqual({});
  });

  it('clear button resets the whole array at once, not one tag', async () => {
    el.clearable = true;
    el.value = ['us', 'ca'];
    await el.updateComplete;
    el.shadowRoot!.querySelector<HTMLButtonElement>('.clear-button')!.click();
    await el.updateComplete;
    expect(el.value).toEqual([]);
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

  it('renders helper text as lt-text, matching textfield/select, not a bare span (CMB-6)', async () => {
    el.helperText = 'Pick one';
    await el.updateComplete;
    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(helper.tagName.toLowerCase()).toBe('lt-text');
    expect(helper.getAttribute('variant')).toBe('caption');
  });
});

describe('<lt-combobox> required/invalid ARIA', () => {
  let el: Combobox;

  beforeEach(async () => {
    el = document.createElement('lt-combobox') as Combobox;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('sets aria-required to match the required property', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.getAttribute('aria-required')).toBe('false');
    el.required = true;
    await el.updateComplete;
    expect(input.getAttribute('aria-required')).toBe('true');
  });

  it('sets aria-invalid only when variant is error (SEL-4/CMB-5 parity)', async () => {
    const input = el.shadowRoot!.querySelector('input')!;
    expect(input.hasAttribute('aria-invalid')).toBe(false);
    el.variant = 'error';
    await el.updateComplete;
    expect(input.getAttribute('aria-invalid')).toBe('true');
  });
});
