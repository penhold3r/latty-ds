import { css } from 'lit';

export const snackbarGroupStyles = css`
  /* ── Popover ─────────────────────────────────────────────── Same reasoning as lt-snackbar's own (now
     managed-mode-only) comment: the host itself is a "manual" popover so the whole stack renders in the top
     layer, above an open lt-dialog/lt-sidepanel regardless of z-index. Shown/hidden based on whether anything
     is actually visible (see snackbar-group.ts) rather than unconditionally, so it has zero top-layer presence
     while empty. display is deliberately NOT set on the base rule for the same native-default reason. */

  :host {
    align-items: center;
    background: transparent;
    border: none;
    bottom: 24px;
    flex-direction: column;
    gap: var(--lt-spacing-2);
    left: 50%;
    margin: 0;
    max-width: calc(100vw - 48px);
    overflow: visible;
    padding: 0;
    position: fixed;
    right: auto;
    top: auto;
    transform: translateX(-50%);
    width: max-content;
  }

  :host(:popover-open) {
    display: flex;
  }
`;
