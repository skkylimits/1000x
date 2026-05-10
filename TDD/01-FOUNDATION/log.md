  1. Pre-commit hook: er stond een handmatig geplaatste pnpm lint-staged hook in .git/hooks/pre-commit zonder dat lint-staged
  geïnstalleerd was. Per jouw goedkeuring simple-git-hooks + lint-staged toegevoegd; postinstall genereert nu de juiste hook.
  lint-staged-glob is *.{js,ts,mjs,vue,json,jsonc,yaml,yml,css,html} → eslint --fix.                                               2. vitest forward: ik schoof de Vitest+Playwright-install van sectie 8 naar sectie 1, omdat de project-post-edit-checks.sh hook   pnpm test runt op élke Edit. Configs en tests/{unit,e2e}/.gitkeep landden later in een eigen commit.
  3. TemplateMenu.vue verwijderd — was de Nuxt UI templates-picker dropdown (Starter/Landing/Docs/SaaS/…). Niet relevant voor
  1000x.
  4. nuxt-llms blijft geladen met placeholder https://1000x.example.com/ als domain. Niet uitgeschakeld omdat de module
  module-level config valideert en je hem mogelijk wilt configureren wanneer auth-gate (feature 09 in 03-FEATURES) landt.
  5. @nuxt/eslint standalone:false — nodig om plugin-conflict tussen Nuxt's preset en antfu te resolven (vue + import plugins
  kwamen anders dubbel). Documented in commit 8713179.
  6. Demo-content in 1.getting-started/, 2.essentials/, 3.ai/ behoudt veel "Nuxt UI"-referenties. Per FOUNDATION.md scope
  ("behoud content-volume intact") zijn alleen de duidelijk template-promo strings (titel, description, "Use this template",
  landing hero) gerebrand. De technische demo-content over <UCollapsible>, <UAccordion> etc. blijft als markdown-render-testbed.
  7. Pre-existing concurrent edits door tooling: AGENTS.md (+1 regel), TDD/01-FOUNDATION/SCAFFOLDING.md (+35),
  TDD/TOOLING-STRATEGY.md (+44) en TDD/LOG.md (nieuw, +26) belandden in de i18n-commit c94e5ec omdat ze tijdens werk
  gemodificeerd werden. Zou je willen splitsen via cherry-pick als je een schoner pad wilt.

  Suggestie eerste customization:
                                                                                                                                   Begin met 02-section-sidebar in plaats van eerst 01-markdown-rendering te doorlopen. Reden: de markdown-pipeline doet al wat     onze SPEC vraagt (uitgebreid schema landde in sectie 4, MDC inline ::tabs werkt out-of-the-box, code blocks en prose zijn        klaar). Een review-pass tegen onze SPEC volstaat daar. 02-section-sidebar is daarentegen de data-foundation waar 03-header,
  04-levels, 05-tabs, 06-page-chrome (breadcrumb), 09-changelog, 10-prev-next, en 11-search allemaal vanaf consumeren via
  useNavTree. De aanknooppunten zijn concreet:

  - app/app.vue:4 provideert nu queryCollectionNavigation('docs') als navigation ref — dat is jouw vervang-punt. Bouw
  useNavTree() met app/utils/nav.ts (buildTree, walkScope, kind-detection per ARCHITECTURE.md).
  - De template's auto-sidebar wordt op twee plekken gerenderd: app/components/AppHeader.vue:67 (mobiele drawer) en
  app/layouts/docs.vue:11 (desktop aside) — beide wrappen <UContentNavigation>. Beide vervangen door je <SectionSidebar> die
  useCurrentScope() gebruikt.
  - De content-stubs uit sectie 5 (scope: self/children, levels: [...], tabs: true, kb-fallback) dekken alle paden die je
  tree-build moet kunnen aanvloeren.

  Tweede iteratie daarna 01-markdown-rendering als verification-pass tegen de SPEC. De rest (03–13) volgt outside-in zoals
  FEATURES.md voorschrijft.