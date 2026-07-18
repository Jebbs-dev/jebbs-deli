---
name: Deli.
description: Premium dark food delivery — pepper-red accent on warm charcoal, kitchen-ticket precision.
colors:
  ash-charcoal: "#15130F"
  iroko: "#241F19"
  scotch-bonnet: "#E8431C"
  scotch-bonnet-deep: "#C45A1A"
  palm-amber: "#C9862C"
  fresh-cream: "#F4EEE2"
  paper-cream: "#FFF4F2"
  ogbono: "#4C6B4F"
  white: "#FFFFFF"
  error: "#BA1A1A"
typography:
  display:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2.75rem, 6vw, 4.5rem)"
    fontWeight: 700
    lineHeight: 1.05
    letterSpacing: "-0.03em"
  headline:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "clamp(2rem, 4vw, 3rem)"
    fontWeight: 600
    lineHeight: 1.15
    letterSpacing: "-0.02em"
  title:
    fontFamily: "Geist Variable, Geist, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1.25rem"
    fontWeight: 600
    lineHeight: 1.3
    letterSpacing: "-0.01em"
  body:
    fontFamily: "General Sans, ui-sans-serif, system-ui, sans-serif"
    fontSize: "1rem"
    fontWeight: 400
    lineHeight: 1.6
    letterSpacing: "normal"
  label:
    fontFamily: "JetBrains Mono, ui-monospace, monospace"
    fontSize: "0.8125rem"
    fontWeight: 500
    lineHeight: 1.25
    letterSpacing: "0.02em"
rounded:
  sm: "4px"
  md: "6px"
  lg: "8px"
spacing:
  xs: "4px"
  sm: "8px"
  md: "16px"
  lg: "24px"
  xl: "48px"
  section: "120px"
components:
  button-primary:
    backgroundColor: "{colors.scotch-bonnet}"
    textColor: "{colors.ash-charcoal}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-primary-hover:
    backgroundColor: "{colors.scotch-bonnet}"
    textColor: "{colors.ash-charcoal}"
    filter: "brightness(1.1)"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-secondary:
    backgroundColor: "transparent"
    textColor: "{colors.fresh-cream}"
    rounded: "{rounded.md}"
    padding: "12px 28px"
  button-ghost:
    backgroundColor: "transparent"
    textColor: "{colors.fresh-cream}"
    rounded: "{rounded.md}"
    padding: "12px 24px"
  input-default:
    backgroundColor: "{colors.iroko}"
    textColor: "{colors.fresh-cream}"
    rounded: "{rounded.md}"
    padding: "10px 12px"
  card-default:
    backgroundColor: "{colors.iroko}"
    textColor: "{colors.fresh-cream}"
    rounded: "{rounded.lg}"
    padding: "24px"
---

# Design System: Deli.

## Overview

**Creative North Star: "The Kitchen Ticket"**

Deli. is a dark, product-forward delivery brand. Structure and craft borrow from industrial equipment sites like [Coffee-Tech](https://www.coffee-tech.com/) — floating product hero, filterable catalog, full-bleed hover panels, dense proof — but color comes from the plate: pepper, palm oil, jollof. Warm charcoal (`#15130F`), not cool near-black. Scotch Bonnet (`#E8431C`) for appetite and urgency. Palm Amber (`#C9862C`) only as a rare glow. Fresh Cream (`#F4EEE2`) for type on dark.

This system rejects the CoffeeTech Awwwards copper/obsidian palette (`#C8603D` / `#0D0E13`) as a brand transfer — that was a temporary reference, not Deli. It also rejects the live site's light lifestyle template (cream surfaces, orange-400 pills, people-eating heroes). The dish is the machine. Live order status, rendered in monospace like a kitchen ticket, is the engineering proof.

**Implementation stack:** TanStack Start + TanStack Router + Vite (see `PRODUCT.md` § Tech stack). Rebuild scaffolds and component work target this stack — not Next.js App Router.

**Key Characteristics:**
- Banded canvas: dark for product theatre (hero, cuisines, CTA, footer); warm cream paper (`#fff4f2`) for catalog/editorial/utility bands
- Scotch Bonnet accent on ≤15% of any screen; Palm Amber even rarer (steam glow, dividers)
- Three-role type: Geist (display) · General Sans (body) · JetBrains Mono (tickets only)
- Sharp geometry: 4–8px radius max; no pill buttons
- Isolated 3D/studio dish imagery — never lifestyle photos of people eating
- Flat by default; depth via Iroko tonal steps + Scotch Bonnet glow on hover
- Motion: one orchestrated hero entrance + scroll reveals + hover micro-interactions; nothing decorative beyond that

## Colors

Palette grounded in West African food — pepper, palm, jollof — not coffee-machine copper and not generic dark-mode gray.

### Primary
- **Scotch Bonnet** (#E8431C / oklch(62.0% 0.206 20.3)): Primary CTAs, active nav, price accents, focus rings, hover glow borders. Appetite + urgency in one voice.
- **Scotch Bonnet Deep** (#C45A1A / oklch(59.1% 0.156 26.6)): Hover and pressed states on primary buttons. Never a resting surface.

### Secondary
- **Palm Amber** (#C9862C / oklch(67.4% 0.127 37.9)): Steam glow, rare dividers, subtle rim-light accents on hero imagery. **Dark bands only** — Palm on paper/white is 2.8–3.0:1 and fails AA for text. Used sparingly — if it appears on every card, it has failed.

### Tertiary
- **Ogbono** (#4C6B4F / oklch(49.7% 0.028 108.0)): Live/in-stock/order-status indicator only. Never decorative, never a section background, never a CTA fill.

### Neutral
- **Ash Charcoal** (#15130F / oklch(18.8% 0.012 40.2)): Dark bands — hero, cuisine panels, final CTA, footer, sticky nav on scroll. Also ink on cream paper bands.
- **Iroko** (#241F19 / oklch(24.4% 0.019 36.6)): Elevated dark surfaces — order chit, dark cards, sticky header fill, image wells.
- **Fresh Cream** (#F4EEE2 / oklch(95.3% 0.042 35.5)): Primary text on dark bands.
- **Paper Cream** (#FFF4F2): Light paper bands — mission, menu, Why Deli, testimonials, pillars, FAQ. Not the global `body` default (shell stays Ash).
- **White** (#FFFFFF): Lifted cards/surfaces sitting on Paper Cream (menu tiles, quote cards) for separation.

### Named Rules
**The Plate Rule.** Color comes from food (pepper, palm, jollof), never from Coffee-Tech's machine palette or the old shadcn orange/green tokens. If a screen could pass for CoffeeTech with the logo swapped, the palette has drifted.

**The Two-Accent Ceiling.** Scotch Bonnet carries action. Palm Amber is atmospheric only. Ogbono is status only. A fourth accent is forbidden. Do not reintroduce orange-400 / brownie as a second orange.

**The Banded Canvas Rule.** Alternate dark theatre and cream paper by section purpose — not zebra every block:
- **Dark (Ash / image / Scotch):** Hero, Our Cuisines, Final CTA, Footer
- **Paper Cream (#FFF4F2), ink = Ash:** Mission, This Week's Menu, Why Deli, Testimonials, Pillars, FAQ
- **Global shell stays Ash** — do not set `body` to cream; cream is a band fill, not the app chrome
- **Still banned:** orange-on-cream chrome, sand/parchment as a third neutral family, light shadcn `:root` as the global system

**The Cream Atmosphere Rule.** Background photos on cream bands only where copy is sparse and hierarchy is simple. Use a strong cream wash (`rgba(255,244,242,0.82–0.93)`) so Ash type stays ≥4.5:1 *without* per-element text-shadows — if a text-shadow is needed for legibility, the wash is too weak.
- **Use atmosphere:** Mission (`bg-steam`), Why Deli (`bg-spices`), Pillars (`bg-grill` — very soft)
- **No atmosphere:** Menu grid (photos already compete), Testimonials (dense quotes), FAQ (utility list)

## Typography

**Display Font:** Geist (ui-sans-serif, system-ui fallback) — geometric, precise grotesk for headlines, logo, and CTAs.
**Body Font:** General Sans (ui-sans-serif, system-ui fallback) — humanist sans for delivery-app density.
**Label/Mono Font:** JetBrains Mono (ui-monospace, monospace fallback) — order numbers, ETAs, prices, timestamps, FAQ list numbers, hero "LAGOS · LIVE" / order-chit tags.

**Character:** Confident Geist display, readable body, ticket-system mono. The mono face is the signature typographic move — it turns metadata into kitchen content, not decorative eyebrows.

### Hierarchy
- **Display** (700, clamp(2.75rem, 6vw, 4.5rem), 1.05): Hero headlines only. Max one per viewport. Letter-spacing ≥ -0.03em.
- **Headline** (600, clamp(2rem, 4vw, 3rem), 1.15): Section titles ("This Week's Menu", "Our Cuisines").
- **Title** (600, 1.25rem, 1.3): Dish names, card titles, modal headers — Geist.
- **Body** (400, 1rem, 1.6): Descriptions, mission copy, FAQ answers — General Sans. Cap line length at 65–75ch.
- **Label / Ticket** (500, 0.8125rem, 0.02em): JetBrains Mono only for real ticket content — order `#0417`, `12 MIN`, prices, FAQ `01`–`0n` where the list is genuinely ordered. Never as section kickers above every block.

### Named Rules
**The Kitchen Ticket Rule.** Mono is reserved for order numbers, prices, ETAs, timestamps, and true list numbering. If mono appears as a decorative eyebrow ("ABOUT", "PROCESS"), delete it.

**The One-Display Rule.** Never stack two display-size headings in the same viewport.

## Elevation

**Flat by default**, dark tonal layering. Depth comes from Ash Charcoal → Iroko steps and full-bleed imagery, not resting card shadows. Product tiles may take a Scotch Bonnet glow border + soft lift on hover only.

### Shadow Vocabulary
- **Lift** (`0 8px 28px rgba(21, 19, 15, 0.45)`): Menu card hover.
- **Glow** (`0 0 0 1px #E8431C, 0 8px 32px rgba(232, 67, 28, 0.18)`): Selected / hovered product tile border treatment.
- **Modal** (`0 20px 56px rgba(0, 0, 0, 0.55)`): Dialogs, sheets, feature carousel overlays.

### Named Rules
**The Flat-By-Default Rule.** Cards at rest: Iroko fill, no shadow. If the grid looks like a 2014 app card wall, the shadow is too heavy.

## Components

Precision-engineered feel — sharp, dark, pepper-led. Soft consumer-app chrome is forbidden.

### Buttons
- **Shape:** Sharp-ish (6px / rounded-md). Max 8px. No pills (`rounded-full` prohibited on CTAs).
- **Primary:** Scotch Bonnet fill, **Ash Charcoal text** (4.64:1 — AA), 12px 28px. "Order Now", "Add", "Checkout". Fresh Cream on Scotch fails AA at 3.46:1; do not use it for button text.
- **Hover / Focus:** brightness(1.1) on the Scotch fill (both text colors fail AA on Scotch Bonnet Deep); focus-visible 2px Scotch Bonnet ring, 2px offset. Transition ≤200ms ease-out.
- **Secondary:** Transparent, 1px Fresh Cream border, Fresh Cream text. "Become a Vendor", "View menu".
- **Ghost:** Transparent, Fresh Cream text, hover Iroko background.

### Chips / Filters
- **Style:** Iroko fill, Fresh Cream text, 1px border slightly lighter than Iroko. Radius 6px.
- **Selected:** Scotch Bonnet border (1px), Fresh Cream text, Ash Charcoal or Iroko fill — not filled Scotch Bonnet pills.
- **Use:** Menu filters — All / African / Continental / Fast Food / Desserts.

### Cards / Containers
- **Corner Style:** 8px max.
- **Background:** Iroko on Ash Charcoal sections.
- **Shadow Strategy:** None at rest. Lift + Glow on product hover.
- **Border:** Optional 1px edge at ~10% Fresh Cream opacity when cards sit on Iroko parents.
- **Internal Padding:** 16–24px. Product cards: image flush top, text padded below.

### Inputs / Fields
- **Style:** Iroko fill, 1px border (muted Fresh Cream / 20% opacity), 6px radius, Fresh Cream text.
- **Focus:** 2px Scotch Bonnet outline.
- **Placeholder:** Fresh Cream at ~50% opacity — verify 4.5:1 or bump opacity.
- **Error:** Error red border + message.

### Navigation
- **Style:** Transparent over hero; solid Ash Charcoal on scroll with 1px Iroko bottom edge.
- **Logo:** `deli.` in Geist bold, Fresh Cream.
- **Links:** General Sans / Geist medium; active = Scotch Bonnet underline or text.
- **CTA:** Primary button top-right — Order Now.
- **Mobile:** Full-height sheet from right; Ash Charcoal / Iroko, labels always visible.

### Product Tile (signature)
- **Image:** Isolated 3D/studio dish on Iroko or near-black field — no lifestyle props, no hands, no table clutter.
- **Title:** Title scale, Fresh Cream.
- **Price:** JetBrains Mono. On dark surfaces: Scotch Bonnet or Fresh Cream. On light cards: Ash Charcoal (Scotch on white is 4.00:1 and fails AA at small sizes) — never muted gray.
- **Category tag:** Mono or small label. On dark: Palm Amber or Fresh Cream muted. On light: Ash at ≥60% opacity (Palm on paper/white is 2.8–3.0:1 and fails AA).
- **Hover:** Lift + Scotch Bonnet glow border.

### Order Chit (signature)
- **Form:** Small floating ticket beside the hero dish — e.g. `#0417 · JOLLOF + SUYA · 12 MIN`.
- **Type:** JetBrains Mono exclusively.
- **Surface:** Iroko with 1px Palm Amber or Fresh Cream edge; optional Ogbono live dot.
- **Motion:** Delayed fade-in after hero dish; no bounce.

### Cuisine Panels
- **Desktop:** Full-bleed image; label + one-line copy + arrow on hover with dark gradient overlay.
- **Mobile / touch:** Labels always visible — never hover-only content.

## Do's and Don'ts

### Do:
- **Do** use Ash Charcoal (`#15130F`) as the default canvas and Iroko (`#241F19`) for elevation.
- **Do** use Scotch Bonnet (`#E8431C`) for every primary CTA and the dominant accent — one pepper voice.
- **Do** reserve JetBrains Mono for kitchen-ticket content (orders, prices, ETAs, FAQ numbers).
- **Do** treat the dish as the hero product — isolated studio/3D renders with consistent lighting rig.
- **Do** present Local Vendors / Live Tracking / Fast Delivery as equal identity pillars with no 01/02/03.
- **Do** respect `prefers-reduced-motion`: kill hero float and scroll reveals; keep instant states.
- **Do** fix footer socials — no Chowdeck leftover URLs (PRODUCT.md anti-reference).

### Don't:
- **Don't** use CoffeeTech copper/obsidian (`#C8603D` / `#0D0E13`) or the old `land-*` green / orange-400 tokens. Paper Cream `#FFF4F2` is allowed for bands only — not as global body chrome.
- **Don't** set the global `body` to Paper Cream or orange-on-cream chrome — cream is for paper *bands* only; the shell stays Ash.
- **Don't** put busy background photos behind Menu, Testimonials, or FAQ — those need clean scanning.
- **Don't** alternate dark/light on every consecutive section without purpose — that reads as carnival, not industrial rhythm.
- **Don't** use lifestyle heroes of people eating; the dish is the machine.
- **Don't** use pill buttons, glassmorphism cards, gradient text, or side-stripe accent borders.
- **Don't** put uppercase tracked eyebrows above every section — mono kickers are for real ticket data only.
- **Don't** number identity pillars as a sequence (01/02/03) — they are not steps.
- **Don't** invent realistic fake testimonials for production; use clearly marked placeholders until real quotes exist.
- **Don't** gate content on hover alone (cuisine panels) or on scroll-triggered visibility classes — defaults must be readable without JS or hover.
