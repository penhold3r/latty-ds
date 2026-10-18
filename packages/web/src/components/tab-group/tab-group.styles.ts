import { css } from 'lit';

export const tabGroupStyles = css`
  :host {
    display: block;
    font-family: var(--lt-typography-fontFamilyPrimary, 'Hanken Grotesk', sans-serif);
  }

  .tab-group {
    display: flex;
    flex-direction: column;
  }

  /* Holds the optional scroll buttons either side of .tabs-container. Carries the border/pills decoration that
     used to live on .tabs-container alone, so it spans the buttons too instead of looking cut off beside them. */
  .tablist-row {
    align-items: center;
    border-bottom: 1px solid var(--lt-border-default);
    display: flex;
    gap: var(--lt-spacing-1);
  }

  .tabs-container {
    display: flex;
    gap: var(--lt-spacing-1);
    /* Overrides flexbox's default min-width:auto, which would otherwise refuse to shrink this item below its
       content's natural width — exactly the thing that needs to shrink for overflow-x to ever actually scroll
       instead of pushing .tablist-row wider than its own container. */
    min-width: 0;
    overflow-x: auto;
    scrollbar-width: thin;
  }

  .scroll-button {
    flex-shrink: 0;
  }

  .tabs-container::-webkit-scrollbar {
    height: 4px;
  }

  .tabs-container::-webkit-scrollbar-track {
    background: var(--lt-bg-surface);
  }

  .tabs-container::-webkit-scrollbar-thumb {
    background: var(--lt-border-strong);
    border-radius: 2px;
  }

  .panels-container {
    padding: var(--lt-spacing-4) 0;
  }

  ::slotted([slot='panel']) {
    display: none;
  }

  ::slotted([slot='panel'][active]) {
    display: block;
  }

  /* Pills variant — the capsule background/radius lives on the row so the scroll buttons (when present) sit
     inside it alongside the tabs, instead of looking like they belong to a separate, unstyled control. */
  :host([appearance='pills']) .tablist-row {
    background: var(--lt-bg-surface);
    border: none;
    border-radius: var(--lt-border-radius);
    padding: var(--lt-spacing-1);
  }

  :host([appearance='pills']) .tabs-container {
    gap: var(--lt-spacing-2);
  }

  /* ── Vertical orientation ─────────────────────────────────────────────── Tabs stack in a column beside the
     panels instead of a row above them; the dividing border moves from the bottom edge to the inline-end
     (trailing) edge of the tab list. */
  :host([orientation='vertical']) .tab-group {
    flex-direction: row;
    /* A block element's width naturally flows down from its container, but height never does without an
       explicit chain saying so — without this, .tab-group just grows to fit its own content and silently
       ignores whatever bounded height a consumer actually gave the host, leaving .tabs-container's own
       overflow-y:auto structurally unreachable (confirmed live: scrollHeight === clientHeight even inside an
       explicitly height-constrained host). Only needed for vertical: horizontal's natural "auto" height already
       is the component's own intended height. */
    height: 100%;
  }

  :host([orientation='vertical']) .tablist-row {
    border-bottom: none;
    border-inline-end: 1px solid var(--lt-border-default);
    flex-direction: column;
  }

  :host([orientation='vertical']) .tabs-container {
    flex-direction: column;
    /* Same flex min-size override as min-width:0 above, for the vertical scrolling axis instead. */
    min-height: 0;
    min-width: auto;
    overflow-x: visible;
    overflow-y: auto;
  }

  :host([orientation='vertical']) .tabs-container::-webkit-scrollbar {
    width: 4px;
  }

  :host([orientation='vertical']) .panels-container {
    padding-block: 0;
    padding-inline: var(--lt-spacing-4) 0;
  }

  :host([orientation='vertical'][appearance='pills']) .tablist-row {
    border-inline-end: none;
  }
`;
