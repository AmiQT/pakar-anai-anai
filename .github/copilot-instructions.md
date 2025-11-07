# KME Pest Control Website - AI Coding Agent Instructions

> **Response Style**: Always respond in **Bahasa Melayu**. Use Gen Z tone and emoji for full emotional respond. Break task into few chunk of steps for heavy request. 💯

## 🎯 Project Overview

Website statik untuk KME Pest Control dengan custom Node.js dev server. Content dwibahasa (Bahasa Melayu primary, sikit English). Built dengan vanilla HTML/CSS/JS guna modular architecture.

Respond with Malay language with gen z vibe tone.

## 🏗️ Architecture & Key Patterns

### Asset Structure (PENTING GILA - Ikut Hierarchy Ni! 🔥)
```
assets/
  css/
    base.css          # 1. Foundation: variables, resets, typography
    main.css          # 2. Layout: containers, grids, sections
    components/       # 3. Reusable: header, footer, buttons, cards
    pages/            # 4. Page-specific: index.css, contact.css, etc.
  js/
    main.js           # Core utilities, global config, initialization
    modules/          # Reusable ES6 modules: forms.js, popup.js, navigation.js
    pages/            # Page-specific: about.js, contact.js, services.js
    utils/            # Pure helpers: helpers.js, scroll-snap.js
    animations-phase1.js, animations-phase2.js, animations-phase3.js
    greeting-popup.js, carousel.js, testimonials.js, gallery.js
```

**CSS Load Order**: `base.css` → `main.css` → component CSS → page CSS. Jangan sekali-kali override base variables dalam page files! 🚫

**JS Module Pattern**: Guna ES6 export/import dalam `modules/` dan `utils/`. Standalone scripts (greeting-popup.js, carousel.js) pakai global classes dengan window export untuk backward compatibility.

### Custom Dev Server (`server.js`) 🚀
- **Clean URLs**: `/about` → `/pages/about.html` (defined dalam `routes` object)
- **Start**: `npm start` (auto buka browser kat localhost:3000)
- **Tambah Routes**: Update `routes` object dalam server.js untuk page baru
- **Static Serving**: Auto-handle MIME types, CORS, caching headers
- **No Live Reload**: Kena manual refresh (Ctrl+F5 untuk hard refresh)

**Deploy**: Dah ready untuk static hosting. `vercel.json` dah configured dengan rewrites yang match server.js routes. ✅

## 🎨 Design System (Guna Yang Dah Ada, Jangan Create Baru! 💅)

### CSS Variables (dari base.css)
```css
/* Use these for consistency */
var(--primary-orange)   /* #f58220 - Brand color, CTAs */
var(--primary-blue)     /* #6ec1e4 - Icons, accents */
var(--header-navy)      /* #1e3a8a - Header background */
var(--gray-900)         /* #0F172A - Dark text */
var(--gray-500)         /* #64748B - Light text, disabled */

/* Spacing scale: 4, 8, 12, 16, 20, 24, 32, 40, 48, 64, 80 */
var(--space-4) through var(--space-20)

/* Typography scale */
var(--font-heading)     /* Poppins - Headings */
var(--font-body)        /* Open Sans - Body text */
```

### Utility Classes (Lebih Baik Guna Ni Daripada Custom CSS! ⚡)
```html
<!-- Typography -->
<h1 class="heading-display">  <!-- 3.5rem hero -->
<h2 class="heading-1">        <!-- 2.5rem page titles -->
<p class="text-lead">         <!-- 1.25rem intro text -->
<p class="text-body">         <!-- 1rem standard -->

<!-- Containers -->
<div class="container">       <!-- 1200px max-width -->
<section class="section-padding"> <!-- 80px top/bottom -->

<!-- Badges -->
<span class="badge badge-success">Licensed</span>
```

### WhatsApp Integration Pattern 💬
**Wajib guna**: `href="https://wsap.to/kmepestcontrol"` (BUKAN wa.me!)
**Button classes**: `.btn-whatsapp-primary` (green gradient) atau `.btn-whatsapp-secondary` (solid green)

## 🔧 Common Development Tasks

### Cara Tambah Page Baru 📄
1. Create HTML dalam `pages/`: `pages/new-page.html`
2. Tambah route dalam `server.js`: `'/new-page': '/pages/new-page.html'`
3. Create page CSS: `assets/css/pages/new-page.css`
4. Create page JS (kalau perlu): `assets/js/pages/new-page.js`
5. Tambah dalam navigation kat header component

### Form Validation Pattern (Konteks Malaysia 🇲🇾)
```javascript
// Phone: Format Malaysia (01X-XXXXXXX)
const phoneRegex = /^(\+?6?01[0-9]{1}[0-9]{7,8})$/;

// Guna validators yang dah ada dalam assets/js/modules/forms.js
// Forms module dah handle: required fields, email, phone, real-time validation
```

### Popup System 🎉
- **Greeting Popup**: `greeting-popup.js` - 20% scroll trigger, 20s delay, muncul balik bila refresh (session-based)
- **Generic Popups**: Guna `modules/popup.js` class untuk modals lain
- **Config**: Tengok `development/docs/GREETING_POPUP_CONFIG.md` untuk details behavior

### Animation Phases (3 Files Berasingan) ✨
- **Phase 1**: Form interactions, button effects, card hovers
- **Phase 2**: Scroll-triggered animations, parallax
- **Phase 3**: Advanced transitions, timeline animations
- **Pattern**: Classes initialize masa DOMContentLoaded, expose melalui window object

## 📝 Code Conventions

### Bahasa Melayu Content 🗣️
- Form labels, messages, error text: **Bahasa Melayu** (untuk user)
- Console logs, code comments: **English** (untuk developer convenience)
- Contoh: `<label>Nama Penuh</label>` tapi `console.log('Form validation passed')`

### CSS Naming 🏷️
- BEM-inspired: `.service-card`, `.service-card__title`, `.service-card--featured`
- Utility-first bila boleh: Guna design system classes dulu sebelum custom CSS
- Component CSS letak dalam `assets/css/components/`, JANGAN inline atau dalam page CSS!

### JavaScript Patterns
```javascript
// ES6 Classes with proper initialization
class FeatureName {
    constructor() {
        this.init();
    }
    
    init() {
        this.bindEvents();
        this.setupFeature();
    }
}

// Always check for element existence
const element = document.getElementById('myId');
if (!element) return;

// Malaysian phone validation helper
import { isValidMalaysianPhone } from './utils/helpers.js';
```

### File Organization Rules 📂
- **Modules** (`modules/`): Reusable, stateful classes (Forms, Popup, Navigation)
- **Utils** (`utils/`): Pure functions, takde side effects (helpers.js)
- **Pages** (`pages/`): Page-specific initialization je
- **Components** (`components/`): Shared UI components (footer.js load footer HTML)

## 🚨 Jangan Buat Benda Ni! (Critical) ❌

1. **Jangan bypass server**: Guna `npm start`, BUKAN Live Server atau `index.html` terus
2. **Jangan hardcode colors**: Guna CSS variables dari base.css
3. **Jangan guna `!important`**: Fix specificity issues dengan betul
4. **Jangan create inline styles**: Guna utility classes atau component CSS
5. **Jangan ignore mobile breakpoint**: Test kat 768px (CONFIG.MOBILE_BREAKPOINT)
6. **Jangan modify base.css variables**: Extend dalam page CSS kalau perlu
7. **Jangan guna `var`**: ES6+ je (const/let)

## 📚 Documentation Quick Reference

- **Masalah server**: `SERVER_GUIDE.md` (root)
- **Design tokens**: `development/docs/DESIGN_SYSTEM_IMPLEMENTATION.md`
- **Task semasa**: `development/PROJECT_CHECKLIST.md`
- **Config popup**: `development/docs/GREETING_POPUP_CONFIG.md`
- **Hub semua docs**: `development/docs/README.md`

## 🐛 Debugging Shortcuts

```bash
# Start dev server
npm start

# Hard refresh browser (clear cache)
Ctrl + F5

# Check server logs
# Terminal tunjuk: "GET /about -> /pages/about.html"

# Ada console errors? Check:
# 1. File paths (case-sensitive masa deploy)
# 2. Module imports (kena ada .js extension)
# 3. DOMContentLoaded wrapped ke?
```

## 🎯 Quality Checklist (Sebelum Commit!)

- [ ] Mobile responsive (test kat 768px, 480px)
- [ ] Guna design system variables/classes
- [ ] WhatsApp links guna `wsap.to/kmepestcontrol`
- [ ] Form validation handle format phone Malaysia
- [ ] Takde console errors dalam browser DevTools
- [ ] Route dah tambah dalam server.js kalau ada page baru
- [ ] CSS ikut asset hierarchy (components → pages)
- [ ] JS modules guna proper export/import
- [ ] Bahasa Melayu untuk user-facing text
- [ ] Browser cache dah clear masa testing (Ctrl+F5)

---

**Architecture Principle**: Ini **modular static site** yang nampak macam single-page app. Setiap page adalah self-contained HTML, tapi share CSS/JS melalui intelligent asset organization. Custom server provide clean URLs dan proper MIME handling untuk modern development tanpa framework overhead. 🚀
