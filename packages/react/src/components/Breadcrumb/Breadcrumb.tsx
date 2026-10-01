import { useRef, useLayoutEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Breadcrumb as BreadcrumbEl } from '@latty-ds/web';

export type BreadcrumbProps = HTMLAttributes<BreadcrumbEl> & {
  separator?: string;
  labels?: BreadcrumbEl['labels'];
};

export const Breadcrumb = forwardRef<BreadcrumbEl, BreadcrumbProps>(function Breadcrumb(
  { labels, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<BreadcrumbEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-breadcrumb ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-breadcrumb>
  );
});
Breadcrumb.displayName = 'Breadcrumb';
