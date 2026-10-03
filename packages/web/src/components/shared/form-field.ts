let fieldCount = 0;

/**
 * Stable id for a field's helper text, so the control can point `aria-describedby` at it. Ids only need to be
 * unique within one shadow root, but a counter keeps them unique across the page too.
 */
export const createFieldIds = (): { helper: string } => ({ helper: `lt-field-${fieldCount++}-helper` });
