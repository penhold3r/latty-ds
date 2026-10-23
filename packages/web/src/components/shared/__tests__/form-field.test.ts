import { describe, it, expect, afterEach } from 'vitest';

import '../../textfield/textfield';
import '../../select/select';
import '../../combobox/combobox';
import '../../date-input/date-input';
import '../../datepicker/datepicker';
import '../../radio-group/radio-group';

/**
 * The six controls that present themselves as a labelled field with a required marker and helper text.
 *
 * They all render that presentation through the shared field helper, so this file checks the *contract*
 * rather than each control's own copy of it: a control that grows its own markup would fail here, and so
 * would one that quietly drifts from the treatment the others get.
 */
interface FieldCase {
  tag: string;
  /** The element that carries `aria-describedby` — the control's focusable element, or the group itself. */
  describedBy: string;
}

const CASES: FieldCase[] = [
  { tag: 'lt-textfield', describedBy: 'input, textarea' },
  { tag: 'lt-select', describedBy: '.select-trigger' },
  { tag: 'lt-combobox', describedBy: 'input' },
  { tag: 'lt-date-input', describedBy: '.field-btn' },
  { tag: 'lt-datepicker', describedBy: 'input' },
  { tag: 'lt-radio-group', describedBy: '.radio-group' }
];

interface FieldElement extends HTMLElement {
  label: string;
  required: boolean;
  helperText: string;
  updateComplete: Promise<boolean>;
}

const created: FieldElement[] = [];

const mount = async (tag: string): Promise<FieldElement> => {
  const el = document.createElement(tag) as FieldElement;
  document.body.appendChild(el);
  created.push(el);
  await el.updateComplete;
  return el;
};

afterEach(() => {
  created.splice(0).forEach((el) => el.remove());
});

describe.each(CASES)('the shared field presentation — $tag', ({ tag, describedBy }) => {
  it('renders the label and the required marker together, in one wrapper', async () => {
    const el = await mount(tag);
    el.label = 'Full name';
    el.required = true;
    await el.updateComplete;

    const wrapper = el.shadowRoot!.querySelector('.label-text');
    expect(wrapper, 'the label text and the marker share one wrapper').toBeTruthy();

    const labelText = wrapper!.querySelector('lt-text');
    expect(labelText?.getAttribute('variant')).toBe('label');
    expect(labelText!.textContent?.trim()).toBe('Full name');

    const marker = wrapper!.querySelector('.required-indicator');
    expect(marker, 'the marker sits inside the wrapper, not beside it').toBeTruthy();
    expect(marker!.textContent?.trim()).toBe('*');
  });

  it('renders no marker when the field is not required', async () => {
    const el = await mount(tag);
    el.label = 'Full name';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.required-indicator')).toBeNull();
  });

  it('keeps the marker in the accessibility tree', async () => {
    const el = await mount(tag);
    el.label = 'Full name';
    el.required = true;
    await el.updateComplete;

    const marker = el.shadowRoot!.querySelector('.required-indicator')!;
    /*
     * Deliberately not `aria-hidden`. Most controls also expose the required state programmatically —
     * `required` on a native input, `aria-required` on a select or combobox — but `lt-date-input`'s
     * trigger is a plain `<button>`, and `aria-required` is not a property `role="button"` allows. For
     * that control the marker is the only required cue there is, so hiding it would take information away.
     */
    expect(marker.hasAttribute('aria-hidden')).toBe(false);
  });

  it('renders the helper text as caption text, and points the control at it', async () => {
    const el = await mount(tag);
    el.label = 'Full name';
    el.helperText = 'As it appears on your passport';
    await el.updateComplete;

    const helper = el.shadowRoot!.querySelector('.helper-text')!;
    expect(helper).toBeTruthy();
    expect(helper.tagName.toLowerCase()).toBe('lt-text');
    expect(helper.getAttribute('variant')).toBe('caption');
    expect(helper.textContent?.trim()).toBe('As it appears on your passport');

    const described = el.shadowRoot!.querySelector(describedBy)!;
    expect(described.getAttribute('aria-describedby')).toBe(helper.id);
  });

  it('renders no helper text when there is none', async () => {
    const el = await mount(tag);
    el.label = 'Full name';
    await el.updateComplete;

    expect(el.shadowRoot!.querySelector('.helper-text')).toBeNull();
  });
});
