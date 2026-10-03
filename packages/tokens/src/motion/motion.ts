import {
  DURATION_INSTANT,
  DURATION_FAST,
  DURATION_MODERATE,
  DURATION_SLOW,
  EASE_STANDARD,
  EASE_EMPHASIZED
} from '../constants/';

/**
 * Transition/animation duration scale.
 *
 * - `instant`: micro feedback — press/active transforms
 * - `fast`: default interactive transition — hover/focus color, border, box-shadow
 * - `moderate`: structural movement — expand/collapse, enter/exit fades
 * - `slow`: large/attention movement — panel slides, progress fill
 */
export type DurationToken = 'instant' | 'fast' | 'moderate' | 'slow';

/**
 * Easing curve scale.
 *
 * - `standard`: deceleration curve for elements entering/settling on screen
 * - `emphasized`: overshoot curve for entrances that should draw attention
 */
export type EaseToken = 'standard' | 'emphasized';

export const buildMotion = (): { duration: Record<DurationToken, string>; ease: Record<EaseToken, string> } => ({
  duration: {
    instant: DURATION_INSTANT,
    fast: DURATION_FAST,
    moderate: DURATION_MODERATE,
    slow: DURATION_SLOW
  },
  ease: {
    standard: EASE_STANDARD,
    emphasized: EASE_EMPHASIZED
  }
});
