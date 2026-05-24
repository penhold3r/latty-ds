// codegen:manual — extended to wire tab-click event (not in CEM; dispatched manually by lt-tab)
import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { Tab as TabEl, LattyIconName } from '@latty/web';

export type TabProps = HTMLAttributes<TabEl> & {
  label?: string;
  value?: string;
  iconStart?: LattyIconName;
  active?: boolean;
  disabled?: boolean;
  size?: TabEl['size'];
  onTabClick?: (event: CustomEvent) => void;
};

export const Tab = forwardRef<TabEl, TabProps>(function Tab({ onTabClick, children, ...props }, forwardedRef) {
  const innerRef = useRef<TabEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onTabClick) return;
    const h = (ev: Event) => onTabClick!(ev as CustomEvent);
    el.addEventListener('tab-click', h);
    return () => el.removeEventListener('tab-click', h);
  }, [onTabClick]);

  return (
    <lt-tab ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-tab>
  );
});
Tab.displayName = 'Tab';
