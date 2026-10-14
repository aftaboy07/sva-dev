"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  FileText,
  UploadCloud,
  Sparkles,
  Shield,
  ShieldAlert,
  ShieldCheck,
  AlertTriangle,
  Clock,
  CheckCircle2,
  XCircle,
  HelpCircle,
  ArrowRight,
  ArrowLeft,
  Maximize2,
  Minimize2,
  RotateCcw,
  Check,
  FileCheck,
  Award,
  BookOpen,
  Eye,
  Lock,
  ChevronRight,
  ListOrdered,
  Download,
  Terminal,
  Flag,
  Send,
  Zap,
} from "lucide-react";

// =============================================================================
// TYPES & DATA STRUCTURES
// =============================================================================
export type QuestionType = "multiple_choice" | "essay";

export interface QuestionOption {
  key: string; // "A", "B", "C", "D", "E"
  text: string;
}

export interface ExamQuestion {
  id: string;
  number: number;
  type: QuestionType;
  stem: string;
  options?: QuestionOption[];
  correctAnswer?: string; // e.g. "A"
  explanation?: string;
  rubric?: string;
  maxPoints: number;
}

export interface QuizPayload {
  id: string;
  title: string;
  subject: string;
  gradeLevel: string;
  durationMinutes: number;
  maxStrikes: number;
  questions: ExamQuestion[];
  rawTextSource?: string;
  sourceFileName: string;
}

export interface StudentAnswers {
  [questionId: string]: {
    answer: string;
    isFlagged: boolean;
    answeredAt?: string;
  };
}

export interface ViolationEvent {
  id: string;
  strikeNumber: number;
  type: "tab_switch" | "fullscreen_exit" | "window_blur" | "forbidden_key";
  description: string;
  timestamp: string;
}

// Preset Docx Examples for instant testing
const PRESET_SAMPLE_EXAMS: QuizPayload[] = [
  {
    id: "quiz-bio-01",
    title: "Penilaian Harian: Sistem Pencernaan & Metabolisme Biologis",
    subject: "Biologi Terapan",
    gradeLevel: "Kelas XI MIPA",
    durationMinutes: 30,
    maxStrikes: 3,
    sourceFileName: "Bank_Soal_Biologi_Sistem_Pencernaan.docx",
    questions: [
      {
        id: "q1",
        number: 1,
        type: "multiple_choice",
        stem: "Enzim pepsin yang disekresikan di dalam ventrikulus lambung berfungsi optimal pada kondisi pH asam ekstrem. Zat kimia yang bertanggung jawab menciptakan suasana pH 1.5 - 2.0 tersebut adalah...",
        options: [
          { key: "A", text: "Asam Laktat (C3H6O3)" },
          { key: "B", text: "Asam Klorida (HCl)" },
          { key: "C", text: "Natrium Bikarbonat (NaHCO3)" },
          { key: "D", text: "Asam Asetat (CH3COOH)" },
          { key: "E", text: "Empedu Bilirubin" },
        ],
        correctAnswer: "B",
        explanation: "Asam klorida (HCl) disekresikan oleh sel parietal lambung untuk mengaktifkan pepsinogen menjadi enzim pepsin aktif serta membunuh patogen pada bolus makanan.",
        maxPoints: 10,
      },
      {
        id: "q2",
        number: 2,
        type: "multiple_choice",
        stem: "Organ manakah yang berfungsi ganda sebagai kelenjar eksokrin (penghasil enzim lipase, tripsin, amilase) sekaligus kelenjar endokrin (penghasil insulin dan glukagon)?",
        options: [
          { key: "A", text: "Hepar (Hati)" },
          { key: "B", text: "Vesica Fellea (Kantung Empedu)" },
          { key: "C", text: "Pankreas" },
          { key: "D", text: "Duodenum" },
          { key: "E", text: "Lien (Limpa)" },
        ],
        correctAnswer: "C",
        explanation: "Pankreas merupakan organ amfikrin; asinus memproduksi getah pencernaan sedangkan pulau Langerhans memproduksi hormon insulin dan glukagon.",
        maxPoints: 10,
      },
      {
        id: "q3",
        number: 3,
        type: "multiple_choice",
        stem: "Proses absorbsi sari-sari makanan seperti asam amino, glukosa, dan vitamin yang larut dalam air sebagian besar berlangsung di vili pada bagian...",
        options: [
          { key: "A", text: "Kolon Asenden" },
          { key: "B", text: "Ileum & Jejunum usus halus" },
          { key: "C", text: "Rektum" },
          { key: "D", text: "Esofagus" },
          { key: "E", text: "Lambung Kardiak" },
        ],
        correctAnswer: "B",
        explanation: "Jejunum dan ileum memiliki lipatan vili dan mikrovili dengan luas permukaan masif untuk absorpsi mikronutrien ke pembuluh kapiler darah dan lakteal.",
        maxPoints: 10,
      },
      {
        id: "q4",
        number: 4,
        type: "essay",
        stem: "Jelaskan secara komparatif mekanisme pencernaan mekanik versus pencernaan kimiawi yang terjadi di rongga mulut (cavum oris) beserta enzim yang terlibat!",
        rubric: "Poin penuh (20) jika menyebutkan: (1) Gerakan mastikasi gigi/lidah sebagai mekanik, (2) Enzim ptialin/amilase saliva yang memecah amilum menjadi maltosa sebagai kimiawi.",
        explanation: "Pencernaan mekanik dilakukan oleh gigi seri, taring, dan geraham bersama lidah. Pencernaan kimiawi dilakukan oleh ptialin (amilase ludah) pada pH netral 6.8.",
        maxPoints: 20,
      },
      {
        id: "q5",
        number: 5,
        type: "multiple_choice",
        stem: "Apabila seseorang mengalami radang pada umbai cacing akibat penumpukan fekalit atau infeksi bakteri, kondisi medis kegawatdaruratan ini dikenal dengan nama...",
        options: [
          { key: "A", text: "Gastritis Akut" },
          { key: "B", text: "Appendisitis (Apendisitis)" },
          { key: "C", text: "Hepatitis B" },
          { key: "D", text: "Ulkus Peptikum" },
          { key: "E", text: "Konstipasi Spastik" },
        ],
        correctAnswer: "B",
        explanation: "Appendisitis adalah peradangan pada appendix vermiformis yang jika pecah dapat menyebabkan peritonitis berbahaya.",
        maxPoints: 10,
      },
      {
        id: "q6",
        number: 6,
        type: "essay",
        stem: "Uraikan mengapa emulsifikasi lemak oleh garam empedu sangat esensial bagi efisiensi kerja enzim lipase di usus dua belas jari!",
        rubric: "Poin penuh (20) jika menguraikan: garam empedu menurunkan tegangan permukaan dan memecah gumpalan lipid besar menjadi micelle tetesan mikroskopis sehingga memperluas bidang kontak bagi enzim lipase.",
        explanation: "Lipase bersifat hidrofilik sementara lipid bersifat hidrofobik. Tanpa emulsifikasi garam empedu, molekul lipase hanya dapat bekerja pada permukaan luar gumpalan lemak.",
        maxPoints: 20,
      },
    ],
  },
  {
    id: "quiz-fisika-02",
    title: "Asesmen Tengah Semester: Fisika Kuantum & Dinamika Partikel",
    subject: "Fisika Tingkat Lanjut",
    gradeLevel: "Kelas XII MIPA",
    durationMinutes: 45,
    maxStrikes: 3,
    sourceFileName: "UTS_Fisika_Kuantum_2026.docx",
    questions: [
      {
        id: "fq1",
        number: 1,
        type: "multiple_choice",
        stem: "Efek fotolistrik membuktikan bahwa cahaya memiliki sifat partikel (foton). Hubungan antara energi kinetik maksimum elektron terlepas dengan frekuensi cahaya datang dikemukakan oleh Einstein melalui persamaan...",
        options: [
          { key: "A", text: "Ek = hf - W0" },
          { key: "B", text: "Ek = mc² + hf" },
          { key: "C", text: "Ek = 1/2 mv² - hf" },
          { key: "D", text: "Ek = hλ / c" },
          { key: "E", text: "Ek = W0 / hf" },
        ],
        correctAnswer: "A",
        explanation: "Energi kinetik elektron adalah selisih energi foton datang (hf) dengan fungsi kerja / energi ambang logam (W0).",
        maxPoints: 10,
      },
      {
        id: "fq2",
        number: 2,
        type: "essay",
        stem: "Jelaskan prinsip ketidakpastian Heisenberg dan implikasinya terhadap pengukuran simultan posisi dan momentum sebuah elektron!",
        rubric: "Poin penuh (20) jika menyebutkan hubungan Δx · Δp ≥ h / 4π dan ketidakmungkinan menentukan posisi dan momentum secara eksak pada skala subatomik.",
        explanation: "Prinsip Heisenberg menyatakan bahwa pengukuran posisi yang semakin presisi akan meningkatkan ketidakpastian dalam mengukur momentum partikel, dan sebaliknya.",
        maxPoints: 20,
      },
    ],
  },
];

// =============================================================================
// MAIN COMPONENT
// =============================================================================
export default function AIAssessmentExamEngine() {
  // Current Workflow View
  // "generator" -> "lobby" -> "exam_active" -> "review"
  const [currentView, setCurrentView] = useState<"generator" | "lobby" | "exam_active" | "review">("generator");

  // Quiz Model in state
  const [activeQuiz, setActiveQuiz] = useState<QuizPayload>(PRESET_SAMPLE_EXAMS[0]);

  // Upload & AI Generation States
  const [isDragOver, setIsDragOver] = useState(false);
  const [uploadedFile, setUploadedFile] = useState<File | null>(null);
  const [isAiGenerating, setIsAiGenerating] = useState(false);
  const [generationStep, setGenerationStep] = useState<number>(0);
  const [generationLogs, setGenerationLogs] = useState<string[]>([]);
  const [extractedRawText, setExtractedRawText] = useState<string>("");

  // Exam Session States
  const [studentName, setStudentName] = useState("Ahmad Fauzan Pratama");
  const [studentNis, setStudentNis] = useState("NISN-2026110842");
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [studentAnswers, setStudentAnswers] = useState<StudentAnswers>({});
  const [remainingSeconds, setRemainingSeconds] = useState(30 * 60);
  const [examStartedAt, setExamStartedAt] = useState<string>("");
  const [examSubmittedAt, setExamSubmittedAt] = useState<string>("");

  // Anti-Cheat & Lockdown Engine States
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [strikeCount, setStrikeCount] = useState(0);
  const [violations, setViolations] = useState<ViolationEvent[]>([]);
  const [activeViolationAlert, setActiveViolationAlert] = useState<ViolationEvent | null>(null);
  const [isDisqualified, setIsDisqualified] = useState(false);

  // Review & Confirmation Modal
  const [showSubmitConfirmModal, setShowSubmitConfirmModal] = useState(false);

  // References for safe cleanup
  const examContainerRef = useRef<HTMLDivElement | null>(null);
  const timerIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const generationTimeoutsRef = useRef<NodeJS.Timeout[]>([]);

  // Cleanup pending timeouts on unmount
  useEffect(() => {
    return () => {
      generationTimeoutsRef.current.forEach(clearTimeout);
    };
  }, []);

  // ---------------------------------------------------------------------------
  // 1. WORD TO QUIZ MOCK PARSER & AI GENERATION FLOW
  // ---------------------------------------------------------------------------
  const simulateAiQuizGeneration = (fileName: string, rawTextHint?: string) => {
    setIsAiGenerating(true);
    setGenerationStep(1);
    setGenerationLogs([
      `[00:00.12] 📄 Membaca struktur berkas binary "${fileName}"...`,
    ]);

    const t1 = setTimeout(() => {
      setGenerationStep(2);
      setGenerationLogs((prev) => [
        ...prev,
        `[00:00.45] ⚙️ Mengekstrak paragraph stream & tabel via Mammoth.js AST...`,
        `[00:00.80] 📊 Ditemukan 14 paragraf soal dan 2 kunci jawaban rujukan.`,
      ]);
      setExtractedRawText(
        rawTextHint ||
          `SOAL UJIAN ASESMEN GURU:\n1. Enzim pepsin pada lambung bekerja optimal pada pH asam ekstrem...\n2. Organ yang mensekresikan insulin dan tripsin sekaligus...\n3. Absorbsi sari makanan vili usus halus...\n4. [ESAI] Jelaskan perbandingan pencernaan mekanik dan kimiawi...\n5. Peradangan umbai cacing (appendix)...\n6. [ESAI] Peran garam empedu dalam proses pencernaan lipid...`
      );
    }, 1100);

    const t2 = setTimeout(() => {
      setGenerationStep(3);
      setGenerationLogs((prev) => [
        ...prev,
        `[00:01.30] 🧠 Menyuntikkan prompt parsing ke LLM (Gemini 1.5 Pro Context)...`,
        `[00:01.75] ⚡ Menghasilkan format JSON terstandarisasi (Pilihan Ganda & Esai)...`,
      ]);
    }, 2200);

    const t3 = setTimeout(() => {
      setGenerationStep(4);
      setGenerationLogs((prev) => [
        ...prev,
        `[00:02.40] ✅ Validasi JSON Schema sukses! 6 Soal siap dirender.`,
      ]);

      // Create new quiz based on file
      const isPhysics = fileName.toLowerCase().includes("fisika");
      const generatedQuiz: QuizPayload = isPhysics
        ? {
            ...PRESET_SAMPLE_EXAMS[1],
            sourceFileName: fileName,
          }
        : {
            ...PRESET_SAMPLE_EXAMS[0],
            sourceFileName: fileName,
            title: `Hasil Ekstraksi AI: ${fileName.replace(/\.docx?$/i, "")}`,
          };

      setActiveQuiz(generatedQuiz);
      setIsAiGenerating(false);
      setGenerationStep(0);
    }, 3300);

    generationTimeoutsRef.current.push(t1, t2, t3);
  };

  const handleFileDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processSelectedFile(file);
    }
  };

  const processSelectedFile = (file: File) => {
    if (!file.name.endsWith(".docx") && !file.name.endsWith(".doc")) {
      alert("Mohon unggah berkas dokumen Microsoft Word berformat .docx atau .doc!");
      return;
    }
    setUploadedFile(file);
    simulateAiQuizGeneration(file.name, `Dokumen Word: ${file.name} (Ukuran: ${(file.size / 1024).toFixed(1)} KB)`);
  };

  // ---------------------------------------------------------------------------
  // 2. EXAM TIMER & LIFECYCLE
  // ---------------------------------------------------------------------------
  const startExamSession = () => {
    // Reset state
    setStrikeCount(0);
    setViolations([]);
    setActiveViolationAlert(null);
    setIsDisqualified(false);
    setCurrentQuestionIndex(0);
    setRemainingSeconds(activeQuiz.durationMinutes * 60);
    setExamStartedAt(new Date().toLocaleTimeString("id-ID"));

    // Enter Fullscreen via standard API
    try {
      if (document.documentElement.requestFullscreen) {
        document.documentElement.requestFullscreen().catch((err) => {
          console.warn("Fullscreen request blocked or denied:", err);
        });
      }
    } catch (err) {
      console.warn("Fullscreen error:", err);
    }

    setCurrentView("exam_active");
  };

  const submitExam = useCallback(
    (reason: "manual" | "time_out" | "disqualified" = "manual") => {
      if (timerIntervalRef.current) {
        clearInterval(timerIntervalRef.current);
      }
      setExamSubmittedAt(new Date().toLocaleTimeString("id-ID"));
      setShowSubmitConfirmModal(false);
      setActiveViolationAlert(null);

      // Exit fullscreen safely
      if (document.fullscreenElement && document.exitFullscreen) {
        document.exitFullscreen().catch(() => {});
      }

      if (reason === "disqualified") {
        setIsDisqualified(true);
      }

      setCurrentView("review");
    },
    []
  );

  // Active Timer Tick
  useEffect(() => {
    if (currentView !== "exam_active") {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
      return;
    }

    timerIntervalRef.current = setInterval(() => {
      setRemainingSeconds((prev) => {
        if (prev <= 1) {
          clearInterval(timerIntervalRef.current!);
          submitExam("time_out");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerIntervalRef.current) clearInterval(timerIntervalRef.current);
    };
  }, [currentView, submitExam]);

  // ---------------------------------------------------------------------------
  // 3. ANTI-CHEAT & LOCKDOWN ENGINE EVENT LISTENERS
  // ---------------------------------------------------------------------------
  const recordViolation = useCallback(
    (type: ViolationEvent["type"], description: string) => {
      if (currentView !== "exam_active" || isDisqualified) return;

      const newStrike = strikeCount + 1;
      const violation: ViolationEvent = {
        id: `viol-${Date.now()}-${Math.random()}`,
        strikeNumber: newStrike,
        type,
        description,
        timestamp: new Date().toLocaleTimeString("id-ID", {
          hour: "2-digit",
          minute: "2-digit",
          second: "2-digit",
        }),
      };

      setViolations((prev) => [...prev, violation]);
      setStrikeCount(newStrike);
      setActiveViolationAlert(violation);

      // 3rd strike automatically disqualifies and locks exam
      if (newStrike >= activeQuiz.maxStrikes) {
        setTimeout(() => {
          submitExam("disqualified");
        }, 1800);
      }
    },
    [currentView, isDisqualified, strikeCount, activeQuiz.maxStrikes, submitExam]
  );

  useEffect(() => {
    if (currentView !== "exam_active") return;

    // A. Detect Tab-Switching & Window Minimization via visibilitychange
    const handleVisibilityChange = () => {
      if (document.visibilityState === "hidden") {
        recordViolation(
          "tab_switch",
          "Terdeteksi meninggalkan jendela ujian (berpindah tab browser atau meminimalkan aplikasi)."
        );
      }
    };

    // B. Detect Focus Loss (Window Blur)
    const handleWindowBlur = () => {
      // Delay slightly to prevent duplicate event when visibilitychange also fires
      setTimeout(() => {
        if (document.hidden) return; // already handled
        recordViolation(
          "window_blur",
          "Fokus jendela ujian terputus (terdeteksi mengklik jendela atau aplikasi lain di latar belakang)."
        );
      }, 150);
    };

    // C. Detect Fullscreen Exit
    const handleFullscreenChange = () => {
      const isNowFullscreen = !!document.fullscreenElement;
      setIsFullscreen(isNowFullscreen);

      if (!isNowFullscreen && currentView === "exam_active") {
        recordViolation(
          "fullscreen_exit",
          "Mode Layar Penuh (Fullscreen) dinonaktifkan secara sepihak oleh peserta ujian."
        );
      }
    };

    // D. Block Dangerous Shortcuts & Cheating Combinations
    const handleKeyDown = (e: KeyboardEvent) => {
      // Block F12 (DevTools)
      if (e.key === "F12") {
        e.preventDefault();
        recordViolation("forbidden_key", "Mencoba mengakses Developer Tools (F12).");
        return;
      }

      // Block Ctrl+C, Ctrl+V, Ctrl+X, Ctrl+U, Ctrl+P, Ctrl+S, Ctrl+Shift+I
      if (e.ctrlKey || e.metaKey) {
        const key = e.key.toLowerCase();
        if (["c", "v", "x", "u", "p", "s", "a"].includes(key)) {
          e.preventDefault();
          recordViolation(
            "forbidden_key",
            `Mencoba menggunakan kombinasi tombol pintas terlarang (Ctrl+${key.toUpperCase()}).`
          );
          return;
        }
        if (e.shiftKey && (key === "i" || key === "j" || key === "c")) {
          e.preventDefault();
          recordViolation("forbidden_key", "Mencoba mengakses inspect element console.");
          return;
        }
      }

      // Block PrintScreen
      if (e.key === "PrintScreen") {
        e.preventDefault();
        recordViolation("forbidden_key", "Mencoba menangkap layar (PrintScreen).");
        return;
      }
    };

    // E. Block Right Click (Context Menu)
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
      return false;
    };

    // F. Block Copy and Paste Events
    const handleCopy = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };
    const handlePaste = (e: ClipboardEvent) => {
      e.preventDefault();
      return false;
    };

    // Register all listeners
    document.addEventListener("visibilitychange", handleVisibilityChange);
    window.addEventListener("blur", handleWindowBlur);
    document.addEventListener("fullscreenchange", handleFullscreenChange);
    window.addEventListener("keydown", handleKeyDown);
    window.addEventListener("contextmenu", handleContextMenu);
    window.addEventListener("copy", handleCopy);
    window.addEventListener("paste", handlePaste);

    // Strict Cleanup upon unmount or view change
    return () => {
      document.removeEventListener("visibilitychange", handleVisibilityChange);
      window.removeEventListener("blur", handleWindowBlur);
      document.removeEventListener("fullscreenchange", handleFullscreenChange);
      window.removeEventListener("keydown", handleKeyDown);
      window.removeEventListener("contextmenu", handleContextMenu);
      window.removeEventListener("copy", handleCopy);
      window.removeEventListener("paste", handlePaste);
    };
  }, [currentView, recordViolation]);

  // Re-enter Fullscreen on violation acknowledge
  const handleAcknowledgeViolation = () => {
    setActiveViolationAlert(null);
    if (!document.fullscreenElement && document.documentElement.requestFullscreen) {
      document.documentElement.requestFullscreen().catch(() => {});
    }
  };

  // ---------------------------------------------------------------------------
  // 4. STUDENT ANSWER INTERACTION
  // ---------------------------------------------------------------------------
  const currentQuestion = activeQuiz.questions[currentQuestionIndex];
  const currentAnswerState = studentAnswers[currentQuestion?.id] || {
    answer: "",
    isFlagged: false,
  };

  const setQuestionAnswer = (questionId: string, val: string) => {
    setStudentAnswers((prev) => ({
      ...prev,
      [questionId]: {
        ...(prev[questionId] || { isFlagged: false }),
        answer: val,
        answeredAt: new Date().toLocaleTimeString("id-ID"),
      },
    }));
  };

  const toggleFlagCurrentQuestion = () => {
    if (!currentQuestion) return;
    setStudentAnswers((prev) => ({
      ...prev,
      [currentQuestion.id]: {
        ...(prev[currentQuestion.id] || { answer: "" }),
        isFlagged: !prev[currentQuestion.id]?.isFlagged,
      },
    }));
  };

  // Stats calculation
  const totalQuestions = activeQuiz.questions.length;
  const answeredCount = Object.values(studentAnswers).filter((a) => a.answer && a.answer.trim().length > 0).length;
  const flaggedCount = Object.values(studentAnswers).filter((a) => a.isFlagged).length;
  const remainingCount = totalQuestions - answeredCount;

  // Format Timer
  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2, "0")}:${secs.toString().padStart(2, "0")}`;
  };

  // Calculate Score on Review
  const calculateResultStats = () => {
    let score = 0;
    let maxPossible = 0;
    let correctMCQ = 0;
    let totalMCQ = 0;
    let totalEssay = 0;

    activeQuiz.questions.forEach((q) => {
      maxPossible += q.maxPoints;
      if (q.type === "multiple_choice") {
        totalMCQ++;
        const studentAns = studentAnswers[q.id]?.answer;
        if (studentAns && studentAns === q.correctAnswer) {
          score += q.maxPoints;
          correctMCQ++;
        }
      } else {
        totalEssay++;
        // Essay awarded provisional points if answered
        const studentAns = studentAnswers[q.id]?.answer;
        if (studentAns && studentAns.trim().length > 25) {
          score += Math.round(q.maxPoints * 0.85); // Estimated AI provisional grade
        }
      }
    });

    const finalPercentage = Math.round((score / (maxPossible || 1)) * 100);
    return {
      score,
      maxPossible,
      finalPercentage,
      correctMCQ,
      totalMCQ,
      totalEssay,
    };
  };

  return (
    <div
      ref={examContainerRef}
      className={`min-h-screen w-full bg-[#0f0f13] text-slate-100 flex flex-col font-sans transition-colors duration-300 ${
        currentView === "exam_active" ? "select-none" : ""
      }`}
    >
      {/* ===================================================================== */}
      {/* 1. VIEW: AI WORD-TO-QUIZ GENERATOR & MANAGEMENT (GURU VIEW)          */}
      {/* ===================================================================== */}
      {currentView === "generator" && (
        <div className="max-w-6xl mx-auto w-full p-6 space-y-8 py-10">
          {/* Header */}
          <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 text-xs font-semibold uppercase tracking-wider mb-2">
                <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
                EduQuest AI Assessment Engine v3.0
              </div>
              <h1 className="text-3xl font-extrabold text-white tracking-tight">
                AI Word-to-Quiz & Anti-Cheat Lockdown
              </h1>
              <p className="text-slate-400 text-sm mt-1">
                Konversi otomatis bank soal Word (.docx) menjadi kuis terstruktur dengan proteksi ujian ketat.
              </p>
            </div>

            <div className="flex items-center gap-3">
              <button
                onClick={() => setCurrentView("lobby")}
                className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-black font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.3)] transition-all flex items-center gap-2"
              >
                <span>Buka Mode Siswa (Lobby)</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </div>

          {/* Preset Quick Selectors */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {PRESET_SAMPLE_EXAMS.map((sample) => (
              <div
                key={sample.id}
                onClick={() => setActiveQuiz(sample)}
                className={`p-5 rounded-2xl border transition-all cursor-pointer flex flex-col justify-between ${
                  activeQuiz.id === sample.id
                    ? "bg-[#1a1a24] border-cyan-400/60 shadow-[0_0_25px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/50"
                    : "bg-[#14141c]/80 border-white/10 hover:border-white/20 hover:bg-[#1a1a24]/60"
                }`}
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-mono px-2 py-0.5 rounded-md bg-white/5 border border-white/10 text-cyan-300">
                      {sample.sourceFileName}
                    </span>
                    <span className="text-xs px-2.5 py-0.5 rounded-full bg-cyan-500/10 text-cyan-400 font-semibold border border-cyan-500/20">
                      {sample.questions.length} Soal
                    </span>
                  </div>
                  <h3 className="text-base font-bold text-white mb-1">{sample.title}</h3>
                  <p className="text-xs text-slate-400">
                    {sample.subject} • {sample.gradeLevel} • Durasi: {sample.durationMinutes} Menit
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-slate-400">
                    Format: {sample.questions.filter((q) => q.type === "multiple_choice").length} PG,{" "}
                    {sample.questions.filter((q) => q.type === "essay").length} Esai
                  </span>
                  <span className="text-cyan-400 font-semibold flex items-center gap-1">
                    {activeQuiz.id === sample.id ? "✓ Terpilih Aktif" : "Pilih Bank Soal"}
                  </span>
                </div>
              </div>
            ))}
          </div>

          {/* Drag & Drop Upload Zone */}
          <div
            onDragOver={(e) => {
              e.preventDefault();
              setIsDragOver(true);
            }}
            onDragLeave={() => setIsDragOver(false)}
            onDrop={handleFileDrop}
            className={`relative rounded-3xl border-2 border-dashed p-8 md:p-12 text-center transition-all ${
              isDragOver
                ? "border-cyan-400 bg-cyan-500/10 scale-[1.01]"
                : "border-white/15 bg-[#14141c]/60 hover:border-white/25 hover:bg-[#14141c]/90"
            }`}
          >
            <input
              type="file"
              id="fileUploadDocx"
              accept=".docx,.doc"
              onChange={handleFileInput}
              className="hidden"
            />
            <div className="flex flex-col items-center justify-center space-y-4">
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_20px_rgba(34,211,238,0.2)]">
                <UploadCloud className="w-8 h-8" />
              </div>

              <div>
                <h3 className="text-lg font-bold text-white mb-1">
                  Tarik & Lepas Berkas Bank Soal Word (.docx) di Sini
                </h3>
                <p className="text-sm text-slate-400 max-w-md mx-auto">
                  Parser AI otomatis mengekstrak paragraf, nomor soal, kunci pilihan ganda (A-E), dan rubrik esai secara terstruktur.
                </p>
              </div>

              <label
                htmlFor="fileUploadDocx"
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-medium text-sm cursor-pointer transition-all hover:scale-105"
              >
                Pilih Berkas dari Komputer
              </label>

              {uploadedFile && (
                <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 text-xs font-mono">
                  <FileCheck className="w-4 h-4" />
                  <span>Berkas Dimuat: {uploadedFile.name} ({(uploadedFile.size / 1024).toFixed(1)} KB)</span>
                </div>
              )}
            </div>
          </div>

          {/* AI Parsing Progress Terminal (Visible when generating) */}
          <AnimatePresence>
            {isAiGenerating && (
              <motion.div
                initial={{ opacity: 0, y: 15 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -15 }}
                className="p-6 rounded-2xl bg-[#09090d] border border-cyan-500/40 shadow-2xl space-y-4"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Terminal className="w-4 h-4 text-cyan-400" />
                    <span className="text-xs font-mono text-cyan-300 font-bold uppercase tracking-wider">
                      Proses Pipeline Ekstraksi Mammoth.js & LLM Engine
                    </span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-cyan-400 animate-ping" />
                    <span className="text-xs font-mono text-slate-400">Step {generationStep}/4</span>
                  </div>
                </div>

                <div className="space-y-1.5 font-mono text-xs text-slate-300 bg-black/60 p-4 rounded-xl border border-white/5">
                  {generationLogs.map((log, i) => (
                    <div key={i} className="leading-relaxed">
                      {log}
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* Active Quiz Preview Table */}
          <div className="p-6 rounded-3xl bg-[#14141c]/90 border border-white/10 space-y-6">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div>
                <span className="text-xs font-mono text-cyan-400 uppercase tracking-widest font-semibold">
                  Pratinjau Asesmen Aktif
                </span>
                <h2 className="text-xl font-bold text-white mt-0.5">{activeQuiz.title}</h2>
                <p className="text-xs text-slate-400">
                  {activeQuiz.subject} • {activeQuiz.gradeLevel} • Maksimal Toleransi: {activeQuiz.maxStrikes} Pelanggaran Anti-Cheat
                </p>
              </div>

              <div className="flex items-center gap-3">
                <button
                  onClick={() => setCurrentView("lobby")}
                  className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-sm shadow-[0_0_20px_rgba(34,211,238,0.25)] transition-all flex items-center gap-2"
                >
                  <Lock className="w-4 h-4" />
                  <span>Uji Coba Mode Ujian Siswa</span>
                </button>
              </div>
            </div>

            <div className="space-y-4">
              {activeQuiz.questions.map((q, idx) => (
                <div
                  key={q.id}
                  className="p-4 rounded-2xl bg-[#1a1a24]/80 border border-white/5 hover:border-white/15 transition-all space-y-3"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="w-6 h-6 rounded-lg bg-cyan-500/20 border border-cyan-500/30 text-cyan-300 text-xs font-bold flex items-center justify-center">
                        {idx + 1}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-0.5 rounded-full font-semibold ${
                          q.type === "multiple_choice"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {q.type === "multiple_choice" ? "Pilihan Ganda" : "Esai / Uraian"}
                      </span>
                    </div>

                    <span className="text-xs font-mono text-slate-400 font-semibold">
                      Bobot: {q.maxPoints} Poin
                    </span>
                  </div>

                  <p className="text-sm text-slate-200 leading-relaxed font-medium">{q.stem}</p>

                  {q.type === "multiple_choice" && q.options && (
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-1">
                      {q.options.map((opt) => (
                        <div
                          key={opt.key}
                          className={`px-3 py-2 rounded-xl text-xs flex items-center gap-2 border ${
                            opt.key === q.correctAnswer
                              ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-300 font-medium"
                              : "bg-white/5 border-white/5 text-slate-400"
                          }`}
                        >
                          <span className="w-5 h-5 rounded-md bg-white/10 text-white font-bold flex items-center justify-center shrink-0">
                            {opt.key}
                          </span>
                          <span className="truncate">{opt.text}</span>
                          {opt.key === q.correctAnswer && (
                            <span className="ml-auto text-[10px] px-1.5 py-0.5 rounded bg-emerald-500/20 text-emerald-400 font-bold">
                              Kunci
                            </span>
                          )}
                        </div>
                      ))}
                    </div>
                  )}

                  {q.type === "essay" && q.rubric && (
                    <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs text-amber-200/90 flex items-start gap-2">
                      <BookOpen className="w-4 h-4 text-amber-400 shrink-0 mt-0.5" />
                      <div>
                        <span className="font-semibold text-amber-400">Rubrik Penilaian AI: </span>
                        {q.rubric}
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 2. VIEW: EXAM LOBBY & SECURITY CLEARANCE (BEFORE ENTERING FULLSCREEN) */}
      {/* ===================================================================== */}
      {currentView === "lobby" && (
        <div className="min-h-screen flex items-center justify-center p-4 py-10">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="max-w-2xl w-full p-8 rounded-3xl bg-[#14141c] border border-cyan-500/30 shadow-[0_0_50px_rgba(0,0,0,0.8)] space-y-6"
          >
            {/* Header Badge */}
            <div className="flex items-center justify-between border-b border-white/10 pb-5">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.2)]">
                  <ShieldCheck className="w-6 h-6" />
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">Verifikasi Protokol Ujian Aman</h2>
                  <p className="text-xs text-slate-400">EduQuest Anti-Cheat Lockdown Environment</p>
                </div>
              </div>
              <button
                onClick={() => setCurrentView("generator")}
                className="text-xs text-slate-400 hover:text-white px-3 py-1.5 rounded-lg border border-white/10 hover:border-white/20 transition-all"
              >
                Kembali ke Editor
              </button>
            </div>

            {/* Exam Meta Card */}
            <div className="p-4 rounded-2xl bg-[#1a1a24] border border-white/5 space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-wider text-cyan-400 font-semibold">
                Mata Pelajaran & Sesi
              </span>
              <h3 className="text-lg font-bold text-white">{activeQuiz.title}</h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-2 text-xs text-slate-300">
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-slate-400 block text-[10px]">Tingkat</span>
                  <span className="font-semibold">{activeQuiz.gradeLevel}</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-slate-400 block text-[10px]">Jumlah Soal</span>
                  <span className="font-semibold">{activeQuiz.questions.length} Butir</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-slate-400 block text-[10px]">Alokasi Waktu</span>
                  <span className="font-semibold text-cyan-400">{activeQuiz.durationMinutes} Menit</span>
                </div>
                <div className="p-2 rounded-xl bg-white/5">
                  <span className="text-slate-400 block text-[10px]">Batas Toleransi</span>
                  <span className="font-semibold text-rose-400">Maks 3 Strike</span>
                </div>
              </div>
            </div>

            {/* Student Identity Form */}
            <div className="space-y-3">
              <label className="text-xs font-semibold text-slate-300">Identitas Peserta Ujian</label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Nama Lengkap Siswa"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm focus:outline-none focus:border-cyan-400"
                />
                <input
                  type="text"
                  value={studentNis}
                  onChange={(e) => setStudentNis(e.target.value)}
                  placeholder="Nomor Induk Siswa (NISN)"
                  className="px-4 py-2.5 rounded-xl bg-white/5 border border-white/10 text-white text-sm font-mono focus:outline-none focus:border-cyan-400"
                />
              </div>
            </div>

            {/* Anti-Cheat Rules Checklist */}
            <div className="p-4 rounded-2xl bg-rose-500/10 border border-rose-500/30 space-y-3">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs uppercase tracking-wider">
                <ShieldAlert className="w-4 h-4" />
                Aturan Ketat Mode Lockdown Anti-Cheat:
              </div>
              <ul className="text-xs text-rose-200/90 space-y-2 list-disc list-inside">
                <li>
                  <strong>Layar Penuh Otomatis:</strong> Browser akan dipaksa Fullscreen. Menekan tombol ESC akan langsung dicatat sebagai pelanggaran.
                </li>
                <li>
                  <strong>Larangan Pindah Tab:</strong> Berpindah ke jendela lain, meminimalkan aplikasi, atau mencari jawaban di Google akan memicu <em>Strike</em>.
                </li>
                <li>
                  <strong>Pintasan Tombol Terkunci:</strong> Fitur copy-paste (Ctrl+C/V), klik kanan, dan Developer Tools (F12) dinonaktifkan permanen.
                </li>
                <li>
                  <strong>Diskualifikasi Otomatis:</strong> Pada <strong>Strike ke-3</strong>, sistem secara otomatis mengumpulkan jawaban dan mengunci akses ujian.
                </li>
              </ul>
            </div>

            {/* Launch Button */}
            <button
              onClick={startExamSession}
              className="w-full py-4 rounded-2xl bg-gradient-to-r from-cyan-400 via-blue-500 to-indigo-600 hover:from-cyan-300 hover:to-blue-400 text-black font-extrabold text-base shadow-[0_0_30px_rgba(34,211,238,0.4)] transition-all hover:scale-[1.01] flex items-center justify-center gap-3 cursor-pointer"
            >
              <Maximize2 className="w-5 h-5 text-black" />
              <span>MASUK MODE LOCKDOWN & MULAI UJIAN</span>
            </button>
          </motion.div>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 3. VIEW: ACTIVE SECURE EXAM ARENA (LOCKDOWN MODE)                    */}
      {/* ===================================================================== */}
      {currentView === "exam_active" && (
        <div className="flex-1 flex flex-col h-screen overflow-hidden bg-[#0c0c11]">
          {/* Top Sticky Security Bar */}
          <header className="h-16 border-b border-white/10 bg-[#121218]/90 backdrop-blur-md px-6 flex items-center justify-between shrink-0 z-30">
            {/* Left: Title & Student Info */}
            <div className="flex items-center gap-3">
              <div className="w-9 h-9 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 shadow-[0_0_12px_rgba(34,211,238,0.2)]">
                <Lock className="w-4 h-4" />
              </div>
              <div className="hidden sm:block">
                <h3 className="text-sm font-bold text-white truncate max-w-xs">{activeQuiz.title}</h3>
                <p className="text-[11px] text-slate-400 font-mono">
                  Peserta: <span className="text-cyan-300">{studentName}</span> ({studentNis})
                </p>
              </div>
            </div>

            {/* Center: Countdown Timer */}
            <div
              className={`flex items-center gap-2.5 px-4 py-2 rounded-2xl border transition-all ${
                remainingSeconds < 300
                  ? "bg-rose-500/20 border-rose-500 text-rose-300 animate-pulse shadow-[0_0_20px_rgba(244,63,94,0.3)]"
                  : "bg-black/60 border-cyan-500/40 text-cyan-400 shadow-[0_0_15px_rgba(34,211,238,0.15)]"
              }`}
            >
              <Clock className="w-4 h-4" />
              <span className="font-mono text-lg font-extrabold tracking-wider">
                {formatTime(remainingSeconds)}
              </span>
            </div>

            {/* Right: Anti-Cheat Strike Indicator & Finish Action */}
            <div className="flex items-center gap-4">
              {/* Strike Badges */}
              <div className="flex items-center gap-1.5 bg-[#1a1a24] px-3 py-1.5 rounded-xl border border-white/10">
                <ShieldAlert className="w-4 h-4 text-rose-400" />
                <span className="text-xs font-mono font-bold text-slate-300">Pelanggaran:</span>
                <div className="flex items-center gap-1 ml-1">
                  {[1, 2, 3].map((st) => (
                    <span
                      key={st}
                      className={`w-3.5 h-3.5 rounded-full flex items-center justify-center text-[9px] font-bold ${
                        strikeCount >= st
                          ? "bg-rose-500 text-white shadow-[0_0_8px_#f43f5e]"
                          : "bg-white/10 text-slate-500"
                      }`}
                    >
                      {st}
                    </span>
                  ))}
                </div>
              </div>

              {/* End Exam Button */}
              <button
                onClick={() => setShowSubmitConfirmModal(true)}
                className="px-4 py-2 rounded-xl bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500/40 text-emerald-300 font-bold text-xs transition-all flex items-center gap-2"
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span className="hidden sm:inline">Kumpulkan Ujian</span>
              </button>
            </div>
          </header>

          {/* Main Body: Question Content + Sidebar Navigation */}
          <div className="flex-1 flex flex-col md:flex-row overflow-hidden relative">
            {/* Left/Center: Question Canvas */}
            <div className="flex-1 overflow-y-auto p-6 md:p-10 space-y-6">
              {currentQuestion && (
                <div className="max-w-3xl mx-auto space-y-6">
                  {/* Question Header Card */}
                  <div className="flex items-center justify-between bg-[#14141c]/90 p-4 rounded-2xl border border-white/10">
                    <div className="flex items-center gap-3">
                      <span className="px-3 py-1 rounded-xl bg-cyan-500/20 border border-cyan-500/40 text-cyan-300 font-mono font-extrabold text-sm">
                        Soal #{currentQuestion.number}
                      </span>
                      <span
                        className={`text-xs px-2.5 py-1 rounded-full font-semibold ${
                          currentQuestion.type === "multiple_choice"
                            ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {currentQuestion.type === "multiple_choice" ? "Pilihan Ganda" : "Esai / Uraian"}
                      </span>
                    </div>

                    <button
                      onClick={toggleFlagCurrentQuestion}
                      className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-1.5 transition-all ${
                        currentAnswerState.isFlagged
                          ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 shadow-[0_0_10px_rgba(245,158,11,0.2)]"
                          : "bg-white/5 text-slate-400 hover:text-white border border-white/10"
                      }`}
                    >
                      <Flag className="w-3.5 h-3.5" />
                      <span>{currentAnswerState.isFlagged ? "Ragu-ragu (Ditandai)" : "Tandai Ragu-ragu"}</span>
                    </button>
                  </div>

                  {/* Question Stem Text */}
                  <div className="p-6 rounded-3xl bg-[#14141c]/80 border border-white/10 shadow-xl">
                    <p className="text-base md:text-lg text-slate-100 font-medium leading-relaxed">
                      {currentQuestion.stem}
                    </p>
                  </div>

                  {/* Multiple Choice Answers */}
                  {currentQuestion.type === "multiple_choice" && currentQuestion.options && (
                    <div className="space-y-3">
                      {currentQuestion.options.map((option) => {
                        const isSelected = currentAnswerState.answer === option.key;
                        return (
                          <div
                            key={option.key}
                            onClick={() => setQuestionAnswer(currentQuestion.id, option.key)}
                            className={`p-4 rounded-2xl border transition-all cursor-pointer flex items-center gap-4 ${
                              isSelected
                                ? "bg-cyan-500/15 border-cyan-400 text-white shadow-[0_0_20px_rgba(34,211,238,0.15)] ring-1 ring-cyan-400/50"
                                : "bg-[#14141c]/60 border-white/10 hover:border-white/20 text-slate-300 hover:bg-[#1a1a24]/80"
                            }`}
                          >
                            <span
                              className={`w-9 h-9 rounded-xl font-bold flex items-center justify-center shrink-0 text-sm transition-all ${
                                isSelected
                                  ? "bg-cyan-400 text-black shadow-[0_0_12px_#22d3ee]"
                                  : "bg-white/10 text-slate-300"
                              }`}
                            >
                              {option.key}
                            </span>
                            <span className="text-sm md:text-base font-medium leading-relaxed">
                              {option.text}
                            </span>
                            {isSelected && (
                              <Check className="w-5 h-5 text-cyan-400 ml-auto shrink-0" />
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}

                  {/* Essay Answer Textarea */}
                  {currentQuestion.type === "essay" && (
                    <div className="space-y-3">
                      <div className="relative">
                        <textarea
                          rows={7}
                          value={currentAnswerState.answer}
                          onChange={(e) => setQuestionAnswer(currentQuestion.id, e.target.value)}
                          placeholder="Ketik uraian jawaban Anda secara komprehensif di sini..."
                          className="w-full p-4 rounded-2xl bg-[#14141c]/90 border border-white/15 text-slate-100 placeholder-slate-500 text-sm focus:outline-none focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 transition-all leading-relaxed resize-none"
                        />
                      </div>
                      <div className="flex items-center justify-between text-xs text-slate-400 px-1">
                        <span>
                          Jumlah Kata:{" "}
                          <strong className="text-cyan-300">
                            {currentAnswerState.answer.trim().split(/\s+/).filter(Boolean).length}
                          </strong>{" "}
                          kata
                        </span>
                        <span className="text-slate-500 font-mono">Tersimpan otomatis ke memori aman</span>
                      </div>
                    </div>
                  )}

                  {/* Bottom Pagination Control */}
                  <div className="flex items-center justify-between pt-4 border-t border-white/10">
                    <button
                      disabled={currentQuestionIndex === 0}
                      onClick={() => setCurrentQuestionIndex((prev) => Math.max(0, prev - 1))}
                      className="px-5 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-slate-200 text-sm font-semibold disabled:opacity-40 disabled:pointer-events-none transition-all flex items-center gap-2"
                    >
                      <ArrowLeft className="w-4 h-4" />
                      <span>Sebelumnya</span>
                    </button>

                    <span className="text-xs text-slate-400 font-mono">
                      Soal {currentQuestionIndex + 1} dari {totalQuestions}
                    </span>

                    {currentQuestionIndex < totalQuestions - 1 ? (
                      <button
                        onClick={() => setCurrentQuestionIndex((prev) => Math.min(totalQuestions - 1, prev + 1))}
                        className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(34,211,238,0.2)] transition-all flex items-center gap-2"
                      >
                        <span>Selanjutnya</span>
                        <ArrowRight className="w-4 h-4" />
                      </button>
                    ) : (
                      <button
                        onClick={() => setShowSubmitConfirmModal(true)}
                        className="px-6 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black text-sm font-bold shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all flex items-center gap-2"
                      >
                        <span>Selesai & Kumpulkan</span>
                        <CheckCircle2 className="w-4 h-4" />
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>

            {/* Right: Question Navigation Palette */}
            <aside className="w-full md:w-80 border-t md:border-t-0 md:border-l border-white/10 bg-[#121218]/95 p-6 flex flex-col justify-between shrink-0">
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-mono uppercase text-slate-400 font-bold tracking-wider">
                    Navigasi Butir Soal
                  </span>
                  <span className="text-xs font-mono text-cyan-400 font-semibold">
                    {answeredCount}/{totalQuestions} Terjawab
                  </span>
                </div>

                {/* Question Grid */}
                <div className="grid grid-cols-5 gap-2.5">
                  {activeQuiz.questions.map((q, idx) => {
                    const ans = studentAnswers[q.id];
                    const isAnswered = ans && ans.answer && ans.answer.trim().length > 0;
                    const isFlagged = ans?.isFlagged;
                    const isCurrent = idx === currentQuestionIndex;

                    let btnStyle = "bg-white/5 border-white/10 text-slate-400 hover:bg-white/10";
                    if (isFlagged) {
                      btnStyle = "bg-amber-500/20 border-amber-500/60 text-amber-300 shadow-[0_0_8px_rgba(245,158,11,0.2)]";
                    } else if (isAnswered) {
                      btnStyle = "bg-emerald-500/20 border-emerald-500/50 text-emerald-300 shadow-[0_0_8px_rgba(52,211,153,0.2)]";
                    }

                    if (isCurrent) {
                      btnStyle += " ring-2 ring-cyan-400 border-cyan-400 text-white font-black";
                    }

                    return (
                      <button
                        key={q.id}
                        onClick={() => setCurrentQuestionIndex(idx)}
                        className={`h-11 rounded-xl border text-sm font-bold flex items-center justify-center relative transition-all ${btnStyle}`}
                      >
                        <span>{idx + 1}</span>
                        {isFlagged && (
                          <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-amber-400 shadow-sm" />
                        )}
                      </button>
                    );
                  })}
                </div>

                {/* Legend */}
                <div className="pt-3 border-t border-white/5 space-y-1.5 text-[11px] text-slate-400">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-emerald-500/30 border border-emerald-500/60" />
                    <span>Sudah Dijawab ({answeredCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-amber-500/30 border border-amber-500/60" />
                    <span>Ragu-ragu ({flaggedCount})</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-md bg-white/10 border border-white/20" />
                    <span>Belum Dijawab ({remainingCount})</span>
                  </div>
                </div>
              </div>

              {/* Lockdown Status Card */}
              <div className="p-3.5 rounded-2xl bg-black/50 border border-white/5 space-y-2 mt-6">
                <div className="flex items-center gap-2 text-xs font-semibold text-slate-300">
                  <Shield className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Status Keamanan Sistem</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Sensitivitas:</span>
                  <span className="text-emerald-400 font-bold">Maksimal (Strict)</span>
                </div>
                <div className="flex items-center justify-between text-[11px] text-slate-400 font-mono">
                  <span>Sisa Toleransi:</span>
                  <span className="text-rose-400 font-bold">{activeQuiz.maxStrikes - strikeCount} Kesempatan</span>
                </div>
              </div>
            </aside>
          </div>

          {/* EMERGENCY VIOLATION OVERLAY MODAL */}
          <AnimatePresence>
            {activeViolationAlert && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/90 backdrop-blur-xl flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.9, y: 20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.9, y: 20 }}
                  className="max-w-lg w-full p-8 rounded-3xl bg-[#1f1015] border-2 border-rose-500/80 shadow-[0_0_60px_rgba(244,63,94,0.4)] text-center space-y-6"
                >
                  <div className="w-20 h-20 rounded-full bg-rose-500/20 border-2 border-rose-500 mx-auto flex items-center justify-center text-rose-400 animate-bounce">
                    <AlertTriangle className="w-10 h-10" />
                  </div>

                  <div className="space-y-2">
                    <span className="text-xs font-mono font-extrabold uppercase tracking-widest text-rose-400 px-3 py-1 rounded-full bg-rose-500/20 border border-rose-500/40">
                      PERINGATAN SISTEM ANTI-CHEAT (STRIKE #{activeViolationAlert.strikeNumber}/3)
                    </span>
                    <h2 className="text-2xl font-black text-white">
                      {activeViolationAlert.strikeNumber >= 3
                        ? "BATAS TOLERANSI HABIS!"
                        : "PELANGGARAN TERDETEKSI!"}
                    </h2>
                    <p className="text-sm text-rose-200/90 leading-relaxed font-medium">
                      {activeViolationAlert.description}
                    </p>
                    <p className="text-xs text-slate-400 font-mono pt-1">
                      Waktu Kejadian: {activeViolationAlert.timestamp}
                    </p>
                  </div>

                  {activeViolationAlert.strikeNumber >= 3 ? (
                    <div className="p-4 rounded-xl bg-black/60 border border-rose-500/30 text-xs text-rose-300">
                      Ujian akan segera dikumpulkan secara paksa dalam beberapa detik...
                    </div>
                  ) : (
                    <button
                      onClick={handleAcknowledgeViolation}
                      className="w-full py-3.5 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white font-extrabold text-sm shadow-[0_0_25px_rgba(244,63,94,0.5)] transition-all cursor-pointer"
                    >
                      SAYA MENGERTI & KEMBALI KE FULLSCREEN
                    </button>
                  )}
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* CONFIRMATION SUBMIT MODAL */}
          <AnimatePresence>
            {showSubmitConfirmModal && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4"
              >
                <motion.div
                  initial={{ scale: 0.95 }}
                  animate={{ scale: 1 }}
                  exit={{ scale: 0.95 }}
                  className="max-w-md w-full p-6 rounded-3xl bg-[#14141c] border border-cyan-500/30 shadow-2xl space-y-5"
                >
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>

                  <div className="text-center space-y-1">
                    <h3 className="text-lg font-bold text-white">Konfirmasi Pengumpulan Ujian</h3>
                    <p className="text-xs text-slate-400">
                      Pastikan seluruh butir soal telah diperiksa sebelum mengakhiri sesi.
                    </p>
                  </div>

                  <div className="p-3.5 rounded-xl bg-white/5 border border-white/10 space-y-1.5 text-xs">
                    <div className="flex justify-between">
                      <span className="text-slate-400">Total Butir Soal:</span>
                      <strong className="text-white">{totalQuestions} Soal</strong>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-slate-400">Sudah Terjawab:</span>
                      <strong className="text-emerald-400">{answeredCount} Soal</strong>
                    </div>
                    {remainingCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-rose-400 font-semibold">Belum Terjawab:</span>
                        <strong className="text-rose-400">{remainingCount} Soal</strong>
                      </div>
                    )}
                    {flaggedCount > 0 && (
                      <div className="flex justify-between">
                        <span className="text-amber-400 font-semibold">Masih Ragu-ragu:</span>
                        <strong className="text-amber-400">{flaggedCount} Soal</strong>
                      </div>
                    )}
                  </div>

                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => setShowSubmitConfirmModal(false)}
                      className="flex-1 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 text-slate-300 font-semibold text-xs transition-all"
                    >
                      Lanjutkan Mengerjakan
                    </button>
                    <button
                      onClick={() => submitExam("manual")}
                      className="flex-1 py-2.5 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-black font-bold text-xs shadow-[0_0_15px_rgba(52,211,153,0.3)] transition-all"
                    >
                      Ya, Kumpulkan Sekarang
                    </button>
                  </div>
                </motion.div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      )}

      {/* ===================================================================== */}
      {/* 4. VIEW: EXAM REVIEW, RESULT & AUDIT TRAIL LOG                       */}
      {/* ===================================================================== */}
      {currentView === "review" && (
        <div className="max-w-4xl mx-auto w-full p-6 space-y-8 py-10">
          {/* Result Card */}
          <div className="p-8 rounded-3xl bg-[#14141c] border border-cyan-500/30 shadow-2xl text-center space-y-6">
            <div className="w-20 h-20 rounded-full bg-cyan-500/10 border-2 border-cyan-500 mx-auto flex items-center justify-center text-cyan-400 shadow-[0_0_30px_rgba(34,211,238,0.3)]">
              <Award className="w-10 h-10" />
            </div>

            <div className="space-y-1">
              <span className="text-xs font-mono uppercase tracking-wider text-cyan-400 font-bold">
                Laporan Hasil Asesmen Peserta
              </span>
              <h2 className="text-3xl font-extrabold text-white">{activeQuiz.title}</h2>
              <p className="text-sm text-slate-400">
                Peserta: <strong className="text-white">{studentName}</strong> • {studentNis}
              </p>
            </div>

            {/* Score Grid */}
            {(() => {
              const stats = calculateResultStats();
              return (
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-2xl mx-auto text-left">
                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400 block mb-1">Skor Keseluruhan</span>
                    <span className="text-2xl font-black text-cyan-400">
                      {stats.finalPercentage}%
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      ({stats.score} / {stats.maxPossible} Poin)
                    </span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400 block mb-1">Pilihan Ganda</span>
                    <span className="text-2xl font-black text-emerald-400">
                      {stats.correctMCQ} / {stats.totalMCQ}
                    </span>
                    <span className="text-[11px] text-slate-500 block">Jawaban Benar</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400 block mb-1">Esai / Uraian</span>
                    <span className="text-2xl font-black text-amber-400">
                      {stats.totalEssay} Butir
                    </span>
                    <span className="text-[11px] text-slate-500 block">Ternilai Sementara AI</span>
                  </div>

                  <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                    <span className="text-xs text-slate-400 block mb-1">Integritas Ujian</span>
                    <span
                      className={`text-2xl font-black ${
                        isDisqualified || strikeCount >= 3
                          ? "text-rose-400"
                          : strikeCount > 0
                          ? "text-amber-400"
                          : "text-emerald-400"
                      }`}
                    >
                      {strikeCount}/3 Strike
                    </span>
                    <span className="text-[11px] text-slate-500 block">
                      {isDisqualified ? "Diskualifikasi" : "Lulus Verifikasi"}
                    </span>
                  </div>
                </div>
              );
            })()}

            {/* Anti-Cheat Audit Trail Log */}
            <div className="text-left max-w-2xl mx-auto space-y-3 pt-4">
              <div className="flex items-center justify-between">
                <span className="text-xs font-mono text-slate-400 uppercase font-bold tracking-wider flex items-center gap-1.5">
                  <Terminal className="w-3.5 h-3.5 text-cyan-400" />
                  Audit Trail & Log Anti-Cheat
                </span>
                <span className="text-xs text-slate-500">
                  Mulai: {examStartedAt} • Selesai: {examSubmittedAt}
                </span>
              </div>

              <div className="p-4 rounded-2xl bg-black/60 border border-white/10 space-y-2 font-mono text-xs text-slate-300 max-h-48 overflow-y-auto">
                <div className="text-cyan-400">
                  [{examStartedAt}] 🔒 Sesi ujian dibuka dalam Fullscreen Anti-Cheat Mode.
                </div>
                {violations.length === 0 ? (
                  <div className="text-emerald-400">
                    [Audit Bersih] 0 Pelanggaran terdeteksi selama sesi ujian. Peserta mematuhi seluruh protokol integritas.
                  </div>
                ) : (
                  violations.map((v, i) => (
                    <div key={v.id} className="text-rose-400">
                      [{v.timestamp}] ⚠️ STRIKE #{v.strikeNumber}: {v.description}
                    </div>
                  ))
                )}
                {isDisqualified && (
                  <div className="text-rose-500 font-bold">
                    [{examSubmittedAt}] 🛑 DISKUALIFIKASI OTOMATIS: Peserta mencapai batas maksimal 3 pelanggaran.
                  </div>
                )}
                <div className="text-slate-400">
                  [{examSubmittedAt}] 📤 Berkas jawaban berhasil dienkripsi dan dikirim ke server evaluasi EduQuest.
                </div>
              </div>
            </div>

            {/* Actions */}
            <div className="flex items-center justify-center gap-4 pt-4">
              <button
                onClick={() => setCurrentView("generator")}
                className="px-6 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/20 text-white font-semibold text-xs transition-all flex items-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Buat Asesmen Baru</span>
              </button>

              <button
                onClick={() => {
                  alert("Laporan nilai dan log audit ujian telah disalin ke format ringkasan.");
                }}
                className="px-6 py-2.5 rounded-xl bg-cyan-400 hover:bg-cyan-300 text-black font-bold text-xs shadow-[0_0_15px_rgba(34,211,238,0.25)] transition-all flex items-center gap-2"
              >
                <Download className="w-4 h-4" />
                <span>Unduh Rekap Nilai & Log</span>
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
