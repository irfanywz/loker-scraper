# Tornado Starter Vue
Memudahkan Pembuatan aplikasi menggunakan tornado dan vue3

## Setup
- install uv
- install nodejs
- sinkronkan moudule python di root  `uv sync`
- sinkronkan module node js di `src/app/` `npm install`
- jalankan server frontend `main_vue.bat`
- jalankan server backend `main.bat`
- buka server frontendnya `http://localhost:5173/`

## Build
- jalankan `5_build_all.bat`
- hasil build akan ada di dist lengkap dengan corenya

## Development
- development terjadi di 2 sisi, frontend dan backend
- frontend terdapat di `src/app/src`
- backend terdapat di `src/`
- untuk development modular ada dibagian `src/app/src/core` ditaruh disini agar tailwindcss bisa mendeteksi classnya

## Catatan Development
kalau nambah komponen yang bisa reusable sebaiknya taruh langsung difrontend, agar halaman modular lebih ringkas dan tidak banyak pengulangan

## Catatan Perubahan
11 November 2025
- membuat komponen table
10 November 2025
- membuat komponen generator
9 November 2025
- membuat tampilan seperti qlobot
8 November 2025
- pakai framework frontend vue3

7 November 2025
- start pembuatan proyek