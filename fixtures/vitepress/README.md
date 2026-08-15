# VitePress integration fixture

This is a realistic VitePress 1.6 consumer for the framework-neutral package. It intentionally owns the small Vue lifecycle bridge; no Vue or VitePress code ships in `docs-ai-island`.

The fixture proves:

- extension of the default VitePress theme through `layout-bottom`;
- one island instance across client-side route changes;
- explicit `controller.refresh()` after VitePress navigation settles;
- page-level frontmatter opt-out without remounting;
- canonical URL and page-title refresh through the public controller;
- exact Markdown copy/view from fixture-owned static assets across route changes;
- honest failure when a route has no declared Markdown asset;
- synchronization with VitePress light and dark modes;
- coexistence with an unrelated floating support control;
- mobile viewport fit and automated accessibility checks;
- production builds from both the workspace dependency and a packed tarball.

From the repository root:

```sh
pnpm test:fixture:vitepress
pnpm test:fixture:vitepress:pack
```

The bridge lives in [`.vitepress/theme/index.ts`](./.vitepress/theme/index.ts), canonical links are generated in [`.vitepress/config.ts`](./.vitepress/config.ts), explicit Markdown assets live under [`public/content/`](./public/content/guide/getting-started.md), and browser expectations live in [`tests/integration.spec.ts`](./tests/integration.spec.ts).
