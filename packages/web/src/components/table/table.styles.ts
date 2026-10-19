import { css } from 'lit';

export const tableStyles = css`
  :host {
    display: block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    overflow: hidden;
    width: 100%;
  }

  .table-container {
    /* The loading overlay is absolutely positioned, so it needs this as its containing block. */
    position: relative;
    overflow-x: auto;
    width: 100%;
  }

  /* tabindex="0" on .table-container (WCAG 2.1.1 — a scrollable region must be keyboard-reachable even when
     nothing else inside it is focusable, e.g. a table with no interactive cells) needs its own visible focus
     indicator, same as any other focusable element in this codebase. */
  .table-container:focus-visible {
    outline: 2px solid var(--lt-focus-ring-color);
    outline-offset: -2px;
  }

  :host([responsive-mode='scroll']) .table-container {
    -webkit-overflow-scrolling: touch;
  }

  table {
    /* Separate, not collapsed: position: sticky on th/td (used by sticky-header and sticky columns) is
       ignored by browsers on table cells when border-collapse is 'collapse'. Row/header dividers below are
       set per-cell rather than on tr/thead to compensate — the separated-borders model doesn't paint a
       border placed directly on a row or row-group. */
    border-collapse: separate;
    border-spacing: 0;
    width: 100%;
  }

  /* Border-box, not the content-box default: th/td's own density padding would otherwise compound onto every
     explicit or resized width on each read-write round-trip — getBoundingClientRect() always reports the
     border-box size, but a content-box width excludes padding, so reading the rendered width back and writing
     it as the new width (what both column resize and, less visibly, a configured column.width effectively do)
     grows the cell by its own padding every single time. */
  th,
  td {
    box-sizing: border-box;
  }

  /* Caption */
  caption {
    caption-side: top;
    color: var(--lt-text-default);
    font-weight: 600;
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
    text-align: start;
  }

  :host([caption-side='bottom']) caption {
    caption-side: bottom;
  }

  /* Header */
  thead {
    background: var(--lt-bg-surface);
  }

  th {
    border-bottom: 2px solid var(--lt-border-default);
    color: var(--lt-text-default);
    font-weight: 600;
    text-align: start;
    white-space: nowrap;
  }

  th[data-align='center'] {
    text-align: center;
  }
  th[data-align='end'] {
    text-align: end;
  }

  /* Sortable headers */
  th.sortable {
    cursor: pointer;
    padding: 0;
    user-select: none;
  }

  th.sortable:hover {
    background: var(--lt-bg-overlay);
  }

  /* The button (not the th) carries the density padding, so it — not just a slice of it — is the click target. */
  th.sortable .header-content {
    align-items: center;
    background: none;
    border: none;
    color: inherit;
    cursor: pointer;
    display: flex;
    font: inherit;
    gap: var(--lt-spacing-2);
    transition: background-color var(--lt-duration-fast) ease;
    width: 100%;
  }

  th[data-align='center'] .header-content {
    justify-content: center;
  }
  th[data-align='end'] .header-content {
    justify-content: flex-end;
  }

  .sort-icon {
    color: var(--lt-text-muted);
    display: inline-flex;
    flex-shrink: 0;
    font-size: 0.875rem;
    opacity: 0;
    transition: opacity var(--lt-duration-fast) ease;
  }

  th.sortable:hover .sort-icon,
  th.sorted .sort-icon {
    opacity: 1;
  }

  th.sorted .sort-icon {
    color: var(--lt-interactive-primary-bg);
  }

  /* Column resize */
  th.resizable {
    position: relative;
  }

  .resize-handle {
    cursor: col-resize;
    inset-block: 0;
    inset-inline-end: 0;
    position: absolute;
    touch-action: none;
    width: 8px;
  }

  .resize-handle::after {
    background: var(--lt-border-default);
    content: '';
    inset-block: var(--lt-spacing-2);
    inset-inline-start: 50%;
    position: absolute;
    transform: translateX(-50%);
    width: 2px;
  }

  .resize-handle:hover::after,
  .resize-handle:focus-visible::after {
    background: var(--lt-interactive-primary-bg);
  }

  .resize-handle:focus-visible {
    outline: 2px solid var(--lt-interactive-primary-bg);
    outline-offset: -2px;
  }

  /* Body */
  tbody tr {
    transition: background-color var(--lt-duration-fast) ease;
  }

  tbody tr td {
    border-bottom: 1px solid var(--lt-border-default);
  }

  tbody tr:last-child td {
    border-bottom: none;
  }

  :host([hoverable]) tbody tr:hover {
    background: var(--lt-bg-surface);
  }

  :host([striped]) tbody tr:nth-child(even) {
    background: var(--lt-bg-surface);
  }

  :host([striped][hoverable]) tbody tr:nth-child(even):hover {
    background: var(--lt-bg-overlay);
  }

  td {
    color: var(--lt-text-default);
  }

  td[data-align='center'] {
    text-align: center;
  }
  td[data-align='end'] {
    text-align: end;
  }

  /* Density variants */
  :host([density='compact']) th,
  :host([density='compact']) td {
    padding: var(--lt-spacing-2) var(--lt-spacing-3);
  }

  :host([density='normal']) th,
  :host([density='normal']) td {
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
  }

  :host([density='comfortable']) th,
  :host([density='comfortable']) td {
    padding: var(--lt-spacing-4) var(--lt-spacing-5);
  }

  /* A sortable th's own padding moves onto its button (below), so the whole visible cell — not just the area
     inside the th's padding — is the click target. Matches the density rules above in specificity and comes
     after them in source order, so it wins the cascade regardless of selector order elsewhere in this file. */
  :host th.sortable {
    padding: 0;
  }

  :host([density='compact']) th.sortable .header-content {
    padding: var(--lt-spacing-2) var(--lt-spacing-3);
  }

  :host([density='normal']) th.sortable .header-content {
    padding: var(--lt-spacing-3) var(--lt-spacing-4);
  }

  :host([density='comfortable']) th.sortable .header-content {
    padding: var(--lt-spacing-4) var(--lt-spacing-5);
  }

  /* Sticky header */
  :host([sticky-header]) thead th {
    background: var(--lt-bg-surface);
    position: sticky;
    top: 0;
    z-index: 3;
  }

  /* Sticky columns */
  th.sticky {
    background: var(--lt-bg-surface);
    box-shadow: 2px 0 4px rgb(var(--lt-shadow-rgb) / 0.05);
    inset-inline-start: 0;
    position: sticky;
    z-index: 2;
  }

  td.sticky {
    background: var(--lt-bg-default);
    box-shadow: 2px 0 4px rgb(var(--lt-shadow-rgb) / 0.05);
    inset-inline-start: 0;
    position: sticky;
    z-index: 1;
  }

  :host([striped]) tbody tr:nth-child(even) td.sticky {
    background: var(--lt-bg-surface);
  }

  :host([hoverable]) tbody tr:hover td.sticky {
    background: var(--lt-bg-surface);
  }

  :host([striped][hoverable]) tbody tr:nth-child(even):hover td.sticky {
    background: var(--lt-bg-overlay);
  }

  /* Border styling */
  :host([bordered]) table {
    border: var(--lt-border-width, 1px) solid var(--lt-border-default);
  }

  :host([bordered]) th,
  :host([bordered]) td {
    border-inline-end: 1px solid var(--lt-border-default);
  }

  :host([bordered]) th:last-child,
  :host([bordered]) td:last-child {
    border-inline-end: none;
  }

  /* Row selection */
  .selection-cell {
    cursor: pointer;
    vertical-align: middle;
    width: 1px;
    white-space: nowrap;
  }

  .selection-cell input {
    cursor: pointer;
    display: block;
    margin: 0;
  }

  tbody tr.selected {
    background: var(--lt-bg-overlay);
  }

  :host([striped]) tbody tr.selected:nth-child(even) {
    background: var(--lt-bg-overlay);
  }

  /* Virtualization — the two spacer rows standing in for off-screen rows carry no real content, so none of the
     interactive/decorative row styling (hover, stripe, borders, selection) should apply to them. */
  .virtual-spacer {
    pointer-events: none;
  }

  .virtual-spacer td {
    border-bottom: none;
    padding: 0;
  }

  /* Empty state */
  .empty-state {
    color: var(--lt-text-subtle);
    padding: var(--lt-spacing-8);
    text-align: center;
  }

  /* Loading state */
  .loading-overlay {
    align-items: center;
    background: color-mix(in srgb, var(--lt-bg-default) 80%, transparent);
    display: flex;
    height: 100%;
    justify-content: center;
    inset-inline-start: 0;
    position: absolute;
    top: 0;
    width: 100%;
    z-index: 10;
  }

  /* Stack mode for mobile */
  @media (max-width: 768px) {
    :host([responsive-mode='stack']) .table-container {
      overflow-x: visible;
    }

    :host([responsive-mode='stack']) table,
    :host([responsive-mode='stack']) thead,
    :host([responsive-mode='stack']) tbody,
    :host([responsive-mode='stack']) th,
    :host([responsive-mode='stack']) td,
    :host([responsive-mode='stack']) tr {
      display: block;
    }

    :host([responsive-mode='stack']) thead {
      display: none;
    }

    :host([responsive-mode='stack']) tr {
      background: var(--lt-bg-subtle);
      border-radius: var(--lt-border-radius);
      border: var(--lt-border-width, 1px) solid var(--lt-border-default);
      margin-bottom: var(--lt-spacing-3);
      padding: var(--lt-spacing-4);
    }

    :host([responsive-mode='stack']) td {
      border: none;
      display: grid;
      gap: var(--lt-spacing-2);
      grid-template-columns: 120px 1fr;
      padding: var(--lt-spacing-2) 0;
      text-align: start;
    }

    :host([responsive-mode='stack']) td::before {
      content: attr(data-label);
      color: var(--lt-text-default);
      font-weight: 600;
    }

    :host([responsive-mode='stack']) td.selection-cell {
      grid-template-columns: 1fr;
    }

    :host([responsive-mode='stack']) td.selection-cell::before {
      content: none;
    }

    :host([responsive-mode='stack']) td:last-child {
      padding-bottom: 0;
    }
  }

  @media (max-width: 768px) {
    .hide-on-mobile {
      display: none;
    }
  }

  th.sortable .header-content:focus-visible {
    outline: 2px solid var(--lt-interactive-primary-bg);
    outline-offset: -2px;
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    th.sortable .header-content,
    .sort-icon,
    tbody tr {
      transition: none;
    }
  }
`;
