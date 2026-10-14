"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  Home,
  BookOpen,
  Bot,
  Gamepad2,
  Trophy,
  Compass,
  LogOut,
  Sparkles,
  Award,
  Camera,
  ChevronLeft,
  ChevronRight,
  Swords,
  Users,
} from "lucide-react";

interface StudentSidebarProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function StudentSidebar({ activeTab, setActiveTab }: StudentSidebarProps) {
  const [isCollapsed, setIsCollapsed] = useState(false);
  const { currentUser, studentData, logout, urgentTasks, customGames, theme } = useEduQuest();
  const isDark = theme === "dark";

  const isTutoring = currentUser?.role === "tutoring" || currentUser?.studentType === "les";
  const pendingUrgentCount = urgentTasks.filter((t) => !t.completed).length;
  const activeChallengesCount = customGames.filter((g) => !g.isPlayed).length;

  const baseNavItems = [
    {
      id: 1,
      label: "Beranda",
      icon: Home,
      badge: pendingUrgentCount > 0 ? `${pendingUrgentCount}` : null,
      badgeColor: "bg-rose-500 text-white",
    },
    {
      id: 2,
      label: "Ruang Materi",
      icon: BookOpen,
      badge: "RA-MTs",
      badgeColor: "bg-cyan-50 text-cyan-800 border border-cyan-200",
    },
    ...(!isTutoring
      ? [
          {
            id: 6,
            label: "Absensiku",
            icon: Camera,
            badge: studentData.hasCheckedInToday ? "Hadir" : "Wajib",
            badgeColor: studentData.hasCheckedInToday
              ? "bg-emerald-100 text-emerald-800 font-bold"
              : "bg-amber-100 text-amber-900 font-bold animate-pulse",
          },
        ]
      : []),
    {
      id: 3,
      label: "Tanya AI",
      icon: Bot,
      badge: "3 Agen",
      badgeColor: "bg-emerald-100 text-emerald-700",
    },
    {
      id: 4,
      label: "Arena Interaktif",
      icon: Gamepad2,
      badge: activeChallengesCount > 0 ? `Tantangan` : null,
      badgeColor: "bg-[#ffbf00] text-slate-950 font-bold animate-pulse",
    },
    {
      id: 5,
      label: "Peringkat",
      icon: Trophy,
      badge: "Top 10",
      badgeColor: "bg-amber-100 text-amber-900",
    },
    {
      id: 7,
      label: "Lab Anatomi 3D",
      icon: Sparkles,
      badge: "3D",
      badgeColor: "bg-cyan-100 text-cyan-800 font-bold",
    },
    {
      id: 8,
      label: "Teman & Arena Mabar",
      icon: Swords,
      badge: "Live MTs",
      badgeColor: "bg-cyan-500/20 text-cyan-400 font-bold border border-cyan-500/30 animate-pulse",
    },
  ];

  const navItems = baseNavItems;

  return (
    <aside
      className={`hidden md:flex flex-col transition-all duration-300 ${
        isCollapsed ? "w-20 p-3 items-center" : "w-64 p-4"
      } ${
        isDark
          ? "bg-[#14141b]/95 backdrop-blur-xl border-r border-white/10 text-slate-300"
          : "bg-white border-r border-slate-200/80 text-slate-700 shadow-xs"
      } shrink-0 min-h-[calc(100vh-65px)]`}
    >
      {/* Brand Header inside portal + Sleek Toggle Button */}
      <div
        className={`flex items-center ${
          isCollapsed ? "flex-col gap-3 justify-center" : "justify-between"
        } px-2 py-2 mb-6 w-full`}
      >
        <div className={`flex items-center gap-2.5 ${isCollapsed ? "justify-center" : ""}`}>
          <Image
            src="/sva-logo.png"
            alt="SVA Dev"
            width={32}
            height={32}
            className="object-contain shrink-0"
          />
          {!isCollapsed && (
            <div>
              <span className={`font-extrabold text-base tracking-tight block ${isDark ? "text-white" : "text-slate-900"}`}>
                SVA Dev
              </span>
              <span className="block text-[10px] font-bold text-[#0cc0df] uppercase tracking-wider">
                YPI As Sa&apos;adah
              </span>
            </div>
          )}
        </div>

        <button
          onClick={() => setIsCollapsed(!isCollapsed)}
          title={isCollapsed ? "Perluas Sidebar" : "Perkecil Sidebar"}
          className={`p-1.5 rounded-xl transition-colors shrink-0 ${
            isDark ? "text-slate-400 hover:text-white hover:bg-white/10" : "text-slate-400 hover:text-slate-700 hover:bg-slate-100"
          }`}
        >
          {isCollapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Navigation List */}
      <nav className="space-y-1.5 flex-1 w-full">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              title={isCollapsed ? item.label : undefined}
              className={`w-full flex items-center ${
                isCollapsed ? "justify-center px-0 py-3" : "justify-between px-3.5 py-3"
              } rounded-xl font-semibold text-sm transition-all duration-200 cursor-pointer ${
                isActive
                  ? "bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white shadow-md shadow-slate-950/25 font-bold"
                  : isDark
                  ? "text-slate-400 hover:text-[#0cc0df] hover:bg-white/5"
                  : "text-slate-600 hover:text-[#0cc0df] hover:bg-cyan-50/50"
              }`}
            >
              <div className={`flex items-center ${isCollapsed ? "justify-center" : "gap-3"}`}>
                <Icon
                  className={`w-5 h-5 shrink-0 ${
                    isActive ? "text-[#ffbf00]" : isDark ? "text-slate-400" : "text-slate-400 group-hover:text-cyan-600"
                  }`}
                />
                {!isCollapsed && <span>{item.label}</span>}
              </div>
              {!isCollapsed && item.badge && (
                <span
                  className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                    isActive ? "bg-white/20 text-white" : item.badgeColor
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Foundation Announcement Card */}
      {!isCollapsed && (
        <div className={`my-4 p-3.5 rounded-2xl border text-xs ${
          isDark
            ? "bg-[#1a1a24] border-white/10 text-gray-300"
            : "bg-gradient-to-br from-amber-50/70 via-slate-50 to-cyan-50/70 border-amber-200 text-slate-600"
        }`}>
          <div className={`flex items-center gap-1.5 font-bold mb-1 ${isDark ? "text-white" : "text-slate-900"}`}>
            <Award className="w-4 h-4 text-[#ffbf00]" />
            <span>Liga Prestasi Siswa</span>
          </div>
          <p className={`text-[11px] leading-relaxed ${isDark ? "text-gray-400" : "text-slate-600"}`}>
            Kumpulkan minimal 3.000 EXP minggu ini untuk tiket apresiasi prestasi Yayasan YPI As Sa&apos;adah!
          </p>
        </div>
      )}

      {/* Footer / Logout */}
      <div
        className={`pt-4 border-t border-slate-100 w-full flex ${
          isCollapsed ? "flex-col items-center gap-3" : "items-center justify-between"
        }`}
      >
        <Link
          href="/"
          title={isCollapsed ? "Ke Beranda Utama" : undefined}
          className="text-xs text-slate-400 hover:text-slate-600 transition flex items-center gap-1"
        >
          <Compass className="w-4 h-4 shrink-0" />
          {!isCollapsed && <span>Ke Beranda</span>}
        </Link>
        <Link
          href="/login"
          onClick={logout}
          title={isCollapsed ? "Keluar" : undefined}
          className="text-xs text-rose-600 hover:text-rose-700 font-medium flex items-center gap-1 p-1 rounded-md hover:bg-rose-50"
        >
          <LogOut className="w-3.5 h-3.5 shrink-0" />
          {!isCollapsed && <span>Keluar</span>}
        </Link>
      </div>
    </aside>
  );
}
