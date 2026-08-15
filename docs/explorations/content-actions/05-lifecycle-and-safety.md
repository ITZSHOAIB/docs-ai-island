# Phase 5: lifecycle and safety

## Risks

- Clipboard writes can be unavailable or denied.
- A route change, second Action, controller update, or destroy can make pending content stale.
- Error events can accidentally expose content or sensitive URLs.
- A late async completion can overwrite feedback from a newer Action.

## TDD cycles

1. RED→GREEN: clipboard denial announces localized failure and emits one `action-error` without content.
2. RED→GREEN: starting another Action aborts the prior source; its late result cannot copy or announce.
3. RED→GREEN: update and destroy abort pending source work and suppress late effects.
4. RED→GREEN: success/error events expose Action identity but never copied text.
5. RED→GREEN: consumer callbacks throwing cannot break cleanup.

## Refactor checkpoint

Only after all lifecycle tests are GREEN, consolidate Action execution around one local operation object containing its own controller, page snapshot, and completion guard. Run the complete browser suite after each refactor.

## Exit gate

Every asynchronous result belongs to the active Action and Page Context, failure feedback is accurate, and no content appears in lifecycle events.
