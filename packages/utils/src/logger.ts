/* eslint-disable no-console */

const SILENT = process.env.LATTY_SILENT === 'true';

/**
 * Colorized console logger for the Latty Design System.
 * Provides formatted output with timestamps, icons, and color-coded severity levels.
 *
 * Supports four log levels:
 * - info: General information (cyan, can be silenced)
 * - warn: Warnings (yellow)
 * - error: Errors (red)
 * - success: Success messages (green).
 * @example
 * ```typescript
 * import { logger } from '@latty-ds/utils';
 *
 * logger.info('Processing tokens...');
 * logger.success('Tokens generated successfully');
 * logger.warn('Deprecated color name used');
 * logger.error('Failed to parse config');
 * ```
 */
class Logger {
  /**
   * ANSI escape codes for terminal colors.
   */
  static colors = {
    reset: '\x1b[0m',
    info: '\x1b[36m', // Cyan
    warn: '\x1b[33m', // Yellow
    error: '\x1b[31m', // Red
    success: '\x1b[32m', // Green
    timestamp: '\x1b[90m' // Gray
  };

  /**
   * Unicode icons for each log level.
   */
  static icons = {
    info: 'ⓘ',
    warn: '⚠',
    error: '×',
    success: '✓'
  };

  /**
   * Generates a formatted timestamp string.
   * @returns {string} Colored timestamp in [HH:MM:SS] format.
   * @private
   */
  #getTimestamp() {
    return `${Logger.colors.timestamp}[${new Date().toLocaleTimeString()}]${Logger.colors.reset}`;
  }

  /**
   * Formats a log message with timestamp, level, icon, and color.
   * @param {string} level - Log level name.
   * @param {string} color - ANSI color code.
   * @param {string} icon - Unicode icon character.
   * @param {string} message - Message to log.
   * @returns {string} Formatted log string.
   * @private
   */
  #format(level: string, color: string, icon: string, message: string) {
    const label = `${color}${icon} ${level.toUpperCase()}`;
    return `${this.#getTimestamp()} ${label}: ${message}${Logger.colors.reset}`;
  }

  /**
   * Logs an informational message (cyan).
   * Suppressed when LATTY_SILENT=true.
   * @param {string} msg - Message to log.
   * @returns {void}
   */
  info(msg: string) {
    if (SILENT) return;

    console.log(this.#format('info', Logger.colors.info, Logger.icons.info, msg));
  }

  /**
   * Logs a warning message (yellow).
   * Always shown regardless of SILENT mode.
   * @param {string} msg - Message to log.
   * @returns {void}
   */
  warn(msg: string) {
    console.warn(this.#format('warn', Logger.colors.warn, Logger.icons.warn, msg));
  }

  /**
   * Logs an error message (red).
   * Always shown regardless of SILENT mode.
   * @param {string} msg - Message to log.
   * @returns {void}
   */
  error(msg: string) {
    console.error(this.#format('error', Logger.colors.error, Logger.icons.error, msg));
  }

  /**
   * Logs a success message (green).
   * @param {string} msg - Message to log.
   * @returns {void}
   */
  success(msg: string) {
    console.log(this.#format('success', Logger.colors.success, Logger.icons.success, msg));
  }
}

/**
 * Singleton logger instance.
 * Import and use this instance throughout the application.
 * @example
 * ```typescript
 * import { logger } from '@latty-ds/utils';
 * logger.info('Starting build process');
 * ```
 */
const logger = new Logger();

export { logger };
