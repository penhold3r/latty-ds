import { css } from 'lit';

/**
 * Styles for the lt-list-item component.
 *
 * The component renders a <li> element in shadow DOM with minimal styling.
 * Most styling is inherited from the parent lt-list component.
 */
export const listItemStyles = css`
  :host {
    display: list-item;
    margin: 0;
    padding: 0;
  }
`;
