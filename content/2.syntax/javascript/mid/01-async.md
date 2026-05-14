---
title: Async
icon: lucide:hourglass
---

# Async

Promises, async/await, en de event loop.

## Promise-basis

```js
fetch('/api/users')
  .then(r => r.json())
  .then(users => console.log(users))
```

## async/await

```js
const users = await fetch('/api/users').then(r => r.json())
```

## Error-handling

`try/catch` rond `await` — promises rejecten met een error-object.
