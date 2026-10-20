import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Pagination as PaginationEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type PaginationProps = Omit<HTMLAttributes<PaginationEl>, 'onChange' | 'size' | 'disabled'> & {
  page?: number;
  totalPages?: number;
  size?: PaginationEl['size'];
  disabled?: boolean;
  labels?: PaginationEl['labels'];
  onChange?: (event: CustomEvent<{ page: number }>) => void;
};

export const Pagination = forwardRef<PaginationEl, PaginationProps>(function Pagination(
  { onChange, labels, totalPages, disabled, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<PaginationEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ page: number }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-pagination
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      total-pages={totalPages}
      disabled={disabled || undefined}
    >
      {children}
    </lt-pagination>
  );
});
Pagination.displayName = 'Pagination';
