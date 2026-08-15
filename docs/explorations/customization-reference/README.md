# Generated customization reference

Status: complete
Date: 2026-08-15

## Question

How can Docs AI Island document every public CSS token and stable DOM part without allowing the reference, TypeScript API, stylesheet, and rendered markup to drift independently?

## Evidence before implementation

- The default stylesheet declares 23 `--docs-ai-island-*` properties.
- The typed `theme` API currently maps 20 of them; item height, menu padding, and backdrop filter are CSS-only despite being useful customization controls.
- Parts are rendered from string literals across the controller and icon renderer, while the README only promises that stable parts exist.
- ADR 0002 already treats documented tokens and parts as public compatibility contracts.

## Contract

1. Keep a checked-in TypeScript manifest as the canonical token and part vocabulary.
2. Derive the typed theme-token keys and runtime CSS-property mapping from that manifest.
3. Use typed part names in the renderer so undeclared parts cannot be introduced accidentally.
4. Generate `docs/reference/customization.md` and the lightweight runtime vocabulary in `src/generated/customization-contract.ts` from the manifest, keeping descriptions out of the browser bundle.
5. Verify that every manifest token has the documented default in `tokens.css`, every prefixed CSS property is declared in the manifest, and the generated file is current.
6. Run the freshness check as part of `pnpm check` and CI.

## TDD slices

1. Prove the three existing CSS-only properties are rejected by the public `theme` type, then expose them through the canonical contract.
2. Prove the generated reference is absent or stale, then implement generation and freshness checking.
3. Prove the rendered part set matches the public contract, then route renderer part names through the manifest.
4. Reconcile the release documents only after package, browser, and generated-reference checks pass.

## Exit gate

- All 23 tokens have a name, default, category, description, CSS declaration, and typed runtime override.
- Every stable rendered part has a name, element description, purpose, and browser assertion.
- A clean checkout fails validation if the generated reference is stale.
- The V1 alpha acceptance gate is marked complete without enabling publication.
