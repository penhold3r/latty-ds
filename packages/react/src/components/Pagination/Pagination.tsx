import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Pagination as PaginationEl } from '@latty/web';

export type PaginationProps = Omit<HTMLAttributes<PaginationEl>, 'onChange'> & {
  page?: number;
  totalPages?: number;
  size?: PaginationEl['size'];
  disabled?: boolean;
  onChange?: (event: CustomEvent) => void;
};

export const Pagination = forwardRef<PaginationEl, PaginationProps>(function Pagination(
  { onChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<PaginationEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-pagination ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-pagination>
  );
});
Pagination.displayName = 'Pagination';
