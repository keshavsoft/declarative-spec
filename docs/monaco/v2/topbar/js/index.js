import bindings from './bindings.json' with { type: 'json' };
import { createTopbarActions } from './actions.js';

const getBindEvents = () =>
  window.ks?.domPrimitive?.bindings?.bindEvents ||
  window.ks?.domPrimitiveBindings?.bindEvents ||
  window.ks?.bindEvents;

export async function initTopbar({ onSwitchTab }) {
  const actions = createTopbarActions({ onSwitchTab });

  let bindEvents = getBindEvents();
  if (typeof bindEvents !== 'function') {
    try {
      const mod = await import('https://keshavsoft.github.io/dom-primitive-bindings/dist/v8/min.js');
      bindEvents = mod.bindEvents || mod.default || getBindEvents();
    } catch (_) {}
  }

  if (typeof bindEvents === 'function') {
    bindEvents('topbarContainer', bindings, actions);
  }

  return actions;
}

export default initTopbar;