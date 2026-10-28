import { css } from 'lit';

export const snackbarStyles = css`
  /* ── Popover ─────────────────────────────────────────────── The host itself is the popover element (no
     wrapped child, unlike lt-dialog/lt-sidepanel's inner <dialog>) — the browser's own [popover] UA stylesheet
     sets inset:0, margin:auto, width/height:fit-content, padding, border, and Canvas colors, all of which are
     reset below in favor of this component's own bottom-center placement. display is deliberately NOT set on
     the base rule — a closed (not :popover-open) popover must stay display:none (the native default) so it's
     genuinely non-interactive and out of the accessibility tree; it's set to block only for the open state,
     below. display/overlay need transition-behavior: allow-discrete so hidePopover() doesn't remove it from
     rendering instantly, cutting the exit transition off partway through — same reasoning as lt-dialog. ─────── */

  :host {
    background: transparent;
    border: none;
    bottom: calc(24px + env(safe-area-inset-bottom, 0px));
    left: 50%;
    margin: 0;
    max-width: calc(100vw - 48px);
    opacity: 0;
    overflow: visible;
    padding: 0;
    position: fixed;
    right: auto;
    top: auto;
    transform: translateX(-50%) translateY(8px);
    transition:
      opacity var(--lt-duration-moderate) var(--lt-ease-standard),
      transform var(--lt-duration-moderate) var(--lt-ease-standard),
      display var(--lt-duration-moderate) allow-discrete,
      overlay var(--lt-duration-moderate) allow-discrete;
    width: max-content;
  }

  :host([open]) {
    display: block;
    opacity: 1;
    transform: translateX(-50%) translateY(0);
  }

  /* A newly-shown popover has no earlier rendered frame to transition from — @starting-style supplies one so
     the fade/slide-in actually animates instead of snapping straight to the open position. */
  @starting-style {
    :host([open]) {
      opacity: 0;
      transform: translateX(-50%) translateY(8px);
    }
  }

  /* ── Managed mode (lt-snackbar-group) ───────────────────────────────────── A managed instance isn't its own
     popover (no [popover] attribute at all, see snackbar.ts), so it needs its own explicit closed-state
     display:none — nothing native supplies that default here. It also isn't self-positioned: the group owns a
     single fixed/top-layer container and lays several of these out as plain flex children inside it (stacking
     only works if each instance behaves like a normal block in flow, not an independently centered fixed box). */
  :host([managed]) {
    bottom: auto;
    display: none;
    left: auto;
    max-width: none;
    position: static;
    transform: translateY(8px);
    width: auto;
  }

  :host([managed][open]) {
    display: block;
    transform: translateY(0);
  }

  @starting-style {
    :host([managed][open]) {
      transform: translateY(8px);
    }
  }

  /* ── Layout ──────────────────────────────────────────────── */

  .inner {
    align-items: center;
    color: var(--lt-text-inverse);
    display: flex;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    font-size: 0.875rem;
    gap: var(--lt-spacing-2);
    line-height: 1.4;
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
  }

  /* ── Variant text colors ─────────────────────────────────── */

  :host([variant='success']) .inner {
    color: var(--lt-text-on-success);
  }
  :host([variant='warning']) .inner {
    color: var(--lt-text-on-warning);
  }
  :host([variant='error']) .inner {
    color: var(--lt-text-on-error);
  }
  :host([variant='info']) .inner {
    color: var(--lt-text-on-info);
  }

  /* ── Variant icon ────────────────────────────────────────── */

  .variant-icon {
    flex-shrink: 0;
    font-size: 1.125rem;
  }

  /* ── Message ─────────────────────────────────────────────── */

  .message {
    flex: 1;
  }

  /* ── Action button ───────────────────────────────────────── */

  .action {
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    font-family: inherit;
    font-size: 0.8125rem;
    font-weight: 600;
    letter-spacing: 0.05em;
    padding: 0 var(--lt-spacing-1);
    text-transform: uppercase;
  }

  /* Text on a coloured fill is never dimmed with opacity (that blends it into the fill and lowers its contrast
     below whatever the on-colour was picked for), so hover is shown with an underline instead. */
  .action:hover {
    text-decoration: underline;
  }

  /* currentColor, not --lt-focus-ring-color — the snackbar's own background varies per variant (success/
     warning/error/info fills), and currentColor already resolves to whatever on-color text is already proven
     to contrast against that specific fill, the same reasoning .action/.close's own color: inherit relies on. */
  .action:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid currentColor;
    outline-offset: var(--lt-border-focusRingOffset);
  }

  /* ── Close button ────────────────────────────────────────── */

  .close {
    align-items: center;
    background: transparent;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    flex-shrink: 0;
    justify-content: center;
    min-height: 24px; /* WCAG 2.5.8 */
    min-width: 24px;
    opacity: 0.7;
    padding: 0;
  }

  .close:hover {
    opacity: 1;
  }

  .close:focus-visible {
    opacity: 1;
    outline: var(--lt-border-focusRingWidth) solid currentColor;
    outline-offset: var(--lt-border-focusRingOffset);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    :host {
      transition: none;
    }
  }
`;
