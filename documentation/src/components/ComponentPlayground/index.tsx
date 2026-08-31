import { useEffect, useId, useRef } from 'react';
import manifest from '@latty-ds/web/manifest.json';
import { defaultValue, toLabel, buildSubTagsData } from './ComponentPlayground.ssr';
import { initPlayground } from './ComponentPlayground.script';
import type { PlaygroundMember, PlaygroundGroup } from './ComponentPlayground.types';
import './ComponentPlayground.styles.css';

export interface ComponentPlaygroundProps {
  tag: string;
  content?: string;
  previewHeight?: string;
  defaults?: Record<string, unknown>;
  /** Makes the component fill the full preview stage width. */
  stretch?: boolean;
  /** Tag names of sub-elements to expose controls for (e.g. ['lt-breadcrumb-item']). */
  subTags?: string[];
  /**
   * Allowlist of props to show per sub-tag. If omitted, all manifest props are shown.
   * Example: { 'lt-breadcrumb-item': ['separator'] }
   */
  subTagsFilter?: Record<string, string[]>;
  /**
   * JS properties to set directly on the element after creation.
   * Use for props that can't be expressed as HTML attributes (e.g. options, columns, data arrays).
   */
  seedData?: Record<string, unknown>;
  /**
   * If set, renders a button in the preview stage with this label.
   * Clicking it calls el.show() if available, otherwise sets el.open = true.
   */
  previewTrigger?: string;
}

// SSR/prop-computation logic below mirrors docs/src/components/ComponentPlayground/index.astro's
// frontmatter exactly (same ssr.ts helpers) — it's pure and runs fine during Docusaurus's SSR
// pass. Only the DOM-hydrating half (ComponentPlayground.script.ts's initPlayground, called from
// the effect below) is client-only, and it doesn't need <BrowserOnly> since effects never run
// during SSR — see the Phase 1 spike note in _agent-plans/DOCUSAURUS-MIGRATION-PLAN.md.
export default function ComponentPlayground({
  tag,
  content: slotContent = '',
  previewHeight = '140px',
  defaults: defaultOverrides = {},
  stretch = false,
  subTags: subTagsProp = [],
  subTagsFilter: subTagsFilterProp = {},
  seedData = {},
  previewTrigger
}: ComponentPlaygroundProps): JSX.Element {
  // useId (not Math.random(), as the Astro version used) so the id matches
  // between the server-rendered HTML and the client hydration pass.
  const id = `playground-${useId().replace(/:/g, '')}`;
  const rootRef = useRef<HTMLDivElement>(null);

  const allManifest = manifest as unknown as Record<string, { members?: PlaygroundMember[] }> & {
    _meta?: { iconNames?: string[] };
  };
  const iconNames: string[] = allManifest._meta?.iconNames ?? [];
  const rawMembers: PlaygroundMember[] = allManifest[tag]?.members ?? [];
  const hasThemeProp = rawMembers.some((m) => m.name === 'theme');
  const members: PlaygroundMember[] = hasThemeProp
    ? rawMembers
    : [...rawMembers, { name: 'theme', type: 'select', options: ['', 'light', 'dark'], default: '' }];

  const defaults = Object.fromEntries(members.map((m) => [m.name, defaultValue(m, defaultOverrides)]));
  const subTagsData: PlaygroundGroup[] = buildSubTagsData(subTagsProp, subTagsFilterProp, allManifest);
  const allCtrlGroups: PlaygroundGroup[] = [{ tag, members, defaults }, ...subTagsData];

  useEffect(() => {
    if (rootRef.current) void initPlayground(rootRef.current);
  }, []);

  return (
    <div
      ref={rootRef}
      className="playground"
      id={id}
      data-tag={tag}
      data-content={slotContent}
      data-members={JSON.stringify(members)}
      data-defaults={JSON.stringify(defaults)}
      data-icons={JSON.stringify(iconNames)}
      data-stretch={stretch ? 'true' : undefined}
      data-subtags-data={JSON.stringify(subTagsData)}
      data-seed-data={JSON.stringify(seedData)}
      data-preview-trigger={previewTrigger}
    >
      <div className="preview" style={{ minHeight: previewHeight }}>
        <div className="preview-toolbar">
          <button className="bp-btn" data-width="375">
            Mobile
          </button>
          <button className="bp-btn" data-width="768">
            Tablet
          </button>
          <button className="bp-btn is-active" data-width="">
            Desktop
          </button>
        </div>
        <div className="preview-stage" id={`${id}-stage`}>
          {previewTrigger && (
            // @ts-expect-error -- lt-button is a custom element, not a typed JSX intrinsic
            <lt-button variant="primary" id={`${id}-trigger`}>
              {previewTrigger}
            </lt-button>
          )}
        </div>
      </div>

      <div className="bottom">
        <div className="controls">
          {subTagsProp.length > 0 ? (
            <div className="ctrl-tabs-bar">
              {allCtrlGroups.map(({ tag: ctrlTag }, i) => (
                <button key={ctrlTag} className={`ctrl-tab-btn${i === 0 ? ' is-active' : ''}`} data-ctrl-tag={ctrlTag}>
                  {ctrlTag.replace('lt-', '')}
                </button>
              ))}
            </div>
          ) : (
            <div className="section-label">Controls</div>
          )}

          {allCtrlGroups.map(({ tag: ctrlTag, members: ctrlMembers, defaults: ctrlDefaults }, groupIdx) =>
            ctrlMembers.map((member: PlaygroundMember) => {
              const val = ctrlDefaults[member.name];
              const label = toLabel(member.name);
              const ctrlId = `${id}-${ctrlTag.replace('lt-', '')}-${member.name}`;
              const hidden = groupIdx > 0;
              const rowStyle = hidden ? { display: 'none' } : undefined;
              const key = `${ctrlTag}-${member.name}`;

              if (member.type === 'boolean')
                return (
                  <div key={key} className="control-row" style={rowStyle} data-ctrl-group={ctrlTag}>
                    <label className="control-label" htmlFor={ctrlId}>
                      {label}
                    </label>
                    {/* @ts-expect-error -- lt-switch is a custom element, not a typed JSX intrinsic */}
                    <lt-switch
                      id={ctrlId}
                      size="sm"
                      data-prop={member.name}
                      data-type="boolean"
                      data-ctrl-tag={ctrlTag}
                      checked={val === true ? '' : undefined}
                    />
                  </div>
                );

              if (member.type === 'select')
                return (
                  <div key={key} className="control-row" style={rowStyle} data-ctrl-group={ctrlTag}>
                    <label className="control-label" htmlFor={ctrlId}>
                      {label}
                    </label>
                    {/* @ts-expect-error -- lt-select is a custom element, not a typed JSX intrinsic */}
                    <lt-select
                      id={ctrlId}
                      size="sm"
                      data-prop={member.name}
                      data-type="select"
                      data-ctrl-tag={ctrlTag}
                      data-options={JSON.stringify(member.options ?? [])}
                      data-value={String(val)}
                    />
                  </div>
                );

              if (member.type === 'icon')
                return (
                  <div
                    key={key}
                    className="control-row control-row--stacked"
                    style={rowStyle}
                    data-ctrl-group={ctrlTag}
                  >
                    <label className="control-label" htmlFor={ctrlId}>
                      {label}
                    </label>
                    {/* @ts-expect-error -- lt-combobox is a custom element, not a typed JSX intrinsic */}
                    <lt-combobox
                      id={ctrlId}
                      size="sm"
                      placeholder="Search icon…"
                      data-prop={member.name}
                      data-type="icon"
                      data-ctrl-tag={ctrlTag}
                    />
                  </div>
                );

              if (member.type === 'color')
                return (
                  <div key={key} className="control-row" style={rowStyle} data-ctrl-group={ctrlTag}>
                    <label className="control-label" htmlFor={ctrlId}>
                      {label}
                    </label>
                    <input
                      id={ctrlId}
                      className="control-color"
                      type="color"
                      data-prop={member.name}
                      data-type="color"
                      data-ctrl-tag={ctrlTag}
                      defaultValue={String(val) || '#ffffff'}
                    />
                  </div>
                );

              return (
                <div key={key} className="control-row" style={rowStyle} data-ctrl-group={ctrlTag}>
                  <label className="control-label" htmlFor={ctrlId}>
                    {label}
                  </label>
                  {/* @ts-expect-error -- lt-textfield is a custom element, not a typed JSX intrinsic */}
                  <lt-textfield
                    id={ctrlId}
                    size="sm"
                    type={member.type === 'number' ? 'number' : 'text'}
                    value={String(val)}
                    placeholder={label}
                    data-prop={member.name}
                    data-type={member.type}
                    data-ctrl-tag={ctrlTag}
                  />
                </div>
              );
            })
          )}
        </div>

        <div className="code-panel">
          <div className="code-header">
            {/* @ts-expect-error -- lt-tab-group is a custom element, not a typed JSX intrinsic */}
            <lt-tab-group value="html" class="code-tabs" id={`${id}-tabs`} theme="dark">
              {/* @ts-expect-error -- lt-tab is a custom element, not a typed JSX intrinsic */}
              <lt-tab label="HTML" value="html">
                HTML
              </lt-tab>
              {/* @ts-expect-error -- lt-tab is a custom element, not a typed JSX intrinsic */}
              <lt-tab label="React" value="react">
                React
              </lt-tab>
              {/* @ts-expect-error -- lt-tab-group is a custom element, not a typed JSX intrinsic */}
            </lt-tab-group>
            <div className="code-header-actions">
              {/* @ts-expect-error -- lt-button is a custom element, not a typed JSX intrinsic */}
              <lt-button
                size="sm"
                variant="neutral"
                appearance="outlined"
                id={`${id}-share`}
                icon-end="share"
                aria-label="Share"
                theme="dark"
              >
                Share
              </lt-button>
              {/* @ts-expect-error -- lt-button is a custom element, not a typed JSX intrinsic */}
              <lt-button
                size="sm"
                variant="neutral"
                appearance="outlined"
                id={`${id}-copy`}
                icon-end="copy"
                aria-label="Copy code"
                theme="dark"
              >
                Copy
              </lt-button>
            </div>
          </div>
          {/* tabindex so the horizontally-scrollable code panel is keyboard-reachable
              (axe `scrollable-region-focusable`) — a pre-existing gap in the Astro
              version too, found via `pnpm a11y` once /components/dialog (long code
              lines) was added to the sample; fixed here since it applies everywhere. */}
          <pre className="code-pre" id={`${id}-html-panel`} tabIndex={0}>
            <code className="code-output" id={`${id}-html-code`} />
          </pre>
          <pre className="code-pre" id={`${id}-react-panel`} style={{ display: 'none' }} tabIndex={0}>
            <code className="code-output" id={`${id}-react-code`} />
          </pre>
        </div>
      </div>

      <div className="event-log" id={`${id}-event-log`}>
        <button className="event-log-header" id={`${id}-event-log-toggle`}>
          <span id={`${id}-event-log-label`}>Events</span>
          <svg
            className="event-log-chevron"
            width="10"
            height="10"
            viewBox="0 0 10 10"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <polyline points="2,3 5,7 8,3" />
          </svg>
        </button>
        <div className="event-log-body" id={`${id}-event-log-body`} hidden>
          <div className="event-log-rows" id={`${id}-event-log-rows`} />
        </div>
      </div>
    </div>
  );
}
