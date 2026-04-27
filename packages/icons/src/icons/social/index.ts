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
import { xSvg } from './x';
import { youtubeSvg } from './youtube';

export const socialIcons: Record<string, string> = {
  'x': xSvg,
  'instagram': instagramSvg,
  'github': githubSvg,
  'youtube': youtubeSvg,
  'linkedin': linkedinSvg,
  'whatsapp': whatsappSvg,
  'facebook': facebookSvg,
  'tiktok': tiktokSvg,
  'discord': discordSvg,
  'telegram': telegramSvg,
  'slack': slackSvg,
  'dribbble': dribbbleSvg,
};
