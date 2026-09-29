import { css } from 'lit';

// Shared by lt-dialog (dialog::backdrop, since its migration to a native <dialog>) and lt-sidepanel
// ([part='overlay'], until its own migration to the same pattern). Each non-matching selector is a no-op in
// the other component's shadow root.
export const backdropFeatureStyles = css`
  :host([backdrop-blur]) .backdrop,
  :host([backdrop-blur]) [part='overlay'],
  :host([backdrop-blur]) dialog::backdrop {
    backdrop-filter: blur(6px);
    -webkit-backdrop-filter: blur(6px);
  }
`;
