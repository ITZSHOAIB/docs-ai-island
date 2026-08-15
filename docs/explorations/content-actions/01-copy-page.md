# Phase 1: Copy page tracer bullet

## User behavior

A reader invokes `Copy page for AI`; the configured source resolves only then, exact Markdown reaches the clipboard, the menu stays open, and the live region identifies what was copied.

## TDD cycles

1. RED: a Playwright test mounts through the public API, clicks the Action, and expects the independent literal `# Exact source\n\nKeep **formatting**.` at the clipboard boundary.
2. GREEN: add the smallest Content Source contract, clipboard context, and `copyPage()` factory to pass.
3. RED: mounting and opening the Island must not read the source.
4. GREEN: keep resolution inside `onSelect` and pass the active abort signal.
5. RED: the declaration test composes a custom Markdown source and `copyPage()` without internal imports.
6. GREEN: export the minimal public types and factories.

## Test boundary

Only `navigator.clipboard` is replaced because it is a browser/system boundary. The mounted Island, controller, Action, Content Source, event handling, and rendered feedback remain real.

## Exit gate

The public browser flow copies exact configured Markdown lazily, reports `Markdown copied`, stays open, and passes type/package/size gates.
