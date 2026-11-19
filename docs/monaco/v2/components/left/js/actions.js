function setOptions(select, values, placeholder) {
  select.length = 0;
  select.add(new Option(placeholder, ''));
  values.forEach((value) => select.add(new Option(value, value)));
  select.disabled = values.length === 0;
}

export function createActions({ spec, editor, elements }) {
  const allKeys = Object.keys(spec);

  const showSource = (value, title, path) => {
    editor.setValue(JSON.stringify(value, null, 2));
    elements.editorTitle.textContent = title;
    elements.editorPath.textContent = path;
  };

  const explain = (title, message, path) => {
    elements.meaningTitle.textContent = title;
    elements.meaningText.textContent = message;
    elements.selectedPath.textContent = path;
  };

  const renderButtonsList = (keys) => {
    elements.keysContainer.innerHTML = '';
    keys.forEach((key) => {
      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'spec-key-chip';
      btn.textContent = key;
      btn.addEventListener('click', () => {
        elements.specKeySelect.value = key;
        actions.selectKey(null, elements.specKeySelect);
      });
      elements.keysContainer.appendChild(btn);
    });
  };

  const actions = {
    initialize: () => {
      setOptions(elements.specKeySelect, allKeys, 'Choose a specification key');
      renderButtonsList(allKeys);
      showSource(spec, 'spec.json', 'Complete declarative-spec library');
      explain(
        'The complete specification library',
        'Every DOM primitive tree and tag specification starts here. Pick a key from the dropdown or quick-filter list to inspect its schema and structure.',
        'spec'
      );
    },

    selectKey: (event, targetElement) => {
      const selectedKey = targetElement.value;
      if (!selectedKey) {
        actions.showAll();
        return;
      }

      const itemSpec = spec[selectedKey];
      showSource(itemSpec, selectedKey, `spec.${selectedKey}`);

      const tagDesc = itemSpec.tagName || itemSpec.tag || 'object';
      const childCount = Array.isArray(itemSpec.children) ? itemSpec.children.length : 0;
      explain(
        `Specification: ${selectedKey}`,
        `Primitive tag '${tagDesc}' with ${childCount} child nodes and attributes configured. Ready to render in Tab 2.`,
        `spec.${selectedKey}`
      );
    },

    filterKeys: (event, targetElement) => {
      const term = (targetElement.value || '').toLowerCase();
      const filtered = allKeys.filter((k) => k.toLowerCase().includes(term));
      setOptions(elements.specKeySelect, filtered, 'Choose a specification key');
      renderButtonsList(filtered);
    },

    showAll: () => {
      elements.specKeySelect.value = '';
      if (elements.specFilterInput) elements.specFilterInput.value = '';
      renderButtonsList(allKeys);
      showSource(spec, 'spec.json', 'Complete declarative-spec library');
      explain(
        'The complete specification library',
        'Viewing all 67 root DOM specifications. Select an individual key or switch to Tab 2 to render the active spec.',
        'spec'
      );
    }
  };

  return actions;
}

export default createActions;