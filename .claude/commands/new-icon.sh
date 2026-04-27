#!/usr/bin/env bash
# Usage: /new-icon <category> <icon-name>
#
# Creates a new icon stub in packages/icons/src/icons/<category>/
# and registers it in the category's index file.
#
# If the category does not exist, the script creates it and wires
# it into the top-level src/icons/index.ts automatically.
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

# ── Derive camelCase export variable name ─────────────────────────────────────
# arrow-left → arrowLeftSvg
EXPORT_VAR=$(node -e "
  const s = '${ICON_NAME}'.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
  process.stdout.write(s + 'Svg');
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

  # Write empty category index
  cat > "$CATEGORY_INDEX" << STUB
export const ${CAT_CONST}: Record<string, string> = {};
STUB

  # Wire into top-level index.ts using node
  node -e "
    const fs = require('fs');
    const src = fs.readFileSync('${TOP_INDEX}', 'utf8');

    // Add import line (alphabetical is nice but append works fine)
    const importLine = \"import { ${CAT_CONST} } from './${CATEGORY}';\";
    const spreadLine = \"  ...${CAT_CONST},\";

    // Insert import after last import block
    let out = src.trimEnd();
    // Append import before the export const line
    out = out.replace(
      /^(export const lattyIcons)/m,
      importLine + '\n' + '\$1'
    );
    // Append spread inside the lattyIcons object before closing brace
    out = out.replace(/^(\};)$/m, spreadLine + '\n\$1');

    fs.writeFileSync('${TOP_INDEX}', out + '\n', 'utf8');
  "
  echo "✅  Created category '${CATEGORY}' (${CAT_CONST})"
  echo "✅  Wired into packages/icons/src/icons/index.ts"
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

  // Parse existing imports: { filename → varName }
  const importRe = /^import \{ (\w+) \} from '\.\/(.+)';$/gm;
  const imports = {};
  let m;
  while ((m = importRe.exec(src)) !== null) {
    imports[m[2]] = m[1]; // filename → varName
  }

  // Parse existing record entries: { 'icon-name': varName }
  const entryRe = /'([^']+)':\s*(\w+),/g;
  const entries = {};
  while ((m = entryRe.exec(src)) !== null) {
    entries[m[1]] = m[2];
  }

  // Extract the export const name from the file
  const constMatch = src.match(/export const (\w+):\s*Record/);
  if (!constMatch) { console.error('Could not find export const in index.ts'); process.exit(1); }
  const constName = constMatch[1];

  // Add new icon
  imports['${ICON_NAME}'] = '${EXPORT_VAR}';
  entries['${ICON_NAME}'] = '${EXPORT_VAR}';

  // Rebuild file
  let out = '';
  for (const [file, varName] of Object.entries(imports).sort()) {
    out += \`import { \${varName} } from './\${file}';\n\`;
  }
  out += '\n';
  out += \`export const \${constName}: Record<string, string> = {\n\`;
  for (const [key, varName] of Object.entries(entries)) {
    out += \`  '\${key}': \${varName},\n\`;
  }
  out += '};\n';

  fs.writeFileSync('${CATEGORY_INDEX}', out, 'utf8');
"

echo "✅  Registered '${ICON_NAME}' in packages/icons/src/icons/${CATEGORY}/index.ts"

# ── Update docs icon gallery ──────────────────────────────────────────────────
# Add the icon name to the matching group in docs/src/pages/icons/index.astro
ICONS_PAGE="${REPO_ROOT}/docs/src/pages/icons/index.astro"
CATEGORY_LABEL=$(node -e "
  // Capitalise first letter of each word (kebab → title case)
  const s = '${CATEGORY}'.split('-').map(w => w[0].toUpperCase() + w.slice(1)).join(' ');
  process.stdout.write(s);
")

node -e "
  const fs = require('fs');
  let src = fs.readFileSync('${ICONS_PAGE}', 'utf8');

  // Find the group whose label matches the category
  const groupRe = /(label: '${CATEGORY_LABEL}',[^}]*icons:\s*\[)([^\]]*?)(\])/s;
  const existingMatch = groupRe.exec(src);
  if (!existingMatch) {
    console.log(\"ℹ️   Could not find group '${CATEGORY_LABEL}' in docs gallery — add '${ICON_NAME}' manually\");
    process.exit(0);
  }

  // Skip if the icon is already listed
  const innerContent = existingMatch[2];
  if (innerContent.includes(\"'${ICON_NAME}'\")) {
    console.log(\"ℹ️   '${ICON_NAME}' already in the '${CATEGORY_LABEL}' group (skipped)\");
    process.exit(0);
  }

  src = src.replace(groupRe, (_, open, inner, close) => {
    const trimmed = inner.trimEnd();
    const comma = trimmed.endsWith(',') ? '' : ',';
    return open + trimmed + comma + \" '${ICON_NAME}'\" + close;
  });
  fs.writeFileSync('${ICONS_PAGE}', src, 'utf8');
  console.log(\"✅  Added '${ICON_NAME}' to the '${CATEGORY_LABEL}' group in the docs gallery\");
"

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
