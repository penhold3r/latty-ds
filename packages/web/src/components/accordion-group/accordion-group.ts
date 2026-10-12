import { html } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, queryAssignedElements } from 'lit/decorators.js';

import { accordionGroupStyles } from './accordion-group.styles';
import type { Accordion } from '../accordion/accordion';

import '../accordion/accordion';

/**
 * A container that coordinates multiple `lt-accordion` children. By default, opening one closes the others —
 * the classic exclusive accordion. Set `multiple` to let them open independently instead.
 *
 * `lt-accordion` itself has no concept of siblings (each is a standalone, self-contained disclosure widget); this
 * is what adds cross-panel coordination, listening for each child's own `toggle` event rather than tracking a
 * single `value` (unlike `lt-tab-group`, more than one child can be open at once when `multiple` is set).
 *
 * @element lt-accordion-group
 *
 * @slot - `lt-accordion` elements
 *
 * @example
 * ```html
 * <lt-accordion-group>
 *   <lt-accordion label="What is Latty?" open>Latty is a design system built with Web Components.</lt-accordion>
 *   <lt-accordion label="How do I install it?">pnpm add @latty-ds/tokens @latty-ds/web</lt-accordion>
 * </lt-accordion-group>
 * ```
 *
 * @example
 * ```html
 * <lt-accordion-group multiple>
 *   <lt-accordion label="Section 1" open>…</lt-accordion>
 *   <lt-accordion label="Section 2" open>…</lt-accordion>
 * </lt-accordion-group>
 * ```
 */
@customElement('lt-accordion-group')
export class AccordionGroup extends ThemeableElement {
  static styles = accordionGroupStyles;

  /**
   * Allow more than one child accordion to stay open at once. Default (false) is the classic exclusive
   * accordion: opening one closes any others.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) multiple = false;

  @queryAssignedElements({ selector: 'lt-accordion' })
  private _accordions!: Accordion[];

  // Re-wires on every slotchange (accordions added/removed/reordered) and on reconnect (moving the group in the
  // DOM disconnects and reconnects it without re-running firstUpdated). Re-adding the same bound function
  // reference is a no-op per addEventListener's own de-duplication, so calling this repeatedly never stacks up
  // duplicate listeners — same pattern as lt-tab-group's updateTabs/updatePanels.
  private _wireAccordions = () => {
    this._accordions?.forEach((a) => a.addEventListener('toggle', this._handleToggle));
  };

  // Closes every other accordion when one opens, unless `multiple` lets them coexist. Reacts to the child's own
  // `toggle` event rather than tracking a single `value` (lt-accordion has no identifying value of its own, and
  // more than one can legitimately be open when `multiple` is set). Dispatches a matching `toggle` on each
  // sibling it closes — lt-accordion only fires that event from its own click handling, so a consumer listening
  // on an individual accordion would otherwise never learn the group just closed it for them.
  private _handleToggle = (e: Event) => {
    if (this.multiple) return;
    if (!(e as CustomEvent<{ open: boolean }>).detail.open) return;

    const source = e.target as Accordion;
    this._accordions?.forEach((a) => {
      if (a === source || !a.open) return;
      a.open = false;
      a.dispatchEvent(new CustomEvent('toggle', { detail: { open: false }, bubbles: true, composed: true }));
    });
  };

  connectedCallback() {
    super.connectedCallback();
    this._wireAccordions();
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this._accordions?.forEach((a) => a.removeEventListener('toggle', this._handleToggle));
  }

  render() {
    return html`<slot @slotchange=${this._wireAccordions}></slot>`;
  }
}
