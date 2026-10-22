import { bikeSvg } from './bike.js';
import { carSvg } from './car.js';
import { planeSvg } from './plane.js';
import { shipSvg } from './ship.js';
import { truckSvg } from './truck.js';

export const transportationIcons = {
  bike: bikeSvg,
  car: carSvg,
  plane: planeSvg,
  ship: shipSvg,
  truck: truckSvg
} as const;
