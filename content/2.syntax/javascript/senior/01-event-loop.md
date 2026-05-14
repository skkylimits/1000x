---
title: Event Loop
icon: lucide:rotate-cw
---

# Event Loop

Hoe JavaScript single-threaded async werk doet zonder te blokkeren.

## Call stack

LIFO van function-frames. Elke call duwt een frame, elke return popt 'm.

## Macro- en microtasks

- Microtasks: Promise callbacks, queueMicrotask
- Macrotasks: setTimeout, setInterval, I/O

Microtasks draaien tot leeg vóór de volgende macrotask.

## requestAnimationFrame

Aparte queue, gesynchroniseerd met de browser's repaint.
