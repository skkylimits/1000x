# Architectuur

> Twee regels + één migratiepath + één data-flow-diagram. Project-specifieke discipline die voorkomt dat een groeiend systeem in spaghetti verandert. Dit is geen handboek over Nuxt of Vue — alleen wat in deze codebase moet kloppen.

## Waarom dit document bestaat

1000x wordt groot: 13 customizations en 10 features op de roadmap, meerdere agents en mensen die er aan werken. Zonder een paar harde architectuur-regels drift zoiets binnen een paar maanden naar een toestand waar:

- Dezelfde data op vier plekken anders wordt opgehaald
- Een refactor van één laag tien feature-files raakt
- Niemand meer durft te wijzigen wat al bestaat

Dit document legt twee regels vast die dat voorkomen, plus de migratie-route voor de plek waar we straks state-management toevoegen.

---

## De data-flow in één plaatje

```
Nuxt Content                useAsyncData cache         Pure functions             Composables             Components
─────────────               ──────────────────         ──────────────             ──────────              ──────────

queryCollection      ──►    useAsyncData          ──►  buildTree()           ──►  useNavTree()       ──►  <SectionSidebar>
('docs').all()              ('nav-tree', ...)          walkScope()                useCurrentScope()       <AppHeader> dropdowns
                            (één keer per sessie)      (per route-change)         (per route-change)      <AppLevelHeader>
                                                                                                          <TabBar>

queryCollectionItem-  ──►   (per route-change          (geen pure helper          usePrevNext()       ──►  <PrevNext>
Surroundings (path)         direct, geen cache         nodig — native             (customization 10,         (customization 10)
                            nodig)                     levert prev/next)          dunne scope-filter
                                                                                  rond OOTB-call)

useRoute().path      ──►    -                     ──►  walkBreadcrumb()      ──►  inline derivation   ──►  <Breadcrumb>
+ useNavTree.lookup                                    (klein, optioneel)         in component             (customization 06,
                                                                                                          via <UBreadcrumb>)
```

**Drie observaties:**

1. **Nav-tree** is de data-source met de meeste consumers — daarom een dedicated composable `useNavTree` met cache via `useAsyncData`
2. **Item-surroundings** (prev/next) is een aparte data-source uit Nuxt Content; de wrapper `usePrevNext()` leeft bij customization 10 en filtert op scope
3. **Breadcrumb** is geen aparte data-source — het is een derivation van `useRoute().path` + `useNavTree`'s lookup. Geen eigen composable; `<UBreadcrumb>` met inline items-derivation in customization 06 is voldoende

---

## Regel 1 — Single entry point per data-source

**Elk type runtime-data heeft één named entry-point. Iedere consumer gaat door dat entry-point. Geen uitzonderingen zonder reden in een review.**

### Wat dit betekent

Voor elk soort data dat de app gebruikt — de navigation tree, gebruiker-voorkeuren, drafts, content-mutaties, AI-context — is er **precies één** plek waar het binnenkomt. Components, composables, layouts en pages roepen die plek aan; ze graven niet zelf naar de onderliggende bron.

### Waarom

Refactor-kost van een data-source wordt **één file aanraken**, niet N. Wanneer Nuxt Content's API verandert, wanneer localStorage naar IndexedDB migreert, wanneer een Pinia store de read-laag vervangt — dat is allemaal een wijziging in één bestand. De consumers merken er niks van.

### Concreet — huidige entry-points

| Domein | Entry-point | Onderliggende bron | Geïntroduceerd in |
|---|---|---|---|
| Navigation tree | `useNavTree()` | `queryCollection('docs')` via `useAsyncData` | Section sidebar Step 1 |
| Current scope | `useCurrentScope()` | `useNavTree` + `useRoute` | Section sidebar Step 1 |
| UI-state / settings | `settingsStore` | `window.localStorage` | Section sidebar Step 3 |
| Sidebar collapse | `useSidebarCollapse()` | `settingsStore` | Section sidebar Step 3 |
| Prev/next | `usePrevNext()` | `queryCollectionItemSurroundings` + scope-filter via `useNavTree` | Customization 10 (prev-next) |
| Drafts | `useDrafts()` (TBD) | `localStorage` → IndexedDB | Feature 01 in 03-FEATURES |
| Content mutations | Pinia `useNavStore` (TBD) | overlay-storage adapter | Feature 02 in 03-FEATURES |
| AI context | `useAiContext()` (TBD) | server-route + cache | Feature 10 in 03-FEATURES |

**Niemand belt de derde kolom direct aan, alleen via de tweede.**

**Breadcrumb** staat bewust niet in de tabel: het is geen aparte data-source maar een derivation van `useRoute()` + `useNavTree`'s lookup. Customization 06 (page-chrome) gebruikt `<UBreadcrumb>` met inline items-derivation; geen aparte wrapper nodig.

### Wat de regel verbiedt

- `queryCollection(...)` aanroepen in een component, layout, page, of niet-`useNavTree`-composable
- `queryCollectionItemSurroundings(...)` aanroepen in een component direct — gebruik `usePrevNext` zodra customization 10 die levert
- `window.localStorage.getItem/setItem/removeItem` direct gebruiken buiten `app/utils/settingsStore.ts`
- `useAsyncData('nav-tree', ...)` op meerdere plekken — er is precies één call, en die zit in `useNavTree`
- Een tweede composable schrijven die hetzelfde domein bedient onder een andere naam (`useNav` naast `useNavTree` → één moet weg)

### Wat de regel toestaat

- Pure helpers in `app/utils/<domain>.ts` mogen overal worden geïmporteerd. Ze zijn stateless
- Inline-derivations in components zijn OK wanneer ze alleen al bestaande entry-points combineren (bv. breadcrumb-items uit `useRoute().path` + `useNavTree.value.lookup`)
- Een feature mag een NIEUWE entry-point introduceren voor een NIEUW domein. Dan komt 'ie in bovenstaande tabel
- Een entry-point mag intern gerefactord worden zonder dat dat de tabel beïnvloedt

---

## Regel 2 — Pure derivations als standalone functies

**Logica die data afleidt uit andere data leeft als pure function in `app/utils/`. Composables zijn dunne wrappers (5-10 regels) over die utilities.**

### Wat dit betekent

Een derivation zoals "vind de scope-node voor deze route" of "platte lijst van pages voor prev/next" hoort niet ín een composable, niet in een component, en niet in een Pinia getter. Het is een pure functie van input-data naar output-data, los van Vue's reactiviteit, los van Nuxt's runtime, los van wat-dan-ook framework-specifiek.

### Waarom

- **Testbaarheid**: Vitest kan ze direct testen zonder JSDOM, zonder `@nuxt/test-utils`, zonder Nuxt-runtime
- **Swap-baarheid**: wanneer we van composable naar Pinia migreren bij feature 02 in 03-FEATURES, blijft de logica hetzelfde — alleen de wrapper verandert
- **Begrijpelijkheid**: bug in een prev/next-volgorde? Eén pure functie inspecteren, niet een keten van reactive composables

### Concreet — huidige pure utilities

In `app/utils/nav.ts`:

- `buildTree(pages, overlay?)` — bouwt de navigation tree met kind-detection (page/chapter/levels-container/tabs-container/level/tab)
- `walkScope(routePath, lookup)` — walk-up scope-resolver
- `walkEffectiveScope(routePath, lookup)` — bij levels-container: levert de actieve level-folder
- `walkBreadcrumb(routePath, lookup)` — breadcrumb-keten als array van NavNodes (gebruikt door customization 06 voor `<UBreadcrumb>`-items)
- `flattenForPrevNext(tree, currentScope)` — afgevlakte page-volgorde gefilterd op scope (gebruikt door customization 10 als alternatief naast `queryCollectionItemSurroundings`)

Plus de types: `NavNode`, `NavTree`, `NavOverlay`, `ContentPageLike`.

### Wat de regel verbiedt

- Een derivation copy-pasten in twee components in plaats van de utility te hergebruiken
- Reactiviteit (`computed`, `ref`, `watch`) gebruiken binnen `app/utils/*` — die files zijn pure logic
- Een composable die zelf een tree-walk doet in plaats van de utility aan te roepen

### Wat de regel toestaat

- Composables mogen state houden (`useState`, `useAsyncData`-cache, `ref`)
- Composables mogen derivations samenstellen via `computed(() => walkScope(...))`
- Pure utilities mogen elkaar aanroepen, mits er geen circulariteit ontstaat

---

## Hoe dit Nuxt's best practice volgt

De [officiële Nuxt state management-pagina](https://nuxt.com/docs/getting-started/state-management) zegt het expliciet:

> "Nuxt provides `useState` composable to create a reactive and SSR-friendly shared state across components. ... For more complex state management, you can use Pinia."

Onze drie-lagen-stack is precies dat:

- **`useState` + `useAsyncData`** voor read-only/shared data (nav-tree, current scope)
- **Plain composables** voor derivations bovenop de gedeelde state
- **OOTB API's direct gebruiken** waar Nuxt Content of Nuxt UI al een prima oplossing biedt — bv. `<UBreadcrumb>` met inline items-derivation, `queryCollectionItemSurroundings` voor prev/next (met dunne scope-filter wrapper)
- **Pinia** wordt pas toegevoegd wanneer we mutaties met cross-feature invarianten krijgen — niet op basis van "is dit shared state?", maar op basis van "is dit complex genoeg om Pinia's value te rechtvaardigen?"

**Veel Nuxt-tutorials springen direct naar Pinia** omdat de auteur 'm gewend is uit Vue 2/Vuex-tijd. Dat is tutorial-author-preference, niet de officiële aanbeveling. Wij volgen Nuxt's eigen guidance.

---

## Pinia-migratiepath

**Pinia komt binnen bij feature 02 in 03-FEATURES (In-app content management), niet eerder. Bij introductie blijven alle consumers ongewijzigd — `useNavTree()` wordt een Pinia getter-wrapper.**

### Trigger-criteria voor Pinia (functie-gebonden, niet datum-gebonden)

Pinia voegt waarde toe wanneer al deze drie tegelijk gelden:

1. **Echte mutaties** met expliciete actions (niet alleen reads)
2. **Cross-feature invarianten** (mutatie hier moet zichtbaar zijn dáár, in één atomaire flow)
3. **Devtools-debugging waarde** (mutatie-keten die niet triviaal in een log-statement past)

Vóór feature 02 hebben we hoogstens (1) zonder (2) en (3) — dat is `useState` + `useAsyncData`-territorium. Bij feature 02 ontstaat de combinatie: `addChapter` raakt sidebar + drafts + (later) settings export. Dat is Pinia.

### Tijdlijn

| Fase | Wat de state-laag doet | Wat de consumer ziet |
|---|---|---|
| **Nu — section sidebar t/m feature 01 in 03-FEATURES** | `useState('nav-tree', ...)` + `useAsyncData` cache. `settingsStore` voor localStorage. Geen Pinia | `useNavTree()`, `useCurrentScope()`, `settingsStore`, `useDrafts()`, `usePrevNext()` (vanaf customization 10) |
| **Feature 02 — In-app content management** | Pinia `useNavStore` introduceert mutatie-actions (`addChapter`, `renamePage`, …). `useNavTree()` wordt een 5-regel wrapper rond `useNavStore().tree`. Overlay-storage adapter | Consumers van `useNavTree()` blijven ongewijzigd |
| **Feature 03 — Settings** | Pinia `useSettingsStore` consumeert dezelfde `settingsStore`-interface. Export/import-flow | Iedere `settingsStore.get/set/remove` blijft werken |
| **Phase 2 — IndexedDB** | Adapter achter `settingsStore` en de overlay-storage swappen naar IndexedDB. Pinia-store-shape blijft hetzelfde | Consumers ongewijzigd |
| **Phase 3 — IAM + backend save** | Pinia stores krijgen actions die naar de backend schrijven. Lokale state blijft optimistisch | Consumers ongewijzigd |

### Wat NIET naar Pinia migreert (ook niet ná feature 02)

- **De nav-tree zelf** blijft op `useState`/`useAsyncData`-cache. Pinia store wraps dat alleen voor write-actions; de read-laag verandert niet
- **Pure derivations in `app/utils/*`** blijven pure functies, niet Pinia getters
- **`useRoute()`-afhankelijke composables** (`useCurrentScope`, `usePrevNext`) blijven gewone composables — Pinia bemoeit zich niet met routing
- **Render-only state** zoals "is dit menu open?" hoort in component-scope `ref()`, niet in een global store

### Wat dit voor section-sidebar Step 1 betekent

`useNavTree()` wordt nu geschreven als pure composable. Bij feature 02 in 03-FEATURES wordt 'ie geherprogrammeerd als getter-wrapper:

```ts
// Nu (Step 1) — composable met useAsyncData
export async function useNavTree() {
	const { data } = await useAsyncData<NavTree>('nav-tree', async () => {
		const pages = await queryCollection('docs').all()
		return buildTree(pages)
	})
	return data
}

// Bij feature 02 (content management) — wrapper rond Pinia
export function useNavTree() {
	const store = useNavStore()
	return computed(() => store.tree)
}
```

Consumers van `useNavTree()` merken er niks van. **Mits ze Regel 1 volgen en altijd via de composable lezen.**

---

## Folder-discipline

Geen pre-emptive split-up. Wanneer een file groter wordt dan ~300 regels of een composables-folder meer dan 8 entries krijgt, splitsen per domein:

```
app/utils/
├── nav.ts                  # nu
└── nav/                    # later — wanneer nav.ts > 300 regels
    ├── buildTree.ts
    ├── walkScope.ts
    ├── walkBreadcrumb.ts
    ├── flattenForPrevNext.ts
    └── types.ts

app/composables/
├── useNavTree.ts           # nu
├── useCurrentScope.ts
└── nav/                    # later — als er >8 nav-composables komen
    ├── useNavTree.ts
    ├── useCurrentScope.ts
    └── usePrevNext.ts      # binnenkomst bij customization 10
```

Tests volgen dezelfde indeling onder `tests/unit/` en `tests/e2e/`.

---

## Enforcement

### Code review

PR die Regel 1 of Regel 2 breekt zonder expliciete reden → afgewezen. De review-checklist:

- Roept dit component / composable / layout `queryCollection`, `queryCollectionItemSurroundings` of `localStorage` direct aan? → terug naar de juiste entry-point
- Bevat dit composable derivation-logica die in `app/utils/` thuishoort? → eruit halen
- Voegt deze PR een nieuwe state-source toe? → bestaat er een entry-point voor in de tabel? Zo nee, voeg er één toe (en update deze `ARCHITECTURE.md`)

### ESLint (aanbevolen, niet verplicht in Phase 1)

Twee regels die de twee verboden afdwingen:

```js
// eslint.config.mjs — schets
{
	files: [
		'app/components/**/*.vue',
		'app/layouts/**/*.vue',
		'app/pages/**/*.vue',
		'app/composables/**/*.ts',
	],
	ignores: ['app/composables/useNavTree.ts', 'app/composables/usePrevNext.ts'],
	rules: {
		'no-restricted-imports': ['error', {
			patterns: [{
				group: ['#imports'],
				importNames: [
					'queryCollection',
					'queryCollectionNavigation',
					'queryCollectionItemSurroundings',
				],
				message: 'Gebruik useNavTree() of usePrevNext(). Directe Nuxt Content queries alleen in de bijbehorende composable.',
			}],
		}],
	},
},
{
	files: ['app/**/*.{ts,vue}'],
	ignores: ['app/utils/settingsStore.ts'],
	rules: {
		'no-restricted-globals': ['error', {
			name: 'localStorage',
			message: 'Gebruik settingsStore. Directe localStorage alleen in app/utils/settingsStore.ts.',
		}],
	},
},
```

Toevoegen wanneer iemand er voor het eerst tegenaan loopt — niet preemptive.

---

## Anti-patterns — concrete dingen die we niet doen

- **`.navigation.yml` files** voor directory-metadata — wij gebruiken uitsluitend `index.md` frontmatter. Reden: single source per directory (één file ipv twee), zelfde mental model als page-frontmatter, AI/CMS-friendly (één file per directory om te lezen of bewerken), geen drift tussen yml-config en md-content. Schaalbaarheid: als features 02 en 03 (in `03-FEATURES/`) content-mutaties en settings raken, interacteren ze altijd met dezelfde file. Met `.navigation.yml` zou elke nav-veld-toevoeging een keuze worden ("hoort dit in yml of frontmatter?") en zou refactoring twee files synchroon moeten houden
- **`queryCollection` in een page-component** voor een snelle lookup — gebruik `useNavTree`
- **`queryCollectionItemSurroundings` in een page-component** — gebruik `usePrevNext` (customization 10)
- **`localStorage.setItem('ui:foo', ...)` in een composable** — gebruik `settingsStore.set('foo', ...)`
- **Twee composables die hetzelfde domein bedienen** (`useNav` naast `useNavTree`) — één moet weg
- **Een composable maken voor wat OOTB Nuxt UI / Nuxt Content al levert** — bv. een `useBreadcrumb` toevoegen terwijl `<UBreadcrumb>` met inline derivation prima werkt. Composables zijn voor dingen waar wij *iets toevoegen* aan de OOTB-API (zoals scope-filter in `usePrevNext`)
- **Een derivation in een component schrijven die ook in een utility hoort** (`pages.filter(...).sort(...)`) — verplaats naar `app/utils/<domain>.ts`
- **Pinia toevoegen "voor de toekomst"** vóór feature 02 in 03-FEATURES een echte mutatie-flow nodig heeft. Nuxt zelf raadt Pinia alleen aan voor "more complex state management" — wij houden ons daaraan
- **VueUse als wrapper rond een 5-regel localStorage-helper** — `settingsStore` is voldoende
- **Een generieke `<Tree>`-component** of swappable storage-adapter zonder een tweede concreet gebruik
- **Reactiviteit (`computed`, `watch`) toevoegen in `app/utils/*`** — die files zijn pure logic
- **`file-suffix-collapse` voor varianten** zoals `<page>.<variant>.<lang>.md` — levels en tabs zijn folder-based

---

## Wanneer deze regels wijzigen

Dit document wordt geüpdatet wanneer:

- Een nieuwe data-source toegevoegd wordt → row in de tabel onder Regel 1
- Pinia-introductie bij feature 02 in 03-FEATURES → migratie-tijdlijn afvinken, eventueel folder-discipline herstructureren
- Een uitzondering op Regel 1 of 2 nodig blijkt en gemotiveerd kan worden → uitzondering documenteren mét reden, zodat het geen impliciete drift wordt

Wijzigingen aan dit document gaan via een gewone PR; review-discipline geldt ook hier.
````

---

## Wat er veranderde t.o.v. mijn vorige draft

| Onderdeel | Verandering |
|---|---|
| Data-flow diagram | Drie data-sources expliciet (queryCollection, queryCollectionItemSurroundings, useRoute+lookup voor breadcrumb). Maakt zichtbaar dat breadcrumb een derivation is, prev/next een aparte source met scope-filter |
| Entry-points tabel | `Breadcrumb` rij weg. `Prev/next` rij verschoven naar customization 10. Plus voetnoot dat breadcrumb bewust niet in de tabel staat |
| Concrete pure utilities | `walkBreadcrumb` en `flattenForPrevNext` blijven (klein, hergebruik in customizations 06 en 10) |
| "Regel 1 verbiedt" | `queryCollectionItemSurroundings` direct gebruiken toegevoegd als verbod |
| "Regel 1 toestaat" | "Inline-derivations in components" toegevoegd als toegestaan-pad voor de breadcrumb-case |
| Pinia-migratiepath tabel | Consumer-lijst bevat nu `usePrevNext` met "vanaf customization 10" |
| Anti-patterns | "Een composable maken voor wat OOTB al levert" toegevoegd als nieuwe anti-pattern, met expliciete useBreadcrumb-vs-`<UBreadcrumb>`-voorbeeld |
| ESLint sketch | `usePrevNext` toegevoegd aan ignores; restrict-message bijgewerkt |
| "Hoe dit Nuxt's best practice volgt" | Vierde bullet toegevoegd: "OOTB API's direct gebruiken waar Nuxt Content of Nuxt UI al een prima oplossing biedt" — verklaart waarom we GEEN useBreadcrumb maken |

Goed om te plakken in VS Code. Section sidebar Step 1's prompt en test-prompt moeten nog een kleine update krijgen om useBreadcrumb / usePrevNext eruit te halen, maar dat is het volgende stap-voor-stap-werk wanneer je daar aan toekomt.