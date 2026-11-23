// Lets `node --test` load app modules: resolves the "@/…" alias and stubs Next's "server-only" marker.
import { registerHooks } from "node:module";
import path from "node:path";
import { pathToFileURL } from "node:url";

const src = pathToFileURL(path.resolve("src") + path.sep).href;

registerHooks({
  resolve(specifier, context, next) {
    if (specifier === "server-only") return { url: "data:text/javascript,", shortCircuit: true };
    if (specifier.startsWith("@/")) {
      const target = specifier.slice(2);
      return next(new URL(/\.[cm]?jsx?$/.test(target) ? target : `${target}.js`, src).href, context);
    }
    return next(specifier, context);
  },
});
