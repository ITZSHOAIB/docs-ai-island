import type {
  DocsAiIslandAction,
  DocsAiIslandActionGroup,
  DocsAiIslandPageContext,
  DocsAiTargetOptions,
} from "../public-types.ts";

function defaultPrompt(page: DocsAiIslandPageContext): string {
  return `Please research and analyze this documentation page so I can ask questions about it: ${page.canonicalUrl.href}`;
}

function resolvePrompt(
  prompt: DocsAiTargetOptions["prompt"],
  page: DocsAiIslandPageContext,
): string {
  if (typeof prompt === "function") return prompt(page);
  return prompt ?? defaultPrompt(page);
}

function openTarget(url: URL): void {
  window.open(url, "_blank", "noopener,noreferrer");
}

export function chatgpt(options: DocsAiTargetOptions = {}): DocsAiIslandAction {
  return {
    id: "chatgpt",
    label: options.label ?? "ChatGPT",
    description: options.description ?? "Research and ask follow-ups",
    icon: "chatgpt",
    closeOnSelect: true,
    onSelect: ({ page }) => {
      const url = new URL("https://chatgpt.com/");
      url.searchParams.set("hints", "search");
      url.searchParams.set("q", resolvePrompt(options.prompt, page));
      openTarget(url);
    },
  };
}

export function claude(options: DocsAiTargetOptions = {}): DocsAiIslandAction {
  return {
    id: "claude",
    label: options.label ?? "Claude",
    description: options.description ?? "Continue with this page",
    icon: "claude",
    closeOnSelect: true,
    onSelect: ({ page }) => {
      const url = new URL("https://claude.ai/new");
      url.searchParams.set("q", resolvePrompt(options.prompt, page));
      openTarget(url);
    },
  };
}

export const defaultGroups = (): readonly DocsAiIslandActionGroup[] => [
  {
    id: "ai-targets",
    kind: "primary",
    actions: [chatgpt(), claude()],
  },
];
