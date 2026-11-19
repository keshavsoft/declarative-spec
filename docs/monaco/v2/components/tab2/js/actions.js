function compileSpecToElement(node) {
  if (!node || typeof node !== 'object') return null;

  const tag = node.tagName || node.tag || 'div';
  const el = document.createElement(tag);

  if (node.attributes && typeof node.attributes === 'object') {
    Object.entries(node.attributes).forEach(([attr, val]) => {
      if (attr === 'class' || attr === 'className') {
        el.className = val;
      } else {
        el.setAttribute(attr, val);
      }
    });
  }

  if (node.textContent !== undefined) {
    el.textContent = node.textContent;
  }

  if (Array.isArray(node.children)) {
    node.children.forEach((child) => {
      const childEl = compileSpecToElement(child);
      if (childEl) el.appendChild(childEl);
    });
  }

  return el;
}

export function createTab2Actions({ editor, elements }) {
  return {
    render: () => {
      if (!editor) return;

      try {
        const rawJson = editor.getValue();
        const parsed = JSON.parse(rawJson);

        elements.renderTarget.innerHTML = '';
        elements.renderStatus.textContent = 'Rendering DOM...';

        let mountedCount = 0;

        if (parsed.tagName || parsed.tag) {
          const el = compileSpecToElement(parsed);
          if (el) {
            elements.renderTarget.appendChild(el);
            mountedCount = 1;
          }
        } else if (typeof parsed === 'object' && parsed !== null) {
          Object.entries(parsed).forEach(([key, specNode]) => {
            if (specNode && (specNode.tagName || specNode.tag)) {
              const card = document.createElement('div');
              card.className = 'rendered-spec-card';
              
              const titleBadge = document.createElement('div');
              titleBadge.className = 'badge-tag';
              titleBadge.textContent = key;
              card.appendChild(titleBadge);

              const el = compileSpecToElement(specNode);
              if (el) card.appendChild(el);
              elements.renderTarget.appendChild(card);
              mountedCount++;
            }
          });
        }

        if (mountedCount === 0) {
          elements.renderTarget.innerHTML = `
            <div class="render-alert warning">
              <strong>Notice:</strong> Parsed JSON contains no recognizable <code>tagName</code> specification properties.
            </div>
          `;
          elements.renderStatus.textContent = 'No tagName found';
        } else {
          elements.renderStatus.textContent = `Mounted ${mountedCount} DOM component(s) successfully.`;
        }
      } catch (err) {
        elements.renderTarget.innerHTML = `
          <div class="render-alert error">
            <strong>Compilation Error:</strong> ${err.message}
          </div>
        `;
        elements.renderStatus.textContent = 'Syntax error in Editor JSON';
      }
    },

    clear: () => {
      elements.renderTarget.innerHTML = `
        <div class="empty-render-notice">
          <p>Canvas cleared. Click <strong>"Render Monaco Spec to DOM"</strong> to compile again.</p>
        </div>
      `;
      elements.renderStatus.textContent = 'Canvas cleared';
    }
  };
}

export default createTab2Actions;