# Component catalog

All 40 components, their tag name(s), and a one-line description. For exact props, slots, and events, see `node_modules/@latty-ds/web/custom-elements.json` after installing — this table is for orientation and discovery, not a full API reference.

| Name        | Tag(s)                        | Description                                                                   |
| ----------- | ----------------------------- | ----------------------------------------------------------------------------- |
| Accordion   | `lt-accordion`                | Collapsible content panels with optional icons and fill styles                |
| Alert       | `lt-alert`                    | Inline status message with optional icon and dismiss button                   |
| Avatar      | `lt-avatar`                   | User or entity image with fallback to initials                                |
| Badge       | `lt-badge`                    | Small label for status, counts, or categories                                 |
| Breadcrumb  | `lt-breadcrumb`               | Hierarchical navigation trail                                                 |
| Button      | `lt-button`                   | Interactive control with variant, appearance, and icon slots                  |
| Calendar    | `lt-calendar`                 | Interactive date and date-range picker grid                                   |
| Checkbox    | `lt-checkbox`                 | Boolean form input with indeterminate state                                   |
| Chip        | `lt-chip`                     | Compact tag for filters, selections, or metadata                              |
| Color Input | `lt-color-input`              | Read-only field that opens the native color picker with a live swatch preview |
| Combobox    | `lt-combobox`                 | Searchable single-select dropdown with keyboard filtering                     |
| Date Input  | `lt-date-input`               | Cross-browser date field with locale-aware formatting and a calendar popover  |
| Datepicker  | `lt-datepicker`               | Styled wrapper around the native date, time, and datetime-local inputs        |
| Dialog      | `lt-dialog`                   | Modal overlay for confirmations and focused interactions                      |
| Divider     | `lt-divider`                  | Horizontal or vertical rule with solid, dashed, or dotted appearance          |
| Dropdown    | `lt-dropdown`                 | Anchored popover menu triggered by a slotted element                          |
| Header      | `lt-header`                   | Top app bar with title, navigation, and action slots                          |
| Icon Button | `lt-icon-button`              | Square or circular button containing a single icon                            |
| Image       | `lt-image`                    | Responsive image with lazy loading and aspect-ratio control                   |
| Link        | `lt-link`                     | Inline anchor styled with the design system                                   |
| List        | `lt-list` · `lt-list-item`    | Vertical list container with icon, divider, and marker options                |
| Navigation  | `lt-nav` · `lt-nav-item`      | Sidebar navigation with grouped items and active state                        |
| Pagination  | `lt-pagination`               | Page navigation for paged data sets with ellipsis windowing                   |
| Progress    | `lt-progress`                 | Linear progress bar with determinate and indeterminate modes                  |
| Radio       | `lt-radio` (`lt-radio-group`) | Single-select form input, typically used in a group                           |
| Select      | `lt-select`                   | Styled dropdown for choosing one option from a list                           |
| SidePanel   | `lt-sidepanel`                | Sliding drawer anchored to the left or right viewport edge                    |
| Skeleton    | `lt-skeleton`                 | Loading placeholder in text, rect, or circle shapes                           |
| Slider      | `lt-slider`                   | Range input for selecting a value within a bounded range                      |
| Snackbar    | `lt-snackbar`                 | Transient notification anchored to the bottom of the viewport                 |
| Spinner     | `lt-spinner`                  | Circular indeterminate loading indicator                                      |
| Surface     | `lt-surface`                  | Elevated container for cards, panels, and layered layouts                     |
| Switch      | `lt-switch`                   | Toggle control for binary on/off settings                                     |
| Tab         | `lt-tab-group` · `lt-tab`     | Tabbed navigation with default and pills appearances                          |
| Table       | `lt-table`                    | Data grid with sortable columns, striped rows, and hoverable state            |
| Text        | `lt-text`                     | Typography component for headings, body, and label styles                     |
| Textfield   | `lt-textfield`                | Text input with label, helper text, icon slots, and validation states         |
| Tooltip     | `lt-tooltip`                  | Non-interactive floating label on hover or focus                              |

## Shared prop vocabulary

Many components share the same prop names with consistent meaning across the system — recognize these instead of treating each component's props as bespoke.

| Prop                          | Controls                                                            | Values                                                                                 | Used on                                                             |
| ----------------------------- | ------------------------------------------------------------------- | -------------------------------------------------------------------------------------- | ------------------------------------------------------------------- |
| `variant`                     | Semantic color palette                                              | `primary`, `secondary`, `success`, `warning`, `error`, `info`, `neutral`, `default`    | Button, Badge, Alert, Chip, Snackbar, Progress, Spinner…            |
| `appearance`                  | Visual fill style                                                   | `filled`, `outlined`, `ghost`, `solid`, `clean`, `dashed`, `dotted`                    | Button, Badge, Alert, Chip, Surface, Divider, Accordion, Tab group… |
| `shape`                       | Geometric / structural form                                         | `circle`, `square`, `rect`, `text`                                                     | Skeleton                                                            |
| `background`                  | Predefined surface color the element sits on                        | `primary`, `surface`                                                                   | Header                                                              |
| `background` (color override) | Custom background — overrides variant/appearance-derived background | hex value or CSS custom property                                                       | Surface, Tooltip, Alert, Chip                                       |
| `size`                        | Component scale                                                     | `sm`, `md`, `lg`                                                                       | Button, Badge, Chip, Textfield, Slider, Tab group…                  |
| `placement`                   | Position of floating / overlay elements                             | `top`, `bottom`, `left`, `right`, `top-start`, `top-end`, `bottom-start`, `bottom-end` | Tooltip, Dropdown                                                   |
| `anchor`                      | Viewport edge the panel attaches to                                 | `left`, `right`                                                                        | SidePanel                                                           |
| `icon-start`                  | Leading icon (before label)                                         | any icon name, e.g. `home`, `settings`                                                 | Button, Textfield, Tab, Accordion, List item, Nav item…             |
| `icon-end`                    | Trailing icon (after label)                                         | any icon name                                                                          | Button, List item                                                   |
| `icon`                        | Standalone status / decorative icon                                 | `""`, `"none"`, or any icon name to override                                           | Alert, Snackbar                                                     |

## Next

- [`decision-guide.md`](./decision-guide.md) — pick the right component for a UI task
- [`patterns.md`](./patterns.md) — see components composed together
