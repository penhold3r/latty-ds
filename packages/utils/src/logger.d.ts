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
declare class Logger {
    #private;
    /**
     * ANSI escape codes for terminal colors.
     */
    static colors: {
        reset: string;
        info: string;
        warn: string;
        error: string;
        success: string;
        timestamp: string;
    };
    /**
     * Unicode icons for each log level.
     */
    static icons: {
        info: string;
        warn: string;
        error: string;
        success: string;
    };
    /**
     * Logs an informational message (cyan).
     * Suppressed when LATTY_SILENT=true.
     *
     * @param msg - Message to log
     */
    info(msg: string): void;
    /**
     * Logs a warning message (yellow).
     * Always shown regardless of SILENT mode.
     *
     * @param msg - Message to log
     */
    warn(msg: string): void;
    /**
     * Logs an error message (red).
     * Always shown regardless of SILENT mode.
     *
     * @param msg - Message to log
     */
    error(msg: string): void;
    /**
     * Logs a success message (green).
     *
     * @param msg - Message to log
     */
    success(msg: string): void;
}
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
declare const logger: Logger;
export { logger };
