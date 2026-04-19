import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '@latty/icons';
import './tab';

const meta: Meta = {
  title: 'Components/Tab',
  argTypes: {
    label: { control: 'text' },
    value: { control: 'text' },
    icon: { control: 'text' },
    active: { control: 'boolean' },
    disabled: { control: 'boolean' },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  },
  args: {
    label: 'Tab Label',
    value: 'tab-1',
    icon: '',
    active: false,
    disabled: false,
    size: 'md'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-tab
      label=${args.label}
      value=${args.value}
      icon=${args.icon}
      ?active=${args.active}
      ?disabled=${args.disabled}
      size=${args.size}
    ></lt-tab>
  `
};

export const States: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-tab value="default" label="Default"></lt-tab>
      <lt-tab value="active" label="Active" active></lt-tab>
      <lt-tab value="disabled" label="Disabled" disabled></lt-tab>
    </div>
  `
};

export const WithIcons: Story = {
  render: () => html`
    <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
      <lt-tab value="home" icon="home" label="Home"></lt-tab>
      <lt-tab value="search" icon="search" label="Search" active></lt-tab>
      <lt-tab value="settings" icon="settings" label="Settings"></lt-tab>
      <lt-tab value="user" icon="user" label="Profile" disabled></lt-tab>
    </div>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-6);">
      <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
        <lt-tab value="sm-1" label="Small" size="sm"></lt-tab>
        <lt-tab value="sm-2" label="Active" size="sm" active></lt-tab>
        <lt-tab value="sm-3" icon="settings" label="With Icon" size="sm"></lt-tab>
      </div>

      <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
        <lt-tab value="md-1" label="Medium" size="md"></lt-tab>
        <lt-tab value="md-2" label="Active" size="md" active></lt-tab>
        <lt-tab value="md-3" icon="settings" label="With Icon" size="md"></lt-tab>
      </div>

      <div style="display: flex; gap: var(--lt-spacing-4); align-items: center;">
        <lt-tab value="lg-1" label="Large" size="lg"></lt-tab>
        <lt-tab value="lg-2" label="Active" size="lg" active></lt-tab>
        <lt-tab value="lg-3" icon="settings" label="With Icon" size="lg"></lt-tab>
      </div>
    </div>
  `
};
