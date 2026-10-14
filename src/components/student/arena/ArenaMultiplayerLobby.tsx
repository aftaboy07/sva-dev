"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import {
  ArenaTopicId,
  ArenaTopicPack,
  StudentSocialPeer,
} from "@/types";
import { ARENA_TOPIC_PACKS } from "@/data/arenaData";
import {
  Mic,
  MicOff,
  Swords,
  CheckCircle2,
  Clock,
  Volume2,
  Sparkles,
  ArrowLeft,
  Radio,
  Users,
  ShieldCheck,
  Zap,
} from "lucide-react";
import { playCountdownBeep } from "@/utils/arenaSound";

interface ArenaMultiplayerLobbyProps {
  matchId: string;
  playerA: StudentSocialPeer; // Logged-in user
  playerB: StudentSocialPeer; // Opponent
  isHost: boolean;
  onExitLobby: () => void;
  onStartGame: (topicId: ArenaTopicId) => void;
}

export default function ArenaMultiplayerLobby({
  matchId,
  playerA,
  playerB,
  isHost,
  onExitLobby,
  onStartGame,
}: ArenaMultiplayerLobbyProps) {
  const [selectedTopicId, setSelectedTopicId] = useState<ArenaTopicId>("sains_ipa");
  const [isPlayerAAgreed, setIsPlayerAAgreed] = useState(false);
  const [isPlayerBAgreed, setIsPlayerBAgreed] = useState(false);

  // Microphone States
  const [isMicOn, setIsMicOn] = useState(false);
  const [micVolume, setMicVolume] = useState(0); // 0 - 100
  const [isOpponentSpeaking, setIsOpponentSpeaking] = useState(false);
  const [isSimulatedOpponent, setIsSimulatedOpponent] = useState(false);

  // Countdown State
  const [countdown, setCountdown] = useState<number | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);
  const audioContextRef = useRef<AudioContext | null>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const mediaStreamRef = useRef<MediaStream | null>(null);
  const animationFrameRef = useRef<number | null>(null);

  // Safe Broadcast sender helper
  const postBroadcast = useCallback((payload: Record<string, unknown>) => {
    try {
      if (channelRef.current) {
        channelRef.current.postMessage({ matchId, ...payload });
      }
    } catch {}
  }, [matchId]);

  // Set up BroadcastChannel
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("sva_dev_arena");
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data || data.matchId !== matchId) return;

        if (data.type === "SELECT_TOPIC") {
          setSelectedTopicId(data.topicId);
          setIsPlayerAAgreed(false);
          setIsPlayerBAgreed(false);
        } else if (data.type === "AGREE_TOPIC") {
          if (data.studentId === playerB.id) {
            setIsPlayerBAgreed(data.agreed);
          } else if (data.studentId === playerA.id) {
            setIsPlayerAAgreed(data.agreed);
          }
        } else if (data.type === "MIC_STATUS") {
          if (data.studentId === playerB.id) {
            setIsOpponentSpeaking(data.isSpeaking);
          }
        } else if (data.type === "LOBBY_EXIT") {
          alert(`Temanmu (${playerB.name}) telah meninggalkan lobby.`);
          onExitLobby();
        }
      };
    } catch {
      // Fallback if BroadcastChannel unavailable
    }

    return () => {
      if (channel) {
        try {
          channel.close();
        } catch {}
      }
    };
  }, [matchId, playerA.id, playerB.id, playerB.name, onExitLobby]);

  // Microphone Stream and Volume Detection
  const stopMicrophone = useCallback(() => {
    if (animationFrameRef.current) {
      cancelAnimationFrame(animationFrameRef.current);
      animationFrameRef.current = null;
    }
    if (mediaStreamRef.current) {
      mediaStreamRef.current.getTracks().forEach((track) => track.stop());
      mediaStreamRef.current = null;
    }
    if (audioContextRef.current && audioContextRef.current.state !== "closed") {
      audioContextRef.current.close().catch(() => {});
      audioContextRef.current = null;
    }
    setIsMicOn(false);
    setMicVolume(0);
    postBroadcast({ type: "MIC_STATUS", studentId: playerA.id, isSpeaking: false });
  }, [playerA.id, postBroadcast]);

  const startMicrophone = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({
        audio: { echoCancellation: true, noiseSuppression: true },
      });
      mediaStreamRef.current = stream;

      const AudioCtxClass =
        window.AudioContext ||
        (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      const ctx = new AudioCtxClass();
      audioContextRef.current = ctx;

      const source = ctx.createMediaStreamSource(stream);
      const analyser = ctx.createAnalyser();
      analyser.fftSize = 256;
      source.connect(analyser);
      analyserRef.current = analyser;

      setIsMicOn(true);

      const bufferLength = analyser.frequencyBinCount;
      const dataArray = new Uint8Array(bufferLength);

      let lastSpeaking = false;

      const updateVolume = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteFrequencyData(dataArray);

        let sum = 0;
        for (let i = 0; i < bufferLength; i++) {
          sum += dataArray[i];
        }
        const avg = sum / bufferLength;
        const normalized = Math.min(100, Math.round((avg / 128) * 100));
        setMicVolume(normalized);

        const isSpeakingNow = normalized > 18;
        if (isSpeakingNow !== lastSpeaking) {
          lastSpeaking = isSpeakingNow;
          postBroadcast({
            type: "MIC_STATUS",
            studentId: playerA.id,
            isSpeaking: isSpeakingNow,
          });
        }

        animationFrameRef.current = requestAnimationFrame(updateVolume);
      };

      updateVolume();
    } catch {
      // Fallback: If hardware/permission fails, enable simulated mic toggle
      setIsMicOn(true);
      setMicVolume(35);
      postBroadcast({
        type: "MIC_STATUS",
        studentId: playerA.id,
        isSpeaking: true,
      });
    }
  };

  const handleToggleMic = () => {
    if (isMicOn) {
      stopMicrophone();
    } else {
      startMicrophone();
    }
  };

  // Clean up mic on unmount
  useEffect(() => {
    return () => {
      stopMicrophone();
    };
  }, [stopMicrophone]);

  // Topic Selection Handler
  const handleSelectTopic = (topicId: ArenaTopicId) => {
    if (countdown !== null) return;
    setSelectedTopicId(topicId);
    setIsPlayerAAgreed(false);
    setIsPlayerBAgreed(false);
    postBroadcast({ type: "SELECT_TOPIC", topicId });
  };

  // Agreement Toggle
  const handleTogglePlayerAAgree = () => {
    if (countdown !== null) return;
    const nextAgreed = !isPlayerAAgreed;
    setIsPlayerAAgreed(nextAgreed);
    postBroadcast({
      type: "AGREE_TOPIC",
      studentId: playerA.id,
      agreed: nextAgreed,
    });

    // If simulated opponent mode is enabled or single-tab preview, simulate player B agreement after 800ms
    if (nextAgreed && isSimulatedOpponent) {
      setTimeout(() => {
        setIsPlayerBAgreed(true);
        postBroadcast({
          type: "AGREE_TOPIC",
          studentId: playerB.id,
          agreed: true,
        });
      }, 700);
    }
  };

  // Check if both agreed -> trigger 3-2-1 countdown
  useEffect(() => {
    if (isPlayerAAgreed && isPlayerBAgreed && countdown === null) {
      // Start Countdown
      let count = 3;
      setCountdown(3);
      playCountdownBeep(false);

      const interval = setInterval(() => {
        count -= 1;
        if (count > 0) {
          setCountdown(count);
          playCountdownBeep(false);
        } else if (count === 0) {
          setCountdown(0);
          playCountdownBeep(true);
        } else {
          clearInterval(interval);
          onStartGame(selectedTopicId);
        }
      }, 1000);

      return () => clearInterval(interval);
    }
  }, [isPlayerAAgreed, isPlayerBAgreed, countdown, onStartGame, selectedTopicId]);

  const activeTopic = ARENA_TOPIC_PACKS.find((p) => p.id === selectedTopicId) || ARENA_TOPIC_PACKS[0];

  return (
    <div className="relative w-full max-w-5xl mx-auto space-y-6">
      {/* 3-2-1 Countdown Modal Overlay */}
      <AnimatePresence>
        {countdown !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex flex-col items-center justify-center bg-black/85 backdrop-blur-xl"
          >
            <motion.div
              key={countdown}
              initial={{ scale: 0.3, opacity: 0 }}
              animate={{ scale: 1.1, opacity: 1 }}
              exit={{ scale: 1.8, opacity: 0 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="text-center space-y-4"
            >
              <div className="w-40 h-40 rounded-full mx-auto bg-gradient-to-tr from-cyan-500 to-emerald-400 p-1 flex items-center justify-center shadow-2xl shadow-cyan-500/50">
                <div className="w-full h-full rounded-full bg-[#101018] flex items-center justify-center">
                  <span className="text-7xl font-black text-transparent bg-clip-text bg-gradient-to-r from-cyan-300 to-emerald-400">
                    {countdown === 0 ? "MULAI!" : countdown}
                  </span>
                </div>
              </div>
              <h3 className="text-xl font-bold text-white tracking-wider uppercase">
                {countdown === 0 ? "⚔️ Bersiap Menjodohkan Kartu!" : "Memulai Duel Pasang Konsep..."}
              </h3>
              <p className="text-sm text-cyan-300 font-medium">
                Paket: {activeTopic.name} (3 Ronde - 12 Pasang)
              </p>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Lobby Header */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-[#1a1a24]/90 border border-white/10 backdrop-blur-md">
        <div className="flex items-center gap-3">
          <button
            onClick={() => {
              postBroadcast({ type: "LOBBY_EXIT" });
              onExitLobby();
            }}
            className="p-2 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white transition-colors flex items-center gap-1.5 text-xs font-semibold"
          >
            <ArrowLeft className="w-4 h-4" />
            Keluar Lobby
          </button>
          <div>
            <h2 className="text-base font-bold text-white flex items-center gap-2">
              Lobby Multiplayer MTs
              <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-mono">
                <Radio className="w-3 h-3 text-emerald-400 animate-pulse" />
                Live Sync
              </span>
            </h2>
            <p className="text-xs text-gray-400">
              Kode Sesi: <span className="font-mono text-cyan-400">{matchId}</span>
            </p>
          </div>
        </div>

        {/* 1-Tab / Simulated Opponent Toggle */}
        <div className="flex items-center gap-2 text-xs">
          <button
            type="button"
            onClick={() => setIsSimulatedOpponent(!isSimulatedOpponent)}
            className={`px-3 py-1.5 rounded-lg border transition-all flex items-center gap-1.5 text-[11px] font-semibold ${
              isSimulatedOpponent
                ? "bg-purple-500/20 text-purple-300 border-purple-500/40 shadow-sm"
                : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
            }`}
            title="Aktifkan simulasi respon lawan jika kamu menguji di 1 tab browser"
          >
            <Zap className="w-3.5 h-3.5" />
            {isSimulatedOpponent ? "⚡ Simulasi 1-Tab: Aktif" : "Mode 2-Tab (Peer Real)"}
          </button>
        </div>
      </div>

      {/* Duel Player Cards (Player A vs Player B) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Player A Card (You) */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#1a1a26]/90 to-[#14141d]/90 border border-cyan-500/30 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-cyan-500/20 text-cyan-300 text-[10px] font-bold uppercase tracking-wider">
            {isHost ? "Host Pertandingan" : "Player"}
          </div>

          <div className="flex items-center gap-4">
            {/* Avatar with dynamic Audio/Mic ring */}
            <div className="relative">
              <div
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  isMicOn && micVolume > 15
                    ? "border-emerald-400 ring-4 ring-emerald-500/40 shadow-lg shadow-emerald-500/30 scale-105"
                    : "border-cyan-400/80 shadow-md shadow-cyan-500/20"
                }`}
              >
                <Image src={playerA.avatar} alt={playerA.name} fill className="object-cover" />
              </div>
              {/* Mic Status Icon Badge */}
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-[#14141d] ${
                  isMicOn ? "bg-emerald-500 text-white" : "bg-rose-500 text-white"
                }`}
              >
                {isMicOn ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-cyan-400 uppercase tracking-wider">
                Kamu
              </span>
              <h3 className="font-bold text-sm text-white truncate">{playerA.name}</h3>
              <p className="text-xs text-gray-400">{playerA.grade} • NIS {playerA.nis}</p>

              {/* Ready Indicator */}
              <div className="mt-2 flex items-center gap-2">
                {isPlayerAAgreed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Siap Bertanding
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    <Clock className="w-3 h-3" />
                    Memilih Topik
                  </span>
                )}
              </div>
            </div>
          </div>

          {/* Mic Controls Bar */}
          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
            <button
              type="button"
              onClick={handleToggleMic}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold flex items-center gap-2 transition-all ${
                isMicOn
                  ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                  : "bg-white/5 text-gray-400 border border-white/10 hover:text-white"
              }`}
            >
              {isMicOn ? <Mic className="w-3.5 h-3.5 text-emerald-400" /> : <MicOff className="w-3.5 h-3.5" />}
              {isMicOn ? "🎤 Mic Aktif (Bicara)" : "🔇 Nyalakan Mic"}
            </button>

            {isMicOn && (
              <div className="flex items-center gap-1.5">
                <Volume2 className="w-3.5 h-3.5 text-emerald-400" />
                <div className="w-20 h-2 bg-slate-800 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-gradient-to-r from-emerald-500 to-cyan-400 transition-all duration-75"
                    style={{ width: `${Math.min(100, micVolume * 2)}%` }}
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Player B Card (Opponent) */}
        <div className="relative p-5 rounded-2xl bg-gradient-to-br from-[#1a1a26]/90 to-[#14141d]/90 border border-purple-500/30 shadow-xl overflow-hidden">
          <div className="absolute top-0 right-0 px-3 py-1 rounded-bl-xl bg-purple-500/20 text-purple-300 text-[10px] font-bold uppercase tracking-wider">
            Lawan Tanding
          </div>

          <div className="flex items-center gap-4">
            {/* Avatar with speaking ring */}
            <div className="relative">
              <div
                className={`relative w-16 h-16 rounded-full overflow-hidden border-2 transition-all duration-300 ${
                  isOpponentSpeaking
                    ? "border-emerald-400 ring-4 ring-emerald-500/40 shadow-lg shadow-emerald-500/30 scale-105"
                    : "border-purple-400/80 shadow-md shadow-purple-500/20"
                }`}
              >
                <Image src={playerB.avatar} alt={playerB.name} fill className="object-cover" />
              </div>
              <div
                className={`absolute -bottom-1 -right-1 p-1 rounded-full border-2 border-[#14141d] ${
                  isOpponentSpeaking ? "bg-emerald-500 text-white" : "bg-slate-700 text-gray-400"
                }`}
              >
                {isOpponentSpeaking ? <Mic className="w-3 h-3" /> : <MicOff className="w-3 h-3" />}
              </div>
            </div>

            <div className="flex-1 min-w-0">
              <span className="text-[10px] font-semibold text-purple-400 uppercase tracking-wider">
                Rekan MTs
              </span>
              <h3 className="font-bold text-sm text-white truncate">{playerB.name}</h3>
              <p className="text-xs text-gray-400">{playerB.grade} • NIS {playerB.nis}</p>

              {/* Ready Indicator */}
              <div className="mt-2 flex items-center gap-2">
                {isPlayerBAgreed ? (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30 font-semibold">
                    <CheckCircle2 className="w-3 h-3" />
                    Siap Bertanding
                  </span>
                ) : (
                  <span className="inline-flex items-center gap-1 text-[11px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30 font-semibold">
                    <Clock className="w-3 h-3" />
                    Menunggu Persetujuan
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
            <span className="flex items-center gap-1.5">
              <ShieldCheck className="w-3.5 h-3.5 text-cyan-400" />
              Koneksi Peer Terverifikasi
            </span>
            <span className="text-[11px] font-mono text-purple-300">
              {isOpponentSpeaking ? "Sedang Berbicara..." : "Audio Standby"}
            </span>
          </div>
        </div>
      </div>

      {/* Topic Consensus Selection Section */}
      <div className="p-6 rounded-2xl bg-[#1a1a24]/90 border border-white/10 space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <Sparkles className="w-4 h-4 text-cyan-400" />
              Pilih Paket Soal Pasang Konsep (Konsensus Bersama)
            </h3>
            <p className="text-xs text-gray-400">
              Kedua santri harus menyetujui paket yang sama sebelum pertandingan dimulai (3 Ronde / 12 Pasangan).
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
            3 Paket Tersedia
          </span>
        </div>

        {/* 3 Topic Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {ARENA_TOPIC_PACKS.map((pack) => {
            const isSelected = selectedTopicId === pack.id;
            return (
              <div
                key={pack.id}
                onClick={() => handleSelectTopic(pack.id)}
                className={`relative p-4 rounded-xl border transition-all cursor-pointer text-left ${
                  isSelected
                    ? "bg-cyan-500/15 border-cyan-400/80 shadow-lg shadow-cyan-500/20 scale-[1.02]"
                    : "bg-[#14141d]/70 border-white/10 hover:border-white/20 hover:bg-[#14141d]"
                }`}
              >
                {isSelected && (
                  <div className="absolute -top-2 -right-2 p-1 rounded-full bg-cyan-500 text-black shadow-md">
                    <CheckCircle2 className="w-4 h-4" />
                  </div>
                )}

                <div className="flex items-center gap-2 mb-2">
                  <span className="text-2xl">{pack.icon}</span>
                  <div>
                    <h4 className="font-bold text-sm text-white">{pack.name}</h4>
                    <span className="text-[10px] text-cyan-300 font-mono">{pack.badge}</span>
                  </div>
                </div>

                <p className="text-xs text-gray-300 line-clamp-2 mb-3">{pack.description}</p>

                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-[11px] text-gray-400">
                  <span>3 Ronde</span>
                  <span className="font-mono text-cyan-300">12 Pasang Konsep</span>
                </div>
              </div>
            );
          })}
        </div>

        {/* Consensus Agreement Action Bar */}
        <div className="pt-4 border-t border-white/10 flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPlayerAAgreed ? "bg-emerald-400 shadow-sm shadow-emerald-400" : "bg-gray-600"
                }`}
              />
              <span className={isPlayerAAgreed ? "text-emerald-300 font-semibold" : "text-gray-400"}>
                Kamu {isPlayerAAgreed ? "Setuju" : "Belum Setuju"}
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div
                className={`w-3 h-3 rounded-full ${
                  isPlayerBAgreed ? "bg-emerald-400 shadow-sm shadow-emerald-400" : "bg-gray-600"
                }`}
              />
              <span className={isPlayerBAgreed ? "text-emerald-300 font-semibold" : "text-gray-400"}>
                {playerB.name.split(" ")[0]} {isPlayerBAgreed ? "Setuju" : "Belum Setuju"}
              </span>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={handleTogglePlayerAAgree}
              className={`px-5 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 transition-all shadow-lg ${
                isPlayerAAgreed
                  ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30"
                  : "bg-gradient-to-r from-cyan-500 to-emerald-500 text-slate-950 font-black hover:from-cyan-400 hover:to-emerald-400 hover:scale-[1.02] shadow-cyan-500/20"
              }`}
            >
              {isPlayerAAgreed ? (
                <>🔄 Minta Ganti Topik</>
              ) : (
                <>
                  <CheckCircle2 className="w-4 h-4" />
                  ✅ Setuju Main Topik Ini
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
