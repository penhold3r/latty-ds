export const DEFAULT_BORDER_RADIUS = '0.5rem' as const;

export const DEFAULT_BORDER_WIDTH = '1px' as const;

/**
 * Named presets accepted by `border.width` in `LattyConfig`.
 * Any other CSS length passes through unchanged.
 */
export const BORDER_WIDTH_PRESETS = {
  thin: '1px',
  medium: '2px',
  thick: '4px'
} as const;

export const DEFAULT_FONT_FAMILY = '"Hanken Grotesk", sans-serif' as const;
