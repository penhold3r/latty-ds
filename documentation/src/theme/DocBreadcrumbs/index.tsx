import React from 'react';
import { useSidebarBreadcrumbs } from '@docusaurus/plugin-content-docs/client';
import { useHomePageRoute } from '@docusaurus/theme-common/internal';
import useBaseUrl from '@docusaurus/useBaseUrl';
import { translate } from '@docusaurus/Translate';
import DocBreadcrumbsStructuredData from '@theme/DocBreadcrumbs/StructuredData';

// Swizzled from @docusaurus/theme-classic's theme/DocBreadcrumbs to render via
// lt-breadcrumb/lt-breadcrumb-item instead of Infima's plain <ul class="breadcrumbs">.
// The data source (`useSidebarBreadcrumbs`/`useHomePageRoute`) and the SEO
// structured-data sibling are untouched — only the rendered markup changes.
// lt-breadcrumb-item already covers exactly this shape natively: `href` for a
// link, `current` for the trailing non-linked item (matches
// `aria-current="page"` semantics Docusaurus's own version also set).
//
// No `aria-label` on either custom element (found via `pnpm a11y`, axe's
// `aria-prohibited-attr`): `aria-label` on a light-DOM host with no ARIA role
// of its own is invalid, and — since ARIA attributes don't cross into shadow
// DOM automatically — it never reached the actual interactive elements
// anyway. `lt-breadcrumb` already sets its own `aria-label="breadcrumb"`
// internally (see packages/web/src/components/breadcrumb/breadcrumb.ts), so
// nothing extra is needed there. The icon-only home link needs a real
// accessible name a different way: visually-hidden text *inside* the slot,
// alongside the decorative icon, so it becomes part of the actual `<a>`'s
// computed accessible name (lt-icon itself has no label/aria prop — it's
// purely decorative by design).
export default function DocBreadcrumbs(): JSX.Element | null {
  const breadcrumbs = useSidebarBreadcrumbs();
  const homePageRoute = useHomePageRoute();
  const homeHref = useBaseUrl('/');

  if (!breadcrumbs) {
    return null;
  }

  return (
    <>
      <DocBreadcrumbsStructuredData breadcrumbs={breadcrumbs} />
      <div className="theme-doc-breadcrumbs" style={{ marginBottom: '0.8rem' }}>
        <lt-breadcrumb>
          {homePageRoute && (
            <lt-breadcrumb-item href={homeHref}>
              <lt-icon name="home" size="sm" />
              <span className="visually-hidden">
                {translate({
                  id: 'theme.docs.breadcrumbs.home',
                  message: 'Home page',
                  description: 'The ARIA label for the home page in the breadcrumbs'
                })}
              </span>
            </lt-breadcrumb-item>
          )}
          {breadcrumbs.map((item, idx) => {
            const isLast = idx === breadcrumbs.length - 1;
            const href = item.type === 'category' && item.linkUnlisted ? undefined : item.href;
            return (
              <lt-breadcrumb-item key={idx} href={href} current={isLast}>
                {item.label}
              </lt-breadcrumb-item>
            );
          })}
        </lt-breadcrumb>
      </div>
    </>
  );
}
