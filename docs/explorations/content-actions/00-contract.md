# Phase 0: public contract

## Question

Where should content resolution live so multiple Actions can share it without coupling the package to a framework?

## Proposed answer

Use a small public capability:

```ts
type DocsAiIslandContent = {
  kind: "markdown" | "text";
  value: string;
  sourceUrl?: URL;
};

type DocsAiIslandContentSource = {
  read(context: {
    page: DocsAiIslandPageContext;
    signal: AbortSignal;
  }): MaybePromise<DocsAiIslandContent>;
};

type DocsAiIslandViewableContentSource = DocsAiIslandContentSource & {
  viewUrl(page: DocsAiIslandPageContext): URL;
};
```

`defineContentSource()` preserves a custom source's type. `markdownSource()` returns a viewable URL-backed source. `copyPage()` accepts any Content Source; `viewMarkdown()` requires a viewable one.

This is preferable to a global `config.content` because dependencies stay visible where Actions are composed, two groups can use different sources, and built-ins remain ordinary Actions.

## Approval checkpoint

Approve these three defaults before RED:

1. explicit source composition rather than hidden global content;
2. copy failure is an error by default, with `fallback: "copy-url"` only when configured;
3. exact Markdown and caller-provided text ship before any DOM extraction.

## Exit gate

The maintainer approves the contract or records requested changes. The proposed ADR can then become accepted.
