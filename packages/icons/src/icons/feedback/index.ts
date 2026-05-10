import { awardSvg } from './award';
import { bookmarkSvg } from './bookmark';
import { chatSvg } from './chat';
import { checkCircleSvg } from './check-circle';
import { fireSvg } from './fire';
import { flagSvg } from './flag';
import { infoCircleSvg } from './info-circle';
import { lockSvg } from './lock';
import { questionCircleSvg } from './question-circle';
import { shieldSvg } from './shield';
import { tagSvg } from './tag';
import { targetSvg } from './target';
import { thumbDownSvg } from './thumb-down';
import { thumbUpSvg } from './thumb-up';
import { unlockSvg } from './unlock';
import { verifiedSvg } from './verified';
import { warningTriangleSvg } from './warning-triangle';
import { xmarkCircleSvg } from './xmark-circle';

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
