# Contributing

## Local setup

Use Node 24 and the pnpm version declared in `package.json`.

```sh
corepack enable
pnpm install --frozen-lockfile
pnpm check
pnpm test:browser
```

The permanent playground imports production source. Use `pnpm dev` for visual development and keep the `prototype/` directory unchanged as a design reference until the production UI is approved.

Add a Changeset for published runtime, API, or styling-contract changes. Documentation-only changes do not require one.
