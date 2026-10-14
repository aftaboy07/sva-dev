"use client";

import React from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { Sun, Moon } from "lucide-react";

interface ThemeToggleProps {
  className?: string;
  showLabel?: boolean;
}

export default function ThemeToggle({ className = "", showLabel = false }: ThemeToggleProps) {
  const { theme, toggleTheme } = useEduQuest();
  const isDark = theme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      title={isDark ? "Beralih ke Bright Mode (Mode Terang)" : "Beralih ke Dark Mode (Mode Gelap)"}
      aria-label={isDark ? "Aktifkan Mode Terang" : "Aktifkan Mode Gelap"}
      className={`group relative inline-flex items-center justify-center gap-1.5 p-2 rounded-xl transition-all duration-300 cursor-pointer hover:scale-110 active:scale-95 shadow-sm ${
        isDark
          ? "bg-white/10 hover:bg-white/20 border border-white/15 text-amber-300 hover:shadow-amber-500/20 hover:shadow-md"
          : "bg-amber-100 hover:bg-amber-200 border border-amber-300 text-amber-700 hover:shadow-amber-400/25 hover:shadow-md"
      } ${className}`}
    >
      <div className="relative w-4 h-4 flex items-center justify-center shrink-0">
        {isDark ? (
          <Sun className="w-4 h-4 text-amber-300 transition-transform duration-300 group-hover:rotate-90" />
        ) : (
          <Moon className="w-4 h-4 text-slate-800 transition-transform duration-300 group-hover:-rotate-12" />
        )}
      </div>

      {showLabel && (
        <span className="text-[11px] font-bold select-none pr-0.5">
          {isDark ? "Dark" : "Bright"}
        </span>
      )}
    </button>
  );
}
