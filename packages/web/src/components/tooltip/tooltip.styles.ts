import { css } from 'lit';

export const tooltipStyles = css`
  :host {
    display: inline-block;
    position: relative;
    --_offset: 8px;
  }

  .tooltip {
    background: var(--_tooltip-bg, var(--lt-bg-inverse));
    border-radius: 4px;
    color: var(--_tooltip-color, var(--lt-text-inverse));
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

  :host(:not([placement])) .tooltip,
  :host([placement='top']) .tooltip {
    bottom: calc(100% + var(--_offset));
    left: 50%;
    transform: translateX(-50%);
  }

  :host(:not([placement])) .arrow,
  :host([placement='top']) .arrow {
    border-top-color: var(--_tooltip-bg, var(--lt-color-neutral-900));
    left: 50%;
    top: 100%;
    transform: translateX(-50%);
  }

  /* ── Bottom ─────────────────────────────────── */

  :host([placement='bottom']) .tooltip {
    left: 50%;
    top: calc(100% + var(--_offset));
    transform: translateX(-50%);
  }

  :host([placement='bottom']) .arrow {
    border-bottom-color: var(--_tooltip-bg, var(--lt-color-neutral-900));
    bottom: 100%;
    left: 50%;
    transform: translateX(-50%);
  }

  /* ── Left ───────────────────────────────────── */

  :host([placement='left']) .tooltip {
    right: calc(100% + var(--_offset));
    top: 50%;
    transform: translateY(-50%);
  }

  :host([placement='left']) .arrow {
    border-left-color: var(--_tooltip-bg, var(--lt-color-neutral-900));
    left: 100%;
    top: 50%;
    transform: translateY(-50%);
  }

  /* ── Right ──────────────────────────────────── */

  :host([placement='right']) .tooltip {
    left: calc(100% + var(--_offset));
    top: 50%;
    transform: translateY(-50%);
  }

  :host([placement='right']) .arrow {
    border-right-color: var(--_tooltip-bg, var(--lt-color-neutral-900));
    right: 100%;
    top: 50%;
    transform: translateY(-50%);
  }
`;
