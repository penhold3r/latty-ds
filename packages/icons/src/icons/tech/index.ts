import { bluetoothSvg } from './bluetooth';
import { codeSvg } from './code';
import { cpuSvg } from './cpu';
import { databaseSvg } from './database';
import { fingerprintSvg } from './fingerprint';
import { keySvg } from './key';
import { mobileSvg } from './mobile';
import { monitorSvg } from './monitor';
import { packageSvg } from './package';
import { plugSvg } from './plug';
import { satelliteSvg } from './satellite';
import { serverSvg } from './server';
import { terminalSvg } from './terminal';
import { wifiSvg } from './wifi';

export const techIcons = {
  code: codeSvg,
  terminal: terminalSvg,
  database: databaseSvg,
  server: serverSvg,
  wifi: wifiSvg,
  bluetooth: bluetoothSvg,
  cpu: cpuSvg,
  monitor: monitorSvg,
  mobile: mobileSvg,
  key: keySvg,
  fingerprint: fingerprintSvg,
  plug: plugSvg,
  package: packageSvg,
  satellite: satelliteSvg
} as const;
