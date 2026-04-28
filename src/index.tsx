import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(homePage())
})

// ─── SHOP PAGE (Booster Boxes, Packs, Singles) ───────────────────────────────
app.get('/shop', (c) => {
  return c.html(shopPage())
})

// ─── TCG CARDS PAGE ──────────────────────────────────────────────────────────
app.get('/tcg-cards', (c) => {
  return c.html(tcgCardsPage())
})

// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
app.get('/contact', (c) => {
  return c.html(contactPage())
})

// ─── CART PAGE ───────────────────────────────────────────────────────────────
app.get('/cart', (c) => {
  return c.html(cartPage())
})

// ─── CHECKOUT PAGE ───────────────────────────────────────────────────────────
app.get('/checkout', (c) => {
  return c.html(checkoutPage())
})

// ─── API: Contact Form Submit ─────────────────────────────────────────────────
app.post('/api/contact', async (c) => {
  const body = await c.req.json()
  // In production, you would send an email or save to DB here
  return c.json({ success: true, message: 'Your inquiry has been received! We\'ll get back to you within 24 hours.' })
})

// ─── SHARED HTML PIECES ──────────────────────────────────────────────────────
function getHead(title: string) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${title} | CTG Legacy Investments</title>
  <meta name="description" content="CTG Legacy Investments LLC — Premium Pokémon TCG booster boxes, booster packs, Elite Trainer Boxes and Booster Bundles. Factory sealed. Collect. Invest. Dominate the Game." />
  <meta name="keywords" content="Pokemon cards, booster boxes, Elite Trainer Box, Collector Box, TCG, Charizard, buy Pokemon cards, booster packs, factory sealed, Pokemon booster box, Yu-Gi-Oh, Magic The Gathering" />
  <meta property="og:title" content="${title} | CTG Legacy Investments" />
  <meta property="og:description" content="Premium Pokémon TCG booster boxes, packs, Elite Trainer Boxes and Booster Bundles — all factory sealed. Collect. Invest. Dominate." />
  <meta property="og:type" content="website" />
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content="CTG Legacy Investments — Collect. Invest. Dominate." />
  <meta name="twitter:description" content="Premium Pokémon TCG booster boxes, packs, Elite Trainer Boxes and Booster Bundles — factory sealed." />
  <link rel="icon" type="image/svg+xml" href="data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 100 100'%3E%3Crect width='100' height='100' rx='20' fill='%23050818'/%3E%3Cdefs%3E%3ClinearGradient id='g' x1='0%25' y1='0%25' x2='100%25' y2='100%25'%3E%3Cstop offset='0%25' stop-color='%23F0C96A'/%3E%3Cstop offset='100%25' stop-color='%23D8B35A'/%3E%3C/linearGradient%3E%3C/defs%3E%3Ctext x='50' y='68' font-family='Arial Black' font-size='44' font-weight='900' text-anchor='middle' fill='url(%23g)'%3ECTG%3C/text%3E%3C/svg%3E">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link href="https://fonts.googleapis.com/css2?family=Rajdhani:wght@400;500;600;700&family=Orbitron:wght@400;600;700;800;900&family=Inter:wght@300;400;500;600&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="https://cdn.jsdelivr.net/npm/@fortawesome/fontawesome-free@6.4.0/css/all.min.css">
  <script src="https://cdn.tailwindcss.com"></script>
  <style>
    :root {
      --bg-deep:      #050818;
      --bg-mid:       #0A0D1F;
      --bg-card:      #0e1230;
      --bg-card2:     #111636;
      --gold:         #D8B35A;
      --gold-light:   #F0C96A;
      --gold-dim:     #a07c30;
      --cyan:         #4CCBFF;
      --cyan-dim:     #1a8ab5;
      --blue:         #1F5BFF;
      --silver:       #C9CED6;
      --silver-light: #EEF1F6;
      --purple:       #A66BFF;
      --red:          #D84A3A;
      --teal:         #46C7C2;
      --text-main:    #EEF1F6;
      --text-muted:   #8892b0;
    }

    * { box-sizing: border-box; margin: 0; padding: 0; }

    body {
      font-family: 'Inter', sans-serif;
      background: var(--bg-deep);
      color: var(--text-main);
      min-height: 100vh;
      overflow-x: hidden;
    }

    /* ── SPACE BACKGROUND ── */
    body::before {
      content: '';
      position: fixed;
      inset: 0;
      background:
        radial-gradient(ellipse at 20% 50%, rgba(31,91,255,0.08) 0%, transparent 60%),
        radial-gradient(ellipse at 80% 20%, rgba(76,203,255,0.07) 0%, transparent 50%),
        radial-gradient(ellipse at 60% 80%, rgba(166,107,255,0.06) 0%, transparent 50%),
        radial-gradient(ellipse at 50% 50%, #050818 0%, #030612 100%);
      pointer-events: none;
      z-index: 0;
    }

    /* Stars */
    body::after {
      content: '';
      position: fixed;
      inset: 0;
      background-image:
        radial-gradient(1px 1px at 10% 15%, rgba(255,255,255,0.7) 0%, transparent 100%),
        radial-gradient(1px 1px at 25% 40%, rgba(255,255,255,0.5) 0%, transparent 100%),
        radial-gradient(1px 1px at 50% 8%,  rgba(255,255,255,0.6) 0%, transparent 100%),
        radial-gradient(1px 1px at 70% 30%, rgba(255,255,255,0.4) 0%, transparent 100%),
        radial-gradient(1px 1px at 85% 60%, rgba(255,255,255,0.6) 0%, transparent 100%),
        radial-gradient(1px 1px at 15% 70%, rgba(255,255,255,0.4) 0%, transparent 100%),
        radial-gradient(1px 1px at 40% 85%, rgba(255,255,255,0.5) 0%, transparent 100%),
        radial-gradient(1px 1px at 90% 90%, rgba(255,255,255,0.3) 0%, transparent 100%),
        radial-gradient(1px 1px at 60% 55%, rgba(76,203,255,0.5) 0%, transparent 100%),
        radial-gradient(1px 1px at 35% 20%, rgba(216,179,90,0.4) 0%, transparent 100%);
      pointer-events: none;
      z-index: 0;
    }

    /* ── NAVBAR ── */
    .navbar {
      position: fixed;
      top: 0; left: 0; right: 0;
      z-index: 1000;
      background: rgba(5,8,24,0.92);
      backdrop-filter: blur(20px);
      border-bottom: 1px solid rgba(216,179,90,0.25);
      box-shadow: 0 4px 30px rgba(0,0,0,0.5);
    }

    .nav-inner {
      max-width: 1400px;
      margin: 0 auto;
      padding: 0 2rem;
      height: 72px;
      display: flex;
      align-items: center;
      justify-content: space-between;
    }

    .nav-brand {
      display: flex;
      align-items: center;
      gap: 0.75rem;
      text-decoration: none;
    }
    .nav-brand-text { display: flex; flex-direction: column; line-height: 1.1; }
    .nav-brand-ctg {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.15rem;
      background: linear-gradient(135deg, var(--gold-light), var(--silver-light), var(--gold));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.12em;
    }
    .nav-brand-sub {
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.65rem;
      letter-spacing: 0.18em;
      color: var(--cyan);
      text-transform: uppercase;
    }

    .nav-links { display: flex; align-items: center; gap: 0.1rem; }
    .nav-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--silver);
      text-decoration: none;
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      transition: all 0.25s;
      position: relative;
    }
    .nav-link:hover, .nav-link.active {
      color: var(--gold-light);
      background: rgba(216,179,90,0.08);
    }
    .nav-link.active::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 50%; transform: translateX(-50%);
      width: 60%; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      border-radius: 2px;
    }

    .nav-cart-btn {
      display: flex;
      align-items: center;
      gap: 0.5rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--bg-deep);
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      border: none;
      padding: 0.5rem 1.25rem;
      border-radius: 8px;
      cursor: pointer;
      text-decoration: none;
      transition: all 0.25s;
      box-shadow: 0 0 15px rgba(216,179,90,0.3);
      position: relative;
    }
    .nav-cart-btn:hover {
      box-shadow: 0 0 25px rgba(216,179,90,0.6);
      transform: translateY(-1px);
    }
    .cart-badge {
      position: absolute;
      top: -6px; right: -6px;
      width: 18px; height: 18px;
      background: var(--red);
      border-radius: 50%;
      font-size: 0.65rem;
      font-family: 'Inter', sans-serif;
      font-weight: 700;
      display: flex; align-items: center; justify-content: center;
      color: white;
    }

    /* Hamburger — mobile only */
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
    .hamburger span { width: 24px; height: 2px; background: var(--gold-light); border-radius: 2px; transition: all 0.3s; }
    .mobile-menu {
      display: none;
      position: fixed;
      top: 72px; left: 0; right: 0;
      background: rgba(5,8,24,0.98);
      border-bottom: 1px solid rgba(216,179,90,0.2);
      padding: 1rem 1.5rem 1.5rem;
      z-index: 999;
      flex-direction: column;
      gap: 0.25rem;
      max-height: calc(100vh - 72px);
      overflow-y: auto;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu .nav-link { padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }

    /* ── NAV DROPDOWN (desktop) ── */
    .nav-dropdown {
      position: relative;
      display: inline-flex;
      align-items: center;
    }
    .nav-dropdown-btn {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--silver);
      text-decoration: none;
      padding: 0.5rem 0.85rem;
      border-radius: 6px;
      border: none;
      background: none;
      cursor: pointer;
      display: flex;
      align-items: center;
      gap: 0.35rem;
      transition: all 0.25s;
      position: relative;
    }
    .nav-dropdown-btn:hover,
    .nav-dropdown.open .nav-dropdown-btn {
      color: var(--gold-light);
      background: rgba(216,179,90,0.08);
    }
    .nav-dropdown-btn.active { color: var(--gold-light); }
    .nav-dropdown.open .nav-dropdown-btn::after {
      content: '';
      position: absolute;
      bottom: -2px; left: 50%; transform: translateX(-50%);
      width: 60%; height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), transparent);
      border-radius: 2px;
    }
    .nav-dd-arrow {
      font-size: 0.58rem;
      color: var(--gold-dim);
      transition: transform 0.25s;
      margin-left: 2px;
    }
    .nav-dropdown.open .nav-dd-arrow {
      transform: rotate(180deg);
      color: var(--gold-light);
    }
    /* The dropdown panel */
    .nav-dropdown-panel {
      position: absolute;
      top: calc(100% + 8px);
      left: 50%;
      transform: translateX(-50%) translateY(-6px) scale(0.97);
      min-width: 220px;
      background: rgba(8,10,28,0.98);
      border: 1px solid rgba(216,179,90,0.28);
      border-radius: 14px;
      box-shadow: 0 20px 60px rgba(0,0,0,0.7), 0 0 30px rgba(216,179,90,0.07);
      backdrop-filter: blur(20px);
      z-index: 2000;
      opacity: 0;
      pointer-events: none;
      transition: all 0.22s cubic-bezier(.175,.885,.32,1.1);
      overflow: hidden;
      padding: 0.4rem 0;
    }
    .nav-dropdown.open .nav-dropdown-panel {
      opacity: 1;
      pointer-events: auto;
      transform: translateX(-50%) translateY(0) scale(1);
    }
    .nav-dropdown-panel::before {
      content: '';
      display: block;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--gold), var(--cyan), var(--gold), transparent);
      margin-bottom: 0.35rem;
    }
    /* Section label inside panel */
    .nav-dd-section {
      padding: 0.25rem 0.85rem 0.1rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.6rem;
      letter-spacing: 0.22em;
      text-transform: uppercase;
      color: var(--text-muted);
    }
    .nav-dd-section:not(:first-of-type) {
      margin-top: 0.35rem;
      padding-top: 0.45rem;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    /* Standard dropdown item */
    .nav-dd-item {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.5rem 1rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--silver);
      text-decoration: none;
      transition: all 0.15s;
      white-space: nowrap;
    }
    .nav-dd-item:hover {
      background: rgba(216,179,90,0.09);
      color: var(--gold-light);
      padding-left: 1.25rem;
    }
    .nav-dd-item .dd-badge {
      margin-left: auto;
      font-size: 0.6rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 1px 6px;
      border-radius: 4px;
      flex-shrink: 0;
    }
    .ddb-pokemon { background: rgba(255,199,0,0.18); color: #FFD700; border: 1px solid rgba(255,199,0,0.3); }
    .ddb-yugioh  { background: rgba(70,199,194,0.18); color: #46C7C2; border: 1px solid rgba(70,199,194,0.3); }
    .ddb-mtg     { background: rgba(166,107,255,0.18); color: #A66BFF; border: 1px solid rgba(166,107,255,0.3); }
    .ddb-all     { background: rgba(216,179,90,0.15); color: var(--gold-light); border: 1px solid rgba(216,179,90,0.28); }


    /* ── GAME ACCORDION inside TCG dropdown ── */
    .dd-game-row {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.52rem 1rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.82rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--silver);
      cursor: pointer;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
      transition: all 0.15s;
      border-top: 1px solid rgba(255,255,255,0.05);
    }
    .dd-game-row:first-of-type { border-top: none; }
    .dd-game-row:hover { background: rgba(216,179,90,0.07); color: var(--gold-light); }
    .dd-game-row.open { color: var(--gold-light); background: rgba(216,179,90,0.06); }
    .dd-game-row .dd-gr-arrow {
      font-size: 0.58rem;
      color: var(--gold-dim);
      transition: transform 0.22s;
    }
    .dd-game-row.open .dd-gr-arrow { transform: rotate(180deg); color: var(--gold-light); }
    .dd-game-sub {
      display: none;
      flex-direction: column;
      background: rgba(0,0,0,0.18);
      border-top: 1px solid rgba(255,255,255,0.04);
      padding: 0.2rem 0;
    }
    .dd-game-sub.open { display: flex; }
    .dd-game-sub .nav-dd-item { padding-left: 1.6rem; font-size: 0.85rem; }
    .dd-game-sub .nav-dd-item:hover { padding-left: 1.85rem; }

    /* ── MOBILE ACCORDION ── */
    .mob-accordion { display: flex; flex-direction: column; }
    .mob-accordion-btn {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: 0.75rem 1rem;
      border-bottom: 1px solid rgba(255,255,255,0.05);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--silver);
      background: none;
      border-left: none; border-right: none; border-top: none;
      cursor: pointer;
      width: 100%;
      text-align: left;
      transition: color 0.2s;
    }
    .mob-accordion-btn:hover, .mob-accordion-btn.open { color: var(--gold-light); }
    .mob-accordion-btn .mob-arrow { font-size: 0.65rem; color: var(--gold-dim); transition: transform 0.25s; }
    .mob-accordion-btn.open .mob-arrow { transform: rotate(180deg); color: var(--gold-light); }
    .mob-accordion-panel {
      display: none;
      flex-direction: column;
      background: rgba(14,18,48,0.6);
      border-bottom: 1px solid rgba(255,255,255,0.04);
      padding: 0.25rem 0;
    }
    .mob-accordion-panel.open { display: flex; }
    .mob-sub-link {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      padding: 0.6rem 1.75rem;
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: all 0.15s;
    }
    .mob-sub-link:hover { color: var(--gold-light); background: rgba(216,179,90,0.06); }

    /* ── MAIN WRAPPER ── */
    .page-wrap {
      position: relative;
      z-index: 1;
      padding-top: 72px;
    }

    /* ── SECTION TITLES ── */
    .section-title {
      font-family: 'Orbitron', sans-serif;
      font-weight: 800;
      font-size: clamp(1.4rem, 3vw, 2rem);
      background: linear-gradient(135deg, var(--gold-light), var(--silver-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.08em;
      text-transform: uppercase;
    }
    .section-sub {
      font-family: 'Rajdhani', sans-serif;
      font-size: 1rem;
      color: var(--text-muted);
      letter-spacing: 0.1em;
      text-transform: uppercase;
      margin-top: 0.25rem;
    }
    .gold-line {
      width: 60px; height: 3px;
      background: linear-gradient(90deg, var(--gold), var(--cyan));
      border-radius: 2px;
      margin: 0.75rem 0 1.5rem;
    }

    /* ── CARD PRODUCT ── */
    .product-grid {
      display: grid;
      grid-template-columns: repeat(auto-fill, minmax(220px, 1fr));
      gap: 1.5rem;
    }
    .product-card {
      background: linear-gradient(145deg, var(--bg-card), var(--bg-card2));
      border: 1px solid rgba(216,179,90,0.15);
      border-radius: 16px;
      overflow: hidden;
      transition: all 0.3s;
      cursor: pointer;
      position: relative;
    }
    .product-card:hover {
      transform: translateY(-6px);
      border-color: rgba(216,179,90,0.5);
      box-shadow: 0 20px 40px rgba(0,0,0,0.5), 0 0 20px rgba(216,179,90,0.1);
    }
    .product-card-img {
      width: 100%;
      height: 180px;
      object-fit: cover;
      background: linear-gradient(135deg, #0e1a3a, #1a2455);
      display: flex; align-items: center; justify-content: center;
      font-size: 4rem;
      position: relative;
      overflow: hidden;
    }
    .product-card-img::after {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(76,203,255,0.05), rgba(216,179,90,0.05));
    }
    .holo-badge {
      position: absolute;
      top: 10px; right: 10px;
      background: linear-gradient(135deg, rgba(166,107,255,0.8), rgba(76,203,255,0.8));
      color: white;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .game-badge {
      position: absolute;
      top: 10px; left: 10px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      padding: 3px 8px;
      border-radius: 4px;
    }
    .badge-pokemon { background: rgba(255,199,0,0.25); color: #FFD700; border: 1px solid rgba(255,199,0,0.4); }
    .badge-yugioh  { background: rgba(70,199,194,0.25); color: #46C7C2; border: 1px solid rgba(70,199,194,0.4); }
    .badge-mtg     { background: rgba(166,107,255,0.25); color: #A66BFF; border: 1px solid rgba(166,107,255,0.4); }

    .product-info { padding: 1rem; }
    .product-name {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 1rem;
      color: var(--text-main);
      margin-bottom: 0.25rem;
      line-height: 1.3;
    }
    .product-set {
      font-size: 0.75rem;
      color: var(--text-muted);
      margin-bottom: 0.75rem;
    }
    .product-price {
      font-family: 'Orbitron', sans-serif;
      font-weight: 700;
      font-size: 1.15rem;
      color: var(--gold-light);
    }
    .product-condition {
      font-size: 0.7rem;
      color: var(--teal);
      margin-top: 2px;
    }
    .btn-add-cart {
      width: 100%;
      margin-top: 0.85rem;
      padding: 0.6rem;
      background: linear-gradient(135deg, rgba(216,179,90,0.15), rgba(216,179,90,0.08));
      border: 1px solid rgba(216,179,90,0.35);
      border-radius: 8px;
      color: var(--gold-light);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      cursor: pointer;
      transition: all 0.25s;
    }
    .btn-add-cart:hover {
      background: linear-gradient(135deg, rgba(216,179,90,0.3), rgba(216,179,90,0.15));
      border-color: var(--gold);
      box-shadow: 0 0 15px rgba(216,179,90,0.2);
    }
    .btn-add-cart.added {
      background: linear-gradient(135deg, rgba(70,199,194,0.25), rgba(70,199,194,0.1));
      border-color: var(--teal);
      color: var(--teal);
    }

    /* ── FILTER BAR ── */
    .filter-bar {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: center;
      background: rgba(14,18,48,0.7);
      border: 1px solid rgba(216,179,90,0.15);
      border-radius: 12px;
      padding: 1rem 1.25rem;
      margin-bottom: 2rem;
    }
    .filter-label {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-right: 0.5rem;
    }
    .filter-select, .filter-input {
      background: rgba(5,8,24,0.8);
      border: 1px solid rgba(216,179,90,0.25);
      border-radius: 8px;
      color: var(--text-main);
      font-family: 'Rajdhani', sans-serif;
      font-size: 0.9rem;
      padding: 0.5rem 1rem;
      outline: none;
      transition: border-color 0.2s;
      min-width: 150px;
    }
    .filter-select:focus, .filter-input:focus { border-color: var(--gold); }
    .filter-btn {
      background: linear-gradient(135deg, rgba(216,179,90,0.2), rgba(216,179,90,0.1));
      border: 1px solid rgba(216,179,90,0.4);
      border-radius: 8px;
      color: var(--gold-light);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 0.5rem 1.2rem;
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-btn:hover, .filter-btn.active {
      background: linear-gradient(135deg, rgba(216,179,90,0.4), rgba(216,179,90,0.2));
      border-color: var(--gold);
    }

    /* ── CUSTOM DROPDOWN ── */
    .ctg-dropdown {
      position: relative;
      display: inline-block;
    }
    .ctg-dropdown-trigger {
      display: flex;
      align-items: center;
      gap: 0.6rem;
      background: rgba(5,8,24,0.85);
      border: 1px solid rgba(216,179,90,0.3);
      border-radius: 10px;
      color: var(--text-main);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.9rem;
      letter-spacing: 0.05em;
      padding: 0.6rem 1.1rem;
      cursor: pointer;
      transition: all 0.22s;
      min-width: 170px;
      white-space: nowrap;
      user-select: none;
    }
    .ctg-dropdown-trigger:hover,
    .ctg-dropdown-trigger.open {
      border-color: var(--gold);
      background: rgba(14,18,48,0.95);
      box-shadow: 0 0 18px rgba(216,179,90,0.15);
    }
    .ctg-dropdown-trigger .dd-icon {
      font-size: 1rem;
      flex-shrink: 0;
    }
    .ctg-dropdown-trigger .dd-label {
      flex: 1;
    }
    .ctg-dropdown-trigger .dd-arrow {
      font-size: 0.65rem;
      color: var(--gold-light);
      transition: transform 0.22s;
      flex-shrink: 0;
    }
    .ctg-dropdown-trigger.open .dd-arrow {
      transform: rotate(180deg);
    }
    .ctg-dropdown-trigger .dd-selected-tag {
      font-size: 0.7rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 7px;
      border-radius: 4px;
      background: rgba(216,179,90,0.18);
      color: var(--gold-light);
      border: 1px solid rgba(216,179,90,0.3);
      margin-left: auto;
      flex-shrink: 0;
    }

    .ctg-dropdown-menu {
      position: absolute;
      top: calc(100% + 6px);
      left: 0;
      min-width: 100%;
      background: rgba(10,13,31,0.98);
      border: 1px solid rgba(216,179,90,0.28);
      border-radius: 12px;
      box-shadow: 0 16px 48px rgba(0,0,0,0.65), 0 0 24px rgba(216,179,90,0.08);
      z-index: 800;
      overflow: hidden;
      opacity: 0;
      transform: translateY(-6px) scale(0.98);
      pointer-events: none;
      transition: all 0.22s cubic-bezier(.175,.885,.32,1.1);
      backdrop-filter: blur(16px);
    }
    .ctg-dropdown-menu.open {
      opacity: 1;
      transform: translateY(0) scale(1);
      pointer-events: auto;
    }

    .dd-section-header {
      padding: 0.6rem 1rem 0.3rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.65rem;
      letter-spacing: 0.2em;
      text-transform: uppercase;
      color: var(--text-muted);
      border-bottom: 1px solid rgba(255,255,255,0.05);
      margin-top: 0.25rem;
    }
    .dd-section-header:first-child { margin-top: 0; }

    .dd-item {
      display: flex;
      align-items: center;
      gap: 0.65rem;
      padding: 0.65rem 1rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.9rem;
      color: var(--silver);
      cursor: pointer;
      transition: all 0.15s;
      border: none;
      background: none;
      width: 100%;
      text-align: left;
    }
    .dd-item:hover {
      background: rgba(216,179,90,0.08);
      color: var(--gold-light);
    }
    .dd-item.selected {
      background: rgba(216,179,90,0.12);
      color: var(--gold-light);
    }
    .dd-item.selected .dd-item-check {
      opacity: 1;
    }
    .dd-item-check {
      margin-left: auto;
      color: var(--teal);
      font-size: 0.75rem;
      opacity: 0;
      flex-shrink: 0;
    }
    .dd-item-icon {
      font-size: 1rem;
      flex-shrink: 0;
      width: 1.2rem;
      text-align: center;
    }
    .dd-item-dot {
      width: 8px; height: 8px;
      border-radius: 50%;
      flex-shrink: 0;
    }
    .dd-item-badge {
      font-size: 0.65rem;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      padding: 2px 6px;
      border-radius: 4px;
      margin-left: auto;
      flex-shrink: 0;
    }
    .dd-divider {
      height: 1px;
      background: rgba(255,255,255,0.05);
      margin: 0.25rem 0;
    }

    /* Dropdown rows layout */
    .filter-row {
      display: flex;
      flex-wrap: wrap;
      gap: 0.75rem;
      align-items: flex-start;
      margin-bottom: 1rem;
    }
    .filter-row-label {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--text-muted);
      margin-bottom: 0.35rem;
    }
    .filter-col { display: flex; flex-direction: column; }

    /* Active filter chips */
    .active-filters {
      display: flex;
      flex-wrap: wrap;
      gap: 0.5rem;
      margin-bottom: 1.25rem;
      min-height: 0;
    }
    .filter-chip {
      display: flex;
      align-items: center;
      gap: 0.4rem;
      padding: 4px 10px 4px 8px;
      background: rgba(216,179,90,0.12);
      border: 1px solid rgba(216,179,90,0.28);
      border-radius: 20px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.75rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      color: var(--gold-light);
      cursor: pointer;
      transition: all 0.2s;
    }
    .filter-chip:hover {
      background: rgba(216,74,58,0.15);
      border-color: rgba(216,74,58,0.4);
      color: var(--red);
    }
    .filter-chip-x { font-size: 0.7rem; }

    /* ── PAGE HEADER BANNER ── */
    .page-banner {
      background: linear-gradient(135deg, rgba(14,18,48,0.9), rgba(5,8,24,0.95));
      border-bottom: 1px solid rgba(216,179,90,0.2);
      padding: 3rem 2rem;
      text-align: center;
      position: relative;
      overflow: hidden;
    }
    .page-banner::before {
      content: '';
      position: absolute;
      inset: 0;
      background: linear-gradient(135deg, rgba(31,91,255,0.05), rgba(76,203,255,0.04), rgba(166,107,255,0.04));
    }

    /* ── FORMS ── */
    .form-group { margin-bottom: 1.5rem; }
    .form-label {
      display: block;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.85rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      color: var(--cyan);
      margin-bottom: 0.5rem;
    }
    .form-input, .form-select, .form-textarea {
      width: 100%;
      background: rgba(14,18,48,0.8);
      border: 1px solid rgba(216,179,90,0.2);
      border-radius: 10px;
      color: var(--text-main);
      font-family: 'Inter', sans-serif;
      font-size: 0.95rem;
      padding: 0.85rem 1rem;
      outline: none;
      transition: all 0.25s;
    }
    .form-input:focus, .form-select:focus, .form-textarea:focus {
      border-color: var(--gold);
      box-shadow: 0 0 0 3px rgba(216,179,90,0.1);
    }
    .form-textarea { resize: vertical; min-height: 130px; }

    /* ── BUTTONS ── */
    .btn-primary {
      background: linear-gradient(135deg, var(--gold), var(--gold-light));
      color: var(--bg-deep);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 800;
      font-size: 1rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
      border: none;
      border-radius: 10px;
      padding: 0.85rem 2.5rem;
      cursor: pointer;
      transition: all 0.25s;
      box-shadow: 0 0 20px rgba(216,179,90,0.3);
    }
    .btn-primary:hover {
      box-shadow: 0 0 35px rgba(216,179,90,0.55);
      transform: translateY(-2px);
    }
    .btn-secondary {
      background: transparent;
      color: var(--silver-light);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.95rem;
      letter-spacing: 0.08em;
      text-transform: uppercase;
      border: 1px solid rgba(201,206,214,0.3);
      border-radius: 10px;
      padding: 0.85rem 2rem;
      cursor: pointer;
      transition: all 0.25s;
      text-decoration: none;
      display: inline-block;
    }
    .btn-secondary:hover {
      border-color: var(--silver);
      background: rgba(201,206,214,0.07);
    }

    /* ── FOOTER ── */
    footer {
      background: rgba(5,8,24,0.95);
      border-top: 1px solid rgba(216,179,90,0.2);
      padding: 3rem 2rem 1.5rem;
      margin-top: 5rem;
      position: relative;
      z-index: 1;
    }
    .footer-inner {
      max-width: 1400px;
      margin: 0 auto;
      display: grid;
      grid-template-columns: 2fr 1fr 1fr 1fr;
      gap: 3rem;
    }
    .footer-brand-name {
      font-family: 'Orbitron', sans-serif;
      font-weight: 800;
      font-size: 1rem;
      background: linear-gradient(135deg, var(--gold-light), var(--silver-light));
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      letter-spacing: 0.12em;
      margin-bottom: 0.5rem;
    }
    .footer-desc {
      font-size: 0.85rem;
      color: var(--text-muted);
      line-height: 1.7;
      margin-top: 0.75rem;
    }
    .footer-heading {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.85rem;
      letter-spacing: 0.15em;
      text-transform: uppercase;
      color: var(--gold-light);
      margin-bottom: 1rem;
      padding-bottom: 0.5rem;
      border-bottom: 1px solid rgba(216,179,90,0.2);
    }
    .footer-links { list-style: none; display: flex; flex-direction: column; gap: 0.5rem; }
    .footer-links a {
      font-size: 0.875rem;
      color: var(--text-muted);
      text-decoration: none;
      transition: color 0.2s;
    }
    .footer-links a:hover { color: var(--gold-light); }
    .footer-bottom {
      max-width: 1400px;
      margin: 2rem auto 0;
      padding-top: 1.5rem;
      border-top: 1px solid rgba(255,255,255,0.05);
      display: flex;
      align-items: center;
      justify-content: space-between;
      font-size: 0.8rem;
      color: var(--text-muted);
    }

    /* ── RESPONSIVE ── */
    @media (max-width: 1024px) {
      .nav-links { display: none; }
      .hamburger { display: flex !important; }
      .footer-inner { grid-template-columns: 1fr 1fr; gap: 2rem; }
      .rip-ship-grid { grid-template-columns: 1fr !important; gap: 2rem !important; padding: 2rem 1.5rem !important; }
    }
    @media (max-width: 600px) {
      .nav-inner { padding: 0 1rem; }
      .footer-inner { grid-template-columns: 1fr; }
      .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
      .product-grid { grid-template-columns: repeat(auto-fill, minmax(150px, 1fr)); }
      .container { padding: 0 1rem; }
      .section { padding: 2.5rem 0; }
      .page-banner { padding: 2rem 1rem; }
      .filter-btn { font-size: 0.78rem; padding: 0.45rem 0.85rem; letter-spacing: 0.04em; }
      .mobile-menu { padding: 0.75rem 1rem 1.5rem; }
      .trust-strip-item { border-right: none !important; border-bottom: 1px solid rgba(216,179,90,0.12); }
      .trust-strip-item:last-child { border-bottom: none; }
      .hero-section { padding: 4rem 1rem 3rem !important; }
    }

    /* ── GRADED CARD SPECIAL ── */
    .grade-badge {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.5rem;
      color: var(--gold-light);
      text-shadow: 0 0 20px rgba(216,179,90,0.5);
    }
    .UNUSED_REMOVED {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }


    /* ── HERO PARTICLES ── */
    .particle {
      position: absolute;
      border-radius: 50%;
      pointer-events: none;
      animation: float-particle linear infinite;
    }
    @keyframes float-particle {
      0%   { transform: translateY(0) rotate(0deg); opacity: 0; }
      10%  { opacity: 1; }
      90%  { opacity: 1; }
      100% { transform: translateY(-600px) rotate(720deg); opacity: 0; }
    }
    @keyframes pulse-glow {
      0%, 100% { box-shadow: 0 0 20px rgba(216,179,90,0.2), 0 0 60px rgba(76,203,255,0.1); }
      50%       { box-shadow: 0 0 40px rgba(216,179,90,0.4), 0 0 100px rgba(76,203,255,0.2); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    .shimmer-text {
      background: linear-gradient(90deg, var(--gold), var(--silver-light), var(--cyan), var(--silver-light), var(--gold));
      background-size: 200% auto;
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: shimmer 4s linear infinite;
    }
    @keyframes holo-rotate {
      0%   { background-position: 0% 50%; }
      50%  { background-position: 100% 50%; }
      100% { background-position: 0% 50%; }
    }
    .holo-border {
      position: relative;
    }
    .holo-border::before {
      content: '';
      position: absolute;
      inset: -2px;
      background: linear-gradient(135deg, var(--gold), var(--cyan), var(--purple), var(--gold));
      background-size: 300% 300%;
      animation: holo-rotate 4s ease infinite;
      border-radius: inherit;
      z-index: -1;
      opacity: 0.6;
    }

    /* ── NOTIFICATION TOAST ── */
    .toast {
      position: fixed;
      bottom: 2rem;
      right: 2rem;
      background: linear-gradient(135deg, var(--bg-card), var(--bg-card2));
      border: 1px solid rgba(216,179,90,0.4);
      border-radius: 12px;
      padding: 1rem 1.5rem;
      color: var(--text-main);
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      box-shadow: 0 10px 40px rgba(0,0,0,0.5);
      z-index: 9999;
      transform: translateY(100px);
      opacity: 0;
      transition: all 0.35s cubic-bezier(.175,.885,.32,1.275);
    }
    .toast.show { transform: translateY(0); opacity: 1; }

    /* Container */
    .container { max-width: 1400px; margin: 0 auto; padding: 0 2rem; }
    .section { padding: 4rem 0; }
  </style>
</head>`
}

function getNav(active: string) {
  return `
<nav class="navbar">
  <div class="nav-inner">
    <a href="/" class="nav-brand">
      <div class="nav-brand-text">
        <span class="nav-brand-ctg">CTG Legacy</span>
        <span class="nav-brand-sub">Investments, LLC</span>
      </div>
    </a>

    <!-- ── DESKTOP NAV ── -->
    <div class="nav-links">

      <!-- Home -->
      <a href="/" class="nav-link ${active === 'home' ? 'active' : ''}">Home</a>

      <!-- TCG Cards dropdown -->
      <div class="nav-dropdown" id="dd-tcg">
        <button class="nav-dropdown-btn ${active === 'tcg' ? 'active' : ''}" onclick="toggleNavDD('dd-tcg')">
          TCG Cards <i class="fas fa-chevron-down nav-dd-arrow"></i>
        </button>
        <div class="nav-dropdown-panel" style="min-width:270px">
          <div class="nav-dd-section">Browse By Game</div>
          <a href="/tcg-cards" class="nav-dd-item"><span>🃏</span> All TCG Cards</a>

          <!-- ⚡ Pokémon row + sub -->
          <button class="dd-game-row" id="dd-gr-pokemon" onclick="toggleGameRow('pokemon')">
            <span style="display:flex;align-items:center;gap:0.5rem"><span style="color:#FFD700">⚡</span> Pokémon</span>
            <i class="fas fa-chevron-down dd-gr-arrow"></i>
          </button>
          <div class="dd-game-sub" id="dd-gs-pokemon">
            <a href="/tcg-cards?game=pokemon&cat=boxes"   class="nav-dd-item"><span>📦</span> Booster Boxes</a>
            <a href="/tcg-cards?game=pokemon&cat=elite"   class="nav-dd-item"><span>🏆</span> Elite Trainer Boxes</a>
            <a href="/tcg-cards?game=pokemon&cat=bundles" class="nav-dd-item"><span>🎁</span> Booster Bundles</a>
            <a href="/tcg-cards?game=pokemon&cat=packs"   class="nav-dd-item"><span>🎴</span> Booster Packs</a>
          </div>

          <!-- 🐉 Yu-Gi-Oh! row + sub -->
          <button class="dd-game-row" id="dd-gr-yugioh" onclick="toggleGameRow('yugioh')">
            <span style="display:flex;align-items:center;gap:0.5rem"><span style="color:#46C7C2">🐉</span> Yu-Gi-Oh!</span>
            <i class="fas fa-chevron-down dd-gr-arrow"></i>
          </button>
          <div class="dd-game-sub" id="dd-gs-yugioh">
            <a href="/tcg-cards?game=yugioh&cat=boxes" class="nav-dd-item"><span>📦</span> Booster Boxes</a>
            <a href="/tcg-cards?game=yugioh&cat=packs" class="nav-dd-item"><span>🎴</span> Booster Packs</a>
          </div>

          <!-- 🔮 Magic row + sub -->
          <button class="dd-game-row" id="dd-gr-mtg" onclick="toggleGameRow('mtg')">
            <span style="display:flex;align-items:center;gap:0.5rem"><span style="color:#A66BFF">🔮</span> Magic: The Gathering</span>
            <i class="fas fa-chevron-down dd-gr-arrow"></i>
          </button>
          <div class="dd-game-sub" id="dd-gs-mtg">
            <a href="/tcg-cards?game=mtg&cat=boxes" class="nav-dd-item"><span>📦</span> Booster Boxes</a>
            <a href="/tcg-cards?game=mtg&cat=packs" class="nav-dd-item"><span>🎴</span> Booster Packs</a>
          </div>
        </div>
      </div>

      <!-- Shop link (plain, no sub-items yet) -->
      <a href="/shop" class="nav-link ${active === 'shop' ? 'active' : ''}">Shop</a>

      <!-- Contact dropdown -->
      <div class="nav-dropdown" id="dd-contact">
        <button class="nav-dropdown-btn ${active === 'contact' ? 'active' : ''}" onclick="toggleNavDD('dd-contact')">
          Contact <i class="fas fa-chevron-down nav-dd-arrow"></i>
        </button>
        <div class="nav-dropdown-panel">
          <div class="nav-dd-section">Get In Touch</div>
          <a href="/contact" class="nav-dd-item"><span>✉️</span> Send an Inquiry</a>
          <a href="/contact#faq" class="nav-dd-item"><span>❓</span> FAQ</a>
          <a href="https://www.whatnot.com/user/ctglegacyinvestments" target="_blank" rel="noopener" class="nav-dd-item"><span>📺</span> Live on Whatnot</a>
          <a href="mailto:ctg.investments2026@gmail.com" class="nav-dd-item"><span>📧</span> ctg.investments2026@gmail.com</a>
        </div>
      </div>

      <!-- Cart -->
      <a href="/cart" class="nav-cart-btn" id="cart-nav-btn">
        <i class="fas fa-shopping-cart"></i>
        Cart
        <span class="cart-badge" id="cart-count-badge">0</span>
      </a>
    </div>

    <div class="hamburger" onclick="toggleMobileMenu()" id="hamburger">
      <span></span><span></span><span></span>
    </div>
  </div>
</nav>

<!-- ── MOBILE MENU ── -->
<div class="mobile-menu" id="mobile-menu">
  <a href="/" class="nav-link">🏠 Home</a>

  <!-- TCG Cards accordion -->
  <div class="mob-accordion">
    <button class="mob-accordion-btn" id="mob-btn-tcg" onclick="toggleMobAccordion('mob-btn-tcg','mob-panel-tcg')">
      <span><i class="fas fa-layer-group" style="margin-right:0.5rem;font-size:0.8rem;color:var(--gold-dim)"></i>TCG Cards</span>
      <i class="fas fa-chevron-down mob-arrow"></i>
    </button>
    <div class="mob-accordion-panel" id="mob-panel-tcg">
      <a href="/tcg-cards" class="mob-sub-link"><span>🃏</span> All TCG Cards</a>

      <!-- ⚡ Pokémon sub-accordion -->
      <button class="mob-accordion-btn" id="mob-btn-pok" onclick="toggleMobAccordion('mob-btn-pok','mob-panel-pok')" style="padding:0.55rem 1rem 0.55rem 1.4rem;font-size:0.78rem;border-top:1px solid rgba(255,255,255,0.05)">
        <span><span style="color:#FFD700;margin-right:0.4rem">⚡</span>Pokémon</span>
        <i class="fas fa-chevron-down mob-arrow"></i>
      </button>
      <div class="mob-accordion-panel" id="mob-panel-pok">
        <a href="/tcg-cards?game=pokemon&cat=boxes"   class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>📦</span> Booster Boxes</a>
        <a href="/tcg-cards?game=pokemon&cat=elite"   class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>🏆</span> Elite Trainer Boxes</a>
        <a href="/tcg-cards?game=pokemon&cat=bundles" class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>🎁</span> Booster Bundles</a>
        <a href="/tcg-cards?game=pokemon&cat=packs"   class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>🎴</span> Booster Packs</a>
      </div>

      <!-- 🐉 Yu-Gi-Oh! sub-accordion -->
      <button class="mob-accordion-btn" id="mob-btn-ygo" onclick="toggleMobAccordion('mob-btn-ygo','mob-panel-ygo')" style="padding:0.55rem 1rem 0.55rem 1.4rem;font-size:0.78rem;border-top:1px solid rgba(255,255,255,0.05)">
        <span><span style="color:#46C7C2;margin-right:0.4rem">🐉</span>Yu-Gi-Oh!</span>
        <i class="fas fa-chevron-down mob-arrow"></i>
      </button>
      <div class="mob-accordion-panel" id="mob-panel-ygo">
        <a href="/tcg-cards?game=yugioh&cat=boxes" class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>📦</span> Booster Boxes</a>
        <a href="/tcg-cards?game=yugioh&cat=packs" class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>🎴</span> Booster Packs</a>
      </div>

      <!-- 🔮 Magic sub-accordion -->
      <button class="mob-accordion-btn" id="mob-btn-mtgm" onclick="toggleMobAccordion('mob-btn-mtgm','mob-panel-mtgm')" style="padding:0.55rem 1rem 0.55rem 1.4rem;font-size:0.78rem;border-top:1px solid rgba(255,255,255,0.05)">
        <span><span style="color:#A66BFF;margin-right:0.4rem">🔮</span>Magic: The Gathering</span>
        <i class="fas fa-chevron-down mob-arrow"></i>
      </button>
      <div class="mob-accordion-panel" id="mob-panel-mtgm">
        <a href="/tcg-cards?game=mtg&cat=boxes" class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>📦</span> Booster Boxes</a>
        <a href="/tcg-cards?game=mtg&cat=packs" class="mob-sub-link" style="padding-left:2.2rem;font-size:0.83rem"><span>🎴</span> Booster Packs</a>
      </div>
    </div>
  </div>

  <!-- Shop plain link -->
  <a href="/shop" class="nav-link">🛍️ Shop</a>

  <!-- Contact accordion -->
  <div class="mob-accordion">
    <button class="mob-accordion-btn" id="mob-btn-contact" onclick="toggleMobAccordion('mob-btn-contact','mob-panel-contact')">
      <span><i class="fas fa-envelope" style="margin-right:0.5rem;font-size:0.8rem;color:var(--gold-dim)"></i>Contact</span>
      <i class="fas fa-chevron-down mob-arrow"></i>
    </button>
    <div class="mob-accordion-panel" id="mob-panel-contact">
      <a href="/contact" class="mob-sub-link"><span>✉️</span> Send an Inquiry</a>
      <a href="/contact#faq" class="mob-sub-link"><span>❓</span> FAQ</a>
      <a href="https://www.whatnot.com/user/ctglegacyinvestments" target="_blank" rel="noopener" class="mob-sub-link"><span>📺</span> Live on Whatnot</a>
      <a href="mailto:ctg.investments2026@gmail.com" class="mob-sub-link"><span>📧</span> Email Us</a>
    </div>
  </div>

  <a href="/cart" class="nav-link" style="color:var(--gold-light);padding:0.75rem 1rem;border-bottom:1px solid rgba(255,255,255,0.05)">
    <i class="fas fa-shopping-cart" style="margin-right:0.4rem"></i> Cart (<span id="mobile-cart-count">0</span>)
  </a>
</div>
<div class="toast" id="toast"><i class="fas fa-check-circle" style="color:var(--teal);margin-right:8px"></i><span id="toast-msg"></span></div>
`
}

function getFooter() {
  return `
<footer>
  <div class="footer-inner">
    <div>
      <div class="footer-brand-name">CTG LEGACY INVESTMENTS, LLC</div>
      <div style="font-family:'Rajdhani',sans-serif;font-size:0.75rem;letter-spacing:0.15em;color:var(--cyan);text-transform:uppercase;">EST. 2026 | Legacy Investments</div>
      <p class="footer-desc">Your premier source for factory-sealed trading cards. We specialize in Pokémon, Yu-Gi-Oh!, and Magic: The Gathering booster boxes and packs.</p>
      <div style="display:flex;gap:0.75rem;margin-top:1.25rem;">
        <a href="#" style="width:36px;height:36px;border-radius:8px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);display:flex;align-items:center;justify-content:center;color:var(--gold-light);text-decoration:none;font-size:0.9rem;transition:all 0.2s;" onmouseover="this.style.background='rgba(216,179,90,0.25)'" onmouseout="this.style.background='rgba(216,179,90,0.1)'"><i class="fab fa-instagram"></i></a>
        <a href="#" style="width:36px;height:36px;border-radius:8px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);display:flex;align-items:center;justify-content:center;color:var(--gold-light);text-decoration:none;font-size:0.9rem;transition:all 0.2s;" onmouseover="this.style.background='rgba(216,179,90,0.25)'" onmouseout="this.style.background='rgba(216,179,90,0.1)'"><i class="fab fa-tiktok"></i></a>
        <a href="#" style="width:36px;height:36px;border-radius:8px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);display:flex;align-items:center;justify-content:center;color:var(--gold-light);text-decoration:none;font-size:0.9rem;transition:all 0.2s;" onmouseover="this.style.background='rgba(216,179,90,0.25)'" onmouseout="this.style.background='rgba(216,179,90,0.1)'"><i class="fab fa-facebook"></i></a>
        <a href="#" style="width:36px;height:36px;border-radius:8px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);display:flex;align-items:center;justify-content:center;color:var(--gold-light);text-decoration:none;font-size:0.9rem;transition:all 0.2s;" onmouseover="this.style.background='rgba(216,179,90,0.25)'" onmouseout="this.style.background='rgba(216,179,90,0.1)'"><i class="fab fa-youtube"></i></a>
      </div>
    </div>
    <div>
      <div class="footer-heading">Shop</div>
      <ul class="footer-links">
        <li><a href="/tcg-cards?game=pokemon">Pokémon Cards</a></li>
        <li><a href="/tcg-cards?game=yugioh">Yu-Gi-Oh! Cards</a></li>
        <li><a href="/tcg-cards?game=mtg">Magic: The Gathering</a></li>
        <li><a href="/shop">Sealed Products</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-heading">Info</div>
      <ul class="footer-links">
        <li><a href="/contact">Contact Us</a></li>
        <li><a href="#">Shipping Policy</a></li>
        <li><a href="#">Returns & Refunds</a></li>
        <li><a href="#">Card Grading Info</a></li>
        <li><a href="#">About CTG</a></li>
      </ul>
    </div>
    <div>
      <div class="footer-heading">Contact</div>
      <ul class="footer-links" style="gap:0.75rem;">
        <li style="color:var(--text-muted);font-size:0.875rem;display:flex;gap:0.5rem;align-items:flex-start;"><i class="fas fa-envelope" style="color:var(--gold-light);margin-top:2px;font-size:0.8rem;flex-shrink:0"></i><a href="mailto:ctg.investments2026@gmail.com" style="color:var(--text-muted);text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--gold-light)'" onmouseout="this.style.color='var(--text-muted)'">ctg.investments2026@gmail.com</a></li>
        <li style="color:var(--text-muted);font-size:0.875rem;display:flex;gap:0.5rem;align-items:flex-start;"><i class="fas fa-map-marker-alt" style="color:var(--gold-light);margin-top:2px;font-size:0.8rem;flex-shrink:0"></i><span>United States</span></li>
        <li style="color:var(--text-muted);font-size:0.875rem;display:flex;gap:0.5rem;align-items:flex-start;"><i class="fas fa-clock" style="color:var(--gold-light);margin-top:2px;font-size:0.8rem;flex-shrink:0"></i><span>Mon–Sat: 9AM–7PM EST</span></li>
      </ul>
      <div style="margin-top:1.25rem;">
        <a href="/contact" class="btn-primary" style="font-size:0.8rem;padding:0.6rem 1.4rem;">Inquire Now</a>
      </div>
    </div>
  </div>
  <div class="footer-bottom">
    <span>© 2026 CTG Legacy Investments, LLC. All rights reserved.</span>
    <span>Pokémon, Yu-Gi-Oh!, and MTG are trademarks of their respective owners.</span>
  </div>
</footer>
`
}

function getCartScript() {
  return `
<script>
  // ── CART LOGIC ──────────────────────────────────────────────────────────────
  function getCart() {
    try { return JSON.parse(localStorage.getItem('ctg_cart') || '[]'); } catch(e){ return []; }
  }
  function saveCart(cart) {
    localStorage.setItem('ctg_cart', JSON.stringify(cart));
    updateCartUI();
  }
  function updateCartUI() {
    const cart = getCart();
    const count = cart.reduce((s, i) => s + i.qty, 0);
    const badge = document.getElementById('cart-count-badge');
    const mobile = document.getElementById('mobile-cart-count');
    if(badge) badge.textContent = count;
    if(mobile) mobile.textContent = count;
  }
  function addToCart(id, name, price, game, img) {
    const cart = getCart();
    const idx = cart.findIndex(i => i.id === id);
    if(idx >= 0) { cart[idx].qty++; } else { cart.push({id, name, price, game, img, qty:1}); }
    saveCart(cart);
    showToast(name + ' added to cart!');
    const btn = document.querySelector('[data-id="'+id+'"]');
    if(btn) { btn.classList.add('added'); btn.innerHTML='<i class="fas fa-check"></i> Added!'; setTimeout(()=>{ btn.classList.remove('added'); btn.innerHTML='<i class="fas fa-cart-plus"></i> Add to Cart'; }, 2000); }
  }
  function showToast(msg) {
    const t = document.getElementById('toast');
    const m = document.getElementById('toast-msg');
    if(t && m) {
      m.textContent = msg;
      t.classList.add('show');
      setTimeout(()=> t.classList.remove('show'), 3000);
    }
  }
  function toggleMobileMenu() {
    const m = document.getElementById('mobile-menu');
    if(m) m.classList.toggle('open');
  }

  // ── NAV DROPDOWN (desktop) ────────────────────────────────────────────────
  function toggleNavDD(id) {
    const el = document.getElementById(id);
    if (!el) return;
    const isOpen = el.classList.contains('open');
    // Close all dropdowns first
    document.querySelectorAll('.nav-dropdown.open').forEach(function(d) {
      d.classList.remove('open');
    });
    if (!isOpen) el.classList.add('open');
  }
  function toggleDDSub(panelId, chevronBtn) {
    var panel = document.getElementById(panelId);
    if (!panel) return;
    var isOpen = panel.classList.contains('open');
    document.querySelectorAll('.dd-sub-panel.open').forEach(function(p) {
      p.classList.remove('open');
    });
    document.querySelectorAll('.dd-game-chevron.open').forEach(function(b) {
      b.classList.remove('open');
    });
    if (!isOpen) {
      panel.classList.add('open');
      if (chevronBtn) chevronBtn.classList.add('open');
    }
  }

  // ── TCG NAV GAME ROW ACCORDION (desktop dropdown) ─────────────────────────
  function toggleGameRow(game) {
    var rowEl = document.getElementById('dd-gr-' + game);
    var subEl = document.getElementById('dd-gs-' + game);
    if (!rowEl || !subEl) return;
    var isOpen = rowEl.classList.contains('open');
    // Close all game rows
    ['pokemon','yugioh','mtg'].forEach(function(g) {
      var r = document.getElementById('dd-gr-' + g);
      var s = document.getElementById('dd-gs-' + g);
      if (r) r.classList.remove('open');
      if (s) s.classList.remove('open');
    });
    // Open the clicked one if it was closed
    if (!isOpen) {
      rowEl.classList.add('open');
      subEl.classList.add('open');
    }
  }
  // Close dropdowns when clicking outside
  document.addEventListener('click', function(e) {
    if (!e.target.closest('.nav-dropdown')) {
      document.querySelectorAll('.nav-dropdown.open').forEach(function(d) {
        d.classList.remove('open');
      });
    }
  });
  // Close dropdowns on ESC
  document.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') {
      document.querySelectorAll('.nav-dropdown.open').forEach(function(d) {
        d.classList.remove('open');
      });
    }
  });

  // ── MOBILE ACCORDION ─────────────────────────────────────────────────────
  // Sub-panel IDs that live inside TCG panel (should not close parent)
  var TCG_SUB_PANELS = ['mob-panel-pok','mob-panel-ygo','mob-panel-mtgm'];
  var TCG_SUB_BTNS   = ['mob-btn-pok','mob-btn-ygo','mob-btn-mtgm'];

  function toggleMobAccordion(btnId, panelId) {
    var btn   = document.getElementById(btnId);
    var panel = document.getElementById(panelId);
    if (!btn || !panel) return;
    var isOpen = panel.classList.contains('open');
    var isSub  = TCG_SUB_PANELS.indexOf(panelId) !== -1;

    if (isSub) {
      // Only close sibling sub-panels, not the parent TCG panel
      TCG_SUB_PANELS.forEach(function(sid) {
        if (sid !== panelId) {
          var sp = document.getElementById(sid);
          if (sp) sp.classList.remove('open');
        }
      });
      TCG_SUB_BTNS.forEach(function(sbid) {
        if (sbid !== btnId) {
          var sb = document.getElementById(sbid);
          if (sb) sb.classList.remove('open');
        }
      });
    } else {
      // Top-level: close all panels including sub-panels
      document.querySelectorAll('.mob-accordion-panel.open').forEach(function(p) {
        p.classList.remove('open');
      });
      document.querySelectorAll('.mob-accordion-btn.open').forEach(function(b) {
        b.classList.remove('open');
      });
    }

    if (!isOpen) {
      panel.classList.add('open');
      btn.classList.add('open');
    }
  }

  // ── MOBILE SUB-MENU TOGGLE ────────────────────────────────────────────────
  function toggleMobSub(panelId, btn) {
    const panel = document.getElementById(panelId);
    if (!panel) return;
    const isOpen = panel.style.display === 'flex';
    panel.style.display = isOpen ? 'none' : 'flex';
    if (btn) {
      btn.style.transform = isOpen ? '' : 'rotate(180deg)';
      btn.style.color = isOpen ? 'var(--text-muted)' : 'var(--gold-light)';
    }
  }

  // Close mobile menu when resizing to desktop
  function handleResize() {
    if (window.innerWidth > 900) {
      const m = document.getElementById('mobile-menu');
      if (m) m.classList.remove('open');
    }
  }
  window.addEventListener('resize', handleResize);
  document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
  });
</script>
`
}

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
function homePage() {
  return `${getHead('Home')}
<body>
${getNav('home')}

<div class="page-wrap">

  <!-- HERO -->
  <section class="hero-section" style="
    min-height: 100vh;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    text-align: center;
    padding: 5rem 2rem 4rem;
    position: relative;
    overflow: hidden;
  ">
    <!-- Background glow rays -->
    <div style="position:absolute;inset:0;pointer-events:none;overflow:hidden">
      <div style="position:absolute;top:50%;left:50%;width:900px;height:900px;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(31,91,255,0.1) 0%,transparent 70%);border-radius:50%"></div>
      <div style="position:absolute;top:25%;right:8%;width:420px;height:420px;background:radial-gradient(ellipse,rgba(216,179,90,0.07) 0%,transparent 70%);border-radius:50%"></div>
      <div style="position:absolute;bottom:15%;left:8%;width:360px;height:360px;background:radial-gradient(ellipse,rgba(166,107,255,0.06) 0%,transparent 70%);border-radius:50%"></div>
      <div style="position:absolute;top:0;left:20%;width:1px;height:100%;background:linear-gradient(180deg,transparent,rgba(76,203,255,0.12),transparent);transform:skewX(-15deg)"></div>
      <div style="position:absolute;top:0;right:30%;width:1px;height:100%;background:linear-gradient(180deg,transparent,rgba(216,179,90,0.08),transparent);transform:skewX(10deg)"></div>
    </div>

    <!-- Floating particles -->
    <div id="particles-container" style="position:absolute;inset:0;pointer-events:none;overflow:hidden"></div>

    <!-- Logo -->
    <div style="position:relative;margin-bottom:2.5rem;animation:pulse-glow 3s ease-in-out infinite;border-radius:24px" class="holo-border">
      <img src="/static/ctg-logo.png" alt="CTG Legacy Investments" style="
        width: clamp(200px, 30vw, 340px);
        height: clamp(200px, 30vw, 340px);
        object-fit: cover;
        border-radius: 24px;
        display: block;
        filter: drop-shadow(0 0 40px rgba(216,179,90,0.35)) drop-shadow(0 0 80px rgba(76,203,255,0.2));
      " />
    </div>

    <!-- Headline -->
    <h1 style="
      font-family:'Orbitron',sans-serif;
      font-weight:900;
      font-size:clamp(1.8rem,5.5vw,3.8rem);
      letter-spacing:0.12em;
      text-transform:uppercase;
      line-height:1;
      margin:0 0 0.6rem;
    " class="shimmer-text">CTG Legacy Investments</h1>

    <!-- LLC | EST. 2026 -->
    <div style="
      font-family:'Rajdhani',sans-serif;
      font-size:clamp(0.75rem,1.6vw,1rem);
      font-weight:600;
      letter-spacing:0.4em;
      text-transform:uppercase;
      color:var(--gold-dim);
      margin-bottom:2rem;
    ">LLC &nbsp;|&nbsp; EST. 2026</div>

    <!-- Gold divider -->
    <div style="width:60px;height:1px;background:linear-gradient(90deg,transparent,var(--gold),transparent);margin:0 auto 1.75rem"></div>

    <!-- Subheadline -->
    <p style="
      font-family:'Rajdhani',sans-serif;
      font-weight:700;
      font-size:clamp(1rem,2.2vw,1.35rem);
      letter-spacing:0.12em;
      text-transform:uppercase;
      color:var(--gold-light);
      margin:0 0 1.25rem;
    ">Premium Factory-Sealed TCG Products</p>

    <!-- Description -->
    <p style="
      max-width:560px;
      font-size:clamp(0.88rem,1.6vw,1.05rem);
      color:var(--text-muted);
      line-height:1.8;
      margin:0 auto 2rem;
      font-weight:300;
    ">Your premier destination for factory-sealed booster packs and boxes from <span style="color:var(--text-main);font-weight:400">Pokémon, Yu-Gi-Oh!, and Magic: The Gathering.</span></p>

    <!-- Tagline -->
    <p style="
      font-family:'Orbitron',sans-serif;
      font-weight:800;
      font-size:clamp(0.85rem,2vw,1.2rem);
      letter-spacing:0.14em;
      text-transform:uppercase;
      margin:0 auto 2.5rem;
    "><span style="color:var(--text-main)">Collect.</span> <span style="color:var(--gold-light)">Invest.</span> <span style="color:var(--cyan)">Dominate the Game.</span></p>

    <!-- CTA Buttons -->
    <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-bottom:4rem">
      <a href="/shop?cat=packs" class="btn-primary" style="text-decoration:none;font-size:1rem;padding:0.95rem 2.2rem">
        <i class="fas fa-layer-group" style="margin-right:0.5rem"></i> Shop Sealed Packs
      </a>
      <a href="/shop?cat=boxes" class="btn-secondary" style="text-decoration:none;font-size:1rem;padding:0.95rem 2.2rem">
        <i class="fas fa-box" style="margin-right:0.5rem"></i> Shop Booster Boxes
      </a>
    </div>

    <!-- Scroll indicator -->
    <div style="position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:0.4rem;opacity:0.4">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.65rem;letter-spacing:0.25em;text-transform:uppercase;color:var(--text-muted)">Scroll</span>
      <div style="width:1px;height:36px;background:linear-gradient(180deg,rgba(216,179,90,0.6),transparent)"></div>
    </div>
  </section>

  <!-- TRUST STRIP -->
  <section style="background:linear-gradient(135deg,rgba(14,18,48,0.97),rgba(10,13,31,0.98));border-top:1px solid rgba(216,179,90,0.2);border-bottom:1px solid rgba(216,179,90,0.2);padding:1.5rem 1rem">
    <div class="container" style="display:flex;flex-wrap:wrap;align-items:center;justify-content:center;gap:0;text-align:center">
      <div class="trust-strip-item" style="padding:0.75rem 1.5rem;display:flex;align-items:center;gap:0.65rem;border-right:1px solid rgba(216,179,90,0.12)">
        <i class="fas fa-shield-alt" style="color:var(--gold-light);font-size:1.1rem"></i>
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-main)">100% Authentic Products</span>
      </div>
      <div class="trust-strip-item" style="padding:0.75rem 1.5rem;display:flex;align-items:center;gap:0.65rem;border-right:1px solid rgba(216,179,90,0.12)">
        <i class="fas fa-box-open" style="color:var(--cyan);font-size:1.1rem"></i>
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-main)">Factory Sealed Inventory</span>
      </div>
      <div class="trust-strip-item" style="padding:0.75rem 1.5rem;display:flex;align-items:center;gap:0.65rem">
        <i class="fas fa-shipping-fast" style="color:var(--teal);font-size:1.1rem"></i>
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-main)">Fast &amp; Secure Shipping</span>
      </div>
    </div>
  </section>

  <!-- MAIN SECTIONS: SEALED + GRADED + NEW DROPS -->
  <section class="section container">
    <div style="text-align:center;margin-bottom:3rem">
      <div class="section-sub">Browse Our Inventory</div>
      <h2 class="section-title">Shop Collection</h2>
      <p style="color:var(--text-muted);font-size:0.95rem;margin-top:0.75rem">Browse our full selection of factory-sealed booster boxes and packs.</p>
      <div class="gold-line" style="margin:1rem auto 0"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(300px,1fr));gap:1.5rem">

      <!-- Sealed Products -->
      <a href="/shop" style="text-decoration:none">
        <div style="
          background:linear-gradient(135deg,rgba(76,203,255,0.05),rgba(14,18,48,0.95));
          border:1px solid rgba(76,203,255,0.2);
          border-radius:20px;
          padding:2.5rem 2rem;
          text-align:center;
          transition:all 0.3s;
          cursor:pointer;
          height:100%;
          box-sizing:border-box;
        " onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(76,203,255,0.5)';this.style.boxShadow='0 24px 60px rgba(0,0,0,0.45),0 0 35px rgba(76,203,255,0.1)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(76,203,255,0.2)';this.style.boxShadow=''">
          <div style="font-size:3.5rem;margin-bottom:1.25rem">📦</div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.05rem;letter-spacing:0.1em;color:var(--cyan);margin-bottom:0.75rem">Sealed Products</h3>
          <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.7;margin-bottom:1.5rem">Brand new, factory-sealed booster packs and boxes from the most sought-after sets.</p>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;margin-bottom:1.5rem">
            <span style="font-family:'Rajdhani',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(76,203,255,0.1);color:var(--cyan);border:1px solid rgba(76,203,255,0.3);padding:3px 10px;border-radius:4px">Booster Boxes</span>
            <span style="font-family:'Rajdhani',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(76,203,255,0.1);color:var(--cyan);border:1px solid rgba(76,203,255,0.3);padding:3px 10px;border-radius:4px">Booster Packs</span>
          </div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--cyan)">Browse Sealed →</div>
        </div>
      </a>

      <!-- New Drops -->
      <a href="/shop" style="text-decoration:none">
        <div style="
          background:linear-gradient(135deg,rgba(216,74,58,0.06),rgba(14,18,48,0.95));
          border:1px solid rgba(216,74,58,0.2);
          border-radius:20px;
          padding:2.5rem 2rem;
          text-align:center;
          transition:all 0.3s;
          cursor:pointer;
          height:100%;
          box-sizing:border-box;
        " onmouseover="this.style.transform='translateY(-6px)';this.style.borderColor='rgba(216,74,58,0.5)';this.style.boxShadow='0 24px 60px rgba(0,0,0,0.45),0 0 35px rgba(216,74,58,0.1)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(216,74,58,0.2)';this.style.boxShadow=''">
          <div style="font-size:3.5rem;margin-bottom:1.25rem">🔥</div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.05rem;letter-spacing:0.1em;color:var(--red);margin-bottom:0.75rem">New Drops</h3>
          <p style="font-size:0.88rem;color:var(--text-muted);line-height:1.7;margin-bottom:1.5rem">Fresh inventory added regularly. Limited quantities available — don't miss out.</p>
          <div style="display:flex;flex-wrap:wrap;justify-content:center;gap:0.5rem;margin-bottom:1.5rem">
            <span style="font-family:'Rajdhani',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(216,74,58,0.12);color:var(--red);border:1px solid rgba(216,74,58,0.3);padding:3px 10px;border-radius:4px">🔴 Hot</span>
            <span style="font-family:'Rajdhani',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(76,203,255,0.1);color:var(--cyan);border:1px solid rgba(76,203,255,0.3);padding:3px 10px;border-radius:4px">NEW</span>
            <span style="font-family:'Rajdhani',sans-serif;font-size:0.7rem;font-weight:700;letter-spacing:0.1em;text-transform:uppercase;background:rgba(216,179,90,0.12);color:var(--gold-light);border:1px solid rgba(216,179,90,0.3);padding:3px 10px;border-radius:4px">Limited</span>
          </div>
          <div style="font-family:'Rajdhani',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.15em;text-transform:uppercase;color:var(--red)">Shop New Drops →</div>
        </div>
      </a>

    </div>
  </section>

  <!-- SHOP BY GAME -->
  <section class="section container">
    <div style="text-align:center;margin-bottom:3rem">
      <div class="section-sub">Browse By Game</div>
      <h2 class="section-title">Shop Your Favorite TCG</h2>
      <div class="gold-line" style="margin:0.75rem auto 0"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(280px,1fr));gap:1.5rem">

      <!-- Pokemon -->
      <a href="/tcg-cards?game=pokemon" style="text-decoration:none">
        <div style="
          background:linear-gradient(135deg,rgba(255,199,0,0.06),rgba(14,18,48,0.9));
          border:1px solid rgba(255,199,0,0.2);
          border-radius:20px;
          padding:2.5rem 2rem;
          text-align:center;
          transition:all 0.3s;
          cursor:pointer;
          position:relative;
          overflow:hidden;
        " onmouseover="this.style.transform='translateY(-8px)';this.style.borderColor='rgba(255,199,0,0.5)';this.style.boxShadow='0 20px 50px rgba(0,0,0,0.4),0 0 30px rgba(255,199,0,0.1)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(255,199,0,0.2)';this.style.boxShadow=''">
          <div style="font-size:4rem;margin-bottom:1rem">⚡</div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.08em;color:#FFD700;margin-bottom:0.5rem">POKÉMON</h3>
          <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6">Charizards, Pika's, holos, vintage base set, modern alts & more</p>
          <div style="margin-top:1.25rem;font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:#FFD700">Shop Now →</div>
        </div>
      </a>

      <!-- YuGiOh -->
      <a href="/tcg-cards?game=yugioh" style="text-decoration:none">
        <div style="
          background:linear-gradient(135deg,rgba(70,199,194,0.06),rgba(14,18,48,0.9));
          border:1px solid rgba(70,199,194,0.2);
          border-radius:20px;
          padding:2.5rem 2rem;
          text-align:center;
          transition:all 0.3s;
          cursor:pointer;
        " onmouseover="this.style.transform='translateY(-8px)';this.style.borderColor='rgba(70,199,194,0.5)';this.style.boxShadow='0 20px 50px rgba(0,0,0,0.4),0 0 30px rgba(70,199,194,0.1)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(70,199,194,0.2)';this.style.boxShadow=''">
          <div style="font-size:4rem;margin-bottom:1rem">👁️</div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.08em;color:var(--teal);margin-bottom:0.5rem">YU-GI-OH!</h3>
          <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6">Blue-Eyes, Dark Magician, Ghost Rares, collector tins & sealed booster products</p>
          <div style="margin-top:1.25rem;font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--teal)">Shop Now →</div>
        </div>
      </a>

      <!-- MTG -->
      <a href="/tcg-cards?game=mtg" style="text-decoration:none">
        <div style="
          background:linear-gradient(135deg,rgba(166,107,255,0.06),rgba(14,18,48,0.9));
          border:1px solid rgba(166,107,255,0.2);
          border-radius:20px;
          padding:2.5rem 2rem;
          text-align:center;
          transition:all 0.3s;
          cursor:pointer;
        " onmouseover="this.style.transform='translateY(-8px)';this.style.borderColor='rgba(166,107,255,0.5)';this.style.boxShadow='0 20px 50px rgba(0,0,0,0.4),0 0 30px rgba(166,107,255,0.1)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(166,107,255,0.2)';this.style.boxShadow=''">
          <div style="font-size:4rem;margin-bottom:1rem">🔮</div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.08em;color:var(--purple);margin-bottom:0.5rem">MAGIC: THE GATHERING</h3>
          <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6">Black Lotus, dual lands, foils, reserved list & modern staples</p>
          <div style="margin-top:1.25rem;font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--purple)">Shop Now →</div>
        </div>
      </a>

    </div>
  </section>

  <!-- FEATURED CARDS -->
  <section class="section" style="background:rgba(14,18,48,0.4);border-top:1px solid rgba(216,179,90,0.08)">
    <div class="container">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
        <div>
          <div class="section-sub">Hand-Picked</div>
          <h2 class="section-title">Featured Listings</h2>
          <div class="gold-line"></div>
        </div>
        <a href="/tcg-cards" style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-light);text-decoration:none;border:1px solid rgba(216,179,90,0.3);padding:0.5rem 1.25rem;border-radius:8px;transition:all 0.2s" onmouseover="this.style.background='rgba(216,179,90,0.1)'" onmouseout="this.style.background='transparent'">View All →</a>
      </div>
      <div class="product-grid" id="featured-grid"></div>
    </div>
  </section>

  <!-- WHY US -->
  <section class="section container">
    <div style="text-align:center;margin-bottom:3rem">
      <div class="section-sub">Why Choose Us</div>
      <h2 class="section-title">The CTG Difference</h2>
      <div class="gold-line" style="margin:0.75rem auto 0"></div>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(220px,1fr));gap:1.5rem">
      ${[
        {icon:'fa-shield-alt', color:'var(--gold-light)', title:'Authentic Only', desc:'Every card is verified for authenticity.'},
        {icon:'fa-box-open', color:'var(--cyan)', title:'Factory Sealed', desc:'All products are 100% factory sealed directly from the manufacturer — never opened.'},
        {icon:'fa-shipping-fast', color:'var(--purple)', title:'Fast Shipping', desc:'Orders ship within 1-2 business days. Tracking provided on every order.'},
      ].map(f => `
      <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.1);border-radius:16px;padding:2rem 1.5rem;text-align:center;transition:all 0.3s" onmouseover="this.style.borderColor='rgba(216,179,90,0.3)';this.style.transform='translateY(-4px)'" onmouseout="this.style.borderColor='rgba(216,179,90,0.1)';this.style.transform=''">
        <div style="width:56px;height:56px;border-radius:14px;background:rgba(216,179,90,0.08);border:1px solid rgba(216,179,90,0.15);display:flex;align-items:center;justify-content:center;margin:0 auto 1.25rem">
          <i class="fas ${f.icon}" style="font-size:1.4rem;color:${f.color}"></i>
        </div>
        <h3 style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.05rem;letter-spacing:0.05em;color:var(--text-main);margin-bottom:0.5rem">${f.title}</h3>
        <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.65">${f.desc}</p>
      </div>`).join('')}
    </div>
  </section>

  <!-- ══ FEATURED DROPS ══ -->
  <section class="section" style="background:rgba(10,13,31,0.6);border-top:1px solid rgba(216,74,58,0.15);border-bottom:1px solid rgba(216,74,58,0.1);">
    <div class="container">
      <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
        <div>
          <div style="display:flex;align-items:center;gap:0.6rem;margin-bottom:0.3rem">
            <span style="display:inline-block;width:8px;height:8px;background:var(--red);border-radius:50%;box-shadow:0 0 8px var(--red)"></span>
            <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.72rem;letter-spacing:0.22em;text-transform:uppercase;color:var(--red)">Limited Inventory</span>
          </div>
          <h2 class="section-title">🔥 Featured Drops</h2>
          <div class="gold-line"></div>
          <p style="font-size:0.85rem;color:var(--text-muted);margin-top:-0.5rem">Exclusive items — grab them before they're gone.</p>
        </div>
        <a href="/shop" style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-light);text-decoration:none;border:1px solid rgba(216,179,90,0.3);padding:0.5rem 1.25rem;border-radius:8px;transition:all 0.2s" onmouseover="this.style.background='rgba(216,179,90,0.1)'" onmouseout="this.style.background='transparent'">View All →</a>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem" id="featured-drops-grid"></div>
    </div>
  </section>

  <!-- ══ NEW ARRIVALS ══ -->
  <section class="section container">
    <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:2rem;flex-wrap:wrap;gap:1rem">
      <div>
        <div class="section-sub">Just Landed</div>
        <h2 class="section-title">✨ New Arrivals</h2>
        <div class="gold-line"></div>
      </div>
      <a href="/shop" style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--cyan);text-decoration:none;border:1px solid rgba(76,203,255,0.3);padding:0.5rem 1.25rem;border-radius:8px;transition:all 0.2s" onmouseover="this.style.background='rgba(76,203,255,0.07)'" onmouseout="this.style.background='transparent'">See All New →</a>
    </div>
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem" id="new-arrivals-grid"></div>
  </section>

  <!-- ══ HIGH VALUE CARDS ══ -->
  <section class="section" style="background:linear-gradient(135deg,rgba(216,179,90,0.04),rgba(14,18,48,0.85));border-top:1px solid rgba(216,179,90,0.12);border-bottom:1px solid rgba(216,179,90,0.12);">
    <div class="container">
      <div style="text-align:center;margin-bottom:2.5rem">
        <div class="section-sub">Investment Grade</div>
        <h2 class="section-title">💎 High Value Cards</h2>
        <div class="gold-line" style="margin:0.75rem auto 0"></div>
        <p style="font-size:0.9rem;color:var(--text-muted);margin-top:0.75rem">Top-tier collectibles with strong market value and appreciation potential.</p>
      </div>
      <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(240px,1fr));gap:1.5rem" id="high-value-grid"></div>
    </div>
  </section>

  <!-- ══ RIP & SHIP / WHATNOT ══ -->
  <section class="section container">
    <div class="rip-ship-grid" style="background:linear-gradient(135deg,rgba(166,107,255,0.08),rgba(76,203,255,0.04),rgba(14,18,48,0.95));border:1px solid rgba(166,107,255,0.25);border-radius:20px;padding:3rem 2.5rem;display:grid;grid-template-columns:1fr 1fr;gap:3rem;align-items:center">
      <div>
        <div style="display:inline-flex;align-items:center;gap:0.5rem;background:rgba(216,74,58,0.12);border:1px solid rgba(216,74,58,0.3);border-radius:20px;padding:0.35rem 0.9rem;margin-bottom:1.25rem">
          <span style="width:8px;height:8px;background:var(--red);border-radius:50%;box-shadow:0 0 8px var(--red)"></span>
          <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.7rem;letter-spacing:0.18em;text-transform:uppercase;color:var(--red)">Live Sales</span>
        </div>
        <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:clamp(1.4rem,3vw,2rem);color:var(--text-main);letter-spacing:0.05em;margin-bottom:0.75rem">Rip &amp; Ship<br><span style="color:var(--purple)">Live Sales</span></h2>
        <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.75;margin-bottom:1.5rem">Join us live on <strong style="color:var(--purple)">Whatnot</strong> for real-time pack openings, auctions, and exclusive drops. Watch the pulls happen live and buy the cards you want on the spot. Find us at <a href="https://www.whatnot.com/user/ctglegacyinvestments" target="_blank" rel="noopener" style="color:var(--purple);text-decoration:underline;text-underline-offset:3px">whatnot.com/ctglegacyinvestments</a>.</p>
        <div style="display:flex;flex-wrap:wrap;gap:0.75rem">
          <a href="https://www.whatnot.com/user/ctglegacyinvestments" target="_blank" rel="noopener" class="btn-primary" style="text-decoration:none;font-size:0.95rem;padding:0.85rem 2rem;background:linear-gradient(135deg,var(--purple),#7c3aff);box-shadow:0 0 20px rgba(166,107,255,0.35)">
            <i class="fas fa-play-circle" style="margin-right:0.5rem"></i> Watch on Whatnot
          </a>
          <a href="/contact" class="btn-secondary" style="font-size:0.95rem;padding:0.85rem 1.75rem">
            <i class="fas fa-bell" style="margin-right:0.5rem"></i> Get Notified
          </a>
        </div>
      </div>
      <div style="display:grid;grid-template-columns:1fr 1fr;gap:1rem">
        <div style="background:rgba(166,107,255,0.08);border:1px solid rgba(166,107,255,0.2);border-radius:14px;padding:1.5rem;text-align:center;transition:all 0.3s" onmouseover="this.style.borderColor='rgba(166,107,255,0.45)'" onmouseout="this.style.borderColor='rgba(166,107,255,0.2)'">
          <div style="font-size:2rem;margin-bottom:0.5rem">📦</div>
          <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.9rem;color:var(--purple);letter-spacing:0.05em">Pack Breaks</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem">Live booster rips every week</div>
        </div>
        <div style="background:rgba(76,203,255,0.06);border:1px solid rgba(76,203,255,0.2);border-radius:14px;padding:1.5rem;text-align:center;transition:all 0.3s" onmouseover="this.style.borderColor='rgba(76,203,255,0.45)'" onmouseout="this.style.borderColor='rgba(76,203,255,0.2)'">
          <div style="font-size:2rem;margin-bottom:0.5rem">🔨</div>
          <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.9rem;color:var(--cyan);letter-spacing:0.05em">Live Auctions</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem">Bid on high-value sealed products</div>
        </div>
        <div style="background:rgba(216,179,90,0.06);border:1px solid rgba(216,179,90,0.2);border-radius:14px;padding:1.5rem;text-align:center;transition:all 0.3s" onmouseover="this.style.borderColor='rgba(216,179,90,0.45)'" onmouseout="this.style.borderColor='rgba(216,179,90,0.2)'">
          <div style="font-size:2rem;margin-bottom:0.5rem">🚢</div>
          <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.9rem;color:var(--gold-light);letter-spacing:0.05em">Fast Ship</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem">Cards shipped same day</div>
        </div>
        <div style="background:rgba(216,74,58,0.06);border:1px solid rgba(216,74,58,0.2);border-radius:14px;padding:1.5rem;text-align:center;transition:all 0.3s" onmouseover="this.style.borderColor='rgba(216,74,58,0.45)'" onmouseout="this.style.borderColor='rgba(216,74,58,0.2)'">
          <div style="font-size:2rem;margin-bottom:0.5rem">🎰</div>
          <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.9rem;color:var(--red);letter-spacing:0.05em">Mystery Boxes</div>
          <div style="font-size:0.78rem;color:var(--text-muted);margin-top:0.25rem">Surprise value packs</div>
        </div>
      </div>
    </div>
  </section>

  <!-- ══ EMAIL SIGNUP ══ -->
  <section style="background:linear-gradient(135deg,rgba(216,179,90,0.07),rgba(31,91,255,0.06));border-top:1px solid rgba(216,179,90,0.15);border-bottom:1px solid rgba(216,179,90,0.15);padding:4.5rem 2rem;text-align:center">
    <div class="container" style="max-width:620px">
      <div style="font-size:2rem;margin-bottom:0.75rem">📬</div>
      <div class="section-sub">Be First in Line</div>
      <h2 class="section-title" style="font-size:clamp(1.4rem,3vw,2rem);margin-top:0.25rem">Exclusive Drop Alerts</h2>
      <div class="gold-line" style="margin:0.75rem auto 0"></div>
      <p style="font-size:0.95rem;color:var(--text-muted);line-height:1.7;margin:1rem auto 2rem">Sign up to get early access to new arrivals, limited drops, and exclusive investor deals — before they go public.</p>
      <form id="email-signup-form" onsubmit="submitEmailSignup(event)" style="display:flex;gap:0.75rem;flex-wrap:wrap;justify-content:center;max-width:500px;margin:0 auto">
        <input type="email" id="signup-email" placeholder="Enter your email address..." required
          style="flex:1;min-width:220px;background:rgba(14,18,48,0.9);border:1px solid rgba(216,179,90,0.3);border-radius:10px;color:var(--text-main);font-family:'Inter',sans-serif;font-size:0.95rem;padding:0.85rem 1.1rem;outline:none;transition:border-color 0.2s;"
          onfocus="this.style.borderColor='var(--gold)'" onblur="this.style.borderColor='rgba(216,179,90,0.3)'">
        <button type="submit" class="btn-primary" style="padding:0.85rem 2rem;white-space:nowrap">
          <i class="fas fa-bell" style="margin-right:0.5rem"></i> Notify Me
        </button>
      </form>
      <p style="font-size:0.75rem;color:var(--text-muted);margin-top:1rem;opacity:0.7">No spam. Unsubscribe anytime. We respect your privacy.</p>
    </div>
  </section>

  <!-- INQUIRY CTA BANNER -->
  <section style="background:linear-gradient(135deg,rgba(31,91,255,0.08),rgba(166,107,255,0.08));border-top:1px solid rgba(216,179,90,0.12);border-bottom:1px solid rgba(216,179,90,0.12);padding:4rem 2rem;text-align:center">
    <div class="container">
      <div style="font-family:'Rajdhani',sans-serif;font-size:0.85rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--cyan);margin-bottom:0.75rem">Looking For Something Specific?</div>
      <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:clamp(1.4rem,3vw,2.2rem);color:var(--text-main);margin-bottom:1rem;letter-spacing:0.05em">Can't Find What You're Looking For?</h2>
      <p style="font-size:1rem;color:var(--text-muted);max-width:520px;margin:0 auto 2rem;line-height:1.7">We specialize in sourcing hard-to-find cards. Submit an inquiry and our team will find it for you.</p>
      <a href="/contact" class="btn-primary" style="text-decoration:none;font-size:1rem">
        <i class="fas fa-paper-plane" style="margin-right:0.5rem"></i> Submit an Inquiry
      </a>
    </div>
  </section>

</div>

${getFooter()}

${getCartScript()}

<script>
  // Featured products data
  const featuredCards = [
    { id:'f1', name:'Charizard VMAX', set:'Champions Path', price:189.99, game:'pokemon', condition:'NM', emoji:'🔥', holo:true },
    { id:'f2', name:'Blue-Eyes White Dragon', set:'Legend of Blue Eyes', price:245.00, game:'yugioh', condition:'LP', emoji:'🐉', holo:false },
    { id:'f3', name:'Black Lotus', set:'Alpha Edition', price:999.99, game:'mtg', condition:'HP', emoji:'🌸', holo:false },
    { id:'f4', name:'Pikachu Illustrator', set:'CoroCoro Promo', price:1499.99, game:'pokemon', condition:'NM', emoji:'⚡', holo:true },
    { id:'f5', name:'Dark Magician Girl', set:'Magical Blast', price:85.00, game:'yugioh', condition:'NM', emoji:'✨', holo:true },
    { id:'f6', name:'Mox Sapphire', set:'Beta Edition', price:750.00, game:'mtg', condition:'LP', emoji:'💎', holo:false },
    { id:'f7', name:'Rayquaza VMAX Alt', set:'Evolving Skies', price:320.00, game:'pokemon', condition:'NM', emoji:'🌩️', holo:true },
    { id:'f8', name:'Exodia The Forbidden One', set:'LOB 1st Edition', price:550.00, game:'yugioh', condition:'VG', emoji:'👁️', holo:false },
  ];

  // ── FEATURED DROPS data (limited feel – red LIVE badge) ──────────────────
  const featuredDrops = [
    { id:'fd1', name:'Scarlet & Violet Booster Box', set:'Scarlet & Violet Base', price:149.99, game:'pokemon', condition:'Sealed', emoji:'📦', holo:false, tag:'SEALED', limited:true },
    { id:'fd2', name:'Charizard ex SAR',             set:'Obsidian Flames',       price:219.99, game:'pokemon', condition:'NM',     emoji:'🔥', holo:true,  tag:'HOT',    limited:true },
    { id:'fd3', name:'Umbreon VMAX Alt Art',         set:'Evolving Skies',        price:299.00, game:'pokemon', condition:'NM',     emoji:'🌙', holo:true,  tag:'RARE',   limited:true },
    { id:'fd4', name:'151 Booster Bundle',           set:'Pokémon 151',           price:89.99,  game:'pokemon', condition:'Sealed', emoji:'🎴', holo:false, tag:'BUNDLE', limited:false },
  ];

  // ── NEW ARRIVALS data ─────────────────────────────────────────────────────
  const newArrivals = [
    { id:'na1', name:'Temporal Forces Booster Box',  set:'Temporal Forces',  price:129.99, game:'pokemon', condition:'Sealed', emoji:'📦', holo:false, tag:'NEW' },
    { id:'na2', name:'Iron Valiant ex Full Art',      set:'Paradox Rift',     price:48.50,  game:'pokemon', condition:'NM',     emoji:'⚔️', holo:true,  tag:'NEW' },
    { id:'na3', name:'Twilight Masquerade Box',       set:'Twilight Masquerade', price:139.99, game:'pokemon', condition:'Sealed', emoji:'🎭', holo:false, tag:'NEW' },
    { id:'na4', name:'Terapagos ex SAR',              set:'Stellar Crown',    price:65.00,  game:'pokemon', condition:'NM',     emoji:'💫', holo:true,  tag:'NEW' },
  ];

  // ── HIGH VALUE CARDS data ─────────────────────────────────────────────────
  const highValueCards = [
    { id:'hv1', name:'Scarlet & Violet Booster Box',    set:'Scarlet & Violet Base', price:149.99, game:'pokemon', condition:'Sealed', emoji:'📦', holo:false },
    { id:'hv2', name:'Obsidian Flames Booster Box',      set:'Obsidian Flames',       price:164.99, game:'pokemon', condition:'Sealed', emoji:'📦', holo:false },
    { id:'hv3', name:'Black Lotus Alpha Booster',        set:'Alpha Edition',         price:9999.99, game:'mtg',    condition:'Sealed', emoji:'🌸', holo:false },
    { id:'hv4', name:'Blue-Eyes White Dragon Tin',       set:'LOB Collector Tin',     price:89.99,  game:'yugioh',  condition:'Sealed', emoji:'🐉', holo:false },
  ];

  const gameBadge = { pokemon:'badge-pokemon', yugioh:'badge-yugioh', mtg:'badge-mtg' };
  const gameLabel = { pokemon:'Pokémon', yugioh:'Yu-Gi-Oh!', mtg:'MTG' };

  // ── Shared card renderer (with optional Buy Now) ───────────────────────────
  function renderCardHTML(card, opts = {}) {
    const limitedBadge = card.limited
      ? \`<span style="position:absolute;top:10px;left:10px;background:rgba(216,74,58,0.85);color:#fff;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.62rem;letter-spacing:0.1em;text-transform:uppercase;padding:3px 8px;border-radius:4px">🔴 LIMITED</span>\`
      : '';
    const tagBadge = card.tag
      ? \`<span style="position:absolute;top:\${card.limited?'34px':'10px'};left:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">\${card.tag}</span>\`
      : '';
    return \`
      <div class="product-card">
        <div class="product-card-img" style="font-size:3.5rem">
          <span>\${card.emoji}</span>
          \${card.holo ? '<span class="holo-badge">✦ HOLO</span>' : ''}
          <span class="game-badge \${gameBadge[card.game]}">\${gameLabel[card.game]}</span>
          \${limitedBadge}\${tagBadge}
        </div>
        <div class="product-info">
          <div class="product-name">\${card.name}</div>
          <div class="product-set">\${card.set}</div>
          <div class="product-price">$\${card.price.toLocaleString('en-US',{minimumFractionDigits:2,maximumFractionDigits:2})}</div>
          <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
            <button class="btn-add-cart" style="flex:1" data-id="\${card.id}" onclick="addToCart('\${card.id}','\${card.name}',\${card.price},'\${card.game}','\${card.emoji}')">
              <i class="fas fa-cart-plus"></i> Add to Cart
            </button>
            <button onclick="buyNow('\${card.id}','\${card.name}',\${card.price},'\${card.game}','\${card.emoji}')"
              style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s;flex-shrink:0"
              onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">
              Buy Now
            </button>
          </div>
        </div>
      </div>
    \`;
  }

  function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if(grid) grid.innerHTML = featuredCards.map(c => renderCardHTML(c)).join('');
    const dg = document.getElementById('featured-drops-grid');
    if(dg) dg.innerHTML = featuredDrops.map(c => renderCardHTML(c)).join('');
    const na = document.getElementById('new-arrivals-grid');
    if(na) na.innerHTML = newArrivals.map(c => renderCardHTML(c)).join('');
    const hv = document.getElementById('high-value-grid');
    if(hv) hv.innerHTML = highValueCards.map(c => renderCardHTML(c)).join('');
  }

  function buyNow(id, name, price, game, img) {
    addToCart(id, name, price, game, img);
    window.location.href = '/checkout';
  }

  function submitEmailSignup(e) {
    e.preventDefault();
    const email = document.getElementById('signup-email').value.trim();
    if (!email) return;
    document.getElementById('email-signup-form').innerHTML =
      \`<div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1.05rem;color:var(--teal);letter-spacing:0.05em"><i class="fas fa-check-circle" style="margin-right:0.5rem"></i>You're on the list! We'll notify you first for every drop.</div>\`;
    showToast('Subscribed! Watch your inbox for exclusive drops. 🔥');
  }

  // Spawn particles
  function spawnParticles() {
    const container = document.getElementById('particles-container');
    if (!container) return;
    const colors = ['rgba(216,179,90,0.6)','rgba(76,203,255,0.5)','rgba(166,107,255,0.5)','rgba(255,255,255,0.4)'];
    for(let i = 0; i < 20; i++) {
      const p = document.createElement('div');
      const size = Math.random() * 4 + 1;
      const x = Math.random() * 100;
      const delay = Math.random() * 8;
      const dur = Math.random() * 8 + 6;
      p.className = 'particle';
      p.style.cssText = \`
        width:\${size}px;height:\${size}px;
        left:\${x}%;bottom:-10px;
        background:\${colors[Math.floor(Math.random()*colors.length)]};
        animation-duration:\${dur}s;
        animation-delay:\${delay}s;
      \`;
      container.appendChild(p);
    }
  }

  document.addEventListener('DOMContentLoaded', function() {
    renderFeatured();
    spawnParticles();
  });
</script>
</body></html>`
}

// ─── SHOP PAGE ───────────────────────────────────────────────────────────────
function shopPage() {
  return `${getHead('Shop')}
<body>
${getNav('shop')}
<div class="page-wrap">

  <!-- PAGE HEADER -->
  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">CTG Legacy Investments</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">Shop</h1>
      <div class="gold-line" style="margin:0.75rem auto 0.75rem"></div>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:520px;margin:0 auto">More products coming soon. Check back for new inventory drops.</p>
    </div>
  </div>

  <div class="container section">

    <!-- ══ COMING SOON HERO ══ -->
    <div style="display:flex;flex-direction:column;align-items:center;justify-content:center;padding:5rem 1rem 4rem;text-align:center">

      <!-- Icon -->
      <div style="width:90px;height:90px;border-radius:50%;background:linear-gradient(135deg,rgba(216,179,90,0.12),rgba(76,203,255,0.08));border:1px solid rgba(216,179,90,0.25);display:flex;align-items:center;justify-content:center;margin-bottom:2rem;box-shadow:0 0 40px rgba(216,179,90,0.1)">
        <i class="fas fa-store" style="font-size:2.2rem;color:var(--gold-light)"></i>
      </div>

      <!-- Heading -->
      <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:clamp(1.3rem,3vw,1.8rem);letter-spacing:0.06em;color:var(--text-main);margin-bottom:0.75rem">New Products Coming Soon</h2>
      <div class="gold-line" style="margin:0 auto 1.5rem;width:60px"></div>
      <p style="font-family:'Rajdhani',sans-serif;font-size:1rem;color:var(--text-muted);max-width:440px;line-height:1.7;margin-bottom:2.5rem">
        We're working on expanding our inventory beyond TCG cards. New products will be listed here — stay tuned and check back soon.
      </p>

      <!-- Trust pills -->
      <div style="display:flex;flex-wrap:wrap;gap:0.75rem;justify-content:center;margin-bottom:3rem">
        <span style="display:inline-flex;align-items:center;gap:0.45rem;padding:0.45rem 1rem;background:rgba(216,179,90,0.08);border:1px solid rgba(216,179,90,0.22);border-radius:20px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--gold-dim)">
          <i class="fas fa-shield-alt" style="color:var(--gold-light)"></i> 100% Authentic
        </span>
        <span style="display:inline-flex;align-items:center;gap:0.45rem;padding:0.45rem 1rem;background:rgba(76,203,255,0.07);border:1px solid rgba(76,203,255,0.2);border-radius:20px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">
          <i class="fas fa-bolt" style="color:var(--cyan)"></i> Fast Shipping
        </span>
        <span style="display:inline-flex;align-items:center;gap:0.45rem;padding:0.45rem 1rem;background:rgba(166,107,255,0.07);border:1px solid rgba(166,107,255,0.2);border-radius:20px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.78rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">
          <i class="fas fa-star" style="color:var(--purple)"></i> Top Rated Seller
        </span>
      </div>

      <!-- ── PRODUCT GRID PLACEHOLDER ── -->
      <!-- ADD PRODUCTS HERE: copy a product-card block below and fill in the details -->
      <div id="shop-grid" style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;width:100%;max-width:1100px;margin-bottom:3rem">

        <!-- PLACEHOLDER CARD 1 — replace with real product -->
        <div class="product-card" style="opacity:0.4;pointer-events:none">
          <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(216,179,90,0.06),rgba(14,18,48,0.9))">
            <span>🛍️</span>
          </div>
          <div class="product-info">
            <div style="background:rgba(255,255,255,0.07);height:1rem;border-radius:6px;margin-bottom:0.6rem"></div>
            <div style="background:rgba(255,255,255,0.04);height:0.75rem;border-radius:6px;width:65%;margin-bottom:0.4rem"></div>
            <div style="background:rgba(255,255,255,0.04);height:0.75rem;border-radius:6px;width:40%"></div>
            <div style="margin-top:0.85rem;color:var(--gold-dim);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.08em">— Coming Soon —</div>
          </div>
        </div>

        <!-- PLACEHOLDER CARD 2 -->
        <div class="product-card" style="opacity:0.25;pointer-events:none">
          <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(76,203,255,0.05),rgba(14,18,48,0.9))">
            <span>🛍️</span>
          </div>
          <div class="product-info">
            <div style="background:rgba(255,255,255,0.07);height:1rem;border-radius:6px;margin-bottom:0.6rem"></div>
            <div style="background:rgba(255,255,255,0.04);height:0.75rem;border-radius:6px;width:55%;margin-bottom:0.4rem"></div>
            <div style="background:rgba(255,255,255,0.04);height:0.75rem;border-radius:6px;width:35%"></div>
            <div style="margin-top:0.85rem;color:var(--gold-dim);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.08em">— Coming Soon —</div>
          </div>
        </div>

        <!-- PLACEHOLDER CARD 3 -->
        <div class="product-card" style="opacity:0.12;pointer-events:none">
          <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.05),rgba(14,18,48,0.9))">
            <span>🛍️</span>
          </div>
          <div class="product-info">
            <div style="background:rgba(255,255,255,0.07);height:1rem;border-radius:6px;margin-bottom:0.6rem"></div>
            <div style="background:rgba(255,255,255,0.04);height:0.75rem;border-radius:6px;width:70%;margin-bottom:0.4rem"></div>
            <div style="background:rgba(255,255,255,0.04);height:0.75rem;border-radius:6px;width:45%"></div>
            <div style="margin-top:0.85rem;color:var(--gold-dim);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.08em">— Coming Soon —</div>
          </div>
        </div>

      </div>
      <!-- END PRODUCT GRID -->

      <!-- Notify CTA -->
      <div style="background:linear-gradient(135deg,rgba(216,179,90,0.06),rgba(76,203,255,0.04));border:1px solid rgba(216,179,90,0.18);border-radius:16px;padding:2rem 2.5rem;max-width:480px;width:100%">
        <div style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.95rem;letter-spacing:0.06em;color:var(--gold-light);margin-bottom:0.4rem">
          <i class="fas fa-bell" style="margin-right:0.5rem"></i>Get Notified
        </div>
        <p style="font-family:'Rajdhani',sans-serif;font-size:0.9rem;color:var(--text-muted);margin-bottom:1.25rem">
          Have a question or want to know when new products drop? Reach out and we'll keep you in the loop.
        </p>
        <a href="/contact" style="display:inline-flex;align-items:center;gap:0.6rem;padding:0.75rem 1.75rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.9rem;letter-spacing:0.08em;text-transform:uppercase;border-radius:10px;text-decoration:none;transition:all 0.2s"
          onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.45)'" onmouseout="this.style.boxShadow=''">
          <i class="fas fa-envelope"></i> Contact Us
        </a>
      </div>

    </div>

  </div>

</div>

${getFooter()}
${getCartScript()}
</body></html>`
}

// ─── TCG CARDS PAGE ──────────────────────────────────────────────────────────
function tcgCardsPage() {
  return `${getHead('TCG Cards')}
<body>
${getNav('tcg')}
<div class="page-wrap">

  <!-- PAGE HEADER -->
  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">Factory Sealed Inventory</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">TCG Cards</h1>
      <div class="gold-line" style="margin:0.75rem auto 0.75rem"></div>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:560px;margin:0 auto">Browse factory-sealed booster boxes, packs, bundles &amp; Elite Trainer Boxes by game.</p>
    </div>
  </div>

  <div class="container section">

    <!-- TRUST LINE -->
    <div style="text-align:center;margin-bottom:2rem">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.82rem;font-weight:700;letter-spacing:0.14em;text-transform:uppercase;color:var(--gold-dim)">
        <i class="fas fa-shield-alt" style="color:var(--gold-light);margin-right:0.45rem"></i>
        All products are brand new, factory sealed, and 100% authentic.
      </span>
    </div>

    <!-- ══ GAME TABS ══ -->
    <div style="display:flex;flex-wrap:wrap;gap:0.75rem;margin-bottom:2.5rem">
      <button class="filter-btn active" id="gtab-pokemon" onclick="switchGame('pokemon')">
        <span style="margin-right:6px">⚡</span>Pokémon
      </button>
      <button class="filter-btn" id="gtab-yugioh" onclick="switchGame('yugioh')">
        <span style="margin-right:6px">🐉</span>Yu-Gi-Oh!
      </button>
      <button class="filter-btn" id="gtab-mtg" onclick="switchGame('mtg')">
        <span style="margin-right:6px">🔮</span>Magic: The Gathering
      </button>
    </div>

    <!-- ══════════════════════════════════════════════════════ -->
    <!-- POKÉMON PANEL -->
    <!-- ══════════════════════════════════════════════════════ -->
    <div id="panel-pokemon">

      <!-- Category filter dropdown -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;flex-wrap:wrap">
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-dim)"><i class="fas fa-filter" style="margin-right:0.4rem"></i>Filter by Category:</span>
        <div style="position:relative;display:inline-block" id="pok-dd-wrap">
          <button onclick="toggleCatDD('pok')" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 1.1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(216,179,90,0.3);border-radius:8px;color:var(--text-main);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;white-space:nowrap" id="pok-dd-btn">
            <i class="fas fa-th-large" style="color:var(--gold-dim);font-size:0.78rem"></i>
            <span id="pok-dd-label">All Categories</span>
            <i class="fas fa-chevron-down" style="font-size:0.65rem;color:var(--gold-dim);transition:transform 0.2s" id="pok-dd-arrow"></i>
          </button>
          <div id="pok-dd-panel" style="display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:220px;background:var(--bg-card2);border:1px solid rgba(216,179,90,0.25);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:200;overflow:hidden">
            <div onclick="pickCat('pokemon','all','All Categories')"    style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(216,179,90,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-th-large" style="width:14px;color:var(--gold-dim)"></i> All Categories</div>
            <div onclick="pickCat('pokemon','boxes','Booster Boxes')"   style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(216,179,90,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-box" style="width:14px;color:var(--gold-dim)"></i> Booster Boxes</div>
            <div onclick="pickCat('pokemon','elite','Elite Trainer Boxes')" style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(216,179,90,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-trophy" style="width:14px;color:var(--gold-dim)"></i> Elite Trainer Boxes</div>
            <div onclick="pickCat('pokemon','bundles','Booster Bundles')" style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(216,179,90,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-layer-group" style="width:14px;color:var(--gold-dim)"></i> Booster Bundles</div>
            <div onclick="pickCat('pokemon','packs','Booster Packs')"  style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(216,179,90,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-id-card" style="width:14px;color:var(--gold-dim)"></i> Booster Packs</div>
          </div>
        </div>
        <span id="pok-active-chip" style="display:none;align-items:center;gap:0.4rem;padding:0.3rem 0.75rem;background:rgba(216,179,90,0.12);border:1px solid rgba(216,179,90,0.35);border-radius:20px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.78rem;color:var(--gold-light);cursor:pointer" onclick="pickCat('pokemon','all','All Categories')">
          <span id="pok-chip-label"></span><i class="fas fa-times" style="font-size:0.65rem"></i>
        </span>
      </div>

      <!-- Pokémon · Booster Boxes -->
      <div id="pok-sec-boxes">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,#FFD700,var(--cyan));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Boxes</h2>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted)">— 36 Packs · Factory Sealed</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.08),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">SEALED</span>
            </div>
            <div class="product-info">
              <div class="product-name">Scarlet &amp; Violet Booster Box</div>
              <div class="product-set">Scarlet &amp; Violet Base Set · 36 Packs</div>
              <div class="product-price">$149.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('box1','S&amp;V Booster Box',149.99,'pokemon','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('box1','S&amp;V Booster Box',149.99,'pokemon','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.08),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,74,58,0.2);color:var(--red);border:1px solid rgba(216,74,58,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">🔴 HOT</span>
            </div>
            <div class="product-info">
              <div class="product-name">Obsidian Flames Booster Box</div>
              <div class="product-set">Obsidian Flames · 36 Packs</div>
              <div class="product-price">$164.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('box2','Obsidian Flames Box',164.99,'pokemon','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('box2','Obsidian Flames Box',164.99,'pokemon','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.08),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">NEW</span>
            </div>
            <div class="product-info">
              <div class="product-name">Twilight Masquerade Booster Box</div>
              <div class="product-set">Twilight Masquerade · 36 Packs</div>
              <div class="product-price">$139.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('box3','Twilight Masquerade Box',139.99,'pokemon','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('box3','Twilight Masquerade Box',139.99,'pokemon','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.08),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-pokemon">Pokémon</span>
            </div>
            <div class="product-info">
              <div class="product-name">Temporal Forces Booster Box</div>
              <div class="product-set">Temporal Forces · 36 Packs</div>
              <div class="product-price">$129.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('box4','Temporal Forces Box',129.99,'pokemon','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('box4','Temporal Forces Box',129.99,'pokemon','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pokémon · Elite Trainer Boxes -->
      <div id="pok-sec-elite">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--gold-light),var(--gold));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Elite Trainer Boxes</h2>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-light)">— 9 Packs + Accessories</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(216,179,90,0.15),rgba(14,18,48,0.95))">
              <span>🏆</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,179,90,0.25);color:var(--gold-light);border:1px solid rgba(216,179,90,0.5);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">ELITE</span>
            </div>
            <div class="product-info">
              <div class="product-name">Scarlet &amp; Violet Elite Trainer Box</div>
              <div class="product-set">Scarlet &amp; Violet Base · 9 Packs + Accessories</div>
              <div class="product-price">$49.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('etb1','S&amp;V Elite Trainer Box',49.99,'pokemon','🏆')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('etb1','S&amp;V Elite Trainer Box',49.99,'pokemon','🏆');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(216,179,90,0.15),rgba(14,18,48,0.95))">
              <span>🏆</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,74,58,0.2);color:var(--red);border:1px solid rgba(216,74,58,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">🔴 HOT</span>
            </div>
            <div class="product-info">
              <div class="product-name">Obsidian Flames Elite Trainer Box</div>
              <div class="product-set">Obsidian Flames · 9 Packs + Accessories</div>
              <div class="product-price">$54.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('etb2','Obsidian Flames ETB',54.99,'pokemon','🏆')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('etb2','Obsidian Flames ETB',54.99,'pokemon','🏆');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(216,179,90,0.15),rgba(14,18,48,0.95))">
              <span>🏆</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">NEW</span>
            </div>
            <div class="product-info">
              <div class="product-name">Twilight Masquerade Elite Trainer Box</div>
              <div class="product-set">Twilight Masquerade · 9 Packs + Accessories</div>
              <div class="product-price">$44.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('etb3','Twilight Masquerade ETB',44.99,'pokemon','🏆')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('etb3','Twilight Masquerade ETB',44.99,'pokemon','🏆');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(216,179,90,0.15),rgba(14,18,48,0.95))">
              <span>🏆</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,179,90,0.25);color:var(--gold-light);border:1px solid rgba(216,179,90,0.5);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">ELITE</span>
            </div>
            <div class="product-info">
              <div class="product-name">Temporal Forces Elite Trainer Box</div>
              <div class="product-set">Temporal Forces · 9 Packs + Accessories</div>
              <div class="product-price">$42.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('etb4','Temporal Forces ETB',42.99,'pokemon','🏆')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('etb4','Temporal Forces ETB',42.99,'pokemon','🏆');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pokémon · Booster Bundles -->
      <div id="pok-sec-bundles">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--cyan),var(--purple));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Bundles</h2>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted)">— Multi-Pack Bundles</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.12),rgba(14,18,48,0.95))">
              <span>🎁</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(166,107,255,0.2);color:var(--purple);border:1px solid rgba(166,107,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">BUNDLE</span>
            </div>
            <div class="product-info">
              <div class="product-name">Charizard ex Super Premium Collection</div>
              <div class="product-set">Scarlet &amp; Violet Era · Promo + 11 Packs</div>
              <div class="product-price">$79.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('bnd1','Charizard ex Super Premium',79.99,'pokemon','🎁')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('bnd1','Charizard ex Super Premium',79.99,'pokemon','🎁');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.12),rgba(14,18,48,0.95))">
              <span>🎁</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,74,58,0.2);color:var(--red);border:1px solid rgba(216,74,58,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">🔴 HOT</span>
            </div>
            <div class="product-info">
              <div class="product-name">Mew ex Premium Collection</div>
              <div class="product-set">Pokémon 151 · Promo + 8 Packs</div>
              <div class="product-price">$39.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('bnd2','Mew ex Premium Collection',39.99,'pokemon','🎁')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('bnd2','Mew ex Premium Collection',39.99,'pokemon','🎁');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.12),rgba(14,18,48,0.95))">
              <span>🎁</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">NEW</span>
            </div>
            <div class="product-info">
              <div class="product-name">Pikachu ex Super Premium Collection</div>
              <div class="product-set">Scarlet &amp; Violet Era · Promo + 9 Packs</div>
              <div class="product-price">$59.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('bnd3','Pikachu ex Super Premium',59.99,'pokemon','🎁')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('bnd3','Pikachu ex Super Premium',59.99,'pokemon','🎁');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Pokémon · Booster Packs -->
      <div id="pok-sec-packs">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--purple),var(--gold));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Packs</h2>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted)">— Individual Packs</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.07),rgba(14,18,48,0.9))">
              <span>🎴</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">SEALED</span>
            </div>
            <div class="product-info">
              <div class="product-name">Scarlet &amp; Violet Booster Pack</div>
              <div class="product-set">Scarlet &amp; Violet Base · 1 Pack / 10 Cards</div>
              <div class="product-price">$4.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('sp1','S&amp;V Booster Pack',4.99,'pokemon','🎴')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('sp1','S&amp;V Booster Pack',4.99,'pokemon','🎴');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.07),rgba(14,18,48,0.9))">
              <span>🎴</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,74,58,0.2);color:var(--red);border:1px solid rgba(216,74,58,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">🔴 HOT</span>
            </div>
            <div class="product-info">
              <div class="product-name">Obsidian Flames Booster Pack</div>
              <div class="product-set">Obsidian Flames · 1 Pack / 10 Cards</div>
              <div class="product-price">$5.49</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('sp2','Obsidian Flames Pack',5.49,'pokemon','🎴')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('sp2','Obsidian Flames Pack',5.49,'pokemon','🎴');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.07),rgba(14,18,48,0.9))">
              <span>🎴</span><span class="game-badge badge-pokemon">Pokémon</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">NEW</span>
            </div>
            <div class="product-info">
              <div class="product-name">Twilight Masquerade Booster Pack</div>
              <div class="product-set">Twilight Masquerade · 1 Pack / 10 Cards</div>
              <div class="product-price">$4.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('sp3','Twilight Masquerade Pack',4.99,'pokemon','🎴')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('sp3','Twilight Masquerade Pack',4.99,'pokemon','🎴');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(255,199,0,0.07),rgba(14,18,48,0.9))">
              <span>🎴</span><span class="game-badge badge-pokemon">Pokémon</span>
            </div>
            <div class="product-info">
              <div class="product-name">Temporal Forces Booster Pack</div>
              <div class="product-set">Temporal Forces · 1 Pack / 10 Cards</div>
              <div class="product-price">$4.49</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('sp4','Temporal Forces Pack',4.49,'pokemon','🎴')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('sp4','Temporal Forces Pack',4.49,'pokemon','🎴');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div><!-- end panel-pokemon -->

    <!-- ══════════════════════════════════════════════════════ -->
    <!-- YU-GI-OH! PANEL -->
    <!-- ══════════════════════════════════════════════════════ -->
    <div id="panel-yugioh" style="display:none">

      <!-- Category filter dropdown -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;flex-wrap:wrap">
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-dim)"><i class="fas fa-filter" style="margin-right:0.4rem"></i>Filter by Category:</span>
        <div style="position:relative;display:inline-block" id="ygo-dd-wrap">
          <button onclick="toggleCatDD('ygo')" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 1.1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(70,199,194,0.3);border-radius:8px;color:var(--text-main);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;white-space:nowrap" id="ygo-dd-btn">
            <i class="fas fa-th-large" style="color:var(--teal);font-size:0.78rem"></i>
            <span id="ygo-dd-label">All Categories</span>
            <i class="fas fa-chevron-down" style="font-size:0.65rem;color:var(--teal);transition:transform 0.2s" id="ygo-dd-arrow"></i>
          </button>
          <div id="ygo-dd-panel" style="display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:220px;background:var(--bg-card2);border:1px solid rgba(70,199,194,0.25);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:200;overflow:hidden">
            <div onclick="pickCat('yugioh','all','All Categories')"    style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(70,199,194,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-th-large" style="width:14px;color:var(--teal)"></i> All Categories</div>
            <div onclick="pickCat('yugioh','boxes','Booster Boxes')"   style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(70,199,194,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-box" style="width:14px;color:var(--teal)"></i> Booster Boxes</div>
            <div onclick="pickCat('yugioh','bundles','Booster Bundles')" style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(70,199,194,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-layer-group" style="width:14px;color:var(--teal)"></i> Booster Bundles</div>
            <div onclick="pickCat('yugioh','packs','Booster Packs')"  style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(70,199,194,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-id-card" style="width:14px;color:var(--teal)"></i> Booster Packs</div>
          </div>
        </div>
        <span id="ygo-active-chip" style="display:none;align-items:center;gap:0.4rem;padding:0.3rem 0.75rem;background:rgba(70,199,194,0.12);border:1px solid rgba(70,199,194,0.35);border-radius:20px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.78rem;color:var(--teal);cursor:pointer" onclick="pickCat('yugioh','all','All Categories')">
          <span id="ygo-chip-label"></span><i class="fas fa-times" style="font-size:0.65rem"></i>
        </span>
      </div>

      <!-- YGO · Booster Boxes -->
      <div id="ygo-sec-boxes">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--teal),var(--cyan));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Boxes</h2>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted)">— Factory Sealed</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(70,199,194,0.1),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-yugioh">Yu-Gi-Oh!</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">SEALED</span>
            </div>
            <div class="product-info">
              <div class="product-name">Phantom Nightmare Booster Box</div>
              <div class="product-set">Phantom Nightmare · 24 Packs</div>
              <div class="product-price">$89.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('ybox1','Phantom Nightmare Box',89.99,'yugioh','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('ybox1','Phantom Nightmare Box',89.99,'yugioh','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(70,199,194,0.1),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-yugioh">Yu-Gi-Oh!</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,74,58,0.2);color:var(--red);border:1px solid rgba(216,74,58,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">🔴 HOT</span>
            </div>
            <div class="product-info">
              <div class="product-name">Rage of the Abyss Booster Box</div>
              <div class="product-set">Rage of the Abyss · 24 Packs</div>
              <div class="product-price">$79.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('ybox2','Rage of the Abyss Box',79.99,'yugioh','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('ybox2','Rage of the Abyss Box',79.99,'yugioh','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- YGO · Booster Bundles -->
      <div id="ygo-sec-bundles">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--cyan),var(--purple));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Bundles</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(70,199,194,0.08),rgba(14,18,48,0.9))">
              <span>🎁</span><span class="game-badge badge-yugioh">Yu-Gi-Oh!</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(166,107,255,0.2);color:var(--purple);border:1px solid rgba(166,107,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">BUNDLE</span>
            </div>
            <div class="product-info">
              <div class="product-name">Blue-Eyes White Dragon Tin</div>
              <div class="product-set">2024 Mega Tin · 3 Packs + Promo</div>
              <div class="product-price">$34.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('ytin1','Blue-Eyes Tin',34.99,'yugioh','🎁')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('ytin1','Blue-Eyes Tin',34.99,'yugioh','🎁');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- YGO · Booster Packs -->
      <div id="ygo-sec-packs">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--purple),var(--gold));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Packs</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(70,199,194,0.07),rgba(14,18,48,0.9))">
              <span>🎴</span><span class="game-badge badge-yugioh">Yu-Gi-Oh!</span>
            </div>
            <div class="product-info">
              <div class="product-name">Phantom Nightmare Booster Pack</div>
              <div class="product-set">Phantom Nightmare · 9 Cards</div>
              <div class="product-price">$3.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('ypack1','Phantom Nightmare Pack',3.99,'yugioh','🎴')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('ypack1','Phantom Nightmare Pack',3.99,'yugioh','🎴');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div><!-- end panel-yugioh -->

    <!-- ══════════════════════════════════════════════════════ -->
    <!-- MAGIC: THE GATHERING PANEL -->
    <!-- ══════════════════════════════════════════════════════ -->
    <div id="panel-mtg" style="display:none">

      <!-- Category filter dropdown -->
      <div style="display:flex;align-items:center;gap:1rem;margin-bottom:2rem;flex-wrap:wrap">
        <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.82rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--gold-dim)"><i class="fas fa-filter" style="margin-right:0.4rem"></i>Filter by Category:</span>
        <div style="position:relative;display:inline-block" id="mtg-dd-wrap">
          <button onclick="toggleCatDD('mtg')" style="display:flex;align-items:center;gap:0.6rem;padding:0.55rem 1.1rem;background:rgba(255,255,255,0.05);border:1px solid rgba(166,107,255,0.3);border-radius:8px;color:var(--text-main);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;cursor:pointer;transition:all 0.2s;white-space:nowrap" id="mtg-dd-btn">
            <i class="fas fa-th-large" style="color:var(--purple);font-size:0.78rem"></i>
            <span id="mtg-dd-label">All Categories</span>
            <i class="fas fa-chevron-down" style="font-size:0.65rem;color:var(--purple);transition:transform 0.2s" id="mtg-dd-arrow"></i>
          </button>
          <div id="mtg-dd-panel" style="display:none;position:absolute;top:calc(100% + 6px);left:0;min-width:220px;background:var(--bg-card2);border:1px solid rgba(166,107,255,0.25);border-radius:10px;box-shadow:0 8px 32px rgba(0,0,0,0.5);z-index:200;overflow:hidden">
            <div onclick="pickCat('mtg','all','All Categories')"    style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(166,107,255,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-th-large" style="width:14px;color:var(--purple)"></i> All Categories</div>
            <div onclick="pickCat('mtg','boxes','Booster Boxes')"   style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(166,107,255,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-box" style="width:14px;color:var(--purple)"></i> Booster Boxes</div>
            <div onclick="pickCat('mtg','bundles','Booster Bundles')" style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(166,107,255,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-layer-group" style="width:14px;color:var(--purple)"></i> Booster Bundles</div>
            <div onclick="pickCat('mtg','packs','Booster Packs')"  style="padding:0.65rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.88rem;color:var(--text-main);display:flex;align-items:center;gap:0.6rem;transition:background 0.15s" onmouseover="this.style.background='rgba(166,107,255,0.08)'" onmouseout="this.style.background=''"><i class="fas fa-id-card" style="width:14px;color:var(--purple)"></i> Booster Packs</div>
          </div>
        </div>
        <span id="mtg-active-chip" style="display:none;align-items:center;gap:0.4rem;padding:0.3rem 0.75rem;background:rgba(166,107,255,0.12);border:1px solid rgba(166,107,255,0.35);border-radius:20px;font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.78rem;color:var(--purple);cursor:pointer" onclick="pickCat('mtg','all','All Categories')">
          <span id="mtg-chip-label"></span><i class="fas fa-times" style="font-size:0.65rem"></i>
        </span>
      </div>

      <!-- MTG · Booster Boxes -->
      <div id="mtg-sec-boxes">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--purple),rgba(166,107,255,0.5));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Boxes</h2>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.72rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted)">— Factory Sealed</span>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.1),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-mtg">MTG</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(76,203,255,0.2);color:var(--cyan);border:1px solid rgba(76,203,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">SEALED</span>
            </div>
            <div class="product-info">
              <div class="product-name">Bloomburrow Draft Booster Box</div>
              <div class="product-set">Bloomburrow · 36 Packs</div>
              <div class="product-price">$119.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('mbox1','Bloomburrow Draft Box',119.99,'mtg','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('mbox1','Bloomburrow Draft Box',119.99,'mtg','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.1),rgba(14,18,48,0.9))">
              <span>📦</span><span class="game-badge badge-mtg">MTG</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(216,74,58,0.2);color:var(--red);border:1px solid rgba(216,74,58,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">🔴 HOT</span>
            </div>
            <div class="product-info">
              <div class="product-name">Duskmourn Draft Booster Box</div>
              <div class="product-set">Duskmourn: House of Horror · 36 Packs</div>
              <div class="product-price">$109.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('mbox2','Duskmourn Draft Box',109.99,'mtg','📦')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('mbox2','Duskmourn Draft Box',109.99,'mtg','📦');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MTG · Booster Bundles -->
      <div id="mtg-sec-bundles">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--cyan),var(--purple));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Bundles</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.08),rgba(14,18,48,0.9))">
              <span>🎁</span><span class="game-badge badge-mtg">MTG</span>
              <span style="position:absolute;top:10px;right:10px;background:rgba(166,107,255,0.2);color:var(--purple);border:1px solid rgba(166,107,255,0.4);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.6rem;letter-spacing:0.1em;text-transform:uppercase;padding:2px 7px;border-radius:4px">BUNDLE</span>
            </div>
            <div class="product-info">
              <div class="product-name">Bloomburrow Bundle</div>
              <div class="product-set">Bloomburrow · 9 Packs + Lands</div>
              <div class="product-price">$44.99</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('mbnd1','Bloomburrow Bundle',44.99,'mtg','🎁')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('mbnd1','Bloomburrow Bundle',44.99,'mtg','🎁');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- MTG · Booster Packs -->
      <div id="mtg-sec-packs">
        <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.25rem">
          <div style="width:4px;height:24px;background:linear-gradient(180deg,var(--purple),var(--gold));border-radius:2px"></div>
          <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.06em;color:var(--text-main)">Booster Packs</h2>
        </div>
        <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(260px,1fr));gap:1.5rem;margin-bottom:2.5rem">
          <div class="product-card">
            <div class="product-card-img" style="font-size:3rem;background:linear-gradient(135deg,rgba(166,107,255,0.07),rgba(14,18,48,0.9))">
              <span>🎴</span><span class="game-badge badge-mtg">MTG</span>
            </div>
            <div class="product-info">
              <div class="product-name">Bloomburrow Draft Booster Pack</div>
              <div class="product-set">Bloomburrow · 15 Cards</div>
              <div class="product-price">$4.49</div>
              <div class="product-condition">Condition: Factory Sealed</div>
              <div style="display:flex;gap:0.5rem;margin-top:0.85rem">
                <button class="btn-add-cart" style="flex:1" onclick="addToCart('mpack1','Bloomburrow Draft Pack',4.49,'mtg','🎴')"><i class="fas fa-cart-plus"></i> Add to Cart</button>
                <button onclick="addToCart('mpack1','Bloomburrow Draft Pack',4.49,'mtg','🎴');window.location.href='/checkout'" style="padding:0.6rem 0.9rem;background:linear-gradient(135deg,var(--gold),var(--gold-light));border:none;border-radius:8px;color:var(--bg-deep);font-family:'Rajdhani',sans-serif;font-weight:800;font-size:0.78rem;letter-spacing:0.06em;text-transform:uppercase;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.boxShadow='0 0 20px rgba(216,179,90,0.5)'" onmouseout="this.style.boxShadow=''">Buy Now</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div><!-- end panel-mtg -->

  </div>
</div>

${getFooter()}
${getCartScript()}

<script>
// ── GAME TAB SWITCHER ─────────────────────────────────────────────────────────
const GAMES = ['pokemon','yugioh','mtg'];
function switchGame(game) {
  GAMES.forEach(g => {
    document.getElementById('gtab-' + g).classList.toggle('active', g === game);
    document.getElementById('panel-' + g).style.display = (g === game) ? 'block' : 'none';
  });
}

// ── CATEGORY FILTER DROPDOWNS ─────────────────────────────────────────────────
const CAT_SECTIONS = {
  pokemon: ['boxes','elite','bundles','packs'],
  yugioh:  ['boxes','bundles','packs'],
  mtg:     ['boxes','bundles','packs']
};
const PREFIX = { pokemon:'pok', yugioh:'ygo', mtg:'mtg' };

function toggleCatDD(prefix) {
  const panel = document.getElementById(prefix + '-dd-panel');
  const arrow = document.getElementById(prefix + '-dd-arrow');
  const isOpen = panel.style.display === 'block';
  // Close all dropdowns first
  ['pok','ygo','mtg'].forEach(p => {
    const pa = document.getElementById(p + '-dd-panel');
    const ar = document.getElementById(p + '-dd-arrow');
    if (pa) pa.style.display = 'none';
    if (ar) ar.style.transform = '';
  });
  if (!isOpen) {
    panel.style.display = 'block';
    if (arrow) arrow.style.transform = 'rotate(180deg)';
  }
}

function pickCat(game, cat, label) {
  const prefix = PREFIX[game];
  // Close dropdown
  const panel = document.getElementById(prefix + '-dd-panel');
  const arrow = document.getElementById(prefix + '-dd-arrow');
  if (panel) panel.style.display = 'none';
  if (arrow) arrow.style.transform = '';

  // Update label
  const lbl = document.getElementById(prefix + '-dd-label');
  if (lbl) lbl.textContent = label;

  // Show/hide active chip
  const chip = document.getElementById(prefix + '-active-chip');
  const chipLbl = document.getElementById(prefix + '-chip-label');
  if (chip && chipLbl) {
    if (cat === 'all') {
      chip.style.display = 'none';
    } else {
      chipLbl.textContent = label;
      chip.style.display = 'flex';
    }
  }

  // Show/hide sections
  const cats = CAT_SECTIONS[game];
  cats.forEach(c => {
    const sec = document.getElementById(prefix + '-sec-' + c);
    if (sec) sec.style.display = (cat === 'all' || cat === c) ? 'block' : 'none';
  });
}

// Close dropdowns when clicking outside
document.addEventListener('click', function(e) {
  ['pok','ygo','mtg'].forEach(p => {
    const wrap = document.getElementById(p + '-dd-wrap');
    if (wrap && !wrap.contains(e.target)) {
      const pa = document.getElementById(p + '-dd-panel');
      const ar = document.getElementById(p + '-dd-arrow');
      if (pa) pa.style.display = 'none';
      if (ar) ar.style.transform = '';
    }
  });
});

// ── URL PARAM ROUTING ─────────────────────────────────────────────────────────
const params = new URLSearchParams(window.location.search);
const gParam = params.get('game');
const cParam = params.get('cat');
const startGame = (gParam && GAMES.includes(gParam)) ? gParam : 'pokemon';
switchGame(startGame);
if (cParam) {
  const catLabels = { boxes:'Booster Boxes', elite:'Elite Trainer Boxes', bundles:'Booster Bundles', packs:'Booster Packs' };
  pickCat(startGame, cParam, catLabels[cParam] || 'All Categories');
}
</script>
</body></html>`
}


// ─── CONTACT PAGE ────────────────────────────────────────────────────────────
function contactPage() {
  return `${getHead('Contact')}
<body>
${getNav('contact')}
<div class="page-wrap">

  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">We'd Love to Hear From You</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">Contact & Inquiries</h1>
      <div class="gold-line" style="margin:0.75rem auto 0.75rem"></div>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:500px;margin:0 auto">Questions about our inventory? Looking for a specific product? Submit an inquiry and we&#39;ll get back to you within 24 hours.</p>
    </div>
  </div>

  <div class="container section">
    <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:3rem;align-items:start">

      <!-- CONTACT FORM -->
      <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:20px;padding:2.5rem">
        <h2 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.2rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:0.35rem">Send an Inquiry</h2>
        <p style="font-size:0.85rem;color:var(--text-muted);margin-bottom:2rem">Fill out the form and we&#39;ll respond within 24 hours.</p>

        <form id="contact-form" onsubmit="submitContact(event)">
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
            <div class="form-group">
              <label class="form-label">First Name *</label>
              <input type="text" class="form-input" name="firstName" placeholder="John" required>
            </div>
            <div class="form-group">
              <label class="form-label">Last Name *</label>
              <input type="text" class="form-input" name="lastName" placeholder="Smith" required>
            </div>
          </div>

          <div class="form-group">
            <label class="form-label">Email Address *</label>
            <input type="email" class="form-input" name="email" placeholder="john@example.com" required>
          </div>

          <div class="form-group">
            <label class="form-label">Phone Number</label>
            <input type="tel" class="form-input" name="phone" placeholder="+1 (555) 000-0000">
          </div>

          <div class="form-group">
            <label class="form-label">Inquiry Type *</label>
            <select class="form-select" name="type" required>
              <option value="">Select an inquiry type...</option>
              <option value="purchase">Purchasing a Card</option>
              <option value="selling">Selling My Cards</option>

              <option value="specific">Looking for a Specific Card</option>
              <option value="bulk">Bulk / Collection Purchase</option>
              <option value="trade">Trade Offer</option>
              <option value="other">Other</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Game / TCG</label>
            <select class="form-select" name="game">
              <option value="">Select a game (if applicable)...</option>
              <option value="pokemon">Pokémon TCG</option>
              <option value="yugioh">Yu-Gi-Oh!</option>
              <option value="mtg">Magic: The Gathering</option>
              <option value="multiple">Multiple Games</option>
            </select>
          </div>

          <div class="form-group">
            <label class="form-label">Card Name / Details</label>
            <input type="text" class="form-input" name="cardName" placeholder="e.g. Charizard VMAX Rainbow Rare, Champions Path">
          </div>

          <div class="form-group">
            <label class="form-label">Message *</label>
            <textarea class="form-textarea" name="message" placeholder="Tell us more about what you are looking for, your budget, or any other details..." required style="min-height:160px"></textarea>
          </div>

          <div style="display:flex;align-items:center;gap:0.75rem;margin-bottom:1.75rem;background:rgba(76,203,255,0.05);border:1px solid rgba(76,203,255,0.15);border-radius:10px;padding:1rem">
            <i class="fas fa-shield-alt" style="color:var(--cyan);font-size:1.1rem;flex-shrink:0"></i>
            <p style="font-size:0.8rem;color:var(--text-muted);line-height:1.5">Your information is kept private and will only be used to respond to your inquiry. We never sell or share your data.</p>
          </div>

          <button type="submit" class="btn-primary" style="width:100%;font-size:1rem;padding:1rem" id="submit-btn">
            <i class="fas fa-paper-plane" style="margin-right:0.5rem"></i> Send Inquiry
          </button>
        </form>

        <!-- SUCCESS STATE -->
        <div id="success-msg" style="display:none;text-align:center;padding:3rem 1rem">
          <div style="width:80px;height:80px;border-radius:50%;background:rgba(70,199,194,0.1);border:2px solid var(--teal);display:flex;align-items:center;justify-content:center;margin:0 auto 1.5rem">
            <i class="fas fa-check" style="font-size:2rem;color:var(--teal)"></i>
          </div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.2rem;color:var(--teal);margin-bottom:0.75rem">Inquiry Received!</h3>
          <p style="color:var(--text-muted);line-height:1.7;font-size:0.95rem" id="success-text">We'll get back to you within 24 hours.</p>
          <button onclick="resetForm()" class="btn-secondary" style="margin-top:1.5rem">Send Another Inquiry</button>
        </div>
      </div>

      <!-- SIDEBAR INFO -->
      <div style="display:flex;flex-direction:column;gap:1.5rem">

        <!-- Contact Details -->
        <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:18px;padding:2rem">
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1.5rem">Get In Touch</h3>
          <div style="display:flex;flex-direction:column;gap:1.25rem">
            <div style="display:flex;gap:1rem;align-items:flex-start">
              <div style="width:40px;height:40px;border-radius:10px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-envelope" style="color:var(--gold-light);font-size:0.9rem"></i>
              </div>
              <div>
                <div style="font-family:'Rajdhani',sans-serif;font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:2px">Email</div>
                <a href="mailto:ctg.investments2026@gmail.com" style="color:var(--gold-light);font-size:0.9rem;text-decoration:none;transition:color 0.2s" onmouseover="this.style.color='var(--cyan)'" onmouseout="this.style.color='var(--gold-light)'">ctg.investments2026@gmail.com</a>
              </div>
            </div>
            <div style="display:flex;gap:1rem;align-items:flex-start">
              <div style="width:40px;height:40px;border-radius:10px;background:rgba(76,203,255,0.1);border:1px solid rgba(76,203,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-clock" style="color:var(--cyan);font-size:0.9rem"></i>
              </div>
              <div>
                <div style="font-family:'Rajdhani',sans-serif;font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:2px">Response Time</div>
                <div style="color:var(--text-main);font-size:0.9rem">Within 24 hours</div>
                <div style="color:var(--text-muted);font-size:0.78rem">Mon–Sat, 9AM–7PM EST</div>
              </div>
            </div>
            <div style="display:flex;gap:1rem;align-items:flex-start">
              <div style="width:40px;height:40px;border-radius:10px;background:rgba(166,107,255,0.1);border:1px solid rgba(166,107,255,0.2);display:flex;align-items:center;justify-content:center;flex-shrink:0">
                <i class="fas fa-map-marker-alt" style="color:var(--purple);font-size:0.9rem"></i>
              </div>
              <div>
                <div style="font-family:'Rajdhani',sans-serif;font-size:0.75rem;letter-spacing:0.12em;text-transform:uppercase;color:var(--text-muted);margin-bottom:2px">Location</div>
                <div style="color:var(--text-main);font-size:0.9rem">United States</div>
                <div style="color:var(--text-muted);font-size:0.78rem">Ships nationwide & internationally</div>
              </div>
            </div>
          </div>
        </div>

        <!-- FAQ -->
        <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:18px;padding:2rem">
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1.25rem">Common Questions</h3>
          <div style="display:flex;flex-direction:column;gap:1rem">
            ${[
              {q:'Do you ship internationally?', a:'Yes! We ship worldwide with full tracking.'},
              {q:'How do you grade condition?', a:'We use industry-standard TCG grading: NM, LP, MP, VG, HP.'},
              {q:'Can I sell my cards to you?', a:'Yes! Submit an inquiry with details and we\'ll make an offer.'},
              {q:'Do you sell sealed products only?', a:'Yes! All our products are brand new, factory-sealed booster boxes, packs, Elite Trainer Boxes, and Booster Bundles.'},
            ].map(f => `
            <details style="border:1px solid rgba(216,179,90,0.12);border-radius:10px;overflow:hidden">
              <summary style="padding:0.85rem 1rem;cursor:pointer;font-family:'Rajdhani',sans-serif;font-weight:600;font-size:0.9rem;color:var(--text-main);list-style:none;display:flex;justify-content:space-between;align-items:center">
                ${f.q}
                <i class="fas fa-chevron-down" style="font-size:0.7rem;color:var(--gold-light)"></i>
              </summary>
              <div style="padding:0.75rem 1rem 1rem;font-size:0.85rem;color:var(--text-muted);line-height:1.6;border-top:1px solid rgba(216,179,90,0.08)">${f.a}</div>
            </details>`).join('')}
          </div>
        </div>

        <!-- Social -->
        <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:18px;padding:2rem;text-align:center">
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1rem">Follow Us</h3>
          <div style="display:flex;gap:0.75rem;justify-content:center">
            ${[
              {icon:'fab fa-instagram', label:'Instagram'},
              {icon:'fab fa-tiktok',    label:'TikTok'},
              {icon:'fab fa-facebook',  label:'Facebook'},
              {icon:'fab fa-youtube',   label:'YouTube'},
            ].map(s => `
            <a href="#" style="display:flex;flex-direction:column;align-items:center;gap:0.35rem;padding:0.75rem;border-radius:12px;border:1px solid rgba(216,179,90,0.15);background:rgba(216,179,90,0.05);color:var(--gold-light);text-decoration:none;font-size:0.65rem;font-family:'Rajdhani',sans-serif;letter-spacing:0.1em;text-transform:uppercase;transition:all 0.2s;min-width:60px" onmouseover="this.style.background='rgba(216,179,90,0.12)';this.style.borderColor='rgba(216,179,90,0.35)'" onmouseout="this.style.background='rgba(216,179,90,0.05)';this.style.borderColor='rgba(216,179,90,0.15)'">
              <i class="${s.icon}" style="font-size:1.2rem"></i>${s.label}
            </a>`).join('')}
          </div>
        </div>

      </div>
    </div>
  </div>
</div>

${getFooter()}
${getCartScript()}

<script>
async function submitContact(e) {
  e.preventDefault();
  const btn = document.getElementById('submit-btn');
  btn.disabled = true;
  btn.innerHTML = '<i class="fas fa-spinner fa-spin" style="margin-right:0.5rem"></i> Sending...';

  const form = document.getElementById('contact-form');
  const data = Object.fromEntries(new FormData(form));

  // Build a human-readable subject for Formspree
  const subject = 'CTG Legacy Inquiry — ' + (data.type || 'General') + (data.game ? ' [' + data.game + ']' : '');

  try {
    const res = await fetch('https://formspree.io/f/xdayrglj', {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({
        _subject: subject,
        name: (data.firstName || '') + ' ' + (data.lastName || ''),
        email: data.email || '',
        phone: data.phone || 'N/A',
        inquiry_type: data.type || 'N/A',
        game: data.game || 'N/A',
        card_details: data.cardName || 'N/A',
        message: data.message || ''
      })
    });

    if (res.ok) {
      form.style.display = 'none';
      document.getElementById('success-text').textContent = "Inquiry received! We'll get back to you within 24 hours.";
      document.getElementById('success-msg').style.display = 'block';
    } else {
      const json = await res.json().catch(() => ({}));
      const errMsg = (json.errors && json.errors.map(err => err.message).join(', ')) || 'Submission failed. Please email us directly at ctg.investments2026@gmail.com';
      alert(errMsg);
      btn.disabled = false;
      btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:0.5rem"></i> Send Inquiry';
    }
  } catch(err) {
    alert('Network error. Please email us directly at ctg.investments2026@gmail.com');
    btn.disabled = false;
    btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:0.5rem"></i> Send Inquiry';
  }
}

function resetForm() {
  document.getElementById('contact-form').reset();
  document.getElementById('contact-form').style.display = 'block';
  document.getElementById('success-msg').style.display = 'none';
  const btn = document.getElementById('submit-btn');
  btn.disabled = false;
  btn.innerHTML = '<i class="fas fa-paper-plane" style="margin-right:0.5rem"></i> Send Inquiry';
}
</script>
</body></html>`
}

// ─── CART PAGE ───────────────────────────────────────────────────────────────
function cartPage() {
  return `${getHead('Shopping Cart')}
<body>
${getNav('cart')}
<div class="page-wrap">

  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">Review Your Selection</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">Shopping Cart</h1>
      <div class="gold-line" style="margin:0.75rem auto 0"></div>
    </div>
  </div>

  <div class="container section">
    <div style="display:grid;grid-template-columns:1.8fr 1fr;gap:2.5rem;align-items:start" id="cart-layout">

      <!-- CART ITEMS -->
      <div>
        <div id="cart-items-list"></div>
        <div id="cart-empty" style="display:none;text-align:center;padding:5rem 2rem;background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.1);border-radius:20px">
          <i class="fas fa-shopping-cart" style="font-size:4rem;color:rgba(216,179,90,0.2);margin-bottom:1.5rem"></i>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1.1rem;color:var(--text-muted);margin-bottom:0.75rem">Your cart is empty</h3>
          <p style="font-size:0.9rem;color:var(--text-muted);margin-bottom:2rem">Browse our collection and find your next investment.</p>
          <a href="/tcg-cards" class="btn-primary" style="text-decoration:none">Shop Cards</a>
        </div>
      </div>

      <!-- ORDER SUMMARY -->
      <div id="order-summary" style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:20px;padding:2rem;position:sticky;top:90px">
        <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid rgba(216,179,90,0.15)">Order Summary</h3>

        <div style="display:flex;flex-direction:column;gap:0.75rem;margin-bottom:1.5rem">
          <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)">
            <span>Subtotal (<span id="summary-count">0</span> items)</span>
            <span style="color:var(--text-main)" id="summary-subtotal">$0.00</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)">
            <span>Shipping</span>
            <span style="color:var(--teal)">Calculated at checkout</span>
          </div>
          <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)">
            <span>Insurance</span>
            <span style="color:var(--teal)">Included</span>
          </div>
        </div>

        <div style="border-top:1px solid rgba(216,179,90,0.15);padding-top:1rem;margin-bottom:1.5rem">
          <div style="display:flex;justify-content:space-between;align-items:center">
            <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.05em">Total</span>
            <span style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.4rem;color:var(--gold-light)" id="summary-total">$0.00</span>
          </div>
        </div>

        <a href="/checkout" class="btn-primary" style="display:block;text-align:center;text-decoration:none;width:100%;font-size:1rem;padding:1rem;margin-bottom:0.85rem" id="checkout-btn">
          <i class="fas fa-lock" style="margin-right:0.5rem"></i> Proceed to Checkout
        </a>
        <a href="/tcg-cards" class="btn-secondary" style="display:block;text-align:center;width:100%;font-size:0.9rem;padding:0.75rem">
          <i class="fas fa-arrow-left" style="margin-right:0.5rem"></i> Continue Shopping
        </a>

        <div style="margin-top:1.5rem;display:flex;flex-direction:column;gap:0.5rem">
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:var(--text-muted)">
            <i class="fas fa-shield-alt" style="color:var(--teal);font-size:0.8rem"></i> Secure checkout — SSL encrypted
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:var(--text-muted)">
            <i class="fas fa-undo" style="color:var(--teal);font-size:0.8rem"></i> 3-day return policy
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;font-size:0.78rem;color:var(--text-muted)">
            <i class="fas fa-box" style="color:var(--teal);font-size:0.8rem"></i> Safe packaged shipping
          </div>
        </div>
      </div>
    </div>
  </div>
</div>

${getFooter()}
${getCartScript()}

<script>
function renderCart() {
  const cart = getCart();
  const list = document.getElementById('cart-items-list');
  const empty = document.getElementById('cart-empty');
  const checkoutBtn = document.getElementById('checkout-btn');

  if(cart.length === 0) {
    list.innerHTML = '';
    empty.style.display = 'block';
    checkoutBtn.style.opacity = '0.4';
    checkoutBtn.style.pointerEvents = 'none';
    document.getElementById('summary-count').textContent = '0';
    document.getElementById('summary-subtotal').textContent = '$0.00';
    document.getElementById('summary-total').textContent = '$0.00';
    return;
  }

  empty.style.display = 'none';
  checkoutBtn.style.opacity = '1';
  checkoutBtn.style.pointerEvents = 'auto';

  const total = cart.reduce((s,i) => s + i.price * i.qty, 0);
  const count = cart.reduce((s,i) => s + i.qty, 0);
  document.getElementById('summary-count').textContent = count;
  document.getElementById('summary-subtotal').textContent = '$' + total.toFixed(2);
  document.getElementById('summary-total').textContent = '$' + total.toFixed(2);

  list.innerHTML = \`
    <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:20px;overflow:hidden">
      <div style="padding:1.25rem 1.5rem;border-bottom:1px solid rgba(216,179,90,0.1);display:flex;justify-content:space-between;align-items:center">
        <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.95rem;letter-spacing:0.08em;color:var(--gold-light)">Cart (\${count} items)</h3>
        <button onclick="clearCart()" style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--red);background:rgba(216,74,58,0.08);border:1px solid rgba(216,74,58,0.2);border-radius:6px;padding:4px 10px;cursor:pointer">Clear All</button>
      </div>
      \${cart.map((item, i) => \`
        <div style="display:flex;align-items:center;gap:1rem;padding:1.25rem 1.5rem;\${i < cart.length-1 ? 'border-bottom:1px solid rgba(255,255,255,0.04)' : ''}">
          <div style="width:60px;height:60px;border-radius:12px;background:linear-gradient(135deg,#0e1a3a,#1a2455);display:flex;align-items:center;justify-content:center;font-size:1.8rem;flex-shrink:0;border:1px solid rgba(216,179,90,0.1)">\${item.img}</div>
          <div style="flex:1;min-width:0">
            <div style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:1rem;color:var(--text-main);margin-bottom:2px;white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${item.name}</div>
            <div style="font-size:0.78rem;color:var(--text-muted)">\${item.game.toUpperCase()}</div>
          </div>
          <div style="display:flex;align-items:center;gap:0.5rem;flex-shrink:0">
            <button onclick="changeQty('\${item.id}',-1)" style="width:28px;height:28px;border-radius:6px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);color:var(--gold-light);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">−</button>
            <span style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.9rem;width:24px;text-align:center">\${item.qty}</span>
            <button onclick="changeQty('\${item.id}',1)" style="width:28px;height:28px;border-radius:6px;background:rgba(216,179,90,0.1);border:1px solid rgba(216,179,90,0.2);color:var(--gold-light);cursor:pointer;font-size:1rem;display:flex;align-items:center;justify-content:center">+</button>
          </div>
          <div style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;color:var(--gold-light);flex-shrink:0;min-width:80px;text-align:right">$\${(item.price * item.qty).toFixed(2)}</div>
          <button onclick="removeItem('\${item.id}')" style="width:32px;height:32px;border-radius:8px;background:rgba(216,74,58,0.1);border:1px solid rgba(216,74,58,0.2);color:var(--red);cursor:pointer;display:flex;align-items:center;justify-content:center;flex-shrink:0;font-size:0.85rem"><i class="fas fa-trash"></i></button>
        </div>
      \`).join('')}
    </div>
  \`;
}

function changeQty(id, delta) {
  const cart = getCart();
  const idx = cart.findIndex(i => i.id === id);
  if(idx < 0) return;
  cart[idx].qty = Math.max(1, cart[idx].qty + delta);
  saveCart(cart);
  renderCart();
}

function removeItem(id) {
  const cart = getCart().filter(i => i.id !== id);
  saveCart(cart);
  renderCart();
  showToast('Item removed from cart');
}

function clearCart() {
  if(confirm('Remove all items from cart?')) {
    saveCart([]);
    renderCart();
  }
}

document.addEventListener('DOMContentLoaded', renderCart);
</script>
</body></html>`
}

// ─── CHECKOUT PAGE ───────────────────────────────────────────────────────────
function checkoutPage() {
  return `${getHead('Checkout')}
<body>
${getNav('')}
<div class="page-wrap">

  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">Secure Checkout</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">Checkout</h1>
      <div class="gold-line" style="margin:0.75rem auto 0"></div>
    </div>
  </div>

  <div class="container section">

    <!-- STEPS INDICATOR -->
    <div style="display:flex;align-items:center;justify-content:center;gap:0;margin-bottom:3rem;flex-wrap:wrap">
      ${[
        {n:'1', label:'Shipping'},
        {n:'2', label:'Payment'},
        {n:'3', label:'Review'},
      ].map((s,i) => `
      <div style="display:flex;align-items:center">
        <div style="display:flex;flex-direction:column;align-items:center;gap:0.35rem">
          <div id="step-circle-${s.n}" style="width:40px;height:40px;border-radius:50%;background:${i===0 ? 'var(--gold)' : 'rgba(255,255,255,0.05)'};border:2px solid ${i===0 ? 'var(--gold)' : 'rgba(255,255,255,0.1)'};display:flex;align-items:center;justify-content:center;font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.8rem;color:${i===0 ? 'var(--bg-deep)' : 'var(--text-muted)'};">${s.n}</div>
          <span style="font-family:'Rajdhani',sans-serif;font-size:0.75rem;letter-spacing:0.1em;text-transform:uppercase;color:${i===0 ? 'var(--gold-light)' : 'var(--text-muted)'}">${s.label}</span>
        </div>
        ${i < 2 ? '<div style="width:80px;height:1px;background:rgba(255,255,255,0.08);margin:0 0.5rem;margin-bottom:1.4rem"></div>' : ''}
      </div>`).join('')}
    </div>

    <div style="display:grid;grid-template-columns:1.6fr 1fr;gap:2.5rem;align-items:start">

      <!-- CHECKOUT FORM -->
      <div>
        <!-- Step 1: Shipping -->
        <div id="step1" style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:20px;padding:2rem;margin-bottom:1.5rem">
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1.5rem;display:flex;align-items:center;gap:0.75rem">
            <span style="width:28px;height:28px;border-radius:50%;background:var(--gold);color:var(--bg-deep);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:800">1</span>
            Shipping Information
          </h3>
          <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
            <div class="form-group"><label class="form-label">First Name *</label><input type="text" class="form-input" id="co-fname" placeholder="John" required></div>
            <div class="form-group"><label class="form-label">Last Name *</label><input type="text" class="form-input" id="co-lname" placeholder="Smith" required></div>
          </div>
          <div class="form-group"><label class="form-label">Email Address *</label><input type="email" class="form-input" id="co-email" placeholder="john@example.com" required></div>
          <div class="form-group"><label class="form-label">Phone Number</label><input type="tel" class="form-input" id="co-phone" placeholder="+1 (555) 000-0000"></div>
          <div class="form-group"><label class="form-label">Street Address *</label><input type="text" class="form-input" id="co-addr" placeholder="123 Main Street" required></div>
          <div class="form-group"><label class="form-label">Apt / Suite / Unit</label><input type="text" class="form-input" id="co-addr2" placeholder="Apt 4B (optional)"></div>
          <div style="display:grid;grid-template-columns:2fr 1fr 1fr;gap:1.25rem">
            <div class="form-group"><label class="form-label">City *</label><input type="text" class="form-input" id="co-city" placeholder="New York" required></div>
            <div class="form-group"><label class="form-label">State *</label><input type="text" class="form-input" id="co-state" placeholder="NY" required></div>
            <div class="form-group"><label class="form-label">ZIP *</label><input type="text" class="form-input" id="co-zip" placeholder="10001" required></div>
          </div>
          <div class="form-group">
            <label class="form-label">Country *</label>
            <select class="form-select" id="co-country">
              <option value="US">United States</option>
              <option value="CA">Canada</option>
              <option value="GB">United Kingdom</option>
              <option value="AU">Australia</option>
              <option value="other">Other</option>
            </select>
          </div>
          <div style="display:flex;flex-direction:column;gap:0.75rem;margin-top:0.5rem">
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-size:0.9rem;color:var(--text-muted)">
              <input type="radio" name="shipping" value="standard" checked style="accent-color:var(--gold)">
              <span style="flex:1">Standard Shipping (5–7 business days)</span>
              <span style="color:var(--teal);font-weight:600">FREE</span>
            </label>
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-size:0.9rem;color:var(--text-muted)">
              <input type="radio" name="shipping" value="priority" style="accent-color:var(--gold)">
              <span style="flex:1">Priority Shipping (2–3 business days)</span>
              <span style="color:var(--gold-light);font-weight:600">$8.99</span>
            </label>
            <label style="display:flex;align-items:center;gap:0.75rem;cursor:pointer;font-size:0.9rem;color:var(--text-muted)">
              <input type="radio" name="shipping" value="overnight" style="accent-color:var(--gold)">
              <span style="flex:1">Overnight (Next business day)</span>
              <span style="color:var(--gold-light);font-weight:600">$24.99</span>
            </label>
          </div>
        </div>

        <!-- Step 2: Payment -->
        <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:20px;padding:2rem;margin-bottom:1.5rem">
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1.5rem;display:flex;align-items:center;gap:0.75rem">
            <span style="width:28px;height:28px;border-radius:50%;background:rgba(216,179,90,0.15);border:1px solid rgba(216,179,90,0.3);color:var(--gold-light);display:flex;align-items:center;justify-content:center;font-size:0.8rem;font-weight:800">2</span>
            Payment Information
          </h3>

          <!-- Payment Method Tabs -->
          <div style="display:flex;gap:0.75rem;margin-bottom:1.5rem;flex-wrap:wrap">
            <button class="filter-btn active" id="pay-card" onclick="setPayMethod('card')" style="flex:1;min-width:100px"><i class="fas fa-credit-card" style="margin-right:0.35rem"></i>Card</button>
            <button class="filter-btn" id="pay-paypal" onclick="setPayMethod('paypal')" style="flex:1;min-width:100px"><i class="fab fa-paypal" style="margin-right:0.35rem"></i>PayPal</button>
            <button class="filter-btn" id="pay-venmo" onclick="setPayMethod('venmo')" style="flex:1;min-width:100px"><i class="fas fa-mobile-alt" style="margin-right:0.35rem"></i>Venmo</button>
          </div>

          <!-- Card Form -->
          <div id="pay-card-form">
            <div class="form-group"><label class="form-label">Card Number *</label>
              <div style="position:relative">
                <input type="text" class="form-input" id="co-card" placeholder="1234 5678 9012 3456" maxlength="19" oninput="formatCard(this)" style="padding-right:3.5rem">
                <div style="position:absolute;right:1rem;top:50%;transform:translateY(-50%);display:flex;gap:4px">
                  <i class="fab fa-cc-visa" style="color:var(--text-muted);font-size:1.1rem"></i>
                  <i class="fab fa-cc-mastercard" style="color:var(--text-muted);font-size:1.1rem"></i>
                </div>
              </div>
            </div>
            <div class="form-group"><label class="form-label">Cardholder Name *</label><input type="text" class="form-input" id="co-cardholder" placeholder="JOHN SMITH"></div>
            <div style="display:grid;grid-template-columns:1fr 1fr;gap:1.25rem">
              <div class="form-group"><label class="form-label">Expiry Date *</label><input type="text" class="form-input" id="co-expiry" placeholder="MM / YY" maxlength="7" oninput="formatExpiry(this)"></div>
              <div class="form-group"><label class="form-label">CVV *</label><input type="text" class="form-input" id="co-cvv" placeholder="123" maxlength="4"></div>
            </div>
          </div>

          <!-- PayPal Form -->
          <div id="pay-paypal-form" style="display:none;text-align:center;padding:2rem;background:rgba(0,112,243,0.05);border:1px solid rgba(0,112,243,0.15);border-radius:12px">
            <i class="fab fa-paypal" style="font-size:3rem;color:#169BD7;margin-bottom:1rem"></i>
            <p style="color:var(--text-muted);font-size:0.9rem">You'll be redirected to PayPal to complete your purchase securely.</p>
          </div>

          <!-- Venmo Form -->
          <div id="pay-venmo-form" style="display:none;text-align:center;padding:2rem;background:rgba(61,124,193,0.05);border:1px solid rgba(61,124,193,0.15);border-radius:12px">
            <i class="fas fa-mobile-alt" style="font-size:3rem;color:#3D7CC1;margin-bottom:1rem"></i>
            <p style="color:var(--text-muted);font-size:0.9rem">Send payment to <strong style="color:var(--cyan)">@CTGLegacy</strong> on Venmo and include your order details in the note.</p>
          </div>

          <div style="display:flex;align-items:center;gap:0.5rem;margin-top:1rem;padding:0.75rem 1rem;background:rgba(70,199,194,0.05);border:1px solid rgba(70,199,194,0.12);border-radius:8px">
            <i class="fas fa-lock" style="color:var(--teal);font-size:0.85rem"></i>
            <span style="font-size:0.8rem;color:var(--text-muted)">Your payment information is encrypted and secure. We never store card details.</span>
          </div>
        </div>

        <!-- Place Order Button -->
        <button onclick="placeOrder()" class="btn-primary" style="width:100%;font-size:1.1rem;padding:1.1rem">
          <i class="fas fa-lock" style="margin-right:0.5rem"></i> Place Order
        </button>
        <p style="text-align:center;font-size:0.78rem;color:var(--text-muted);margin-top:0.75rem">By placing your order you agree to our Terms of Service and Privacy Policy</p>
      </div>

      <!-- ORDER SUMMARY SIDEBAR -->
      <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(216,179,90,0.18);border-radius:20px;padding:2rem;position:sticky;top:90px">
        <h3 style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.95rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:1.5rem;padding-bottom:1rem;border-bottom:1px solid rgba(216,179,90,0.15)">Order Summary</h3>
        <div id="co-items-list" style="margin-bottom:1.25rem;display:flex;flex-direction:column;gap:0.75rem"></div>
        <div style="border-top:1px solid rgba(216,179,90,0.12);padding-top:1rem;display:flex;flex-direction:column;gap:0.5rem">
          <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)"><span>Subtotal</span><span id="co-subtotal" style="color:var(--text-main)">$0.00</span></div>
          <div style="display:flex;justify-content:space-between;font-size:0.9rem;color:var(--text-muted)"><span>Shipping</span><span style="color:var(--teal)" id="co-shipping">FREE</span></div>
          <div style="display:flex;justify-content:space-between;align-items:center;margin-top:0.5rem;padding-top:0.75rem;border-top:1px solid rgba(216,179,90,0.12)">
            <span style="font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.95rem">Total</span>
            <span style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.3rem;color:var(--gold-light)" id="co-total">$0.00</span>
          </div>
        </div>
        <!-- Promo code -->
        <div style="margin-top:1.25rem;display:flex;gap:0.5rem">
          <input type="text" class="form-input" id="promo-code" placeholder="Promo code" style="font-size:0.85rem;padding:0.65rem 0.85rem">
          <button onclick="applyPromo()" style="background:rgba(216,179,90,0.15);border:1px solid rgba(216,179,90,0.3);border-radius:8px;color:var(--gold-light);font-family:'Rajdhani',sans-serif;font-weight:700;font-size:0.8rem;letter-spacing:0.08em;text-transform:uppercase;padding:0.65rem 1rem;cursor:pointer;white-space:nowrap;transition:all 0.2s" onmouseover="this.style.background='rgba(216,179,90,0.25)'" onmouseout="this.style.background='rgba(216,179,90,0.15)'">Apply</button>
        </div>
        <div id="promo-msg" style="font-size:0.8rem;margin-top:0.5rem;display:none"></div>
      </div>
    </div>

    <!-- ORDER SUCCESS OVERLAY -->
    <div id="order-success" style="display:none;position:fixed;inset:0;background:rgba(5,8,24,0.96);z-index:9999;display:none;align-items:center;justify-content:center;padding:2rem">
      <div style="background:linear-gradient(145deg,var(--bg-card),var(--bg-card2));border:1px solid rgba(70,199,194,0.4);border-radius:28px;padding:3.5rem 3rem;max-width:500px;width:100%;text-align:center;box-shadow:0 0 80px rgba(70,199,194,0.15)">
        <div style="width:90px;height:90px;border-radius:50%;background:rgba(70,199,194,0.1);border:2px solid var(--teal);display:flex;align-items:center;justify-content:center;margin:0 auto 2rem">
          <i class="fas fa-check" style="font-size:2.5rem;color:var(--teal)"></i>
        </div>
        <h2 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.5rem;color:var(--teal);margin-bottom:0.75rem;letter-spacing:0.05em">Order Placed!</h2>
        <p style="color:var(--text-muted);line-height:1.7;margin-bottom:0.5rem" id="order-confirm-msg">Thank you! Your order has been received.</p>
        <p style="font-family:'Rajdhani',sans-serif;font-size:0.85rem;letter-spacing:0.1em;color:var(--gold-light)" id="order-number"></p>
        <p style="font-size:0.85rem;color:var(--text-muted);margin:1rem 0 2rem">A confirmation email will be sent to you. Your cards will be shipped securely within 1–2 business days.</p>
        <a href="/" class="btn-primary" style="text-decoration:none;margin-right:0.75rem">Back to Home</a>
        <a href="/tcg-cards" class="btn-secondary" style="margin-top:0.75rem;display:inline-block">Shop More</a>
      </div>
    </div>

  </div>
</div>

${getFooter()}
${getCartScript()}

<script>
function setPayMethod(m) {
  ['card','paypal','venmo'].forEach(p => {
    document.getElementById('pay-'+p).classList.toggle('active', p === m);
    document.getElementById('pay-'+p+'-form').style.display = (p === m) ? 'block' : 'none';
  });
  if(m === 'paypal' || m === 'venmo') {
    document.getElementById('pay-paypal-form').style.display = m === 'paypal' ? 'block' : 'none';
    document.getElementById('pay-venmo-form').style.display  = m === 'venmo'  ? 'block' : 'none';
    document.getElementById('pay-card-form').style.display   = 'none';
  }
}

function formatCard(el) {
  let v = el.value.replace(/\\D/g,'').substring(0,16);
  el.value = v.replace(/(\\d{4})/g,'$1 ').trim();
}

function formatExpiry(el) {
  let v = el.value.replace(/\\D/g,'');
  if(v.length >= 2) v = v.slice(0,2) + ' / ' + v.slice(2,4);
  el.value = v;
}

function applyPromo() {
  const code = document.getElementById('promo-code').value.trim().toUpperCase();
  const msg = document.getElementById('promo-msg');
  if(code === 'CTG10') {
    msg.style.color = 'var(--teal)';
    msg.textContent = '✓ 10% discount applied!';
  } else {
    msg.style.color = 'var(--red)';
    msg.textContent = '✗ Invalid promo code.';
  }
  msg.style.display = 'block';
}

function renderCheckoutSummary() {
  const cart = getCart();
  const itemsList = document.getElementById('co-items-list');
  const subtotalEl = document.getElementById('co-subtotal');
  const totalEl = document.getElementById('co-total');

  const subtotal = cart.reduce((s,i) => s + i.price * i.qty, 0);
  subtotalEl.textContent = '$' + subtotal.toFixed(2);
  totalEl.textContent = '$' + subtotal.toFixed(2);

  itemsList.innerHTML = cart.map(item => \`
    <div style="display:flex;align-items:center;gap:0.75rem">
      <div style="width:44px;height:44px;border-radius:8px;background:linear-gradient(135deg,#0e1a3a,#1a2455);display:flex;align-items:center;justify-content:center;font-size:1.3rem;flex-shrink:0">\${item.img}</div>
      <div style="flex:1;min-width:0">
        <div style="font-size:0.85rem;font-family:'Rajdhani',sans-serif;font-weight:600;color:var(--text-main);white-space:nowrap;overflow:hidden;text-overflow:ellipsis">\${item.name}</div>
        <div style="font-size:0.75rem;color:var(--text-muted)">Qty: \${item.qty}</div>
      </div>
      <div style="font-family:'Orbitron',sans-serif;font-weight:700;font-size:0.85rem;color:var(--gold-light);flex-shrink:0">$\${(item.price*item.qty).toFixed(2)}</div>
    </div>
  \`).join('');
}

function placeOrder() {
  const fname = document.getElementById('co-fname')?.value;
  const email = document.getElementById('co-email')?.value;
  if(!fname || !email) { showToast('Please fill in required shipping fields'); return; }

  const overlay = document.getElementById('order-success');
  const orderNum = 'CTG-' + Date.now().toString(36).toUpperCase();
  document.getElementById('order-confirm-msg').textContent = \`Thank you, \${fname}! Your order has been received.\`;
  document.getElementById('order-number').textContent = 'Order #' + orderNum;
  overlay.style.display = 'flex';
  saveCart([]);
}

// Shipping cost update
document.querySelectorAll('input[name="shipping"]').forEach(r => {
  r.addEventListener('change', () => {
    const val = r.value;
    const ship = document.getElementById('co-shipping');
    if(ship) {
      if(val === 'priority')  { ship.textContent = '$8.99'; ship.style.color = 'var(--gold-light)'; }
      else if(val === 'overnight') { ship.textContent = '$24.99'; ship.style.color = 'var(--gold-light)'; }
      else { ship.textContent = 'FREE'; ship.style.color = 'var(--teal)'; }
    }
  });
});

document.addEventListener('DOMContentLoaded', renderCheckoutSummary);
</script>
</body></html>`
}

export default app
