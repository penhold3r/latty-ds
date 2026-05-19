/**
 * @latty/web - Web components for the Latty Design System
 *
 * A collection of reusable, accessible web components built with Lit.
 *
 * Available components:
 * - Accordion: Collapsible content using native details/summary
 * - Alert: TODO: describe the Alert component
 * - Button: Interactive button with multiple variants and loading states
 * - Calendar: TODO: describe the Calendar component
 * - Checkbox: Checkbox input with support for indeterminate state
 * - Dialog: Modal dialog with backdrop and accessibility features
 * - Dropdown: TODO: describe the Dropdown component
 * - Header: TODO: describe the Header component
 * - Image: TODO: describe the Image component
 * - Link: TODO: describe the Link component
 * - List: Ordered and unordered lists with customizable marker colors
 * - Radio: Radio button for single selection within a group
 * - RadioGroup: Container for managing radio button groups
 * - Switch: Toggle switch with sliding animation
 * - Spinner: Loading indicator with customizable size and color
 * - Textfield: Text input with validation states and password toggle
 * - Select: Dropdown select with customizable options and variants
 * - SidePanel: TODO: describe the SidePanel component
 * - Slider: TODO: describe the Slider component
 * - Snackbar: TODO: describe the Snackbar component
 * - Surface: Container component with elevation and surface styling
 * - Tab: Individual tab element for use within tab groups
 * - TabGroup: Container for managing tabbed interfaces
 * - Table: Data table with sorting and responsive design
 * - Text: TODO: describe the Text component
 * - Tooltip: Floating label anchored to a trigger element
 *
 * @packageDocumentation
 *
 * @example
 * Import and use components:
 * ```typescript
 * import '@latty/web';
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

export type { LattyIconName } from '@latty/icons';

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
export * from './components/combobox';
export * from './components/calendar';
