import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
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
  label?: string;
  caption?: string;
  captionSide?: TableEl['captionSide'];
  stickyHeader?: boolean;
  rowKey?: string;
  selectionMode?: TableEl['selectionMode'];
  pageSize?: number;
  page?: number;
  selected?: TableEl['selected'];
  labels?: TableEl['labels'];
  sort?: TableEl['sort'];
  onSortChange?: (event: CustomEvent) => void;
  onRowclick?: (event: CustomEvent) => void;
  onSelectionChange?: (event: CustomEvent) => void;
};

export const Table = forwardRef<TableEl, TableProps>(function Table(
  { onSortChange, onRowclick, onSelectionChange, columns, data, selected, labels, sort, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TableEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onSortChange) return;
    const h = (ev: Event) => onSortChange!(ev as CustomEvent);
    el.addEventListener('sortchange', h);
    return () => el.removeEventListener('sortchange', h);
  }, [onSortChange]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onRowclick) return;
    const h = (ev: Event) => onRowclick!(ev as CustomEvent);
    el.addEventListener('rowclick', h);
    return () => el.removeEventListener('rowclick', h);
  }, [onRowclick]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onSelectionChange) return;
    const h = (ev: Event) => onSelectionChange!(ev as CustomEvent);
    el.addEventListener('selectionchange', h);
    return () => el.removeEventListener('selectionchange', h);
  }, [onSelectionChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (columns !== undefined) el.columns = columns;
    if (data !== undefined) el.data = data;
    if (selected !== undefined) el.selected = selected;
    if (labels !== undefined) el.labels = labels;
    if (sort !== undefined) el.sort = sort;
  }, [columns, data, selected, labels, sort]);

  return (
    <lt-table ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-table>
  );
});
Table.displayName = 'Table';
