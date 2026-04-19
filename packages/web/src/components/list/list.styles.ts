import { css } from 'lit';

/**
 * Styles for the lt-list component.
 *
 * Includes:
 * - Base list styling with design tokens
 * - Size variants (sm, md, lg)
 * - Custom marker color support via CSS custom property
 * - Proper spacing between list items
 */
export const listStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
    --list-marker-color: var(--lt-color-neutral-500);
  }

  ul,
  ol {
    margin: 0;
    padding: 0;
    list-style-position: outside;
    color: var(--lt-color-neutral-900);
  }

  ul {
    padding-left: var(--lt-spacing-5);
  }

  ol {
    padding-left: var(--lt-spacing-5);
  }

  /* Support both plain <li> and <lt-list-item> for backward compatibility */
  ::slotted(li),
  ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-2);
  }

  ::slotted(li:last-child),
  ::slotted(lt-list-item:last-child) {
    margin-bottom: 0;
  }

  /* Support for nested lt-list components */
  ::slotted(lt-list) {
    display: block;
    margin-top: var(--lt-spacing-2);
    margin-bottom: var(--lt-spacing-2);
    padding-left: var(--lt-spacing-5);
    font-size: 0.9em;
  }

  ::slotted(lt-list:first-child) {
    margin-top: var(--lt-spacing-2);
  }

  ::slotted(lt-list:last-child) {
    margin-bottom: 0;
  }

  /* Marker color using CSS custom property */
  ul ::slotted(li)::marker {
    color: var(--list-marker-color);
  }

  ol ::slotted(li)::marker {
    color: var(--list-marker-color);
  }

  /* Size variants */
  :host([size='sm']) ul,
  :host([size='sm']) ol {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :host([size='sm']) ::slotted(li),
  :host([size='sm']) ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-1);
  }

  :host([size='md']) ul,
  :host([size='md']) ol {
    font-size: 1rem;
    line-height: 1.6;
  }

  :host([size='md']) ::slotted(li),
  :host([size='md']) ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-2);
  }

  :host([size='lg']) ul,
  :host([size='lg']) ol {
    font-size: 1.125rem;
    line-height: 1.7;
  }

  :host([size='lg']) ::slotted(li),
  :host([size='lg']) ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-3);
  }
`;
