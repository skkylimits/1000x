Je gaat het 1000x project initialiseren door de Nuxt UI docs-template als
baseline te gebruiken en daarop onze foundation-laag aan te brengen. Het
resultaat is een gebrand 1000x-project dat klaar is voor template
customizations en eigen features in latere fases.

Lees deze files volledig voordat je begint:

- TDD/SPEC.md — productspec, wat het systeem moet doen
- TDD/FEATURES.md — drie-stage roadmap: foundation (4 items), template (13 customizations), features (10 items)
- TDD/ARCHITECTURE.md — twee scalability-regels en het Pinia-migratiepath
- TDD/01-foundation/SCAFFOLDING.md — stap-voor-stap foundation setup, dit is je primaire
  bron van waarheid voor wat je gaat doen
- TDD/02-template/README.md — uitleg waar template-customizations passen (niet
  in deze fase, maar voor context)
- TDD/TOOLING-STRATEGY.md — projectwijze code-quality keuzes

## Scope

Wat je doet:
1. Clone de Nuxt UI docs-template (https://github.com/nuxt-ui-templates/docs)
   als baseline en init een eigen git-history
2. Branding doorvoeren — primary color rood, 1000x-logo (rode "1" + default
   foreground "000x"), site name op alle plekken
3. NL/EN i18n toevoegen via @nuxtjs/i18n, NL als default, met
   i18n/locales/nl.json en i18n/locales/en.json
4. Content schema uitbreiden — voeg schemaVersion (default 1), scope, nav,
   order en variants toe aan het bestaande content.config.ts schema. Vervang
   het schema niet, breid uit. Exporteer contentSchema als named export
5. AI-context files schrijven — AGENTS.md (canonical), CLAUDE.md en GEMINI.md
   als pointers
6. ESLint config vervangen door withNuxt(antfu({...})) volgens
   SCAFFOLDING.md sectie 7. Run pnpm lint:fix één keer over de hele
   template-codebase
7. Noindex headers voor robots.txt-style protectie via routeRules en meta
   tags
8. Eerste deploy-config — pnpm generate produceert .output/public/, klaar
   voor Cloudflare Pages of Vercel

Wat je expliciet NIET doet:

- Geen section-sidebar — die komt in een latere customization (`02-template/02-section-sidebar`)
- Geen layout-chrome wijzigingen (header dropdowns, level-header, tab-bar,
  sliding right panel, breadcrumb, action bar) — komen in latere customizations
- Geen smart-toc bouwen — komt in latere customization (`02-template/08-smart-toc`)
- Geen search uitbreiden met scope-filter — komt in latere customization (`02-template/11-search`)
- Geen eigen features uit `03-features/` folder — die komen in fase 3
- Demo-content NIET vervangen — laat de template-content staan als
  test-suite voor markdown rendering, code blocks, prose, search en dark
  mode. Brand de strings die "Nuxt UI" of "Nuxt Docs Template" zeggen,
  maar laat de content-volume intact

## Uitvoering

Werk sequentieel door SCAFFOLDING.md heen, sectie 1 t/m 10. Per sectie:

1. Lees de instructie zorgvuldig
2. Voer de bash-commando's of file-edits uit
3. Verifieer met de "verwachte uitkomst" uit dat sectie
4. Commit per logische eenheid (één commit per sectie of per consistent
   thema, niet één megacommit voor alles)

Conventies overal:

- Tabs voor indentatie, single quotes, geen semicolons (antfu config doet
  dit automatisch maar bevestig met pnpm lint na elke sectie)
- Vue SFC's altijd <script setup lang="ts">
- Iconen via Iconify (lucide:, tabler:, simple-icons:). Alleen custom SVG
  als er geen Iconify-icoon bestaat
- Geen Prettier, geen runtime Iconify CDN calls

## Rapport aan het eind

Aan het einde, geef terug:

- Welke commits je hebt gemaakt en in welke volgorde
- Of pnpm dev draait op localhost:3000 zonder errors
- Of pnpm lint en pnpm typecheck beide schoon zijn
- Of pnpm generate een .output/public/ produceert
- Welke vragen of beslispunten je tegenkwam waar je een aanname hebt
  gemaakt die de gebruiker zou moeten verifiëren
- Een suggestie voor de eerste customization om mee te beginnen, op basis
  van wat je in de template-codebase hebt gezien (bv. "hun sidebar zit in
  app/components/X — vervangen wordt redelijk simpel" of "hun layout-grid
  zit verstrengeld met de header-component, dat wordt meer werk dan
  verwacht")

Begin pas wanneer je SCAFFOLDING.md sectie 1 hebt gelezen en bevestigt dat
je de scope begrijpt.