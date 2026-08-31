import type { ReactNode } from 'react';
import './RecipePreview.styles.css';

interface Props {
  previewHeight?: string;
  children: ReactNode;
}

// Ported from docs/src/components/RecipePreview (the Astro site).
export default function RecipePreview({ previewHeight = 'auto', children }: Props): JSX.Element {
  return (
    <div className="recipe-preview" style={previewHeight !== 'auto' ? { minHeight: previewHeight } : undefined}>
      {children}
    </div>
  );
}
