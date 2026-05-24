import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { BreadcrumbItem as BreadcrumbItemEl } from '@latty/web';

export type BreadcrumbItemProps = HTMLAttributes<BreadcrumbItemEl> & {
  href?: string;
  current?: boolean;
  separator?: string;
};

export const BreadcrumbItem = forwardRef<BreadcrumbItemEl, BreadcrumbItemProps>(function BreadcrumbItem(
  { children, ...props },
  forwardedRef
) {
  const innerRef = useRef<BreadcrumbItemEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-breadcrumb-item ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-breadcrumb-item>
  );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';
