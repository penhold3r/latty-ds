import { banknoteSvg } from './banknote.js';
import { coinsSvg } from './coins.js';
import { creditCardSvg } from './credit-card.js';
import { giftSvg } from './gift.js';
import { percentSvg } from './percent.js';
import { receiptSvg } from './receipt.js';
import { shoppingCartSvg } from './shopping-cart.js';
import { walletSvg } from './wallet.js';

export const commerceIcons = {
  banknote: banknoteSvg,
  coins: coinsSvg,
  'credit-card': creditCardSvg,
  gift: giftSvg,
  percent: percentSvg,
  receipt: receiptSvg,
  'shopping-cart': shoppingCartSvg,
  wallet: walletSvg
} as const;
