# Docs AI Island: Project Setup Plan

Status: foundation and Option A vertical slice implemented; later phases active
Prepared: 2026-08-15
Last implementation reconciliation: 2026-08-15
Package: `docs-ai-island`
UI baseline: Option A, **Quiet Glass III**

## Outcome

Create one small, ESM-only, framework-neutral browser library with:

- an imperative `mountDocsAiIsland()` API;
- a polished default UI based on Option A;
- no framework runtime and no AI/backend dependency;
- separately imported, cascade-layered CSS;
- both semantic configuration and a fine-grained styling contract;
- SSR-safe imports and lazy browser/content work;
- first-class accessibility, package, size, and cross-framework tests;
- Vocs documentation plus real VitePress, Starlight, Docusaurus, and plain-HTML fixtures.

The repository should remain a **single publishable package at the root**. `docs`, `playground`, and fixture applications are pnpm workspace projects but are never published. Do not create adapter packages until repeated real-world integration logic proves they are needed.

The exact package name returned `E404` from npm and no exact-name GitHub repository was found when rechecked on 2026-08-15. Availability is time-sensitive and must be checked again immediately before publishing. Product-level rationale and limitations are recorded in the naming-validation section of `PLAN.md`.

## Current progress

| Area | Status | Evidence or remaining work |
| --- | --- | --- |
| Repository foundation | Complete | Root package, pnpm workspace, strict TypeScript, Biome, tsdown, Lightning CSS, Changesets, hooks, package metadata, and pinned lockfile are present. |
| Option A vertical slice | Complete | Quiet Glass production UI, controller, defaults, customization, playground, desktop/mobile snapshots, keyboard tests, and axe coverage are present. |
| Package validation | Complete for pilot | Publint, Are the Types Wrong ESM profile, packed-content/SSR import checks, and Brotli size budgets pass locally. |
| Customization contract | Partial | Semantic options, messages, icons, tokens, stable parts, placements, densities, and unstyled use exist; generated reference, RTL, hostile CSS, and long-label coverage remain. |
| Page actions and context | Partial | Canonical URL/title context, custom actions, events, ChatGPT/Claude, explicit custom Content Sources, and lazy `copyPage()` exist. URL Markdown, view/resource factories, fallback, and lifecycle hardening remain. |
| Content and route lifecycle | Partial | The VitePress recipe refreshes page context through `controller.update()` on route changes; explicit content sources, fallback experiments, visibility, and cancellation across updates remain. |
| Framework proof | Partial | VitePress 1.6 production, browser, theme, SPA, canonical, mobile, accessibility, and packed-tarball checks pass. Plain packed HTML, Starlight/Astro, and Docusaurus fixtures remain. |
| Documentation and release | Partial | README, PRD, plans, ADRs, contribution/security docs, and CI exist. Publishing is intentionally disabled; Vocs docs, reference docs, release approval, provenance setup, and real-site validation remain. |

The original pilot implementation landed at `27ebc99`; later checkpoints add project records, publishing safeguards, and framework proof. Generated build output is not source-of-truth; the documents and tests describe the intended and verified state.

## Decisions

| Area | Decision | Reason |
| --- | --- | --- |
| Package shape | Root package plus workspace-only apps | Keeps V1 easy to understand while leaving room for future packages. |
| Runtime | Framework-free TypeScript and DOM APIs | Works in VitePress, Astro/Starlight, Docusaurus, and static HTML without shipping React, Vue, Lit, or another renderer. |
| DOM | Light DOM with strongly prefixed selectors | Inherits host typography and allows complete consumer styling. |
| Styling | External CSS in a named cascade layer | CSP-friendly, optional, tree-shakable at the package level, and straightforward to override. |
| Build | `tsdown` for JavaScript/types; Lightning CSS for CSS | Replaces handwritten asset copying with library-aware bundling, declaration output, source maps, and deterministic CSS processing. |
| Modules | ESM only | All target documentation frameworks have modern ESM pipelines; dual CJS adds testing and export-map complexity without user value. |
| Browser target | Modern evergreen browsers; exact floor fixed before beta | Allows cascade layers, logical properties, modern ESM, and accessible browser APIs without legacy shims. |
| Node support | Published package `>=22`; development on Node 24; CI on 22/24/26 | Node 20 is EOL. Node 24 is the current LTS baseline, while the matrix catches compatibility drift. |
| Unit tests | Vitest in Node | Fast testing for pure context, action, URL, visibility, event, and state logic. |
| Browser tests | Playwright Test for component, accessibility, visual, and fixture behavior | Uses one real-browser stack for DOM behavior, focus, responsive state, host integration, and screenshots. |
| Docs | Vocs | Familiar authoring workflow and appropriate dogfooding context; other frameworks remain tested fixtures. |
| Releases | Changesets plus npm trusted publishing/provenance | Reviewable versioning, changelog automation, and verifiable artifacts. |

## What to retain from `rehype-code-group`

- A root publishable package with `docs` as a pnpm workspace project.
- ESM, explicit export maps, declaration files, and a minimal `files` allowlist.
- Strict TypeScript, Biome, Vitest coverage, Playwright, and axe.
- Type-level public API tests and validation of the packed npm artifact.
- Changesets, GitHub Actions, npm provenance, dependency review, CodeQL, and pinned Actions.
- pnpm supply-chain settings such as minimum release age, blocked exotic dependencies, and explicit build-script allowlisting.
- Separate unit, browser, documentation, security, and package-quality gates.

## What to change

- Replace `tsc` as the build emitter with `tsdown`; keep `tsc --noEmit` as the independent type checker.
- Replace custom asset-copy logic with Lightning CSS and a very small package-content assertion script.
- Add Publint and Are the Types Wrong instead of growing a custom export-map validator.
- Add Size Limit for enforceable JavaScript and CSS budgets.
- Use Playwright for browser behavior, accessibility, fixtures, and visual regression; keep Vitest focused on pure Node-side logic.
- Add Knip after the first vertical slice, when the public module graph is real enough for its findings to be useful.
- Keep pre-commit hooks fast: lint/format staged files only. Coverage, builds, and multi-browser tests belong in CI.
- Add a Vite-powered styling playground instead of developing against the throwaway prototype.
- Treat visual tokens and stable DOM parts as a public API with tests and documentation.

## Current pilot repository

```text
docs-ai-island/
├── .changeset/
│   └── config.json
├── .github/
│   ├── dependabot.yml
│   ├── pull_request_template.md
│   └── workflows/
│       ├── pull-request.yml
│       └── checks.yml
├── docs/
│   ├── README.md
│   ├── PRD.md
│   └── adr/
│       ├── README.md
│       ├── 0001-framework-neutral-browser-core.md
│       └── 0002-light-dom-and-external-css.md
├── playground/
│   ├── index.html
│   ├── package.json
│   └── src/
│       ├── main.ts
│       └── playground.css
├── prototype/
├── scripts/
│   └── check-package.mjs
├── src/
│   ├── actions/
│   │   └── targets.ts
│   ├── core/
│   │   ├── config.ts
│   │   ├── controller.ts
│   │   └── state.ts
│   ├── ui/
│   │   └── icons.ts
│   ├── styles/
│   │   ├── index.css
│   │   ├── tokens.css
│   │   ├── structure.css
│   │   ├── components.css
│   │   └── states.css
│   ├── index.ts
│   ├── public-types.ts
│   └── styles.d.ts
├── test/
│   ├── e2e/
│   │   └── island.spec.ts
│   └── unit/
├── test-dts/
│   ├── public-api.ts
│   └── tsconfig.json
├── biome.json
├── CONTEXT.md
├── CONTRIBUTING.md
├── LICENSE
├── package.json
├── PLAN.md
├── playwright.config.ts
├── pnpm-lock.yaml
├── pnpm-workspace.yaml
├── README.md
├── PROJECT_SETUP_PLAN.md
├── SECURITY.md
├── tsconfig.json
├── tsdown.config.ts
└── vitest.config.ts
```

Unimplemented V1 directories are tracked in the progress table and implementation phases rather than represented by empty packages. The existing `prototype/` remains outside production imports as archived design evidence; the production playground now owns visual development and regression coverage.

## Internal architecture

Keep behavior and presentation separable without publishing a second “headless” package prematurely:

```text
mountDocsAiIsland(config)
        │
        ▼
  normalized config ───────► page context resolver
        │                            │
        ▼                            ▼
  controller/state ◄──────── route lifecycle
        │
        ├────────────► light-DOM renderer ─────► Option A UI
        │
        ├────────────► action executor ────────► target/copy/custom actions
        │                              │
        └────────────► event emitter ◄─┘
                                       │
                                       ▼
                              lazy content source
```

Rules:

- Importing any public entry must not read `window` or `document`.
- `mountDocsAiIsland()` returns a controller with `open`, `close`, `update`, and `destroy`.
- Repeated mounting on the same root is deterministic and never leaks listeners.
- The state model is pure and testable; DOM code reacts to state rather than owning business rules.
- Content is resolved only after a user invokes an action that requires it.
- No network request occurs at mount time.
- All consumer callbacks are caught at the library boundary and reported through typed events.
- Framework lifecycle signals enter through `controller.update()` in V1; adapters remain recipes.

## Public entry points

Keep the initial export surface narrow:

```jsonc
{
  "exports": {
    ".": {
      "types": "./dist/index.d.ts",
      "import": "./dist/index.js"
    },
    "./styles.css": "./dist/styles.css",
    "./package.json": "./package.json"
  },
  "sideEffects": ["./dist/styles.css"]
}
```

The root exports:

- `mountDocsAiIsland` and `defineConfig`;
- built-in Action factories;
- public configuration, context, event, action, content, controller, message, theme, and slot types.

Do not expose internal folders as wildcard exports. Add a subpath only when it has an independently useful, stable contract.

## Customization contract

“Highly customizable” should not become hundreds of unrelated JavaScript flags. Provide five intentional layers.

### 1. Semantic appearance options

Typed options cover behavioral choices:

- placement;
- compact or comfortable density;
- automatic, light, or dark color scheme;
- desktop menu versus mobile sheet behavior;
- trigger label and icon visibility;
- motion policy;
- offset and z-index;
- portalling/root container.

### 2. Typed theme tokens

`theme` accepts a typed partial token map and writes scoped CSS custom properties on the Island root. Token categories:

- surface, foreground, muted, subtle, accent, border, hover, focus, success, and error colors;
- font family, label/header/body sizes, weights, line heights, and letter spacing;
- trigger width/height/padding/gap/radius/border/shadow;
- menu width/max-height/padding/gap/radius/border/shadow/backdrop blur;
- header, action, icon, utility, divider, and live-region dimensions;
- desktop/mobile offsets, safe-area behavior, and z-index;
- open/close duration, easing, translate, and scale;
- compact and comfortable density values.

Use the long `--docs-ai-island-*` prefix. Every public token appears in one generated reference table and has a default in `tokens.css`.

### 3. Stable DOM parts

Render stable attributes for targeted styling and testing:

```html
<div data-docs-ai-island data-state="open" data-placement="bottom-center">
  <button data-part="trigger"></button>
  <div data-part="menu">
    <header data-part="header"></header>
    <div data-part="actions">
      <button data-part="action" data-action-id="chatgpt"></button>
    </div>
    <footer data-part="utilities"></footer>
  </div>
  <div data-part="live-region"></div>
</div>
```

`data-part`, state, placement, density, color-scheme, direction, and action IDs are stable. Internal class names are not public API. Selectors use `:where(...)` inside a named `docs-ai-island` cascade layer to keep specificity low.

### 4. Content and icon replacement

- Every visible string is replaceable through `messages`.
- Every built-in icon can be replaced or disabled.
- Custom Actions control their own label, description, icon, grouping, visibility, disabled state, and execution.
- Icon callbacks return `Node`; raw HTML strings are rejected.
- Long labels, descriptions, localization, RTL, and icon-free rendering are tested states.

### 5. Unstyled use

Styles are never injected by JavaScript. Consumers who omit `docs-ai-island/styles.css` receive accessible, semantic light-DOM markup and can supply all styling themselves. The DOM and state attributes therefore require the same compatibility discipline as TypeScript exports.

## CSS organization

Source CSS remains split for maintainability and is bundled into one public file:

```css
@layer docs-ai-island.reset,
       docs-ai-island.tokens,
       docs-ai-island.structure,
       docs-ai-island.components,
       docs-ai-island.states;
```

Requirements:

- logical properties for RTL;
- inherited font by default;
- no global element selectors outside the scoped root;
- no `!important` in production CSS;
- no remote fonts, images, or icon requests;
- safe-area offsets for mobile;
- forced-colors and reduced-motion rules;
- all animation limited to opacity/transform;
- light and dark defaults validated at 200% zoom and 320 CSS pixels;
- no Shadow DOM in V1; add an ADR before changing this decision.

The playground must expose every public token, semantic option, long-content case, placement, theme, direction, and action state. It replaces the prototype’s customizer as the permanent visual-development surface.

## Toolchain snapshot

Versions below were checked on 2026-08-15. Pin exact versions in `package.json` and the lockfile; review them when scaffolding rather than assuming this table remains current.

| Tool | Pilot version or status | Role |
| --- | ---: | --- |
| Node.js | 24 LTS for development | Local and primary CI runtime. |
| pnpm | 11.21.0 | Workspace and package manager. |
| TypeScript | 6.0.3 | Strict type checking and public declarations; TypeScript 7 is deferred until tsdown's declaration pipeline supports it without experimental-API warnings. |
| Node types | 22.20.1 | Type against the minimum supported Node major rather than accidentally using Node 26-only APIs. |
| tsdown | 0.22.14 | ESM bundling, declarations, tree-shaking, source maps. |
| Lightning CSS CLI | 1.33.0 | CSS bundling, minification, targets, source maps. |
| Vite | 8.2.1 | Playground development server only. |
| Biome | 2.5.8 | Formatting and linting for TS, JS, JSON, and CSS. |
| Vitest | 4.1.10 | Pure unit test runner. |
| Vitest V8 coverage | 4.1.10 | Coverage and thresholds. |
| Playwright Test | 1.62.1 | Fixture E2E and visual regression. |
| axe Playwright | 4.13.0 | Automated accessibility checks. |
| Changesets | 3.0.0 | Version and changelog workflow. |
| Changesets GitHub changelog | 1.0.0 | Linked release notes. |
| Publint | 0.3.23 | Package/export compatibility validation. |
| Are the Types Wrong CLI | 0.18.5 | Declaration/module-resolution validation. |
| Size Limit | 13.0.3 | JavaScript and CSS budgets. |
| simple-git-hooks | 2.13.1 | Small Git hook installer. |
| lint-staged | Deferred | Add only if staged-file volume makes the current full Biome hook too slow. |
| rimraf | 6.1.3 | Cross-platform cleanup where the build tool cannot do it. |
| Vocs | Planned | Documentation site work begins after the framework-neutral alpha. |

No runtime dependency is required for the initial scaffold. A document-to-Markdown converter may become a lazy bundled chunk only after the content-source spike measures quality and size.

Fixture-only versions in the same snapshot are VitePress 1.6.4, Astro 7.2.2, Starlight 0.41.7, Docusaurus 3.10.2, Vue 3.5.41, and React/React DOM 19.2.8. These belong to their respective workspace packages, not the published package.

The pnpm workspace should enforce a minimum dependency release age and explicit build-script allowlist. Therefore scaffolding should choose the newest reviewed version that passes that policy, which may intentionally be one patch behind this registry snapshot.

## TypeScript and build configuration

`tsconfig.json`:

- `strict: true`;
- `noUncheckedIndexedAccess: true`;
- `exactOptionalPropertyTypes: true`;
- `noImplicitOverride: true`;
- `noFallthroughCasesInSwitch: true`;
- `noUnusedLocals` and `noUnusedParameters`;
- `verbatimModuleSyntax: true`;
- `moduleResolution: "Bundler"` for source;
- `target: "ES2022"`;
- libs `ES2022`, `DOM`, and `DOM.Iterable`;
- no emit from the typecheck config.

`tsdown.config.ts`:

- entry `src/index.ts`;
- ESM only;
- browser-neutral/platform-neutral output;
- clean `dist`;
- declarations and declaration maps;
- JavaScript source maps;
- tree shaking enabled;
- code splitting enabled for lazy content conversion;
- no minification for the first alpha so artifacts remain debuggable; Size Limit measures production-minified cost;
- fail on unexpected Node built-ins or browser globals evaluated at import time.

Lightning CSS:

- bundle `src/styles/index.css` to `dist/styles.css`;
- emit a source map;
- preserve public custom-property names and `data-*` selectors;
- use an explicit browser target fixed by ADR before beta;
- generate a minified artifact without requiring consumers to run PostCSS.

## Scripts

```jsonc
{
  "scripts": {
    "dev": "pnpm --dir playground dev",
    "build": "pnpm clean && pnpm build:js && pnpm build:css",
    "build:js": "tsdown",
    "build:css": "lightningcss --bundle --sourcemap --minify src/styles/index.css -o dist/styles.css",
    "clean": "rimraf dist playground/dist coverage playwright-report test-results",
    "typecheck": "tsc --noEmit",
    "format": "biome format --write .",
    "lint": "biome ci .",
    "lint:fix": "biome check --write .",
    "test": "vitest run",
    "test:watch": "vitest",
    "test:coverage": "vitest run --coverage",
    "test:browser": "playwright test",
    "test:e2e": "pnpm build && playwright test",
    "test:types": "tsc -p test-dts/tsconfig.json",
    "test:package": "pnpm build && publint --pack false --strict && rimraf .package && pnpm pack --pack-destination .package && attw .package/*.tgz --profile esm-only --entrypoints . && node scripts/check-package.mjs",
    "test:size": "pnpm build && size-limit",
    "check": "pnpm lint && pnpm typecheck && pnpm test:coverage && pnpm test:types && pnpm test:package && pnpm test:size",
    "changeset": "changeset",
    "changeset:version": "changeset version",
    "changeset:publish": "pnpm build && changeset publish",
    "prepare": "simple-git-hooks"
  }
}
```

The repository scripts are implemented with two deliberate pilot differences from the earlier sketch: `pnpm check` runs non-browser package gates while CI runs `pnpm test:browser` as a separate job, and lint-staged is deferred until staged-file volume justifies another dependency. Avoid adding a dependency solely to run scripts in parallel; CI jobs provide parallelism.

## Package quality gates

The packed tarball must prove:

- only intended files are published;
- every export resolves under Node, Bundler, and TypeScript module-resolution modes;
- server import succeeds with no DOM globals;
- browser import and mount succeed;
- CSS is included and marked as a side effect;
- source maps point to packaged sources or intentionally omit `sourcesContent`;
- built-in actions tree-shake when unused;
- no framework runtime is bundled;
- license, repository, funding, keywords, homepage, bugs, and provenance metadata are correct.

Initial size budgets:

- root ESM entry with Option A UI: **12 kB Brotli maximum**;
- default CSS: **4 kB Brotli maximum**;
- a minimal consumer importing only mount plus one custom Action must stay below the full default bundle;
- lazy document conversion is measured separately and never part of initial load.

## Test layers

### Unit

- config normalization and immutable defaults;
- state transitions and repeated mount/destroy;
- canonical Page Context;
- include/exclude precedence;
- target URLs and prompts;
- content-source ordering and failure behavior;
- action visibility, disabled, error, and event behavior;
- URL protocol validation and event redaction;
- token/message normalization.

### Browser component

- trigger/menu open, close, Escape, outside click, and focus restoration;
- Arrow/Home/End navigation without stealing keys from editable controls;
- pending, success, and failure announcements;
- clipboard success and denial;
- asynchronous visibility and stale action cancellation;
- mobile sheet/menu threshold and safe areas;
- light, dark, forced-colors, reduced motion, 200% zoom, and RTL;
- custom icons, no icons, long localization, and unstyled rendering;
- complete public token application and stable part attributes.

### Visual regression

Keep snapshots intentionally small and contract-focused:

- Option A expanded and collapsed;
- light and dark;
- compact and comfortable;
- desktop and 390px mobile;
- left, center, and right placement;
- longest supported labels and RTL;
- hover, keyboard focus, pending, success, and error states.

### Framework fixtures

Each fixture consumes `docs-ai-island` through `workspace:*`, then validates its production build and route lifecycle:

- plain HTML/Vite;
- VitePress;
- Astro/Starlight;
- Docusaurus.

Fixtures must include hostile host CSS, an existing floating widget, strict CSP, SPA navigation, excluded pages, missing Markdown, and a working Markdown source.

### Manual release checks

- keyboard-only smoke test;
- VoiceOver or NVDA smoke test;
- iOS/Android deep-link behavior;
- private documentation warning copy;
- package installation in a clean temporary consumer.

## CI plan

`checks.yml` exposes reusable jobs:

1. **Quality** on Node 24: install, lint, typecheck, build, type tests, package checks, and size budgets.
2. **Unit** on Node 22, 24, and 26: coverage thresholds.
3. **Browser component** on Chromium, Firefox, and WebKit.
4. **Framework fixtures** as a matrix for HTML, VitePress, Starlight, and Docusaurus.
5. **Docs**: Vocs production build and smoke tests.
6. **Security**: pnpm audit, dependency review, CodeQL, and CycloneDX SBOM.

Pin GitHub Actions to commit SHAs. Use least-privilege permissions, cancel superseded PR runs, and cache only pnpm’s store. Do not cache built `dist` artifacts between jobs that are meant to verify clean builds.

## Release plan

- Keep npm publishing disabled while the package is under development. Pushes to `main` run checks only.
- Do not add an active publishing workflow until the working-version gates below pass and the maintainer explicitly approves a release.
- After approval, start with a `next` prerelease and retain prereleases until at least two real documentation sites install it.
- Every published runtime/API/style-contract change requires a Changeset.
- Documentation-only changes do not require a Changeset.
- If publishing is later enabled, publish from `main` only after reusable checks pass.
- Use npm trusted publishing with provenance; never store a long-lived npm token when trusted publishing is available.
- Attach or retain the SBOM and verify the published package with Publint after release.

CSS variables, stable parts, and default visual behavior are public API. Breaking a token name, part name, or documented selector requires the same release discipline as breaking a TypeScript type.

## Implementation sequence

### Phase 0 — Repository foundation — complete

- Initialize Git/package metadata, license, workspace, Node/pnpm pins, EditorConfig, ignore files, Biome, TypeScript, tsdown, Lightning CSS, Changesets, and Git hooks.
- Add empty docs, playground, and fixture workspace packages.
- Add CI skeleton and package verification before feature code.

Exit: `pnpm install`, `pnpm lint`, `pnpm typecheck`, `pnpm build`, and `pnpm test:package` pass with a minimal SSR-safe export.

### Phase 1 — Option A vertical slice — complete

- Implement controller, small state model, light-DOM renderer, trigger, menu, two static custom Actions, keyboard behavior, destroy, and default CSS.
- Reproduce Quiet Glass III in the permanent playground without copying prototype architecture.
- Add desktop/mobile visual snapshots and axe checks.

Exit: one custom Action can be mounted, invoked, styled, updated, and destroyed in plain HTML.

### Phase 2 — Customization contract — in progress

- Finalize semantic appearance options, typed theme tokens, messages, icons, stable parts, RTL, density, placement, mobile behavior, and unstyled use.
- Generate the token reference from one source of truth.
- Add hostile CSS and long-localization tests.

Exit: every documented token/part has a test; no production CSS relies on the prototype.

### Phase 3 — Page context and built-in Actions

- Add context resolution, visibility, ChatGPT/Claude targets, clipboard Actions, resource Actions, events, validation, and privacy safeguards.
- Keep content lazy and test target URL contracts.

Current checkpoint: [`docs/explorations/content-actions/`](./docs/explorations/content-actions/) defines the vertical RED→GREEN slices. ADR 0003 is accepted. Phase 1 implements explicit custom Content Sources and lazy `copyPage()`; subsequent phases add URL Markdown, viewing, resources, and lifecycle hardening.

Exit: the package is useful with zero configuration and remains network-idle until a user acts.

### Phase 4 — Content sources and lifecycle

- Add Markdown URL/callback sources, explicit document fallback spike, failure modes, asynchronous cancellation, route updates, and controller update behavior.
- Measure any conversion chunk before accepting a runtime dependency.

Exit: plain HTML and SPA navigation produce fresh Page Context without remount leaks.

### Phase 5 — Framework proof

- Implement fixture-tested recipes for VitePress, Starlight, generic Astro, and Docusaurus.
- Do not publish adapters unless at least two fixtures require the same non-trivial bridge and real users validate it.

Progress: VitePress is complete against 1.6.4 with Vue 3.5.41. The fixture extends the default theme, mounts through `layout-bottom`, synchronizes route and theme changes without remounting, and validates both workspace and packed-tarball consumption. Starlight, generic Astro, and Docusaurus remain.

Exit: every fixture’s production build and E2E suite pass.

### Phase 6 — Documentation and release candidate

- Build the Vocs site: landing page, live playground, install recipes, API/token/part reference, accessibility, privacy, CSP, troubleshooting, and migration policy.
- Complete security docs, contribution guide, release-readiness review, and a proposed prerelease Changeset. Keep publication disabled until explicit approval.

Exit: clean-install smoke test passes and the maintainer can make an informed decision about enabling a provenance-backed `0.1.0-next.0` release.

## Deliberate non-choices

- No React/Vue/Lit dependency.
- No Tailwind, CSS-in-JS, runtime style injection, or remote assets.
- No Storybook; the Vite playground is smaller and tests the actual package CSS.
- No CJS build unless a verified consumer cannot use ESM.
- No Shadow DOM in V1.
- No framework adapter packages in V1.
- No broad wildcard exports.
- No DOM emulator as the primary UI test environment.
- No automated AI/RAG backend, analytics SDK, or provider SDK.
- No promotion of the prototype code directly into `src`.

## Setup-complete definition

Project setup is complete when:

- a fresh clone needs only the documented Node version and `pnpm install --frozen-lockfile`;
- `pnpm check`, fixture builds, docs build, and all three browser engines pass;
- the packed tarball passes Publint, Are the Types Wrong, server import, browser mount, and allowlist checks;
- the playground imports source through the same public API expected of consumers;
- release configuration is documented but no active CI job can publish before explicit approval;
- no production UI implementation has been copied from the throwaway prototype.
