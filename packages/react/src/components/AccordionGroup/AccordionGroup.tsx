import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { AccordionGroup as AccordionGroupEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type AccordionGroupProps = Omit<HTMLAttributes<AccordionGroupEl>, 'multiple'> & {
  multiple?: boolean;
};

export const AccordionGroup = forwardRef<AccordionGroupEl, AccordionGroupProps>(function AccordionGroup(
  { multiple, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<AccordionGroupEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-accordion-group
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      multiple={multiple || undefined}
    >
      {children}
    </lt-accordion-group>
  );
});
AccordionGroup.displayName = 'AccordionGroup';
