import { circleSvg } from './circle';
import { cloudSvg } from './cloud';
import { diamondSvg } from './diamond';
import { doubleCircleSvg } from './double-circle';
import { heartSvg } from './heart';
import { hexagonSvg } from './hexagon';
import { lightningSvg } from './lightning';
import { moonSvg } from './moon';
import { squareSvg } from './square';
import { starSvg } from './star';
import { sunSvg } from './sun';
import { triangleSvg } from './triangle';

export const shapeIcons: Record<string, string> = {
  'heart': heartSvg,
  'star': starSvg,
  'diamond': diamondSvg,
  'hexagon': hexagonSvg,
  'double-circle': doubleCircleSvg,
  'circle': circleSvg,
  'square': squareSvg,
  'triangle': triangleSvg,
  'cloud': cloudSvg,
  'lightning': lightningSvg,
  'moon': moonSvg,
  'sun': sunSvg,
};
