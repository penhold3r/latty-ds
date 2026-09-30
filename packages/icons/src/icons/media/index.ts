import { cameraSvg } from './camera.js';
import { filmSvg } from './film.js';
import { headphonesSvg } from './headphones.js';
import { microphoneSvg } from './microphone.js';
import { musicSvg } from './music.js';
import { pauseSvg } from './pause.js';
import { playSvg } from './play.js';
import { recordSvg } from './record.js';
import { stopSvg } from './stop.js';
import { volumeHighSvg } from './volume-high.js';
import { volumeLowSvg } from './volume-low.js';
import { volumeOffSvg } from './volume-off.js';

export const mediaIcons = {
  play: playSvg,
  pause: pauseSvg,
  stop: stopSvg,
  'volume-high': volumeHighSvg,
  'volume-low': volumeLowSvg,
  'volume-off': volumeOffSvg,
  camera: cameraSvg,
  microphone: microphoneSvg,
  film: filmSvg,
  headphones: headphonesSvg,
  music: musicSvg,
  record: recordSvg
} as const;
