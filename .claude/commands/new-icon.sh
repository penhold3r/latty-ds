#!/usr/bin/env bash
# Usage: /new-icon <category> <icon-name>
#
# Creates a new icon stub in packages/icons/src/icons/<category>/,
# registers it in the category index, wires it into the top-level
# icons index, and adds it to the docs gallery.
#
# If the category does not exist it is created and wired everywhere
# automatically (including a new group in the docs gallery).
#
# Examples:
#   /new-icon navigation arrow-left
#   /new-icon actions    check
#   /new-icon social     tiktok    (creates category if it doesn't exist)

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────
if [[ $# -lt 2 ]]; then
  echo "Usage: $0 <category> <icon-name>"
  echo ""
  echo "Examples:"
  echo "  $0 navigation arrow-left"
  echo "  $0 actions    plus"
  echo "  $0 social     tiktok"
  exit 1
fi

CATEGORY="$1"
ICON_NAME="$2"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
ICONS_DIR="${REPO_ROOT}/packages/icons/src/icons"
CATEGORY_DIR="${ICONS_DIR}/${CATEGORY}"
CATEGORY_INDEX="${CATEGORY_DIR}/index.ts"
ICON_FILE="${CATEGORY_DIR}/${ICON_NAME}.ts"
TOP_INDEX="${ICONS_DIR}/index.ts"
ICONS_PAGE="${REPO_ROOT}/docs/src/pages/icons/index.astro"

# ── Derive camelCase export variable name ─────────────────────────────────────
# arrow-left → arrowLeftSvg
EXPORT_VAR=$(node -e "
  const s = '${ICON_NAME}'.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  process.stdout.write(s + 'Svg');
")

# ── Derive docs group label ───────────────────────────────────────────────────
# Special overrides for categories whose docs label differs from title-case.
CATEGORY_LABEL=$(node -e "
  const overrides = { 'ui': 'UI Elements' };
  const cat = '${CATEGORY}';
  if (overrides[cat]) {
    process.stdout.write(overrides[cat]);
  } else {
    const s = cat.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
    process.stdout.write(s);
  }
")

# ── Check for duplicate ───────────────────────────────────────────────────────
if [[ -f "$ICON_FILE" ]]; then
  echo "❌  Icon '${ICON_NAME}' already exists in category '${CATEGORY}'"
  echo "    Edit the file directly: packages/icons/src/icons/${CATEGORY}/${ICON_NAME}.ts"
  exit 1
fi

# ── Create category if it doesn't exist ───────────────────────────────────────
NEW_CATEGORY=false
if [[ ! -d "$CATEGORY_DIR" ]]; then
  echo "Category '${CATEGORY}' does not exist."
  read -r -p "Create new category '${CATEGORY}'? [y/N] " confirm
  if [[ ! "$confirm" =~ ^[Yy]$ ]]; then
    echo "Aborted."
    exit 1
  fi
  NEW_CATEGORY=true
  mkdir -p "$CATEGORY_DIR"

  # Derive const name: category name → camelCase + "Icons" (e.g. my-cat → myCatIcons)
  CAT_CONST=$(node -e "
    const s = '${CATEGORY}'.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
    const pascal = s[0].toUpperCase() + s.slice(1);
    process.stdout.write(pascal + 'Icons');
  ")

  # Write empty category index in as const format
  cat > "$CATEGORY_INDEX" << STUB
export const ${CAT_CONST} = {} as const;
STUB

  # Wire into top-level index.ts
  node -e "
    const fs = require('fs');
    const src = fs.readFileSync('${TOP_INDEX}', 'utf8');

    const importLine = \"import { ${CAT_CONST} } from './${CATEGORY}';\";
    const spreadLine = \"  ...${CAT_CONST},\";

    let out = src.trimEnd();
    out = out.replace(
      /^(export const lattyIcons)/m,
      importLine + '\n' + '\$1'
    );
    out = out.replace(/(\} as const;)$/, spreadLine + '\n\$1');

    fs.writeFileSync('${TOP_INDEX}', out + '\n', 'utf8');
  "
  echo "✅  Created category '${CATEGORY}' (${CAT_CONST})"
  echo "✅  Wired into packages/icons/src/icons/index.ts"

  # Add a new group to the docs gallery before the closing ];
  node -e "
    const fs = require('fs');
    let src = fs.readFileSync('${ICONS_PAGE}', 'utf8');

    const newGroup = \`  {
    label: '${CATEGORY_LABEL}',
    icons: [
      '${ICON_NAME}'
    ]
  }\`;

    // Insert before the closing ]; of the iconGroups array
    src = src.replace(/^(\];)$/m, newGroup + ',\n\$1');
    fs.writeFileSync('${ICONS_PAGE}', src, 'utf8');
    console.log(\"✅  Created new '${CATEGORY_LABEL}' group in docs gallery\");
  "
fi

# ── Create icon file ──────────────────────────────────────────────────────────
cat > "$ICON_FILE" << EOICON
export const ${EXPORT_VAR} =
  '<svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">' +
  // TODO: add SVG elements here
  // Convention: stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"
  '</svg>';
EOICON

echo "✅  Created packages/icons/src/icons/${CATEGORY}/${ICON_NAME}.ts"

# ── Register in category index ────────────────────────────────────────────────
node -e "
  const fs = require('fs');
  const src = fs.readFileSync('${CATEGORY_INDEX}', 'utf8');

  // Parse existing imports: filename → varName
  const importRe = /^import \{ (\w+) \} from '\.\/(.+)';$/gm;
  const imports = {};
  let m;
  while ((m = importRe.exec(src)) !== null) {
    imports[m[2]] = m[1];
  }

  // Parse existing record entries: 'icon-name': varName
  const entryRe = /'([^']+)':\s*(\w+),?/g;
  const entries = {};
  while ((m = entryRe.exec(src)) !== null) {
    entries[m[1]] = m[2];
  }

  // Detect const name — works for both 'export const X = {' and 'export const X: Record...'
  const constMatch = src.match(/export const (\w+)/);
  if (!constMatch) { console.error('Could not find export const in index.ts'); process.exit(1); }
  const constName = constMatch[1];

  // Add new icon
  imports['${ICON_NAME}'] = '${EXPORT_VAR}';
  entries['${ICON_NAME}'] = '${EXPORT_VAR}';

  // Rebuild file in as const format
  let out = '';
  for (const [file, varName] of Object.entries(imports).sort()) {
    out += \`import { \${varName} } from './\${file}';\n\`;
  }
  out += '\n';
  out += \`export const \${constName} = {\n\`;
  for (const [key, varName] of Object.entries(entries)) {
    out += \`  '\${key}': \${varName},\n\`;
  }
  out += '} as const;\n';

  fs.writeFileSync('${CATEGORY_INDEX}', out, 'utf8');
"

echo "✅  Registered '${ICON_NAME}' in packages/icons/src/icons/${CATEGORY}/index.ts"

# ── Update docs icon gallery (existing category) ──────────────────────────────
if [[ "$NEW_CATEGORY" == "false" ]]; then
  node -e "
    const fs = require('fs');
    let src = fs.readFileSync('${ICONS_PAGE}', 'utf8');

    const groupRe = /(label: '${CATEGORY_LABEL}',[^}]*icons:\s*\[)([^\]]*?)(\])/s;
    const existingMatch = groupRe.exec(src);
    if (!existingMatch) {
      console.log(\"ℹ️   Could not find group '${CATEGORY_LABEL}' in docs gallery — add '${ICON_NAME}' manually\");
      process.exit(0);
    }

    const innerContent = existingMatch[2];
    if (innerContent.includes(\"'${ICON_NAME}'\")) {
      console.log(\"ℹ️   '${ICON_NAME}' already in the '${CATEGORY_LABEL}' group (skipped)\");
      process.exit(0);
    }

    src = src.replace(groupRe, (_, open, inner, close) => {
      const trimmed = inner.trimEnd();
      const comma = trimmed.endsWith(',') ? '' : ',';
      return open + trimmed + comma + \"\n      '${ICON_NAME}'\n    \" + close;
    });
    fs.writeFileSync('${ICONS_PAGE}', src, 'utf8');
    console.log(\"✅  Added '${ICON_NAME}' to the '${CATEGORY_LABEL}' group in the docs gallery\");
  "
fi

# ── Summary ───────────────────────────────────────────────────────────────────
echo ""
echo "Icon stub ready. Fill in the SVG markup:"
echo "  packages/icons/src/icons/${CATEGORY}/${ICON_NAME}.ts"
echo ""
echo "SVG conventions:"
echo "  • viewBox=\"0 0 24 24\"  fill=\"none\"  on the root <svg>"
echo "  • stroke=\"currentColor\"  stroke-width=\"2\""
echo "    stroke-linecap=\"round\"  stroke-linejoin=\"round\"  on each shape"
echo "  • For filled dots: omit stroke-* and use  fill=\"currentColor\""
