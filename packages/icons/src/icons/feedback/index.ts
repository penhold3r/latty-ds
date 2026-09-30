import { awardSvg } from './award.js';
import { bookmarkSvg } from './bookmark.js';
import { chatSvg } from './chat.js';
import { checkCircleSvg } from './check-circle.js';
import { fireSvg } from './fire.js';
import { flagSvg } from './flag.js';
import { infoCircleSvg } from './info-circle.js';
import { lockSvg } from './lock.js';
import { questionCircleSvg } from './question-circle.js';
import { shieldSvg } from './shield.js';
import { tagSvg } from './tag.js';
import { targetSvg } from './target.js';
import { thumbDownSvg } from './thumb-down.js';
import { thumbUpSvg } from './thumb-up.js';
import { unlockSvg } from './unlock.js';
import { verifiedSvg } from './verified.js';
import { warningTriangleSvg } from './warning-triangle.js';
import { xmarkCircleSvg } from './xmark-circle.js';

export const feedbackIcons = {
  'info-circle': infoCircleSvg,
  'check-circle': checkCircleSvg,
  'xmark-circle': xmarkCircleSvg,
  'warning-triangle': warningTriangleSvg,
  'question-circle': questionCircleSvg,
  shield: shieldSvg,
  flag: flagSvg,
  bookmark: bookmarkSvg,
  'thumb-up': thumbUpSvg,
  'thumb-down': thumbDownSvg,
  fire: fireSvg,
  lock: lockSvg,
  unlock: unlockSvg,
  verified: verifiedSvg,
  tag: tagSvg,
  chat: chatSvg,
  award: awardSvg,
  target: targetSvg
} as const;
