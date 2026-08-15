import type {
  DocsAiCopyPageOptions,
  DocsAiIslandAction,
  DocsAiIslandContentSource,
} from "../public-types.ts";

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
      const content = await options.source.read({ page, signal });
      await clipboard.writeText(content.value);
      return content.kind === "markdown" ? "Markdown copied" : "Page content copied";
    },
  };
}
