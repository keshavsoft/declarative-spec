import { initRightEditor } from './components/right/js/index.js';
import { initLeftWorkspace } from './components/left/js/index.js';
import { initTab2Workspace } from './components/tab2/js/index.js';
import { initTopbar } from './topbar/js/index.js';

const specUrl = '../../../src/v1/spec.json';
const editorStatus = document.getElementById('editorStatus');
const tab1Workspace = document.getElementById('tab1Workspace');
const tab2Container = document.getElementById('tab2Container');
const tab1NavBtn = document.getElementById('tab1NavBtn');
const tab2NavBtn = document.getElementById('tab2NavBtn');

let activeEditor = null;
let tab2Actions = null;

async function loadSpec() {
  const response = await fetch(specUrl);
  if (!response.ok) {
    throw new Error(`Unable to load spec.json (${response.status}).`);
  }
  return response.json();
}

function handleSwitchTab(targetTab) {
  const isTab1 = targetTab === 'tab1';

  tab1Workspace.classList.toggle('tab-hidden', !isTab1);
  tab2Container.classList.toggle('tab-hidden', isTab1);

  tab1NavBtn.classList.toggle('active', isTab1);
  tab2NavBtn.classList.toggle('active', !isTab1);

  if (isTab1 && activeEditor) {
    setTimeout(() => activeEditor.layout(), 50);
  } else if (!isTab1 && tab2Actions) {
    // Automatically trigger render upon switching to Tab 2
    tab2Actions.render();
  }
}

async function boot() {
  try {
    const spec = await loadSpec();
    activeEditor = await initRightEditor(spec);

    await initLeftWorkspace({ spec, editor: activeEditor });
    tab2Actions = await initTab2Workspace({ editor: activeEditor });

    await initTopbar({ onSwitchTab: handleSwitchTab });

    editorStatus.textContent = 'Spec source loaded';
  } catch (error) {
    editorStatus.textContent = 'Unable to load spec';
    console.error('[declarative-spec Studio V2]', error);
  }
}

boot();