"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Palette,
  Timer,
  Sparkles,
  RotateCcw,
  CheckCircle2,
  Sliders,
  Award,
  Play,
  Zap,
  Target,
} from "lucide-react";

type GameState = "start" | "memorize" | "guess" | "result";

interface HSLColor {
  h: number;
  s: number;
  l: number;
}

export default function ColorMemoryGame() {
  // ==========================================================================
  // # 1. STATE MANAGEMENT
  // ==========================================================================
  const [gameState, setGameState] = useState<GameState>("start");
  const [targetColor, setTargetColor] = useState<HSLColor>(() => ({
    h: Math.floor(Math.random() * 360),
    s: Math.floor(Math.random() * 50) + 40,
    l: Math.floor(Math.random() * 40) + 30,
  }));
  const [userColor, setUserColor] = useState<HSLColor>({ h: 180, s: 50, l: 50 });
  const [timeLeft, setTimeLeft] = useState<number>(5);
  const [score, setScore] = useState<number>(0);
  const [highScore, setHighScore] = useState<number>(0);

  const timerRef = useRef<NodeJS.Timeout | null>(null);

  // ==========================================================================
  // # 2. GAME PHASES & LOGIC
  // ==========================================================================

  // START PHASE -> MEMORIZE PHASE
  const handleStartGame = () => {
    // Randomize across the full 0-360 degree color wheel, vivid saturation (40-90%), and balanced lightness (30-70%)
    const randomHue = Math.floor(Math.random() * 360);
    const randomSat = Math.floor(Math.random() * 50) + 40;
    const randomLight = Math.floor(Math.random() * 40) + 30;

    const newTarget: HSLColor = {
      h: randomHue,
      s: randomSat,
      l: randomLight,
    };

    setTargetColor(newTarget);
    setUserColor({ h: 180, s: 50, l: 50 });
    setTimeLeft(5);
    setGameState("memorize");
  };

  // MEMORIZE 5s COUNTDOWN TIMER
  useEffect(() => {
    if (gameState !== "memorize") return;

    timerRef.current = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          if (timerRef.current) clearInterval(timerRef.current);
          setGameState("guess");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [gameState]);

  // GUESS PHASE -> SUBMIT GUESS -> RESULT
  const handleLockAnswer = () => {
    // Calculate circular Hue difference (e.g. 359 vs 1 is 2 degrees apart)
    const rawHueDiff = Math.abs(targetColor.h - userColor.h);
    const circularHueDiff = Math.min(rawHueDiff, 360 - rawHueDiff);
    const huePercentError = (circularHueDiff / 180) * 100;

    const satError = Math.abs(targetColor.s - userColor.s);
    const lightError = Math.abs(targetColor.l - userColor.l);

    // Accuracy calculation based on prompt specifications
    const totalError = (huePercentError + satError + lightError) / 3;
    const calculatedAccuracy = Math.max(0, Math.min(100, Math.round((100 - totalError) * 10) / 10));

    setScore(calculatedAccuracy);
    if (calculatedAccuracy > highScore) {
      setHighScore(calculatedAccuracy);
    }
    setGameState("result");
  };

  // Performance Rating Badge
  const getRating = (accuracy: number) => {
    if (accuracy >= 95) {
      return {
        title: "Master Spektroskopi!",
        badge: "Sempurna (95%+)",
        color: "text-purple-400",
        description: "Memori visual dan kepekaan warna Anda mendekati instrumen digital profesional!",
      };
    }
    if (accuracy >= 85) {
      return {
        title: "Alkemis Warna Handal",
        badge: "Sangat Akurat (85-94%)",
        color: "text-emerald-400",
        description: "Luar biasa! Racikan warna Anda sangat mendekati target asli.",
      };
    }
    if (accuracy >= 70) {
      return {
        title: "Persepsi Tajam",
        badge: "Bagus (70-84%)",
        color: "text-cyan-400",
        description: "Hebat! Anda mampu mengingat nuansa dan tonalitas warna dengan baik.",
      };
    }
    if (accuracy >= 50) {
      return {
        title: "Pengamat Pemula",
        badge: "Cukup (50-69%)",
        color: "text-amber-400",
        description: "Bagus untuk pemula! Perhatikan perbedaan saturasi dan intensitas cahaya.",
      };
    }
    return {
      title: "Perlu Latihan",
      badge: "Latihan Lagi (<50%)",
      color: "text-rose-400",
      description: "Jangan menyerah! Coba fokus pada rona warna utama terlebih dahulu.",
    };
  };

  const targetHslString = `hsl(${targetColor.h}, ${targetColor.s}%, ${targetColor.l}%)`;
  const userHslString = `hsl(${userColor.h}, ${userColor.s}%, ${userColor.l}%)`;

  return (
    <div className="relative w-full max-w-xl mx-auto bg-[#1a1a24] border border-white/10 rounded-2xl p-6 sm:p-8 backdrop-blur-xl shadow-2xl overflow-hidden transition-all duration-300">
      {/* Ambient Glow */}
      <div className="absolute -top-24 -left-24 w-60 h-60 bg-fuchsia-500/10 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute -bottom-24 -right-24 w-60 h-60 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

      {/* HEADER SECTION */}
      <div className="relative z-10 flex items-center justify-between gap-4 mb-6 pb-4 border-b border-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-fuchsia-500/10 border border-fuchsia-500/30 text-fuchsia-400 text-xs font-bold mb-2">
            <Palette className="w-3.5 h-3.5" />
            <span>SVA Visual Memory • Color Match</span>
          </div>
          <h2 className="text-xl sm:text-2xl font-bold text-white tracking-tight">
            Tebak & Racik Warna HSL
          </h2>
        </div>

        {highScore > 0 && (
          <div className="flex items-center gap-1.5 text-xs text-amber-400 font-bold bg-amber-400/10 px-3 py-1.5 rounded-xl border border-amber-400/30">
            <Award className="w-3.5 h-3.5" />
            <span>Skor Terbaik: {highScore}%</span>
          </div>
        )}
      </div>

      {/* =====================================================================
          PHASE 1: START SCREEN
          ===================================================================== */}
      <AnimatePresence mode="wait">
        {gameState === "start" && (
          <motion.div
            key="start-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-col items-center justify-center text-center py-6 space-y-6"
          >
            <div className="w-20 h-20 rounded-3xl bg-gradient-to-tr from-fuchsia-500 via-pink-500 to-cyan-400 p-0.5 shadow-[0_0_30px_rgba(217,70,239,0.3)]">
              <div className="w-full h-full bg-[#13131a] rounded-[22px] flex items-center justify-center text-white">
                <Palette className="w-9 h-9 text-fuchsia-400 animate-pulse" />
              </div>
            </div>

            <div className="max-w-md space-y-2">
              <h3 className="text-xl font-extrabold text-white">
                Uji Daya Ingat & Spektrum Visual
              </h3>
              <p className="text-xs sm:text-sm text-gray-400 leading-relaxed">
                Anda memiliki waktu <strong className="text-fuchsia-400">5 detik</strong> untuk menghafal warna target. Setelah itu, racik kembali warna tersebut semirip mungkin menggunakan slider HSL!
              </p>
            </div>

            <div className="grid grid-cols-3 gap-3 w-full max-w-sm pt-2">
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">1. Hue</span>
                <span className="text-xs font-bold text-cyan-400">Rona (0°-360°)</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">2. Saturation</span>
                <span className="text-xs font-bold text-fuchsia-400">Kepekatan (0-100%)</span>
              </div>
              <div className="p-3 bg-white/5 border border-white/10 rounded-xl text-center">
                <span className="text-[10px] text-gray-400 uppercase font-bold block">3. Lightness</span>
                <span className="text-xs font-bold text-amber-400">Terang (0-100%)</span>
              </div>
            </div>

            <motion.button
              whileHover={{ scale: 1.04 }}
              whileTap={{ scale: 0.96 }}
              onClick={handleStartGame}
              className="mt-4 px-8 py-3.5 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-fuchsia-400 via-pink-400 to-cyan-400 hover:brightness-110 shadow-lg shadow-fuchsia-500/25 flex items-center gap-2 cursor-pointer"
            >
              <Play className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Mulai Main Sekarang</span>
            </motion.button>
          </motion.div>
        )}

        {/* =====================================================================
            PHASE 2: MEMORIZE SCREEN
            ===================================================================== */}
        {gameState === "memorize" && (
          <motion.div
            key="memorize-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 flex flex-col items-center space-y-5"
          >
            {/* Top Indicator */}
            <div className="flex items-center justify-between w-full">
              <span className="text-xs font-bold text-fuchsia-400 flex items-center gap-1.5 uppercase tracking-wider">
                <Target className="w-4 h-4 animate-spin" />
                <span>Hafalkan Warna Target!</span>
              </span>

              <div className="flex items-center gap-2 px-3 py-1 rounded-xl bg-rose-500/20 border border-rose-500/40 text-rose-400 text-xs font-black">
                <Timer className="w-4 h-4 animate-pulse" />
                <span>{timeLeft} Detik</span>
              </div>
            </div>

            {/* Massive Block of Target Color */}
            <div className="w-full aspect-[4/3] rounded-2xl overflow-hidden border border-white/20 shadow-2xl relative flex items-center justify-center group">
              <div
                className="absolute inset-0 transition-colors duration-300"
                style={{ backgroundColor: targetHslString }}
              />

              {/* Pulsing Countdown Badge in center */}
              <motion.div
                key={timeLeft}
                initial={{ scale: 1.4, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.7, opacity: 0 }}
                className="relative z-10 px-5 py-3 rounded-2xl bg-black/60 backdrop-blur-md border border-white/20 flex flex-col items-center justify-center text-white shadow-2xl"
              >
                <span className="text-4xl font-black">{timeLeft}</span>
                <span className="text-[10px] uppercase font-bold tracking-widest text-gray-300 mt-1">
                  Ingat Warna Ini!
                </span>
              </motion.div>
            </div>

            {/* Progress Bar for 5s countdown */}
            <div className="w-full bg-slate-800 h-2 rounded-full overflow-hidden">
              <motion.div
                initial={{ width: "100%" }}
                animate={{ width: "0%" }}
                transition={{ duration: 5, ease: "linear" }}
                className="h-full bg-gradient-to-r from-fuchsia-500 to-rose-500"
              />
            </div>
          </motion.div>
        )}

        {/* =====================================================================
            PHASE 3: GUESS & MIX COLOR SCREEN
            ===================================================================== */}
        {gameState === "guess" && (
          <motion.div
            key="guess-screen"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 space-y-6"
          >
            {/* Header / Instructions */}
            <div className="flex items-center justify-between">
              <div>
                <h3 className="text-sm font-bold text-white flex items-center gap-1.5">
                  <Sliders className="w-4 h-4 text-cyan-400" />
                  <span>Racik Kembali Warna Target</span>
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">
                  Sesuaikan slider hingga menyerupai warna yang Anda ingat
                </p>
              </div>

              <span className="text-xs font-mono font-bold px-3 py-1 rounded-lg bg-black/40 border border-white/10 text-cyan-300">
                HSL({userColor.h}, {userColor.s}%, {userColor.l}%)
              </span>
            </div>

            {/* Current Mixed User Color Preview */}
            <div className="w-full h-36 rounded-2xl overflow-hidden border border-white/20 shadow-xl relative transition-all duration-150 flex items-end p-3">
              <div
                className="absolute inset-0 transition-colors duration-150"
                style={{ backgroundColor: userHslString }}
              />
              <div className="relative z-10 px-3 py-1 rounded-lg bg-black/60 backdrop-blur-md text-[11px] font-bold text-white border border-white/10">
                Warna Racikan Anda
              </div>
            </div>

            {/* Modern Range Sliders */}
            <div className="space-y-4 bg-black/40 border border-white/10 rounded-2xl p-5 shadow-inner">
              {/* 1. HUE SLIDER (0-360) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-cyan-400" />
                    <span>Hue (Rona Warna)</span>
                  </span>
                  <span className="font-mono text-cyan-400">{userColor.h}°</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="360"
                  value={userColor.h}
                  onChange={(e) =>
                    setUserColor((prev) => ({ ...prev, h: parseInt(e.target.value) }))
                  }
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background:
                      "linear-gradient(to right, #ff0000 0%, #ffff00 17%, #00ff00 33%, #00ffff 50%, #0000ff 67%, #ff00ff 83%, #ff0000 100%)",
                  }}
                />
              </div>

              {/* 2. SATURATION SLIDER (0-100) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-fuchsia-400" />
                    <span>Saturation (Kepekatan)</span>
                  </span>
                  <span className="font-mono text-fuchsia-400">{userColor.s}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userColor.s}
                  onChange={(e) =>
                    setUserColor((prev) => ({ ...prev, s: parseInt(e.target.value) }))
                  }
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, hsl(${userColor.h}, 0%, ${userColor.l}%), hsl(${userColor.h}, 100%, ${userColor.l}%))`,
                  }}
                />
              </div>

              {/* 3. LIGHTNESS SLIDER (0-100) */}
              <div className="space-y-1.5">
                <div className="flex justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1.5">
                    <span className="w-2.5 h-2.5 rounded-full bg-amber-400" />
                    <span>Lightness (Kecerahan)</span>
                  </span>
                  <span className="font-mono text-amber-400">{userColor.l}%</span>
                </div>
                <input
                  type="range"
                  min="0"
                  max="100"
                  value={userColor.l}
                  onChange={(e) =>
                    setUserColor((prev) => ({ ...prev, l: parseInt(e.target.value) }))
                  }
                  className="w-full h-3 rounded-lg appearance-none cursor-pointer focus:outline-none"
                  style={{
                    background: `linear-gradient(to right, #000000 0%, hsl(${userColor.h}, ${userColor.s}%, 50%) 50%, #ffffff 100%)`,
                  }}
                />
              </div>
            </div>

            {/* Lock Answer Button */}
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={handleLockAnswer}
              className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-emerald-400 via-teal-400 to-cyan-400 hover:brightness-110 shadow-lg shadow-emerald-500/25 flex items-center justify-center gap-2 cursor-pointer"
            >
              <CheckCircle2 className="w-4 h-4 text-slate-950" />
              <span>Kunci Jawaban & Cek Akurasi</span>
            </motion.button>
          </motion.div>
        )}

        {/* =====================================================================
            PHASE 4: RESULT SCREEN
            ===================================================================== */}
        {gameState === "result" && (
          <motion.div
            key="result-screen"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            className="relative z-10 space-y-6"
          >
            {/* Top Score Box */}
            <div className="p-6 rounded-2xl bg-black/40 border border-white/10 text-center space-y-2">
              <span className="text-xs uppercase font-bold text-gray-400 tracking-wider">
                Tingkat Keakuratan Memori
              </span>
              <div className="text-5xl sm:text-6xl font-black text-transparent bg-clip-text bg-gradient-to-r from-emerald-400 via-cyan-400 to-fuchsia-400">
                {score}%
              </div>

              <div className="pt-2">
                <span
                  className={`text-sm font-extrabold flex items-center justify-center gap-1.5 ${
                    getRating(score).color
                  }`}
                >
                  <Sparkles className="w-4 h-4" />
                  <span>
                    {getRating(score).title} ({getRating(score).badge})
                  </span>
                </span>
                <p className="text-xs text-gray-400 mt-1 max-w-sm mx-auto">
                  {getRating(score).description}
                </p>
              </div>
            </div>

            {/* Side-by-Side Color Comparison */}
            <div className="grid grid-cols-2 gap-4">
              {/* Target Color Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1.5 text-emerald-400">
                    <Target className="w-3.5 h-3.5" />
                    <span>Warna Target</span>
                  </span>
                  <span className="font-mono text-[11px] text-gray-400">
                    {targetColor.h}°, {targetColor.s}%, {targetColor.l}%
                  </span>
                </div>
                <div
                  className="w-full aspect-[4/3] rounded-2xl border border-white/15 shadow-xl relative overflow-hidden"
                  style={{ backgroundColor: targetHslString }}
                />
              </div>

              {/* User Color Block */}
              <div className="space-y-2">
                <div className="flex items-center justify-between text-xs font-bold text-gray-300">
                  <span className="flex items-center gap-1.5 text-cyan-400">
                    <Palette className="w-3.5 h-3.5" />
                    <span>Racikan Anda</span>
                  </span>
                  <span className="font-mono text-[11px] text-gray-400">
                    {userColor.h}°, {userColor.s}%, {userColor.l}%
                  </span>
                </div>
                <div
                  className="w-full aspect-[4/3] rounded-2xl border border-white/15 shadow-xl relative overflow-hidden"
                  style={{ backgroundColor: userHslString }}
                />
              </div>
            </div>

            {/* Action Buttons */}
            <div className="pt-2 flex items-center justify-center gap-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                onClick={handleStartGame}
                className="w-full py-3.5 px-6 rounded-xl font-extrabold text-sm text-slate-950 bg-gradient-to-r from-amber-400 to-yellow-400 hover:brightness-110 shadow-lg shadow-amber-400/25 flex items-center justify-center gap-2 cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-slate-950" />
                <span>Main Lagi (Uji Warna Baru)</span>
              </motion.button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* FOOTER METRICS */}
      <div className="relative z-10 mt-6 pt-4 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
        <span className="flex items-center gap-1.5">
          <Zap className="w-3.5 h-3.5 text-fuchsia-400" />
          <span>Metode: Spektrum Warna HSL (CIE Color Memory)</span>
        </span>
        <span>SVA Dev Games</span>
      </div>
    </div>
  );
}
