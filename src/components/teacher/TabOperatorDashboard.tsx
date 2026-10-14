"use client";

import React from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  ShieldCheck,
  UserPlus,
  CreditCard,
  Clock,
  Users,
  TrendingUp,
  Building2,
  ArrowRight,
  CheckCircle2,
  AlertCircle,
  FileSpreadsheet,
  Layers,
  Receipt,
  CheckSquare,
  PiggyBank,
} from "lucide-react";

interface TabOperatorDashboardProps {
  setActiveTab: (tab: string) => void;
}

export default function TabOperatorDashboard({ setActiveTab }: TabOperatorDashboardProps) {
  const { currentUser, registeredUsers, paymentRecords, globalMetrics } = useEduQuest();

  return (
    <div className="space-y-6 text-white">
      {/* Welcome Banner */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 sm:p-8 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#0cc0df]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 max-w-3xl">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 text-xs font-bold mb-3">
            <ShieldCheck className="w-4 h-4" />
            <span>Pusat Tata Usaha & Sistem Informasi Manajemen (SIM)</span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-black tracking-tight text-white">
            Dasbor Utama Operator
          </h1>
          <p className="text-xs sm:text-sm text-gray-300 mt-2 leading-relaxed">
            Selamat datang, <span className="text-[#ffbf00] font-bold">{currentUser?.name || "Fajar Ramadhan, S.Kom"}</span>. Anda memiliki kewenangan penuh mengelola pendaftaran akun warga yayasan, loket kasir pembayaran SPP & gedung, serta supervisi presensi global seluruh unit.
          </p>
        </div>
      </div>

      {/* 4 Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Siswa Terdaftar */}
        <div className="bg-[#1a1a24] p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>SISWA TERDAFTAR</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {globalMetrics.totalActiveStudents}
          </div>
          <span className="text-xs font-semibold text-emerald-400 mt-1 block">
            Aktif di RA, SD, MTs & Les
          </span>
        </div>

        {/* Pemasukan SPP */}
        <div className="bg-[#1a1a24] p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL PEMASUKAN</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <CreditCard className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400 mt-3">
            Rp 342.5 Jt
          </div>
          <span className="text-xs font-semibold text-emerald-300 mt-1 block">
            83.1% Terkumpul Lunas
          </span>
        </div>

        {/* Kehadiran Global */}
        <div className="bg-[#1a1a24] p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>PRESENSI GLOBAL</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Clock className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {globalMetrics.globalStaffAttendanceRate}%
          </div>
          <span className="text-xs font-semibold text-emerald-400 mt-1 block">
            Dewan Pendidik & Staf
          </span>
        </div>

        {/* Total Akun SIM */}
        <div className="bg-[#1a1a24] p-5 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>AKUN SIM TERTUTUP</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <UserPlus className="w-4 h-4" />
            </div>
          </div>
          <div className="text-3xl font-black text-white mt-3">
            {registeredUsers.length + 836} Akun
          </div>
          <span className="text-xs font-semibold text-[#0cc0df] mt-1 block">
            Terverifikasi Sistem
          </span>
        </div>
      </div>

      {/* 4 Main Action Modules (Quick Navigation) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {/* Module 1: Kasir */}
        <div className="bg-[#1a1a24] rounded-2xl p-6 border border-cyan-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-cyan-400 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <CreditCard className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white">Kasir Loket</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">3 Tab</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Loket transaksi kas masuk (21 jenis biaya), belanja pengeluaran nota, dan setor/tarik tabungan.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("operator_cashier")}
            className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <span>Buka Kasir</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 2: Laporan Kas */}
        <div className="bg-[#1a1a24] rounded-2xl p-6 border border-blue-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-blue-400 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-blue-500/20 border border-blue-500/30 flex items-center justify-center text-blue-400 mb-4">
              <Receipt className="w-6 h-6 text-blue-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white">Laporan Kas</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30">Harian</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Buku kas harian terpadu (Pendapatan &amp; Pengeluaran) dengan running balance dan auto-scroll.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("operator_cash_report")}
            className="mt-6 w-full py-2.5 rounded-xl bg-blue-500 hover:bg-blue-400 text-white font-extrabold text-xs shadow-lg shadow-blue-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <span>Buka Laporan Kas</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 3: Administrasi Pembayaran */}
        <div className="bg-[#1a1a24] rounded-2xl p-6 border border-amber-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-amber-400 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-amber-500/20 border border-amber-500/30 flex items-center justify-center text-amber-400 mb-4">
              <CheckSquare className="w-6 h-6 text-amber-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white">Administrasi Pembayaran</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">RA-MTs</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Pelacak tagihan master seluruh santri: status lunas/belum lunas dan saldo tabungan aktif.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("operator_fee_admin")}
            className="mt-6 w-full py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black font-extrabold text-xs shadow-lg shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <span>Cek Administrasi</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 4: Administrasi Tabungan */}
        <div className="bg-[#1a1a24] rounded-2xl p-6 border border-purple-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-purple-400 transition-colors">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400 mb-4">
              <PiggyBank className="w-6 h-6 text-purple-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white">Administrasi Tabungan</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30">Bulanan</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Rekapitulasi bulanan setoran, penarikan, pemotongan SPP, dan buku tabungan digital santri.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("operator_savings_admin")}
            className="mt-6 w-full py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-extrabold text-xs shadow-lg shadow-purple-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <span>Buka Tabungan</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Module 5: Manajemen Data Wajah AI */}
        <div className="bg-[#1a1a24] rounded-2xl p-6 border border-cyan-500/30 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-cyan-400 transition-colors sm:col-span-2 lg:col-span-2">
          <div>
            <div className="w-12 h-12 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4">
              <ShieldCheck className="w-6 h-6 text-cyan-400" />
            </div>
            <div className="flex items-center gap-1.5">
              <h3 className="font-extrabold text-base text-white">Manajemen Data Wajah AI</h3>
              <span className="text-[9px] px-1.5 py-0.5 rounded-sm bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">Biometrik</span>
            </div>
            <p className="text-xs text-gray-400 mt-2 leading-relaxed">
              Registrasi foto referensi biometrik resmi untuk dewan pendidik dan staf. Validasi fitur wajah (mata, hidung, mulut) sebelum diaktifkan untuk presensi.
            </p>
          </div>
          <button
            onClick={() => setActiveTab("operator_face_data")}
            className="mt-6 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-extrabold text-xs shadow-lg shadow-cyan-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
          >
            <span>Kelola Basis Data Wajah Guru</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
