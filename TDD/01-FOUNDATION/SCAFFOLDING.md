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

## 1. Template-files binnenhalen

Twee scenarios afhankelijk van waar je begint. **Scenario B** is wat we voor 1000x gebruiken (bestaande TDD-orphan-branch); Scenario A staat als fallback voor wie écht greenfield begint.

### Scenario A — Greenfield (lege directory, nog geen `.git`)

```bash
cd ~/HELL                                                    # of waar je projecten leven
git clone https://github.com/nuxt-ui-templates/docs.git 1000x
cd 1000x
rm -rf .git                                                  # template's git-history weg
git init -b main                                             # eigen history beginnen
```

Dit is je vertrekpunt. Vanaf nu is dit `1000x`, niet meer een fork van de template.

### Scenario B — Bestaande TDD-orphan-branch (jouw geval)

Als je al een `.git`-history hebt met `TDD/`, `AGENTS.md`, `README.md`, `LICENSE`, `ONBOARDING.md` etc. (bv. omdat je een orphan-branch zoals `xx-init` hebt opgezet voor de planning-fase), wil je de Nuxt-template-files erin mergen zonder je history of bestaande docs te verliezen:

```bash
# 1. Clone docs-template naar een temp-locatie (shallow — we hoeven geen history)
cd /tmp
rm -rf nuxt-docs-template
git clone --depth 1 https://github.com/nuxt-ui-templates/docs.git nuxt-docs-template

# 2. Rsync de template-content naar onze repo
#    --ignore-existing → bestaande files in onze repo blijven onaangeroerd
#    --exclude='.git/' → template's git-history nooit overnemen
cd ~/HELL/1000x   # of waar de repo woont
rsync -av --ignore-existing --exclude='.git/' /tmp/nuxt-docs-template/ ./

# 3. Verifieer dat onze TDD/ en agent-docs onaangeroerd zijn
git status -s | head -20

# 4. Stage en commit de import
git add -A
git commit -m "scaffold: import nuxt-ui-docs-template project files"

# 5. Cleanup
rm -rf /tmp/nuxt-docs-template
```

**Hoe `--ignore-existing` ons werk doet:**

Rsync checkt per file of 'ie al in onze repo bestaat. Zo ja → skip. Zo nee → kopieer. Geen hardcoded exclude-lijst nodig — automatisch klopt het:

| Onze file (bestaat al) | Wat rsync doet |
|---|---|
| `TDD/`, `AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `ONBOARDING.md` | Skip — onze versie blijft |
| `README.md`, `LICENSE`, `.gitignore` | Skip — onze versie blijft |
| `.claude/` (skills) | Skip — onze skills blijven |
| `.editorconfig`, `eslint.config.mjs`, `tests/` (als ze al staan) | Skip — bestaande setup blijft |
| Alles wat in onze repo NIET bestaat | Kopieer uit template |

**Wat er nu wel in zit (uit het template):**

- `app/` — Nuxt source (componenten, layouts, pages)
- `content/` — markdown demo-content (markdown-rendering test-suite)
- `public/` — static assets
- `package.json`, `nuxt.config.ts`, `content.config.ts` — Nuxt-config
- Alle overige template-files die we nog niet hadden

**Edge case — als je later WEL het template's versie van een specifieke file wilt overnemen** (bv. `.gitignore` mergen met onze test-artifacts ignores): inspecteer `/tmp/nuxt-docs-template/` vóór de cleanup-stap, of clone 'm later opnieuw voor 3-way diff.

### Verifieer (beide scenarios)

```bash
pnpm install
pnpm dev
```

Open `localhost:3000`. Je ziet de Nuxt UI demo-docs draaien. Klik even rond zodat je weet wat de template kan voordat je gaat tweaken. **Dit is je nieuwe vertrekpunt voor sectie 2 en verder.**

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

## 5. Content-stubs — testbed voor stage 2

Foundation eindigt pas wanneer er een minimale-maar-realistische tree onder `content/` staat die alle render-paden uit stage 2 dekt: scope-modes (`self`, `children`, fallback), folder-based levels (Junior/Mid/Senior), file-based tabs (Tailwind-stijl), MDC inline `::tabs` voor kleine alternatives, standalone topics, en een knowledge-base zonder eigen scope.

Volledige tree-shape, frontmatter-conventies en coverage-matrix staan in [`03-content-stubs/SPEC.md`](./03-content-stubs/SPEC.md). Voer dat hier uit:

1. Maak de in de SPEC voorgestelde directories en `index.md`-files onder `content/`
2. Behoud de docs-template's eigen demo-content (`getting-started`, `essentials`, `ai`) als coverage van baseline-markdown features — alleen 1000x-specifieke structuur erbovenop
3. Run `pnpm dev` en verifieer dat alle stub-routes 200 geven en de frontmatter correct geparsed wordt door het schema uit sectie 4

Pas wanneer alle stub-routes laden zonder errors is foundation echt af. Stage 2 customizations bouwen tegen deze tree — anders ontbreekt het testbed voor scope-walks, level-headers, tab-bars en kind-detection in `useNavTree`.

---

## 6. AI-context files

Drie AI-context files leven aan de project-root: **`AGENTS.md`** (canonical), **`CLAUDE.md`** en **`GEMINI.md`** (één-zin pointers naar AGENTS.md). Plus **`ONBOARDING.md`** (doc-flow voor fresh agents en developers).

**`AGENTS.md` is de bron-van-waarheid** — niet overschrijven of dupliceren. Als hij al bestaat (wat het geval zou moeten zijn op een initial-setup branch die met onze andere docs is meegekomen), laat 'm met rust en check alleen dat de inhoud nog matcht met:

- De drie-stage structuur (`01-FOUNDATION/`, `02-TEMPLATE/`, `03-FEATURES/`)
- De Pinia-discipline ("pas vanaf feature 02 in 03-FEATURES" — zie `TDD/ARCHITECTURE.md`)
- De OOTB-first decision-rule (zie `TDD/02-TEMPLATE/README.md`)
- De pnpm-only verification-commands

Als `AGENTS.md` ontbreekt: kopieer 'm uit een andere branch (`main` of een eerdere refactor-branch), of bouw 'm op vanaf scratch met de drie-stage structuur als basis.

`CLAUDE.md` en `GEMINI.md` zijn één-zin-pointers; maak ze als ze ontbreken:

```md
# CLAUDE   (of: GEMINI)

Lees `AGENTS.md` voor de canonical project-context.
```

`ONBOARDING.md` aan project-root bevat de doc-flow met diagram — zie de huidige versie als referentie voor de inhoud.

---

## 7. ESLint en code style — minimum werkende setup

> Voor de volledige tooling-deep-dive (`.vscode/settings.json` met Tailwind class-regex, file-nesting, extension-recommendations, Prettier-uitsluiting) zie [`../TOOLING-STRATEGY.md`](../TOOLING-STRATEGY.md). Deze sectie levert alleen het minimum om foundation lint-clean door te komen.

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

`.editorconfig` aan project-root:

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

`.vscode/settings.json` minimaal (zie TOOLING-STRATEGY voor de uitgebreide versie):

```json
{
	"editor.formatOnSave": false,
	"editor.codeActionsOnSave": { "source.fixAll.eslint": "explicit" },
	"prettier.enable": false,
	"typescript.tsdk": "node_modules/typescript/lib"
}
```

Run `pnpm lint:fix` één keer om alle template-files automatisch in onze stijl te brengen. Daarna één commit "chore: align with antfu eslint config".

### Pre-commit hook via `simple-git-hooks`

Hooks zijn declaratief (in `package.json`), nooit handmatig in `.git/hooks/`. Zie `TDD/TOOLING-STRATEGY.md` § Hook-management voor de discipline.

```bash
pnpm add -D simple-git-hooks lint-staged
```

In `package.json`:

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

Run opnieuw `pnpm install` — de `postinstall` registreert nu de hook in `.git/hooks/pre-commit`. Vanaf de volgende commit draait `eslint --fix` automatisch op staged files.

**Tegenkom je een leftover-hook van een eerdere setup?** Symptoom: commit faalt met `pnpm: not found` of een tool die niet in `package.json` staat. Fix:

```bash
rm .git/hooks/pre-commit
pnpm install
```

`simple-git-hooks` regenereert 'm vanaf de declaratieve config.

---

## 8. Test-infra — Vitest en Playwright

Foundation rondt af met een werkende test-pipeline zodat customizations vanaf dag één tegen tests kunnen worden geverifieerd.

```bash
pnpm add -D vitest @vitest/ui @playwright/test playwright
pnpm exec playwright install chromium
```

`vitest.config.ts` aan project-root:

```ts
import { defineConfig } from 'vitest/config'

export default defineConfig({
	test: {
		include: ['tests/unit/**/*.test.ts'],
		environment: 'node',
		globals: false,
	},
})
```

`playwright.config.ts` aan project-root:

```ts
import process from 'node:process'
import { defineConfig, devices } from '@playwright/test'

const PORT = Number(process.env.PORT) || 3000

export default defineConfig({
	testDir: './tests/e2e',
	timeout: 30 * 1000,
	use: {
		baseURL: `http://localhost:${PORT}`,
		trace: 'on-first-retry',
	},
	projects: [{ name: 'chromium', use: { ...devices['Desktop Chrome'] } }],
	webServer: {
		command: 'pnpm dev',
		port: PORT,
		reuseExistingServer: !process.env.CI,
		timeout: 120 * 1000,
	},
})
```

Scripts in `package.json` (merge met de bestaande):

```json
{
	"scripts": {
		"test": "vitest run",
		"test:watch": "vitest",
		"test:e2e": "playwright test",
		"test:all": "pnpm test && pnpm test:e2e"
	}
}
```

Voeg test-artifacten toe aan `.gitignore`:

```
test-results/
playwright-report/
playwright/.cache/
```

Maak placeholder folders zodat git ze tracket:

```bash
mkdir -p tests/unit tests/e2e
touch tests/unit/.gitkeep tests/e2e/.gitkeep
```

Verifieer: `pnpm test` reports "no test files found" + exit 1 (verwacht — geen tests nog). `pnpm test:e2e --list` discovert nog niets. Dat is OK; de eerste tests landen bij stage-2 customizations.

---

## 9. Branden van template-content (NIET verwijderen)

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

Foundation is klaar wanneer:

- ✅ Branding staat (rode `1`, 1000x site-name, noindex-headers)
- ✅ i18n NL/EN werkt met UI-strings via `$t(...)` en geen hardcoded text
- ✅ Content-schema heeft `scope`, `nav`, `order`, `levels`, `tabs`, `icon`, `schemaVersion`
- ✅ Content-stubs onder `content/` dekken alle render-paden voor stage 2 (zie `03-content-stubs/SPEC.md`)
- ✅ AI-context files (`AGENTS.md`, `CLAUDE.md`, `GEMINI.md`, `ONBOARDING.md`) staan en zijn in sync
- ✅ ESLint draait clean (`pnpm lint` exit 0); `pnpm typecheck` exit 0
- ✅ Vitest + Playwright zijn opgezet; `pnpm test` start zonder errors (geen tests nog = OK)
- ✅ `pnpm dev` toont een gebrand 1000x-project met de demo-content nog volledig functioneel

Volgende fase: `02-TEMPLATE/`. Per customization één PR met scope, beschrijving en tests. De volgorde + decision-rule (OOTB-first) staat in [`../02-TEMPLATE/README.md`](../02-TEMPLATE/README.md).

**Eerste customization** is **`01-markdown-rendering`** — verifieer dat de docs-template's markdown-pipeline doet wat onze SPEC vraagt en breid het schema-pad uit waar nodig. Daarna **`02-section-sidebar`** (de grootste — bevat tree-build + sidebar-render in 3 stappen).

Daarna de overige customizations in volgorde (`03-header`, `04-levels`, `05-tabs`, `06-page-chrome`, `07-right-panel`, `08-smart-toc`, `09-changelog`, `10-prev-next`, `11-search`, `12-math-en-diagrammen`, `13-image-lightbox`), en pas dán de echte 1000x-features uit `03-FEATURES/`.

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
