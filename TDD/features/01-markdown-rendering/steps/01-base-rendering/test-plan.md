# Test Plan — Step 1: Basis Nuxt Content + page-rendering

## Doel

Voordat we Stap 1 implementeren leggen we vast wat "klaar" betekent — als uitvoerbare tests. De tests draaien op een leeg project en falen totdat de implementatie er is. Wanneer alle tests slagen is Stap 1 per definitie klaar. Geen handmatige "even kijken of het werkt"-rondes meer.

## Test-stack

- **Vitest** — unit-tests voor de zod-schema (snelste, geen browser nodig)
- **Playwright** — end-to-end tests voor het browser-gedrag (anchors, fragmenten, prose-rendering)
- **`@nuxt/test-utils`** — alleen als je later integration-tests op page-componenten wilt toevoegen; voor Stap 1 is dat niet nodig omdat de page-componenten bijna leeg zijn

Vitest is de Nuxt-default; Playwright is de moderne E2E-keuze die naast Nuxt soepel werkt. Geen Jest, geen Cypress.

## Setup

Installeer eerst de test-tools (zelf, voordat Claude Code aan Stap 1 begint):

```bash
pnpm add -D vitest @vitest/ui @nuxt/test-utils playwright @playwright/test
pnpm exec playwright install chromium
```

Voeg scripts toe aan `package.json`:

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

Maak een minimal `vitest.config.ts` en `playwright.config.ts` in de project-root. De Vitest-config moet `defineVitestConfig` van `@nuxt/test-utils/config` gebruiken zodat Nuxt-aliassen werken. De Playwright-config start de Nuxt-dev-server zelf via `webServer`.

## Test-bestanden

```
tests/
├── unit/
│   └── content-schema.test.ts          ← zod-schema validatie
└── e2e/
    ├── home-page.spec.ts                ← / rendert content/index.md
    ├── prose-page.spec.ts               ← /test-prose rendert alle markdown-elementen
    ├── prose-anchors.spec.ts            ← anchor links + URL fragments werken
    └── schema-default.spec.ts           ← schemaVersion default werkt
```

## Test 1 — Schema-validatie (unit)

**Bestand:** `tests/unit/content-schema.test.ts`

Het zod-schema in `content.config.ts` is pure logica en heeft geen Nuxt-runtime nodig. Test isoleren door het schema te exporteren of in de test inline opnieuw te declareren met dezelfde shape. Pragmatischer: import het schema vanuit `content.config.ts` als named export — dat vereist een kleine refactor waarbij `content.config.ts` de schema-definitie als named export beschikbaar maakt.

**Wat de test moet bewijzen:**

- Een geldig object met `title`, `description`, `schemaVersion` slaagt
- Een object zonder `description` slaagt (description is optional)
- Een object zonder `schemaVersion` slaagt en krijgt `schemaVersion: 1` als default
- Een object zonder `title` faalt (title is required)
- Een object met `title` als getal in plaats van string faalt
- Een object met een onbekend veld zoals `experimental: true` faalt — Stap 1 staat geen onbekende velden toe (`.passthrough()` komt pas in Stap 7)

**Skelet:**

```ts
import { describe, expect, it } from 'vitest'
import { contentSchema } from '../../content.config'

describe('content schema', () => {
	it('accepts a valid frontmatter object', () => {
		const result = contentSchema.safeParse({
			title: 'Welkom bij 1000x',
			description: 'Documentatie- en leersysteem',
			schemaVersion: 1,
		})
		expect(result.success).toBe(true)
	})

	it('makes description optional', () => {
		const result = contentSchema.safeParse({
			title: 'Een pagina',
			schemaVersion: 1,
		})
		expect(result.success).toBe(true)
	})

	it('defaults schemaVersion to 1 when missing', () => {
		const result = contentSchema.safeParse({
			title: 'Een pagina',
		})
		expect(result.success).toBe(true)
		if (result.success) {
			expect(result.data.schemaVersion).toBe(1)
		}
	})

	it('rejects when title is missing', () => {
		const result = contentSchema.safeParse({
			description: 'Geen titel',
		})
		expect(result.success).toBe(false)
	})

	it('rejects when title is not a string', () => {
		const result = contentSchema.safeParse({
			title: 42,
		})
		expect(result.success).toBe(false)
	})

	it('rejects unknown fields at this step', () => {
		const result = contentSchema.safeParse({
			title: 'Een pagina',
			experimental: true,
		})
		expect(result.success).toBe(false)
	})
})
```

## Test 2 — Home page rendering (E2E)

**Bestand:** `tests/e2e/home-page.spec.ts`

Verifieert dat `/` de inhoud van `content/index.md` rendert via de page-template, met de title uit frontmatter (niet uit een H1 in de body).

**Skelet:**

```ts
import { expect, test } from '@playwright/test'

test.describe('home page', () => {
	test('renders the title from frontmatter as H1', async ({ page }) => {
		await page.goto('/')
		const h1 = page.locator('h1').first()
		await expect(h1).toHaveText('Welkom bij 1000x')
	})

	test('renders the description as a lede paragraph', async ({ page }) => {
		await page.goto('/')
		await expect(page.getByText('Documentatie- en leersysteem voor het team')).toBeVisible()
	})

	test('does not render a duplicate H1 from the markdown body', async ({ page }) => {
		await page.goto('/')
		const h1Count = await page.locator('h1').count()
		expect(h1Count).toBe(1)
	})

	test('renders body content via ContentRenderer', async ({ page }) => {
		await page.goto('/')
		// Een snippet uit de body — pas aan als de exacte tekst verandert
		await expect(page.getByText('werkt de markdown-pipeline')).toBeVisible()
	})
})
```

## Test 3 — Prose test page (E2E)

**Bestand:** `tests/e2e/prose-page.spec.ts`

Verifieert dat `/test-prose` alle basis-markdown-elementen rendert die Stap 1 verlangt. Dit is geen visuele regressie-test — alleen aanwezigheids-check.

**Skelet:**

```ts
import { expect, test } from '@playwright/test'

test.describe('prose test page', () => {
	test.beforeEach(async ({ page }) => {
		await page.goto('/test-prose')
	})

	test('renders the title from frontmatter', async ({ page }) => {
		await expect(page.locator('h1').first()).toHaveText('Prose Test Pagina')
	})

	test('renders H2, H3, H4 headings', async ({ page }) => {
		await expect(page.locator('h2').first()).toBeVisible()
		await expect(page.locator('h3').first()).toBeVisible()
		await expect(page.locator('h4').first()).toBeVisible()
	})

	test('renders an unordered list and an ordered list', async ({ page }) => {
		await expect(page.locator('ul').first()).toBeVisible()
		await expect(page.locator('ol').first()).toBeVisible()
	})

	test('renders a nested list one level deep', async ({ page }) => {
		await expect(page.locator('ul ul, ul ol, ol ul, ol ol').first()).toBeVisible()
	})

	test('renders a blockquote', async ({ page }) => {
		await expect(page.locator('blockquote').first()).toBeVisible()
	})

	test('renders inline code, bold, and italic', async ({ page }) => {
		await expect(page.locator('code').first()).toBeVisible()
		await expect(page.locator('strong').first()).toBeVisible()
		await expect(page.locator('em').first()).toBeVisible()
	})

	test('renders an internal and external link', async ({ page }) => {
		await expect(page.locator('a[href="/"]').first()).toBeVisible()
		await expect(page.locator('a[href^="https://"]').first()).toBeVisible()
	})

	test('renders a horizontal rule', async ({ page }) => {
		await expect(page.locator('hr').first()).toBeVisible()
	})

	test('renders a table with header and rows', async ({ page }) => {
		await expect(page.locator('table thead th').first()).toBeVisible()
		const rowCount = await page.locator('table tbody tr').count()
		expect(rowCount).toBeGreaterThanOrEqual(2)
	})
})
```

## Test 4 — Anchor links (E2E)

**Bestand:** `tests/e2e/prose-anchors.spec.ts`

Verifieert dat headings klikbare anchors hebben en dat klikken een URL-fragment zet plus de pagina scrollt naar het heading.

**Skelet:**

```ts
import { expect, test } from '@playwright/test'

test.describe('heading anchors', () => {
	test('H2 has an id attribute', async ({ page }) => {
		await page.goto('/test-prose')
		const h2 = page.locator('h2').first()
		const id = await h2.getAttribute('id')
		expect(id).toBeTruthy()
		expect(id).toMatch(/^[a-z0-9-]+$/) // slug-style
	})

	test('H3 and H4 also have id attributes', async ({ page }) => {
		await page.goto('/test-prose')
		expect(await page.locator('h3').first().getAttribute('id')).toBeTruthy()
		expect(await page.locator('h4').first().getAttribute('id')).toBeTruthy()
	})

	test('clicking an anchor sets the URL fragment', async ({ page }) => {
		await page.goto('/test-prose')
		const h2 = page.locator('h2').first()
		const id = await h2.getAttribute('id')

		// Klikt op het anchor-icoon binnen of op de heading zelf
		const anchorLink = page.locator(`a[href="#${id}"]`).first()
		await anchorLink.click()

		await expect(page).toHaveURL(new RegExp(`#${id}$`))
	})

	test('navigating directly to a fragment scrolls to the heading', async ({ page }) => {
		await page.goto('/test-prose')
		const h2 = page.locator('h2').first()
		const id = await h2.getAttribute('id')

		await page.goto(`/test-prose#${id}`)
		await expect(h2).toBeInViewport()
	})
})
```

## Test 5 — schemaVersion default werkt op echte content (E2E)

**Bestand:** `tests/e2e/schema-default.spec.ts`

Verifieert dat een markdown-bestand zonder expliciete `schemaVersion` toch rendert dankzij de zod-default. Deze test verandert tijdelijk een content-bestand. Beter: maak een fixture-bestand `content/test-no-schema-version.md` aan dat permanent geen `schemaVersion` heeft.

**Toevoeging aan deliverables van Stap 1:** `content/test-no-schema-version.md`:

```md
---
title: Test Zonder Schema Versie
description: Dit bestand heeft expres geen schemaVersion in frontmatter, om te testen dat de default-waarde uit zod werkt
---

Als deze pagina rendert, werkt de zod-default voor `schemaVersion`.
```

**Skelet:**

```ts
import { expect, test } from '@playwright/test'

test.describe('schemaVersion default', () => {
	test('page without schemaVersion still renders', async ({ page }) => {
		await page.goto('/test-no-schema-version')
		await expect(page.locator('h1')).toHaveText('Test Zonder Schema Versie')
		await expect(page.getByText('werkt de zod-default')).toBeVisible()
	})
})
```

## Wat de tests bewust niet dekken

- **Visuele regressie** (precieze pixels van prose-styling) — Nuxt UI's defaults vertrouwen we; als ze veranderen merken we dat in een review, niet in een test
- **Anchor-icon-styling op hover** — de hover-state is visueel, niet functioneel; dat we het anchor kunnen klikken is genoeg
- **Code block highlighting** — Stap 2
- **MDC blocks** — Stap 3
- **Image rendering door @nuxt/image** — Stap 4
- **Asset path resolution** — Stap 5
- **Localized assets** — Stap 6
- **Tolerantie voor onbekende frontmatter-velden** — Stap 7. Daarom test 1 expliciet **rejects unknown fields** als acceptance voor Stap 1 — zo signaleer je dat dit gedrag bewust is

Per latere stap voeg je tests toe in dezelfde stijl: één unit-test per stuk pure logica, één E2E-test per zichtbare eis.

## Workflow (test-first)

1. Voer deze tests uit op een lege Stap 1-implementatie. Allemaal **rood**
2. Schrijf de Claude Code prompt voor Stap 1 (al gebeurd: `prompt.md`)
3. Laat Claude Code Stap 1 implementeren
4. Voer de tests opnieuw uit. Allemaal **groen** = Stap 1 klaar
5. Een test die rood blijft = de implementatie wijkt af van wat is afgesproken — fix het of beslis dat de afspraak verandert (en pas de test aan)

## Open punt — schema importeren in unit-test

Voor test 1 moet `content.config.ts` het schema als named export blootstellen, niet alleen via `defineContentConfig`. Voorbeeld-structuur:

```ts
// content.config.ts
import { defineCollection, defineContentConfig, z } from '@nuxt/content'

export const contentSchema = z.object({
	title: z.string(),
	description: z.string().optional(),
	schemaVersion: z.number().default(1),
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

Voeg deze instructie toe aan de Stap 1-prompt zodat Claude Code het schema als named export blootlegt — anders kan de unit-test het niet importeren.
