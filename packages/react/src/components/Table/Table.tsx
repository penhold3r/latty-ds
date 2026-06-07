import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Table as TableEl } from '@latty-ds/web';

export type TableProps = HTMLAttributes<TableEl> & {
  columns?: TableEl['columns'];
  data?: TableEl['data'];
  density?: TableEl['density'];
  responsiveMode?: TableEl['responsiveMode'];
  hoverable?: boolean;
  striped?: boolean;
  bordered?: boolean;
  loading?: boolean;
  emptyMessage?: string;
  rowKey?: string;
  sort?: TableEl['sort'];
  onSortChange?: () => void;
};

export const Table = forwardRef<TableEl, TableProps>(function Table(
  { onSortChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TableEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onSortChange) return;
    const h = () => onSortChange!();
    el.addEventListener('sort-change', h);
    return () => el.removeEventListener('sort-change', h);
  }, [onSortChange]);

  return (
    <lt-table ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-table>
  );
});
Table.displayName = 'Table';
