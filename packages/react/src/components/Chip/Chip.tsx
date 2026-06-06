import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Chip as ChipEl } from '@latty-ds/web';

export type ChipProps = HTMLAttributes<ChipEl> & {
  appearance?: ChipEl['appearance'];
  variant?: ChipEl['variant'];
  size?: ChipEl['size'];
  disabled?: boolean;
  deletable?: boolean;
  background?: string;
  onDelete?: (event: CustomEvent) => void;
};

export const Chip = forwardRef<ChipEl, ChipProps>(function Chip({ onDelete, children, ...props }, forwardedRef) {
  const innerRef = useRef<ChipEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onDelete) return;
    const h = (ev: Event) => onDelete!(ev as CustomEvent);
    el.addEventListener('delete', h);
    return () => el.removeEventListener('delete', h);
  }, [onDelete]);

  return (
    <lt-chip ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-chip>
  );
});
Chip.displayName = 'Chip';
