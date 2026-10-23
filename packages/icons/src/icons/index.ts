import { navigationIcons } from './navigation/index.js';
import { actionIcons } from './actions/index.js';
import { uiIcons } from './ui/index.js';
import { feedbackIcons } from './feedback/index.js';
import { interactionIcons } from './interaction/index.js';
import { shapeIcons } from './shapes/index.js';
import { socialIcons } from './social/index.js';
import { mediaIcons } from './media/index.js';
import { techIcons } from './tech/index.js';
import { foodIcons } from './food/index.js';
import { commerceIcons } from './commerce/index.js';
import { transportationIcons } from './transportation/index.js';
import { filesIcons } from './files/index.js';
import { communicationIcons } from './communication/index.js';
import { peopleIcons } from './people/index.js';
import { dataIcons } from './data/index.js';

export const lattyIcons = {
  ...navigationIcons,
  ...actionIcons,
  ...uiIcons,
  ...feedbackIcons,
  ...interactionIcons,
  ...shapeIcons,
  ...socialIcons,
  ...mediaIcons,
  ...techIcons,
  ...foodIcons,
  ...commerceIcons,
  ...transportationIcons,
  ...filesIcons,
  ...communicationIcons,
  ...peopleIcons,
  ...dataIcons
} as const;

export type LattyIconName = keyof typeof lattyIcons;
