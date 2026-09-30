import { circleSvg } from './circle.js';
import { cloudSvg } from './cloud.js';
import { diamondSvg } from './diamond.js';
import { doubleCircleSvg } from './double-circle.js';
import { heartSvg } from './heart.js';
import { hexagonSvg } from './hexagon.js';
import { infinitySvg } from './infinity.js';
import { leafSvg } from './leaf.js';
import { lightningSvg } from './lightning.js';
import { moonSvg } from './moon.js';
import { spiralSvg } from './spiral.js';
import { squareSvg } from './square.js';
import { starSvg } from './star.js';
import { sunSvg } from './sun.js';
import { triangleSvg } from './triangle.js';
import { waveSvg } from './wave.js';

export const shapeIcons = {
  heart: heartSvg,
  star: starSvg,
  diamond: diamondSvg,
  hexagon: hexagonSvg,
  'double-circle': doubleCircleSvg,
  circle: circleSvg,
  square: squareSvg,
  triangle: triangleSvg,
  cloud: cloudSvg,
  lightning: lightningSvg,
  moon: moonSvg,
  sun: sunSvg,
  infinity: infinitySvg,
  leaf: leafSvg,
  wave: waveSvg,
  spiral: spiralSvg
} as const;
