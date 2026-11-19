import bindings from './bindings.json' with { type: 'json' };
import { createTab2Actions } from './actions.js';

const getBindEvents = () =>
  window.ks?.domPrimitive?.bindings?.bindEvents ||
  window.ks?.domPrimitiveBindings?.bindEvents ||
  window.ks?.bindEvents;

export async function initTab2Workspace({ editor }) {
  const elements = {
    renderTarget: document.getElementById('dom-render-container'),
    renderStatus: document.getElementById('renderStatusText')
  };

  const actions = createTab2Actions({ editor, elements });

  let bindEvents = getBindEvents();
  if (typeof bindEvents !== 'function') {
    try {
      const mod = await import('https://keshavsoft.github.io/dom-primitive-bindings/dist/v8/min.js');
      bindEvents = mod.bindEvents || mod.default || getBindEvents();
    } catch (_) {}
  }

  if (typeof bindEvents === 'function') {
    bindEvents('tab2Container', bindings, actions);
  } else {
    const renderBtn = document.getElementById('executeRenderBtn');
    const clearBtn = document.getElementById('clearDomBtn');
    if (renderBtn) renderBtn.addEventListener('click', actions.render);
    if (clearBtn) clearBtn.addEventListener('click', actions.clear);
  }

  return actions;
}

export default initTab2Workspace;