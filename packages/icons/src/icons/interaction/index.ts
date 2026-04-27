import { collapseSvg } from './collapse';
import { cursorSvg } from './cursor';
import { dragSvg } from './drag';
import { expandSvg } from './expand';
import { eyeCloseSvg } from './eye-close';
import { eyeOpenSvg } from './eye-open';
import { redoSvg } from './redo';
import { rotateCwSvg } from './rotate-cw';
import { switchSvg } from './switch';
import { undoSvg } from './undo';
import { zoomInSvg } from './zoom-in';
import { zoomOutSvg } from './zoom-out';

export const interactionIcons: Record<string, string> = {
  'eye': eyeOpenSvg,
  'eye-off': eyeCloseSvg,
  'zoom-in': zoomInSvg,
  'zoom-out': zoomOutSvg,
  'expand': expandSvg,
  'collapse': collapseSvg,
  'drag': dragSvg,
  'cursor': cursorSvg,
  'switch': switchSvg,
  'rotate-cw': rotateCwSvg,
  'undo': undoSvg,
  'redo': redoSvg,
};
