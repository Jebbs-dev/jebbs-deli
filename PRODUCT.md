# Product

## Register

brand

## Platform

web

## Users

**Primary:** Hungry customers in Lagos (and expanding Nigerian markets) who want local and African cuisines delivered fast — too tired to cook, hosting friends, or craving something specific without the search friction.

**Secondary:** Restaurant vendors who want to join the Deli network and reach those customers. The landing page speaks to both audiences with dual CTAs (Order Now / Become a Vendor); the product app serves customers first.

**Context:** Mobile-first, often evening/weekend, decision speed matters. Trust comes from live order status, local vendor credibility, and cuisine familiarity — not from generic food-app chrome.

## Product Purpose

Deli. is a food delivery platform for ordering meals from a network of restaurants — African to Continental — with live tracking and vendor onboarding. The current public face ([jebbs-deli.vercel.app](https://jebbs-deli.vercel.app/)) reads as a light, template-feeling marketing site. The rebuild goal is a premium, product-forward landing page that borrows **structure and craft language** from industrial equipment sites like [Coffee-Tech](https://www.coffee-tech.com/), while keeping Deli's own food-rooted identity.

Success looks like: a visitor believes Deli is a serious local delivery network within ~10 seconds, can order or become a vendor without hunting, and never mistakes the brand for a Chowdeck clone or a generic orange food app.

## Positioning

**Precision delivery for real Lagos appetites** — the dish is the hero product, live order status is the engineering proof, and local vendors are the identity — not a lifestyle stock photo with feature cards.

## Conversion & proof

- **Primary CTA:** Order Now → `/shop` (or equivalent menu entry)
- **Secondary CTA:** Become a Vendor — for visitors not ready to order
- **The line a visitor remembers after 10 seconds:** Discover a world of flavors at your fingertips — delivered in minutes.
- **Belief ladder:**
  1. This is a real delivery network (not a template landing page)
  2. The food looks premium and specific (jollof, suya, African/Continental range)
  3. Orders are live and trackable (kitchen-ticket / ETA language)
  4. Vendors and customers both belong here
  5. Ready to order or join as a vendor
- **Proof on hand:** Existing FAQ and feature copy (onboarding, quality meals, live tracking, 24/7 support). Testimonials: **content gap** — gather real customer + vendor quotes; do not ship invented names. Footer socials currently point at leftover Chowdeck URLs — replace with Deli accounts or marked placeholders.

## Brand Personality

**Confident, local, precise.**

Voice is warm but not cute; hungry but not desperate. The brand feels like a well-run kitchen ticket system meeting a commercial product shoot — industrial clarity applied to food, not a soft consumer-app smile. Emotional goals: appetite, trust, urgency without panic.

## Anti-references

- Generic food-delivery SaaS landings (pill CTAs, identical icon+heading+text feature grids, lifestyle hero of someone eating)
- Literal Coffee-Tech orange-on-black coffee-machine palette — borrow structure, not their brand colors
- Warm cream / sand parchment canvases as the default "food warmth" move
- Numbered 01/02/03 process scaffolding for identity pillars that are not a sequence
- Template leftover branding (Chowdeck social links, third-party account chrome)
- Fabricated testimonials presented as real customers

## Design Principles

1. **Structure from industry, color from the plate.** Borrow Coffee-Tech's section architecture (floating product hero, filterable catalog, hover cuisine panels, dense testimonials, unnumbered pillars, editorial-before-CTA). Ground color in food: pepper, palm oil, jollof — not coffee-machine copper.
2. **The dish is the machine.** Hero and catalog use isolated product imagery (3D/studio dish renders), not lifestyle photography of people eating.
3. **Live status is the signature proof.** Mono type for order numbers, ETAs, prices, timestamps — kitchen-ticket language, not decorative eyebrows.
4. **Identity pillars, not process steps.** Local Vendors / Live Tracking / Fast Delivery carry equal weight with no implied sequence and no 01/02/03 markers.
5. **Dual audience, one surface.** Customer and vendor paths stay visible (Order Now / Become a Vendor) without splitting the brand into two sites.
6. **Reuse truth, don't invent polish.** Keep proven copy (headline tone, Why Deli features, FAQs); flag missing proof (testimonials, real socials) instead of fabricating it.

## Accessibility & Inclusion

- Visible keyboard focus in the primary accent color
- Respect `prefers-reduced-motion`: disable hero float loops and scroll reveals; keep instant state changes
- All interactive elements keyboard-reachable
- Alt text on every dish/cuisine image describing the actual dish
- Touch devices: cuisine panels must not depend on hover — labels always visible on mobile
- Target WCAG 2.2 AA contrast for Fresh Cream on Ash Charcoal / Iroko and Scotch Bonnet on dark surfaces

## Information architecture (landing rebuild)

Section order for the marketing homepage (Coffee-Tech map → Deli):

1. Sticky header — `deli.` / Menu · Vendors · Track Order / Order Now
2. Hero — floating dish + order-chit tag + dual CTAs
3. Mission strip — why Deli exists → About
4. This Week's Menu — filterable grid (All / African / Continental / Fast Food / Desserts)
5. Our Cuisines — full-bleed hover-reveal panels (same four categories)
6. Why Deli — feature carousel (existing copy, no numerals)
7. Testimonials — dense wall (placeholder data until real quotes)
8. How Deli Works — three unnumbered identity pillars
9. From the Kitchen — optional editorial grid (v1 optional)
10. FAQ accordion — existing questions, mono numbering
11. Final CTA — Ready to order?
12. Footer — fix Chowdeck social leftovers

## Tech stack

**TanStack Start** (Vite + Nitro SSR) · **TanStack Router** (file routes in `src/app/`) · **TanStack Query** · TypeScript · Tailwind CSS 4 · Motion · Zustand · Radix/shadcn UI.

This is the authoritative stack for all rebuild and design work. The project **migrated from Next.js** — do not scaffold against App Router patterns (`page.tsx` metadata exports, RSC, `next/image`, `next/link`, etc.). Routes live as TanStack Router files (e.g. `src/app/index.tsx`, `src/app/shop/$storeId.tsx`); layout shell is `src/app/__root.tsx`.

The live [Vercel deploy](https://jebbs-deli.vercel.app/) may still reflect an older Next.js build. Treat it as **content and UX reference only**, not as proof of the current toolchain.
