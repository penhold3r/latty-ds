import { useRef, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { TabGroup as TabGroupEl } from '@latty-ds/web';

export type TabGroupProps = Omit<HTMLAttributes<TabGroupEl>, 'onChange'> & {
  value?: string;
  appearance?: TabGroupEl['appearance'];
  size?: TabGroupEl['size'];
  onChange?: (detail: { value: string }) => void;
};

export const TabGroup = forwardRef<TabGroupEl, TabGroupProps>(function TabGroup(
  { onChange, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TabGroupEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!((ev as CustomEvent).detail);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);

  return (
    <lt-tab-group ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-tab-group>
  );
});
TabGroup.displayName = 'TabGroup';
