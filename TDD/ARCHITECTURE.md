# 1000x — Architectuur

> Twee regels + één migratiepath. Dit is geen handboek over Nuxt of Vue — alleen de project-specifieke discipline die voorkomt dat een groeiend systeem in spaghetti verandert.

## Waarom dit document bestaat

1000x wordt groot. Eenentwintig features op de roadmap, meerdere agents en mensen die er aan werken, een UI-laag die door customizations vervangen wordt en feature-implementaties die nog moeten landen. Zonder een paar harde architectuur-regels drift zoiets binnen een paar maanden naar een toestand waar:

- Dezelfde data op vier plekken anders wordt opgehaald
- Een refactor van één laag tien feature-files raakt
- Niemand meer durft te wijzigen wat al bestaat

Dit document legt twee regels vast die dat voorkomen, plus de migratie-route voor de plek waar we straks state-management toevoegen.

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
| Navigation tree | `useNavTree()` | `queryCollection('docs')` | Sidebar replacement Step 1 |
| Current scope | `useCurrentScope()` | `useNavTree` + `useRoute` | Sidebar replacement Step 1 |
| Breadcrumb | `useBreadcrumb()` | `useNavTree` + `useRoute` | Sidebar replacement Step 1 |
| Prev/next | `usePrevNext()` | `useNavTree` + `useRoute` | Sidebar replacement Step 1 |
| UI-state / settings | `settingsStore` | `window.localStorage` | Sidebar replacement Step 3 |
| Sidebar collapse | `useSidebarCollapse()` | `settingsStore` | Sidebar replacement Step 3 |
| Drafts | `useDrafts()` (TBD) | `localStorage` → IndexedDB | Feature 10 |
| Content mutations | Pinia `useNavStore` (TBD) | overlay-storage adapter | Feature 11 |
| AI context | `useAiContext()` (TBD) | server-route + cache | Feature 19 |

Iedere row in deze tabel heeft de regel: **niemand belt de derde kolom direct aan, alleen via de tweede.**

### Wat de regel verbiedt

- `queryCollection(...)` aanroepen in een component, layout, page, of niet-`useNavTree`-composable
- `window.localStorage.getItem/setItem/removeItem` direct gebruiken buiten `app/utils/settingsStore.ts`
- `useAsyncData('nav-tree', ...)` op meerdere plekken — er is precies één call, en die zit in `useNavTree`
- Een tweede composable schrijven die hetzelfde domein bedient onder een andere naam (`useNav` naast `useNavTree` → één moet weg)

### Wat de regel toestaat

- Pure helpers in `app/utils/<domain>.ts` mogen overal worden geïmporteerd. Ze zijn stateless
- Een feature mag een NIEUWE entry-point introduceren voor een NIEUW domein. Dan komt 'ie in bovenstaande tabel
- Een entry-point mag intern gerefactord worden zonder dat dat de tabel beïnvloedt

---

## Regel 2 — Pure derivations als standalone functies

**Logica die data afleidt uit andere data leeft als pure function in `app/utils/`. Composables zijn dunne wrappers (5-10 regels) over die utilities.**

### Wat dit betekent

Een derivation zoals "vind de scope-node voor deze route" of "platte lijst van pages voor prev/next" hoort niet ín een composable, niet in een component, en niet in een Pinia getter. Het is een pure functie van input-data naar output-data, los van Vue's reactiviteit, los van Nuxt's runtime, los van wat-dan-ook framework-specifiek.

### Waarom

- **Testbaarheid**: Vitest kan ze direct testen zonder JSDOM, zonder `@nuxt/test-utils`, zonder Nuxt-runtime
- **Swap-baarheid**: wanneer we van composable naar Pinia migreren bij feature 11, blijft de logica hetzelfde — alleen de wrapper verandert
- **Begrijpelijkheid**: bug in een prev/next-volgorde? Eén pure functie inspecteren, niet een keten van reactive composables

### Concreet — huidige pure utilities

In `app/utils/nav.ts`:

- `buildTree(pages, overlay?)` — bouwt de navigation tree
- `walkScope(routePath, lookup)` — walk-up scope-resolver
- `walkBreadcrumb(routePath, lookup)` — breadcrumb-keten
- `flattenForPrevNext(tree)` — afgevlakte page-volgorde voor prev/next

Plus de types: `NavNode`, `NavTree`, `NavOverlay`, `ContentPageLike`.

### Wat de regel toestaat

- Composables mogen state houden (`useState`, `useAsyncData`-cache, `ref`)
- Composables mogen derivations samenstellen via `computed(() => walkScope(...))`
- Pure utilities mogen elkaar aanroepen, mits er geen circulariteit ontstaat

### Wat de regel verbiedt

- Een derivation copy-pasten in twee components in plaats van de utility te hergebruiken
- Reactiviteit (`computed`, `ref`, `watch`) gebruiken binnen `app/utils/*` — die files zijn pure logic
- Een composable die zelf een tree-walk doet in plaats van de utility aan te roepen

---

## Pinia-migratiepath

**Pinia komt binnen bij feature 11 (In-app content management), niet eerder. Bij introductie blijven alle consumers ongewijzigd — `useNavTree()` wordt een Pinia getter-wrapper.**

### Tijdlijn

| Fase | Wat de state-laag doet | Wat de consumer ziet |
|---|---|---|
| **Nu — sidebar replacement t/m feature 10** | `useState('nav-tree', ...)` + `useAsyncData` cache. `settingsStore` voor localStorage. Geen Pinia | `useNavTree()`, `settingsStore`, `useDrafts()` |
| **Feature 11 — In-app content management** | Pinia `useNavStore` introduceert mutatie-actions (`addChapter`, `renamePage`, …). `useNavTree()` wordt een 5-regel wrapper rond `useNavStore().tree`. Overlay-storage adapter | Consumers van `useNavTree()` blijven ongewijzigd |
| **Feature 12 — Settings** | Pinia `useSettingsStore` consumeert dezelfde `settingsStore`-interface. Export/import-flow | Iedere `settingsStore.get/set/remove` blijft werken |
| **Phase 2 — IndexedDB** | Adapter achter `settingsStore` en de overlay-storage swappen naar IndexedDB. Pinia-store-shape blijft hetzelfde | Consumers ongewijzigd |
| **Phase 3 — IAM + backend save** | Pinia stores krijgen actions die naar de backend schrijven. Lokale state blijft optimistisch | Consumers ongewijzigd |

### Waarom Pinia, en waarom pas bij feature 11

- **Voor read-only data is Pinia overkill** — `useState` + `useAsyncData` doet hetzelfde met minder boilerplate
- **Bij feature 11 ontstaat write-side state** — mutaties met cross-feature invarianten (settings export ↔ overlay state ↔ drafts). Dat is precies wat Pinia goed kan: expliciete actions, devtools-inspectie, time-travel debugging
- **Eén keer Pinia introduceren maakt extra stores goedkoop** — feature 11, 12, 19 mogen allemaal eigen stores krijgen zonder hernieuwde architectuur-discussie

### Wat dit voor Step 1 betekent

`useNavTree()` wordt nu geschreven als pure composable. Bij feature 11 wordt 'ie geherprogrammeerd als getter-wrapper:

```ts
// Nu (Step 1) — composable met useAsyncData
export async function useNavTree() {
	const { data } = await useAsyncData<NavTree>('nav-tree', async () => {
		const pages = await queryCollection('docs').all()
		return buildTree(pages)
	})
	return data
}

// Bij feature 11 — wrapper rond Pinia
export function useNavTree() {
	const store = useNavStore()
	return computed(() => store.tree)
}
```

Consumers van `useNavTree()` merken er niks van. **Mits ze Regel 1 volgen en altijd via de composable lezen.**

---

## Folder-discipline (voor wanneer 't groot wordt)

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
    ├── useBreadcrumb.ts
    └── usePrevNext.ts
```

Tests volgen dezelfde indeling onder `tests/unit/` en `tests/e2e/`.

---

## Enforcement

### Code review

PR die Regel 1 of Regel 2 breekt zonder expliciete reden → afgewezen. De review-checklist:

- Roept dit component / composable / layout `queryCollection` of `localStorage` direct aan? → terug naar de juiste entry-point
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
	ignores: ['app/composables/useNavTree.ts'],
	rules: {
		'no-restricted-imports': ['error', {
			patterns: [{
				group: ['#imports'],
				importNames: [
					'queryCollection',
					'queryCollectionNavigation',
					'queryCollectionItemSurroundings',
				],
				message: 'Gebruik useNavTree() of een afgeleide composable. Directe queryCollection alleen in app/composables/useNavTree.ts.',
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

- **`queryCollection` in een page-component** voor een snelle lookup — gebruik `useNavTree`
- **`localStorage.setItem('ui:foo', ...)` in een composable** — gebruik `settingsStore.set('foo', ...)`
- **Twee composables die hetzelfde domein bedienen** (`useNav` naast `useNavTree`) — één moet weg
- **Een derivation in een component schrijven die ook in een utility hoort** (`pages.filter(...).sort(...)`) — verplaats naar `app/utils/<domain>.ts`
- **Pinia toevoegen "voor de toekomst"** vóór feature 11 een echte mutatie-flow nodig heeft
- **VueUse als wrapper rond een 5-regel localStorage-helper** — `settingsStore` is voldoende
- **Een generieke `<Tree>`-component** of swappable storage-adapter zonder een tweede concreet gebruik
- **Reactiviteit (`computed`, `watch`) toevoegen in `app/utils/*`** — die files zijn pure logic

---

## Wanneer deze regels wijzigen

Dit document wordt geüpdatet wanneer:

- Een nieuwe data-source toegevoegd wordt → row in de tabel onder Regel 1
- Pinia-introductie bij feature 11 → migratie-tijdlijn afvinken, eventueel folder-discipline herstructureren
- Een uitzondering op Regel 1 of 2 nodig blijkt en gemotiveerd kan worden → uitzondering documenteren mét reden, zodat het geen impliciete drift wordt

Wijzigingen aan dit document gaan via een gewone PR; review-discipline geldt ook hier.
