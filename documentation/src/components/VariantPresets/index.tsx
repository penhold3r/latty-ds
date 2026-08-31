import manifest from '@latty-ds/web/manifest.json';
import './VariantPresets.styles.css';

interface Member {
  name: string;
  type: string;
  options?: string[];
}

interface Props {
  tag: string;
  slotContent?: string;
  prop?: string;
}

// Ported from docs/src/components/VariantPresets (the Astro site) — purely
// presentational, no client script in the original either. Astro's `set:html`
// becomes React's `dangerouslySetInnerHTML`; safe here since the injected
// markup is built entirely from our own manifest data (tag names, variant
// option strings), never from user input.
export default function VariantPresets({ tag, slotContent = '', prop }: Props): JSX.Element | null {
  const allManifest = manifest as Record<string, { members?: Member[] }>;
  const members = allManifest[tag]?.members ?? [];

  const variantMember =
    members.find((m) => m.name === (prop ?? 'variant')) ??
    members.find((m) => m.name === 'appearance') ??
    members.find((m) => m.type === 'select' && (m.options?.length ?? 0) > 1);

  const options = (variantMember?.options ?? []).filter((o) => o !== '');

  if (options.length === 0) return null;

  return (
    <div className="variant-presets">
      <div className="variant-presets-row">
        {options.map((option) => (
          <div key={option} className="variant-preset-item">
            <div
              className="variant-preset-preview"
              dangerouslySetInnerHTML={{
                __html: `<${tag} ${variantMember!.name}="${option}">${slotContent}</${tag}>`
              }}
            />
            <span className="variant-preset-label">{option}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
