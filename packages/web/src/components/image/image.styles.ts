import { css } from 'lit';

export const imageStyles = css`
  :host {
    display: inline-block;
  }

  img {
    display: block;
    max-width: 100%;
    height: auto;
  }

  /* ── Responsive ─────────────────────────────────────────────────────────── */

  :host([responsive]) {
    display: block;
    width: 100%;
  }

  :host([responsive]) img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }
`;
