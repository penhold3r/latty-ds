import tokens from '@latty-ds/tokens/tokens.json';
import './ColorPalette.styles.css';

type ColorPalettes = Record<string, Record<string, string> | undefined>;

const color = (tokens as unknown as { color: ColorPalettes }).color;

const SEMANTIC_PALETTES = ['primary', 'secondary', 'success', 'warning', 'error', 'info', 'neutral'];
const SHADES = ['50', '100', '200', '300', '400', '500', '600', '700', '800', '900'];

function Swatches({ palette }: { palette: string }): JSX.Element {
  return (
    <div className="palette-row">
      {SHADES.map((shade) => {
        const hex = color[palette]?.[shade];
        if (!hex) return null;
        return (
          <div key={shade} className="swatch-wrap">
            <div className="swatch" style={{ background: hex }} />
            <span className="swatch-shade">{shade}</span>
            <span className="swatch-hex">{hex}</span>
          </div>
        );
      })}
    </div>
  );
}

// Ported from docs/src/pages/tokens/colors.astro — fully static/data-driven
// (reads @latty-ds/tokens/tokens.json), no interactivity, so this is plain
// JSX with no useEffect needed at all.
export default function ColorPalette(): JSX.Element {
  return (
    <>
      {SEMANTIC_PALETTES.map((palette) => (
        <section key={palette} className="palette-section">
          {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
          <lt-text variant="h4" className="palette-name">
            {palette}
          </lt-text>

          {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
          <lt-text variant="body">Default</lt-text>
          <Swatches palette={palette} />

          {color[`${palette}-muted`] && (
            <>
              {/* @ts-expect-error -- lt-text is a custom element, not a typed JSX intrinsic */}
              <lt-text variant="body">Muted</lt-text>
              <Swatches palette={`${palette}-muted`} />
            </>
          )}
        </section>
      ))}
    </>
  );
}
