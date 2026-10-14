"use client";

import React, { useEffect, useRef } from "react";
import Link from "next/link";
import Image from "next/image";
import Navbar from "@/components/common/Navbar";
import CinematicBackground from "@/components/common/CinematicBackground";
import ScrollReveal3D from "@/components/common/ScrollReveal3D";
import Footer from "@/components/common/Footer";
import {
  Compass,
  Sparkles,
  Cpu,
  CheckCircle2,
  Award,
  Users,
  User,
  Bot,
  Gamepad2,
  Layers,
  GraduationCap,
  ShieldCheck,
  TrendingUp,
  BrainCircuit,
  BookOpen,
  Camera,
  Star,
  Tv,
  MonitorCheck,
  Check,
  Tag,
  Languages,
  Palette,
  Target,
  FileCheck,
  Building,
  School,
  Hexagon,
} from "lucide-react";

export default function HomePage() {
  // High-performance Interactive Mouse Spotlight (Cursor Glow) for Hero Section
  const heroRef = useRef<HTMLElement>(null);
  const glowRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const rafId = useRef<number | null>(null);

  useEffect(() => {
    const heroEl = heroRef.current;
    if (!heroEl) return;

    const handleMouseMove = (e: MouseEvent) => {
      const rect = heroEl.getBoundingClientRect();
      mousePos.current = {
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      };

      if (!rafId.current) {
        rafId.current = requestAnimationFrame(() => {
          if (glowRef.current) {
            glowRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
            glowRef.current.style.opacity = "1";
          }
          rafId.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      if (glowRef.current) {
        glowRef.current.style.opacity = "0";
      }
    };

    heroEl.addEventListener("mousemove", handleMouseMove, { passive: true });
    heroEl.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      heroEl.removeEventListener("mousemove", handleMouseMove);
      heroEl.removeEventListener("mouseleave", handleMouseLeave);
      if (rafId.current) {
        cancelAnimationFrame(rafId.current);
      }
    };
  }, []);

  // Data for Struktur Organisasi: Category 1 (Pengurus Yayasan & SIM)
  const pengurusYayasan = [
    {
      id: "p-1",
      name: "Cikwung Rusiana A.B",
      role: "Dewan Yayasan",
      relationBadge: "Dewan Yayasan (YYS-202601)",
      bio: "Memimpin perumusan visi strategis, tata kelola kelembagaan, serta supervisi mutu pendidikan terpadu di seluruh unit yayasan.",
      accent: "border-[#ffbf00] bg-amber-50/40",
      badgeColor: "bg-[#ffbf00] text-slate-950 font-bold",
      iconBg: "bg-[#ffbf00]/20 text-slate-950 border border-[#ffbf00]/40",
    },
    {
      id: "p-2",
      name: "Azidni Taftazani A.I",
      role: "Operator SIM & Keuangan",
      relationBadge: "Operator Utama (OP-202601)",
      bio: "Mengelola integrasi data akademik, rekonsiliasi kasir administrasi terpadu, infrastruktur server, dan validasi biometrik presensi madrasah.",
      accent: "border-[#0cc0df] bg-cyan-50/40",
      badgeColor: "bg-[#0cc0df] text-slate-950 font-bold",
      iconBg: "bg-[#0cc0df]/20 text-[#007f96] border border-[#0cc0df]/40",
    },
  ];

  // Data for Struktur Organisasi: Category 2 (Kepala Sekolah)
  const kepalaSekolah = [
    {
      id: "ks-1",
      name: "Dwi Vivivn",
      role: "Kepala Sekolah RA",
      unit: "Raudhatul Athfal (RA) As Sa'adah",
      focus: "Pengembangan sensori motorik, pengenalan tahfidz juz 30 ceria, dan pembiasaan adab Islami sejak dini (ID: KS-RA-001).",
      badge: "Jenjang RA / PAUD",
    },
    {
      id: "ks-2",
      name: "Merlisa Ayu Dwi",
      role: "Kepala Sekolah SD",
      unit: "SD Islam As Sa'adah",
      focus: "Penguatan literasi numerasi dasar, integrasi kurikulum sains Al-Qur'an, dan bimbingan kepribadian santri (ID: KS-SD-001).",
      badge: "Jenjang SD Islam",
    },
    {
      id: "ks-3",
      name: "Nur Naimah",
      role: "Kepala Sekolah MTs",
      unit: "Madrasah Tsanawiyah (MTs) As Sa'adah",
      focus: "Akselerasi kesiapan kompetisi sains madrasah (KSM/OSN), riset teknologi digital, dan kepemimpinan santri modern (ID: KS-MTS-001).",
      badge: "Jenjang MTs",
    },
  ];

  // Data for Struktur Organisasi: Category 3 (Tenaga Pendidik)
  const tenagaPendidik = [
    {
      id: "tp-1",
      name: "Merlisa Ayu Dwi",
      role: "Pengampu & Pimpinan SD",
      subject: "Matematika & Literasi Dasar SD",
      jenjang: "SD",
      badge: "Kepala Sekolah SD",
    },
    {
      id: "tp-2",
      name: "Nur Naimah",
      role: "Pengampu & Pimpinan MTs",
      subject: "Sains Terpadu & Riset MTs",
      jenjang: "MTs",
      badge: "Kepala Sekolah MTs",
    },
    {
      id: "tp-3",
      name: "Dwi Vivivn",
      role: "Pengampu & Pimpinan RA",
      subject: "Adab, Sentra Bermain & Belajar",
      jenjang: "RA",
      badge: "Kepala Sekolah RA",
    },
    {
      id: "tp-4",
      name: "Ibu Siti Rahmawati, S.Pd",
      role: "Guru Bidang Studi",
      subject: "Bahasa Indonesia & Literasi",
      jenjang: "SD & MTs",
      badge: "Pegiat Duta Baca",
    },
    {
      id: "tp-5",
      name: "Bpk. Dimas Prasetyo, M.Eng",
      role: "Guru Spesialis",
      subject: "Informatika, Robotik & AI",
      jenjang: "MTs",
      badge: "Lead Mentor Lab AR",
    },
    {
      id: "tp-6",
      name: "Ibu Anisa Fitriani, S.Pd",
      role: "Guru Bidang Studi",
      subject: "Bahasa Inggris & Public Speaking",
      jenjang: "MTs & SD",
      badge: "TOEFL Certified",
    },
    {
      id: "tp-7",
      name: "Ustadzah Maryam, S.Ag",
      role: "Guru Bidang Studi",
      subject: "Fiqih Ibadah & Al-Qur'an Hadits",
      jenjang: "SD & RA",
      badge: "Khadimah Qur'ani",
    },
    {
      id: "tp-8",
      name: "Bpk. Rizky Fadilah, S.Pd",
      role: "Guru Bidang Studi",
      subject: "Biologi & Konservasi Lingkungan",
      jenjang: "MTs & SD",
      badge: "Pembina Adiwiyata",
    },
    {
      id: "tp-9",
      name: "Ibu Dewi Kartika, S.Si",
      role: "Guru Bidang Studi",
      subject: "Kimia Dasar & Eksperimen Virtual",
      jenjang: "MTs",
      badge: "Fasilitator Modul",
    },
    {
      id: "tp-10",
      name: "Bpk. Faisal Rahman, S.Or",
      role: "Guru Bidang Studi",
      subject: "Olahraga, Kesehatan & Kepanduan Pramuka",
      jenjang: "SD & MTs",
      badge: "Pelatih Berlisensi",
    },
  ];

  // Course Categories for "Les Privat & Reguler"
  const tutoringCategories = [
    {
      id: "cat-1",
      title: "Akademik: Mapel Umum",
      levelBadge: "Jenjang RA / SD / MTs",
      description: "Pendampingan intensif mata pelajaran Matematika, IPA Sains Terpadu, Bahasa Indonesia, dan PAI untuk penguasaan konsep tuntas & persiapan ujian sekolah.",
      icon: BookOpen,
      highlights: ["Matematika Cepat & Logika", "IPA Eksperimen & Konsep", "Bimbingan PR & Tugas Harian"],
      tagColor: "bg-[#ffbf00]/20 text-slate-900 border-[#ffbf00]/40",
    },
    {
      id: "cat-2",
      title: "Digital Skills",
      levelBadge: "Keterampilan Abad 21",
      description: "Penguasaan keahlian komputasi modern langsung praktik: Desain Grafis, Video Editing kreatif, Microsoft Office produktif, serta fundamental UI/UX.",
      icon: Palette,
      highlights: ["Desain Grafis (Canva & Photoshop)", "Video Editing (CapCut & Premiere)", "Microsoft Office & Dasar UI/UX"],
      tagColor: "bg-[#0cc0df]/20 text-[#0cc0df] border-[#0cc0df]/40",
    },
    {
      id: "cat-3",
      title: "Multilingual",
      levelBadge: "Bahasa & Al-Qur'an",
      description: "Program dwibahasa aktif untuk komunikasi global Bahasa Inggris (Speaking & Grammar) dipadukan dengan bimbingan metode cepat membaca Iqro' hingga Al-Qur'an bertajwid.",
      icon: Languages,
      highlights: ["English for Kids & Teens", "Tahsin & Tartil Al-Qur'an", "Iqro' Cepat Mandiri"],
      tagColor: "bg-emerald-100 text-emerald-800 border-emerald-300",
    },
    {
      id: "cat-4",
      title: "Persiapan Lanjutan",
      levelBadge: "Tes Potensi & Kompetisi",
      description: "Klinik bimbingan strategis untuk Tes Kemampuan Akademik (TKA), persiapan kompetisi sains madrasah, dan fondasi awal penalaran analitis SNBT.",
      icon: Target,
      highlights: ["Drilling Soal TKA Terstandar", "Tryout SNBT Terjadwal", "Bedah Trik Cepat Nalar"],
      tagColor: "bg-purple-100 text-purple-900 border-purple-300",
    },
  ];

  // Facilities list for Tutoring Program
  const tutoringFacilities = [
    { label: "Sertifikat Resmi", icon: Award },
    { label: "Modul & Lembar Kerja Eksklusif", icon: FileCheck },
    { label: "Mentor Ahli & Berpengalaman", icon: User },
    { label: "Free Konsultasi Belajar 24/7", icon: Bot },
    { label: "TV Interaktif & Smart Display", icon: Tv },
  ];

  return (
    <CinematicBackground>
      <div className="min-h-screen flex flex-col text-slate-100 overflow-x-hidden">
      <Navbar />

      <main className="flex-1 space-y-12 md:space-y-16">
        {/* ========================================================= */}
        {/* 1. ULTRA-MINIMALIST DEAD-CENTER HERO SECTION             */}
        {/* ========================================================= */}
        <section
          ref={heroRef}
          className="relative min-h-screen flex flex-col items-center justify-center text-center px-4 sm:px-6 lg:px-8 select-none overflow-hidden pt-20"
        >
          {/* Subtle Radial Vignette for Supreme Foreground Legibility */}
          <div className="absolute inset-0 bg-radial from-transparent via-black/30 to-black/80 pointer-events-none z-[1]" />

          {/* Centered Vertical Stack Container */}
          <div className="relative z-10 max-w-5xl mx-auto flex flex-col items-center justify-center my-auto px-4">
            
            {/* 1. OFFICIAL TRANSPARENT LOGO */}
            <div className="overflow-hidden mb-4">
              <div className="animate-mask-reveal flex justify-center">
                <Image
                  src="/logo.png"
                  alt="Logo Yayasan"
                  width={90}
                  height={90}
                  className="object-contain mb-4 drop-shadow-xl"
                  priority
                />
              </div>
            </div>

            {/* 2. SPLIT TYPOGRAPHY HIERARCHY */}
            {/* Line 1 (Top Text): "YAYASAN PENDIDIKAN ISLAM" */}
            <div className="overflow-hidden mb-1 sm:mb-2">
              <div className="animate-mask-reveal animation-delay-200">
                <p className="text-sm md:text-base tracking-[0.4em] font-medium text-[#ffbf00] uppercase leading-relaxed">
                  YAYASAN PENDIDIKAN ISLAM
                </p>
              </div>
            </div>

            {/* Line 2 (Bottom Text): "AS SA'ADAH" */}
            <div className="overflow-hidden py-1 max-w-full">
              <div className="animate-mask-reveal animation-delay-350">
                <h1 className="text-6xl md:text-8xl lg:text-[10rem] font-black tracking-tighter text-white uppercase leading-none select-none drop-shadow-[0_25px_60px_rgba(0,0,0,0.95)]">
                  AS SA&apos;ADAH
                </h1>
              </div>
            </div>

            {/* 3. SHORT DESCRIPTION: Directly below "AS SA'ADAH" */}
            <div className="overflow-hidden max-w-2xl mt-6 px-2">
              <div className="animate-mask-reveal animation-delay-500">
                <p className="text-gray-400 mt-6 max-w-2xl text-center text-sm sm:text-base md:text-lg font-normal leading-relaxed text-balance">
                  Ekosistem pendidikan terpadu jenjang RA, SD, dan MTs. Mengintegrasikan kurikulum unggulan, tutor personal multi-agent AI, gamifikasi kuis interaktif, serta sistem ERP tata usaha modern.
                </p>
              </div>
            </div>

            {/* 4. TECH PARTNER SIGNATURE: "Engineered by SVA Dev." */}
            <div className="overflow-hidden mt-12">
              <div className="animate-mask-reveal animation-delay-650">
                <div className="mt-12 text-sm text-gray-500 font-medium text-center">
                  Engineered by <span className="text-white font-semibold">SVA Dev.</span>
                </div>
              </div>
            </div>

          </div>
        </section>

        {/* TRUST / METRICS PILL BAR WITH 3D SCROLL REVEAL BRIDGING INTO VISI MISI */}
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 -mt-6 sm:-mt-8 relative z-20">
          <ScrollReveal3D rotateX={8} rotateY={0} y={25} duration={0.75}>
            <div className="p-5 sm:p-6 rounded-2xl sm:rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-2xl grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
              {[
                { label: "Santri & Siswa Aktif", val: "840+", sub: "Jenjang RA, SD & MTs" },
                { label: "Akreditasi Madrasah", val: "Grade A", sub: "BAN-S/M Unggul" },
                { label: "Modul & Kuis Digital", val: "2.400+", sub: "Kurikulum Terpadu" },
                { label: "Sistem ERP Terpusat", val: "SIM 24/7", sub: "Absensi & Keuangan" },
              ].map((stat, i) => (
                <div
                  key={i}
                  className="p-3.5 sm:p-4 rounded-2xl bg-white/[0.03] border border-white/5 text-center"
                >
                  <span className="text-2xl sm:text-3xl lg:text-4xl font-black text-white block">
                    {stat.val}
                  </span>
                  <span className="text-xs font-bold text-[#0cc0df] block mt-1 break-words">
                    {stat.label}
                  </span>
                  <span className="text-[11px] text-slate-400 block mt-1 break-words">
                    {stat.sub}
                  </span>
                </div>
              ))}
            </div>
          </ScrollReveal3D>
        </div>

        {/* 2. FOUNDATION VISION & MISSION (WITH 3D SCROLL REVEAL & GENEROUS PADDING) */}
        <section id="visi-misi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
          <ScrollReveal3D rotateX={10} rotateY={-4} y={35} duration={0.8}>
            <div className="space-y-8 md:space-y-10 text-white">
              
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffbf00]/15 text-[#ffbf00] text-xs font-bold border border-[#ffbf00]/30">
                  <Compass className="w-3.5 h-3.5" />
                  <span>Landasan Filosofi & Cita-Cita Yayasan</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
                  Visi &amp; Misi Yayasan Pendidikan Islam (YPI) As Sa&apos;adah
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-balance">
                  Meneguhkan komitmen pendidikan berkualitas berlandaskan nilai-nilai luhur keislaman, keilmuan mutakhir, dan adaptasi teknologi cerdas untuk generasi bangsa.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-stretch">
                {/* Card Visi */}
                <ScrollReveal3D delay={0.1} rotateX={8} rotateY={-4} y={30} duration={0.75} className="h-full">
                  <div className="h-full flex flex-col relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#ffbf00]/50 transition-all group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#ffbf00]/10 rounded-full blur-2xl group-hover:bg-[#ffbf00]/20 transition-all" />
                    <div className="relative space-y-4 flex-1 flex flex-col">
                      <div className="w-12 h-12 rounded-xl bg-[#ffbf00]/20 border border-[#ffbf00]/40 flex items-center justify-center text-[#ffbf00]">
                        <Sparkles className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide">
                        Visi Utama Yayasan
                      </h3>
                      <p className="text-sm text-slate-300 leading-relaxed italic border-l-2 border-[#ffbf00] pl-4 text-balance break-words flex-1">
                        &ldquo;Mewujudkan lembaga pendidikan Islam unggul yang melahirkan generasi berakhlakul karimah, berwawasan global, menguasai sains dan teknologi masa depan, serta mandiri berlandaskan Al-Qur&apos;an dan As-Sunnah.&rdquo;
                      </p>
                    </div>
                  </div>
                </ScrollReveal3D>

                {/* Card Misi */}
                <ScrollReveal3D delay={0.2} rotateX={8} rotateY={4} y={30} duration={0.75} className="h-full">
                  <div className="h-full flex flex-col relative p-8 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#0cc0df]/50 transition-all group overflow-hidden">
                    <div className="absolute top-0 right-0 w-32 h-32 bg-[#0cc0df]/10 rounded-full blur-2xl group-hover:bg-[#0cc0df]/20 transition-all" />
                    <div className="relative space-y-4 flex-1 flex flex-col">
                      <div className="w-12 h-12 rounded-xl bg-[#0cc0df]/20 border border-[#0cc0df]/40 flex items-center justify-center text-[#0cc0df]">
                        <Target className="w-6 h-6" />
                      </div>
                      <h3 className="text-xl font-bold text-white tracking-wide">
                        Misi Strategis Pendidikan
                      </h3>
                      <ul className="space-y-3 text-xs sm:text-sm text-slate-300 flex-1">
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#0cc0df] shrink-0 mt-0.5" />
                          <span className="break-words">Menyelenggarakan pendidikan formal berkarakter Islami dari jenjang usia dini hingga menengah pertama.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#0cc0df] shrink-0 mt-0.5" />
                          <span className="break-words">Mengintegrasikan platform kecerdasan buatan (SVA Dev AI) untuk mempersonalisasi kecepatan belajar tiap anak.</span>
                        </li>
                        <li className="flex items-start gap-2.5">
                          <CheckCircle2 className="w-4 h-4 text-[#0cc0df] shrink-0 mt-0.5" />
                          <span className="break-words">Membangun ekosistem belajar gamifikasi yang menyenangkan, inklusif, dan memotivasi eksplorasi logika.</span>
                        </li>
                      </ul>
                    </div>
                  </div>
                </ScrollReveal3D>
              </div>

              {/* 4 Pilar Keunggulan Yayasan */}
              <div className="pt-6 md:pt-8 border-t border-white/10">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider mb-4 text-center">
                  4 Pilar Pendidikan Terpadu YPI As Sa&apos;adah
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 items-stretch">
                  {[
                    {
                      title: "Pendidikan Karakter Qur'ani Terpadu",
                      desc: "Menanamkan nilai tauhid, adab Islami, dan pembiasaan ibadah praktis dalam setiap kegiatan belajar.",
                      color: "border-[#ffbf00]/30 hover:border-[#ffbf00]",
                      icon: GraduationCap,
                      iconColor: "text-[#ffbf00]",
                    },
                    {
                      title: "Pilar Kurikulum Merdeka & Sains Cerdas",
                      desc: "Mengintegrasikan kurikulum nasional dengan materi agama serta eksplorasi sains eksperimental modern (RA, SD, MTs).",
                      color: "border-[#0cc0df]/30 hover:border-[#0cc0df]",
                      icon: BrainCircuit,
                      iconColor: "text-[#0cc0df]",
                    },
                    {
                      title: "Tutor AI & Pembelajaran Gamified",
                      desc: "Memanfaatkan multi-agent AI (SVA Dev) sebagai pendamping nalar siswa dan arena kuis bertingkat.",
                      color: "border-[#ffbf00]/30 hover:border-[#ffbf00]",
                      icon: Sparkles,
                      iconColor: "text-[#ffbf00]",
                    },
                    {
                      title: "Sinergi Guru, Orang Tua & Komunitas",
                      desc: "Mewujudkan transparansi capaian akademik anak secara digital, aman, dan berorientasi masa depan.",
                      color: "border-[#0cc0df]/30 hover:border-[#0cc0df]",
                      icon: Users,
                      iconColor: "text-[#0cc0df]",
                    },
                  ].map((item, idx) => {
                    const Icon = item.icon;
                    return (
                      <ScrollReveal3D key={idx} delay={0.08 * idx} rotateX={10} y={25} duration={0.65} className="h-full">
                        <div
                          className={`h-full flex flex-col p-5 rounded-2xl bg-white/[0.02] border ${item.color} transition-all space-y-3 group`}
                        >
                          <Icon className={`w-6 h-6 ${item.iconColor} group-hover:scale-110 transition-transform`} />
                          <h5 className="font-bold text-sm text-white break-words text-balance">{item.title}</h5>
                          <p className="text-xs text-slate-400 leading-relaxed break-words flex-1">{item.desc}</p>
                        </div>
                      </ScrollReveal3D>
                    );
                  })}
                </div>
              </div>
            </div>
          </ScrollReveal3D>
        </section>

        {/* 3. NEW SECTION: LES PRIVAT & REGULER (SVA EDUQUEST WITH STAGGERED 3D WAVE CARDS) */}
        <section id="les-privat" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
          <div className="space-y-8 md:space-y-10 text-white">
            
            {/* Header Les Privat */}
            <ScrollReveal3D rotateX={10} y={30} duration={0.7}>
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0cc0df]/15 text-[#0cc0df] text-xs font-bold border border-[#0cc0df]/30">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Program Bimbingan Belajar Unggulan SVA</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
                  Les Privat &amp; Bimbingan Belajar Reguler SVA Dev
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-balance">
                  Program belajar komprehensif yang memadukan bimbingan akademik sekolah, keahlian digital masa depan, kemampuan bahasa, dan pembinaan karakter santri YPI As Sa&apos;adah.
                </p>
              </div>
            </ScrollReveal3D>

            {/* Grid 4 Kategori Kursus (Staggered 3D Wave Reveal: 0.1s, 0.25s, 0.4s, 0.55s) */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {tutoringCategories.map((cat, index) => {
                const IconComponent = cat.icon;
                const staggerDelay = 0.1 + index * 0.15; // 0.1s, 0.25s, 0.4s, 0.55s
                return (
                  <ScrollReveal3D
                    key={cat.id}
                    delay={staggerDelay}
                    rotateX={14}
                    rotateY={-8 + index * 5}
                    y={50}
                    duration={0.85}
                    className="h-full"
                  >
                    <div className="flex flex-col justify-between h-full p-6 rounded-2xl bg-white/[0.03] border border-white/10 hover:border-[#0cc0df]/60 hover:bg-white/[0.05] backdrop-blur-xl transition-all duration-300 group relative overflow-hidden">
                      <div className="space-y-4">
                        <div className="flex items-center justify-between">
                          <div className="w-12 h-12 rounded-xl bg-[#0cc0df]/15 border border-[#0cc0df]/30 flex items-center justify-center text-[#0cc0df] group-hover:scale-110 transition-transform">
                            <IconComponent className="w-6 h-6" />
                          </div>
                          <span className="text-[10px] font-bold px-2.5 py-1 rounded-full bg-white/5 border border-white/10 text-slate-300">
                            {cat.levelBadge}
                          </span>
                        </div>

                        <div>
                          <h3 className="text-base font-bold text-white group-hover:text-[#0cc0df] transition-colors break-words">
                            {cat.title}
                          </h3>
                          <p className="text-xs text-slate-400 leading-relaxed mt-2 break-words">
                            {cat.description}
                          </p>
                        </div>

                        {/* Highlights Mapel / Materi */}
                        <div className="space-y-2 pt-2 border-t border-white/5">
                          <span className="text-[11px] font-semibold text-slate-300 uppercase tracking-wider block">
                            Fokus Bimbingan:
                          </span>
                          <ul className="space-y-1.5">
                            {cat.highlights.map((h, i) => (
                              <li key={i} className="flex items-center gap-2 text-xs text-slate-300">
                                <Check className="w-3.5 h-3.5 text-[#ffbf00] shrink-0" />
                                <span className="break-words">{h}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      </div>

                      <div className="pt-6 mt-4">
                        <Link
                          href="/login"
                          className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-center block bg-white/5 hover:bg-[#0cc0df] hover:text-slate-950 border border-white/10 transition-all"
                        >
                          Daftar / Masuk Portal Les
                        </Link>
                      </div>
                    </div>
                  </ScrollReveal3D>
                );
              })}
            </div>

            {/* Fasilitas & Keunggulan Les SVA (With 3D Scroll Reveal) */}
            <ScrollReveal3D delay={0.2} rotateX={8} y={30} duration={0.75}>
              <div className="pt-6 md:pt-8 border-t border-white/10 space-y-4">
                <h4 className="text-xs uppercase font-bold text-slate-400 tracking-wider text-center">
                  Fasilitas &amp; Keunggulan Pembelajaran SVA Dev
                </h4>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-4">
                  {tutoringFacilities.map((fac, idx) => {
                    const Icon = fac.icon;
                    return (
                      <div
                        key={idx}
                        className="flex flex-col items-center text-center p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ffbf00]/40 transition-all space-y-2"
                      >
                        <div className="w-10 h-10 rounded-xl bg-[#ffbf00]/10 border border-[#ffbf00]/30 flex items-center justify-center text-[#ffbf00]">
                          <Icon className="w-5 h-5" />
                        </div>
                        <span className="text-xs font-semibold text-slate-200 break-words">
                          {fac.label}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>
            </ScrollReveal3D>

          </div>
        </section>

        {/* 4. STRUKTUR ORGANISASI YAYASAN PENDIDIKAN ISLAM AS SA'ADAH (WITH 3D SCROLL REVEAL) */}
        <section id="struktur-organisasi" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 md:py-14 relative z-10">
          <div className="space-y-8 md:space-y-10 text-white">
            
            {/* Header Struktur Organisasi */}
            <ScrollReveal3D rotateX={10} y={30} duration={0.7}>
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#ffbf00]/15 text-[#ffbf00] text-xs font-bold border border-[#ffbf00]/30">
                  <School className="w-3.5 h-3.5" />
                  <span>Tata Kelola Kelembagaan Terpadu</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
                  Struktur Organisasi Yayasan Pendidikan Islam (YPI) As Sa&apos;adah
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-balance">
                  Mengenal para figur pembina, pimpinan lembaga, dan pendidik teladan yang berdedikasi membimbing santri mencapai prestasi dunia dan akhirat.
                </p>
              </div>
            </ScrollReveal3D>

            {/* KATEGORI 1: PENGURUS YAYASAN (PASUTRI) */}
            <div className="space-y-6">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <Building className="w-5 h-5 text-[#ffbf00]" />
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Pengurus &amp; Pimpinan Yayasan
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  (Dewan Pembina dan Pengurus Utama YPI As Sa&apos;adah)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {pengurusYayasan.map((leader, i) => (
                  <ScrollReveal3D key={leader.id} delay={0.15 * i} rotateX={10} rotateY={i === 0 ? -4 : 4} y={35} duration={0.8}>
                    <div className="h-full p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#ffbf00]/50 transition-all space-y-4 relative overflow-hidden group">
                      <div className="flex items-start justify-between gap-4">
                        <div className="flex items-center gap-4">
                          <div className="w-14 h-14 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-300 font-bold text-lg shrink-0">
                            <User className="w-7 h-7 text-[#ffbf00]" />
                          </div>
                          <div>
                            <h4 className="font-bold text-base text-white break-words">{leader.name}</h4>
                            <span className="text-xs font-semibold text-[#0cc0df] block mt-0.5 break-words">
                              {leader.role}
                            </span>
                          </div>
                        </div>
                        <span className="text-[10px] font-bold px-3 py-1 rounded-full bg-[#ffbf00]/20 text-[#ffbf00] border border-[#ffbf00]/30 shrink-0">
                          {leader.relationBadge}
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5 break-words">
                        {leader.bio}
                      </p>
                    </div>
                  </ScrollReveal3D>
                ))}
              </div>
            </div>

            {/* KATEGORI 2: KEPALA SATUAN PENDIDIKAN */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <GraduationCap className="w-5 h-5 text-[#0cc0df]" />
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Kepala Satuan Pendidikan
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  (Pimpinan unit madrasah dari jenjang RA, SD, hingga MTs)
                </span>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {kepalaSekolah.map((ks, i) => (
                  <ScrollReveal3D key={ks.id} delay={0.12 * i} rotateX={10} y={30} duration={0.75}>
                    <div className="h-full p-6 rounded-2xl bg-white/[0.02] border border-white/10 hover:border-[#0cc0df]/50 transition-all space-y-3 group flex flex-col justify-between">
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <span className="text-[10px] font-bold px-2.5 py-0.5 rounded-full bg-[#0cc0df]/15 text-[#0cc0df] border border-[#0cc0df]/30">
                            {ks.badge}
                          </span>
                          <School className="w-4 h-4 text-slate-400 group-hover:text-[#0cc0df] transition-colors" />
                        </div>
                        <div>
                          <h4 className="font-bold text-sm text-white break-words">{ks.name}</h4>
                          <p className="text-xs font-semibold text-[#ffbf00] mt-0.5 break-words">{ks.role}</p>
                          <p className="text-[11px] text-slate-400 break-words">{ks.unit}</p>
                        </div>
                      </div>
                      <p className="text-xs text-slate-400 leading-relaxed pt-2 border-t border-white/5 break-words">
                        {ks.focus}
                      </p>
                    </div>
                  </ScrollReveal3D>
                ))}
              </div>
            </div>

            {/* KATEGORI 3: TENAGA PENDIDIK & TUTOR TELADAN */}
            <div className="space-y-4 pt-4">
              <div className="flex items-center gap-3 border-b border-white/10 pb-3">
                <Award className="w-5 h-5 text-[#ffbf00]" />
                <h3 className="text-lg font-bold text-white tracking-wide">
                  Tenaga Pendidik &amp; Tutor Teladan
                </h3>
                <span className="text-xs text-slate-400 hidden sm:inline">
                  (Dewan asatidz dan pendidik kompeten bidang agama, sains, dan bahasa)
                </span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
                {tenagaPendidik.map((guru, i) => (
                  <ScrollReveal3D key={guru.id} delay={0.05 * i} rotateX={8} y={20} duration={0.65}>
                    <div className="h-full p-4 rounded-2xl bg-white/[0.02] border border-white/5 hover:border-[#ffbf00]/40 transition-all space-y-2 group flex flex-col justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center justify-between">
                          <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-xs font-bold text-slate-300">
                            {guru.name.charAt(0)}
                          </div>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded-full bg-white/5 border border-white/10 text-slate-300">
                            {guru.badge}
                          </span>
                        </div>
                        <div>
                          <h4 className="font-bold text-xs text-white group-hover:text-[#ffbf00] transition-colors break-words line-clamp-1">
                            {guru.name}
                          </h4>
                          <span className="text-[11px] text-[#0cc0df] font-medium block break-words">
                            {guru.subject}
                          </span>
                        </div>
                      </div>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[10px] text-slate-400">
                        <span className="break-words">{guru.role}</span>
                        <span className="font-semibold text-slate-300">{guru.jenjang}</span>
                      </div>
                    </div>
                  </ScrollReveal3D>
                ))}
              </div>
            </div>

          </div>
        </section>

        {/* 5. ARSITEKTUR EKOSISTEM PORTAL EDQUEST (WITH 3D SCROLL REVEAL) */}
        <section id="ekosistem" className="max-w-7xl mx-auto px-4 sm:px-8 md:px-12 py-10 md:py-14 relative z-10">
          <ScrollReveal3D rotateX={10} rotateY={-4} y={35} duration={0.8}>
            <div className="space-y-8 md:space-y-10 text-white">
              <div className="text-center max-w-3xl mx-auto space-y-4">
                <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#0cc0df]/15 text-[#0cc0df] text-xs font-bold border border-[#0cc0df]/30">
                  <BrainCircuit className="w-3.5 h-3.5" />
                  <span>Teknologi SVA Dev 4.0</span>
                </div>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight leading-tight text-balance">
                  Arsitektur Pembelajaran &amp; Tata Usaha Terpadu
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 leading-relaxed text-balance">
                  Dirancang secara komprehensif untuk menyatukan kurikulum keislaman, kurikulum merdeka nasional, serta daya dukung AI pada jenjang RA, SD, dan MTs.
                </p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {[
                  {
                    icon: Gamepad2,
                    title: "Arena Kuis Gamified",
                    desc: "Platform kuis interaktif dengan umpan balik instan, live rank leaderboard, dan token XP santri untuk memicu motivasi belajar mandiri.",
                    accent: "text-[#ffbf00]",
                    border: "hover:border-[#ffbf00]/50",
                    badgeBg: "bg-[#ffbf00]/20 border-[#ffbf00]/40",
                  },
                  {
                    icon: Bot,
                    title: "Multi-Agent AI Companion",
                    desc: "Tutor nalar virtual 24/7 yang membantu pemahaman dalil Al-Qur'an, kaidah fiqih, rumus eksakta, dan bimbingan literasi santri.",
                    accent: "text-[#0cc0df]",
                    border: "hover:border-[#0cc0df]/50",
                    badgeBg: "bg-[#0cc0df]/20 border-[#0cc0df]/40",
                  },
                  {
                    icon: ShieldCheck,
                    title: "Sistem ERP & RBAC Terpadu",
                    desc: "Tata kelola berjenjang untuk Guru, Kepala Sekolah, Operator pendaftaran/kasir, dan Pengurus Yayasan dengan pengamanan data terstandar.",
                    accent: "text-[#ffbf00]",
                    border: "hover:border-[#ffbf00]/50",
                    badgeBg: "bg-[#ffbf00]/20 border-[#ffbf00]/40",
                  },
                ].map((feat, i) => {
                  const Icon = feat.icon;
                  return (
                    <ScrollReveal3D key={i} delay={0.15 * i} rotateX={10} y={30} duration={0.75}>
                      <div className={`h-full p-6 sm:p-8 rounded-2xl bg-white/[0.02] border border-white/10 ${feat.border} transition-all space-y-4`}>
                        <div className={`w-12 h-12 rounded-xl ${feat.badgeBg} border flex items-center justify-center ${feat.accent}`}>
                          <Icon className="w-6 h-6" />
                        </div>
                        <h3 className="font-bold text-base sm:text-lg text-white break-words">{feat.title}</h3>
                        <p className="text-xs sm:text-sm text-slate-400 leading-relaxed break-words">{feat.desc}</p>
                      </div>
                    </ScrollReveal3D>
                  );
                })}
              </div>
            </div>
          </ScrollReveal3D>
        </section>

      </main>

      <Footer />
      </div>
    </CinematicBackground>
  );
}
