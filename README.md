# Docs AI Island

A small, framework-neutral AI handoff island for documentation sites. It gives readers a polished place to open the current page in an AI assistant and run page-level actions without requiring a chatbot backend, index, API key, or framework migration.

> **Pilot status:** the public API and styling contract are under active development. Publishing is intentionally disabled until the working-version acceptance gates pass and a release is explicitly approved.

## Try the pilot

```sh
pnpm install
pnpm dev
```

Open `http://127.0.0.1:4173`, then use the **Ask AI** island. The playground consumes the production source and stylesheet; the older `prototype/` folder is only a design record.

## Intended usage

```ts
import { mountDocsAiIsland } from "docs-ai-island";
import "docs-ai-island/styles.css";

mountDocsAiIsland();
```

Zero configuration provides ChatGPT and Claude handoffs using the canonical URL of the current page. Add custom groups for copy, Markdown, MCP, search, support, or any site-specific action:

```ts
import { chatgpt, claude, mountDocsAiIsland } from "docs-ai-island";

const island = mountDocsAiIsland({
  pageTitle: () => document.querySelector("h1")?.textContent ?? document.title,
  groups: [
    {
      id: "assistants",
      actions: [chatgpt(), claude()],
    },
    {
      id: "page-tools",
      kind: "utility",
      actions: [
        {
          id: "copy-link",
          label: "Copy link",
          icon: "copy",
          closeOnSelect: false,
          async onSelect({ page }) {
            await navigator.clipboard.writeText(page.canonicalUrl.href);
            return "Page link copied";
          },
        },
      ],
    },
  ],
});

island.open();
island.update({ appearance: { placement: "bottom-right" } });
island.destroy();
```

### Copy exact page content

Content is an explicit, reusable capability. A custom source can return existing Markdown or text; `markdownSource()` fetches a URL only after the reader invokes the Action:

```ts
import {
  copyPage,
  defineConfig,
  markdownSource,
  mountDocsAiIsland,
  viewMarkdown,
} from "docs-ai-island";

const markdown = markdownSource({
  url: (page) => new URL(`/raw${page.canonicalUrl.pathname}.md`, page.canonicalUrl),
});

mountDocsAiIsland(
  defineConfig({
    groups: [
      {
        id: "page",
        actions: [copyPage({ source: markdown }), viewMarkdown({ source: markdown })],
      },
    ],
  }),
);
```

Non-success and network failures report an Action error and do not copy response bodies. Set `fallback: "copy-url"` on `copyPage()` only when copying the canonical link is an acceptable, explicit fallback.

`viewMarkdown()` accepts only a viewable source such as `markdownSource()`. It opens the source URL in an independent window with `noopener,noreferrer` and resolves dynamic URLs from current page context when selected.

### Add generic resources

Use generic factories for MCP endpoints, `llms.txt`, installation commands, source repositories, or support links. Nothing is inferred or generated:

```ts
import { copyResource, openUrl } from "docs-ai-island";

const resources = [
  copyResource({
    id: "mcp",
    label: "MCP URL",
    value: (page) => new URL("/api/mcp", page.canonicalUrl),
  }),
  openUrl({
    id: "source",
    label: "Source repository",
    url: "https://github.com/ITZSHOAIB/docs-ai-island",
  }),
];
```

Resource values may be literals or functions of current Page Context. URL clipboard values serialize to `href`; `openUrl()` accepts only HTTP(S) destinations.

Async Actions are scoped to one active operation. Starting another Action, updating the controller after navigation, or destroying it aborts pending content work and suppresses stale clipboard, announcement, and event effects. Lifecycle events identify the Action but never include copied content.

## VitePress

The repository includes a production-built VitePress 1.6 fixture that uses the public package API. Extend the default theme, mount the island from the `layout-bottom` slot, and keep the controller alive across client-side navigation:

```ts
// .vitepress/theme/index.ts
import {
  chatgpt,
  claude,
  copyPage,
  markdownSource,
  mountDocsAiIsland,
  viewMarkdown,
} from "docs-ai-island";
import "docs-ai-island/styles.css";
import { type Theme, useData, useRoute } from "vitepress";
import DefaultTheme from "vitepress/theme";
import { h, nextTick, onMounted, onUnmounted, watch } from "vue";

const markdown = markdownSource({
  url: (page) => new URL(`/content${page.url.pathname}.md`, page.url),
});

const DocsAiIslandBridge = {
  setup() {
    const route = useRoute();
    const { isDark } = useData();
    let island: ReturnType<typeof mountDocsAiIsland> | undefined;

    onMounted(() => {
      island = mountDocsAiIsland({
        appearance: { colorScheme: isDark.value ? "dark" : "light" },
        groups: [
          { id: "assistants", actions: [chatgpt(), claude()] },
          {
            id: "page",
            kind: "utility",
            actions: [copyPage({ source: markdown }), viewMarkdown({ source: markdown })],
          },
        ],
        theme: {
          accent: "var(--vp-c-brand-1)",
          fontFamily: "var(--vp-font-family-base)",
        },
      });
    });

    watch([() => route.path, isDark], async () => {
      await nextTick();
      island?.update({
        appearance: { colorScheme: isDark.value ? "dark" : "light" },
      });
    });

    onUnmounted(() => island?.destroy());
    return () => null;
  },
};

export default {
  extends: DefaultTheme,
  Layout: () =>
    h(DefaultTheme.Layout, null, {
      "layout-bottom": () => h(DocsAiIslandBridge),
    }),
} satisfies Theme;
```

The example deliberately maps route paths to fixture-owned public Markdown assets; adapt that explicit mapping to the content pipeline your site already exposes. See the [complete VitePress fixture](./fixtures/vitepress/) for exact copy/view behavior, canonical URL generation, custom actions, host-theme styling, and browser tests. Run it with `pnpm test:fixture:vitepress`; `pnpm test:fixture:vitepress:pack` also installs the packed tarball into a clean copied consumer and runs its production build.

## Customization

The pilot exposes four layers without coupling consumers to internal class names:

- semantic appearance options for placement, density, color scheme, and surface;
- typed theme tokens, applied as scoped `--docs-ai-island-*` custom properties;
- stable `data-part`, state, placement, density, and action attributes;
- replaceable labels, descriptions, icons, actions, and groups.

Styles are never injected by JavaScript. Omit the stylesheet to own the presentation completely.

## Scope

This is a handoff surface, not an embedded chatbot. It does not generate answers, crawl a site, build embeddings, store API keys, or send page content anywhere at mount time. External navigation happens only after a user selects an action.

Project decisions are maintained in the repository:

- [PRD](./docs/PRD.md) for requirements, current scope, and release acceptance;
- [product and implementation plan](./PLAN.md) for research, positioning, risks, and phases;
- [project setup plan](./PROJECT_SETUP_PLAN.md) for tooling, quality gates, and implementation progress;
- [architecture decisions](./docs/adr/) for accepted technical choices;
- [project document index](./docs/) for the maintenance convention.

## License

MIT
