import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './list-item';
import '../list/list';

const meta: Meta = {
  title: 'Components/ListItem',
  component: 'lt-list-item'
};

export default meta;
type Story = StoryObj;

export const BasicUsage: Story = {
  render: () => html`
    <lt-list>
      <lt-list-item>First item</lt-list-item>
      <lt-list-item>Second item</lt-list-item>
      <lt-list-item>Third item</lt-list-item>
    </lt-list>
  `
};

export const WithNestedList: Story = {
  render: () => html`
    <lt-list>
      <lt-list-item>
        Main item 1
        <lt-list type="ordered">
          <lt-list-item>Sub-item 1.1</lt-list-item>
          <lt-list-item>Sub-item 1.2</lt-list-item>
          <lt-list-item>Sub-item 1.3</lt-list-item>
        </lt-list>
      </lt-list-item>
      <lt-list-item>
        Main item 2
        <lt-list>
          <lt-list-item>Sub-item 2.1</lt-list-item>
          <lt-list-item>Sub-item 2.2</lt-list-item>
        </lt-list>
      </lt-list-item>
      <lt-list-item>Main item 3</lt-list-item>
    </lt-list>
  `
};

export const DeepNesting: Story = {
  render: () => html`
    <lt-list>
      <lt-list-item>
        Level 1 - Item 1
        <lt-list type="ordered">
          <lt-list-item>
            Level 2 - Item 1.1
            <lt-list>
              <lt-list-item>Level 3 - Item 1.1.1</lt-list-item>
              <lt-list-item>Level 3 - Item 1.1.2</lt-list-item>
            </lt-list>
          </lt-list-item>
          <lt-list-item>Level 2 - Item 1.2</lt-list-item>
        </lt-list>
      </lt-list-item>
      <lt-list-item>Level 1 - Item 2</lt-list-item>
    </lt-list>
  `
};

export const WithRichContent: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <lt-list type="ordered" size="lg">
        <lt-list-item>
          <strong>Install dependencies</strong>
          <br />
          <code style="background: var(--lt-color-neutral-100); padding: 2px 6px; border-radius: 4px;">
            pnpm install
          </code>
        </lt-list-item>
        <lt-list-item>
          <strong>Development server</strong>
          <br />
          <code style="background: var(--lt-color-neutral-100); padding: 2px 6px; border-radius: 4px;">
            pnpm dev
          </code>
          <lt-list size="sm">
            <lt-list-item>Opens Storybook on localhost:6006</lt-list-item>
            <lt-list-item>Watches for file changes</lt-list-item>
          </lt-list>
        </lt-list-item>
        <lt-list-item>
          <strong>Build for production</strong>
          <br />
          <code style="background: var(--lt-color-neutral-100); padding: 2px 6px; border-radius: 4px;">
            pnpm build
          </code>
        </lt-list-item>
      </lt-list>
    </div>
  `
};

export const MixedTypes: Story = {
  render: () => html`
    <lt-list type="ordered">
      <lt-list-item>
        Numbered main item
        <lt-list>
          <lt-list-item>Bulleted sub-item</lt-list-item>
          <lt-list-item>Another bulleted sub-item</lt-list-item>
        </lt-list>
      </lt-list-item>
      <lt-list-item>
        Another numbered main item
        <lt-list type="ordered">
          <lt-list-item>Numbered sub-item 1</lt-list-item>
          <lt-list-item>Numbered sub-item 2</lt-list-item>
        </lt-list>
      </lt-list-item>
    </lt-list>
  `
};
