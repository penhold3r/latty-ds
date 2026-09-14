export interface ComponentEntry {
  name: string;
  tag: string;
  href: string;
  desc: string;
}

export const components: ComponentEntry[] = [
  {
    name: 'Accordion',
    tag: 'lt-accordion',
    href: '/components/accordion',
    desc: 'Collapsible content panels with optional icons and fill styles'
  },
  {
    name: 'Alert',
    tag: 'lt-alert',
    href: '/components/alert',
    desc: 'Inline status message with optional icon and dismiss button'
  },
  {
    name: 'Avatar',
    tag: 'lt-avatar',
    href: '/components/avatar',
    desc: 'User or entity image with fallback to initials'
  },
  {
    name: 'Badge',
    tag: 'lt-badge',
    href: '/components/badge',
    desc: 'Small label for status, counts, or categories'
  },
  {
    name: 'Breadcrumb',
    tag: 'lt-breadcrumb',
    href: '/components/breadcrumb',
    desc: 'Hierarchical navigation trail'
  },
  {
    name: 'Button',
    tag: 'lt-button',
    href: '/components/button',
    desc: 'Interactive control with variant, appearance, and icon slots'
  },
  {
    name: 'Calendar',
    tag: 'lt-calendar',
    href: '/components/calendar',
    desc: 'Interactive date and date-range picker grid'
  },
  {
    name: 'Checkbox',
    tag: 'lt-checkbox',
    href: '/components/checkbox',
    desc: 'Boolean form input with indeterminate state'
  },
  {
    name: 'Chip',
    tag: 'lt-chip',
    href: '/components/chip',
    desc: 'Compact tag for filters, selections, or metadata'
  },
  {
    name: 'Color Input',
    tag: 'lt-color-input',
    href: '/components/color-input',
    desc: 'Read-only field that opens the native color picker with a live swatch preview'
  },
  {
    name: 'Combobox',
    tag: 'lt-combobox',
    href: '/components/combobox',
    desc: 'Searchable single-select dropdown with keyboard filtering'
  },
  {
    name: 'Date Input',
    tag: 'lt-date-input',
    href: '/components/date-input',
    desc: 'Cross-browser date field with locale-aware formatting and a calendar popover'
  },
  {
    name: 'Datepicker',
    tag: 'lt-datepicker',
    href: '/components/datepicker',
    desc: 'Styled wrapper around the native date, time, and datetime-local inputs'
  },
  {
    name: 'Dialog',
    tag: 'lt-dialog',
    href: '/components/dialog',
    desc: 'Modal overlay for confirmations and focused interactions'
  },
  {
    name: 'Divider',
    tag: 'lt-divider',
    href: '/components/divider',
    desc: 'Horizontal or vertical rule with solid, dashed, or dotted appearance'
  },
  {
    name: 'Dropdown',
    tag: 'lt-dropdown',
    href: '/components/dropdown',
    desc: 'Anchored popover menu triggered by a slotted element'
  },
  {
    name: 'Header',
    tag: 'lt-header',
    href: '/components/header',
    desc: 'Top app bar with title, navigation, and action slots'
  },
  {
    name: 'Icon Button',
    tag: 'lt-icon-button',
    href: '/components/icon-button',
    desc: 'Square or circular button containing a single icon'
  },
  {
    name: 'Image',
    tag: 'lt-image',
    href: '/components/image',
    desc: 'Responsive image with lazy loading and aspect-ratio control'
  },
  {
    name: 'Link',
    tag: 'lt-link',
    href: '/components/link',
    desc: 'Inline anchor styled with the design system'
  },
  {
    name: 'List',
    tag: 'lt-list · lt-list-item',
    href: '/components/list',
    desc: 'Vertical list container with icon, divider, and marker options'
  },
  {
    name: 'Navigation',
    tag: 'lt-nav · lt-nav-item',
    href: '/components/navigation',
    desc: 'Sidebar navigation with grouped items and active state'
  },
  {
    name: 'Pagination',
    tag: 'lt-pagination',
    href: '/components/pagination',
    desc: 'Page navigation for paged data sets with ellipsis windowing'
  },
  {
    name: 'Progress',
    tag: 'lt-progress',
    href: '/components/progress',
    desc: 'Linear progress bar with determinate and indeterminate modes'
  },
  {
    name: 'Radio',
    tag: 'lt-radio',
    href: '/components/radio',
    desc: 'Single-select form input, typically used in a group'
  },
  {
    name: 'Select',
    tag: 'lt-select',
    href: '/components/select',
    desc: 'Styled dropdown for choosing one option from a list'
  },
  {
    name: 'SidePanel',
    tag: 'lt-sidepanel',
    href: '/components/sidepanel',
    desc: 'Sliding drawer anchored to the left or right viewport edge'
  },
  {
    name: 'Skeleton',
    tag: 'lt-skeleton',
    href: '/components/skeleton',
    desc: 'Loading placeholder in text, rect, or circle shapes'
  },
  {
    name: 'Slider',
    tag: 'lt-slider',
    href: '/components/slider',
    desc: 'Range input for selecting a value within a bounded range'
  },
  {
    name: 'Snackbar',
    tag: 'lt-snackbar',
    href: '/components/snackbar',
    desc: 'Transient notification anchored to the bottom of the viewport'
  },
  {
    name: 'Spinner',
    tag: 'lt-spinner',
    href: '/components/spinner',
    desc: 'Circular indeterminate loading indicator'
  },
  {
    name: 'Surface',
    tag: 'lt-surface',
    href: '/components/surface',
    desc: 'Elevated container for cards, panels, and layered layouts'
  },
  {
    name: 'Switch',
    tag: 'lt-switch',
    href: '/components/switch',
    desc: 'Toggle control for binary on/off settings'
  },
  {
    name: 'Tab',
    tag: 'lt-tab-group · lt-tab',
    href: '/components/tab',
    desc: 'Tabbed navigation with default and pills appearances'
  },
  {
    name: 'Table',
    tag: 'lt-table',
    href: '/components/table',
    desc: 'Data grid with sortable columns, striped rows, and hoverable state'
  },
  {
    name: 'Text',
    tag: 'lt-text',
    href: '/components/text',
    desc: 'Typography component for headings, body, and label styles'
  },
  {
    name: 'Textfield',
    tag: 'lt-textfield',
    href: '/components/textfield',
    desc: 'Text input with label, helper text, icon slots, and validation states'
  },
  {
    name: 'Tooltip',
    tag: 'lt-tooltip',
    href: '/components/tooltip',
    desc: 'Non-interactive floating label on hover or focus'
  }
];

export interface PropConvention {
  prop: string;
  controls: string;
  values?: string[];
  valuesNote?: string;
  usedOn: string;
}

export const propConventions: PropConvention[] = [
  {
    prop: 'variant',
    controls: 'Semantic color palette',
    values: ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral', 'default'],
    usedOn: 'Button, Badge, Alert, Chip, Snackbar, Progress, Spinner…'
  },
  {
    prop: 'appearance',
    controls: 'Visual fill style',
    values: ['filled', 'outlined', 'ghost', 'solid', 'clean', 'dashed', 'dotted'],
    usedOn: 'Button, Badge, Alert, Chip, Surface, Divider, Accordion, Tab group…'
  },
  {
    prop: 'shape',
    controls: 'Geometric / structural form',
    values: ['circle', 'square', 'rect', 'text'],
    usedOn: 'Skeleton'
  },
  {
    prop: 'background',
    controls: 'Surface color the element sits on (predefined set)',
    values: ['primary', 'surface'],
    usedOn: 'Header'
  },
  {
    prop: 'background (color override)',
    controls: 'Custom background — overrides variant/appearance-derived background',
    valuesNote: 'Hex value or CSS custom property',
    usedOn: 'Surface, Tooltip, Alert, Chip'
  },
  {
    prop: 'size',
    controls: 'Component scale',
    values: ['sm', 'md', 'lg'],
    usedOn: 'Button, Badge, Chip, Textfield, Slider, Tab group…'
  },
  {
    prop: 'placement',
    controls: 'Position of floating / overlay elements',
    values: ['top', 'bottom', 'left', 'right', 'top-start', 'top-end', 'bottom-start', 'bottom-end'],
    usedOn: 'Tooltip, Dropdown'
  },
  {
    prop: 'anchor',
    controls: 'Viewport edge the panel attaches to',
    values: ['left', 'right'],
    usedOn: 'SidePanel'
  },
  {
    prop: 'icon-start',
    controls: 'Leading icon (before label)',
    valuesNote: 'Any icon name, e.g. home, settings',
    usedOn: 'Button, Textfield, Tab, Accordion, List item, Nav item…'
  },
  {
    prop: 'icon-end',
    controls: 'Trailing icon (after label)',
    valuesNote: 'Any icon name',
    usedOn: 'Button, List item'
  },
  {
    prop: 'icon',
    controls: 'Standalone status / decorative icon',
    values: ['""', '"none"'],
    valuesNote: 'or any icon name to override',
    usedOn: 'Alert, Snackbar'
  }
];
