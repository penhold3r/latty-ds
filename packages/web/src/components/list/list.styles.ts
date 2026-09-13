import { css } from 'lit';

export const listStyles = css`
  :host {
    display: block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    --list-marker-color: var(--lt-color-neutral-500);
  }

  [part='list'] {
    margin: 0;
    padding: 0 0 0 var(--lt-spacing-5);
    list-style-position: outside;
    list-style-type: disc;
    color: var(--lt-text-default);
  }

  :host([type='ordered']) [part='list'] {
    list-style-type: decimal;
  }

  ::slotted(li),
  ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-2);
  }

  ::slotted(li:last-child),
  ::slotted(lt-list-item:last-child) {
    margin-bottom: 0;
  }

  ::slotted(lt-list) {
    display: block;
    margin-top: var(--lt-spacing-2);
    margin-bottom: var(--lt-spacing-2);
    padding-left: var(--lt-spacing-5);
    font-size: 0.9em;
  }

  /* No marker */
  :host([no-marker]) [part='list'] {
    list-style: none;
    padding-left: 0;
  }

  /* Divider */
  :host([divider]) ::slotted(lt-list-item) {
    border-bottom: 1px solid var(--lt-border-default);
    padding-bottom: var(--lt-spacing-2);
  }

  :host([divider]) ::slotted(lt-list-item:last-child) {
    border-bottom: none;
    padding-bottom: 0;
  }

  ::slotted(lt-list:first-child) {
    margin-top: var(--lt-spacing-2);
  }

  ::slotted(lt-list:last-child) {
    margin-bottom: 0;
  }

  [part='list'] ::slotted(li)::marker {
    color: var(--list-marker-color);
  }

  /* Size variants */
  :host([size='sm']) [part='list'] {
    font-size: 0.875rem;
    line-height: 1.5;
  }

  :host([size='sm']) ::slotted(li),
  :host([size='sm']) ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-1);
  }

  :host([size='md']) [part='list'] {
    font-size: 1rem;
    line-height: 1.6;
  }

  :host([size='md']) ::slotted(li),
  :host([size='md']) ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-2);
  }

  :host([size='lg']) [part='list'] {
    font-size: 1.125rem;
    line-height: 1.7;
  }

  :host([size='lg']) ::slotted(li),
  :host([size='lg']) ::slotted(lt-list-item) {
    margin-bottom: var(--lt-spacing-3);
  }
`;
