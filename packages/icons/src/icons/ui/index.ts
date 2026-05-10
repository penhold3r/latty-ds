import { atSignSvg } from './at-sign';
import { bellSvg } from './bell';
import { calendarSvg } from './calendar';
import { chartSvg } from './chart';
import { clockSvg } from './clock';
import { columnsSvg } from './columns';
import { folderSvg } from './folder';
import { gridSvg } from './grid';
import { hashSvg } from './hash';
import { homeSvg } from './home';
import { imageSvg } from './image';
import { layersSvg } from './layers';
import { listViewSvg } from './list-view';
import { mailSvg } from './mail';
import { menuSvg } from './menu';
import { phoneSvg } from './phone';
import { searchSvg } from './search';
import { settingsSvg } from './settings';
import { sidebarSvg } from './sidebar';
import { userSvg } from './user';

export const uiIcons = {
  search: searchSvg,
  menu: menuSvg,
  settings: settingsSvg,
  home: homeSvg,
  user: userSvg,
  bell: bellSvg,
  calendar: calendarSvg,
  clock: clockSvg,
  mail: mailSvg,
  phone: phoneSvg,
  chart: chartSvg,
  folder: folderSvg,
  grid: gridSvg,
  'list-view': listViewSvg,
  columns: columnsSvg,
  image: imageSvg,
  layers: layersSvg,
  'at-sign': atSignSvg,
  hash: hashSvg,
  sidebar: sidebarSvg
} as const;
