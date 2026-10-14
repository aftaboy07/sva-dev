"use client";

import React, { useState, useEffect, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Image from "next/image";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  StudentSocialPeer,
  SocialConnectionStatus,
  ArenaTopicId,
} from "@/types";
import { BASE_MTS_STUDENTS } from "@/data/arenaData";
import HeadToHeadProfileModal from "./arena/HeadToHeadProfileModal";
import ArenaMultiplayerLobby from "./arena/ArenaMultiplayerLobby";
import PasangKonsepGameEngine from "./arena/PasangKonsepGameEngine";
import { playSuccessChime } from "@/utils/arenaSound";
import {
  Users,
  Swords,
  BellRing,
  Eye,
  UserCheck,
  UserPlus,
  CheckCircle2,
  Clock,
  Sparkles,
  Trophy,
  Flame,
  Radio,
  BookCheck,
  ArrowRight,
  Shield,
  Zap,
  Volume2,
} from "lucide-react";

const STORAGE_KEY_PEERS = "sva_dev_arena_peers_v2";

export default function TabTemanArena() {
  const { currentUser } = useEduQuest();

  // Active persona for demonstration (Arif: 26071, Fatimatus: 26081, Naura: 26091)
  const [activePersonaNis, setActivePersonaNis] = useState<string>("26071");

  // All peers state
  const [peers, setPeers] = useState<StudentSocialPeer[]>([]);

  // Active view: "list" | "lobby" | "game"
  const [activeView, setActiveView] = useState<"list" | "lobby" | "game">("list");

  // Head-to-Head Modal state
  const [headToHeadPeer, setHeadToHeadPeer] = useState<StudentSocialPeer | null>(null);

  // Match / Lobby State
  const [currentMatchId, setCurrentMatchId] = useState<string>("");
  const [matchOpponent, setMatchOpponent] = useState<StudentSocialPeer | null>(null);
  const [isHost, setIsHost] = useState<boolean>(true);
  const [activeTopicId, setActiveTopicId] = useState<ArenaTopicId>("sains_ipa");

  // Incoming Invite State
  const [incomingInvite, setIncomingInvite] = useState<{
    matchId: string;
    from: StudentSocialPeer;
  } | null>(null);

  // Senggol Toast Notification State
  const [senggolToast, setSenggolToast] = useState<{
    fromName: string;
    message: string;
  } | null>(null);

  // Action feedback alert
  const [feedbackAlert, setFeedbackAlert] = useState<string | null>(null);

  const channelRef = useRef<BroadcastChannel | null>(null);

  // Helper to load or initialize peers
  const loadInitialPeers = useCallback((): StudentSocialPeer[] => {
    if (typeof window === "undefined") return [];

    try {
      const saved = localStorage.getItem(STORAGE_KEY_PEERS);
      if (saved) {
        return JSON.parse(saved);
      }
    } catch {}

    // Initial configuration:
    // Arif (26071) & Fatimatus (26081) are mutual
    // Naura (26091) is not followed initially
    const initial: StudentSocialPeer[] = BASE_MTS_STUDENTS.map((s) => {
      let connectionStatus: SocialConnectionStatus = "none";
      if (s.nis === "26071" || s.nis === "26081") {
        connectionStatus = "mutual";
      }
      return {
        ...s,
        connectionStatus,
      };
    });

    try {
      localStorage.setItem(STORAGE_KEY_PEERS, JSON.stringify(initial));
    } catch {}

    return initial;
  }, []);

  // Initialize peers state
  useEffect(() => {
    const data = loadInitialPeers();
    setPeers(data);
  }, [loadInitialPeers]);

  // Sync active persona with currentUser if matching NIS
  useEffect(() => {
    if (currentUser?.identifier && ["26071", "26081", "26091"].includes(currentUser.identifier)) {
      setActivePersonaNis(currentUser.identifier);
    }
  }, [currentUser]);

  // Current active student
  const activeStudent = peers.find((p) => p.nis === activePersonaNis) || peers[0] || {
    id: "std-26071",
    nis: "26071",
    name: "MOH. ARIF HIDAYATULLOH",
    grade: "Kelas 7 MTs",
    unit: "MTs" as const,
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    hasCompletedLatestTask: true,
    latestTaskTitle: "Studi Kasus Tekanan Hidrostatis",
    tasksCompletedCount: 6,
    gamesPlayedCount: 14,
    totalKnowledgeScore: 2650,
    connectionStatus: "mutual" as const,
    isOnline: true,
  };

  // Other peers (strictly same unit: MTs)
  const peerList = peers.filter((p) => p.nis !== activePersonaNis);

  // BroadcastChannel Setup for real-time inter-tab sync
  useEffect(() => {
    let channel: BroadcastChannel | null = null;
    try {
      channel = new BroadcastChannel("sva_dev_arena");
      channelRef.current = channel;

      channel.onmessage = (event) => {
        const data = event.data;
        if (!data) return;

        // 1. Senggol Notification received
        if (data.type === "SENGGOL") {
          if (data.toNis === activePersonaNis) {
            playSuccessChime();
            setSenggolToast({
              fromName: data.fromName,
              message: data.message,
            });
            setTimeout(() => {
              setSenggolToast(null);
            }, 7000);
          }
        }

        // 2. Incoming Arena Invite
        if (data.type === "ARENA_INVITE") {
          if (data.toId === activeStudent.id) {
            playSuccessChime();
            setIncomingInvite({
              matchId: data.matchId,
              from: data.from,
            });
          }
        }

        // 3. Invite Response (For Host)
        if (data.type === "ARENA_INVITE_RESPONSE") {
          if (data.toId === activeStudent.id) {
            if (data.accepted) {
              setFeedbackAlert(`🎉 ${data.from.name} menerima tantanganmu! Masuk ke lobby...`);
              setTimeout(() => setFeedbackAlert(null), 3000);
              setCurrentMatchId(data.matchId);
              setMatchOpponent(data.from);
              setIsHost(true);
              setActiveView("lobby");
            } else {
              setFeedbackAlert(`❌ ${data.from.name} menolak tantangan.`);
              setTimeout(() => setFeedbackAlert(null), 3000);
            }
          }
        }

        // 4. Social connection status update broadcast
        if (data.type === "PEERS_UPDATED") {
          const freshData = loadInitialPeers();
          setPeers(freshData);
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
  }, [activePersonaNis, activeStudent.id, loadInitialPeers]);

  // Save peers helper
  const savePeers = (updated: StudentSocialPeer[]) => {
    setPeers(updated);
    try {
      localStorage.setItem(STORAGE_KEY_PEERS, JSON.stringify(updated));
      if (channelRef.current) {
        channelRef.current.postMessage({ type: "PEERS_UPDATED" });
      }
    } catch {}
  };

  // Toggle Connection Status (+ Ikuti / Saling Mengikuti)
  const handleToggleFollow = (peerId: string) => {
    const updated = peers.map((p) => {
      if (p.id === peerId) {
        const nextStatus: SocialConnectionStatus =
          p.connectionStatus === "mutual" ? "none" : "mutual";
        return { ...p, connectionStatus: nextStatus };
      }
      return p;
    });
    savePeers(updated);
    setFeedbackAlert("Status pertemanan berhasil diperbarui.");
    setTimeout(() => setFeedbackAlert(null), 2500);
  };

  // Action: "👋 Senggol Teman"
  const handleSenggol = (peer: StudentSocialPeer) => {
    if (!activeStudent.hasCompletedLatestTask || peer.hasCompletedLatestTask) {
      return;
    }

    const message = `⚡ ${activeStudent.name} sudah menyelesaikan tugas "${activeStudent.latestTaskTitle}" dan menyenggolmu untuk segera menyusul!`;

    try {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "SENGGOL",
          fromName: activeStudent.name,
          toNis: peer.nis,
          message,
        });
      }
    } catch {}

    setFeedbackAlert(`🔔 Berhasil menyenggol ${peer.name}! Notifikasi terkirim ke layarnya.`);
    setTimeout(() => setFeedbackAlert(null), 3500);

    if (headToHeadPeer) {
      setHeadToHeadPeer(null);
    }
  };

  // Action: "⚔️ Ajak Tanding"
  const handleAjakTanding = (peer: StudentSocialPeer) => {
    if (peer.connectionStatus !== "mutual") {
      alert("Kamu dan rekan harus Saling Mengikuti untuk bertanding di Arena!");
      return;
    }

    const newMatchId = `MTS-${Date.now().toString().slice(-6)}`;
    setCurrentMatchId(newMatchId);
    setMatchOpponent(peer);
    setIsHost(true);

    try {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "ARENA_INVITE",
          matchId: newMatchId,
          from: activeStudent,
          toId: peer.id,
        });
      }
    } catch {}

    if (headToHeadPeer) {
      setHeadToHeadPeer(null);
    }

    setActiveView("lobby");
  };

  // Accept incoming invite
  const handleAcceptInvite = () => {
    if (!incomingInvite) return;

    try {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "ARENA_INVITE_RESPONSE",
          matchId: incomingInvite.matchId,
          from: activeStudent,
          toId: incomingInvite.from.id,
          accepted: true,
        });
      }
    } catch {}

    setCurrentMatchId(incomingInvite.matchId);
    setMatchOpponent(incomingInvite.from);
    setIsHost(false);
    setIncomingInvite(null);
    setActiveView("lobby");
  };

  // Reject incoming invite
  const handleRejectInvite = () => {
    if (!incomingInvite) return;

    try {
      if (channelRef.current) {
        channelRef.current.postMessage({
          type: "ARENA_INVITE_RESPONSE",
          matchId: incomingInvite.matchId,
          from: activeStudent,
          toId: incomingInvite.from.id,
          accepted: false,
        });
      }
    } catch {}

    setIncomingInvite(null);
  };

  // Finished Match Callback
  const handleMatchFinish = (updatedStats: {
    totalKnowledgeScore: number;
    gamesPlayedCount: number;
  }) => {
    const updated = peers.map((p) => {
      if (p.nis === activePersonaNis) {
        return {
          ...p,
          totalKnowledgeScore: updatedStats.totalKnowledgeScore,
          gamesPlayedCount: updatedStats.gamesPlayedCount,
        };
      }
      return p;
    });
    savePeers(updated);
    setActiveView("list");
  };

  // Render Sub-Views
  if (activeView === "lobby" && matchOpponent) {
    return (
      <div className="w-full">
        <ArenaMultiplayerLobby
          matchId={currentMatchId}
          playerA={activeStudent}
          playerB={matchOpponent}
          isHost={isHost}
          onExitLobby={() => setActiveView("list")}
          onStartGame={(topicId) => {
            setActiveTopicId(topicId);
            setActiveView("game");
          }}
        />
      </div>
    );
  }

  if (activeView === "game" && matchOpponent) {
    return (
      <div className="w-full">
        <PasangKonsepGameEngine
          matchId={currentMatchId}
          topicId={activeTopicId}
          playerA={activeStudent}
          playerB={matchOpponent}
          onFinishMatch={handleMatchFinish}
          onReturnToLobby={() => setActiveView("lobby")}
        />
      </div>
    );
  }

  return (
    <div className="space-y-6 max-w-6xl mx-auto">
      {/* Toast Alert Banner */}
      <AnimatePresence>
        {feedbackAlert && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className="p-3.5 rounded-xl bg-cyan-950/80 border border-cyan-500/40 text-cyan-200 text-xs font-semibold flex items-center justify-between shadow-lg shadow-cyan-500/10"
          >
            <span className="flex items-center gap-2">
              <Zap className="w-4 h-4 text-cyan-400" />
              {feedbackAlert}
            </span>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Senggol Toast (Received real-time from friend) */}
      <AnimatePresence>
        {senggolToast && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: -15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: -15 }}
            className="p-4 rounded-2xl bg-gradient-to-r from-amber-950/90 via-[#221815] to-purple-950/90 border border-amber-500/50 shadow-2xl shadow-amber-500/20 text-white flex flex-wrap items-center justify-between gap-3"
          >
            <div className="flex items-center gap-3">
              <div className="p-2.5 rounded-xl bg-amber-500/20 border border-amber-500/30 text-amber-300">
                <BellRing className="w-5 h-5 animate-bounce" />
              </div>
              <div>
                <h4 className="text-xs font-bold text-amber-300 uppercase tracking-wider">
                  ⚡ Senggolan Teman Diterima!
                </h4>
                <p className="text-xs text-gray-200">{senggolToast.message}</p>
              </div>
            </div>
            <button
              onClick={() => setSenggolToast(null)}
              className="px-3 py-1.5 rounded-lg bg-white/10 hover:bg-white/20 text-xs font-bold text-white transition-colors"
            >
              Baik, Mengerti
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Incoming Arena Multiplayer Invite Modal */}
      <AnimatePresence>
        {incomingInvite && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              className="relative w-full max-w-md bg-[#161622] border border-cyan-500/40 rounded-2xl p-6 text-center text-white shadow-2xl shadow-cyan-500/25 space-y-4"
            >
              <div className="w-16 h-16 rounded-full mx-auto overflow-hidden border-2 border-cyan-400 shadow-lg shadow-cyan-500/30">
                <Image
                  src={incomingInvite.from.avatar}
                  alt={incomingInvite.from.name}
                  width={64}
                  height={64}
                  className="object-cover"
                />
              </div>

              <div>
                <span className="text-[10px] font-bold text-cyan-400 uppercase tracking-wider">
                  Tantangan Masuk
                </span>
                <h3 className="text-base font-bold text-white mt-1">
                  {incomingInvite.from.name}
                </h3>
                <p className="text-xs text-gray-400">
                  {incomingInvite.from.grade} • Mengajakmu berduel di Arena Pasang Konsep!
                </p>
              </div>

              <div className="flex items-center justify-center gap-3 pt-2">
                <button
                  type="button"
                  onClick={handleRejectInvite}
                  className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-xs font-semibold text-gray-300 transition-colors"
                >
                  Tolak
                </button>
                <button
                  type="button"
                  onClick={handleAcceptInvite}
                  className="px-5 py-2 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-xs font-black hover:from-cyan-400 hover:to-emerald-300 transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
                >
                  ⚔️ Terima Tantangan
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Head-to-Head Comparison Modal */}
      {headToHeadPeer && (
        <HeadToHeadProfileModal
          isOpen={!!headToHeadPeer}
          onClose={() => setHeadToHeadPeer(null)}
          currentUserPeer={activeStudent}
          selectedPeer={headToHeadPeer}
          onAjakTanding={handleAjakTanding}
          onSenggol={handleSenggol}
        />
      )}

      {/* Authenticated Student Session Status Bar */}
      <div className="p-4 rounded-2xl bg-[#1a1a24]/90 border border-white/10 flex flex-wrap items-center justify-between gap-4 backdrop-blur-md">
        <div className="flex items-center gap-2.5">
          <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-xs font-bold text-gray-300 flex items-center gap-1.5">
            Sesi Autentikasi Aktif:
          </span>
          <span className="text-xs font-bold text-cyan-300">
            {activeStudent.name}
          </span>
          <span className="text-[11px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-mono border border-cyan-500/30">
            NIS: {activeStudent.nis}
          </span>
        </div>

        <div className="flex items-center gap-2 text-xs text-gray-400">
          <span className="inline-flex items-center gap-1 text-[11px] px-2.5 py-1 rounded-full bg-white/5 border border-white/10 font-mono text-gray-300">
            Unit MTs • {activeStudent.grade}
          </span>
        </div>
      </div>

      {/* My Stats Header (Progress Showcase) */}
      <div className="relative p-6 rounded-2xl bg-gradient-to-br from-[#1a1a26]/95 via-[#161622]/95 to-[#12121a]/95 border border-cyan-500/25 shadow-2xl overflow-hidden text-white space-y-6">
        {/* Background glow circle */}
        <div className="absolute top-0 right-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="flex flex-wrap items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden border-2 border-cyan-400 shadow-xl shadow-cyan-500/25 shrink-0">
              <Image src={activeStudent.avatar} alt={activeStudent.name} fill className="object-cover" />
              <div className="absolute bottom-0 right-0 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#14141d]" />
            </div>

            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-bold text-white">{activeStudent.name}</h2>
                <span className="text-[11px] px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 font-mono">
                  {activeStudent.grade}
                </span>
              </div>
              <p className="text-xs text-gray-400 flex items-center gap-2 mt-0.5">
                <span>NIS: {activeStudent.nis}</span>
                <span>•</span>
                <span className="text-emerald-400 font-medium">Santri Madrasah Tsanawiyah</span>
              </p>
            </div>
          </div>

          {/* Quick Matchmaking button */}
          <button
            type="button"
            onClick={() => {
              const opponent = peerList.find((p) => p.connectionStatus === "mutual") || peerList[0];
              if (opponent) handleAjakTanding(opponent);
            }}
            className="px-5 py-2.5 rounded-xl bg-gradient-to-r from-cyan-500 to-emerald-400 text-slate-950 text-xs font-black flex items-center gap-2 transition-transform hover:scale-105 shadow-lg shadow-cyan-500/20"
          >
            <Swords className="w-4 h-4" />
            Mabar Arena Cepat
          </button>
        </div>

        {/* 3 Metric Cards Showcase */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          {/* Metric 1: Tugas Selesai */}
          <div className="p-4 rounded-xl bg-[#14141d]/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Tugas Selesai</span>
              <BookCheck className="w-4 h-4 text-cyan-400" />
            </div>
            <p className="text-2xl font-black text-white">
              {activeStudent.tasksCompletedCount}
              <span className="text-xs font-normal text-gray-400 ml-1">/ 8 Modul</span>
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-emerald-400">
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>Status Tugas: {activeStudent.hasCompletedLatestTask ? "Selesai" : "Ada Pending"}</span>
            </div>
          </div>

          {/* Metric 2: Riwayat Bermain Game */}
          <div className="p-4 rounded-xl bg-[#14141d]/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Riwayat Mabar</span>
              <Trophy className="w-4 h-4 text-purple-400" />
            </div>
            <p className="text-2xl font-black text-white">
              {activeStudent.gamesPlayedCount}
              <span className="text-xs font-normal text-gray-400 ml-1">Pertandingan</span>
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-purple-300">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Arena Pasang Konsep</span>
            </div>
          </div>

          {/* Metric 3: Total Skor Keilmuan */}
          <div className="p-4 rounded-xl bg-[#14141d]/80 border border-white/10 space-y-1">
            <div className="flex items-center justify-between text-gray-400 text-xs font-medium">
              <span>Total Skor Keilmuan</span>
              <Flame className="w-4 h-4 text-amber-400" />
            </div>
            <p className="text-2xl font-black text-amber-400">
              {activeStudent.totalKnowledgeScore.toLocaleString("id-ID")}
              <span className="text-xs font-normal text-gray-400 ml-1">Pts</span>
            </p>
            <div className="flex items-center gap-1.5 text-[11px] text-amber-300">
              <span>Cendekia Sains MTs</span>
            </div>
          </div>
        </div>
      </div>

      {/* Friends Showcase List (Filtered strictly by same unit: MTs) */}
      <div className="space-y-4">
        <div className="flex flex-wrap items-center justify-between gap-2 border-b border-white/10 pb-3">
          <div>
            <h3 className="text-base font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-cyan-400" />
              Rekan Belajar Santri (Jenjang MTs)
            </h3>
            <p className="text-xs text-gray-400">
              Terhubung mutual untuk membuka akses tanding live di Arena dan saling menyenggol tugas.
            </p>
          </div>
          <span className="text-xs px-2.5 py-1 rounded-full bg-cyan-500/10 text-cyan-300 border border-cyan-500/20 font-mono">
            {peerList.length} Santri MTs
          </span>
        </div>

        {/* Peer Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {peerList.map((peer) => {
            const isMutual = peer.connectionStatus === "mutual";
            const canSenggol = activeStudent.hasCompletedLatestTask && !peer.hasCompletedLatestTask;

            return (
              <div
                key={peer.id}
                className="relative p-5 rounded-2xl bg-[#1a1a24]/90 border border-white/10 hover:border-cyan-500/40 shadow-xl transition-all duration-300 space-y-4 group"
              >
                {/* Peer Header */}
                <div className="flex items-center justify-between gap-3">
                  <div className="flex items-center gap-3 min-w-0">
                    <div className="relative w-12 h-12 rounded-full overflow-hidden border-2 border-white/20 group-hover:border-cyan-400/80 transition-colors shrink-0">
                      <Image src={peer.avatar} alt={peer.name} fill className="object-cover" />
                      <div className="absolute bottom-0 right-0 w-3 h-3 bg-emerald-500 rounded-full border-2 border-[#14141d]" />
                    </div>

                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <h4 className="font-bold text-sm text-white truncate">{peer.name}</h4>
                      </div>
                      <p className="text-xs text-gray-400">
                        {peer.grade} • NIS: {peer.nis}
                      </p>
                    </div>
                  </div>

                  {/* Mutual / Follow Toggle Badge */}
                  <button
                    type="button"
                    onClick={() => handleToggleFollow(peer.id)}
                    className={`px-3 py-1.5 rounded-xl text-[11px] font-bold flex items-center gap-1.5 transition-all ${
                      isMutual
                        ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 hover:bg-emerald-500/30"
                        : "bg-white/5 text-gray-400 border border-white/10 hover:bg-cyan-500/20 hover:text-cyan-300 hover:border-cyan-500/40"
                    }`}
                    title={isMutual ? "Klik untuk membatalkan mutual" : "Klik untuk mengikuti (mutual)"}
                  >
                    {isMutual ? (
                      <>
                        <UserCheck className="w-3.5 h-3.5 text-emerald-400" />
                        🤝 Saling Mengikuti
                      </>
                    ) : (
                      <>
                        <UserPlus className="w-3.5 h-3.5" />
                        + Ikuti
                      </>
                    )}
                  </button>
                </div>

                {/* Latest Task Status Badge */}
                <div className="p-3 rounded-xl bg-[#14141d]/70 border border-white/5 space-y-1">
                  <div className="flex items-center justify-between text-[11px] text-gray-400">
                    <span>Status Tugas Terkini:</span>
                    <span className="font-mono text-cyan-300 truncate max-w-[180px]">
                      {peer.latestTaskTitle}
                    </span>
                  </div>
                  <div>
                    {peer.hasCompletedLatestTask ? (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                        <CheckCircle2 className="w-3.5 h-3.5" />
                        ✅ Sudah Selesai Tugas
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 text-xs font-bold px-2.5 py-0.5 rounded-full bg-amber-500/20 text-amber-300 border border-amber-500/30">
                        <Clock className="w-3.5 h-3.5" />
                        ⏳ Belum Selesai Tugas
                      </span>
                    )}
                  </div>
                </div>

                {/* Stat Chips */}
                <div className="grid grid-cols-3 gap-2 pt-1 border-t border-white/5 text-center text-xs">
                  <div className="p-2 rounded-lg bg-black/20">
                    <span className="text-[10px] text-gray-400 block">Tugas</span>
                    <span className="font-bold text-white">{peer.tasksCompletedCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/20">
                    <span className="text-[10px] text-gray-400 block">Mabar</span>
                    <span className="font-bold text-white">{peer.gamesPlayedCount}</span>
                  </div>
                  <div className="p-2 rounded-lg bg-black/20">
                    <span className="text-[10px] text-gray-400 block">Skor</span>
                    <span className="font-bold text-amber-400">
                      {peer.totalKnowledgeScore.toLocaleString("id-ID")}
                    </span>
                  </div>
                </div>

                {/* Actions: Senggol, Ajak Tanding, Lihat Profil */}
                <div className="flex flex-wrap items-center justify-end gap-2 pt-2 border-t border-white/10">
                  {/* Action 1: Senggol Teman */}
                  <button
                    type="button"
                    disabled={!canSenggol}
                    onClick={() => handleSenggol(peer)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      canSenggol
                        ? "bg-amber-500/20 text-amber-300 border border-amber-500/40 hover:bg-amber-500/30 hover:scale-[1.02] cursor-pointer"
                        : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed opacity-50"
                    }`}
                    title={
                      canSenggol
                        ? "Kirim notifikasi senggolan agar teman segera menyelesaikan tugas"
                        : "Senggol aktif jika kamu sudah selesai tugas dan temanmu belum"
                    }
                  >
                    <BellRing className="w-3.5 h-3.5" />
                    👋 Senggol
                  </button>

                  {/* Action 2: Ajak Tanding */}
                  <button
                    type="button"
                    disabled={!isMutual}
                    onClick={() => handleAjakTanding(peer)}
                    className={`px-3 py-1.5 rounded-xl text-xs font-bold flex items-center gap-1.5 transition-all ${
                      isMutual
                        ? "bg-gradient-to-r from-cyan-500 to-blue-600 text-white hover:from-cyan-400 hover:to-blue-500 hover:scale-[1.02] shadow-sm shadow-cyan-500/20 cursor-pointer"
                        : "bg-white/5 text-gray-500 border border-white/5 cursor-not-allowed opacity-50"
                    }`}
                    title={
                      isMutual
                        ? "Ajak tanding live di Arena Pasang Konsep"
                        : "Harus saling mengikuti untuk bertanding"
                    }
                  >
                    <Swords className="w-3.5 h-3.5" />
                    ⚔️ Ajak Tanding
                  </button>

                  {/* Action 3: Lihat Profil Head-to-Head */}
                  <button
                    type="button"
                    onClick={() => setHeadToHeadPeer(peer)}
                    className="px-3 py-1.5 rounded-xl bg-white/5 hover:bg-white/10 text-gray-300 hover:text-white border border-white/10 text-xs font-medium flex items-center gap-1.5 transition-colors"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    👁️ Profil
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
