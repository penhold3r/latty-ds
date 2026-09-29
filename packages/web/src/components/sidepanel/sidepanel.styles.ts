import { css } from 'lit';

export const sidepanelStyles = css`
  :host {
    display: contents;
  }

  /* ── Panel — the native <dialog> itself now provides the overlay too, via ::backdrop; a closed dialog is
     display:none automatically, so unlike the old transform-only-hidden div, a closed panel is genuinely
     non-interactive and out of the accessibility tree, with no extra JS needed (SPL-1). ────────────────────── */

  dialog {
    background: var(--lt-bg-default);
    border: none;
    color: var(--lt-text-default);
    display: flex;
    flex-direction: column;
    margin: 0;
    max-height: none;
    max-width: none;
    padding: 0;
    position: fixed;
    /* display/overlay need transition-behavior: allow-discrete so close() doesn't remove the panel (and its
       ::backdrop) from rendering instantly, cutting the slide-out transform transition off partway through —
       same reasoning as lt-dialog. */
    transition:
      transform 250ms cubic-bezier(0.4, 0, 0.2, 1),
      display 250ms allow-discrete,
      overlay 250ms allow-discrete;
  }

  dialog::backdrop {
    background: rgba(0, 0, 0, 0);
    transition:
      background-color 200ms ease,
      display 250ms allow-discrete,
      overlay 250ms allow-discrete;
  }

  dialog[open]::backdrop {
    background: rgba(0, 0, 0, var(--lt-sidepanel-overlay-opacity, 0.45));
  }

  /* ── Anchors — off-screen positions; dialog[open] (below) is the only thing that moves it on-screen ──────── */

  :host([anchor='left']) dialog,
  :host(:not([anchor])) dialog {
    inset-block: 0;
    left: 0;
    transform: translateX(-100%);
    box-shadow: var(--lt-sidepanel-shadow, 4px 0 24px rgba(0, 0, 0, 0.12));
  }

  :host([anchor='right']) dialog {
    inset-block: 0;
    right: 0;
    transform: translateX(100%);
    box-shadow: var(--lt-sidepanel-shadow, -4px 0 24px rgba(0, 0, 0, 0.12));
  }

  :host([anchor='top']) dialog {
    inset-inline: 0;
    top: 0;
    transform: translateY(-100%);
    box-shadow: var(--lt-sidepanel-shadow, 0 4px 24px rgba(0, 0, 0, 0.12));
  }

  :host([anchor='bottom']) dialog {
    inset-inline: 0;
    bottom: 0;
    transform: translateY(100%);
    box-shadow: var(--lt-sidepanel-shadow, 0 -4px 24px rgba(0, 0, 0, 0.12));
  }

  dialog[open] {
    transform: translate(0, 0);
  }

  /* A newly-shown dialog has no earlier rendered frame to transition from — @starting-style supplies one,
     per anchor, so the slide-in actually animates instead of snapping straight to the open position. */
  @starting-style {
    :host([anchor='left']) dialog[open],
    :host(:not([anchor])) dialog[open] {
      transform: translateX(-100%);
    }
    :host([anchor='right']) dialog[open] {
      transform: translateX(100%);
    }
    :host([anchor='top']) dialog[open] {
      transform: translateY(-100%);
    }
    :host([anchor='bottom']) dialog[open] {
      transform: translateY(100%);
    }
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
    padding: var(--lt-spacing-5);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog::backdrop {
      transition: none;
    }
  }
`;
