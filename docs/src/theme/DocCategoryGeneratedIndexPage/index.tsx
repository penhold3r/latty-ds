import React from 'react';
import Link from '@docusaurus/Link';
import { PageMetadata } from '@docusaurus/theme-common';
import { useCurrentSidebarCategory, useDocById } from '@docusaurus/plugin-content-docs/client';
import type { PropSidebarItem } from '@docusaurus/plugin-content-docs';
import useBaseUrl from '@docusaurus/useBaseUrl';
import DocBreadcrumbs from '@theme/DocBreadcrumbs';
import DocPaginator from '@theme/DocPaginator';
import Heading from '@theme/Heading';
import './styles.css';

// Swizzled from @docusaurus/theme-classic's theme/DocCategoryGeneratedIndexPage
// (its DocCardList/DocCard dependents folded in here too, since nothing else
// in this site references them — same economy-of-scope as DocPaginator's own
// swizzle) to render via lt-text/lt-surface instead of Infima's plain h1 +
// `.card` grid.
//
// Needed once every `_category_.json` got a `"link": {"type":
// "generated-index"}` (see docs/content/*/​_category_.json): before that,
// every category sidebar item had no `href` at all, so the category
// breadcrumb crumb (docs/src/theme/DocBreadcrumbs) correctly rendered as
// unclickable plain text per its own, by-design fallback — this page is what
// that href now actually points to.
//
// Same whole-card-is-a-link pattern as ComponentGrid/DocPaginator's cards: an
// outer <Link> (kept for Docusaurus's client-side router) wrapping an
// lt-surface for the visual card.
//
// This site's categories are all flat (no nested sub-categories, confirmed by
// `docs/content/*`'s folder structure), so every item here is always a plain
// doc link — a nested-category card (Docusaurus's own `CardCategory`,
// `findFirstSidebarItemLink`) isn't implemented since nothing exercises it;
// add it if a category ever gains a sub-category.

interface PageInfo {
  title: string;
  permalink: string;
}

interface CategoryGeneratedIndex {
  title: string;
  description?: string;
  keywords?: string | readonly string[];
  image?: string;
  navigation: { previous?: PageInfo; next?: PageInfo };
}

function CategoryCard({ item }: { item: PropSidebarItem }): JSX.Element | null {
  const doc = useDocById(item.type === 'link' ? item.docId : undefined);
  if (item.type !== 'link' || !item.href) {
    return null;
  }
  return (
    <Link className="category-index-card" to={item.href}>
      <lt-surface appearance="outlined" elevation="0">
        <div className="category-index-card__body">
          <lt-text variant="label">{item.label}</lt-text>
          {doc?.description && <lt-text variant="body-sm">{doc.description}</lt-text>}
        </div>
      </lt-surface>
    </Link>
  );
}

function DocCategoryGeneratedIndexPageMetadata({
  categoryGeneratedIndex
}: {
  categoryGeneratedIndex: CategoryGeneratedIndex;
}): JSX.Element {
  return (
    <PageMetadata
      title={categoryGeneratedIndex.title}
      description={categoryGeneratedIndex.description}
      keywords={categoryGeneratedIndex.keywords}
      image={useBaseUrl(categoryGeneratedIndex.image)}
    />
  );
}

function DocCategoryGeneratedIndexPageContent({
  categoryGeneratedIndex
}: {
  categoryGeneratedIndex: CategoryGeneratedIndex;
}): JSX.Element {
  const category = useCurrentSidebarCategory();

  return (
    <div className="category-index-page">
      <DocBreadcrumbs />
      <header>
        <Heading as="h1">{categoryGeneratedIndex.title}</Heading>
        {categoryGeneratedIndex.description && (
          <lt-text variant="body" as="p">
            {categoryGeneratedIndex.description}
          </lt-text>
        )}
      </header>
      <section className="category-index-grid">
        {category.items.map((item, idx) => (
          <CategoryCard key={idx} item={item} />
        ))}
      </section>
      <footer className="margin-top--md">
        <DocPaginator
          previous={categoryGeneratedIndex.navigation.previous}
          next={categoryGeneratedIndex.navigation.next}
        />
      </footer>
    </div>
  );
}

export default function DocCategoryGeneratedIndexPage({
  categoryGeneratedIndex
}: {
  categoryGeneratedIndex: CategoryGeneratedIndex;
}): JSX.Element {
  return (
    <>
      <DocCategoryGeneratedIndexPageMetadata categoryGeneratedIndex={categoryGeneratedIndex} />
      <DocCategoryGeneratedIndexPageContent categoryGeneratedIndex={categoryGeneratedIndex} />
    </>
  );
}
