import { archiveSvg } from './archive.js';
import { clipboardSvg } from './clipboard.js';
import { fileSvg } from './file.js';
import { folderOpenSvg } from './folder-open.js';

export const filesIcons = {
  archive: archiveSvg,
  clipboard: clipboardSvg,
  file: fileSvg,
  'folder-open': folderOpenSvg
} as const;
