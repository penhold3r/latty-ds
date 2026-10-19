import { useRef, useImperativeHandle, forwardRef, type HTMLAttributes } from 'react';
import type { List as ListEl } from '@latty-ds/web';

export type ListProps = HTMLAttributes<ListEl> & {
  type?: ListEl['type'];
  size?: ListEl['size'];
  markerColor?: string;
  divider?: boolean;
  noMarker?: boolean;
};

export const List = forwardRef<ListEl, ListProps>(function List(
  { markerColor, divider, noMarker, children, ...props },
  forwardedRef
) {
  const innerRef = useRef<ListEl>(null);

  useImperativeHandle(forwardedRef, () => innerRef.current!);

  return (
    <lt-list
      ref={innerRef}
      suppressHydrationWarning
      {...(props as Record<string, unknown>)}
      marker-color={markerColor}
      divider={divider || undefined}
      no-marker={noMarker || undefined}
    >
      {children}
    </lt-list>
  );
});
List.displayName = 'List';
