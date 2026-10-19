import { css } from 'lit';

export const textfieldStyles = css`
  :host {
    display: inline-block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    width: 100%;
  }

  .wrapper {
    display: flex;
    flex-direction: column;
    gap: var(--lt-spacing-1);
    width: 100%;
  }

  label {
    color: var(--lt-text-subtle);
  }

  .input-container {
    position: relative;
    width: 100%;
    display: flex;
    align-items: center;
    gap: var(--lt-spacing-2);
  }

  .icon-start,
  .icon-end {
    color: var(--lt-text-muted);
    flex-shrink: 0;
    position: absolute;
    pointer-events: none;
  }

  .icon-start {
    inset-inline-start: var(--lt-spacing-3);
  }

  .icon-end {
    inset-inline-end: var(--lt-spacing-3);
  }

  /* Unlike .variant-icon (a decorative lt-icon), the password toggle is a real <button> — reset the native
     chrome so it reads as an inline icon, and re-declare align-items since it's no longer a plain absolutely-
     positioned element inheriting the .icon-start/.icon-end flex-adjacent layout by accident. */
  .password-toggle {
    align-items: center;
    background: none;
    border: none;
    cursor: pointer;
    display: inline-flex;
    font: inherit;
    padding: 0;
    pointer-events: auto;
    transition: color var(--lt-duration-fast) var(--lt-ease-standard);
  }

  .password-toggle:hover {
    color: var(--lt-text-default);
  }

  .password-toggle:disabled {
    cursor: not-allowed;
    opacity: 0.6;
  }

  .password-toggle:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  .variant-icon {
    pointer-events: none;
  }

  :host([variant='success']) .variant-icon {
    color: var(--lt-interactive-success-bg);
  }

  :host([variant='warning']) .variant-icon {
    color: var(--lt-interactive-warning-bg);
  }

  :host([variant='error']) .variant-icon,
  :host([data-invalid]) .variant-icon {
    color: var(--lt-interactive-error-bg);
  }

  input,
  textarea {
    color: var(--lt-text-default);
    font-family: inherit;
    font-weight: 400;
  }

  input::placeholder,
  textarea::placeholder {
    color: var(--lt-text-muted);
  }

  /* ── Multiline (textarea) — unchanged box model. prefix/suffix never apply here (see their own JSDoc), so the
     textarea itself stays the visible field, same as before those existed. ── */
  textarea {
    background: var(--lt-bg-subtle);
    border-radius: var(--lt-border-radius);
    border: var(--lt-border-width, 1px) solid var(--lt-border-input);
    box-sizing: border-box;
    min-height: 80px;
    padding-block: var(--lt-spacing-3);
    resize: vertical;
    transition:
      border-color var(--lt-duration-fast) var(--lt-ease-standard),
      box-shadow var(--lt-duration-fast) var(--lt-ease-standard);
    width: 100%;
  }

  /* The manual drag handle would just get silently overwritten by the next keystroke's auto-grow — removed
     entirely rather than left to visually mislead the user into thinking a manual resize will stick. */
  textarea.autosize {
    overflow: hidden;
    resize: none;
  }

  textarea:hover:not(:disabled) {
    border-color: var(--lt-border-strong);
  }

  textarea:focus {
    border-color: var(--lt-interactive-primary-bg);
    box-shadow: 0 0 0 3px var(--lt-focus-halo-color);
    outline: none;
  }

  textarea:disabled {
    background: var(--lt-bg-surface);
    color: var(--lt-text-muted);
    cursor: not-allowed;
  }

  /* ── Single-line (input) — .input-container itself is the visible field box, not the <input>. prefix/suffix
     render as real flex siblings of the input (so a longer label like "USD" sizes itself naturally, rather than
     needing a hardcoded padding offset the way the fixed-size icon overlays below do) — an input with its own
     separate border/background layered inside that row would look like two stacked boxes instead of one field. */
  .input-container:has(input) {
    background: var(--lt-bg-subtle);
    border-radius: var(--lt-border-radius);
    border: var(--lt-border-width, 1px) solid var(--lt-border-input);
    box-sizing: border-box;
    transition:
      border-color var(--lt-duration-fast) var(--lt-ease-standard),
      box-shadow var(--lt-duration-fast) var(--lt-ease-standard);
  }

  .input-container:has(input):hover:not(:has(:disabled)) {
    border-color: var(--lt-border-strong);
  }

  /* :focus-within, not :focus — focus always lands on the inner <input>, never the container itself. */
  .input-container:has(input):focus-within {
    border-color: var(--lt-interactive-primary-bg);
    box-shadow: 0 0 0 3px var(--lt-focus-halo-color);
  }

  .input-container:has(input):has(:disabled) {
    background: var(--lt-bg-surface);
    cursor: not-allowed;
  }

  input.field {
    background: transparent;
    border: none;
    flex: 1;
    height: 100%;
    min-width: 0;
    outline: none;
    padding: 0;
  }

  input.field:disabled {
    color: var(--lt-text-muted);
    cursor: not-allowed;
  }

  .prefix,
  .suffix {
    color: var(--lt-text-muted);
    flex-shrink: 0;
    white-space: nowrap;
  }

  /* sizes — split between textarea (box model lives on the element itself, unchanged) and input (box model
     lives on .input-container now — see the comment above .input-container:has(input)). */
  :host([size='sm']) input.field,
  :host([size='sm']) textarea {
    font-size: 0.875rem;
  }

  :host([size='sm']) textarea,
  :host([size='sm']) .input-container:has(input) {
    height: 32px;
    padding-inline: var(--lt-spacing-3);
  }

  :host([size='sm']) textarea.has-start-icon,
  :host([size='sm']) .input-container:has(input).has-start-icon {
    padding-inline-start: calc(var(--lt-spacing-3) + 20px + var(--lt-spacing-2));
  }

  :host([size='sm']) textarea.has-end-icon,
  :host([size='sm']) .input-container:has(input).has-end-icon {
    padding-inline-end: calc(var(--lt-spacing-3) + 20px + var(--lt-spacing-2));
  }

  :host([size='md']) input.field,
  :host([size='md']) textarea {
    font-size: 1rem;
  }

  :host([size='md']) textarea,
  :host([size='md']) .input-container:has(input) {
    height: 40px;
    padding-inline: var(--lt-spacing-4);
  }

  :host([size='md']) textarea.has-start-icon,
  :host([size='md']) .input-container:has(input).has-start-icon {
    padding-inline-start: calc(var(--lt-spacing-4) + 20px + var(--lt-spacing-2));
  }

  :host([size='md']) textarea.has-end-icon,
  :host([size='md']) .input-container:has(input).has-end-icon {
    padding-inline-end: calc(var(--lt-spacing-4) + 20px + var(--lt-spacing-2));
  }

  :host([size='lg']) input.field,
  :host([size='lg']) textarea {
    font-size: 1.0625rem;
  }

  :host([size='lg']) textarea,
  :host([size='lg']) .input-container:has(input) {
    height: 48px;
    padding-inline: var(--lt-spacing-5);
  }

  :host([size='lg']) textarea.has-start-icon,
  :host([size='lg']) .input-container:has(input).has-start-icon {
    padding-inline-start: calc(var(--lt-spacing-5) + 24px + var(--lt-spacing-2));
  }

  :host([size='lg']) textarea.has-end-icon,
  :host([size='lg']) .input-container:has(input).has-end-icon {
    padding-inline-end: calc(var(--lt-spacing-5) + 24px + var(--lt-spacing-2));
  }

  :host([size='lg']) .icon-start,
  :host([size='lg']) .icon-end {
    width: 24px;
    height: 24px;
  }

  /* variants */
  :host([variant='success']) textarea,
  :host([variant='success']) .input-container:has(input) {
    border-color: var(--lt-border-success-strong);
  }

  :host([variant='success']) textarea:focus,
  :host([variant='success']) .input-container:has(input):focus-within {
    border-color: var(--lt-interactive-success-bg-hover);
    box-shadow: 0 0 0 3px var(--lt-bg-success-subtle);
  }

  :host([variant='warning']) textarea,
  :host([variant='warning']) .input-container:has(input) {
    border-color: var(--lt-border-warning-strong);
  }

  :host([variant='warning']) textarea:focus,
  :host([variant='warning']) .input-container:has(input):focus-within {
    border-color: var(--lt-interactive-warning-bg-hover);
    box-shadow: 0 0 0 3px var(--lt-bg-warning-subtle);
  }

  :host([variant='error']) textarea,
  :host([variant='error']) .input-container:has(input),
  :host([data-invalid]) textarea,
  :host([data-invalid]) .input-container:has(input) {
    border-color: var(--lt-border-error-strong);
  }

  :host([variant='error']) textarea:focus,
  :host([variant='error']) .input-container:has(input):focus-within,
  :host([data-invalid]) textarea:focus,
  :host([data-invalid]) .input-container:has(input):focus-within {
    border-color: var(--lt-interactive-error-bg-hover);
    box-shadow: 0 0 0 3px var(--lt-bg-error-subtle);
  }

  .helper-text {
    color: var(--lt-text-subtle);
  }

  .helper-text::part(base) {
    font-weight: 200;
  }

  /* .icon-end disables pointer events so decorative icons never swallow clicks; the clear button is the one real
     control in that slot, so it opts back in and resets native button chrome. */
  .clear-button {
    align-items: center;
    background: none;
    border: 0;
    border-radius: var(--lt-border-radius, 4px);
    cursor: pointer;
    display: flex;
    padding: 0;
    pointer-events: auto;
  }

  .clear-button:focus-visible {
    outline: var(--lt-border-focusRingWidth) solid var(--lt-focus-ring-color);
    outline-offset: var(--lt-border-focusRingOffset);
  }

  .counter {
    color: var(--lt-text-subtle);
    display: block;
    text-align: end;
  }

  :host([variant='success']) .helper-text {
    color: var(--lt-text-success);
  }

  :host([variant='warning']) .helper-text {
    color: var(--lt-text-warning);
  }

  :host([variant='error']) .helper-text,
  :host([data-invalid]) .helper-text {
    color: var(--lt-text-error);
  }

  .required-indicator {
    color: var(--lt-text-error);
  }

  :host([uppercase]) label lt-text::part(base) {
    font-variant-caps: small-caps;
    letter-spacing: 0.05rem;
    text-transform: lowercase;
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    .password-toggle,
    .input-container,
    input,
    textarea {
      transition: none;
    }
  }
`;
