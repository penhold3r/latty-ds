import { css } from 'lit';

/**
 * Styles for the lt-table component.
 *
 * Includes:
 * - Base table styling with borders
 * - Density variants (compact, normal, comfortable)
 * - Responsive modes (scroll, stack)
 * - Sortable column indicators
 * - Hover and stripe effects
 * - Sticky columns
 * - Mobile breakpoint handling
 */
export const tableStyles = css`
  :host {
    display: block;
    font-family: 'Asap', sans-serif;
    overflow: hidden;
    width: 100%;
  }

  /* Table container for scroll mode */
  .table-container {
    overflow-x: auto;
    width: 100%;
  }

  :host([responsive-mode='scroll']) .table-container {
    -webkit-overflow-scrolling: touch;
  }

  /* Base table */
  table {
    border-collapse: collapse;
    width: 100%;
  }

  /* Header */
  thead {
    background: var(--lt-color-neutral-100);
    border-bottom: 2px solid var(--lt-color-neutral-300);
  }

  th {
    color: var(--lt-color-neutral-900);
    font-weight: 600;
    text-align: left;
    white-space: nowrap;
  }

  th[data-align='center'] {
    text-align: center;
  }

  th[data-align='right'] {
    text-align: right;
  }

  /* Sortable headers */
  th.sortable {
    cursor: pointer;
    user-select: none;
    transition: background-color 120ms ease;
  }

  th.sortable:hover {
    background: var(--lt-color-neutral-200);
  }

  th.sortable .header-content {
    align-items: center;
    display: flex;
    gap: var(--lt-spacing-2);
  }

  th[data-align='center'] .header-content {
    justify-content: center;
  }

  th[data-align='right'] .header-content {
    justify-content: flex-end;
  }

  .sort-icon {
    color: var(--lt-color-neutral-400);
    display: inline-flex;
    flex-shrink: 0;
    font-size: 0.875rem;
    opacity: 0;
    transition: opacity 120ms ease;
  }

  th.sortable:hover .sort-icon,
  th.sorted .sort-icon {
    opacity: 1;
  }

  th.sorted .sort-icon {
    color: var(--lt-color-primary-500);
  }

  /* Body */
  tbody tr {
    border-bottom: 1px solid var(--lt-color-neutral-200);
    transition: background-color 120ms ease;
  }

  tbody tr:last-child {
    border-bottom: none;
  }

  :host([hoverable]) tbody tr:hover {
    background: var(--lt-color-neutral-100);
  }

  :host([striped]) tbody tr:nth-child(even) {
    background: var(--lt-color-neutral-100);
  }

  :host([striped][hoverable]) tbody tr:nth-child(even):hover {
    background: var(--lt-color-neutral-200);
  }

  td {
    color: var(--lt-color-neutral-700);
  }

  td[data-align='center'] {
    text-align: center;
  }

  td[data-align='right'] {
    text-align: right;
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

  /* Sticky columns */
  th.sticky {
    background: var(--lt-color-neutral-100);
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    left: 0;
    position: sticky;
    z-index: 2;
  }

  td.sticky {
    background: white;
    box-shadow: 2px 0 4px rgba(0, 0, 0, 0.05);
    left: 0;
    position: sticky;
    z-index: 1;
  }

  /* Sticky columns with striped rows */
  :host([striped]) tbody tr:nth-child(even) td.sticky {
    background: var(--lt-color-neutral-100);
  }

  /* Sticky columns with hover */
  :host([hoverable]) tbody tr:hover td.sticky {
    background: var(--lt-color-neutral-100);
  }

  :host([striped][hoverable]) tbody tr:nth-child(even):hover td.sticky {
    background: var(--lt-color-neutral-200);
  }

  /* Border styling */
  :host([bordered]) table {
    border: 1px solid var(--lt-color-neutral-200);
  }

  :host([bordered]) th,
  :host([bordered]) td {
    border-right: 1px solid var(--lt-color-neutral-200);
  }

  :host([bordered]) th:last-child,
  :host([bordered]) td:last-child {
    border-right: none;
  }

  /* Empty state */
  .empty-state {
    color: var(--lt-color-neutral-500);
    padding: var(--lt-spacing-8);
    text-align: center;
  }

  /* Loading state */
  .loading-overlay {
    align-items: center;
    background: rgba(255, 255, 255, 0.8);
    display: flex;
    height: 100%;
    justify-content: center;
    left: 0;
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
      background: var(--lt-color-neutral-50);
      border-radius: var(--lt-border-radius);
      border: 1px solid var(--lt-color-neutral-200);
      margin-bottom: var(--lt-spacing-3);
      padding: var(--lt-spacing-4);
    }

    :host([responsive-mode='stack']) td {
      border: none;
      display: grid;
      gap: var(--lt-spacing-2);
      grid-template-columns: 120px 1fr;
      padding: var(--lt-spacing-2) 0;
      text-align: left;
    }

    :host([responsive-mode='stack']) td::before {
      content: attr(data-label);
      color: var(--lt-color-neutral-900);
      font-weight: 600;
    }

    :host([responsive-mode='stack']) td:last-child {
      padding-bottom: 0;
    }
  }

  /* Hide columns on mobile */
  @media (max-width: 768px) {
    .hide-on-mobile {
      display: none;
    }
  }

  /* Focus visible */
  th.sortable:focus-visible {
    outline: 2px solid var(--lt-color-primary-500);
    outline-offset: -2px;
  }
`;
