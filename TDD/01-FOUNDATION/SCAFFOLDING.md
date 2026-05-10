# 1000x — Scaffolding (template-aanpak)

> Setup-instructies om vanaf nul tot een gebrand, draaiend 1000x-project te komen op basis van de **Nuxt UI docs-template**. Aan het eind van dit document heb je een werkende site met 1000x-branding, NL/EN i18n, het uitgebreide content-schema, en een eerste eigen pagina. Geen scope-bound sidebar, geen levels of tabs, geen layout-chrome — die komen in de _customizations_-fase, zie `02-TEMPLATE/`.

> **Niet vergeten**: dit is een fundamentele wijziging ten opzichte van de oorspronkelijke scratch-aanpak. Die blijft beschikbaar als referentie in `archief/`, maar wordt niet meer gevolgd.

---

## Filosofie

De Nuxt UI docs-template levert al een hoop dat in onze spec staat — markdown rendering, code blocks, prose components, search, dark mode, auto-sidebar, AI MCP-integratie. Vanaf nul beginnen is herontdekken wat zij hebben opgelost. Wij gebruiken hun werk als baseline en focus al onze energie op wat 1000x echt onderscheidend maakt.

Drie soorten werk staan naast elkaar in dit project, en het is belangrijk dat je weet wat waar hoort:

1. **Foundation** (`01-FOUNDATION/`) — dit document. Eénmalig: branding, i18n, schema, AI-context, content-stubs. Niet feature-bound.
2. **Template customizations** (`02-TEMPLATE/`) — dertien customizations waar de Nuxt UI docs-template of Nuxt Content iets anders doet dan onze spec voorschrijft (sidebar, header, levels, tabs, page-chrome, right-panel, smart-toc, changelog, prev-next, search, math/diagrammen, image-lightbox).
3. **Eigen features** (`03-FEATURES/`) — tien features die de template niet levert (code-editor, card-trainer, AI-assistent, etc.) en doorgaans nieuwe libraries of state-management meebrengen.

---

## 0. Pre-flight

Heb je nodig:

- **Node.js 22.5+** — Nuxt Content v3 gebruikt SQLite; 22.5+ kan native zonder `better-sqlite3`
- **pnpm 10+** — aanbevolen door de template
- **Git** — voor versie-beheer
- **GitHub CLI (`gh`)** — voor auth zonder tokens te hoeven beheren

```bash
node --version    # >= 22.5
pnpm --version    # >= 10
git --version
gh --version
```

Mis je iets? Installeer eerst voor je verder gaat. Voor WSL: `sudo apt install gh`, daarna `gh auth login`.

## 1. Template clonen

```bash
cd ~/HELL                                                    # of waar je projecten leven
git clone https://github.com/nuxt-ui-templates/docs.git 1000x
cd 1000x
rm -rf .git                                                  # template's git-history weg
git init -b main                                             # eigen history beginnen
```

Dit is je vertrekpunt. Vanaf nu is dit `1000x`, niet meer een fork van de template.

```bash
pnpm install
pnpm dev
```

Open `localhost:3000`. Je ziet de Nuxt UI demo-docs draaien. Klik even rond, zodat je weet wat de template kan voordat je gaat tweaken.

---

## 2. Branding

De eerste customization: maak het van Nuxt UI naar 1000x.

### `app.config.ts`

Zet primary op rood:

```ts
export default defineAppConfig({
	ui: {
		colors: {
			primary: 'red',
			neutral: 'slate',
		},
	},
})
```

### Logo en branding-strings

Vind in de template de plek waar het logo wordt gerenderd (waarschijnlijk een component in `app/components/` met een `Logo.vue` of vergelijkbare naam). Vervang met de 1000x-stijl: een rode `1` gevolgd door default-foreground `000x`. Bijvoorbeeld:

```vue
<template>
	<NuxtLink to="/" class="text-lg font-semibold tracking-tight">
		<span class="text-primary">1</span>
		<span>000x</span>
	</NuxtLink>
</template>
```

### Site-titel en meta

Update in `nuxt.config.ts` of `app.config.ts` waar de template z'n eigen titel zet. Vervang met:

```ts
seo: {
	siteName: '1000x',
},
```

En voeg de noindex-headers toe (1000x is auth-gated, niet voor zoekmachines — zie spec feature 09 in 03-FEATURES):

```ts
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
```

---

## 3. i18n — NL default, EN secondary

Voeg `@nuxtjs/i18n` toe als de template het nog niet heeft:

```bash
pnpm add @nuxtjs/i18n
```

In `nuxt.config.ts`:

```ts
modules: [
	// ... bestaande modules van de template
	'@nuxtjs/i18n',
],

i18n: {
	defaultLocale: 'nl',
	locales: [
		{ code: 'nl', language: 'nl-NL', file: 'nl.json', name: 'Nederlands' },
		{ code: 'en', language: 'en-US', file: 'en.json', name: 'English' },
	],
	strategy: 'no_prefix',
	detectBrowserLanguage: false,
},
```

Maak `i18n/locales/nl.json`:

```json
{
	"app": {
		"title": "1000x",
		"loading": "Laden..."
	}
}
```

En `i18n/locales/en.json`:

```json
{
	"app": {
		"title": "1000x",
		"loading": "Loading..."
	}
}
```

Strings in components vervangen met `$t('app.loading')` etc. Geen hardcoded UI-text meer.

> **Belangrijk om te weten**: de template-content (markdown files in `content/`) is nu nog Engels. Die ga je later vervangen — eerst je eigen content laten verschijnen, dan zorgen voor NL/EN-versies via `*.nl.md` en `*.en.md`. Volgt in template.

---

## 4. Content schema uitbreiden

De template heeft een eigen `content.config.ts`. Open die en kijk wat erin staat — je gaat het uitbreiden, niet vervangen.

Wat moet erbij voor 1000x:

```ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export const contentSchema = z.object({
	// Velden die de template waarschijnlijk al heeft (of niet, dan toevoegen):
	title: z.string(),
	description: z.string().optional(),
	icon: z.string().optional(),

	// 1000x-specifiek:
	scope: z.enum(['self', 'children']).optional(),                  // sidebar scope-binding (Section sidebar, customization 02 in 02-TEMPLATE)
	nav: z.array(z.string()).optional(),                             // didactische volgorde van children (slugs)
	order: z.number().optional(),                                     // escape-hatch voor individuele page-volgorde
	levels: z.union([z.boolean(), z.array(z.string())]).optional(),  // levels-container — folder-based section levels (Levels, customization 04 in 02-TEMPLATE)
	tabs: z.union([z.boolean(), z.array(z.string())]).optional(),    // tabs-container — file-based directory tabs (Tabs, customization 05 in 02-TEMPLATE)
	schemaVersion: z.number().default(1),                             // forward compat
})

export default defineContentConfig({
	collections: {
		content: defineCollection({
			type: 'page',
			source: '**/*.md',
			schema: contentSchema,
		}),
	},
})
```

Twee dingen om bewust te zijn:

- **Named export `contentSchema`** zodat unit-tests het schema kunnen importeren (zie test-plan zodra we Stap 1 testen schrijven)
- **`schemaVersion` heeft een default** — bestaande markdown-files zonder dat veld blijven werken. Migrators komen pas wanneer we de eerste breaking change doorvoeren (zie Markdown rendering, customization 01 in 02-TEMPLATE)

---

## 5. AI-context files

Belangrijk voor latere Claude Code sessies, Cursor, Codex etc. Niet skippen — investeert in correcte agent-output.

### `AGENTS.md` op project-root

```md
# 1000x — Agent Context

> Canonical AI/agent context. CLAUDE.md en GEMINI.md zijn pointers naar dit bestand.

## Project

**1000x** — bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Doelpubliek: intern, werknemers. Niet voor publiek of zoekmachines. Gebouwd op de Nuxt UI docs-template als baseline.

Zie `SPEC.md` voor de volledige product-specificatie, `FEATURES.md` voor de drie-stage roadmap, `02-TEMPLATE/` voor customizations bovenop de docs-template, en `03-FEATURES/` voor de tien echte features.

## Stack

- **Baseline**: Nuxt UI docs-template (https://github.com/nuxt-ui-templates/docs)
- **Framework**: Nuxt 4
- **UI**: Nuxt UI v4
- **Content**: Nuxt Content v3
- **i18n**: `@nuxtjs/i18n` — NL default, EN secundair
- **Iconen**: `@nuxt/icon` met lokale Iconify-bundles. Custom SVGs alleen als laatste redmiddel.
- **Images**: `@nuxt/image` met IPX provider (vanaf het begin geïntegreerd in `ProseImg`-override)
- **PWA**: `@vite-pwa/nuxt`
- **Code-editor (later)**: CodeMirror 6
- **Code-execution (later)**: Web Workers + WASM
- **Persistentie Phase 1**: localStorage
- **Deployment Phase 1**: SSG op Cloudflare Pages of Vercel

## Drie soorten werk

Wanneer een task binnenkomt, classificeer hem eerst:

1. **Foundation** (`01-FOUNDATION/`) — éénmalig setup: branding, i18n, schema, AGENTS, deployment, content-stubs
2. **Template customization** (`02-TEMPLATE/`) — aanpassen wat de template of Nuxt Content levert: sidebar, header, levels, tabs, page-chrome, right-panel, smart-toc, changelog, prev-next, search, math/diagrammen, image-lightbox
3. **Eigen feature** (`03-FEATURES/`) — bouwen wat de template niet heeft: code-editor, card-trainer, AI-assistent, etc.

Niet door elkaar halen. Een PR die zowel foundation als customizations als feature-werk doet wordt afgewezen.

## Conventies

### Code style

- **Tabs** voor indentatie (size 4 in editor weergave)
- **Single quotes** voor strings
- **Geen semicolons** — `@antfu/eslint-config`
- **No Prettier** — ESLint is alleenheerser
- **Vue SFC**: `<script setup lang="ts">` voor nieuwe components
- **Auto-imports** zijn aan

### Iconen

Nuxt UI v4 levert vrijwel alle componenten die we nodig hebben. Bij elk UI-element:

1. Eerst checken of Nuxt UI v4 het levert (component én MDC-block)
2. Pas als het niet bestaat of fundamenteel onvoldoende is, een eigen component bouwen door een Nuxt UI component te slot-overriden of te wrappen
3. Volledig from-scratch alleen als laatste optie

"Niet bestaat" betekent letterlijk niet bestaat — niet "bestaat maar ik wil iets anders". Smaak-verschillen los je op met theming via `app.config.ts`.

Iconen zelf: eerste keuze Iconify (`lucide:search`, `tabler:code`, `simple-icons:javascript`). Niet beschikbaar? Iconify-set toevoegen. Geen passende? Custom SVG in `app/components/icons/`. Nooit inline SVG-strings in components.

### Content

- Frontmatter velden gevalideerd via Zod-schema in `content.config.ts`
- Filenames blijven inhoudelijk (`closures.md`, niet `1.intro.md`). Volgorde via `nav: [...]`
- Iedere directory met `scope: self` of `scope: children` is een sidebar-grens
- Levels: folder-based onder een directory met `levels: true` (Junior/Mid/Senior, Windows/Linux/macOS); AppLevelHeader rendert als chrome-sub-header. Tabs: file-based siblings onder een directory met `tabs: true`
- Assets in `public/` mirrort de content-tree

### i18n

- UI-strings in `i18n/locales/{lang}.json` — geen hardcoded strings
- Content per taal: `page.nl.md`, `page.en.md`. Default `nl`
- LocalStorage-keys bevatten `{lang}`: `draft:nl:syntax/javascript/closures`

## Niet doen

- Geen `.navigation.yml` — nav-tree komt uit filesystem + frontmatter + localStorage
- Geen Prettier
- Geen runtime-fetches naar Iconify CDN
- Geen content scrapen of regurgiteren in AI-features
- Geen telemetry in Phase 1
```

### `CLAUDE.md`

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

## 7. ESLint en code style

De template heeft waarschijnlijk z'n eigen ESLint-config. Vervang met onze config gebaseerd op `@antfu/eslint-config`:

```bash
pnpm add -D @antfu/eslint-config
```

`eslint.config.mjs`:

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

`.editorconfig` op project-root:

```
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
```

`.vscode/settings.json`:

```json
{
	"editor.formatOnSave": false,
	"editor.codeActionsOnSave": {
		"source.fixAll.eslint": "explicit"
	},
	"prettier.enable": false,
	"typescript.tsdk": "node_modules/typescript/lib"
}
```

`package.json` scripts (merge met wat de template al heeft):

```json
{
	"scripts": {
		"lint": "eslint .",
		"lint:fix": "eslint . --fix",
		"typecheck": "nuxt typecheck"
	}
}
```

Run `pnpm lint:fix` één keer om alle template-files automatisch in onze stijl te brengen. Daarna één commit "chore: align with antfu eslint config".

---

## 8. Branden van template-content (NIET verwijderen)

De template komt met een uitgebreide demo-content (`content/`) die alle markdown-features showcaset: code blocks, prose elements, MDC components, search-resultaten, dark-mode kleuring, image embeds, callouts. **Behoud deze content tijdens foundation en customizations** — het is je live regression test-suite. Als je iets sloopt aan de markdown-pipeline, zie je het direct in de gebrande demo-content.

Wat je wel doet:

- **Brand de strings** die naar Nuxt UI of de template zelf verwijzen. Zoeken op patronen als "Nuxt UI", "Docs Template", "Nuxt UI Documentation Template" en vervang door 1000x-equivalenten. Vooral op de homepage (`content/index.md` of vergelijkbaar) en in metadata
- **Behoud de content-volume intact**. Niet pagina's verwijderen — de breedte aan voorbeelden beschermt je tegen regressies

Wat je niet doet:

- **Niet `content/` leegmaken**. Wanneer je dat doet verlies je dekking op markdown features die je later toch wilt blijven testen
- **Geen eigen "Welkom bij 1000x"-pagina toevoegen die de demo-home overschrijft**. Pas wanneer je in fase 3 echte 1000x-content gaat schrijven, kun je de demo-pagina's verplaatsen naar `content/_demo/` of `content/_kitchen-sink/` zodat ze niet in de hoofdnavigatie verschijnen maar wel als regressie-test beschikbaar blijven

Refresh `localhost:3000` — je zou nu een gebrand 1000x-project moeten zien met de template-content nog volledig functioneel.


---

## Wat hierna

Foundation is klaar. Volgende fase: `02-TEMPLATE/`. Per customization één PR met scope, beschrijving en tests.

Eerste twee customizations om te overwegen:

1. **`01-branding.md`** — als je in deze foundation-fase iets bent vergeten of fijn-tuner wilt zijn
2. **`02-content-schema.md`** — uitwerken hoe `scope`, `nav` etc. visueel werken in de bestaande template-sidebar voordat we 'm vervangen

Daarna de grotere customizations (section-sidebar, header, levels, tabs, page-chrome, right-panel, smart-toc, changelog, prev-next, search), en pas dán de echte 1000x-features uit `03-FEATURES/`.

---

## Gotchas

Te verwachten dingen die de template-aanpak met zich meebrengt:

- **Pnpm v10 build-script approval**: bij `better-sqlite3` of `simple-git-hooks` postinstall kan `pnpm install` falen. Voeg toe aan `package.json`:
  ```json
  "pnpm": {
      "onlyBuiltDependencies": ["better-sqlite3", "@parcel/watcher", "esbuild", "simple-git-hooks", "vue-demi"]
  }
  ```
- **`.nuxt/eslint.config.mjs` bestaat pas na `nuxt prepare`**: dus ESLint werkt pas na een eerste `pnpm dev` of `pnpm postinstall`
- **De template kan een eigen content-collection hebben** met andere schema-namen dan wij gebruiken. Controleer voordat je vervangt
- **Native SQLite** kan ook (Node 22.5+) door `experimental: { nativeSqlite: true }` in content-config — scheelt 4MB native dep maar is experimenteel

---

## Wat dit document NIET dekt

- Section sidebar (template)
- Layout chrome (template)
- Smart toc, scope-bound search (template)
- Eigen features zoals code-editor, card-trainer, AI-assistent (`03-FEATURES/`)
- Auth-gate / private deployment (feature 09 in 03-FEATURES)
- Content-management UI (feature 02 in 03-FEATURES)

Die zitten allemaal in latere fases. Foundation gaat alleen over: hoe krijg ik een gebrand, draaiend project waar al het andere op kan voortbouwen.
