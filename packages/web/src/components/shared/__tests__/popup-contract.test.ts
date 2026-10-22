import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

import '../../select/select';
import '../../combobox/combobox';
import '../../dropdown/dropdown';
import '../../date-input/date-input';

vi.mock('@floating-ui/dom', () => ({
  computePosition: vi.fn().mockResolvedValue({ x: 100, y: 200 }),
  autoUpdate: vi.fn().mockReturnValue(vi.fn()),
  offset: vi.fn(),
  flip: vi.fn(),
  shift: vi.fn()
}));

/**
 * The four components that show a floating panel: select, combobox, dropdown, date-input.
 *
 * They each own *what* their popup does — which element it is anchored to, whether closing hands focus
 * back, which key closes it — but the lifecycle around it is shared: position the panel, watch for a
 * click outside, tear the positioning down again. This file checks that shared half, so a component
 * that grows its own copy of it cannot quietly drift from the others.
 */
interface PopupCase {
  tag: string;
  /** The element the panel is positioned against. */
  reference: (el: HTMLElement) => Element;
  /** The panel the popup shows. */
  panel: (el: HTMLElement) => HTMLElement;
  /** The element that reports whether the popup is open. */
  expanded: (el: HTMLElement) => Element;
  /** Opens the popup the way a user would. */
  open: (el: HTMLElement) => void;
  /** The element a key press has to reach for Escape to close the popup. */
  escapeTarget: (el: HTMLElement) => EventTarget;
  /** The pointer event the component treats as a click outside. */
  outsideEvent: 'click' | 'pointerdown';
}

const CASES: PopupCase[] = [
  {
    tag: 'lt-select',
    reference: (el) => el.shadowRoot!.querySelector('.select-trigger')!,
    panel: (el) => el.shadowRoot!.querySelector('lt-surface.dropdown')!,
    expanded: (el) => el.shadowRoot!.querySelector('.select-trigger')!,
    open: (el) => el.shadowRoot!.querySelector<HTMLElement>('.select-trigger')!.click(),
    escapeTarget: (el) => el.shadowRoot!.querySelector('.select-trigger')!,
    outsideEvent: 'click'
  },
  {
    tag: 'lt-combobox',
    reference: (el) => el.shadowRoot!.querySelector('.input-wrap')!,
    panel: (el) => el.shadowRoot!.querySelector('.dropdown')!,
    expanded: (el) => el.shadowRoot!.querySelector('input')!,
    open: (el) => el.shadowRoot!.querySelector<HTMLElement>('.input-wrap')!.click(),
    escapeTarget: (el) => el.shadowRoot!.querySelector('input')!,
    outsideEvent: 'click'
  },
  {
    tag: 'lt-dropdown',
    reference: (el) => el.querySelector('[slot="trigger"]')!,
    panel: (el) => el.shadowRoot!.querySelector('lt-surface.menu')!,
    expanded: (el) => el.querySelector('[slot="trigger"]')!,
    open: (el) => {
      (el as HTMLElement & { open: boolean }).open = true;
    },
    escapeTarget: (el) => el.querySelector('[slot="trigger"]')!,
    outsideEvent: 'click'
  },
  {
    tag: 'lt-date-input',
    reference: (el) => el.shadowRoot!.querySelector('#field-btn')!,
    panel: (el) => el.shadowRoot!.querySelector('.dropdown')!,
    expanded: (el) => el.shadowRoot!.querySelector('#field-btn')!,
    open: (el) => el.shadowRoot!.querySelector<HTMLElement>('#field-btn')!.click(),
    escapeTarget: (el) => el.shadowRoot!.querySelector('.dropdown')!,
    outsideEvent: 'pointerdown'
  }
];

const created: HTMLElement[] = [];

/** Flushes the pending microtasks a positioning round trip goes through. */
const settle = async (el: HTMLElement) => {
  await (el as HTMLElement & { updateComplete?: Promise<boolean> }).updateComplete;
  await new Promise((resolve) => setTimeout(resolve, 0));
};

const mount = async (tag: string): Promise<HTMLElement> => {
  const el = document.createElement(tag) as HTMLElement & { updateComplete: Promise<boolean> };
  if (tag === 'lt-dropdown') {
    const trigger = document.createElement('button');
    trigger.setAttribute('slot', 'trigger');
    el.appendChild(trigger);
  }
  document.body.appendChild(el);
  created.push(el);
  await el.updateComplete;
  return el;
};

beforeEach(() => {
  vi.clearAllMocks();
});

afterEach(() => {
  created.splice(0).forEach((el) => el.remove());
});

describe.each(CASES)('the shared popup lifecycle — $tag', (popupCase) => {
  /**
   * Whether the panel is on screen. A component may either keep the panel in the DOM and hide it, or
   * take it out of the DOM altogether — the combobox does the latter — so both count as closed.
   */
  const isShowing = (el: HTMLElement): boolean => {
    const panel = popupCase.panel(el);
    return panel !== null && panel.style.display === 'block';
  };

  it('positions its panel against its trigger when it opens', async () => {
    const el = await mount(popupCase.tag);
    popupCase.open(el);
    await settle(el);

    const { computePosition } = await import('@floating-ui/dom');
    expect(computePosition).toHaveBeenCalledOnce();
    const [reference, panel] = (computePosition as ReturnType<typeof vi.fn>).mock.calls[0];
    expect(reference).toBe(popupCase.reference(el));
    expect(panel).toBe(popupCase.panel(el));
  });

  it('shows the panel and reports itself as expanded while it is open', async () => {
    const el = await mount(popupCase.tag);
    popupCase.open(el);
    await settle(el);

    expect(isShowing(el)).toBe(true);
    expect(popupCase.expanded(el).getAttribute('aria-expanded')).toBe('true');
  });

  it('closes when the user clicks outside it', async () => {
    const el = await mount(popupCase.tag);
    popupCase.open(el);
    await settle(el);

    document.body.dispatchEvent(new MouseEvent(popupCase.outsideEvent, { bubbles: true, composed: true }));
    await settle(el);

    expect(isShowing(el)).toBe(false);
    expect(popupCase.expanded(el).getAttribute('aria-expanded')).toBe('false');
  });

  it('closes when the user presses Escape', async () => {
    const el = await mount(popupCase.tag);
    popupCase.open(el);
    await settle(el);

    popupCase
      .escapeTarget(el)
      .dispatchEvent(new KeyboardEvent('keydown', { key: 'Escape', bubbles: true, composed: true }));
    await settle(el);

    expect(isShowing(el)).toBe(false);
    expect(popupCase.expanded(el).getAttribute('aria-expanded')).toBe('false');
  });

  it('stays open when the user clicks inside it', async () => {
    const el = await mount(popupCase.tag);
    popupCase.open(el);
    await settle(el);

    popupCase.panel(el).dispatchEvent(new MouseEvent(popupCase.outsideEvent, { bubbles: true, composed: true }));
    await settle(el);

    expect(isShowing(el)).toBe(true);
    expect(popupCase.expanded(el).getAttribute('aria-expanded')).toBe('true');
  });
});
