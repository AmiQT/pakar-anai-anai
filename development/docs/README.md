# Development Docs Hub

Pusat rujukan pantas untuk semua dokumen dev. Fokus: setup, design system, optimization, dan config.

##  Senarai Dokumen
- Server Guide: ../../SERVER_GUIDE.md
- Project Checklist: ../PROJECT_CHECKLIST.md
- Design System: ./DESIGN_SYSTEM_IMPLEMENTATION.md
- Optimization Recommendations: ./OPTIMIZATION_RECOMMENDATIONS.md
- Greeting Popup Config: ./GREETING_POPUP_CONFIG.md

##  Ringkasan Arkitektur
- Dev server (`server.js`): clean URLs, MIME types, caching ringan, custom 404
- Assets struktur: CSS (foundation  responsive), JS (modules/pages/utils), images (ikut kategori)
- Pages: HTML statik dalam folder `pages/`

##  Konvensyen
- Nama fail dokumen: `UPPER_SNAKE_CASE.md`
- Bahasa: BM ringkas dan jelas
- Lokasi: Letak dokumen teknikal dalam `development/docs`

##  Tambah Dokumen Baharu
1. Buat fail dalam `development/docs`, contoh: `NEW_FEATURE_GUIDE.md`
2. Update senarai di README ini

##  Next Steps
- Rujuk ../PROJECT_CHECKLIST.md untuk fokus kerja semasa
