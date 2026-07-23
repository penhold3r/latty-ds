# Decision guide — which component for this task?

Organized by UI intent rather than alphabetically. See [`components.md`](./components.md) for the full catalog and [`usage.md`](./usage.md) for how each interaction pattern (slots, events, forms) actually works.

## Getting input from the user

| Need                                                                       | Component                        | Notes                                                                       |
| -------------------------------------------------------------------------- | -------------------------------- | --------------------------------------------------------------------------- |
| Free text (name, email, password, etc.)                                    | `lt-textfield`                   | `type` attribute mirrors native `<input>` types                             |
| A single date                                                              | `lt-date-input`                  | Cross-browser text field with locale formatting + calendar popover          |
| Date, time, or datetime, styled like a native picker                       | `lt-datepicker`                  | Thin styled wrapper around native `<input type="date/time/datetime-local">` |
| A date picked from a visual grid, or a date range                          | `lt-calendar`                    | Interactive grid; supports range selection                                  |
| One choice from a short, always-visible list (2–5 options)                 | `lt-radio-group` (of `lt-radio`) | All options visible at once — best when comparing options matters           |
| One choice from a longer list                                              | `lt-select`                      | Closed dropdown, opens on interaction                                       |
| One choice from a long or searchable list                                  | `lt-combobox`                    | Adds keyboard filtering on top of `lt-select`'s pattern                     |
| A single yes/no or multi-select checkbox                                   | `lt-checkbox`                    | Supports an indeterminate state for "some selected"                         |
| A binary setting that takes effect immediately (not part of a form submit) | `lt-switch`                      | Toggle semantics, not form-submission semantics                             |
| A numeric value within a bounded range                                     | `lt-slider`                      |                                                                             |
| A color value                                                              | `lt-color-input`                 | Opens the native OS color picker, shows a live swatch                       |

## Showing status or metadata

| Need                                              | Component     | Notes                                                     |
| ------------------------------------------------- | ------------- | --------------------------------------------------------- |
| A small count, category, or status label          | `lt-badge`    | Not interactive/removable                                 |
| A removable tag (filters, multi-select summaries) | `lt-chip`     | Can carry a dismiss action                                |
| An inline message that needs the user's attention | `lt-alert`    | Supports icon + dismiss button, sits inline in the layout |
| A transient, auto-dismissing notification         | `lt-snackbar` | Anchored to the viewport, not inline                      |

## Feedback and loading states

| Need                                                    | Component     | Notes                                                                       |
| ------------------------------------------------------- | ------------- | --------------------------------------------------------------------------- |
| "Something is happening, unknown duration"              | `lt-spinner`  | Indeterminate                                                               |
| "Content is loading, here's roughly where it'll appear" | `lt-skeleton` | Placeholder shape (text/rect/circle) matching the eventual content's layout |
| "Here's how far along a known-length operation is"      | `lt-progress` | Supports determinate and indeterminate modes                                |

## Navigation

| Need                                                      | Component                 | Notes                                                                               |
| --------------------------------------------------------- | ------------------------- | ----------------------------------------------------------------------------------- |
| App-level sidebar navigation, possibly with nested groups | `lt-nav` / `lt-nav-item`  | Nested `lt-nav-item`s collapse inline (vertical) or open as a dropdown (horizontal) |
| Switching between sections of content on the same page    | `lt-tab-group` / `lt-tab` | Panels are slotted with a matching `data-value`                                     |
| Showing where the user is in a hierarchy                  | `lt-breadcrumb`           |                                                                                     |
| Navigating pages of a data set                            | `lt-pagination`           | Includes ellipsis windowing for long page counts                                    |

## Overlays

| Need                                                            | Component      | Notes                                                                   |
| --------------------------------------------------------------- | -------------- | ----------------------------------------------------------------------- |
| A confirmation or focused task that blocks the rest of the page | `lt-dialog`    | Modal; named `footer` slot for actions                                  |
| A menu anchored to a trigger element                            | `lt-dropdown`  | Trigger is a slotted element (`slot="trigger"`)                         |
| A short, non-interactive hint on hover/focus                    | `lt-tooltip`   | Not for interactive content — use `lt-dropdown` or `lt-dialog` for that |
| A larger panel of content sliding in from an edge               | `lt-sidepanel` | Anchored `left` or `right`                                              |

## Layout and containers

| Need                                                        | Component    | Notes                                                                                                   |
| ----------------------------------------------------------- | ------------ | ------------------------------------------------------------------------------------------------------- |
| An elevated container for a card, panel, or layered section | `lt-surface` | Provides background, elevation (shadow), and border-radius — prefer this over hand-rolled container CSS |
| A visual separator between sections                         | `lt-divider` | Horizontal or vertical, solid/dashed/dotted                                                             |
| A top app bar                                               | `lt-header`  | Title, navigation, and action slots                                                                     |

## Data display

| Need                      | Component                  | Notes                                                |
| ------------------------- | -------------------------- | ---------------------------------------------------- |
| Tabular data with sorting | `lt-table`                 | Supports sortable columns, striped rows, hover state |
| A vertical list of items  | `lt-list` / `lt-list-item` | Supports icons, dividers, and marker options         |
| A user or entity image    | `lt-avatar`                | Falls back to initials if no image                   |
| A responsive image        | `lt-image`                 | Lazy loading + aspect-ratio control built in         |

## Actions

| Need                | Component        | Notes                                                       |
| ------------------- | ---------------- | ----------------------------------------------------------- |
| A labeled action    | `lt-button`      | Participates in native form submission with `type="submit"` |
| An icon-only action | `lt-icon-button` | Square or circular; always pair with an accessible `label`  |
