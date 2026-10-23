/** A contiguous run of options sharing the same `group` (or `null`, for a run of ungrouped options). */
export interface OptionGroupRun<T> {
  group: string | null;
  items: T[];
}

/**
 * Splits a flat, ordered option list into contiguous runs by each item's `group` field — mirrors native
 * `<optgroup>` semantics, where groups are contiguous blocks rather than a property that reorders anything.
 * An item with no `group` starts its own ungrouped run; two same-named groups separated by an ungrouped item
 * (or a different group) become two separate runs, each rendered with its own heading, rather than being
 * merged — consistent with how a native `<select>` renders two `<optgroup label="X">` blocks that aren't
 * adjacent.
 * @param {readonly T[]} items - The flat list of items, each optionally carrying a `group` property.
 * @returns {OptionGroupRun<T>[]} An array of contiguous group runs.
 */
export function groupConsecutive<T extends { group?: string }>(items: readonly T[]): OptionGroupRun<T>[] {
  const runs: OptionGroupRun<T>[] = [];
  for (const item of items) {
    const group = item.group ?? null;
    const last = runs[runs.length - 1];
    if (last && last.group === group) last.items.push(item);
    else runs.push({ group, items: [item] });
  }
  return runs;
}
