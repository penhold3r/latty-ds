/**
 * @latty-ds/web - Web components for the Latty Design System
 *
 * A collection of reusable, accessible web components built with Lit.
 *
 * Importing this entry point registers every `lt-*` custom element (see the
 * `export *` list below for the full set). Each component also has its own
 * module under `./components/<name>` for granular imports. Per-component docs
 * live at https://latty-ds — and in each component's source JSDoc.
 *
 * @packageDocumentation
 *
 * @example
 * Import and use components:
 * ```typescript
 * import '@latty-ds/web';
 * ```
 *
 * ```html
 * <lt-button variant="primary" icon-start="save" loading>
 *   Save Changes
 * </lt-button>
 *
 * <lt-textfield
 *   label="Email"
 *   type="email"
 *   variant="error"
 *   helper-text="Please enter a valid email"
 *   required
 * ></lt-textfield>
 *
 * <lt-spinner size="lg" variant="primary"></lt-spinner>
 * ```
 */

export type { LattyIconName } from '@latty-ds/icons';

export * from './base';
export * from './components/accordion';
export * from './components/button';
export * from './components/chip';
export * from './components/checkbox';
export * from './components/dialog';
export * from './components/list';
export * from './components/radio';
export * from './components/radio-group';
export * from './components/select';
export * from './components/spinner';
export * from './components/surface';
export * from './components/switch';
export * from './components/tab';
export * from './components/tab-group';
export * from './components/table';
export * from './components/textfield';
export * from './components/avatar';
export * from './components/badge';
export * from './components/tooltip';
export * from './components/snackbar';
export * from './components/alert';
export * from './components/slider';
export * from './components/dropdown';
export * from './components/header';
export * from './components/nav';
export * from './components/link';
export * from './components/text';
export * from './components/breadcrumb';
export * from './components/divider';
export * from './components/progress';
export * from './components/skeleton';
export * from './components/sidepanel';
export * from './components/image';
export * from './components/pagination';
export * from './components/datepicker';
export * from './components/date-input';
export * from './components/combobox';
export * from './components/calendar';
export * from './components/icon-button';
export * from './components/color-input';
