# Definitions Explorer V3

This is a separate V3 workspace. Earlier Monaco workspaces and the V2 exploratory page remain unchanged.

## Folder story

- `index.html` — the page structure and the two workspace regions.
- `index.js` — loads the existing `src/v1/definitions.json` and starts the two components.
- `topbar/css/` — styling for the top navigation band.
- `workspace/css/` — overall left/right workspace layout and shared page styling.
- `components/left/` — the definition discovery controls and explanation.
- `components/right/` — the read-only Monaco JSON source editor.

Each component keeps the same three-file arrangement:

- `bindings.json` — declarative event-to-action mapping consumed by `dom-primitive-bindings`.
- `actions.js` — the component's behavior.
- `index.js` — imports the bindings and actions and initializes the component.

The left workspace uses the common `dom-primitive-bindings` V8 browser build. Its actions receive the matched control from the binding dispatcher. The right workspace has no UI events of its own, so its `bindings.json` is intentionally empty; it still retains the same component file arrangement.

The definitions data is not copied into this folder. The explorer reads the repository's existing `src/v1/definitions.json`, keeping that file as the source of truth.
