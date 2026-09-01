# muxy-extensions

My [Muxy](https://muxy.app) extensions. One repo, many extensions.

## Layout

```
extensions/
└── <name>/          # directory name == the "name" field in its package.json
    ├── package.json # the manifest lives in the "muxy" block
    ├── src/
    └── dist/        # built, gitignored
```

This mirrors [`muxy-app/extensions`](https://github.com/muxy-app/extensions), the
marketplace repo, so publishing an extension is a copy of `extensions/<name>/`
into a fork of that repo with no restructuring in between.

## Extensions

| Name | What it does |
| --- | --- |
| [muxy-project-jumper](extensions/muxy-project-jumper) | Spotlight-style project switcher on `cmd+shift+j` |

## Each extension stands alone

The marketplace builds an extension by running, inside that one directory:

```sh
npm ci --ignore-scripts
npm run build          # must emit dist/, including a copy of package.json
```

So every extension directory carries its own `package.json`, its own
`package-lock.json`, and its own build script. No npm workspaces, no hoisted
lockfile, no symlinks between extensions — the packager drops symlinks, and a
hoisted dependency tree would not survive the copy into the marketplace repo.
Shared code gets copied, not linked.

## Working on one

```sh
cd extensions/<name>
npm run build
```

Then **Load Unpacked** in Muxy's Extensions modal pointing at
`extensions/<name>` (not its `dist/` — Muxy finds that itself), and **Reload**
there after each rebuild.

## Publishing

Extensions reach **Extensions → Browse** through a PR to
[`muxy-app/extensions`](https://github.com/muxy-app/extensions). See its
[CONTRIBUTING.md](https://github.com/muxy-app/extensions/blob/main/CONTRIBUTING.md),
with one correction: it describes a standalone `manifest.json`, but every
published extension actually keeps its manifest in the `muxy` block of
`package.json`.

CI requires a `marketplace` block with a listing icon and at least one
screenshot, a committed `package-lock.json`, and a `README.md`. Published
`name@version` pairs are immutable, so shipping a change means bumping
`version`.

## Skills

`.agents/skills/muxy-extension` is the official authoring skill, pinned in
`skills-lock.json` and symlinked into `.claude/skills/`. Refresh it with:

```sh
npx skills add github.com/muxy-app/muxy/tree/main/Muxy/Resources/skills/muxy-extension
```
