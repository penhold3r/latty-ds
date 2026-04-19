import type { Button } from '@web/components/button';
import type { Spinner } from '@web/components/spinner';

declare global {
  interface HTMLElementTagNameMap {
    'lt-button': Button;
    'lt-spinner': Spinner;
  }
}

export {};
