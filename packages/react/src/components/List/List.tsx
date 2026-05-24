import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { List as ListEl } from '@latty/web';

export type ListProps = HTMLAttributes<ListEl> & {
  type?: ListEl['type'];
  size?: ListEl['size'];
  markerColor?: string;
  divider?: boolean;
  noMarker?: boolean;
};

export const List = forwardRef<ListEl, ListProps>(function List({ children, ...props }, forwardedRef) {
  const innerRef = useRef<ListEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-list ref={innerRef} {...(props as Record<string, unknown>)}>
      {children}
    </lt-list>
  );
});
List.displayName = 'List';
