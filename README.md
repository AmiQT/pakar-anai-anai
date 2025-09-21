# KME Pest Control Website

Dokumentasi rasmi projek untuk memudahkan sesiapa sambung kerja nanti. Ringkas, kemas, dan terus boleh jalan.

##  Gambaran Projek
- **Jenis**: Laman web statik (HTML/CSS/JS)
- **Server**: Node.js dev server custom (untuk clean URL dan routing)
- **Deploy**: Sesuai untuk static hosting (Vercel/Netlify) atau server biasa

##  Quick Start
### Keperluan
- Node.js v14 atau lebih baharu

### Jalankan server
```bash
npm start
# atau
node server.js
```
Akan auto buka `http://localhost:3000`.

### URL Penting
- `/`  `index.html`
- `/about`  `pages/about.html`
- `/services`  `pages/services.html`
- `/products`  `pages/products.html`
- `/contact`  `pages/contact.html`
- `/booking`  `pages/booking.html`
- `/testimoni`  `pages/testimoni.html`
- `/gallery`  `pages/gallery.html`

> Nota: Clean URL untuk halaman baharu perlu ditambah ke `server.js` (rujuk objek `routes`).

##  Struktur Folder Ringkas
```
assets/           # CSS, JS, Images (modular & kemas)
  css/            # 1-foundation, 2-layout, 3-components, 4-pages, 5-responsive
  js/             # modules/, pages/, utils/ + main.js
  images/         # about/, home/, services/, product/, favicon/
pages/            # HTML pages (about, services, contact, dll.)
server.js         # Dev server (clean URLs, MIME, caching ringan)
SERVER_GUIDE.md   # Panduan server (cara guna & troubleshoot)

development/
  docs/           # Dokumentasi teknikal fokus dev
  PROJECT_CHECKLIST.md  # Halaman status/roadmap kerja
```

##  Cara Tambah Halaman Baharu
1. Buat fail HTML contohnya `pages/pest-control-tips.html`.
2. (Pilihan) Untuk **clean URL** `/pest-tips`, tambah route dalam `server.js`:
```js
// Dalam server.js  objek routes
"/pest-tips": "/pages/pest-control-tips.html"
```
3. Linkkan dalam navigasi (header/footer) dan test di browser.

##  Gaya Kod & Konvensyen
- **CSS**: Guna struktur modular (`1-foundation`  `5-responsive`). Komponen reusable dalam `3-components/`.
- **JS**: Guna modul dalam `assets/js/modules/` dan spesifik page dalam `assets/js/pages/`.
- **Images**: Letak mengikut kategori (about/home/services/product). Guna WebP jika sesuai.

Rujukan terperinci: `development/docs/DESIGN_SYSTEM_IMPLEMENTATION.md`.

##  Tugas Biasa (Cheat Sheet)
- Start server: `npm start`
- Tukar port: `set PORT=8080 && node server.js`
- Hard refresh: `Ctrl + F5`
- Clear cache: DevTools  Application  Clear storage

Masalah server/nav? Rujuk `SERVER_GUIDE.md`.

##  Hub Dokumentasi
- `development/docs/README.md`
  - `SERVER_GUIDE.md` (root)
  - `development/PROJECT_CHECKLIST.md`
  - `development/docs/OPTIMIZATION_RECOMMENDATIONS.md`
  - `development/docs/DESIGN_SYSTEM_IMPLEMENTATION.md`
  - `development/docs/GREETING_POPUP_CONFIG.md`

##  Deploy Ringkas
- Projek ni statik; boleh deploy ke Vercel/Netlify.
- `vercel.json` tersedia untuk konfigurasi asas.
- Untuk server biasa (Apache/Nginx), pastikan route/rewrites follow struktur `pages/`.

##  Lesen
MIT  KME Pest Control
