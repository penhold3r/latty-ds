import { css } from 'lit';

export const dialogStyles = css`
  :host {
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  /* The native <dialog> is the modal surface now — its own showModal()/close() give the top-layer stacking,
     focus trap and inert background for free (DLG-1). Reset its UA-default border/padding/background (a native
     <dialog> renders with a visible border and white background by default) so lt-surface, not the browser's
     own chrome, controls how it looks. Width/height are viewport-relative with a spacing-4 inset on each side
     (matching the old .backdrop's padding), capped per size variant below. The max-height uses dvh (with a vh
     fallback first): on mobile, vh ignores the browser toolbars, so a vh-capped dialog overflows the visible
     viewport — e.g. an iPhone in landscape. */
  dialog {
    background: transparent;
    border: none;
    max-height: calc(100vh - var(--lt-spacing-8));
    max-height: calc(100dvh - var(--lt-spacing-8));
    overflow: visible;
    padding: 0;
    width: calc(100vw - var(--lt-spacing-8));
    /* display/overlay (top-layer membership) are the only things animated on <dialog> itself — the entrance/exit
       motion (opacity + translateY) lives on lt-surface below, unaffected by any of this. Without these,
       close() would remove the dialog (and its ::backdrop) from rendering instantly, cutting that motion off
       partway through; allow-discrete keeps it rendered for the transition's duration instead, then removes it. */
    transition:
      display var(--lt-duration-moderate) allow-discrete,
      overlay var(--lt-duration-moderate) allow-discrete;
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
    height: 100dvh;
    max-height: 100vh;
    max-height: 100dvh;
    max-width: 100vw;
    width: 100vw;
  }

  /* ::backdrop replaces the old .backdrop div — it's a real paintable box (just not a real DOM node), so its
     own background-color transition plays independently of lt-surface's. */
  dialog::backdrop {
    background: rgb(var(--lt-shadow-rgb) / 0);
    transition:
      background-color var(--lt-duration-moderate) var(--lt-ease-standard),
      display var(--lt-duration-moderate) allow-discrete,
      overlay var(--lt-duration-moderate) allow-discrete;
  }

  dialog[open]::backdrop {
    background: rgb(var(--lt-shadow-rgb) / var(--lt-dialog-overlay-opacity, 0.5));
  }

  /* lt-surface — sized by its content, capped like the <dialog> so a long .body scrolls (flex: 1; overflow-y:
     auto) with the footer still visible; also the entrance/exit animation. Not height: 100% — the <dialog> is
     height: fit-content, and while Chromium resolves that percentage as auto, WebKit resolves it against the
     <dialog>'s own height and collapses the whole surface to 0px. */
  lt-surface {
    display: flex;
    flex-direction: column;
    height: auto;
    max-height: calc(100vh - var(--lt-spacing-8));
    max-height: calc(100dvh - var(--lt-spacing-8));
    opacity: 0;
    transform: translateY(16px);
    transition:
      opacity var(--lt-duration-moderate) var(--lt-ease-standard),
      transform var(--lt-duration-moderate) var(--lt-ease-emphasized);
    width: 100%;
  }

  /* fullscreen: the <dialog> has a definite height there, so the surface fills it. */
  :host([size='fullscreen']) lt-surface {
    height: 100%;
    max-height: none;
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
