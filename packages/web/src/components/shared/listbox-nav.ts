/** Keys a listbox (select/combobox dropdown) moves its active option in response to. */
export type ListboxNavKey = 'ArrowDown' | 'ArrowUp' | 'Home' | 'End' | 'PageDown' | 'PageUp';

/** How many positions a Page Up/Down press moves, when there are more options than this to jump across. */
const PAGE_SIZE = 10;

/**
 * Computes the next active index for a listbox keyboard interaction, wrapping Up/Down at the ends (Home/End/
 * Page Up/Down clamp instead — jumping to "the other end" on a page press would be surprising). Returns `-1`
 * when `length` is 0 (nothing to be active).
 * @param {ListboxNavKey} key - The navigation key pressed.
 * @param {number} currentIndex - The currently active index (-1 if none).
 * @param {number} length - The total number of options.
 * @returns {number} The next active index, or -1 if length is 0.
 */
export function nextListboxIndex(key: ListboxNavKey, currentIndex: number, length: number): number {
  if (length === 0) return -1;
  switch (key) {
    case 'ArrowDown':
      return currentIndex < length - 1 ? currentIndex + 1 : 0;
    case 'ArrowUp':
      return currentIndex > 0 ? currentIndex - 1 : length - 1;
    case 'Home':
      return 0;
    case 'End':
      return length - 1;
    case 'PageDown':
      return Math.min(currentIndex < 0 ? PAGE_SIZE - 1 : currentIndex + PAGE_SIZE, length - 1);
    case 'PageUp':
      return Math.max(currentIndex < 0 ? 0 : currentIndex - PAGE_SIZE, 0);
  }
}

/**
 * Case- and diacritic-insensitive comparison key for listbox filtering (and for comparing a typed value
 * against existing option labels) — "café" should match a query of "cafe". NFD decomposes a combined
 * character (for example "é") into its base letter plus a separate combining mark, which the Unicode range
 * `\u0300-\u036f` then strips; `toLowerCase()` runs first so a combining mark's own casing never factors in.
 * @param {string} text - The text to normalize.
 * @returns {string} The normalized text with lowercase, NFD decomposition, and combining marks removed.
 */
export function normalizeSearchText(text: string): string {
  return text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}

/**
 * Stateful typeahead matcher for a listbox (the standard WAI-ARIA "type to jump to an option" pattern):
 * accumulates printable characters typed within `timeoutMs` of each other into a buffer, and matches the next
 * option (after `afterIndex`, wrapping around) whose label starts with it, case-insensitively. Create ONE
 * instance per listbox — it holds its own buffer/timer across calls — and call `match()` on every printable
 * keydown while the listbox is open.
 *
 * Deliberately does NOT special-case repeating a single letter to cycle through every option that starts with
 * it (e.g. Pressing "j" repeatedly to step through "John", "Jake", "Julia") — that's a real native `<select>`
 * refinement, but matching is already a genuine improvement over no typeahead at all, and adding it would need
 * to distinguish "repeated single letter" from "a genuinely repeated letter inside a real typed word" (e.g.
 * "ll" in "Allison"), which isn't worth the complexity this pass.
 * @param {number} timeoutMs - Time in milliseconds before the typeahead buffer resets (default: 500).
 */
export class ListboxTypeahead {
  private buffer = '';
  private timer: ReturnType<typeof setTimeout> | null = null;

  constructor(private readonly timeoutMs = 500) {}

  /**
   * Matches the next option whose label starts with the accumulated buffer.
   * @param {string} char - The character typed.
   * @param {readonly string[]} labels - The list of option labels to search.
   * @param {number} afterIndex - The index to start searching after (wraps around).
   * @returns {number | null} The matched index, or null if no match.
   */
  match(char: string, labels: readonly string[], afterIndex: number): number | null {
    this.buffer += char.toLowerCase();
    if (this.timer) clearTimeout(this.timer);
    this.timer = setTimeout(() => {
      this.buffer = '';
    }, this.timeoutMs);

    const n = labels.length;
    for (let offset = 1; offset <= n; offset++) {
      const i = (afterIndex + offset) % n;
      if (labels[i]?.toLowerCase().startsWith(this.buffer)) return i;
    }
    return null;
  }

  /**
   * Clears any pending reset timer — call from `disconnectedCallback` so it doesn't fire after teardown.
   * @returns {void}
   */
  dispose(): void {
    if (this.timer) clearTimeout(this.timer);
    this.timer = null;
  }
}
