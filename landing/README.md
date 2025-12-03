# MASKING - Landing Pages

Professional landing pages for the MASKING social survival simulator game.

## Files

- **index.html** - Redirect to index_pro.html
- **index_pro.html** - Main sales/marketing landing page (703 lines)
- **index_tech.html** - Technical specifications page (891 lines)
- **assets/logo/** - 5 SVG logo variations
- **copy/landing-copy.md** - Complete copy strategy and content (305 lines)

## Quick Start

Open in browser:
```bash
cd /home/luis/projects/089-juego-3d/landing
# Open any modern browser to index.html
```

Or serve with Python:
```bash
python3 -m http.server 8080
# Visit http://localhost:8080
```

## URLs Structure

- `/` → Redirects to index_pro.html
- `/index_pro.html` → Sales landing (for players/general audience)
- `/index_tech.html` → Technical specs (for developers/contributors)

## Assets

### Logos (SVG)
- `logo-icon.svg` (1.8 KB) - Icon only, dual-mask concept
- `logo-full.svg` (2.0 KB) - Full logo with text and battery bar
- `logo-horizontal.svg` (1.4 KB) - Horizontal layout variant
- `logo-monochrome.svg` (1.2 KB) - White-only for dark/light backgrounds
- `favicon.svg` (1.2 KB) - Simplified for favicon/small sizes

### Color Palette
- **Anxiety**: #f43f5e (pink-red) → #be123c (dark red)
- **Calm/Energy**: #34d399 (green) → #10b981 (emerald)
- **Dark UI**: #0f172a (slate-950) → #1e293b (slate-900)
- **Accents**: #94a3b8 (slate-400), #3b82f6 (blue-tech)

## Technology

- **Tailwind CSS** (Play CDN) - No build step required
- **Vanilla JavaScript** - Scroll animations, terminal typing effect
- **Responsive** - Mobile-first design
- **Accessible** - Semantic HTML, keyboard navigation
- **SEO Ready** - Meta tags, structured content

## Features

### index_pro.html (Sales)
- Hero with terminal typing animation
- Problem/Solution sections
- 9-level breakdown cards
- Testimonials/use cases
- Interactive FAQ
- Scroll-triggered fade-in animations
- Gradient backgrounds with particle effects

### index_tech.html (Technical)
- Complete tech stack table
- Honest gap analysis (Promised vs Implemented)
- Architecture diagrams (code blocks)
- Installation guide
- Development roadmap
- Performance metrics
- Browser compatibility matrix

## Deployment

### Standalone
Simply copy the entire `landing/` folder to any web server. No build process needed.

### ProjectHub Integration
The landing is self-contained and can be linked from:
- https://hub.guanacolabs.com/p/089-juego-3d/

### CDN/Hosting Options
- GitHub Pages
- Netlify
- Vercel
- Any static hosting

## Development

No build step required! Edit HTML directly.

### Testing Locally
```bash
# Option 1: Python
python3 -m http.server 8080

# Option 2: Node.js
npx serve

# Option 3: VS Code Live Server extension
```

### Customization

**Change colors:**
Edit Tailwind config in `<script>` tag (both HTML files).

**Update copy:**
Edit text directly in HTML or reference `copy/landing-copy.md` for strategy.

**Add sections:**
Follow existing pattern: section → max-w-6xl container → grid/flex layout.

## Analytics (Future)

To add analytics, insert before closing `</head>`:
```html
<!-- Google Analytics -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>
```

## License

Part of the MASKING project (089-juego-3d).

## Contact

- Project: MASKING - Social Survival Simulator
- Tech: React Three Fiber, TypeScript, Zustand
- Status: 9/9 levels complete, 95% feature-complete

---

Generated 2025-11-27 by Claude Code
