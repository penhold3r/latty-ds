/**
 * Copies a live `ValidityState` into a plain object with its own enumerable properties, suitable for passing to
 * `ElementInternals.setValidity()`.
 *
 * `ValidityState`'s flags (`valueMissing`, `typeMismatch`, etc.) are getters on its prototype, not own properties
 * on the instance — spreading it (`{ ...validity }`) or `Object.keys(validity)` sees none of them. Real browsers'
 * WebIDL dictionary conversion reads each named member individually, so passing the live object to `setValidity`
 * happens to work there; jsdom's implementation enumerates instead, so it silently sees an empty flags object and
 * treats the control as always valid. Converting explicitly avoids relying on which enumeration strategy the
 * runtime uses, and is correct either way.
 *
 * @example
 * ```ts
 * this._internals.setValidity(toValidityFlags(input.validity), input.validationMessage, input);
 * ```
 */
export function toValidityFlags(validity: ValidityState): ValidityStateFlags {
  return {
    valueMissing: validity.valueMissing,
    typeMismatch: validity.typeMismatch,
    patternMismatch: validity.patternMismatch,
    tooLong: validity.tooLong,
    tooShort: validity.tooShort,
    rangeUnderflow: validity.rangeUnderflow,
    rangeOverflow: validity.rangeOverflow,
    stepMismatch: validity.stepMismatch,
    badInput: validity.badInput,
    customError: validity.customError
  };
}
