import { css } from 'lit';

export const dialogStyles = css`
  :host {
    font-family: 'Asap', sans-serif;
  }

  /* Backdrop */
  .backdrop {
    align-items: center;
    background: rgba(0, 0, 0, 0.5);
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

  /* Dialog container */
  .dialog {
    background: var(--lt-bg-subtle);
    border-radius: var(--lt-border-radius);
    box-shadow:
      0 20px 25px -5px rgba(0, 0, 0, 0.1),
      0 10px 10px -5px rgba(0, 0, 0, 0.04);
    display: flex;
    flex-direction: column;
    max-height: calc(100vh - var(--lt-spacing-8));
    opacity: 0;
    position: relative;
    transform: scale(0.95);
    transition:
      opacity 200ms ease,
      transform 200ms ease;
    width: 100%;
  }

  :host([open]) .dialog {
    opacity: 1;
    transform: scale(1);
  }

  /* Size variants */
  :host([size='sm']) .dialog { max-width: 400px; }
  :host([size='md']) .dialog { max-width: 600px; }
  :host([size='lg']) .dialog { max-width: 800px; }
  :host([size='xl']) .dialog { max-width: 1000px; }

  :host([size='fullscreen']) .backdrop {
    padding: 0;
  }

  :host([size='fullscreen']) .dialog {
    border-radius: 0;
    height: 100vh;
    max-height: 100vh;
    max-width: 100vw;
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
    font-size: 1.25rem;
    font-weight: 600;
    line-height: 1.4;
    margin: 0;
  }

  .close-button {
    align-items: center;
    background: transparent;
    border-radius: var(--lt-border-radius);
    border: none;
    color: var(--lt-color-neutral-500);
    cursor: pointer;
    display: flex;
    height: 32px;
    justify-content: center;
    padding: 0;
    transition: all 120ms ease;
    width: 32px;
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

  :host(:not([open])) .backdrop {
    pointer-events: none;
  }
`;
