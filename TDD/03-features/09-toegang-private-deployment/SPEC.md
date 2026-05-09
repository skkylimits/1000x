# Toegang en private deployment

## Summary

Het systeem is niet bedoeld voor publiek of zoekmachines. In alle deployed omgevingen zit content achter een auth-gate; ongeauthenticeerde requests krijgen alleen een login-pagina te zien, geen pagina-content of search-index. Voor de organisatie die docs strikt intern wil houden en voor lezers die een login-flow doorlopen voor toegang.

## Goals

- Niet-geauthenticeerde lezers en zoekmachines krijgen geen content te zien — ook geen markdown, frontmatter of search-index
- In lokale development is geen auth nodig zodat ontwikkelen snel blijft
- De eerste deployed omgeving werkt met een minimale auth-laag zonder eigen account-systeem
- Latere fases ondersteunen volwaardige IAM met SSO/SCIM zonder UI-breuk

## Requirements

- `robots.txt` bevat `Disallow: /` voor alle user-agents
- Iedere pagina rendert expliciete `noindex, nofollow` meta-tags
- Voor unauthenticated requests serveert de server alleen een login-pagina; pagina-content (markdown, frontmatter, search-index, assets) wordt niet meegestuurd
- Een crawler die `robots.txt` negeert krijgt dus letterlijk geen content om te indexeren
- Lokale development vereist geen auth; de app draait op localhost zonder login-pagina
- Eerste deployed POC werkt met een minimale auth-laag (eenvoudige password-prompt of platform-niveau auth) zonder eigen account-systeem
- Latere fase voorziet in volledige IAM met SSO/SCIM/Entra waarbij de auth-gate wordt vervangen door de echte identity provider zonder UI-breuk
- Optioneel kan op netwerk-niveau extra defense-in-depth worden toegevoegd (WAN-exclusion of VPN-only access) op klant-keuze
- Na succesvolle authenticatie laadt de gewone app (header, sidebar, content) en blijft de gebruiker daarin tot de sessie verloopt
- De login-pagina is minimaal en branded; voldoet aan WCAG 2.1 AA en is volledig toetsenbord-bedienbaar
- De Lezer-rol uit de productspec beschrijft wat een gebruiker kan zodra hij door de auth-gate is; in latere fases komen er Auteurs- en Reviewer-rollen bij zonder dat dit de huidige auth-gate aanpast
