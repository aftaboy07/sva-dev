import { ArenaTopicPack, StudentSocialPeer } from "@/types";

export const ARENA_TOPIC_PACKS: ArenaTopicPack[] = [
  {
    id: "sains_ipa",
    name: "Sains & Anatomi IPA",
    category: "Ilmu Pengetahuan Alam",
    icon: "🔬",
    badge: "Fisika & Biologi",
    description: "Uji pemahaman fungsi organ tubuh, biologi sel, dan hukum fisika terpadu madrasah.",
    rounds: [
      {
        round: 1,
        pairs: [
          {
            id: "ipa-1",
            conceptTerm: "Enzim Amilase",
            explanation: "Mengubah zat tepung (amilum) menjadi glukosa sederhana di mulut",
          },
          {
            id: "ipa-2",
            conceptTerm: "Alveolus",
            explanation: "Tempat pertukaran gas oksigen (O₂) dan karbondioksida (CO₂) di paru-paru",
          },
          {
            id: "ipa-3",
            conceptTerm: "Mitokondria",
            explanation: "Organel sel penghasil energi utama (ATP) melalui respirasi sel",
          },
          {
            id: "ipa-4",
            conceptTerm: "Kloroplas",
            explanation: "Organel tempat berlangsungnya reaksi fotosintesis pada sel tumbuhan",
          },
        ],
      },
      {
        round: 2,
        pairs: [
          {
            id: "ipa-5",
            conceptTerm: "Nefron Ginjal",
            explanation: "Unit fungsional penyaring darah dan pembentuk urin di ginjal",
          },
          {
            id: "ipa-6",
            conceptTerm: "Pembuluh Arteri",
            explanation: "Membawa aliran darah kaya oksigen keluar dari jantung ke seluruh tubuh",
          },
          {
            id: "ipa-7",
            conceptTerm: "Hukum Archimedes",
            explanation: "Gaya apung ke atas sebanding dengan berat zat cair yang dipindahkan",
          },
          {
            id: "ipa-8",
            conceptTerm: "Hukum Newton I",
            explanation: "Benda mempertahankan keadaan diam atau gerak lurus beraturan (Inersia)",
          },
        ],
      },
      {
        round: 3,
        pairs: [
          {
            id: "ipa-9",
            conceptTerm: "Pembuluh Xilem",
            explanation: "Mengangkut air dan mineral dari akar menuju daun tumbuhan",
          },
          {
            id: "ipa-10",
            conceptTerm: "Pembuluh Floem",
            explanation: "Mengedarkan hasil fotosintesis dari daun ke seluruh bagian tumbuhan",
          },
          {
            id: "ipa-11",
            conceptTerm: "Asam Klorida (HCl)",
            explanation: "Membunuh bakteri patogen dan mengasamkan lingkungan lambung",
          },
          {
            id: "ipa-12",
            conceptTerm: "Sinapsis",
            explanation: "Titik temu penghubung transmisi sinyal antar sel saraf (neuron)",
          },
        ],
      },
    ],
  },
  {
    id: "matematika",
    name: "Rumus & Logika Matematika",
    category: "Matematika MTs",
    icon: "📐",
    badge: "Aljabar & Geometri",
    description: "Pasangkan rumus geometris, luas bangun datar, volume ruang, dan persamaan aljabar.",
    rounds: [
      {
        round: 1,
        pairs: [
          {
            id: "mat-1",
            conceptTerm: "Luas Lingkaran",
            explanation: "L = π × r²",
          },
          {
            id: "mat-2",
            conceptTerm: "Teorema Pythagoras",
            explanation: "c² = a² + b² (pada segitiga siku-siku)",
          },
          {
            id: "mat-3",
            conceptTerm: "Volume Tabung",
            explanation: "V = π × r² × t",
          },
          {
            id: "mat-4",
            conceptTerm: "Keliling Lingkaran",
            explanation: "K = 2 × π × r (atau π × d)",
          },
        ],
      },
      {
        round: 2,
        pairs: [
          {
            id: "mat-5",
            conceptTerm: "Luas Permukaan Kubus",
            explanation: "L = 6 × s²",
          },
          {
            id: "mat-6",
            conceptTerm: "Gradien Garis Lurus (m)",
            explanation: "m = (y₂ - y₁) / (x₂ - x₁)",
          },
          {
            id: "mat-7",
            conceptTerm: "Volume Balok",
            explanation: "V = panjang × lebar × tinggi",
          },
          {
            id: "mat-8",
            conceptTerm: "Rumus ABC Kuadrat",
            explanation: "x = (-b ± √(b² - 4ac)) / (2a)",
          },
        ],
      },
      {
        round: 3,
        pairs: [
          {
            id: "mat-9",
            conceptTerm: "Volume Kerucut",
            explanation: "V = 1/3 × π × r² × t",
          },
          {
            id: "mat-10",
            conceptTerm: "Luas Segitiga",
            explanation: "L = 1/2 × alas × tinggi",
          },
          {
            id: "mat-11",
            conceptTerm: "Modus Data",
            explanation: "Nilai data yang frekuensi kemunculannya paling tinggi",
          },
          {
            id: "mat-12",
            conceptTerm: "Mean (Rata-rata)",
            explanation: "Jumlah seluruh nilai data dibagi banyaknya data",
          },
        ],
      },
    ],
  },
  {
    id: "agama_umum",
    name: "Wawasan Agama & Umum",
    category: "PAI & Adab Santri",
    icon: "🕌",
    badge: "Tajwid & Karakter",
    description: "Konsep tajwid Al-Qur'an, adab islami, rukun ibadah, dan asmaul husna santri terpadu.",
    rounds: [
      {
        round: 1,
        pairs: [
          {
            id: "agm-1",
            conceptTerm: "Hukum Ikhfa Syafawi",
            explanation: "Mim sukun bertemu huruf Ba (dibaca samar dengan dengung)",
          },
          {
            id: "agm-2",
            conceptTerm: "Rukun Islam ke-2",
            explanation: "Mendirikan ibadah Shalat Fardhu 5 waktu sehari semalam",
          },
          {
            id: "agm-3",
            conceptTerm: "Tadabbur Alam",
            explanation: "Merenungi kebesaran Allah melalui ciptaan dan keteraturan semesta",
          },
          {
            id: "agm-4",
            conceptTerm: "Zakat Fitrah",
            explanation: "Kewajiban beras/makanan pokok penyuci jiwa menjelang Idul Fitri",
          },
        ],
      },
      {
        round: 2,
        pairs: [
          {
            id: "agm-5",
            conceptTerm: "Idgham Bigunnah",
            explanation: "Nun sukun/tanwin bertemu Ya, Nun, Mim, Wawu (didengungkan)",
          },
          {
            id: "agm-6",
            conceptTerm: "Sifat Wajib: Amanah",
            explanation: "Dapat dipercaya dan menjalankan tanggung jawab sebaik-baiknya",
          },
          {
            id: "agm-7",
            conceptTerm: "Tahun Hijriah",
            explanation: "Kalender Islam berpatokan pada revolusi bulan mengitari bumi",
          },
          {
            id: "agm-8",
            conceptTerm: "Sujud Syukur",
            explanation: "Sujud satu kali saat mendapatkan nikmat besar atau terhindar musibah",
          },
        ],
      },
      {
        round: 3,
        pairs: [
          {
            id: "agm-9",
            conceptTerm: "Hukum Qalqalah Kubra",
            explanation: "Huruf pantul berharakat sukun di akhir kata karena diwaqafkan",
          },
          {
            id: "agm-10",
            conceptTerm: "Asmaul Husna: Al-Alim",
            explanation: "Allah Maha Mengetahui segala rahasia di langit dan di bumi",
          },
          {
            id: "agm-11",
            conceptTerm: "Sifat Wajib: Fathonah",
            explanation: "Cerdas, arif, dan berilmu dalam membimbing kebenaran",
          },
          {
            id: "agm-12",
            conceptTerm: "Surah Makkiyah",
            explanation: "Ayat-ayat Al-Qur'an yang diturunkan sebelum Rasulullah hijrah ke Madinah",
          },
        ],
      },
    ],
  },
];

export const BASE_MTS_STUDENTS: Omit<StudentSocialPeer, "connectionStatus">[] = [
  {
    id: "std-26071",
    nis: "26071",
    name: "MOH. ARIF HIDAYATULLOH",
    grade: "Kelas 7 MTs",
    unit: "MTs",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    hasCompletedLatestTask: true,
    latestTaskTitle: "Studi Kasus Tekanan Hidrostatis",
    tasksCompletedCount: 6,
    gamesPlayedCount: 14,
    totalKnowledgeScore: 2650,
    isOnline: true,
  },
  {
    id: "std-26081",
    nis: "26081",
    name: "FATIMATUS AZAHRA",
    grade: "Kelas 8 MTs",
    unit: "MTs",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    hasCompletedLatestTask: false,
    latestTaskTitle: "Latihan Aljabar & Fungsi",
    tasksCompletedCount: 4,
    gamesPlayedCount: 12,
    totalKnowledgeScore: 2420,
    isOnline: true,
  },
  {
    id: "std-26091",
    nis: "26091",
    name: "NAURA SYARIFAH NUR FADHILAH",
    grade: "Kelas 9 MTs",
    unit: "MTs",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    hasCompletedLatestTask: true,
    latestTaskTitle: "Bedah Soal Hukum Newton III",
    tasksCompletedCount: 8,
    gamesPlayedCount: 18,
    totalKnowledgeScore: 3150,
    isOnline: true,
  },
];
