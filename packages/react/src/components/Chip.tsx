import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { Chip as ChipEl } from '@latty/web';

export type ChipProps = {
  appearance?: ChipEl['appearance'];
  variant?: ChipEl['variant'];
  size?: ChipEl['size'];
  disabled?: boolean;
  deletable?: boolean;
  onLtDelete?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const Chip = forwardRef<ChipEl, ChipProps>(
  function Chip({ onLtDelete, children, ...props }, forwardedRef) {
    const innerRef = useRef<ChipEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onLtDelete) return;
      const h = (ev: Event) => onLtDelete!(ev as CustomEvent);
      el.addEventListener('lt-delete', h);
      return () => el.removeEventListener('lt-delete', h);
    }, [onLtDelete]);

    return (
      <lt-chip ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-chip>
    );
  }
);
Chip.displayName = 'Chip';
