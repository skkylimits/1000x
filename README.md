# 1000x

> Bedrijfsbreed second-brain — documentatiesite, wiki en interactief leersysteem in één. Gebouwd op de [Nuxt UI docs-template](https://github.com/nuxt-ui-templates/docs) als baseline.

Intern, auth-gated, niet voor publiek of zoekmachines (`X-Robots-Tag: noindex, nofollow`).

## Setup

```bash
pnpm install
```

## Development server

Op `http://localhost:3000`:

```bash
pnpm dev
```

## Production

```bash
pnpm build         # SSR build
pnpm generate      # Static site (.output/public)
pnpm preview       # Preview production build
```

## Quality

```bash
pnpm lint          # ESLint check (antfu config)
pnpm lint:fix      # ESLint --fix
pnpm typecheck     # nuxt typecheck (vue-tsc)
```

## Documenten

- `AGENTS.md` — canonical agent-context (CLAUDE.md / GEMINI.md zijn pointers)
- `TDD/SPEC.md` — productspecificatie
- `TDD/FEATURES.md` — overzicht van de 21 features
- `TDD/SCAFFOLDING.md` — foundation-setup-instructies
- `TDD/features/` — per-feature specs
