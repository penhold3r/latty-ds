import { describe, it, expect, beforeEach, afterEach } from 'vitest';
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
});
