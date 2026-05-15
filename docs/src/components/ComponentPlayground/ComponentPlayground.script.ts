import '@latty/web';
import type { PlaygroundMember, PlaygroundGroup, ChildItem } from './ComponentPlayground.types.ts';

const encodeState = (s: Record<string, unknown>) => btoa(unescape(encodeURIComponent(JSON.stringify(s))));

const decodeState = (s: string): Record<string, Record<string, unknown>> =>
  JSON.parse(decodeURIComponent(escape(atob(s))));

const applyAttr = (target: Element, member: PlaygroundMember, value: unknown): void => {
  if (member.type === 'boolean') {
    if (value) target.setAttribute(member.name, '');
    else target.removeAttribute(member.name);
  } else if (value !== '' && value !== undefined) {
    target.setAttribute(member.name, String(value));
  } else {
    target.removeAttribute(member.name);
  }
};

const applyAttrToMap = (map: Record<string, string>, member: PlaygroundMember, value: unknown): void => {
  if (member.type === 'boolean') {
    if (value) map[member.name] = '';
    else delete map[member.name];
  } else if (value !== '' && value !== undefined) {
    map[member.name] = String(value);
  } else {
    delete map[member.name];
  }
};

const toPascalCase = (tagName: string): string =>
  tagName
    .replace(/^lt-/, '')
    .split('-')
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join('');

const toReactProp = (attrName: string): string => attrName.replace(/-([a-z])/g, (_, c: string) => c.toUpperCase());

const formatTime = (d: Date): string =>
  d.toLocaleTimeString('en', {
    hour12: false,
    fractionalSecondDigits: 3
  } as Intl.DateTimeFormatOptions);

const initPlayground = async (playground: Element): Promise<void> => {
  const ds = (playground as HTMLElement).dataset;
  const id = playground.id;
  const tag = ds.tag!;
  const slotContent = ds.content ?? '';
  const members: PlaygroundMember[] = JSON.parse(ds.members ?? '[]');
  const defaults: Record<string, unknown> = JSON.parse(ds.defaults ?? '{}');
  const iconNames: string[] = JSON.parse(ds.icons ?? '[]');
  const subTagsData: PlaygroundGroup[] = JSON.parse(ds.subtagsData ?? '[]');
  const seedData: Record<string, unknown> = JSON.parse(ds.seedData ?? '{}');
  const previewTrigger = ds.previewTrigger ?? '';

  await Promise.all([
    customElements.whenDefined(tag),
    ...subTagsData.map((d) => customElements.whenDefined(d.tag)),
    customElements.whenDefined('lt-select'),
    customElements.whenDefined('lt-switch'),
    customElements.whenDefined('lt-textfield'),
    customElements.whenDefined('lt-combobox')
  ]);

  const stage = document.getElementById(`${id}-stage`)!;
  const preview = stage.parentElement!;
  const htmlCode = document.getElementById(`${id}-html-code`)!;
  const reactCode = document.getElementById(`${id}-react-code`)!;
  const copyBtn = document.getElementById(`${id}-copy`)!;
  const shareBtn = document.getElementById(`${id}-share`)!;

  const stateMap: Record<string, Record<string, unknown>> = {
    [tag]: { ...defaults },
    ...Object.fromEntries(subTagsData.map((d) => [d.tag, { ...d.defaults }]))
  };

  const stateParam = new URLSearchParams(window.location.search).get('s');
  if (stateParam) {
    try {
      const decoded = decodeState(stateParam);
      for (const [k, v] of Object.entries(decoded)) {
        if (stateMap[k] && typeof v === 'object' && v !== null) {
          Object.assign(stateMap[k], v as Record<string, unknown>);
        }
      }
    } catch {
      // ignore malformed URL state
    }
  }

  let syncUrlTimer: ReturnType<typeof setTimeout> | null = null;
  const syncUrl = () => {
    if (syncUrlTimer) clearTimeout(syncUrlTimer);
    syncUrlTimer = setTimeout(() => {
      const url = new URL(window.location.href);
      url.searchParams.set('s', encodeState(stateMap));
      history.replaceState(null, '', url.toString());
    }, 400);
  };

  const el = document.createElement(tag);
  if (slotContent) el.innerHTML = slotContent;
  if (ds.stretch === 'true') el.style.width = '100%';
  stage.appendChild(el);

  for (const [k, v] of Object.entries(seedData)) (el as any)[k] = v;

  const openEl = () => (typeof (el as any).show === 'function' ? (el as any).show() : ((el as any).open = true));
  const closeEl = () => (typeof (el as any).hide === 'function' ? (el as any).hide() : ((el as any).open = false));

  if (previewTrigger) {
    document.getElementById(`${id}-trigger`)?.addEventListener('click', openEl);
    el.addEventListener('lt-close', closeEl);
  }
  el.querySelectorAll('[data-action="close"]').forEach((btn: any) => {
    btn.addEventListener('click', closeEl);
  });

  const childItems: ChildItem[] = [];
  for (const stData of subTagsData) {
    el.querySelectorAll(stData.tag).forEach((childEl) => {
      const templateAttrs: Record<string, string> = {};
      for (const attr of childEl.attributes) templateAttrs[attr.name] = attr.value;
      childItems.push({ el: childEl, tag: stData.tag, templateAttrs });
    });
  }

  const seedDataScript = (): string => {
    const entries = Object.entries(seedData);
    if (!entries.length) return '';
    const assignments = entries
      .map(([k, v]) => `  el.${k} = ${JSON.stringify(v, null, 2).replace(/\n/g, '\n  ')};`)
      .join('\n');
    return `\n<script type="module">\n  import '@latty/web';\n  const el = document.querySelector('${tag}');\n${assignments}\n</script>`;
  };

  const buildParentAttrParts = (forReact = false): string[] => {
    const parentState = stateMap[tag];
    const parts: string[] = [];
    members.forEach((member) => {
      if (member.name === 'theme') return;
      const value = parentState[member.name];
      const def = defaults[member.name];
      if (member.type === 'boolean') {
        if (value === true) parts.push(forReact ? toReactProp(member.name) : member.name);
      } else if (value !== '' && value !== undefined && value !== def) {
        const name = forReact ? toReactProp(member.name) : member.name;
        parts.push(`${name}="${value}"`);
      }
    });
    const themeVal = parentState['theme'];
    if (themeVal === 'dark' || themeVal === 'light') parts.push(`theme="${themeVal}"`);
    return parts;
  };

  const generateHTML = (): string => {
    const attrParts = buildParentAttrParts(false);
    const attrs = attrParts.length ? '\n  ' + attrParts.join('\n  ') + '\n' : '';

    if (!subTagsData.length) {
      const base = slotContent ? `<${tag}${attrs}>\n  ${slotContent}\n</${tag}>` : `<${tag}${attrs}></${tag}>`;
      return base + seedDataScript();
    }

    const childLines = childItems.map((item) => {
      const finalAttrs = { ...item.templateAttrs };
      const stData = subTagsData.find((d) => d.tag === item.tag);
      if (stData) {
        const childState = stateMap[item.tag];
        stData.members.forEach((member: PlaygroundMember) => {
          const value = childState[member.name];
          if (value !== stData.defaults[member.name]) applyAttrToMap(finalAttrs, member, value);
        });
      }
      const attrsStr = Object.entries(finalAttrs)
        .map(([k, v]) => (v === '' ? k : `${k}="${v}"`))
        .join(' ');
      const text = item.el.textContent?.trim() ?? '';
      return `  <${item.tag}${attrsStr ? ' ' + attrsStr : ''}>${text}</${item.tag}>`;
    });

    return `<${tag}${attrs}>\n${childLines.join('\n')}\n</${tag}>`;
  };

  const generateReact = (): string => {
    const parentName = toPascalCase(tag);
    const attrParts = buildParentAttrParts(true);
    const seedEntries = Object.entries(seedData);
    const seedConsts = seedEntries.map(([k, v]) => `const ${k} = ${JSON.stringify(v, null, 2)};`).join('\n');
    const allAttrParts = [...attrParts, ...seedEntries.map(([k]) => `${k}={${k}}`)];

    if (!subTagsData.length) {
      const importLine = `import { ${parentName} } from '@latty/react';`;
      const constBlock = seedConsts ? `\n${seedConsts}\n` : '';
      const propsStr = allAttrParts.length ? '\n  ' + allAttrParts.join('\n  ') + '\n' : '';
      const children = slotContent ? `\n  ${slotContent}\n` : '';
      if (children) return `${importLine}${constBlock}\n<${parentName}${propsStr}>${children}</${parentName}>`;
      return `${importLine}${constBlock}\n<${parentName}${propsStr || ' '}/>`;
    }

    const childTagNames = [...new Set(childItems.map((item) => item.tag))];
    const importLine = `import { ${[parentName, ...childTagNames.map(toPascalCase)].join(', ')} } from '@latty/react';`;

    const childLines = childItems.map((item) => {
      const componentName = toPascalCase(item.tag);
      const finalAttrs: Record<string, string> = {};
      for (const [k, v] of Object.entries(item.templateAttrs)) finalAttrs[toReactProp(k)] = v;
      const stData = subTagsData.find((d) => d.tag === item.tag);
      if (stData) {
        const childState = stateMap[item.tag];
        stData.members.forEach((member: PlaygroundMember) => {
          const value = childState[member.name];
          if (value !== stData.defaults[member.name])
            applyAttrToMap(finalAttrs, { ...member, name: toReactProp(member.name) }, value);
        });
      }
      const reactAttrsStr = Object.entries(finalAttrs)
        .map(([k, v]) => (v === '' ? k : `${k}="${v}"`))
        .join(' ');
      const text = item.el.textContent?.trim() ?? '';
      return `  <${componentName}${reactAttrsStr ? ' ' + reactAttrsStr : ''}>${text}</${componentName}>`;
    });

    const propsStr = attrParts.length ? '\n  ' + attrParts.join('\n  ') + '\n' : '';
    return `${importLine}\n\n<${parentName}${propsStr}>\n${childLines.join('\n')}\n</${parentName}>`;
  };

  const updateCode = () => {
    htmlCode.textContent = generateHTML();
    reactCode.textContent = generateReact();
  };

  const applyState = () => {
    const parentState = stateMap[tag];
    members.forEach((member) => {
      if (member.name === 'theme') return;
      applyAttr(el, member, parentState[member.name]);
    });

    const themeValue = parentState['theme'];
    if (themeValue === 'dark' || themeValue === 'light') {
      el.setAttribute('theme', themeValue as string);
      preview.setAttribute('data-preview-theme', themeValue as string);
    } else {
      el.removeAttribute('theme');
      preview.removeAttribute('data-preview-theme');
    }

    for (const stData of subTagsData) {
      const childState = stateMap[stData.tag];
      el.querySelectorAll(stData.tag).forEach((childEl) => {
        stData.members.forEach((member: PlaygroundMember) => {
          const value = childState[member.name];
          if (value === stData.defaults[member.name]) return;
          applyAttr(childEl, member, value);
        });
      });
    }

    if (members.some((m) => m.name === 'orientation')) {
      const isVertical = parentState['orientation'] === 'vertical';
      stage.style.alignItems = isVertical ? 'stretch' : '';
      el.style.height = isVertical ? '100%' : '';
      el.style.width = isVertical ? 'auto' : ds.stretch === 'true' ? '100%' : '';
    }
  };

  playground.querySelectorAll('lt-select[data-prop]').forEach((ctrl: any) => {
    const rawOptions: string[] = JSON.parse(ctrl.dataset.options ?? '[]');
    ctrl.options = rawOptions.map((v: string) => ({ value: v, label: v === '' ? '— default —' : v }));
  });
  playground.querySelectorAll('lt-combobox[data-type="icon"]').forEach((ctrl: any) => {
    ctrl.options = iconNames.map((n: string) => ({ value: n, label: n }));
  });

  playground.querySelectorAll('[data-prop]').forEach((ctrl: any) => {
    const val = stateMap[ctrl.dataset.ctrlTag ?? tag]?.[ctrl.dataset.prop];
    if ('checked' in ctrl) ctrl.checked = val === true;
    else ctrl.value = String(val ?? '');
  });

  applyState();
  updateCode();

  playground.querySelectorAll('[data-prop]').forEach((control) => {
    const ctrl = control as HTMLElement & any;
    const propName = ctrl.dataset.prop!;
    const type = ctrl.dataset.type!;
    const ctrlTag = ctrl.dataset.ctrlTag ?? tag;

    const onChange = (value: unknown) => {
      stateMap[ctrlTag][propName] = value;
      applyState();
      updateCode();
      syncUrl();
    };

    if (type === 'boolean') ctrl.addEventListener('change', (e: any) => onChange(e.detail.checked));
    else if (type === 'select') ctrl.addEventListener('change', (e: any) => onChange(e.detail.value));
    else if (type === 'text' || type === 'number') ctrl.addEventListener('input', (e: any) => onChange(e.detail.value));
    else if (type === 'icon') ctrl.addEventListener('lt-change', (e: any) => onChange(e.detail.value));
    else if (type === 'color')
      ctrl.addEventListener('input', (e: Event) => onChange((e.target as HTMLInputElement).value));
  });

  const ctrlTabBtns = playground.querySelectorAll('.ctrl-tab-btn');
  if (ctrlTabBtns.length) {
    ctrlTabBtns.forEach((btn) => {
      btn.addEventListener('click', () => {
        const ctrlTag = (btn as HTMLElement).dataset.ctrlTag!;
        ctrlTabBtns.forEach((b) => b.classList.remove('is-active'));
        btn.classList.add('is-active');
        playground.querySelectorAll('[data-ctrl-group]').forEach((row: any) => {
          row.style.display = row.dataset.ctrlGroup === ctrlTag ? '' : 'none';
        });
      });
    });
  }

  let activeLang = 'html';
  const tabsEl = document.getElementById(`${id}-tabs`);
  const htmlPanel = document.getElementById(`${id}-html-panel`);
  const reactPanel = document.getElementById(`${id}-react-panel`);

  tabsEl?.addEventListener('change', (e: Event) => {
    activeLang = (e as CustomEvent<{ value: string }>).detail.value;
    htmlPanel!.style.display = activeLang === 'html' ? '' : 'none';
    reactPanel!.style.display = activeLang === 'react' ? '' : 'none';
  });

  copyBtn.addEventListener('click', async () => {
    const codeEl = activeLang === 'html' ? htmlCode : reactCode;
    await navigator.clipboard.writeText(codeEl.textContent ?? '');
    copyBtn.textContent = 'Copied!';
    setTimeout(() => {
      copyBtn.textContent = 'Copy';
    }, 1500);
  });

  shareBtn?.addEventListener('click', async () => {
    const url = new URL(window.location.href);
    url.searchParams.set('s', encodeState(stateMap));
    history.replaceState(null, '', url.toString());
    await navigator.clipboard.writeText(url.toString());
    (shareBtn as any).textContent = 'Copied!';
    setTimeout(() => {
      (shareBtn as any).textContent = 'Share';
    }, 1500);
  });

  const bpBtns = preview.querySelectorAll<HTMLElement>('.bp-btn');
  bpBtns.forEach((btn) => {
    btn.addEventListener('click', () => {
      bpBtns.forEach((b) => b.classList.remove('is-active'));
      btn.classList.add('is-active');
      stage.style.maxWidth = btn.dataset.width ? `${btn.dataset.width}px` : '';
    });
  });

  const eventLogEl = document.getElementById(`${id}-event-log`)!;
  const eventLogBody = document.getElementById(`${id}-event-log-body`)!;
  const eventLogRows = document.getElementById(`${id}-event-log-rows`)!;
  const eventLogLabel = document.getElementById(`${id}-event-log-label`)!;
  const eventLogToggle = document.getElementById(`${id}-event-log-toggle`)!;

  let eventCount = 0;
  let logOpen = false;
  const LOG_EVENTS = ['lt-change', 'lt-input', 'lt-close', 'change', 'input', 'close', 'open', 'toggle'];

  LOG_EVENTS.forEach((evtName) => {
    el.addEventListener(
      evtName,
      (e: any) => {
        eventCount++;
        if (!logOpen) {
          logOpen = true;
          eventLogBody.removeAttribute('hidden');
          eventLogEl.classList.add('is-open');
        }
        eventLogLabel.textContent = `Events (${eventCount})`;
        const row = document.createElement('div');
        row.className = 'event-log-row';
        const detailStr = e.detail != null ? JSON.stringify(e.detail).replace(/</g, '&lt;').replace(/>/g, '&gt;') : '';
        row.innerHTML = `<span class="event-log-time">${formatTime(new Date())}</span><span class="event-log-name">${evtName}</span><span class="event-log-detail">${detailStr}</span>`;
        eventLogRows.prepend(row);
        while (eventLogRows.children.length > 20) eventLogRows.removeChild(eventLogRows.lastChild!);
      },
      true
    );
  });

  eventLogToggle.addEventListener('click', () => {
    logOpen = !logOpen;
    if (logOpen) {
      eventLogBody.removeAttribute('hidden');
      eventLogEl.classList.add('is-open');
    } else {
      eventLogBody.setAttribute('hidden', '');
      eventLogEl.classList.remove('is-open');
    }
  });
};

document.querySelectorAll('.playground').forEach(initPlayground);
