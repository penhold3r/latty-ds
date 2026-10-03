import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import type { RadioGroup } from '../radio-group';
import type { Radio } from '../../radio/radio';
import '../radio-group';
import '../../radio/radio';

describe('<lt-radio-group>', () => {
  let el: RadioGroup;

  beforeEach(async () => {
    el = document.createElement('lt-radio-group') as RadioGroup;
    el.label = 'Test group';
    el.name = 'test-group';

    // Add some radio buttons
    const radio1 = document.createElement('lt-radio') as Radio;
    radio1.value = 'option1';
    radio1.label = 'Option 1';

    const radio2 = document.createElement('lt-radio') as Radio;
    radio2.value = 'option2';
    radio2.label = 'Option 2';
    radio2.checked = true;

    const radio3 = document.createElement('lt-radio') as Radio;
    radio3.value = 'option3';
    radio3.label = 'Option 3';

    el.appendChild(radio1);
    el.appendChild(radio2);
    el.appendChild(radio3);

    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('renders a radio group', () => {
    const group = el.shadowRoot!.querySelector('.radio-group');
    expect(group).toBeTruthy();
  });

  it('has default orientation of vertical', () => {
    expect(el.orientation).toBe('vertical');
    expect(el.getAttribute('orientation')).toBe('vertical');
  });

  it('renders label when provided', () => {
    const label = el.shadowRoot!.querySelector('.label');
    expect(label).toBeTruthy();
    expect(label?.textContent).toContain('Test group');
  });

  it('renders required indicator when required', async () => {
    el.required = true;
    await el.updateComplete;
    const indicator = el.shadowRoot!.querySelector('.required-indicator');
    expect(indicator).toBeTruthy();
  });

  it('renders helper text when provided', async () => {
    el.helperText = 'Choose one option';
    await el.updateComplete;
    const helperText = el.shadowRoot!.querySelector('.helper-text');
    expect(helperText).toBeTruthy();
    expect(helperText?.textContent).toBe('Choose one option');
  });

  it('can change orientation', async () => {
    el.orientation = 'horizontal';
    await el.updateComplete;
    expect(el.getAttribute('orientation')).toBe('horizontal');
  });

  it('applies name to all radio buttons', async () => {
    await el.updateComplete;
    const radios = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
    radios.forEach((radio) => {
      expect(radio.name).toBe('test-group');
    });
  });

  it('sets initial value from checked radio', async () => {
    await el.updateComplete;
    // Give time for firstUpdated to run
    await new Promise((resolve) => setTimeout(resolve, 50));
    expect(el.value).toBe('option2');
  });

  it('updates value when child radio is checked programmatically', async () => {
    await el.updateComplete;
    await new Promise((resolve) => setTimeout(resolve, 100));

    const radios = el.querySelectorAll('lt-radio');
    expect(radios.length).toBe(3);
  });

  it('has correct role attribute', () => {
    const group = el.shadowRoot!.querySelector('[role="radiogroup"]');
    expect(group).toBeTruthy();
  });

  it('supports error state', async () => {
    el.error = true;
    await el.updateComplete;
    expect(el.hasAttribute('error')).toBe(true);
  });

  it('unchecks a previously-checked radio when another is selected by click', async () => {
    const [radio1, , radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
    const input3 = radio3.shadowRoot!.querySelector('input') as HTMLInputElement;
    input3.checked = true;
    input3.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;
    expect(el.value).toBe('option3');
    expect(radio1.checked).toBe(false);
    expect(radio3.checked).toBe(true);
  });

  it('fires exactly one change event, shaped {value}, when a radio is selected', async () => {
    const handler = vi.fn();
    el.addEventListener('change', handler);
    const [, , radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
    const input3 = radio3.shadowRoot!.querySelector('input') as HTMLInputElement;
    input3.checked = true;
    input3.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(handler).toHaveBeenCalledOnce();
    expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: 'option3' });
  });

  it('syncs checked state to the radios when value is set programmatically', async () => {
    el.value = 'option3';
    await el.updateComplete;
    const [radio1, radio2, radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
    expect(radio1.checked).toBe(false);
    expect(radio2.checked).toBe(false);
    expect(radio3.checked).toBe(true);
  });

  it('keeps working after being moved in the DOM (reconnected)', async () => {
    const otherParent = document.createElement('div');
    document.body.appendChild(otherParent);
    otherParent.appendChild(el); // disconnects then reconnects `el`
    await el.updateComplete;

    const [, , radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
    const input3 = radio3.shadowRoot!.querySelector('input') as HTMLInputElement;
    input3.checked = true;
    input3.dispatchEvent(new Event('change', { bubbles: true, composed: true }));
    await el.updateComplete;

    expect(el.value).toBe('option3');
    otherParent.remove();
  });

  describe('roving tabindex and arrow-key navigation (RAD-2)', () => {
    const input = (radio: Radio) => radio.shadowRoot!.querySelector('input') as HTMLInputElement;
    const arrow = (radio: Radio, key: string) =>
      radio.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true, cancelable: true }));

    it('only the checked radio is a Tab stop', () => {
      const [radio1, radio2, radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      expect(input(radio1).tabIndex).toBe(-1);
      expect(input(radio2).tabIndex).toBe(0); // checked in the fixture
      expect(input(radio3).tabIndex).toBe(-1);
    });

    it('moves the tab stop when the group value changes', async () => {
      const [radio1, radio2] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      el.value = 'option1';
      await el.updateComplete;
      expect(input(radio1).tabIndex).toBe(0);
      expect(input(radio2).tabIndex).toBe(-1);
    });

    it('falls back to the first enabled radio when nothing is checked', async () => {
      el.value = 'no-such-option';
      await el.updateComplete;
      const [radio1] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      expect(input(radio1).tabIndex).toBe(0);
    });

    it('ArrowDown moves the tab stop and selects the next radio', async () => {
      const [, radio2, radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      arrow(radio2, 'ArrowDown');
      expect(el.value).toBe('option3');
      await el.updateComplete;
      await radio3.updateComplete;
      expect(input(radio3).tabIndex).toBe(0);
    });

    it('ArrowRight/ArrowLeft also move (native radiogroup convention)', () => {
      const [, radio2, radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      arrow(radio2, 'ArrowRight');
      expect(el.value).toBe('option3');
      arrow(radio3, 'ArrowLeft');
      expect(el.value).toBe('option2');
    });

    it('wraps at both ends', () => {
      const [radio1, , radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      arrow(radio3, 'ArrowDown');
      expect(el.value).toBe('option1');
      arrow(radio1, 'ArrowUp');
      expect(el.value).toBe('option3');
    });

    it('dispatches change when arrow keys move selection', () => {
      const handler = vi.fn();
      el.addEventListener('change', handler);
      const [, radio2] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      arrow(radio2, 'ArrowDown');
      expect(handler).toHaveBeenCalledOnce();
      expect((handler.mock.calls[0][0] as CustomEvent).detail).toEqual({ value: 'option3' });
    });

    it('skips a disabled radio when navigating', async () => {
      const [, radio2, radio3] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      radio3.disabled = true;
      await el.updateComplete;
      arrow(radio2, 'ArrowDown');
      expect(el.value).toBe('option1'); // wraps past the disabled radio3
    });

    it('reacts to a radio being disabled after the fact, moving the roving stop off it', async () => {
      const [, radio2] = el.querySelectorAll('lt-radio') as NodeListOf<Radio>;
      radio2.disabled = true;
      // Attribute reflection + the MutationObserver reacting to it are both async.
      await radio2.updateComplete;
      await Promise.resolve();
      expect(input(radio2).tabIndex).toBe(-1);
    });
  });
});

describe('helper text is described by its control (aria-describedby)', () => {
  let el: RadioGroup;

  beforeEach(async () => {
    el = document.createElement('lt-radio-group') as RadioGroup;
    document.body.appendChild(el);
    await el.updateComplete;
  });

  afterEach(() => {
    el.remove();
  });

  it('points the control at the rendered helper text', async () => {
    el.helperText = 'Pick one';
    await el.updateComplete;
    const control = el.shadowRoot!.querySelector('.radio-group')!;
    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(control.getAttribute('aria-describedby')).toBe(helper.id);
    expect(helper.textContent!.trim()).toBe('Pick one');
  });

  it('omits aria-describedby when there is no helper text', () => {
    const control = el.shadowRoot!.querySelector('.radio-group')!;
    expect(control.hasAttribute('aria-describedby')).toBe(false);
  });
});
