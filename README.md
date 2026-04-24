# CTG Legacy Investments, LLC

## Project Overview
- **Name**: CTG Legacy Investments, LLC
- **Goal**: Premium TCG card ecommerce website for selling Pokémon, Yu-Gi-Oh!, and Magic: The Gathering singles and graded slabs
- **Est**: 2026 | Legacy Investments
- **Tech Stack**: Hono + TypeScript + TailwindCSS CDN + Cloudflare Pages

## Live URL (Sandbox)
- **Dev Server**: http://localhost:3000
- **Public Sandbox**: https://3000-ifxzl6fqq64w53dw9flsi-ea026bf9.sandbox.novita.ai

## Pages & Routes
| Route | Page |
|-------|------|
| `/` | Homepage — Logo focal point, hero, featured cards, shop by game |
| `/tcg-cards` | TCG Singles — Filter by game, condition, sort, search |
| `/graded-cards` | Graded Slabs — PSA/BGS/CGC with grade visualizer |
| `/contact` | Contact & Inquiries — Form + FAQ + social |
| `/cart` | Shopping Cart — Qty controls, remove, clear |
| `/checkout` | Checkout — Shipping + Payment (Card/PayPal/Venmo) |
| `/api/contact` | POST — Contact form submission handler |

## Design System (Matching CTG Logo)
- **Background**: Deep navy/black `#050818` with space gradient
- **Gold accent**: `#D8B35A` / `#F0C96A` (primary brand color)
- **Cyan glow**: `#4CCBFF` (secondary accent)
- **Purple**: `#A66BFF` (MTG accent)
- **Teal**: `#46C7C2` (success/grading)
- **Silver**: `#C9CED6` (text/chrome)
- **Fonts**: Orbitron (headings) + Rajdhani (labels) + Inter (body)
- **Effects**: Holographic shimmer, particle animations, glow effects

## Features Implemented
- ✅ Logo as main focal point on homepage
- ✅ Dark space/cosmic theme matching logo aesthetic
- ✅ TCG Cards page with game dropdown (Pokemon/YuGiOh/MTG)
- ✅ Filter by condition, sort by price/name, keyword search
- ✅ Quick-filter buttons (All / Pokemon / YuGiOh / MTG)
- ✅ Grid/List view toggle
- ✅ Graded Cards page (PSA, BGS, CGC) with circular grade visualizer
- ✅ Add to Cart with toast notifications
- ✅ Cart badge counter in navbar (persists via localStorage)
- ✅ Shopping Cart with qty +/- controls, remove items, clear all
- ✅ Checkout with shipping options (Free/Priority/Overnight)
- ✅ Payment methods: Credit Card, PayPal, Venmo
- ✅ Promo code system (try: CTG10)
- ✅ Order confirmation overlay
- ✅ Contact form with inquiry types, FAQ accordion, social links
- ✅ Mobile responsive with hamburger navigation
- ✅ Footer with navigation, contact info, social icons

## Features Not Yet Implemented (Recommended Next Steps)
- [ ] Real payment processor (Stripe integration)
- [ ] Backend database for real product listings (Cloudflare D1)
- [ ] Real inventory management / sold-out states
- [ ] User accounts and order history
- [ ] Email notifications (SendGrid/Resend)
- [ ] Product image uploads (actual card photos)
- [ ] Search with Algolia for large catalogs
- [ ] Admin dashboard for managing listings

## Deployment
- **Platform**: Cloudflare Pages
- **Status**: Development (ready to deploy)
- **Deploy Command**: `npm run build && wrangler pages deploy dist --project-name ctg-legacy`

## Development
```bash
npm run build       # Build for production
pm2 start ecosystem.config.cjs  # Start dev server
pm2 logs ctg-legacy --nostream  # Check logs
```
