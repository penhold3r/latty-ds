import { css } from 'lit';

export const colorInputStyles = css`
  :host {
    display: inline-block;
    font-family: 'Hanken Grotesk', sans-serif;
    width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-1);
    width: 100%;
    cursor: pointer;
  }

  :host([disabled]) .wrapper {
    cursor: not-allowed;
  }

  .label {
    color: var(--lt-text-subtle);
  }

  .input-container {
    position: relative;
    display: flex;
    align-items: center;
    background: var(--lt-bg-subtle);
    border: 1px solid var(--lt-border-default);
    border-radius: var(--lt-border-radius);
    box-sizing: border-box;
    transition:
      border-color 120ms ease,
      box-shadow 120ms ease;
    width: 100%;
    overflow: hidden;
  }

  .input-container:hover:not(:has(.native-picker:disabled)) {
    border-color: var(--lt-border-strong);
  }

  .input-container:focus-within {
    border-color: var(--lt-interactive-primary-bg);
    box-shadow: 0 0 0 3px var(--lt-bg-primary-subtle);
    outline: none;
  }

  :host([disabled]) .input-container {
    background: var(--lt-bg-surface);
  }

  .color-swatch {
    flex-shrink: 0;
    border-radius: 50%;
    border: 1.5px solid rgb(0 0 0 / 0.15);
    box-sizing: border-box;
  }

  .color-swatch.empty {
    border-style: dashed;
    border-color: var(--lt-border-default);
    background: repeating-conic-gradient(var(--lt-bg-muted) 0% 25%, transparent 0% 50%) 0 0 / 8px 8px;
  }

  .display-value {
    flex: 1;
    color: var(--lt-text-default);
    font-family: inherit;
    font-weight: 400;
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
  }

  .display-value.is-placeholder {
    color: var(--lt-text-muted);
  }

  :host([disabled]) .display-value {
    color: var(--lt-text-muted);
  }

  .icon-end {
    flex-shrink: 0;
    color: var(--lt-text-muted);
    pointer-events: none;
  }

  /* The native picker is invisible but covers the entire container to handle all click/keyboard events */
  .native-picker {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
    cursor: pointer;
    border: none;
    padding: 0;
  }

  .native-picker:disabled {
    cursor: not-allowed;
  }

  /* ── sizes ───────────────────────────────────────────────────────────────── */

  :host([size='sm']) .input-container {
    height: 32px;
    padding-inline: var(--lt-spacing-3);
    gap: var(--lt-spacing-2);
    font-size: 0.875rem;
  }

  :host([size='sm']) .color-swatch {
    width: 14px;
    height: 14px;
  }

  :host([size='md']) .input-container {
    height: 40px;
    padding-inline: var(--lt-spacing-4);
    gap: var(--lt-spacing-2);
    font-size: 1rem;
  }

  :host([size='md']) .color-swatch {
    width: 16px;
    height: 16px;
  }

  :host([size='lg']) .input-container {
    height: 48px;
    padding-inline: var(--lt-spacing-5);
    gap: var(--lt-spacing-3);
    font-size: 1.0625rem;
  }

  :host([size='lg']) .color-swatch {
    width: 20px;
    height: 20px;
  }

  :host([size='lg']) .icon-end {
    width: 24px;
    height: 24px;
  }
`;
