import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Breadcrumb as BreadcrumbEl } from '@latty/web';

export type BreadcrumbProps = {
  separator?: string;
  children?: ReactNode;
};

export const Breadcrumb = forwardRef<BreadcrumbEl, BreadcrumbProps>(function Breadcrumb(
  { children, ...props },
  forwardedRef
) {
  const innerRef = useRef<BreadcrumbEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-breadcrumb ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-breadcrumb>
  );
});
Breadcrumb.displayName = 'Breadcrumb';
