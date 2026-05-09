# 03-features — Echt nieuwe features

> Stage 3 van drie. Functionaliteit die de Nuxt UI docs-template niet levert en die nieuwe libraries, eigen state-management of eigen interactie-modellen meebrengt. Voor de bredere roadmap zie [`../FEATURES.md`](../FEATURES.md); voor architectuur-discipline zie [`../ARCHITECTURE.md`](../ARCHITECTURE.md).

## Wat in deze stage leeft

| | Feature | Nieuwe libraries / runtimes |
|---|---|---|
| 01 | [01-edit-met-drafts](./01-edit-met-drafts/SPEC.md) | localStorage / IndexedDB persistence |
| 02 | [02-content-management](./02-content-management/SPEC.md) | Pinia (eerste introductie — zie `ARCHITECTURE.md`) |
| 03 | [03-settings](./03-settings/SPEC.md) | Hergebruikt `settingsStore`-interface uit customization 02 stap 3 |
| 04 | [04-code-editor](./04-code-editor/SPEC.md) | CodeMirror 6 + Web Workers + WASM (Pyodide voor Python, tinygo voor Go, ...) |
| 05 | [05-card-trainer](./05-card-trainer/SPEC.md) | — (eerste release leunt op markdown-frontmatter) |
| 06 | [06-comments](./06-comments/SPEC.md) | TBD (Giscus, Discourse, of eigen backend) |
| 07 | [07-mobiele-layout](./07-mobiele-layout/SPEC.md) | — (responsive-werk over alle customizations) |
| 08 | [08-pwa-offline](./08-pwa-offline/SPEC.md) | `@vite-pwa/nuxt` + Workbox |
| 09 | [09-toegang-private-deployment](./09-toegang-private-deployment/SPEC.md) | Auth-platform (Cloudflare Access, basic auth, later SSO/SCIM) |
| 10 | [10-ai-assistent](./10-ai-assistent/SPEC.md) | Anthropic SDK + edge-function voor streaming |

## Voorwaarden voor deze stage

- **Stage 1 (foundation) is af** — branding, i18n, content-schema, deploy-config staan
- **Stage 2 (template) is stabiel** — de chrome-tweaks zijn gemerged en draaien tegen de demo-content stubs
- **`ARCHITECTURE.md`-regels worden gevolgd** — met name het Pinia-migratiepath: feature 02 (content-management) is het moment waar Pinia geïntroduceerd wordt, niet eerder

## Format per feature

Elke feature heeft één `SPEC.md` in zijn eigen folder met:

- **Summary** — 1–3 zinnen: wat doet de feature, voor wie
- **Goals** — concrete outcomes (3–6 bullets)
- **Requirements** — functionele eisen
- **Constraints** (optioneel) — wat expliciet niet in deze feature hoort
- **Implementation Steps** (optioneel, voor grotere features) — geordende stappen met `steps/` sub-folders voor `prompt.md` + `test-prompt.md`

## Workflow

Per feature:

1. **Lees de SPEC.md** plus relevante cross-refs (architectuur, andere features, foundation)
2. **Schrijf tests vóór implementatie** — `tests/unit/` of `tests/e2e/` aan repo root
3. **Volg de architectuur-regels uit `ARCHITECTURE.md`** — single entry-point per data-source, pure derivations als utilities
4. **Implementatie**, lokale verificatie, PR met scope helder afgebakend
5. **Update `ARCHITECTURE.md` § Tabel onder Regel 1** als de feature een nieuwe data-source introduceert

Eén PR = één feature. Grote features (bv. content-management of code-editor) splitten in implementation-steps via de `steps/` sub-folder.

## Wat NIET in deze stage hoort

- **Foundation-werk** (scaffolding, branding, i18n-config, schema-uitbreidingen) → [`../01-foundation/`](../01-foundation/)
- **Customizations op chrome of rendering** (sidebar, header, ToC, math, lightbox, etc.) → [`../02-template/`](../02-template/)
- **Spec-wijzigingen aan de overall productspec** → [`../SPEC.md`](../SPEC.md)
