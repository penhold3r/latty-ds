import React from 'react';
import clsx from 'clsx';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import { useAnchorTargetClassName } from '@docusaurus/theme-common';
import useBrokenLinks from '@docusaurus/useBrokenLinks';

// Swizzled from @docusaurus/theme-classic's theme/Heading (the component every
// markdown/MDX `#`-`######` heading actually renders through) to render via
// lt-text instead of a bare h1-h6, so every heading picks up Latty's own
// typography without a hand-duplicated `.markdown h1`-`h6` CSS shadow of it.
//
// Deliberately NOT a rehype/remark AST plugin (that's what the old
// `rehype-lt-text` port tried and had to be reverted for — see
// _agent-plans/DOCUSAURUS-MIGRATION-PLAN.md's Decision 1): renaming heading
// nodes in the AST happens *before* Docusaurus's own TOC extraction and
// broken-anchor validation ever see them, so both silently stopped finding
// any headings. This swizzle only changes what tag gets *rendered* — the
// underlying MDX heading nodes, TOC data, and rehype-slug-assigned ids are
// completely untouched, and this component still calls
// `useBrokenLinks().collectAnchor(id)` itself (copied verbatim from the
// original below), which is the actual runtime hook `onBrokenAnchors`
// validation and the TOC sidebar's scroll-spy depend on — so both keep
// working exactly as they did with plain h1-h6.
//
// `lt-text`'s `as` prop (decoupled from `variant`) is what makes this
// possible without losing document outline/semantics: `variant="h2" as="h2"`
// renders a real `<h2>` inside lt-text's shadow DOM, so this is additive
// (real styling from the design system) rather than a semantic downgrade.
interface HeadingProps {
  as: React.ElementType;
  id?: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const HEADING_VARIANTS = new Set(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default function Heading({ as: As, id, children, className, ...props }: HeadingProps): JSX.Element {
  const brokenLinks = useBrokenLinks();
  const anchorTargetClassName = useAnchorTargetClassName(id);
  const tag = typeof As === 'string' ? As : 'h2';
  const variant = HEADING_VARIANTS.has(tag) ? tag : 'h2';

  // H1 headings do not need an id because they don't appear in the TOC.
  if (As === 'h1' || !id) {
    return (
      <lt-text variant={variant} as={tag} class={className} {...props}>
        {children}
      </lt-text>
    );
  }

  brokenLinks.collectAnchor(id);
  const anchorTitle = translate(
    {
      id: 'theme.common.headingLinkTitle',
      message: 'Direct link to {heading}',
      description: 'Title for link to heading'
    },
    { heading: typeof children === 'string' ? children : id }
  );

  return (
    <lt-text variant={variant} as={tag} id={id} class={clsx('anchor', anchorTargetClassName, className)} {...props}>
      {children}
      <Link className="hash-link" to={`#${id}`} aria-label={anchorTitle} title={anchorTitle} translate="no">
        &#8203;
      </Link>
    </lt-text>
  );
}
