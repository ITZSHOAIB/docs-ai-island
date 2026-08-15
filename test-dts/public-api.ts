import {
  chatgpt,
  copyPage,
  type DocsAiIslandAction,
  type DocsAiIslandContentSource,
  type DocsAiIslandController,
  defineConfig,
  defineContentSource,
  markdownSource,
  mountDocsAiIsland,
  viewMarkdown,
} from "../src/index.ts";

const action: DocsAiIslandAction = {
  id: "search",
  label: "Search docs",
  onSelect({ page }) {
    return page.canonicalUrl.href;
  },
};

const content = defineContentSource({
  read({ page, signal }) {
    signal.throwIfAborted();
    return { kind: "markdown" as const, value: `# ${page.title}` };
  },
});
const contentContract: DocsAiIslandContentSource = content;
const copyAction: DocsAiIslandAction = copyPage({ source: contentContract });
const remoteMarkdown = markdownSource({
  url: (page) => new URL(`/raw${page.canonicalUrl.pathname}.md`, page.canonicalUrl),
});
const remoteCopyAction: DocsAiIslandAction = copyPage({
  source: remoteMarkdown,
  fallback: "copy-url",
});
const viewMarkdownAction: DocsAiIslandAction = viewMarkdown({ source: remoteMarkdown });
// @ts-expect-error Callback-only content sources do not declare a viewable URL.
viewMarkdown({ source: contentContract });

const config = defineConfig({
  groups: [
    {
      id: "main",
      actions: [chatgpt(), action, copyAction, remoteCopyAction, viewMarkdownAction],
    },
  ],
  appearance: { placement: "bottom-right", density: "comfortable" },
  theme: { menuRadius: "14px", accent: "rebeccapurple" },
});

const controller: DocsAiIslandController = mountDocsAiIsland(config);
controller.update({ pageTitle: "Updated page" });
controller.destroy();
