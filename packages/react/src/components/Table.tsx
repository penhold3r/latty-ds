import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Table as TableEl } from '@latty/web';

export type TableProps = {
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
  internalSort?: TableEl['internalSort'];
  sortedData?: TableEl['sortedData'];
  currentSort?: TableEl['currentSort'];
  onLtSortChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Table = forwardRef<TableEl, TableProps>(
  function Table({ onLtSortChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<TableEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtSortChange) return;
      const h = (ev: Event) => onLtSortChange!(ev as CustomEvent);
      el.addEventListener('lt-sort-change', h);
      return () => el.removeEventListener('lt-sort-change', h);
    }, [onLtSortChange]);

    return (
      <lt-table ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-table>
    );
  }
);
Table.displayName = 'Table';
