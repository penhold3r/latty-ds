import type { Button } from '../components/button';
import type { Spinner } from '../components/spinner';

declare global {
  interface HTMLElementTagNameMap {
    'lt-button': Button;
    'lt-spinner': Spinner;
  }
}

export {};
