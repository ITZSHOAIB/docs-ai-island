---
status: accepted
date: 2026-08-15
---

# Use explicit refresh and predicate visibility

## Context

Single-page documentation frameworks update the URL, canonical metadata, title, and page-specific configuration on different lifecycle schedules. A framework-neutral package cannot reliably infer when all of those values have settled. Monkeypatching browser history misses framework events and conflicts with routers; polling adds permanent work and still cannot identify semantic readiness.

Documentation sites also need to omit the Island from selected pages. Built-in route globs would duplicate router semantics and expand a small configuration surface before multiple integrations demonstrate a shared convention.

## Decision

Expose `controller.refresh()` as the explicit lifecycle seam. Refresh preserves the controller and configuration, aborts stale work, closes stale UI, and re-renders against current page context.

Expose `config.visible` as a boolean or synchronous `PageContext` predicate. Keep the mounted root while hidden and use native `hidden` plus a stable visibility data attribute. Framework recipes may close over reactive frontmatter in the predicate and invoke `refresh()` after navigation settles.

## Alternatives

- Patch `history.pushState` and `replaceState`: misses non-history lifecycle work, creates global side effects, and still runs before framework head updates may settle.
- Listen to a fixed set of router events: makes the core framework-aware and incomplete by construction.
- Accept include/exclude globs: convenient for simple paths but duplicates base, locale, version, and router matching semantics.
- Require destroy/remount on every route: loses stable controller identity, increases framework code, and risks listener or focus churn.
- Hide only through consumer CSS: leaves Actions programmatically active and cannot coordinate cancellation or accessibility state.

## Consequences

- Integrations contain one explicit lifecycle call at a framework-owned readiness point.
- The core remains dependency-free, deterministic, and SSR-safe.
- Visibility can express arbitrary route logic without growing configuration flags.
- Hidden roots remain stable for later reactivation but must suppress open and Action execution.
- Acceptance is defined by the vertical tests in `docs/explorations/route-lifecycle/`.
