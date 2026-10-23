/**
 * Normalizes a list box's public `value` into the flat list of selected values every internal lookup needs.
 * A single-value control's value is a string (empty when nothing is selected); a `multiple` one's is already
 * an array.
 */
export function normalizeSelection(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

/** Whether a list box should show its clear button, given its own flags and current selection. */
export function shouldShowClear(clearable: boolean, selected: readonly string[], disabled: boolean): boolean {
  return clearable && selected.length > 0 && !disabled;
}

/**
 * Adds `value` to the selection, or removes it when it is already selected — the `multiple` selection
 * behavior shared by `lt-select` and `lt-combobox`. Never mutates the given array.
 */
export function toggleSelected(selected: readonly string[], value: string): string[] {
  return selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
}

/** The value that means "nothing selected", in the shape the control's cardinality expects. */
export function clearValue(multiple: boolean): string | string[] {
  return multiple ? [] : '';
}

/**
 * Coerces a value that came from outside the control's own `value` property — a form reset, a browser
 * state restore — back into the public `string | string[]` shape.
 */
export function coerceListboxValue(value: unknown): string | string[] {
  if (Array.isArray(value)) return value.map(String);
  return value == null ? '' : String(value);
}

/**
 * One form-data entry per selected value, for a `multiple` list box. Native `<select multiple>` submits the
 * same name repeatedly, so appending (rather than joining) is what makes it compatible with a real form.
 */
export function selectionFormData(name: string | null, selected: readonly string[]): FormData {
  const data = new FormData();
  if (name) for (const value of selected) data.append(name, value);
  return data;
}
