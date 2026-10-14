# EduQuest - Platform EdTech Yayasan Bimbingan Belajar

EduQuest adalah platform web EdTech produksi untuk yayasan bimbingan belajar terintegrasi yang menghadirkan kurikulum adaptif, multi-agent AI tutor, arena gamifikasi belajar, dan pemantauan analitika guru secara real-time.

Dibangun dengan **Next.js 14+ (App Router)**, **TypeScript**, **Tailwind CSS**, dan **Lucide React Icons**.

---

## 🚀 Panduan Menjalankan Proyek

### 1. Prasyarat
- Node.js versi 18+ atau 20+
- npm atau pnpm

### 2. Menjalankan Server Development
```bash
cd eduquest
npm run dev
```
Buka browser pada alamat: **`http://localhost:3000`**

### 3. Build untuk Produksi
```bash
npm run build
npm run start
```

---

## 🗺️ Arsitektur Halaman & Navigasi

| Rute | Deskripsi & Hak Akses |
| :--- | :--- |
| `/` | **Landing Page Publik**: Visi & Misi Yayasan, 4 Pilar Pembelajaran, Statistik Pencapaian, dan CTA "Masuk Portal". |
| `/login` | **Portal Otentikasi Tertutup**: Masuk menggunakan NIS (Siswa) atau NIP (Guru). Tersedia tombol demo 1-klik untuk pengujian instan. |
| `/student` | **Portal Siswa (5 Tab)**: Beranda, Ruang Materi, Tanya AI, Arena Interaktif, dan Peringkat. Dilengkapi Desktop Sidebar & Mobile Bottom Nav. |
| `/teacher` | **Portal Guru (4 Tab)**: Dashboard Analytics, Manajemen Konten & Game Creator, Pantau Siswa, dan Absensi Presensi QR & Jurnal Harian. |

---

## 🎮 Fitur Utama Portal Siswa (`/student`)

1. **Beranda (Home)**:
   - **Banner Absensiku**: Check-in mandiri harian (+50 EXP, +15 Koin) dengan pelacak streak belajar berturut-turut.
   - **Gamifikasi Header**: Avatar siswa, Level, progress bar EXP dinamis, dan saldo Koin EduQuest.
   - **Tugas & Tantangan Mendesak**: Daftar tugas berbatas waktu dengan modal pengerjaan kuis kilat.
   - **Jejak Belajar**: Slider horizontal histori modul terakhir dibaca dengan fitur 1-klik lanjutkan belajar.

2. **Ruang Materi (Library)**:
   - Direktori folder terstruktur untuk SD (Fase A-C), SMP (Fase D), dan SMA (Fase E-F).
   - Kartu modul format PDF, Video Microlearning, dan Simulasi Interaktif beserta modal pratinjau.

3. **Tanya AI (Multi-Agent Chatbot)**:
   - **Histori Topik Percakapan**: Drawer arsip konsultasi konsep sebelumnya.
   - **3 Agen AI Spesialis**:
     - *Pak Bilangan*: Pakar Matematika & Penalaran Logis.
     - *Prof. Atomika*: Pakar Sains & Fisika Eksperimental.
     - *Bu Bahasa*: Pakar Literasi & Komunikasi Efektif.
   - Respon bertahap metode Socrates, indikator pengetikan, dan saran pertanyaan cepat.

4. **Arena Interaktif (Games & AR)**:
   - **Tantangan Guru**: Kuis berbatas waktu yang dibuat langsung oleh guru (terhubung langsung dengan pembuat game guru).
   - **Arcade EduQuest**: Game berhadiah koin (Kuis Kilat Matematika, Tebak Unsur, Duel Kata).
   - **Laboratorium AR 3D**: Inspeksi anatomi sel 3D interaktif dengan kontrol rotasi dan simulator kamera AR.

5. **Peringkat (Leaderboard)**:
   - Podium juara 3D untuk Top 3 (Emas, Perak, Perunggu) lengkap dengan mahkota, avatar, dan EXP.
   - Tabel peringkat vertikal global (posisi 4-10+) dengan penanda posisi akun pengguna.

---

## 📊 Fitur Utama Portal Guru (`/teacher`)

1. **Dashboard Analytics**:
   - Metrik kehadiran, nilai rata-rata kelas, tugas aktif, dan siswa butuh remedial.
   - **AI Insights**: Analisis otomatis miskonsepsi siswa yang diekstrak dari log percakapan Tanya AI.
   - Grafik distribusi nilai tugas dan kurva keaktifan mingguan siswa.

2. **Manajemen Konten & Game Creator**:
   - Toggle antara *Materi Resmi Yayasan* dan *Tugas & Game Kustom*.
   - **Formulir "Buat Game Baru"**: Pembuat soal mandiri dengan pilihan template (Kuis Cerdas, Cocok Kata, Susun Rumus), pengaturan kunci jawaban, target distribusi kelas, dan reward EXP/Koin. Saat diterbitkan, game otomatis muncul di Arena Siswa!

3. **Pantau Siswa**:
   - Tabel pencarian rekam siswa lengkap dengan progress bar modul kurikulum, nilai rata-rata, rekam absensi, dan modal pencatatan bimbingan/remedial.

4. **Absensi & Jurnal**:
   - **Simulator Scanner QR**: Viewport kamera animasi pemindai untuk memvalidasi kartu QR siswa.
   - **Jurnal Mengajar Harian**: Formulir digital pencatatan capaian materi, refleksi hambatan kelas, dan arsip histori mengajar.
