# TDD Change Log — Compounding Learning

> Append-only log van alle regels en guardrails die via de `feed-the-tdd` skill zijn toegevoegd aan TDD-docs. Elke entry registreert datum, target-doc, feature/area, trigger, en de redenering achter de regel. Nieuwste entries bovenaan.
>
> **Niet handmatig editen** — de skill onderhoudt deze file. Voor het toevoegen van een regel: gebruik `feeden naar tdd: <beschrijving>` of `/feed-the-tdd <beschrijving>`.

---

<!-- ENTRIES START — newest on top -->

## 2026-05-10 17:23 — Geen handmatige .git/hooks/ files

**Target doc:** `TDD/TOOLING-STRATEGY.md` (primary) + cross-ref in `AGENTS.md` + setup-stap in `TDD/01-FOUNDATION/SCAFFOLDING.md` § 7
**Feature/area:** Foundation / tooling (SCAFFOLDING sectie 7)
**Trigger:** Een agent (of mens) plaatste handmatig een `.git/hooks/pre-commit` die `pnpm lint-staged` aanriep, maar `lint-staged` was niet geïnstalleerd. Commit faalde met `pnpm: not found` op een fresh clone-state.
**Why:** Handmatige hook-files breken bij elke fresh clone, overleven geen `git rm -rf .git`, kunnen tools aanroepen die niet in `package.json` staan, en zijn niet zichtbaar voor code-review of in de git-history. Declaratieve config via `simple-git-hooks` in `package.json` is reproducible, review-baar, en garandeert dat de hook alleen tools uit `devDependencies` aanroept.
**Toegevoegd onder:** `TOOLING-STRATEGY.md` § Hook-management (nieuwe top-level sectie tussen "Vier ontwerp-keuzes" en "Concrete configs"); `SCAFFOLDING.md` § 7 (sub-sectie "Pre-commit hook via simple-git-hooks"); `AGENTS.md` § Niet doen (cross-ref bullet).
**Bullet toegevoegd:**

> Hook-management — Git-hooks worden declaratief beheerd via `simple-git-hooks` in `package.json`, niet handmatig in `.git/hooks/`. `simple-git-hooks` schrijft de hook-files tijdens `postinstall`. Geen handmatige `.git/hooks/`-files plaatsen. Fix bij stale leftover: `rm .git/hooks/pre-commit && pnpm install` — postinstall regenereert 'm vanaf de declaratieve config.

**+ AGENTS.md cross-ref:**

> Geen handmatige `.git/hooks/`-files plaatsen — alle git-hooks worden declaratief beheerd via `simple-git-hooks` in `package.json` (zie `TDD/TOOLING-STRATEGY.md` § Hook-management). Bij broken hooks: stale file verwijderen, `pnpm install` regenereert 'm.

---
