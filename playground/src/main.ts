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
const fixtureOptions = new URLSearchParams(window.location.search);
const pageContent = fixtureOptions.has("contextual-content")
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
  pageTitle: "Create your first client",
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
    if (event.type === "action-error") {
      document.documentElement.dataset.fixtureEvent = event.type;
      showToast("That action is unavailable in this preview");
    }
  },
});

const controller = mountDocsAiIsland(config);

document.querySelectorAll<HTMLSelectElement>("[data-control]").forEach((select) => {
  select.addEventListener("change", () => {
    const key = select.dataset.control as keyof DocsAiIslandAppearance;
    controller.update({ appearance: { [key]: select.value } });
  });
});

document.querySelector<HTMLInputElement>("[data-accent]")?.addEventListener("input", (event) => {
  controller.update({ theme: { accent: (event.currentTarget as HTMLInputElement).value } });
});
