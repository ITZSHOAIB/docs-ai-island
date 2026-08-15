# Contributing

## Local setup

Use Node 24 and the pnpm version declared in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test:browser
pnpm test:fixture:html:pack
pnpm test:fixture:vitepress
pnpm test:fixture:vitepress:pack
```

The permanent playground imports production source. Use `pnpm dev` for visual development. The `prototype/` directory is archived design evidence; production code must not import it.

Add a Changeset for published runtime, API, or styling-contract changes. Documentation-only changes do not require one.

The customization reference is generated from `src/customization-contract.ts`. Change the manifest and
the implementation together, run `pnpm docs:customization`, and commit the generated reference. The main
`pnpm check` command fails if token defaults, styled parts, or generated output drift.

The VitePress fixture runs from a production build on a fresh local preview server. Its packed-package check copies the fixture into `.tmp/`, installs the generated tarball as a normal dependency, and verifies a clean production build.

## Keep project records current

The repository—not conversation history—is the project source of truth. In the same pull request:

- update `docs/PRD.md` when requirements, scope, or acceptance criteria change;
- update `PLAN.md` or `PROJECT_SETUP_PLAN.md` when implementation status or sequencing changes;
- add or supersede an ADR when making a durable technical decision;
- keep implemented and planned capabilities explicitly separated.

See `docs/README.md` for the document map and ADR convention.
