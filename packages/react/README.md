# @latty/react

React wrappers for the Latty design system — typed React components backed by `@latty/web`.

Each component is a thin wrapper that forwards props to the underlying Web Component, handles React's synthetic event system, and provides full TypeScript types.

## Requirements

- React 18 or 19
- `@latty/tokens` and `@latty/web` must be installed and their CSS imported

## Installation

```bash
pnpm add @latty/tokens @latty/web @latty/react
```

## Setup

Import the CSS tokens once in your app entry point:

```css
/* your global stylesheet */
@import '@latty/tokens/tokens.css';
@import '@latty/tokens/semantic.css';
```

## Usage

```tsx
import { Button, Textfield, Badge, Spinner } from '@latty/react';

function App() {
  return (
    <form>
      <Textfield label="Email" type="email" required />
      <Button variant="primary" onClick={() => console.log('saved')}>
        Save changes
      </Button>
      <Badge variant="success">Active</Badge>
    </form>
  );
}
```

### Events

React wrappers map custom events to `onEventName` props:

```tsx
<Button onClick={handleClick}>Click me</Button>
<Switch onChange={handleChange} />
<Textfield onInput={handleInput} />
```

### All components

All components from `@latty/web` are available as named exports:

```ts
import {
  Accordion, Alert, Avatar, Badge, Breadcrumb, BreadcrumbItem,
  Button, Checkbox, Chip, Dialog, Divider, Dropdown,
  Header, Link, List, Nav, Progress, Radio, RadioGroup,
  Select, Skeleton, Slider, Snackbar, Spinner, Surface,
  Switch, Tab, TabGroup, Table, Text, Textfield, Tooltip
} from '@latty/react';
```

### TypeScript

All components are fully typed. Props mirror the Web Component's properties:

```tsx
import type { ButtonProps } from '@latty/react';

function MyButton(props: ButtonProps) {
  return <Button {...props} />;
}
```

## How it works

The wrappers are auto-generated from `custom-elements.json` (the Custom Elements Manifest produced by `@latty/web`). Run `pnpm codegen:wrappers` in the repo root after modifying web components to regenerate them.

## License

MIT
