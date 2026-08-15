# Content and built-in Actions exploration

Status: active; contract approved and Phase 1 complete

Prepared: 2026-08-15

Scope: `Copy page for AI`, explicit Content Sources, `View as Markdown`, resource Actions, and their browser lifecycle

## Recommendation

Treat a Content Source as an explicit reusable capability passed to the Actions that need it. Do not put framework-specific Markdown guesses in the core and do not make content a hidden global service.

```ts
const markdown = markdownSource({
  url: (page) => new URL(`${page.canonicalUrl.pathname}.md`, page.canonicalUrl),
});

const config = defineConfig({
  groups: [
    { id: "open-in", actions: [chatgpt(), claude()] },
    {
      id: "use-page",
      actions: [
        copyPage({ source: markdown }),
        viewMarkdown({ source: markdown }),
      ],
    },
    {
      id: "resources",
      kind: "utility",
      actions: [
        copyResource({
          id: "mcp",
          label: "Copy MCP URL",
          value: (page) => new URL("/api/mcp", page.canonicalUrl),
        }),
      ],
    },
  ],
});
```

The example is a proposed contract, not implemented API.

## Evidence

The current Vocs implementation at official repository commit `4d36250650f46aaef319c14f74aeea47279dd036`:

- maps each route to a Vocs-owned `/assets/md/...md` path;
- fetches Markdown only after the reader invokes copy;
- copies the exact response body;
- opens the same asset for Markdown viewing;
- only shows the MCP action when MCP is enabled;
- silently copies the page URL when the Markdown request fails.

We should preserve its lazy, exact-source behavior and conditional capabilities. We should replace the Vocs-specific path convention and silent fallback with explicit consumer configuration, abortable work, and accurate status announcements.

The browser clipboard is an asynchronous secure-context boundary and may reject writes. Tests will mock that browser boundary only; package internals remain real. See [MDN Clipboard](https://developer.mozilla.org/en-US/docs/Web/API/Clipboard) and [VitePress routing](https://vitepress.dev/guide/routing).

## Phase map

| Phase | Exploration | Primary exit |
| --- | --- | --- |
| 0 | [`00-contract.md`](./00-contract.md) | Complete: public shape and priority approved |
| 1 | [`01-copy-page.md`](./01-copy-page.md) | Complete: exact Markdown copies lazily through public API |
| 2 | [`02-markdown-source.md`](./02-markdown-source.md) | URL-backed source, failure, and explicit fallback work |
| 3 | [`03-view-markdown.md`](./03-view-markdown.md) | Only an explicit viewable source can open Markdown |
| 4 | [`04-resource-actions.md`](./04-resource-actions.md) | Generic copy/open resource factories work |
| 5 | [`05-lifecycle-and-safety.md`](./05-lifecycle-and-safety.md) | Denial, cancellation, privacy, and cleanup are reliable |
| 6 | [`06-vitepress-proof.md`](./06-vitepress-proof.md) | Packed VitePress consumer exercises real Markdown actions |

Each phase uses vertical TDD: one public behavior test fails, the smallest implementation makes it pass, then the next test is written. No phase begins with a bulk test suite.

## Explicit non-goals

- DOM-to-Markdown extraction in this epic.
- Generating Markdown, `llms.txt`, or MCP resources.
- Automatic discovery of `.md` routes.
- Framework adapters or runtime dependencies.
- Silent content or URL fallback.
