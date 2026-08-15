---
status: proposed
---

# Use a framework-neutral browser core

The first release will implement the Island as a framework-neutral browser component with a programmatic API, while framework-specific support begins as installation recipes rather than separate React, Vue, or Astro implementations. This keeps one behavior and accessibility contract across documentation frameworks, avoids forcing a UI runtime on consumers, and lets real integration friction determine which thin Adapters are worth publishing later.

## Considered options

- A React-first component would fit Docusaurus but make VitePress and Astro support wrappers around a foreign runtime.
- Separate framework packages would feel native but multiply behavior, testing, and release work before demand is proven.
- A copy-paste script would be quick to distribute but difficult to version, type, secure, and support.

## Consequences

The browser core must be SSR-safe, handle page lifecycle changes explicitly, expose strong theming hooks, and avoid assuming that raw Markdown exists at a predictable URL. Framework-specific wrappers remain possible without changing the product model.
