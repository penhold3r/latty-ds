import { css } from 'lit';

export const sidepanelStyles = css`
  :host {
    display: contents;
  }

  /* ── Overlay ────────────────────────────────────────────────────────────── */

  [part='overlay'] {
    position: fixed;
    inset: 0;
    background: rgba(0, 0, 0, var(--_overlay-opacity, 0.45));
    z-index: 400;
    opacity: 0;
    pointer-events: none;
    transition: opacity 200ms ease;
  }

  /* ── Panel ──────────────────────────────────────────────────────────────── */

  [part='panel'] {
    position: fixed;
    background: #fff;
    display: flex;
    flex-direction: column;
    z-index: 401;
    pointer-events: none;
    transition: transform 250ms cubic-bezier(0.4, 0, 0.2, 1);
  }

  /* ── Anchors — initial off-screen positions ─────────────────────────────── */

  :host([anchor='left']) [part='panel'],
  :host(:not([anchor])) [part='panel'] {
    inset-block: 0;
    left: 0;
    transform: translateX(-100%);
    box-shadow: 4px 0 24px rgba(0, 0, 0, 0.12);
  }

  :host([anchor='right']) [part='panel'] {
    inset-block: 0;
    right: 0;
    transform: translateX(100%);
    box-shadow: -4px 0 24px rgba(0, 0, 0, 0.12);
  }

  :host([anchor='top']) [part='panel'] {
    inset-inline: 0;
    top: 0;
    transform: translateY(-100%);
    box-shadow: 0 4px 24px rgba(0, 0, 0, 0.12);
  }

  :host([anchor='bottom']) [part='panel'] {
    inset-inline: 0;
    bottom: 0;
    transform: translateY(100%);
    box-shadow: 0 -4px 24px rgba(0, 0, 0, 0.12);
  }

  /* ── Open state — must come after anchors to win the cascade ────────────── */

  :host([open]) [part='overlay'] {
    opacity: 1;
    pointer-events: auto;
  }

  :host([open]) [part='panel'] {
    transform: translate(0, 0);
    pointer-events: auto;
  }

  /* ── Header ─────────────────────────────────────────────────────────────── */

  .header {
    display: flex;
    align-items: center;
    gap: var(--lt-spacing-4);
    padding: var(--lt-spacing-4) var(--lt-spacing-5);
    border-bottom: 1px solid var(--lt-border-default);
    flex-shrink: 0;
  }

  .panel-label {
    flex: 1;
    color: var(--lt-text-default);
  }

  .close-button {
    display: flex;
    align-items: center;
    justify-content: center;
    width: 32px;
    height: 32px;
    padding: 0;
    margin-left: auto;
    background: transparent;
    border: none;
    border-radius: var(--lt-border-radius);
    color: var(--lt-color-neutral-500);
    cursor: pointer;
    transition: background 120ms ease, color 120ms ease;
    flex-shrink: 0;
  }

  .close-button:hover {
    background: var(--lt-bg-surface);
    color: var(--lt-color-neutral-700);
  }

  .close-button:active {
    background: var(--lt-bg-overlay);
  }

  .close-button:focus-visible {
    outline: 2px solid var(--lt-interactive-primary-bg);
    outline-offset: 2px;
  }

  /* ── Body ───────────────────────────────────────────────────────────────── */

  .body {
    flex: 1;
    overflow-y: auto;
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    [part='overlay'],
    [part='panel'] {
      transition: none;
    }
  }
`;
