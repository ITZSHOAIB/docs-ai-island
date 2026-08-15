---
title: Getting started
description: Install and configure your first Northstar client.
---

# Getting started

Create a client and connect it to your application in less than five minutes.

## Install

```sh
pnpm add @northstar/sdk
```

## Create a client

```ts
import { createClient } from '@northstar/sdk'

const client = createClient({
  endpoint: 'https://api.example.com',
})
```

Navigate to [client options](/reference/options) to test that the AI Island follows VitePress route changes without remounting.

<button class="support-fab" aria-label="Open support">?</button>
