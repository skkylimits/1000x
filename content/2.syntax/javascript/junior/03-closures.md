---
title: Closures
icon: lucide:box
---

# Closures

Een functie onthoudt de scope waarin hij is gedefinieerd, ook nadat de outer-functie returned is.

## Klassiek voorbeeld

```js
function counter() {
  let n = 0
  return () => ++n
}

const tick = counter()
tick() // 1
tick() // 2
```

## Wanneer dit nuttig is

- Privé state zonder classes
- Module-pattern
- Currying en partial application
