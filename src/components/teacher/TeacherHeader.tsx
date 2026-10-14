"use client";

import React, { useState } from "react";
import Link from "next/link";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  Layers,
  Bell,
  LogOut,
  Shield,
  UserCheck,
} from "lucide-react";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function TeacherHeader() {
  const { currentUser, logout, theme } = useEduQuest();
  const isDark = theme === "dark";

  if (!currentUser) return null;

  const staffRole = (currentUser.staffRole || currentUser.role || "guru").toLowerCase();
  const isOperator = staffRole === "operator" || currentUser.role === "operator";
  const isYayasan = staffRole === "yayasan" || currentUser.role === "yayasan";
  const isKepsek = staffRole === "kepsek" || currentUser.role === "kepsek";

  const getRoleBadge = () => {
    if (isYayasan) {
      return {
        title: "Dewan Yayasan",
        className: isDark
          ? "bg-gradient-to-r from-[#ffbf00] to-amber-500 text-slate-950 font-extrabold border border-amber-300 shadow-sm shadow-amber-500/20"
          : "bg-gradient-to-r from-amber-400 to-amber-500 text-slate-950 font-extrabold border border-amber-400 shadow-sm",
      };
    }
    if (isOperator) {
      return {
        title: "Operator SIM & Keuangan",
        className: isDark
          ? "bg-amber-500/20 text-amber-300 font-bold border border-amber-500/40"
          : "bg-amber-100 text-amber-900 font-bold border border-amber-300 shadow-sm",
      };
    }
    if (isKepsek) {
      return {
        title: currentUser.schoolOrSubject || `Kepala Sekolah Unit ${currentUser.levelAssignment || "SD"}`,
        className: isDark
          ? "bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40"
          : "bg-cyan-100 text-cyan-900 font-bold border border-cyan-300 shadow-sm",
      };
    }
    return {
      title: currentUser.schoolOrSubject || "Guru Pengampu YPI As Sa'adah",
      className: isDark
        ? "bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/40"
        : "bg-emerald-100 text-emerald-900 font-bold border border-emerald-300 shadow-sm",
    };
  };

  const badge = getRoleBadge();

  return (
    <header className={`sticky top-0 z-30 transition-colors duration-300 ${
      isDark
        ? "bg-[#14141b]/95 backdrop-blur-xl border-b border-white/10 text-white shadow-xl"
        : "bg-white/95 backdrop-blur-xl border-b border-slate-200 text-slate-900 shadow-sm"
    }`}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Left: Staff info */}
        <div className="flex items-center gap-3.5">
          <img
            src={currentUser.avatar}
            alt={currentUser.name}
            className="w-11 h-11 rounded-2xl object-cover ring-2 ring-[#0cc0df]/40 p-0.5"
            width={44}
            height={44}
          />
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className={`text-base font-bold tracking-tight ${isDark ? "text-white" : "text-slate-900"}`}>
                {currentUser.name}
              </h1>
              <span className={`px-2.5 py-0.5 rounded-md text-[10px] shadow-2xs ${badge.className}`}>
                {badge.title}
              </span>
              {/* Global Theme Toggle Button */}
              <ThemeToggle />
            </div>
            <p className={`text-xs ${isDark ? "text-gray-400 font-medium" : "text-slate-600 font-semibold"}`}>
              ID/NIP: <span className="font-mono font-semibold text-cyan-400">{currentUser.identifier}</span> • {currentUser.grade || currentUser.schoolOrSubject}
            </p>
          </div>
        </div>

        {/* Right: Controls & Essential Tools */}
        <div className="flex items-center flex-wrap gap-3">
          {/* Active Unit Badge */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold ${
            isDark
              ? "bg-white/5 border border-white/10 text-slate-300"
              : "bg-slate-100 border border-slate-200 text-slate-700"
          }`}>
            <Layers className="w-3.5 h-3.5 text-[#0cc0df]" />
            <span>Unit:</span>
            <span className={`font-bold ${isDark ? "text-white" : "text-slate-900"}`}>
              {currentUser.levelAssignment === "Semua" ? "Seluruh Yayasan" : `Unit ${currentUser.levelAssignment || "SD"}`}
            </span>
          </div>

          {/* Active User Profile Pill (Strict Profile Credentials Display) */}
          <div className={`flex items-center gap-2 px-3 py-1.5 rounded-xl text-xs font-semibold border ${
            isDark
              ? "bg-cyan-500/10 border-cyan-500/30 text-cyan-300"
              : "bg-cyan-50 border-cyan-200 text-cyan-800"
          }`}>
            <span className="w-2 h-2 rounded-full bg-cyan-400 animate-pulse" />
            <span className="font-bold truncate max-w-[150px]">{currentUser.name}</span>
            <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 font-mono text-cyan-300 font-bold">
              {currentUser.identifier}
            </span>
          </div>

          {/* Notifications Button */}
          <button
            type="button"
            className={`relative p-2 rounded-xl border transition cursor-pointer ${
              isDark
                ? "bg-white/5 border-white/10 text-slate-300 hover:text-white hover:bg-white/10"
                : "bg-slate-100 border-slate-200 text-slate-700 hover:text-slate-900 hover:bg-slate-200"
            }`}
            title="Notifikasi & Pembaruan Sistem"
          >
            <Bell className="w-3.5 h-3.5" />
            <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-cyan-400 ring-2 ring-[#14141b] animate-pulse" />
          </button>

          {/* Logout Button */}
          <Link
            href="/login"
            onClick={logout}
            className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl border text-xs font-bold transition cursor-pointer ${
              isDark
                ? "bg-rose-500/10 border-rose-500/30 text-rose-300 hover:bg-rose-500/20 hover:text-rose-200"
                : "bg-rose-50 border-rose-200 text-rose-700 hover:bg-rose-100"
            }`}
            title="Keluar dari akun"
          >
            <LogOut className="w-3.5 h-3.5 text-rose-400" />
            <span>Keluar</span>
          </Link>
        </div>
      </div>
    </header>
  );
}
