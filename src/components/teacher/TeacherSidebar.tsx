"use client";

import React from "react";
import Link from "next/link";
import Image from "next/image";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  LayoutDashboard,
  FolderKanban,
  Users,
  QrCode,
  LogOut,
  Compass,
  Clock,
  UserPlus,
  CreditCard,
  ShieldCheck,
  Receipt,
  CheckSquare,
  PiggyBank,
  Box,
  PenTool,
  ShieldAlert,
  FileCheck,
  ClipboardList,
} from "lucide-react";

interface TeacherSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
}

export default function TeacherSidebar({
  activeTab,
  setActiveTab,
}: TeacherSidebarProps) {
  const { logout, customGames, studentRecords, currentUser, theme } = useEduQuest();
  const isDark = theme === "dark";

  const needsInterventionCount = studentRecords.filter(
    (s) => s.needsIntervention
  ).length;

  // Strict role detection
  const staffRole = (currentUser?.staffRole || currentUser?.role || "guru").toLowerCase();
  const isOperator = staffRole === "operator" || currentUser?.role === "operator";
  const isYayasan = staffRole === "yayasan" || currentUser?.role === "yayasan";
  const isKepsek = staffRole === "kepsek" || currentUser?.role === "kepsek";

  // Build nav items dynamically based on staff role
  let navItems: Array<{
    id: string;
    label: string;
    icon: any;
    badge?: string | null;
    badgeColor?: string;
  }> = [];

  if (isOperator) {
    // =========================================================================
    // STRICT 5-ITEM OPERATOR NAVIGATION MENU (SPECIFICATION 1):
    // 1. Dashboard Utama
    // 2. Kasir (3 Sub-Tabs)
    // 3. Laporan Kas (Daily Combined Ledger)
    // 4. Administrasi Pembayaran (Student Fee Tracker)
    // 5. Administrasi Tabungan (Monthly Student Savings Recap)
    // =========================================================================
    navItems = [
      {
        id: "operator_dashboard",
        label: "Dashboard Utama",
        icon: LayoutDashboard,
        badge: "SIM",
        badgeColor: "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30",
      },
      {
        id: "operator_cashier",
        label: "Kasir",
        icon: CreditCard,
        badge: "3 Tab",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "operator_cash_report",
        label: "Laporan Kas",
        icon: Receipt,
        badge: "Harian",
        badgeColor: "bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30",
      },
      {
        id: "operator_fee_admin",
        label: "Administrasi Pembayaran",
        icon: CheckSquare,
        badge: "RA - MTs",
        badgeColor: "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30",
      },
      {
        id: "operator_savings_admin",
        label: "Administrasi Tabungan",
        icon: PiggyBank,
        badge: "Bulanan",
        badgeColor: "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30",
      },
      {
        id: "operator_face_data",
        label: "Manajemen Data Wajah AI",
        icon: ShieldCheck,
        badge: "Biometrik",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "crypto_validator",
        label: "Kamera & Validator Nota",
        icon: FileCheck,
        badge: "Anti-Fake",
        badgeColor: "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30",
      },
    ];
  } else if (isKepsek) {
    navItems = [
      {
        id: "analytics",
        label: "Dashboard Analytics",
        icon: LayoutDashboard,
        badge: "Unit " + (currentUser?.levelAssignment || "SD"),
        badgeColor: "bg-cyan-100 text-cyan-800",
      },
      {
        id: "teachers",
        label: `Pantau Guru ${currentUser?.levelAssignment || "SD"}`,
        icon: Users,
        badge: "Supervisi",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "content_tasks",
        label: "Manajemen Konten & Tugas",
        icon: FolderKanban,
        badge: "Modul & Kuis",
        badgeColor: "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30",
      },
      {
        id: "staff_attendance",
        label: "Rekap Presensi Guru",
        icon: Clock,
        badge: "Unit " + (currentUser?.levelAssignment || "SD"),
        badgeColor: "bg-emerald-100 text-emerald-800",
      },
      {
        id: "workspace_3d",
        label: "Workspace 3D & Whiteboard",
        icon: Box,
        badge: "3D & AI",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "ai_assessment",
        label: "AI Ujian & Anti-Cheat",
        icon: ShieldAlert,
        badge: "Lockdown",
        badgeColor: "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30",
      },
      {
        id: "crypto_validator",
        label: "Kamera & Validator Nota",
        icon: FileCheck,
        badge: "Anti-Fake",
        badgeColor: "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30",
      },
    ];
  } else if (isYayasan) {
    navItems = [
      {
        id: "yayasan_overview",
        label: "Overview Global Yayasan",
        icon: ShieldCheck,
        badge: "Super Admin",
        badgeColor: "bg-[#ffbf00] text-slate-950 font-bold",
      },
      {
        id: "operator_attendance",
        label: "Master Presensi Pegawai",
        icon: Clock,
        badge: "Global",
        badgeColor: "bg-cyan-100 text-cyan-800",
      },
      {
        id: "operator_cashier",
        label: "Kasir Loket",
        icon: CreditCard,
        badge: "Loket",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "operator_cash_report",
        label: "Laporan Kas Harian",
        icon: Receipt,
        badge: "Harian",
        badgeColor: "bg-blue-500/20 text-blue-300 font-bold border border-blue-500/30",
      },
      {
        id: "operator_fee_admin",
        label: "Administrasi Pembayaran",
        icon: CheckSquare,
        badge: "RA - MTs",
        badgeColor: "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30",
      },
      {
        id: "operator_savings_admin",
        label: "Administrasi Tabungan",
        icon: PiggyBank,
        badge: "Brankas",
        badgeColor: "bg-purple-500/20 text-purple-300 font-bold border border-purple-500/30",
      },
      {
        id: "operator_registration",
        label: "Pendaftaran Akun",
        icon: UserPlus,
      },
      {
        id: "operator_face_data",
        label: "Manajemen Data Wajah AI",
        icon: ShieldCheck,
        badge: "Biometrik",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "students",
        label: "Pantau Seluruh Siswa",
        icon: Users,
      },
      {
        id: "content_tasks",
        label: "Manajemen Konten & Tugas",
        icon: FolderKanban,
        badge: "Modul & Kuis",
        badgeColor: "bg-purple-100 text-purple-800",
      },
      {
        id: "analytics",
        label: "Dashboard Akademik",
        icon: LayoutDashboard,
      },
      {
        id: "workspace_3d",
        label: "Workspace 3D & Whiteboard",
        icon: Box,
        badge: "3D & AI",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "ai_assessment",
        label: "AI Ujian & Anti-Cheat",
        icon: ShieldAlert,
        badge: "Lockdown",
        badgeColor: "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30",
      },
      {
        id: "yayasan_delegation",
        label: "Delegasi Tugas Guru",
        icon: ClipboardList,
        badge: "Yayasan",
        badgeColor: "bg-[#ffbf00] text-slate-950 font-bold",
      },
      {
        id: "crypto_validator",
        label: "Kamera & Validator Nota",
        icon: FileCheck,
        badge: "Anti-Fake",
        badgeColor: "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30",
      },
    ];
  } else {
    // Role: Guru
    navItems = [
      {
        id: "analytics",
        label: "Dashboard Analytics",
        icon: LayoutDashboard,
        badge: "AI Insights",
        badgeColor: "bg-blue-100 text-blue-800",
      },
      {
        id: "content_tasks",
        label: "Manajemen Konten & Tugas",
        icon: FolderKanban,
        badge: "Modul & Kuis",
        badgeColor: "bg-purple-100 text-purple-800",
      },
      {
        id: "students",
        label: "Pantau Siswa",
        icon: Users,
        badge: needsInterventionCount > 0 ? `${needsInterventionCount} Remedial` : null,
        badgeColor: "bg-rose-100 text-rose-800",
      },
      {
        id: "staff_attendance",
        label: "Absensi Guru (Liveness)",
        icon: Clock,
        badge: "GPS & AI",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "workspace_3d",
        label: "Workspace 3D & Whiteboard",
        icon: Box,
        badge: "3D & AI",
        badgeColor: "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30",
      },
      {
        id: "ai_assessment",
        label: "AI Ujian & Anti-Cheat",
        icon: ShieldAlert,
        badge: "Lockdown",
        badgeColor: "bg-rose-500/20 text-rose-300 font-bold border border-rose-500/30",
      },
      {
        id: "crypto_validator",
        label: "Kamera & Validator Nota",
        icon: FileCheck,
        badge: "Anti-Fake",
        badgeColor: "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30",
      },
    ];
  }

  return (
    <aside className={`w-64 p-4 shrink-0 flex flex-col justify-between min-h-[calc(100vh-65px)] transition-colors duration-300 border-r ${
      isDark
        ? "bg-[#14141b]/95 backdrop-blur-xl text-slate-300 border-white/10"
        : "bg-white/95 backdrop-blur-xl text-slate-700 border-slate-200 shadow-xs"
    }`}>
      <div>
        {/* Foundation Portal Brand */}
        <div className={`flex items-center gap-2.5 px-3 py-2 mb-6 border-b pb-4 ${
          isDark ? "border-white/10" : "border-slate-200"
        }`}>
          <Image src="/sva-logo.png" alt="SVA Dev" width={32} height={32} className="object-contain" />
          <div>
            <span className={`font-extrabold text-base tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
              SVA Dev ERP
            </span>
            <span className="block text-[10px] font-bold text-[#0cc0df] uppercase tracking-wider">
              YPI As Sa&apos;adah
            </span>
          </div>
        </div>

        {/* Role Sub-Badge */}
        <div className={`px-3.5 py-2.5 mb-4 rounded-2xl border shadow-sm ${
          isDark ? "bg-white/5 border-white/10" : "bg-slate-100 border-slate-200"
        }`}>
          <span className={`text-[10px] block font-medium ${isDark ? "text-gray-400" : "text-slate-500"}`}>Akses Portal Staf:</span>
          <span className="text-xs font-black text-amber-500 uppercase tracking-wide">
            {isYayasan && "Yayasan Super Admin"}
            {isOperator && "Operator SIM & Sistem"}
            {isKepsek && "Kepala Sekolah Unit"}
            {!isYayasan && !isOperator && !isKepsek && "Dewan Guru Pengampu"}
          </span>
        </div>

        {/* Nav list */}
        <nav className="space-y-1.5">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl font-bold text-xs transition-all duration-200 cursor-pointer ${
                  isActive
                    ? "bg-gradient-to-r from-emerald-500/20 via-teal-500/10 to-cyan-500/20 text-emerald-400 dark:text-white border border-emerald-500/40 shadow-lg shadow-emerald-950/40"
                    : isDark ? "text-slate-400 hover:text-white hover:bg-white/5" : "text-slate-600 hover:text-slate-900 hover:bg-slate-100"
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon
                    className={`w-4 h-4 ${
                      isActive ? "text-emerald-500" : isDark ? "text-slate-400" : "text-slate-500"
                    }`}
                  />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      isActive ? "bg-emerald-500/20 text-emerald-400" : item.badgeColor
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Footer Info */}
      <div className={`pt-4 border-t space-y-3 ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div className={`p-3.5 rounded-2xl border text-[11px] ${
          isDark ? "bg-white/5 border-white/10 text-gray-400" : "bg-slate-50 border-slate-200 text-slate-600"
        }`}>
          <span className={`font-semibold block mb-0.5 ${isDark ? "text-white" : "text-slate-900"}`}>
            Sistem Akademik YPI As Sa'adah
          </span>
          Sinkronisasi otomatis ke server pusat cabang setiap pukul 23:59 WIB.
        </div>

        <div className="flex items-center justify-between text-xs px-1">
          <Link
            href="/"
            className="text-slate-400 hover:text-white transition"
          >
            Beranda
          </Link>
          <Link
            href="/login"
            onClick={logout}
            className="text-rose-400 hover:text-rose-300 font-medium flex items-center gap-1"
          >
            <LogOut className="w-3.5 h-3.5" />
            <span>Keluar</span>
          </Link>
        </div>
      </div>
    </aside>
  );
}
