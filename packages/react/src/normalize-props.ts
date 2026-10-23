const CAMEL_TO_HTML_ATTR: Record<string, string> = {
  accessKey: 'accesskey',
  autoCapitalize: 'autocapitalize',
  autoComplete: 'autocomplete',
  autoCorrect: 'autocorrect',
  autoFocus: 'autofocus',
  autoSave: 'autosave',
  colSpan: 'colspan',
  contentEditable: 'contenteditable',
  crossOrigin: 'crossorigin',
  dateTime: 'datetime',
  encType: 'enctype',
  enterKeyHint: 'enterkeyhint',
  fetchPriority: 'fetchpriority',
  formAction: 'formaction',
  formEncType: 'formenctype',
  formMethod: 'formmethod',
  formNoValidate: 'formnovalidate',
  formTarget: 'formtarget',
  hrefLang: 'hreflang',
  inputMode: 'inputmode',
  isMap: 'ismap',
  maxLength: 'maxlength',
  minLength: 'minlength',
  noValidate: 'novalidate',
  popoverTarget: 'popovertarget',
  popoverTargetAction: 'popovertargetaction',
  readOnly: 'readonly',
  referrerPolicy: 'referrerpolicy',
  rowSpan: 'rowspan',
  spellCheck: 'spellcheck',
  srcSet: 'srcset',
  tabIndex: 'tabindex',
  useMap: 'usemap'
};

const BOOLEAN_HTML_ATTRS = new Set([
  'async',
  'autofocus',
  'checked',
  'controls',
  'default',
  'defer',
  'disabled',
  'formnovalidate',
  'hidden',
  'inert',
  'ismap',
  'itemscope',
  'loop',
  'multiple',
  'muted',
  'nomodule',
  'novalidate',
  'open',
  'playsinline',
  'readonly',
  'required',
  'reversed',
  'selected'
]);

const ENUMERATED_BOOLEAN_ATTRS = new Set(['autocorrect', 'contenteditable', 'draggable', 'spellcheck']);

/**
 * Normalizes React HTML props before spreading them onto a custom element (`<lt-*>`).
 *
 * React does not normalize camelCase HTML attributes (`autoComplete`, `maxLength`, `readOnly`)
 * or omit `false` boolean attributes (`readOnly={false}`, `formNoValidate={false}`) on custom
 * elements the way it does on built-in HTML tags. This helper ensures both client-side rendering
 * and SSR (`renderToString`) emit standard HTML attribute names and semantics.
 */
export function normalizeNativeProps(props: Record<string, unknown>): Record<string, unknown> {
  const normalized: Record<string, unknown> = {};

  for (const [key, value] of Object.entries(props)) {
    if (value === undefined) continue;

    // Preserve React event handlers (onClick, onKeyDown, etc.) and special React props untouched
    if (/^on[A-Z]/.test(key) || key === 'className' || key === 'style' || key === 'dangerouslySetInnerHTML') {
      normalized[key] = value;
      continue;
    }

    const attrName = CAMEL_TO_HTML_ATTR[key] ?? key;

    if (BOOLEAN_HTML_ATTRS.has(attrName)) {
      if (value) {
        normalized[attrName] = '';
      }
      continue;
    }

    if (attrName === 'download' && typeof value === 'boolean') {
      if (value) {
        normalized[attrName] = '';
      }
      continue;
    }

    if (ENUMERATED_BOOLEAN_ATTRS.has(attrName) && typeof value === 'boolean') {
      normalized[attrName] = String(value);
      continue;
    }

    normalized[attrName] = value;
  }

  return normalized;
}
