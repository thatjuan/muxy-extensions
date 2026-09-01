/**
 * Builds `dist/` — the manifest plus the one command script.
 *
 * There is no Vite step: this extension ships no HTML, no CSS and no bundled
 * JS, so a copy is the whole build. What matters is that `package.json` lands
 * *inside* `dist/`, because only `dist/` ships when the extension is published
 * and Muxy reads the manifest from the install root. Load Unpacked falls back
 * to the repo root in dev, so a missing copy step would stay invisible until
 * publish time.
 */
import { cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "scripts"), { recursive: true });
await cp(join(root, "package.json"), join(dist, "package.json"));
await cp(join(root, "src", "jump.js"), join(dist, "scripts", "jump.js"));

console.log("built dist/ — package.json, scripts/jump.js");
