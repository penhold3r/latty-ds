import { checkSvg } from './check';
import { copySvg } from './copy';
import { downloadSvg } from './download';
import { editSvg } from './edit';
import { linkSvg } from './link';
import { minusSvg } from './minus';
import { plusSvg } from './plus';
import { saveSvg } from './save';
import { shareSvg } from './share';
import { trashSvg } from './trash';
import { uploadSvg } from './upload';
import { xmarkSvg } from './xmark';

export const actionIcons: Record<string, string> = {
  'check': checkSvg,
  'xmark': xmarkSvg,
  'plus': plusSvg,
  'minus': minusSvg,
  'edit': editSvg,
  'trash': trashSvg,
  'save': saveSvg,
  'download': downloadSvg,
  'upload': uploadSvg,
  'copy': copySvg,
  'share': shareSvg,
  'link': linkSvg,
};
