import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Tab as TabEl, LattyIconName } from '@latty-ds/web';

export type TabProps = HTMLAttributes<TabEl> & {
  label?: string;
  value?: string;
  iconStart?: LattyIconName;
  active?: boolean;
  disabled?: boolean;
  size?: TabEl['size'];
  orientation?: TabEl['orientation'];
};

export const Tab = forwardRef<TabEl, TabProps>(function Tab({ children, ...props }, forwardedRef) {
  const innerRef = useRef<TabEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-tab ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-tab>
  );
});
Tab.displayName = 'Tab';
