import { css } from 'lit';

export const dialogStyles = css`
  :host {
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  /* Backdrop */
  .backdrop {
    align-items: center;
    background: rgba(0, 0, 0, var(--lt-dialog-overlay-opacity, 0.5));
    display: flex;
    height: 100vh;
    justify-content: center;
    left: 0;
    opacity: 0;
    padding: var(--lt-spacing-4);
    position: fixed;
    top: 0;
    transition: opacity 200ms ease;
    width: 100vw;
    z-index: 1000;
  }

  :host([open]) .backdrop {
    opacity: 1;
  }

  :host(:not([open])) .backdrop {
    pointer-events: none;
  }

  /* lt-surface host — flex item inside .backdrop, sized per size variant */
  lt-surface {
    width: 100%;
  }

  :host([size='sm']) lt-surface {
    max-width: 400px;
  }
  :host([size='md']) lt-surface {
    max-width: 600px;
  }
  :host([size='lg']) lt-surface {
    max-width: 800px;
  }
  :host([size='xl']) lt-surface {
    max-width: 1000px;
  }

  :host([size='fullscreen']) .backdrop {
    padding: 0;
  }

  :host([size='fullscreen']) lt-surface {
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
  }

  /* lt-surface inner div — layout and animation */
  lt-surface::part(surface) {
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - var(--lt-spacing-8));
    opacity: 0;
    position: relative;
    transform: translateY(16px);
    transition:
      opacity 220ms ease,
      transform 220ms cubic-bezier(0.34, 1.2, 0.64, 1);
  }

  :host([open]) lt-surface::part(surface) {
    opacity: 1;
    transform: translateY(0);
  }

  :host([size='fullscreen']) lt-surface::part(surface) {
    border-radius: 0;
    max-height: 100vh;
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
    color: var(--lt-color-neutral-700);
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
`;
