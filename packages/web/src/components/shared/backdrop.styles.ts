import { css } from 'lit';

// Shared by lt-dialog (.backdrop) and lt-sidepanel ([part='overlay']).
// The non-matching selector is a no-op in each component's shadow root.
export const backdropFeatureStyles = css`
  :host([backdrop-blur]) .backdrop,
  :host([backdrop-blur]) [part='overlay'] {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
`;
