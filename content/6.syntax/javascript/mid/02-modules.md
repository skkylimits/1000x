---
title: Modules
icon: lucide:package
---

# Modules

ES modules: één file = één module.

## Named exports

```js
export const PI = 3.14
export function area(r) {
  return PI * r ** 2
}
```

## Default export

```js
export default class User {}
```

## Import

```js
import User, { PI } from './user.js'
```
