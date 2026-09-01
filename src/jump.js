/**
 * "Jump to Project" — the extension's only moving part.
 *
 * Opens Muxy's native picker over the project list and switches to whatever the
 * user selects. The picker owns the search field, filtering, keyboard navigation
 * and theming: it matches the query case-insensitively as a substring of both
 * `title` (project name) and `subtitle` (path), which is exactly the
 * name-or-path search we want, so this script never filters anything itself.
 *
 * runScript context: every `muxy.*` call here is synchronous, and
 * `muxy.modal.open` returns immediately — the choice arrives only via `onSelect`.
 */

/** Modal `id`/`title`/`subtitle` fields are capped at 200 characters. */
const FIELD_LIMIT = 200;

/**
 * Home directories we can recognise by shape. Reading $HOME would mean shelling
 * out, and `commands:exec` is a permission this extension otherwise doesn't need.
 * Remote (SSH) workspaces are Linux more often than not, hence /home too.
 */
const HOME_PREFIX = /^(\/Users\/[^/]+|\/home\/[^/]+)(?=\/|$)/;

/**
 * Builds a row's secondary line: the path with a leading home directory
 * abbreviated to `~`, optionally tagged with its workspace, trimmed to fit.
 * Long paths are truncated from the left so the tail — the part that actually
 * distinguishes one project from another — survives.
 */
function formatSubtitle(path, workspaceName) {
  const abbreviated = String(path ?? "").replace(HOME_PREFIX, "~");
  const line = workspaceName ? `${abbreviated} · ${workspaceName}` : abbreviated;
  return line.length <= FIELD_LIMIT
    ? line
    : `…${line.slice(-(FIELD_LIMIT - 1))}`;
}

const projects = muxy.projects.list() ?? [];

// Match the sidebar's ordering when the app gives us one, otherwise list order.
const ordered = projects.every((p) => typeof p.sortOrder === "number")
  ? [...projects].sort((a, b) => a.sortOrder - b.sortOrder)
  : projects;

// Tag rows with their workspace only when more than one is represented. With a
// single workspace the suffix is pure noise, and a runScript context has no
// `muxy.workspaces` to tell us which one is currently active.
const workspaceNames = new Set(
  ordered.map((p) => p.workspaceName).filter(Boolean),
);
const tagWorkspace = workspaceNames.size > 1;

const items = ordered.map((p) => ({
  id: p.id,
  title: p.name,
  subtitle: formatSubtitle(p.path, tagWorkspace ? p.workspaceName : null),
}));

muxy.modal.open({
  items,
  placeholder: "Jump to project…",
  emptyLabel: "No projects",
  noMatchLabel: "No matching projects",
  onSelect(choice) {
    // `null` on Esc, an outside click, or another modal taking over.
    if (!choice) return;

    try {
      muxy.projects.switchTo(choice.id);
    } catch (err) {
      // e.g. the project was removed between listing and selecting.
      muxy.dialog.alert({
        title: "Couldn't switch project",
        message: String(err),
        style: "critical",
      });
    }
  },
});
