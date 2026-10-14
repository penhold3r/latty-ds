import type { SnackbarVariant, SnackbarLabels } from '../snackbar/snackbar.types';

/** Options for `lt-snackbar-group`'s `show()` method. */
export interface SnackbarShowOptions {
  /** Notification text. Plain text only (set via `textContent`) — for rich/slotted content, use a standalone `<lt-snackbar>` directly instead. */
  message: string;
  /** Visual style. @default 'default' */
  variant?: SnackbarVariant;
  /** Auto-dismiss delay in milliseconds. Set to 0 to disable auto-dismiss. @default 4000 */
  duration?: number;
  /** Show a dismiss button. @default true */
  closable?: boolean;
  /** Label for the optional action button. */
  actionLabel?: string;
  /** Icon to show before the message. See `lt-snackbar`'s own `icon` property for the full behavior. */
  icon?: string;
  /** Overridable UI text (the close button's accessible name), for i18n. */
  labels?: Partial<SnackbarLabels>;
  /** Called once if the action button is clicked. */
  onAction?: (e: Event) => void;
}
