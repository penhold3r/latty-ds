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
// Rendering the heading tag `As` (`h1`..`h6`) on the outside with `<lt-text
// variant={variant} as="span">` inside preserves real heading semantics in
// static SSR HTML — essential for screen readers, web crawlers, and offline
// search indexers (like `docusaurus-lunr-search`, which scans static HTML for
// `h1` and `h2`/`h3` nodes) — while continuing to style every heading directly
// through Latty's design tokens and typography component.
type HeadingTag = 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6';

interface HeadingProps extends React.HTMLAttributes<HTMLHeadingElement> {
  as?: HeadingTag | React.ElementType;
  id?: string;
  children?: React.ReactNode;
  className?: string;
  [key: string]: unknown;
}

const HEADING_VARIANTS = new Set<HeadingTag>(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']);

export default function Heading({ as: As = 'h2', id, children, className, ...props }: HeadingProps): JSX.Element {
  const brokenLinks = useBrokenLinks();
  const anchorTargetClassName = useAnchorTargetClassName(id);
  const tag: HeadingTag = typeof As === 'string' && HEADING_VARIANTS.has(As as HeadingTag) ? (As as HeadingTag) : 'h2';
  const variant = tag;
  const Tag = tag;

  // H1 headings do not need an id because they don't appear in the TOC.
  if (tag === 'h1' || !id) {
    return (
      <Tag className={className} {...props}>
        <lt-text variant={variant} as="span">
          {children}
        </lt-text>
      </Tag>
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
    <Tag id={id} className={clsx('anchor', anchorTargetClassName, className)} {...props}>
      <lt-text variant={variant} as="span">
        {children}
      </lt-text>
      <Link className="hash-link" to={`#${id}`} aria-label={anchorTitle} title={anchorTitle} translate="no">
        &#8203;
      </Link>
    </Tag>
  );
}
