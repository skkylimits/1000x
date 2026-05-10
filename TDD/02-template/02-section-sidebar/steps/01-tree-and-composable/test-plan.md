# Test Plan — Step 1: Tree-build & `useNavTree()` composable

## Doel

"Klaar" voor Stap 1 betekent: alle Vitest-cases groen, lint en typecheck clean, dev-server start zonder errors, en de pure-data-laag is callable via vier composables zonder dat één bestaande UI-pixel verandert. De stap heeft geen E2E-tests omdat er geen UI-werk is — die volgen in Stap 2.

Stap-scope staat in [`../../SPEC.md`](../../SPEC.md) onder `## Implementation Steps` → **Step 1**. De public API en de behaviour-rules staan in [`prompt.md`](./prompt.md) en [`test-prompt.md`](./test-prompt.md); bij twijfel wint `prompt.md`.

## Test-stack

- **Vitest** — pure-function unit tests met synthetic `ContentPageLike[]`-fixtures. Geen Nuxt-runtime, geen JSDOM, geen `@nuxt/test-utils`.
- **Geen Playwright in deze stap** — `tests/e2e/` blijft leeg tot Stap 2 de UI vervangt.

## Test-bestand

```
tests/
└── unit/
    └── nav.test.ts          ← bestaat al uit test-prompt.md; mag NIET gewijzigd worden in Stap 1
```

## Hoe te draaien

```bash
pnpm test          # vitest run, eenmalig
pnpm test:watch    # vitest, herdraait bij file-changes
pnpm lint          # ESLint over de hele repo
pnpm typecheck     # nuxt typecheck — auto-imports moeten oplossen
pnpm dev           # smoke test; / en /getting-started moeten 200 geven
```

## Coverage per resolver

23 `it`-blokken in 7 `describe`-groepen, één per resolver of behaviour-cluster:

### `buildTree` — basis vorm (3)

- Parent directory met twee child pages — alfabetische fallback wanneer geen `nav` of `order`
- `index.md`-hoist: directory's index wordt de directory-node, verschijnt nooit als kind van zichzelf, frontmatter (incl. `description`) wint
- Platte `lookup` bevat elke node, keyed by path

### `buildTree` — order resolver (4)

- Expliciete `nav: ['b', 'a', 'c']` op `index.md` overruled filename-volgorde
- Slugs niet in `nav`-array vallen aan de staart in alfabetische volgorde
- `order: N` per pagina sorteert ascending wanneer er geen `nav`-array is
- Alfabetische fallback op `title` wanneer noch `nav` noch `order` gezet is

### `buildTree` — variant collapse (3)

- Drie sibling-files `closures.{junior,mid,senior}.nl.md` collapsen naar één node `closures` met `meta.variants = ['junior', 'mid', 'senior']` (alfabetisch)
- De canonieke node erft frontmatter van de file die `variants: [...]` declareert; geen declaratie → eerste alfabetisch op variant-id
- Pages met verschillende basenames (`closures.*` vs `functions.*`) collapsen niet samen

### `buildTree` — icon-validatie (4)

- Scope-label directory (`scope: 'self' | 'children'`) zonder `icon` → throw met `/icon/` in message
- Chapter directory (heeft directe child pages) zonder `icon` → throw
- Leaf pages zonder `icon` → géén throw
- Error message bevat het pad van de offending node (`/javascript`)

### `walkScope` (4)

- Vindt de directory met `scope: 'self'` als ancestor van de routePath
- Walkt voorbij intermediaire directories zonder scope tot de eerste expliciete waarde
- Fallback naar top-level ancestor wanneer geen scope gedeclareerd is op het pad
- Onbekende routePath → `null`

### `walkBreadcrumb` (2)

- Bekend pad → `[root, ..., current]` in volgorde
- Onbekend pad → `[]`

### `flattenForPrevNext` (3)

- Respecteert `nav`-array volgorde over de afgevlakte sequentie
- Variant-collapsed nodes verschijnen exact één keer
- Pure scope-labels (directory-nodes met `scope: 'self' | 'children'`) zitten niet in de flat list

## Acceptance criteria

- ✅ `pnpm test` rapporteert `Tests  23 passed (23)` — geen failures, geen skips
- ✅ `pnpm lint` exit 0 zonder output
- ✅ `pnpm typecheck` exit 0 — auto-imports van `buildTree`/`walkScope`/`walkBreadcrumb`/`flattenForPrevNext`/`useAsyncData`/`queryCollection`/`useRoute`/`computed` resolven
- ✅ `pnpm dev` start op `http://localhost:3000/` zonder errors; `/` en `/getting-started` geven HTTP 200
- ✅ Public types in `app/utils/nav.ts` matchen `prompt.md` § File specs verbatim — `NavNode`, `NavTree`, `NavOverlay`, `ContentPageLike` ongewijzigd qua shape
- ✅ `tests/unit/nav.test.ts` is niet gewijzigd ten opzichte van wat `test-prompt.md` opleverde
- ✅ `git status` toont enkel de stap-deliverables: gewijzigde `app/utils/nav.ts` (stub-bodies → echte logica) en nieuwe `app/composables/{useNavTree,useCurrentScope,useBreadcrumb,usePrevNext}.ts`
- ✅ Geen wijzigingen aan `app/components/layout/SectionSidebar.vue`, `app/layouts/default.vue`, pages, `content.config.ts`, `nuxt.config.ts`, of toolchain-files

## Spot-checks die de unit-tests niet dekken

1. **Sanity check op echte content** — plak tijdelijk in een `<script setup>` van een willekeurige page:
   ```ts
   const tree = await useNavTree()
   console.log('nav-tree size:', tree.value?.lookup.size)
   ```
   Refresh, verwacht een getal > 0 in de browser-console. Regel daarna verwijderen.
2. **Build-error op ontbrekend icon (echte content)** — verwijder `icon:` uit een `index.md` van een directory met `scope: self` of met child pages, run `pnpm dev`. Verwacht: error met `buildTree: missing required \`icon\` on <pad> (declared in index.md)`. Icon weer terugzetten.
3. **Lees-discipline** — controleer dat geen enkele bestaande layout, page of component `useNavTree()` aanroept; Stap 1 introduceert de composables maar wired ze nergens in.

## Implementatie-keuzes om te verifiëren

Beslissingen die het algoritme deterministisch maken maar niet één-op-één in de tests staan:

1. **Variant-stem regex** is `^(?<base>.+?)\.(?<variant>[^./]+)\.(?<lang>nl|en)(?:\.md)?$` — `.md`-suffix optioneel zodat zowel test-fixtures (mét `.md`) als Nuxt Content's runtime `stem` (zonder) matchen.
2. **`index.md`-detectie** accepteert `'index.md'` én `'index'` om dezelfde forward-compat-reden.
3. **`meta.variants[]`** wordt alfabetisch gesorteerd, ongeacht input-volgorde.
4. **`walkScope`** start bij parent-segmenten (skipt het routePath zelf), conform `prompt.md` § walkScope-algoritme stap 2.
5. **`flattenForPrevNext`** sluit elk directory-node uit met `scope: 'self' | 'children'`; chapter-directories zonder scope blijven erin.
6. **Order-resolver fallback** met gemixte `order: N` + ontbrekende values: ontbrekend = `Infinity`, dan alfabetisch op title als tiebreaker.
7. **Roots** worden alfabetisch op title gesorteerd (defensieve default; alle tests hebben één root).

Niet akkoord met één van deze keuzes? → flag in de review en de implementatie wordt aangepast, niet de test.

## Niet in deze stap

- Geen UI-rendering — `SectionSidebar.vue` blijft op zijn hardcoded chapters draaien (Stap 2)
- Geen persistence, keyboard navigation of WCAG-uitwerking (Stap 3)
- Geen overlay-merge of write-side state (feature 02 in 03-features)
- Geen variant-tab UI in de sub-header (Levels (customization 04) en Tabs (customization 05) in 02-template) — alleen `meta.variants[]` is gevuld
- Geen integration-tests tegen de echte Nuxt Content collection — fixtures only
- Geen Playwright entries
