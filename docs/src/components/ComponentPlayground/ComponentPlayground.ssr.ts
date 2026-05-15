import type { PlaygroundMember, PlaygroundGroup } from './ComponentPlayground.types.ts';

export const defaultValue = (member: PlaygroundMember, overrides: Record<string, unknown> = {}): unknown => {
  if (member.name in overrides) return overrides[member.name];
  if (member.default !== undefined && member.default !== '') return member.default;
  if (member.type === 'boolean') return false;
  if (member.type === 'select' && member.options?.length) return member.options[0];
  return '';
};

export const toLabel = (name: string): string =>
  name
    .split('-')
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ');

export const buildSubTagsData = (
  subTagsProp: string[],
  subTagsFilterProp: Record<string, string[]>,
  allManifest: Record<string, { members?: PlaygroundMember[] }>
): PlaygroundGroup[] =>
  subTagsProp.map((st) => {
    const allStMembers: PlaygroundMember[] = allManifest[st]?.members ?? [];
    const filteredMembers = subTagsFilterProp[st]
      ? allStMembers.filter((m) => subTagsFilterProp[st].includes(m.name))
      : allStMembers;
    return {
      tag: st,
      members: filteredMembers,
      defaults: Object.fromEntries(filteredMembers.map((m) => [m.name, defaultValue(m)]))
    };
  });
