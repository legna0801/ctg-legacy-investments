import { Hono } from 'hono'
import { serveStatic } from 'hono/cloudflare-workers'

const app = new Hono()

// Serve static files
app.use('/static/*', serveStatic({ root: './' }))

// ─── HOME PAGE ────────────────────────────────────────────────────────────────
app.get('/', (c) => {
  return c.html(homePage())
})

// ─── TCG CARDS PAGE ──────────────────────────────────────────────────────────
app.get('/tcg-cards', (c) => {
  return c.html(tcgCardsPage())
})

// ─── GRADED CARDS PAGE ───────────────────────────────────────────────────────
app.get('/graded-cards', (c) => {
  return c.html(gradedCardsPage())
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
    .nav-brand img { height: 52px; width: 52px; border-radius: 8px; object-fit: cover; }
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

    .nav-links { display: flex; align-items: center; gap: 0.25rem; }
    .nav-link {
      font-family: 'Rajdhani', sans-serif;
      font-weight: 600;
      font-size: 0.95rem;
      letter-spacing: 0.06em;
      text-transform: uppercase;
      color: var(--silver);
      text-decoration: none;
      padding: 0.5rem 1rem;
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

    /* Hamburger */
    .hamburger { display: none; flex-direction: column; gap: 5px; cursor: pointer; padding: 4px; }
    .hamburger span { width: 24px; height: 2px; background: var(--gold-light); border-radius: 2px; transition: all 0.3s; }
    .mobile-menu {
      display: none;
      position: fixed;
      top: 72px; left: 0; right: 0;
      background: rgba(5,8,24,0.97);
      border-bottom: 1px solid rgba(216,179,90,0.2);
      padding: 1rem 2rem 1.5rem;
      z-index: 999;
      flex-direction: column;
      gap: 0.5rem;
    }
    .mobile-menu.open { display: flex; }
    .mobile-menu .nav-link { padding: 0.75rem 1rem; border-bottom: 1px solid rgba(255,255,255,0.05); }

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
    .badge-graded  { background: rgba(216,179,90,0.25); color: #D8B35A; border: 1px solid rgba(216,179,90,0.4); }

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
    @media (max-width: 900px) {
      .nav-links { display: none; }
      .hamburger { display: flex; }
      .footer-inner { grid-template-columns: 1fr 1fr; gap: 2rem; }
    }
    @media (max-width: 600px) {
      .footer-inner { grid-template-columns: 1fr; }
      .footer-bottom { flex-direction: column; gap: 0.5rem; text-align: center; }
      .product-grid { grid-template-columns: repeat(auto-fill, minmax(160px, 1fr)); }
    }

    /* ── GRADED CARD SPECIAL ── */
    .grade-badge {
      font-family: 'Orbitron', sans-serif;
      font-weight: 900;
      font-size: 1.5rem;
      color: var(--gold-light);
      text-shadow: 0 0 20px rgba(216,179,90,0.5);
    }
    .grader-tag {
      display: inline-block;
      padding: 2px 8px;
      border-radius: 4px;
      font-family: 'Rajdhani', sans-serif;
      font-weight: 700;
      font-size: 0.7rem;
      letter-spacing: 0.1em;
      text-transform: uppercase;
    }
    .tag-psa  { background: rgba(31,91,255,0.25); color: #4d8cff; border: 1px solid rgba(31,91,255,0.4); }
    .tag-bgs  { background: rgba(216,179,90,0.25); color: var(--gold-light); border: 1px solid rgba(216,179,90,0.4); }
    .tag-cgc  { background: rgba(166,107,255,0.25); color: var(--purple); border: 1px solid rgba(166,107,255,0.4); }

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
      <img src="https://www.genspark.ai/api/files/s/OmpL2UqN" alt="CTG Logo" />
      <div class="nav-brand-text">
        <span class="nav-brand-ctg">CTG Legacy</span>
        <span class="nav-brand-sub">Investments, LLC</span>
      </div>
    </a>

    <div class="nav-links">
      <a href="/" class="nav-link ${active === 'home' ? 'active' : ''}">Home</a>
      <a href="/tcg-cards" class="nav-link ${active === 'tcg' ? 'active' : ''}">TCG Cards</a>
      <a href="/graded-cards" class="nav-link ${active === 'graded' ? 'active' : ''}">Graded Cards</a>
      <a href="/contact" class="nav-link ${active === 'contact' ? 'active' : ''}">Contact</a>
      <a href="/cart" class="nav-cart-btn" id="cart-nav-btn">
        <i class="fas fa-shopping-cart"></i>
        Cart
        <span class="cart-badge" id="cart-count-badge">0</span>
      </a>
    </div>

    <div class="hamburger" onclick="toggleMobileMenu()" style="display:none" id="hamburger">
      <span></span><span></span><span></span>
    </div>
  </div>
</nav>
<div class="mobile-menu" id="mobile-menu">
  <a href="/" class="nav-link">Home</a>
  <a href="/tcg-cards" class="nav-link">TCG Cards</a>
  <a href="/graded-cards" class="nav-link">Graded Cards</a>
  <a href="/contact" class="nav-link">Contact</a>
  <a href="/cart" class="nav-link" style="color:var(--gold-light)"><i class="fas fa-shopping-cart mr-2"></i> Cart (<span id="mobile-cart-count">0</span>)</a>
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
      <p class="footer-desc">Your premier source for investment-grade trading cards. We specialize in Pokémon, Yu-Gi-Oh!, and Magic: The Gathering — raw and professionally graded.</p>
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
        <li><a href="/graded-cards">Graded Cards</a></li>
        <li><a href="/tcg-cards">All Singles</a></li>
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
        <li style="color:var(--text-muted);font-size:0.875rem;display:flex;gap:0.5rem;align-items:flex-start;"><i class="fas fa-envelope" style="color:var(--gold-light);margin-top:2px;font-size:0.8rem;flex-shrink:0"></i><span>info@ctglegacy.com</span></li>
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
  // Responsive hamburger show/hide
  function handleResize() {
    const h = document.getElementById('hamburger');
    if(h) h.style.display = window.innerWidth <= 900 ? 'flex' : 'none';
  }
  window.addEventListener('resize', handleResize);
  document.addEventListener('DOMContentLoaded', function() {
    updateCartUI();
    handleResize();
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
  <section style="
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
      <div style="position:absolute;top:50%;left:50%;width:800px;height:800px;transform:translate(-50%,-50%);background:radial-gradient(ellipse,rgba(31,91,255,0.12) 0%,transparent 70%);border-radius:50%"></div>
      <div style="position:absolute;top:30%;right:10%;width:400px;height:400px;background:radial-gradient(ellipse,rgba(216,179,90,0.08) 0%,transparent 70%);border-radius:50%"></div>
      <div style="position:absolute;bottom:20%;left:10%;width:350px;height:350px;background:radial-gradient(ellipse,rgba(166,107,255,0.07) 0%,transparent 70%);border-radius:50%"></div>
      <!-- Diagonal light streaks -->
      <div style="position:absolute;top:0;left:20%;width:1px;height:100%;background:linear-gradient(180deg,transparent,rgba(76,203,255,0.15),transparent);transform:skewX(-15deg)"></div>
      <div style="position:absolute;top:0;right:30%;width:1px;height:100%;background:linear-gradient(180deg,transparent,rgba(216,179,90,0.1),transparent);transform:skewX(10deg)"></div>
    </div>

    <!-- Floating particles -->
    <div id="particles-container" style="position:absolute;inset:0;pointer-events:none;overflow:hidden"></div>

    <!-- Logo focal point -->
    <div style="position:relative;margin-bottom:2.5rem;animation:pulse-glow 3s ease-in-out infinite" class="holo-border" style="border-radius:24px">
      <img src="https://www.genspark.ai/api/files/s/OmpL2UqN" alt="CTG Legacy Investments" style="
        width: clamp(220px, 35vw, 380px);
        height: clamp(220px, 35vw, 380px);
        object-fit: cover;
        border-radius: 24px;
        display: block;
        filter: drop-shadow(0 0 40px rgba(216,179,90,0.35)) drop-shadow(0 0 80px rgba(76,203,255,0.2));
      " />
    </div>

    <!-- Brand title -->
    <div style="margin-bottom:0.5rem">
      <h1 style="
        font-family:'Orbitron',sans-serif;
        font-weight:900;
        font-size:clamp(2rem,6vw,4rem);
        letter-spacing:0.1em;
        text-transform:uppercase;
        line-height:1;
        margin-bottom:0.25rem;
      " class="shimmer-text">CTG Legacy Investments</h1>
      <div style="font-family:'Rajdhani',sans-serif;font-size:clamp(0.85rem,2vw,1.1rem);letter-spacing:0.3em;text-transform:uppercase;color:var(--cyan);margin-top:0.5rem">
        LLC &nbsp;|&nbsp; Est. 2026
      </div>
    </div>

    <!-- Tagline -->
    <p style="max-width:580px;font-size:clamp(0.95rem,2vw,1.15rem);color:var(--text-muted);line-height:1.7;margin:1.5rem auto 2.5rem;font-weight:300">
      Your premier destination for <span style="color:var(--gold-light);font-weight:600">investment-grade trading cards</span>. Raw singles & professionally graded collectibles — Pokémon, Yu-Gi-Oh!, and Magic: The Gathering.
    </p>

    <!-- CTA Buttons -->
    <div style="display:flex;flex-wrap:wrap;gap:1rem;justify-content:center;margin-bottom:4rem">
      <a href="/tcg-cards" class="btn-primary" style="text-decoration:none;font-size:1.05rem;padding:1rem 2.5rem">
        <i class="fas fa-layer-group" style="margin-right:0.5rem"></i> Shop All Cards
      </a>
      <a href="/graded-cards" class="btn-secondary" style="font-size:1.05rem;padding:1rem 2.5rem">
        <i class="fas fa-award" style="margin-right:0.5rem"></i> Graded Collection
      </a>
    </div>

    <!-- Scroll indicator -->
    <div style="position:absolute;bottom:2rem;left:50%;transform:translateX(-50%);display:flex;flex-direction:column;align-items:center;gap:0.4rem;opacity:0.5">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.7rem;letter-spacing:0.2em;text-transform:uppercase;color:var(--text-muted)">Scroll</span>
      <div style="width:1px;height:40px;background:linear-gradient(180deg,rgba(216,179,90,0.6),transparent)"></div>
    </div>
  </section>

  <!-- STATS STRIP -->
  <section style="background:linear-gradient(135deg,rgba(14,18,48,0.9),rgba(10,13,31,0.95));border-top:1px solid rgba(216,179,90,0.15);border-bottom:1px solid rgba(216,179,90,0.15);padding:2rem 2rem">
    <div class="container" style="display:grid;grid-template-columns:repeat(4,1fr);gap:1rem;text-align:center">
      <div style="padding:1rem">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:2rem;color:var(--gold-light)">500+</div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);margin-top:0.25rem">Cards In Stock</div>
      </div>
      <div style="padding:1rem;border-left:1px solid rgba(216,179,90,0.1)">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:2rem;color:var(--cyan)">3</div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);margin-top:0.25rem">TCG Games</div>
      </div>
      <div style="padding:1rem;border-left:1px solid rgba(216,179,90,0.1)">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:2rem;color:var(--purple)">100+</div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);margin-top:0.25rem">Graded Slabs</div>
      </div>
      <div style="padding:1rem;border-left:1px solid rgba(216,179,90,0.1)">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:2rem;color:var(--teal)">PSA/BGS/CGC</div>
        <div style="font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted);margin-top:0.25rem">Graders</div>
      </div>
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
          <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6">Blue-Eyes, Dark Magician, Ghost Rares, collector tins & investment singles</p>
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

      <!-- Graded -->
      <a href="/graded-cards" style="text-decoration:none">
        <div style="
          background:linear-gradient(135deg,rgba(216,179,90,0.06),rgba(14,18,48,0.9));
          border:1px solid rgba(216,179,90,0.2);
          border-radius:20px;
          padding:2.5rem 2rem;
          text-align:center;
          transition:all 0.3s;
          cursor:pointer;
        " onmouseover="this.style.transform='translateY(-8px)';this.style.borderColor='rgba(216,179,90,0.5)';this.style.boxShadow='0 20px 50px rgba(0,0,0,0.4),0 0 30px rgba(216,179,90,0.1)'" onmouseout="this.style.transform='';this.style.borderColor='rgba(216,179,90,0.2)';this.style.boxShadow=''">
          <div style="font-size:4rem;margin-bottom:1rem">🏆</div>
          <h3 style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;letter-spacing:0.08em;color:var(--gold-light);margin-bottom:0.5rem">GRADED SLABS</h3>
          <p style="font-size:0.85rem;color:var(--text-muted);line-height:1.6">PSA, BGS, & CGC graded investment-grade slabs across all TCGs</p>
          <div style="margin-top:1.25rem;font-family:'Rajdhani',sans-serif;font-size:0.8rem;letter-spacing:0.15em;text-transform:uppercase;color:var(--gold-light)">View Slabs →</div>
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
        {icon:'fa-shield-alt', color:'var(--gold-light)', title:'Authentic Only', desc:'Every card is verified for authenticity. No fakes, no reprints — only genuine collectibles.'},
        {icon:'fa-box-open', color:'var(--cyan)', title:'Secure Packaging', desc:'Cards are packed with toploaders, sleeves, and bubble mailers for maximum protection.'},
        {icon:'fa-shipping-fast', color:'var(--purple)', title:'Fast Shipping', desc:'Orders ship within 1-2 business days. Tracking provided on every order.'},
        {icon:'fa-award', color:'var(--teal)', title:'Investment Grade', desc:'Curated selection of high-value, appreciating cards for serious collectors & investors.'},
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

  const gameBadge = { pokemon:'badge-pokemon', yugioh:'badge-yugioh', mtg:'badge-mtg' };
  const gameLabel = { pokemon:'Pokémon', yugioh:'Yu-Gi-Oh!', mtg:'MTG' };

  function renderFeatured() {
    const grid = document.getElementById('featured-grid');
    if(!grid) return;
    grid.innerHTML = featuredCards.map(card => \`
      <div class="product-card">
        <div class="product-card-img" style="font-size:3.5rem">
          <span>\${card.emoji}</span>
          \${card.holo ? '<span class="holo-badge">✦ HOLO</span>' : ''}
          <span class="game-badge \${gameBadge[card.game]}">\${gameLabel[card.game]}</span>
        </div>
        <div class="product-info">
          <div class="product-name">\${card.name}</div>
          <div class="product-set">\${card.set}</div>
          <div style="display:flex;justify-content:space-between;align-items:flex-end">
            <div>
              <div class="product-price">$\${card.price.toFixed(2)}</div>
              <div class="product-condition">Condition: \${card.condition}</div>
            </div>
          </div>
          <button class="btn-add-cart" data-id="\${card.id}" onclick="addToCart('\${card.id}','\${card.name}',\${card.price},'\${card.game}','\${card.emoji}')">
            <i class="fas fa-cart-plus"></i> Add to Cart
          </button>
        </div>
      </div>
    \`).join('');
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

// ─── TCG CARDS PAGE ──────────────────────────────────────────────────────────
function tcgCardsPage() {
  const cards = [
    // POKEMON
    { id:'p1',  name:'Charizard VMAX Rainbow', set:'Champions Path', price:189.99, game:'pokemon', condition:'NM', emoji:'🔥', holo:true, rarity:'Secret Rare' },
    { id:'p2',  name:'Pikachu V FULL ART',     set:'Vivid Voltage',    price:45.99,  game:'pokemon', condition:'NM', emoji:'⚡', holo:true, rarity:'Ultra Rare' },
    { id:'p3',  name:'Umbreon VMAX Alt Art',   set:'Evolving Skies',   price:299.00, game:'pokemon', condition:'NM', emoji:'🌙', holo:true, rarity:'Alt Art' },
    { id:'p4',  name:'Blastoise Base Set',     set:'Base Set 2',       price:79.99,  game:'pokemon', condition:'LP', emoji:'🌊', holo:false, rarity:'Holo Rare' },
    { id:'p5',  name:'Mewtwo EX Full Art',     set:'Next Destinies',   price:110.00, game:'pokemon', condition:'NM', emoji:'🔮', holo:true, rarity:'Full Art' },
    { id:'p6',  name:'Rayquaza VMAX Alt',      set:'Evolving Skies',   price:320.00, game:'pokemon', condition:'NM', emoji:'🌩️', holo:true, rarity:'Alt Art' },
    // YUGIOH
    { id:'y1',  name:'Blue-Eyes White Dragon 1st Ed', set:'Legend of Blue Eyes', price:245.00, game:'yugioh', condition:'LP', emoji:'🐉', holo:false, rarity:'Ultra Rare' },
    { id:'y2',  name:'Dark Magician Girl',     set:'Magical Blast',    price:85.00,  game:'yugioh', condition:'NM', emoji:'✨', holo:true, rarity:'Ghost Rare' },
    { id:'y3',  name:'Exodia The Forbidden',   set:'LOB 1st Ed',       price:550.00, game:'yugioh', condition:'VG', emoji:'👁️', holo:false, rarity:'Ultra Rare' },
    { id:'y4',  name:'Red-Eyes Black Dragon',  set:'Metal Raiders',    price:130.00, game:'yugioh', condition:'NM', emoji:'🔴', holo:false, rarity:'Ultra Rare' },
    { id:'y5',  name:'Pot of Greed',           set:'LOB 1st Ed',       price:75.00,  game:'yugioh', condition:'LP', emoji:'🏺', holo:false, rarity:'Rare' },
    { id:'y6',  name:'Dark Hole',              set:'LOB 1st Ed',       price:60.00,  game:'yugioh', condition:'NM', emoji:'🌑', holo:false, rarity:'Rare' },
    // MTG
    { id:'m1',  name:'Black Lotus',            set:'Alpha Edition',    price:999.99, game:'mtg',    condition:'HP', emoji:'🌸', holo:false, rarity:'Power 9' },
    { id:'m2',  name:'Mox Sapphire',           set:'Beta Edition',     price:750.00, game:'mtg',    condition:'LP', emoji:'💎', holo:false, rarity:'Power 9' },
    { id:'m3',  name:'Force of Will',          set:'Alliances',        price:115.00, game:'mtg',    condition:'NM', emoji:'💫', holo:false, rarity:'Uncommon' },
    { id:'m4',  name:'Underground Sea',        set:'Revised',          price:380.00, game:'mtg',    condition:'LP', emoji:'🌊', holo:false, rarity:'Dual Land' },
    { id:'m5',  name:'Tarmogoyf',              set:'Future Sight',     price:55.00,  game:'mtg',    condition:'NM', emoji:'🌿', holo:false, rarity:'Rare' },
    { id:'m6',  name:'Jace, the Mind Sculptor',set:'Worldwake',        price:90.00,  game:'mtg',    condition:'NM', emoji:'🔵', holo:false, rarity:'Mythic Rare' },
  ]

  const cardsJson = JSON.stringify(cards)

  return `${getHead('TCG Cards')}
<body>
${getNav('tcg')}
<div class="page-wrap">

  <!-- PAGE HEADER -->
  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">Singles & Collectibles</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">TCG Card Singles</h1>
      <div class="gold-line" style="margin:0.75rem auto 0.75rem"></div>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:500px;margin:0 auto">Browse our curated selection of Pokémon, Yu-Gi-Oh!, and Magic: The Gathering singles.</p>
    </div>
  </div>

  <div class="container section">

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <span class="filter-label"><i class="fas fa-filter" style="margin-right:0.35rem"></i>Filter:</span>

      <select class="filter-select" id="game-filter" onchange="applyFilters()">
        <option value="all">All Games</option>
        <option value="pokemon">⚡ Pokémon</option>
        <option value="yugioh">👁️ Yu-Gi-Oh!</option>
        <option value="mtg">🔮 Magic: The Gathering</option>
      </select>

      <select class="filter-select" id="condition-filter" onchange="applyFilters()">
        <option value="all">All Conditions</option>
        <option value="NM">NM (Near Mint)</option>
        <option value="LP">LP (Lightly Played)</option>
        <option value="MP">MP (Moderately Played)</option>
        <option value="VG">VG (Very Good)</option>
        <option value="HP">HP (Heavily Played)</option>
      </select>

      <select class="filter-select" id="sort-filter" onchange="applyFilters()">
        <option value="default">Sort By</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
        <option value="name">Name A–Z</option>
      </select>

      <input type="text" class="filter-input" id="search-input" placeholder="🔍  Search cards..." oninput="applyFilters()" style="flex:1;min-width:180px">

      <div style="display:flex;gap:0.5rem;flex-wrap:wrap">
        <button class="filter-btn active" id="btn-all"      onclick="setGame('all')">All</button>
        <button class="filter-btn"        id="btn-pokemon"  onclick="setGame('pokemon')" style="color:#FFD700;border-color:rgba(255,199,0,0.3)">⚡ Pokémon</button>
        <button class="filter-btn"        id="btn-yugioh"   onclick="setGame('yugioh')"  style="color:var(--teal);border-color:rgba(70,199,194,0.3)">👁️ YGO</button>
        <button class="filter-btn"        id="btn-mtg"      onclick="setGame('mtg')"     style="color:var(--purple);border-color:rgba(166,107,255,0.3)">🔮 MTG</button>
      </div>
    </div>

    <!-- RESULTS COUNT -->
    <div style="margin-bottom:1.25rem;display:flex;align-items:center;justify-content:space-between;flex-wrap:wrap;gap:0.5rem">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">
        Showing <span id="results-count" style="color:var(--gold-light);font-weight:700">0</span> cards
      </span>
      <div style="display:flex;gap:0.75rem">
        <button onclick="setView('grid')" id="view-grid" style="background:rgba(216,179,90,0.15);border:1px solid rgba(216,179,90,0.3);border-radius:6px;padding:6px 10px;cursor:pointer;color:var(--gold-light)"><i class="fas fa-th"></i></button>
        <button onclick="setView('list')" id="view-list" style="background:transparent;border:1px solid rgba(255,255,255,0.1);border-radius:6px;padding:6px 10px;cursor:pointer;color:var(--text-muted)"><i class="fas fa-list"></i></button>
      </div>
    </div>

    <!-- PRODUCT GRID -->
    <div class="product-grid" id="tcg-grid"></div>

    <!-- NO RESULTS -->
    <div id="no-results" style="display:none;text-align:center;padding:4rem 2rem;color:var(--text-muted)">
      <i class="fas fa-search" style="font-size:3rem;margin-bottom:1rem;opacity:0.3"></i>
      <p style="font-family:'Rajdhani',sans-serif;font-size:1rem;letter-spacing:0.1em">No cards match your filters. Try adjusting your search.</p>
    </div>

  </div>
</div>

${getFooter()}
${getCartScript()}

<script>
const ALL_CARDS = ${cardsJson};
const gameBadge = { pokemon:'badge-pokemon', yugioh:'badge-yugioh', mtg:'badge-mtg' };
const gameLabel = { pokemon:'Pokémon', yugioh:'Yu-Gi-Oh!', mtg:'MTG' };
let currentView = 'grid';

function setGame(g) {
  document.getElementById('game-filter').value = g;
  ['all','pokemon','yugioh','mtg'].forEach(id => {
    const btn = document.getElementById('btn-'+id);
    if(btn) btn.classList.toggle('active', id === g);
  });
  applyFilters();
}

function setView(v) {
  currentView = v;
  const grid = document.getElementById('tcg-grid');
  if(v === 'list') {
    grid.style.gridTemplateColumns = '1fr';
    document.getElementById('view-grid').style.background = 'transparent';
    document.getElementById('view-list').style.background = 'rgba(216,179,90,0.15)';
  } else {
    grid.style.gridTemplateColumns = '';
    document.getElementById('view-grid').style.background = 'rgba(216,179,90,0.15)';
    document.getElementById('view-list').style.background = 'transparent';
  }
}

function applyFilters() {
  const game = document.getElementById('game-filter').value;
  const cond = document.getElementById('condition-filter').value;
  const sort = document.getElementById('sort-filter').value;
  const search = document.getElementById('search-input').value.toLowerCase();

  let filtered = ALL_CARDS.filter(c => {
    if(game !== 'all' && c.game !== game) return false;
    if(cond !== 'all' && c.condition !== cond) return false;
    if(search && !c.name.toLowerCase().includes(search) && !c.set.toLowerCase().includes(search)) return false;
    return true;
  });

  if(sort === 'price-asc')  filtered.sort((a,b) => a.price - b.price);
  if(sort === 'price-desc') filtered.sort((a,b) => b.price - a.price);
  if(sort === 'name')       filtered.sort((a,b) => a.name.localeCompare(b.name));

  document.getElementById('results-count').textContent = filtered.length;

  const grid = document.getElementById('tcg-grid');
  const noRes = document.getElementById('no-results');
  if(filtered.length === 0) { grid.innerHTML=''; noRes.style.display='block'; return; }
  noRes.style.display = 'none';

  grid.innerHTML = filtered.map(card => \`
    <div class="product-card">
      <div class="product-card-img" style="font-size:3.5rem">
        <span>\${card.emoji}</span>
        \${card.holo ? '<span class="holo-badge">✦ HOLO</span>' : ''}
        <span class="game-badge \${gameBadge[card.game]}">\${gameLabel[card.game]}</span>
      </div>
      <div class="product-info">
        <div class="product-name">\${card.name}</div>
        <div class="product-set">\${card.set} · \${card.rarity}</div>
        <div style="display:flex;justify-content:space-between;align-items:flex-end;margin-top:0.5rem">
          <div>
            <div class="product-price">$\${card.price.toFixed(2)}</div>
            <div class="product-condition">Condition: \${card.condition}</div>
          </div>
        </div>
        <button class="btn-add-cart" data-id="\${card.id}" onclick="addToCart('\${card.id}','\${card.name}',\${card.price},'\${card.game}','\${card.emoji}')">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  \`).join('');
}

// Pre-select game from URL param
const params = new URLSearchParams(window.location.search);
const gameParam = params.get('game');
if(gameParam) setGame(gameParam);
else applyFilters();
</script>
</body></html>`
}

// ─── GRADED CARDS PAGE ───────────────────────────────────────────────────────
function gradedCardsPage() {
  const graded = [
    { id:'g1',  name:'Charizard Holo 1st Ed', set:'Base Set',         game:'pokemon', emoji:'🔥', grade:9,  grader:'PSA', price:12500, pop:120 },
    { id:'g2',  name:'Pikachu Illustrator',   set:'CoroCoro Promo',   game:'pokemon', emoji:'⚡', grade:7,  grader:'PSA', price:24999, pop:26  },
    { id:'g3',  name:'Blastoise Holo',        set:'Base Set 1st Ed',  game:'pokemon', emoji:'🌊', grade:8,  grader:'BGS', price:3200,  pop:88  },
    { id:'g4',  name:'Umbreon Gold Star',     set:'POP Series 5',     game:'pokemon', emoji:'🌙', grade:10, grader:'PSA', price:18000, pop:14  },
    { id:'g5',  name:'Blue-Eyes White Dragon',set:'LOB 1st Edition',  game:'yugioh',  emoji:'🐉', grade:8,  grader:'CGC', price:4500,  pop:55  },
    { id:'g6',  name:'Dark Magician',         set:'LOB 1st Edition',  game:'yugioh',  emoji:'✨', grade:9,  grader:'PSA', price:2200,  pop:73  },
    { id:'g7',  name:'Exodia the Forbidden',  set:'LOB 1st Edition',  game:'yugioh',  emoji:'👁️', grade:7,  grader:'BGS', price:3800,  pop:42  },
    { id:'g8',  name:'Black Lotus',           set:'Alpha Edition',    game:'mtg',     emoji:'🌸', grade:4,  grader:'PSA', price:75000, pop:8   },
    { id:'g9',  name:'Underground Sea',       set:'Alpha Edition',    game:'mtg',     emoji:'🌊', grade:8,  grader:'CGC', price:9500,  pop:34  },
    { id:'g10', name:'Mox Emerald',           set:'Beta Edition',     game:'mtg',     emoji:'💚', grade:6,  grader:'PSA', price:8800,  pop:19  },
  ]

  const gradedJson = JSON.stringify(graded)

  return `${getHead('Graded Cards')}
<body>
${getNav('graded')}
<div class="page-wrap">

  <!-- BANNER -->
  <div class="page-banner">
    <div style="position:relative;z-index:1">
      <div class="section-sub">PSA · BGS · CGC</div>
      <h1 class="section-title" style="font-size:clamp(1.8rem,4vw,2.8rem);margin-top:0.25rem">Graded Card Collection</h1>
      <div class="gold-line" style="margin:0.75rem auto 0.75rem"></div>
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:500px;margin:0 auto">Investment-grade slabs professionally graded by PSA, BGS, and CGC.</p>
    </div>
  </div>

  <div class="container section">

    <!-- GRADE EXPLAINED -->
    <div style="display:grid;grid-template-columns:repeat(auto-fit,minmax(200px,1fr));gap:1rem;margin-bottom:2.5rem">
      <div style="background:linear-gradient(135deg,rgba(31,91,255,0.12),rgba(14,18,48,0.9));border:1px solid rgba(31,91,255,0.25);border-radius:14px;padding:1.5rem;text-align:center">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.4rem;color:#4d8cff;margin-bottom:0.25rem">PSA</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Professional Sports Authenticator — Gold standard, 1–10 scale</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(216,179,90,0.12),rgba(14,18,48,0.9));border:1px solid rgba(216,179,90,0.25);border-radius:14px;padding:1.5rem;text-align:center">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.4rem;color:var(--gold-light);margin-bottom:0.25rem">BGS</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Beckett Grading Services — Sub-grades, 1–10 scale</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(166,107,255,0.12),rgba(14,18,48,0.9));border:1px solid rgba(166,107,255,0.25);border-radius:14px;padding:1.5rem;text-align:center">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.4rem;color:var(--purple);margin-bottom:0.25rem">CGC</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Certified Guaranty Company — Registry, 1–10 scale</div>
      </div>
      <div style="background:linear-gradient(135deg,rgba(70,199,194,0.12),rgba(14,18,48,0.9));border:1px solid rgba(70,199,194,0.25);border-radius:14px;padding:1.5rem;text-align:center">
        <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.4rem;color:var(--teal);margin-bottom:0.25rem">Why Grade?</div>
        <div style="font-size:0.8rem;color:var(--text-muted)">Authentication + condition lock = investment certainty</div>
      </div>
    </div>

    <!-- FILTER BAR -->
    <div class="filter-bar">
      <span class="filter-label"><i class="fas fa-filter" style="margin-right:0.35rem"></i>Filter:</span>
      <select class="filter-select" id="graded-game" onchange="filterGraded()">
        <option value="all">All Games</option>
        <option value="pokemon">Pokémon</option>
        <option value="yugioh">Yu-Gi-Oh!</option>
        <option value="mtg">Magic: The Gathering</option>
      </select>
      <select class="filter-select" id="graded-grader" onchange="filterGraded()">
        <option value="all">All Graders</option>
        <option value="PSA">PSA</option>
        <option value="BGS">BGS</option>
        <option value="CGC">CGC</option>
      </select>
      <select class="filter-select" id="graded-sort" onchange="filterGraded()">
        <option value="default">Sort By</option>
        <option value="grade-desc">Grade: High → Low</option>
        <option value="price-asc">Price: Low → High</option>
        <option value="price-desc">Price: High → Low</option>
      </select>
      <input type="text" class="filter-input" id="graded-search" placeholder="🔍  Search slabs..." oninput="filterGraded()" style="flex:1;min-width:160px">
    </div>

    <!-- COUNT -->
    <div style="margin-bottom:1.25rem">
      <span style="font-family:'Rajdhani',sans-serif;font-size:0.85rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted)">
        Showing <span id="graded-count" style="color:var(--gold-light);font-weight:700">0</span> slabs
      </span>
    </div>

    <!-- GRADED GRID -->
    <div style="display:grid;grid-template-columns:repeat(auto-fill,minmax(280px,1fr));gap:1.75rem" id="graded-grid"></div>
    <div id="graded-no-results" style="display:none;text-align:center;padding:4rem;color:var(--text-muted)">
      <i class="fas fa-search" style="font-size:3rem;opacity:0.3;margin-bottom:1rem"></i>
      <p style="font-family:'Rajdhani',sans-serif;letter-spacing:0.1em">No slabs match your filters.</p>
    </div>

  </div>
</div>

${getFooter()}
${getCartScript()}

<script>
const GRADED_CARDS = ${gradedJson};
const graderClass = { PSA:'tag-psa', BGS:'tag-bgs', CGC:'tag-cgc' };
const graderColor = { PSA:'#4d8cff', BGS:'#D8B35A', CGC:'#A66BFF' };
const gameLabel   = { pokemon:'Pokémon', yugioh:'Yu-Gi-Oh!', mtg:'MTG' };
const gameBadge   = { pokemon:'badge-pokemon', yugioh:'badge-yugioh', mtg:'badge-mtg' };

function gradeColor(g) {
  if(g >= 10) return '#FFD700';
  if(g >= 9)  return '#4d8cff';
  if(g >= 8)  return '#46C7C2';
  if(g >= 7)  return '#A66BFF';
  return '#D84A3A';
}

function filterGraded() {
  const game   = document.getElementById('graded-game').value;
  const grader = document.getElementById('graded-grader').value;
  const sort   = document.getElementById('graded-sort').value;
  const search = document.getElementById('graded-search').value.toLowerCase();

  let items = GRADED_CARDS.filter(c => {
    if(game   !== 'all' && c.game   !== game)   return false;
    if(grader !== 'all' && c.grader !== grader) return false;
    if(search && !c.name.toLowerCase().includes(search) && !c.set.toLowerCase().includes(search)) return false;
    return true;
  });

  if(sort === 'grade-desc')  items.sort((a,b) => b.grade - a.grade);
  if(sort === 'price-asc')   items.sort((a,b) => a.price - b.price);
  if(sort === 'price-desc')  items.sort((a,b) => b.price - a.price);

  document.getElementById('graded-count').textContent = items.length;
  const grid  = document.getElementById('graded-grid');
  const noRes = document.getElementById('graded-no-results');
  if(items.length === 0) { grid.innerHTML=''; noRes.style.display='block'; return; }
  noRes.style.display='none';

  grid.innerHTML = items.map(c => \`
    <div class="product-card" style="border-radius:18px;overflow:hidden">
      <!-- Top slab frame -->
      <div style="background:linear-gradient(135deg,rgba(14,18,48,0.95),rgba(5,8,24,0.98));padding:1.75rem 1.5rem;text-align:center;border-bottom:1px solid rgba(216,179,90,0.15);position:relative">
        <div style="position:absolute;top:12px;left:12px">
          <span class="grader-tag \${graderClass[c.grader]}">\${c.grader}</span>
        </div>
        <div style="position:absolute;top:12px;right:12px">
          <span class="game-badge \${gameBadge[c.game]}" style="position:relative;inset:auto">\${gameLabel[c.game]}</span>
        </div>
        <div style="font-size:3rem;margin:0.5rem 0 0.75rem">\${c.emoji}</div>
        <!-- Grade circle -->
        <div style="
          width:72px;height:72px;border-radius:50%;
          background:conic-gradient(\${graderColor[c.grader]} \${c.grade*10}%, rgba(255,255,255,0.05) 0);
          display:flex;align-items:center;justify-content:center;
          margin:0 auto 0.75rem;
          position:relative;
          box-shadow:0 0 20px \${graderColor[c.grader]}40;
        ">
          <div style="width:58px;height:58px;border-radius:50%;background:var(--bg-deep);display:flex;flex-direction:column;align-items:center;justify-content:center">
            <span class="grade-badge" style="font-size:1.3rem;color:\${gradeColor(c.grade)}">\${c.grade}</span>
          </div>
        </div>
        <div style="font-size:0.65rem;font-family:'Rajdhani',sans-serif;letter-spacing:0.15em;text-transform:uppercase;color:var(--text-muted)">POP: \${c.pop} known</div>
      </div>
      <!-- Card info -->
      <div class="product-info">
        <div class="product-name" style="font-size:1.05rem">\${c.name}</div>
        <div class="product-set" style="margin-bottom:0.85rem">\${c.set}</div>
        <div style="display:flex;justify-content:space-between;align-items:center;background:rgba(216,179,90,0.05);border:1px solid rgba(216,179,90,0.1);border-radius:8px;padding:0.6rem 0.85rem;margin-bottom:0.85rem">
          <div>
            <div style="font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:2px">Asking Price</div>
            <div class="product-price">$\${c.price.toLocaleString()}</div>
          </div>
          <div style="text-align:right">
            <div style="font-size:0.65rem;letter-spacing:0.1em;text-transform:uppercase;color:var(--text-muted);margin-bottom:2px">Grade</div>
            <div style="font-family:'Orbitron',sans-serif;font-weight:800;font-size:1.1rem;color:\${gradeColor(c.grade)}">\${c.grader} \${c.grade}</div>
          </div>
        </div>
        <button class="btn-add-cart" data-id="\${c.id}" onclick="addToCart('\${c.id}','\${c.name} (\${c.grader} \${c.grade})',\${c.price},'\${c.game}','\${c.emoji}')">
          <i class="fas fa-cart-plus"></i> Add to Cart
        </button>
      </div>
    </div>
  \`).join('');
}

filterGraded();
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
      <p style="color:var(--text-muted);font-size:0.95rem;max-width:500px;margin:0 auto">Questions about a card? Looking for a specific single? Submit an inquiry and we&#39;ll get back to you within 24 hours.</p>
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
              <option value="graded">Graded Card Inquiry</option>
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
                <div style="color:var(--text-main);font-size:0.9rem">info@ctglegacy.com</div>
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
              {q:'Are your graded cards authentic?', a:'100%. All slabs are from PSA, BGS, or CGC — no counterfeits.'},
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

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: {'Content-Type':'application/json'},
      body: JSON.stringify(data)
    });
    const json = await res.json();
    if(json.success) {
      form.style.display = 'none';
      document.getElementById('success-text').textContent = json.message;
      document.getElementById('success-msg').style.display = 'block';
    }
  } catch(err) {
    // Fallback for demo
    form.style.display = 'none';
    document.getElementById('success-msg').style.display = 'block';
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
