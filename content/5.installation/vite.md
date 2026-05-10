---
title: Vite
icon: simple-icons:vite
---

# Vite

## Setup

Voor projecten met Vite als bundler.

```bash
pnpm create vite@latest my-app
cd my-app
pnpm install
```

## Configuratie

Voeg de plugin toe aan `vite.config.ts`.

### Plugin-volgorde

Belangrijk: 1000x-plugin moet vóór `@vitejs/plugin-vue` staan.

### Environment variabelen

Stel `VITE_PUBLIC_PATH` in voor sub-paths.
