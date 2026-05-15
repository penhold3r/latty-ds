export interface PlaygroundMember {
  name: string;
  type: 'boolean' | 'select' | 'text' | 'number' | 'icon' | 'color';
  options?: string[];
  default?: unknown;
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
