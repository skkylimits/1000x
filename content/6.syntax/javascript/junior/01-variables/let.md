---
title: let
icon: lucide:square-asterisk
---

# `let`

Block-scoped, herinwijsbaar.

## Basis

```js
let counter = 0
counter += 1
```

## Browser vs Node

::tabs
---
::div{label="Browser"}
In de browser leeft `let` in window-scope wanneer top-level gedeclareerd in een module-script — hoist niet naar `window`.

```js
let userAgent = navigator.userAgent
```
::

::div{label="Node"}
In Node.js gedraagt `let` op module-niveau zich identiek; geen `global`-binding.

```js
let cwd = process.cwd()
```
::
::

## Hoisting

`let`-declaraties worden gehoist maar niet geïnitialiseerd — je krijgt een _temporal dead zone_ tot de declaratie geëvalueerd is.
