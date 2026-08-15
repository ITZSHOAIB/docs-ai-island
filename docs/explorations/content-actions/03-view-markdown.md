# Phase 3: View as Markdown

## User behavior

A reader can open a declared Markdown representation. The package never invents a Markdown URL from the browser pathname.

## Proposed API

```ts
viewMarkdown({ source: markdown });
```

The TypeScript contract requires a `DocsAiIslandViewableContentSource`. Arbitrary callback-only sources can still support `copyPage()` but cannot be passed to `viewMarkdown()`.

## TDD cycles

1. RED→GREEN: the declaration test rejects a non-viewable source and accepts `markdownSource()`.
2. RED→GREEN: the browser Action opens the independent expected URL with safe external-window features.
3. RED→GREEN: the Action uses the current Page Context after SPA navigation, not the mount-time URL.

## Exit gate

Only explicit, viewable sources produce a Markdown Action, and navigation always uses current canonical context.
