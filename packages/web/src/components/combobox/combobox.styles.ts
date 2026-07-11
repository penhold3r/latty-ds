import { css } from 'lit';
import { floatingPanelReset } from '../shared/floating';

export const comboboxStyles = [
  floatingPanelReset,
  css`
    :host {
      display: block;
      font-family: var(--lt-typography-fontFamily, 'Hanken Grotesk', sans-serif);
      position: relative;
    }

    .wrapper {
      display: flex;
      flex-direction: column;
      gap: var(--lt-spacing-1);
    }

    label {
      color: var(--lt-text-default);
    }

    .required-indicator {
      color: var(--lt-color-error-500);
      margin-left: 2px;
    }

    .input-wrap {
      align-items: center;
      background: var(--lt-bg-surface);
      border-radius: var(--lt-border-radius);
      border: var(--lt-border-width, 1px) solid var(--lt-border-default);
      cursor: text;
      display: flex;
      gap: var(--lt-spacing-2);
      overflow: hidden;
      position: relative;
      transition:
        border-color 150ms ease,
        box-shadow 150ms ease;
    }

    :host([open]) .input-wrap,
    .input-wrap:focus-within {
      border-color: var(--lt-border-primary);
      box-shadow: 0 0 0 3px var(--lt-bg-primary-subtle);
    }

    :host([variant='error']) .input-wrap {
      border-color: var(--lt-color-error-500);
    }
    :host([variant='error'][open]) .input-wrap,
    :host([variant='error']) .input-wrap:focus-within {
      box-shadow: 0 0 0 3px var(--lt-bg-error-subtle);
    }
    :host([variant='success']) .input-wrap {
      border-color: var(--lt-color-success-500);
    }
    :host([variant='warning']) .input-wrap {
      border-color: var(--lt-color-warning-500);
    }

    :host([disabled]) .input-wrap {
      background: var(--lt-bg-neutral-subtle);
      cursor: not-allowed;
      pointer-events: none;
    }

    input {
      background: transparent;
      border: none;
      color: var(--lt-text-default);
      flex: 1;
      font-family: inherit;
      min-width: 0;
      outline: none;
    }

    input::placeholder {
      color: var(--lt-text-placeholder, var(--lt-color-neutral-400));
    }

    :host([disabled]) input {
      color: var(--lt-text-subtle);
      cursor: not-allowed;
    }

    /* Sizes */
    :host([size='sm']) .input-wrap {
      height: 32px;
      padding: 0 var(--lt-spacing-2);
    }
    :host([size='sm']) input {
      font-size: 0.8125rem;
    }
    :host([size='md']) .input-wrap,
    :host(:not([size])) .input-wrap {
      height: 40px;
      padding: 0 var(--lt-spacing-3);
    }
    :host([size='md']) input,
    :host(:not([size])) input {
      font-size: 0.9375rem;
    }
    :host([size='lg']) .input-wrap {
      height: 48px;
      padding: 0 var(--lt-spacing-4);
    }
    :host([size='lg']) input {
      font-size: 1rem;
    }

    .chevron {
      color: var(--lt-text-subtle);
      flex-shrink: 0;
      pointer-events: none;
      transition: transform 150ms ease;
    }

    :host([open]) .chevron {
      transform: rotate(180deg);
    }

    .dropdown {
      background: var(--lt-bg-surface);
      border-radius: var(--lt-border-radius);
      border: var(--lt-border-width, 1px) solid var(--lt-border-default);
      box-shadow: var(--lt-shadow-md);
      max-height: 240px;
      overflow-y: auto;
      z-index: 100;
    }

    .option {
      align-items: center;
      background: transparent;
      border: none;
      color: var(--lt-text-default);
      cursor: pointer;
      display: flex;
      font-family: inherit;
      font-size: 0.9375rem;
      padding: var(--lt-spacing-2) var(--lt-spacing-3);
      text-align: left;
      width: 100%;
    }

    .option:hover {
      background: var(--lt-bg-neutral-subtle);
    }
    .option[aria-selected='true'] {
      background: var(--lt-bg-primary-subtle);
      color: var(--lt-color-primary-700);
      font-weight: 500;
    }
    .option[disabled] {
      color: var(--lt-text-subtle);
      cursor: not-allowed;
      pointer-events: none;
    }

    .no-results {
      color: var(--lt-text-subtle);
      font-size: 0.875rem;
      padding: var(--lt-spacing-3);
      text-align: center;
    }

    .helper-text {
      color: var(--lt-text-subtle);
      font-size: 0.8125rem;
    }

    :host([variant='error']) .helper-text {
      color: var(--lt-color-error-600);
    }
    :host([variant='success']) .helper-text {
      color: var(--lt-color-success-600);
    }
    :host([variant='warning']) .helper-text {
      color: var(--lt-color-warning-700);
    }
  `
];
