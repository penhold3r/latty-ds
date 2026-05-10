import { attachSvg } from './attach';
import { checkSvg } from './check';
import { copySvg } from './copy';
import { cropSvg } from './crop';
import { downloadSvg } from './download';
import { editSvg } from './edit';
import { filterSvg } from './filter';
import { linkSvg } from './link';
import { minusSvg } from './minus';
import { pinSvg } from './pin';
import { plusSvg } from './plus';
import { printSvg } from './print';
import { refreshSvg } from './refresh';
import { saveSvg } from './save';
import { scissorsSvg } from './scissors';
import { shareSvg } from './share';
import { sortSvg } from './sort';
import { trashSvg } from './trash';
import { uploadSvg } from './upload';
import { xmarkSvg } from './xmark';

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
