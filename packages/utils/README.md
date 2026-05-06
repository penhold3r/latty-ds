# @latty/utils

Shared utilities for the Latty design system.

This package is primarily intended for internal use across `@latty/*` packages but is published so build tooling and scripts can consume it without importing from a sibling workspace path.

## Installation

```bash
pnpm add @latty/utils
```

## API

### `logger`

Colorized console logger with timestamps and log-level icons. Use this instead of `console.log` in scripts and build tooling (`no-console` is enforced by ESLint across the repo).

```ts
import { logger } from '@latty/utils';

logger.info('Processing tokens...');    // ℹ  [12:34:56] Processing tokens...
logger.success('Build complete');       // ✔  [12:34:57] Build complete
logger.warn('Deprecated option used');  // ⚠  [12:34:57] Deprecated option used
logger.error('File not found');         // ✖  [12:34:57] File not found
```

### `toTitleCase`

Converts hyphen-separated, camelCase, or snake_case strings to Title Case.

```ts
import { toTitleCase } from '@latty/utils';

toTitleCase('hello-world'); // "Hello World"
toTitleCase('camelCase');   // "Camel Case"
toTitleCase('snake_case');  // "Snake Case"
```

## License

MIT
