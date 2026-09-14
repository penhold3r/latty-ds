import React from 'react';
import Link from '@docusaurus/Link';
import { translate } from '@docusaurus/Translate';
import './styles.css';

// Swizzled from @docusaurus/theme-classic's theme/DocPaginator (also used by
// PaginatorNavLink, folded in here rather than kept as a separate file since
// nothing else references it) to render via lt-surface/lt-text/lt-icon
// instead of Infima's `.pagination-nav` grid + `::before`/`::after` `«`/`»`
// glyphs. Same whole-card-is-a-link pattern already used by
// RecipeGrid/ComponentGrid/ExampleGrid: an outer `<Link className="...">`
// (kept, for Docusaurus's client-side router) wrapping an `lt-surface` for
// the visual card, so `.markdown a.pagination-card` needs the same
// underline-suppression rule those already got in custom.css.
interface PageInfo {
  title: string;
  permalink: string;
}

interface DocPaginatorProps {
  previous?: PageInfo;
  next?: PageInfo;
}

function PaginatorCard({ page, direction }: { page: PageInfo; direction: 'previous' | 'next' }): JSX.Element {
  const isNext = direction === 'next';
  const subLabel = translate(
    isNext
      ? {
          id: 'theme.docs.paginator.next',
          message: 'Next',
          description: 'The label used to navigate to the next doc'
        }
      : {
          id: 'theme.docs.paginator.previous',
          message: 'Previous',
          description: 'The label used to navigate to the previous doc'
        }
  );

  return (
    <Link className={`pagination-card pagination-card--${direction}`} to={page.permalink}>
      <lt-surface appearance="outlined" elevation="0">
        <div className="pagination-card__content">
          <lt-text variant="overline" class="text-muted">
            {subLabel}
          </lt-text>
          <div className="pagination-card__title-row">
            {!isNext && <lt-icon name="arrow-left" size="sm" />}
            <lt-text variant="body-sm">{page.title}</lt-text>
            {isNext && <lt-icon name="arrow-right" size="sm" />}
          </div>
        </div>
      </lt-surface>
    </Link>
  );
}

export default function DocPaginator({ previous, next }: DocPaginatorProps): JSX.Element {
  return (
    <nav
      className="pagination-nav docusaurus-mt-lg"
      aria-label={translate({
        id: 'theme.docs.paginator.navAriaLabel',
        message: 'Docs pages',
        description: 'The ARIA label for the docs pagination'
      })}
    >
      {previous ? <PaginatorCard page={previous} direction="previous" /> : <div />}
      {next && <PaginatorCard page={next} direction="next" />}
    </nav>
  );
}
