# Nautilus Bay Brand Integration Review — V6

## Objective
Make the Tortoise Tracker feel like a direct digital extension of the Nautilus Bay HOA website while retaining the field-app interaction model introduced in V5.

## HOA design signals applied
- Full-width coastal landscape imagery on the public landing experience.
- Hestia-style material hierarchy: white surfaces, restrained shadows, compact radii and clear section rhythm.
- Roboto for interface/body copy and Roboto Slab for editorial headings, with system fallbacks when web fonts are unavailable.
- Charcoal heading colour and restrained grey secondary copy consistent with the Hestia visual system.
- Existing Nautilus Bay scenic imagery is referenced from the HOA website rather than duplicated into this repository.

## Conservation-platform adaptations
The tracker retains its deep-ocean and fynbos colours for operational meaning, focus, maps and field actions. The default Hestia pink accent is used only as a small editorial accent so health/status/map semantics are not confused by decorative branding.

## Imagery strategy
- Home hero: existing Nautilus Bay Slider_1 image with a dark accessibility overlay.
- Reserve context: existing Gallery_10 image.
- Demo tortoises: local original vector illustrations. Production records continue to use approved private profile photographs served by the secure public-profile-photo endpoint.
- Remote reserve imagery has a colour/gradient fallback so an offline installed PWA remains usable.

## Mobile / installed app impact
The visual system changes but the V5 platform architecture does not. Bottom tab navigation, safe areas, field wizard, haptics, offline queue and native platform adapter remain intact.

## Desktop impact
Desktop retains top navigation, wider analytics, Map Lab, tables and staff sidebar. Hestia-derived typography/material styling brings visual continuity without reducing information density.

## Expert conclusion
PASS. The application now reads as a Nautilus Bay sub-product while preserving a distinct conservation function and operational colour semantics.
