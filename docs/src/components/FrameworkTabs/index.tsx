import React from 'react';
import CodeBlock from '@theme/CodeBlock';
import './FrameworkTabs.styles.css';

interface Props {
  html: string;
  react: string;
  vue?: string;
}

// Ported from docs/src/components/FrameworkTabs (the Astro site), with one
// deliberate change: syntax highlighting + copy-to-clipboard now goes through
// Docusaurus's own <CodeBlock> instead of porting the Astro version's custom
// CodeSnippet (Shiki + a hand-rolled lt-icon copy button) — CodeBlock already
// does both, and isn't itself a design-system showcase moment the way
// lt-tab-group (kept) is. See _agent-plans/DOCUSAURUS-MIGRATION-PLAN.md.
export default function FrameworkTabs({ html, react, vue }: Props): JSX.Element {
  return (
    <div className="framework-tabs">
      <lt-tab-group value="html">
        <lt-tab value="html" label="Web Component" />
        <lt-tab value="react" label="React" />
        {vue && <lt-tab value="vue" label="Vue" />}

        <div slot="panel" data-value="html">
          <CodeBlock language="html">{html.trim()}</CodeBlock>
        </div>
        <div slot="panel" data-value="react">
          <CodeBlock language="tsx">{react.trim()}</CodeBlock>
        </div>
        {vue && (
          <div slot="panel" data-value="vue">
            <CodeBlock language="vue">{vue.trim()}</CodeBlock>
          </div>
        )}
      </lt-tab-group>
    </div>
  );
}
