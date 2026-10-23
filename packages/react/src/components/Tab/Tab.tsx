import { useRef, useImperativeHandle, forwardRef, type ButtonHTMLAttributes } from 'react';
import type { Tab as TabEl, LattyIconName } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type TabProps = Omit<ButtonHTMLAttributes<TabEl>, 'label' | 'value' | 'disabled' | 'size'> & {
  label?: string;
  value?: string;
  iconStart?: LattyIconName;
  active?: boolean;
  disabled?: boolean;
  size?: TabEl['size'];
  orientation?: TabEl['orientation'];
};

export const Tab = forwardRef<TabEl, TabProps>(function Tab(
  { iconStart, active, disabled, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TabEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-tab
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      icon-start={iconStart}
      active={active || undefined}
      disabled={disabled || undefined}
    >
      {children}
    </lt-tab>
  );
});
Tab.displayName = 'Tab';
