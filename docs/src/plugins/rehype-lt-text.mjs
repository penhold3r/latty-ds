/**
 * Rehype plugin that replaces native heading and paragraph elements produced
 * by the markdown parser with lt-text custom elements. This means any MDX
 * file can use plain markdown syntax (# Heading, paragraph text) and still
 * render with full design-system typography — no explicit <lt-text> tags
 * needed in the source.
 */

const HEADING_VARIANTS = { h1: 'h1', h2: 'h2', h3: 'h3', h4: 'h4', h5: 'h5', h6: 'h6' };

export function rehypeLtText() {
  return (tree) => {
    walk(tree);
  };
}

function walk(node) {
  if (node.type === 'element') {
    const variant = HEADING_VARIANTS[node.tagName];
    if (variant) {
      node.tagName = 'lt-text';
      node.properties = { ...node.properties, variant };
    } else if (node.tagName === 'p') {
      node.tagName = 'lt-text';
      node.properties = { ...node.properties, variant: 'body' };
    }
  }
  if (Array.isArray(node.children)) {
    for (const child of node.children) walk(child);
  }
}
