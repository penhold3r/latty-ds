import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Chip as ChipEl } from '@latty-ds/web';

export type ChipProps = Omit<HTMLAttributes<ChipEl>, 'onChange'> & {
  appearance?: ChipEl['appearance'];
  variant?: ChipEl['variant'];
  size?: ChipEl['size'];
  disabled?: boolean;
  deletable?: boolean;
  selectable?: boolean;
  selected?: boolean;
  background?: string;
  labels?: ChipEl['labels'];
  onDelete?: (event: CustomEvent) => void;
  onChange?: (event: CustomEvent<{ selected: boolean }>) => void;
};

export const Chip = forwardRef<ChipEl, ChipProps>(function Chip(
  { onDelete, onChange, labels, disabled, deletable, selectable, selected, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ChipEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onDelete) return;
    const h = (ev: Event) => onDelete!(ev as CustomEvent);
    el.addEventListener('delete', h);
    return () => el.removeEventListener('delete', h);
  }, [onDelete]);
  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ selected: boolean }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-chip
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      disabled={disabled || undefined}
      deletable={deletable || undefined}
      selectable={selectable || undefined}
      selected={selected || undefined}
    >
      {children}
    </lt-chip>
  );
});
Chip.displayName = 'Chip';
