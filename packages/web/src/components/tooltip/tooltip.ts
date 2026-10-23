import { html, type PropertyValues } from 'lit';
import { ThemeableElement } from '../../base';
import { customElement, property, query } from 'lit/decorators.js';
import { styleMap } from 'lit/directives/style-map.js';

import { tooltipStyles } from './tooltip.styles';
import type { TooltipPlacement } from './tooltip.types';
import { resolveColorValue, createClickOutsideHandler } from '../../utils';
import '../text/text';

let _tooltipIdCounter = 0;

/**
 * A short, fixed grace period (not configurable — `hoverable` is a boolean, not a second delay knob)
 * between losing hover/focus and actually hiding when `hoverable` is set.
 * The trigger and the bubble are visually separated by `--lt-tooltip-offset` (8px by default) —
 * without this, a real mouse movement from one to the other passes over that gap, which isn't part of
 * either element, firing a `pointerleave` that hides the tooltip before the pointer ever reaches it.
 * Long enough to cross a typical small gap deliberately, short enough to read as instant.
 */
const HOVER_GRACE_MS = 150;

/**
 * Floating label that appears on hover or focus of its trigger element.
 * @element lt-tooltip
 * @slot - The trigger element the tooltip is anchored to.
 * @example
 * ```html
 * <lt-tooltip content="Save document">
 *   <lt-button>Save</lt-button>
 * </lt-tooltip>
 * ```
 * @example
 * ```html
 * <lt-tooltip content="Opens in a new tab" placement="bottom"
 *   background="--lt-color-primary-600" color="#fff">
 *   <a href="#">Learn more</a>
 * </lt-tooltip>
 * ```
 * @example
 * ```html
 * <!-- Waits 500ms before showing, so a fast mouse pass-through never flashes it -->
 * <lt-tooltip content="Delete permanently" delay="500">
 *   <lt-icon-button icon="trash" label="Delete"></lt-icon-button>
 * </lt-tooltip>
 * ```
 * @example
 * ```html
 * <!-- Lets the pointer reach the bubble itself (e.g. to select and copy a long value) without it vanishing
 *      mid-transit -->
 * <lt-tooltip content="a1b2c3d4-e5f6-7890-abcd-ef1234567890" hoverable>
 *   <code>ID</code>
 * </lt-tooltip>
 * ```
 * @example
 * ```html
 * <!-- A tap shows it immediately; tap again, tap elsewhere, or press Escape to dismiss -->
 * <lt-tooltip content="Encrypted with your device's passcode" touch>
 *   <code>Why is this locked?</code>
 * </lt-tooltip>
 * ```
 */
@customElement('lt-tooltip')
export class Tooltip extends ThemeableElement {
  static styles = tooltipStyles;

  private _tooltipId = `lt-tooltip-${++_tooltipIdCounter}`;

  @query('slot') private _slot!: HTMLSlotElement;

  @query('.tooltip') private _tooltipEl!: HTMLElement;

  private _hovered = false;
  private _focused = false;

  /** Tooltip label text. */
  @property({ reflect: true }) content = '';

  /** Placement of the tooltip relative to the trigger: top, bottom, left, or right. */
  @property({ reflect: true }) placement: TooltipPlacement = 'top';

  /** Prevent the tooltip from showing. */
  @property({ type: Boolean, reflect: true }) disabled = false;

  /** Background color override. Accepts a hex value (#1a1a2e) or a CSS token name (--lt-color-primary-600). */
  @property({ reflect: true }) background = '';

  /** Text color override. Accepts a hex value (#ffffff) or a CSS token name (--lt-color-neutral-50). */
  @property({ reflect: true }) color = '';

  /**
   * Milliseconds to wait before showing the tooltip after hover/focus starts. `0` (default) shows immediately.
   * A hover that ends before the delay elapses never shows the tooltip at all — only a completed wait schedules
   * it. Hiding is always immediate, regardless of `delay`.
   * @default 0
   */
  @property({ type: Number }) delay = 0;

  /**
   * Keeps the tooltip open briefly when the pointer leaves the trigger, giving it time to reach the tooltip
   * bubble itself (e.g. To select and copy its text) instead of dismissing instantly. Hovering the bubble then
   * keeps it open for as long as the pointer stays there. Has no effect on focus-driven showing/hiding, which
   * stays immediate either way — there's no equivalent "hover the bubble" for keyboard users.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) hoverable = false;

  private _hoveredBubble = false;

  /**
   * Switches the trigger's interaction model for touch pointers: a tap shows the tooltip immediately
   * (bypassing `delay`), instead of the default behavior — a touch tap fires a `pointerenter`/`pointerleave`
   * pair just like a mouse hover, but `pointerleave` follows almost immediately once the finger lifts, so the
   * tooltip flashes and vanishes before it can actually be read. Tapping the trigger again, tapping anywhere
   * else, or pressing Escape (if a keyboard is attached) closes it. Has no effect on mouse/pen pointers, which
   * keep using the normal hover/focus model regardless of this prop.
   * @default false
   */
  @property({ type: Boolean, reflect: true }) touch = false;

  private _touchOpen = false;
  private _cleanupOutsideTap: (() => void) | null = null;

  private _showTimer?: ReturnType<typeof setTimeout>;
  private _hideTimer?: ReturnType<typeof setTimeout>;

  private _clearShowTimer() {
    clearTimeout(this._showTimer);
    this._showTimer = undefined;
  }

  private _clearHideTimer() {
    clearTimeout(this._hideTimer);
    this._hideTimer = undefined;
  }

  // aria-describedby's id lookup only works within one tree: the tooltip bubble lives in this element's own
  // shadow root, but the trigger the id is set on is the slotted (light DOM) element — an id reference can't
  // cross that boundary, so no AT ever actually announces it (verified: resolves to nothing in the accessibility
  // tree). aria-description carries the text itself, so there's no id, and nothing to fail to resolve.
  private _describeTrigger() {
    const trigger = this._slot?.assignedElements()[0];
    trigger?.setAttribute('aria-description', this.content);
  }

  private _isShown(): boolean {
    return this._tooltipEl?.matches(':popover-open') ?? false;
  }

  private _sync() {
    const shouldShow =
      (this._hovered || this._focused || (this.hoverable && this._hoveredBubble) || this._touchOpen) &&
      !this.disabled &&
      !!this.content;

    if (shouldShow) {
      // Something is hovered/focused again — cancel any grace-period hide that was running.
      this._clearHideTimer();

      // Already visible (e.g. `content` changed while shown) or no delay configured — show without waiting.
      if (this._isShown() || this.delay <= 0) {
        this._clearShowTimer();
        this._show();
        return;
      }

      // A delay is already running — let it finish rather than restarting the clock on every
      // pointermove-driven re-sync.
      if (this._showTimer === undefined) {
        this._showTimer = setTimeout(() => {
          this._showTimer = undefined;
          this._show();
        }, this.delay);
      }
      return;
    }

    // Ends a pending delay before it ever shows — a hover that ends before `delay` elapses never shows the
    // tooltip at all, only a completed wait schedules it.
    this._clearShowTimer();

    if (this.hoverable && this._isShown() && this._hideTimer === undefined) {
      // Grace period: gives the pointer time to cross the gap between the trigger and the bubble before
      // actually hiding — see HOVER_GRACE_MS.
      this._hideTimer = setTimeout(() => {
        this._hideTimer = undefined;
        this._hide();
      }, HOVER_GRACE_MS);
      return;
    }

    this._hide();
  }

  private _show() {
    if (!this._isShown()) {
      this._tooltipEl.showPopover();
      window.addEventListener('scroll', this._reposition, true);
      window.addEventListener('resize', this._reposition);
    }
    this._reposition();
  }

  private _hide() {
    if (!this._isShown()) return;
    this._tooltipEl.hidePopover();
    window.removeEventListener('scroll', this._reposition, true);
    window.removeEventListener('resize', this._reposition);
  }

  // A top-layer popover is positioned against the viewport, not the host, so the bubble's fixed coordinates are
  // computed here from the host's rect. Fixed coordinates need a physical side, so the logical start/end placements
  // are resolved against the host's computed direction (start is the left side in LTR, the right side in RTL).
  private _reposition = () => {
    if (!this._isShown()) return;
    const host = this.getBoundingClientRect();
    const { width, height } = this._tooltipEl.getBoundingClientRect();
    const style = getComputedStyle(this);
    const offset = parseFloat(style.getPropertyValue('--lt-tooltip-offset')) || 8;
    const rtl = style.direction === 'rtl';

    let left: number;
    let top: number;
    switch (this.placement) {
      case 'bottom':
        left = host.left + host.width / 2 - width / 2;
        top = host.bottom + offset;
        break;
      case 'start':
      case 'end': {
        const onLeft = (this.placement === 'start') !== rtl;
        left = onLeft ? host.left - offset - width : host.right + offset;
        top = host.top + host.height / 2 - height / 2;
        break;
      }
      default:
        left = host.left + host.width / 2 - width / 2;
        top = host.top - offset - height;
    }
    this._tooltipEl.style.left = `${left}px`;
    this._tooltipEl.style.top = `${top}px`;
  };

  private _onPointerEnter = (e: PointerEvent) => {
    // In touch mode, a tap drives `_touchOpen` instead (see _onPointerUp) — the pointerenter/pointerleave pair
    // a touch tap also fires would otherwise flash the tooltip via the hover path before the finger even lifts.
    if (this.touch && e.pointerType === 'touch') return;
    this._hovered = true;
    this._sync();
  };

  private _onPointerLeave = (e: PointerEvent) => {
    if (this.touch && e.pointerType === 'touch') return;
    this._hovered = false;
    this._sync();
  };

  private _onPointerUp = (e: PointerEvent) => {
    if (!this.touch || e.pointerType !== 'touch' || this.disabled || !this.content) return;
    if (this._touchOpen) {
      this._closeTouchOpen();
    } else {
      this._touchOpen = true;
      this._clearShowTimer();
      this._show();
      this._startTouchOpenWatchers();
    }
  };

  private _onEscapeKey = (e: KeyboardEvent) => {
    if (e.key === 'Escape') this._closeTouchOpen();
  };

  private _closeTouchOpen() {
    this._touchOpen = false;
    this._hide();
    this._stopTouchOpenWatchers();
  }

  private _startTouchOpenWatchers() {
    this._cleanupOutsideTap = createClickOutsideHandler(this, () => this._closeTouchOpen());
    document.addEventListener('keydown', this._onEscapeKey);
  }

  private _stopTouchOpenWatchers() {
    this._cleanupOutsideTap?.();
    this._cleanupOutsideTap = null;
    document.removeEventListener('keydown', this._onEscapeKey);
  }

  private _onFocusIn = () => {
    this._focused = true;
    this._sync();
  };

  private _onFocusOut = (e: FocusEvent) => {
    if (this.contains(e.relatedTarget as Node | null)) return;
    this._focused = false;
    this._sync();
  };

  private _onBubblePointerEnter = () => {
    this._hoveredBubble = true;
    this._sync();
  };

  private _onBubblePointerLeave = () => {
    this._hoveredBubble = false;
    this._sync();
  };

  connectedCallback() {
    super.connectedCallback();
    this.addEventListener('pointerenter', this._onPointerEnter);
    this.addEventListener('pointerleave', this._onPointerLeave);
    this.addEventListener('pointerup', this._onPointerUp);
    this.addEventListener('focusin', this._onFocusIn);
    this.addEventListener('focusout', this._onFocusOut);
  }

  disconnectedCallback() {
    super.disconnectedCallback();
    this.removeEventListener('pointerenter', this._onPointerEnter);
    this.removeEventListener('pointerleave', this._onPointerLeave);
    this.removeEventListener('pointerup', this._onPointerUp);
    this.removeEventListener('focusin', this._onFocusIn);
    this.removeEventListener('focusout', this._onFocusOut);
    this._hovered = false;
    this._focused = false;
    this._touchOpen = false;
    this._clearShowTimer();
    this._clearHideTimer();
    this._stopTouchOpenWatchers();
    this._hide();
  }

  protected firstUpdated() {
    this._describeTrigger();
  }

  protected updated(changed: PropertyValues<this>) {
    super.updated(changed);
    if (changed.has('content')) this._describeTrigger();
    if (changed.has('content') || changed.has('disabled')) this._sync();
    else if (changed.has('placement')) this._reposition();
  }

  render() {
    const tooltipStyle = styleMap({
      ...(this.background ? { '--_tooltip-bg': resolveColorValue(this.background) } : {}),
      ...(this.color ? { '--_tooltip-color': resolveColorValue(this.color) } : {})
    });

    return html`
      <slot></slot>
      <div
        class="tooltip"
        id=${this._tooltipId}
        popover="manual"
        role="tooltip"
        part="tooltip"
        aria-hidden="true"
        style=${tooltipStyle}
        @pointerenter=${this._onBubblePointerEnter}
        @pointerleave=${this._onBubblePointerLeave}
      >
        <lt-text variant="caption" as="span">${this.content}</lt-text>
        <span class="arrow" part="arrow"></span>
      </div>
    `;
  }
}
