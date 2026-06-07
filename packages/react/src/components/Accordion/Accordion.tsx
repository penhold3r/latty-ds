import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Accordion as AccordionEl, LattyIconName } from '@latty-ds/web';

export type AccordionProps = Omit<HTMLAttributes<AccordionEl>, 'onToggle'> & {
  label?: string;
  iconStart?: LattyIconName;
  appearance?: AccordionEl['appearance'];
  open?: boolean;
  disabled?: boolean;
  uppercase?: boolean;
  onToggle?: (detail: { open: boolean }) => void;
};

export const Accordion = forwardRef<AccordionEl, AccordionProps>(function Accordion(
  { onToggle, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<AccordionEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onToggle) return;
    const h = (ev: Event) => onToggle!((ev as CustomEvent).detail);
    el.addEventListener('toggle', h);
    return () => el.removeEventListener('toggle', h);
  }, [onToggle]);

  return (
    <lt-accordion ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-accordion>
  );
});
Accordion.displayName = 'Accordion';
