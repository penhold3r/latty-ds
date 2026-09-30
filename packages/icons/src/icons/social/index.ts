import { discordSvg } from './discord.js';
import { dribbbleSvg } from './dribbble.js';
import { facebookSvg } from './facebook.js';
import { githubSvg } from './github.js';
import { instagramSvg } from './instagram.js';
import { linkedinSvg } from './linkedin.js';
import { slackSvg } from './slack.js';
import { telegramSvg } from './telegram.js';
import { tiktokSvg } from './tiktok.js';
import { whatsappSvg } from './whatsapp.js';
import { whatsappInverseSvg } from './whatsapp-inverse.js';
import { xSvg } from './x.js';
import { youtubeSvg } from './youtube.js';
import { youtubeInverseSvg } from './youtube-inverse.js';

export const socialIcons = {
  x: xSvg,
  instagram: instagramSvg,
  github: githubSvg,
  youtube: youtubeSvg,
  'youtube-inverse': youtubeInverseSvg,
  linkedin: linkedinSvg,
  whatsapp: whatsappSvg,
  'whatsapp-inverse': whatsappInverseSvg,
  facebook: facebookSvg,
  tiktok: tiktokSvg,
  discord: discordSvg,
  telegram: telegramSvg,
  slack: slackSvg,
  dribbble: dribbbleSvg
} as const;
