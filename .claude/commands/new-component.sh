#!/usr/bin/env bash
# Usage: /new-component <ComponentName> [flags]
#
# Flags:
#   --variants v1,v2,...   Variant type + CSS skeleton + variant tests
#   --sizes sm,md,lg       Size type + CSS skeleton + size tests
#   --disabled             Disabled boolean prop + CSS + tests
#   --events e1,e2         CustomEvent dispatch stubs + tests
#
# Example:
#   /new-component Chip \
#     --variants primary,secondary,neutral,success,warning,error,info \
#     --sizes sm,md,lg \
#     --disabled \
#     --events delete

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────
if [[ $# -lt 1 ]]; then
  echo "Usage: $0 <ComponentName> [--variants v1,v2] [--sizes sm,md,lg] [--disabled] [--events e1,e2]"
  exit 1
fi

NAME_PASCAL="$1"; shift
NAME_LOWER="$(echo "$NAME_PASCAL" | tr '[:upper:]' '[:lower:]')"
TAG="lt-${NAME_LOWER}"

OPT_VARIANTS=""
OPT_SIZES=""
OPT_DISABLED=false
OPT_EVENTS=""

while [[ $# -gt 0 ]]; do
  case "$1" in
    --variants) OPT_VARIANTS="$2"; shift 2 ;;
    --sizes)    OPT_SIZES="$2";    shift 2 ;;
    --disabled) OPT_DISABLED=true; shift ;;
    --events)   OPT_EVENTS="$2";   shift 2 ;;
    *) echo "Unknown flag: $1"; exit 1 ;;
  esac
done

VARIANT_LIST=(); SIZE_LIST=(); EVENT_LIST=()
[[ -n "$OPT_VARIANTS" ]] && IFS=',' read -ra VARIANT_LIST <<< "$OPT_VARIANTS"
[[ -n "$OPT_SIZES"    ]] && IFS=',' read -ra SIZE_LIST    <<< "$OPT_SIZES"
[[ -n "$OPT_EVENTS"   ]] && IFS=',' read -ra EVENT_LIST   <<< "$OPT_EVENTS"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
WEB_DIR="${REPO_ROOT}/packages/web/src/components/${NAME_LOWER}"
DOCS_DIR="${REPO_ROOT}/docs/src/pages/components/${NAME_LOWER}"
INDEX_JS="${REPO_ROOT}/packages/web/src/index.ts"
SIDEBAR="${REPO_ROOT}/docs/src/components/Sidebar.astro"

if [[ -d "$WEB_DIR" ]]; then
  echo "❌  '${NAME_LOWER}' already exists at ${WEB_DIR}"
  exit 1
fi

mkdir -p "${WEB_DIR}/__tests__"

# ── Helper ────────────────────────────────────────────────────────────────────
join_with() {
  local sep="$1"; shift; local r=""
  for x in "$@"; do [[ -z "$r" ]] && r="$x" || r="${r}${sep}${x}"; done
  echo "$r"
}

capitalize() { echo "$1" | awk '{print toupper(substr($0,1,1)) substr($0,2)}'; }

# Build type union strings
variant_union=""; size_union=""
if [[ ${#VARIANT_LIST[@]} -gt 0 ]]; then
  q=(); for v in "${VARIANT_LIST[@]}"; do q+=("'$v'"); done
  variant_union="$(join_with " | " "${q[@]}")"
fi
if [[ ${#SIZE_LIST[@]} -gt 0 ]]; then
  q=(); for s in "${SIZE_LIST[@]}"; do q+=("'$s'"); done
  size_union="$(join_with " | " "${q[@]}")"
fi

DEFAULT_VARIANT="${VARIANT_LIST[0]:-}"
DEFAULT_SIZE="md"
if [[ ${#SIZE_LIST[@]} -gt 0 ]]; then
  DEFAULT_SIZE="${SIZE_LIST[0]}"
  for s in "${SIZE_LIST[@]}"; do [[ "$s" == "md" ]] && DEFAULT_SIZE="md" && break; done
fi

# ── types.ts ──────────────────────────────────────────────────────────────────
{
  HAS_TYPES=false
  if [[ ${#VARIANT_LIST[@]} -gt 0 ]]; then
    echo "export type ${NAME_PASCAL}Variant = ${variant_union};"
    HAS_TYPES=true
  fi
  if [[ ${#SIZE_LIST[@]} -gt 0 ]]; then
    $HAS_TYPES && echo ""
    echo "export type ${NAME_PASCAL}Size = ${size_union};"
    HAS_TYPES=true
  fi
  $HAS_TYPES || echo "// TODO: define ${NAME_PASCAL} prop types"
} > "${WEB_DIR}/${NAME_LOWER}.types.ts"

# ── styles.ts ─────────────────────────────────────────────────────────────────
{
  echo "import { css } from 'lit';"
  echo ""
  echo "export const ${NAME_LOWER}Styles = css\`"
  echo "  :host {"
  echo "    display: inline-block;"
  echo "  }"

  if [[ ${#SIZE_LIST[@]} -gt 0 ]]; then
    echo ""
    echo "  /* Sizes */"
    for s in "${SIZE_LIST[@]}"; do
      echo "  :host([size='${s}']) {"
      echo "    /* TODO: ${s} styles */"
      echo "  }"
    done
  fi

  if [[ ${#VARIANT_LIST[@]} -gt 0 ]]; then
    echo ""
    echo "  /* Variants */"
    for v in "${VARIANT_LIST[@]}"; do
      echo "  :host([variant='${v}']) {"
      echo "    /* TODO: use var(--lt-color-${v}-500) */"
      echo "  }"
    done
  fi

  if [[ "$OPT_DISABLED" == true ]]; then
    echo ""
    echo "  /* Disabled */"
    echo "  :host([disabled]) {"
    echo "    cursor: not-allowed;"
    echo "    opacity: 0.5;"
    echo "    pointer-events: none;"
    echo "  }"
  fi

  echo "\`;"
} > "${WEB_DIR}/${NAME_LOWER}.styles.ts"

# ── component.ts ──────────────────────────────────────────────────────────────
{
  echo "import { LitElement, html } from 'lit';"
  echo "import { customElement, property } from 'lit/decorators.js';"
  echo ""
  echo "import { ${NAME_LOWER}Styles } from './${NAME_LOWER}.styles';"

  TYPE_IMPORTS=()
  [[ ${#VARIANT_LIST[@]} -gt 0 ]] && TYPE_IMPORTS+=("${NAME_PASCAL}Variant")
  [[ ${#SIZE_LIST[@]} -gt 0 ]]    && TYPE_IMPORTS+=("${NAME_PASCAL}Size")
  if [[ ${#TYPE_IMPORTS[@]} -gt 0 ]]; then
    echo "import type { $(join_with ", " "${TYPE_IMPORTS[@]}") } from './${NAME_LOWER}.types';"
  fi

  echo ""
  echo "/**"
  echo " * ${NAME_PASCAL} component."
  echo " *"
  echo " * @element ${TAG}"
  echo " * @slot - Default slot content"
  for ev in ${EVENT_LIST[@]+"${EVENT_LIST[@]}"}; do echo " * @fires lt-${ev}"; done
  echo " */"
  echo "@customElement('${TAG}')"
  echo "export class ${NAME_PASCAL} extends LitElement {"
  echo "  static styles = ${NAME_LOWER}Styles;"

  if [[ ${#VARIANT_LIST[@]} -gt 0 ]]; then
    echo ""
    echo "  @property({ reflect: true }) variant: ${NAME_PASCAL}Variant = '${DEFAULT_VARIANT}';"
  fi
  if [[ ${#SIZE_LIST[@]} -gt 0 ]]; then
    echo ""
    echo "  @property({ reflect: true }) size: ${NAME_PASCAL}Size = '${DEFAULT_SIZE}';"
  fi
  if [[ "$OPT_DISABLED" == true ]]; then
    echo ""
    echo "  @property({ type: Boolean, reflect: true }) disabled = false;"
  fi

  for ev in ${EVENT_LIST[@]+"${EVENT_LIST[@]}"}; do
    cap="$(capitalize "$ev")"
    echo ""
    echo "  private _handle${cap}() {"
    echo "    this.dispatchEvent(new CustomEvent('lt-${ev}', { bubbles: true, composed: true }));"
    echo "  }"
  done

  echo ""
  echo "  render() {"
  echo "    return html\`<slot></slot>\`;"
  echo "  }"
  echo "}"
} > "${WEB_DIR}/${NAME_LOWER}.ts"

# ── index.ts ──────────────────────────────────────────────────────────────────
{
  echo "export { ${NAME_PASCAL} } from './${NAME_LOWER}';"
  TYPE_EXPORTS=()
  [[ ${#VARIANT_LIST[@]} -gt 0 ]] && TYPE_EXPORTS+=("${NAME_PASCAL}Variant")
  [[ ${#SIZE_LIST[@]} -gt 0 ]]    && TYPE_EXPORTS+=("${NAME_PASCAL}Size")
  if [[ ${#TYPE_EXPORTS[@]} -gt 0 ]]; then
    echo "export type { $(join_with ", " "${TYPE_EXPORTS[@]}") } from './${NAME_LOWER}.types';"
  fi
} > "${WEB_DIR}/index.ts"

# ── test.ts ───────────────────────────────────────────────────────────────────
{
  echo "import { describe, it, expect, beforeEach, afterEach } from 'vitest';"
  echo "import type { ${NAME_PASCAL} } from '../${NAME_LOWER}';"
  echo "import '../${NAME_LOWER}';"
  echo ""
  echo "describe('<${TAG}>', () => {"
  echo "  let el: ${NAME_PASCAL};"
  echo ""
  echo "  beforeEach(async () => {"
  echo "    el = document.createElement('${TAG}') as ${NAME_PASCAL};"
  echo "    document.body.appendChild(el);"
  echo "    await el.updateComplete;"
  echo "  });"
  echo ""
  echo "  afterEach(() => { el.remove(); });"
  echo ""
  echo "  it('renders in shadow DOM', () => {"
  echo "    expect(el.shadowRoot).toBeTruthy();"
  echo "  });"
  echo ""
  echo "  it('projects slot content', () => {"
  echo "    el.textContent = 'Hello';"
  echo "    expect(el.shadowRoot!.querySelector('slot')).toBeTruthy();"
  echo "  });"

  if [[ ${#VARIANT_LIST[@]} -gt 0 ]]; then
    q=(); for v in "${VARIANT_LIST[@]}"; do q+=("'$v'"); done
    variants_lit="$(join_with ", " "${q[@]}")"
    echo ""
    echo "  it('has default variant of ${DEFAULT_VARIANT}', () => {"
    echo "    expect(el.variant).toBe('${DEFAULT_VARIANT}');"
    echo "    expect(el.getAttribute('variant')).toBe('${DEFAULT_VARIANT}');"
    echo "  });"
    echo ""
    echo "  it('supports all variants', async () => {"
    echo "    const variants = [${variants_lit}] as const;"
    echo "    for (const variant of variants) {"
    echo "      el.variant = variant;"
    echo "      await el.updateComplete;"
    echo "      expect(el.getAttribute('variant')).toBe(variant);"
    echo "    }"
    echo "  });"
  fi

  if [[ ${#SIZE_LIST[@]} -gt 0 ]]; then
    q=(); for s in "${SIZE_LIST[@]}"; do q+=("'$s'"); done
    sizes_lit="$(join_with ", " "${q[@]}")"
    echo ""
    echo "  it('has default size of ${DEFAULT_SIZE}', () => {"
    echo "    expect(el.size).toBe('${DEFAULT_SIZE}');"
    echo "    expect(el.getAttribute('size')).toBe('${DEFAULT_SIZE}');"
    echo "  });"
    echo ""
    echo "  it('supports all sizes', async () => {"
    echo "    const sizes = [${sizes_lit}] as const;"
    echo "    for (const size of sizes) {"
    echo "      el.size = size;"
    echo "      await el.updateComplete;"
    echo "      expect(el.getAttribute('size')).toBe(size);"
    echo "    }"
    echo "  });"
  fi

  if [[ "$OPT_DISABLED" == true ]]; then
    echo ""
    echo "  it('is not disabled by default', () => {"
    echo "    expect(el.disabled).toBe(false);"
    echo "    expect(el.hasAttribute('disabled')).toBe(false);"
    echo "  });"
    echo ""
    echo "  it('can be disabled', async () => {"
    echo "    el.disabled = true;"
    echo "    await el.updateComplete;"
    echo "    expect(el.hasAttribute('disabled')).toBe(true);"
    echo "  });"
  fi

  for ev in ${EVENT_LIST[@]+"${EVENT_LIST[@]}"}; do
    cap="$(capitalize "$ev")"
    echo ""
    echo "  it('dispatches lt-${ev} event', () => {"
    echo "    let fired = false;"
    echo "    el.addEventListener('lt-${ev}', () => { fired = true; });"
    echo "    (el as any)._handle${cap}();"
    echo "    expect(fired).toBe(true);"
    echo "  });"
  done

  echo "});"
} > "${WEB_DIR}/__tests__/${NAME_LOWER}.test.ts"

echo "✅  Created packages/web/src/components/${NAME_LOWER}/"

# ── src/index.ts export + JSDoc ───────────────────────────────────────────────
EXPORT_LINE="export * from './components/${NAME_LOWER}';"
if grep -qF "$EXPORT_LINE" "$INDEX_JS"; then
  echo "ℹ️   Export already present in index.ts"
else
  echo "$EXPORT_LINE" >> "$INDEX_JS"
  echo "✅  Added export to packages/web/src/index.ts"
fi

# Insert JSDoc entry alphabetically inside the " * - ComponentName: ..." block
JSDOC_LINE=" * - ${NAME_PASCAL}: TODO: describe the ${NAME_PASCAL} component"
if ! grep -qF "$JSDOC_LINE" "$INDEX_JS"; then
  # Find the last " * - " entry and insert our line after the alphabetically preceding one
  PREV_DOC=$(grep " \* - " "$INDEX_JS" \
    | sed "s/ \* - \([A-Za-z]*\):.*/\1/" \
    | { cat; echo "${NAME_PASCAL}"; } \
    | sort \
    | grep -B1 "^${NAME_PASCAL}$" \
    | head -1)

  if [[ "$PREV_DOC" == "${NAME_PASCAL}" ]]; then
    # Goes first — insert before the first " * - " line
    sed -i '' "/ \* - /{ N; s/\( \* - \)/$(echo "$JSDOC_LINE" | sed 's/[\/&]/\\&/g')\n\1/; P; D; }" "$INDEX_JS" 2>/dev/null || true
  else
    sed -i '' "/ \* - ${PREV_DOC}:/a\\
${JSDOC_LINE}" "$INDEX_JS"
  fi
  echo "✅  Updated JSDoc listing in packages/web/src/index.ts"
fi

# ── Docs page ─────────────────────────────────────────────────────────────────
mkdir -p "$DOCS_DIR"
cat > "${DOCS_DIR}/index.astro" << EOF
---
import BaseLayout from '../../../layouts/BaseLayout.astro';
import ComponentPlayground from '../../../components/ComponentPlayground.astro';
import FrameworkTabs from '../../../components/FrameworkTabs.astro';
import ApiTable from '../../../components/ApiTable.astro';
---

<BaseLayout title="${NAME_PASCAL}" description="TODO: describe the ${NAME_PASCAL} component">
  <h1>${NAME_PASCAL}</h1>
  <p>TODO: describe the ${NAME_PASCAL} component.</p>

  <h2>Playground</h2>
  {/* TODO: replace content with a real usage example once the component is implemented */}
  <ComponentPlayground tag="${TAG}" content="${NAME_PASCAL}" />

  <h2>Usage</h2>
  {/* TODO: add html, react, and vue usage examples */}
  <FrameworkTabs
    html={\`<${TAG}>${NAME_PASCAL}</${TAG}>\`}
    react={\`
import { ${NAME_PASCAL} } from '@latty/react';

<${NAME_PASCAL}>${NAME_PASCAL}</${NAME_PASCAL}>
    \`}
    vue={\`
<template>
  <${TAG}>${NAME_PASCAL}</${TAG}>
</template>
    \`}
  />

  <h2>API</h2>
  <ApiTable tag="${TAG}" />
</BaseLayout>

<script>import '@latty/web';</script>
EOF
echo "✅  Created docs/src/pages/components/${NAME_LOWER}/index.astro"

# ── Sidebar ───────────────────────────────────────────────────────────────────
SIDEBAR_ENTRY="      { label: '${NAME_PASCAL}', href: '/components/${NAME_LOWER}' },"
if grep -qF "href: '/components/${NAME_LOWER}'" "$SIDEBAR"; then
  echo "ℹ️   Sidebar entry already present"
else
  PREV=$(grep "href: '/components/" "$SIDEBAR" \
    | sed "s/.*href: '\/components\/\([^']*\)'.*/\1/" \
    | { cat; echo "${NAME_LOWER}"; } \
    | sort \
    | grep -B1 "^${NAME_LOWER}$" \
    | head -1)

  if [[ "$PREV" == "${NAME_LOWER}" ]]; then
    sed -i '' "0,/href: '\/components\//s||${SIDEBAR_ENTRY}\n      \0|" "$SIDEBAR"
  else
    sed -i '' "/href: '\/components\/${PREV}'/a\\
${SIDEBAR_ENTRY}" "$SIDEBAR"
  fi
  echo "✅  Added sidebar entry for ${NAME_PASCAL}"
fi

# ── Build @latty/web ──────────────────────────────────────────────────────────
echo ""
echo "Building @latty/web to register ${NAME_PASCAL} in dist and manifest..."
pnpm --filter @latty/web build
echo "✅  @latty/web built"

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "Generated with:"
[[ ${#VARIANT_LIST[@]} -gt 0 ]] && echo "  variants : $(join_with ", " "${VARIANT_LIST[@]}")"
[[ ${#SIZE_LIST[@]} -gt 0 ]]    && echo "  sizes    : $(join_with ", " "${SIZE_LIST[@]}")"
$OPT_DISABLED                   && echo "  disabled : yes"
[[ ${#EVENT_LIST[@]} -gt 0 ]]   && echo "  events   : $(join_with ", " "${EVENT_LIST[@]}")"
echo ""
echo "Next: implement ${NAME_LOWER}.ts render() and fill in the TODO styles"
