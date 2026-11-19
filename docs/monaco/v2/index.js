/**
 * declarative-spec Studio V2 Engine
 * Connects Tab 1 (Monaco Spec Editor) with Tab 2 (Live DOM Renderer)
 */

let specData = null;
let monacoEditor = null;
let activeSpecKey = null;

const specKeySelect = document.getElementById('specKeySelect');
const specSearchInput = document.getElementById('specSearchInput');
const specKeysList = document.getElementById('specKeysList');
const specCountBadge = document.getElementById('specCountBadge');
const currentKeyLabel = document.getElementById('currentKeyLabel');
const showAllSpecBtn = document.getElementById('showAllSpecBtn');

const tabSpecBtn = document.getElementById('tabSpecBtn');
const tabRenderBtn = document.getElementById('tabRenderBtn');
const tabSpecPane = document.getElementById('tabSpec');
const tabRenderPane = document.getElementById('tabRender');

const quickRenderBtn = document.getElementById('quickRenderBtn');
const executeRenderBtn = document.getElementById('executeRenderBtn');
const clearDomBtn = document.getElementById('clearDomBtn');
const domContainer = document.getElementById('dom-render-container');
const renderStatusText = document.getElementById('renderStatusText');
const renderedKeyBadge = document.getElementById('renderedKeyBadge');

// Fetch spec JSON
async function fetchSpec() {
  const candidates = [
    '../../../src/v1/spec.json',
    '../../src/v1/spec.json',
    './spec.json'
  ];

  for (const path of candidates) {
    try {
      const res = await fetch(path);
      if (res.ok) {
        return await res.json();
      }
    } catch (_) {}
  }
  throw new Error('Unable to locate spec.json');
}

// Initialize Monaco Editor
function initMonaco(initialContent) {
  return new Promise((resolve) => {
    window.require.config({
      paths: { vs: 'https://cdnjs.cloudflare.com/ajax/libs/monaco-editor/0.52.2/min/vs' }
    });

    window.require(['vs/editor/editor.main'], () => {
      monaco.languages.json.jsonDefaults.setDiagnosticsOptions({
        validate: true,
        allowComments: false,
        schemas: []
      });

      monacoEditor = monaco.editor.create(document.getElementById('monacoEditor'), {
        value: JSON.stringify(initialContent, null, 2),
        language: 'json',
        theme: 'vs-dark',
        automaticLayout: true,
        fontSize: 13,
        minimap: { enabled: false },
        lineNumbers: 'on',
        scrollBeyondLastLine: false,
        wordWrap: 'on'
      });

      resolve(monacoEditor);
    });
  });
}

// Populate Spec Keys Sidebar
function populateSpecKeys(keys) {
  specCountBadge.textContent = `${keys.length} keys`;

  // Select dropdown
  specKeySelect.innerHTML = '<option value="">-- Choose Spec Key --</option>';
  keys.forEach(k => {
    const opt = document.createElement('option');
    opt.value = k;
    opt.textContent = k;
    specKeySelect.appendChild(opt);
  });

  renderKeysList(keys);
}

function renderKeysList(keys) {
  specKeysList.innerHTML = '';
  keys.forEach(k => {
    const btn = document.createElement('button');
    btn.type = 'button';
    btn.className = `key-item-btn ${k === activeSpecKey ? 'active' : ''}`;
    btn.textContent = k;
    btn.title = k;
    btn.addEventListener('click', () => selectSpecKey(k));
    specKeysList.appendChild(btn);
  });
}

// Select a spec key and load its JSON into Monaco
function selectSpecKey(key) {
  activeSpecKey = key;
  specKeySelect.value = key;
  currentKeyLabel.textContent = `spec.${key}`;
  renderedKeyBadge.textContent = `Active: ${key}`;

  // Update active state in list
  Array.from(specKeysList.children).forEach(btn => {
    btn.classList.toggle('active', btn.textContent === key);
  });

  const content = specData[key] || {};
  if (monacoEditor) {
    monacoEditor.setValue(JSON.stringify(content, null, 2));
  }
}

// Show full spec
function showFullSpec() {
  activeSpecKey = null;
  specKeySelect.value = '';
  currentKeyLabel.textContent = 'Full spec.json';
  renderedKeyBadge.textContent = 'Active: Complete spec';

  Array.from(specKeysList.children).forEach(btn => btn.classList.remove('active'));

  if (monacoEditor && specData) {
    monacoEditor.setValue(JSON.stringify(specData, null, 2));
  }
}

// Tab Switching
function switchTab(tabId) {
  const isSpec = tabId === 'tabSpec';
  tabSpecBtn.classList.toggle('active', isSpec);
  tabRenderBtn.classList.toggle('active', !isSpec);
  tabSpecPane.classList.toggle('active', isSpec);
  tabRenderPane.classList.toggle('active', !isSpec);

  if (isSpec && monacoEditor) {
    setTimeout(() => monacoEditor.layout(), 50);
  }
}

// Build DOM tree from spec node (spec to DOM compiler)
function buildElementFromSpec(node) {
  if (!node || typeof node !== 'object') return null;

  const tag = node.tagName || node.tag || 'div';
  const el = document.createElement(tag);

  // Apply attributes
  if (node.attributes && typeof node.attributes === 'object') {
    Object.entries(node.attributes).forEach(([attr, val]) => {
      if (attr === 'class' || attr === 'className') {
        el.className = val;
      } else {
        el.setAttribute(attr, val);
      }
    });
  }

  // Text content
  if (node.textContent !== undefined) {
    el.textContent = node.textContent;
  }

  // Children
  if (Array.isArray(node.children)) {
    node.children.forEach(child => {
      const childEl = buildElementFromSpec(child);
      if (childEl) el.appendChild(childEl);
    });
  }

  return el;
}

// Render DOM action
function executeRender() {
  if (!monacoEditor) return;

  try {
    const rawCode = monacoEditor.getValue();
    const parsed = JSON.parse(rawCode);

    domContainer.innerHTML = '';
    renderStatusText.textContent = 'Rendering...';

    let mountedCount = 0;

    // Check if it's a single element or a collection of keys
    if (parsed.tagName || parsed.tag) {
      const el = buildElementFromSpec(parsed);
      if (el) {
        domContainer.appendChild(el);
        mountedCount = 1;
      }
    } else if (typeof parsed === 'object' && parsed !== null) {
      // If user passed a dictionary of keys (like full spec or multiple specs)
      Object.entries(parsed).forEach(([key, specNode]) => {
        if (specNode && (specNode.tagName || specNode.tag)) {
          const wrapper = document.createElement('div');
          wrapper.className = 'rendered-key-block mb-4 p-3 border border-secondary rounded';
          const header = document.createElement('div');
          header.className = 'badge bg-primary mb-2';
          header.textContent = key;
          wrapper.appendChild(header);

          const el = buildElementFromSpec(specNode);
          if (el) wrapper.appendChild(el);
          domContainer.appendChild(wrapper);
          mountedCount++;
        }
      });
    }

    if (mountedCount === 0) {
      domContainer.innerHTML = `
        <div class="alert alert-warning m-3" role="alert">
          <strong>Notice:</strong> Parsed JSON contains no recognizable <code>tagName</code> properties to render.
        </div>
      `;
      renderStatusText.textContent = 'No renderable tags found';
    } else {
      renderStatusText.textContent = `Mounted ${mountedCount} component(s) successfully!`;
    }
  } catch (err) {
    console.error('[declarative-spec render error]:', err);
    domContainer.innerHTML = `
      <div class="alert alert-danger m-3" role="alert">
        <strong>Compilation Error:</strong> ${err.message}
      </div>
    `;
    renderStatusText.textContent = 'Error parsing JSON';
  }
}

// Bootstrap Studio
async function boot() {
  try {
    specData = await fetchSpec();
    const keys = Object.keys(specData);

    // Initial Monaco with full spec
    await initMonaco(specData);
    populateSpecKeys(keys);

    // Search filter
    specSearchInput.addEventListener('input', (e) => {
      const q = e.target.value.toLowerCase();
      const filtered = keys.filter(k => k.toLowerCase().includes(q));
      renderKeysList(filtered);
    });

    // Select change
    specKeySelect.addEventListener('change', (e) => {
      if (e.target.value) {
        selectSpecKey(e.target.value);
      } else {
        showFullSpec();
      }
    });

    // Show All Button
    showAllSpecBtn.addEventListener('click', showFullSpec);

    // Tab buttons
    tabSpecBtn.addEventListener('click', () => switchTab('tabSpec'));
    tabRenderBtn.addEventListener('click', () => {
      switchTab('tabRender');
      executeRender();
    });

    // Quick Render button in header
    quickRenderBtn.addEventListener('click', () => {
      switchTab('tabRender');
      executeRender();
    });

    // Toolbar buttons in Tab 2
    executeRenderBtn.addEventListener('click', executeRender);
    clearDomBtn.addEventListener('click', () => {
      domContainer.innerHTML = '<div class="empty-state-notice"><p>Canvas cleared.</p></div>';
      renderStatusText.textContent = 'Canvas cleared';
    });

    // Default select first key if available for clean experience
    if (keys.includes('tableSearchBar')) {
      selectSpecKey('tableSearchBar');
    } else if (keys.length > 0) {
      selectSpecKey(keys[0]);
    }

  } catch (err) {
    console.error('Failed to load declarative-spec Studio:', err);
    currentKeyLabel.textContent = `Error: ${err.message}`;
  }
}

boot();
