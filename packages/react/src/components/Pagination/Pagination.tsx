import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Pagination as PaginationEl } from '@latty/web';

export type PaginationProps = {
  page?: number;
  totalPages?: number;
  size?: PaginationEl['size'];
  disabled?: boolean;
  onLtChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Pagination = forwardRef<PaginationEl, PaginationProps>(function Pagination(
  { onLtChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<PaginationEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onLtChange) return;
    const h = (ev: Event) => onLtChange!(ev as CustomEvent);
    el.addEventListener('lt-change', h);
    return () => el.removeEventListener('lt-change', h);
  }, [onLtChange]);

  return (
    <lt-pagination ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-pagination>
  );
});
Pagination.displayName = 'Pagination';
