"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { useEduQuest } from "@/context/EduQuestContext";
import { Coins, Flame, Trophy, Shield, Sparkles, UserCheck, LogOut } from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";
import NotificationDropdown from "@/components/student/NotificationDropdown";

interface StudentHeaderProps {
  onSelectTask?: (taskId: string) => void;
}

export default function StudentHeader({ onSelectTask }: StudentHeaderProps = {}) {
  const { currentUser, studentData, logout, theme } = useEduQuest();
  const isDark = theme === "dark";

  if (!currentUser) return null;

  const expPercentage = Math.min(
    100,
    Math.round((studentData.currentExp / studentData.maxExp) * 100)
  );

  return (
    <header className={`sticky top-0 z-30 transition-colors duration-300 ${
      isDark
        ? "bg-[#14141b]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-xl"
        : "bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shadow-xs"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Student Identity */}
        <div className="flex items-center gap-3.5">
          <div className="relative">
            <img
              src={currentUser.avatar}
              alt={currentUser.name}
              className="w-13 h-13 rounded-2xl object-cover ring-2 ring-[#0cc0df]/30 p-0.5 shadow-xs"
              width={52}
              height={52}
            />
            <span className="absolute -bottom-1 -right-1 w-5 h-5 rounded-full bg-slate-900 text-[10px] font-bold text-[#ffbf00] flex items-center justify-center border-2 border-white shadow-xs">
              {studentData.level}
            </span>
          </div>
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {currentUser.name}
              </h1>
              <span className="hidden sm:inline-flex px-2 py-0.5 rounded-md text-[11px] font-semibold bg-amber-100 text-amber-900 border border-amber-300">
                {studentData.levelTitle}
              </span>
              {/* Global Theme Toggle Button next to Profile Badge */}
              <ThemeToggle />
            </div>
            <p className={`text-xs ${isDark ? "text-gray-400 font-medium" : "text-slate-600 font-semibold"}`}>
              NIS: {currentUser.identifier} • {currentUser.grade}
            </p>
          </div>
        </div>

        {/* Right: Gamification Status Widgets */}
        <div className="flex items-center flex-wrap gap-2.5 sm:gap-4">
          {/* Streak Counter */}
          <div className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border shadow-xs ${
            isDark
              ? "bg-amber-500/10 border-amber-500/20 text-amber-300"
              : "bg-amber-50 border-amber-300 text-amber-950"
          }`}>
            <Flame className="w-4 h-4 text-amber-600 fill-amber-500 animate-bounce" />
            <div className="text-left">
              <span className={`text-xs font-bold block leading-tight ${isDark ? "text-amber-300" : "text-amber-950"}`}>
                {studentData.streakDays} Hari
              </span>
              <span className={`text-[10px] block -mt-0.5 ${isDark ? "text-amber-400/80" : "text-amber-800 font-bold"}`}>
                Streak
              </span>
            </div>
          </div>

          {/* Coin Balance */}
          <div className={`flex items-center gap-2 px-3.5 py-1.5 rounded-xl border shadow-xs ${
            isDark
              ? "bg-gradient-to-r from-amber-500/10 to-yellow-500/10 border-[#ffbf00]/40"
              : "bg-gradient-to-r from-amber-50 to-yellow-50 border-[#ffbf00] shadow-sm"
          }`}>
            <div className="w-6 h-6 rounded-full bg-[#ffbf00] text-slate-950 flex items-center justify-center font-black text-xs shadow-inner">
              🪙
            </div>
            <div>
              <span className={`text-xs font-black block leading-tight ${isDark ? "text-amber-300" : "text-slate-950"}`}>
                {studentData.coins.toLocaleString()}
              </span>
              <span className={`text-[10px] font-bold block -mt-0.5 ${isDark ? "text-amber-400/80" : "text-slate-700 font-semibold"}`}>
                Koin SVA Dev
              </span>
            </div>
          </div>

          {/* EXP Progress Bar Widget */}
          <div className={`flex-1 sm:w-56 min-w-[150px] px-3.5 py-1.5 rounded-xl border ${
            isDark
              ? "bg-[#12121a] border-white/10"
              : "bg-white border-slate-200 shadow-sm"
          }`}>
            <div className="flex justify-between items-center text-[11px] font-bold mb-1">
              <span className={`flex items-center gap-1 ${isDark ? "text-[#0cc0df]" : "text-cyan-700"}`}>
                <Sparkles className="w-3 h-3 text-[#ffbf00]" />
                Level {studentData.level}
              </span>
              <span className={`font-semibold ${isDark ? "text-gray-400" : "text-slate-600"}`}>
                {studentData.currentExp} / {studentData.maxExp} EXP ({expPercentage}%)
              </span>
            </div>
            <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-white/10" : "bg-slate-200"}`}>
              <div
                className="bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] h-full rounded-full transition-all duration-500 shadow-xs"
                style={{ width: `${expPercentage}%` }}
              />
            </div>
          </div>

          {/* Smart Notification Bell & Dropdown */}
          <NotificationDropdown onSelectTask={onSelectTask} />

          {/* Logout Button */}
          <Link
            href="/login"
            onClick={logout}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              isDark
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
            }`}
            title="Keluar dari akun siswa"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span className="hidden sm:inline">Keluar</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
