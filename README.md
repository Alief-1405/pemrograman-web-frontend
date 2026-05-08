# Frontend Next.js - Sinema Jayakarta

Frontend untuk Sinema Jayakarta menggunakan Next.js 14, React 18, dan CSS vanilla.

## Fitur

- ✅ Listing film dengan pagination
- ✅ Search film berdasarkan judul
- ✅ Detail film
- ✅ Sistem login dengan JWT
- ✅ Dashboard untuk admin
- ✅ Tambah film (admin only)
- ✅ Edit film (admin only)
- ✅ Hapus film (admin only)
- ✅ Upload cover film
- ✅ Responsive design

## Installation & Setup

1. Masuk folder frontend:
```bash
cd frontend_new
```

2. Install dependencies:
```bash
npm install
```

3. Jalankan dev server:
```bash
npm run dev
```

Frontend akan berjalan di `http://localhost:3001`

## Environment Variables

Tidak ada environment variable yang diperlukan untuk frontend. Pastikan backend berjalan di `http://localhost:4000`.

## File Structure

```
frontend_new/
├── app/
│   ├── globals.css          # Global styles
│   ├── layout.js            # Root layout dengan Navbar
│   ├── page.js              # Home / Movie listing
│   ├── login/
│   │   ├── page.js          # Login page
│   │   └── page.css
│   ├── dashboard/
│   │   ├── page.js          # Admin dashboard
│   │   └── page.css
│   ├── movies/
│   │   ├── [id]/
│   │   │   ├── page.js      # Detail film
│   │   │   ├── edit/page.js # Edit film
│   │   │   └── page.css
│   │   └── add/
│   │       ├── page.js      # Tambah film
│   │       └── page.css
├── components/
│   ├── Navbar.js            # Navbar component
│   └── Navbar.css
├── lib/
│   ├── api.js               # API helper functions
│   └── withAuth.js          # HOC untuk protected routes
├── public/                  # Static files
└── package.json
```

## API Integration

Frontend terhubung dengan backend di `http://localhost:4000/api` dengan endpoints:

- `GET /movies` - Listing film
- `GET /movies/:id` - Detail film
- `GET /movies/search` - Cari film
- `POST /movies` - Tambah film
- `PUT /movies/:id` - Edit film
- `DELETE /movies/:id` - Hapus film
- `POST /auth/login` - Login

Token disimpan di localStorage dengan key `token`.

## Deployment

Build untuk production:
```bash
npm run build
npm run start
```
