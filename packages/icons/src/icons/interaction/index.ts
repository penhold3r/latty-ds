import { collapseSvg } from './collapse.js';
import { cursorSvg } from './cursor.js';
import { dragSvg } from './drag.js';
import { expandSvg } from './expand.js';
import { eyeCloseSvg } from './eye-close.js';
import { eyeOpenSvg } from './eye-open.js';
import { flipSvg } from './flip.js';
import { fullscreenSvg } from './fullscreen.js';
import { handSvg } from './hand.js';
import { minimizeSvg } from './minimize.js';
import { moveSvg } from './move.js';
import { redoSvg } from './redo.js';
import { rotateCwSvg } from './rotate-cw.js';
import { selectSvg } from './select.js';
import { switchSvg } from './switch.js';
import { undoSvg } from './undo.js';
import { zoomInSvg } from './zoom-in.js';
import { zoomOutSvg } from './zoom-out.js';

export const interactionIcons = {
  eye: eyeOpenSvg,
  'eye-off': eyeCloseSvg,
  'zoom-in': zoomInSvg,
  'zoom-out': zoomOutSvg,
  expand: expandSvg,
  collapse: collapseSvg,
  drag: dragSvg,
  cursor: cursorSvg,
  switch: switchSvg,
  'rotate-cw': rotateCwSvg,
  undo: undoSvg,
  redo: redoSvg,
  move: moveSvg,
  hand: handSvg,
  select: selectSvg,
  flip: flipSvg,
  fullscreen: fullscreenSvg,
  minimize: minimizeSvg
} as const;
