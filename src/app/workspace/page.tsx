"use client";

import React from "react";
import Link from "next/link";
import { ArrowLeft, Sparkles, Box, ShieldCheck } from "lucide-react";
import CinematicBackground from "@/components/common/CinematicBackground";
import Whiteboard3DWorkspace from "@/components/workspace/Whiteboard3DWorkspace";

export default function WorkspacePage() {
  return (
    <CinematicBackground>
      <div className="min-h-screen bg-[#0f0f13] text-white flex flex-col font-sans p-4 sm:p-6 lg:p-8">
        {/* Top Header */}
        <div className="flex items-center justify-between pb-4 mb-4 border-b border-white/10">
          <div className="flex items-center gap-3">
            <Link
              href="/teacher"
              className="p-2.5 rounded-2xl bg-[#1a1a24] hover:bg-white/10 border border-white/10 text-gray-300 hover:text-white transition-all shadow-lg flex items-center gap-2 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4 text-cyan-400" />
              <span>Kembali ke Portal Guru</span>
            </Link>

            <div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30 flex items-center gap-1">
                  <Box className="w-3 h-3" />
                  <span>EduQuest 3D Workspace</span>
                </span>
                <span className="text-xs text-gray-500">•</span>
                <span className="text-[11px] text-gray-400 font-medium">Papan Tulis &amp; Pembelajaran Anatomi Interaktif</span>
              </div>
              <h1 className="text-xl font-black text-white tracking-tight mt-0.5 flex items-center gap-2">
                <span>Interactive Whiteboard &amp; 3D Workspace</span>
                <Sparkles className="w-4 h-4 text-amber-300" />
              </h1>
            </div>
          </div>

          <div className="hidden md:flex items-center gap-2 text-xs text-gray-400">
            <span className="px-3 py-1.5 rounded-xl bg-black/40 border border-white/10 font-mono text-[11px]">
              Shortcut: Beralih Mode (Draw / Navigasi)
            </span>
          </div>
        </div>

        {/* Main 3D & Whiteboard Workspace */}
        <div className="flex-1 w-full">
          <Whiteboard3DWorkspace />
        </div>
      </div>
    </CinematicBackground>
  );
}
