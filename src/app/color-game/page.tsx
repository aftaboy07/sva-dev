"use client";

import React from "react";
import Link from "next/link";
import CinematicBackground from "@/components/common/CinematicBackground";
import ColorVisionGame from "@/components/ColorVisionGame";
import { ArrowLeft, Eye, Home } from "lucide-react";

export default function ColorGamePage() {
  return (
    <CinematicBackground>
      <div className="min-h-screen text-slate-100 font-sans pb-16">
        {/* Navigation Bar */}
        <header className="sticky top-0 z-50 bg-[#09090b]/80 backdrop-blur-xl border-b border-white/10 px-6 py-4">
          <div className="max-w-6xl mx-auto flex items-center justify-between">
            <Link
              href="/student"
              className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white px-3 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Kembali ke Portal Siswa</span>
            </Link>

            <div className="flex items-center gap-2">
              <span className="px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[#0cc0df] text-xs font-extrabold flex items-center gap-1.5">
                <Eye className="w-3.5 h-3.5" />
                <span>Color Vision Perception • SVA Dev</span>
              </span>
            </div>

            <Link
              href="/"
              className="hidden sm:inline-flex items-center gap-1.5 text-xs text-gray-400 hover:text-white transition-colors"
            >
              <Home className="w-3.5 h-3.5" />
              <span>Beranda Utama</span>
            </Link>
          </div>
        </header>

        {/* Main Content Area */}
        <main className="max-w-4xl mx-auto px-4 sm:px-6 pt-10">
          <ColorVisionGame />
        </main>
      </div>
    </CinematicBackground>
  );
}
