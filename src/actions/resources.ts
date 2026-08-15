import type {
  DocsAiCopyResourceOptions,
  DocsAiIslandAction,
  DocsAiOpenUrlOptions,
} from "../public-types.ts";

export function copyResource(options: DocsAiCopyResourceOptions): DocsAiIslandAction {
  return {
    id: options.id,
    label: options.label,
    ...(options.description === undefined ? {} : { description: options.description }),
    icon: options.icon ?? "copy",
    closeOnSelect: options.closeOnSelect ?? false,
    async onSelect({ clipboard, page }) {
      const value = typeof options.value === "function" ? await options.value(page) : options.value;
      await clipboard.writeText(value instanceof URL ? value.href : value);
      return `${options.label} copied`;
    },
  };
}

export function openUrl(options: DocsAiOpenUrlOptions): DocsAiIslandAction {
  return {
    id: options.id,
    label: options.label,
    ...(options.description === undefined ? {} : { description: options.description }),
    icon: options.icon ?? "external",
    closeOnSelect: options.closeOnSelect ?? true,
    async onSelect({ page }) {
      const value = typeof options.url === "function" ? await options.url(page) : options.url;
      const url = new URL(value instanceof URL ? value.href : value, page.canonicalUrl);
      if (url.protocol !== "http:" && url.protocol !== "https:") {
        throw new TypeError(`Unsupported URL protocol: ${url.protocol}`);
      }
      window.open(url, "_blank", "noopener,noreferrer");
    },
  };
}
