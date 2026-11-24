import meta from "./meta.js";

const registerGlobal = (spec) => {
  if (typeof globalThis === "undefined") return;

  globalThis.ks ??= {};
  globalThis.ks.declarative ??= {};
  globalThis.ks.declarative.spec = { meta, data: spec };
};

export default registerGlobal;