import { bellOffSvg } from './bell-off.js';
import { inboxSvg } from './inbox.js';
import { messageCircleSvg } from './message-circle.js';
import { videoSvg } from './video.js';

export const communicationIcons = {
  'bell-off': bellOffSvg,
  inbox: inboxSvg,
  'message-circle': messageCircleSvg,
  video: videoSvg
} as const;
