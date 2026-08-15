# UI prototype verdict

Question: Which visual and interaction model should become the default Docs AI Island, and which customization controls belong in the production API?

## Variants

- A — Quiet glass III: a simpler default with one heading, two AI destinations, and a quiet utility footer.
- B — Context split: editorial page summary beside a focused AI handoff column.
- C — Command line: keyboard-first action discovery with richer descriptions and filtering.
- D — Editorial sheet: expressive hierarchy, prominent AI targets, and understated page utilities.

## Review history

- First pass: Quiet Glass had the strongest structure, but the set looked generic and under-polished because of excessive boxes, low contrast, tiny labels, and inconsistent icon treatment.
- Second pass: rebuilt the shared visual system and all four structures around stronger typography, fewer borders, more deliberate spacing, and quieter effects.
- Third pass: simplified Quiet Glass further by removing the decorative context tile, section label, glow, readiness badges, and trigger subtitle. Increased type size and spacing so the remaining hierarchy feels deliberate rather than miniature.

## Verdict

**Quiet glass III is selected as the production default.** It has the smallest visual footprint, keeps page context visible, and separates high-intent AI handoffs from lower-priority page utilities without feeling like a chatbot. Keep **Command line** as the strongest optional pattern for documentation sets that expose many custom actions. The split and editorial variants are useful references, but are too visually dominant for a universal default.

Proposed defaults from this pass:

- Trigger: a single-line `Ask AI` button with no status text or shortcut chrome.
- Placement: bottom center, with 12px mobile gutters and safe-area spacing.
- Surface: frosted where supported, with solid as the deterministic fallback.
- Density: compact by default; comfortable as an opt-in.
- Configuration worth keeping: provider/action registry, labels and descriptions, accent, surface, density, placement, radius, host theme mode, and page-context adapter.
- Prototype-only controls to discard: the floating variant switcher, state readout, fake host-theme controls, and sample documentation shell.
- Deferred behavior: command filtering and custom prompts should wait until the action registry is large enough to justify them.

Capture:

- Winning base variant: Quiet glass III.
- Elements to borrow from other variants: Command line's descriptions and selected-state treatment when an expanded action catalog is needed.
- Default trigger label: `Ask AI`.
- Default placement: bottom center.
- Default surface: frosted, with solid fallback.
- Mobile behavior: 12px viewport gutters; panel and trigger stack above the safe area.
- Production configuration controls: actions/providers, content and labels, accent, surface, density, placement, radius, theme mode, and context source.
- Prototype controls to discard: variant switcher, debug state readout, fake host controls, and demo documentation shell.
