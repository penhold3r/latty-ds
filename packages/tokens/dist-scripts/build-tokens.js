// src/scripts/build-tokens.ts
import fs from "fs";
import path from "path";
import url from "url";

// ../utils/src/logger.ts
var SILENT = process.env.LATTY_SILENT === "true";
var Logger = class _Logger {
  static {
    /**
     * ANSI escape codes for terminal colors.
     */
    this.colors = {
      reset: "\x1B[0m",
      info: "\x1B[36m",
      // Cyan
      warn: "\x1B[33m",
      // Yellow
      error: "\x1B[31m",
      // Red
      success: "\x1B[32m",
      // Green
      timestamp: "\x1B[90m"
      // Gray
    };
  }
  static {
    /**
     * Unicode icons for each log level.
     */
    this.icons = {
      info: "\u24D8",
      warn: "\u26A0",
      error: "\xD7",
      success: "\u2713"
    };
  }
  /**
   * Generates a formatted timestamp string.
   * @returns Colored timestamp in [HH:MM:SS] format
   * @private
   */
  #getTimestamp() {
    return `${_Logger.colors.timestamp}[${(/* @__PURE__ */ new Date()).toLocaleTimeString()}]${_Logger.colors.reset}`;
  }
  /**
   * Formats a log message with timestamp, level, icon, and color.
   *
   * @param level - Log level name
   * @param color - ANSI color code
   * @param icon - Unicode icon character
   * @param message - Message to log
   * @returns Formatted log string
   * @private
   */
  #format(level, color, icon, message) {
    const label = `${color}${icon} ${level.toUpperCase()}`;
    return `${this.#getTimestamp()} ${label}: ${message}${_Logger.colors.reset}`;
  }
  /**
   * Logs an informational message (cyan).
   * Suppressed when LATTY_SILENT=true.
   *
   * @param msg - Message to log
   */
  info(msg) {
    if (SILENT) return;
    console.log(this.#format("info", _Logger.colors.info, _Logger.icons.info, msg));
  }
  /**
   * Logs a warning message (yellow).
   * Always shown regardless of SILENT mode.
   *
   * @param msg - Message to log
   */
  warn(msg) {
    console.warn(this.#format("warn", _Logger.colors.warn, _Logger.icons.warn, msg));
  }
  /**
   * Logs an error message (red).
   * Always shown regardless of SILENT mode.
   *
   * @param msg - Message to log
   */
  error(msg) {
    console.error(this.#format("error", _Logger.colors.error, _Logger.icons.error, msg));
  }
  /**
   * Logs a success message (green).
   *
   * @param msg - Message to log
   */
  success(msg) {
    console.log(this.#format("success", _Logger.colors.success, _Logger.icons.success, msg));
  }
};
var logger = new Logger();

// src/constants/colors.constants.ts
var STEPS = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
var L_BY_STEP = {
  50: 0.93,
  100: 0.89,
  200: 0.81,
  300: 0.76,
  400: 0.7,
  500: 0.62,
  600: 0.54,
  700: 0.45,
  800: 0.36,
  900: 0.27
};
var L_BY_STEP_NEUTRAL = {
  50: 0.985,
  100: 0.965,
  200: 0.92,
  300: 0.84,
  400: 0.74,
  500: 0.62,
  600: 0.52,
  700: 0.42,
  800: 0.32,
  900: 0.22
};

// src/constants/spacing.constants.ts
var SPACE_BASE_PX = 4;
var SPACE_STEPS = 24;
var REM_BASE_PX = 16;

// src/spacing/spacing.ts
var buildSpacing = () => {
  const px = {};
  const rem = {};
  for (let i = 0; i <= SPACE_STEPS; i++) {
    const v = i * SPACE_BASE_PX;
    px[i] = `${v}px`;
    rem[i] = `${v / REM_BASE_PX}rem`;
  }
  return { px, rem };
};

// src/elevation/elevation.ts
var buildElevation = (neutral) => {
  const shadowColor = neutral["900"] || "#171717";
  const hex = shadowColor.replace("#", "");
  const r = parseInt(hex.substring(0, 2), 16);
  const g = parseInt(hex.substring(2, 4), 16);
  const b = parseInt(hex.substring(4, 6), 16);
  const rgb = `${r} ${g} ${b}`;
  return {
    "0": "none",
    "1": `0 1px 3px 0 rgb(${rgb} / 0.1), 0 1px 2px 0 rgb(${rgb} / 0.06)`,
    "2": `0 4px 6px -1px rgb(${rgb} / 0.1), 0 2px 4px -1px rgb(${rgb} / 0.06)`,
    "3": `0 10px 15px -3px rgb(${rgb} / 0.1), 0 4px 6px -2px rgb(${rgb} / 0.05)`,
    "4": `0 20px 25px -5px rgb(${rgb} / 0.1), 0 10px 10px -5px rgb(${rgb} / 0.04)`,
    "5": `0 25px 50px -12px rgb(${rgb} / 0.25)`
  };
};

// src/colors/palette.ts
import { formatHex, converter } from "culori";
var toOklch = converter("oklch");
var toRgb = converter("rgb");
var clamp = (n, min, max) => Math.max(min, Math.min(max, n));
var rampFromBase = (base, opts) => {
  const chromaScale = opts?.chromaScale ?? 1;
  const lShift = opts?.lShift ?? 0;
  const midBoost = opts?.midBoost ?? 0;
  const darkClamp = opts?.darkClamp ?? 0.06;
  const minChromaFactor = opts?.minChromaFactor ?? 0.08;
  const out = {};
  const h = (base.h % 360 + 360) % 360;
  const cMax = clamp(base.c * chromaScale, 0, 0.5);
  for (const step of STEPS) {
    const lTarget = clamp(L_BY_STEP[step] + lShift, 0, 1);
    const t = STEPS.indexOf(step) / (STEPS.length - 1);
    const peak = clamp(1 - Math.pow(Math.abs(t - 0.55) / 0.55, 1.7), 0, 1);
    const cMin = cMax * minChromaFactor;
    let c = clamp(cMin + (cMax - cMin) * peak, 0, 0.5);
    c = clamp(c * (1 + midBoost * peak), 0, 0.5);
    if (step >= 800) c = Math.min(c, darkClamp);
    const color = { mode: "oklch", l: lTarget, c, h };
    const rgb = toRgb(color);
    out[step] = formatHex(rgb);
  }
  return out;
};
var generatePalettes = (hex, useMuted) => {
  const base = toOklch(hex);
  if (!base) throw new Error(`Invalid color: ${hex}`);
  const main = rampFromBase(base, {
    chromaScale: 1,
    lShift: 0,
    midBoost: 0,
    darkClamp: 0.06
  });
  const muted = useMuted ? rampFromBase(base, {
    chromaScale: 0.2,
    lShift: 0.04,
    midBoost: -0.2,
    darkClamp: 0.045,
    minChromaFactor: 0.06
  }) : null;
  return { main, muted };
};
var generateNeutralScale = () => {
  const out = {};
  for (const step of STEPS) {
    const l = L_BY_STEP_NEUTRAL[step];
    const color = { mode: "oklch", l, c: 0, h: 0 };
    out[step] = formatHex(toRgb(color));
  }
  return out;
};
var generateBWColors = () => {
  return {
    white: "#FFFFFF",
    black: "#000000"
  };
};

// src/scripts/build-colors.ts
var toStepObj = (pal) => STEPS.reduce((acc, s) => {
  acc[`${s}`] = pal[s];
  return acc;
}, {});
var buildColorTokens = (cfg) => {
  const color = {};
  for (const [name, value] of Object.entries(cfg.color)) {
    const palettes = generatePalettes(value, true);
    color[name] = toStepObj(palettes.main);
    if (palettes.muted) {
      color[`${name}-muted`] = toStepObj(palettes.muted);
    }
  }
  return color;
};
var addSystemColors = (color) => {
  color.neutral = toStepObj(generateNeutralScale());
  return { ...color, ...generateBWColors() };
};

// src/scripts/build-tokens.ts
var __dirname = path.dirname(url.fileURLToPath(import.meta.url));
var pkgRoot = path.resolve(__dirname, "..");
var outDir = path.join(pkgRoot, "dist");
var configPath = path.join(pkgRoot, "tokens.config.json");
if (!fs.existsSync(configPath)) {
  logger.error(`Missing tokens config: ${configPath}`);
  process.exit(1);
}
var config = JSON.parse(fs.readFileSync(configPath, "utf8"));
var tokensToCss = (tokens2) => {
  const lines = [];
  const walker = (value, parts) => {
    if (typeof value === "string") {
      lines.push(`  --lt-${parts.join("-")}: ${value};`);
      return;
    }
    if (!value || typeof value !== "object") return;
    for (const key of Object.keys(value).sort()) {
      const next = value[key];
      if (parts.length === 1 && parts[0] === "spacing" && (key === "rem" || key === "px")) {
        if (key === "rem") {
          walker(next, ["spacing"]);
        } else {
          walker(next, ["spacing", "px"]);
        }
        continue;
      }
      walker(next, [...parts, key]);
    }
  };
  walker(tokens2, []);
  return `:root{
${lines.join("\n")}
}
`;
};
var buildTokens = (cfg) => {
  logger.info("Building tokens...");
  let color = buildColorTokens(cfg);
  color = addSystemColors(color);
  const spacing = buildSpacing();
  const border = {
    radius: "0.5rem",
    square: false
  };
  const typography = {
    fontFamily: `"Asap", sans-serif`
  };
  const elevation = buildElevation(color.neutral);
  return { color, spacing, border, typography, elevation };
};
var tokens = buildTokens(config);
var css = tokensToCss(tokens);
fs.mkdirSync(outDir, { recursive: true });
fs.writeFileSync(path.join(outDir, "tokens.json"), JSON.stringify(tokens, null, 2) + "\n", "utf8");
fs.writeFileSync(path.join(outDir, "tokens.css"), css, "utf8");
fs.writeFileSync(path.join(outDir, "tokens.js"), `export const tokens = ${JSON.stringify(tokens)};
`, "utf8");
fs.writeFileSync(path.join(outDir, "index.js"), `export * from "./tokens.js";
`, "utf8");
logger.success("[@latty/tokens] wrote dist/tokens.css + dist/tokens.json");
