import { useEffect, useRef } from 'react';
import { useThemeConfig } from '@docusaurus/theme-common';

// Reimplementation of @docusaurus/theme-common's useTOCHighlight hook — not
// swizzlable directly (it's a plain hook export, not a @theme/* alias), so
// this whole file exists to fix exactly one thing in it: `getAnchors()`
// selects heading elements with `h${level}.anchor` (a literal tag-name
// selector). Since documentation/src/theme/Heading renders every heading via
// `<lt-text variant="h2" as="h2" class="anchor">` instead of a bare `<h2>`,
// the real `<h2>` lives inside lt-text's shadow DOM — which
// `document.querySelectorAll` from the light DOM can never see, tag-name
// selector or not. Swapped for an attribute selector
// (`lt-text[variant="h2"].anchor`), which matches the light-DOM host
// regardless of what tag its shadow root renders internally. Everything
// else below is unchanged from the original.
export interface TOCHighlightConfig {
  linkClassName: string;
  linkActiveClassName: string;
  minHeadingLevel: number;
  maxHeadingLevel: number;
}

function getVisibleBoundingClientRect(element: Element): DOMRect {
  const rect = element.getBoundingClientRect();
  const hasNoHeight = rect.top === rect.bottom;
  if (hasNoHeight && element.parentNode instanceof Element) {
    return getVisibleBoundingClientRect(element.parentNode);
  }
  return rect;
}

function isInViewportTopHalf(boundingRect: DOMRect): boolean {
  return boundingRect.top > 0 && boundingRect.bottom < window.innerHeight / 2;
}

function getAnchors({
  minHeadingLevel,
  maxHeadingLevel
}: Pick<TOCHighlightConfig, 'minHeadingLevel' | 'maxHeadingLevel'>): Element[] {
  const selectors: string[] = [];
  for (let i = minHeadingLevel; i <= maxHeadingLevel; i += 1) {
    selectors.push(`lt-text[variant="h${i}"].anchor`);
  }
  return Array.from(document.querySelectorAll(selectors.join()));
}

function getActiveAnchor(anchors: Element[], { anchorTopOffset }: { anchorTopOffset: number }): Element | null {
  const nextVisibleAnchor = anchors.find((anchor) => {
    const boundingRect = getVisibleBoundingClientRect(anchor);
    return boundingRect.top >= anchorTopOffset;
  });
  if (nextVisibleAnchor) {
    const boundingRect = getVisibleBoundingClientRect(nextVisibleAnchor);
    if (isInViewportTopHalf(boundingRect)) {
      return nextVisibleAnchor;
    }
    return anchors[anchors.indexOf(nextVisibleAnchor) - 1] ?? null;
  }
  return anchors[anchors.length - 1] ?? null;
}

function getLinkAnchorValue(link: HTMLAnchorElement): string {
  return decodeURIComponent(link.href.substring(link.href.indexOf('#') + 1));
}

function getLinks(linkClassName: string): HTMLAnchorElement[] {
  return Array.from(document.getElementsByClassName(linkClassName)) as HTMLAnchorElement[];
}

function getNavbarHeight(): number {
  return document.querySelector('.navbar')?.clientHeight ?? 0;
}

function useAnchorTopOffsetRef() {
  const anchorTopOffsetRef = useRef(0);
  const {
    navbar: { hideOnScroll }
  } = useThemeConfig();
  useEffect(() => {
    anchorTopOffsetRef.current = hideOnScroll ? 0 : getNavbarHeight();
  }, [hideOnScroll]);
  return anchorTopOffsetRef;
}

export function useTOCHighlight(config: TOCHighlightConfig | undefined): void {
  const lastActiveLinkRef = useRef<HTMLAnchorElement | undefined>(undefined);
  const anchorTopOffsetRef = useAnchorTopOffsetRef();

  useEffect(() => {
    if (!config) {
      return () => {};
    }
    const { linkClassName, linkActiveClassName, minHeadingLevel, maxHeadingLevel } = config;

    function updateLinkActiveClass(link: HTMLAnchorElement, active: boolean) {
      if (active) {
        if (lastActiveLinkRef.current && lastActiveLinkRef.current !== link) {
          lastActiveLinkRef.current.classList.remove(linkActiveClassName);
        }
        link.classList.add(linkActiveClassName);
        lastActiveLinkRef.current = link;
      } else {
        link.classList.remove(linkActiveClassName);
      }
    }

    function updateActiveLink() {
      const links = getLinks(linkClassName);
      const anchors = getAnchors({ minHeadingLevel, maxHeadingLevel });
      const activeAnchor = getActiveAnchor(anchors, { anchorTopOffset: anchorTopOffsetRef.current });
      const activeLink = links.find((link) => activeAnchor && activeAnchor.id === getLinkAnchorValue(link));
      links.forEach((link) => {
        updateLinkActiveClass(link, link === activeLink);
      });
    }

    document.addEventListener('scroll', updateActiveLink);
    document.addEventListener('resize', updateActiveLink);
    updateActiveLink();

    return () => {
      document.removeEventListener('scroll', updateActiveLink);
      document.removeEventListener('resize', updateActiveLink);
    };
  }, [config, anchorTopOffsetRef]);
}
