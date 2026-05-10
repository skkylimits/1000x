---
title: Memory
icon: lucide:database
---

# Memory

Garbage collection, heap, en lekken.

## Mark-and-sweep

V8 (Chrome, Node) gebruikt generational mark-and-sweep. Korte-leven objecten in young space, lange-leven in old space.

## Veelvoorkomende lekken

- Globale variabelen
- Detached DOM nodes
- Closures die te veel vasthouden
- setInterval die nooit cleared wordt

## Profilen

Chrome DevTools → Memory → Heap snapshot.
