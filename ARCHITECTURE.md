# Architecture

## Frozen Decisions

- **npm scope**: `@latty/*`
- **Custom elements prefix**: `lt-`
- **CSS variables prefix**: `--lt-*`
- **Philosophy**: Tokens first, components second

## Design System Architecture

Latty follows a layered architecture where design tokens are the foundation:

```
@latty/tokens (design tokens)
    ↓
@latty/web (Web Components)
    ↓
@latty/react, @latty/angular (framework wrappers)
```

### Design Tokens System

The `@latty/tokens` package uses a **build-time generation** approach:

1. **Configuration** (`tokens.config.json`) - Base color values
2. **Build Scripts** - TypeScript generators that produce tokens
3. **Output** - CSS variables, JSON, and JavaScript exports

#### Build Process

Three-step build pipeline:

```bash
# 1. Compile build scripts (TypeScript → JavaScript)
tsup                              # src/scripts/build-tokens.ts → dist-scripts/

# 2. Execute token generation
node dist-scripts/build-tokens.js # Generates dist/tokens.{css,json,js}

# 3. Generate type definitions
tsc -p tsconfig.types.json        # Generates dist/public-types.d.ts
```

The build script reads `tokens.config.json`, generates color palettes using the OKLCH color space, creates spacing scales, and outputs:
- `tokens.css` - CSS custom properties with `--lt-*` prefix
- `tokens.json` - Complete token object for tooling/documentation
- `tokens.js` - JavaScript/TypeScript module export

#### Color System

Uses **OKLCH color space** (via culori) for perceptually uniform color generation:

- **Input**: Base hex colors from `tokens.config.json`
- **Process**: Generates 10-step palettes (50, 100, 200...900) using lightness curves and chroma adjustments
- **Output**: Main and optional muted variants for each semantic color

**Key features**:
- Perceptually uniform color steps
- Consistent lightness across hues (L values: 50=0.93 → 900=0.27)
- Chroma curves prevent "muddy" darks and "neon" brights
- Neutral scale uses zero chroma for true grayscale
- Neutral palette has slightly higher lightness values for better readability (50=0.985 → 900=0.22)

#### Spacing System

**4px grid system** with dual-unit output:

- **Base unit**: 4px
- **Range**: 25 values (0-24), providing 0px to 96px in 4px increments
- **REM conversion**: Based on 16px = 1rem

Dual-unit spacing scale:

- **REM units** (canonical): `--lt-spacing-{n}` (drops "rem" from variable name)
- **PX units** (disambiguation): `--lt-spacing-px-{n}` (keeps "px" in variable name)

Example:
```typescript
spacing.rem["4"]  → --lt-spacing-4: 1rem;   // 16px
spacing.px["4"]   → --lt-spacing-px-4: 16px;
```

### Icon System

Provider-based icon architecture for extensibility and tree-shaking.

#### Components

- **Icon Registry** - Centralized icon management with priority system
- **Icon Providers** - Pluggable icon sources (Iconoir default)
- **`<lt-icon>` Component** - Web Component for displaying icons

#### Architecture

```typescript
IconRegistry
  ├── Custom Icons (highest priority)
  ├── IconProvider[] (registered providers)
  └── Fallback (not found warning)
```

**Default Provider**: Iconoir with 30+ pre-bundled common icons including:
- Navigation: arrows, nav arrows
- Actions: check, xmark, plus, minus, edit, trash, save, download, upload
- UI: search, menu, settings, home, user, bell
- Status: info-circle, warning-triangle, check-circle, xmark-circle
- Media: eye, eye-off, heart, star

#### Customization

Three levels of customization:

1. **Register Individual Icons**:
```typescript
iconRegistry.registerIcon('my-icon', '<svg>...</svg>');
```

2. **Override Default Icons** (custom icons take priority):
```typescript
iconRegistry.registerIcon('check', '<svg><!-- Custom check --></svg>');
```

3. **Create Custom Providers**:
```typescript
class MyProvider implements IconProvider {
  name = 'my-provider';
  getIcon(name: string) { /* ... */ }
  getAllIcons() { /* ... */ }
}
iconRegistry.registerProvider(new MyProvider(), true);
```

#### Design Decisions

- **Pre-bundled common icons** instead of dynamic imports (better bundler compatibility)
- **Runtime registration** for additional icons (keeps bundle small)
- **SVG cleaning** removes fixed dimensions for CSS control
- **currentColor** inheritance for easy theming
- **No breaking changes** to existing component APIs

### Web Components

Built with **Lit** framework using TypeScript decorators.

#### Component Structure

Standard file organization:

```
components/
  {component}/
    {component}.ts           # LitElement component
    {component}.styles.ts    # css`` tagged template
    {component}.types.ts     # TypeScript types/interfaces
    {component}.stories.ts   # Storybook stories
    __tests__/
      {component}.test.ts    # Vitest tests
    index.ts                 # Public exports
```

#### Component Patterns

- **Custom element naming**: All use `lt-` prefix (e.g., `lt-button`, `lt-spinner`)
- **Token consumption**: CSS custom properties with `--lt-` prefix
- **Reactive properties**: Lit `@property()` decorator with `reflect: true` for attributes
- **Styling**: Shadow DOM with adopted stylesheets (Lit `css`` template)
- **Icons**: Optional `icon` and `icon-end` properties for icon integration

#### Component Integration

Icons integrate naturally with existing components:

**Button**:
```html
<lt-button icon="save">Save</lt-button>
<lt-button icon-end="arrow-right">Next</lt-button>
```

**Textfield**:
```html
<lt-textfield icon-start="search" placeholder="Search..."></lt-textfield>
<lt-textfield icon-end="eye" type="password"></lt-textfield>
```

### Package Structure

Monorepo managed by **pnpm workspaces**:

- **@latty/tokens** - Design token generation system
- **@latty/web** - Web Components (Lit-based)
- **@latty/icons** - Icon registry and components (uses Iconoir)
- **@latty/react** - React wrappers (planned)
- **@latty/angular** - Angular wrappers (planned)
- **@latty/utils** - Shared utilities (logger, strings, etc.)

#### TypeScript Path Aliases

Defined in `tsconfig.base.json`:
```json
{
  "@web/*": ["packages/web/src/*"],
  "@tokens/*": ["packages/tokens/src/*"],
  "@utils/*": ["packages/utils/src/*"]
}
```

Resolved by:
- **Development/Testing**: `vite-tsconfig-paths` plugin
- **Build**: `tsc-alias` post-processing

### Build System

#### Root Commands

```bash
pnpm build              # Build all packages recursively (-r flag)
pnpm dev                # Run Storybook dev server
pnpm storybook          # Run Storybook (with prestorybook hook)
pnpm test               # Run Vitest tests
pnpm clean              # Remove all dist/ directories
```

#### Package-Specific Builds

Each package has its own build strategy:

- **@latty/tokens**: Multi-step build (tsup → node → tsc)
- **@latty/web**: TypeScript compilation + asset copying (CSS, fonts)
- **@latty/icons**: TypeScript compilation
- **@latty/react/angular**: TypeScript compilation

#### Build Dependencies

Critical: `@latty/web` depends on `@latty/tokens` being built first.

The `prestorybook` script enforces this:
```bash
pnpm --filter @latty/tokens build && pnpm --filter @latty/web build
```

### Testing

**Vitest** with jsdom environment:

- **Test files**: `packages/**/src/**/*.test.ts`
- **Global utilities**: Enabled via `globals: true`
- **Setup file**: `./vitest.setup.ts`
- **Coverage**: 62 tests across components and utilities

### Storybook

Configured for **Web Components** with Vite builder:

- **Framework**: `@storybook/web-components-vite`
- **Stories**: Loaded from `packages/web/src/**/*.stories.*` and `packages/tokens/src/stories/*.stories.*`
- **Addons**: `@storybook/addon-essentials`
- **Integration**: Uses `vite-tsconfig-paths` for path alias resolution

### Typography

Custom font: **Asap** (normal and italic variants)

- Font files: `packages/web/src/font/*.woff2`
- Font-face declarations: `packages/web/src/css/font-face.css`
- Token: `typography.fontFamily: "Asap", sans-serif`

### Baseline Styles

Optional CSS reset/normalization: `packages/web/src/css/latty.css`

Provides sensible defaults:
- Universal box-sizing: border-box
- Optimized text rendering
- Media element defaults (block display, responsive sizing)
- Form element font inheritance
- Focus-visible outline using design tokens
- Link styles with color inheritance

Users can opt-in by importing:
```typescript
import '@latty/web/css/latty.css';
```

### Future Enhancements

Potential additions to the system:

#### Icons
1. Build script to generate icon bundles from Iconoir full library
2. Icon search/browse tool in Storybook
3. Icon sprite sheet generation
4. Additional icon providers (Material, Heroicons, etc.)
5. Icon animation utilities

#### General
1. Additional component variants and sizes
2. Dark mode theme support
3. Advanced theming API
4. Animation/transition tokens
5. Accessibility testing automation
