# Stories Refactoring Template

This template shows how to refactor component stories to use the new `/stories` directory structure with separate MDX documentation.

## Directory Structure

```
components/[component-name]/
  stories/
    docs.mdx                    # Documentation
    [component-name].stories.ts # Stories
  [component-name].ts
  [component-name].styles.ts
  [component-name].types.ts
  __tests__/
  index.ts
```

## Steps to Refactor

1. **Create stories directory**
   ```bash
   mkdir -p packages/web/src/components/[component-name]/stories
   ```

2. **Create docs.mdx** (see example below)

3. **Move and update stories file**
   - Move `[component-name].stories.ts` to `stories/[component-name].stories.ts`
   - Update import path: `import '../[component-name]';`
   - Add MDX import: `import ComponentDocs from './docs.mdx';`
   - Add parameters to meta:
     ```typescript
     parameters: {
       docs: {
         page: ComponentDocs
       }
     }
     ```

4. **Delete old stories file**
   ```bash
   rm packages/web/src/components/[component-name]/[component-name].stories.ts
   ```

## docs.mdx Template

```mdx
import { Canvas, Meta, ArgTypes, Stories } from '@storybook/blocks';
import * as ComponentStories from './[component-name].stories';

<Meta of={ComponentStories} />

# [Component Name]

Brief description of the component.

## Overview

Detailed description of what the component does and when to use it.

## Usage

\`\`\`html
<lt-[component-name] prop="value">Content</lt-[component-name]>
\`\`\`

### Common Patterns

Show typical usage patterns here.

## Playground

Use the controls below to interact with the component and explore its properties.

<Canvas of={ComponentStories.Playground} />

## Props

<ArgTypes of={ComponentStories} />

## [Feature Name]

Description of a specific feature or variant.

<Canvas of={ComponentStories.FeatureName} />

## All Stories

<Stories />

## Accessibility

- List accessibility features
- Keyboard navigation support
- ARIA attributes used
- Screen reader support

## Best Practices

- When to use this component
- Recommended patterns
- Things to avoid
```

## Stories File Template

```typescript
import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '../[component-name]';
import ComponentDocs from './docs.mdx';

const meta: Meta = {
  title: 'Components/[ComponentName]',
  component: 'lt-[component-name]',
  parameters: {
    docs: {
      page: ComponentDocs
    }
  },
  argTypes: {
    propName: {
      control: 'text',
      description: 'Description of the prop'
    }
    // ... other props
  },
  args: {
    propName: 'default value'
    // ... other defaults
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-[component-name]
      prop=${args.propName}
    >
      Content
    </lt-[component-name]>
  `
};

export const FeatureName: Story = {
  render: () => html`
    <lt-[component-name]>Example</lt-[component-name]>
  `
};
```

## Components to Refactor

Based on the current codebase, refactor these components:

- [ ] Accordion
- [ ] Checkbox
- [ ] List
- [ ] ListItem
- [ ] Radio
- [ ] RadioGroup
- [ ] Select
- [ ] Spinner
- [ ] Surface
- [ ] Switch
- [ ] Tab
- [ ] TabGroup
- [ ] Textfield

## Example: Button Component

See `/packages/web/src/components/button/stories/` for a complete reference implementation.
