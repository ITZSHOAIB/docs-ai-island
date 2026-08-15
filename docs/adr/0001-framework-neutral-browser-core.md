---
status: accepted
date: 2026-08-15
---

# Use a framework-neutral browser core

The pilot implements the Island as a framework-neutral browser component with a programmatic API. Framework-specific support begins as installation recipes and production fixtures rather than separate React, Vue, or Astro implementations. This keeps one behavior and accessibility contract across documentation frameworks, avoids forcing a UI runtime on consumers, and lets real integration friction determine which thin adapters are worth publishing later.

## Considered options

- A React-first component would fit Docusaurus but make VitePress and Astro support wrappers around a foreign runtime.
- Separate framework packages would feel native but multiply behavior, testing, and release work before demand is proven.
- A copy-paste script would be quick to distribute but difficult to version, type, secure, and support.

## Consequences

The browser core is SSR-safe, exposes an imperative mount/controller lifecycle and strong theming hooks, and avoids assuming that raw Markdown exists at a predictable URL. SPA lifecycle recipes and framework fixtures remain release work. Framework-specific wrappers remain possible without changing the product model, but require evidence from at least two integrations repeating the same non-trivial bridge.
