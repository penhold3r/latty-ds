import React from 'react';
import { processAdmonitionProps } from '@docusaurus/theme-common';
import { translate } from '@docusaurus/Translate';

// Swizzled from @docusaurus/theme-classic's theme/Admonition (registered as
// the `admonition` MDX component — what every `:::note`/`:::tip`/etc. block
// renders through) to render via lt-alert instead of Infima's
// `alert alert--*` markup. Replaces the whole Type/Layout/Icon sub-component
// tree Docusaurus dispatches through (one file per admonition type) with a
// single type -> variant table, since lt-alert already covers everything
// those did: variant-driven color, an automatic per-variant icon
// (packages/web/src/components/alert/alert.ts's own `_iconMap` — no icon
// prop needed here at all), and a dedicated title slot.
//
// `processAdmonitionProps` (same helper Docusaurus's own Admonition calls)
// still does the real work of extracting a custom `:::tip[Custom Title]`
// title out of `children` — kept as-is, not reimplemented.
type AlertVariant = 'default' | 'success' | 'warning' | 'error' | 'info';

interface AdmonitionConfig {
  variant: AlertVariant;
  titleId: string;
  titleMessage: string;
}

const ADMONITION_CONFIG: Record<string, AdmonitionConfig> = {
  note: { variant: 'default', titleId: 'theme.admonition.note', titleMessage: 'note' },
  tip: { variant: 'success', titleId: 'theme.admonition.tip', titleMessage: 'tip' },
  info: { variant: 'info', titleId: 'theme.admonition.info', titleMessage: 'info' },
  warning: { variant: 'warning', titleId: 'theme.admonition.warning', titleMessage: 'warning' },
  danger: { variant: 'error', titleId: 'theme.admonition.danger', titleMessage: 'danger' },
  // Undocumented legacy aliases Docusaurus itself still wires up (see
  // @docusaurus/theme-classic's Admonition/Types.js) — mapped to their
  // closest real variant rather than dropped.
  caution: { variant: 'warning', titleId: 'theme.admonition.caution', titleMessage: 'caution' },
  secondary: { variant: 'default', titleId: 'theme.admonition.note', titleMessage: 'secondary' },
  important: { variant: 'info', titleId: 'theme.admonition.info', titleMessage: 'important' },
  success: { variant: 'success', titleId: 'theme.admonition.tip', titleMessage: 'success' }
};

interface AdmonitionProps {
  type: string;
  title?: React.ReactNode;
  children?: React.ReactNode;
  className?: string;
  icon?: React.ReactNode;
}

export default function Admonition(unprocessedProps: AdmonitionProps): JSX.Element {
  // Cast through the helper's own parameter type: this package's dual
  // @types/react copies (see documentation/src/globals.d.ts's comment) make
  // its 19.x `ReactNode` (includes `bigint`) structurally incompatible with
  // @docusaurus/theme-common's own 18.x-resolved `ReactNode` by TS's rules,
  // even though nothing here can actually produce a bigint child at runtime.
  const props = processAdmonitionProps(
    unprocessedProps as Parameters<typeof processAdmonitionProps>[0]
  ) as AdmonitionProps;
  const config = ADMONITION_CONFIG[props.type] ?? ADMONITION_CONFIG.info;
  const defaultTitle = translate({
    id: config.titleId,
    message: config.titleMessage,
    description: `The default label used for the ${props.type} admonition (:::${props.type})`
  });

  // A custom `:::tip[Custom **Bold** Title]` title can be arbitrary MDX, not
  // just text — lt-alert's `title` is a plain string attribute, so a rich
  // title renders inline above the body instead of in the dedicated title
  // slot. Plain-string titles (the vast majority: every default title, and
  // most custom ones) go through the real slot and look identical to before.
  const titleText = typeof props.title === 'string' ? props.title : props.title === undefined ? defaultTitle : '';
  const richTitle = typeof props.title === 'string' || props.title === undefined ? null : props.title;

  return (
    <lt-alert variant={config.variant} title={titleText} class={props.className}>
      {richTitle && <strong>{richTitle}</strong>}
      {props.children}
    </lt-alert>
  );
}
