# Contributing

## Local setup

Use Node 24 and the pnpm version declared in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test:browser
```

The permanent playground imports production source. Use `pnpm dev` for visual development. The `prototype/` directory is archived design evidence; production code must not import it.

Add a Changeset for published runtime, API, or styling-contract changes. Documentation-only changes do not require one.

## Keep project records current

The repository—not conversation history—is the project source of truth. In the same pull request:

- update `docs/PRD.md` when requirements, scope, or acceptance criteria change;
- update `PLAN.md` or `PROJECT_SETUP_PLAN.md` when implementation status or sequencing changes;
- add or supersede an ADR when making a durable technical decision;
- keep implemented and planned capabilities explicitly separated.

See `docs/README.md` for the document map and ADR convention.
