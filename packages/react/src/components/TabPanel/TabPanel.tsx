import { useRef, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { TabPanel as TabPanelEl } from '@latty/web';

export type TabPanelProps = {
  value?: string;
  active?: boolean;
  children?: ReactNode;
};

export const TabPanel = forwardRef<TabPanelEl, TabPanelProps>(function TabPanel({ children, ...props }, forwardedRef) {
  const innerRef = useRef<TabPanelEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-tab-panel ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-tab-panel>
  );
});
TabPanel.displayName = 'TabPanel';
