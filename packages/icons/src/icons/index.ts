import { navigationIcons } from './navigation';
import { actionIcons } from './actions';
import { uiIcons } from './ui';
import { feedbackIcons } from './feedback';
import { interactionIcons } from './interaction';
import { shapeIcons } from './shapes';
import { socialIcons } from './social';

export const lattyIcons = {
  ...navigationIcons,
  ...actionIcons,
  ...uiIcons,
  ...feedbackIcons,
  ...interactionIcons,
  ...shapeIcons,
  ...socialIcons,
} as const;

export type LattyIconName = keyof typeof lattyIcons;
