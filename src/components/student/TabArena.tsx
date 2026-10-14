"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  MEMORY_MATCH_CARDS,
  QUIZ_BANK_IPA_TERPADU,
  TICTACTOE_QUESTIONS,
  getQuizQuestionsBySubject,
} from "@/data/mockData";
import { CustomTeacherGame, GameQuestion } from "@/types";
import {
  Gamepad2,
  Clock,
  Camera,
  Play,
  RotateCw,
  Flame,
  Layers,
  Swords,
  Brain,
  Zap,
  Award,
  Shuffle,
  Box,
  BookOpen,
  Volume2,
  X,
  Sparkles,
  Eye,
  Palette,
  ArrowLeft,
} from "lucide-react";
import ARPhotobooth from "@/components/ARPhotobooth";
import ColorVisionGame from "@/components/ColorVisionGame";
import ColorMemoryGame from "@/components/ColorMemoryGame";
import Anatomy3D from "@/components/Anatomy3D";

interface ArModule {
  id: string;
  title: string;
  subject: string;
  level: string;
  desc: string;
  gradient: string;
  icon: React.ElementType;
  interactiveElements: string[];
}

export default function TabArena() {
  const { customGames, submitGameScore, theme } = useEduQuest();
  const isDark = theme === "dark";

  // Top level tab switcher: 'games' | 'ar' | 'photobooth'
  const [activeTab, setActiveTab] = useState<"games" | "ar" | "photobooth">("games");

  // Active full-screen/isolated game view: 'color-vision' | 'color-memory' | null
  const [activeGameView, setActiveGameView] = useState<string | null>(null);

  // Active game modal type
  const [activeCustomGame, setActiveCustomGame] = useState<CustomTeacherGame | null>(null);

  // Active AR Module Modal
  const [activeArModal, setActiveArModal] = useState<ArModule | null>(null);

  // Pre-Game / Pre-AR Selection Modal State
  const [activeModal, setActiveModal] = useState<any>(null);
  const [selectedLevel, setSelectedLevel] = useState<string>("MTs / SMP");
  const [selectedSubject, setSelectedSubject] = useState<string>("Matematika");

  // ==========================================================================
  // AR MODULES DATA
  // ==========================================================================
  const AR_MODULES: ArModule[] = [
    {
      id: "ar_geometri",
      title: "AR Bangun Ruang & Geometri",
      subject: "Matematika",
      level: "Jenjang: SD & MTs",
      desc: "Visualisasi 3D interaktif untuk rusuk, titik sudut, dan jaring-jaring kubus, balok, serta prisma.",
      gradient: "from-emerald-500 to-teal-700",
      icon: Box,
      interactiveElements: ["Kubus & Jaring-jaring 3D", "Balok & Titik Sudut", "Prisma Segitiga Interaktif"],
    },
    {
      id: "ar_folklore",
      title: "Diorama Cerita Rakyat 3D",
      subject: "Bahasa Indonesia",
      level: "Jenjang: SD",
      desc: "Proyeksikan latar dan tokoh cerita rakyat nusantara ke dunia nyata untuk memahami unsur intrinsik cerita.",
      gradient: "from-amber-500 to-orange-700",
      icon: BookOpen,
      interactiveElements: ["Karakter Tokoh Utama", "Diorama Latar Nusantara", "Alur Dongeng Interaktif"],
    },
    {
      id: "ar_vocab",
      title: "AR Interactive Vocabulary",
      subject: "Bahasa Inggris",
      level: "Jenjang: MTs",
      desc: "Scan ruanganmu untuk memunculkan objek 3D beserta pronounciation dan penggunaan grammar yang tepat.",
      gradient: "from-cyan-500 to-blue-700",
      icon: Volume2,
      interactiveElements: ["3D Living Room Objects", "Grammar Card Scanner", "Audio Pronunciation Practice"],
    },
    {
      id: "skull_anatomy_module",
      title: "Lab Anatomi 3D: Cranium & Tengkorak",
      subject: "Biologi & Kedokteran",
      level: "Jenjang: MTs / SMP",
      desc: "Simulasi 3D cranium interaktif: Raycast 6 tulang kranial utama, pemisahan sutura (exploded view), mode shading warna/ivory, rotasi inersia, dan kuis diagnostik.",
      gradient: "from-cyan-600 to-indigo-800",
      icon: Sparkles,
      interactiveElements: ["Raycast 6 Tulang Kranial", "Exploded Suture View", "Mode Shading & Kuis"],
    },
  ];

  // ==========================================================================
  // DYNAMIC QUESTION BANK (INDONESIAN CURRICULUM STANDARDS)
  // ==========================================================================
  const questionBank: Record<string, Record<string, { q: string; options: string[]; answer: string }[]>> = {
    "SD / MI": {
      "Matematika": [
        { q: "Berapa hasil dari 250 + 150 - 50?", options: ["350", "400", "300", "450"], answer: "350" },
        { q: "Sebuah persegi memiliki sisi 8 cm. Berapa luasnya?", options: ["64 cm²", "32 cm²", "16 cm²", "48 cm²"], answer: "64 cm²" }
      ],
      "Bahasa Indonesia": [
        { q: "Antonim dari kata 'Pemberani' adalah...", options: ["Pengecut", "Hebat", "Kuat", "Takut"], answer: "Pengecut" },
        { q: "Ide utama dalam sebuah paragraf disebut...", options: ["Gagasan Pokok", "Kesimpulan", "Kalimat Penjelas", "Judul"], answer: "Gagasan Pokok" }
      ],
      "Bahasa Inggris": [
        { q: "What is the English word for 'Apel'?", options: ["Apple", "Orange", "Banana", "Grape"], answer: "Apple" },
        { q: "Good morning in Indonesian means...", options: ["Selamat Pagi", "Selamat Malam", "Selamat Siang", "Sampai Jumpa"], answer: "Selamat Pagi" }
      ]
    },
    "MTs / SMP": {
      "Matematika": [
        { q: "Jika 2x + 5 = 15, berapakah nilai x?", options: ["5", "10", "15", "20"], answer: "5" },
        { q: "Sebuah segitiga siku-siku memiliki alas 6 cm dan tinggi 8 cm. Berapa sisi miringnya?", options: ["10 cm", "12 cm", "14 cm", "100 cm"], answer: "10 cm" }
      ],
      "Bahasa Indonesia": [
        { q: "Majas yang melebih-lebihkan sesuatu disebut...", options: ["Hiperbola", "Personifikasi", "Metafora", "Ironi"], answer: "Hiperbola" },
        { q: "Teks yang berisi langkah-langkah melakukan sesuatu disebut...", options: ["Teks Prosedur", "Teks Deskripsi", "Teks Narasi", "Teks Eksposisi"], answer: "Teks Prosedur" }
      ],
      "Bahasa Inggris": [
        { q: "Subject-Verb Agreement: 'Neither of the students ... arrived yet.'", options: ["has", "have", "were", "are"], answer: "has" },
        { q: "Past tense of 'Go' is...", options: ["Went", "Gone", "Going", "Goes"], answer: "Went" }
      ]
    }
  };

  // ==========================================================================
  // DISTINCT GAME CARDS DATA
  // ==========================================================================
  const GAME_CARDS = [
    {
      id: "kuis_realtime",
      title: "Kuis Real-Time (Live Battle)",
      desc: "Pertarungan kuis kilat 4 bentuk geometris, combo EXP, dan papan peringkat santri langsung.",
      gradient: "from-indigo-500 to-purple-600",
      badge: "🔥 Live Battle",
      icon: Flame,
      templateType: "Kuis Real-Time" as const,
    },
    {
      id: "memory_match",
      title: "Memory Match (Logika Visual)",
      desc: "Buka dan cocokkan 6 pasang kartu konsep sains, tajwid, dan kosakata sebelum langkah belajarmu habis.",
      gradient: "from-cyan-600 to-teal-700",
      badge: "🃏 Logika Visual",
      icon: Brain,
      templateType: "Memory Match" as const,
    },
    {
      id: "tictactoe_trivia",
      title: "Tic-Tac-Toe Trivia",
      desc: "Kuasai petak 3x3 dengan menjawab trivia mapel. Klaim baris, kolom, atau diagonal melawan AI!",
      gradient: "from-amber-500 to-rose-600",
      badge: "⚔️ Duel 1v1",
      icon: Swords,
      templateType: "Duel Interaktif" as const,
    },
    {
      id: "color_vision",
      title: "Color Vision (Kuku Kube)",
      desc: "Uji persepsi visual dan ketajaman mata mendeteksi kotak dengan warna berbeda sebelum waktu habis!",
      gradient: "from-fuchsia-600 to-pink-600",
      badge: "👁️ Persepsi Visual",
      icon: Eye,
      templateType: "Color Vision" as const,
      isArcade: true,
    },
    {
      id: "color_memory",
      title: "Color Memory Match",
      desc: "Ingat warna target selama 5 detik, lalu racik kembali kombinasi Hue, Saturation, dan Lightness hingga akurat!",
      gradient: "from-purple-600 via-pink-600 to-rose-500",
      badge: "🧠 Memori Visual",
      icon: Palette,
      templateType: "Color Memory" as const,
      isArcade: true,
    },
  ];

  // ==========================================================================
  // 1. GAME TYPE A: KUIS REAL-TIME (KAHOOT STYLE)
  // ==========================================================================
  const [realtimeQuestionIndex, setRealtimeQuestionIndex] = useState(0);
  const [realtimeTimer, setRealtimeTimer] = useState(15);
  const [realtimeSelected, setRealtimeSelected] = useState<number | null>(null);
  const [realtimeScore, setRealtimeScore] = useState(0);
  const [comboMultiplier, setComboMultiplier] = useState(1);
  const [realtimeFinished, setRealtimeFinished] = useState(false);
  const [liveLeaderboard, setLiveLeaderboard] = useState([
    { name: "Raditya Pratama (Kamu)", score: 0, avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80" },
    { name: "Aurelia Putri", score: 850, avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80" },
    { name: "Muhammad Fikri", score: 720, avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80" },
    { name: "Chelsea Olivia", score: 640, avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80" },
    { name: "Zaidan Al-Farisi", score: 510, avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80" },
  ]);

  useEffect(() => {
    let timer: any;
    if (activeCustomGame?.templateType === "Kuis Real-Time" && !realtimeFinished && realtimeSelected === null) {
      if (realtimeTimer > 0) {
        timer = setTimeout(() => setRealtimeTimer((prev) => prev - 1), 1000);
      } else {
        handleSelectRealtimeAnswer(-1);
      }
    }
    return () => clearTimeout(timer);
  }, [activeCustomGame, realtimeTimer, realtimeFinished, realtimeSelected]);

  const handleSelectRealtimeAnswer = (idx: number) => {
    if (realtimeSelected !== null || !activeCustomGame) return;
    setRealtimeSelected(idx);

    const currQ = activeCustomGame.questions[realtimeQuestionIndex];
    const isCorrect = idx === currQ?.correctAnswerIndex;

    if (isCorrect) {
      const addedPoints = 100 * comboMultiplier + realtimeTimer * 5;
      const newScore = realtimeScore + addedPoints;
      setRealtimeScore(newScore);
      setComboMultiplier((prev) => Math.min(prev + 1, 4));

      setLiveLeaderboard((prev) =>
        prev
          .map((item, i) => (i === 0 ? { ...item, score: newScore } : { ...item, score: item.score + Math.floor(Math.random() * 50) }))
          .sort((a, b) => b.score - a.score)
      );
    } else {
      setComboMultiplier(1);
    }
  };

  const handleNextRealtimeQuestion = () => {
    if (!activeCustomGame) return;
    if (realtimeQuestionIndex + 1 < activeCustomGame.questions.length) {
      setRealtimeQuestionIndex((prev) => prev + 1);
      setRealtimeTimer(15);
      setRealtimeSelected(null);
    } else {
      setRealtimeFinished(true);
      submitGameScore(activeCustomGame.id, realtimeScore, activeCustomGame.rewardExp, activeCustomGame.rewardCoins);
    }
  };

  // ==========================================================================
  // 2. GAME TYPE B: MEMORY MATCH (12 KARTU)
  // ==========================================================================
  const [memoryMoves, setMemoryMoves] = useState(0);
  const [shuffledCards, setShuffledCards] = useState<typeof MEMORY_MATCH_CARDS>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedCardIds, setMatchedCardIds] = useState<number[]>([]);
  const [memoryFinished, setMemoryFinished] = useState(false);

  const initMemoryGame = () => {
    const doubleCards = [...MEMORY_MATCH_CARDS].sort(() => Math.random() - 0.5);
    setShuffledCards(doubleCards);
    setFlippedCards([]);
    setMatchedCardIds([]);
    setMemoryMoves(0);
    setMemoryFinished(false);
  };

  const handleFlipCard = (cardId: number) => {
    if (flippedCards.length === 2 || flippedCards.includes(cardId) || matchedCardIds.includes(cardId)) {
      return;
    }

    const newFlipped = [...flippedCards, cardId];
    setFlippedCards(newFlipped);

    if (newFlipped.length === 2) {
      setMemoryMoves((prev) => prev + 1);
      const firstCard = shuffledCards.find((c) => c.id === newFlipped[0]);
      const secondCard = shuffledCards.find((c) => c.id === newFlipped[1]);

      if (firstCard && secondCard && firstCard.pairId === secondCard.pairId) {
        setMatchedCardIds((prev) => {
          const nextMatched = [...prev, firstCard.id, secondCard.id];
          if (nextMatched.length === shuffledCards.length) {
            setMemoryFinished(true);
            if (activeCustomGame) {
              submitGameScore(activeCustomGame.id, 500, activeCustomGame.rewardExp, activeCustomGame.rewardCoins);
            }
          }
          return nextMatched;
        });
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  // ==========================================================================
  // 3. GAME TYPE C: DUEL INTERAKTIF (TIC-TAC-TOE 1V1)
  // ==========================================================================
  const [board, setBoard] = useState<(string | null)[]>(Array(9).fill(null));
  const [turn, setTurn] = useState<"X" | "O">("X");
  const [duelWinner, setDuelWinner] = useState<string | null>(null);
  const [activeDuelQuestion, setActiveDuelQuestion] = useState<GameQuestion | null>(null);
  const [activeCellForQuestion, setActiveCellForQuestion] = useState<number | null>(null);
  const [duelSelectedOption, setDuelSelectedOption] = useState<number | null>(null);

  const checkWinner = (squares: (string | null)[]) => {
    const lines = [
      [0, 1, 2], [3, 4, 5], [6, 7, 8],
      [0, 3, 6], [1, 4, 7], [2, 5, 8],
      [0, 4, 8], [2, 4, 6],
    ];
    for (const [a, b, c] of lines) {
      if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
        return squares[a];
      }
    }
    if (squares.every((sq) => sq !== null)) return "draw";
    return null;
  };

  const resetDuelGame = () => {
    setBoard(Array(9).fill(null));
    setTurn("X");
    setDuelWinner(null);
    setActiveDuelQuestion(null);
    setActiveCellForQuestion(null);
    setDuelSelectedOption(null);
  };

  const handleCellClick = (cellIndex: number) => {
    if (board[cellIndex] !== null || duelWinner !== null) return;
    const q = TICTACTOE_QUESTIONS[cellIndex % TICTACTOE_QUESTIONS.length];
    setActiveDuelQuestion(q);
    setActiveCellForQuestion(cellIndex);
    setDuelSelectedOption(null);
  };

  const handleAnswerDuelQuestion = (optIndex: number) => {
    if (!activeDuelQuestion || activeCellForQuestion === null || duelSelectedOption !== null) return;
    setDuelSelectedOption(optIndex);

    const isCorrect = optIndex === activeDuelQuestion.correctAnswerIndex;

    setTimeout(() => {
      if (isCorrect) {
        const nextBoard = [...board];
        nextBoard[activeCellForQuestion] = "X";
        setBoard(nextBoard);

        const win = checkWinner(nextBoard);
        if (win) {
          setDuelWinner(win === "X" ? "player" : "draw");
        } else {
          setTurn("O");
          setTimeout(() => runAiTurn(nextBoard), 600);
        }
      } else {
        const nextBoard = [...board];
        nextBoard[activeCellForQuestion] = "O";
        setBoard(nextBoard);

        const win = checkWinner(nextBoard);
        if (win) {
          setDuelWinner(win === "O" ? "ai" : "draw");
        } else {
          setTurn("X");
        }
      }
      setActiveDuelQuestion(null);
      setActiveCellForQuestion(null);
      setDuelSelectedOption(null);
    }, 900);
  };

  const runAiTurn = (currentBoard: (string | null)[]) => {
    const emptyIndices = currentBoard.map((val, idx) => (val === null ? idx : null)).filter((val) => val !== null) as number[];
    if (emptyIndices.length === 0) return;

    const randomPick = emptyIndices[Math.floor(Math.random() * emptyIndices.length)];
    const nextBoard = [...currentBoard];
    nextBoard[randomPick] = "O";
    setBoard(nextBoard);

    const win = checkWinner(nextBoard);
    if (win) {
      setDuelWinner(win === "O" ? "ai" : "draw");
    } else {
      setTurn("X");
    }
  };

  // ==========================================================================
  // 4. AR SIMULATION STATE
  // ==========================================================================
  const [arCameraActive, setArCameraActive] = useState(false);
  const [selectedOrganelle, setSelectedOrganelle] = useState<string>("Kubus & Jaring-jaring 3D");
  const [rotationAngle, setRotationAngle] = useState(45);

  const handleLaunchGame = (
    templateType: "Kuis Real-Time" | "Memory Match" | "Duel Interaktif" | "Color Vision" | "Color Memory",
    level: string = "MTs / SMP",
    subject: string = "Matematika"
  ) => {
    if (templateType === "Color Vision") {
      setActiveGameView("color-vision");
      return;
    }

    if (templateType === "Color Memory") {
      setActiveGameView("color-memory");
      return;
    }

    // DYNAMIC QUESTION ROUTING & ACCURATE DATA (Indonesian Curriculum)
    const levelKey = level in questionBank ? level : "MTs / SMP";
    const subjectKey = subject in questionBank[levelKey] ? subject : "Matematika";
    const selectedBankQuestions = questionBank[levelKey]?.[subjectKey] || [];

    let questions: GameQuestion[] = [];
    if (selectedBankQuestions.length > 0) {
      questions = selectedBankQuestions.map((item, idx) => ({
        id: `q_${levelKey}_${subjectKey}_${idx}`,
        question: item.q,
        options: item.options,
        correctAnswerIndex:
          item.options.indexOf(item.answer) >= 0 ? item.options.indexOf(item.answer) : 0,
        explanation: `Jawaban benar: ${item.answer}`,
      }));
    } else {
      questions = getQuizQuestionsBySubject(subject, 10);
      if (questions.length === 0) questions = QUIZ_BANK_IPA_TERPADU;
    }

    const game: CustomTeacherGame = {
      id: `game_${templateType}_${levelKey}_${subjectKey}_${Date.now()}`,
      title: `${templateType} (${subjectKey})`,
      subject: subjectKey,
      templateType: templateType,
      creatorName: "Tim Guru SVA Dev",
      targetAudience: `Jenjang: ${levelKey}`,
      durationMinutes: 15,
      rewardCoins: 50,
      rewardExp: 150,
      endsInHours: 24,
      questions: questions,
      isPlayed: false,
    };

    setActiveCustomGame(game);
    if (templateType === "Kuis Real-Time") {
      setActiveGameView("live-quiz");
      setRealtimeQuestionIndex(0);
      setRealtimeTimer(15);
      setRealtimeSelected(null);
      setRealtimeScore(0);
      setComboMultiplier(1);
      setRealtimeFinished(false);
    } else if (templateType === "Memory Match") {
      initMemoryGame();
    } else if (templateType === "Duel Interaktif") {
      resetDuelGame();
    }
  };

  // =========================================================================
  // CONDITIONAL RENDERING: FULL-SCREEN GAME VIEW (COLOR VISION & COLOR MEMORY)
  // =========================================================================
  if (activeGameView === "color-vision") {
    return (
      <div className="w-full space-y-6 pb-20 md:pb-6">
        {/* Navigation Bar Back to Arena */}
        <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setActiveGameView(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&larr; Kembali ke Arena</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-[#0cc0df] text-xs font-bold">
            <Eye className="w-3.5 h-3.5" />
            <span>Color Vision (Kuku Kube)</span>
          </div>
        </div>

        {/* Mounted Active Game View Container */}
        <div className="w-full flex justify-center pt-2">
          <ColorVisionGame />
        </div>
      </div>
    );
  }

  if (activeGameView === "color-memory") {
    return (
      <div className="w-full space-y-6 pb-20 md:pb-6">
        {/* Navigation Bar Back to Arena */}
        <div className="flex items-center justify-between p-4 sm:p-5 rounded-2xl bg-slate-900/80 border border-white/10 backdrop-blur-xl shadow-xl">
          <button
            onClick={() => setActiveGameView(null)}
            className="inline-flex items-center gap-2 text-xs font-bold text-gray-300 hover:text-white px-4 py-2.5 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 transition-all cursor-pointer shadow-sm hover:scale-[1.02] active:scale-98"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>&larr; Kembali ke Arena</span>
          </button>

          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-fuchsia-500/15 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-bold">
            <Palette className="w-3.5 h-3.5" />
            <span>Color Memory Match (HSL)</span>
          </div>
        </div>

        {/* Mounted Active Game View Container */}
        <div className="w-full flex justify-center pt-2">
          <ColorMemoryGame />
        </div>
      </div>
    );
  }

  if (activeGameView === "skull-anatomy") {
    return (
      <div className="w-full space-y-6 pb-20 md:pb-6">
        <Anatomy3D onBack={() => setActiveGameView(null)} />
      </div>
    );
  }

  // =========================================================================
  // CONDITIONAL RENDERING: LIVE QUIZ GAME (KAHOOT STYLE) - RELATIVE EMBEDDED
  // =========================================================================
  if (activeCustomGame && activeCustomGame.templateType === "Kuis Real-Time") {
    return (
      <div className="w-full space-y-6 pb-20 md:pb-6 animate-fade-in">
        <div className="relative w-full min-h-[80vh] bg-[#0f0f13] border border-white/10 rounded-2xl overflow-hidden flex flex-col shadow-2xl">
          {/* Top Bar / Header */}
          <header className="w-full bg-[#14141b] border-b border-white/10 p-6 flex items-center justify-between shrink-0 shadow-lg">
            <div className="flex items-center gap-3">
              <span className="text-xs font-black px-3.5 py-1.5 rounded-lg bg-rose-600 text-white uppercase tracking-wider animate-pulse flex items-center gap-1.5 shadow-md shadow-rose-600/30">
                <Flame className="w-3.5 h-3.5" />
                <span>LIVE KAHOOT BATTLE</span>
              </span>
              <div className="hidden sm:block">
                <h3 className="font-extrabold text-base sm:text-lg text-white">
                  {activeCustomGame.title}
                </h3>
                <span className="text-xs text-slate-400">
                  {activeCustomGame.targetAudience} • Mata Pelajaran: {activeCustomGame.subject}
                </span>
              </div>
            </div>

            <button
              onClick={() => {
                setActiveCustomGame(null);
                setActiveGameView(null);
              }}
              className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/15 text-slate-200 hover:text-white text-xs font-bold transition-all cursor-pointer flex items-center gap-2 hover:scale-105 active:scale-95"
            >
              <span>✕ Keluar</span>
            </button>
          </header>

          {/* Quiz Body Area */}
          <div className="flex-1 w-full max-w-6xl mx-auto p-4 sm:p-8 overflow-y-auto flex flex-col justify-center">
            {!realtimeFinished ? (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start w-full">
                {/* Kahoot Main Arena (8 cols) */}
                <div className="lg:col-span-8 space-y-6">
                  {/* Top HUD: Timer & Multiplier */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 bg-slate-900/90 px-4 py-2 rounded-xl border border-slate-800">
                      <Clock className="w-4 h-4 text-[#ffbf00] animate-spin" />
                      <span className="font-mono text-base font-black text-[#ffbf00]">
                        00:{realtimeTimer < 10 ? `0${realtimeTimer}` : realtimeTimer}
                      </span>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-black bg-amber-500/20 text-[#ffbf00] px-3.5 py-2 rounded-xl border border-[#ffbf00]/30 shadow-sm">
                        🔥 Combo x{comboMultiplier}
                      </span>
                      <span className="text-xs font-mono font-black text-cyan-300 bg-cyan-950/60 px-3.5 py-2 rounded-xl border border-cyan-800 shadow-sm">
                        {realtimeScore} PTS
                      </span>
                    </div>
                  </div>

                  {/* Timer Bar */}
                  <div className="w-full bg-slate-800/80 h-3 rounded-full overflow-hidden p-0.5 border border-white/5">
                    <div
                      className="bg-gradient-to-r from-[#ffbf00] via-orange-500 to-rose-500 h-full rounded-full transition-all duration-1000"
                      style={{ width: `${(realtimeTimer / 15) * 100}%` }}
                    />
                  </div>

                  {/* Question Box */}
                  <div className="p-8 sm:p-10 bg-slate-900/90 rounded-3xl border border-white/10 text-lg sm:text-2xl font-bold text-center text-white min-h-[140px] flex items-center justify-center shadow-2xl backdrop-blur-xl">
                    {activeCustomGame.questions[realtimeQuestionIndex]?.question || "Memuat soal..."}
                  </div>

                  {/* Kahoot 4 Colored Shape Buttons (2x2 Grid) */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    {activeCustomGame.questions[realtimeQuestionIndex]?.options.map((opt, i) => {
                      const colors = [
                        "bg-red-600 hover:bg-red-500 text-white shadow-red-600/30",
                        "bg-blue-600 hover:bg-blue-500 text-white shadow-blue-600/30",
                        "bg-[#ffbf00] hover:bg-amber-400 text-slate-950 font-bold shadow-amber-500/30",
                        "bg-emerald-600 hover:bg-emerald-500 text-white shadow-emerald-600/30",
                      ];
                      const shapes = ["▲", "◆", "●", "■"];
                      const isCorrect = i === activeCustomGame.questions[realtimeQuestionIndex]?.correctAnswerIndex;
                      const isChosen = realtimeSelected === i;

                      let stateClass = colors[i % 4];
                      if (realtimeSelected !== null) {
                        if (isCorrect) {
                          stateClass = "bg-emerald-500 ring-4 ring-emerald-300 text-slate-950 font-black scale-[1.02] shadow-emerald-500/50";
                        } else if (isChosen) {
                          stateClass = "bg-rose-800 opacity-60 line-through text-white";
                        } else {
                          stateClass = "opacity-25 bg-slate-800 text-slate-400";
                        }
                      }

                      return (
                        <button
                          key={i}
                          disabled={realtimeSelected !== null}
                          onClick={() => handleSelectRealtimeAnswer(i)}
                          className={`p-6 rounded-2xl font-bold text-base transition-all duration-200 flex items-center gap-4 shadow-xl cursor-pointer hover:scale-[1.01] active:scale-98 ${stateClass}`}
                        >
                          <span className="w-10 h-10 rounded-xl bg-black/25 flex items-center justify-center text-lg font-black shrink-0">
                            {shapes[i % 4]}
                          </span>
                          <span className="text-left flex-1 font-semibold">{opt}</span>
                        </button>
                      );
                    })}
                  </div>

                  {/* Feedback Next Button */}
                  {realtimeSelected !== null && (
                    <div className="flex justify-end pt-2 animate-fade-in">
                      <button
                        onClick={handleNextRealtimeQuestion}
                        className="px-8 py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] shadow-xl shadow-amber-500/30 flex items-center gap-2 cursor-pointer hover:scale-105 active:scale-95 transition-all"
                      >
                        <span>Soal Berikutnya</span>
                        <span>→</span>
                      </button>
                    </div>
                  )}
                </div>

                {/* Kahoot Live Leaderboard (4 cols) */}
                <div className="lg:col-span-4 bg-slate-900/80 p-6 rounded-3xl border border-white/10 space-y-4 shadow-2xl backdrop-blur-xl">
                  <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                      Live Leaderboard
                    </span>
                    <span className="text-[11px] text-emerald-400 font-bold flex items-center gap-1.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                      Realtime Battle
                    </span>
                  </div>

                  <div className="space-y-2.5">
                    {liveLeaderboard.map((item, idx) => (
                      <div
                        key={idx}
                        className={`flex items-center justify-between p-3 rounded-2xl border text-xs transition-all ${
                          idx === 0
                            ? "bg-amber-500/15 border-[#ffbf00]/40 font-bold"
                            : "bg-slate-950/60 border-slate-800"
                        }`}
                      >
                        <div className="flex items-center gap-3 truncate">
                          <span className={`w-5 text-center font-black ${idx === 0 ? "text-[#ffbf00]" : "text-slate-400"}`}>
                            {idx + 1}
                          </span>
                          <img
                            src={item.avatar}
                            alt={item.name}
                            className="w-8 h-8 rounded-xl object-cover"
                          />
                          <span className="truncate text-slate-200 font-medium">{item.name}</span>
                        </div>
                        <span className="font-mono font-bold text-amber-400 ml-2">
                          {item.score}
                        </span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            ) : (
              /* Realtime Victory Screen */
              <div className="py-12 text-center space-y-6 max-w-xl mx-auto bg-slate-900/90 p-8 sm:p-12 rounded-3xl border border-white/10 shadow-2xl backdrop-blur-xl">
                <div className="w-20 h-20 bg-amber-500/20 text-[#ffbf00] rounded-full flex items-center justify-center mx-auto animate-bounce border border-amber-400/40 shadow-xl shadow-amber-500/20">
                  <Award className="w-10 h-10" />
                </div>
                <div>
                  <h3 className="text-3xl font-black text-white">
                    Kuis Real-Time Selesai! 🎉
                  </h3>
                  <p className="text-slate-300 text-sm mt-2">
                    Selamat! Total skormu mencapai <strong className="text-[#ffbf00]">{realtimeScore} Poin</strong>. Kamu menempati posisi puncak di sesi live ini!
                  </p>
                </div>

                <div className="flex justify-center gap-3 pt-2">
                  <span className="px-5 py-2.5 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-xs">
                    +{activeCustomGame.rewardExp} EXP Diperoleh
                  </span>
                  <span className="px-5 py-2.5 rounded-xl bg-amber-500/20 border border-amber-400/30 text-[#ffbf00] font-bold text-xs">
                    🪙 +{activeCustomGame.rewardCoins} Koin Didapatkan
                  </span>
                </div>

                <button
                  onClick={() => {
                    setActiveCustomGame(null);
                    setActiveGameView(null);
                  }}
                  className="mt-6 px-8 py-3 rounded-2xl font-black text-xs text-slate-950 bg-[#ffbf00] hover:bg-amber-400 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-amber-500/25"
                >
                  Kembali ke Arena
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-8 pb-20 md:pb-6 w-full">
      {/* 1. HEADER SECTION (High-Contrast Non-Blending Typography) */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/15 border border-[#ffbf00]/30 text-[#ffbf00] text-xs font-bold mb-2">
            <Gamepad2 className="w-3.5 h-3.5" />
            <span>Arena Interaktif & Gamifikasi SVA Dev</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-bold tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Arena Kompetisi & Laboratorium AR
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 transition-colors duration-500 ${
              isDark ? "text-gray-400" : "text-slate-600 font-medium"
            }`}
          >
            Uji pemahaman lewat kuis battle real-time, game logika visual, atau eksplorasi modul AR 3D interaktif.
          </p>
        </div>

        {/* 2. THREE-TAB PILL SWITCHER (GAMES vs LABORATORIUM AR vs AI PHOTOBOOTH) */}
        <div
          className={`inline-flex p-1.5 rounded-full backdrop-blur-xl shrink-0 self-start sm:self-auto flex-wrap gap-1 transition-colors duration-500 ${
            isDark ? "bg-white/5 border border-white/10" : "bg-slate-200/90 border border-slate-300 shadow-xs"
          }`}
        >
          <button
            onClick={() => setActiveTab("games")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "games"
                ? "bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white shadow-lg shadow-black/40 font-extrabold"
                : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900 font-semibold"
            }`}
          >
            <Gamepad2 className="w-4 h-4" />
            <span>GAMES</span>
          </button>
          <button
            onClick={() => setActiveTab("ar")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "ar"
                ? "bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white shadow-lg shadow-black/40 font-extrabold"
                : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900 font-semibold"
            }`}
          >
            <Camera className="w-4 h-4" />
            <span>LABORATORIUM AR</span>
          </button>
          <button
            onClick={() => setActiveTab("photobooth")}
            className={`flex items-center gap-2 px-4 sm:px-5 py-2 rounded-full text-xs font-bold transition-all duration-300 cursor-pointer ${
              activeTab === "photobooth"
                ? "bg-gradient-to-r from-cyan-400 via-teal-600 to-[#ffbf00] text-slate-950 shadow-lg shadow-cyan-500/20 font-black"
                : "text-cyan-500 hover:text-cyan-700 font-semibold"
            }`}
          >
            <Sparkles className="w-4 h-4 text-[#ffbf00]" />
            <span>AI PHOTOBOOTH</span>
          </button>
        </div>
      </div>

      {/* =====================================================================
          TAB 1: "GAMES" VIEW (Visual-First UI Grid)
          ===================================================================== */}
      {activeTab === "games" && (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {GAME_CARDS.map((game) => {
            const Icon = game.icon;
            return (
              <div
                key={game.id}
                className={`rounded-2xl border backdrop-blur-xl overflow-hidden flex flex-col justify-between group transition-all duration-500 hover:-translate-y-1 ${
                  isDark
                    ? "bg-slate-900/90 border-slate-800 hover:border-slate-700 shadow-xl"
                    : "bg-white border-slate-200/90 hover:border-[#0cc0df]/50 shadow-md hover:shadow-lg"
                }`}
              >
                {/* Prominent Image/Thumbnail Area at the Top */}
                <div
                  className={`w-full h-40 bg-gradient-to-br ${game.gradient} rounded-t-xl relative overflow-hidden flex items-center justify-center p-4`}
                >
                  <div className="absolute inset-0 bg-black/20" />
                  <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-black/40 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                    {game.badge}
                  </div>
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3
                      className={`text-lg font-bold mt-1 transition-colors duration-500 ${
                        isDark ? "text-white" : "text-slate-900"
                      }`}
                    >
                      {game.title}
                    </h3>
                    <p
                      className={`text-xs mt-2 line-clamp-2 leading-relaxed transition-colors duration-500 ${
                        isDark ? "text-gray-400" : "text-slate-600 font-medium"
                      }`}
                    >
                      {game.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      // 1. BYPASS MODAL FOR ARCADE GAMES (Direct Launch)
                      if (game.isArcade || game.id === "color_vision" || game.templateType === "Color Vision") {
                        setActiveGameView(game.id === "color_memory" ? "color-memory" : "color-vision");
                      } else {
                        setActiveModal({ type: "game", item: game });
                      }
                    }}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] shadow-md shadow-amber-500/20 active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Play className="w-3.5 h-3.5 fill-slate-950 text-slate-950" />
                    <span>
                      {game.id === "color_vision" || game.id === "color_memory"
                        ? "Mainkan Sekarang"
                        : "Pilih Materi & Mainkan"}
                    </span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* =====================================================================
          TAB 2: "LABORATORIUM AR" VIEW (Categorized by Subject & Level)
          ===================================================================== */}
      {activeTab === "ar" && (
        <div className="space-y-6">
          {/* Spotlight Banner: AI Photobooth */}
          <div className="p-5 rounded-2xl bg-gradient-to-r from-cyan-950/60 via-slate-900 to-amber-950/40 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 rounded-xl bg-cyan-500/20 border border-cyan-500/40 flex items-center justify-center text-[#0cc0df] shrink-0">
                <Camera className="w-6 h-6" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="px-2 py-0.5 rounded text-[10px] font-extrabold bg-[#0cc0df] text-slate-950">
                    CV & MEDIAPIPE
                  </span>
                  <h4 className="text-sm font-bold text-white">
                    AI Gesture Photobooth (Hand Tracking)
                  </h4>
                </div>
                <p className="text-xs text-gray-400 mt-1">
                  Kendalikan kamera interaktif dengan gestur tangan: Fist (kepal) untuk memotret & Pinch untuk efek visual.
                </p>
              </div>
            </div>
            <button
              onClick={() => setActiveTab("photobooth")}
              className="px-4 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-[#0cc0df] hover:bg-cyan-400 transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 shadow-lg shadow-cyan-500/20"
            >
              <Sparkles className="w-3.5 h-3.5 fill-slate-950" />
              <span>Buka AI Photobooth</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {AR_MODULES.map((mod) => {
            const Icon = mod.icon;
            return (
              <div
                key={mod.id}
                className="bg-slate-900/90 rounded-2xl border border-slate-800 hover:border-slate-700 backdrop-blur-xl shadow-xl overflow-hidden flex flex-col justify-between group transition-all duration-300 hover:-translate-y-1"
              >
                {/* Prominent Image/Thumbnail Area with Badges */}
                <div
                  className={`w-full h-40 bg-gradient-to-br ${mod.gradient} rounded-t-xl relative overflow-hidden flex items-center justify-center p-4`}
                >
                  <div className="absolute inset-0 bg-black/25" />
                  <div className="absolute top-3 left-3 flex flex-wrap gap-1.5 z-10">
                    <span className="bg-blue-500/20 text-blue-400 text-xs px-2 py-1 rounded-md border border-blue-500/30 font-medium backdrop-blur-sm">
                      {mod.level}
                    </span>
                    <span className="bg-green-500/20 text-green-400 text-xs px-2 py-1 rounded-md border border-green-500/30 font-medium backdrop-blur-sm">
                      {mod.subject}
                    </span>
                  </div>
                  <div className="relative z-10 w-14 h-14 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-lg group-hover:scale-110 transition-transform duration-300">
                    <Icon className="w-7 h-7" />
                  </div>
                </div>

                {/* Content */}
                <div className="p-5 flex-1 flex flex-col justify-between">
                  <div>
                    <h3 className="text-lg font-bold text-white mt-1">
                      {mod.title}
                    </h3>
                    <p className="text-xs text-gray-400 mt-2 line-clamp-3 leading-relaxed">
                      {mod.desc}
                    </p>
                  </div>

                  <button
                    onClick={() => {
                      if (mod.id === "skull_anatomy_module") {
                        setActiveGameView("skull-anatomy");
                      } else {
                        setSelectedSubject(mod.subject || "Matematika");
                        setActiveModal({ type: "ar", item: mod });
                      }
                    }}
                    className="mt-5 w-full py-2.5 px-4 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/20 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    <Camera className="w-3.5 h-3.5 text-[#0cc0df]" />
                    <span>{mod.id === "skull_anatomy_module" ? "Buka Simulasi 3D" : "Pilih Materi & Buka AR"}</span>
                  </button>
                </div>
              </div>
            );
          })}
          </div>
        </div>
      )}

      {/* =====================================================================
          TAB 3: "AI PHOTOBOOTH" VIEW (Direct Hand-Tracking Experience)
          ===================================================================== */}
      {activeTab === "photobooth" && (
        <div className="pt-2 animate-scale-up">
          <ARPhotobooth />
        </div>
      )}

      {/* =====================================================================
          GAMEPLAY MODAL B: GAME SERU (MEMORY MATCH - 12 KARTU)
          ===================================================================== */}
      {activeCustomGame && activeCustomGame.templateType === "Memory Match" && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-3xl w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black px-3 py-1 rounded-lg bg-cyan-600 text-white uppercase tracking-wider">
                  MEMORY MATCH
                </span>
                <h3 className="font-extrabold text-lg text-white mt-1">
                  {activeCustomGame.title}
                </h3>
              </div>
              <div className="flex items-center gap-3">
                <button
                  onClick={initMemoryGame}
                  className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 transition"
                  title="Kocok Ulang"
                >
                  <Shuffle className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setActiveCustomGame(null)}
                  className="text-slate-400 hover:text-white p-1 rounded-xl text-sm font-bold"
                >
                  ✕ Keluar
                </button>
              </div>
            </div>

            <div className="flex items-center justify-between text-xs bg-slate-800/80 p-3 rounded-2xl border border-slate-700">
              <span className="text-slate-300">
                Langkah (Moves): <strong className="text-white font-mono">{memoryMoves}</strong>
              </span>
              <span className="text-cyan-400 font-bold">
                Pasangan Ditemukan: {matchedCardIds.length / 2} / 6
              </span>
            </div>

            {!memoryFinished ? (
              <div className="grid grid-cols-3 sm:grid-cols-4 gap-3">
                {shuffledCards.map((card) => {
                  const isFlipped = flippedCards.includes(card.id) || matchedCardIds.includes(card.id);
                  const isMatched = matchedCardIds.includes(card.id);

                  return (
                    <button
                      key={card.id}
                      onClick={() => handleFlipCard(card.id)}
                      className={`h-28 rounded-2xl flex flex-col items-center justify-center p-3 text-center transition-all duration-300 transform ${
                        isFlipped
                          ? isMatched
                            ? "bg-emerald-950/80 border-2 border-emerald-500 scale-[0.98]"
                            : "bg-slate-800 border-2 border-[#0cc0df] rotate-y-180"
                          : "bg-gradient-to-br from-slate-800 to-slate-900 border border-slate-700 hover:border-slate-500 hover:scale-105"
                      }`}
                    >
                      {isFlipped ? (
                        <>
                          <span className="text-2xl mb-1">{card.icon}</span>
                          <span className="text-xs font-bold text-white leading-tight">{card.label}</span>
                          <span className="text-[10px] text-cyan-300">{card.subtext}</span>
                        </>
                      ) : (
                        <div className="w-10 h-10 rounded-xl bg-slate-700/50 flex items-center justify-center text-slate-400 font-black text-sm">
                          ?
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ) : (
              <div className="py-8 text-center space-y-4">
                <div className="w-16 h-16 bg-cyan-500/20 text-[#0cc0df] rounded-full flex items-center justify-center mx-auto animate-bounce border border-cyan-400/40">
                  <Award className="w-8 h-8" />
                </div>
                <h3 className="text-xl font-black text-white">Semua Pasangan Kartu Ditemukan! 🎉</h3>
                <p className="text-xs text-slate-300 max-w-xs mx-auto">
                  Luar biasa! Kamu menyelesaikan memori kartu ini dalam <strong>{memoryMoves} langkah</strong>.
                </p>
                <div className="flex justify-center gap-3 pt-2">
                  <span className="px-4 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-xs">
                    +{activeCustomGame.rewardExp} EXP
                  </span>
                  <span className="px-4 py-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-[#ffbf00] font-bold text-xs">
                    🪙 +{activeCustomGame.rewardCoins} Koin
                  </span>
                </div>
                <button
                  onClick={() => setActiveCustomGame(null)}
                  className="mt-4 px-6 py-2.5 rounded-xl font-black text-xs text-slate-950 bg-[#ffbf00] hover:bg-amber-400"
                >
                  Selesai & Tutup
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          GAMEPLAY MODAL C: DUEL INTERAKTIF (TIC-TAC-TOE EDUKASI 1V1)
          ===================================================================== */}
      {activeCustomGame && activeCustomGame.templateType === "Duel Interaktif" && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div>
                <span className="text-xs font-black px-3 py-1 rounded-lg bg-amber-500/20 text-[#ffbf00] border border-amber-500/40 uppercase tracking-wider">
                  DUEL INTERAKTIF 1v1
                </span>
                <h3 className="font-extrabold text-lg text-white mt-1">
                  Tic-Tac-Toe Trivia Santri
                </h3>
              </div>
              <button
                onClick={() => setActiveCustomGame(null)}
                className="text-slate-400 hover:text-white p-1 rounded-xl text-sm font-bold"
              >
                ✕ Keluar
              </button>
            </div>

            <div className="grid grid-cols-2 gap-3 text-xs font-bold">
              <div className="p-3 rounded-xl bg-amber-500/15 border border-[#ffbf00]/40 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#ffbf00] text-slate-950 flex items-center justify-center font-black">X</span>
                <span>Kamu (Santri)</span>
              </div>
              <div className="p-3 rounded-xl bg-cyan-500/15 border border-[#0cc0df]/40 flex items-center gap-2">
                <span className="w-7 h-7 rounded-lg bg-[#0cc0df] text-slate-950 flex items-center justify-center font-black">O</span>
                <span>Lawan (AI Bot)</span>
              </div>
            </div>

            <div className="max-w-xs mx-auto aspect-square grid grid-cols-3 gap-3 p-3 bg-slate-800/80 rounded-3xl border border-slate-700">
              {board.map((val, idx) => (
                <button
                  key={idx}
                  disabled={val !== null || duelWinner !== null}
                  onClick={() => handleCellClick(idx)}
                  className={`rounded-2xl flex items-center justify-center font-black text-3xl transition-all duration-200 ${
                    val === "X"
                      ? "bg-[#ffbf00] text-slate-950 shadow-lg shadow-amber-500/20"
                      : val === "O"
                      ? "bg-[#0cc0df] text-slate-950 shadow-lg shadow-cyan-500/20"
                      : "bg-slate-900/80 hover:bg-slate-700/80 text-slate-600 border border-slate-700 hover:scale-105 active:scale-95"
                  }`}
                >
                  {val || <span className="text-xs font-bold text-slate-500 opacity-60">Soal {idx + 1}</span>}
                </button>
              ))}
            </div>

            {activeDuelQuestion && activeCellForQuestion !== null && (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 space-y-3 animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-[#ffbf00]">
                  <span>Tantangan Petak #{activeCellForQuestion + 1}</span>
                  <span>Jawab Benar untuk Mengklaim &apos;X&apos;</span>
                </div>

                <p className="text-sm font-bold text-white leading-relaxed">
                  {activeDuelQuestion.question}
                </p>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {activeDuelQuestion.options.map((opt, i) => {
                    const isChosen = duelSelectedOption === i;
                    const isCorrect = i === activeDuelQuestion.correctAnswerIndex;

                    let btnStyle = "bg-slate-900 border-slate-700 hover:border-[#ffbf00] text-slate-200";
                    if (duelSelectedOption !== null) {
                      if (isCorrect) {
                        btnStyle = "bg-emerald-600 border-emerald-400 text-white font-bold";
                      } else if (isChosen) {
                        btnStyle = "bg-rose-600 border-rose-400 text-white font-bold";
                      }
                    }

                    return (
                      <button
                        key={i}
                        disabled={duelSelectedOption !== null}
                        onClick={() => handleAnswerDuelQuestion(i)}
                        className={`p-3 rounded-xl text-left text-xs font-semibold border transition ${btnStyle}`}
                      >
                        {String.fromCharCode(65 + i)}. {opt}
                      </button>
                    );
                  })}
                </div>
              </div>
            )}

            {duelWinner && (
              <div className="p-4 rounded-2xl bg-slate-800 border border-slate-700 text-center space-y-3">
                {duelWinner === "player" && (
                  <div className="text-emerald-400 font-extrabold text-lg">
                    🎉 Kamu Memenangkan Duel 1v1!
                  </div>
                )}
                {duelWinner === "ai" && (
                  <div className="text-rose-400 font-extrabold text-lg">
                    🤖 Lawan Menguasai 3 Petak Terlebih Dahulu!
                  </div>
                )}
                {duelWinner === "draw" && (
                  <div className="text-amber-400 font-extrabold text-lg">
                    🤝 Hasil Imbang (Seri)!
                  </div>
                )}

                <div className="flex justify-center gap-3">
                  <button
                    onClick={resetDuelGame}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-slate-700 hover:bg-slate-600 text-white transition"
                  >
                    Main Lagi
                  </button>
                  <button
                    onClick={() => setActiveCustomGame(null)}
                    className="px-5 py-2 rounded-xl text-xs font-bold bg-[#ffbf00] text-slate-950 hover:bg-amber-400 transition"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* =====================================================================
          4. GAME TYPE D: COLOR VISION PERCEPTION TEST (KUKU KUBE)
          ===================================================================== */}
      {activeCustomGame && activeCustomGame.templateType === "Color Vision" && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl w-full relative">
            <button
              onClick={() => setActiveCustomGame(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Keluar Game</span>
            </button>
            <ColorVisionGame />
          </div>
        </div>
      )}

      {/* =====================================================================
          5. GAME TYPE E: COLOR MEMORY MATCH (HSL RECREATION)
          ===================================================================== */}
      {activeCustomGame && activeCustomGame.templateType === "Color Memory" && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-2xl w-full relative">
            <button
              onClick={() => setActiveCustomGame(null)}
              className="absolute top-2 right-2 sm:top-4 sm:right-4 z-30 text-gray-400 hover:text-white px-3 py-1.5 rounded-xl bg-black/60 hover:bg-black/90 border border-white/10 text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5"
            >
              <X className="w-4 h-4" />
              <span>Keluar Game</span>
            </button>
            <ColorMemoryGame />
          </div>
        </div>
      )}

      {/* =====================================================================
          LABORATORIUM AR INTERACTIVE 3D MODAL (AR VIEWPORT)
          ===================================================================== */}
      {activeArModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/90 backdrop-blur-md flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
          <div className="max-w-4xl w-full bg-slate-900 text-white rounded-3xl p-6 sm:p-8 border border-slate-800 shadow-2xl space-y-6 animate-scale-up">
            <div className="flex items-center justify-between border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <span className="text-xs font-bold px-3 py-1 rounded-lg bg-cyan-500/20 text-[#0cc0df] border border-cyan-500/30">
                  {activeArModal.subject} • {activeArModal.level}
                </span>
                <h3 className="font-extrabold text-lg text-white">
                  {activeArModal.title}
                </h3>
              </div>
              <button
                onClick={() => {
                  setActiveArModal(null);
                  setArCameraActive(false);
                }}
                className="text-slate-400 hover:text-white p-1.5 rounded-xl text-sm font-bold cursor-pointer"
              >
                ✕ Tutup Laboratorium
              </button>
            </div>

            {/* Immersive AR 3D Viewport */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-center">
              <div className="lg:col-span-2 relative aspect-video bg-slate-950 rounded-2xl border border-slate-800 overflow-hidden flex flex-col items-center justify-center">
                {arCameraActive ? (
                  <div className="w-full h-full relative flex items-center justify-center bg-cyan-950/20">
                    <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#0cc0df]" />
                    <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#0cc0df]" />
                    <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#0cc0df]" />
                    <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#0cc0df]" />
                    <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-[#ffbf00]/80 animate-pulse" />

                    <div className="text-center space-y-2 z-10 p-4 bg-slate-950/80 backdrop-blur-md rounded-2xl border border-[#0cc0df]/30">
                      <Camera className="w-8 h-8 text-[#0cc0df] mx-auto animate-pulse" />
                      <p className="text-xs font-bold text-cyan-300">
                        Sensor Kamera AR Aktif (Simulasi Ruangan)
                      </p>
                      <p className="text-[11px] text-slate-300 max-w-xs">
                        Arahkan kamera ke permukaan datar untuk memproyeksikan objek 3D {activeArModal.title} secara real-time.
                      </p>
                    </div>
                  </div>
                ) : (
                  <div
                    className="w-full h-full flex flex-col items-center justify-center p-6 text-center transition-transform duration-300"
                    style={{ transform: `rotate(${rotationAngle}deg)` }}
                  >
                    <div className="relative w-44 h-44 rounded-full bg-gradient-to-tr from-[#0cc0df]/30 via-purple-500/20 to-[#ffbf00]/30 border-2 border-[#0cc0df]/60 flex items-center justify-center shadow-lg">
                      <div className="w-24 h-24 rounded-2xl bg-gradient-to-br from-[#ffbf00] to-amber-500 flex flex-col items-center justify-center text-slate-950 font-bold text-xs shadow-md border-2 border-amber-200 p-2 text-center">
                        <Box className="w-6 h-6 mb-1 text-slate-950" />
                        <span className="leading-tight text-[10px]">{selectedOrganelle}</span>
                      </div>
                    </div>
                    <span className="text-[10px] text-slate-400 mt-4 block">
                      Mode 3D Interaktif: Rotasi objek dan amati detail spasial
                    </span>
                  </div>
                )}

                {/* Viewport controls */}
                <div className="absolute bottom-3 inset-x-3 bg-slate-950/80 backdrop-blur-md rounded-xl p-2.5 flex items-center justify-between border border-slate-800 text-xs">
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => setRotationAngle((prev) => (prev + 45) % 360)}
                      className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 transition"
                      title="Rotasi Objek 3D"
                    >
                      <RotateCw className="w-4 h-4" />
                    </button>
                    <span className="text-[11px] text-slate-400">Rotasi: {rotationAngle}°</span>
                  </div>

                  <button
                    onClick={() => setArCameraActive(!arCameraActive)}
                    className={`px-3 py-1.5 rounded-lg font-bold text-xs flex items-center gap-1.5 transition cursor-pointer ${
                      arCameraActive
                        ? "bg-rose-600 text-white"
                        : "bg-[#0cc0df] text-slate-950 hover:bg-cyan-400"
                    }`}
                  >
                    <Camera className="w-3.5 h-3.5" />
                    <span>{arCameraActive ? "Tutup Kamera" : "Aktifkan Kamera AR"}</span>
                  </button>
                </div>
              </div>

              {/* Module Inspector */}
              <div className="space-y-4 bg-slate-950/60 p-5 rounded-2xl border border-slate-800">
                <div className="flex items-center gap-2 text-[#0cc0df]">
                  <Layers className="w-4 h-4 text-[#ffbf00]" />
                  <h4 className="text-xs font-bold uppercase tracking-wider">
                    Elemen Interaktif 3D
                  </h4>
                </div>

                <div className="space-y-2">
                  {activeArModal.interactiveElements.map((el, i) => (
                    <button
                      key={i}
                      onClick={() => setSelectedOrganelle(el)}
                      className={`w-full text-left p-3 rounded-xl text-xs font-semibold border transition cursor-pointer ${
                        selectedOrganelle === el
                          ? "bg-cyan-500/20 border-cyan-400 text-white font-bold"
                          : "bg-slate-800/60 border-slate-700/80 text-slate-300 hover:bg-slate-800"
                      }`}
                    >
                      {i + 1}. {el}
                    </button>
                  ))}
                </div>

                <p className="text-xs text-slate-400 leading-relaxed border-t border-slate-800 pt-3">
                  {activeArModal.desc}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* =====================================================================
          PRE-GAME / PRE-AR SELECTION MODAL (Glassmorphism & Framer Motion)
          ===================================================================== */}
      <AnimatePresence>
        {activeModal && (
          <div className="fixed inset-0 z-[200] flex items-center justify-center bg-black/60 backdrop-blur-sm p-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              transition={{ duration: 0.2 }}
              className="bg-[#0f0f13] border border-white/10 rounded-2xl p-8 w-full max-w-md shadow-2xl relative space-y-6"
            >
              {/* Close Button X */}
              <button
                onClick={() => setActiveModal(null)}
                className="absolute top-5 right-5 text-gray-400 hover:text-white p-1 rounded-lg hover:bg-white/10 transition-colors cursor-pointer"
                aria-label="Tutup"
              >
                <X className="w-5 h-5" />
              </button>

              {/* Title */}
              <div>
                <span className="text-[10px] font-extrabold uppercase tracking-widest text-emerald-400 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-full">
                  {activeModal.type === "game" ? "Konfigurasi Permainan" : "Konfigurasi Modul AR"}
                </span>
                <h3 className="text-xl font-bold text-white mt-2.5">
                  Persiapan Permainan
                </h3>
                <p className="text-xs text-gray-400 mt-1">
                  {activeModal.item?.title ? `${activeModal.item.title}` : "Tentukan kurikulum sebelum memulai"}
                </p>
              </div>

              {/* Section 1: Pilih Jenjang */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-300 block uppercase tracking-wider">
                  Pilih Jenjang
                </label>
                <div className="grid grid-cols-2 gap-2.5">
                  {["SD / MI", "MTs / SMP"].map((level) => {
                    const isSelected = selectedLevel === level;
                    return (
                      <button
                        key={level}
                        type="button"
                        onClick={() => setSelectedLevel(level)}
                        className={`py-3 px-4 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                            : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {level}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 2: Pilih Mata Pelajaran */}
              <div className="space-y-2.5">
                <label className="text-xs font-bold text-gray-300 block uppercase tracking-wider">
                  Pilih Mata Pelajaran
                </label>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2.5">
                  {["Matematika", "Bahasa Indonesia", "Bahasa Inggris"].map((subj) => {
                    const isSelected = selectedSubject === subj;
                    return (
                      <button
                        key={subj}
                        type="button"
                        onClick={() => setSelectedSubject(subj)}
                        className={`py-3 px-2 rounded-xl text-xs font-bold transition-all text-center cursor-pointer ${
                          isSelected
                            ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/50"
                            : "bg-white/5 text-gray-400 border border-white/10 hover:border-white/20 hover:text-white"
                        }`}
                      >
                        {subj}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Section 4: Final Start Button */}
              <div className="pt-2">
                <button
                  onClick={() => {
                    const modalData = activeModal;
                    setActiveModal(null);
                    if (modalData.type === "game") {
                      handleLaunchGame(modalData.item.templateType, selectedLevel, selectedSubject);
                    } else if (modalData.type === "ar") {
                      setActiveArModal({
                        ...modalData.item,
                        subject: selectedSubject,
                        level: `Jenjang: ${selectedLevel}`,
                      });
                      setSelectedOrganelle(modalData.item.interactiveElements[0]);
                    }
                  }}
                  className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 to-[#0cc0df] hover:from-emerald-300 hover:to-cyan-300 shadow-lg shadow-emerald-500/20 hover:scale-[1.02] active:scale-98 transition-all flex items-center justify-center gap-2 cursor-pointer"
                >
                  <span>Mulai Permainan Sekarang -&gt;</span>
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
