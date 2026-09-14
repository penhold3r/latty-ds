import React, { type ReactNode } from 'react';
import Link from '@docusaurus/Link';
import type { TOCTreeNode } from '@docusaurus/theme-common/internal';
import type { Props } from '@theme/TOCItems/Tree';

import './Tree.styles.css';

// Swizzled from @docusaurus/theme-classic's theme/TOCItems/Tree — the actual
// list-markup half of the TOC widget (./index.tsx only exists in this repo to
// fix the scroll-spy hook, see ./useTOCHighlight.ts) — to render via lt-list
// instead of Infima's bare, recursively-nested <ul>/<li>.
//
// Flattened into a single <lt-list> (depth tracked via data-toc-depth,
// indentation applied in Tree.styles.css) rather than mirroring the
// original's recursive <li><lt-list><li>...</li></lt-list></li> nesting.
// That recursive shape is a real parsing hazard, not just a cosmetic
// mismatch: verified directly against a browser's actual HTML parser (not
// React's client-side DOM patching, which never re-parses HTML text) that
// an <li> immediately auto-closes an still-open ancestor <li> the moment a
// *further* <li> is seen, *even through* an intervening custom element —
// custom elements aren't part of the fixed "special category" the HTML5
// parsing algorithm uses to decide whether an <li> blocks that auto-close
// (only real elements like <ul>/<ol>/<table> are). Only <ul>/<ol> actually
// suppress it. So on Docusaurus's real prerendered HTML (or any raw-HTML
// consumer — a crawler, view-source, no-JS), the "nested" h3 items were
// silently promoted to be simple top-level siblings of their h2 and the
// wrapping <lt-list> ended up empty — confirmed by feeding the exact
// prerendered markup through page.setContent() and inspecting the resulting
// DOM tree. React's dev-mode "cannot be a descendant" console warning during
// hydration was the first symptom of this, not a false positive.
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
// Link renders.
function flattenToc(toc: readonly TOCTreeNode[], depth: number): Array<{ heading: TOCTreeNode; depth: number }> {
  return toc.flatMap((heading) => [{ heading, depth }, ...flattenToc(heading.children, depth + 1)]);
}

function TOCItemTree({ toc, className, linkClassName }: Props): ReactNode {
  if (!toc.length) {
    return null;
  }
  return (
    <lt-list no-marker class={className}>
      {flattenToc(toc, 0).map(({ heading, depth }) => (
        <li key={heading.id} data-toc-depth={depth}>
          <Link
            to={`#${heading.id}`}
            className={linkClassName ?? undefined}
            // Developer provided the HTML, so assume it's safe.
            dangerouslySetInnerHTML={{ __html: heading.value }}
          />
        </li>
      ))}
    </lt-list>
  );
}

export default React.memo(TOCItemTree);
