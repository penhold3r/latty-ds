import { css } from 'lit';

export const sliderStyles = css`
  :host {
    display: block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
    width: 100%;
  }

  label {
    color: var(--lt-text-default);
    display: block;
    margin-bottom: var(--lt-spacing-1);
    user-select: none;
  }

  .track-wrap {
    align-items: center;
    display: flex;
    width: 100%;
  }

  /* lt-tooltip fills the track-wrap so the input stays full-width */
  .track-wrap lt-tooltip {
    display: block;
    width: 100%;
  }

  /* Position the tooltip above the thumb rather than the track center. --_fill is a unitless 0–1 ratio (set from
     JS on :host) — computed in CSS, not from a JS-read offsetWidth, so it can never drift after a resize or when
     first shown from display:none (SLD-1). The thumb travels only (100% - thumb size), offset by half the thumb
     so it's centered on the value, matching a native range input's own thumb geometry. */
  lt-tooltip::part(tooltip) {
    left: calc(var(--_fill, 0) * (100% - var(--lt-slider-thumb-size, 18px)) + var(--lt-slider-thumb-size, 18px) / 2);
  }

  input[type='range'] {
    appearance: none;
    background: linear-gradient(
      to right,
      var(--lt-interactive-primary-bg) calc(var(--_fill, 0) * 100%),
      var(--lt-border-strong) calc(var(--_fill, 0) * 100%)
    );
    border-radius: 9999px;
    cursor: pointer;
    display: block;
    height: var(--lt-slider-track-height, 6px);
    outline: none;
    transition: background 0ms;
    width: 100%;
  }

  input[type='range']:focus-visible {
    outline: 3px solid var(--lt-border-focus);
    outline-offset: 3px;
  }

  input[type='range']:hover:not(:disabled) {
    --lt-interactive-primary-bg: var(--lt-interactive-primary-bg-hover);
  }

  input[type='range']:active:not(:disabled) {
    --lt-interactive-primary-bg: var(--lt-interactive-primary-bg-active);
  }

  /* Thumb — WebKit */
  input[type='range']::-webkit-slider-thumb {
    appearance: none;
    background: var(--lt-interactive-primary-bg);
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    height: var(--lt-slider-thumb-size, 18px);
    transition: transform 100ms ease;
    width: var(--lt-slider-thumb-size, 18px);
  }

  input[type='range']::-webkit-slider-thumb:hover {
    transform: scale(1.15);
  }

  input[type='range']:active::-webkit-slider-thumb {
    transform: scale(1.05);
  }

  /* Thumb — Firefox */
  input[type='range']::-moz-range-thumb {
    appearance: none;
    background: var(--lt-interactive-primary-bg);
    border-radius: 50%;
    border: 2px solid white;
    box-shadow: 0 1px 4px rgba(0, 0, 0, 0.25);
    cursor: pointer;
    height: var(--lt-slider-thumb-size, 18px);
    transition: transform 100ms ease;
    width: var(--lt-slider-thumb-size, 18px);
  }

  /* Track — Firefox */
  input[type='range']::-moz-range-track {
    background: var(--lt-border-strong);
    border-radius: 9999px;
    height: var(--lt-slider-track-height, 6px);
  }

  input[type='range']::-moz-range-progress {
    background: var(--lt-interactive-primary-bg);
    border-radius: 9999px;
    height: var(--lt-slider-track-height, 6px);
  }

  /* Sizes */
  :host([size='sm']) {
    --lt-slider-track-height: 4px;
    --lt-slider-thumb-size: 14px;
  }

  :host([size='md']) {
    --lt-slider-track-height: 6px;
    --lt-slider-thumb-size: 18px;
  }

  :host([size='lg']) {
    --lt-slider-track-height: 8px;
    --lt-slider-thumb-size: 22px;
  }

  /* Disabled. :host(:disabled) — the browser matches this automatically for a form-associated element inside a
     disabled <fieldset>, no JS required; :host([disabled]) covers the component's own explicit attribute. */
  :host([disabled]),
  :host(:disabled) {
    opacity: 0.5;
  }

  :host([disabled]) input[type='range'],
  :host(:disabled) input[type='range'] {
    cursor: not-allowed;
    pointer-events: none;
  }

  /* ── Reduced motion ─────────────────────────────────────────────────────── */

  @media (prefers-reduced-motion: reduce) {
    input[type='range']::-webkit-slider-thumb,
    input[type='range']::-moz-range-thumb {
      transition: none;
    }
  }

  /* ── Forced colors (Windows High Contrast) ─────────────────────────────────
     Under forced-colors, the track's linear-gradient (WebKit/Chromium) and the Firefox ::-moz-range-track/
     ::-moz-range-progress pair are all flattened to Canvas, with no border to fall back on — the whole track
     disappears. Restoring a visible track boundary, plus a solid thumb fill, is enough: the thumb's own
     position already conveys the value (the primary way a slider communicates it visually), matching how
     native <input type="range"> itself renders under forced-colors in every engine — no attempt to also
     recreate the fill-amount gradient with system colors, which native sliders don't do either. System color
     keywords are exempt from the flattening and always resolve to the OS's own guaranteed-contrasting
     palette. ─────────────────────────────────────────────────────────────────────────────────────────────── */

  @media (forced-colors: active) {
    input[type='range'] {
      background: Canvas;
      border: 1px solid ButtonText;
    }

    input[type='range']::-webkit-slider-thumb {
      background: Highlight;
      border-color: ButtonText;
    }

    input[type='range']::-moz-range-thumb {
      background: Highlight;
      border-color: ButtonText;
    }

    input[type='range']::-moz-range-track {
      background: Canvas;
      border: 1px solid ButtonText;
    }

    input[type='range']::-moz-range-progress {
      background: Highlight;
    }
  }
`;
