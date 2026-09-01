# Project Jumper

A Muxy extension that binds a keyboard shortcut to a Spotlight-style project
switcher. Press `cmd+shift+j` anywhere in Muxy, type part of a project's name or
path, hit Return, and Muxy switches to it.

## How it works

The whole extension is one palette command whose action is a `runScript`. The
script opens Muxy's native modal picker with the project list — name as `title`,
`~`-abbreviated path as `subtitle` — and calls `muxy.projects.switchTo` on the
selection. The picker's built-in filtering matches both fields, so searching by
name or by path comes for free.

There is no background script, no webview and no CSS.

## Shortcut

`cmd+shift+j` is only the default. Users rebind it under **Settings → Keyboard
Shortcuts → App Shortcuts**, where it appears grouped under this extension. If
the default is already claimed when the extension loads, Muxy registers the
command unassigned and the user can bind it there.

The command also shows up in the command palette as **Jump to Project**.

## Development

```sh
cd extensions/muxy-project-jumper
npm run build
```

Then **Load Unpacked** in Muxy's Extensions modal, pointing at this directory
(not its `dist/` — Muxy finds that itself). After each rebuild, hit **Reload** in
that modal; Reload alone does not rebuild.

`build.mjs` copies `package.json`, `src/jump.js` and `assets/` into `dist/`.
Only `dist/` ships on publish, which is why the manifest has to be copied inside
it — and why the listing assets do too, since the marketplace validator resolves
`marketplace.icon` and `marketplace.screenshots` against the build output.

## Permissions

| Permission | Why |
| --- | --- |
| `projects:read` | `muxy.projects.list()` |
| `projects:write` | `muxy.projects.switchTo()` |
| `commands:run-script` | the `runScript` command action |

## Publishing status

Everything the marketplace validator checks passes except one thing: there is no
screenshot yet. `marketplace.screenshots` points at
`assets/screenshots/screenshot-1.png`, which has to be a PNG at 16:10 or 16:9
showing the overlay in use. Capture it, drop it at that path, rebuild, and the
extension is ready to copy into a fork of
[`muxy-app/extensions`](https://github.com/muxy-app/extensions).

Verified with the registry's own tooling:

```sh
node scripts/validate.mjs muxy-project-jumper
node scripts/pack.mjs --dry-run muxy-project-jumper
```
