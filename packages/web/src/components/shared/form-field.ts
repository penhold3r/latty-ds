import { css, html, nothing, type CSSResult, type TemplateResult } from 'lit';

let fieldCount = 0;

/**
 * Stable id for a field's helper text, so the control can point `aria-describedby` at it. Ids only need to be
 * unique within one shadow root, but a counter keeps them unique across the page too.
 */
export const createFieldIds = (): { helper: string } => ({ helper: `lt-field-${fieldCount++}-helper` });

/**
 * The presentation every form control shares: the required marker that sits next to a field's label.
 *
 * Six controls used to carry their own copy of this rule, with three different gaps before the marker —
 * `2px` on two of them, `var(--lt-spacing-1)` on two more, and none at all on the last two — so the same
 * asterisk sat at a different distance from its label depending on which control you were looking at. One
 * rule, on the design system's own 4px spacing grid, for all of them.
 */
export const formFieldStyles: CSSResult = css`
  .required-indicator {
    color: var(--lt-text-error);
    margin-inline-start: var(--lt-spacing-1);
  }
`;

/**
 * The marker that says a field is required.
 *
 * It is deliberately left in the accessibility tree. Most controls also expose the required state
 * programmatically — `required` on a native input, `aria-required` on a select or a combobox — but
 * `lt-date-input`'s trigger is a plain `<button>`, and `aria-required` is not a property `role="button"`
 * allows, so for that control the marker is the *only* signal that the field is required. Hiding it from
 * assistive technology would take information away rather than take noise out.
 */
export const renderRequiredIndicator = (required: boolean): TemplateResult | typeof nothing =>
  required ? html`<span class="required-indicator">*</span>` : nothing;

/**
 * A field's label — the visible label text, followed by the required marker when the field is required.
 *
 * This renders the label's *contents*, not its wrapper: what a label points at (`for`), whether it needs a
 * click handler to focus a custom trigger, and whether it is a `<label>` at all (a radio group uses a plain
 * `<div>`, because a `<label>` can only ever label one control) are each control's own business. The caller
 * supplies the wrapper; this renders what goes inside it.
 *
 * The label text and the marker are wrapped in a single element rather than left as two siblings, because a
 * control whose label is laid out as a column would otherwise split them: `lt-datepicker`'s label is a
 * flex column, and the marker used to end up on a line of its own, below the label text, while every other
 * control put it right next to the text. One element keeps the pair together whatever the label's layout.
 */
export const renderFieldLabel = (label: string, required: boolean): TemplateResult => html`
  <span class="label-text">
    <lt-text variant="label" as="span">${label}</lt-text>${renderRequiredIndicator(required)}
  </span>
`;

/**
 * The helper text below a field — the element the control points `aria-describedby` at.
 *
 * Every control renders it through the design system's own text component now, so the caption typography
 * is the same everywhere.
 */
export const renderHelperText = (id: string, text: string): TemplateResult | typeof nothing =>
  text ? html`<lt-text id=${id} variant="caption" as="span" class="helper-text">${text}</lt-text>` : nothing;
