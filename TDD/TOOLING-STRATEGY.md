# Tooling-strategie — clean code zonder clashes

> Diepe duik in de code-quality tooling van het 1000x project. `SCAFFOLDING.md` sectie 7 levert de minimum werkende setup om foundation door te komen; dit document is de uitgebreide referentie met alle configuraties, beslissingen en achtergrond. Lees dit zodra je de minimale setup hebt staan en je tooling wilt finetunen, of wanneer je een teamlid wilt onboarden.

---

## Context: template-baseline

Het 1000x project start vanaf de Nuxt UI docs-template. Die template komt met zijn eigen ESLint config en VS Code settings. Tijdens foundation (zie `SCAFFOLDING.md` sectie 7) vervangen we die met onze eigen versie. Dit document beschrijft de **eindstate** waarin alles consistent samenwerkt.

---

## Mentaal model

| Tool | Concern |
|---|---|
| `.editorconfig` | Wat je editor typt terwijl je werkt (indent, EOL, encoding) |
| `eslint.config.mjs` | **Bron-van-waarheid**: wat de code MOET zijn |
| `.vscode/settings.json` | Hoe VS Code met de bovenstaande omgaat (executor) |
| `.vscode/extensions.json` | Welke extensies iedereen heeft (uniforme onboarding) |
| `AGENTS.md` / `CLAUDE.md` | Hoe AI-tools binnen deze regels werken |

**Eén regel**: ESLint is de bron-van-waarheid. EditorConfig matcht ESLint. VS Code voert ESLint uit. Geen Prettier als tweede stem, geen Stylelint als derde.

---

## Vier ontwerp-keuzes

### 1. EditorConfig en ESLint stylistic identiek

Beide beheren indent/EOL/whitespace. Als ze niet matchen, vecht je editor met je linter en zie je formatting flippen tijdens save. Daarom worden ze één-op-één afgestemd:

| Setting | EditorConfig | ESLint | Status |
|---|---|---|---|
| Indent | `tab` | `'tab'` | matched |
| EOL | `lf` | unix (antfu default) | matched |
| Trim trailing | `true` | `no-trailing-spaces` | matched |
| Final newline | `true` | `eol-last` | matched |

Niet rommelen. Wijziging in één betekent wijziging in beide.

### 2. Geen Prettier

Antfu's stylistic-laag dekt wat Prettier dekt. Bewust geen tweede formatter zodat ze elkaar niet kunnen overrulen op save. Markdown is bewust uitgesloten van linting/formatting — content is geen code.

### 3. ESLint als VS Code default formatter

Eén tool, één moment. `format-on-save` staat **uit**, `code-actions-on-save` staat aan met `source.fixAll.eslint: explicit`. Per relevant file-type is ESLint expliciet de default formatter — dan kan een Prettier-extensie ook na installatie niet stiekem overnemen.

### 4. Geen Stylelint

Antfu's `formatters.css: true` regelt CSS. Geen aparte tool, geen aparte config, geen extra extensie. CSS gaat door dezelfde flow als alle andere code.

---

## Hook-management

Git-hooks worden **declaratief beheerd via `simple-git-hooks`** in `package.json`, niet handmatig in `.git/hooks/`. Setup is reproducible, review-baar en overleeft elke fresh clone.

`package.json`:

```json
{
	"simple-git-hooks": {
		"pre-commit": "pnpm lint-staged"
	},
	"lint-staged": {
		"*.{js,ts,vue,jsx,tsx,json,jsonc,yml,yaml}": "eslint --fix"
	},
	"scripts": {
		"postinstall": "simple-git-hooks"
	}
}
```

`simple-git-hooks` schrijft de hook-files tijdens `postinstall`. De hook roept `lint-staged` aan, dat alleen ESLint-fix draait op staged-files (snel, niet de hele repo). Beide tools zitten in `devDependencies`:

```bash
pnpm add -D simple-git-hooks lint-staged
```

**Geen handmatige `.git/hooks/`-files plaatsen**. Symptomen van een leftover-hook (overgebleven uit een eerdere setup of een agent die "fix" handmatig deed): commit faalt met `pnpm: not found` of `lint-staged: not found` op een fresh clone, of de hook draait tools die niet in `package.json` staan.

**Fix bij stale leftover**:

```bash
rm .git/hooks/pre-commit
pnpm install   # postinstall regenereert de hook vanaf package.json-config
```

Waarom declaratief boven handmatig:

- **Reproducible**: package.json is de single source. Iedere clone krijgt dezelfde hook
- **Review-baar**: hook-config is onderdeel van git-history en PR-diffs; manual hooks zijn onzichtbaar voor code-review
- **Geen broken tools**: lint-staged + simple-git-hooks zitten in `devDependencies`, dus de hook kan niets aanroepen wat niet geïnstalleerd is
- **Survives `git rm -rf .git && git init`**: bij een refactor van git-history blijft de hook-config in package.json staan; een handmatige hook moet je opnieuw schrijven

---

## Concrete configs

### `.editorconfig`

```ini
# https://editorconfig.org
root = true

[*]
indent_style = tab
indent_size = 4
end_of_line = lf
charset = utf-8
trim_trailing_whitespace = true
insert_final_newline = true

[*.{md,txt}]
trim_trailing_whitespace = false

[*.{bat,cmd}]
end_of_line = crlf
```

Markdown-bestanden behouden trailing whitespace omdat dat in markdown betekenisvol is (regel-eind dubbele spatie = harde break). Windows batch-bestanden krijgen CRLF omdat oudere CMD-shells daar moeite mee hebben.

### `eslint.config.mjs`

```js
// @ts-check
import antfu from '@antfu/eslint-config'
import withNuxt from './.nuxt/eslint.config.mjs'

export default withNuxt(
	antfu({
		type: 'app',
		vue: true,
		typescript: true,
		stylistic: {
			indent: 'tab',
			quotes: 'single',
			semi: false,
		},
		ignores: [
			'.nuxt',
			'.output',
			'.data',
			'dist',
			'coverage',
			'node_modules',
			'public',
			'**/*.md', // content is geen code
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
	}),
)
```

> **Belangrijk**: bij eerste install bestaat `.nuxt/eslint.config.mjs` nog niet — die genereert Nuxt zelf bij `nuxt prepare`. Run `pnpm dev` of `pnpm postinstall` één keer om hem aan te maken. Daarna werkt ESLint.

### `.vscode/settings.json`

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

	// ESLint default formatter per file-type
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
	],

	"typescript.tsdk": "node_modules/typescript/lib"
}
```

Drie minder-voor-de-hand-liggende settings die wel veel waard zijn:

- **`explorer.fileNesting`** — `nuxt.config.ts`, `tsconfig.json`, `eslint.config.mjs`, `.editorconfig`, `pnpm-lock.yaml` etc. nesten allemaal onder `package.json` zodat de Explorer niet vol staat met config-files. Tests en stories nesten onder hun source-file.
- **`tailwindCSS.experimental.classRegex`** — Nuxt UI v4 gebruikt `ui:{...}` props om component-styling te overrulen. Zonder deze regex herkent Tailwind IntelliSense die strings niet en mis je autocomplete op alle theme-tweaks. Echt belangrijk in onze stack.
- **`source.organizeImports: never`** — voorkomt dat VS Code's organize-imports per save vecht met antfu's import-volgorde regels. ESLint regelt het, niemand anders.

### `.vscode/extensions.json`

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

`unwantedRecommendations` is het belangrijkste verschil met een doorsnee setup. VS Code waarschuwt actief als iemand Prettier of Stylelint installeert in deze workspace, zodat de tooling-afspraak ook in praktijk overeind blijft. Vetur is mee-genoemd als legacy Vue 2 extensie die niet meer past bij Vue 3 + Volar.

---

## AI-agent consistency

In `AGENTS.md` (en daarmee in `CLAUDE.md` / `GEMINI.md` via de pointers) hoort dit blok op een prominente plek:

```md
## Code style & linting

- **Bron-van-waarheid: ESLint** via `@antfu/eslint-config`. Niet handmatig formatteren.
- **Verplicht vóór commit**: `pnpm lint --fix` en `pnpm typecheck`.
- Geen Prettier. Antfu's stylistic-laag dekt formatting; voeg geen Prettier-config of -extensie toe.
- Tab indents, single quotes, geen semicolons.
- Vue SFCs: `<script setup lang="ts">`, Composition API alleen.
- Imports: gebruik bestaande aliassen (`~/`, `#imports`), geen relatieve `../../`-paden.
- Bestandsnamen: `kebab-case.vue` / `kebab-case.ts` voor utilities/composables, `PascalCase.vue` voor components.
- Iconen: alléén via `<Icon name="lucide:..." />` — geen inline `<svg>` tenzij echt geen Iconify-equivalent bestaat (zie `spec.md` Markdown rendering, customization 01 in 02-TEMPLATE).
- Markdown content in `content/` wordt **niet** gelint of geformatteerd. Niet aanraken zonder expliciete user-instructie.

Bij twijfel: `pnpm lint --fix` draaien, niet handmatig fixen.
```

Dit voorkomt dat een AI-agent uit gewoonte Prettier installeert, een eigen stijl forceert, of content reformat tegen onze regels in.

---

## Samengevat

- **Eén bron-van-waarheid** (ESLint), drie executors (editor, IDE, CI)
- **`.editorconfig` matcht ESLint stylistic** — niet uit elkaar laten lopen
- **`eslint.config.mjs`** — `withNuxt(antfu({...}))` met tab/single-quote/no-semi, formatters voor css/html, markdown bewust uit
- **`.vscode/settings.json`** — ESLint enige formatter, format-on-save uit, code-actions-on-save aan, file nesting, Tailwind class regex voor Nuxt UI's `ui:` props
- **`.vscode/extensions.json`** — recommendations + `unwantedRecommendations` zodat Prettier en Stylelint actief geweerd worden
- **`AGENTS.md`** — code-style block zodat AI's consistent meebewegen

`SCAFFOLDING.md` sectie 7 levert de minimum werkende versie. Dit document is de uitgewerkte eindstate. Beide nodig: eerst de minimum om foundation door te komen, dan deze om de tooling op niveau te brengen.