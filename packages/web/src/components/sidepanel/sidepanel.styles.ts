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
    background: var(--lt-bg-default);
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
    flex-shrink: 0;
    margin-left: auto;
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
