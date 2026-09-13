import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import type { Props } from '@theme/TOCItems/Tree';

import './Tree.styles.css';

// Swizzled from @docusaurus/theme-classic's theme/TOCItems/Tree — the actual
// list-markup half of the TOC widget (./index.tsx only exists in this repo to
// fix the scroll-spy hook, see ./useTOCHighlight.ts) — to render via lt-list
// instead of Infima's bare <ul>/<li>.
//
// Slotted children are plain <li>, not lt-list-item: lt-list-item sets
// role="listitem" on its own host, but that host is still the direct DOM
// child of the real <ul>/<ol> lt-list renders internally, which fails the
// same "an <ol>/<ul> must only directly contain <li>" content-model rule
// lt-breadcrumb's <ol> did before that fix (a custom element can never
// literally be <li>). Logged as a new finding in
// _agent-plans/COMPONENT-BUGS.md rather than fixed here mid-doc-swizzle.
// Plain <li> sidesteps it entirely and is lt-list's own primary documented
// usage pattern anyway.
//
// linkClassName/linkActiveClassName (Infima's scroll-spy classes, wired up
// in ./useTOCHighlight.ts) are untouched, still landing on the real <a>
// Link renders — only the surrounding list markup changes. `no-marker`
// drops lt-list's bullet + indent (TOC never had bullets); Tree.styles.css
// restores a smaller indent for nested lists only, via ::part(list), to
// keep the h3-under-h2 hierarchy visible.
function TOCItemTree({ toc, className, linkClassName, isChild }: Props): ReactNode {
  if (!toc.length) {
    return null;
  }
  return (
    <lt-list no-marker class={isChild ? undefined : className}>
      {toc.map((heading) => (
        <li key={heading.id}>
          <Link
            to={`#${heading.id}`}
            className={linkClassName ?? undefined}
            // Developer provided the HTML, so assume it's safe.
            dangerouslySetInnerHTML={{ __html: heading.value }}
          />
          <TOCItemTree isChild toc={heading.children} className={className} linkClassName={linkClassName} />
        </li>
      ))}
    </lt-list>
  );
}

export default React.memo(TOCItemTree);
