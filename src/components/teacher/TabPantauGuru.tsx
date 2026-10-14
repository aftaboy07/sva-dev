"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { INITIAL_FACULTY_TEACHERS } from "@/data/mockData";
import { TeacherActivityRecord, ModuleItem, UrgentTask } from "@/types";
import DebouncedSearchInput from "@/components/common/DebouncedSearchInput";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  Clock,
  Sparkles,
  BookOpen,
  FileCheck,
  ShieldCheck,
  Send,
  Eye,
  GraduationCap,
  Layers,
  ChevronRight,
  ExternalLink,
  MessageSquare,
  BadgeCheck,
} from "lucide-react";

export default function TabPantauGuru() {
  const {
    currentUser,
    learningMaterials,
    urgentTasks,
    customGames,
    staffAttendance,
    theme,
  } = useEduQuest();

  const isDark = theme === "dark";

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState("");
  const [levelFilter, setLevelFilter] = useState<string>(() => {
    if (currentUser?.levelAssignment === "RA") return "RA";
    if (currentUser?.levelAssignment === "SD") return "SD";
    if (currentUser?.levelAssignment === "MTs") return "MTs";
    return "ALL";
  });
  const [statusFilter, setStatusFilter] = useState<"ALL" | "HADIR" | "BELUM">("ALL");

  // Selected Teacher for Portfolio Modal
  const [selectedTeacher, setSelectedTeacher] = useState<TeacherActivityRecord | null>(null);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // Merge INITIAL_FACULTY_TEACHERS with real-time stats
  const facultyData: TeacherActivityRecord[] = INITIAL_FACULTY_TEACHERS.map((teacher) => {
    // Dynamic material count for this teacher
    const materialsCount = learningMaterials.filter(
      (m) =>
        m.author?.toLowerCase().includes(teacher.name.toLowerCase()) ||
        (m.level === teacher.level && m.author?.includes("Kepala"))
    ).length;

    // Dynamic tasks/quizzes count for this teacher
    const tasksCount =
      urgentTasks.filter(
        (t) =>
          t.targetClasses?.some((c) => c.includes(teacher.level)) ||
          t.subject.toLowerCase().includes(teacher.role.toLowerCase().slice(0, 3))
      ).length +
      customGames.filter(
        (g) =>
          g.creatorName?.toLowerCase().includes(teacher.name.toLowerCase()) ||
          g.targetAudience?.includes(teacher.level)
      ).length;

    // Find attendance record for today
    const attRecord = staffAttendance.find(
      (a) => a.staffNip === teacher.nip || a.staffName?.toLowerCase().includes(teacher.name.toLowerCase())
    );

    const isPresent = attRecord?.status === "Hadir Tepat Waktu" || teacher.attendanceStatus === "Hadir Tepat Waktu";
    const clockIn = attRecord?.clockInTime || teacher.clockInTime;

    return {
      ...teacher,
      materialsCount,
      tasksCount,
      attendanceStatus: isPresent ? "Hadir Tepat Waktu" : "Belum Hadir",
      clockInTime: clockIn,
      livenessVerified: attRecord?.livenessVerified ?? teacher.livenessVerified ?? false,
    };
  });

  // Filtered List
  const filteredTeachers = facultyData.filter((t) => {
    const matchSearch =
      !searchQuery.trim() ||
      t.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.nip.toLowerCase().includes(searchQuery.toLowerCase()) ||
      t.role.toLowerCase().includes(searchQuery.toLowerCase());

    const matchLevel = levelFilter === "ALL" || t.level === levelFilter;

    let matchStatus = true;
    if (statusFilter === "HADIR") {
      matchStatus = t.attendanceStatus === "Hadir Tepat Waktu";
    } else if (statusFilter === "BELUM") {
      matchStatus = t.attendanceStatus === "Belum Hadir";
    }

    return matchSearch && matchLevel && matchStatus;
  });

  // Metrics
  const totalTeachers = facultyData.length;
  const attendedCount = facultyData.filter((t) => t.attendanceStatus === "Hadir Tepat Waktu").length;
  const attendancePercentage = totalTeachers > 0 ? Math.round((attendedCount / totalTeachers) * 100) : 0;
  const totalUploadedMaterials = learningMaterials.length;
  const totalAssignedTasks = urgentTasks.length + customGames.length;

  const handleSendReminder = (teacher: TeacherActivityRecord) => {
    setToastMessage(`Pengingat supervisi berhasil dikirim ke ${teacher.name} (${teacher.phone || teacher.nip}).`);
    setTimeout(() => setToastMessage(null), 3500);
  };

  return (
    <div className="space-y-8 pb-12">
      {/* Toast Alert */}
      {toastMessage && (
        <div className="fixed top-20 right-6 z-50 p-4 bg-emerald-500/20 border border-emerald-500/50 backdrop-blur-xl rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 shadow-2xl animate-fade-in">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <GraduationCap className="w-3.5 h-3.5" />
            <span>Supervisi Akademik & Manajemen Tenaga Pendidik</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Pantau Kinerja Dewan Guru & Pengampu
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-slate-600 font-medium"
            }`}
          >
            Monitoring real-time aktivitas belajar-mengajar: jumlah modul pembelajaran yang diunggah, penugasan kuis/asesmen yang diberikan, dan status presensi liveness biometrik guru.
          </p>
        </div>

        {/* Debounced Search */}
        <div className="w-full md:w-72">
          <DebouncedSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari nama atau NIP guru..."
          />
        </div>
      </div>

      {/* SUMMARY STAT CARDS */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Total Teachers */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#1a1a24]/80 border-white/10 shadow-lg shadow-black/30"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Dewan Guru Aktif
            </span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center">
              <Users className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {totalTeachers}
            </span>
            <span className="text-xs text-gray-400 ml-1.5 font-medium">Ustadz/Ustadzah</span>
          </div>
          <p className="text-[11px] text-cyan-400/80 mt-1 font-semibold">
            Unit RA, SD & MTs As Sa'adah
          </p>
        </div>

        {/* Card 2: Uploaded Materials */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#1a1a24]/80 border-white/10 shadow-lg shadow-black/30"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Materi Terunggah
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center">
              <BookOpen className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {totalUploadedMaterials}
            </span>
            <span className="text-xs text-gray-400 ml-1.5 font-medium">Modul Ajar</span>
          </div>
          <p className="text-[11px] text-blue-400/80 mt-1 font-semibold">
            Format PDF & Dokumen Ajar
          </p>
        </div>

        {/* Card 3: Assigned Tasks & Quizzes */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#1a1a24]/80 border-white/10 shadow-lg shadow-black/30"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Tugas & Kuis Aktif
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
              <FileCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {totalAssignedTasks}
            </span>
            <span className="text-xs text-gray-400 ml-1.5 font-medium">Tantangan</span>
          </div>
          <p className="text-[11px] text-emerald-400/80 mt-1 font-semibold">
            Asesmen mandiri & kuis real-time
          </p>
        </div>

        {/* Card 4: Liveness Attendance Rate */}
        <div
          className={`p-5 rounded-2xl border transition-all ${
            isDark
              ? "bg-[#1a1a24]/80 border-white/10 shadow-lg shadow-black/30"
              : "bg-white border-slate-200 shadow-sm"
          }`}
        >
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-gray-400 uppercase tracking-wider">
              Presensi Liveness Hari Ini
            </span>
            <div className="w-8 h-8 rounded-xl bg-[#ffbf00]/20 text-[#ffbf00] flex items-center justify-center">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="mt-3">
            <span className="text-2xl sm:text-3xl font-black text-white">
              {attendancePercentage}%
            </span>
            <span className="text-xs text-gray-400 ml-1.5 font-medium">
              ({attendedCount}/{totalTeachers} Hadir)
            </span>
          </div>
          <p className="text-[11px] text-emerald-400 mt-1 font-semibold flex items-center gap-1">
            <CheckCircle2 className="w-3.5 h-3.5" />
            Tervalidasi Face AI & GPS
          </p>
        </div>
      </div>

      {/* FILTER TABS */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-white/10">
        {/* Jenjang Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-400 mr-1 flex items-center gap-1">
            <Filter className="w-3.5 h-3.5" />
            Jenjang:
          </span>
          {[
            { id: "ALL", label: "Semua Unit" },
            { id: "RA", label: "RA" },
            { id: "SD", label: "SD" },
            { id: "MTs", label: "MTs" },
          ].map((flt) => (
            <button
              key={flt.id}
              onClick={() => setLevelFilter(flt.id)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                levelFilter === flt.id
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {flt.label}
            </button>
          ))}
        </div>

        {/* Attendance Status Filter */}
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-bold text-gray-400 mr-1">Status Kehadiran:</span>
          {[
            { id: "ALL", label: "Semua" },
            { id: "HADIR", label: "Hadir Liveness" },
            { id: "BELUM", label: "Belum Hadir" },
          ].map((st) => (
            <button
              key={st.id}
              onClick={() => setStatusFilter(st.id as any)}
              className={`px-3 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                statusFilter === st.id
                  ? "bg-white/20 text-white border border-white/30"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              {st.label}
            </button>
          ))}
        </div>
      </div>

      {/* DATA TABLE: TRACKER DEWAN GURU */}
      <div
        className={`rounded-3xl border overflow-hidden backdrop-blur-xl ${
          isDark
            ? "bg-[#1a1a24]/80 border-white/10 shadow-2xl"
            : "bg-white border-slate-200 shadow-md"
        }`}
      >
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-white/10 bg-white/5 text-gray-400 text-xs">
                <th className="py-4 pl-5 font-bold uppercase tracking-wider">Nama Guru & NIP</th>
                <th className="py-4 font-bold uppercase tracking-wider">Unit & Jabatan</th>
                <th className="py-4 text-center font-bold uppercase tracking-wider">
                  Materi Terunggah
                </th>
                <th className="py-4 text-center font-bold uppercase tracking-wider">
                  Tugas & Kuis Diberikan
                </th>
                <th className="py-4 font-bold uppercase tracking-wider">Presensi Liveness</th>
                <th className="py-4 pr-5 text-right font-bold uppercase tracking-wider">
                  Aksi Supervisi
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredTeachers.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-gray-400">
                    Tidak ditemukan data dewan guru yang sesuai dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredTeachers.map((teacher) => {
                  const isPresent = teacher.attendanceStatus === "Hadir Tepat Waktu";

                  return (
                    <tr
                      key={teacher.nip}
                      className="hover:bg-white/5 transition-colors group"
                    >
                      {/* Name & Avatar */}
                      <td className="py-4 pl-5">
                        <div className="flex items-center gap-3">
                          <img
                            src={teacher.avatar}
                            alt={teacher.name}
                            className="w-10 h-10 rounded-2xl object-cover border border-white/20 shadow-xs shrink-0"
                          />
                          <div>
                            <div className="flex items-center gap-1.5">
                              <p className="font-extrabold text-white text-sm">
                                {teacher.name}
                              </p>
                              <BadgeCheck className="w-4 h-4 text-cyan-400 shrink-0" />
                            </div>
                            <p className="text-[11px] font-mono text-cyan-300">
                              NIP: {teacher.nip}
                            </p>
                          </div>
                        </div>
                      </td>

                      {/* Unit & Role */}
                      <td className="py-4">
                        <div className="space-y-1">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                            Unit {teacher.level}
                          </span>
                          <p className="text-xs text-gray-300 font-semibold">{teacher.role}</p>
                        </div>
                      </td>

                      {/* Materials Count */}
                      <td className="py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-blue-500/15 border border-blue-500/30 text-blue-300 font-extrabold text-xs">
                          <BookOpen className="w-3.5 h-3.5" />
                          <span>{teacher.materialsCount} Modul</span>
                        </div>
                      </td>

                      {/* Tasks Count */}
                      <td className="py-4 text-center">
                        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-300 font-extrabold text-xs">
                          <FileCheck className="w-3.5 h-3.5" />
                          <span>{teacher.tasksCount} Tugas/Kuis</span>
                        </div>
                      </td>

                      {/* Liveness Attendance */}
                      <td className="py-4">
                        {isPresent ? (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                              Hadir Tepat Waktu
                            </span>
                            <div className="flex items-center gap-1.5 text-[10px] text-gray-400">
                              <Clock className="w-3 h-3 text-cyan-400" />
                              <span>{teacher.clockInTime || "06:40 WIB"}</span>
                              {teacher.livenessVerified && (
                                <span className="text-emerald-400 font-semibold">• Face AI ✓</span>
                              )}
                            </div>
                          </div>
                        ) : (
                          <div className="space-y-1">
                            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[11px] font-bold bg-amber-500/20 text-amber-300 border border-amber-500/40">
                              <span className="w-2 h-2 rounded-full bg-amber-400" />
                              Belum Hadir
                            </span>
                            <p className="text-[10px] text-gray-500">Belum Clock In hari ini</p>
                          </div>
                        )}
                      </td>

                      {/* Supervisory Actions */}
                      <td className="py-4 pr-5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => setSelectedTeacher(teacher)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-semibold transition cursor-pointer"
                            title="Lihat Detail Portofolio & Konten Guru"
                          >
                            <Eye className="w-3.5 h-3.5 text-cyan-400" />
                            <span>Portofolio</span>
                          </button>

                          <button
                            onClick={() => handleSendReminder(teacher)}
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
                            title="Kirim Pesan Supervisi atau Pengingat"
                          >
                            <Send className="w-3 h-3" />
                            <span className="hidden sm:inline">Kirim Pengingat</span>
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* TEACHER PORTFOLIO DRAWER / MODAL */}
      {selectedTeacher && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
          <div className="max-w-3xl w-full rounded-3xl bg-[#1a1a24] border border-cyan-500/40 p-6 sm:p-8 space-y-6 text-white shadow-2xl max-h-[90vh] overflow-y-auto">
            {/* Modal Header */}
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <img
                  src={selectedTeacher.avatar}
                  alt={selectedTeacher.name}
                  className="w-12 h-12 rounded-2xl object-cover border border-cyan-500/40 shadow-md"
                />
                <div>
                  <h3 className="text-lg font-black text-white">{selectedTeacher.name}</h3>
                  <p className="text-xs text-gray-400 font-mono">
                    NIP: {selectedTeacher.nip} • {selectedTeacher.role} (Unit {selectedTeacher.level})
                  </p>
                </div>
              </div>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="w-8 h-8 rounded-xl bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white flex items-center justify-center transition"
              >
                ✕
              </button>
            </div>

            {/* Quick Metrics Bar */}
            <div className="grid grid-cols-3 gap-3">
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Modul Terunggah</span>
                <span className="text-xl font-black text-cyan-400 mt-1 block">
                  {selectedTeacher.materialsCount} Modul
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Tugas & Kuis</span>
                <span className="text-xl font-black text-emerald-400 mt-1 block">
                  {selectedTeacher.tasksCount} Sesi
                </span>
              </div>
              <div className="p-3.5 rounded-2xl bg-black/30 border border-white/5 text-center">
                <span className="text-[10px] font-bold text-gray-400 uppercase block">Status Kehadiran</span>
                <span className="text-xs font-extrabold text-emerald-400 mt-1 block">
                  {selectedTeacher.attendanceStatus}
                </span>
              </div>
            </div>

            {/* Modules Authored by this teacher */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4" />
                <span>Modul Pembelajaran yang Dikelola ({selectedTeacher.materialsCount})</span>
              </h4>

              {selectedTeacher.materialsCount === 0 ? (
                <p className="text-xs text-gray-400 p-4 rounded-xl bg-white/5 border border-white/5 text-center">
                  Guru ini belum mengunggah modul digital di platform.
                </p>
              ) : (
                <div className="space-y-2">
                  {learningMaterials
                    .filter(
                      (m) =>
                        m.author?.toLowerCase().includes(selectedTeacher.name.toLowerCase()) ||
                        m.level === selectedTeacher.level
                    )
                    .map((m) => (
                      <div
                        key={m.id}
                        className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                      >
                        <div>
                          <p className="font-bold text-xs sm:text-sm text-white">{m.title}</p>
                          <p className="text-[11px] text-gray-400">
                            {m.subject} • Format: {m.type.toUpperCase()} • Target: {m.targetClasses?.join(", ") || m.grade}
                          </p>
                        </div>
                        <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-cyan-500/20 text-cyan-300">
                          Aktif
                        </span>
                      </div>
                    ))}
                </div>
              )}
            </div>

            {/* Tasks Authored */}
            <div className="space-y-3">
              <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                <FileCheck className="w-4 h-4" />
                <span>Penugasan & Asesmen Terjadwal</span>
              </h4>

              <div className="space-y-2">
                {urgentTasks
                  .filter((t) => t.targetClasses?.some((c) => c.includes(selectedTeacher.level)))
                  .map((t) => (
                    <div
                      key={t.id}
                      className="p-3.5 rounded-xl bg-white/5 border border-white/5 flex items-center justify-between"
                    >
                      <div>
                        <p className="font-bold text-xs sm:text-sm text-white">{t.title}</p>
                        <p className="text-[11px] text-gray-400">
                          {t.subject} • Batas: {t.dueDate}
                        </p>
                      </div>
                      <span className="text-xs font-bold text-amber-400">
                        +{t.rewardExp} EXP
                      </span>
                    </div>
                  ))}
              </div>
            </div>

            {/* Footer */}
            <div className="pt-4 border-t border-white/10 flex items-center justify-between">
              <span className="text-xs text-gray-400">Kontak: {selectedTeacher.phone || "0813-7722-001"}</span>
              <button
                onClick={() => setSelectedTeacher(null)}
                className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
              >
                Selesai Meninjau
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
