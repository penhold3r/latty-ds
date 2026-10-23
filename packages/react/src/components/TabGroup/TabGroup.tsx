import { useRef, useLayoutEffect, useEffect, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { TabGroup as TabGroupEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type TabGroupProps = Omit<HTMLAttributes<TabGroupEl>, 'onChange' | 'value' | 'size'> & {
  value?: string;
  appearance?: TabGroupEl['appearance'];
  size?: TabGroupEl['size'];
  orientation?: TabGroupEl['orientation'];
  labels?: TabGroupEl['labels'];
  onChange?: (event: CustomEvent<{ value: string }>) => void;
};

export const TabGroup = forwardRef<TabGroupEl, TabGroupProps>(function TabGroup(
  { onChange, labels, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TabGroupEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  useEffect(() => {
    const el = innerRef.current;
    if (!el || !onChange) return;
    const h = (ev: Event) => onChange!(ev as CustomEvent<{ value: string }>);
    el.addEventListener('change', h);
    return () => el.removeEventListener('change', h);
  }, [onChange]);
  useLayoutEffect(() => {
    const el = innerRef.current;
    if (!el) return;
    if (labels !== undefined) el.labels = labels;
  }, [labels]);

  return (
    <lt-tab-group ref={innerRef} suppressHydrationWarning {...normalizeNativeProps(props as Record<string, unknown>)}>
      {children}
    </lt-tab-group>
  );
});
TabGroup.displayName = 'TabGroup';
