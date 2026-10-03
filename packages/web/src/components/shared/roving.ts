/** Items a user can reach with the keyboard: everything not disabled, in order. */
export const enabledItems = <T extends { disabled: boolean }>(items: readonly T[]): T[] =>
  items.filter((item) => !item.disabled);

/** The one item that's a Tab stop: the one matching `value`, else the first enabled item. */
export const rovingTargetOf = <T extends { disabled: boolean; value: string }>(
  enabled: readonly T[],
  value: string
): T | undefined => enabled.find((item) => item.value === value) ?? enabled[0];

/** One step forward or back, wrapping at both ends. An index of -1 (not in the list) steps from the start. */
export const stepIndex = (index: number, length: number, delta: 1 | -1): number =>
  (Math.max(index, 0) + delta + length) % length;
