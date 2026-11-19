# declarative-spec

> **Canonical HTML DOM tag specifications, default utility classes, attributes, and interpolation tokens for declarative JSON-to-DOM compilers.**

---
[![LIVE DOCS](https://img.shields.io/badge/LIVE-DOCUMENTATION-blue?style=for-the-badge)](https://keshavsoft.github.io/declarative-spec/)
[![NPM](https://img.shields.io/badge/NPM-PACKAGE-CB3837?style=for-the-badge&logo=npm)](https://www.npmjs.com/package/declarative-spec)
[![GITHUB](https://img.shields.io/badge/GITHUB-REPOSITORY-181717?style=for-the-badge&logo=github)](https://github.com/keshavsoft/declarative-spec)
---

Part of the **KeshavSoft Declarative UI Architecture** (Tier 2: DOM Tag Specifications).

---

## 📖 The Story

In modern web development, tag structures are often tightly coupled to JavaScript frameworks (JSX, Vue templates, or string templates). 

`declarative-spec` decouples raw HTML elements into **pure, serializable JSON blueprints**:
1. **Zero Runtime Dependency**: Defines HTML primitives (`<table>`, `<th>`, `<td>`, `<select>`, `<button>`) with serializable attributes and utility classes.
2. **String Interpolation Tokens**: Supports dynamic placeholder tokens (`${columnName}`) that compilers can hydrate without hardcoding DOM manipulation.
3. **Engine Agnostic**: Can be compiled into native DOM elements, Virtual DOM nodes, or server-side HTML strings.

---

## 📦 Installation

```bash
npm install declarative-spec
```

---

## 🚀 Usage

### 1. Import Spec in ES Modules

```javascript
import spec from "declarative-spec";

// Inspect a base tag specification
console.log(spec.tableSimple);
```

### 2. Import Specific Version

```javascript
import spec from "declarative-spec/v1";
```

### 3. Direct JSON Import

```javascript
import spec from "declarative-spec/spec.json" with { type: "json" };
```

---

## 🏛️ Tag Spec Blueprint Example

```json
{
  "tableSimple": {
    "tag": "table",
    "attributes": {
      "class": "table table-bordered table-striped"
    },
    "children": []
  }
}
```

---

## 🌐 Interactive Monaco Studio & Documentation

Explore, edit, and inspect all tag blueprints live in Monaco:
* **Documentation & Story:** [https://keshavsoft.github.io/declarative-spec/](https://keshavsoft.github.io/declarative-spec/)
* **Monaco Spec Studio:** [https://keshavsoft.github.io/declarative-spec/monaco/v1/](https://keshavsoft.github.io/declarative-spec/monaco/v1/)

---

## 📄 License

MIT © [KeshavSoft](https://github.com/keshavsoft)
