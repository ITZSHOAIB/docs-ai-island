# Phase 2: URL-backed Markdown Source

## User behavior

A maintainer supplies a function that resolves the current page to an existing Markdown URL. The package fetches it on demand, treats non-success HTTP responses as failure, and never guesses a route.

## Proposed API

```ts
const markdown = markdownSource({
  url: (page) => new URL(`/raw${page.canonicalUrl.pathname}.md`, page.canonicalUrl),
});
```

The helper returns both `read()` and `viewUrl()`. Authenticated or non-HTTP sources use `defineContentSource()` instead.

## TDD cycles

1. RED→GREEN: invoking copy fetches the known URL with the Action's signal and copies the literal response body.
2. RED→GREEN: `404` and network rejection announce failure and emit `action-error`; no clipboard write occurs.
3. RED→GREEN: `fallback: "copy-url"` copies the canonical URL and announces `Page link copied`.
4. RED→GREEN: an empty successful response is valid content unless a later product decision says otherwise.

## Exit gate

Exact Markdown, HTTP failure, network failure, and explicit URL fallback are independently verified through public behavior.
