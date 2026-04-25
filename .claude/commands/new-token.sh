#!/usr/bin/env bash
# Usage: /new-token color <name> <hex>
#
# Adds a new color token to the design system:
#   1. Registers the name in COLOR_NAMES constant (if new)
#   2. Adds the base hex value to tokens.config.json
#   3. Rebuilds @latty/tokens
#
# Example:
#   /new-token color purple #a855f7

set -euo pipefail

# ── Args ──────────────────────────────────────────────────────────────────────
if [[ $# -lt 3 ]]; then
  echo "Usage: $0 <category> <name> <value>"
  echo "       $0 color purple '#a855f7'"
  exit 1
fi

CATEGORY="$1"
NAME="$2"
VALUE="$3"

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/../.." && pwd)"
TOKENS_CONFIG="${REPO_ROOT}/packages/tokens/tokens.config.json"
COLORS_CONST="${REPO_ROOT}/packages/tokens/src/constants/colors.constants.ts"

if [[ "$CATEGORY" != "color" ]]; then
  echo "❌  Only the 'color' category is supported currently."
  echo "    Usage: $0 color <name> <hex>"
  exit 1
fi

# Validate hex color
if ! echo "$VALUE" | grep -qE '^#([0-9a-fA-F]{3}|[0-9a-fA-F]{6})$'; then
  echo "❌  Invalid hex color: '$VALUE'. Expected format: #rgb or #rrggbb"
  exit 1
fi

# ── Check for duplicates ───────────────────────────────────────────────────────
if node -e "
  const fs = require('fs');
  const c = JSON.parse(fs.readFileSync('${TOKENS_CONFIG}', 'utf8'));
  process.exit(c.color && '${NAME}' in c.color ? 0 : 1);
" 2>/dev/null; then
  echo "❌  Color '${NAME}' already exists in tokens.config.json"
  echo "    Edit the file directly to change an existing color's value."
  exit 1
fi

# ── Update COLOR_NAMES constant ────────────────────────────────────────────────
# Insert the new name alphabetically into the const array
if grep -q "'${NAME}'" "$COLORS_CONST"; then
  echo "ℹ️   '${NAME}' already present in COLOR_NAMES (skipping constant update)"
else
  # Find the alphabetically correct insertion point and add it
  node -e "
    const fs = require('fs');
    let src = fs.readFileSync('${COLORS_CONST}', 'utf8');
    const re = /export const COLOR_NAMES = \[([^\]]+)\] as const;/s;
    const m = src.match(re);
    if (!m) { console.error('Could not find COLOR_NAMES array'); process.exit(1); }
    const existing = m[1].match(/'[^']+'/g).map(s => s.replace(/'/g, ''));
    existing.push('${NAME}');
    existing.sort();
    const newArr = existing.map(n => \"'\" + n + \"'\").join(', ');
    src = src.replace(re, 'export const COLOR_NAMES = [' + newArr + '] as const;');
    fs.writeFileSync('${COLORS_CONST}', src, 'utf8');
  "
  echo "✅  Added '${NAME}' to COLOR_NAMES in colors.constants.ts"
fi

# ── Update tokens.config.json ─────────────────────────────────────────────────
node -e "
  const fs = require('fs');
  const config = JSON.parse(fs.readFileSync('${TOKENS_CONFIG}', 'utf8'));
  config.color = config.color || {};
  config.color['${NAME}'] = '${VALUE}';
  // Sort keys alphabetically for consistency
  config.color = Object.fromEntries(Object.entries(config.color).sort());
  fs.writeFileSync('${TOKENS_CONFIG}', JSON.stringify(config, null, 2) + '\n', 'utf8');
"
echo "✅  Added color.${NAME} = '${VALUE}' to tokens.config.json"

# ── Rebuild tokens ─────────────────────────────────────────────────────────────
echo ""
echo "Rebuilding @latty/tokens..."
pnpm --filter @latty/tokens build
echo ""
echo "✅  Done. New token --lt-color-${NAME}-{50..900} is now available."
echo "    Also available: --lt-color-${NAME}-muted-{50..900}"
