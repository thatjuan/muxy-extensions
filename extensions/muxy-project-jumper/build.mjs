/**
 * Builds `dist/` — the manifest, the one command script, and the listing assets.
 *
 * There is no Vite step: this extension ships no HTML, no CSS and no bundled
 * JS, so a copy is the whole build. What matters is that `package.json` lands
 * *inside* `dist/`, because only `dist/` ships when the extension is published
 * and Muxy reads the manifest from the install root. Load Unpacked falls back
 * to the repo root in dev, so a missing copy step would stay invisible until
 * publish time.
 *
 * `assets/` is copied for the same reason: the marketplace validator resolves
 * `marketplace.icon` and `marketplace.screenshots` against the build output,
 * not the source tree.
 */
import { access, cp, mkdir, rm } from "node:fs/promises";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = dirname(fileURLToPath(import.meta.url));
const dist = join(root, "dist");

const exists = async (path) =>
  access(path).then(
    () => true,
    () => false,
  );

await rm(dist, { recursive: true, force: true });
await mkdir(join(dist, "scripts"), { recursive: true });
await cp(join(root, "package.json"), join(dist, "package.json"));
await cp(join(root, "src", "jump.js"), join(dist, "scripts", "jump.js"));

const copied = ["package.json", "scripts/jump.js"];

// Absent until the first screenshot is captured, so don't fail the dev build
// over it — the marketplace validator is what enforces the listing assets.
if (await exists(join(root, "assets"))) {
  await cp(join(root, "assets"), join(dist, "assets"), { recursive: true });
  copied.push("assets/");
}

console.log(`built dist/ — ${copied.join(", ")}`);
