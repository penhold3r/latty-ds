var __classPrivateFieldGet = (this && this.__classPrivateFieldGet) || function (receiver, state, kind, f) {
    if (kind === "a" && !f) throw new TypeError("Private accessor was defined without a getter");
    if (typeof state === "function" ? receiver !== state || !f : !state.has(receiver)) throw new TypeError("Cannot read private member from an object whose class did not declare it");
    return kind === "m" ? f : kind === "a" ? f.call(receiver) : f ? f.value : state.get(receiver);
};
var _Logger_instances, _a, _Logger_getTimestamp, _Logger_format;
/**
 * Controls whether info logs should be suppressed.
 * Set via LATTY_SILENT environment variable.
 */
const SILENT = process.env.LATTY_SILENT === 'true';
/**
 * Colorized console logger for the Latty Design System.
 * Provides formatted output with timestamps, icons, and color-coded severity levels.
 *
 * Supports four log levels:
 * - info: General information (cyan, can be silenced)
 * - warn: Warnings (yellow)
 * - error: Errors (red)
 * - success: Success messages (green)
 *
 * @example
 * ```typescript
 * import { logger } from '@latty/utils';
 *
 * logger.info('Processing tokens...');
 * logger.success('Tokens generated successfully');
 * logger.warn('Deprecated color name used');
 * logger.error('Failed to parse config');
 * ```
 */
class Logger {
    constructor() {
        _Logger_instances.add(this);
    }
    /**
     * Logs an informational message (cyan).
     * Suppressed when LATTY_SILENT=true.
     *
     * @param msg - Message to log
     */
    info(msg) {
        if (SILENT)
            return;
        console.log(__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_format).call(this, 'info', _a.colors.info, _a.icons.info, msg));
    }
    /**
     * Logs a warning message (yellow).
     * Always shown regardless of SILENT mode.
     *
     * @param msg - Message to log
     */
    warn(msg) {
        console.warn(__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_format).call(this, 'warn', _a.colors.warn, _a.icons.warn, msg));
    }
    /**
     * Logs an error message (red).
     * Always shown regardless of SILENT mode.
     *
     * @param msg - Message to log
     */
    error(msg) {
        console.error(__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_format).call(this, 'error', _a.colors.error, _a.icons.error, msg));
    }
    /**
     * Logs a success message (green).
     *
     * @param msg - Message to log
     */
    success(msg) {
        console.log(__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_format).call(this, 'success', _a.colors.success, _a.icons.success, msg));
    }
}
_a = Logger, _Logger_instances = new WeakSet(), _Logger_getTimestamp = function _Logger_getTimestamp() {
    return `${_a.colors.timestamp}[${new Date().toLocaleTimeString()}]${_a.colors.reset}`;
}, _Logger_format = function _Logger_format(level, color, icon, message) {
    const label = `${color}${icon} ${level.toUpperCase()}`;
    return `${__classPrivateFieldGet(this, _Logger_instances, "m", _Logger_getTimestamp).call(this)} ${label}: ${message}${_a.colors.reset}`;
};
/**
 * ANSI escape codes for terminal colors.
 */
Logger.colors = {
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
Logger.icons = {
    info: 'ⓘ',
    warn: '⚠',
    error: '×',
    success: '✓'
};
/**
 * Singleton logger instance.
 * Import and use this instance throughout the application.
 *
 * @example
 * ```typescript
 * import { logger } from '@latty/utils';
 * logger.info('Starting build process');
 * ```
 */
const logger = new Logger();
export { logger };
