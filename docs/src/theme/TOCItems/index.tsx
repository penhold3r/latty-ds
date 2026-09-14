import React, { useMemo } from 'react';
import type { TOCItem } from '@docusaurus/mdx-loader';
import { useThemeConfig } from '@docusaurus/theme-common';
import { useFilteredAndTreeifiedTOC } from '@docusaurus/theme-common/internal';
import TOCItemTree from '@theme/TOCItems/Tree';
import { useTOCHighlight, type TOCHighlightConfig } from './useTOCHighlight';

// Swizzled from @docusaurus/theme-classic's theme/TOCItems for exactly one
// reason: it's the file that calls useTOCHighlight (the TOC scroll-spy),
// which isn't itself swizzlable — it's a plain hook export from
// @docusaurus/theme-common, not a @theme/* alias. See ./useTOCHighlight.ts
// for why the stock version silently stopped working once headings render
// via lt-text instead of bare h1-h6. Everything else here — treeifying the
// flat TOC list, TOCItemTree's own list rendering — is unchanged from the
// original; this is not a visual restyle of the TOC widget.
interface TOCItemsProps {
  toc: readonly TOCItem[];
  className?: string;
  linkClassName?: string | null;
  linkActiveClassName?: string;
  minHeadingLevel?: number;
  maxHeadingLevel?: number;
  [key: string]: unknown;
}

export default function TOCItems({
  toc,
  className = 'table-of-contents table-of-contents__left-border',
  linkClassName = 'table-of-contents__link',
  linkActiveClassName = undefined,
  minHeadingLevel: minHeadingLevelOption,
  maxHeadingLevel: maxHeadingLevelOption,
  ...props
}: TOCItemsProps): JSX.Element | null {
  const themeConfig = useThemeConfig();
  const minHeadingLevel = minHeadingLevelOption ?? themeConfig.tableOfContents.minHeadingLevel;
  const maxHeadingLevel = maxHeadingLevelOption ?? themeConfig.tableOfContents.maxHeadingLevel;
  const tocTree = useFilteredAndTreeifiedTOC({ toc, minHeadingLevel, maxHeadingLevel });

  const tocHighlightConfig: TOCHighlightConfig | undefined = useMemo(() => {
    if (linkClassName && linkActiveClassName) {
      return { linkClassName, linkActiveClassName, minHeadingLevel, maxHeadingLevel };
    }
    return undefined;
  }, [linkClassName, linkActiveClassName, minHeadingLevel, maxHeadingLevel]);

  useTOCHighlight(tocHighlightConfig);

  return <TOCItemTree toc={tocTree} className={className} linkClassName={linkClassName ?? null} {...props} />;
}
