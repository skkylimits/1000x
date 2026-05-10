# 01-FOUNDATION — Initial scaffold

> Stage 1 van drie. Eénmalig setup-werk: clone de Nuxt UI docs-template, brand het, configureer i18n + content-schema + tooling + deploy, en zet content-stubs neer als integration-testbed voor stage 2. Zodra deze stage staat, raken we 'm niet meer aan tot er een breaking-change in een dep komt. Voor de bredere roadmap zie [`../FEATURES.md`](../FEATURES.md).

## Wat in deze stage leeft

- [`SCAFFOLDING.md`](./SCAFFOLDING.md) — bron-van-waarheid voor de stap-voor-stap setup. Eerst lezen
- [`FOUNDATION.md`](./FOUNDATION.md) — scope en non-goals voor de foundation-fase
- [`01-branding/`](./01-branding/SPEC.md) — 1000x-branding (rode "1" + default "000x", accent-kleur, site-naam, OG image, favicon). Eerste-pas in deze stage; fijntuning kan later zonder andere stages te blokkeren
- [`02-i18n/`](./02-i18n/SPEC.md) — NL default + EN secundair via `@nuxtjs/i18n`; UI-strings + content-files per taal
- [`03-content-stubs/`](./03-content-stubs/SPEC.md) — minimaal maar realistisch demo-tree onder `content/` dat alle render-paden uit stage 2 dekt (scope-modes, levels-folders, tabs-files, standalone topics, kb-fallback)

## Waarom content-stubs in foundation

Foundation eindigt **niet** wanneer de template geclonet en gebrand is. Customizations in stage 2 (`02-TEMPLATE/`) hebben rijke content nodig om tegen te kunnen ontwikkelen — een sidebar zonder verschillende scopes, een ToC zonder nested headings, een AppLevelHeader zonder level-folders, een TabBar zonder tabs-containers: dat zijn allemaal testbed-gaten.

De Nuxt-content-template's eigen demo-content (`getting-started`, `essentials`, `ai`) blijft staan als coverage van baseline markdown-render-features (callouts, code, embeds, prose). Daar bovenop voegen we de 1000x-specifieke structuur toe (zie [`03-content-stubs/SPEC.md`](./03-content-stubs/SPEC.md)).

## Wat NIET in deze stage hoort

- **Customizations op chrome of rendering** (sidebar, header, ToC, etc.) → [`02-TEMPLATE/`](../02-TEMPLATE/)
- **Echt nieuwe features** (drafts, code-editor, AI, etc.) → [`03-FEATURES/`](../03-FEATURES/)
- **Eindeloos branding-fijntunen** — eerste-pas branding is voldoende; latere fijn-tuning kan in een aparte iteratie zonder andere stages te raken
