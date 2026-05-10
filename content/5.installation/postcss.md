---
title: PostCSS
icon: simple-icons:postcss
---

# PostCSS

## Setup

Voor projecten met PostCSS als CSS-pipeline.

```bash
pnpm add -D postcss postcss-cli
```

## Configuratie

`postcss.config.js`:

```js
module.exports = {
  plugins: {
    '@1000x/postcss': {}
  }
}
```
