import {
  chatgpt,
  claude,
  type DocsAiIslandAction,
  type DocsAiIslandAppearance,
  defineConfig,
  mountDocsAiIsland,
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

async function copy(value: string): Promise<void> {
  await navigator.clipboard.writeText(value);
}

const copyPage: DocsAiIslandAction = {
  id: "copy-page",
  label: "Copy page",
  icon: "copy",
  closeOnSelect: false,
  onSelect: async ({ page }) => {
    await copy(`# ${page.title}\n\nSource: ${page.canonicalUrl.href}`);
    showToast("Page context copied");
    return "Page context copied";
  },
};

const markdown: DocsAiIslandAction = {
  id: "markdown",
  label: "Markdown",
  icon: "file",
  closeOnSelect: false,
  onSelect: () => showToast("A Markdown source can be connected here"),
};

const mcp: DocsAiIslandAction = {
  id: "mcp",
  label: "MCP",
  icon: "link",
  closeOnSelect: false,
  onSelect: async () => {
    await copy("https://docs.luma.dev/api/mcp");
    showToast("MCP URL copied");
    return "MCP URL copied";
  },
};

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
      actions: [copyPage, markdown, mcp],
    },
  ],
  onEvent(event) {
    if (event.type === "action-error") showToast("That action is unavailable in this preview");
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
