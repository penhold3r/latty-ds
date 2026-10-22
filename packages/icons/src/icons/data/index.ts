import { activitySvg } from './activity.js';
import { gaugeSvg } from './gauge.js';
import { pieChartSvg } from './pie-chart.js';
import { trendingUpSvg } from './trending-up.js';

export const dataIcons = {
  activity: activitySvg,
  gauge: gaugeSvg,
  'pie-chart': pieChartSvg,
  'trending-up': trendingUpSvg
} as const;
