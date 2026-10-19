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
    padding: var(--lt-nav-item-padding, var(--lt-spacing-2) var(--lt-spacing-3));
    border-radius: 6px;
    border: none;
    background: none;
    cursor: pointer;
    color: inherit;
    font-size: var(--lt-nav-item-font-size, 0.9375rem);
    font-family: inherit;
    text-decoration: none;
    text-align: start;
    transition: background var(--lt-duration-fast);
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
    transition: transform var(--lt-duration-fast) ease;
  }

  :host([open]) .chevron {
    transform: rotate(180deg);
  }

  /* Collapsible children */
  .children {
    overflow: hidden;
    height: 0;
    transition: height var(--lt-duration-moderate) ease;
  }

  .children-inner {
    padding-inline-start: var(--lt-spacing-4);
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
    inset-inline-start: 0;
    min-width: 160px;
    background: var(--lt-bg-default);
    color: var(--lt-text-neutral);
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
    border-radius: 8px;
    box-shadow: var(--lt-elevation-2);
    z-index: var(--lt-z-overlay);
    height: auto !important;
    display: none;
  }

  :host([orientation='horizontal'][open]) .children {
    display: block;
  }

  :host([orientation='horizontal']) .children-inner {
    padding: var(--lt-spacing-2);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .item-trigger,
    .chevron {
      transition: none;
    }

    /* .children's height transition can't just be removed — nav-item.ts's _handleTransitionEnd() only finalizes
       the open height to 'auto' (letting it respond to later content changes) once the CSS transition actually
       completes; transition:none fires no transitionend at all, leaving it stuck at a fixed pixel height
       forever. A 1ms duration is imperceptible (satisfies the reduced-motion intent) but still fires the event
       the component depends on — same reasoning as lt-accordion's .content. */
    .children {
      transition: height 1ms;
    }
  }
`;
