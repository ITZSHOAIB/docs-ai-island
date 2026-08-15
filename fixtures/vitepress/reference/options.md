---
title: Client options
description: Configure retries, timeouts, and transport behavior.
canonical: https://docs.northstar.example/reference/client-options
---

# Client options

The client accepts a small set of explicit options.

| Option | Type | Default |
| --- | --- | --- |
| `endpoint` | `string` | Required |
| `timeout` | `number` | `10_000` |
| `retries` | `number` | `2` |

## Timeout behavior

Timeouts abort the active request and surface a typed error to the caller.

Return to [getting started](/guide/getting-started).

<button class="support-fab" aria-label="Open support">?</button>
