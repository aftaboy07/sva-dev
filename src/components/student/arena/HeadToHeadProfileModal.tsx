"use client";

import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { StudentSocialPeer } from "@/types";
import {
  X,
  Swords,
  BellRing,
  Trophy,
  CheckCircle2,
  Clock,
  Sparkles,
  Flame,
  Award,
  BookCheck,
} from "lucide-react";

interface HeadToHeadProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentUserPeer: StudentSocialPeer;
  selectedPeer: StudentSocialPeer;
  onAjakTanding?: (peer: StudentSocialPeer) => void;
  onSenggol?: (peer: StudentSocialPeer) => void;
}

export default function HeadToHeadProfileModal({
  isOpen,
  onClose,
  currentUserPeer,
  selectedPeer,
  onAjakTanding,
  onSenggol,
}: HeadToHeadProfileModalProps) {
  if (!isOpen) return null;

  const canSenggol = currentUserPeer.hasCompletedLatestTask && !selectedPeer.hasCompletedLatestTask;
  const isMutual = selectedPeer.connectionStatus === "mutual";

  // Calculate percentage ratios for visual bars
  const maxTasks = Math.max(currentUserPeer.tasksCompletedCount, selectedPeer.tasksCompletedCount, 1);
  const maxGames = Math.max(currentUserPeer.gamesPlayedCount, selectedPeer.gamesPlayedCount, 1);
  const maxScore = Math.max(currentUserPeer.totalKnowledgeScore, selectedPeer.totalKnowledgeScore, 1);

  return (
    <AnimatePresence>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/75 backdrop-blur-md">
        <motion.div
          initial={{ opacity: 0, scale: 0.92, y: 15 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.92, y: 15 }}
          transition={{ duration: 0.25 }}
          className="relative w-full max-w-2xl bg-[#14141d]/95 border border-cyan-500/25 rounded-2xl shadow-2xl overflow-hidden text-white"
        >
          {/* Header Glow Banner */}
          <div className="relative px-6 py-4 border-b border-white/10 bg-gradient-to-r from-cyan-950/40 via-[#1a1a26]/90 to-purple-950/40 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                <Trophy className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-white flex items-center gap-2">
                  Head-to-Head Santri
                  <span className="text-xs px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono">
                    Jenjang MTs
                  </span>
                </h3>
                <p className="text-xs text-gray-400">
                  Komparasi capaian akademik & statistik duel keilmuan antar santri
                </p>
              </div>
            </div>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg hover:bg-white/10 text-gray-400 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="p-6 space-y-6 max-h-[80vh] overflow-y-auto custom-scrollbar">
            {/* Player vs Player Header Card */}
            <div className="grid grid-cols-11 items-center gap-2 bg-[#1a1a24]/90 p-4 rounded-xl border border-white/10">
              {/* Player 1 (Logged-in) */}
              <div className="col-span-5 flex items-center gap-3">
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-cyan-400/80 shadow-lg shadow-cyan-500/20 shrink-0">
                  <Image
                    src={currentUserPeer.avatar}
                    alt={currentUserPeer.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#14141d]" />
                </div>
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider block">
                    Kamu
                  </span>
                  <h4 className="font-bold text-sm text-white truncate" title={currentUserPeer.name}>
                    {currentUserPeer.name}
                  </h4>
                  <p className="text-xs text-gray-400">{currentUserPeer.grade}</p>
                  <p className="text-[11px] text-gray-400 font-mono">NIS: {currentUserPeer.nis}</p>
                </div>
              </div>

              {/* VS Badge */}
              <div className="col-span-1 flex flex-col items-center justify-center">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-amber-500 to-rose-600 flex items-center justify-center text-xs font-black shadow-lg shadow-rose-500/30">
                  VS
                </div>
              </div>

              {/* Player 2 (Opponent) */}
              <div className="col-span-5 flex items-center justify-end gap-3 text-right">
                <div className="min-w-0">
                  <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider block">
                    {selectedPeer.connectionStatus === "mutual" ? "Saling Mengikuti" : "Teman MTs"}
                  </span>
                  <h4 className="font-bold text-sm text-white truncate" title={selectedPeer.name}>
                    {selectedPeer.name}
                  </h4>
                  <p className="text-xs text-gray-400">{selectedPeer.grade}</p>
                  <p className="text-[11px] text-gray-400 font-mono">NIS: {selectedPeer.nis}</p>
                </div>
                <div className="relative w-14 h-14 rounded-full overflow-hidden border-2 border-purple-400/80 shadow-lg shadow-purple-500/20 shrink-0">
                  <Image
                    src={selectedPeer.avatar}
                    alt={selectedPeer.name}
                    fill
                    className="object-cover"
                  />
                  <div className="absolute bottom-0 right-0 w-3.5 h-3.5 bg-emerald-500 rounded-full border-2 border-[#14141d]" />
                </div>
              </div>
            </div>

            {/* Status Tugas Terkini Comparison Banner */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-cyan-950/20 via-[#1c1c28] to-purple-950/20 border border-white/10 space-y-3">
              <div className="flex items-center justify-between text-xs text-gray-400 font-medium border-b border-white/5 pb-2">
                <span className="flex items-center gap-1.5">
                  <BookCheck className="w-4 h-4 text-cyan-400" />
                  Status Tugas Terkini
                </span>
                <span className="text-[11px] text-gray-400 font-mono">Sinkronisasi Real-Time</span>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* User Task Status */}
                <div className="p-3 rounded-lg bg-black/30 border border-white/5">
                  <p className="text-[11px] text-gray-400 truncate mb-1">
                    {currentUserPeer.latestTaskTitle}
                  </p>
                  {currentUserPeer.hasCompletedLatestTask ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sudah Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      Belum Selesai
                    </span>
                  )}
                </div>

                {/* Peer Task Status */}
                <div className="p-3 rounded-lg bg-black/30 border border-white/5 text-right">
                  <p className="text-[11px] text-gray-400 truncate mb-1">
                    {selectedPeer.latestTaskTitle}
                  </p>
                  {selectedPeer.hasCompletedLatestTask ? (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      <CheckCircle2 className="w-3.5 h-3.5" />
                      Sudah Selesai
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-1 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      <Clock className="w-3.5 h-3.5" />
                      Belum Selesai
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Comparative Stat Bars */}
            <div className="space-y-4">
              <h4 className="text-xs font-bold text-gray-400 uppercase tracking-wider flex items-center gap-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                Komparasi Metrik Akademik
              </h4>

              {/* 1. Tugas Selesai */}
              <div className="bg-[#1a1a24]/70 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-400">
                    {currentUserPeer.tasksCompletedCount} Tugas
                  </span>
                  <span className="font-semibold text-gray-300">Tugas Diselesaikan</span>
                  <span className="font-bold text-purple-400">
                    {selectedPeer.tasksCompletedCount} Tugas
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 h-2.5">
                  <div className="bg-slate-800/80 rounded-l-full overflow-hidden flex justify-end">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-l-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (currentUserPeer.tasksCompletedCount / maxTasks) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="bg-slate-800/80 rounded-r-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-r-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (selectedPeer.tasksCompletedCount / maxTasks) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 2. Riwayat Bermain Game */}
              <div className="bg-[#1a1a24]/70 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-400">
                    {currentUserPeer.gamesPlayedCount} Pertandingan
                  </span>
                  <span className="font-semibold text-gray-300">Riwayat Bermain Game</span>
                  <span className="font-bold text-purple-400">
                    {selectedPeer.gamesPlayedCount} Pertandingan
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 h-2.5">
                  <div className="bg-slate-800/80 rounded-l-full overflow-hidden flex justify-end">
                    <div
                      className="bg-gradient-to-r from-cyan-500 to-cyan-300 rounded-l-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (currentUserPeer.gamesPlayedCount / maxGames) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="bg-slate-800/80 rounded-r-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-purple-600 rounded-r-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (selectedPeer.gamesPlayedCount / maxGames) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>

              {/* 3. Total Skor Keilmuan */}
              <div className="bg-[#1a1a24]/70 p-3.5 rounded-xl border border-white/10 space-y-2">
                <div className="flex justify-between items-center text-xs">
                  <span className="font-bold text-cyan-400">
                    {currentUserPeer.totalKnowledgeScore.toLocaleString("id-ID")} Pts
                  </span>
                  <span className="font-semibold text-gray-300 flex items-center gap-1">
                    <Flame className="w-3.5 h-3.5 text-amber-400 inline" />
                    Total Skor Keilmuan
                  </span>
                  <span className="font-bold text-purple-400">
                    {selectedPeer.totalKnowledgeScore.toLocaleString("id-ID")} Pts
                  </span>
                </div>
                <div className="grid grid-cols-2 gap-2 h-2.5">
                  <div className="bg-slate-800/80 rounded-l-full overflow-hidden flex justify-end">
                    <div
                      className="bg-gradient-to-r from-amber-400 to-cyan-400 rounded-l-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (currentUserPeer.totalKnowledgeScore / maxScore) * 100)}%`,
                      }}
                    />
                  </div>
                  <div className="bg-slate-800/80 rounded-r-full overflow-hidden">
                    <div
                      className="bg-gradient-to-r from-purple-400 to-amber-400 rounded-r-full transition-all duration-500"
                      style={{
                        width: `${Math.min(100, (selectedPeer.totalKnowledgeScore / maxScore) * 100)}%`,
                      }}
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick Action Buttons */}
            <div className="flex flex-wrap items-center justify-end gap-3 pt-3 border-t border-white/10">
              {/* Senggol Action */}
              <button
                type="button"
                disabled={!canSenggol}
                onClick={() => onSenggol && onSenggol(selectedPeer)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  canSenggol
                    ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 hover:scale-[1.02] shadow-lg shadow-amber-500/10 cursor-pointer"
                    : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed opacity-60"
                }`}
                title={
                  canSenggol
                    ? "Senggol teman untuk mengingatkan menyelesaikan tugas"
                    : "Senggol aktif jika kamu sudah selesai tugas dan temanmu belum"
                }
              >
                <BellRing className="w-4 h-4" />
                👋 Senggol Teman
              </button>

              {/* Ajak Tanding Action */}
              <button
                type="button"
                disabled={!isMutual}
                onClick={() => onAjakTanding && onAjakTanding(selectedPeer)}
                className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all ${
                  isMutual
                    ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] shadow-lg shadow-cyan-500/20 cursor-pointer"
                    : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed opacity-60"
                }`}
                title={
                  isMutual
                    ? "Ajak tanding langsung di Arena Pasang Konsep"
                    : "Harus berstatus Saling Mengikuti untuk bertanding"
                }
              >
                <Swords className="w-4 h-4" />
                ⚔️ Ajak Tanding
              </button>

              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2.5 rounded-xl text-xs font-medium text-gray-300 hover:bg-white/10 transition-colors"
              >
                Tutup
              </button>
            </div>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
