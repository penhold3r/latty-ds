import { arrowDownSvg } from './arrow-down.js';
import { arrowLeftSvg } from './arrow-left.js';
import { arrowRightSvg } from './arrow-right.js';
import { arrowUpSvg } from './arrow-up.js';
import { caretDownSvg } from './caret-down.js';
import { caretLeftSvg } from './caret-left.js';
import { caretRightSvg } from './caret-right.js';
import { caretUpSvg } from './caret-up.js';
import { compassSvg } from './compass.js';
import { doubleCaretLeftSvg } from './double-caret-left.js';
import { doubleCaretRightSvg } from './double-caret-right.js';
import { externalSvg } from './external.js';
import { globeSvg } from './globe.js';
import { locationSvg } from './location.js';
import { mapSvg } from './map.js';
import { moreHorizontalSvg } from './more-horizontal.js';
import { moreVerticalSvg } from './more-vertical.js';
import { returnSvg } from './return.js';
import { routeSvg } from './route.js';
import { sendSvg } from './send.js';

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
