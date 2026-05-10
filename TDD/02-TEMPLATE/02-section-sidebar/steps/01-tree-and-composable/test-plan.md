# Test Plan — Step 1: Tree-build & `useNavTree()` composable

## Doel

"Klaar" voor Stap 1 betekent: alle Vitest-cases groen, lint en typecheck clean, dev-server start zonder errors, en de pure-data-laag is callable via vijf composables zonder dat één bestaande UI-pixel verandert. De stap heeft geen E2E-tests omdat er geen UI-werk is — die volgen in Stap 2.

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

`it`-blokken verdeeld over 9 `describe`-groepen, één per resolver of behaviour-cluster:

### `buildTree` — basis vorm (3)

- Parent directory met twee child pages — alfabetische fallback wanneer geen `nav` of `order`
- `index.md`-hoist: directory's index wordt de directory-node, verschijnt nooit als kind van zichzelf, frontmatter (incl. `description`) wint
- Platte `lookup` bevat elke node, keyed by path

### `buildTree` — order resolver (7)

- Expliciete `nav: ['b', 'a', 'c']` op `index.md` overruled filename-volgorde
- Slugs niet in `nav`-array vallen aan de staart in alfabetische volgorde
- `order: N` per pagina sorteert ascending wanneer er geen `nav`-array is
- Alfabetische fallback op `title` wanneer noch `nav` noch `order` gezet is
- Levels-container met `nav: [senior, mid, junior]` overruled `levels: [junior, mid, senior]`
- Levels-container zonder `nav` met `levels: [senior, mid, junior]` levert level-folders in die volgorde
- Levels-container met `levels: true` (zonder array) valt terug op alfabetisch op level-slug

### `buildTree` — kind-detection (7)

- Directory met `levels: true` op `index.md` krijgt `meta.kind === 'levels-container'`
- Directe child-folders van een levels-container krijgen `meta.kind === 'level'`
- Pages binnen een level krijgen `meta.kind === 'page'`
- Directory met `tabs: true` op `index.md` krijgt `meta.kind === 'tabs-container'`
- Directe children van een tabs-container krijgen `meta.kind === 'tab'`
- Directory met child pages zonder `levels`/`tabs`-flag krijgt `meta.kind === 'chapter'`
- Leaf page (geen children) krijgt `meta.kind === 'page'`

### `buildTree` — icon-validatie (5)

- Scope-label directory (`scope: 'self' | 'children'`) zonder `icon` → throw met `/icon/` in message
- Chapter directory (heeft directe child pages) zonder `icon` → throw
- Level node zonder `icon` → throw
- Leaf pages zonder `icon` → géén throw
- Error message bevat het pad van de offending node (`/javascript`)

### `buildTree` — flag conflict (1)

- Directory met zowel `levels: true` als `tabs: true` op `index.md` → throw met de offending path én een hint dat één van beide gekozen moet worden

### `walkScope` (4)

- Vindt de directory met `scope: 'self'` als ancestor van de routePath
- Walkt voorbij intermediaire directories zonder scope tot de eerste expliciete waarde
- Fallback naar top-level ancestor wanneer geen scope gedeclareerd is op het pad
- Onbekende routePath → `null`

### `walkEffectiveScope` (3)

- Voor route `/syntax/javascript/junior/closures` waar `/syntax/javascript` een levels-container met `scope: 'self'` is, levert het de `/syntax/javascript/junior` level-node (niet de levels-container)
- Voor een route onder een gewone `scope: 'self'`-directory (geen levels-container) levert het dezelfde node als `walkScope`
- Voor de levels-container's eigen `index.md`-route (`/syntax/javascript`) levert het de levels-container zelf (er is nog geen level op het pad)

### `walkBreadcrumb` (2)

- Bekend pad → `[root, ..., current]` in volgorde
- Onbekend pad → `[]`

### `flattenForPrevNext` (5)

- Respecteert `nav`-array volgorde over de afgevlakte sequentie
- Pages binnen een level worden in nested volgorde geëmit; prev/next binnen `/syntax/javascript/junior/...` blijft in `junior` tot het laatste junior-page, dan kruist het natuurlijk
- Levels-container nodes zelf worden niet geëmit (chrome-navigatie, geen content-page)
- Tabs-container verschijnt één keer als leaf; tab-children worden niet geënumereerd
- Pure scope-labels (directory-nodes met `scope: 'self' | 'children'`) zitten niet in de flat list

## Acceptance criteria

- ✅ `pnpm test` rapporteert alle tests groen — geen failures, geen skips
- ✅ `pnpm lint` exit 0 zonder output
- ✅ `pnpm typecheck` exit 0 — auto-imports van `buildTree`/`walkScope`/`walkEffectiveScope`/`walkBreadcrumb`/`flattenForPrevNext`/`useAsyncData`/`queryCollection`/`useRoute`/`computed` resolven
- ✅ `pnpm dev` start op `http://localhost:3000/` zonder errors; `/` en `/getting-started` geven HTTP 200
- ✅ Public types in `app/utils/nav.ts` matchen `prompt.md` § File specs verbatim — `NavKind`, `NavNode`, `NavTree`, `NavOverlay`, `ContentPageLike` ongewijzigd qua shape
- ✅ `tests/unit/nav.test.ts` is niet gewijzigd ten opzichte van wat `test-prompt.md` opleverde
- ✅ `git status` toont enkel de stap-deliverables: gewijzigde `app/utils/nav.ts` (stub-bodies → echte logica) en nieuwe `app/composables/{useNavTree,useCurrentScope,useEffectiveScope,useBreadcrumb,usePrevNext}.ts`
- ✅ Geen wijzigingen aan `app/components/layout/SectionSidebar.vue`, `app/layouts/default.vue`, pages, `content.config.ts`, `nuxt.config.ts`, of toolchain-files

## Spot-checks die de unit-tests niet dekken

1. **Sanity check op echte content** — plak tijdelijk in een `<script setup>` van een willekeurige page:
   ```ts
   const tree = await useNavTree()
   console.log('nav-tree size:', tree.value?.lookup.size)
   ```
   Refresh, verwacht een getal > 0 in de browser-console. Regel daarna verwijderen.
2. **Build-error op ontbrekend icon (echte content)** — verwijder `icon:` uit een `index.md` van een directory met `scope: self` of met child pages, run `pnpm dev`. Verwacht: error met `buildTree: missing required \`icon\` on <pad> (declared in index.md)`. Icon weer terugzetten.
3. **Build-error op flag-conflict (echte content)** — voeg `tabs: true` toe aan een `index.md` die ook `levels: true` heeft (of omgekeerd). Verwacht: error met de offending path. Flag weer verwijderen.
4. **Lees-discipline** — controleer dat geen enkele bestaande layout, page of component `useNavTree()` aanroept; Stap 1 introduceert de composables maar wired ze nergens in.

## Implementatie-keuzes om te verifiëren

Beslissingen die het algoritme deterministisch maken maar niet één-op-één in de tests staan:

1. **`index.md`-detectie** accepteert `'index.md'` én `'index'` (Nuxt Content's runtime `stem` heeft soms geen suffix).
2. **Levels-container detectie**: een directory is een levels-container wanneer zijn `index.md`-frontmatter `levels: true` of `levels: <array>` declareert. Een directory zonder `index.md` of zonder `levels`-flag is geen levels-container, ook niet als al zijn children directories zijn.
3. **Tabs-container detectie**: idem, via `tabs: true` of `tabs: <array>`.
4. **Level-detectie**: direct child-directories (folders, hoist'd via `index.md`) van een levels-container krijgen `kind: 'level'`. Bestanden direct onder een levels-container zijn ongedefinieerd gedrag (build mag throwen of negeren — kies één en houd 'm consistent).
5. **Tab-detectie**: directe children (file of directory) van een tabs-container krijgen `kind: 'tab'`.
6. **`walkScope`** start bij parent-segmenten (skipt het routePath zelf), conform `prompt.md` § walkScope-algoritme stap 2.
7. **`walkEffectiveScope`** loopt vanaf de resolved scope naar `routePath` en geeft de eerste descendant met `kind: 'level'` terug; geen level op het pad → resolved scope zelf.
8. **`flattenForPrevNext`** sluit elk directory-node met `kind` ∈ `{'levels-container', 'tabs-container', 'chapter'}` uit; emit pages, levels (level-overview = `index.md`-route) en tabs.
9. **Order-resolver fallback** met gemixte `order: N` + ontbrekende values: ontbrekend = `Infinity`, dan alfabetisch op title als tiebreaker.
10. **Roots** worden alfabetisch op title gesorteerd (defensieve default; alle tests hebben één root).

Niet akkoord met één van deze keuzes? → flag in de review en de implementatie wordt aangepast, niet de test.

## Niet in deze stap

- Geen UI-rendering — `SectionSidebar.vue` blijft op zijn hardcoded chapters draaien (Stap 2)
- Geen persistence, keyboard navigation of WCAG-uitwerking (Stap 3)
- Geen overlay-merge of write-side state (feature 02 in 03-FEATURES)
- Geen AppLevelHeader UI (Levels, customization 04 in 02-TEMPLATE) — alleen `meta.kind === 'levels-container'` is gevuld
- Geen TabBar UI (Tabs, customization 05 in 02-TEMPLATE) — alleen `meta.kind === 'tabs-container'` is gevuld
- Geen file-suffix-collapse zoals het oude `<page>.<variant>.<lang>.md`-patroon — levels en tabs zijn folder-/file-based en worden enkel gedetecteerd via de `levels`/`tabs`-flags op een `index.md`
- Geen integration-tests tegen de echte Nuxt Content collection — fixtures only
- Geen Playwright entries
