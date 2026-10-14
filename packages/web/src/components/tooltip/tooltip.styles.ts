import { css } from 'lit';

export const tooltipStyles = css`
  :host {
    display: inline-block;
    position: relative;
    --lt-tooltip-offset: 8px;
  }

  /* The bubble is a "manual" popover so it renders in the top layer — above an open lt-dialog/lt-sidepanel
     regardless of z-index, and never clipped by an overflow:hidden ancestor. Its position is set from JS (see
     _reposition in tooltip.ts), since a top-layer element is positioned against the viewport, not the host.
     display/overlay need allow-discrete so hidePopover() doesn't cut the exit fade short — same as lt-snackbar. */
  .tooltip {
    background: var(--lt-tooltip-bg, var(--lt-bg-inverse));
    border: 0;
    border-radius: 4px;
    color: var(--lt-tooltip-color, var(--lt-text-inverse));
    inset: auto;
    margin: 0;
    opacity: 0;
    overflow: visible;
    padding: var(--lt-spacing-1) var(--lt-spacing-2);
    pointer-events: none;
    position: fixed;
    transition:
      opacity 150ms ease,
      display 150ms allow-discrete,
      overlay 150ms allow-discrete;
    white-space: nowrap;
  }

  .tooltip:popover-open {
    opacity: 1;
  }

  /* A newly-shown popover has no earlier rendered frame to transition from — @starting-style supplies one so the
     fade-in actually animates instead of snapping straight to the open state. */
  @starting-style {
    .tooltip:popover-open {
      opacity: 0;
    }
  }

  .arrow {
    border: 5px solid transparent;
    height: 0;
    position: absolute;
    width: 0;
  }

  :host([disabled]) .tooltip,
  :host(:not([content])) .tooltip,
  :host([content='']) .tooltip {
    display: none;
  }

  /* pointer-events stays none by default so the bubble never intercepts clicks meant for whatever's underneath
     it (e.g. another control it happens to overlap). hoverable opts back in — without this, the real mouse could
     never actually hit the bubble to keep it open, no matter what tooltip.ts's pointerenter/pointerleave
     listeners do. */
  :host([hoverable]) .tooltip {
    pointer-events: auto;
  }

  /* ── Arrows ─────────────────────────────────────────────────────────────── The bubble's own position is set
     from JS; each arrow sits on the bubble edge facing the host. Centering is direction-symmetric, so
     inset-inline-start:50% + translateX(-50%) is correct in both LTR and RTL. Start/end use logical properties, so
     they flip with the page direction without a custom-property trick. ─────────────────────────── */

  /* ── Top (default) ──────────────────────────── */

  :host(:not([placement])) .arrow,
  :host([placement='top']) .arrow {
    border-top-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    inset-inline-start: 50%;
    top: 100%;
    transform: translateX(-50%);
  }

  /* ── Bottom ─────────────────────────────────── */

  :host([placement='bottom']) .arrow {
    border-bottom-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    bottom: 100%;
    inset-inline-start: 50%;
    transform: translateX(-50%);
  }

  /* ── Start ──────────────────────────────────── */

  :host([placement='start']) .arrow {
    border-inline-start-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    inset-inline-start: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  /* ── End ────────────────────────────────────── */

  :host([placement='end']) .arrow {
    border-inline-end-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    inset-inline-end: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .tooltip {
      transition: none;
    }
  }
`;
