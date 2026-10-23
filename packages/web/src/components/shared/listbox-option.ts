import { html, nothing, type TemplateResult } from 'lit';
import { preventFocusSteal } from './focus';
import { groupConsecutive } from './option-groups';

/** The shape every list box option shares — `SelectOption` and `ComboboxOption` both satisfy it. */
export interface ListboxOptionItem {
  value: string;
  label: string;
  disabled?: boolean;
  description?: string;
  icon?: string;
  group?: string;
}

export interface ListboxOptionView {
  /** The DOM id the listbox's `aria-activedescendant` points at. */
  id: string;
  label: string;
  description?: string;
  icon?: string;
  selected?: boolean;
  disabled?: boolean;
  active?: boolean;
  /** Renders the combobox's "create new option" row, which carries an extra modifier class. */
  create?: boolean;
  onSelect: () => void;
}

/**
 * One option row in a listbox dropdown (`lt-select`, `lt-combobox`) — the same markup in both, so an option
 * looks and behaves identically wherever it is rendered.
 */
export function renderListboxOption(view: ListboxOptionView): TemplateResult {
  return html`
    <button
      id=${view.id}
      class=${view.create ? 'option option-create' : 'option'}
      role="option"
      tabindex="-1"
      aria-selected=${view.selected ?? false}
      ?disabled=${view.disabled ?? false}
      data-active=${view.active ?? false}
      @mousedown=${preventFocusSteal}
      @click=${view.onSelect}
    >
      ${view.icon ? html`<lt-icon class="option-icon" name=${view.icon} size="sm"></lt-icon>` : nothing}
      <span class="option-content">
        <span class="option-label">${view.label}</span>
        ${view.description ? html`<span class="option-description">${view.description}</span>` : nothing}
      </span>
    </button>
  `;
}

/**
 * Renders a flat option list as contiguous groups (mirroring `<optgroup>`) around whichever option markup
 * the caller supplies for each item.
 */
export function renderListboxGroups<T extends { group?: string }>(
  items: readonly T[],
  renderItem: (item: T) => TemplateResult
): TemplateResult[] {
  return groupConsecutive(items).flatMap((run) =>
    run.group
      ? [
          html`<div class="option-group" role="group" aria-label=${run.group}>
            <div class="option-group-label" aria-hidden="true">${run.group}</div>
            ${run.items.map(renderItem)}
          </div>`
        ]
      : run.items.map(renderItem)
  );
}

/** The loading state that replaces a listbox's options while an async fetch is in flight. */
export function renderListboxLoading(message: string): TemplateResult {
  return html`
    <div class="loading-state">
      <lt-spinner size="sm"></lt-spinner>
      <lt-text variant="caption" as="span">${message}</lt-text>
    </div>
  `;
}
