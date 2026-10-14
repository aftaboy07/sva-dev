"use client";

import React from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  ShieldCheck,
  Users,
  GraduationCap,
  CreditCard,
  Clock,
  TrendingUp,
  Building2,
  BookOpen,
  ArrowRight,
  Sparkles,
  Award,
  CheckCircle2,
  Receipt,
  ClipboardList,
  FileCheck,
} from "lucide-react";

interface TabOverviewYayasanProps {
  setActiveTab: (tab: string) => void;
}

export default function TabOverviewYayasan({ setActiveTab }: TabOverviewYayasanProps) {
  const { globalMetrics, currentUser } = useEduQuest();

  return (
    <div className="space-y-6 text-white">
      {/* Executive Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 sm:p-8 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ffbf00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffbf00]/20 border border-[#ffbf00]/40 text-[#ffbf00] text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Executive Super Admin • Dewan Pembina Yayasan</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Pusat Komando & Supervisi Eksekutif
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Selamat datang, <span className="text-[#ffbf00] font-bold">{currentUser?.name}</span>. Laporan terpadu performa seluruh unit pendidikan Yayasan Pendidikan Islam As Sa'adah (RA, SD, MTs, dan Bimbel Les) tersaji secara real-time.
          </p>
        </div>
      </div>

      {/* 4 Core Foundation Global Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL SISWA AKTIF</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {globalMetrics.totalActiveStudents.toLocaleString("id-ID")}
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>+48 Santri Baru TA 2026/2027</span>
          </div>
        </div>

        {/* Total SPP */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL SPP TERKUMPUL</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
            Rp {(globalMetrics.totalCollectedRevenue / 1000000).toLocaleString("id-ID")} Jt
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-300">
            <span>Rp 342.500.000 (83.1% Target)</span>
          </div>
        </div>

        {/* Kehadiran Pegawai */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>PRESENSI PEGAWAI</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {globalMetrics.globalStaffAttendanceRate}%
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-emerald-400">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>Tingkat Disiplin Prima</span>
          </div>
        </div>

        {/* Rombel Aktif */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>ROMBEL / KELAS AKTIF</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <GraduationCap className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {globalMetrics.activeClassesCount} Rombel
          </div>
          <div className="flex items-center gap-1.5 mt-2 text-xs font-bold text-gray-400">
            <span>RA, SD, MTs & Les Bimbel</span>
          </div>
        </div>
      </div>

      {/* Unit Performance Breakdown (RA, SD, MTs) */}
      <div className="bg-[#1a1a24]/80 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl p-6">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between pb-4 border-b border-white/10 gap-2 mb-6">
          <div>
            <h2 className="text-lg font-black text-white">Performa Unit Pendidikan As Sa'adah</h2>
            <p className="text-xs text-gray-400">Distribusi jumlah santri, tenaga pendidik, dan efisiensi keuangan per unit</p>
          </div>
          <span className="px-3 py-1 rounded-full text-xs font-bold bg-white/10 text-gray-300 border border-white/10">
            Fase Fondasi, A/B/C, D
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Unit RA */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#151520] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#ffbf00] text-slate-950">
                  Unit RA (Fase Fondasi)
                </span>
                <span className="text-xs font-bold text-emerald-400">Presensi 100%</span>
              </div>
              <h3 className="text-base font-bold text-white">RA As Sa'adah</h3>
              <p className="text-xs text-gray-400 mt-1">Pendidikan anak usia dini & dasar tahfidz Al-Qur'an.</p>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Jumlah Santri:</span>
                  <span className="font-bold text-white">{globalMetrics.studentsByLevel.ra} Anak</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Dewan Pendidik:</span>
                  <span className="font-bold text-white">8 Ustadzah</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Kolektivitas SPP:</span>
                  <span className="font-bold text-emerald-400">95% (Rp 38.000.000)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Kepala RA: Hj. Mas'udah, S.Pd.I</span>
            </div>
          </div>

          {/* Unit SD */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#151520] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-[#0cc0df] text-slate-950">
                  Unit SD (Fase A - C)
                </span>
                <span className="text-xs font-bold text-emerald-400">Presensi 97.5%</span>
              </div>
              <h3 className="text-base font-bold text-white">SD As Sa'adah</h3>
              <p className="text-xs text-gray-400 mt-1">Sekolah Dasar unggulan kurikulum nasional & kepesantrenan.</p>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Jumlah Siswa:</span>
                  <span className="font-bold text-white">{globalMetrics.studentsByLevel.sd} Siswa</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Dewan Guru:</span>
                  <span className="font-bold text-white">18 Guru</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Kolektivitas SPP:</span>
                  <span className="font-bold text-emerald-400">92% (Rp 184.500.000)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Kepala SD: Drs. H. Ahmad Dahlan, M.Pd</span>
            </div>
          </div>

          {/* Unit MTs */}
          <div className="p-5 rounded-2xl border border-white/10 bg-[#151520] flex flex-col justify-between shadow-lg">
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="px-2.5 py-1 rounded-lg text-xs font-bold bg-white/20 text-white border border-white/10">
                  Unit MTs (Fase D)
                </span>
                <span className="text-xs font-bold text-emerald-400">Presensi 98.0%</span>
              </div>
              <h3 className="text-base font-bold text-white">MTs As Sa'adah</h3>
              <p className="text-xs text-gray-400 mt-1">Madrasah Tsanawiyah terakreditasi A berwawasan sains & adab.</p>
              
              <div className="mt-4 space-y-2 text-xs">
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Jumlah Santri:</span>
                  <span className="font-bold text-white">{globalMetrics.studentsByLevel.mts} Santri</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Dewan Guru:</span>
                  <span className="font-bold text-white">16 Guru</span>
                </div>
                <div className="flex justify-between py-1 border-b border-white/5">
                  <span className="text-gray-400">Kolektivitas SPP:</span>
                  <span className="font-bold text-emerald-400">89% (Rp 120.000.000)</span>
                </div>
              </div>
            </div>

            <div className="mt-5 pt-3 border-t border-white/5 text-[11px] text-gray-400 flex items-center justify-between">
              <span>Kepala MTs: Ust. H. Mustofa, M.A.</span>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Action Hub for Yayasan Executives */}
      <div className="bg-[#1a1a24]/80 rounded-2xl border border-white/10 shadow-xl backdrop-blur-xl p-6">
        <h2 className="text-lg font-black text-white mb-4">Akses Cepat Pengendalian Sistem</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
          <button
            onClick={() => setActiveTab("operator_finance")}
            className="p-4 rounded-2xl border border-cyan-500/40 hover:border-cyan-400 bg-cyan-950/20 hover:bg-cyan-950/40 text-left transition-all group cursor-pointer shadow-lg shadow-cyan-950/30"
          >
            <div className="flex items-center justify-between">
              <Receipt className="w-5 h-5 text-cyan-400" />
              <ArrowRight className="w-4 h-4 text-cyan-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <h4 className="font-bold text-sm text-white">Transparansi Kas</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 font-bold">Audit</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Arus kas masuk &amp; keluar, inspeksi nota fisik, dan ekspor PDF.</p>
          </button>

          <button
            onClick={() => setActiveTab("operator_attendance")}
            className="p-4 rounded-2xl border border-white/10 hover:border-cyan-400/40 bg-[#12121a] hover:bg-[#151520] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <Clock className="w-5 h-5 text-[#0cc0df]" />
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
            <h4 className="font-bold text-sm text-white mt-3">Master Presensi</h4>
            <p className="text-xs text-gray-400 mt-1">Supervisi jam kehadiran guru &amp; kepsek seluruh unit.</p>
          </button>

          <button
            onClick={() => setActiveTab("operator_cashier")}
            className="p-4 rounded-2xl border border-white/10 hover:border-amber-400/40 bg-[#12121a] hover:bg-[#151520] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <CreditCard className="w-5 h-5 text-[#ffbf00]" />
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
            <h4 className="font-bold text-sm text-white mt-3">Kasir SPP Santri</h4>
            <p className="text-xs text-gray-400 mt-1">Pantau pelunasan SPP &amp; uang gedung santri.</p>
          </button>

          <button
            onClick={() => setActiveTab("operator_registration")}
            className="p-4 rounded-2xl border border-white/10 hover:border-emerald-500/40 bg-[#12121a] hover:bg-[#151520] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <Users className="w-5 h-5 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
            <h4 className="font-bold text-sm text-white mt-3">Pendaftaran Akun</h4>
            <p className="text-xs text-gray-400 mt-1">Daftarkan akun baru ke database yayasan.</p>
          </button>

          <button
            onClick={() => setActiveTab("yayasan_delegation")}
            className="p-4 rounded-2xl border border-amber-500/40 hover:border-amber-400 bg-amber-950/20 hover:bg-amber-950/40 text-left transition-all group cursor-pointer shadow-lg shadow-amber-950/30"
          >
            <div className="flex items-center justify-between">
              <ClipboardList className="w-5 h-5 text-[#ffbf00]" />
              <ArrowRight className="w-4 h-4 text-[#ffbf00] group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <h4 className="font-bold text-sm text-white">Delegasi Tugas</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-[#ffbf00]/20 text-[#ffbf00] font-bold">Mandat</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Delegasikan RPP, notula, dan lacak keterlambatan guru.</p>
          </button>

          <button
            onClick={() => setActiveTab("crypto_validator")}
            className="p-4 rounded-2xl border border-emerald-500/40 hover:border-emerald-400 bg-emerald-950/20 hover:bg-emerald-950/40 text-left transition-all group cursor-pointer shadow-lg shadow-emerald-950/30"
          >
            <div className="flex items-center justify-between">
              <FileCheck className="w-5 h-5 text-emerald-400" />
              <ArrowRight className="w-4 h-4 text-emerald-400 group-hover:translate-x-1 transition-transform" />
            </div>
            <div className="flex items-center gap-1.5 mt-3">
              <h4 className="font-bold text-sm text-white">Validator Nota</h4>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-emerald-500/20 text-emerald-300 font-bold">Anti-Fake</span>
            </div>
            <p className="text-xs text-gray-300 mt-1">Pindai dan verifikasi tanda tangan hash nota fisik.</p>
          </button>

          <button
            onClick={() => setActiveTab("games")}
            className="p-4 rounded-2xl border border-white/10 hover:border-purple-500/40 bg-[#12121a] hover:bg-[#151520] text-left transition-all group cursor-pointer"
          >
            <div className="flex items-center justify-between">
              <Sparkles className="w-5 h-5 text-purple-400" />
              <ArrowRight className="w-4 h-4 text-gray-500 group-hover:text-white transition-transform group-hover:translate-x-1" />
            </div>
            <h4 className="font-bold text-sm text-white mt-3">Game &amp; Content</h4>
            <p className="text-xs text-gray-400 mt-1">Inspeksi modul gamifikasi dan kuis.</p>
          </button>
        </div>
      </div>
    </div>
  );
}
