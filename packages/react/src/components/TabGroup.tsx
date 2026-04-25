import { useRef, useEffect, useImperativeHandle, forwardRef, type ReactNode } from 'react';
import type { TabGroup as TabGroupEl } from '@latty/web';

export type TabGroupProps = {
  value?: string;
  variant?: TabGroupEl['variant'];
  size?: TabGroupEl['size'];
  tabs?: TabGroupEl['tabs'];
  panels?: TabGroupEl['panels'];
  handleTabClick?: string;
  onChange?: (event: CustomEvent) => void;
  children?: ReactNode;
};

export const TabGroup = forwardRef<TabGroupEl, TabGroupProps>(
  function TabGroup({ onChange, children, ...props }, forwardedRef) {
    const innerRef = useRef<TabGroupEl>(null);

    useImperativeHandle(forwardedRef, () => innerRef.current!);

    useEffect(() => {
      const el = innerRef.current;
      if (!el || !onChange) return;
      const h = (ev: Event) => onChange!(ev as CustomEvent);
      el.addEventListener('change', h);
      return () => el.removeEventListener('change', h);
    }, [onChange]);

    return (
      <lt-tab-group ref={innerRef} {...(props as Record<string, unknown>)}>
        {children}
      </lt-tab-group>
    );
  }
);
TabGroup.displayName = 'TabGroup';
