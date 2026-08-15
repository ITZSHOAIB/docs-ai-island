import {
  chatgpt,
  claude,
  copyPage,
  copyResource,
  type DocsAiIslandAction,
  type DocsAiIslandAppearance,
  defineConfig,
  defineContentSource,
  markdownSource,
  mountDocsAiIsland,
  openUrl,
  viewMarkdown,
} from "../../src/index.ts";
import "../../src/styles/index.css";
import "./playground.css";

const toast = document.querySelector<HTMLElement>("[data-toast]");
let toastTimer: number | undefined;

function showToast(message: string): void {
  if (!toast) return;
  window.clearTimeout(toastTimer);
  toast.textContent = message;
  toast.hidden = false;
  toastTimer = window.setTimeout(() => {
    toast.hidden = true;
  }, 1800);
}

document.documentElement.dataset.fixtureContentReads = "0";
const inlineContent = defineContentSource({
  read: () => {
    document.documentElement.dataset.fixtureContentReads = String(
      Number(document.documentElement.dataset.fixtureContentReads) + 1,
    );
    return {
      kind: "markdown" as const,
      value: "# Exact source\n\nKeep **formatting**.",
    };
  },
});
const remoteContent = markdownSource({
  url: () => new URL("/content/getting-started.md", window.location.origin),
});
const contextualRemoteContent = markdownSource({
  url: (page) => new URL(`/content${page.canonicalUrl.pathname}.md`, page.canonicalUrl),
});
const delayedContent = defineContentSource({
  read({ signal }) {
    signal.addEventListener(
      "abort",
      () => {
        document.documentElement.dataset.fixtureSourceAborted = "true";
      },
      { once: true },
    );
    return new Promise<{ kind: "markdown"; value: string }>((resolve) => {
      window.setTimeout(() => resolve({ kind: "markdown", value: "# Stale delayed content" }), 150);
    });
  },
});
const fixtureOptions = new URLSearchParams(window.location.search);
const pageContent = fixtureOptions.has("delayed-content")
  ? delayedContent
  : fixtureOptions.has("contextual-content")
    ? contextualRemoteContent
    : fixtureOptions.has("remote-content")
      ? remoteContent
      : inlineContent;

const markdown: DocsAiIslandAction = {
  id: "markdown",
  label: "Markdown",
  icon: "file",
  closeOnSelect: false,
  onSelect: () => showToast("A Markdown source can be connected here"),
};
const markdownAction = fixtureOptions.has("contextual-content")
  ? viewMarkdown({ source: contextualRemoteContent })
  : fixtureOptions.has("remote-content")
    ? viewMarkdown({ source: remoteContent })
    : markdown;

const mcp = copyResource({
  id: "mcp",
  label: "MCP",
  icon: "link",
  value: fixtureOptions.has("dynamic-resource")
    ? (page) =>
        new URL(
          `/api/mcp?from=${encodeURIComponent(page.canonicalUrl.pathname)}`,
          page.canonicalUrl,
        )
    : "https://docs.luma.dev/api/mcp",
});

const config = defineConfig({
  initialOpen: fixtureOptions.has("initial-open"),
  pageTitle: fixtureOptions.has("route-lifecycle")
    ? () => document.title
    : "Create your first client",
  ...(fixtureOptions.has("hidden") ? { visible: false } : {}),
  ...(fixtureOptions.has("route-lifecycle")
    ? { visible: (page: { url: URL }) => page.url.pathname !== "/hidden" }
    : {}),
  ...(fixtureOptions.has("clipboard-denied")
    ? { messages: { actionFailed: (label: string) => `Could not complete ${label}` } }
    : {}),
  groups: [
    {
      id: "targets",
      kind: "primary",
      actions: [chatgpt(), claude()],
    },
    {
      id: "page-tools",
      kind: "utility",
      actions: [
        copyPage({
          source: pageContent,
          ...(fixtureOptions.has("copy-url-fallback") ? { fallback: "copy-url" as const } : {}),
        }),
        markdownAction,
        mcp,
        ...(fixtureOptions.has("unsafe-resource")
          ? [
              openUrl({
                id: "unsafe",
                label: "Unsafe",
                url: "javascript:alert(1)",
              }),
            ]
          : []),
        ...(fixtureOptions.has("route-lifecycle")
          ? [
              {
                id: "capture-route",
                label: "Capture route",
                icon: "link" as const,
                closeOnSelect: false,
                onSelect({ element, page }: { element: HTMLElement; page: { canonicalUrl: URL } }) {
                  element.dataset.fixtureCanonical = page.canonicalUrl.href;
                  return "Current canonical URL captured";
                },
              },
            ]
          : []),
      ],
    },
    ...(fixtureOptions.has("custom-open")
      ? [
          {
            id: "resource-links",
            kind: "primary" as const,
            actions: [
              openUrl({
                id: "source-link",
                label: "Source repository",
                description: "Inspect the implementation",
                icon: false,
                closeOnSelect: false,
                url: "https://github.com/ITZSHOAIB/docs-ai-island",
              }),
            ],
          },
        ]
      : []),
  ],
  onEvent(event) {
    if (event.type === "action-success" || event.type === "action-error") {
      document.documentElement.dataset.fixtureOutcomePayload = JSON.stringify(
        event,
        (_key, value) =>
          value instanceof Error ? { name: value.name, message: value.message } : value,
      );
    }
    if (event.type === "action-error") {
      document.documentElement.dataset.fixtureEvent = event.type;
      document.documentElement.dataset.fixtureEventCount = String(
        Number(document.documentElement.dataset.fixtureEventCount ?? 0) + 1,
      );
      document.documentElement.dataset.fixtureEventPayload = JSON.stringify(event, (_key, value) =>
        value instanceof Error ? { name: value.name, message: value.message } : value,
      );
      showToast("That action is unavailable in this preview");
    }
    if (fixtureOptions.has("throwing-callback")) {
      throw new Error("Fixture analytics failure");
    }
  },
});

const controller = mountDocsAiIsland(config);

window.addEventListener("fixture:update", () => {
  controller.update({ pageTitle: "Updated fixture page" });
});
window.addEventListener("fixture:open", () => {
  controller.open();
});
window.addEventListener("fixture:refresh", () => {
  controller.refresh();
});
window.addEventListener("fixture:destroy", () => {
  controller.destroy();
});

document.querySelectorAll<HTMLSelectElement>("[data-control]").forEach((select) => {
  select.addEventListener("change", () => {
    const key = select.dataset.control as keyof DocsAiIslandAppearance;
    controller.update({ appearance: { [key]: select.value } });
  });
});

document.querySelector<HTMLInputElement>("[data-accent]")?.addEventListener("input", (event) => {
  controller.update({ theme: { accent: (event.currentTarget as HTMLInputElement).value } });
});
