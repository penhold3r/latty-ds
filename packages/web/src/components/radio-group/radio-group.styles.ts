import { css } from 'lit';

/**
 * Styles for the lt-radio-group component.
 *
 * Includes:
 * - Base group layout
 * - Vertical and horizontal orientations
 * - Label styling
 * - Helper text styling
 * - Error state
 */
export const radioGroupStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
  }

  .radio-group {
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-2);
  }

  .label {
    color: var(--lt-color-neutral-900);
    font-size: 0.875rem;
    font-weight: 500;
    margin-bottom: var(--lt-spacing-1);
  }

  .required-indicator {
    color: var(--lt-color-error-500);
    margin-left: var(--lt-spacing-1);
  }

  .radios-container {
    display: flex;
    gap: var(--lt-spacing-3);
  }

  :host([orientation='vertical']) .radios-container {
    flex-direction: column;
  }

  :host([orientation='horizontal']) .radios-container {
    flex-direction: row;
    flex-wrap: wrap;
  }

  .helper-text {
    color: var(--lt-color-neutral-600);
    font-size: 0.75rem;
    margin-top: var(--lt-spacing-1);
  }

  :host([error]) .helper-text {
    color: var(--lt-color-error-700);
  }
`;
