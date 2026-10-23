import { useRef, useImperativeHandle, forwardRef, type AnchorHTMLAttributes } from 'react';
import type { BreadcrumbItem as BreadcrumbItemEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type BreadcrumbItemProps = Omit<AnchorHTMLAttributes<BreadcrumbItemEl>, 'href'> & {
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
      {...normalizeNativeProps(props as Record<string, unknown>)}
      current={current || undefined}
    >
      {children}
    </lt-breadcrumb-item>
  );
});
BreadcrumbItem.displayName = 'BreadcrumbItem';
