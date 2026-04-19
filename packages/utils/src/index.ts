/**
 * @latty/utils - Utility functions for the Latty Design System
 *
 * Provides common utility functions including:
 * - Colorized console logger with timestamps and icons
 * - String manipulation utilities (toTitleCase)
 *
 * @packageDocumentation
 *
 * @example
 * Using the logger:
 * ```typescript
 * import { logger } from '@latty/utils';
 *
 * logger.info('Processing data...');
 * logger.success('Operation completed');
 * logger.warn('Deprecated feature used');
 * logger.error('Something went wrong');
 * ```
 *
 * @example
 * String utilities:
 * ```typescript
 * import { toTitleCase } from '@latty/utils';
 *
 * toTitleCase('hello-world'); // "Hello World"
 * toTitleCase('camelCase');   // "Camel Case"
 * toTitleCase('snake_case');  // "Snake Case"
 * ```
 */

export * from './logger';
export * from './strings';
