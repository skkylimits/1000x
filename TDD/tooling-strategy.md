# Tooling-strategie — clean code zonder clashes

## Mentaal model

| Tool | Concern |
|---|---|
| `.editorconfig` | Wat je editor typt terwijl je werkt (indent, EOL, encoding) |
| `eslint.config.mjs` | **Bron-van-waarheid**: wat de code MOET zijn |
| `.vscode/settings.json` | Hoe VS Code met de bovenstaande omgaat (executor) |
| `.vscode/extensions.json` | Welke extensies iedereen heeft (uniforme onboarding) |
| `AGENTS.md` / `CLAUDE.md` | Hoe AI-tools binnen deze regels werken |

**Eén regel**: ESLint is de bron-van-waarheid. EditorConfig matcht ESLint. VS Code voert ESLint uit. Geen Prettier als tweede stem.

## Wat ik in je repo zag

Editorconfig en eslint zijn al goed opgezet:

- **editorconfig**: tab indents (size 4), LF, UTF-8, trim trailing, final newline. CRLF override voor `.bat`/`.cmd`. Geen trim voor `.md`/`.txt`.
- **eslint**: `@antfu/eslint-config` met stylistic `tab`/single/no-semi, Vue + TS, ignores voor build-folders en `content/**/*.md`, formatters voor css/html, twee specifieke rules off.

Twee dingen die schuren:

1. **`markdown: 'prettier'` in formatters**, terwijl je comment "uitgeschakeld" zegt. Dat is een tegenstrijdigheid die later voor verwarring zorgt — kies één.
2. **Prettier als hybride** voor markdown maakt clash-risico echt. Antfu's stylistic-laag is er juist om Prettier overbodig te maken; één van de twee uit.

## De vier clash-punten en hoe ze opgelost zijn

### 1. EditorConfig vs ESLint stylistic
Beide beheren indent/EOL/whitespace — ze **moeten identiek** zijn ingesteld.

| Setting | EditorConfig | ESLint | Status |
|---|---|---|---|
| Indent | `tab` | `'tab'` | matched |
| EOL | `lf` | unix (antfu default) | matched |
| Trim trailing | `true` | `no-trailing-spaces` | matched |
| Final newline | `true` | `eol-last` | matched |

Geen verandering nodig. Niet rommelen.

### 2. Prettier vs ESLint
Antfu's stylistic-laag doet wat Prettier doet, om precies dit conflict te voorkomen. Markdown is geen code — leave it alone.

**Aktie**: `markdown: 'prettier'` weghalen, geen Prettier-extensie installeren, `content/**/*.md` blijft genegeerd.

### 3. VS Code default formatter
Als Prettier-extensie geïnstalleerd is pikt VS Code die als default; format-on-save met Prettier vecht met ESLint.

**Aktie**: ESLint als default formatter voor alle relevante file-types, `editor.formatOnSave: false`, en `editor.codeActionsOnSave: { "source.fixAll.eslint": "explicit" }` zodat ESLint formatteert bij save. Eén tool, één moment.

### 4. Concurrent CSS/Stylelint
Antfu's `formatters.css: true` regelt CSS. Geen aparte Stylelint nodig.

**Aktie**: Stylelint-extensie en -config achterwege laten.

## Concrete configs

### `.editorconfig` — ongewijzigd
Je huidige versie blijft. Niet aanraken.

### `eslint.config.mjs` — cleanup

```js
import antfu from '@antfu/eslint-config'

export default antfu({
  type: 'app',
  stylistic: {
    indent: 'tab',
    quotes: 'single',
    semi: false,
  },
  vue: true,
  typescript: true,
  ignores: [
    '.nuxt',
    '.output',
    'node_modules',
    'dist',
    'coverage',
    'content/**/*.md',  // content is geen code
    'public/**',         // assets niet linten
  ],
  formatters: {
    css: true,
    html: true,
    // markdown bewust uit — content, geen code
  },
  rules: {
    'node/prefer-global/process': 'off',
    'no-restricted-globals': 'off',
  },
})
```

Wijzigingen: markdown-formatter regel verwijderd (consistent met intent), `public/**` aan ignores.

### `.vscode/settings.json` — volledig

```jsonc
{
  // ESLint als enige formatter — geen Prettier, geen ingebouwde
  "editor.formatOnSave": false,
  "editor.codeActionsOnSave": {
    "source.fixAll.eslint": "explicit",
    "source.organizeImports": "never"
  },

  // ESLint flat config (Nuxt 4 / antfu)
  "eslint.useFlatConfig": true,
  "eslint.validate": [
    "javascript",
    "typescript",
    "vue",
    "html",
    "css",
    "json",
    "jsonc",
    "yaml"
  ],

  // ESLint default formatter per type
  "[javascript]":     { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[typescript]":     { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[vue]":            { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[json]":           { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[jsonc]":          { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[yaml]":           { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[css]":            { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },
  "[html]":           { "editor.defaultFormatter": "dbaeumer.vscode-eslint" },

  // Markdown blijft met rust — content of doc, geen code
  "[markdown]": {
    "editor.formatOnSave": false,
    "editor.defaultFormatter": null,
    "files.trimTrailingWhitespace": false
  },

  // Disable concurrente formatters expliciet
  "prettier.enable": false,
  "stylelint.enable": false,

  // Match editorconfig
  "files.eol": "\n",
  "files.trimTrailingWhitespace": true,
  "files.insertFinalNewline": true,

  // File nesting — explorer wordt rustiger
  "explorer.fileNesting.enabled": true,
  "explorer.fileNesting.expand": false,
  "explorer.fileNesting.patterns": {
    "package.json": ".editorconfig, .gitignore, .npmrc, .nvmrc, .vscode*, eslint.config.*, tsconfig*, vitest.config.*, nuxt.config.*, content.config.*, pnpm-*.yaml, renovate.json, vercel.json, .env*",
    "*.vue": "$(capture).story.vue, $(capture).spec.ts, $(capture).test.ts",
    "*.ts": "$(capture).spec.ts, $(capture).test.ts"
  },

  // Tailwind IntelliSense binnen Nuxt UI's `ui:` props en class:list-strings
  "tailwindCSS.experimental.classRegex": [
    ["ui:\\s*{([^)]*)\\s*}", "[\"']([^\"']*)[\"']"]
  ]
}
```

### `.vscode/extensions.json` — recommended-set met expliciete unwanted

```jsonc
{
  "recommendations": [
    "dbaeumer.vscode-eslint",
    "vue.volar",
    "editorconfig.editorconfig",
    "bradlc.vscode-tailwindcss",
    "antfu.iconify",
    "yoavbls.pretty-ts-errors",
    "yzhang.markdown-all-in-one"
  ],
  "unwantedRecommendations": [
    "esbenp.prettier-vscode",
    "octref.vetur",
    "stylelint.vscode-stylelint"
  ]
}
```

`unwantedRecommendations` is het belangrijkste verschil met een doorsnee setup — VS Code waarschuwt actief als iemand Prettier installeert in deze workspace, zodat de afspraak ook in praktijk overeind blijft.

## AI-agent consistency

Je hebt al `CLAUDE.md`, `AGENTS.md`, `GEMINI.md` in de repo. Voeg daar dit blok in op een prominente plek:

```md
## Code style & linting

- **Bron-van-waarheid: ESLint** via `@antfu/eslint-config`. Niet handmatig formatteren.
- **Verplicht vóór commit**: `pnpm lint --fix` en `pnpm typecheck`.
- Geen Prettier. Antfu's stylistic-laag dekt formatting; voeg geen Prettier-config of -extensie toe.
- Tab indents, single quotes, geen semicolons.
- Vue SFCs: `<script setup lang="ts">`, Composition API alleen.
- Imports: gebruik bestaande aliassen (`~/`, `#imports`), geen relatieve `../../`-paden.
- Bestandsnamen: `kebab-case.vue`/`kebab-case.ts` voor utilities/composables, `PascalCase.vue` voor components.
- Iconen: alléén via `<Icon name="lucide:..." />` — geen inline `<svg>` tenzij echt geen Iconify-equivalent bestaat (zie spec.md feature 19).
- Markdown content in `content/` wordt **niet** gelint of geformatteerd. Niet aanraken zonder expliciete user-instructie.

Bij twijfel: `pnpm lint --fix` draaien, niet handmatig fixen.
```

Dit voorkomt dat een AI-agent uit gewoonte Prettier installeert, een eigen stijl forceert, of content reformat.

## Samengevat

- Eén bron-van-waarheid (ESLint), drie executors (editor, IDE, CI).
- `.editorconfig` blijft ongewijzigd.
- `eslint.config.mjs`: markdown-formatter weg, `public/**` aan ignores.
- Nieuwe `.vscode/settings.json`: ESLint enige formatter, format-on-save uit, code-actions-on-save aan, markdown met rust gelaten.
- Nieuwe `.vscode/extensions.json` met expliciete `unwantedRecommendations` zodat Prettier en Stylelint er niet stiekem terug insluipen.
- `AGENTS.md` / `CLAUDE.md` uitgebreid met de "geen Prettier, run lint --fix"-regel zodat AI's consistent meebewegen.
