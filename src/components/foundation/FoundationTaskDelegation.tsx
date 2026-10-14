"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FolderKanban,
  CheckCircle2,
  Clock,
  AlertTriangle,
  PlusCircle,
  Search,
  Filter,
  Users,
  Building2,
  FileText,
  Calendar,
  Send,
  Download,
  Eye,
  Check,
  RotateCcw,
  Sparkles,
  ShieldCheck,
  ChevronRight,
  FileCheck,
  X,
  BellRing,
} from "lucide-react";

export interface FoundationTask {
  id: string;
  title: string;
  category: "Kurikulum" | "Administrasi" | "Akreditasi" | "Keuangan" | "Kesiswaan";
  unit: "Semua Unit" | "RA" | "SD" | "MTs";
  assignedTo: {
    nip: string;
    name: string;
    role: string;
    unit: "RA" | "SD" | "MTs";
  };
  dueDate: string;
  deadlineTimestamp: string;
  status: "completed" | "pending" | "late";
  submittedFile?: {
    name: string;
    size: string;
    submittedAt: string;
    url?: string;
  };
  instructions: string;
  isVerifiedByYayasan: boolean;
}

const INITIAL_FOUNDATION_TASKS: FoundationTask[] = [
  {
    id: "fnd-task-1",
    title: "Pengumpulan Berkas RPP & Modul Ajar Semester Ganjil 2026",
    category: "Kurikulum",
    unit: "SD",
    assignedTo: {
      nip: "KS-SD-001",
      name: "Merlisa Ayu Dwi",
      role: "Kepala Sekolah SD",
      unit: "SD",
    },
    dueDate: "18 Oktober 2026",
    deadlineTimestamp: "2026-10-18T23:59:00",
    status: "completed",
    submittedFile: {
      name: "RPP_Tematik_Kurikulum_SD_AsSaadah.pdf",
      size: "4.8 MB",
      submittedAt: "13 Oktober 2026, 14:20 WIB",
    },
    instructions: "Sertakan silabus, pemetaan capaian pembelajaran (CP), dan instrumen penilaian sumatif.",
    isVerifiedByYayasan: true,
  },
  {
    id: "fnd-task-2",
    title: "Upload Notula & Dokumentasi Rapat Kerja Dewan Guru Unit MTs",
    category: "Administrasi",
    unit: "MTs",
    assignedTo: {
      nip: "KS-MTS-001",
      name: "Nur Naimah",
      role: "Kepala Sekolah MTs",
      unit: "MTs",
    },
    dueDate: "Besok, 17:00 WIB",
    deadlineTimestamp: "2026-10-15T17:00:00",
    status: "pending",
    instructions: "Unggah berkas notula rapat kerja persiapan Ujian Tengah Semester beserta daftar hadir dan foto resmi.",
    isVerifiedByYayasan: false,
  },
  {
    id: "fnd-task-3",
    title: "Laporan Evaluasi Pembiasaan Adab & Tahfidz Quran Santri RA",
    category: "Kesiswaan",
    unit: "RA",
    assignedTo: {
      nip: "KS-RA-001",
      name: "Dwi Vivivn",
      role: "Kepala Sekolah RA",
      unit: "RA",
    },
    dueDate: "12 Oktober 2026 (Terlewat)",
    deadlineTimestamp: "2026-10-12T23:59:00",
    status: "late",
    instructions: "Rekapitulasi target hafalan juz 30 dan lembar ceklis kepribadian harian anak didik RA.",
    isVerifiedByYayasan: false,
  },
  {
    id: "fnd-task-4",
    title: "Laporan Pertanggungjawaban (LPJ) Sarana Prasarana Laboratorium",
    category: "Keuangan",
    unit: "MTs",
    assignedTo: {
      nip: "KS-MTS-001",
      name: "Nur Naimah",
      role: "Kepala Sekolah MTs",
      unit: "MTs",
    },
    dueDate: "20 Oktober 2026",
    deadlineTimestamp: "2026-10-20T23:59:00",
    status: "pending",
    instructions: "Rincian nota belanja resmi pengadaan mikroskop dan preparat biologi bersertifikat stempel toko.",
    isVerifiedByYayasan: false,
  },
  {
    id: "fnd-task-5",
    title: "Pembaruan Portofolio Akreditasi Standar Pendidik & Tenaga Kependidikan",
    category: "Akreditasi",
    unit: "SD",
    assignedTo: {
      nip: "KS-SD-001",
      name: "Merlisa Ayu Dwi",
      role: "Kepala Sekolah SD",
      unit: "SD",
    },
    dueDate: "10 Oktober 2026",
    deadlineTimestamp: "2026-10-10T23:59:00",
    status: "completed",
    submittedFile: {
      name: "Dokumen_Akreditasi_Standar_PTK_2026.pdf",
      size: "12.4 MB",
      submittedAt: "09 Oktober 2026, 10:15 WIB",
    },
    instructions: "Ijazah, sertifikat pendidik, dan SK pengangkatan yayasan seluruh dewan guru SD.",
    isVerifiedByYayasan: true,
  },
];

export default function FoundationTaskDelegation() {
  const { theme } = useEduQuest();
  const isDark = theme === "dark";

  const [tasks, setTasks] = useState<FoundationTask[]>(() => {
    try {
      const saved = localStorage.getItem("eduquest_foundation_tasks");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (t: any) =>
              t.assignedTo?.name?.includes("Rina") ||
              t.assignedTo?.name?.includes("Hendra") ||
              t.assignedTo?.name?.includes("Dahlan") ||
              t.assignedTo?.name?.includes("Ahmad") ||
              t.assignedTo?.name?.includes("Sarah")
          )
        ) {
          localStorage.removeItem("eduquest_foundation_tasks");
          return INITIAL_FOUNDATION_TASKS;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_FOUNDATION_TASKS;
  });

  // Filter States
  const [selectedUnit, setSelectedUnit] = useState<"Semua" | "RA" | "SD" | "MTs">("Semua");
  const [selectedStatus, setSelectedStatus] = useState<"Semua" | "completed" | "pending" | "late">("Semua");
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  // Modal New Task Delegation
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [newTitle, setNewTitle] = useState("");
  const [newCategory, setNewCategory] = useState<FoundationTask["category"]>("Administrasi");
  const [newUnit, setNewUnit] = useState<"RA" | "SD" | "MTs">("SD");
  const [newTeacherNip, setNewTeacherNip] = useState("KS-SD-001");
  const [newDueDate, setNewDueDate] = useState("25 Oktober 2026");
  const [newInstructions, setNewInstructions] = useState("");
  const [reminderToast, setReminderToast] = useState<string | null>(null);

  // Sync to LocalStorage
  const updateTasksState = (updated: FoundationTask[]) => {
    setTasks(updated);
    try {
      localStorage.setItem("eduquest_foundation_tasks", JSON.stringify(updated));
    } catch {}
  };

  // Stats
  const safeTasks = tasks || [];
  const totalTasks = safeTasks.length;
  const completedTasks = safeTasks.filter((t) => t?.status === "completed").length;
  const pendingTasks = safeTasks.filter((t) => t?.status === "pending").length;
  const lateTasks = safeTasks.filter((t) => t?.status === "late").length;
  const completionRate = Math.round((completedTasks / (totalTasks || 1)) * 100);

  // Filtered List
  const filteredTasks = safeTasks.filter((task) => {
    if (!task) return false;
    const matchUnit = selectedUnit === "Semua" || task.unit === selectedUnit;
    const matchStatus = selectedStatus === "Semua" || task.status === selectedStatus;
    const q = (debouncedSearchQuery || "").toLowerCase();
    const matchQuery =
      !q.trim() ||
      task.title?.toLowerCase().includes(q) ||
      task.assignedTo?.name?.toLowerCase().includes(q) ||
      (task.assignedTo?.nip && task.assignedTo.nip.includes(q));
    return matchUnit && matchStatus && matchQuery;
  });

  const handleVerifyTask = (taskId: string) => {
    const updated = tasks.map((t) =>
      t.id === taskId ? { ...t, isVerifiedByYayasan: true } : t
    );
    updateTasksState(updated);
  };

  const handleSendReminder = (task: FoundationTask) => {
    setReminderToast(`🔔 Surat peringatan resmi yayasan berhasil dikirimkan ke kontak ${task.assignedTo.name}!`);
    setTimeout(() => setReminderToast(null), 4000);
  };

  const handleCreateTask = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTitle.trim()) return;

    const teacherDirectory: Record<string, { name: string; role: string }> = {
      "KS-SD-001": { name: "Merlisa Ayu Dwi", role: "Kepala Sekolah SD" },
      "KS-RA-001": { name: "Dwi Vivivn", role: "Kepala Sekolah RA" },
      "KS-MTS-001": { name: "Nur Naimah", role: "Kepala Sekolah MTs" },
    };

    const targetInfo = teacherDirectory[newTeacherNip] || {
      name: "Dewan Guru Unit",
      role: "Tenaga Pendidik",
    };

    const created: FoundationTask = {
      id: `fnd-task-${Date.now()}`,
      title: newTitle.trim(),
      category: newCategory,
      unit: newUnit,
      assignedTo: {
        nip: newTeacherNip,
        name: targetInfo.name,
        role: targetInfo.role,
        unit: newUnit,
      },
      dueDate: newDueDate,
      deadlineTimestamp: new Date().toISOString(),
      status: "pending",
      instructions: newInstructions.trim() || "Mohon selesaikan dan unggah dokumen rujukan sesuai pedoman yayasan.",
      isVerifiedByYayasan: false,
    };

    const updated = [created, ...tasks];
    updateTasksState(updated);
    setIsModalOpen(false);

    // Reset Form
    setNewTitle("");
    setNewInstructions("");
  };

  return (
    <div className="space-y-6 text-slate-100 font-sans">
      {/* Toast Notification */}
      <AnimatePresence>
        {reminderToast && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            className="fixed top-6 right-6 z-50 px-5 py-3 rounded-2xl bg-cyan-500/20 border border-cyan-400 text-cyan-200 text-xs font-semibold backdrop-blur-xl shadow-[0_10px_30px_rgba(0,0,0,0.8)] flex items-center gap-2"
          >
            <BellRing className="w-4 h-4 text-cyan-400 shrink-0" />
            <span>{reminderToast}</span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Top Banner */}
      <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-r from-[#1a1a24] via-[#14141c] to-[#12121a] border border-white/10 shadow-2xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-96 h-96 bg-[#ffbf00]/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div className="max-w-2xl space-y-2">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#ffbf00]/20 border border-[#ffbf00]/40 text-[#ffbf00] text-xs font-bold">
              <ShieldCheck className="w-4 h-4" />
              <span>SUPERVISI DEWAN PEMBINA YAYASAN</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Delegasi Tugas & Pemantauan Administrasi Guru
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
              Pusat komando yayasan untuk mendelegasikan mandat berkas akreditasi, RPP, notula rapat, dan laporan keuangan kepada seluruh pimpinan unit dan dewan guru.
            </p>
          </div>

          <button
            onClick={() => setIsModalOpen(true)}
            className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#ffbf00] to-amber-500 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-black text-sm shadow-[0_0_25px_rgba(255,191,0,0.35)] transition-all flex items-center justify-center gap-2.5 shrink-0 cursor-pointer hover:scale-105"
          >
            <PlusCircle className="w-5 h-5" />
            <span>Buat Delegasi Tugas Baru</span>
          </button>
        </div>
      </div>

      {/* KPI Stats Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>TOTAL DELEGASI</span>
            <FolderKanban className="w-4 h-4 text-cyan-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-white">{totalTasks} Tugas</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Tercatat di Sistem Yayasan</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>SELESAI DIUNGGAH</span>
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-emerald-400">{completedTasks} Tugas</div>
          <span className="text-[11px] text-emerald-300/80 mt-1 block font-semibold">
            {completionRate}% Berkas Terkumpul
          </span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>SEDANG BERJALAN</span>
            <Clock className="w-4 h-4 text-amber-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-amber-400">{pendingTasks} Tugas</div>
          <span className="text-[11px] text-slate-400 mt-1 block">Dalam Batas Waktu Sah</span>
        </div>

        <div className="p-5 rounded-2xl bg-[#14141c] border border-white/10 shadow-lg">
          <div className="flex items-center justify-between text-slate-400 text-xs font-bold mb-2">
            <span>TERLAMBAT (LATE)</span>
            <AlertTriangle className="w-4 h-4 text-rose-400" />
          </div>
          <div className="text-2xl sm:text-3xl font-black text-rose-400">{lateTasks} Tugas</div>
          <span className="text-[11px] text-rose-300/80 mt-1 block font-semibold">Perlu Intervensi Teguran</span>
        </div>
      </div>

      {/* Control Bar: Filters & Search */}
      <div className="p-5 rounded-3xl bg-[#14141c]/90 border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Unit Tabs */}
        <div className="flex items-center gap-1.5 overflow-x-auto text-xs font-bold scrollbar-none">
          {(["Semua", "RA", "SD", "MTs"] as const).map((unit) => (
            <button
              key={unit}
              onClick={() => setSelectedUnit(unit)}
              className={`px-4 py-2 rounded-xl transition-all cursor-pointer ${
                selectedUnit === unit
                  ? "bg-cyan-500/20 text-cyan-300 border border-cyan-400/50 shadow-[0_0_15px_rgba(34,211,238,0.2)] font-black"
                  : "bg-white/5 text-slate-400 hover:text-white border border-white/5"
              }`}
            >
              {unit === "Semua" ? "Seluruh Unit" : `Unit ${unit}`}
            </button>
          ))}
        </div>

        {/* Status Filter & Search Input */}
        <div className="flex flex-col sm:flex-row items-center gap-3">
          <div className="flex items-center gap-1.5 bg-black/40 p-1 rounded-xl border border-white/10 text-xs">
            {(["Semua", "completed", "pending", "late"] as const).map((st) => (
              <button
                key={st}
                onClick={() => setSelectedStatus(st)}
                className={`px-3 py-1.5 rounded-lg transition-all text-xs font-semibold cursor-pointer ${
                  selectedStatus === st
                    ? "bg-[#ffbf00] text-slate-950 font-bold"
                    : "text-slate-400 hover:text-white"
                }`}
              >
                {st === "Semua"
                  ? "Semua Status"
                  : st === "completed"
                  ? "Selesai"
                  : st === "pending"
                  ? "Menunggu"
                  : "Terlambat"}
              </button>
            ))}
          </div>

          <div className="relative w-full sm:w-64">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Cari guru atau judul..."
              className="w-full pl-10 pr-4 py-2 rounded-xl bg-black/50 border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-cyan-400"
            />
          </div>
        </div>
      </div>

      {/* Task Delegation Tracking Table */}
      <div className="rounded-3xl bg-[#14141c]/90 border border-white/10 shadow-2xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse min-w-[850px]">
            <thead>
              <tr className="border-b border-white/10 bg-[#161622]/90 text-[11px] font-mono uppercase tracking-wider text-slate-400">
                <th className="py-4 px-6">Mandat Tugas & Kategori</th>
                <th className="py-4 px-6">Penerima Tugas (Guru/NIP)</th>
                <th className="py-4 px-6">Tenggat Waktu</th>
                <th className="py-4 px-6">Status Pengumpulan</th>
                <th className="py-4 px-6">Berkas Dokumen</th>
                <th className="py-4 px-6 text-right">Aksi Yayasan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs text-slate-200">
              {filteredTasks.length === 0 ? (
                <tr>
                  <td colSpan={6} className="py-12 text-center text-slate-400">
                    Tidak ada tugas delegasi yang cocok dengan kriteria filter.
                  </td>
                </tr>
              ) : (
                filteredTasks.map((task) => (
                  <tr key={task.id} className="hover:bg-white/5 transition-colors">
                    {/* Title & Category */}
                    <td className="py-4 px-6">
                      <div className="space-y-1">
                        <span
                          className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                            task.category === "Kurikulum"
                              ? "bg-blue-500/20 text-blue-300 border-blue-500/40"
                              : task.category === "Akreditasi"
                              ? "bg-purple-500/20 text-purple-300 border-purple-500/40"
                              : task.category === "Keuangan"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-amber-500/20 text-amber-300 border-amber-500/40"
                          }`}
                        >
                          {task.category} • Unit {task.unit}
                        </span>
                        <div className="font-bold text-white text-sm leading-snug">{task.title}</div>
                        <p className="text-[11px] text-slate-400 line-clamp-1">{task.instructions}</p>
                      </div>
                    </td>

                    {/* Assigned Teacher */}
                    <td className="py-4 px-6">
                      <div className="font-bold text-slate-100">{task.assignedTo.name}</div>
                      <div className="text-[11px] text-slate-400 font-mono">
                        NIP: {task.assignedTo.nip} • {task.assignedTo.role}
                      </div>
                    </td>

                    {/* Due Date */}
                    <td className="py-4 px-6 font-mono text-slate-300 whitespace-nowrap">
                      {task.dueDate}
                    </td>

                    {/* Status */}
                    <td className="py-4 px-6 whitespace-nowrap">
                      {task.status === "completed" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold text-[11px]">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          <span>Sudah Dikumpulkan</span>
                        </span>
                      )}
                      {task.status === "pending" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold text-[11px]">
                          <Clock className="w-3.5 h-3.5" />
                          <span>Menunggu Unggahan</span>
                        </span>
                      )}
                      {task.status === "late" && (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold text-[11px] animate-pulse">
                          <AlertTriangle className="w-3.5 h-3.5" />
                          <span>Terlambat Menyerahkan</span>
                        </span>
                      )}
                    </td>

                    {/* Submitted File */}
                    <td className="py-4 px-6">
                      {task.submittedFile ? (
                        <div className="flex items-center gap-2">
                          <div className="p-2 rounded-xl bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
                            <FileCheck className="w-4 h-4" />
                          </div>
                          <div>
                            <span className="font-bold text-slate-200 block text-xs truncate max-w-[150px]">
                              {task.submittedFile.name}
                            </span>
                            <span className="text-[10px] text-slate-400 font-mono">
                              {task.submittedFile.size} • {task.submittedFile.submittedAt}
                            </span>
                          </div>
                        </div>
                      ) : (
                        <span className="text-slate-500 font-mono text-[11px]">Belum ada berkas</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="py-4 px-6 text-right whitespace-nowrap">
                      <div className="flex items-center justify-end gap-2">
                        {task.submittedFile && (
                          <button
                            onClick={() => handleVerifyTask(task.id)}
                            className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                              task.isVerifiedByYayasan
                                ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                                : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-[0_0_15px_rgba(34,211,238,0.3)]"
                            }`}
                          >
                            <Check className="w-3.5 h-3.5" />
                            <span>{task.isVerifiedByYayasan ? "Terverifikasi Yayasan" : "Verifikasi & Sahkan"}</span>
                          </button>
                        )}

                        {task.status !== "completed" && (
                          <button
                            onClick={() => handleSendReminder(task)}
                            className="px-3 py-1.5 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 border border-rose-500/40 text-rose-300 text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer"
                            title="Kirim notifikasi teguran pengingat ke guru pengampu"
                          >
                            <BellRing className="w-3.5 h-3.5" />
                            <span>Kirim Peringatan</span>
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* CREATE NEW TASK MODAL */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto"
          >
            <motion.div
              initial={{ scale: 0.95, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.95, y: 15 }}
              className="max-w-xl w-full p-6 sm:p-8 rounded-3xl bg-[#14141c] border border-cyan-500/40 shadow-2xl space-y-6 my-auto text-slate-100"
            >
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-2xl bg-[#ffbf00]/20 border border-[#ffbf00]/40 flex items-center justify-center text-[#ffbf00]">
                    <PlusCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-white">Delegasikan Mandat Tugas Yayasan</h3>
                    <p className="text-xs text-slate-400">Instruksi resmi Dewan Pembina ke Dewan Guru</p>
                  </div>
                </div>
                <button
                  onClick={() => setIsModalOpen(false)}
                  className="p-2 rounded-xl text-slate-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleCreateTask} className="space-y-4 text-xs">
                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Judul Mandat Tugas</label>
                  <input
                    type="text"
                    required
                    value={newTitle}
                    onChange={(e) => setNewTitle(e.target.value)}
                    placeholder="Contoh: Pengumpulan Laporan Pertanggungjawaban BOS Reguler"
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-sm focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Kategori Tugas</label>
                    <select
                      value={newCategory}
                      onChange={(e) => setNewCategory(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="Kurikulum">Kurikulum & Pembelajaran</option>
                      <option value="Administrasi">Administrasi & Notula</option>
                      <option value="Akreditasi">Akreditasi & Sertifikasi</option>
                      <option value="Keuangan">Keuangan & LPJ</option>
                      <option value="Kesiswaan">Kesiswaan & Tahfidz</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Unit Sasaran</label>
                    <select
                      value={newUnit}
                      onChange={(e) => setNewUnit(e.target.value as any)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="SD">Unit SD Islam As Sa'adah</option>
                      <option value="MTs">Unit MTs As Sa'adah</option>
                      <option value="RA">Unit Raudhatul Athfal (RA)</option>
                    </select>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Guru Pengampu Penerima</label>
                    <select
                      value={newTeacherNip}
                      onChange={(e) => setNewTeacherNip(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#1a1a24] border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    >
                      <option value="KS-SD-001">Merlisa Ayu Dwi (Kepala Sekolah SD)</option>
                      <option value="KS-RA-001">Dwi Vivivn (Kepala Sekolah RA)</option>
                      <option value="KS-MTS-001">Nur Naimah (Kepala Sekolah MTs)</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-slate-300 font-semibold mb-1">Tenggat Waktu Pengumpulan</label>
                    <input
                      type="text"
                      value={newDueDate}
                      onChange={(e) => setNewDueDate(e.target.value)}
                      placeholder="Contoh: 28 Oktober 2026, 23:59 WIB"
                      className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-slate-300 font-semibold mb-1">Petunjuk & Rincian Berkas</label>
                  <textarea
                    rows={3}
                    value={newInstructions}
                    onChange={(e) => setNewInstructions(e.target.value)}
                    placeholder="Tuliskan petunjuk teknis pengumpulan dokumen, format file (PDF/Word/Excel), dan ketentuan pengesahan..."
                    className="w-full px-4 py-2.5 rounded-xl bg-white/5 border border-white/15 text-white text-xs focus:outline-none focus:border-cyan-400 resize-none"
                  />
                </div>

                <div className="flex items-center gap-3 pt-3">
                  <button
                    type="button"
                    onClick={() => setIsModalOpen(false)}
                    className="flex-1 py-3 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs transition-all"
                  >
                    Batalkan
                  </button>
                  <button
                    type="submit"
                    className="flex-1 py-3 rounded-xl bg-[#ffbf00] hover:bg-amber-400 text-slate-950 font-black text-xs shadow-[0_0_20px_rgba(255,191,0,0.3)] transition-all cursor-pointer"
                  >
                    Kirim Mandat Tugas Resmi
                  </button>
                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
