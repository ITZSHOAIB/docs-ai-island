import type {
  DocsAiCopyPageOptions,
  DocsAiIslandAction,
  DocsAiIslandContent,
  DocsAiIslandContentSource,
  DocsAiIslandPageContext,
  DocsAiIslandViewableContentSource,
  DocsAiMarkdownSourceOptions,
  DocsAiViewMarkdownOptions,
} from "../public-types.ts";

function resolveMarkdownUrl(
  value: DocsAiMarkdownSourceOptions["url"],
  page: DocsAiIslandPageContext,
): URL {
  const resolved = typeof value === "function" ? value(page) : value;
  return new URL(resolved instanceof URL ? resolved.href : resolved, page.canonicalUrl);
}

export function defineContentSource<const Source extends DocsAiIslandContentSource>(
  source: Source,
): Source {
  return source;
}

export function copyPage(options: DocsAiCopyPageOptions): DocsAiIslandAction {
  return {
    id: "copy-page",
    label: options.label ?? "Copy page for AI",
    description: options.description ?? "Copy the source content",
    icon: "copy",
    closeOnSelect: false,
    async onSelect({ clipboard, page, signal }) {
      let content: DocsAiIslandContent;
      try {
        content = await options.source.read({ page, signal });
      } catch (error) {
        if (signal.aborted) throw error;
        if (options.fallback !== "copy-url") throw error;
        await clipboard.writeText(page.canonicalUrl.href);
        return "Page link copied";
      }
      signal.throwIfAborted();
      await clipboard.writeText(content.value);
      return content.kind === "markdown" ? "Markdown copied" : "Page content copied";
    },
  };
}

export function markdownSource(
  options: DocsAiMarkdownSourceOptions,
): DocsAiIslandViewableContentSource {
  return {
    viewUrl: (page) => resolveMarkdownUrl(options.url, page),
    async read({ page, signal }) {
      const sourceUrl = resolveMarkdownUrl(options.url, page);
      const response = await fetch(sourceUrl, { signal });
      if (!response.ok) {
        throw new TypeError(`Markdown request failed with status ${response.status}`);
      }
      return { kind: "markdown", value: await response.text(), sourceUrl };
    },
  };
}

export function viewMarkdown(options: DocsAiViewMarkdownOptions): DocsAiIslandAction {
  return {
    id: "view-markdown",
    label: options.label ?? "View as Markdown",
    description: options.description ?? "Open the source Markdown",
    icon: "file",
    onSelect({ page }) {
      window.open(options.source.viewUrl(page), "_blank", "noopener,noreferrer");
    },
  };
}
