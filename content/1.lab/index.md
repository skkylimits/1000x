---
title: The Lab
description: Experimenten, projecten en sandboxes — een speeltuin zonder vaste structuur.
icon: lucide:flask-conical
scope: self
order: 1
headerLink: true
---

# The Lab

Standalone module zonder children. Dient als header-edge-case: de header rendert dit als directe link in plaats van een dropdown.

## Waarom dit hier staat

Een module met alleen een `index.md` en geen sub-pagina's bewijst dat de tree-build niet vastloopt op een kale scope. De header moet hem detecteren als _zero children_ en de chevron weglaten.
