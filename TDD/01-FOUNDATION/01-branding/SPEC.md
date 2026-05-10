# Branding fine-tuning

## Summary

Deze customization vervangt de visuele basis-branding van de Nuxt UI docs-template door de definitieve 1000x-huisstijl. Foundation-werk heeft de eerste pass al gedaan (primary color, logo, site-naam); deze customization doet de fijn-tuning: definitieve red-shade, logo-spacing, favicon-set en OG image. Voor de organisatie en lezers die een herkenbare 1000x-identiteit moeten zien op iedere surface.

## Goals

- Iedere touchpoint van de app voelt als één samenhangende 1000x-identiteit, niet als een gegeneriekde docs-template
- Sociale-media-previews en favicons tonen de juiste branding op alle gangbare devices en kanalen
- Latere visuele bijsturing kan zonder ingrijpen in feature-code: huisstijl is een config-laag, geen feature-laag
- Geen functionele afhankelijkheid op andere customizations of features; deze customization staat los

## Requirements

- De definitieve 1000x-rood-tint vervangt de baseline-primary-kleur over de hele app (knoppen, links, active-states, accenten)
- Logo-spacing in de header (zie Header, customization 03 in 02-TEMPLATE) volgt de definitieve 1000x-richtlijnen voor whitespace en uitlijning
- Een complete favicon-set (verschillende formaten en groottes voor desktop en mobiele platforms) is geconfigureerd
- Een OG image met 1000x-branding wordt meegegeven aan iedere pagina voor sociale-media-previews
- Theme-color in het Web App Manifest (zie PWA en offline-werking, feature 08 in 03-FEATURES) is afgestemd op de 1000x-rood-tint
- Light- en dark-thema's hebben beide een gevalideerde 1000x-paletvariant die WCAG 2.1 AA-contrastregels respecteert
- Branding-assets (logo, favicon, OG image, kleurenpalet) leven als config zodat aanpassen geen component-werk vereist
- Deze customization heeft geen functionele afhankelijkheid op feature-specs en raakt geen andere customizations
- Bij i18n-wissel (zie Internationalisatie, i18n, customization 02 in 01-FOUNDATION) blijft de branding identiek; geen taal-specifieke logo's of kleuren in de eerste release
