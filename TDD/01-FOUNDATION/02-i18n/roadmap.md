Goede vraag, en je intuïtie klopt — de suffix-aanpak (`closures.nl.md`, `closures.en.md`) schaalt slecht voorbij 2-3 talen. Bij 16 talen × 3 varianten zou één conceptuele pagina ineens 48 files zijn. Dat is niet alleen rommelig in de codebase, het is vooral een content-onderhoudsnachtmerrie: elke kleine wijziging aan "wat is een closure" moet over 48 bestanden gepropageerd worden.

**Hoe Microsoft het doet (Microsoft Learn / docs.microsoft.com)**

Microsoft splitst source en vertaling fundamenteel:

1. De **source-content leeft in één taal** (Engels) in de hoofd-repo, bijvoorbeeld `azure-docs`.
2. **Vertalingen leven in aparte loc-repos** per taal, bv. `azure-docs.nl-nl`, `azure-docs.de-de`, `azure-docs.fr-fr`. Dezelfde mappenstructuur, dezelfde filenames, alleen vertaalde inhoud.
3. Tussen die twee zit een **Translation Management System (TMS)**. Vertalers werken niet in markdown-files of in de repo — ze werken in een UI die alleen de strings/paragrafen toont die vertaling nodig hebben. Vaak via XLIFF of een soortgelijk uitwisselformaat.
4. De build-pipeline trekt source + locale samen, met **fallback naar Engels** als een vertaling ontbreekt of verouderd is.
5. Veel pagina's beginnen met machinevertaling (vroeger Microsoft Translator, nu LLM-based) en alleen high-traffic content krijgt menselijke review.

Het belangrijke punt: **de hoofdcodebase blijft monolingual**. Als developer zie je alleen Engelse markdown. De 16 talen-explosie zit ergens anders, beheerd door andere mensen, met andere tooling.

**De drie hoofdpatronen die je tegenkomt**

1. **Suffix-in-filename** (Nuxt-default, wat jullie spec nu doet): `closures.nl.md`, `closures.en.md`. Files door elkaar in dezelfde map. Werkt prima tot ~3 talen, daarna onleesbaar in de file-explorer en lastig te navigeren in IDE-tabs.

2. **Per-locale folders** (Docusaurus, VitePress, de meeste grote docs-sites): `content/nl/closures.md`, `content/en/closures.md`, `content/de/closures.md`. Identieke boom onder elke taal-root. Schaalt naar 50+ talen zonder dat de structuur verstikt — je opent gewoon de map van je taal en negeert de rest. Dit is wat ik aan jullie zou aanraden zodra je voorbij 3 talen gaat.

3. **TMS-extern** (Microsoft, Stripe, Twilio, Mozilla): source in de repo, vertalingen ergens anders. Crowdin, Lokalise of Phrase als bekende SaaS-opties. Voor enterprise schaal de enige werkbare aanpak.

**Wat ik voor 1000x zou doen**

Je spec zegt nu NL primair + EN secundair. Dat is twee talen — daar is suffix-in-filename prima voor, geen reden om nu al te overengineeren. Maar bouw het zo dat de migratie naar per-locale folders later één refactor is, geen herstructurering:

- **Houd de path-resolutie achter een laag.** Nuxt Content abstraheert dit al deels — als jullie code nooit hardcoded `closures.nl.md` aanroept maar altijd via `queryCollection().where({ path: 'closures', locale: 'nl' })`, dan kun je later van suffix naar folder switchen zonder dat features omvallen.
- **Bewaar drafts en localStorage-keys per taal apart** (dat doet jullie spec al goed — `draft:{lang}:{path}`).
- **Beslis bewust over varianten × talen.** De junior/mid/senior-varianten in NL zijn al een onderhoudslast. Als je die 1-op-1 vertaalt naar 16 talen heb je 48 files per concept. Veel realistischer: variant-content is in de bron-taal, en alleen kern-pagina's worden vertaald, of vertaling gebeurt LLM-assisted on-demand zoals jullie pipeline-idee voor n8n suggereert.

**De échte vraag voor jullie**

Wie gaat die 16 talen schrijven en onderhouden? Als het antwoord "een TMS + vertalers" is, hoeft de codebase-structuur er niet eens veel mee te maken — vertalingen leven dan in een externe tool. Als het antwoord "AI-vertaling met menselijke review" is, dan wil je per-locale folders zodat je per taal makkelijk kunt zien wat verouderd is en wat niet. Als het antwoord "we doen alleen NL en EN, ooit misschien DE" is, blijf bij suffix en bespaar je het werk.

Mijn vermoeden: voor 1000x is de realiteit dichter bij optie 3. Bouw voor 2-3 talen, plan de abstractielaag zodat folder-migratie later kan, en ga pas TMS-route op als er een echte business-case voor 10+ talen ontstaat.