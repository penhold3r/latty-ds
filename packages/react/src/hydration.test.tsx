import { act } from 'react';
import { renderToString } from 'react-dom/server';
import { hydrateRoot } from 'react-dom/client';
import '@latty-ds/web'; // registers the real lt-* custom elements, so lt-button actually upgrades and reflects
import { Button } from './components/Button/Button';

// Regression guard for a bug reported against a published 1.1.0 (_agent-plans/V1.1.0-FEEDBACK.md item #2): Lit
// reflects a property's *default* value as an HTML attribute the moment a component upgrades client-side
// (`variant="primary"`, `size="md"`, etc.) even when the wrapper correctly omitted that prop (because the consumer
// never passed it) and the server-rendered HTML never had the attribute. That's Lit doing exactly what it's
// supposed to, not a wrapper bug — but left alone, React's hydration diffing flagged every one of these as a
// mismatch ("Hydration failed because the server rendered HTML didn't match the client"), cluttering the console
// in dev. Fixed by adding `suppressHydrationWarning` to the wrapper's root element (scripts/codegen-wrappers.mjs),
// which silences the warning for that element's own attributes without suppressing anything in its subtree.
describe('React hydration does not warn about Lit-reflected default attributes', () => {
  it('<Button> hydrates cleanly even though lt-button reflects variant/size/etc. after upgrade', async () => {
    const consoleError = vi.spyOn(console, 'error').mockImplementation(() => {});

    const html = renderToString(<Button>Click</Button>);
    const container = document.createElement('div');
    container.innerHTML = html;
    document.body.appendChild(container);

    await act(async () => {
      hydrateRoot(container, <Button>Click</Button>);
    });

    const button = container.querySelector('lt-button')! as HTMLElement & { updateComplete: Promise<unknown> };
    await customElements.whenDefined('lt-button');
    await button.updateComplete; // Lit's first update, where it reflects default property values as attributes
    expect(button.getAttribute('variant')).toBe('primary'); // confirms the reflection this test guards against actually happened

    const hydrationWarnings = consoleError.mock.calls.filter((call) =>
      /hydrat|attributes from the server/i.test(String(call[0]))
    );
    expect(hydrationWarnings).toHaveLength(0);

    consoleError.mockRestore();
    container.remove();
  });
});
