import { bluetoothSvg } from './bluetooth.js';
import { codeSvg } from './code.js';
import { cpuSvg } from './cpu.js';
import { databaseSvg } from './database.js';
import { fingerprintSvg } from './fingerprint.js';
import { keySvg } from './key.js';
import { mobileSvg } from './mobile.js';
import { monitorSvg } from './monitor.js';
import { packageSvg } from './package.js';
import { plugSvg } from './plug.js';
import { satelliteSvg } from './satellite.js';
import { serverSvg } from './server.js';
import { terminalSvg } from './terminal.js';
import { wifiSvg } from './wifi.js';

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
