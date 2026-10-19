import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { BreadcrumbItem as BreadcrumbItemEl } from '@latty-ds/web';

export type BreadcrumbItemProps = HTMLAttributes<BreadcrumbItemEl> & {
  href?: string;
  current?: boolean;
  separator?: string;
};

export const BreadcrumbItem = forwardRef<BreadcrumbItemEl, BreadcrumbItemProps>(function BreadcrumbItem(
  { current, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<BreadcrumbItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-breadcrumb-item
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      current={current || undefined}
    >
      {children}
    </lt-breadcrumb-item>
  );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';
