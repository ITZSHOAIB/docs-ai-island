# Phase 4: resource Actions

## User behavior

A maintainer can expose an MCP URL, `llms.txt`, installation command, source link, or support destination without a provider-specific core feature.

## Proposed factories

```ts
copyResource({ id, label, value, description?, icon? });
openUrl({ id, label, url, description?, icon? });
```

`value` and `url` accept a literal or a function of current Page Context. URL-valued clipboard resources serialize to `href`.

## TDD cycles

1. RED→GREEN: `copyResource()` copies a literal MCP URL and returns specific success feedback.
2. RED→GREEN: a dynamic value observes updated Page Context after SPA navigation.
3. RED→GREEN: `openUrl()` rejects non-HTTP(S) protocols before navigation.
4. RED→GREEN: labels, descriptions, icons, close behavior, and IDs remain ordinary Action options.

## Exit gate

MCP remains an example of the generic resource primitive; no endpoint is inferred or generated.
