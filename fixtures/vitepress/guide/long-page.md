---
title: Long-running operations
description: Design resilient operations with cancellation and progress events.
---

# Long-running operations

Long operations should expose cancellation, progress, and explicit completion state.

## Cancellation

Accept an `AbortSignal` and stop work promptly after it is aborted.

## Progress

Emit coarse progress events that remain useful without overwhelming consumers.

## Recovery

Return enough structured context for callers to retry safely.

## Idempotency

Use stable operation identifiers when work can be resumed or replayed.

## Observability

Keep transport details outside business events so consumers can choose their own telemetry stack.

## Cleanup

Release listeners and timers when an operation completes, fails, or is cancelled.

<button class="support-fab" aria-label="Open support">?</button>
