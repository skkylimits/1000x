# 01-foundation — Initial scaffold

> Stage 1 van drie. Eénmalig setup-werk: clone de Nuxt UI docs-template, brand het, configureer i18n + content-schema + tooling + deploy. Zodra deze stage staat, raken we 'm niet meer aan tot er een breaking-change in een dep komt. Voor de bredere roadmap zie [`../FEATURES.md`](../FEATURES.md).

## Wat in deze stage leeft

- [`SCAFFOLDING.md`](./SCAFFOLDING.md) — bron-van-waarheid voor de stap-voor-stap setup. Eerst lezen
- [`FOUNDATION.md`](./FOUNDATION.md) — scope en non-goals voor de foundation-fase
- [`01-branding/`](./01-branding/SPEC.md) — 1000x-branding (rode "1" + default "000x", accent-kleur, site-naam, OG image, favicon)
- [`02-i18n/`](./02-i18n/SPEC.md) — NL default + EN secundair via `@nuxtjs/i18n`; UI-strings + content-files per taal

## Demo-content stubs

Foundation eindigt **niet** wanneer de template geclonet en gebrand is. Customizations in stage 2 (`02-template/`) hebben rijke content nodig om tegen te kunnen ontwikkelen — een sidebar zonder verschillende scopes, een ToC zonder nested headings, een variant-tabs-balk zonder variant-files: dat zijn alles testbed-gaten.

Daarom hoort bij deze stage ook het opzetten van **content stubs** onder `content/`: een minimaal maar realistisch demo-tree met:

- Meerdere top-level scopes (Syntax, Kitt, Vuln, ...) met `index.md` met `icon` + `scope: self` + optionele `nav: [...]`
- Per scope minstens twee chapters of orphan pages
- Eén variant-pagina-set (`<base>.junior.nl.md`, `<base>.mid.nl.md`, `<base>.senior.nl.md`) ergens in de tree
- Eén pagina met content-tabs (voor het testen van tab-bewuste ToC later)
- Eén pagina met code-blocks in meerdere talen
- Eén pagina met afbeeldingen (lokaal + relatieve paden)
- Eén pagina met math-formules en één met een Mermaid-diagram (placeholders; de runtimes komen pas in `02-template/10-math-en-diagrammen`)

Deze content blijft staan tijdens de hele template-stage en dient als integration-testbed. De docs-template's eigen demo-content (`getting-started`, `essentials`, `ai`) mag blijven of worden vervangen — beide werken zolang de structuur dekt wat customizations testen.

## Wat NIET in deze stage hoort

- **Customizations op chrome of rendering** (sidebar, header, ToC, etc.) → [`02-template/`](../02-template/)
- **Echt nieuwe features** (drafts, code-editor, AI, etc.) → [`03-features/`](../03-features/)
- **Eindeloos branding-fijntunen** — eerste-pas branding is voldoende; latere fijn-tuning kan in een aparte iteratie
