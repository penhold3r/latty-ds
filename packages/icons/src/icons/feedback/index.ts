import { bookmarkSvg } from './bookmark';
import { checkCircleSvg } from './check-circle';
import { fireSvg } from './fire';
import { flagSvg } from './flag';
import { infoCircleSvg } from './info-circle';
import { lockSvg } from './lock';
import { questionCircleSvg } from './question-circle';
import { shieldSvg } from './shield';
import { thumbDownSvg } from './thumb-down';
import { thumbUpSvg } from './thumb-up';
import { warningTriangleSvg } from './warning-triangle';
import { xmarkCircleSvg } from './xmark-circle';

export const feedbackIcons: Record<string, string> = {
  'info-circle': infoCircleSvg,
  'check-circle': checkCircleSvg,
  'xmark-circle': xmarkCircleSvg,
  'warning-triangle': warningTriangleSvg,
  'question-circle': questionCircleSvg,
  'shield': shieldSvg,
  'flag': flagSvg,
  'bookmark': bookmarkSvg,
  'thumb-up': thumbUpSvg,
  'thumb-down': thumbDownSvg,
  'fire': fireSvg,
  'lock': lockSvg,
};
