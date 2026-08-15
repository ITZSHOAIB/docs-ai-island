import {
  chatgpt,
  type DocsAiIslandAction,
  type DocsAiIslandController,
  defineConfig,
  mountDocsAiIsland,
} from "../src/index.ts";

const action: DocsAiIslandAction = {
  id: "search",
  label: "Search docs",
  onSelect({ page }) {
    return page.canonicalUrl.href;
  },
};

const config = defineConfig({
  groups: [{ id: "main", actions: [chatgpt(), action] }],
  appearance: { placement: "bottom-right", density: "comfortable" },
  theme: { menuRadius: "14px", accent: "rebeccapurple" },
});

const controller: DocsAiIslandController = mountDocsAiIsland(config);
controller.update({ pageTitle: "Updated page" });
controller.destroy();
