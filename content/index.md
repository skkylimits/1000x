---
seo:
  title: 1000x
  description: Bedrijfsbreed second-brain — documentatiesite, wiki en interactief leersysteem in één.
---

::u-page-hero{class="dark:bg-gradient-to-b from-neutral-900 to-neutral-950"}
---
orientation: horizontal
---
#top
:hero-background

#title
[1]{.text-primary}000x

#description
Bedrijfsbreed second-brain dat documentatiesite, wiki en interactief leersysteem combineert. Lezen, bewerken, oefenen en bediscussiëren in dezelfde view.

#links
  :::u-button
  ---
  to: /getting-started
  size: xl
  trailing-icon: i-lucide-arrow-right
  ---
  Aan de slag
  :::

#default
  :::prose-pre
  ---
  code: |
    export default defineNuxtConfig({
      modules: [
        '@nuxt/ui',
        '@nuxt/content',
        'nuxt-og-image',
        'nuxt-llms',
        '@nuxtjs/i18n'
      ],

      css: ['~/assets/css/main.css']
    })
  filename: nuxt.config.ts
  ---

  ```ts [nuxt.config.ts]
  export default defineNuxtConfig({
    modules: [
      '@nuxt/ui',
      '@nuxt/content',
      'nuxt-og-image',
      'nuxt-llms',
      '@nuxtjs/i18n'
    ],

    css: ['~/assets/css/main.css']
  })
  ```
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Onder de motorkap

#features
  :::u-page-feature
  ---
  icon: i-lucide-palette
  ---
  #title
  100+ UI-componenten

  #description
  Volledige UI-bibliotheek uit de doos — badges, modals, tabs, command palette. Allemaal toegankelijk en consistent gestyled.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-type
  ---
  #title
  Verzorgde typografie

  #description
  Pre-styled prose-componenten met visueel ritme. Geen handmatige Tailwind-typography-config — directe controle per element.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-layers
  ---
  #title
  MDC-componenten

  #description
  Accordions, cards, callouts, tabs, steps, code blocks. Mix Markdown en interactieve Vue-componenten in één bestand.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-search
  ---
  #title
  Ingebouwde search

  #description
  Full-text search met fuzzy matching, keyboard shortcuts (⌘K) en directe navigatie. Geen externe service nodig.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-navigation
  ---
  #title
  Slimme navigatie

  #description
  Auto-generated navigatie en table of contents. Sticky ToC, prev/next, breadcrumb — allemaal afgeleid van je content-tree.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-moon
  ---
  #title
  Dark mode

  #description
  Vloeiende thema-wissel die systeem-voorkeuren respecteert en de gebruikerskeuze onthoudt.
  :::
::

::u-page-section{class="dark:bg-neutral-950"}
#title
Markdown als bron-van-waarheid

#features
  :::u-page-feature
  ---
  icon: i-simple-icons-markdown
  ---
  #title
  MDC-uitgebreid

  #description
  Schrijf in Markdown, embed Vue-componenten waar nodig. Interactieve elementen mengen naadloos met prose.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-text
  ---
  #title
  File-based routing

  #description
  Folder-structuur wordt navigatie-structuur. Een nieuwe pagina toevoegen is een markdown-file aanmaken.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-code
  ---
  #title
  Syntax highlighting

  #description
  Code-blocks met taaldetectie, line numbers en copy-buttons. Ondersteuning voor 100+ talen.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-database
  ---
  #title
  Content-database

  #description
  Query je content met een MongoDB-achtige API. Filter, sort en zoek door je documentatie programmatisch.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-file-code
  ---
  #title
  Frontmatter-schema

  #description
  Gevalideerd via Zod. Nav-volgorde, scope, levels, tabs — allemaal frontmatter-velden, geen losse config-files.
  :::

  :::u-page-feature
  ---
  icon: i-lucide-git-branch
  ---
  #title
  Versiebeheer

  #description
  Content leeft in je repository. Branch, review en deploy je documentatie naast je code.
  :::
::

::u-page-section{class="dark:bg-gradient-to-b from-neutral-950 to-neutral-900"}
  :::u-page-c-t-a
  ---
  links:
    - label: Aan de slag
      to: '/getting-started'
      trailingIcon: i-lucide-arrow-right
  title: Klaar om te beginnen?
  description: Open een module en duik in de docs, of probeer een interactieve oefening uit een van de Syntax-secties.
  class: dark:bg-neutral-950
  ---

  :stars-bg
  :::
::
