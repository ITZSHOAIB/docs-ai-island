---
status: accepted
date: 2026-08-15
---

# Use Light DOM and externally imported layered CSS

## Context

Docs AI Island must look polished by default while remaining deeply customizable inside documentation sites with different fonts, color systems, themes, content security policies, and build pipelines. Shadow DOM would provide stronger isolation but make host typography, design-token inheritance, targeted overrides, and complete consumer styling harder. Runtime style injection would also complicate strict CSP deployments and prevent an intentionally unstyled mode.

## Decision

Render semantic Light DOM under a uniquely marked root and publish styling as a separate `styles.css` export. Scope production selectors to that root, use the `--docs-ai-island-*` custom-property namespace, keep specificity low with `:where(...)`, and organize defaults in named cascade layers.

Treat documented theme tokens, `data-part` names, state attributes, placement, density, color-scheme, surface, and action identifiers as public compatibility contracts. Internal class names are not public API. JavaScript never injects the default stylesheet, so consumers may omit it and provide a fully custom presentation.

## Considered options

- Open Shadow DOM provides better host-style isolation but increases theming friction and requires separate font/token bridges.
- Closed Shadow DOM provides the strongest isolation but conflicts with deep customization, testing, and consumer ownership.
- Runtime-injected CSS simplifies setup but is less CSP-friendly and removes the clean unstyled mode.
- Unscoped global CSS is small but creates unacceptable collision risk in host documentation sites.

## Consequences

- The component naturally inherits host typography and can be customized down to individual parts.
- Consumers must explicitly import the default stylesheet.
- Hostile CSS, strict CSP, long localization, RTL, and framework-theme coexistence require fixture coverage before `0.1.0`.
- Changes to documented tokens or parts require normal public-API release discipline.
- If real fixture evidence shows that scoped Light DOM is insufficient, a future ADR may supersede this decision; Shadow DOM is not added as an undocumented mode.
