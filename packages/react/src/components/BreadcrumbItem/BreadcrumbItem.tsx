import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { BreadcrumbItem as BreadcrumbItemEl } from '@latty/web';

export type BreadcrumbItemProps = {
  href?: string;
  current?: boolean;
  children?: ReactNode;
};

export const BreadcrumbItem = forwardRef<BreadcrumbItemEl, BreadcrumbItemProps>(
  function BreadcrumbItem({ children, ...props }, forwardedRef) {
    const innerRef = useRef<BreadcrumbItemEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    return (
      <lt-breadcrumb-item ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-breadcrumb-item>
    );
  }
);
BreadcrumbItem.displayName = 'BreadcrumbItem';
