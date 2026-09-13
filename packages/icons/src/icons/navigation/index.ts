import { arrowDownSvg } from './arrow-down';
import { arrowLeftSvg } from './arrow-left';
import { arrowRightSvg } from './arrow-right';
import { arrowUpSvg } from './arrow-up';
import { caretDownSvg } from './caret-down';
import { caretLeftSvg } from './caret-left';
import { caretRightSvg } from './caret-right';
import { caretUpSvg } from './caret-up';
import { compassSvg } from './compass';
import { doubleCaretLeftSvg } from './double-caret-left';
import { doubleCaretRightSvg } from './double-caret-right';
import { externalSvg } from './external';
import { globeSvg } from './globe';
import { locationSvg } from './location';
import { mapSvg } from './map';
import { moreHorizontalSvg } from './more-horizontal';
import { moreVerticalSvg } from './more-vertical';
import { returnSvg } from './return';
import { routeSvg } from './route';
import { sendSvg } from './send';

export const navigationIcons = {
  'arrow-down': arrowDownSvg,
  'arrow-left': arrowLeftSvg,
  'arrow-right': arrowRightSvg,
  'arrow-up': arrowUpSvg,
  'caret-down': caretDownSvg,
  'caret-left': caretLeftSvg,
  'caret-right': caretRightSvg,
  'caret-up': caretUpSvg,
  'double-caret-left': doubleCaretLeftSvg,
  'double-caret-right': doubleCaretRightSvg,
  compass: compassSvg,
  external: externalSvg,
  globe: globeSvg,
  location: locationSvg,
  map: mapSvg,
  'more-horizontal': moreHorizontalSvg,
  'more-vertical': moreVerticalSvg,
  return: returnSvg,
  route: routeSvg,
  send: sendSvg
} as const;
