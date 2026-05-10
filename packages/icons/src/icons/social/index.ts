import { discordSvg } from './discord';
import { dribbbleSvg } from './dribbble';
import { facebookSvg } from './facebook';
import { githubSvg } from './github';
import { instagramSvg } from './instagram';
import { linkedinSvg } from './linkedin';
import { slackSvg } from './slack';
import { telegramSvg } from './telegram';
import { tiktokSvg } from './tiktok';
import { whatsappSvg } from './whatsapp';
import { whatsappInverseSvg } from './whatsapp-inverse';
import { xSvg } from './x';
import { youtubeSvg } from './youtube';
import { youtubeInverseSvg } from './youtube-inverse';

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
