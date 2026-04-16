# SEOHA Dental — B2B Implant Storefront

Next.js 14 App Router · TypeScript (strict) · Tailwind · shadcn/ui · Lucide React.

## Setup

```bash
npx create-next-app@latest seoha-dental --typescript --tailwind --app --eslint
cd seoha-dental

# shadcn/ui init
npx shadcn@latest init

# Install the components used on these pages
npx shadcn@latest add button card badge input table tabs

# Icons
npm i lucide-react
```

## Files in this delivery

- `app/layout.tsx` — root layout with Inter (body) + Fraunces (display) font pairing
- `app/(client)/page.tsx` — public homepage
- `app/(client)/products/[id]/page.tsx` — product detail page
- `tailwind.config.ts` — exposes the `font-serif` / `font-sans` utilities

## Design notes

**Aesthetic direction: refined minimal editorial.**
Rather than a generic "tech-blue B2B" look, this design borrows restraint from
medical/luxury print: serif italic accents for humanity, near-black (`slate-900`)
instead of saturated blue for primary CTAs, bone-white backgrounds, and tight
uppercase micro-labels with em-dash prefixes. Implant visuals are rendered as
inline SVG (no external asset dependency) so the pages are self-contained and
lighthouse-perfect out of the box. Replace with real product photography for
production — the SVG fallback gives you a graceful default.

**Trust signals are baked into the chrome,** not ornamental:
certification badges in the header pill, ISO/K-FDA/CE/US-FDA footer strip, lot
numbers on product cards, and stats-band (5,000+ dentists · 62 countries) between
hero and features.

**WhatsApp** appears as both a floating pill (homepage) and an in-context inquiry
button (PDP) tuned to the real `#25D366` brand green — bulk B2B buyers expect
human contact for negotiation.

## Paths to swap for production

- `MOCK_PRODUCTS` in the PDP → real data source (Sanity, Shopify, custom API)
- Inline `<GalleryImplantSVG>` → `<Image>` components with actual photography
- Hard-coded WhatsApp link → env var `NEXT_PUBLIC_WHATSAPP_NUMBER`
