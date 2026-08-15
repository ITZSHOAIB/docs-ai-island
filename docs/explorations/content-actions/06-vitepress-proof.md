# Phase 6: VitePress content proof

## Goal

Prove that the framework-neutral public primitives work in the existing production VitePress fixture without adding a VitePress adapter.

## Fixture design

- Add explicit static Markdown assets for two fixture routes.
- Configure one `markdownSource()` in the fixture-owned theme bridge.
- Add `copyPage()` and `viewMarkdown()` to the current groups.
- Keep canonical generation, SPA navigation, theme synchronization, and the unrelated support control unchanged.

## TDD cycles

1. RED→GREEN: copy on the getting-started route returns its exact Markdown fixture.
2. RED→GREEN: SPA navigation changes both copied content and the viewed Markdown URL.
3. RED→GREEN: a missing Markdown asset produces accurate failure feedback without a false success.
4. RED→GREEN: the packed-tarball consumer production build still succeeds.

## Exit gate

Workspace and packed VitePress consumers exercise exact copy/view behavior across SPA navigation, and the package still ships no Vue or VitePress dependency.
