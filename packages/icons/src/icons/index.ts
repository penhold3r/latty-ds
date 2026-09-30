import { navigationIcons } from './navigation/index.js';
import { actionIcons } from './actions/index.js';
import { uiIcons } from './ui/index.js';
import { feedbackIcons } from './feedback/index.js';
import { interactionIcons } from './interaction/index.js';
import { shapeIcons } from './shapes/index.js';
import { socialIcons } from './social/index.js';
import { mediaIcons } from './media/index.js';
import { techIcons } from './tech/index.js';

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
