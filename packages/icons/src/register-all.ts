/*
 * Registers every built-in icon before the lt-icon element is defined.
 *
 * Imported by index.ts (the main entry) as a side-effect module, placed before
 * the ./components/icon.js import so that when `@customElement('lt-icon')` runs
 * (which synchronously upgrades any pre-rendered <lt-icon> in the DOM), the
 * registry already has data and the upgrade doesn't log spurious "not found"
 * warnings.
 *
 * Per-icon entry points (src/entries/*.ts) don't need this — they register their
 * own icon data before importing the element module.
 */
import { iconRegistry } from './registry/icon-registry.js';
import { lattyIcons } from './icons/index.js';

iconRegistry.registerIcons(lattyIcons);
