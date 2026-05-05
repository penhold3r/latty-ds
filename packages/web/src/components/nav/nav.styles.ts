import { css } from 'lit';

export const navStyles = css`
  :host {
    display: block;
  }

  nav {
    display: flex;
    flex-direction: column;
    gap: 0;
    list-style: none;
    margin: 0;
    padding: 0;
  }

  :host([orientation='horizontal']) nav {
    flex-direction: row;
    align-items: center;
    flex-wrap: wrap;
  }
`;

export const navItemStyles = css`
  :host {
    display: contents;
  }

  .item-root {
    position: relative;
    display: flex;
    flex-direction: column;
  }

  /* Trigger row: link + optional chevron */
  .item-trigger {
    display: flex;
    align-items: center;
    gap: var(--lt-spacing-2);
    width: 100%;
    padding: var(--lt-spacing-2) var(--lt-spacing-3);
    border-radius: 6px;
    border: none;
    background: none;
    cursor: pointer;
    color: inherit;
    font-size: var(--lt-nav-item-font-size, 0.9375rem);
    font-family: inherit;
    text-decoration: none;
    text-align: left;
    transition: background 120ms;
    white-space: nowrap;
  }

  .item-trigger:hover {
    background: color-mix(in srgb, currentColor 10%, transparent);
  }

  .item-trigger:active {
    background: color-mix(in srgb, currentColor 18%, transparent);
  }

  :host([active]) .item-trigger {
    background: var(--lt-nav-item-active-bg, color-mix(in srgb, currentColor 15%, transparent));
    color: var(--lt-nav-item-active-color, inherit);
    font-weight: 600;
  }

  :host([disabled]) .item-trigger {
    opacity: 0.4;
    pointer-events: none;
  }

  .label {
    flex: 1;
  }

  .icon-start {
    flex-shrink: 0;
    color: inherit;
  }

  /* Chevron rotates when open */
  .chevron {
    flex-shrink: 0;
    color: inherit;
    opacity: 0.6;
    transition: transform 180ms ease;
  }

  :host([open]) .chevron {
    transform: rotate(180deg);
  }

  /* Collapsible children */
  .children {
    overflow: hidden;
    height: 0;
    transition: height 200ms ease;
  }

  :host([open]) .children {
    /* height is set imperatively */
  }

  .children-inner {
    padding-left: var(--lt-spacing-4);
    padding-top: var(--lt-spacing-1);
    padding-bottom: var(--lt-spacing-1);
    display: flex;
    flex-direction: column;
  }

  /* In horizontal nav, top-level items lay out row-style */
  :host([orientation='horizontal']) .item-root {
    flex-direction: row;
    align-items: center;
  }

  /* Horizontal children drop down as a popover-style panel */
  :host([orientation='horizontal']) .children {
    position: absolute;
    top: 100%;
    left: 0;
    min-width: 160px;
    background: var(--lt-color-neutral-0, #fff);
    color: var(--lt-color-neutral-700);
    border: 1px solid var(--lt-color-neutral-200);
    border-radius: 8px;
    box-shadow:
      0 4px 6px -1px rgb(0 0 0 / 0.08),
      0 2px 4px -2px rgb(0 0 0 / 0.05);
    z-index: 100;
    height: auto !important;
    display: none;
  }

  :host([orientation='horizontal'][open]) .children {
    display: block;
  }

  :host([orientation='horizontal']) .children-inner {
    padding: var(--lt-spacing-2);
  }
`;
