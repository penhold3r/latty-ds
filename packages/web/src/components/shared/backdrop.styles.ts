import { css } from 'lit';

/**
 * Shared by lt-dialog and lt-sidepanel — both wrap a native <dialog>, so both use its ::backdrop.
 */
export const backdropFeatureStyles = css`
  :host([backdrop-blur]) dialog::backdrop {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
`;
