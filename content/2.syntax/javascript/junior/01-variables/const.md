---
title: const
icon: lucide:lock
---

# `const`

Block-scoped, niet herinwijsbaar. De _waarde_ kan wel muteren als het een object is.

```js
const config = { debug: false }
config.debug = true // toegestaan — alleen herinwijzen mag niet
```

## Wanneer kiezen

Default `const`. Pak `let` alleen als je echt herinwijst.
