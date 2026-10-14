"use client";

import React, { useState, useEffect, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Eye,
  Timer,
  Trophy,
  RotateCcw,
  Sparkles,
  Zap,
  Flame,
  AlertCircle,
  Play,
} from "lucide-react";

export default function ColorVisionGame() {
  // ==========================================================================
  // # 1. STATE MANAGEMENT
  // ==========================================================================
  const [score, setScore] = useState<number>(0);
  const [timeLeft, setTimeLeft] = useState<number>(30);
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [isGameOver, setIsGameOver] = useState<boolean>(false);
  const [gridSize, setGridSize] = useState<number>(2);
  const [targetIndex, setTargetIndex] = useState<number>(0);
  const [colors, setColors] = useState<{ baseColor: string; targetColor: string }>(() => {
    const initialHue = Math.floor(Math.random() * 360);
    return {
      baseColor: `hsl(${initialHue}, 80%, 50%)`,
      targetColor: `hsl(${initialHue}, 80%, 65%)`,
    };
  });
  const [bestScore, setBestScore] = useState<number>(0);
  const [combo, setCombo] = useState<number>(0);
  const [penaltyFlash, setPenaltyFlash] = useState<boolean>(false);

  // ==========================================================================
  // # 2. COLOR GENERATION LOGIC (HSL MATH)
  // ==========================================================================
  const generateLevel = useCallback((currentScore: number) => {
    // Extreme difficulty scaling: starts at 2x2, scales aggressively up to 16x16 (15x15+)
    const newGridSize = Math.min(2 + Math.floor(currentScore / 3), 16);
    setGridSize(newGridSize);

    // Truly randomize base Hue across the full 0 to 360 degree color wheel on every round
    const hue = Math.floor(Math.random() * 360);
    const saturation = Math.floor(Math.random() * 20) + 75; // 75% - 95% for rich, vivid colors
    const baseLightness = Math.floor(Math.random() * 16) + 42; // 42% - 58% for optimal contrast

    // Extreme micro-difference scaling: drops below 1% difference, down to 0.5%
    const diff = Math.max(0.5, 20 - currentScore * 0.6);

    // Modify lightness (can vary slightly lighter or darker safely)
    const isLighter = baseLightness + diff <= 95;
    const targetLightness = isLighter ? baseLightness + diff : baseLightness - diff;

    const base = `hsl(${hue}, ${saturation}%, ${baseLightness}%)`;
    const target = `hsl(${hue}, ${saturation}%, ${targetLightness}%)`;

    setColors({
      baseColor: base,
      targetColor: target,
    });

    const totalTiles = newGridSize * newGridSize;
    const newTarget = Math.floor(Math.random() * totalTiles);
    setTargetIndex(newTarget);
  }, []);

  // ==========================================================================
  // # 3. GAMEPLAY LOOP
  // ==========================================================================
  const startGame = () => {
    setScore(0);
    setTimeLeft(30);
    setIsPlaying(true);
    setIsGameOver(false);
    setCombo(0);
    setPenaltyFlash(false);
    generateLevel(0);
  };

  // Timer Countdown
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          setIsPlaying(false);
          setIsGameOver(true);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // High Score Tracker
  useEffect(() => {
    if (score > bestScore) {
      setBestScore(score);
    }
  }, [score, bestScore]);

  // Tile Click Handler
  const handleTileClick = (index: number) => {
    if (!isPlaying) return;

    if (index === targetIndex) {
      const nextScore = score + 1;
      setScore(nextScore);
      setCombo((prev) => prev + 1);
      generateLevel(nextScore);
    } else {
      // Penalty: deduct 1 second and reset combo
      setTimeLeft((prev) => Math.max(0, prev - 1));
      setCombo(0);
      setPenaltyFlash(true);
      setTimeout(() => setPenaltyFlash(false), 300);
    }
  };

  // Vision Rank Assessment
  const getVisionRank = (finalScore: number) => {
    if (finalScore >= 40) {
      return {
        title: "Mata Robot Cyber",
        badge: "Tingkat Dewa (40+)",
        color: "text-purple-400",
        description: "Persepsi spektrum warna Anda sempurna tanpa cela!",
      };
    }
    if (finalScore >= 30) {
      return {
        title: "Mata Elang",
        badge: "Sangat Tajam (30-39)",
        color: "text-emerald-400",
        description: "Luar biasa! Sangat peka terhadap perbedaan gradasi warna halus.",
      };
    }
    if (finalScore >= 20) {
      return {
        title: "Mata Serigala",
        badge: "Di Atas Rata-rata (20-29)",
        color: "text-cyan-400",
        description: "Bagus sekali! Penglihatan warna Anda lebih tajam dari kebanyakan orang.",
      };
    }
    if (finalScore >= 10) {
      return {
        title: "Mata Kucing",
        badge: "Standar Normal (10-19)",
        color: "text-amber-400",
        description: "Persepsi warna Anda dalam rentang normal yang sehat.",
      };
    }
    return {
      title: "Mata Kelinci",
      badge: "Perlu Latihan (<10)",
      color: "text-rose-400",
      description: "Fokus dan santai! Latih lagi ketajaman persepsi visual Anda.",
    };
  };

  // Total tiles in current grid
  const totalTiles = gridSize * gridSize;

  return (
    <div
      className={`relative w-full max-w-2xl mx-auto bg-[#1a1a24] border rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl transition-all duration-300 ${
        penaltyFlash
          ? "border-rose-500/80 shadow-[0_0_30px_rgba(244,63,94,0.3)]"
          : "border-white/10"
      }`}
    >
      {/* Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex flex-col gap-4 mb-6">
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#0cc0df] text-xs font-bold">
            <Eye className="w-3.5 h-3.5" />
            <span>SVA Visual Perception • Color Vision Test</span>
          </div>

          {bestScore > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1 rounded-full border border-amber-400/30">
              <Trophy className="w-3.5 h-3.5" />
              <span>Rekor: {bestScore}</span>
            </div>
          )}
        </div>

        {/* Dynamic Stats Row */}
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
          <div className="bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Skor
            </span>
            <div className="flex items-baseline gap-2 mt-0.5">
              <span className="text-3xl font-extrabold text-white">{score}</span>
              {combo > 2 && (
                <span className="inline-flex items-center text-xs font-bold text-amber-400">
                  <Flame className="w-3.5 h-3.5 animate-pulse mr-0.5" />
                  {combo}x
                </span>
              )}
            </div>
          </div>

          <div
            className={`border rounded-xl p-3 flex flex-col transition-colors ${
              timeLeft <= 5 && isPlaying
                ? "bg-rose-500/20 border-rose-500/40 text-rose-400"
                : "bg-black/40 border-white/10 text-white"
            }`}
          >
            <div className="flex items-center justify-between">
              <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
                Waktu
              </span>
              <Timer
                className={`w-3.5 h-3.5 ${
                  timeLeft <= 5 && isPlaying ? "animate-spin text-rose-400" : "text-gray-400"
                }`}
              />
            </div>
            <span
              className={`text-3xl font-extrabold mt-0.5 ${
                timeLeft <= 5 && isPlaying ? "text-rose-400" : "text-white"
              }`}
            >
              {timeLeft}s
            </span>
          </div>

          <div className="col-span-2 sm:col-span-1 bg-black/40 border border-white/10 rounded-xl p-3 flex flex-col justify-between">
            <span className="text-gray-400 text-xs font-medium uppercase tracking-wider">
              Matriks Grid
            </span>
            <span className="text-sm font-bold text-cyan-400 mt-1">
              {gridSize}x{gridSize} ({totalTiles} Kotak)
            </span>
          </div>
        </div>
      </div>

      {/* MAIN GAME BOARD AREA */}
      <div className="relative z-10 w-full max-w-[480px] aspect-square mx-auto bg-black/50 border border-white/10 rounded-2xl p-2.5 sm:p-4 shadow-inner flex items-center justify-center overflow-hidden">
        {/* Active Grid Tiles */}
        <div
          className={`w-full h-full grid ${
            gridSize >= 10 ? "gap-1 sm:gap-1.5" : "gap-1.5 sm:gap-2"
          } transition-all duration-300`}
          style={{
            gridTemplateColumns: `repeat(${gridSize}, minmax(0, 1fr))`,
            gridTemplateRows: `repeat(${gridSize}, minmax(0, 1fr))`,
          }}
        >
          {Array.from({ length: totalTiles }, (_, index) => {
            const isTarget = index === targetIndex;
            const tileBg = isTarget ? colors.targetColor : colors.baseColor;
            const cornerRadius =
              gridSize <= 3
                ? "rounded-2xl"
                : gridSize <= 5
                ? "rounded-xl"
                : gridSize <= 8
                ? "rounded-lg"
                : gridSize <= 12
                ? "rounded-sm"
                : "rounded-[2px]";

            return (
              <motion.button
                key={`${gridSize}-${index}`}
                whileHover={isPlaying ? { scale: 1.03 } : {}}
                whileTap={isPlaying ? { scale: 0.94 } : {}}
                onClick={() => handleTileClick(index)}
                disabled={!isPlaying}
                className={`w-full h-full cursor-pointer transition-shadow shadow-sm active:shadow-none focus:outline-none ${cornerRadius}`}
                style={{
                  backgroundColor: tileBg,
                }}
              />
            );
          })}
        </div>

        {/* Penalty Notification Overlay */}
        <AnimatePresence>
          {penaltyFlash && (
            <motion.div
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 flex items-center justify-center bg-rose-950/40 backdrop-blur-xs pointer-events-none z-20"
            >
              <div className="px-4 py-2 rounded-xl bg-rose-600/90 text-white text-sm font-extrabold shadow-lg flex items-center gap-1.5">
                <AlertCircle className="w-4 h-4" />
                <span>Salah! -1 Detik</span>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* START SCREEN OVERLAY */}
        <AnimatePresence>
          {!isPlaying && !isGameOver && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/85 backdrop-blur-md text-center"
            >
              <div className="w-16 h-16 rounded-2xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-center text-cyan-400 mb-4 shadow-[0_0_20px_rgba(6,182,212,0.2)]">
                <Eye className="w-8 h-8" />
              </div>

              <h3 className="text-xl sm:text-2xl font-bold text-white mb-2">
                Uji Ketajaman Persepsi Warna
              </h3>

              <p className="text-xs sm:text-sm text-gray-300 max-w-xs mb-6 leading-relaxed">
                Temukan satu kotak yang memiliki warna berbeda. Semakin tinggi skor, perbedaannya semakin tipis!
              </p>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-cyan-400 via-teal-400 to-emerald-400 hover:brightness-110 shadow-lg shadow-cyan-500/30 flex items-center gap-2 cursor-pointer"
              >
                <Play className="w-4 h-4 fill-slate-950" />
                <span>Mulai Main Sekarang</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>

        {/* GAME OVER SCREEN OVERLAY */}
        <AnimatePresence>
          {isGameOver && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 z-30 flex flex-col items-center justify-center p-6 bg-slate-950/90 backdrop-blur-md text-center"
            >
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs font-bold mb-3">
                <Timer className="w-3.5 h-3.5" />
                <span>Waktu Habis!</span>
              </div>

              <h2 className="text-3xl sm:text-4xl font-black text-white tracking-tight mb-1">
                Waktu Habis!
              </h2>

              <div className="my-3 py-2 px-6 rounded-2xl bg-white/5 border border-white/10 flex flex-col items-center">
                <span className="text-xs text-gray-400 uppercase font-semibold">Skor Akhir</span>
                <span className="text-5xl font-black text-white">{score}</span>
              </div>

              {/* Assessment Rank */}
              <div className="mb-5 max-w-xs">
                <div
                  className={`text-sm font-extrabold flex items-center justify-center gap-1.5 ${
                    getVisionRank(score).color
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {getVisionRank(score).title} ({getVisionRank(score).badge})
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-1 leading-snug">
                  {getVisionRank(score).description}
                </p>
              </div>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={startGame}
                className="px-6 py-3 rounded-xl font-bold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 shadow-lg shadow-amber-400/30 flex items-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4" />
                <span>Main Lagi</span>
              </motion.button>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* FOOTER TIPS */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-cyan-400" />
          <span>Setiap tebakan salah: <strong className="text-rose-400">-1 Detik</strong></span>
        </span>
        <span>Durasi: 30 Detik</span>
      </div>
    </div>
  );
}
