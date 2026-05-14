---
title: var
icon: lucide:archive
---

# `var`

Function-scoped, gehoist en geïnitialiseerd op `undefined`.

```js
console.log(x) // undefined, niet ReferenceError
var x = 5
```

## Waarom je dit moet weten

Niet om te gebruiken — om legacy-code te lezen.
