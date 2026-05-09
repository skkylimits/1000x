# Image lightbox

## Summary

Klik op een afbeelding in een artikel opent een fullscreen overlay met de afbeelding op volledige resolutie. Vooral relevant voor screenshots van VS Code, terminal-output, network-diagrammen — alles waar lezers details willen zien die op de standaard inline-grootte niet leesbaar zijn.

## Goals

- Lezers kunnen op een afbeelding klikken om hem groot te bekijken zonder uit de pagina-flow te navigeren
- Sluiten van de lightbox is intuïtief — `Esc`, klik buiten de afbeelding, of een sluit-knop
- Geen scope-creep richting volledige image-gallery functionaliteit in v1
- Auteurs hoeven niets bijzonders in markdown te doen om dit te activeren — werkt automatisch op alle inline images

## Requirements

- Klik op een afbeelding in de gerenderde markdown opent een fullscreen overlay
- Overlay toont de afbeelding op volledige resolutie, gecentreerd, met semi-transparante achtergrond
- Markdown alt-text wordt gebruikt als caption onder de afbeelding in de lightbox-view
- Sluiten via `Esc`, klik buiten de afbeelding, of een sluit-knop in de hoek
- Body-scroll wordt geblokkeerd terwijl de lightbox open is
- Werkt met alle afbeeldingen in markdown-content; geen opt-in vlag nodig per afbeelding
- Werkt op desktop en mobiel — op mobiel kan de lightbox de volledige viewport vullen

## Out of scope (voor v1)

- Multi-image gallery met thumbnails of arrow-key navigatie tussen meerdere afbeeldingen op dezelfde pagina
- Pinch-to-zoom of pan op mobiel — wel detail bekijken via fullscreen, geen interactieve zoom
- Image-annotatie tools (markers, arrows, hotspots)
- Lightbox voor andere media-types (video, embeds)

## Technical

Conform de project-brede regel uit `spec.md`: eerst checken of Nuxt UI v4 / Nuxt Content het levert, dan een ecosystem-package, en pas als laatste eigen werk.

### Uit de doos — geen werk

- **`UModal`** uit Nuxt UI levert de fullscreen overlay-mechaniek inclusief backdrop, scroll-lock, focus-trap en `Esc`-handling
- **`ProseImg`** rendert de inline afbeeldingen — alle markdown image-syntax (`![alt](path)`) gaat hier doorheen
- **`NuxtImg` / `@nuxt/image`** is reeds geconfigureerd via feature 1 — de lightbox gebruikt dezelfde pipeline maar vraagt om de **originele resolutie** in plaats van de geoptimaliseerde inline-variant

### Configureren — kleine werk

- **Geen** out-of-the-box configuratie die markdown-images automatisch in een lightbox plaatst
- Bij gebruik van `<NuxtImg>` in de lightbox: pas geen `width`/`height`/`sizes`-props toe zoals bij de inline-variant — de lightbox toont de originele afbeelding op `object-contain` binnen de viewport

### Zelf bouwen — echt werk

- **`ProseImg.vue`-override** in `app/components/content/`. Wrapt de standaard `<NuxtImg>` (uit feature 1) in een button-element of voegt een click-handler toe die een lightbox-modal opent met de huidige afbeelding-bron en alt-text
- **Lightbox-component** dat een `UModal` rendert met: een tweede `<NuxtImg>` op originele resolutie, de alt-text als caption eronder, en een sluit-knop rechtsboven
- **State-management** voor de geopende afbeelding — een composable `useLightbox()` met `currentImage` ref en `open(src, alt)` / `close()` methodes. Gedeeld tussen `ProseImg`-instances zodat er één lightbox-instance per pagina is, niet één per afbeelding

### Open punten voor implementatie

- Default-grootte van de afbeelding in de lightbox: `max-w-full max-h-full` met `object-contain`, of een max-pixel-grens? Met `object-contain` is het simpelst en werkt voor alle resoluties
- Animatie bij openen — `UModal` heeft default-transitions. Houden of overschrijven met een fade-in van de afbeelding zelf
