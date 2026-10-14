"use client";

import React, { useState, useEffect } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { getQuizQuestionsBySubject } from "@/data/quizBank";
import { UrgentTask, LearningHistory, GameQuestion } from "@/types";
import {
  CheckCircle2,
  XCircle,
  Clock,
  Sparkles,
  Play,
  ArrowRight,
  Flame,
  Award,
  ChevronRight,
  BookOpen,
  CalendarCheck,
  Zap,
  Check,
  Camera,
  GraduationCap,
  Calendar,
  Users,
  FileUp,
  FileText,
} from "lucide-react";
import TaskSubmission from "@/components/student/TaskSubmission";

interface TabBerandaProps {
  onNavigateToTab: (tabId: number) => void;
}

export default function TabBeranda({ onNavigateToTab }: TabBerandaProps) {
  const {
    currentUser,
    studentData,
    urgentTasks,
    learningHistory,
    checkInAttendance,
    completeTask,
    focusedTaskId,
    setFocusedTaskId,
    theme,
  } = useEduQuest();

  const isDark = theme === "dark";
  const isTutoring = currentUser?.role === "tutoring" || currentUser?.studentType === "les";

  // Task Quiz Modal State
  const [activeTaskModal, setActiveTaskModal] = useState<UrgentTask | null>(null);
  const [activeSubmissionTask, setActiveSubmissionTask] = useState<UrgentTask | null>(null);
  const [activeQuestions, setActiveQuestions] = useState<GameQuestion[]>([]);
  const [currentQIndex, setCurrentQIndex] = useState<number>(0);
  const [selectedTaskAnswer, setSelectedTaskAnswer] = useState<number | null>(null);
  const [isAnswerSubmitted, setIsAnswerSubmitted] = useState<boolean>(false);
  const [quizFinished, setQuizFinished] = useState<boolean>(false);
  const [correctCount, setCorrectCount] = useState<number>(0);

  const [showCheckInSuccessToast, setShowCheckInSuccessToast] = useState<boolean>(false);

  // Auto-open task modal when routed from smart notification
  useEffect(() => {
    if (focusedTaskId) {
      const target = urgentTasks.find((t) => t.id === focusedTaskId);
      if (target) {
        if (target.type === "tugas") {
          setActiveSubmissionTask(target);
        } else {
          handleStartTask(target);
        }
      }
      setFocusedTaskId(null);
    }
  }, [focusedTaskId, urgentTasks]);

  const handleCheckIn = () => {
    const result = checkInAttendance({
      method: "button",
      location: "Kampus YPI As Sa'adah (Presensi Cepat)",
    });
    if (result.success) {
      setShowCheckInSuccessToast(true);
      setTimeout(() => setShowCheckInSuccessToast(false), 4000);
    }
  };

  const handleStartTask = (task: UrgentTask) => {
    // Strictly load questions matching the subject
    const subjectQuestions = getQuizQuestionsBySubject(task.subject);
    setActiveTaskModal(task);
    setActiveQuestions(subjectQuestions);
    setCurrentQIndex(0);
    setSelectedTaskAnswer(null);
    setIsAnswerSubmitted(false);
    setQuizFinished(false);
    setCorrectCount(0);
  };

  const handleSelectOption = (idx: number) => {
    if (isAnswerSubmitted) return;
    setSelectedTaskAnswer(idx);
    setIsAnswerSubmitted(true);

    const currentQ = activeQuestions[currentQIndex];
    if (currentQ && idx === currentQ.correctAnswerIndex) {
      setCorrectCount((prev) => prev + 1);
    }
  };

  const handleNextQuestion = () => {
    if (currentQIndex + 1 < activeQuestions.length) {
      setCurrentQIndex((prev) => prev + 1);
      setSelectedTaskAnswer(null);
      setIsAnswerSubmitted(false);
    } else {
      // Finished all questions
      if (activeTaskModal) {
        completeTask(activeTaskModal.id);
      }
      setQuizFinished(true);
    }
  };

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      {/* 1. TOP BANNER: ROLE-BASED RENDERING */}
      {isTutoring ? (
        /* BANNER FOR ANAK LES (Tutoring Student) */
        <div
          className={`relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500 ease-in-out ${
            isDark
              ? "bg-gradient-to-r from-amber-500/25 via-[#12121a] to-cyan-500/25 border border-white/10 text-white shadow-2xl shadow-slate-950/40"
              : "bg-gradient-to-r from-amber-100/90 via-amber-50/70 to-cyan-100/90 border border-amber-200/80 text-slate-900 shadow-xl shadow-slate-200/60"
          }`}
        >
          <div className={`absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${isDark ? "bg-[#ffbf00]/20" : "bg-[#ffbf00]/15"}`} />
          <div className={`absolute top-0 right-1/4 w-40 h-40 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${isDark ? "bg-[#0cc0df]/20" : "bg-[#0cc0df]/15"}`} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-3 max-w-xl">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-500 ${
                  isDark
                    ? "bg-white/10 backdrop-blur-md text-white/90 border-white/20"
                    : "bg-white/90 backdrop-blur-md text-slate-800 border-slate-300 shadow-xs"
                }`}
              >
                <GraduationCap className="w-3.5 h-3.5 text-[#ffbf00]" />
                <span className={isDark ? "text-white/90" : "text-slate-800 font-bold"}>
                  Paket Bimbel Les Aktif • YPI As Sa&apos;adah
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight transition-colors duration-500 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Halo, {currentUser?.name}! 🎯
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed transition-colors duration-500 ${
                  isDark ? "text-slate-200" : "text-slate-700 font-medium"
                }`}
              >
                Kamu terdaftar pada <strong>Bimbel Les Intensif Digital Skills & Mapel MTs</strong>. Tingkatkan level dan kumpulkan EXP melalui tantangan kuis dan arena interaktif!
              </p>

              {/* Tutoring Schedule Pill */}
              <div className="flex flex-wrap items-center gap-3 pt-1 text-xs">
                <div
                  className={`flex items-center gap-1.5 backdrop-blur-md border px-3 py-1.5 rounded-xl transition-colors duration-500 ${
                    isDark
                      ? "bg-black/40 border-white/15 text-white"
                      : "bg-white/90 border-slate-300 text-slate-800 shadow-xs"
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5 text-[#0cc0df]" />
                  <span>Sesi Hari Ini: <strong>16:30 - 18:00 WIB</strong></span>
                </div>
                <div
                  className={`flex items-center gap-1.5 backdrop-blur-md border px-3 py-1.5 rounded-xl transition-colors duration-500 ${
                    isDark
                      ? "bg-black/40 border-white/15 text-white"
                      : "bg-white/90 border-slate-300 text-slate-800 shadow-xs"
                  }`}
                >
                  <Users className="w-3.5 h-3.5 text-[#ffbf00]" />
                  <span>Mentor: <strong>Ibu Sarah & Mr. David</strong></span>
                </div>
              </div>
            </div>

            {/* Quick Actions for Anak Les */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              <button
                onClick={() => onNavigateToTab(4)}
                className="group relative inline-flex items-center gap-3 px-6 py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all"
              >
                <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
                <span>Masuk Arena Latihan</span>
              </button>

              <button
                onClick={() => onNavigateToTab(3)}
                className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-xl backdrop-blur-md text-xs font-bold border transition-colors duration-500 ${
                  isDark
                    ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                    : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs"
                }`}
              >
                <Sparkles className="w-3.5 h-3.5 text-[#0cc0df]" />
                <span>Konsultasi Mentor AI</span>
              </button>
            </div>
          </div>
        </div>
      ) : (
        /* BANNER FOR SISWA YAYASAN (School Student with Absensi) */
        <div
          className={`relative overflow-hidden rounded-3xl p-6 md:p-8 transition-all duration-500 ease-in-out ${
            isDark
              ? "bg-gradient-to-r from-amber-500/25 via-[#12121a] to-cyan-500/25 border border-white/10 text-white shadow-2xl shadow-slate-950/40"
              : "bg-gradient-to-r from-amber-100/90 via-amber-50/70 to-cyan-100/90 border border-amber-200/80 text-slate-900 shadow-xl shadow-slate-200/60"
          }`}
        >
          <div className={`absolute -right-10 -bottom-10 w-64 h-64 rounded-full blur-3xl pointer-events-none transition-opacity duration-500 ${isDark ? "bg-[#ffbf00]/20" : "bg-[#ffbf00]/15"}`} />
          <div className={`absolute top-0 right-1/4 w-40 h-40 rounded-full blur-2xl pointer-events-none transition-opacity duration-500 ${isDark ? "bg-[#0cc0df]/20" : "bg-[#0cc0df]/15"}`} />

          <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
            <div className="space-y-2 max-w-xl">
              <div
                className={`inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-bold border transition-colors duration-500 ${
                  isDark
                    ? "bg-white/10 backdrop-blur-md text-white/90 border-white/20"
                    : "bg-white/90 backdrop-blur-md text-slate-800 border-slate-300 shadow-xs"
                }`}
              >
                <CalendarCheck className="w-3.5 h-3.5 text-[#ffbf00]" />
                <span className={isDark ? "text-white/90" : "text-slate-800 font-bold"}>
                  Absensi Mandiri Harian YPI As Sa&apos;adah
                </span>
              </div>
              <h2
                className={`text-2xl sm:text-3xl font-extrabold tracking-tight leading-tight transition-colors duration-500 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Semangat Belajar, {currentUser?.name}! 🚀
              </h2>
              <p
                className={`text-xs sm:text-sm leading-relaxed transition-colors duration-500 ${
                  isDark ? "text-slate-200" : "text-slate-700 font-medium"
                }`}
              >
                Catat kehadiranmu setiap hari menggunakan sensor kamera & verifikasi stempel waktu (Timemark) untuk mempertahankan streak dan klaim bonus EXP.
              </p>
            </div>

            {/* Action Check-in Widget */}
            <div className="flex flex-col sm:flex-row md:flex-col items-start md:items-end gap-3 shrink-0">
              {studentData.hasCheckedInToday ? (
                <div
                  className={`flex items-center gap-3 backdrop-blur-md border px-5 py-3 rounded-2xl transition-colors duration-500 ${
                    isDark
                      ? "bg-emerald-500/20 border-emerald-400/40 text-white"
                      : "bg-emerald-50 border-emerald-300 text-emerald-950 shadow-xs"
                  }`}
                >
                  <div className="w-9 h-9 rounded-xl bg-emerald-400 text-emerald-950 flex items-center justify-center font-bold">
                    <CheckCircle2 className="w-5 h-5" />
                  </div>
                  <div>
                    <span className={`text-sm font-bold block ${isDark ? "text-white" : "text-emerald-950"}`}>
                      Sudah Hadir Hari Ini
                    </span>
                    <span className={`text-xs ${isDark ? "text-emerald-200" : "text-emerald-700 font-semibold"}`}>
                      Pukul {studentData.lastCheckInTime || "07:15 WIB"} • +50 EXP
                    </span>
                  </div>
                </div>
              ) : (
                <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
                  <button
                    onClick={() => onNavigateToTab(6)}
                    className="group relative inline-flex items-center gap-2.5 px-6 py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] shadow-lg shadow-amber-500/25 hover:scale-[1.02] active:scale-95 transition-all"
                  >
                    <Camera className="w-4 h-4 text-slate-950" />
                    <span>Presensi Kamera (Timemark)</span>
                  </button>

                  <button
                    onClick={handleCheckIn}
                    className={`px-4 py-3 rounded-2xl backdrop-blur-md text-xs font-bold border transition-colors duration-500 flex items-center justify-center gap-1.5 ${
                      isDark
                        ? "bg-white/10 hover:bg-white/20 text-white border-white/20"
                        : "bg-white hover:bg-slate-50 text-slate-800 border-slate-300 shadow-xs"
                    }`}
                  >
                    <Zap className="w-3.5 h-3.5 text-[#ffbf00]" />
                    <span>Check-in Cepat</span>
                  </button>
                </div>
              )}

              <div
                className={`flex items-center gap-2 text-xs transition-colors duration-500 ${
                  isDark ? "text-slate-300" : "text-slate-700 font-semibold"
                }`}
              >
                <Flame className="w-3.5 h-3.5 text-[#ffbf00] fill-[#ffbf00]" />
                <span>
                  Streak Aktif: <strong className="text-[#ffbf00]">{studentData.streakDays} Hari Berturut-turut</strong>
                </span>
              </div>
            </div>
          </div>

          {/* Toast confirmation */}
          {showCheckInSuccessToast && (
            <div className="mt-4 p-3 bg-emerald-500 text-white rounded-xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-md">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>Absensi berhasil divalidasi! Selamat, kamu memperoleh +50 EXP dan +15 Koin SVA Dev.</span>
            </div>
          )}
        </div>
      )}

      {/* 2. SECTION: "Tugas & Tantangan Mendesak" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border transition-colors duration-500 ${
                isDark
                  ? "bg-rose-500/20 text-rose-400 border-rose-500/30"
                  : "bg-rose-100 text-rose-700 border-rose-200"
              }`}
            >
              <Clock className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`text-lg font-bold transition-colors duration-500 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Tugas & Tantangan Mendesak
              </h3>
              <p
                className={`text-xs transition-colors duration-500 ${
                  isDark ? "text-gray-400" : "text-slate-600 font-medium"
                }`}
              >
                Pilih mata pelajaran untuk mengerjakan kuis dengan konten yang sesuai dan kunci jawaban interaktif.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab(4)}
            className="text-xs font-semibold text-[#0cc0df] hover:text-cyan-400 flex items-center gap-1 group"
          >
            <span>Semua Tantangan</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {urgentTasks.map((task) => {
            const isCompleted = task.completed;
            const subjectColors: Record<string, string> = isDark
              ? {
                  "IPA Terpadu": "bg-emerald-500/15 text-emerald-300 border-emerald-500/30",
                  "Matematika": "bg-blue-500/15 text-blue-300 border-blue-500/30",
                  "PAI & Al-Qur'an": "bg-amber-500/15 text-amber-300 border-amber-500/30",
                  "Bahasa Inggris": "bg-cyan-500/15 text-cyan-300 border-cyan-500/30",
                }
              : {
                  "IPA Terpadu": "bg-emerald-100 text-emerald-800 border-emerald-200",
                  "Matematika": "bg-blue-100 text-blue-800 border-blue-200",
                  "PAI & Al-Qur'an": "bg-amber-100 text-amber-900 border-amber-200",
                  "Bahasa Inggris": "bg-cyan-100 text-cyan-900 border-cyan-200",
                };
            const pillStyle = subjectColors[task.subject] || (isDark ? "bg-white/10 text-slate-300 border-white/10" : "bg-slate-100 text-slate-800 border-slate-200");

            return (
              <div
                key={task.id}
                className={`relative rounded-2xl border p-5 transition-all duration-500 ease-in-out flex flex-col justify-between ${
                  isCompleted
                    ? isDark
                      ? "bg-[#14141b]/60 border-white/5 opacity-70"
                      : "bg-slate-50 border-slate-200 opacity-75"
                    : isDark
                      ? "bg-[#1a1a24] border-white/10 shadow-lg hover:border-[#0cc0df]/40"
                      : "bg-white border-slate-200/90 shadow-md hover:shadow-lg hover:border-[#0cc0df]/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center gap-1.5">
                      <span
                        className={`text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-md border ${pillStyle}`}
                      >
                        {task.subject}
                      </span>
                      {task.type === "tugas" ? (
                        <span
                          className={`text-[9px] font-extrabold uppercase px-1.5 py-0.5 rounded border ${
                            isDark
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/40"
                              : "bg-emerald-100 text-emerald-800 border-emerald-300"
                          }`}
                        >
                          Tugas
                        </span>
                      ) : (
                        <span
                          className={`text-[9px] font-bold uppercase px-1.5 py-0.5 rounded border ${
                            isDark
                              ? "bg-amber-500/20 text-amber-300 border-amber-500/40"
                              : "bg-amber-100 text-amber-800 border-amber-300"
                          }`}
                        >
                          Kuis
                        </span>
                      )}
                    </div>
                    <span
                      className={`text-[11px] font-medium flex items-center gap-1 transition-colors duration-500 ${
                        isDark ? "text-slate-400" : "text-slate-600 font-medium"
                      }`}
                    >
                      <Clock className="w-3 h-3 text-rose-500" />
                      {task.dueDate}
                    </span>
                  </div>

                  <h4
                    className={`font-bold text-sm mb-2 line-clamp-2 transition-colors duration-500 ${
                      isDark ? "text-white" : "text-slate-900"
                    }`}
                  >
                    {task.title}
                  </h4>

                  <div className="flex items-center gap-2 mb-4">
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border transition-colors duration-500 ${
                        isDark
                          ? "text-amber-300 bg-amber-500/10 border-amber-500/20"
                          : "text-amber-800 bg-amber-50 border-amber-200"
                      }`}
                    >
                      +{task.rewardExp} EXP
                    </span>
                    <span
                      className={`text-[11px] font-bold px-2 py-0.5 rounded border transition-colors duration-500 ${
                        isDark
                          ? "text-yellow-300 bg-yellow-500/10 border-yellow-500/20"
                          : "text-yellow-900 bg-yellow-50 border-yellow-200"
                      }`}
                    >
                      🪙 +{task.rewardCoins} Koin
                    </span>
                    <span
                      className={`text-[10px] ml-auto font-medium transition-colors duration-500 ${
                        isDark ? "text-slate-400" : "text-slate-600 font-medium"
                      }`}
                    >
                      {task.type === "tugas" ? "Unggah Berkas" : `${task.questionsCount} Butir`}
                    </span>
                  </div>
                </div>

                {isCompleted ? (
                  <div
                    className={`w-full py-2 text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 border transition-colors duration-500 ${
                      isDark
                        ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                        : "bg-emerald-50 text-emerald-700 border-emerald-200"
                    }`}
                  >
                    <Check className="w-4 h-4" />
                    <span>Telah Selesai</span>
                  </div>
                ) : task.type === "tugas" ? (
                  <button
                    onClick={() => setActiveSubmissionTask(task)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 flex items-center justify-center gap-2 shadow-md shadow-emerald-900/20 active:scale-98 transition cursor-pointer"
                  >
                    <FileUp className="w-3.5 h-3.5 text-white" />
                    <span>Lihat & Kumpulkan Tugas</span>
                  </button>
                ) : (
                  <button
                    onClick={() => handleStartTask(task)}
                    className="w-full py-2.5 px-4 rounded-xl text-xs font-bold text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] flex items-center justify-center gap-2 shadow-xs active:scale-98 transition cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    <span>Buka Kuis {task.subject}</span>
                  </button>
                )}
              </div>
            );
          })}
        </div>
      </div>

      {/* 3. SECTION: "Jejak Belajar (Histori Materi)" */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div
              className={`w-8 h-8 rounded-xl flex items-center justify-center font-bold border transition-colors duration-500 ${
                isDark
                  ? "bg-cyan-500/20 text-[#0cc0df] border-cyan-500/30"
                  : "bg-cyan-100 text-cyan-700 border-cyan-200"
              }`}
            >
              <BookOpen className="w-4 h-4" />
            </div>
            <div>
              <h3
                className={`text-lg font-bold transition-colors duration-500 ${
                  isDark ? "text-white" : "text-slate-900"
                }`}
              >
                Jejak Belajar (Histori Materi)
              </h3>
              <p
                className={`text-xs transition-colors duration-500 ${
                  isDark ? "text-gray-400" : "text-slate-600 font-medium"
                }`}
              >
                Lanjutkan membaca modul terakhir dengan 1-klik tanpa kehilangan progres belajarmu.
              </p>
            </div>
          </div>
          <button
            onClick={() => onNavigateToTab(2)}
            className="text-xs font-semibold text-[#0cc0df] hover:text-cyan-400 flex items-center gap-1 group"
          >
            <span>Buka Perpustakaan</span>
            <ChevronRight className="w-4 h-4 group-hover:translate-x-0.5 transition-transform" />
          </button>
        </div>

        {/* Horizontal scrollable cards container */}
        <div className="flex gap-4 overflow-x-auto pb-4 pt-1 snap-x no-scrollbar">
          {learningHistory.map((item) => (
            <div
              key={item.id}
              className={`w-72 sm:w-80 shrink-0 snap-start rounded-2xl border transition-all duration-500 ease-in-out p-4 flex flex-col justify-between group ${
                isDark
                  ? "bg-[#1a1a24] border-white/10 shadow-lg hover:border-[#0cc0df]/40"
                  : "bg-white border-slate-200/90 shadow-md hover:shadow-lg"
              }`}
            >
              <div>
                <div className={`relative h-32 w-full rounded-xl overflow-hidden mb-3 ${isDark ? "bg-slate-900" : "bg-slate-100"}`}>
                  <img
                    src={item.thumbnailUrl}
                    alt={item.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <span className="absolute top-2 left-2 bg-slate-900/80 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-md">
                    {item.subject}
                  </span>
                  <span className="absolute bottom-2 right-2 bg-slate-950/80 backdrop-blur-xs text-[#ffbf00] text-[10px] font-semibold px-2 py-0.5 rounded-md">
                    Dibaca {item.lastReadTime}
                  </span>
                </div>

                <h4
                  className={`font-bold text-sm mb-2 line-clamp-2 transition-colors duration-500 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {item.title}
                </h4>

                <div className="space-y-1 mb-4">
                  <div
                    className={`flex justify-between text-[11px] font-semibold transition-colors duration-500 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    <span>Progres Modul</span>
                    <span className="text-[#0cc0df] font-bold">{item.progressPercentage}%</span>
                  </div>
                  <div className={`w-full h-2 rounded-full overflow-hidden ${isDark ? "bg-slate-800" : "bg-slate-100"}`}>
                    <div
                      className="bg-[#0cc0df] h-full rounded-full transition-all duration-300"
                      style={{ width: `${item.progressPercentage}%` }}
                    />
                  </div>
                  <span
                    className={`text-[10px] block text-right font-medium transition-colors duration-500 ${
                      isDark ? "text-slate-400" : "text-slate-600"
                    }`}
                  >
                    {item.completedChapters} dari {item.totalChapters} Bab Selesai
                  </span>
                </div>
              </div>

              <button
                onClick={() => onNavigateToTab(2)}
                className={`w-full py-2 px-3 rounded-xl border font-semibold text-xs flex items-center justify-center gap-1.5 transition-colors duration-300 ${
                  isDark
                    ? "border-cyan-500/30 text-cyan-300 bg-cyan-500/10 hover:bg-cyan-500/20"
                    : "border-cyan-200 text-cyan-800 bg-cyan-50/70 hover:bg-cyan-100"
                }`}
              >
                <span>Lanjutkan Belajar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* DYNAMIC SUBJECT QUIZ MODAL WITH INSTANT FEEDBACK */}
      {activeTaskModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div
            className={`rounded-3xl max-w-lg w-full p-6 sm:p-7 shadow-2xl space-y-5 animate-scale-up border transition-colors duration-500 ${
              isDark
                ? "bg-[#1a1a24] text-white border-white/10"
                : "bg-white text-slate-900 border-slate-200"
            }`}
          >
            {/* Modal Header */}
            <div className={`flex items-start justify-between border-b pb-3 ${isDark ? "border-white/10" : "border-slate-100"}`}>
              <div>
                <span
                  className={`text-xs font-bold px-2.5 py-1 rounded-md border ${
                    isDark
                      ? "text-cyan-300 bg-cyan-500/15 border-cyan-500/30"
                      : "text-cyan-900 bg-cyan-50 border-cyan-200"
                  }`}
                >
                  {activeTaskModal.subject} • Kuis Interaktif
                </span>
                <h3
                  className={`text-base sm:text-lg font-bold mt-2 ${
                    isDark ? "text-white" : "text-slate-900"
                  }`}
                >
                  {activeTaskModal.title}
                </h3>
              </div>
              <button
                onClick={() => setActiveTaskModal(null)}
                className="text-slate-400 hover:text-slate-600 p-1.5 rounded-xl hover:bg-slate-100 text-sm font-bold"
              >
                ✕
              </button>
            </div>

            {!quizFinished ? (
              <div className="space-y-4">
                {/* Progress bar */}
                <div className="flex items-center justify-between text-xs text-slate-500 font-semibold">
                  <span>
                    Soal {currentQIndex + 1} dari {activeQuestions.length}
                  </span>
                  <span className="text-amber-600 font-bold">
                    Benar: {correctCount} / {currentQIndex + (isAnswerSubmitted ? 1 : 0)}
                  </span>
                </div>

                {/* Question Box */}
                {activeQuestions[currentQIndex] ? (
                  <>
                    <div className="p-4 bg-slate-50 rounded-2xl border border-slate-200 text-sm font-semibold text-slate-800 leading-relaxed">
                      {activeQuestions[currentQIndex].question}
                    </div>

                    {/* Instant Feedback Options */}
                    <div className="space-y-2">
                      {activeQuestions[currentQIndex].options.map((option, idx) => {
                        const isChosen = selectedTaskAnswer === idx;
                        const isCorrect = idx === activeQuestions[currentQIndex].correctAnswerIndex;

                        let buttonStyle = "border-slate-200 hover:border-[#0cc0df] hover:bg-cyan-50/40 text-slate-700";

                        if (isAnswerSubmitted) {
                          if (isCorrect) {
                            buttonStyle = "bg-emerald-50 border-2 border-emerald-500 text-emerald-950 font-bold";
                          } else if (isChosen && !isCorrect) {
                            buttonStyle = "bg-rose-50 border-2 border-rose-500 text-rose-950 font-bold";
                          } else {
                            buttonStyle = "border-slate-200 opacity-50 text-slate-400";
                          }
                        }

                        return (
                          <button
                            key={idx}
                            disabled={isAnswerSubmitted}
                            onClick={() => handleSelectOption(idx)}
                            className={`w-full p-3.5 rounded-xl text-left text-xs font-medium border transition-all flex items-center justify-between ${buttonStyle}`}
                          >
                            <span>
                              {String.fromCharCode(65 + idx)}. {option}
                            </span>
                            {isAnswerSubmitted && isCorrect && (
                              <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
                            )}
                            {isAnswerSubmitted && isChosen && !isCorrect && (
                              <XCircle className="w-4 h-4 text-rose-600 shrink-0" />
                            )}
                          </button>
                        );
                      })}
                    </div>

                    {/* Instant Feedback Banner & Explanation */}
                    {isAnswerSubmitted && (
                      <div
                        className={`p-3.5 rounded-xl text-xs space-y-1 ${
                          selectedTaskAnswer === activeQuestions[currentQIndex].correctAnswerIndex
                            ? "bg-emerald-50 border border-emerald-200 text-emerald-900"
                            : "bg-rose-50 border border-rose-200 text-rose-900"
                        }`}
                      >
                        <div className="font-bold flex items-center gap-1.5">
                          {selectedTaskAnswer === activeQuestions[currentQIndex].correctAnswerIndex ? (
                            <>
                              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                              <span>Jawaban Tepat! (+25 Skor)</span>
                            </>
                          ) : (
                            <>
                              <XCircle className="w-4 h-4 text-rose-600" />
                              <span>Kurang Tepat. Kunci jawaban: {String.fromCharCode(65 + activeQuestions[currentQIndex].correctAnswerIndex)}</span>
                            </>
                          )}
                        </div>
                        <p className="text-[11px] leading-relaxed text-slate-600 pl-5">
                          {activeQuestions[currentQIndex].explanation}
                        </p>
                      </div>
                    )}

                    {/* Footer Next Button */}
                    <div className="pt-2 flex items-center justify-between">
                      <span className="text-xs text-amber-800 font-bold">
                        Reward: +{activeTaskModal.rewardExp} EXP & +{activeTaskModal.rewardCoins} Koin
                      </span>
                      <button
                        disabled={!isAnswerSubmitted}
                        onClick={handleNextQuestion}
                        className="px-6 py-2.5 rounded-xl font-black text-xs text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] disabled:opacity-50 disabled:cursor-not-allowed transition shadow-md shadow-amber-500/20"
                      >
                        {currentQIndex + 1 < activeQuestions.length
                          ? "Lanjut ke Soal Berikutnya →"
                          : "Selesai & Klaim Hadiah 🎉"}
                      </button>
                    </div>
                  </>
                ) : (
                  <p className="text-xs text-slate-500">Memuat butir soal...</p>
                )}
              </div>
            ) : (
              /* Quiz Finished Celebration */
              <div className="py-6 text-center space-y-4">
                <div className="w-16 h-16 bg-amber-100 text-[#ffbf00] rounded-full flex items-center justify-center mx-auto animate-bounce shadow-md">
                  <Award className="w-8 h-8 text-amber-600" />
                </div>
                <h4 className="text-xl font-extrabold text-slate-900">
                  Tugas {activeTaskModal.subject} Sukses Diselesaikan! 🎉
                </h4>
                <p className="text-xs text-slate-600 max-w-sm mx-auto">
                  Hebat! Kamu berhasil menjawab <strong>{correctCount} dari {activeQuestions.length}</strong> butir soal dengan baik.
                </p>
                <div className="flex items-center justify-center gap-3 pt-1">
                  <span className="px-4 py-2 rounded-xl bg-cyan-50 text-[#0cc0df] font-bold text-xs border border-cyan-200">
                    +{activeTaskModal.rewardExp} EXP Ditambahkan
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-amber-50 text-amber-900 font-bold text-xs border border-amber-200">
                    🪙 +{activeTaskModal.rewardCoins} Koin Ditambahkan
                  </span>
                </div>
                <button
                  onClick={() => setActiveTaskModal(null)}
                  className="mt-4 px-6 py-2.5 rounded-xl bg-slate-950 text-white font-bold text-xs hover:bg-slate-800 transition"
                >
                  Tutup & Kembali ke Beranda
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* 5. MODAL TUGAS MANDIRI & UNGGAH BERKAS (STUDENT SUBMISSION) */}
      {activeSubmissionTask && (
        <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto animate-fade-in">
          <div className="w-full max-w-4xl max-h-[95vh] overflow-y-auto my-auto">
            <TaskSubmission
              task={activeSubmissionTask}
              onClose={() => setActiveSubmissionTask(null)}
              onSuccess={() => {
                // Task submitted and completed in context
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}
