import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { TabPanel as TabPanelEl } from '@latty-ds/web';

export type TabPanelProps = HTMLAttributes<TabPanelEl> & {
  value?: string;
  active?: boolean;
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
