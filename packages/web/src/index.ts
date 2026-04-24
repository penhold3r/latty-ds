/**
 * @latty/web - Web components for the Latty Design System
 *
 * A collection of reusable, accessible web components built with Lit.
 *
 * Available components:
 * - Accordion: Collapsible content using native details/summary
 * - Alert: TODO: describe the Alert component
 * - Button: Interactive button with multiple variants and loading states
 * - Checkbox: Checkbox input with support for indeterminate state
 * - Dialog: Modal dialog with backdrop and accessibility features
 * - List: Ordered and unordered lists with customizable marker colors
 * - ListItem: List item component that enables proper nesting of lists
 * - Radio: Radio button for single selection within a group
 * - RadioGroup: Container for managing radio button groups
 * - Switch: Toggle switch with sliding animation
 * - Spinner: Loading indicator with customizable size and color
 * - Textfield: Text input with validation states and password toggle
 * - Select: Dropdown select with customizable options and variants
 * - Snackbar: TODO: describe the Snackbar component
 * - Surface: Container component with elevation and surface styling
 * - Tab: Individual tab element for use within tab groups
 * - TabGroup: Container for managing tabbed interfaces
 * - Table: Data table with sorting and responsive design
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
 * <lt-button variant="primary" icon="save" loading>
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

export * from './components/accordion';
export * from './components/button';
export * from './components/chip';
export * from './components/checkbox';
export * from './components/dialog';
export * from './components/list';
export * from './components/list-item';
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
