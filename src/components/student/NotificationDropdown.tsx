"use client";

import React, { useState, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import { StudentNotification, NotificationType } from "@/types";
import {
  Bell,
  Sparkles,
  Clock,
  Award,
  CheckCircle2,
  X,
  Check,
  ChevronRight,
  AlertTriangle,
  FileText,
  Trash2,
  ArrowRight,
  Zap,
  Info,
} from "lucide-react";

interface NotificationDropdownProps {
  onSelectTask?: (taskId: string) => void;
}

export default function NotificationDropdown({ onSelectTask }: NotificationDropdownProps) {
  const {
    notifications,
    unreadNotificationsCount,
    markNotificationAsRead,
    markAllNotificationsAsRead,
    clearNotification,
    addUrgentTask,
    theme,
  } = useEduQuest();

  const isDark = theme === "dark";
  const [isOpen, setIsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<"all" | "new_task" | "deadline_warning" | "grade_released">("all");
  const dropdownRef = useRef<HTMLDivElement | null>(null);

  // Close when clicking outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isOpen]);

  // Filtered notifications
  const filteredNotifications = notifications.filter((notif) => {
    if (activeFilter === "all") return true;
    return notif.type === activeFilter;
  });

  const handleNotificationClick = (notif: StudentNotification) => {
    if (!notif.isRead) {
      markNotificationAsRead(notif.id);
    }
    if (notif.taskId && onSelectTask) {
      onSelectTask(notif.taskId);
      setIsOpen(false);
    }
  };

  // Quick Simulation Action: Teacher Publishes a New Task
  const handleSimulateNewTask = (e: React.MouseEvent) => {
    e.stopPropagation();
    const taskTitles = [
      {
        title: "Praktikum Mandiri: Struktur Jaringan Daun Dikotil",
        subject: "Biologi Terapan",
        rewardExp: 180,
        rewardCoins: 50,
      },
      {
        title: "Latihan Soal: Hukum Pascal & Fluida Statis",
        subject: "Fisika Terpadu",
        rewardExp: 150,
        rewardCoins: 40,
      },
      {
        title: "Tugas Esai: Hikmah Peristiwa Fathu Makkah",
        subject: "PAI & Sejarah Islam",
        rewardExp: 120,
        rewardCoins: 30,
      },
    ];
    const picked = taskTitles[Math.floor(Math.random() * taskTitles.length)];

    addUrgentTask({
      title: picked.title,
      subject: picked.subject,
      dueDate: "Besok, 22:00 WIB",
      deadlineHours: 24,
      rewardExp: picked.rewardExp,
      rewardCoins: picked.rewardCoins,
      difficulty: "Sedang",
      questionsCount: 0,
      type: "tugas",
      instructions: "Unggah dokumen hasil analisis tugas mandiri Anda dalam format PDF atau Word.",
      allowedSubmissionTypes: ["PDF", "Documents (Word/Excel)"],
    });
  };

  return (
    <div className="relative" ref={dropdownRef}>
      {/* 1. BELL ICON BUTTON & BADGE */}
      <button
        onClick={() => setIsOpen((prev) => !prev)}
        aria-label="Notifikasi Siswa"
        className={`relative p-2.5 rounded-2xl border transition-all duration-300 flex items-center justify-center cursor-pointer ${
          isOpen
            ? "bg-cyan-500/20 border-cyan-400/60 text-cyan-300 shadow-[0_0_20px_rgba(34,211,238,0.25)] ring-1 ring-cyan-400/40"
            : isDark
            ? "bg-[#161622]/90 hover:bg-[#1f1f2e] border-white/10 hover:border-white/20 text-slate-300 hover:text-white"
            : "bg-slate-100 hover:bg-slate-200 border-slate-200 text-slate-700 shadow-xs"
        }`}
      >
        <Bell
          className={`w-5 h-5 transition-transform duration-300 ${
            unreadNotificationsCount > 0 ? "animate-[swing_2s_ease-in-out_infinite]" : ""
          }`}
        />

        {/* Dynamic Glow Unread Badge */}
        {unreadNotificationsCount > 0 && (
          <motion.span
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            className="absolute -top-1.5 -right-1.5 min-w-[20px] h-5 px-1.5 rounded-full bg-gradient-to-r from-rose-500 to-red-600 text-white font-extrabold text-[10px] flex items-center justify-center border-2 border-[#14141b] shadow-[0_0_12px_rgba(244,63,94,0.6)]"
          >
            {unreadNotificationsCount > 9 ? "9+" : unreadNotificationsCount}
          </motion.span>
        )}
      </button>

      {/* 2. GLASSMORPHISM NOTIFICATION DROPDOWN / POPOVER */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 12, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 10, scale: 0.95 }}
            transition={{ duration: 0.22, ease: "easeOut" }}
            className="absolute right-0 mt-3 w-88 sm:w-96 md:w-[420px] max-h-[85vh] flex flex-col rounded-3xl bg-[#14141c]/95 backdrop-blur-2xl border border-white/10 shadow-[0_25px_60px_rgba(0,0,0,0.85)] z-50 overflow-hidden text-slate-100"
          >
            {/* Header */}
            <div className="p-4 sm:p-5 border-b border-white/10 bg-[#161622]/80 flex items-center justify-between gap-3">
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-cyan-500/15 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                  <Bell className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="text-sm font-bold text-white tracking-tight">Notifikasi Akademik</h3>
                  <p className="text-[11px] text-slate-400">Pusat Informasi Tugas & Evaluasi Siswa</p>
                </div>
              </div>

              {unreadNotificationsCount > 0 && (
                <button
                  onClick={markAllNotificationsAsRead}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-[11px] text-cyan-300 font-semibold transition-all flex items-center gap-1.5 cursor-pointer hover:border-cyan-400/40"
                  title="Tandai semua pesan sudah dibaca"
                >
                  <Check className="w-3 h-3 text-cyan-400" />
                  <span>Tandai Dibaca</span>
                </button>
              )}
            </div>

            {/* Filter Tabs */}
            <div className="px-4 py-2 border-b border-white/5 bg-[#12121a]/60 flex items-center gap-1.5 overflow-x-auto text-[11px] font-semibold scrollbar-none">
              <button
                onClick={() => setActiveFilter("all")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeFilter === "all"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Semua ({notifications.length})
              </button>
              <button
                onClick={() => setActiveFilter("new_task")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeFilter === "new_task"
                    ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Tugas Baru
              </button>
              <button
                onClick={() => setActiveFilter("deadline_warning")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeFilter === "deadline_warning"
                    ? "bg-rose-500/20 text-rose-300 border border-rose-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Deadline
              </button>
              <button
                onClick={() => setActiveFilter("grade_released")}
                className={`px-3 py-1 rounded-xl transition-all cursor-pointer shrink-0 ${
                  activeFilter === "grade_released"
                    ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 font-bold"
                    : "text-slate-400 hover:text-white hover:bg-white/5"
                }`}
              >
                Nilai
              </button>
            </div>

            {/* Notification Items List */}
            <div className="flex-1 overflow-y-auto max-h-[360px] divide-y divide-white/5 p-2 space-y-1">
              {filteredNotifications.length === 0 ? (
                <div className="py-12 px-4 text-center space-y-2">
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center text-slate-500 mx-auto">
                    <Info className="w-6 h-6" />
                  </div>
                  <p className="text-xs text-slate-400 font-medium">Tidak ada notifikasi pada kategori ini.</p>
                </div>
              ) : (
                filteredNotifications.map((notif) => {
                  const isNewTask = notif.type === "new_task";
                  const isDeadline = notif.type === "deadline_warning";
                  const isGrade = notif.type === "grade_released";

                  return (
                    <motion.div
                      key={notif.id}
                      layout
                      initial={{ opacity: 0, y: 6 }}
                      animate={{ opacity: 1, y: 0 }}
                      onClick={() => handleNotificationClick(notif)}
                      className={`group relative p-3.5 rounded-2xl transition-all cursor-pointer border ${
                        !notif.isRead
                          ? "bg-[#1a1a24]/90 border-cyan-500/30 hover:border-cyan-400/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)]"
                          : "bg-transparent border-transparent hover:bg-white/5 text-slate-400 hover:text-slate-200"
                      }`}
                    >
                      <div className="flex items-start gap-3">
                        {/* Event Icon */}
                        <div
                          className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 border mt-0.5 ${
                            isNewTask
                              ? "bg-cyan-500/15 border-cyan-500/40 text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]"
                              : isDeadline
                              ? "bg-rose-500/15 border-rose-500/40 text-rose-400 shadow-[0_0_12px_rgba(244,63,94,0.2)]"
                              : isGrade
                              ? "bg-emerald-500/15 border-emerald-500/40 text-emerald-400 shadow-[0_0_12px_rgba(52,211,153,0.2)]"
                              : "bg-white/10 border-white/20 text-slate-300"
                          }`}
                        >
                          {isNewTask && <Sparkles className="w-4 h-4" />}
                          {isDeadline && <Clock className="w-4 h-4" />}
                          {isGrade && <Award className="w-4 h-4" />}
                        </div>

                        {/* Text Content */}
                        <div className="flex-1 min-w-0 pr-6">
                          <div className="flex items-center gap-2 mb-0.5">
                            <span
                              className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${
                                isNewTask
                                  ? "bg-cyan-500/15 border-cyan-500/30 text-cyan-300"
                                  : isDeadline
                                  ? "bg-rose-500/15 border-rose-500/30 text-rose-300"
                                  : isGrade
                                  ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-300"
                                  : "bg-white/10 border-white/20 text-slate-300"
                              }`}
                            >
                              {isNewTask && "Tugas Baru"}
                              {isDeadline && "Peringatan Deadline"}
                              {isGrade && "Nilai Rilis"}
                            </span>

                            {notif.score !== undefined && (
                              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                                Skor: {notif.score}/100
                              </span>
                            )}

                            <span className="text-[10px] text-slate-500 font-mono ml-auto">
                              {notif.timestamp}
                            </span>
                          </div>

                          <h4
                            className={`text-xs font-bold leading-snug line-clamp-1 ${
                              !notif.isRead ? "text-white" : "text-slate-300 font-medium"
                            }`}
                          >
                            {notif.title}
                          </h4>

                          <p
                            className={`text-[11px] leading-relaxed mt-1 line-clamp-2 ${
                              !notif.isRead ? "text-slate-300" : "text-slate-400"
                            }`}
                          >
                            {notif.message}
                          </p>

                          {/* Actionable Prompt */}
                          {notif.taskId && (
                            <div className="mt-2 flex items-center gap-1 text-[11px] font-semibold text-cyan-400 group-hover:translate-x-1 transition-transform">
                              <span>
                                {isNewTask && "Buka & Kumpulkan Tugas"}
                                {isDeadline && "Kumpulkan Sekarang Sebelum Terlambat"}
                                {isGrade && "Periksa Hasil Penilaian Guru"}
                              </span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </div>
                          )}
                        </div>

                        {/* Unread Glow Dot Indicator */}
                        {!notif.isRead && (
                          <span className="absolute top-4 right-4 w-2 h-2 rounded-full bg-cyan-400 shadow-[0_0_8px_#22d3ee]" />
                        )}

                        {/* Delete Single Notif */}
                        <button
                          onClick={(e) => {
                            e.stopPropagation();
                            clearNotification(notif.id);
                          }}
                          className="absolute bottom-3 right-3 opacity-0 group-hover:opacity-100 p-1 rounded-md text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer"
                          title="Hapus notifikasi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </motion.div>
                  );
                })
              )}
            </div>

            {/* Footer: Live Teacher Sync Simulator */}
            <div className="p-3 border-t border-white/10 bg-[#101017] flex items-center justify-between gap-2">
              <span className="text-[10px] text-slate-500 font-mono">
                Sinkronisasi State: <strong className="text-emerald-400">Realtime</strong>
              </span>

              <button
                onClick={handleSimulateNewTask}
                className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-cyan-500/20 to-blue-500/20 hover:from-cyan-500/30 hover:to-blue-500/30 border border-cyan-500/30 hover:border-cyan-400 text-cyan-300 font-bold text-[11px] transition-all flex items-center gap-1.5 cursor-pointer shadow-[0_0_15px_rgba(34,211,238,0.15)]"
                title="Tekan untuk mensimulasikan guru merilis tugas baru di portal guru"
              >
                <Zap className="w-3 h-3 text-cyan-400" />
                <span>Simulasi Rilis Tugas Guru</span>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
