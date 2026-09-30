import { attachSvg } from './attach.js';
import { checkSvg } from './check.js';
import { copySvg } from './copy.js';
import { cropSvg } from './crop.js';
import { downloadSvg } from './download.js';
import { editSvg } from './edit.js';
import { filterSvg } from './filter.js';
import { linkSvg } from './link.js';
import { minusSvg } from './minus.js';
import { pinSvg } from './pin.js';
import { plusSvg } from './plus.js';
import { printSvg } from './print.js';
import { refreshSvg } from './refresh.js';
import { saveSvg } from './save.js';
import { scissorsSvg } from './scissors.js';
import { shareSvg } from './share.js';
import { sortSvg } from './sort.js';
import { trashSvg } from './trash.js';
import { uploadSvg } from './upload.js';
import { xmarkSvg } from './xmark.js';

export const actionIcons = {
  check: checkSvg,
  xmark: xmarkSvg,
  plus: plusSvg,
  minus: minusSvg,
  edit: editSvg,
  trash: trashSvg,
  save: saveSvg,
  download: downloadSvg,
  upload: uploadSvg,
  copy: copySvg,
  share: shareSvg,
  link: linkSvg,
  filter: filterSvg,
  sort: sortSvg,
  refresh: refreshSvg,
  print: printSvg,
  attach: attachSvg,
  crop: cropSvg,
  scissors: scissorsSvg,
  pin: pinSvg
} as const;
