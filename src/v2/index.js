import spec from "./spec.json" with { type: "json" };
import meta from "./meta.js";
import registerGlobal from "./register.js";

export { spec, meta };
export default spec;

registerGlobal(spec);