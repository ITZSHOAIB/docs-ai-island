# Project documents

This directory and the root planning files are the source of truth for Docs AI Island. Update them in the same pull request whenever product scope, delivery state, or an architectural decision changes.

## Document map

| Document | Purpose | Current state |
| --- | --- | --- |
| [`PRD.md`](./PRD.md) | Product requirements, users, acceptance criteria, and release boundary | Active for the pilot and V1 |
| [`../PLAN.md`](../PLAN.md) | Product research, positioning, full product design, and phased delivery | V1 alpha complete locally; beta proof active |
| [`../PROJECT_SETUP_PLAN.md`](../PROJECT_SETUP_PLAN.md) | Toolchain, repository structure, quality gates, and implementation sequence | Alpha core and customization contract plus plain HTML and VitePress proofs implemented |
| [`reference/customization.md`](./reference/customization.md) | Generated CSS token and stable-part contract | Current; freshness enforced by `pnpm check` |
| [`adr/`](./adr/) | Accepted architectural decisions and their consequences | Four accepted decisions |
| [`explorations/`](./explorations/) | Design checkpoints and phase-level TDD plans | Content Actions, route lifecycle, and customization reference complete |
| [`../CONTEXT.md`](../CONTEXT.md) | Original research and project context | Historical context |
| [`../prototype/`](../prototype/) | Throwaway UI explorations and selection notes | Archived design evidence |

## Maintenance rule

- Change product goals, scope, or acceptance criteria in the PRD.
- Change sequencing, milestones, or current delivery state in the plans.
- Record durable technical choices as ADRs; do not silently rewrite an accepted decision.
- Keep completed and unimplemented work visibly separate.
- Documentation-only changes do not require a Changeset.

Last reconciled with the implementation on 2026-08-15 after completing the generated customization contract and V1 alpha gates.
