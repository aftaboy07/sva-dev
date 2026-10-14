"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArenaTopicId,
  ConceptCardPair,
  StudentSocialPeer,
} from "@/types";
import { ARENA_TOPIC_PACKS } from "@/data/arenaData";
import {
  playSuccessChime,
  playErrorBuzz,
  playVictoryFanfare,
} from "@/utils/arenaSound";
import {
  Trophy,
  Swords,
  Timer,
  CheckCircle2,
  AlertCircle,
  Sparkles,
  Flame,
  ArrowRight,
  RotateCcw,
  Home,
  Zap,
} from "lucide-react";

interface PasangKonsepGameEngineProps {
  matchId: string;
  topicId: ArenaTopicId;
  playerA: StudentSocialPeer; // Logged-in user
  playerB: StudentSocialPeer; // Opponent
  onFinishMatch: (updatedPlayerAStats: {
    totalKnowledgeScore: number;
    gamesPlayedCount: number;
  }) => void;
  onReturnToLobby: () => void;
}

interface ShuffledCard {
  id: string; // matches ConceptCardPair id
  type: "term" | "explanation";
  text: string;
  matched: boolean;
}

export default function PasangKonsepGameEngine({
  matchId,
  topicId,
  playerA,
  playerB,
  onFinishMatch,
  onReturnToLobby,
}: PasangKonsepGameEngineProps) {
  const topicPack =
    ARENA_TOPIC_PACKS.find((p) => p.id === topicId) || ARENA_TOPIC_PACKS[0];

  // Rounds State: 1, 2, 3
  const [currentRound, setCurrentRound] = useState(1);
  const [roundTimer, setRoundTimer] = useState(45); // 45 seconds per round
  const [isRoundTransition, setIsRoundTransition] = useState(false);
  const [isGameOver, setIsGameOver] = useState(false);

  // Scores
  const [playerAScore, setPlayerAScore] = useState(0);
  const [playerBScore, setPlayerBScore] = useState(0);
  const [streak, setStreak] = useState(0);

  // Cards for current round
  const [termCards, setTermCards] = useState<ShuffledCard[]>([]);
  const [explanationCards, setExplanationCards] = useState<ShuffledCard[]>([]);

  // Selection state
  const [selectedTermId, setSelectedTermId] = useState<string | null>(null);
  const [selectedExplanationId, setSelectedExplanationId] = useState<string | null>(null);
  const [mismatchPair, setMismatchPair] = useState<{ termId: string; expId: string } | null>(null);

  // Opponent matched count for progress bar
  const [playerAMatchedCount, setPlayerAMatchedCount] = useState(0);
  const [playerBMatchedCount, setPlayerBMatchedCount] = useState(0);

  const channelRef = useRef<BroadcastChannel | null>(null);

  // Post broadcast helper
  const postBroadcast = useCallback(
    (payload: Record<string, unknown>) => {
      try {
        if (channelRef.current) {
          channelRef.current.postMessage({ matchId, ...payload });
        }
      } catch {}
    },
    [matchId]
  );

  // BroadcastChannel listener
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("sva_dev_arena");
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || data.matchId !== matchId) return;

        if (data.type === "SCORE_UPDATE") {
          if (data.studentId === playerB.id) {
            setPlayerBScore(data.score);
            setPlayerBMatchedCount(data.pairsCount);
          }
        }
      };
    } catch {}

    return () => {
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
    };
  }, [matchId, playerB.id]);

  // Load round cards helper
  const setupRound = useCallback(
    (roundNum: number) => {
      const roundData = topicPack.rounds.find((r) => r.round === roundNum);
      if (!roundData) return;

      const pairs = roundData.pairs;

      const terms: ShuffledCard[] = pairs.map((p) => ({
        id: p.id,
        type: "term",
        text: p.conceptTerm,
        matched: false,
      }));

      // Shuffle explanations
      const explanations: ShuffledCard[] = [...pairs]
        .sort(() => Math.random() - 0.5)
        .map((p) => ({
          id: p.id,
          type: "explanation",
          text: p.explanation,
          matched: false,
        }));

      setTermCards(terms);
      setExplanationCards(explanations);
      setSelectedTermId(null);
      setSelectedExplanationId(null);
      setMismatchPair(null);
      setRoundTimer(45);
      setPlayerAMatchedCount(0);
      setPlayerBMatchedCount(0);
    },
    [topicPack]
  );

  // Initial round setup
  useEffect(() => {
    setupRound(1);
  }, [setupRound]);

  // Round Timer countdown
  useEffect(() => {
    if (isGameOver || isRoundTransition) return;

    const timer = setInterval(() => {
      setRoundTimer((prev) => {
        if (prev <= 1) {
          // Timer ended for this round -> advance or finish
          handleAdvanceRound();
          return 45;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isGameOver, isRoundTransition, currentRound]);

  // Simulated Opponent behavior (if playing solo or opponent isn't actively broadcasting)
  useEffect(() => {
    if (isGameOver || isRoundTransition) return;

    // Simulate occasional opponent progress
    const simInterval = setInterval(() => {
      setPlayerBMatchedCount((prev) => {
        if (prev < 4 && Math.random() > 0.35) {
          const nextCount = prev + 1;
          const addedScore = 100 + Math.floor(Math.random() * 30);
          setPlayerBScore((s) => {
            const nextScore = s + addedScore;
            return nextScore;
          });
          return nextCount;
        }
        return prev;
      });
    }, 4200);

    return () => clearInterval(simInterval);
  }, [isGameOver, isRoundTransition, currentRound]);

  // Advance round logic
  const handleAdvanceRound = useCallback(() => {
    if (currentRound < 3) {
      setIsRoundTransition(true);
      setTimeout(() => {
        setCurrentRound((r) => {
          const nextR = r + 1;
          setupRound(nextR);
          return nextR;
        });
        setIsRoundTransition(false);
      }, 1500);
    } else {
      // Game Over
      setIsGameOver(true);
      playVictoryFanfare();
    }
  }, [currentRound, setupRound]);

  // Card match evaluation
  useEffect(() => {
    if (!selectedTermId || !selectedExplanationId) return;

    if (selectedTermId === selectedExplanationId) {
      // Correct Match!
      playSuccessChime();

      // Calculate score with streak & speed bonus
      const speedBonus = Math.round((roundTimer / 45) * 40);
      const streakBonus = streak * 15;
      const pointsEarned = 100 + speedBonus + streakBonus;

      setPlayerAScore((prev) => {
        const nextScore = prev + pointsEarned;
        postBroadcast({
          type: "SCORE_UPDATE",
          studentId: playerA.id,
          score: nextScore,
          pairsCount: playerAMatchedCount + 1,
        });
        return nextScore;
      });

      setStreak((s) => s + 1);

      // Mark cards as matched
      setTermCards((prev) =>
        prev.map((c) => (c.id === selectedTermId ? { ...c, matched: true } : c))
      );
      setExplanationCards((prev) =>
        prev.map((c) => (c.id === selectedExplanationId ? { ...c, matched: true } : c))
      );

      const nextMatchedCount = playerAMatchedCount + 1;
      setPlayerAMatchedCount(nextMatchedCount);

      setSelectedTermId(null);
      setSelectedExplanationId(null);

      // Check if all 4 matched in this round
      if (nextMatchedCount >= 4) {
        setTimeout(() => {
          handleAdvanceRound();
        }, 800);
      }
    } else {
      // Mismatch
      playErrorBuzz();
      setStreak(0);
      setMismatchPair({ termId: selectedTermId, expId: selectedExplanationId });

      setTimeout(() => {
        setSelectedTermId(null);
        setSelectedExplanationId(null);
        setMismatchPair(null);
      }, 650);
    }
  }, [
    selectedTermId,
    selectedExplanationId,
    roundTimer,
    streak,
    playerAMatchedCount,
    playerA.id,
    postBroadcast,
    handleAdvanceRound,
  ]);

  // On Game Finish, save stats
  useEffect(() => {
    if (isGameOver) {
      const updatedStats = {
        totalKnowledgeScore: playerA.totalKnowledgeScore + playerAScore,
        gamesPlayedCount: playerA.gamesPlayedCount + 1,
      };
      onFinishMatch(updatedStats);
    }
  }, [isGameOver, playerA.gamesPlayedCount, playerA.totalKnowledgeScore, playerAScore, onFinishMatch]);

  const isPlayerAWinner = playerAScore > playerBScore;
  const isDraw = playerAScore === playerBScore;

  return (
    <div className="relative w-full max-w-5xl mx-auto space-y-6">
      {/* Game Over Modal / Victory Banner */}
      <AnimatePresence>
        {isGameOver && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-xl"
          >
            <motion.div
              initial={{ scale: 0.85, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              className="relative w-full max-w-xl bg-gradient-to-b from-[#1c1c28] to-[#12121a] border border-cyan-500/40 rounded-3xl p-6 sm:p-8 text-center text-white shadow-2xl shadow-cyan-500/20 space-y-6 overflow-hidden"
            >
              {/* Decorative radial glow */}
              <div className="absolute -top-24 left-1/2 -translate-x-1/2 w-64 h-64 bg-cyan-500/20 rounded-full blur-3xl pointer-events-none" />

              <div className="space-y-2">
                <div className="w-20 h-20 mx-auto rounded-2xl bg-gradient-to-tr from-amber-400 to-amber-600 flex items-center justify-center shadow-lg shadow-amber-500/30">
                  <Trophy className="w-10 h-10 text-slate-950" />
                </div>
                <h2 className="text-2xl sm:text-3xl font-black text-transparent bg-clip-text bg-gradient-to-r from-amber-300 via-white to-cyan-300">
                  {isDraw
                    ? "🤝 Duel Seimbang!"
                    : isPlayerAWinner
                    ? "🏆 Kemenangan Gemilang!"
                    : "🥈 Pertandingan Sengit!"}
                </h2>
                <p className="text-xs sm:text-sm text-gray-300">
                  {isPlayerAWinner
                    ? `Hebat! Kamu berhasil mengungguli ${playerB.name.split(" ")[0]} dengan kecepatan dan akurasi tinggi!`
                    : isDraw
                    ? "Skor kalian sama kuat! Pemahaman konsep santri madrasah sangat seimbang."
                    : `Pertandingan yang seru! Tetap asah pemahaman konsep keilmuanmu bersama ${playerB.name.split(" ")[0]}.`}
                </p>
              </div>

              {/* Final Scoreboard Comparison */}
              <div className="grid grid-cols-2 gap-4 p-4 rounded-2xl bg-black/40 border border-white/10">
                {/* Player A Stats */}
                <div className="p-3 rounded-xl bg-cyan-950/30 border border-cyan-500/30 space-y-1">
                  <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-cyan-400">
                    <Image src={playerA.avatar} alt={playerA.name} fill className="object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{playerA.name.split(" ")[0]} (Kamu)</h4>
                  <p className="text-2xl font-black text-cyan-400">{playerAScore.toLocaleString("id-ID")}</p>
                  <span className="text-[10px] text-cyan-300 font-mono">Poin Diperoleh</span>
                </div>

                {/* Player B Stats */}
                <div className="p-3 rounded-xl bg-purple-950/30 border border-purple-500/30 space-y-1">
                  <div className="relative w-12 h-12 mx-auto rounded-full overflow-hidden border-2 border-purple-400">
                    <Image src={playerB.avatar} alt={playerB.name} fill className="object-cover" />
                  </div>
                  <h4 className="text-xs font-bold text-white truncate">{playerB.name.split(" ")[0]}</h4>
                  <p className="text-2xl font-black text-purple-400">{playerBScore.toLocaleString("id-ID")}</p>
                  <span className="text-[10px] text-purple-300 font-mono">Poin Diperoleh</span>
                </div>
              </div>

              {/* Experience and Knowledge Points Bonus */}
              <div className="p-3 rounded-xl bg-gradient-to-r from-emerald-950/40 via-[#1e2a22] to-cyan-950/40 border border-emerald-500/30 flex items-center justify-around text-xs">
                <div className="text-center">
                  <span className="text-gray-400 block text-[11px]">Riwayat Bermain</span>
                  <span className="font-bold text-emerald-400">+1 Pertandingan</span>
                </div>
                <div className="h-6 w-px bg-white/10" />
                <div className="text-center">
                  <span className="text-gray-400 block text-[11px]">Tambahan Skor Keilmuan</span>
                  <span className="font-bold text-amber-400">+{playerAScore} Pts</span>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={onReturnToLobby}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold bg-white/10 hover:bg-white/20 text-white flex items-center gap-2 transition-colors"
                >
                  <RotateCcw className="w-4 h-4" />
                  Tanding Ulang
                </button>
                <button
                  type="button"
                  onClick={() => onFinishMatch({
                    totalKnowledgeScore: playerA.totalKnowledgeScore + playerAScore,
                    gamesPlayedCount: playerA.gamesPlayedCount + 1,
                  })}
                  className="px-6 py-2.5 rounded-xl text-xs font-black bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 hover:from-cyan-400 hover:to-emerald-300 flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                >
                  <Home className="w-4 h-4" />
                  Simpan & Kembali ke Teman
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Round Transition Splash Overlay */}
      <AnimatePresence>
        {isRoundTransition && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 1.1 }}
            className="fixed inset-0 z-40 flex items-center justify-center bg-black/75 backdrop-blur-md"
          >
            <div className="p-6 rounded-2xl bg-[#14141d] border border-cyan-500/40 text-center space-y-2">
              <span className="text-4xl">🎉</span>
              <h3 className="text-xl font-black text-cyan-300">
                Ronde {currentRound} Selesai!
              </h3>
              <p className="text-xs text-gray-300">
                Mempersiapkan Ronde {currentRound + 1} dari 3...
              </p>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Duel Header / Dual Scoreboard */}
      <div className="grid grid-cols-1 md:grid-cols-11 items-center gap-3 p-4 rounded-2xl bg-[#1a1a24]/90 border border-white/10 shadow-xl backdrop-blur-md">
        {/* Player A Scoreboard (Left) */}
        <div className="md:col-span-4 flex items-center gap-3">
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-cyan-400 shadow-md shadow-cyan-500/20 shrink-0">
            <Image src={playerA.avatar} alt={playerA.name} fill className="object-cover" />
          </div>
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-white truncate">{playerA.name.split(" ")[0]} (Kamu)</span>
              <span className="text-base font-black text-cyan-400">{playerAScore}</span>
            </div>
            {/* Pairs progress bar */}
            <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
              <span>Pasangan: {playerAMatchedCount}/4</span>
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                <div
                  className="h-full bg-cyan-400 transition-all duration-300"
                  style={{ width: `${(playerAMatchedCount / 4) * 100}%` }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Center Round & Timer */}
        <div className="md:col-span-3 flex flex-col items-center justify-center p-2 rounded-xl bg-black/40 border border-white/5 text-center">
          <div className="flex items-center gap-2 text-xs font-bold text-white">
            <span className="px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 text-[11px] font-mono">
              Ronde {currentRound} / 3
            </span>
          </div>
          <div className="mt-1 flex items-center gap-1.5 text-xs text-amber-300 font-mono font-bold">
            <Timer className="w-3.5 h-3.5" />
            <span>00:{roundTimer < 10 ? `0${roundTimer}` : roundTimer}</span>
          </div>
          {streak > 1 && (
            <span className="mt-0.5 inline-flex items-center gap-1 text-[10px] text-orange-400 font-bold animate-pulse">
              <Flame className="w-3 h-3" /> Streak x{streak}
            </span>
          )}
        </div>

        {/* Player B Scoreboard (Right) */}
        <div className="md:col-span-4 flex items-center justify-end gap-3 text-right">
          <div className="min-w-0 flex-1">
            <div className="flex items-center justify-between">
              <span className="text-base font-black text-purple-400">{playerBScore}</span>
              <span className="text-xs font-bold text-white truncate">{playerB.name.split(" ")[0]}</span>
            </div>
            {/* Opponent pairs progress bar */}
            <div className="mt-1 flex items-center gap-2 text-[10px] text-gray-400">
              <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden flex justify-end">
                <div
                  className="h-full bg-purple-400 transition-all duration-300"
                  style={{ width: `${(playerBMatchedCount / 4) * 100}%` }}
                />
              </div>
              <span>Pasangan: {playerBMatchedCount}/4</span>
            </div>
          </div>
          <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-purple-400 shadow-md shadow-purple-500/20 shrink-0">
            <Image src={playerB.avatar} alt={playerB.name} fill className="object-cover" />
          </div>
        </div>
      </div>

      {/* Interactive Match Field */}
      <div className="p-4 sm:p-6 rounded-2xl bg-[#14141d]/90 border border-white/10 space-y-4">
        <div className="flex items-center justify-between text-xs text-gray-400 border-b border-white/10 pb-3">
          <span className="flex items-center gap-2 font-semibold text-white">
            <Sparkles className="w-4 h-4 text-cyan-400" />
            Topik: {topicPack.name}
          </span>
          <span className="text-[11px] text-gray-400 font-mono">
            Klik Istilah di kiri, lalu cocokkan dengan Penjelasan di kanan
          </span>
        </div>

        {/* Two Columns Grid: Terms (Left) vs Explanations (Right) */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
          {/* Left Column: Terms / Formulas */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>🏷️</span> Istilah / Rumus
            </h4>
            <div className="space-y-2.5">
              {termCards.map((card) => {
                const isSelected = selectedTermId === card.id;
                const isMismatch = mismatchPair?.termId === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={card.matched}
                    onClick={() => {
                      if (!card.matched) {
                        setSelectedTermId(card.id);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                      card.matched
                        ? "bg-emerald-950/20 border-emerald-500/30 opacity-60 text-emerald-300 cursor-default"
                        : isMismatch
                        ? "bg-rose-950/40 border-rose-500 text-rose-200 animate-shake"
                        : isSelected
                        ? "bg-cyan-500/20 border-cyan-400 shadow-lg shadow-cyan-500/25 scale-[1.02] text-white"
                        : "bg-[#1c1c28] border-white/10 hover:border-cyan-500/50 hover:bg-[#202030] text-gray-200 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="font-bold text-sm">{card.text}</span>
                      {card.matched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-cyan-400/40" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Right Column: Explanations / Definitions */}
          <div className="space-y-3">
            <h4 className="text-xs font-bold text-purple-400 uppercase tracking-wider flex items-center gap-1.5">
              <span>📖</span> Penjelasan / Definisi
            </h4>
            <div className="space-y-2.5">
              {explanationCards.map((card) => {
                const isSelected = selectedExplanationId === card.id;
                const isMismatch = mismatchPair?.expId === card.id;

                return (
                  <button
                    key={card.id}
                    type="button"
                    disabled={card.matched}
                    onClick={() => {
                      if (!card.matched) {
                        setSelectedExplanationId(card.id);
                      }
                    }}
                    className={`w-full text-left p-4 rounded-xl border transition-all duration-200 relative overflow-hidden ${
                      card.matched
                        ? "bg-emerald-950/20 border-emerald-500/30 opacity-60 text-emerald-300 cursor-default"
                        : isMismatch
                        ? "bg-rose-950/40 border-rose-500 text-rose-200 animate-shake"
                        : isSelected
                        ? "bg-purple-500/20 border-purple-400 shadow-lg shadow-purple-500/25 scale-[1.02] text-white"
                        : "bg-[#1c1c28] border-white/10 hover:border-purple-500/50 hover:bg-[#202030] text-gray-300 cursor-pointer"
                    }`}
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-xs leading-relaxed">{card.text}</span>
                      {card.matched ? (
                        <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
                      ) : (
                        <span className="w-2.5 h-2.5 rounded-full bg-purple-400/40 shrink-0" />
                      )}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
