<<<<<<< HEAD
This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
=======
### **Sistem Informasi Jadwal Sidang Skripsi**

**Deskripsi Singkat**: Sistem ini dirancang untuk membantu mahasiswa dalam mengajukan jadwal sidang skripsi secara online dan memudahkan admin atau panitia sidang untuk mengelola jadwal, termasuk menugaskan dosen penguji. Mahasiswa dapat melihat jadwal sidang mereka setelah disetujui, sementara admin bertugas meninjau pengajuan dan mengatur jadwal sidang.

---

### **Tugas untuk Kelompok 12 (Admin Panel / Pengelolaan Jadwal Sidang)**

#### **1. Halaman Login Admin**
- Gunakan Firebase Authentication untuk login admin dengan email dan password.
- Pastikan hanya admin yang dapat mengakses halaman ini.

---

#### **2. Dashboard Admin**
- Menampilkan statistik rekapitulasi:
  - Total pengajuan sidang.
  - Total pengajuan yang disetujui, ditolak, dan masih menunggu persetujuan.
  - Total jadwal sidang yang terkonfirmasi.
- Sediakan shortcut untuk melihat detail pengajuan atau membuat jadwal sidang baru.

---

#### **3. Halaman Manajemen Pengajuan**
- **Daftar Pengajuan Sidang**:
  - Tampilkan semua pengajuan yang masuk.
  - Informasi yang ditampilkan:
    - Nama mahasiswa.
    - NIM.
    - Judul skripsi.
    - Status pengajuan (menunggu persetujuan/disetujui/ditolak).
  - Tambahkan fitur filter berdasarkan status pengajuan.
- **Detail Pengajuan Sidang**:
  - Ketika admin memilih salah satu pengajuan, tampilkan detail lengkap:
    - Nama mahasiswa.
    - NIM.
    - Judul skripsi.
    - Tanggal dan waktu sidang yang diajukan.
    - Berkas yang diunggah (dapat diunduh).
  - Tombol untuk:
    - **Setujui**: Memindahkan data ke koleksi **jadwal_sidang**.
    - **Tolak**: Memberikan alasan penolakan dan menyimpan status sebagai "ditolak."

---

#### **4. Halaman Jadwal Sidang**
- **Tambah Jadwal Baru**:
  - Form input data jadwal sidang:
    - Nama mahasiswa (dropdown dari data pengajuan yang disetujui).
    - Judul skripsi (auto-fill setelah mahasiswa dipilih).
    - Tanggal dan waktu sidang.
    - Nama dosen penguji 1 dan 2 (dropdown dari daftar dosen).
  - Data disimpan ke koleksi **jadwal_sidang** di Firestore.
- **Edit Jadwal Sidang**:
  - Menampilkan data jadwal yang sudah ada di form untuk diubah.
  - Perbarui data jadwal di Firestore.
- **Hapus Jadwal Sidang**:
  - Tambahkan tombol untuk menghapus data jadwal sidang.

---

#### **5. Firebase Integration**
- Gunakan Firebase Firestore untuk mengelola data pengajuan sidang dan jadwal sidang.
- Gunakan Firebase Authentication untuk autentikasi admin.

---

#### **6. Fitur Tambahan (Opsional)**
- Tambahkan fitur untuk mengirimkan notifikasi email otomatis kepada mahasiswa setelah pengajuan disetujui atau jadwal sidang diubah.
- Tambahkan fitur untuk mengunduh laporan jadwal sidang dalam format PDF atau CSV.

---

#### **Fitur Utama yang Harus Selesai**
1. Sistem login admin menggunakan Firebase Authentication.
2. Persetujuan dan penolakan pengajuan sidang.
3. CRUD jadwal sidang di Firestore.

---

### **Struktur Firebase Firestore untuk Data Sidang**
**Koleksi**: `pengajuan_sidang`  
**Dokumen (contoh)**:
```json
{
  "id": "001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "judul_skripsi": "Pengembangan Sistem Informasi Berbasis Web",
  "tanggal_pengajuan": "2024-11-20",
  "tanggal_sidang": "",
  "waktu_sidang": "",
  "status": "menunggu persetujuan",
  "berkas": "url_to_file"
}
```

**Koleksi**: `jadwal_sidang`  
**Dokumen (contoh)**:
```json
{
  "id": "sidang_001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "judul_skripsi": "Pengembangan Sistem Informasi Berbasis Web",
  "tanggal_sidang": "2024-12-01",
  "waktu_sidang": "09:00",
  "penguji_1": "Dr. Andi Baso",
  "penguji_2": "Dr. Budi Santoso"
}
```
---

### **Integrasi Antar Kelompok**
1. **Standar Data**:
   - Kelompok admin bertugas memastikan data pengajuan dan jadwal sidang disimpan dengan format yang sesuai di Firestore.
   - Kelompok front-end bertugas menampilkan data ini kepada mahasiswa.
2. **API Firebase**:
   - Gunakan koleksi **pengajuan_sidang** untuk pengajuan mahasiswa.
   - Gunakan koleksi **jadwal_sidang** untuk jadwal sidang yang telah disetujui.
3. **Koordinasi**:
   - Pastikan kedua kelompok sepakat pada struktur data dan mekanisme alur kerja.

---

### **Estimasi Timeline (6 Minggu)**

#### **Kelompok 12: Admin Panel**
- **Minggu 1**: Setup repositori, install dependency, setup Firebase Authentication dan Firestore.
- **Minggu 2**: Membuat halaman login admin.
- **Minggu 3**: Membuat halaman manajemen pengajuan sidang.
- **Minggu 4**: Membuat halaman tambah/edit/hapus jadwal sidang.
- **Minggu 5**: Menyelesaikan dashboard admin dan testing.
- **Minggu 6**: Debugging dan dokumentasi admin panel.
>>>>>>> main

---

# **Dokumentasi** 
## Sistem Informasi Jadwal Sidang Skripsi

Sistem ini dirancang untuk membantu mahasiswa dan admin dalam proses pengelolaan pengajuan dan jadwal sidang skripsi. Dengan sistem ini, mahasiswa dapat mengajukan jadwal sidang secara online, dan admin dapat mengelola pengajuan serta jadwal sidang dengan mudah dan efisien.

---

### Daftar Isi
1. [Tentang Proyek](#tentang-proyek)
2. [Fitur Utama](#fitur-utama)
3. [Teknologi yang Digunakan](#teknologi-yang-digunakan)
4. [Persyaratan Instalasi](#persyaratan-instalasi)
5. [Langkah Instalasi](#langkah-instalasi)
6. [Penggunaan](#penggunaan)
7. [Struktur Firebase](#struktur-firebase)
8. [Kontribusi](#kontribusi)

---

### Tentang Proyek

Sistem Informasi Jadwal Sidang Skripsi bertujuan untuk:
- Mempermudah mahasiswa dalam mengajukan jadwal sidang secara online.
- Membantu admin dalam memproses pengajuan dan mengelola jadwal sidang.
- Meningkatkan efisiensi pengelolaan sidang skripsi.

---

### Fitur Utama

### *Untuk Admin (Kelompok 12):*
1. *Halaman Login Admin*
   - Login menggunakan Firebase Authentication.
   - Autentikasi berbasis email dan password.

2. *Dashboard Admin*
   - Statistik total pengajuan sidang (disetujui, ditolak, menunggu persetujuan).
   - Statistik total jadwal sidang yang terkonfirmasi.
   - Shortcut untuk detail pengajuan dan menambah jadwal.

3. *Manajemen Pengajuan*
   - Tampilkan daftar pengajuan sidang lengkap dengan filter.
   - Detail pengajuan lengkap:
     - Nama mahasiswa, NIM, judul skripsi, tanggal pengajuan, berkas.
   - Aksi:
     - Setujui pengajuan → Memindahkan ke jadwal sidang.
     - Tolak pengajuan → Berikan alasan penolakan.

4. *Manajemen Jadwal Sidang*
   - Tambah, edit, dan hapus jadwal sidang.
   - Penugasan dosen penguji (dropdown dari daftar dosen).

5. *Firebase Integration*
   - Firebase Authentication untuk login admin.
   - Firebase Firestore untuk manajemen data.

### *Fitur Tambahan (Opsional):*
- Unduh laporan jadwal sidang dalam format PDF/CSV.

---

## Teknologi yang Digunakan
- *Frontend*: Next.js (React Framework)
- *Backend*: Firebase Firestore
- *Authentication*: Firebase Authentication

---

## Persyaratan Instalasi
- *Node.js* versi 16.x atau lebih baru.
- Firebase Account (untuk Authentication dan Firestore).
- Akun Vercel untuk deployment.

---

## Langkah Instalasi

1. Clone repositori:
   bash
   git clone https://github.com/developercirclesmks/mk-sisfor-12.git
   cd mk-sisfor-12

2. Instal dependensi: npm install
* npm install.
3. Konfigurasi Firebase:
* Buat proyek di Firebase Console.
* Aktifkan Authentication (email & password).
* Konfigurasi Firestore Database.
* Salin konfigurasi Firebase ke file .env.local:
* NEXT_PUBLIC_FIREBASE_API_KEY=your_firebase_api_key
* NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_firebase_auth_domain
* NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_firebase_project_id
4. Jalankan server pengembangan:
* npm run dev
5. Buka aplikasi di browser
* http://localhost:3000

---

## Penggunaan

Login Admin
1. Masukkan email dan password admin untuk login.
2. Akses dashboard admin untuk melihat statistik dan shortcut pengelolaan.
Manajemen Pengajuan
1. Lihat daftar pengajuan lengkap.
2. Setujui atau tolak pengajuan sesuai kebutuhan.
Manajemen Jadwal Sidang
1. Tambah jadwal baru dengan mengisi nama mahasiswa, tanggal, waktu, dan dosen penguji.
2. Edit atau hapus jadwal jika diperlukan.

---

### **Struktur Firebase Firestore untuk Data Sidang**
**Koleksi**: `pengajuan_sidang`  
**Dokumen (contoh)**:
json
{
  "id": "001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "judul_skripsi": "Pengembangan Sistem Informasi Berbasis Web",
  "tanggal_pengajuan": "2024-11-20",
  "tanggal_sidang": "",
  "waktu_sidang": "",
  "status": "menunggu persetujuan",
  "berkas": "url_to_file"
}


**Koleksi**: `jadwal_sidang`  
**Dokumen (contoh)**:
json
{
  "id": "sidang_001",
  "nama": "Muhammad Aryandi",
  "nim": "123456789",
  "judul_skripsi": "Pengembangan Sistem Informasi Berbasis Web",
  "tanggal_sidang": "2024-12-01",
  "waktu_sidang": "09:00",
  "penguji_1": "Dr. Andi Baso",
  "penguji_2": "Dr. Budi Santoso"
}

```
# rekweb-admin
