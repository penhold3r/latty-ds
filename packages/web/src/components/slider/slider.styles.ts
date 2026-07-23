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

  /* Position the tooltip above the thumb rather than the track center */
  lt-tooltip::part(tooltip) {
    left: var(--_thumb-left, 50%);
  }

  input[type='range'] {
    appearance: none;
    background: linear-gradient(
      to right,
      var(--lt-interactive-primary-bg) var(--lt-slider-fill, 0%),
      var(--lt-border-strong) var(--lt-slider-fill, 0%)
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

  /* Disabled */
  :host([disabled]) {
    opacity: 0.5;
  }

  :host([disabled]) input[type='range'] {
    cursor: not-allowed;
    pointer-events: none;
  }
`;
