import { cameraSvg } from './camera';
import { filmSvg } from './film';
import { headphonesSvg } from './headphones';
import { microphoneSvg } from './microphone';
import { musicSvg } from './music';
import { pauseSvg } from './pause';
import { playSvg } from './play';
import { recordSvg } from './record';
import { stopSvg } from './stop';
import { volumeHighSvg } from './volume-high';
import { volumeLowSvg } from './volume-low';
import { volumeOffSvg } from './volume-off';

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
