import { navigationIcons } from './navigation';
import { actionIcons } from './actions';
import { uiIcons } from './ui';
import { feedbackIcons } from './feedback';
import { interactionIcons } from './interaction';
import { shapeIcons } from './shapes';
import { socialIcons } from './social';
import { mediaIcons } from './media';
import { techIcons } from './tech';

export const lattyIcons = {
  ...navigationIcons,
  ...actionIcons,
  ...uiIcons,
  ...feedbackIcons,
  ...interactionIcons,
  ...shapeIcons,
  ...socialIcons,
  ...mediaIcons,
  ...techIcons
} as const;

export type LattyIconName = keyof typeof lattyIcons;
