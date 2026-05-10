---
name: feed-the-tdd
description: Use when the user wants to feed a code-review lesson, recurring agent-mistake, or new project rule into the TDD documentation. Triggers on phrases like "feed-the-tdd", "feeden naar tdd", "tdd voeden", "/feed-the-tdd", or explicit invocation. Routes the rule to the correct doc (AGENTS.md / TDD/ARCHITECTURE.md / TDD/TOOLING-STRATEGY.md / a stage-README / a per-customization SPEC) by applying the heuristic "would a fresh agent only reading AGENTS.md repeat this mistake?". Logs every change to TDD/LOG.md with date, feature, trigger and reasoning. Do NOT trigger on generic mentions of "lesson learned", "rule" or "compounding" alone — only when explicitly tied to TDD documentation updates.
---

# feed-the-tdd

Route a code-review lesson or recurring agent-mistake to the right TDD doc, then log the change to `TDD/LOG.md`. Apply the project's compounding-learning loop without bloating AGENTS.md.

## Step 1 — Capture the lesson + metadata

If the user invoked you with `$ARGUMENTS` containing only a short description, **ask for the missing metadata** before proceeding:

1. **What** — wat de agent fout deed of welke regel ze willen encoden (vereist; meestal in de invoke-tekst)
2. **Where** — welke feature, customization of task surfaced dit (bv. "section-sidebar Step 1", "general / cross-cutting", "tooling")
3. **Why** — waarom is dit een blijvende regel; wat is het risico als we 'm niet hadden

Als de user `/feed-the-tdd` zonder argument deed, vraag alle drie. Als de invoke-tekst sommige al dekt, vraag alleen wat ontbreekt.

## Step 2 — Classify

Apply this decision tree to determine the target doc:

| Aard van de regel | Target |
|---|---|
| **Cross-cutting agent-gedrag** ("altijd via composable, nooit raw fetch") | `AGENTS.md` |
| **Architecturale beslissing** ("Pinia komt pas bij feature X") | `TDD/ARCHITECTURE.md` |
| **Tooling / lint** ("geen Prettier") | `TDD/TOOLING-STRATEGY.md` |
| **Stage-specifieke decision-rule** ("OOTB-first voor template") | `TDD/02-TEMPLATE/README.md` (of 01-FOUNDATION / 03-FEATURES README) |
| **Domain-specifiek contract** ("tabs-container = sidebar leaf") | De relevante `SPEC.md` in `02-TEMPLATE/<n>/` of `03-FEATURES/<n>/` |

Verklaar je classificatie kort aan de user voor je verder gaat.

## Step 3 — Pas de heuristiek toe

Vraag: **"Zou een fresh agent die ALLEEN `AGENTS.md` leest en daarna een task pakt deze fout opnieuw maken?"**

- **Ja** → de regel is cross-cutting genoeg voor `AGENTS.md`. Als de primaire target ook `AGENTS.md` is: alleen daar toevoegen. Als de primaire target elders is: voeg in `AGENTS.md` een **one-liner cross-ref toe** met "zie [target] § [sectie]"
- **Nee, alleen als de agent de specialisatie-doc niet leest** → laat het in de specialisatie-doc, niet in `AGENTS.md` (anders bloat 'ie)

## Step 4 — Lees target doc en stel toevoeging voor

1. Lees de target-doc
2. Vind de juiste sectie (bestaande regels-sectie, "Niet doen", anti-patterns, requirements, etc.)
3. Match de bestaande bullet-stijl en formattering precies
4. Stel de exacte toevoeging voor (full text van de bullet)
5. Toon waar het ingevoegd wordt en de AGENTS.md cross-ref one-liner als die er is

## Step 5 — Confirm + apply

1. Toon de diff aan de user
2. Vraag bevestiging
3. Pas de wijzigingen toe via `Edit` tool
4. Touch de gewijzigde files via `wsl -d Ubuntu -- touch <pad>` zodat VS Code reloadt

## Step 6 — Log to TDD/LOG.md

**Eerst checken of `TDD/LOG.md` bestaat.** Zo niet, create 'm met deze template:

```markdown
# TDD Change Log — Compounding Learning

> Append-only log van alle regels en guardrails die via de `feed-the-tdd` skill zijn toegevoegd aan TDD-docs. Elke entry registreert datum, target-doc, feature/area, trigger, en de redenering achter de regel. Nieuwste entries bovenaan.
>
> **Niet handmatig editen** — de skill onderhoudt deze file. Voor het toevoegen van een regel: gebruik `feeden naar tdd: <beschrijving>` of `/feed-the-tdd <beschrijving>`.

---

<!-- ENTRIES START — newest on top -->
```

**Daarna**, voeg een nieuwe entry toe direct na de marker `<!-- ENTRIES START — newest on top -->` (newest first):

```markdown
## YYYY-MM-DD HH:MM — <korte titel, max 8 woorden>

**Target doc:** `<full path>`
**Feature/area:** <bv. "section-sidebar Step 1" / "Cross-cutting" / "tooling">
**Trigger:** <wat de agent fout deed of wat user wil voorkomen — 1-2 zinnen>
**Why:** <waarom is dit een blijvende regel — risico als we 'm niet hadden, 1-2 zinnen>
**Toegevoegd onder:** <sectie-naam in target doc, bv. "Niet doen" of "Anti-patterns" of "§ Requirements">
**Bullet toegevoegd:**

> <exacte tekst van de bullet die je in Step 5 hebt toegepast>

<-- als er ook een AGENTS.md cross-ref is toegevoegd: -->
**+ AGENTS.md cross-ref:**

> <exacte tekst van de cross-ref one-liner>

---
```

Datum/tijd haal je via een Bash-call: `date '+%Y-%m-%d %H:%M'` in WSL.

Touch `TDD/LOG.md` na de update zodat VS Code reloadt.

## Step 7 — Verificatie

Run `git status -s` zodat de user ziet wat veranderd is:
- Target doc (gewijzigd)
- Eventueel `AGENTS.md` (cross-ref one-liner)
- `TDD/LOG.md` (nieuwe entry of nieuwe file)

## Voorbeelden

**Voorbeeld 1 — cross-cutting:**

User: *"feeden naar tdd: agent installeerde een eigen breadcrumb-composable terwijl `<UBreadcrumb>` OOTB werkt"*

Step 1 — vraag missing: *"Where surfaced dit (welke feature)?"* en *"Why is dit een blijvende regel?"*
User antwoordt: *"section-sidebar Step 2 review"* en *"voorkomt drift naar eigen-componenten ipv OOTB"*

Step 2 — Classificatie: cross-cutting agent-gedrag (geldt voor élke component-keuze).
Step 3 — Heuristiek: ja, fresh agent zou herhalen → blijft in AGENTS.md, geen aparte doc.
Step 4 — Voorgestelde bullet onder `AGENTS.md` § Niet doen:

> Geen eigen composable bouwen voor wat Nuxt UI v4 OOTB levert (bv. `<UBreadcrumb>`, `<UContentToc>`); zie OOTB-first decision-rule in `TDD/02-TEMPLATE/README.md`.

Step 5 — Apply na confirm.
Step 6 — Log entry:

```markdown
## 2025-05-10 16:45 — Geen eigen breadcrumb-composable

**Target doc:** `AGENTS.md`
**Feature/area:** Cross-cutting (section-sidebar Step 2 review)
**Trigger:** Agent installeerde een eigen `useBreadcrumb` composable terwijl Nuxt UI's `<UBreadcrumb>` OOTB werkt.
**Why:** Voorkomt drift naar eigen-componenten i.p.v. OOTB hergebruik. Zonder deze regel zou compounding van duplicate-componenten optreden.
**Toegevoegd onder:** `AGENTS.md` § Niet doen
**Bullet toegevoegd:**

> Geen eigen composable bouwen voor wat Nuxt UI v4 OOTB levert (bv. `<UBreadcrumb>`, `<UContentToc>`); zie OOTB-first decision-rule in `TDD/02-TEMPLATE/README.md`.

---
```

**Voorbeeld 2 — architecturaal met AGENTS-cross-ref:**

User: *"feeden: agent gebruikte queryCollectionItemSurroundings direct in een page component"*

Step 2 — Classificatie: architecturaal (Regel 1 — single entry-point).
Step 3 — Heuristiek: ja → ook AGENTS.md cross-ref one-liner.
Step 4 — Voorgestelde bullet onder `TDD/ARCHITECTURE.md` § Anti-patterns + cross-ref in `AGENTS.md` § Niet doen.
Step 5 — Apply beide.
Step 6 — Log entry met **+ AGENTS.md cross-ref**-veld gevuld.

## Niet doen

- **Niet alles in AGENTS.md proppen** — het hele punt van deze skill is dat AGENTS.md compact blijft (~150 regels max)
- **Niet de existing bullet-stijl negeren** — match de toon en lengte van bestaande regels in dezelfde sectie
- **Niet zonder confirmation schrijven** — toon altijd eerst de diff, wacht op user-go-ahead
- **Geen duplicates** — check of de regel al in een andere doc staat voordat je 'm toevoegt
- **Niet vergeten te loggen** — Step 6 is verplicht; zonder log gaat de compounding-trail verloren
- **LOG.md niet handmatig editen** in deze flow — alleen via Step 6 append-pattern

## Wanneer NIET aanslaan

Als de user gewoon "lesson learned" of "we moeten dit onthouden" zegt zonder explicit te willen feeden naar TDD-docs — niet triggeren. Wacht op expliciete trigger ("feed-the-tdd", "feeden naar tdd", "/feed-the-tdd").