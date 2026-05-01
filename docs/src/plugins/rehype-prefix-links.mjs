/**
 * Rehype plugin that rewrites root-relative hrefs in MDX content to include
 * the Astro base path. Astro does this automatically for Astro component links
 * but NOT for links inside MDX/Markdown prose.
 */
export function rehypePrefixLinks(base) {
  if (!base) return () => {};
  return (tree) => {
    walk(tree, base);
  };
}

function walk(node, base) {
  if (node.type === 'element' && node.tagName === 'a') {
    const href = node.properties?.href;
    if (typeof href === 'string' && href.startsWith('/') && !href.startsWith(base)) {
      node.properties.href = base + href;
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child, base);
  }
}
