import { cakeSvg } from './cake.js';
import { coffeeSvg } from './coffee.js';
import { drinkSvg } from './drink.js';
import { foodSvg } from './food.js';
import { iceCreamSvg } from './ice-cream.js';
import { pizzaSvg } from './pizza.js';

export const foodIcons = {
  drink: drinkSvg,
  food: foodSvg,
  pizza: pizzaSvg,
  cake: cakeSvg,
  'ice-cream': iceCreamSvg,
  coffee: coffeeSvg
} as const;
