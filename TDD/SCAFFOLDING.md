# 1000x — Scaffolding instructie

> Copy-paste setup voor het bare 1000x-project. Volg de stappen in volgorde; elke stap is zelfstandig en idempotent. Aan het eind heb je een Nuxt 4 + Nuxt UI v4 + Nuxt Content v3 project met i18n, ESLint, en de eerste markdown-pagina rendert.

---

## 0. Pre-flight

Heb je nodig:

- **Node.js 22.5+** — Nuxt Content v3 gebruikt SQLite; 22.5+ kan native zonder `better-sqlite3`. Anders is `better-sqlite3` als runtime-dep nodig.
- **pnpm** — aanbevolen (sneller, betere monorepo-support). v10+ heeft een approval-stap voor build-scripts; daar lossen we onderaan voor op.
- **Git** — voor de hooks via `simple-git-hooks`.

```bash
node --version    # >= 22.5
pnpm --version    # >= 9
git --version
```

---

## 1. Init project

```bash
pnpm create nuxt@latest 1000x
cd 1000x
```

In de prompt:
- **Package manager**: pnpm
- **Initialize git**: ja
- **Modules**: skip allemaal (we voegen ze handmatig toe — meer controle, geen onverwachte defaults)
- **Official starter**: nee, basic project

Resultaat: bare Nuxt 4 project met `app/`, `nuxt.config.ts`, `package.json`, etc.

---

## 2. Dependencies installeren

**Runtime modules:**

```bash
pnpm add @nuxt/content @nuxt/ui @nuxt/icon @nuxtjs/i18n @vite-pwa/nuxt tailwindcss better-sqlite3
```

**Dev tooling:**

```bash
pnpm add -D @nuxt/eslint @antfu/eslint-config eslint simple-git-hooks lint-staged @iconify-json/lucide @iconify-json/tabler @iconify-json/simple-icons
```

**Pnpm v10+ build-script approval** (anders crasht `better-sqlite3` postinstall):

Voeg toe aan `package.json` op top-level:

```json
"pnpm": {
  "onlyBuiltDependencies": [
    "better-sqlite3",
    "@parcel/watcher",
    "esbuild",
    "simple-git-hooks",
    "vue-demi"
  ]
}
```

Daarna:

```bash
pnpm install
```

---

## 3. Configuratie-files

### `nuxt.config.ts`

Vervang het bestaande met:

```ts
// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
	compatibilityDate: '2026-05-03',
	devtools: { enabled: true },

	modules: [
		'@nuxt/eslint',
		'@nuxt/content',
		'@nuxt/ui',
		'@nuxt/icon',
		'@nuxtjs/i18n',
		'@vite-pwa/nuxt',
	],

	css: ['~/assets/css/main.css'],

	// i18n — NL default, EN secundair
	i18n: {
		defaultLocale: 'nl',
		locales: [
			{ code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
			{ code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
		],
		strategy: 'no_prefix',
		detectBrowserLanguage: false,
	},

	// Iconen lokaal gebundeld; nooit runtime-call naar Iconify CDN
	icon: {
		serverBundle: 'local',
		customCollections: [
			{ prefix: 'kh', dir: './app/components/icons' },
		],
	},

	// Nuxt Content — collection-config zit in content.config.ts
	content: {
		build: {
			markdown: {
				toc: { depth: 3, searchDepth: 3 },
				highlight: {
					theme: { default: 'github-light', dark: 'github-dark' },
				},
			},
		},
	},

	// PWA — registreer alvast, configuratie verfijnen we in Phase 5
	pwa: {
		registerType: 'autoUpdate',
		manifest: {
			name: '1000x',
			short_name: '1000x',
			lang: 'nl',
			theme_color: '#0a0a0a',
		},
		workbox: {
			globPatterns: ['**/*.{js,css,html,ico,png,svg,webp,woff2}'],
		},
	},

	// ESLint module — laat antfu de stylistische source-of-truth zijn
	eslint: {
		config: {
			stylistic: false,
		},
	},

	// Niet voor publiek of zoekmachines — zie spec feature 18
	routeRules: {
		'/**': { headers: { 'X-Robots-Tag': 'noindex, nofollow' } },
	},

	app: {
		head: {
			meta: [
				{ name: 'robots', content: 'noindex, nofollow' },
			],
		},
	},
})
```

### `content.config.ts`

Nieuw bestand in project root:

```ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export default defineContentConfig({
	collections: {
		content: defineCollection({
			type: 'page',
			source: '**/*.md',
			schema: z.object({
				title: z.string(),
				description: z.string().optional(),
				icon: z.string().optional(),
				// Sidebar scope: feature 19
				scope: z.enum(['self', 'children']).optional(),
				// Didactische volgorde voor hoofdstukken: feature 19
				nav: z.array(z.string()).optional(),
				order: z.number().optional(),
				// Variant-tabs: feature 8
				variants: z.array(z.object({
					id: z.string(),
					label: z.string(),
					icon: z.string(),
				})).optional(),
				// Forward compat: feature 1
				schemaVersion: z.number().default(1),
			}),
		}),
	},
})
```

### `eslint.config.mjs`

Nieuw bestand in project root:

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
			'node_modules',
			'public',
			'**/*.md',
		],
	}),
)
```

> **Let op**: bij eerste install bestaat `.nuxt/eslint.config.mjs` nog niet. Run `pnpm dev` of `pnpm postinstall` (`nuxt prepare`) één keer om die te genereren. Daarna werkt ESLint.

### `.editorconfig`

Nieuw bestand in project root:

```
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

### `.vscode/settings.json`

Nieuw bestand in `.vscode/settings.json`:

```json
{
	"editor.formatOnSave": false,
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit",
		"source.organizeImports": "never"
	},
	"eslint.validate": [
		"javascript",
		"javascriptreact",
		"typescript",
		"typescriptreact",
		"vue",
		"html",
		"markdown",
		"json",
		"jsonc",
		"yaml"
	],
	"prettier.enable": false,
	"typescript.tsdk": "node_modules/typescript/lib"
}
```

### `tsconfig.json`

In Nuxt 4 één tsconfig in de root. Vervang met:

```json
{
	"extends": "./.nuxt/tsconfig.json"
}
```

### `app/assets/css/main.css`

Nieuw bestand. Tailwind 4 + Nuxt UI v4 init:

```css
@import "tailwindcss";
@import "@nuxt/ui";

@source "../../../content/**/*";
```

> Het `@source`-pad is `../../../content/**/*` — drie levels omhoog vanaf `app/assets/css/`, dan content/. Niet aanpassen.

### `package.json` — scripts en hooks

Patch je bestaande `package.json` zodat hij dit bevat (merge met wat er al staat):

```json
{
	"scripts": {
		"build": "nuxt build",
		"dev": "nuxt dev",
		"generate": "nuxt generate",
		"preview": "nuxt preview",
		"postinstall": "nuxt prepare && simple-git-hooks",
		"lint": "eslint .",
		"lint:fix": "eslint . --fix",
		"typecheck": "nuxt typecheck"
	},
	"simple-git-hooks": {
		"pre-commit": "pnpm lint-staged"
	},
	"lint-staged": {
		"*.{js,ts,vue,jsx,tsx,json,jsonc,yml,yaml}": "eslint --fix"
	}
}
```

---

## 4. AI-context files

### `AGENTS.md`

Canonical context. Voor Claude Code, Cursor, Codex, en andere agents. Nieuw bestand in project root:

```md
# 1000x — Agent Context

> Canonical AI/agent context. CLAUDE.md en GEMINI.md zijn pointers naar dit bestand.

## Project

**1000x** — bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Doelpubliek: intern, werknemers. Niet voor publiek of zoekmachines.

Zie `spec.md` voor de volledige product-specificatie en `features.md` voor de implementatie-volgorde per fase.

## Stack

- **Framework**: Nuxt 4 (stable; Nuxt 3 EOL juli 2026)
- **UI**: Nuxt UI v4 (`@nuxt/ui` — geünificeerd open-source)
- **Content**: Nuxt Content v3 (markdown, SQLite-backed in productie)
- **i18n**: `@nuxtjs/i18n` — NL default, EN secundair
- **Iconen**: `@nuxt/icon` met lokale Iconify-bundles. Custom SVG's alleen onder `app/components/icons/` als er geen Iconify-icoon bestaat. Geen inline SVG's in components.
- **PWA**: `@vite-pwa/nuxt` — Workbox, cache-as-you-go
- **Code-editor (Phase 4)**: CodeMirror 6
- **Code-execution (Phase 4)**: Web Workers + WASM, runtime per taal
- **Persistentie Phase 1**: localStorage voor drafts en lokale tree-mutaties
- **Persistentie later**: IndexedDB → git PR-flow
- **Deployment Phase 1**: SSG op Cloudflare Pages of Vercel
- **Deployment later**: Dockerized voor Azure/AWS/on-prem

## Repository structuur

```
1000x/
├── app/
│   ├── assets/css/main.css       # Tailwind + Nuxt UI imports
│   ├── components/
│   │   └── icons/                # Custom SVGs only (Iconify is preferred)
│   ├── layouts/
│   ├── pages/
│   ├── app.vue
│   └── app.config.ts
├── content/                      # Markdown content (root level, NIET in app/)
├── i18n/locales/                 # nl.json, en.json
├── public/                       # Static assets, mirrort de content-tree
├── server/                       # Server routes (AI etc., later)
├── content.config.ts             # Nuxt Content collections + frontmatter schema
├── nuxt.config.ts
├── eslint.config.mjs             # withNuxt(antfu({...}))
└── package.json
```

## Dev commands

| Command | Purpose |
|---|---|
| `pnpm dev` | Start dev server op localhost:3000 |
| `pnpm build` | Production build |
| `pnpm generate` | SSG output naar `.output/public/` |
| `pnpm preview` | Preview de productie-build lokaal |
| `pnpm lint` | ESLint check |
| `pnpm lint:fix` | ESLint auto-fix |
| `pnpm typecheck` | TypeScript-check via `nuxt typecheck` |

## Conventies

### Code style

- **Tabs** voor indentatie (size 4 in editor weergave). Geen spaces.
- **Single quotes** voor strings.
- **Geen semicolons** — antfu's preset.
- **No Prettier** — ESLint is alleenheerser via `@antfu/eslint-config`.
- **Vue SFC**: `<script setup lang="ts">` altijd voor nieuwe components.
- **Auto-imports** zijn aan — gebruik `useRouter`, `ref`, `computed` zonder import.

### Iconen

- Eerste keuze: een Iconify-set die al geïnstalleerd is (`lucide`, `tabler`, `simple-icons`). Refereren als `lucide:search`, `tabler:code`, `simple-icons:javascript`.
- Niet beschikbaar in een set? Voeg een nieuwe Iconify-set als devDependency toe (`@iconify-json/<set>`) — niet zelf SVG's downloaden.
- Geen passende Iconify-icoon? Maak een Vue-component in `app/components/icons/` en register als custom collection met prefix `kh:`.
- **Nooit inline SVG-strings** in andere components.

### Content / markdown

- Frontmatter velden zijn gevalideerd via Zod-schema in `content.config.ts`. Onbekende velden → dev warning, geen crash.
- Filenames blijven inhoudelijk (`closures.md`, niet `1.intro.md`). Volgorde via `nav: [...]` in `index.md` van een directory.
- Iedere directory met `scope: self` of `scope: children` is een sidebar-grens. Zie spec feature 19.
- Variants: `closures.junior.nl.md`, `closures.mid.nl.md` etc. Eén logische node in de nav-tree.
- Assets in `public/` mirrort de content-tree: `public/syntax/javascript/closures/figure-1.png`.

### i18n

- UI-strings in `i18n/locales/{lang}.json` — geen hardcoded strings in components.
- Content per taal: `page.nl.md`, `page.en.md`. Default `nl`.
- LocalStorage-keys bevatten `{lang}`: `draft:nl:syntax/javascript/closures`.

## Architectuur-grenzen

- **Markdown is de bron van waarheid**. Geen content-database; database komt later voor non-content (gebruikers, comments, audit logs).
- **Phase 1 = lokaal-first**: drafts en tree-mutaties in localStorage. Geen netwerk-dependency.
- **AI is geïsoleerd**: een AI-uitval mag nooit andere features raken. Zie spec feature 12.
- **Privé-deployment**: `robots.txt` Disallow + meta noindex + auth-gate in alle deployed envs. Zie spec feature 18.

## Niet doen

- Geen `.navigation.yml`-bestanden — nav-tree komt uit filesystem + frontmatter + localStorage. Zie spec feature 19.
- Geen Prettier installeren of configureren.
- Geen runtime-fetches naar Iconify CDN — `serverBundle: 'local'` is verplicht.
- Geen content scrapen of regurgiteren in AI-features (copyright).
- Geen telemetry in Phase 1; pas in latere fases. Architectuur staat het toe maar implementeren komt later.
```

### `CLAUDE.md`

Pointer-bestand:

```md
# CLAUDE

Lees `AGENTS.md` voor de canonical project-context.
```

### `GEMINI.md`

```md
# GEMINI

Lees `AGENTS.md` voor de canonical project-context.
```

---

## 5. Folder-structuur aanvullen

`pnpm create nuxt` heeft de meeste mappen al gemaakt. Vul aan:

```bash
mkdir -p app/assets/css
mkdir -p app/components/icons
mkdir -p app/layouts
mkdir -p app/pages
mkdir -p content
mkdir -p i18n/locales
mkdir -p public
mkdir -p server
```

---

## 6. Eerste content + page

### `i18n/locales/nl.json`

```json
{
	"app": {
		"title": "1000x",
		"loading": "Laden..."
	}
}
```

### `i18n/locales/en.json`

```json
{
	"app": {
		"title": "1000x",
		"loading": "Loading..."
	}
}
```

### `content/index.md`

```md
---
title: Welkom bij 1000x
description: Documentatie- en leersysteem voor het team
---

# Welkom bij 1000x

Dit is de eerste pagina, gerenderd door Nuxt Content. Als je dit ziet, werkt de
markdown-pipeline.

## Wat nu?

Volg de implementatie-roadmap uit `features.md`. Phase 1 zit nog in opbouw —
deze pagina is alleen een smoke-test.

## Code-block check

Een snippet om te zien of syntax highlighting werkt:

\`\`\`ts
const greet = (name: string) => `hoi ${name}`
console.log(greet('wereld'))
\`\`\`
```

> Vervang de `\`\`\`` rond het code-block met echte triple-backticks. Dit is markdown-escape-noise omdat dit document zelf markdown is.

### `app/app.vue`

Vervang met:

```vue
<template>
	<UApp>
		<NuxtPage />
	</UApp>
</template>
```

### `app/pages/index.vue`

Nieuw bestand:

```vue
<script setup lang="ts">
const { data: home } = await useAsyncData('home', () =>
	queryCollection('content').path('/').first(),
)

useSeoMeta({
	title: () => home.value?.title,
	description: () => home.value?.description,
})
</script>

<template>
	<div class="mx-auto max-w-3xl px-6 py-12 prose dark:prose-invert">
		<ContentRenderer v-if="home" :value="home" />
		<div v-else>
			{{ $t('app.loading') }}
		</div>
	</div>
</template>
```

---

## 7. Eerste run

```bash
pnpm dev
```

Open http://localhost:3000.

**Verwacht resultaat:**
- _"Welkom bij 1000x"_ als H1
- Beschrijving + tekst eronder gerenderd
- Code-block met syntax highlighting (github-light/dark afhankelijk van system theme)
- Geen errors in console

**Sanity-checks** in een tweede terminal:

```bash
pnpm lint        # zou 0 errors moeten geven
pnpm typecheck   # zou 0 errors moeten geven
```

---

## 8. Eerste commit

```bash
git add .
git commit -m "chore: scaffold 1000x on nuxt 4 + nuxt ui v4 + nuxt content v3"
```

De `simple-git-hooks` postinstall heeft de pre-commit hook geïnstalleerd; bij toekomstige commits draait `lint-staged` automatisch op gewijzigde files.

---

## Wat hierna

Phase 1 uit `features.md`:
1. **Markdown rendering & content-engine** — uitbreiden met tabs, callouts, asset-conventie. Reeds basis werkend.
2. **Section sidebar** — bouwen op `queryCollectionNavigation` met scope-rendering. Kern van Phase 1.
3. **Header met dropdown-menu's** — categorieën uit content-tree, geen hardcoded array.
4. **Internationalisatie** — i18n-strings naar de UI-componenten als ze gebouwd worden.

Voor elk: nieuwe component-tree onder `app/components/`, layouts in `app/layouts/`, en frontmatter-velden uitbreiden in `content.config.ts` als nodig.

---

## Gotchas die ik tegenkwam tijdens onderzoek

- **`@nuxt/ui` v4 = vroeger Pro + open-source samen.** Je hoeft `@nuxt/ui-pro` niet meer te installeren of te betalen.
- **`@source` pad in main.css**: `../../../content/**/*` — drie levels — komt door Nuxt 4's `app/`-srcDir.
- **Pnpm v10 build-script approval**: zonder `pnpm.onlyBuiltDependencies` in package.json crasht `better-sqlite3`'s native binding postinstall.
- **`.nuxt/eslint.config.mjs` bestaat pas na `nuxt prepare`**: dus ESLint werkt pas na een eerste `pnpm dev` of `pnpm postinstall`.
- **Native SQLite** kan ook (Node 22.5+) door `experimental: { nativeSqlite: true }` toe te voegen aan de content-config — scheelt een 4 MB native dep maar is experimenteel.
- **`tsconfig.json` is één bestand in Nuxt 4**, niet meerdere zoals in Nuxt 3. Extends `./.nuxt/tsconfig.json`.
