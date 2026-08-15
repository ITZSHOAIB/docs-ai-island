# Docs AI Island: Product and Implementation Plan

Status: pilot vertical slice implemented; V1 planning active
Research snapshot: 2026-08-14
Last implementation reconciliation: 2026-08-15
Package: `docs-ai-island`

Repository structure, tooling, quality gates, and implementation sequencing are specified in [`PROJECT_SETUP_PLAN.md`](./PROJECT_SETUP_PLAN.md).

## Decision summary

Build and release one narrowly scoped package: a configurable, backend-free documentation Island inspired by Vocs' Ask AI menu.

The first release will:

- float above a documentation page without changing the site's layout;
- open the current page in external AI applications;
- copy the current page in agent-friendly form;
- open an available Markdown representation;
- copy optional resources such as an MCP endpoint;
- accept custom Actions, labels, prompts, visibility rules, and styling;
- work on static sites and avoid API keys, indexing, embeddings, hosted services, or an AI backend;
- use one framework-neutral browser core, with installation recipes for VitePress, Starlight/Astro, and Docusaurus.

This is a **handoff Island**, not an embedded chatbot. That distinction should remain explicit in the package description, documentation, UI copy, and types.

## Current implementation snapshot

The first production pilot is implemented and committed. It includes the framework-neutral SSR-safe core, controller lifecycle, zero-config ChatGPT and Claude targets, custom action groups, typed events, the Quiet Glass UI, external cascade-layered CSS, theme tokens, stable DOM parts, a Vite playground, and unit/type/package/size/accessibility/browser/visual checks.

The first framework proof is also implemented: a realistic VitePress 1.6 production fixture mounts from the default theme's `layout-bottom` slot, refreshes through the controller on SPA navigation, follows VitePress light/dark state, resolves explicit canonical URLs, coexists with another floating control, and passes mobile and axe checks. A second clean consumer installs the packed tarball and completes a VitePress production build.

The pilot does **not** yet include route visibility, packaged automatic SPA adapters, the remaining Starlight/Astro and Docusaurus fixtures, the Vocs documentation site, or a published npm release. Those remain V1 work and must not be described as shipped.

Publishing is intentionally disabled during development. CI validates pushes to `main`, but no GitHub Actions workflow may invoke `npm publish` or `changeset publish` until the working-version acceptance gates pass and the maintainer explicitly approves enabling releases.

Canonical requirements and acceptance status live in [`docs/PRD.md`](./docs/PRD.md). Durable technical choices live in [`docs/adr/`](./docs/adr/).

The content-Action epic is active. [`docs/explorations/content-actions/`](./docs/explorations/content-actions/) splits explicit Content Sources, copy-page, Markdown viewing, generic resource Actions, lifecycle hardening, and VitePress proof into six vertical phases. ADR 0003 is accepted. Phases 1–5 now ship lazy custom/URL sources, `copyPage()`, honest HTTP/network failure, opt-in canonical-URL fallback, `viewMarkdown()` with action-time Page Context, generic copy/open resource Actions, and operation-scoped cancellation and event privacy.

## Naming validation

Use **Docs AI Island** as the product name and `docs-ai-island` as the npm package and repository slug for the island-only release.

Live checks on 2026-08-15 found:

- the exact npm package returned `E404` and was therefore unclaimed at check time;
- GitHub repository search returned no exact-name repository;
- the intended `ITZSHOAIB/docs-ai-island` repository path returned `404` before creation;
- a general web search found no established developer product using the exact compound name.

Product verdict: keep the name. It is clear, searchable by the relevant concepts, consistent with the UI's island architecture, and honest about the narrow package scope. The trade-off is that all three words are descriptive, `AI Island` has unrelated uses, and the name would be restrictive if the project later became a broad agent-support suite. If that broader product is ever pursued, retain `docs-ai-island` as this package and choose a separate umbrella name.

Availability checks are time-sensitive and do not reserve a name. Recheck npm and GitHub immediately before publishing or creating the remote. This research is not a trademark clearance; obtain appropriate legal review before investing materially in a protected commercial brand.

## Why this is worth building

Vocs demonstrates a useful low-infrastructure interaction: its menu opens the page in ChatGPT or Claude, copies page Markdown, opens the Markdown asset, and conditionally copies an MCP URL. Its implementation also accounts for static-build Markdown paths, mobile deep links, page-level visibility, clipboard fallback, and `Cmd/Ctrl+I`.

Other ecosystems now have overlapping capabilities, but they are fragmented:

| Ecosystem | Current capability | Gap the Island can fill |
| --- | --- | --- |
| VitePress | Algolia DocSearch supports a real Ask AI experience, including a side panel. | It needs an Algolia assistant/index configuration. A backend-free handoff menu is a different, lighter product. |
| Docusaurus | Algolia Ask AI is supported through theme configuration. | The same hosted-index/assistant requirement applies; page handoff actions are not a standalone primitive. |
| Starlight | Community plugins separately offer copy-page, Markdown routes, and hosted AI chat. | A single composable Island can bring these resources together without selecting a chat vendor. |
| Hosted documentation platforms | Products such as Fern offer rich page-action menus. | Existing VitePress, Starlight, Docusaurus, and custom Astro users should not need to migrate platforms to get the interaction. |

The opportunity is therefore **not** “add AI chat everywhere.” It is:

> Give any documentation site a polished, accessible, vendor-neutral handoff surface that composes with the machine-readable resources the site already has.

This positioning avoids competing directly with Algolia, Inkeep, Kapa, Biel, or other retrieval/chat products. Those can themselves be configured as custom Actions or future AI Targets.

## V1 product boundary

### Included

- One Island UI with responsive menu/sheet behavior.
- Built-in ChatGPT and Claude AI Targets.
- Built-in `copy-page`, `view-markdown`, `copy-resource`, and `open-url` Actions.
- Arbitrary custom Actions.
- Page Context resolution from the browser with an override API.
- Multiple Content Source strategies with explicit fallback behavior.
- Route inclusion/exclusion and page-level opt-out.
- Automatic light/dark appearance plus CSS customization.
- Keyboard, screen-reader, reduced-motion, RTL, and touch support.
- Navigation refresh support for MPA and SPA documentation sites.
- Framework installation recipes and tested fixture sites.
- No telemetry by default; observable lifecycle events for user-owned analytics.

### Deliberately excluded

- Answer generation, streaming chat, conversation history, or RAG.
- Crawling, indexing, embeddings, vector databases, or search.
- Generating `llms.txt`, Markdown twins, or an MCP server.
- Storing API keys or proxying LLM requests.
- A dashboard, SaaS service, or analytics backend.
- Framework-specific adapter packages in the first release.
- Automatic mutation of a consumer's project files.
- Copying private/authenticated page content to a third party without a direct user action.

These exclusions are the reason the first release can stay small, static-hosting friendly, and trustworthy.

## Core experience

### Default desktop presentation

- A bottom-center, fixed Island with a compact rounded trigger.
- Trigger label: **Ask AI**.
- A subtle sparkle or handoff icon; no animated “AI glow.”
- No global keyboard shortcut by default. Documentation sites commonly reserve `Cmd/Ctrl+K`, and VitePress/Algolia Ask AI can reserve `Cmd/Ctrl+I`. A shortcut is configurable and only displayed when enabled.
- Activating the trigger opens a menu upward, grouped by intent.

Default menu:

```text
Open in
  ChatGPT
  Claude

Use this page
  Copy page for AI
  View as Markdown

Resources (only when configured)
  Copy MCP URL
```

### Mobile presentation

- The trigger respects `env(safe-area-inset-bottom)`.
- The menu becomes a compact bottom sheet when space is constrained.
- Tap targets are at least 44 by 44 CSS pixels.
- Opening an AI Target uses the same-tab mobile navigation needed for Universal/App Links; desktop opens a new tab.

### Interaction rules

- Escape closes the menu and restores focus to the trigger.
- Arrow keys move through menu items; Home/End jump to boundaries.
- Tab follows normal browser order and does not become trapped.
- Disabled Actions explain why when practical; unavailable Actions should normally be omitted.
- Copy Actions announce success or failure through a polite live region without changing the menu's geometry.
- The menu closes after an external handoff and remains open after a copy so success is perceivable.
- Animations honor `prefers-reduced-motion`.
- Route changes close stale menus and refresh Page Context before the next Action.

## Visual direction

The Island should feel native to the host documentation site rather than impose a branded chatbot widget.

Defaults:

- neutral surface, one inherited accent color, restrained shadow and border;
- system/documentation font inheritance;
- compact 40–44px trigger height on desktop;
- readable 14px menu labels;
- automatic contrast in light and dark color schemes;
- no provider brand colors except optional monochrome provider marks;
- placement variants: `bottom-center`, `bottom-left`, and `bottom-right`;
- a high configurable z-index, but no assumption that the Island is the only floating widget.

Customization layers, from safest to most powerful:

1. semantic appearance options such as placement and density;
2. documented CSS custom properties for color, radius, spacing, offset, shadow, and z-index;
3. stable data attributes/classes for targeted overrides;
4. a headless action engine as a later extraction only if consumers need fully custom rendering.

The initial spike should compare light DOM with externally imported, cascade-layered CSS against open Shadow DOM. The current recommendation is **light DOM plus strongly prefixed selectors** because it is easier to theme, works with strict external-style CSP policies, and inherits host typography naturally. The trade-off is weaker style isolation, which fixture testing must address before this becomes an accepted decision.

## Configuration principles

The API should follow four rules:

1. **Useful with minimal configuration.** Opening a public canonical page in an AI Target should work without a Markdown endpoint.
2. **Capabilities appear only when backed by data.** `View as Markdown` should not guess that `pathname + '.md'` exists unless a preset or Content Source declares it.
3. **Composition over flags.** Consumers control order and grouping through Action definitions rather than an expanding list of unrelated booleans.
4. **Escape hatches are typed.** Dynamic context, visibility, prompts, URLs, and custom behavior use functions receiving a stable Page Context.

### Proposed minimal setup

```ts
import { mountDocsAiIsland } from 'docs-ai-island'
import 'docs-ai-island/styles.css'

mountDocsAiIsland()
```

With no options, this renders `Open in ChatGPT` and `Open in Claude` using the canonical page URL. It does not pretend a Markdown or MCP resource exists.

### Proposed typical setup

```ts
import {
  chatgpt,
  claude,
  copyPage,
  copyResource,
  defineConfig,
  mountDocsAiIsland,
  viewMarkdown,
} from 'docs-ai-island'
import 'docs-ai-island/styles.css'

const config = defineConfig({
  content: {
    markdownUrl: ({ canonicalUrl }) =>
      new URL(`${canonicalUrl.pathname.replace(/\/$/, '')}.md`, canonicalUrl),
    fallback: { type: 'document', selector: 'main article' },
  },
  groups: [
    {
      label: 'Open in',
      actions: [chatgpt(), claude()],
    },
    {
      label: 'Use this page',
      actions: [copyPage(), viewMarkdown()],
    },
    {
      label: 'Resources',
      actions: [
        copyResource({
          id: 'mcp',
          label: 'Copy MCP URL',
          value: ({ canonicalUrl }) => new URL('/api/mcp', canonicalUrl),
        }),
      ],
    },
  ],
  appearance: {
    placement: 'bottom-center',
    accent: 'var(--sl-color-accent)',
  },
})

mountDocsAiIsland(config)
```

The example describes the intended ergonomics, not a frozen API. A working spike must test it in all fixture sites before names are finalized.

## Proposed public model

```ts
type PageContext = {
  url: URL
  canonicalUrl: URL
  pathname: string
  title?: string
  description?: string
  language?: string
  direction?: 'ltr' | 'rtl'
  locale?: string
  version?: string
  metadata: Readonly<Record<string, unknown>>
}

type ContentResult = {
  kind: 'markdown' | 'text'
  value: string
  sourceUrl?: URL
}

type ActionContext = {
  page: PageContext
  content: () => Promise<ContentResult>
  clipboard: { writeText(value: string): Promise<void> }
  close(): void
  announce(message: string): void
}

type IslandAction = {
  id: string
  label: string | ((page: PageContext) => string)
  icon?: BuiltInIcon | (() => Node)
  visible?: boolean | ((page: PageContext) => boolean | Promise<boolean>)
  disabled?: boolean | ((page: PageContext) => boolean | Promise<boolean>)
  run(context: ActionContext): void | Promise<void>
}

type ActionGroup = {
  id?: string
  label?: string
  actions: IslandAction[]
}
```

Important boundaries:

- `PageContext` contains identity and metadata, never raw page content.
- Raw content is lazy and fetched only when an Action requests it.
- `AI Target` helpers produce ordinary Actions; they are not privileged plugin types.
- The core never imports a provider SDK.
- Custom icons return DOM nodes rather than accepting unsanitized HTML strings.
- Config callbacks may be asynchronous where route metadata or content requires it.

## Page Context resolution

The default resolver should read:

1. `<link rel="canonical">`, falling back to `window.location.href`;
2. `document.title`;
3. description metadata;
4. `<html lang>` and `<html dir>`;
5. optional page metadata embedded by an Adapter.

Consumers can replace or extend the resolver:

```ts
page: {
  resolve(defaults) {
    return {
      ...defaults,
      version: document.documentElement.dataset.docsVersion,
    }
  },
  include: ['/guide/**', '/reference/**'],
  exclude: ['/search', '/404'],
}
```

Visibility precedence should be predictable:

1. explicit per-page opt-out;
2. `exclude` rules;
3. `include` rules;
4. global `enabled` value;
5. visible by default.

For generic HTML, support a declarative opt-out such as:

```html
<meta name="docs-ai-island" content="off">
```

Adapters can map framework frontmatter such as `docsAiIsland: false` into the same result without making the core aware of frontmatter.

## Content Source pipeline

Raw Markdown is the largest cross-framework difference. The Island must not hardcode Vocs' `.md` convention as a universal truth.

Resolution order:

1. a consumer-provided `getContent(page)` callback;
2. a configured `markdownUrl(page)` fetched on demand;
3. framework metadata supplied by an Adapter;
4. an optional document extraction fallback;
5. a clear failure state or configured `copy-url` fallback.

### Document fallback

When enabled, the fallback should:

- extract only from a configured selector, with sensible framework presets;
- remove navigation, hidden controls, copy buttons, anchors, and the Island itself;
- preserve headings, paragraphs, lists, links, tables, and fenced code blocks;
- convert lazily so the conversion dependency is not in the initial page chunk;
- label the result as extracted content rather than original Markdown;
- never execute embedded scripts or send extracted content over the network.

This fallback makes `Copy page for AI` useful on existing sites, but it cannot promise source-equivalent MDX. Documentation must say so explicitly.

### Failure behavior

Failures should be configurable:

- `error`: announce that page content is unavailable;
- `copy-url`: copy the canonical URL and announce the fallback;
- custom callback: let the site report or recover.

Silent fallback is prohibited because “Copied!” must accurately describe what was copied.

## Built-in Actions

### Open in AI Target

Configuration:

- stable target ID;
- label and icon;
- URL builder;
- prompt builder;
- mobile navigation policy;
- optional maximum URL length check.

The default prompt should pass the canonical public URL and ask the target to read it before answering questions. It should not put the entire page into a query string. Target URL formats are external contracts and need integration tests plus easy overrides.

Initial Targets:

- ChatGPT;
- Claude.

Candidates after evidence:

- Perplexity;
- Gemini, if a reliable prompt-deep-link contract exists;
- Cursor/VS Code or agent CLIs through copyable commands;
- a user-owned hosted chatbot URL.

### Copy page for AI

- Resolve content lazily.
- Copy exact Markdown when available.
- Otherwise use the explicitly enabled document fallback.
- Announce whether Markdown, extracted text, or URL was copied.
- Keep the menu open after completion.

### View as Markdown

- Visible only when a Content Source exposes a viewable URL.
- Open the configured URL; do not synthesize an object URL for large content unless explicitly enabled.

### Copy resource

A generic built-in for MCP URLs, `llms.txt`, installation commands, or source links. The core should not treat MCP as mandatory or infer that an endpoint exists.

### Custom Action

Custom Actions receive `ActionContext` and can open URLs, copy text, dispatch an integration event, or call user-owned logic. Errors are caught at the Island boundary and reported through the configured error hook.

## Appearance configuration

Semantic options:

```ts
appearance: {
  placement: 'bottom-center' | 'bottom-left' | 'bottom-right',
  density: 'compact' | 'comfortable',
  colorScheme: 'auto' | 'light' | 'dark',
  accent?: string,
  offset?: { block?: string, inline?: string },
  zIndex?: number,
  mobile?: 'sheet' | 'menu',
}
```

CSS custom properties should cover at least:

```css
--docs-ai-island-accent
--docs-ai-island-bg
--docs-ai-island-fg
--docs-ai-island-muted
--docs-ai-island-border
--docs-ai-island-radius
--docs-ai-island-shadow
--docs-ai-island-offset-block
--docs-ai-island-offset-inline
--docs-ai-island-z-index
```

Styles ship in a named cascade layer so consumers can override them intentionally. Selectors must be prefixed, low-specificity, and documented as either stable or internal.

## Text, localization, and icons

- All user-visible strings live in a `messages` object.
- English ships first; consumers can replace every string without rebuilding.
- Direction defaults from Page Context.
- Provider names remain proper nouns; status messages are localizable.
- Built-in icons are small inline SVG definitions with `aria-hidden="true"`.
- A text-only mode remains usable if icons are disabled.
- Do not fetch icons, fonts, or other assets from a CDN.

## Events and analytics

The package performs no tracking. It emits sanitized lifecycle events and accepts callbacks:

```ts
onEvent(event) {
  // { type: 'action:start' | 'action:success' | 'action:error', actionId, pagePath }
}
```

Events must not contain raw page content, clipboard values, prompts, or full URLs with query parameters by default. This allows PostHog, Plausible, or a custom analytics system to measure use without coupling the package to one vendor.

## Framework integration strategy

V1 publishes recipes and fixture-tested helper code, not separate adapter packages. Extract an Adapter only after at least two real sites need the same non-trivial bridge.

### Plain HTML and static generators

- Import the ESM entry and external stylesheet.
- Call `mountDocsAiIsland()` once near the end of `<body>`.
- Traditional navigation naturally recreates the Island with fresh Page Context.

### VitePress

Mount from a wrapper around the default theme `Layout`, using the always-available `layout-bottom` slot. A small Vue bridge watches the current route and updates the Island after SPA navigation. `useData()` supplies frontmatter and page metadata.

The recipe must coexist with existing custom themes and avoid taking ownership of the entire VitePress theme object. It must document that VitePress' Algolia Ask AI can already use `Cmd/Ctrl+I`; the Island shortcut should remain disabled or be changed when both exist.

### Starlight

Start with a Starlight plugin recipe using `config:setup` and a low-risk component override that composes the default component rather than replacing page layout. The Astro component mounts the Island and exposes Starlight route metadata. It listens for `astro:page-load` so it remains correct when Astro client-side navigation is enabled.

The Content Source should compose with existing plugins such as `starlight-md-txt` rather than duplicate their generation behavior. The document fallback can target Starlight's main content when no Markdown route exists.

### Generic Astro

Offer two recipes:

- a reusable `.astro` component placed in the user's shared layout;
- an Astro integration that injects the client entry only when the user explicitly wants global mounting.

Because arbitrary Astro sites do not share a layout contract, the component recipe is the dependable path. The integration must support ordinary MPA loads and `astro:page-load`.

### Docusaurus

Mount from a small theme package/recipe that renders the Island above the React tree through Docusaurus' stable `Root` customization point. Use Docusaurus location and docs metadata to update Page Context across SPA navigation.

Prefer wrapping/stable theme extension over ejecting internal docs components. Do not require users to maintain a large swizzled component.

## Architecture

Proposed repository shape after the planning phase:

```text
docs-ai-island/
  src/
    actions/
    content/
    context/
    element/
    events/
    index.ts
    styles.css
  tests/
    unit/
    browser/
    fixtures/
      html/
      vitepress/
      starlight/
      docusaurus/
  examples/
  docs/
    adr/
  CONTEXT.md
  PLAN.md
  README.md
  package.json
```

Internal boundaries:

```text
Framework/page lifecycle
        │
        ▼
  Page Context resolver ─────► Content Source (lazy)
        │                            │
        ▼                            ▼
      Island UI ─────────────► Action execution
        │                            │
        └──────── lifecycle events ◄─┘
```

Rules:

- importing the package on the server must not read `window` or `document`;
- browser globals are accessed only during mount or Action execution;
- content conversion is lazy-loaded;
- core behavior has no React, Vue, Astro, VitePress, or Docusaurus runtime dependency;
- external Targets are configuration, not dependencies;
- no network request occurs merely because the Island rendered;
- the package ships ESM, declarations, source maps, and an explicit export map;
- modern browser output first; document the support floor before beta.

## Accessibility release contract

Before release, verify:

- correct button, menu, group, and menu-item semantics;
- accessible names without relying on icons;
- focus entry, movement, closing, and restoration;
- screen-reader announcements for asynchronous results;
- touch target size and safe-area behavior;
- 200% zoom and reflow at 320 CSS pixels;
- contrast in automatic, forced-colors, light, and dark modes;
- reduced motion;
- LTR and RTL placement/menu navigation;
- no keyboard collision unless the user explicitly enables a shortcut;
- the Island does not cover focused page content or critical mobile controls.

Automated checks help, but keyboard and screen-reader smoke tests are release gates.

## Security and privacy contract

- Sanitize/validate configured URLs and allow only expected schemes by default.
- Never accept executable HTML for labels or icons.
- Do not use `innerHTML` with consumer-controlled values.
- Open external pages with safe opener behavior.
- Do not read page content until an Action needs it.
- Do not send page content anywhere automatically.
- Make the external handoff clear in labels and documentation.
- Keep clipboard errors recoverable; browsers may deny permissions outside a trusted click.
- Ship external CSS and no `eval`, remote scripts, remote styles, or inline event attributes.
- Test under a strict CSP fixture.
- Treat private documentation as a first-class scenario: the URL handoff may be inaccessible to an external Target, and document extraction may contain sensitive content.

## Performance budget

Initial targets, to validate during the spike:

- core ESM plus UI: at most 12 kB Brotli;
- CSS: at most 4 kB Brotli;
- zero framework runtime bundled;
- zero network requests before a user activates an Action;
- document-to-Markdown conversion in a separate lazy chunk;
- no layout shift when the Island mounts;
- interactive within one animation frame after its module evaluates on a normal docs page.

If accessible menu behavior cannot meet the budget without a dependency, accessibility wins and the budget is revised transparently.

## Test strategy

### Unit tests

- canonical URL and Page Context resolution;
- route matching and visibility precedence;
- prompt and Target URL construction;
- content strategy ordering and failure modes;
- action visibility/disabled evaluation;
- event sanitization;
- URL scheme validation;
- localization fallbacks.

### Browser component tests

- mouse, touch, and full keyboard behavior;
- focus restoration and live announcements;
- clipboard success/denial;
- menu/sheet responsive switch;
- light/dark/forced-colors/reduced-motion;
- LTR/RTL;
- SPA route refresh and stale async Action cancellation;
- multiple mount attempts produce one Island;
- cleanup removes listeners and DOM.

### Framework fixtures

For plain HTML, VitePress, Starlight, and Docusaurus:

- development build starts;
- production/SSR build succeeds;
- Island renders on eligible pages and hides on excluded pages;
- route changes update title, URL, content, locale, and version;
- `Copy page for AI` copies the expected representation;
- host theme CSS does not break layout;
- strict CSP fixture works;
- mobile viewport does not collide with framework navigation.

### Quality gates

- strict TypeScript;
- lint and format checks;
- unit and browser tests;
- fixture production builds;
- accessibility scan plus manual keyboard test;
- package provenance/content inspection;
- Brotli budget report;
- README installation snippets tested from a clean directory.

## Delivery phases

### Phase 0 — resolve the initial design questions — substantially complete

The throwaway browser prototype selected Option A (Quiet Glass III), the `Ask AI` trigger, restrained action grouping, and host-friendly visual inheritance. The production pilot accepted Light DOM with external CSS and an anchored responsive menu. Remaining investigation:

- whether document extraction produces acceptable output in three real docs pages.

Light DOM with external, cascade-layered CSS is the implementation recommendation. Revisit it only if hostile-CSS fixture testing shows that prefixing and low-specificity layers are insufficient.

Exit gate status: visual and mobile behavior selected; content fallback direction remains open.

### Phase 1 — framework-neutral alpha — in progress

- initialize package, tooling, license, contribution files, and CI;
- implement Page Context, Content Source, Action, and event contracts;
- implement the Island and default ChatGPT/Claude Actions;
- implement copy/view/resource Actions;
- implement appearance, messages, visibility, cleanup, and navigation refresh;
- build the plain HTML fixture and browser tests.

Exit gate: a static site can install the package, configure Actions, and pass accessibility/browser tests without a framework runtime.

Progress: the repository foundation, controller, page URL/title context, default AI targets, custom actions, appearance/messages/theme configuration, cleanup, plain playground, and Chromium accessibility/browser tests are complete. Explicit custom/URL content sources and built-in copy/view/resource Actions are complete; visibility and automatic navigation refresh remain.

### Phase 2 — integration proof

- add VitePress, Starlight, Astro, and Docusaurus recipes/fixtures;
- exercise original Markdown URL, external Markdown plugin, callback content, and document extraction paths;
- resolve base-path, locale, version, and SPA navigation cases;
- publish a compatibility matrix with exact tested framework versions.

Exit gate: all fixture production builds and route-change tests pass.

Progress: the VitePress 1.6 recipe and fixture are complete. They cover production/SSR build, public-package mounting, canonical handoff, SPA route refresh without remounting, host theme synchronization, floating-control coexistence, mobile gutters, accessibility, and a packed-tarball consumer build. Starlight/Astro and Docusaurus remain; content-source cases wait on the Phase 1 content factories.

### Phase 3 — beta hardening

- test in at least two independently maintained documentation sites;
- audit strict CSP, mobile safe areas, floating-widget collisions, private-doc warnings, and bundle size;
- freeze public names and document migration policy;
- write the landing README, live examples, troubleshooting, and recipes;
- verify package contents from `npm pack`.

Exit gate: no known critical accessibility/privacy issues and installation succeeds from the packed tarball.

### Phase 4 — explicit `0.1.0` release decision

- review the working version against the PRD and explicitly decide whether to enable npm trusted publishing;
- only after approval, publish `docs-ai-island`;
- ship a small demo site showing different host themes and configurations;
- announce the precise backend-free positioning;
- collect installation friction and requested Actions rather than immediately creating adapter packages.

## Realistic effort

- Visual/browser prototype: roughly one focused day.
- Useful alpha on plain HTML: another one to two focused days.
- Responsible cross-framework `0.1.0`: approximately four to seven focused engineering days, depending on content extraction and integration defects.

The visual Island is simple. The release quality comes from handling navigation, content fidelity, accessibility, and framework coexistence.

## Release and adoption plan

README opening:

> Add a Vocs-style AI handoff island to any documentation site. Open the current page in ChatGPT or Claude, copy agent-friendly page content, expose Markdown and MCP links, and add your own actions—without a chatbot backend.

Required documentation:

- 60-second plain HTML install;
- VitePress, Starlight, Astro, and Docusaurus recipes;
- live visual configurator showing placement, theme, and Actions;
- Content Source decision guide;
- privacy explanation for public and private documentation;
- custom AI Target and custom Action examples;
- CSS token reference;
- accessibility behavior and shortcut-collision guidance;
- comparison with hosted Ask AI/search products without dismissing them.

Early success measures:

- time from install to visible Island;
- percentage of sample sites requiring custom CSS or lifecycle code;
- Action success/error rates in opt-in demo telemetry;
- independent real sites using the package;
- integration issues grouped by framework;
- demand for repeated Adapter logic;
- bundle size and accessibility regressions.

Downloads alone should not determine whether an Adapter is extracted. Two or more real sites repeating the same meaningful bridge is stronger evidence.

## Risks and mitigations

| Risk | Consequence | Mitigation |
| --- | --- | --- |
| “Ask AI” is interpreted as an embedded chatbot | Disappointed users | Use “handoff Island” in package description and show exact Actions above the fold. |
| VitePress/Docusaurus already have Algolia Ask AI | Product appears redundant | Position around no backend, no index, custom Actions, and page portability; compose rather than replace. |
| Raw Markdown is unavailable | Copy output is poor or action fails | Layer Content Sources, make DOM extraction explicit, and never fake source fidelity. |
| Framework SPA navigation leaves stale context | Wrong page is handed off | Fixture-test lifecycle bridges and resolve context at Action time, not only mount time. |
| Host CSS breaks the Island | Support burden | Prefix selectors, use a cascade layer, test common themes, and retain a Shadow DOM fallback decision until the spike. |
| Global keyboard shortcuts collide | Search/Ask AI becomes unusable | Disable shortcuts by default; expose opt-in configuration and collision guidance. |
| Floating widgets overlap | Poor mobile usability | Configurable placement/offset/z-index and documented integration with cookie/chat widgets. |
| External Target changes its URL scheme | Broken Actions | Isolate Targets as helpers, integration-test them, and allow consumer overrides. |
| Private page content leaks | Trust and security failure | No automatic transfer, lazy content access, explicit labels, safe defaults, and private-doc guidance. |
| Too many flags make config incoherent | API becomes hard to evolve | Action composition, semantic appearance options, stable Page Context, and CSS tokens for detail. |

## What not to build next

- Do not add an LLM API simply because the trigger says “Ask AI.”
- Do not generate `llms.txt` or MCP in this package; integrate with existing sources.
- Do not release four shallow framework wrappers before recipes expose real repeated friction.
- Do not promise source-perfect Markdown from arbitrary rendered HTML.
- Do not bundle React/Vue to make one integration easier.
- Do not add every AI brand by default; two proven Targets plus custom configuration is enough.
- Do not ship a visual effect that competes with the documentation content.
- Do not publish before testing a packed tarball in real production builds.

## Remaining decisions for implementation

1. Should document-to-Markdown extraction ship in core as a lazy chunk or as an optional subpath?
2. Should mobile always use a bottom sheet or only below a measured-space threshold?
3. Which per-page opt-out name is least likely to conflict across frameworks?
4. Should external AI handoff copy content before opening when a Target cannot reliably browse the URL?
5. What minimum browser support is acceptable for native popover behavior and fallback code?

These questions should be answered by implementation spikes and fixture evidence rather than additional speculative configuration.

## Research references

- [Vocs Ask AI documentation](https://vocs.dev/features/ask-ai)
- [Vocs agent support documentation](https://vocs.dev/features/agent-support)
- [Vocs source repository](https://github.com/wevm/vocs) — inspected at commit `4d36250` for current behavior.
- [VitePress: extending the default theme](https://vitepress.dev/guide/extending-default-theme)
- [VitePress: Algolia Ask AI support](https://vitepress.dev/reference/default-theme-search.html)
- [Starlight plugin API](https://starlight.astro.build/reference/plugins/)
- [Starlight component overrides](https://starlight.astro.build/reference/overrides/)
- [Starlight plugin ecosystem](https://starlight.astro.build/resources/plugins/)
- [Astro integration API](https://docs.astro.build/en/reference/integrations-reference/)
- [Astro navigation lifecycle](https://docs.astro.build/en/guides/view-transitions/)
- [Docusaurus swizzling and the Root component](https://docusaurus.io/docs/swizzling)
- [Docusaurus Algolia Ask AI support](https://docusaurus.io/docs/search)
- [Fern page actions](https://buildwithfern.com/learn/docs/configuration/site-level-settings)
