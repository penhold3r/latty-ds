import type { Meta, StoryObj } from '@storybook/web-components';
import { html } from 'lit';

import '@latty/icons';
import '../tab/tab';
import './tab-group';

const meta: Meta = {
  title: 'Components/Tab Group',
  argTypes: {
    value: { control: 'text' },
    variant: { control: 'select', options: ['default', 'pills'] },
    size: { control: 'select', options: ['sm', 'md', 'lg'] }
  },
  args: {
    value: 'tab1',
    variant: 'default',
    size: 'md'
  }
};

export default meta;
type Story = StoryObj;

export const Playground: Story = {
  render: (args) => html`
    <lt-tab-group value=${args.value} variant=${args.variant} size=${args.size}>
      <lt-tab value="tab1" label="Tab 1"></lt-tab>
      <lt-tab value="tab2" label="Tab 2"></lt-tab>
      <lt-tab value="tab3" label="Tab 3"></lt-tab>

      <div slot="panel" data-value="tab1">
        <p>This is the content for Tab 1.</p>
      </div>
      <div slot="panel" data-value="tab2">
        <p>This is the content for Tab 2.</p>
      </div>
      <div slot="panel" data-value="tab3">
        <p>This is the content for Tab 3.</p>
      </div>
    </lt-tab-group>
  `
};

export const Default: Story = {
  render: () => html`
    <lt-tab-group value="profile">
      <lt-tab value="profile" label="Profile"></lt-tab>
      <lt-tab value="account" label="Account"></lt-tab>
      <lt-tab value="security" label="Security"></lt-tab>
      <lt-tab value="notifications" label="Notifications"></lt-tab>

      <div slot="panel" data-value="profile">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Profile Information</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">
          Manage your personal information and preferences.
        </p>
      </div>
      <div slot="panel" data-value="account">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Account Settings</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">
          Update your account details and billing information.
        </p>
      </div>
      <div slot="panel" data-value="security">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Security</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">
          Manage your password and two-factor authentication.
        </p>
      </div>
      <div slot="panel" data-value="notifications">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Notifications</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">
          Control how and when you receive notifications.
        </p>
      </div>
    </lt-tab-group>
  `
};

export const Pills: Story = {
  render: () => html`
    <lt-tab-group variant="pills" value="home">
      <lt-tab value="home" icon="home" label="Home"></lt-tab>
      <lt-tab value="search" icon="search" label="Search"></lt-tab>
      <lt-tab value="settings" icon="settings" label="Settings"></lt-tab>

      <div slot="panel" data-value="home">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Home</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Welcome to your dashboard.</p>
      </div>
      <div slot="panel" data-value="search">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Search</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Find what you're looking for.</p>
      </div>
      <div slot="panel" data-value="settings">
        <h3 style="margin: 0 0 var(--lt-spacing-3) 0;">Settings</h3>
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Configure your preferences.</p>
      </div>
    </lt-tab-group>
  `
};

export const WithIcons: Story = {
  render: () => html`
    <lt-tab-group value="edit">
      <lt-tab value="edit" icon="edit" label="Edit"></lt-tab>
      <lt-tab value="save" icon="save" label="Save"></lt-tab>
      <lt-tab value="download" icon="download" label="Download"></lt-tab>
      <lt-tab value="upload" icon="upload" label="Upload"></lt-tab>

      <div slot="panel" data-value="edit">
        <pre
          style="background: var(--lt-color-neutral-900); color: var(--lt-color-neutral-50); padding: var(--lt-spacing-4); border-radius: var(--lt-border-radius); margin: 0;"
        >&lt;lt-button variant="primary"&gt;
  Click me
&lt;/lt-button&gt;</pre>
      </div>
      <div slot="panel" data-value="save">
        <pre
          style="background: var(--lt-color-neutral-900); color: var(--lt-color-success-400); padding: var(--lt-spacing-4); border-radius: var(--lt-border-radius); margin: 0;"
        >$ npm install @latty/web
$ npm run dev</pre>
      </div>
      <div slot="panel" data-value="download">
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Download files and exports.</p>
      </div>
      <div slot="panel" data-value="upload">
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Upload files and assets.</p>
      </div>
    </lt-tab-group>
  `
};

export const WithDisabledTab: Story = {
  render: () => html`
    <lt-tab-group value="overview">
      <lt-tab value="overview" label="Overview"></lt-tab>
      <lt-tab value="analytics" label="Analytics"></lt-tab>
      <lt-tab value="reports" label="Reports" disabled></lt-tab>
      <lt-tab value="settings" label="Settings"></lt-tab>

      <div slot="panel" data-value="overview">
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Overview dashboard content.</p>
      </div>
      <div slot="panel" data-value="analytics">
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Analytics and metrics.</p>
      </div>
      <div slot="panel" data-value="reports">
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Reports (This tab is disabled).</p>
      </div>
      <div slot="panel" data-value="settings">
        <p style="margin: 0; color: var(--lt-color-neutral-700);">Settings and configuration.</p>
      </div>
    </lt-tab-group>
  `
};

export const Sizes: Story = {
  render: () => html`
    <div style="display: flex; flex-direction: column; gap: var(--lt-spacing-8);">
      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Small</h4>
        <lt-tab-group size="sm" value="tab1">
          <lt-tab value="tab1" label="Tab 1"></lt-tab>
          <lt-tab value="tab2" label="Tab 2"></lt-tab>
          <lt-tab value="tab3" label="Tab 3"></lt-tab>

          <div slot="panel" data-value="tab1"><p style="margin: 0;">Small tab content</p></div>
          <div slot="panel" data-value="tab2"><p style="margin: 0;">Small tab content</p></div>
          <div slot="panel" data-value="tab3"><p style="margin: 0;">Small tab content</p></div>
        </lt-tab-group>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Medium (Default)</h4>
        <lt-tab-group size="md" value="tab1">
          <lt-tab value="tab1" label="Tab 1"></lt-tab>
          <lt-tab value="tab2" label="Tab 2"></lt-tab>
          <lt-tab value="tab3" label="Tab 3"></lt-tab>

          <div slot="panel" data-value="tab1"><p style="margin: 0;">Medium tab content</p></div>
          <div slot="panel" data-value="tab2"><p style="margin: 0;">Medium tab content</p></div>
          <div slot="panel" data-value="tab3"><p style="margin: 0;">Medium tab content</p></div>
        </lt-tab-group>
      </div>

      <div>
        <h4 style="margin: 0 0 var(--lt-spacing-3) 0;">Large</h4>
        <lt-tab-group size="lg" value="tab1">
          <lt-tab value="tab1" label="Tab 1"></lt-tab>
          <lt-tab value="tab2" label="Tab 2"></lt-tab>
          <lt-tab value="tab3" label="Tab 3"></lt-tab>

          <div slot="panel" data-value="tab1"><p style="margin: 0;">Large tab content</p></div>
          <div slot="panel" data-value="tab2"><p style="margin: 0;">Large tab content</p></div>
          <div slot="panel" data-value="tab3"><p style="margin: 0;">Large tab content</p></div>
        </lt-tab-group>
      </div>
    </div>
  `
};

export const ManyTabs: Story = {
  render: () => html`
    <lt-tab-group value="tab1">
      <lt-tab value="tab1" label="Dashboard"></lt-tab>
      <lt-tab value="tab2" label="Analytics"></lt-tab>
      <lt-tab value="tab3" label="Reports"></lt-tab>
      <lt-tab value="tab4" label="Users"></lt-tab>
      <lt-tab value="tab5" label="Settings"></lt-tab>
      <lt-tab value="tab6" label="Integrations"></lt-tab>
      <lt-tab value="tab7" label="Billing"></lt-tab>
      <lt-tab value="tab8" label="Support"></lt-tab>

      <div slot="panel" data-value="tab1"><p style="margin: 0;">Dashboard content</p></div>
      <div slot="panel" data-value="tab2"><p style="margin: 0;">Analytics content</p></div>
      <div slot="panel" data-value="tab3"><p style="margin: 0;">Reports content</p></div>
      <div slot="panel" data-value="tab4"><p style="margin: 0;">Users content</p></div>
      <div slot="panel" data-value="tab5"><p style="margin: 0;">Settings content</p></div>
      <div slot="panel" data-value="tab6"><p style="margin: 0;">Integrations content</p></div>
      <div slot="panel" data-value="tab7"><p style="margin: 0;">Billing content</p></div>
      <div slot="panel" data-value="tab8"><p style="margin: 0;">Support content</p></div>
    </lt-tab-group>
  `
};
