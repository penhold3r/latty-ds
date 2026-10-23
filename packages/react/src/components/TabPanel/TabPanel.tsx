import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { TabPanel as TabPanelEl } from '@latty-ds/web';
import { normalizeNativeProps } from '../../normalize-props';

export type TabPanelProps = Omit<HTMLAttributes<TabPanelEl>, 'value'> & {
  value?: string;
  active?: boolean;
};

export const TabPanel = forwardRef<TabPanelEl, TabPanelProps>(function TabPanel(
  { active, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<TabPanelEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-tab-panel
      ref={innerRef}
      suppressHydrationWarning
      {...normalizeNativeProps(props as Record<string, unknown>)}
      active={active || undefined}
    >
      {children}
    </lt-tab-panel>
  );
});
TabPanel.displayName = 'TabPanel';
