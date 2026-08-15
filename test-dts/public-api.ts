import {
  chatgpt,
  copyPage,
  copyResource,
  type DocsAiIslandAction,
  type DocsAiIslandContentSource,
  type DocsAiIslandController,
  type DocsAiIslandPartName,
  type DocsAiIslandTheme,
  defineConfig,
  defineContentSource,
  markdownSource,
  mountDocsAiIsland,
  openUrl,
  viewMarkdown,
} from "../src/index.ts";

const publicPart: DocsAiIslandPartName = "menu";
void publicPart;

const completeTheme = {
  menuRadius: "14px",
  accent: "rebeccapurple",
  itemHeight: "52px",
  menuPadding: "8px",
  backdropFilter: "blur(16px)",
} satisfies DocsAiIslandTheme;

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
const copyResourceAction: DocsAiIslandAction = copyResource({
  id: "llms-txt",
  label: "Copy llms.txt",
  value: (page) => new URL("/llms.txt", page.canonicalUrl),
});
const openResourceAction: DocsAiIslandAction = openUrl({
  id: "source",
  label: "Source",
  url: "https://github.com/ITZSHOAIB/docs-ai-island",
  closeOnSelect: false,
});

const config = defineConfig({
  visible: (page) => page.url.pathname !== "/internal",
  groups: [
    {
      id: "main",
      actions: [
        chatgpt(),
        action,
        copyAction,
        remoteCopyAction,
        viewMarkdownAction,
        copyResourceAction,
        openResourceAction,
      ],
    },
  ],
  appearance: { placement: "bottom-right", density: "comfortable" },
  theme: completeTheme,
});

const controller: DocsAiIslandController = mountDocsAiIsland(config);
controller.refresh();
controller.update({ pageTitle: "Updated page" });
controller.update({ visible: false });
controller.destroy();
