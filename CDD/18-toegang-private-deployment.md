# Toegang en private deployment

## Summary

Het systeem is bewust niet bedoeld voor publiek of zoekmachines. Content wordt pas gerenderd na succesvolle authenticatie in alle deployed omgevingen. Lokale development blijft auth-vrij.

## Goals

- Geen content lekt naar zoekmachines of openbare crawlers
- Onauthenticeerde gebruikers krijgen letterlijk geen content om te indexeren
- Lokale development blijft simpel — geen auth-friction
- De auth-laag groeit mee met de fase (POC → enterprise IAM)

## Requirements

- _robots.txt_ blokkeert alle user-agents met _Disallow: /_
- Iedere pagina heeft expliciete _noindex, nofollow_ meta-tags
- Content rendering staat achter een auth-gate in alle deployed omgevingen
- Voor onauthenticeerde requests serveert de server alleen een login-pagina; daadwerkelijke pagina-content (markdown, frontmatter, search-index, assets) wordt niet meegestuurd in de response
- Rogue crawlers die _robots.txt_ negeren krijgen letterlijk geen content om te indexeren
- Lokale development heeft geen auth-vereiste — app draait direct op localhost
- Eerste deployed POC: minimale auth-laag — eenvoudige password-prompt of platform-niveau auth (bv. Cloudflare Access of basic auth) die voor de site staat. Geen eigen account-systeem nodig
- Latere fase: volledige IAM met SSO/SCIM/Entra; de auth-gate wordt vervangen door de echte identity provider
- Optionele extra defense-in-depth (op klant-keuze): WAN-exclusion of VPN-only access op netwerk-niveau

Vereist dat de app deployable is met basis-content (feature 1 minimaal).
