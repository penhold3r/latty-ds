import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import './list';
import '../list-item/list-item';

const meta: Meta = {
  title: 'Components/List',
  argTypes: {
    type: { control: 'select', options: ['unordered', 'ordered'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] },
    markerColor: { control: 'color' }
  },
  args: {
    type: 'unordered',
    size: 'md',
    markerColor: ''
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  args: {
    markerColor: '#f41717'
  },

  render: (args) => html`
    <lt-list type=${args.type} size=${args.size} marker-color=${args.markerColor}>
      <li>First list item</li>
      <li>Second list item with more text to show how wrapping works</li>
      <li>Third list item</li>
      <li>Fourth list item</li>
    </lt-list>
  `
};

export const Unordered: Story = {
  render: () => html`
    <lt-list>
      <li>Coffee</li>
      <li>Tea</li>
      <li>Milk</li>
      <li>Water</li>
    </lt-list>
  `
};

export const Ordered: Story = {
  args: {
    markerColor: '#1540e5'
  },

  render: () => html`
    <lt-list type="ordered">
      <li>First step</li>
      <li>Second step</li>
      <li>Third step</li>
      <li>Final step</li>
    </lt-list>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-8);">
      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Small</h4>
        <lt-list size="sm">
          <li>Small list item</li>
          <li>Another small item</li>
          <li>Third small item</li>
        </lt-list>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Medium (Default)</h4>
        <lt-list size="md">
          <li>Medium list item</li>
          <li>Another medium item</li>
          <li>Third medium item</li>
        </lt-list>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Large</h4>
        <lt-list size="lg">
          <li>Large list item</li>
          <li>Another large item</li>
          <li>Third large item</li>
        </lt-list>
      </div>
    </div>
  `
};

export const CustomMarkerColor: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-8);">
      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Primary Color</h4>
        <lt-list marker-color="var(--lt-color-primary-500)">
          <li>Item with primary colored marker</li>
          <li>Another item</li>
          <li>Third item</li>
        </lt-list>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Success Color</h4>
        <lt-list marker-color="var(--lt-color-success-500)">
          <li>Completed task</li>
          <li>Finished work</li>
          <li>Done item</li>
        </lt-list>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Error Color</h4>
        <lt-list marker-color="var(--lt-color-error-500)">
          <li>Required field missing</li>
          <li>Invalid format</li>
          <li>Authentication failed</li>
        </lt-list>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Ordered with Custom Color</h4>
        <lt-list type="ordered" marker-color="var(--lt-color-primary-600)">
          <li>First step</li>
          <li>Second step</li>
          <li>Third step</li>
        </lt-list>
      </div>
    </div>
  `
};

export const NestedLists: Story = {
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

export const LongContent: Story = {
  render: () => html`
    <div style="max-width: 600px;">
      <lt-list>
        <li>
          This is a longer list item that contains multiple lines of text to demonstrate how the component handles text
          wrapping and maintains proper alignment with the bullet point.
        </li>
        <li>
          Another item with substantial content. The list maintains consistent spacing and readability even when items
          contain varying amounts of text.
        </li>
        <li>Short item</li>
        <li>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore
          magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris.
        </li>
      </lt-list>
    </div>
  `
};

export const RichContent: Story = {
  render: () => html`
    <div style="max-width: 700px;">
      <lt-list type="ordered" size="lg">
        <li>
          <strong>Install dependencies</strong>
          <br />
          <code style="background: var(--lt-color-neutral-100); padding: 2px 6px; border-radius: 4px;">
            pnpm install
          </code>
        </li>
        <li>
          <strong>Start development server</strong>
          <br />
          <code style="background: var(--lt-color-neutral-100); padding: 2px 6px; border-radius: 4px;"> pnpm dev </code>
        </li>
        <li>
          <strong>Build for production</strong>
          <br />
          <code style="background: var(--lt-color-neutral-100); padding: 2px 6px; border-radius: 4px;">
            pnpm build
          </code>
        </li>
      </lt-list>
    </div>
  `
};
