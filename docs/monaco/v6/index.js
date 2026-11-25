import { initRightEditor } from './components/right/js/index.js';
import { initLeftWorkspace } from './components/left/js/index.js';

import spec from "https://keshavsoft.github.io/declarative-spec/json/v3/spec.json" with {type: "json"};

async function boot() {
  try {
    const editor = await initRightEditor(spec);

    await initLeftWorkspace({ spec, editor });
  } catch (error) {
    console.error('[Spec Explorer V5]', error);
  };
};

boot();