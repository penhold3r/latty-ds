/**
 * Normalizes a list box's public `value` into the flat list of selected values every internal lookup needs.
 * A single-value control's value is a string (empty when nothing is selected); a `multiple` one's is already
 * an array.
 * @param {string | string[]} value - The raw value (string for single, string[] for multiple).
 * @returns {string[]} The normalized array of selected values.
 */
export function normalizeSelection(value: string | string[]): string[] {
  if (Array.isArray(value)) return value;
  return value ? [value] : [];
}

/**
 * Whether a list box should show its clear button, given its own flags and current selection.
 * @param {boolean} clearable - Whether the control is clearable.
 * @param {readonly string[]} selected - The currently selected values.
 * @param {boolean} disabled - Whether the control is disabled.
 * @returns {boolean} True if the clear button should be shown.
 */
export function shouldShowClear(clearable: boolean, selected: readonly string[], disabled: boolean): boolean {
  return clearable && selected.length > 0 && !disabled;
}

/**
 * Adds `value` to the selection, or removes it when it is already selected — the `multiple` selection
 * behavior shared by `lt-select` and `lt-combobox`. Never mutates the given array.
 * @param {readonly string[]} selected - The currently selected values.
 * @param {string} value - The value to toggle.
 * @returns {string[]} A new array with the value toggled.
 */
export function toggleSelected(selected: readonly string[], value: string): string[] {
  return selected.includes(value) ? selected.filter((v) => v !== value) : [...selected, value];
}

/**
 * The value that means "nothing selected", in the shape the control's cardinality expects.
 * @param {boolean} multiple - Whether the control allows multiple selection.
 * @returns {string | string[]} An empty array for multiple, empty string for single.
 */
export function clearValue(multiple: boolean): string | string[] {
  return multiple ? [] : '';
}

/**
 * Coerces a value that came from outside the control's own `value` property — a form reset, a browser
 * state restore — back into the public `string | string[]` shape.
 * @param {unknown} value - The raw value to coerce.
 * @returns {string | string[]} The coerced value in the public shape.
 */
export function coerceListboxValue(value: unknown): string | string[] {
  if (Array.isArray(value)) return value.map(String);
  return value == null ? '' : String(value);
}

/**
 * One form-data entry per selected value, for a `multiple` list box. Native `<select multiple>` submits the
 * same name repeatedly, so appending (rather than joining) is what makes it compatible with a real form.
 * @param {string | null} name - The form field name (null if not submitting).
 * @param {readonly string[]} selected - The selected values to include.
 * @returns {FormData} A FormData instance with the selected values appended.
 */
export function selectionFormData(name: string | null, selected: readonly string[]): FormData {
  const data = new FormData();
  if (name) for (const value of selected) data.append(name, value);
  return data;
}
