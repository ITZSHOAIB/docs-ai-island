# Docs AI Island: Pilot and V1 Product Requirements

Status: active
Last updated: 2026-08-15
Release state: pilot implemented; package publication intentionally disabled

Current design checkpoint: content and built-in Action phases are explored in [`explorations/content-actions/`](./explorations/content-actions/); the public contract remains proposed and no capability in that exploration is shipped yet.

## Problem Statement

Documentation teams want the useful AI handoff experience found in Vocs without migrating their existing VitePress, Astro/Starlight, Docusaurus, or custom documentation site. Existing alternatives often require a hosted search index, chatbot backend, content ingestion system, or framework-specific integration. Teams need a small, trustworthy UI that helps a reader take the current documentation page to an AI assistant or another page-level tool while leaving the site and its content pipeline under the team's control.

## Solution

Docs AI Island is a polished, framework-neutral browser component that floats above a documentation page and exposes composable actions. Its zero-configuration experience opens the canonical current page in ChatGPT or Claude. Sites can replace or extend those actions, messages, icons, placement, density, colors, dimensions, and detailed styles.

The product is an **AI handoff island**, not an embedded chatbot. It does not answer questions, crawl content, build an index, store credentials, or transmit page content at mount time.

## Target Users

- Maintainers of static or hybrid documentation sites.
- Documentation platform and design-system teams supporting multiple frameworks.
- Open-source maintainers who want AI-friendly page actions without operating a backend.
- Readers who want to continue learning about the current page in their preferred AI tool.

## User Stories

1. As a documentation maintainer, I want to install one small package, so that I can add an AI handoff without migrating frameworks.
2. As a maintainer, I want useful default actions, so that a pilot works before I design a custom integration.
3. As a reader, I want to open the canonical page in ChatGPT or Claude, so that the assistant receives a stable public reference.
4. As a reader, I want clear descriptions of each action, so that I understand what will happen before selecting it.
5. As a keyboard user, I want predictable open, close, navigation, and focus restoration behavior, so that I can use the island without a pointer.
6. As a screen-reader user, I want meaningful names, state, and status announcements, so that asynchronous actions are understandable.
7. As a mobile reader, I want the island to respect viewport and safe-area boundaries, so that it remains usable without hiding page navigation.
8. As a site designer, I want restrained defaults that inherit my typography, so that the island feels native to the documentation site.
9. As a site designer, I want semantic appearance options and scoped design tokens, so that common customization does not require DOM knowledge.
10. As an advanced integrator, I want stable parts and state attributes, so that I can customize minute visual details without relying on internal classes.
11. As an integrator, I want replaceable actions, groups, labels, descriptions, and icons, so that the island matches my content and product language.
12. As a privacy-conscious maintainer, I want no network activity at mount time, so that adding the component does not silently disclose page data.
13. As an analytics owner, I want typed lifecycle events, so that I can add my own measurement without a bundled analytics service.
14. As an SSR framework user, I want package imports to work without browser globals, so that server builds do not fail.
15. As a VitePress, Starlight, Astro, or Docusaurus maintainer, I want a tested installation recipe, so that SPA navigation and theme coexistence are reliable.
16. As a maintainer with Markdown routes, I want explicit copy-page and view-source actions, so that readers can pass source-fidelity content to agents.
17. As a maintainer without Markdown routes, I want honest fallback behavior, so that the package never pretends reconstructed content is original source.
18. As a maintainer with an MCP endpoint, `llms.txt`, support link, or search tool, I want generic custom/resource actions, so that the island is not limited to AI vendors.
19. As a package consumer, I want a narrow, typed, ESM-only API with no runtime dependencies, so that adoption has a low maintenance and bundle cost.
20. As a contributor, I want plans, requirements, ADRs, and current implementation state in the repository, so that decisions remain reviewable and do not depend on chat history.

## Functional Requirements

| ID | Requirement | Pilot status |
| --- | --- | --- |
| FR-01 | Mount an island through an imperative, framework-neutral API. | Implemented |
| FR-02 | Provide zero-config ChatGPT and Claude handoff actions. | Implemented |
| FR-03 | Resolve the current URL, canonical URL, and page title at action/render time. | Implemented |
| FR-04 | Support custom action groups and synchronous or asynchronous handlers. | Implemented |
| FR-05 | Return a controller with open, close, update, and destroy operations. | Implemented |
| FR-06 | Support placement, density, color scheme, surface, message, icon, and theme customization. | Implemented |
| FR-07 | Expose stable DOM parts and state attributes for complete consumer styling. | Implemented |
| FR-08 | Announce pending, successful, and failed actions and emit typed lifecycle events. | Implemented |
| FR-09 | Provide built-in copy-page, view-Markdown, copy-resource, and open-URL factories. | Implemented |
| FR-10 | Support explicit content sources and well-defined fallback behavior. | Implemented for custom and URL Markdown sources; DOM extraction deliberately deferred |
| FR-11 | Support route visibility, page opt-out, and SPA lifecycle refresh. | Partial: VitePress refresh recipe proven; visibility and opt-out remain |
| FR-12 | Provide tested recipes for plain HTML, VitePress, Starlight/Astro, and Docusaurus. | Partial: VitePress production fixture implemented |

## Experience Requirements

- The default presentation is Quiet Glass III: simple, professional, neutral, and compact.
- Desktop placement defaults to bottom center with configurable left and right alternatives.
- The menu opens above the trigger and remains inside mobile viewport gutters.
- Escape closes and restores trigger focus; Arrow keys, Home, and End navigate available actions.
- Tab follows normal document order and focus is not trapped.
- External handoffs close the island; in-place actions may keep it open so feedback remains perceivable.
- Motion is restrained and respects reduced-motion preferences.
- Provider graphics are monochrome by default; no animated AI glow or provider-brand color is required.

## Implementation Decisions

- Publish one ESM-only package with a framework-neutral TypeScript and DOM core.
- Use Light DOM, strongly prefixed selectors, stable `data-*` parts, and separately imported cascade-layered CSS.
- Keep imports SSR-safe and defer all browser work until mounting or user interaction.
- Ship no framework runtime, AI SDK, analytics SDK, backend dependency, or runtime dependency in the pilot.
- Model the UI as configurable action groups rather than accumulating provider-specific flags.
- Treat CSS tokens, stable parts, default behavior, and TypeScript types as public compatibility contracts.
- Use an imperative controller as the lifecycle seam for framework recipes; add adapters only after repeated real-world integration evidence.
- Keep target URL construction isolated and overrideable because external provider URL formats can change.
- Keep the throwaway prototypes as design evidence but exclude them from production imports and quality scans.

## Testing Decisions

The two primary seams are the exported package API and the rendered island in a real browser. Tests should assert consumer-visible behavior rather than private implementation details.

- Unit tests cover configuration normalization and the pure state model.
- Declaration tests cover the supported public TypeScript API.
- Package tests cover export maps, packed contents, ESM resolution, and import without DOM globals.
- Playwright tests cover menu behavior, keyboard navigation, focus restoration, runtime customization, mobile fit, accessibility, and approved visual baselines.
- Size Limit enforces separate JavaScript and CSS budgets.
- Framework fixtures consume the package through its public entry points and exercise production builds and route changes. The VitePress fixture additionally validates exact copy/view Markdown across routes, honest missing-asset failure, theme coexistence, canonical handoff, mobile fit, axe results, and a clean packed-tarball consumer build; the remaining framework fixtures are pending.

## Non-Functional Requirements

- No network request and no content transfer occurs merely by mounting the island.
- Public imports must not evaluate `window` or `document`.
- The pilot must remain within 12 kB Brotli for JavaScript and 4 kB Brotli for CSS.
- Automated accessibility checks must report no detectable violations in the covered state.
- The component must work at a 390px mobile viewport with safe gutters.
- Consumer callbacks must not break the island if they throw.
- Repeated mounting in one container must clean up the prior controller.

## Release Acceptance

### Pilot — complete locally

- Production UI reproduces the approved Quiet Glass direction.
- Zero-config and custom-action examples work in the Vite playground.
- Type, unit, package, size, accessibility, browser, mobile, and visual checks pass.
- The package has documentation, contribution guidance, security policy, and CI. No active workflow can publish to npm.

### V1 alpha — pending

- Content-source and built-in page/resource actions are implemented.
- Visibility and SPA lifecycle behavior are defined and tested.
- At least the plain HTML fixture passes as a packed-package consumer.
- The public token and part reference is generated or verified from one source of truth.

### V1 beta/release — pending

- VitePress production and packed-consumer fixtures pass; Starlight/Astro and Docusaurus production fixtures remain.
- Strict CSP, hostile host CSS, RTL, long localization, and cross-browser states are validated.
- Two independent documentation sites validate installation and integration behavior.
- A separate explicit release decision enables trusted publishing only after the working-version gates pass.
- A prerelease and then `0.1.0` may be published with provenance after that approval.

## Success Signals

- A maintainer can reach a visible working island in roughly one minute.
- Most integrations need configuration or documented CSS tokens, not source forks.
- Framework-specific lifecycle code is small enough to remain a recipe.
- No critical accessibility, privacy, or package-compatibility regression reaches a release.
- Real integration evidence—not downloads alone—drives any future adapter package.

## Out of Scope

- Embedded chat, answer generation, streaming, conversation storage, or RAG.
- Crawling, indexing, embeddings, vector storage, or search infrastructure.
- API-key storage, LLM proxying, hosted dashboards, or built-in telemetry.
- Generating Markdown twins, `llms.txt`, or MCP servers.
- Automatic mutation of consumer projects.
- Automatic transfer of private or authenticated page content.
- Framework-specific packages before repeated integration evidence exists.

## Open Product Questions

1. Whether document-to-Markdown extraction is valuable enough to ship, and whether it belongs in core or an optional subpath.
2. Whether constrained mobile layouts need a distinct bottom-sheet mode after fixture testing.
3. Which page-level opt-out convention is least collision-prone across frameworks.
4. How AI targets that cannot reliably browse a URL should communicate or handle content handoff.
5. The exact evergreen browser floor for the first published release.

## Further Notes

- The product name is **Docs AI Island** and the package slug is `docs-ai-island`. Live npm and GitHub checks found the exact slug unclaimed on 2026-08-15, but availability must be rechecked immediately before publication.
- The descriptive name is approved for this narrowly scoped package, not as a guaranteed umbrella brand for a future agent-support suite. The check is not a legal trademark clearance.
- [`../PLAN.md`](../PLAN.md) contains the full research, product rationale, risk analysis, and delivery sequence.
- [`../PROJECT_SETUP_PLAN.md`](../PROJECT_SETUP_PLAN.md) contains the toolchain and repository implementation plan.
- [`adr/`](./adr/) records durable architecture decisions.
