import { css } from 'lit';

export const sidepanelStyles = css`
  :host {
    display: contents;
    /* translateX/box-shadow offsets have no logical-property equivalent, unlike the inset-inline-*
       positioning below (which resolves automatically) — these carry the direction-dependent sign instead,
       flipped under :dir(rtl), so the off-screen slide direction and shadow side both stay correct without
       any JS reading computed direction at all. */
    --_start-x: -100%;
    --_end-x: 100%;
    --_dir-sign: 1;
  }

  :host(:dir(rtl)) {
    --_start-x: 100%;
    --_end-x: -100%;
    --_dir-sign: -1;
  }

  /* ── Panel — the native <dialog> itself now provides the overlay too, via ::backdrop; a closed dialog is
     display:none automatically, so unlike the old transform-only-hidden div, a closed panel is genuinely
     non-interactive and out of the accessibility tree, with no extra JS needed (SPL-1). ────────────────────── */

  dialog {
    background: var(--lt-bg-default);
    border: none;
    color: var(--lt-text-default);
    margin: 0;
    max-height: none;
    max-width: none;
    padding: 0;
    position: fixed;
    /* display is deliberately NOT set here — a closed dialog must stay display:none (the native default) for
       SPL-1's fix to actually hold (genuinely non-interactive, out of the accessibility tree); it's set to flex
       only for the open state, below. display/overlay need transition-behavior: allow-discrete so close()
       doesn't remove the panel (and its ::backdrop) from rendering instantly, cutting the slide-out transform
       transition off partway through — same reasoning as lt-dialog. */
    transition:
      transform 250ms var(--lt-ease-standard),
      display 250ms allow-discrete,
      overlay 250ms allow-discrete;
  }

  dialog::backdrop {
    background: rgb(var(--lt-shadow-rgb) / 0);
    transition:
      background-color 200ms ease,
      display 250ms allow-discrete,
      overlay 250ms allow-discrete;
  }

  dialog[open]::backdrop {
    background: rgb(var(--lt-shadow-rgb) / var(--lt-sidepanel-overlay-opacity, 0.45));
  }

  /* ── Anchors — off-screen positions; dialog[open] (below) is the only thing that moves it on-screen. Fully
     explicit inset-inline-start/end/top/bottom (not inset-block/inline shorthand, and not omitting the
     opposite side to fall back to "auto") and an explicit height/width — a native <dialog>, even
     position:fixed, does not stretch to fill top:0/bottom:0 the way a plain block box would; confirmed
     empirically, it needs an explicit dimension on the axis inset alone doesn't constrain. ────────────────── */

  :host([anchor='start']) dialog,
  :host(:not([anchor])) dialog {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    height: 100vh;
    transform: translateX(var(--_start-x));
    box-shadow: var(--lt-sidepanel-shadow, calc(4px * var(--_dir-sign)) 0 24px rgb(var(--lt-shadow-rgb) / 0.12));
  }

  :host([anchor='end']) dialog {
    top: 0;
    inset-inline-end: 0;
    bottom: auto;
    inset-inline-start: auto;
    height: 100vh;
    transform: translateX(var(--_end-x));
    box-shadow: var(--lt-sidepanel-shadow, calc(-4px * var(--_dir-sign)) 0 24px rgb(var(--lt-shadow-rgb) / 0.12));
  }

  :host([anchor='top']) dialog {
    top: 0;
    inset-inline-end: auto;
    bottom: auto;
    inset-inline-start: 0;
    width: 100vw;
    transform: translateY(-100%);
    box-shadow: var(--lt-sidepanel-shadow, 0 4px 24px rgb(var(--lt-shadow-rgb) / 0.12));
  }

  :host([anchor='bottom']) dialog {
    top: auto;
    inset-inline-end: auto;
    bottom: 0;
    inset-inline-start: 0;
    width: 100vw;
    transform: translateY(100%);
    box-shadow: var(--lt-sidepanel-shadow, 0 -4px 24px rgb(var(--lt-shadow-rgb) / 0.12));
  }

  dialog[open] {
    display: flex;
    flex-direction: column;
  }

  /* The transform override has to be scoped per anchor, not a bare dialog[open] — :host([anchor='end'])
     dialog (above) has HIGHER specificity than a plain dialog[open] (one more attribute selector, from the
     :host() argument), so a bare "dialog[open] { transform: translate(0,0); }" would lose the cascade to the
     anchor rule's own closed-position transform regardless of source order, leaving the panel permanently
     stuck off-screen. Matching each anchor rule's own specificity here guarantees the open state wins. */
  :host([anchor='start']) dialog[open],
  :host(:not([anchor])) dialog[open],
  :host([anchor='end']) dialog[open],
  :host([anchor='top']) dialog[open],
  :host([anchor='bottom']) dialog[open] {
    transform: translate(0, 0);
  }

  /* A newly-shown dialog has no earlier rendered frame to transition from — @starting-style supplies one,
     per anchor, so the slide-in actually animates instead of snapping straight to the open position. */
  @starting-style {
    :host([anchor='start']) dialog[open],
    :host(:not([anchor])) dialog[open] {
      transform: translateX(var(--_start-x));
    }
    :host([anchor='end']) dialog[open] {
      transform: translateX(var(--_end-x));
    }
    :host([anchor='top']) dialog[open] {
      transform: translateY(-100%);
    }
    :host([anchor='bottom']) dialog[open] {
      transform: translateY(100%);
    }
  }

  /* ── Header ─────────────────────────────────────────────────────────────── */

  .header {
    display: flex;
    align-items: center;
    gap: var(--lt-spacing-4);
    padding: var(--lt-spacing-4) var(--lt-spacing-5);
    border-bottom: 1px solid var(--lt-border-default);
    flex-shrink: 0;
  }

  .panel-label {
    flex: 1;
    color: var(--lt-text-default);
  }

  .close-button {
    flex-shrink: 0;
    margin-inline-start: auto;
  }

  /* ── Body ───────────────────────────────────────────────────────────────── */

  .body {
    flex: 1;
    overflow-y: auto;
    padding: var(--lt-spacing-5);
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    dialog,
    dialog::backdrop {
      transition: none;
    }
  }
`;
