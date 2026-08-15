# Route lifecycle and visibility exploration

Status: complete; contract approved and all five phases implemented

Prepared: 2026-08-15

## Goal

Complete the framework-neutral alpha lifecycle without monkeypatching browser history or adding a framework adapter. A site can declare whether the Island belongs on the current page and explicitly refresh it after an SPA navigation settles.

## Public contract

```ts
const island = mountDocsAiIsland({
  visible: (page) => !page.url.pathname.startsWith("/internal/"),
});

island.refresh();
```

`visible` accepts a boolean or a synchronous `PageContext` predicate and defaults to `true`. `refresh()` keeps caller configuration unchanged while re-reading URL, canonical URL, title, visibility, and every dynamic Action value on its next invocation.

The mounted root remains the controller identity while hidden. Hidden state is observable through the native `hidden` attribute and `data-visibility="hidden"`; no Action can begin while hidden.

## Decisions

- Framework recipes own navigation timing and call `refresh()` after their DOM and head metadata settle.
- The core does not patch `history.pushState`, listen to framework-specific events, or poll the page.
- A predicate is the only route-selection primitive. Include/exclude glob APIs are deferred until real integrations demonstrate repeated demand.
- Framework frontmatter opt-out is expressed by closing over framework state in the predicate, then calling `refresh()`.
- Refresh closes a stale open menu, aborts active work, clears feedback, and re-evaluates current context without remounting.

## Vertical TDD phases

### Phase 1: declaration contract

1. RED→GREEN: public declaration usage accepts boolean and predicate visibility plus `controller.refresh()`.
2. Exit: the narrow API is exported without framework types.

### Phase 2: visibility behavior

1. RED→GREEN: a false predicate mounts one hidden, non-interactive Island.
2. RED→GREEN: programmatic `open()` and delegated clicks cannot start while hidden.
3. Exit: hidden state is native, observable, and inert.

### Phase 3: refresh lifecycle

1. RED→GREEN: refresh uses changed URL, canonical URL, and title without replacing the root node.
2. RED→GREEN: refresh closes an open menu and safely releases focus when the route becomes hidden.
3. RED→GREEN: refresh aborts pending content and suppresses late clipboard, announcement, fallback, and event effects.
4. Exit: every result belongs to the post-refresh page context.

### Phase 4: VitePress proof

1. RED→GREEN: route watch calls `refresh()` rather than using an incidental appearance update.
2. RED→GREEN: fixture frontmatter opts one page out and restores the same controller on the next visible route.
3. Exit: the recipe proves explicit lifecycle timing without a VitePress adapter.

### Phase 5: packed plain HTML proof

1. RED→GREEN: a clean fixture installs the tarball, imports JavaScript and CSS through public exports, mounts, refreshes, and completes a production build.
2. Exit: the V1-alpha packed plain-HTML acceptance gate passes.

## Non-goals

- Automatic history interception.
- Route glob parsing or framework route conventions.
- Conditional Actions or groups; custom configuration already composes those.
- Removing and remounting the root for visibility changes.
- Publishing the package.

## Result

The public API now exposes boolean/predicate `visible` and `controller.refresh()`. Hidden roots retain identity through native `hidden` and `data-visibility`, remain closed and inert, and override initial-open requests. Refresh closes stale UI, releases focus, aborts active content, suppresses late effects and fallback, and re-renders current context without remounting.

The VitePress fixture calls `refresh()` after route DOM/head settlement and closes over reactive frontmatter for page opt-out. The plain HTML fixture imports the public JavaScript and typed CSS exports, demonstrates framework-free history navigation, and passes a clean tarball typecheck and production build.
