import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type TableHTMLAttributes } from 'react';
import type { Table as TableEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type TableProps = Omit<TableHTMLAttributes<TableEl>, 'loading' | 'label' | 'height' | 'selected'> & {
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
  height?: string;
  virtualized?: boolean;
  rowHeight?: number;
  rowKey?: string;
  selectionMode?: TableEl['selectionMode'];
  pageSize?: number;
  page?: number;
  selected?: TableEl['selected'];
  labels?: TableEl['labels'];
  sort?: TableEl['sort'];
  onSortChange?: (event: CustomEvent) => void;
  onColumnresize?: (event: CustomEvent) => void;
  onRowclick?: (event: CustomEvent) => void;
  onSelectionChange?: (event: CustomEvent) => void;
};

export const Table = forwardRef<TableEl, TableProps>(function Table(
  {
    onSortChange,
    onColumnresize,
    onRowclick,
    onSelectionChange,
    columns,
    data,
    selected,
    labels,
    sort,
    responsiveMode,
    hoverable,
    striped,
    bordered,
    loading,
    emptyMessage,
    captionSide,
    stickyHeader,
    virtualized,
    rowHeight,
    rowKey,
    selectionMode,
    pageSize,
    children,
    ...props
  },
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
    if (!el || !onColumnresize) return;
    const h = (ev: Event) => onColumnresize!(ev as CustomEvent);
    el.addEventListener('columnresize', h);
    return () => el.removeEventListener('columnresize', h);
  }, [onColumnresize]);
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
    <lt-table
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      responsive-mode={responsiveMode}
      hoverable={hoverable || undefined}
      striped={striped || undefined}
      bordered={bordered || undefined}
      loading={loading || undefined}
      empty-message={emptyMessage}
      caption-side={captionSide}
      sticky-header={stickyHeader || undefined}
      virtualized={virtualized || undefined}
      row-height={rowHeight}
      row-key={rowKey}
      selection-mode={selectionMode}
      page-size={pageSize}
    >
      {children}
    </lt-table>
  );
});
Table.displayName = 'Table';
