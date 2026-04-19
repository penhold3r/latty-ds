import { useMemo } from 'react';
import { ColorPalette, ColorItem } from '@storybook/blocks';

import { toTitleCase } from '@utils/strings';
import tokens from '../../dist/tokens.json';

const STEPS = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'] as const;

type Role = keyof typeof tokens.color;

const isBW = (role: Role) => role === 'white' || role === 'black';

const rampObject = (role: Role) => {
  const scale = tokens.color[role] as Record<string, string>;
  return Object.fromEntries(STEPS.map((s) => [s, scale[s]]));
};

export const ColorPalettes = () => {
  const items = useMemo(() => {
    return (Object.keys(tokens.color) as Role[]).map((role) => ({
      role,
      title: toTitleCase(role),
      subtitle: `--lt-color-${role}${isBW(role) ? '' : '-*'}`,
      colors: isBW(role)
        ? {
            [role]: tokens.color[role]
          }
        : rampObject(role)
    }));
  }, []);

  return (
    <ColorPalette>
      {items.map((item) => (
        <ColorItem key={item.role} title={item.title} subtitle={item.subtitle} colors={item.colors} />
      ))}
    </ColorPalette>
  );
};
