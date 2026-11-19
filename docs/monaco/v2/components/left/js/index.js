import bindings from './bindings.json' with { type: 'json' };
import { createActions } from './actions.js';

const getBindEvents = () =>
  window.ks?.domPrimitive?.bindings?.bindEvents ||
  window.ks?.domPrimitiveBindings?.bindEvents ||
  window.ks?.bindEvents;

export async function initLeftWorkspace({ spec, editor }) {
  const elements = {
    specKeySelect: document.getElementById('specKeySelect'),
    specFilterInput: document.getElementById('specFilterInput'),
    keysContainer: document.getElementById('keysContainer'),
    meaningTitle: document.getElementById('meaningTitle'),
    meaningText: document.getElementById('meaningText'),
    selectedPath: document.getElementById('selectedPath'),
    editorTitle: document.getElementById('editorTitle'),
    editorPath: document.getElementById('editorPath')
  };

  const actions = createActions({ spec, editor, elements });
  actions.initialize();

  let bindEvents = getBindEvents();
  if (typeof bindEvents !== 'function') {
    try {
      const mod = await import('https://keshavsoft.github.io/dom-primitive-bindings/dist/v8/min.js');
      bindEvents = mod.bindEvents || mod.default || getBindEvents();
    } catch (_) {}
  }

  if (typeof bindEvents !== 'function') {
    console.warn('[declarative-spec] dom-primitive-bindings not found, fallback to manual event hooks');
    elements.specKeySelect.addEventListener('change', (e) => actions.selectKey(e, e.target));
    elements.specFilterInput.addEventListener('input', (e) => actions.filterKeys(e, e.target));
    const showAllBtn = document.getElementById('showAll');
    if (showAllBtn) showAllBtn.addEventListener('click', actions.showAll);
    return actions;
  }

  bindEvents('leftWorkspace', bindings, actions);
  return actions;
}

export default initLeftWorkspace;