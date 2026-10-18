import { css } from 'lit';

export const dialogStyles = css`
  :host {
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  /* The native <dialog> is the modal surface now — its own showModal()/close() give the top-layer stacking,
     focus trap and inert background for free (DLG-1). Reset its UA-default border/padding/background (a native
     <dialog> renders with a visible border and white background by default) so lt-surface, not the browser's
     own chrome, controls how it looks. Width/height are viewport-relative with a spacing-4 inset on each side
     (matching the old .backdrop's padding), capped per size variant below. */
  dialog {
    background: transparent;
    border: none;
    max-height: calc(100vh - var(--lt-spacing-8));
    overflow: visible;
    padding: 0;
    width: calc(100vw - var(--lt-spacing-8));
    /* display/overlay (top-layer membership) are the only things animated on <dialog> itself — the entrance/exit
       motion (opacity + translateY) lives on lt-surface below, unaffected by any of this. Without these,
       close() would remove the dialog (and its ::backdrop) from rendering instantly, cutting that motion off
       partway through; allow-discrete keeps it rendered for the transition's duration instead, then removes it. */
    transition:
      display 220ms allow-discrete,
      overlay 220ms allow-discrete;
  }

  :host([size='sm']) dialog {
    max-width: 400px;
  }
  :host([size='md']) dialog {
    max-width: 600px;
  }
  :host([size='lg']) dialog {
    max-width: 800px;
  }
  :host([size='xl']) dialog {
    max-width: 1000px;
  }
  :host([size='fullscreen']) dialog {
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
    width: 100vw;
  }

  /* ::backdrop replaces the old .backdrop div — it's a real paintable box (just not a real DOM node), so its
     own background-color transition plays independently of lt-surface's. */
  dialog::backdrop {
    background: rgb(var(--lt-shadow-rgb) / 0);
    transition:
      background-color 200ms ease,
      display 220ms allow-discrete,
      overlay 220ms allow-discrete;
  }

  dialog[open]::backdrop {
    background: rgb(var(--lt-shadow-rgb) / var(--lt-dialog-overlay-opacity, 0.5));
  }

  /* lt-surface — fills the <dialog>, sized by it (max-width/height above); the entrance/exit animation */
  lt-surface {
    display: flex;
    flex-direction: column;
    height: 100%;
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity 220ms ease,
      transform 220ms cubic-bezier(0.34, 1.2, 0.64, 1);
    width: 100%;
  }

  dialog[open] lt-surface {
    opacity: 1;
    transform: translateY(0);
  }

  lt-surface::part(surface) {
    display: flex;
    flex: 1;
    flex-direction: column;
    min-height: 0;
  }

  /* Header */
  .header {
    align-items: center;
    border-bottom: 1px solid var(--lt-border-default);
    display: flex;
    gap: var(--lt-spacing-4);
    padding: var(--lt-spacing-5);
    position: relative;
  }

  .header-content {
    flex: 1;
  }

  .title {
    color: var(--lt-text-default);
  }

  .close-button {
    flex-shrink: 0;
  }

  /* Body */
  .body {
    color: var(--lt-text-neutral);
    flex: 1;
    overflow-y: auto;
    padding: var(--lt-spacing-5);
  }

  /* Footer */
  .footer {
    border-top: 1px solid var(--lt-border-default);
    display: flex;
    gap: var(--lt-spacing-3);
    justify-content: flex-end;
    padding: var(--lt-spacing-5);
  }

  :host([uppercase]) .title::part(base) {
    font-variant-caps: small-caps;
    letter-spacing: 0.05rem;
    text-transform: lowercase;
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog::backdrop,
    lt-surface {
      transition: none;
    }
  }
`;
