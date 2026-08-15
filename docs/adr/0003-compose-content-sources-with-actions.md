---
status: proposed
date: 2026-08-15
---

# Compose explicit Content Sources with Actions

## Context

`Copy page for AI` and `View as Markdown` need a machine-readable representation, but documentation frameworks expose original Markdown differently or not at all. Hardcoding a pathname convention would make the framework-neutral core unreliable. A global content service would hide Action dependencies and make multiple representations harder to compose.

## Proposed decision

Model a Content Source as a small abortable capability. Pass it explicitly to built-in Actions. A source can read content; a viewable source additionally resolves a public URL. Provide `defineContentSource()` for custom callbacks and `markdownSource()` for existing URL-backed Markdown.

Make copy failure explicit by default. A canonical-URL fallback is available only when configured. Defer DOM extraction until exact sources, failure semantics, and lifecycle behavior are proven.

## Alternatives

- `config.content` with implicit lookup makes the common example shorter but hides dependencies and couples every Action to one source.
- A `markdownUrl` string on `copyPage()` is simple but duplicates fetching, viewing, cancellation, and error behavior across factories.
- Guessing `pathname + ".md"` is convenient but incorrect across bases, rewrites, generators, and hosts.
- Shipping DOM extraction now broadens scope before source fidelity and bundle cost are understood.

## Consequences if accepted

- Action composition is slightly more verbose but capability availability is honest and type-checkable.
- Framework recipes own URL mapping; the package owns lazy reading and lifecycle behavior.
- Two Actions can share one source and a site can expose multiple sources.
- The first implementation can stay dependency-free and exact-source focused.
- Acceptance requires the vertical TDD plan in `docs/explorations/content-actions/`.
