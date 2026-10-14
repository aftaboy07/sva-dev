"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { ModuleItem } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import {
  BookOpen,
  FileText,
  Video,
  Sparkles,
  Search,
  Filter,
  Download,
  Eye,
  CheckCircle,
  Folder,
  ChevronRight,
  PlayCircle,
  Share2,
  Clock,
  Layers,
  GraduationCap,
} from "lucide-react";

export default function TabRuangMateri() {
  const { learningMaterials, theme } = useEduQuest();
  const isDark = theme === "dark";

  const [selectedLevel, setSelectedLevel] = useState<string>("ALL");
  const [selectedType, setSelectedType] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [activeModuleModal, setActiveModuleModal] = useState<ModuleItem | null>(null);

  const materialsList = learningMaterials || [];

  const filteredModules = materialsList.filter((item) => {
    if (!item) return false;
    const matchLevel = selectedLevel === "ALL" || item.level === selectedLevel;
    const matchType = selectedType === "ALL" || item.type === selectedType;
    const q = (debouncedSearchQuery || "").toLowerCase();
    const matchSearch =
      !q.trim() ||
      item.title?.toLowerCase().includes(q) ||
      item.subject?.toLowerCase().includes(q) ||
      (item.topics && item.topics.some((t) => t?.toLowerCase().includes(q))) ||
      (item.targetClasses && item.targetClasses.some((c) => c.toLowerCase().includes(q)));
    return matchLevel && matchType && matchSearch;
  });

  const levelDirectories = [
    {
      id: "RA",
      name: "Jenjang RA",
      fase: "Fase Fondasi (PAUD / TK-B)",
      count: materialsList.filter((m) => m.level === "RA").length,
      iconColor: "text-emerald-400 bg-emerald-500/10 border-emerald-500/20",
    },
    {
      id: "SD",
      name: "Jenjang SD",
      fase: "Fase A - C (Kelas 1 - 6)",
      count: materialsList.filter((m) => m.level === "SD").length,
      iconColor: "text-amber-400 bg-amber-500/10 border-amber-500/20",
    },
    {
      id: "MTs",
      name: "Jenjang MTs",
      fase: "Fase D (Kelas 7 - 9)",
      count: materialsList.filter((m) => m.level === "MTs").length,
      iconColor: "text-cyan-400 bg-cyan-500/10 border-cyan-500/20",
    },
  ];

  return (
    <div className="space-y-8 pb-20 md:pb-6 text-white">
      {/* Header Section */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <BookOpen className="w-3.5 h-3.5 text-cyan-400" />
            <span>Perpustakaan Digital Modul Pembelajaran</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Ruang Materi & Modul Belajar
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-slate-600 font-medium"
            }`}
          >
            Akses bahan ajar resmi yang diunggah langsung oleh guru pengampu: dokumen PDF, rangkuman materi, dan panduan belajar santri YPI As Sa'adah.
          </p>
        </div>

        {/* Search input */}
        <div className="relative w-full md:w-72">
          <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            placeholder="Cari materi, bab, rumus..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className={`w-full pl-10 pr-4 py-2.5 rounded-xl border text-xs focus:outline-none focus:ring-2 focus:ring-cyan-400 transition-all ${
              isDark
                ? "bg-[#1a1a24] border-white/10 text-white placeholder-gray-500"
                : "bg-white border-slate-200 text-slate-900 placeholder-slate-400 shadow-sm"
            }`}
          />
        </div>
      </div>

      {/* SLEEK EMPTY STATE: WHEN NO MATERIALS ARE UPLOADED YET */}
      {materialsList.length === 0 ? (
        <div
          className={`rounded-3xl border p-12 sm:p-16 text-center space-y-4 backdrop-blur-xl ${
            isDark
              ? "bg-[#1a1a24]/80 border-white/10 text-white shadow-2xl"
              : "bg-white border-slate-200 text-slate-900 shadow-md"
          }`}
        >
          <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
            <BookOpen className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-2">
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Platform Interaktif Guru & Santri</span>
            </div>
            <h3 className="text-xl font-bold tracking-tight">
              Belum Ada Materi yang Diunggah
            </h3>
            <p className="text-xs sm:text-sm text-gray-400">
              Belum ada materi pembelajaran yang diunggah oleh dewan guru pengampu. Silakan tunggu guru kelas Anda mengunggah modul ajar baru atau periksa tugas di menu Beranda.
            </p>
          </div>
        </div>
      ) : (
        <>
          {/* Categorized Directory Folders (RA / SD / MTs) */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {levelDirectories.map((dir) => {
              const isSelected = selectedLevel === dir.id;
              return (
                <button
                  key={dir.id}
                  onClick={() => setSelectedLevel(isSelected ? "ALL" : dir.id)}
                  className={`p-5 rounded-2xl border text-left transition-all duration-200 flex items-start justify-between group cursor-pointer ${
                    isSelected
                      ? "bg-gradient-to-br from-cyan-500/20 to-blue-500/10 border-cyan-500/50 shadow-lg shadow-cyan-500/10 scale-[1.02]"
                      : isDark
                      ? "bg-[#1a1a24]/80 border-white/10 hover:border-cyan-500/30"
                      : "bg-white border-slate-200 hover:border-cyan-400 shadow-sm"
                  }`}
                >
                  <div className="space-y-1">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center mb-3 border ${dir.iconColor}`}
                    >
                      <Folder className="w-5 h-5 fill-current" />
                    </div>
                    <h4 className="font-bold text-base text-white">{dir.name}</h4>
                    <p className="text-xs font-medium text-gray-400">{dir.fase}</p>
                    <span className="inline-block text-[10px] font-bold px-2 py-0.5 rounded-full mt-2 bg-white/10 text-cyan-300 border border-white/10">
                      {dir.count} Modul Tersedia
                    </span>
                  </div>
                  <ChevronRight
                    className={`w-5 h-5 transition-transform group-hover:translate-x-1 ${
                      isSelected ? "text-cyan-400" : "text-gray-500"
                    }`}
                  />
                </button>
              );
            })}
          </div>

          {/* Filter Tabs & Content Display */}
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3 border-b border-white/10 pb-3">
              {/* Level Filter Pills */}
              <div className="flex items-center gap-1.5 overflow-x-auto">
                {[
                  { id: "ALL", label: "Semua Jenjang" },
                  { id: "RA", label: "RA (Fase Fondasi)" },
                  { id: "SD", label: "SD (Fase A-C)" },
                  { id: "MTs", label: "MTs (Fase D)" },
                ].map((lvl) => (
                  <button
                    key={lvl.id}
                    onClick={() => setSelectedLevel(lvl.id)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold whitespace-nowrap transition cursor-pointer ${
                      selectedLevel === lvl.id
                        ? "bg-cyan-500 text-slate-950 font-black shadow-sm"
                        : "bg-white/5 text-gray-400 hover:text-white hover:bg-white/10"
                    }`}
                  >
                    {lvl.label}
                  </button>
                ))}
              </div>

              {/* Type Filter Pills */}
              <div className="flex items-center gap-1.5">
                {[
                  { id: "ALL", label: "Semua Format" },
                  { id: "pdf", label: "PDF", icon: FileText },
                  { id: "doc", label: "Dokumen", icon: FileText },
                  { id: "video", label: "Video", icon: Video },
                  { id: "interactive", label: "Interaktif", icon: Sparkles },
                ].map((type) => (
                  <button
                    key={type.id}
                    onClick={() => setSelectedType(type.id)}
                    className={`px-2.5 py-1.5 rounded-lg text-xs font-semibold border flex items-center gap-1 transition cursor-pointer ${
                      selectedType === type.id
                        ? "border-cyan-400 bg-cyan-500/20 text-cyan-300 font-bold"
                        : "border-white/10 bg-white/5 text-gray-400 hover:text-white"
                    }`}
                  >
                    {type.icon && <type.icon className="w-3.5 h-3.5" />}
                    <span>{type.label}</span>
                  </button>
                ))}
              </div>
            </div>

            {/* Modules Grid */}
            {filteredModules.length === 0 ? (
              <div className="py-16 text-center bg-[#1a1a24]/80 rounded-2xl border border-dashed border-white/10">
                <BookOpen className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                <p className="text-sm font-bold text-gray-300">
                  Tidak ada materi yang sesuai filter
                </p>
                <p className="text-xs text-gray-500 mt-1">
                  Coba reset pencarian atau pilih kategori jenjang yang berbeda.
                </p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
                {filteredModules.map((module) => {
                  return (
                    <div
                      key={module.id}
                      className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 group ${
                        isDark
                          ? "bg-[#1a1a24]/80 border-white/10 hover:border-cyan-500/40 shadow-lg shadow-black/30"
                          : "bg-white border-slate-200 hover:border-cyan-400 shadow-sm"
                      }`}
                    >
                      <div className="space-y-3">
                        {/* Header Tags */}
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            {module.level} • {module.subject}
                          </span>
                          <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                            <FileText className="w-3.5 h-3.5 text-cyan-400" />
                            {module.type.toUpperCase()}
                          </span>
                        </div>

                        <div>
                          <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                            {module.title}
                          </h4>
                          <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                            {module.description}
                          </p>
                        </div>

                        {/* Target Classes */}
                        {module.targetClasses && module.targetClasses.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] font-bold text-gray-400 uppercase block">
                              Untuk Kelas:
                            </span>
                            <div className="flex flex-wrap gap-1">
                              {module.targetClasses.map((cls) => (
                                <span
                                  key={cls}
                                  className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-white/5 border border-white/10 text-gray-300"
                                >
                                  {cls}
                                </span>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Topics */}
                        {module.topics && module.topics.length > 0 && (
                          <div className="flex flex-wrap gap-1 pt-1">
                            {module.topics.slice(0, 3).map((t) => (
                              <span
                                key={t}
                                className="text-[10px] px-2 py-0.5 rounded bg-white/5 text-gray-400"
                              >
                                #{t}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                          <span>Pengampu: {module.author}</span>
                          <span>{module.fileSize || module.durationOrPages}</span>
                        </div>
                      </div>

                      <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                        <button
                          onClick={() => setActiveModuleModal(module)}
                          className="flex-1 inline-flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer shadow-sm shadow-cyan-500/20"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Baca / Buka Modul</span>
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </>
      )}

      {/* READING / PREVIEW MODAL */}
      {activeModuleModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-2xl w-full rounded-3xl bg-[#1a1a24] border border-cyan-500/40 p-6 sm:p-8 space-y-6 text-white shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <BookOpen className="w-5 h-5 text-cyan-400" />
                <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                  Modul Pembelajaran Santri
                </span>
              </div>
              <button
                onClick={() => setActiveModuleModal(null)}
                className="text-gray-400 hover:text-white text-sm"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 uppercase">
                  {activeModuleModal.level} • {activeModuleModal.subject}
                </span>
                <span className="text-xs text-gray-400">
                  Pengampu: {activeModuleModal.author}
                </span>
              </div>

              <h3 className="text-xl font-extrabold text-white">
                {activeModuleModal.title}
              </h3>

              <div className="p-4 rounded-xl bg-black/30 border border-white/5 space-y-2">
                <h5 className="text-xs font-bold uppercase text-gray-400">Petunjuk Pembelajaran:</h5>
                <p className="text-xs sm:text-sm text-gray-300 leading-relaxed">
                  {activeModuleModal.description}
                </p>
              </div>

              {activeModuleModal.targetClasses && (
                <div className="space-y-1.5">
                  <h5 className="text-xs font-bold text-gray-400 uppercase">Target Kelas Santri:</h5>
                  <div className="flex flex-wrap gap-1.5">
                    {activeModuleModal.targetClasses.map((cls) => (
                      <span
                        key={cls}
                        className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                      >
                        {cls}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                <CheckCircle className="w-4 h-4" />
                Format {activeModuleModal.type.toUpperCase()} Siap Dipelajari
              </span>
              <button
                onClick={() => {
                  alert(`Memulai unduhan berkas: ${activeModuleModal.title}.${activeModuleModal.type}`);
                  setActiveModuleModal(null);
                }}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Modul</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
