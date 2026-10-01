import { css } from 'lit';

export const tooltipStyles = css`
  :host {
    display: inline-block;
    position: relative;
    --lt-tooltip-offset: 8px;
  }

  .tooltip {
    background: var(--lt-tooltip-bg, var(--lt-bg-inverse));
    border-radius: 4px;
    color: var(--lt-tooltip-color, var(--lt-text-inverse));
    opacity: 0;
    padding: var(--lt-spacing-1) var(--lt-spacing-2);
    pointer-events: none;
    position: absolute;
    transition:
      opacity 150ms ease,
      visibility 150ms ease;
    visibility: hidden;
    white-space: nowrap;
    z-index: 1000;
  }

  .arrow {
    border: 5px solid transparent;
    height: 0;
    position: absolute;
    width: 0;
  }

  :host(:hover) .tooltip,
  :host(:focus-within) .tooltip {
    opacity: 1;
    visibility: visible;
  }

  :host([disabled]) .tooltip,
  :host(:not([content])) .tooltip,
  :host([content='']) .tooltip {
    display: none;
  }

  /* ── Top (default) ──────────────────────────── */
  /* left: 50%; transform: translateX(-50%) centers the tooltip over the host — this is direction-symmetric
     (centering isn't direction-dependent) so inset-inline-start:50% + a literal translateX(-50%) is correct in
     both LTR and RTL without any custom-property trick, unlike the start/end placements below. */

  :host(:not([placement])) .tooltip,
  :host([placement='top']) .tooltip {
    bottom: calc(100% + var(--lt-tooltip-offset));
    inset-inline-start: 50%;
    transform: translateX(-50%);
  }

  :host(:not([placement])) .arrow,
  :host([placement='top']) .arrow {
    border-top-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    inset-inline-start: 50%;
    top: 100%;
    transform: translateX(-50%);
  }

  /* ── Bottom ─────────────────────────────────── */

  :host([placement='bottom']) .tooltip {
    inset-inline-start: 50%;
    top: calc(100% + var(--lt-tooltip-offset));
    transform: translateX(-50%);
  }

  :host([placement='bottom']) .arrow {
    border-bottom-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    bottom: 100%;
    inset-inline-start: 50%;
    transform: translateX(-50%);
  }

  /* ── Start ──────────────────────────────────── */
  /* Unlike the transform/box-shadow cases in lt-sidepanel, every property the start/end placements need
     (inset-inline-*, border-inline-*-color) has a real logical-property equivalent — no :dir(rtl) custom
     property trick needed here at all. */

  :host([placement='start']) .tooltip {
    inset-inline-end: calc(100% + var(--lt-tooltip-offset));
    top: 50%;
    transform: translateY(-50%);
  }

  :host([placement='start']) .arrow {
    border-inline-start-color: var(--lt-tooltip-bg, var(--lt-color-neutral-900));
    inset-inline-start: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  /* ── End ────────────────────────────────────── */

  :host([placement='end']) .tooltip {
    inset-inline-start: calc(100% + var(--lt-tooltip-offset));
    top: 50%;
    transform: translateY(-50%);
  }

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
