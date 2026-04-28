import { bellSvg } from './bell';
import { calendarSvg } from './calendar';
import { chartSvg } from './chart';
import { clockSvg } from './clock';
import { folderSvg } from './folder';
import { homeSvg } from './home';
import { mailSvg } from './mail';
import { menuSvg } from './menu';
import { phoneSvg } from './phone';
import { searchSvg } from './search';
import { settingsSvg } from './settings';
import { userSvg } from './user';

export const uiIcons = {
  'search': searchSvg,
  'menu': menuSvg,
  'settings': settingsSvg,
  'home': homeSvg,
  'user': userSvg,
  'bell': bellSvg,
  'calendar': calendarSvg,
  'clock': clockSvg,
  'mail': mailSvg,
  'phone': phoneSvg,
  'chart': chartSvg,
  'folder': folderSvg,
} as const;
