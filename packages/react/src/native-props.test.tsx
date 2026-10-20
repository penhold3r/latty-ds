import { render } from '@testing-library/react';
import { renderToString } from 'react-dom/server';
import '@latty-ds/web';
import { Textfield } from './components/Textfield';
import { Button } from './components/Button';
import { Image } from './components/Image';
import { Link } from './components/Link';
import { Checkbox } from './components/Checkbox';

describe('Native HTML attributes in @latty-ds/react', () => {
  it('forwards native InputHTMLAttributes & TextareaHTMLAttributes on <Textfield> down to the inner <input>', async () => {
    const { container, rerender } = render(
      <Textfield
        name="email"
        placeholder="you@example.com"
        autoComplete="email"
        inputMode="email"
        maxLength={50}
        minLength={5}
        pattern=".*@.*"
        readOnly
        autoFocus
        enterKeyHint="send"
        spellCheck={false}
      />
    );

    const host = container.querySelector('lt-textfield') as HTMLElement & { updateComplete: Promise<unknown> };
    await customElements.whenDefined('lt-textfield');
    await host.updateComplete;

    expect(host.getAttribute('name')).toBe('email');
    expect(host.getAttribute('placeholder')).toBe('you@example.com');
    expect(host.getAttribute('autocomplete')).toBe('email');
    expect(host.getAttribute('inputmode')).toBe('email');
    expect(host.getAttribute('maxlength')).toBe('50');
    expect(host.getAttribute('minlength')).toBe('5');
    expect(host.getAttribute('pattern')).toBe('.*@.*');
    expect(host.hasAttribute('readonly')).toBe(true);
    expect(host.hasAttribute('autofocus')).toBe(true);
    expect(host.getAttribute('enterkeyhint')).toBe('send');
    expect(host.getAttribute('spellcheck')).toBe('false');

    const innerInput = host.shadowRoot!.querySelector('input')!;
    expect(innerInput.getAttribute('name')).toBe('email');
    expect(innerInput.getAttribute('placeholder')).toBe('you@example.com');
    expect(innerInput.getAttribute('autocomplete')).toBe('email');
    expect(innerInput.getAttribute('inputmode')).toBe('email');
    expect(innerInput.getAttribute('maxlength')).toBe('50');
    expect(innerInput.getAttribute('minlength')).toBe('5');
    expect(innerInput.getAttribute('pattern')).toBe('.*@.*');
    expect(innerInput.hasAttribute('readonly')).toBe(true);
    expect(innerInput.hasAttribute('autofocus')).toBe(true);
    expect(innerInput.getAttribute('enterkeyhint')).toBe('send');
    expect(innerInput.getAttribute('spellcheck')).toBe('false');

    // Rerendering with readOnly={false} removes the boolean attribute instead of setting readonly="false"
    rerender(<Textfield name="email" readOnly={false} autoFocus={false} />);
    await host.updateComplete;
    expect(host.hasAttribute('readonly')).toBe(false);
    expect(host.hasAttribute('autofocus')).toBe(false);
    expect(innerInput.hasAttribute('readonly')).toBe(false);
    expect(innerInput.hasAttribute('autofocus')).toBe(false);
  });

  it('forwards native ButtonHTMLAttributes & AnchorHTMLAttributes on <Button>', async () => {
    const { container, rerender } = render(
      <Button type="submit" name="action" value="save" formAction="/save" formMethod="post" formNoValidate>
        Save
      </Button>
    );

    const host = container.querySelector('lt-button') as HTMLElement & { updateComplete: Promise<unknown> };
    await customElements.whenDefined('lt-button');
    await host.updateComplete;

    expect(host.getAttribute('name')).toBe('action');
    expect(host.getAttribute('value')).toBe('save');
    expect(host.getAttribute('formaction')).toBe('/save');
    expect(host.getAttribute('formmethod')).toBe('post');
    expect(host.hasAttribute('formnovalidate')).toBe(true);

    rerender(
      <Button href="https://example.com" target="_blank" rel="noopener" download="report.pdf">
        Download
      </Button>
    );
    await host.updateComplete;

    const innerLink = host.shadowRoot!.querySelector('a')!;
    expect(innerLink.getAttribute('target')).toBe('_blank');
    expect(innerLink.getAttribute('rel')).toBe('noopener');
    expect(innerLink.getAttribute('download')).toBe('report.pdf');
  });

  it('forwards native ImgHTMLAttributes on <Image> and AnchorHTMLAttributes on <Link>', async () => {
    const { container } = render(
      <>
        <Image
          src="/hero.jpg"
          alt="Hero"
          srcSet="/hero-2x.jpg 2x"
          sizes="100vw"
          loading="lazy"
          decoding="async"
          crossOrigin="anonymous"
          fetchPriority="high"
        />
        <Link href="/file.txt" target="_blank" rel="noopener" download hrefLang="en">
          File
        </Link>
        <Checkbox name="terms" value="accepted" />
      </>
    );

    const imgHost = container.querySelector('lt-image') as HTMLElement & { updateComplete: Promise<unknown> };
    const linkHost = container.querySelector('lt-link') as HTMLElement & { updateComplete: Promise<unknown> };
    const cbHost = container.querySelector('lt-checkbox') as HTMLElement & { updateComplete: Promise<unknown> };
    await Promise.all([
      customElements.whenDefined('lt-image'),
      customElements.whenDefined('lt-link'),
      customElements.whenDefined('lt-checkbox')
    ]);
    await Promise.all([imgHost.updateComplete, linkHost.updateComplete, cbHost.updateComplete]);

    const innerImg = imgHost.shadowRoot!.querySelector('img')!;
    expect(innerImg.getAttribute('alt')).toBe('Hero');
    expect(innerImg.getAttribute('srcset')).toBe('/hero-2x.jpg 2x');
    expect(innerImg.getAttribute('sizes')).toBe('100vw');
    expect(innerImg.getAttribute('loading')).toBe('lazy');
    expect(innerImg.getAttribute('decoding')).toBe('async');
    expect(innerImg.getAttribute('crossorigin')).toBe('anonymous');
    expect(innerImg.getAttribute('fetchpriority')).toBe('high');

    const innerAnchor = linkHost.shadowRoot!.querySelector('a')!;
    expect(innerAnchor.getAttribute('target')).toBe('_blank');
    expect(innerAnchor.getAttribute('rel')).toBe('noopener');
    expect(innerAnchor.getAttribute('download')).toBe('');
    expect(innerAnchor.getAttribute('hreflang')).toBe('en');

    const innerCb = cbHost.shadowRoot!.querySelector('input')!;
    expect(innerCb.getAttribute('name')).toBe('terms');
  });

  it('normalizes camelCase and boolean native props during SSR (renderToString)', () => {
    const html = renderToString(
      <Textfield
        autoComplete="username"
        maxLength={32}
        inputMode="text"
        readOnly={false}
        autoFocus
        spellCheck={false}
      />
    );

    expect(html).toContain('autocomplete="username"');
    expect(html).toContain('maxlength="32"');
    expect(html).toContain('inputmode="text"');
    expect(html).toContain('autofocus=""');
    expect(html).toContain('spellcheck="false"');
    expect(html).not.toContain('readonly');
    expect(html).not.toContain('readOnly');
    expect(html).not.toContain('autoComplete');
    expect(html).not.toContain('maxLength');
  });
});
