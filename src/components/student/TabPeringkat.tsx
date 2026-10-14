"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { MOCK_LEADERBOARD } from "@/data/mockData";
import { Trophy, Medal, Crown, Flame, Sparkles, Search, ArrowUp, Star } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function TabPeringkat() {
  const { currentUser, studentData, theme } = useEduQuest();
  const isDark = theme === "dark";
  const [filterQuery, setFilterQuery] = useState("");
  const debouncedFilterQuery = useDebounce(filterQuery, 250);

  const top1 = MOCK_LEADERBOARD[0];
  const top2 = MOCK_LEADERBOARD[1];
  const top3 = MOCK_LEADERBOARD[2];
  const restRankings = (MOCK_LEADERBOARD || []).slice(3);

  const q = (debouncedFilterQuery || "").toLowerCase();
  const filteredRestRankings = restRankings.filter(
    (item) =>
      !q.trim() ||
      item?.name?.toLowerCase().includes(q) ||
      item?.grade?.toLowerCase().includes(q) ||
      item?.badge?.toLowerCase().includes(q)
  );

  return (
    <div className="space-y-10 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-100 text-amber-900 text-xs font-semibold mb-2">
            <Trophy className="w-3.5 h-3.5 text-[#ffbf00]" />
            <span>Papan Prestasi & Liga YPI As Sa'adah</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Peringkat Global SVA Dev
          </h2>
          <p
            className={`text-xs sm:text-sm transition-colors duration-500 ${
              isDark ? "text-slate-400" : "text-slate-600 font-medium"
            }`}
          >
            Perolehan EXP dari modul, kehadiran, dan kuis disinkronisasi setiap 24 jam untuk menentukan pemuncak klasemen.
          </p>
        </div>

        {/* Current User Highlight Badge */}
        <div className="bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white p-3.5 rounded-2xl flex items-center gap-3.5 shadow-md shadow-slate-900/25">
          <div className="w-10 h-10 rounded-xl bg-white/15 flex items-center justify-center font-black text-sm text-[#ffbf00]">
            #7
          </div>
          <div>
            <span className="text-[11px] text-cyan-200 block font-medium">
              Posisi Kamu Saat Ini:
            </span>
            <span className="text-xs font-bold block">
              {currentUser?.name} • {studentData.currentExp.toLocaleString()} EXP
            </span>
          </div>
          <div className="text-[10px] text-slate-950 font-bold bg-[#ffbf00] px-2.5 py-1 rounded-lg">
            Butuh 190 EXP ke Top 5
          </div>
        </div>
      </div>

      {/* GAMIFIED PODIUM UI: TOP 3 STUDENTS */}
      <div className="bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 rounded-3xl p-6 sm:p-10 text-white shadow-2xl relative overflow-hidden">
        {/* Subtle background glow */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 grid grid-cols-3 gap-2 sm:gap-6 items-end max-w-2xl mx-auto pt-8">
          {/* JUARA 2 (SILVER) */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative mb-3">
              <img
                src={top2.avatar}
                alt={top2.name}
                className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl object-cover ring-4 ring-slate-300 shadow-lg"
              />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black bg-slate-200 text-slate-800 flex items-center gap-1 shadow">
                🥈 2
              </span>
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-full">
              {top2.name}
            </h4>
            <span className="text-[10px] text-slate-300 truncate max-w-full block mb-2">
              {top2.badge}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 block mb-3">
              {top2.exp.toLocaleString()} EXP
            </span>

            {/* Podium Block */}
            <div className="w-full h-28 sm:h-36 bg-gradient-to-t from-slate-800 to-slate-700/80 rounded-t-2xl border-t-2 border-slate-300 flex items-center justify-center text-xl sm:text-2xl font-black text-slate-400">
              2nd
            </div>
          </div>

          {/* JUARA 1 (GOLD) */}
          <div className="flex flex-col items-center text-center group -mt-6">
            <div className="relative mb-3">
              <Crown className="w-8 h-8 text-amber-400 absolute -top-9 left-1/2 -translate-x-1/2 animate-bounce" />
              <img
                src={top1.avatar}
                alt={top1.name}
                className="w-20 sm:w-24 h-20 sm:h-24 rounded-2xl object-cover ring-4 ring-amber-400 shadow-xl shadow-amber-400/20"
              />
              <span className="absolute -bottom-2 left-1/2 -translate-x-1/2 px-2.5 py-0.5 rounded-full text-[10px] font-black bg-gradient-to-r from-amber-400 to-yellow-300 text-amber-950 flex items-center gap-1 shadow">
                🥇 JUARA 1
              </span>
            </div>
            <h4 className="font-extrabold text-sm sm:text-base text-white truncate max-w-full">
              {top1.name}
            </h4>
            <span className="text-[10px] sm:text-xs text-amber-200 truncate max-w-full block mb-2">
              {top1.grade}
            </span>
            <span className="text-sm sm:text-base font-black text-amber-300 block mb-3">
              {top1.exp.toLocaleString()} EXP
            </span>

            {/* Podium Block */}
            <div className="w-full h-36 sm:h-48 bg-gradient-to-t from-amber-600/60 via-amber-500/80 to-amber-400 rounded-t-2xl border-t-2 border-yellow-200 flex items-center justify-center text-3xl sm:text-4xl font-black text-amber-950 shadow-lg">
              1st
            </div>
          </div>

          {/* JUARA 3 (BRONZE) */}
          <div className="flex flex-col items-center text-center group">
            <div className="relative mb-3">
              <img
                src={top3.avatar}
                alt={top3.name}
                className="w-16 sm:w-20 h-16 sm:h-20 rounded-2xl object-cover ring-4 ring-amber-700 shadow-lg"
              />
              <span className="absolute -top-3 left-1/2 -translate-x-1/2 px-2 py-0.5 rounded-full text-[10px] font-black bg-amber-700 text-amber-100 flex items-center gap-1 shadow">
                🥉 3
              </span>
            </div>
            <h4 className="font-bold text-xs sm:text-sm text-white truncate max-w-full">
              {top3.name}
            </h4>
            <span className="text-[10px] text-slate-300 truncate max-w-full block mb-2">
              {top3.badge}
            </span>
            <span className="text-xs sm:text-sm font-black text-amber-300 block mb-3">
              {top3.exp.toLocaleString()} EXP
            </span>

            {/* Podium Block */}
            <div className="w-full h-20 sm:h-28 bg-gradient-to-t from-amber-950 to-amber-900/80 rounded-t-2xl border-t-2 border-amber-600 flex items-center justify-center text-lg sm:text-xl font-black text-amber-400">
              3rd
            </div>
          </div>
        </div>
      </div>

      {/* GLOBAL VERTICAL LEADERBOARD (RANKS 4 - 10+) */}
      <div
        className={`rounded-3xl border p-6 space-y-4 shadow-xs transition-colors duration-500 ${
          isDark
            ? "bg-[#1a1a24] border-white/10 text-white"
            : "bg-white border-slate-200 text-slate-900"
        }`}
      >
        <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b pb-4 transition-colors duration-500 ${isDark ? "border-white/10" : "border-slate-100"}`}>
          <div>
            <h3
              className={`text-base font-bold transition-colors duration-500 ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              Daftar Peringkat Pelajar (Posisi 4 - 10)
            </h3>
            <p
              className={`text-xs transition-colors duration-500 ${
                isDark ? "text-gray-400" : "text-slate-500"
              }`}
            >
              Peringkat diperbarui secara otomatis berdasarkan akumulasi EXP aktivitas.
            </p>
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Cari siswa atau sekolah..."
              value={filterQuery}
              onChange={(e) => setFilterQuery(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs rounded-xl border border-slate-200 bg-slate-50 focus:bg-white"
            />
          </div>
        </div>

        <div className="space-y-2.5">
          {filteredRestRankings.map((student) => {
            const isMe = student.isCurrentUser;
            return (
              <div
                key={student.id}
                className={`flex items-center justify-between p-3.5 sm:p-4 rounded-2xl border transition-all ${
                  isMe
                    ? "bg-violet-50/80 border-violet-400 ring-2 ring-violet-500/20 shadow-xs"
                    : "bg-white border-slate-100 hover:border-slate-200 hover:bg-slate-50/50"
                }`}
              >
                <div className="flex items-center gap-3.5">
                  <span
                    className={`w-8 h-8 rounded-xl font-extrabold text-xs flex items-center justify-center ${
                      isMe
                        ? "bg-violet-700 text-white"
                        : "bg-slate-100 text-slate-600"
                    }`}
                  >
                    #{student.rank}
                  </span>

                  <img
                    src={student.avatar}
                    alt={student.name}
                    className="w-10 h-10 rounded-xl object-cover ring-1 ring-slate-200"
                  />

                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-bold text-sm text-slate-900">
                        {student.name}
                      </span>
                      {isMe && (
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-violet-600 text-white">
                          Kamu
                        </span>
                      )}
                    </div>
                    <span className="text-xs text-slate-500 font-medium">
                      {student.grade} • {student.badge}
                    </span>
                  </div>
                </div>

                <div className="flex items-center gap-3 text-right">
                  <div>
                    <span className="font-black text-sm text-violet-900 block">
                      {student.exp.toLocaleString()} EXP
                    </span>
                    <span className="text-[10px] font-semibold text-amber-700 block">
                      🪙 {student.coins} Koin
                    </span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
