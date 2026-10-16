export interface PlaygroundMember {
  name: string;
  type: 'boolean' | 'select' | 'text' | 'number' | 'icon' | 'color' | 'complex';
  options?: string[];
  default?: unknown;
  /** Raw TS type text, `type: 'complex'` only — e.g. `"CalendarPreset[]"`. Not attribute-settable, so has no
   * interactive Playground control; shown as an informational row in the API table instead. */
  valueType?: string;
}

/** A boolean Playground control that bypasses the manifest/attribute pipeline entirely — see
 * `ComponentPlaygroundProps.extraControls`. */
export interface PlaygroundExtraControl {
  /** Unique key; also used to derive this control's DOM id. */
  name: string;
  /** Label shown next to the switch in the Controls panel. */
  label: string;
  /** Initial state. @default false */
  default?: boolean;
  /** Called with the live previewed element and the new value — once on mount, and again on every toggle. */
  apply: (el: HTMLElement & Record<string, unknown>, value: boolean) => void;
}

export interface PlaygroundGroup {
  tag: string;
  members: PlaygroundMember[];
  defaults: Record<string, unknown>;
}

export interface ChildItem {
  el: Element;
  tag: string;
  templateAttrs: Record<string, string>;
}
