import { GameQuestion } from "@/types";

// ============================================================================
// 1. BANK SOAL BAHASA INGGRIS (10 SOAL BERVARIASI)
// ============================================================================
export const QUIZ_BANK_BAHASA_INGGRIS: GameQuestion[] = [
  {
    id: "eng-1",
    question: "Subject-Verb Agreement: 'Neither of the students ... arrived at the English club session yet.'",
    options: ["has", "have", "were", "are having"],
    correctAnswerIndex: 0,
    explanation: "Subjek 'Neither of...' menggunakan kata kerja tunggal (singular verb). Jadi pilihan yang tepat adalah 'has'."
  },
  {
    id: "eng-2",
    question: "Synonym: What is the closest meaning of the word 'BENEVOLENT' in English literature?",
    options: ["Kind and generous", "Cruel and harsh", "Cautious and timid", "Wealthy and arrogant"],
    correctAnswerIndex: 0,
    explanation: "'Benevolent' bermakna dermawan, berhati mulia, atau baik hati (kind and generous)."
  },
  {
    id: "eng-3",
    question: "Conditional Sentence: 'If she ... harder during the study session, she would pass the international debate contest.'",
    options: ["studied", "studies", "will study", "had studied"],
    correctAnswerIndex: 0,
    explanation: "Bentuk Conditional Type 2 ('would + verb 1') mensyaratkan if-clause menggunakan Simple Past ('studied')."
  },
  {
    id: "eng-4",
    question: "Idiom Meaning: What does the English expression 'to burn the midnight oil' mean?",
    options: ["To study or work late into the night", "To waste lamp fuel carelessly", "To cook food in the evening", "To wake up before dawn"],
    correctAnswerIndex: 0,
    explanation: "'Burn the midnight oil' adalah ungkapan kiasan untuk belajar atau bekerja keras hingga larut malam."
  },
  {
    id: "eng-5",
    question: "Passive Voice: 'The digital Islamic library module ... by the academic team yesterday.'",
    options: ["was compiled", "is compiled", "compiled", "were compiling"],
    correctAnswerIndex: 0,
    explanation: "Bentuk kalimat pasif lampau untuk subjek tunggal 'module' adalah 'was + V3 (compiled)'."
  },
  {
    id: "eng-6",
    question: "Preposition: 'Our weekly English speaking club meets ... Friday afternoon in the library.'",
    options: ["on", "at", "in", "by"],
    correctAnswerIndex: 0,
    explanation: "Untuk hari atau spesifikasi hari seperti 'Friday afternoon', preposisi yang tepat adalah 'on'."
  },
  {
    id: "eng-7",
    question: "Antonym: What is the opposite meaning of the word 'SCARCITY'?",
    options: ["Abundance", "Poverty", "Deficiency", "Weakness"],
    correctAnswerIndex: 0,
    explanation: "'Scarcity' berarti kelangkaan atau kekurangan; lawan katanya adalah 'abundance' (kelimpahan)."
  },
  {
    id: "eng-8",
    question: "Superlative Degree: 'Out of all participants in the speech competition, Aisyah spoke the ...'",
    options: ["most persuasively", "more persuasive", "most persuasive", "as persuasively"],
    correctAnswerIndex: 0,
    explanation: "Membandingkan cara berbicara (adverb) di antara banyak peserta menggunakan bentuk superlatif 'the most persuasively'."
  },
  {
    id: "eng-9",
    question: "Daily Dialogue: A: 'Could you please help me practice this English dialogue?' B: '...'",
    options: ["Certainly, I'd be happy to!", "I don't think it is none of your business.", "Never mind yesterday.", "Excuse me, who are they?"],
    correctAnswerIndex: 0,
    explanation: "Ungkapan ramah menyetujui ajakan berlatih adalah 'Certainly, I\'d be happy to!'."
  },
  {
    id: "eng-10",
    question: "Conjunction: 'He studied diligently for the vocabulary contest, ... he never felt exhausted.'",
    options: ["yet", "because", "unless", "so that"],
    correctAnswerIndex: 0,
    explanation: "Konjungsi pertentangan 'yet' (namun) tepat untuk menghubungkan kerja keras dengan tidak merasa lelah."
  }
];

// ============================================================================
// 2. BANK SOAL MATEMATIKA (10 SOAL BERVARIASI)
// ============================================================================
export const QUIZ_BANK_MATEMATIKA: GameQuestion[] = [
  {
    id: "mat-1",
    question: "Aljabar Linier: Berapakah nilai x yang memenuhi persamaan 4x - 7 = 2x + 9?",
    options: ["x = 8", "x = 4", "x = 6", "x = 16"],
    correctAnswerIndex: 0,
    explanation: "4x - 2x = 9 + 7 => 2x = 16 => x = 8."
  },
  {
    id: "mat-2",
    question: "Barisan Aritmetika: Suku ke-15 dari barisan bilangan 3, 7, 11, 15, ... adalah...",
    options: ["59", "55", "63", "61"],
    correctAnswerIndex: 0,
    explanation: "Un = a + (n - 1)b. a = 3, b = 4. U15 = 3 + (14 * 4) = 3 + 56 = 59."
  },
  {
    id: "mat-3",
    question: "Geometri Pythagoras: Segitiga siku-siku memiliki alas 6 cm dan tinggi 8 cm. Berapa sisi miringnya?",
    options: ["10 cm", "14 cm", "12 cm", "15 cm"],
    correctAnswerIndex: 0,
    explanation: "c = √(6² + 8²) = √(36 + 64) = √100 = 10 cm."
  },
  {
    id: "mat-4",
    question: "Peluang: Sebuah dadu bersisi 6 dilempar 1 kali. Peluang muncul angka prima ganjil (3 atau 5) adalah...",
    options: ["1/3", "1/2", "1/6", "2/5"],
    correctAnswerIndex: 0,
    explanation: "Mata dadu prima ganjil adalah {3, 5} (2 kejadian). Peluang = 2/6 = 1/3."
  },
  {
    id: "mat-5",
    question: "Pecahan & Persen: Bentuk pecahan biasa paling sederhana dari 35% adalah...",
    options: ["7/20", "3/10", "7/25", "1/3"],
    correctAnswerIndex: 0,
    explanation: "35% = 35/100. Dibagi FPB 5 pada pembilang dan penyebut: 7/20."
  },
  {
    id: "mat-6",
    question: "Lingkaran: Sebuah lingkaran berdiameter 28 cm (π = 22/7). Berapakah keliling lingkaran tersebut?",
    options: ["88 cm", "44 cm", "176 cm", "616 cm"],
    correctAnswerIndex: 0,
    explanation: "Keliling K = π * d = (22/7) * 28 = 22 * 4 = 88 cm."
  },
  {
    id: "mat-7",
    question: "Statistika Mean: Nilai rata-rata dari data: 75, 80, 85, 90, 95 adalah...",
    options: ["85", "80", "90", "82.5"],
    correctAnswerIndex: 0,
    explanation: "Total = 75 + 80 + 85 + 90 + 95 = 425. Rata-rata = 425 / 5 = 85."
  },
  {
    id: "mat-8",
    question: "Perkalian Aljabar: Hasil penjabaran dari bentuk (2a + 3)(a - 4) adalah...",
    options: ["2a² - 5a - 12", "2a² + 5a - 12", "2a² - 11a - 12", "2a² - 12"],
    correctAnswerIndex: 0,
    explanation: "(2a + 3)(a - 4) = 2a² - 8a + 3a - 12 = 2a² - 5a - 12."
  },
  {
    id: "mat-9",
    question: "Eksponen: Hasil perpangkatan dari (2³ × 2⁴) ÷ 2² adalah...",
    options: ["32", "64", "16", "128"],
    correctAnswerIndex: 0,
    explanation: "Sifat pangkat: 2^(3 + 4 - 2) = 2^5 = 32."
  },
  {
    id: "mat-10",
    question: "Aritmetika Sosial: Modul seharga Rp 150.000 diberi diskon 20%. Berapa harga setelah diskon?",
    options: ["Rp 120.000", "Rp 130.000", "Rp 110.000", "Rp 125.000"],
    correctAnswerIndex: 0,
    explanation: "Diskon = 20% * 150.000 = Rp 30.000. Harga bayar = 150.000 - 30.000 = Rp 120.000."
  }
];

// ============================================================================
// 3. BANK SOAL IPA TERPADU / FISIKA (10 SOAL BERVARIASI)
// ============================================================================
export const QUIZ_BANK_IPA_TERPADU: GameQuestion[] = [
  {
    id: "ipa-1",
    question: "Hukum II Newton: Balok bermassa 4 kg didorong gaya 24 N pada lantai licin. Berapakah percepatannya?",
    options: ["6 m/s²", "4 m/s²", "8 m/s²", "96 m/s²"],
    correctAnswerIndex: 0,
    explanation: "Hukum II Newton: F = m * a => a = F / m = 24 N / 4 kg = 6 m/s²."
  },
  {
    id: "ipa-2",
    question: "Biologi Sel: Organel sel yang dijuluki 'The Powerhouse of the Cell' karena menghasilkan energi ATP adalah...",
    options: ["Mitokondria", "Ribosom", "Lisosom", "Badan Golgi"],
    correctAnswerIndex: 0,
    explanation: "Mitokondria adalah pusat respirasi seluler dan produksi energi molekuler ATP."
  },
  {
    id: "ipa-3",
    question: "Optika: Cermin pada kaca spion kendaraan agar bayangan tegak dan sudut pandang luas adalah cermin...",
    options: ["Cembung", "Cekung", "Datar", "Silindris"],
    correctAnswerIndex: 0,
    explanation: "Cermin cembung menghasilkan bayangan maya, tegak, diperkecil dengan jangkauan pandang luas."
  },
  {
    id: "ipa-4",
    question: "Fotosintesis: Gas apakah yang dilepaskan tumbuhan hijau pada reaksi terang fotosintesis?",
    options: ["Oksigen (O₂)", "Karbon Dioksida (CO₂)", "Nitrogen (N₂)", "Metana (CH₄)"],
    correctAnswerIndex: 0,
    explanation: "Reaksi terang memecah molekul air (fotolisis) dan melepaskan Oksigen (O₂)."
  },
  {
    id: "ipa-5",
    question: "Fluida Hidrolik: Hukum fisika yang mendasari dongkrak hidrolik dan rem cakram mobil adalah Hukum...",
    options: ["Pascal", "Archimedes", "Boyle", "Bernoulli"],
    correctAnswerIndex: 0,
    explanation: "Hukum Pascal menyatakan tekanan fluida pada ruang tertutup diteruskan sama besar ke segala arah."
  },
  {
    id: "ipa-6",
    question: "Sistem Sirkulasi: Pembuluh darah yang membawa darah kaya oksigen dari paru-paru ke serambi kiri jantung adalah...",
    options: ["Vena pulmonalis", "Arteri pulmonalis", "Aorta", "Vena cava"],
    correctAnswerIndex: 0,
    explanation: "Vena pulmonalis adalah satu-satunya pembuluh vena yang mengalirkan darah bersih kaya oksigen ke jantung."
  },
  {
    id: "ipa-7",
    question: "Kelistrikan: Resistor 20 Ohm dialiri arus listrik 0,5 Ampere. Berapakah tegangan ujung-ujungnya?",
    options: ["10 Volt", "40 Volt", "5 Volt", "100 Volt"],
    correctAnswerIndex: 0,
    explanation: "Hukum Ohm: V = I * R = 0,5 A * 20 Ohm = 10 Volt."
  },
  {
    id: "ipa-8",
    question: "Pemisahan Campuran: Proses memisahkan zat padat tak larut dari zat cair menggunakan penyaring berpori disebut...",
    options: ["Filtrasi", "Destilasi", "Kromatografi", "Sublimasi"],
    correctAnswerIndex: 0,
    explanation: "Filtrasi (penyaringan) memisahkan partikel padat dari cairan berdasarkan perbedaan ukuran pori."
  },
  {
    id: "ipa-9",
    question: "Termodinamika: Perpindahan panas dari matahari ke bumi tanpa medium perantara disebut...",
    options: ["Radiasi", "Konduksi", "Konveksi", "Evaporasi"],
    correctAnswerIndex: 0,
    explanation: "Radiasi adalah perpindahan kalor melalui pancaran gelombang elektromagnetik tanpa zat perantara."
  },
  {
    id: "ipa-10",
    question: "Ekologi: Organisme dalam rantai makanan yang mampu memproduksi makanannya sendiri disebut...",
    options: ["Produsen autotrof", "Konsumen primer", "Pengurai dekomposer", "Detritivor"],
    correctAnswerIndex: 0,
    explanation: "Produsen autotrof (seperti tumbuhan berklorofil) mengolah energi anorganik menjadi bahan organik."
  }
];

// ============================================================================
// 4. BANK SOAL PAI & AL-QUR'AN (10 SOAL BERVARIASI)
// ============================================================================
export const QUIZ_BANK_PAI: GameQuestion[] = [
  {
    id: "pai-1",
    question: "Tajwid: Hukum nun sukun atau tanwin bertemu huruf Ba (ب) adalah...",
    options: ["Iqlab", "Idzhar Halqi", "Idgham Bighunnah", "Ikhfa Haqiqi"],
    correctAnswerIndex: 0,
    explanation: "Hukum Iqlab mengubah bunyi nun mati/tanwin menjadi mim disertai dengungan saat bertemu huruf Ba."
  },
  {
    id: "pai-2",
    question: "Tajwid: Apabila nun sukun bertemu huruf Ya (ي), Nun (ن), Mim (م), atau Waw (و), hukumnya adalah...",
    options: ["Idgham Bighunnah", "Idgham Bilaghunnah", "Ikhfa Syafawi", "Idzhar Mutlaq"],
    correctAnswerIndex: 0,
    explanation: "Keempat huruf Yanmu dibaca melebur disertai dengung (Idgham Bighunnah)."
  },
  {
    id: "pai-3",
    question: "Sifat Rasul: Sifat wajib bagi para Rasul yang bermakna 'selalu menyampaikan kebenaran wahyu' adalah...",
    options: ["Tabligh", "Shiddiq", "Amanah", "Fathonah"],
    correctAnswerIndex: 0,
    explanation: "Tabligh bermakna menyampaikan wahyu Allah SWT kepada umat manusia tanpa ada yang disembunyikan."
  },
  {
    id: "pai-4",
    question: "Fiqh Zakat: Zakat jiwa yang wajib dikeluarkan menjelang sholat Idul Fitri untuk menyucikan diri adalah...",
    options: ["Zakat Fitrah", "Zakat Mal", "Zakat Perniagaan", "Zakat Pertanian"],
    correctAnswerIndex: 0,
    explanation: "Zakat Fitrah adalah zakat fardhu bagi setiap muslim pada bulan Ramadhan hingga sebelum Idul Fitri."
  },
  {
    id: "pai-5",
    question: "Ulumul Quran: Surah Al-Qur'an yang dijuluki Ummul Kitab dan wajib dibaca pada setiap rakaat sholat adalah...",
    options: ["Surah Al-Fatihah", "Surah Al-Baqarah", "Surah Yasin", "Surah Al-Ikhlas"],
    correctAnswerIndex: 0,
    explanation: "Surah Al-Fatihah adalah pembuka dan induk Al-Kitab yang memuat pokok-pokok aqidah Islam."
  },
  {
    id: "pai-6",
    question: "Tarikh Islam: Sahabat Nabi SAW yang menjadi Khalifah pertama memimpin umat Islam adalah...",
    options: ["Abu Bakar Ash-Shiddiq r.a.", "Umar bin Khattab r.a.", "Utsman bin Affan r.a.", "Ali bin Abi Thalib r.a."],
    correctAnswerIndex: 0,
    explanation: "Abu Bakar Ash-Shiddiq r.a. adalah khalifah pertama dari Khulafaur Rasyidin (632-634 M)."
  },
  {
    id: "pai-7",
    question: "Tajwid: Berapakah panjang ketukan harakat Mad Wajib Muttashil ketika washal menurut riwayat Hafsh?",
    options: ["4 atau 5 harakat", "2 harakat", "6 harakat penuh", "1 harakat"],
    correctAnswerIndex: 0,
    explanation: "Mad Wajib Muttashil dibaca panjang 4 atau 5 harakat pada saat washal."
  },
  {
    id: "pai-8",
    question: "Akhlak Mulia: Sikap menahan amarah, lapang dada, dan memaafkan kesalahan orang lain mencerminkan akhlak...",
    options: ["Pemaaf dan Sabar", "Takabur", "Riya", "Hasad"],
    correctAnswerIndex: 0,
    explanation: "Sikap pemaaf dan sabar merupakan akhlak terpuji yang sangat ditekankan dalam ajaran Islam."
  },
  {
    id: "pai-9",
    question: "Rukun Iman: Rukun Iman yang ke-5 dalam ajaran Islam adalah meyakini adanya...",
    options: ["Hari Kiamat / Akhir", "Malaikat Allah", "Kitab-Kitab Allah", "Qada dan Qadar"],
    correctAnswerIndex: 0,
    explanation: "Urutan rukun iman: 1) Allah, 2) Malaikat, 3) Kitab, 4) Rasul, 5) Hari Akhir, 6) Qada dan Qadar."
  },
  {
    id: "pai-10",
    question: "Hadits Ilmu: 'Tholabul 'ilmi fariidhotun 'alaa kulli muslim' menegaskan bahwa menuntut ilmu hukumnya...",
    options: ["Wajib bagi setiap muslim", "Sunnah muakkad", "Mubah", "Fardhu kifayah semata"],
    correctAnswerIndex: 0,
    explanation: "Hadits riwayat Ibnu Majah ini menegaskan kewajiban fardhu menuntut ilmu bagi setiap pribadi muslim."
  }
];

export const QUIZ_BANK_BAHASA_INDONESIA: GameQuestion[] = [
  {
    id: "ind-1",
    question: "Gaya Bahasa: 'Angin malam berbisik lembut menyapa lamunanku.' Kalimat ini menggunakan majas...",
    options: ["Personifikasi", "Metafora", "Hiperbola", "Simile"],
    correctAnswerIndex: 0,
    explanation: "Personifikasi adalah gaya bahasa yang melekatkan sifat insani/manusiawi kepada benda mati atau fenomena alam."
  },
  {
    id: "ind-2",
    question: "Kata Baku: Manakah penulisan kata baku yang benar menurut Kamus Besar Bahasa Indonesia (KBBI)?",
    options: ["Apotek dan Kuitansi", "Apotik dan Kwitansi", "Apotik dan Kuitansi", "Apotek dan Kwitansi"],
    correctAnswerIndex: 0,
    explanation: "Bentuk baku menurut KBBI adalah 'apotek' (bukan apotik) dan 'kuitansi' (bukan kwitansi)."
  },
  {
    id: "ind-3",
    question: "Unsur Intrinsik: Pesan moral atau pelajaran budi pekerti yang ingin disampaikan pengarang dalam suatu cerita disebut...",
    options: ["Amanat", "Tema", "Alur", "Latar"],
    correctAnswerIndex: 0,
    explanation: "Amanat adalah pesan moral atau nilai edukasi yang disampaikan pengarang kepada pembaca melalui karyanya."
  },
  {
    id: "ind-4",
    question: "Kalimat Efektif: Kalimat yang hemat kata dan memenuhi kaidah tata bahasa Indonesia yang baik adalah...",
    options: [
      "Para siswa sedang berdiskusi di ruang perpustakaan.",
      "Para siswa-siswa sekalian sedang berdiskusi di dalam perpustakaan.",
      "Siswa-siswa banyak yang berdiskusi di ruang perpustakaan.",
      "Para hadirin semua siswa berdiskusi di ruang perpustakaan."
    ],
    correctAnswerIndex: 0,
    explanation: "'Para siswa sedang berdiskusi...' adalah kalimat efektif yang tidak melakukan pemborosan kata (pleonasme)."
  },
  {
    id: "ind-5",
    question: "Ide Pokok: Kalimat utama yang letaknya berada di awal paragraf dinamakan jenis paragraf...",
    options: ["Deduktif", "Induktif", "Campuran", "Naratif"],
    correctAnswerIndex: 0,
    explanation: "Paragraf deduktif menempatkan gagasan utama atau kalimat utama di awal paragraf, lalu diikuti penjelasan khusus."
  },
  {
    id: "ind-6",
    question: "Ejaan (EYD): Penulisan huruf kapital yang benar untuk judul karangan ilmiah adalah...",
    options: [
      "Peran Pendidikan Karakter di Era Digital",
      "Peran Pendidikan Karakter Di Era Digital",
      "Peran pendidikan karakter di era digital",
      "PERAN PENDIDIKAN KARAKTER di ERA DIGITAL"
    ],
    correctAnswerIndex: 0,
    explanation: "Huruf pertama setiap kata judul ditulis kapital, kecuali kata tugas seperti 'di' yang tidak di awal judul."
  }
];

// ============================================================================
// PEMETAAN DICTIONARY STRICT SESUAI SUBJECT
// ============================================================================
export const QUIZ_BANK_BY_SUBJECT: Record<string, GameQuestion[]> = {
  "Bahasa Indonesia": QUIZ_BANK_BAHASA_INDONESIA,
  "Bahasa Inggris": QUIZ_BANK_BAHASA_INGGRIS,
  "Matematika": QUIZ_BANK_MATEMATIKA,
  "IPA Terpadu": QUIZ_BANK_IPA_TERPADU,
  "Fisika": QUIZ_BANK_IPA_TERPADU,
  "PAI & Al-Qur'an": QUIZ_BANK_PAI,
  "Pendidikan Agama Islam": QUIZ_BANK_PAI,
  "Bahasa Arab": [
    {
      id: "arb-1",
      question: "Kosakata: Apakah arti kata 'مَدْرَسَةٌ' (Madrasatun) dalam bahasa Indonesia?",
      options: ["Sekolah / Madrasah", "Rumah Sakit", "Perpustakaan", "Pasar"],
      correctAnswerIndex: 0,
      explanation: "Madrasatun berarti sekolah atau madrasah tempat belajar mengajar."
    },
    {
      id: "arb-2",
      question: "Dhomir: Kata ganti untuk 'Dia seorang laki-laki' dalam tata bahasa Arab adalah...",
      options: ["هُوَ (Huwa)", "هِيَ (Hiya)", "أَنْتَ (Anta)", "نَحْنُ (Nahnu)"],
      correctAnswerIndex: 0,
      explanation: "Huwa adalah kata ganti tunggal pihak ketiga laki-laki (dia seorang laki-laki)."
    }
  ]
};

// Helper function untuk mengambil bank soal yang PASTI sesuai subject
export function getQuizQuestionsBySubject(subject: string, count: number = 10): GameQuestion[] {
  const targetKey = Object.keys(QUIZ_BANK_BY_SUBJECT).find((k) =>
    k.toLowerCase() === subject.toLowerCase() || subject.toLowerCase().includes(k.toLowerCase())
  );
  const list = targetKey ? QUIZ_BANK_BY_SUBJECT[targetKey] : QUIZ_BANK_IPA_TERPADU;
  return list.slice(0, count);
}

// ============================================================================
// 5. DATA KARTU MEMORY MATCH (6 PASANG = 12 KARTU)
// ============================================================================
export interface MemoryCard {
  id: number;
  pairId: string;
  label: string;
  icon: string;
  subtext: string;
}

export const MEMORY_MATCH_CARDS: MemoryCard[] = [
  { id: 1, pairId: "atom", label: "Atom & Energi", icon: "⚛️", subtext: "Fisika MTs" },
  { id: 2, pairId: "atom", label: "Atom & Energi", icon: "⚛️", subtext: "Fisika MTs" },
  { id: 3, pairId: "dna", label: "DNA Genetik", icon: "🧬", subtext: "Biologi MTs" },
  { id: 4, pairId: "dna", label: "DNA Genetik", icon: "🧬", subtext: "Biologi MTs" },
  { id: 5, pairId: "quran", label: "Al-Qur'an", icon: "📖", subtext: "PAI & Adab" },
  { id: 6, pairId: "quran", label: "Al-Qur'an", icon: "📖", subtext: "PAI & Adab" },
  { id: 7, pairId: "math", label: "Aljabar Logika", icon: "📐", subtext: "Matematika" },
  { id: 8, pairId: "math", label: "Aljabar Logika", icon: "📐", subtext: "Matematika" },
  { id: 9, pairId: "english", label: "Global Vocab", icon: "⭐", subtext: "English" },
  { id: 10, pairId: "english", label: "Global Vocab", icon: "⭐", subtext: "English" },
  { id: 11, pairId: "leaf", label: "Fotosintesis", icon: "🌿", subtext: "Ekosistem" },
  { id: 12, pairId: "leaf", label: "Fotosintesis", icon: "🌿", subtext: "Ekosistem" },
];

// ============================================================================
// 6. SOAL PERTANYAAN TIC-TAC-TOE EDUKASI (9 KOTAK STRATEGIS)
// ============================================================================
export const TICTACTOE_QUESTIONS: GameQuestion[] = [
  {
    id: "ttt-1",
    question: "Kotak 1: Berapakah hasil dari perkalian 15 × 8?",
    options: ["120", "110", "125", "130"],
    correctAnswerIndex: 0,
    explanation: "15 × 8 = 120."
  },
  {
    id: "ttt-2",
    question: "Kotak 2: Siapakah ilmuwan muslim peletak dasar ilmu Aljabar?",
    options: ["Al-Khawarizmi", "Ibnu Sina", "Al-Biruni", "Al-Kindi"],
    correctAnswerIndex: 0,
    explanation: "Al-Khawarizmi adalah matematikawan muslim penemu konsep Aljabar dan Algoritma."
  },
  {
    id: "ttt-3",
    question: "Kotak 3: Apa arti kata bahasa Inggris 'KNOWLEDGE'?",
    options: ["Pengetahuan / Ilmu", "Kekuatan", "Keberanian", "Kebaikan"],
    correctAnswerIndex: 0,
    explanation: "Knowledge berarti ilmu atau pengetahuan."
  },
  {
    id: "ttt-4",
    question: "Kotak 4: Hukum I Newton dikenal juga sebagai Hukum...",
    options: ["Kelembaman (Inersia)", "Aksi Reaksi", "Gravitasi", "Pascal"],
    correctAnswerIndex: 0,
    explanation: "Hukum I Newton menyatakan kecenderungan benda mempertahankan keadaannya."
  },
  {
    id: "ttt-5",
    question: "Kotak 5: Berapakah nilai dari akar kuadrat √144?",
    options: ["12", "14", "16", "11"],
    correctAnswerIndex: 0,
    explanation: "12 × 12 = 144, jadi √144 = 12."
  },
  {
    id: "ttt-6",
    question: "Kotak 6: Hewan pemakan tumbuhan dalam istilah biologi disebut...",
    options: ["Herbivora", "Karnivora", "Omnivora", "Insektivora"],
    correctAnswerIndex: 0,
    explanation: "Herbivora adalah kelompok hewan pemakan tumbuhan."
  },
  {
    id: "ttt-7",
    question: "Kotak 7: Hukum mim mati bertemu Ba (ب) disebut...",
    options: ["Ikhfa Syafawi", "Idgham Mimi", "Idzhar Syafawi", "Iqlab"],
    correctAnswerIndex: 0,
    explanation: "Mim sukun bertemu Ba dibaca samar berdengung (Ikhfa Syafawi)."
  },
  {
    id: "ttt-8",
    question: "Kotak 8: Bentuk lampau (Past Simple) dari kata kerja 'GO' adalah...",
    options: ["went", "gone", "goes", "going"],
    correctAnswerIndex: 0,
    explanation: "Bentuk Verb 2 dari 'go' adalah 'went'."
  },
  {
    id: "ttt-9",
    question: "Kotak 9: Volume kubus dengan panjang rusuk 5 cm adalah...",
    options: ["125 cm³", "25 cm³", "100 cm³", "150 cm³"],
    correctAnswerIndex: 0,
    explanation: "Volume kubus = s³ = 5 × 5 × 5 = 125 cm³."
  }
];
