"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  CustomTeacherGame,
  GameQuestion,
  GameTemplateType,
  ModuleItem,
  LeaderboardRank,
} from "@/types";
import { MOCK_LEADERBOARD } from "@/data/mockData";
import ClassTargetSelector from "@/components/teacher/ClassTargetSelector";
import AssignmentCreator from "@/components/teacher/AssignmentCreator";
import {
  FolderKanban,
  PlusCircle,
  BookOpen,
  Sparkles,
  Gamepad2,
  Clock,
  CheckCircle2,
  Trash2,
  Send,
  Eye,
  FileText,
  UploadCloud,
  FileCheck,
  Trophy,
  HelpCircle,
  Download,
  AlertCircle,
} from "lucide-react";

export default function TabKontenGame() {
  const {
    currentUser,
    learningMaterials,
    addLearningMaterial,
    deleteLearningMaterial,
    urgentTasks,
    addUrgentTask,
    customGames,
    addCustomTeacherGame,
    theme,
  } = useEduQuest();

  const isDark = theme === "dark";

  // Main 3-Pillar Tab: 'materi' | 'kuis' | 'game'
  const [activePillar, setActivePillar] = useState<"materi" | "kuis" | "game">("materi");

  // =========================================================================
  // PILLAR 1: MATERI PEMBELAJARAN (UPLOAD PDF / DOCS)
  // =========================================================================
  const [showUploadModal, setShowUploadModal] = useState(false);
  const [materialTitle, setMaterialTitle] = useState("");
  const [materialSubject, setMaterialSubject] = useState("IPA Terpadu");
  const [materialLevel, setMaterialLevel] = useState<"RA" | "SD" | "MTs">(() => {
    if (currentUser?.levelAssignment === "RA") return "RA";
    if (currentUser?.levelAssignment === "SD") return "SD";
    return "MTs";
  });
  const [materialDescription, setMaterialDescription] = useState("");
  const [materialTopics, setMaterialTopics] = useState("");
  const [materialTargetClasses, setMaterialTargetClasses] = useState<string[]>([]);
  const [uploadedFile, setUploadedFile] = useState<{
    name: string;
    size: string;
    type: "pdf" | "doc";
  } | null>(null);
  const [materialError, setMaterialError] = useState<string | null>(null);
  const [materialSuccess, setMaterialSuccess] = useState(false);
  const [previewMaterial, setPreviewMaterial] = useState<ModuleItem | null>(null);

  const handleSimulateFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.name.endsWith(".pdf") || file.type.includes("pdf");
    const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
    setUploadedFile({
      name: file.name,
      size: `${sizeMb} MB`,
      type: isPdf ? "pdf" : "doc",
    });
    setMaterialError(null);
  };

  const handlePublishMaterial = (e: React.FormEvent) => {
    e.preventDefault();
    if (!materialTitle.trim()) {
      setMaterialError("Judul materi pembelajaran wajib diisi.");
      return;
    }
    if (!uploadedFile) {
      setMaterialError("Silakan pilih file materi pembelajaran (PDF / Word) terlebih dahulu.");
      return;
    }
    if (materialTargetClasses.length === 0) {
      setMaterialError("Pilih minimal 1 kelas target penerima materi.");
      return;
    }

    const topicsArray = materialTopics
      .split(",")
      .map((t) => t.trim())
      .filter(Boolean);

    addLearningMaterial({
      title: materialTitle.trim(),
      subject: materialSubject,
      level: materialLevel,
      grade: materialTargetClasses.join(", "),
      type: uploadedFile.type,
      durationOrPages: uploadedFile.type === "pdf" ? "Modul PDF Digital" : "Dokumen Pembelajaran",
      author: currentUser?.name || "Guru Pengampu",
      description: materialDescription.trim() || `Modul ajar ${materialSubject} terverifikasi kurikulum madrasah.`,
      downloadUrl: "#",
      fileName: uploadedFile.name,
      fileSize: uploadedFile.size,
      topics: topicsArray.length > 0 ? topicsArray : [materialSubject, "Modul Mandiri"],
      targetClasses: materialTargetClasses,
    });

    setMaterialSuccess(true);
    setMaterialTitle("");
    setMaterialDescription("");
    setMaterialTopics("");
    setUploadedFile(null);
    setMaterialTargetClasses([]);
    setMaterialError(null);

    setTimeout(() => {
      setMaterialSuccess(false);
      setShowUploadModal(false);
    }, 2000);
  };

  // =========================================================================
  // PILLAR 2: PENUGASAN KUIS & ASESMEN
  // =========================================================================
  const [quizCreationMode, setQuizCreationMode] = useState<"quick_quiz" | "structured_task">("quick_quiz");
  const [quickQuizTitle, setQuickQuizTitle] = useState("");
  const [quickQuizSubject, setQuickQuizSubject] = useState("Matematika");
  const [quickQuizDueDate, setQuickQuizDueDate] = useState("Besok, 23:59 WIB");
  const [quickQuizClasses, setQuickQuizClasses] = useState<string[]>([]);
  const [quickQuizExp, setQuickQuizExp] = useState(150);
  const [quickQuizCoins, setQuickQuizCoins] = useState(50);
  const [quickQuizQuestions, setQuickQuizQuestions] = useState<GameQuestion[]>([
    {
      id: "qq-1",
      question: "Berapakah hasil dari 15 × 8 - 45?",
      options: ["75", "85", "95", "105"],
      correctAnswerIndex: 0,
      explanation: "15 × 8 = 120, lalu 120 - 45 = 75.",
    },
  ]);
  const [currentQText, setCurrentQText] = useState("");
  const [currentQOptions, setCurrentQOptions] = useState<string[]>(["", "", "", ""]);
  const [currentQCorrect, setCurrentQCorrect] = useState(0);
  const [currentQExpl, setCurrentQExpl] = useState("");
  const [quizSuccess, setQuizSuccess] = useState(false);
  const [quizError, setQuizError] = useState<string | null>(null);

  const handleAddQuestionToQuiz = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentQText.trim()) return;
    if (currentQOptions.some((opt) => !opt.trim())) {
      setQuizError("Semua 4 opsi pilihan jawaban harus diisi.");
      return;
    }

    const newQ: GameQuestion = {
      id: `qq-${Date.now()}`,
      question: currentQText.trim(),
      options: [...currentQOptions],
      correctAnswerIndex: currentQCorrect,
      explanation: currentQExpl.trim() || "Kunci jawaban telah diverifikasi guru.",
    };

    setQuickQuizQuestions((prev) => [...prev, newQ]);
    setCurrentQText("");
    setCurrentQOptions(["", "", "", ""]);
    setCurrentQCorrect(0);
    setCurrentQExpl("");
    setQuizError(null);
  };

  const handlePublishQuickQuiz = () => {
    if (!quickQuizTitle.trim()) {
      setQuizError("Judul kuis wajib diisi.");
      return;
    }
    if (quickQuizClasses.length === 0) {
      setQuizError("Pilih minimal 1 kelas target penerima kuis.");
      return;
    }
    if (quickQuizQuestions.length === 0) {
      setQuizError("Tambahkan minimal 1 butir soal pilihan ganda.");
      return;
    }

    addUrgentTask({
      title: quickQuizTitle.trim(),
      subject: quickQuizSubject,
      dueDate: quickQuizDueDate,
      deadlineHours: 24,
      rewardExp: quickQuizExp,
      rewardCoins: quickQuizCoins,
      difficulty: "Sedang",
      questionsCount: quickQuizQuestions.length,
      questions: quickQuizQuestions,
      type: "kuis",
      instructions: `Kerjakan kuis interaktif ${quickQuizSubject} dengan teliti. Terdapat ${quickQuizQuestions.length} butir soal pilihan ganda.`,
      targetClasses: quickQuizClasses,
    });

    setQuizSuccess(true);
    setQuickQuizTitle("");
    setQuickQuizClasses([]);
    setQuizError(null);
    setTimeout(() => setQuizSuccess(false), 3000);
  };

  // =========================================================================
  // PILLAR 3: TANTANGAN GAME INTERAKTIF
  // =========================================================================
  const [selectedTemplate, setSelectedTemplate] = useState<GameTemplateType>("Kuis Real-Time");
  const [gameTitle, setGameTitle] = useState("");
  const [gameSubject, setGameSubject] = useState("IPA Terpadu");
  const [gameClasses, setGameClasses] = useState<string[]>([]);
  const [gameDuration, setGameDuration] = useState(15);
  const [gameExp, setGameExp] = useState(180);
  const [gameCoins, setGameCoins] = useState(60);
  const [gameQuestions, setGameQuestions] = useState<GameQuestion[]>([
    {
      id: "gq-1",
      question: "Apakah nama organ tumbuhan yang berfungsi sebagai tempat utama fotosintesis?",
      options: ["Daun (Kloroplas)", "Akar Serabut", "Batang Kayu", "Bunga"],
      correctAnswerIndex: 0,
      explanation: "Klorofil pada kloroplas sel daun menangkap sinar matahari untuk fotosintesis.",
    },
  ]);
  const [gQText, setGQText] = useState("");
  const [gQOptions, setGQOptions] = useState<string[]>(["", "", "", ""]);
  const [gQCorrect, setGQCorrect] = useState(0);
  const [gQExpl, setGQExpl] = useState("");
  const [gameSuccess, setGameSuccess] = useState(false);
  const [gameError, setGameError] = useState<string | null>(null);
  const [leaderboardFilter, setLeaderboardFilter] = useState<string>("ALL");

  const GAME_TEMPLATES: {
    type: GameTemplateType;
    title: string;
    desc: string;
    icon: string;
    color: string;
  }[] = [
    {
      type: "Kuis Real-Time",
      title: "Kuis Real-Time",
      desc: "Tantangan kecepatan menjawab soal pilihan ganda dengan timer mundur per butir soal.",
      icon: "⚡",
      color: "from-cyan-500/20 to-blue-500/20 border-cyan-500/40 text-cyan-300",
    },
    {
      type: "Memory Match",
      title: "Memory Match",
      desc: "Buka pasangan kartu konsep, istilah, dan rumus yang cocok untuk melatih daya ingat santri.",
      icon: "🃏",
      color: "from-purple-500/20 to-pink-500/20 border-purple-500/40 text-purple-300",
    },
    {
      type: "Duel Interaktif",
      title: "Duel Interaktif",
      desc: "Kompetisi adu cepat santri secara berhadapan dalam menjawab soal kurikulum.",
      icon: "⚔️",
      color: "from-amber-500/20 to-orange-500/20 border-amber-500/40 text-amber-300",
    },
    {
      type: "Kuis Cerdas",
      title: "Kuis Cerdas",
      desc: "Simulasi cerdas cermat bertingkat dengan bobot nilai progresif tiap bab.",
      icon: "🧠",
      color: "from-emerald-500/20 to-teal-500/20 border-emerald-500/40 text-emerald-300",
    },
    {
      type: "Cocok Kata",
      title: "Cocok Kata",
      desc: "Menghubungkan istilah Arab/Inggris dengan artinya atau definisi ilmiah.",
      icon: "🧩",
      color: "from-rose-500/20 to-red-500/20 border-rose-500/40 text-rose-300",
    },
    {
      type: "Susun Rumus",
      title: "Susun Rumus",
      desc: "Game menyusun urutan langkah penyelesaian persamaan matematika dan fisika.",
      icon: "📐",
      color: "from-yellow-500/20 to-amber-500/20 border-yellow-500/40 text-yellow-300",
    },
  ];

  const handleAddGameQuestion = (e: React.FormEvent) => {
    e.preventDefault();
    if (!gQText.trim()) return;
    if (gQOptions.some((opt) => !opt.trim())) {
      setGameError("Semua 4 opsi jawaban soal game harus diisi.");
      return;
    }

    const newQ: GameQuestion = {
      id: `gq-${Date.now()}`,
      question: gQText.trim(),
      options: [...gQOptions],
      correctAnswerIndex: gQCorrect,
      explanation: gQExpl.trim() || "Kunci jawaban terverifikasi guru.",
    };

    setGameQuestions((prev) => [...prev, newQ]);
    setGQText("");
    setGQOptions(["", "", "", ""]);
    setGQCorrect(0);
    setGQExpl("");
    setGameError(null);
  };

  const handlePublishCustomGame = () => {
    if (!gameTitle.trim()) {
      setGameError("Judul game tantangan wajib diisi.");
      return;
    }
    if (gameClasses.length === 0) {
      setGameError("Pilih minimal 1 kelas target tantangan game.");
      return;
    }
    if (gameQuestions.length === 0) {
      setGameError("Tambahkan minimal 1 pertanyaan untuk game tantangan.");
      return;
    }

    addCustomTeacherGame({
      title: gameTitle.trim(),
      subject: gameSubject,
      templateType: selectedTemplate,
      targetAudience: gameClasses.join(", "),
      targetClasses: gameClasses,
      durationMinutes: gameDuration,
      rewardExp: gameExp,
      rewardCoins: gameCoins,
      questions: gameQuestions,
    });

    setGameSuccess(true);
    setGameTitle("");
    setGameClasses([]);
    setGameError(null);
    setTimeout(() => setGameSuccess(false), 3000);
  };

  // Filter leaderboard
  const filteredLeaderboard: LeaderboardRank[] = MOCK_LEADERBOARD.filter((rank: LeaderboardRank) => {
    if (leaderboardFilter === "ALL") return true;
    if (leaderboardFilter === "RA") return rank.grade.includes("RA");
    if (leaderboardFilter === "SD") return rank.grade.includes("SD");
    if (leaderboardFilter === "MTs") return rank.grade.includes("MTs");
    return true;
  });

  return (
    <div className="space-y-8 pb-12 text-white">
      {/* Header Banner */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <FolderKanban className="w-3.5 h-3.5" />
            <span>Pusat Kreasi Konten & Tugas Pendidik</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Manajemen Konten & Tugas Pembelajaran
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 ${
              isDark ? "text-gray-400" : "text-slate-600 font-medium"
            }`}
          >
            Platform mandiri bagi guru pengampu untuk mengunggah modul ajar, menugaskan kuis asesmen, dan membuat tantangan game interaktif dengan papan peringkat real-time santri.
          </p>
        </div>

        {/* Action Button */}
        {activePillar === "materi" && (
          <button
            onClick={() => setShowUploadModal(true)}
            className="inline-flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer shrink-0"
          >
            <UploadCloud className="w-4 h-4" />
            <span>+ Unggah Modul Baru</span>
          </button>
        )}
      </div>

      {/* 3 PILLAR SUB-TABS NAVIGATION */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-1 overflow-x-auto">
        <button
          onClick={() => setActivePillar("materi")}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activePillar === "materi"
              ? "border-cyan-400 text-cyan-300 bg-white/5 rounded-t-xl"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>1. Materi Pembelajaran (PDF/Docs)</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/20 text-cyan-300 font-black">
            {learningMaterials.length}
          </span>
        </button>

        <button
          onClick={() => setActivePillar("kuis")}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activePillar === "kuis"
              ? "border-emerald-400 text-emerald-300 bg-white/5 rounded-t-xl"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <FileCheck className="w-4 h-4" />
          <span>2. Penugasan Kuis & Asesmen</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-emerald-500/20 text-emerald-300 font-black">
            {urgentTasks.length}
          </span>
        </button>

        <button
          onClick={() => setActivePillar("game")}
          className={`flex items-center gap-2 px-4 py-3 font-bold text-xs sm:text-sm border-b-2 transition-all cursor-pointer whitespace-nowrap ${
            activePillar === "game"
              ? "border-purple-400 text-purple-300 bg-white/5 rounded-t-xl"
              : "border-transparent text-gray-400 hover:text-white"
          }`}
        >
          <Gamepad2 className="w-4 h-4" />
          <span>3. Tantangan Game & Peringkat</span>
          <span className="px-2 py-0.5 rounded-full text-[10px] bg-purple-500/20 text-purple-300 font-black">
            {customGames.length}
          </span>
        </button>
      </div>

      {/* =================================================================== */}
      {/* 1. MATERI PEMBELAJARAN (UPLOAD PDF / DOCS)                          */}
      {/* =================================================================== */}
      {activePillar === "materi" && (
        <div className="space-y-6">
          {/* UPLOAD FORM MODAL / COLLAPSIBLE PANEL */}
          {showUploadModal && (
            <div
              className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-6 animate-fade-in ${
                isDark
                  ? "bg-[#1a1a24]/90 border-cyan-500/30 text-white"
                  : "bg-white border-cyan-200 text-slate-900 shadow-xl"
              }`}
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-2.5">
                  <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-400">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-lg font-bold">Unggah Modul / Materi Pembelajaran Baru</h3>
                    <p className="text-xs text-gray-400">
                      Sistem akan menyebarkan materi dan memicu notifikasi real-time ke santri di kelas target.
                    </p>
                  </div>
                </div>
                <button
                  onClick={() => setShowUploadModal(false)}
                  className="px-3 py-1.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 hover:bg-white/10 transition cursor-pointer"
                >
                  Tutup Form
                </button>
              </div>

              {/* Status Alert */}
              {materialSuccess && (
                <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span>Materi berhasil diunggah! Santri kelas target telah menerima notifikasi baru.</span>
                </div>
              )}

              {materialError && (
                <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in">
                  <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                  <span>{materialError}</span>
                </div>
              )}

              <form onSubmit={handlePublishMaterial} className="space-y-5">
                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">
                      Judul Modul / Materi <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="text"
                      value={materialTitle}
                      onChange={(e) => setMaterialTitle(e.target.value)}
                      placeholder="Contoh: Modul Fisika: Hukum Newton & Tekanan Zat Cair"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Mata Pelajaran</label>
                    <select
                      value={materialSubject}
                      onChange={(e) => setMaterialSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-cyan-400 cursor-pointer"
                    >
                      <option value="IPA Terpadu">IPA Terpadu</option>
                      <option value="Matematika">Matematika</option>
                      <option value="PAI & Al-Qur'an">PAI & Al-Qur'an</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                      <option value="Tahfidz & Tajwid">Tahfidz & Tajwid</option>
                      <option value="Informatika">Informatika & Robotika</option>
                    </select>
                  </div>
                </div>

                {/* FILE UPLOAD DROPZONE */}
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-gray-300">
                    Berkas Materi (PDF / Word DOCX) <span className="text-rose-400">*</span>
                  </label>
                  <label
                    className={`block w-full border-2 border-dashed rounded-2xl p-6 text-center transition-all cursor-pointer ${
                      uploadedFile
                        ? "border-emerald-500/60 bg-emerald-500/5"
                        : "border-white/15 bg-[#14141b]/70 hover:border-cyan-400/50 hover:bg-white/5"
                    }`}
                  >
                    <input
                      type="file"
                      accept=".pdf,.doc,.docx"
                      onChange={handleSimulateFileSelect}
                      className="hidden"
                    />
                    {uploadedFile ? (
                      <div className="flex items-center justify-center gap-3">
                        <FileText className="w-8 h-8 text-emerald-400" />
                        <div className="text-left">
                          <p className="text-xs sm:text-sm font-bold text-emerald-300">
                            {uploadedFile.name}
                          </p>
                          <p className="text-[11px] text-gray-400">
                            Ukuran: {uploadedFile.size} • Format {uploadedFile.type.toUpperCase()} siap diunggah
                          </p>
                        </div>
                      </div>
                    ) : (
                      <div className="space-y-2">
                        <UploadCloud className="w-8 h-8 text-cyan-400 mx-auto" />
                        <p className="text-xs sm:text-sm font-bold text-gray-200">
                          Klik untuk memilih berkas atau seret dokumen ke sini
                        </p>
                        <p className="text-[11px] text-gray-400">
                          Mendukung berkas PDF (.pdf) dan Microsoft Word (.doc, .docx) hingga 25 MB
                        </p>
                      </div>
                    )}
                  </label>
                </div>

                {/* CLASS TARGET SELECTOR FILTERED BY TEACHER LEVEL */}
                <ClassTargetSelector
                  selectedClasses={materialTargetClasses}
                  onChange={setMaterialTargetClasses}
                  label="Pilih Target Kelas Penerima Modul (Otomatis Sesuai Jenjang Guru)"
                />

                {/* Deskripsi & Topics */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Deskripsi Singkat Modul</label>
                    <textarea
                      value={materialDescription}
                      onChange={(e) => setMaterialDescription(e.target.value)}
                      rows={2}
                      placeholder="Ringkasan isi modul dan petunjuk belajar untuk santri..."
                      className="w-full px-4 py-2 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">
                      Topik / Kata Kunci (Pisahkan dengan koma)
                    </label>
                    <input
                      type="text"
                      value={materialTopics}
                      onChange={(e) => setMaterialTopics(e.target.value)}
                      placeholder="Contoh: Gaya, Tekanan, Hukum Newton, Fluida"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-cyan-400"
                    />
                  </div>
                </div>

                <div className="flex items-center justify-end gap-3 pt-2">
                  <button
                    type="button"
                    onClick={() => setShowUploadModal(false)}
                    className="px-4 py-2.5 rounded-xl text-xs font-bold text-gray-400 hover:text-white bg-white/5 transition cursor-pointer"
                  >
                    Batal
                  </button>
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-cyan-500/20 transition-all cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publikasikan Modul ke Siswa</span>
                  </button>
                </div>
              </form>
            </div>
          )}

          {/* LIST OF UPLOADED MATERIALS OR SLEEK EMPTY STATE */}
          {learningMaterials.length === 0 ? (
            <div
              className={`rounded-3xl border p-12 text-center space-y-4 backdrop-blur-xl ${
                isDark
                  ? "bg-[#1a1a24]/80 border-white/10 text-white"
                  : "bg-white border-slate-200 text-slate-900 shadow-md"
              }`}
            >
              <div className="w-16 h-16 rounded-3xl bg-cyan-500/10 border border-cyan-500/20 flex items-center justify-center mx-auto text-cyan-400 shadow-lg shadow-cyan-500/10">
                <BookOpen className="w-8 h-8" />
              </div>
              <div className="max-w-md mx-auto space-y-2">
                <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-300 text-xs font-semibold">
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Platform Interaktif Mandiri Guru</span>
                </div>
                <h3 className="text-xl font-bold tracking-tight">
                  Belum Ada Materi yang Diunggah
                </h3>
                <p className="text-xs sm:text-sm text-gray-400">
                  Belum ada materi pembelajaran yang diunggah. Silakan klik tombol di bawah untuk mengunggah berkas modul bahan ajar (PDF atau Word) kepada santri.
                </p>
              </div>
              <button
                onClick={() => setShowUploadModal(true)}
                className="inline-flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-slate-950 font-bold text-xs sm:text-sm shadow-md transition-all cursor-pointer"
              >
                <UploadCloud className="w-4 h-4" />
                <span>+ Unggah Materi Sekarang</span>
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
              {learningMaterials.map((item) => (
                <div
                  key={item.id}
                  className={`rounded-2xl border p-5 flex flex-col justify-between transition-all duration-200 group ${
                    isDark
                      ? "bg-[#1a1a24]/80 border-white/10 hover:border-cyan-500/40 shadow-lg shadow-black/30"
                      : "bg-white border-slate-200 hover:border-cyan-400 shadow-sm"
                  }`}
                >
                  <div className="space-y-3">
                    <div className="flex items-center justify-between gap-2">
                      <span className="px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-wider bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                        {item.level} • {item.subject}
                      </span>
                      <span className="text-[11px] font-bold text-gray-400 flex items-center gap-1">
                        <FileText className="w-3.5 h-3.5 text-cyan-400" />
                        {item.type.toUpperCase()}
                      </span>
                    </div>

                    <div>
                      <h4 className="text-base font-bold text-white group-hover:text-cyan-300 transition-colors">
                        {item.title}
                      </h4>
                      <p className="text-xs text-gray-400 line-clamp-2 mt-1">
                        {item.description}
                      </p>
                    </div>

                    {/* Target Classes Tags */}
                    {item.targetClasses && item.targetClasses.length > 0 && (
                      <div className="space-y-1">
                        <span className="text-[10px] font-bold text-gray-400 block uppercase">
                          Target Kelas:
                        </span>
                        <div className="flex flex-wrap gap-1">
                          {item.targetClasses.map((cls) => (
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

                    {/* Metadata */}
                    <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                      <span>Pengampu: {item.author}</span>
                      <span>{item.fileSize || "1.8 MB"}</span>
                    </div>
                  </div>

                  <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between gap-2">
                    <button
                      onClick={() => setPreviewMaterial(item)}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-500/10 hover:bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold transition cursor-pointer"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>Lihat Modul</span>
                    </button>

                    <button
                      onClick={() => deleteLearningMaterial(item.id)}
                      className="p-1.5 rounded-lg text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 transition cursor-pointer"
                      title="Hapus Modul"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}

          {/* PREVIEW MODAL */}
          {previewMaterial && (
            <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4 animate-fade-in">
              <div className="max-w-2xl w-full rounded-3xl bg-[#1a1a24] border border-cyan-500/40 p-6 sm:p-8 space-y-5 text-white shadow-2xl">
                <div className="flex items-center justify-between pb-3 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <BookOpen className="w-5 h-5 text-cyan-400" />
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400">
                      Pratinjau Modul Santri
                    </span>
                  </div>
                  <button
                    onClick={() => setPreviewMaterial(null)}
                    className="text-gray-400 hover:text-white text-sm"
                  >
                    ✕
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center gap-2">
                    <span className="px-2.5 py-1 rounded-md text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                      {previewMaterial.level} • {previewMaterial.subject}
                    </span>
                    <span className="text-xs text-gray-400">
                      Pengampu: {previewMaterial.author}
                    </span>
                  </div>

                  <h3 className="text-xl font-extrabold text-white">
                    {previewMaterial.title}
                  </h3>

                  <p className="text-xs sm:text-sm text-gray-300 bg-black/30 p-4 rounded-xl border border-white/5">
                    {previewMaterial.description}
                  </p>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-gray-400 uppercase">
                      Target Penerima:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {(previewMaterial.targetClasses || [previewMaterial.grade]).map((cls) => (
                        <span
                          key={cls}
                          className="px-2.5 py-1 rounded-lg text-xs font-semibold bg-cyan-500/10 border border-cyan-500/30 text-cyan-300"
                        >
                          {cls}
                        </span>
                      ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <h5 className="text-xs font-bold text-gray-400 uppercase">
                      Topik Bahasan:
                    </h5>
                    <div className="flex flex-wrap gap-1.5">
                      {previewMaterial.topics.map((top) => (
                        <span
                          key={top}
                          className="px-2 py-0.5 rounded-md text-[11px] bg-white/5 border border-white/10 text-gray-300"
                        >
                          #{top}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="pt-4 border-t border-white/10 flex items-center justify-between">
                  <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1.5">
                    <CheckCircle2 className="w-4 h-4" />
                    Format {previewMaterial.type.toUpperCase()} Siap Diunduh
                  </span>
                  <button
                    onClick={() => {
                      alert(`Mengunduh file: ${previewMaterial.title}.${previewMaterial.type}`);
                      setPreviewMaterial(null);
                    }}
                    className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-slate-950 font-bold text-xs transition cursor-pointer"
                  >
                    <Download className="w-4 h-4" />
                    <span>Unduh Dokumen</span>
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 2. PENUGASAN KUIS & ASESMEN                                         */}
      {/* =================================================================== */}
      {activePillar === "kuis" && (
        <div className="space-y-6">
          {/* Sub-mode selector */}
          <div className="flex items-center gap-3">
            <button
              onClick={() => setQuizCreationMode("quick_quiz")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                quizCreationMode === "quick_quiz"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Kuis Pilihan Ganda Kilat
            </button>
            <button
              onClick={() => setQuizCreationMode("structured_task")}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition cursor-pointer ${
                quizCreationMode === "structured_task"
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                  : "bg-white/5 text-gray-400 hover:text-white"
              }`}
            >
              Tugas Terstruktur & Proyek
            </button>
          </div>

          {quizCreationMode === "structured_task" ? (
            <AssignmentCreator />
          ) : (
            <div className="space-y-6">
              {/* Form Quick Quiz */}
              <div
                className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6 ${
                  isDark
                    ? "bg-[#1a1a24]/80 border-white/10 text-white"
                    : "bg-white border-slate-200 text-slate-900 shadow-md"
                }`}
              >
                <div className="flex items-center justify-between pb-4 border-b border-white/10">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                      <HelpCircle className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-lg font-bold">Buat Kuis Pilihan Ganda Interaktif</h3>
                      <p className="text-xs text-gray-400">
                        Pertanyaan langsung tersinkronkan dan memicu timer evaluasi di portal siswa.
                      </p>
                    </div>
                  </div>
                </div>

                {quizSuccess && (
                  <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                    <span>Kuis berhasil dipublikasikan! Notifikasi telah dikirimkan ke santri kelas target.</span>
                  </div>
                )}

                {quizError && (
                  <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3">
                    <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                    <span>{quizError}</span>
                  </div>
                )}

                <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                  <div className="md:col-span-8 space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Judul Kuis</label>
                    <input
                      type="text"
                      value={quickQuizTitle}
                      onChange={(e) => setQuickQuizTitle(e.target.value)}
                      placeholder="Contoh: Kuis Kilat Bab 3: Aritmatika & Aljabar Sederhana"
                      className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
                    />
                  </div>
                  <div className="md:col-span-4 space-y-1.5">
                    <label className="text-xs font-bold text-gray-300">Mata Pelajaran</label>
                    <select
                      value={quickQuizSubject}
                      onChange={(e) => setQuickQuizSubject(e.target.value)}
                      className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400 cursor-pointer"
                    >
                      <option value="Matematika">Matematika</option>
                      <option value="IPA Terpadu">IPA Terpadu</option>
                      <option value="PAI & Al-Qur'an">PAI & Al-Qur'an</option>
                      <option value="Bahasa Inggris">Bahasa Inggris</option>
                      <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                    </select>
                  </div>
                </div>

                {/* Class Target Selector */}
                <ClassTargetSelector
                  selectedClasses={quickQuizClasses}
                  onChange={setQuickQuizClasses}
                  label="Target Kelas Penerima Kuis (Filtered by Jenjang)"
                />

                {/* Question Add Section */}
                <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-emerald-400 flex items-center gap-1.5">
                    <PlusCircle className="w-4 h-4" />
                    <span>Tambah Butir Soal Kuis ({quickQuizQuestions.length} Butir Tersedia)</span>
                  </h4>

                  <div className="space-y-3">
                    <input
                      type="text"
                      value={currentQText}
                      onChange={(e) => setCurrentQText(e.target.value)}
                      placeholder="Tuliskan teks pertanyaan soal di sini..."
                      className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-emerald-400"
                    />

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                      {currentQOptions.map((opt, idx) => (
                        <div key={idx} className="flex items-center gap-2">
                          <input
                            type="radio"
                            name="correctAnswer"
                            checked={currentQCorrect === idx}
                            onChange={() => setCurrentQCorrect(idx)}
                            className="w-4 h-4 text-emerald-500 cursor-pointer"
                            title="Tandai opsi ini sebagai kunci jawaban yang benar"
                          />
                          <input
                            type="text"
                            value={opt}
                            onChange={(e) => {
                              const updated = [...currentQOptions];
                              updated[idx] = e.target.value;
                              setCurrentQOptions(updated);
                            }}
                            placeholder={`Pilihan ${String.fromCharCode(65 + idx)}...`}
                            className="flex-1 px-3 py-2 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                          />
                        </div>
                      ))}
                    </div>

                    <input
                      type="text"
                      value={currentQExpl}
                      onChange={(e) => setCurrentQExpl(e.target.value)}
                      placeholder="Pembahasan singkat kunci jawaban (opsional)..."
                      className="w-full px-4 py-2 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-400"
                    />

                    <button
                      type="button"
                      onClick={handleAddQuestionToQuiz}
                      className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 border border-emerald-500/40 text-xs font-bold transition cursor-pointer"
                    >
                      + Tambah Soal Ini ke Kuis
                    </button>
                  </div>
                </div>

                <div className="flex items-center justify-between pt-3 border-t border-white/10">
                  <div className="text-xs text-gray-400">
                    Total: <strong className="text-white">{quickQuizQuestions.length} butir soal</strong> siap ditugaskan
                  </div>

                  <button
                    type="button"
                    onClick={handlePublishQuickQuiz}
                    className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-600 hover:from-emerald-400 hover:to-teal-500 text-slate-950 font-black text-xs sm:text-sm shadow-lg shadow-emerald-500/20 transition cursor-pointer"
                  >
                    <Send className="w-4 h-4" />
                    <span>Publikasikan Kuis ke Santri</span>
                  </button>
                </div>
              </div>

              {/* LIST OF ACTIVE TASKS / QUIZZES */}
              <div className="space-y-3">
                <h4 className="text-sm font-bold text-white flex items-center gap-2">
                  <FileCheck className="w-4 h-4 text-emerald-400" />
                  <span>Daftar Tugas & Kuis yang Telah Diterbitkan ({urgentTasks.length})</span>
                </h4>

                {urgentTasks.length === 0 ? (
                  <div className="p-8 rounded-2xl bg-[#1a1a24]/80 border border-dashed border-white/10 text-center text-gray-400">
                    Belum ada kuis atau tugas yang ditugaskan.
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {urgentTasks.map((t) => (
                      <div
                        key={t.id}
                        className="p-5 rounded-2xl bg-[#1a1a24]/80 border border-white/10 hover:border-emerald-500/30 transition space-y-2.5"
                      >
                        <div className="flex items-center justify-between">
                          <span className="px-2.5 py-0.5 rounded-md text-[10px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 uppercase">
                            {t.type === "kuis" ? "Kuis Interaktif" : "Tugas Terstruktur"} • {t.subject}
                          </span>
                          <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5" />
                            {t.dueDate}
                          </span>
                        </div>

                        <h5 className="font-bold text-white text-sm">{t.title}</h5>

                        {t.targetClasses && t.targetClasses.length > 0 && (
                          <div className="flex flex-wrap gap-1">
                            {t.targetClasses.map((c) => (
                              <span
                                key={c}
                                className="px-2 py-0.5 rounded text-[10px] bg-white/5 border border-white/10 text-gray-300"
                              >
                                {c}
                              </span>
                            ))}
                          </div>
                        )}

                        <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs text-gray-400">
                          <span>Hadiah: +{t.rewardExp} EXP • +{t.rewardCoins} Koin</span>
                          <span className="text-emerald-400 font-bold">
                            {t.completed ? "Selesai Dievaluasi" : "Sedang Berjalan"}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
      )}

      {/* =================================================================== */}
      {/* 3. TANTANGAN GAME INTERAKTIF & LEADERBOARD                          */}
      {/* =================================================================== */}
      {activePillar === "game" && (
        <div className="space-y-8">
          {/* Template Choice Grid */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-purple-400" />
              <h3 className="text-sm font-bold text-white">
                Pilih Template Game Platform
              </h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {GAME_TEMPLATES.map((tmpl) => {
                const isSelected = selectedTemplate === tmpl.type;
                return (
                  <button
                    key={tmpl.type}
                    onClick={() => setSelectedTemplate(tmpl.type)}
                    className={`p-4 rounded-2xl border text-left transition-all duration-200 cursor-pointer ${
                      isSelected
                        ? `bg-gradient-to-br ${tmpl.color} shadow-lg shadow-purple-500/10 scale-[1.02]`
                        : "bg-[#1a1a24]/80 border-white/10 hover:border-white/20 text-gray-300 hover:text-white"
                    }`}
                  >
                    <div className="text-2xl mb-2">{tmpl.icon}</div>
                    <h4 className="font-bold text-sm text-white">{tmpl.title}</h4>
                    <p className="text-xs text-gray-400 mt-1 line-clamp-2">{tmpl.desc}</p>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Form Game Creator */}
          <div
            className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-2xl shadow-xl space-y-6 ${
              isDark
                ? "bg-[#1a1a24]/80 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900 shadow-md"
            }`}
          >
            <div className="flex items-center justify-between pb-4 border-b border-white/10">
              <div className="flex items-center gap-2.5">
                <div className="w-9 h-9 rounded-xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                  <Gamepad2 className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold">
                    Konfigurasi Tantangan Game: {selectedTemplate}
                  </h3>
                  <p className="text-xs text-gray-400">
                    Game akan disinkronkan ke "Arena Bermain & Kuis" santri dengan perolehan skor real-time.
                  </p>
                </div>
              </div>
            </div>

            {gameSuccess && (
              <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                <span>Tantangan game berhasil dipublikasikan! Santri telah menerima undangan tantangan.</span>
              </div>
            )}

            {gameError && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3">
                <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{gameError}</span>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
              <div className="md:col-span-8 space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Judul Tantangan Game</label>
                <input
                  type="text"
                  value={gameTitle}
                  onChange={(e) => setGameTitle(e.target.value)}
                  placeholder="Contoh: Arena Cepat Tepat: Fotosintesis & Ekosistem MTs"
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400"
                />
              </div>

              <div className="md:col-span-4 space-y-1.5">
                <label className="text-xs font-bold text-gray-300">Mata Pelajaran</label>
                <select
                  value={gameSubject}
                  onChange={(e) => setGameSubject(e.target.value)}
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400 cursor-pointer"
                >
                  <option value="IPA Terpadu">IPA Terpadu</option>
                  <option value="Matematika">Matematika</option>
                  <option value="Bahasa Inggris">Bahasa Inggris</option>
                  <option value="Bahasa Indonesia">Bahasa Indonesia</option>
                  <option value="PAI & Al-Qur'an">PAI & Al-Qur'an</option>
                </select>
              </div>
            </div>

            {/* Class Target Selector */}
            <ClassTargetSelector
              selectedClasses={gameClasses}
              onChange={setGameClasses}
              label="Pilih Target Kelas Tantangan Game (Filtered by Jenjang)"
            />

            {/* Game Questions Builder */}
            <div className="p-5 rounded-2xl bg-black/30 border border-white/5 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-purple-400 flex items-center gap-1.5">
                <PlusCircle className="w-4 h-4" />
                <span>Susun Soal Tantangan ({gameQuestions.length} Soal Terisi)</span>
              </h4>

              <div className="space-y-3">
                <input
                  type="text"
                  value={gQText}
                  onChange={(e) => setGQText(e.target.value)}
                  placeholder="Pertanyaan tantangan game..."
                  className="w-full px-4 py-2.5 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs sm:text-sm focus:outline-none focus:border-purple-400"
                />

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                  {gQOptions.map((opt, idx) => (
                    <div key={idx} className="flex items-center gap-2">
                      <input
                        type="radio"
                        name="gameCorrectAnswer"
                        checked={gQCorrect === idx}
                        onChange={() => setGQCorrect(idx)}
                        className="w-4 h-4 text-purple-500 cursor-pointer"
                        title="Tandai opsi ini sebagai kunci jawaban benar"
                      />
                      <input
                        type="text"
                        value={opt}
                        onChange={(e) => {
                          const updated = [...gQOptions];
                          updated[idx] = e.target.value;
                          setGQOptions(updated);
                        }}
                        placeholder={`Pilihan ${String.fromCharCode(65 + idx)}...`}
                        className="flex-1 px-3 py-2 rounded-xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-purple-400"
                      />
                    </div>
                  ))}
                </div>

                <button
                  type="button"
                  onClick={handleAddGameQuestion}
                  className="px-4 py-2 rounded-xl bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold transition cursor-pointer"
                >
                  + Tambah Pertanyaan ke Game
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between pt-3 border-t border-white/10">
              <div className="flex items-center gap-4 text-xs text-gray-400">
                <span>Durasi: {gameDuration} Menit</span>
                <span>Hadiah: +{gameExp} EXP • +{gameCoins} Koin</span>
              </div>

              <button
                type="button"
                onClick={handlePublishCustomGame}
                className="inline-flex items-center gap-2 px-6 py-2.5 rounded-xl bg-gradient-to-r from-purple-500 to-indigo-600 hover:from-purple-400 hover:to-indigo-500 text-white font-black text-xs sm:text-sm shadow-lg shadow-purple-500/20 transition cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Publikasikan Tantangan Game</span>
              </button>
            </div>
          </div>

          {/* STUDENT LEADERBOARD / PERINGKAT SECTION */}
          <div
            className={`rounded-3xl border p-6 sm:p-8 backdrop-blur-xl shadow-xl space-y-6 ${
              isDark
                ? "bg-[#1a1a24]/80 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900 shadow-md"
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-white/10">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-amber-500/20 to-yellow-500/20 border border-amber-500/30 flex items-center justify-center text-[#ffbf00]">
                  <Trophy className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-bold text-white">
                    Papan Skor & Peringkat Santri (Live Leaderboard)
                  </h3>
                  <p className="text-xs text-gray-400">
                    Rekapitulasi skor pencapaian santri dalam menuntaskan kuis dan game interaktif.
                  </p>
                </div>
              </div>

              {/* Filter Level Pills */}
              <div className="flex items-center gap-1.5 bg-[#14141b] p-1 rounded-xl border border-white/10">
                {[
                  { id: "ALL", label: "Semua" },
                  { id: "RA", label: "RA" },
                  { id: "SD", label: "SD" },
                  { id: "MTs", label: "MTs" },
                ].map((flt) => (
                  <button
                    key={flt.id}
                    onClick={() => setLeaderboardFilter(flt.id)}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition cursor-pointer ${
                      leaderboardFilter === flt.id
                        ? "bg-purple-500 text-white shadow-xs"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    {flt.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Table Leaderboard */}
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-white/10 text-gray-400 text-xs">
                    <th className="pb-3 pl-3 font-semibold">Peringkat</th>
                    <th className="pb-3 font-semibold">Santri</th>
                    <th className="pb-3 font-semibold">NIS & Jenjang</th>
                    <th className="pb-3 font-semibold text-center">Akumulasi EXP</th>
                    <th className="pb-3 font-semibold text-center">Koin EduQuest</th>
                    <th className="pb-3 pr-3 text-right font-semibold">Lencana</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {filteredLeaderboard.map((item: LeaderboardRank) => {
                    const isGold = item.rank === 1;
                    const isSilver = item.rank === 2;
                    const isBronze = item.rank === 3;

                    return (
                      <tr
                        key={item.id}
                        className={`transition-colors ${
                          isGold
                            ? "bg-amber-500/10 hover:bg-amber-500/15"
                            : isSilver
                            ? "bg-slate-300/10 hover:bg-slate-300/15"
                            : isBronze
                            ? "bg-amber-700/10 hover:bg-amber-700/15"
                            : "hover:bg-white/5"
                        }`}
                      >
                        <td className="py-3.5 pl-3">
                          <div className="flex items-center gap-1.5 font-black text-sm">
                            {isGold ? (
                              <span className="w-7 h-7 rounded-xl bg-amber-500 text-slate-950 flex items-center justify-center font-black shadow-md shadow-amber-500/30">
                                🥇
                              </span>
                            ) : isSilver ? (
                              <span className="w-7 h-7 rounded-xl bg-slate-300 text-slate-950 flex items-center justify-center font-black shadow-md shadow-slate-300/30">
                                🥈
                              </span>
                            ) : isBronze ? (
                              <span className="w-7 h-7 rounded-xl bg-amber-700 text-white flex items-center justify-center font-black shadow-md shadow-amber-700/30">
                                🥉
                              </span>
                            ) : (
                              <span className="w-7 h-7 rounded-xl bg-white/5 text-gray-300 flex items-center justify-center font-bold">
                                #{item.rank}
                              </span>
                            )}
                          </div>
                        </td>

                        <td className="py-3.5">
                          <div className="flex items-center gap-3">
                            <img
                              src={item.avatar}
                              alt={item.name}
                              className="w-9 h-9 rounded-xl object-cover border border-white/20 shrink-0"
                            />
                            <div>
                              <p className="font-bold text-white">{item.name}</p>
                              <p className="text-[11px] text-gray-400">{item.grade}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3.5 text-xs text-gray-300">
                          <span className="font-mono text-cyan-300">NIS: {item.id.replace("std-", "")}</span>
                        </td>

                        <td className="py-3.5 text-center">
                          <span className="font-extrabold text-cyan-400">
                            {item.exp.toLocaleString()} EXP
                          </span>
                        </td>

                        <td className="py-3.5 text-center">
                          <span className="font-extrabold text-amber-400 flex items-center justify-center gap-1">
                            🪙 {item.coins}
                          </span>
                        </td>

                        <td className="py-3.5 pr-3 text-right">
                          <span className="px-2.5 py-1 rounded-full text-[10px] font-bold bg-white/10 text-gray-200 border border-white/10">
                            {item.badge}
                          </span>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
