"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import { AI_AGENTS } from "@/data/mockData";
import { AIAgentId, AIAgent, ChatMessage } from "@/types";
import {
  Bot,
  Send,
  Sparkles,
  Plus,
  Trash2,
  Copy,
  Check,
  ChevronLeft,
  ChevronRight,
  X,
  Maximize2,
  Minimize2,
  Lightbulb,
  CheckCircle2,
  User,
  Clock,
  MessageSquare,
  Volume2,
  Brain,
  Layers,
  HelpCircle,
} from "lucide-react";

export interface AIChatSession {
  id: string;
  title: string;
  createdAt: string;
  agentId: AIAgentId;
  messages: ChatMessage[];
}

const STORAGE_KEY = "eduquest_ai_chats";

const DEFAULT_SESSIONS: AIChatSession[] = [
  {
    id: "session-science-1",
    title: "Anatomi Cranium & Tulang Kranial",
    createdAt: "Hari ini, 09:15",
    agentId: "science-expert",
    messages: [
      {
        id: "msg-s1-1",
        sender: "user",
        text: "Bagaimana struktur tulang tengkorak (cranium) manusia melindungi otak dan apa saja nama tulang utamanya?",
        timestamp: "09:15",
        agentId: "science-expert",
      },
      {
        id: "msg-s1-2",
        sender: "ai",
        text: "Pertanyaan yang sangat mendalam! Cranium (neurocranium) tersusun atas lempengan tulang pipih yang saling mengunci rapat melalui persendian mati (sutura) untuk menciptakan kubah pelindung otak yang sangat kokoh.",
        timestamp: "09:16",
        agentId: "science-expert",
        steps: [
          "1. Os Frontale (Tulang Dahi): Membentuk dahi dan atap rongga orbita mata.",
          "2. Os Parietale (Tulang Ubun-ubun): Sepasang tulang yang menyusun atap dan dinding samping kranium.",
          "3. Os Occipitale (Tulang Belakang Kepala): Memiliki Foramen Magnum, lubang tempat keluarnya batang otak ke medula spinalis.",
          "4. Os Temporale (Tulang Pelipis): Melindungi saluran pendengaran dalam dan organ keseimbangan.",
          "5. Mandibula & Maksila: Membentuk rahang bawah dan atas untuk proses mastikasi (mengunyah).",
        ],
      },
    ],
  },
  {
    id: "session-math-2",
    title: "Faktorisasi Persamaan Kuadrat",
    createdAt: "Kemarin, 16:40",
    agentId: "math-expert",
    messages: [
      {
        id: "msg-m2-1",
        sender: "user",
        text: "Bagaimana cara memfaktorkan persamaan kuadrat x² - 5x + 6 = 0?",
        timestamp: "16:40",
        agentId: "math-expert",
      },
      {
        id: "msg-m2-2",
        sender: "ai",
        text: "Mari kita selesaikan dengan penalaran Socrates yang logis. Persamaan kuadrat berbentuk ax² + bx + c = 0. Pada soal ini, a = 1, b = -5, dan c = 6.",
        timestamp: "16:41",
        agentId: "math-expert",
        steps: [
          "1. Cari dua bilangan yang jika dikalikan bernilai +6 (nilai c), dan jika dijumlahkan bernilai -5 (nilai b).",
          "2. Faktor perkalian dari 6 adalah (1 × 6) atau (2 × 3), atau (-2 × -3).",
          "3. Perhatikan: (-2) + (-3) = -5, dan (-2) × (-3) = +6. Bilangan yang kita cari adalah -2 dan -3!",
          "4. Bentuk faktorisasi: (x - 2)(x - 3) = 0.",
          "5. Akar-akar penyelesaiannya adalah x = 2 atau x = 3.",
        ],
      },
    ],
  },
  {
    id: "session-lang-3",
    title: "Penyusunan Teks Deskripsi & Majas",
    createdAt: "3 hari lalu",
    agentId: "lang-expert",
    messages: [
      {
        id: "msg-l3-1",
        sender: "user",
        text: "Bagaimana cara menulis kalimat pembuka yang menggugah panca indera dalam teks deskripsi?",
        timestamp: "14:20",
        agentId: "lang-expert",
      },
      {
        id: "msg-l3-2",
        sender: "ai",
        text: "Kunci dari teks deskripsi yang memikat adalah 'Show, Don't Tell'—tunjukkan detail citraan panca indera daripada sekadar memberi tahu pembaca.",
        timestamp: "14:21",
        agentId: "lang-expert",
        steps: [
          "1. Citraan Penglihatan: Gambarkan warna, gradasi bayangan, dan tekstur objek.",
          "2. Citraan Pendengaran: Gunakan onomatope seperti 'gemerisik dedaunan' atau 'dentingan lonceng'.",
          "3. Citraan Peraba: Hadirkan sensasi hawa dingin yang menusuk kulit atau permukaan batu yang berlumut licin.",
          "4. Sematkan majas asosiasi atau personifikasi halus agar objek terasa hidup di benak pembaca.",
        ],
      },
    ],
  },
];

interface AIChatModalProps {
  isOpen?: boolean;
  onClose?: () => void;
  defaultAgentId?: AIAgentId;
}

export default function AIChatModal({
  isOpen: controlledIsOpen,
  onClose: controlledOnClose,
  defaultAgentId = "science-expert",
}: AIChatModalProps) {
  const { theme } = useEduQuest();
  const isDark = theme === "dark";

  // Internal open state for floating launcher button
  const [internalIsOpen, setInternalIsOpen] = useState(false);
  const isOpen = controlledIsOpen !== undefined ? controlledIsOpen : internalIsOpen;
  const handleClose = () => {
    if (controlledOnClose) {
      controlledOnClose();
    } else {
      setInternalIsOpen(false);
    }
  };
  const handleOpen = () => {
    setInternalIsOpen(true);
  };

  // Chat sessions state with LocalStorage persistence
  const [sessions, setSessions] = useState<AIChatSession[]>([]);
  const [activeSessionId, setActiveSessionId] = useState<string>("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [inputMessage, setInputMessage] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [isMaximized, setIsMaximized] = useState(false);

  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Initialize from LocalStorage
  useEffect(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) {
          setSessions(parsed);
          setActiveSessionId(parsed[0].id);
          return;
        }
      }
    } catch (e) {
      console.warn("Failed to load AI chats from localStorage", e);
    }

    // Default fallback
    setSessions(DEFAULT_SESSIONS);
    setActiveSessionId(DEFAULT_SESSIONS[0].id);
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(DEFAULT_SESSIONS));
    } catch {}
  }, []);

  // Save to LocalStorage whenever sessions change
  useEffect(() => {
    if (sessions.length > 0) {
      try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(sessions));
      } catch (e) {
        console.warn("Failed to persist AI chats", e);
      }
    }
  }, [sessions]);

  // Current active session
  const activeSession = sessions.find((s) => s.id === activeSessionId) || sessions[0];
  const activeAgentId = activeSession?.agentId || defaultAgentId;
  const activeAgent = AI_AGENTS.find((a) => a.id === activeAgentId) || AI_AGENTS[0];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    if (isOpen) {
      scrollToBottom();
    }
  }, [activeSession?.messages, isTyping, isOpen]);

  // Handle creating a new conversation
  const handleNewChat = (agentId: AIAgentId = activeAgentId) => {
    const selectedAgent = AI_AGENTS.find((a) => a.id === agentId) || AI_AGENTS[0];
    const newSession: AIChatSession = {
      id: `chat-${Date.now()}`,
      title: `Diskusi ${selectedAgent.name.split(" ")[0]} Baru`,
      createdAt: "Hari ini, " + new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      agentId,
      messages: [
        {
          id: `msg-${Date.now()}`,
          sender: "ai",
          agentId,
          text: selectedAgent.greeting,
          timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
        },
      ],
    };

    const updated = [newSession, ...sessions];
    setSessions(updated);
    setActiveSessionId(newSession.id);
  };

  // Handle deleting a session
  const handleDeleteSession = (sessionId: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (sessions.length <= 1) {
      // If only one, reset to blank session
      handleNewChat(activeAgentId);
      return;
    }
    const updated = sessions.filter((s) => s.id !== sessionId);
    setSessions(updated);
    if (activeSessionId === sessionId) {
      setActiveSessionId(updated[0].id);
    }
  };

  // Change agent for current session
  const handleChangeAgent = (newAgentId: AIAgentId) => {
    if (!activeSession) return;
    const newAgent = AI_AGENTS.find((a) => a.id === newAgentId);
    if (!newAgent) return;

    const switchMsg: ChatMessage = {
      id: `msg-switch-${Date.now()}`,
      sender: "ai",
      agentId: newAgentId,
      text: `Halo! Saya beralih ke ${newAgent.name} (${newAgent.title}). ${newAgent.greeting}`,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    const updatedSessions = sessions.map((s) =>
      s.id === activeSession.id
        ? {
            ...s,
            agentId: newAgentId,
            messages: [...s.messages, switchMsg],
          }
        : s
    );
    setSessions(updatedSessions);
  };

  // Generate intelligent socratic response
  const generateSocraticResponse = (query: string, agentId: AIAgentId): { text: string; steps?: string[] } => {
    const qLower = query.toLowerCase();

    // Cranium / Skull / 3D Anatomy domain
    if (
      qLower.includes("tulang") ||
      qLower.includes("tengkorak") ||
      qLower.includes("cranium") ||
      qLower.includes("frontal") ||
      qLower.includes("parietal") ||
      qLower.includes("temporal") ||
      qLower.includes("occipital") ||
      qLower.includes("mandibula") ||
      qLower.includes("maxilla") ||
      qLower.includes("otak")
    ) {
      return {
        text: `MasyaAllah, telaah anatomi cranium yang sangat esensial! Tengkorak manusia dirancang secara presisi dengan arsitektur peredam benturan alami untuk melindungi ensefalon (otak besar, otak kecil, dan batang otak).`,
        steps: [
          "Konsep 1: Tulang Kranial (Cranial Bones) terhubung lewat Sutura (sutura koronalis, sagitalis, lambdoid). Pada bayi, celah ini berupa fontanela lunak.",
          "Konsep 2: Os Frontale melindungi lobus frontal yang bertugas untuk penalaran, memori kerja, dan pengambilan keputusan.",
          "Konsep 3: Os Temporale memiliki struktur padat (petrous part) yang melindungi koklea telinga dalam dan kanalis semisirkularis keseimbangan.",
          "Konsep 4: Os Occipitale memiliki condyle occipitalis yang bersendi langsung dengan vertebra servikal C1 (Atlas) untuk mobilitas kepala.",
          "Rekomendasi Eksplorasi: Buka tab 'Lab Anatomi 3D' di EduQuest untuk melihat langsung visualisasi 3D raycasting 6 tulang ini secara rotatif!",
        ],
      };
    }

    // Math domain
    if (
      agentId === "math-expert" ||
      qLower.includes("hitung") ||
      qLower.includes("persamaan") ||
      qLower.includes("aljabar") ||
      qLower.includes("rumus") ||
      qLower.includes("luas") ||
      qLower.includes("keliling") ||
      qLower.includes("akar") ||
      qLower.includes("pecahan")
    ) {
      return {
        text: `Alhamdulillah, mari kita uraikan problem matematika ini dengan metode penalaran bertahap agar logikanya tertanam kuat:`,
        steps: [
          "Langkah 1: Identifikasi besaran yang diketahui dan tentukan variabel yang hendak dicari secara presisi.",
          "Langkah 2: Terapkan prinsip kesetaraan aljabar—apapun operasi yang dilakukan pada ruas kiri harus seimbang pada ruas kanan.",
          "Langkah 3: Periksa kembali keabsahan solusi dengan substitusi balik ke persamaan awal untuk memastikan tidak ada kekeliruan aritmatika.",
        ],
      };
    }

    // Science domain
    if (
      agentId === "science-expert" ||
      qLower.includes("gaya") ||
      qLower.includes("newton") ||
      qLower.includes("energi") ||
      qLower.includes("fotosintesis") ||
      qLower.includes("sel") ||
      qLower.includes("ekosistem")
    ) {
      return {
        text: `Eksplorasi ilmiah yang menarik! Dalam ilmu fisika dan biologi, setiap fenomena selalu berakar pada hukum keteraturan alam (sunnatullah):`,
        steps: [
          "Tahap Observasi: Perhatikan variabel aksi dan reaksi atau transfer energi yang terjadi dalam sistem.",
          "Analogi Kontekstual: Bayangkan interaksi partikel atau gaya dalam kehidupan sehari-hari (seperti gesekan rem atau fotosintesis daun).",
          "Kesimpulan Saintifik: Rumuskan hukum sebab-akibat ilmiahnya dan bagaimana hal tersebut menjaga keseimbangan ekosistem.",
        ],
      };
    }

    // Language / Literature domain
    if (
      agentId === "lang-expert" ||
      qLower.includes("paragraf") ||
      qLower.includes("puisi") ||
      qLower.includes("cerita") ||
      qLower.includes("majas") ||
      qLower.includes("kalimat") ||
      qLower.includes("english")
    ) {
      return {
        text: `Pilihan diksi dan struktur bahasa yang patut diapresiasi! Untuk memperkuat daya pikat tulisan dan komunikasi efektif:`,
        steps: [
          "Prinsip Kohesi & Koherensi: Pastikan kalimat utama didukung oleh kalimat penjelas yang bertautan secara logis.",
          "Pilihan Kosakata (Diksi): Gunakan kata konkret dan variasi sinonim agar pembaca tidak mengalami kebosanan leksikal.",
          "Sentuhan Retorika: Sematkan gaya bahasa seperti metafora atau analogi untuk memperkuat pesan emosional teks.",
        ],
      };
    }

    // General Socratic fallback
    return {
      text: `Pertanyaan yang sangat reflektif! Mari kita bedah pertanyaan "${query}" dengan pertanyaan pemantik Socrates:`,
      steps: [
        "1. Apa landasan fakta atau asumsi utama yang kamu miliki mengenai topik ini?",
        "2. Bagaimana jika kita memandangnya dari sudut pandang pembuktian empiris dan logika praktis?",
        "3. Kesimpulan sementara apa yang paling masuk akal menurut logikamu sebelum kita kaji lebih mendalam?",
      ],
    };
  };

  // Send message handler
  const handleSendMessage = (textToSend?: string) => {
    const rawText = textToSend || inputMessage;
    if (!rawText.trim() || isTyping || !activeSession) return;

    const userText = rawText.trim();
    const timestamp = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" });

    const newUserMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      agentId: activeAgentId,
      text: userText,
      timestamp,
    };

    // Auto-update session title if it was default
    const isNewTitle =
      activeSession.title.startsWith("Diskusi ") || activeSession.title === "Percakapan Baru";
    const nextTitle = isNewTitle
      ? userText.length > 28
        ? userText.slice(0, 28) + "..."
        : userText
      : activeSession.title;

    const sessionWithUser = {
      ...activeSession,
      title: nextTitle,
      messages: [...activeSession.messages, newUserMsg],
    };

    setSessions((prev) => prev.map((s) => (s.id === activeSession.id ? sessionWithUser : s)));
    setInputMessage("");
    setIsTyping(true);

    // Simulate Socratic AI thinking time
    setTimeout(() => {
      const response = generateSocraticResponse(userText, activeAgentId);
      const aiReplyMsg: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        agentId: activeAgentId,
        text: response.text,
        steps: response.steps,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setSessions((prev) =>
        prev.map((s) =>
          s.id === activeSession.id
            ? {
                ...s,
                messages: [...s.messages, aiReplyMsg],
              }
            : s
        )
      );
      setIsTyping(false);
    }, 900);
  };

  // Copy message to clipboard
  const handleCopy = (text: string, id: string, steps?: string[]) => {
    let full = text;
    if (steps && steps.length > 0) {
      full += "\n\n" + steps.join("\n");
    }
    navigator.clipboard.writeText(full);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Read aloud message
  const handleSpeak = (text: string) => {
    if (typeof window !== "undefined" && "speechSynthesis" in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(text);
      utterance.lang = "id-ID";
      utterance.rate = 1.0;
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <>
      {/* Floating Trigger Button (Always visible on bottom-right if modal is closed) */}
      {!isOpen && (
        <motion.button
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          whileHover={{ scale: 1.08 }}
          whileTap={{ scale: 0.95 }}
          onClick={handleOpen}
          aria-label="Tanya EduAI Multi-Agent"
          className="fixed bottom-20 md:bottom-8 right-6 z-50 flex items-center gap-2.5 px-4 py-3 rounded-full bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white shadow-2xl hover:shadow-[#0cc0df]/40 transition-all border border-white/20 group backdrop-blur-md"
        >
          <div className="relative">
            <Bot className="w-5 h-5 text-white animate-bounce" />
            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 rounded-full bg-emerald-400 ring-2 ring-black" />
          </div>
          <span className="text-xs font-bold tracking-wide hidden sm:inline">Tanya EduAI</span>
          <span className="text-[10px] bg-white/20 px-1.5 py-0.5 rounded-full font-bold">3 Tutor</span>
        </motion.button>
      )}

      {/* Main Floating Modal / Drawer */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 40, scale: 0.95 }}
            transition={{ duration: 0.25, ease: "easeOut" }}
            className={`fixed z-50 shadow-2xl overflow-hidden flex flex-col transition-all duration-300 ${
              isMaximized
                ? "inset-2 md:inset-6 rounded-3xl"
                : "bottom-4 right-4 sm:bottom-6 sm:right-6 w-[calc(100vw-2rem)] sm:w-[560px] md:w-[720px] lg:w-[860px] h-[85vh] max-h-[700px] rounded-3xl"
            } ${
              isDark
                ? "bg-[#12121a]/95 text-white border border-white/10 backdrop-blur-2xl shadow-cyan-950/40"
                : "bg-white/95 text-slate-900 border border-slate-200/90 backdrop-blur-2xl shadow-xl"
            }`}
          >
            {/* Modal Top Bar */}
            <div
              className={`px-4 sm:px-5 py-3.5 flex items-center justify-between border-b shrink-0 ${
                isDark ? "bg-[#181824] border-white/10" : "bg-slate-50 border-slate-200"
              }`}
            >
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setSidebarOpen(!sidebarOpen)}
                  className={`p-1.5 rounded-lg transition ${
                    isDark ? "hover:bg-white/10 text-slate-300" : "hover:bg-slate-200 text-slate-700"
                  }`}
                  title={sidebarOpen ? "Tutup Histori" : "Buka Histori Percakapan"}
                >
                  <MessageSquare className="w-4 h-4 text-[#0cc0df]" />
                </button>
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-[#ffbf00] to-[#0cc0df] p-0.5 shrink-0">
                    <img
                      src={activeAgent.avatar}
                      alt={activeAgent.name}
                      className="w-full h-full rounded-[10px] object-cover"
                    />
                  </div>
                  <div>
                    <div className="flex items-center gap-2">
                      <h3
                        className={`text-xs sm:text-sm font-bold truncate max-w-[140px] sm:max-w-[200px] ${
                          isDark ? "text-white" : "text-slate-900"
                        }`}
                      >
                        {activeAgent.name}
                      </h3>
                      <span className="flex items-center gap-1 text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-500 font-bold border border-emerald-500/20">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Online
                      </span>
                    </div>
                    <p className={`text-[10px] truncate ${isDark ? "text-slate-400" : "text-slate-500"}`}>
                      {activeAgent.title}
                    </p>
                  </div>
                </div>
              </div>

              {/* Specialist Agent Fast Switcher Pills */}
              <div className="hidden md:flex items-center gap-1 bg-black/10 dark:bg-white/5 p-1 rounded-xl">
                {AI_AGENTS.map((agent) => {
                  const isCur = activeAgentId === agent.id;
                  return (
                    <button
                      key={agent.id}
                      onClick={() => handleChangeAgent(agent.id)}
                      className={`px-2.5 py-1 rounded-lg text-[11px] font-semibold transition flex items-center gap-1.5 ${
                        isCur
                          ? "bg-[#0cc0df] text-white shadow-xs"
                          : isDark
                          ? "text-slate-400 hover:text-white hover:bg-white/5"
                          : "text-slate-600 hover:text-slate-900 hover:bg-slate-200"
                      }`}
                    >
                      <span>{agent.name.split(" ")[0]}</span>
                    </button>
                  );
                })}
              </div>

              {/* Action Buttons: Maximize / Minimize & Close */}
              <div className="flex items-center gap-1">
                <button
                  onClick={() => setIsMaximized(!isMaximized)}
                  className={`p-1.5 rounded-lg transition ${
                    isDark ? "hover:bg-white/10 text-slate-400" : "hover:bg-slate-200 text-slate-600"
                  }`}
                  title={isMaximized ? "Perkecil Modal" : "Perbesar Layar Penuh"}
                >
                  {isMaximized ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
                </button>
                <button
                  onClick={handleClose}
                  className={`p-1.5 rounded-lg transition ${
                    isDark ? "hover:bg-rose-500/20 text-slate-400 hover:text-rose-400" : "hover:bg-rose-100 text-slate-600 hover:text-rose-600"
                  }`}
                  title="Tutup Chat"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Modal Body: Left Session Sidebar + Chat Main Area */}
            <div className="flex-1 flex overflow-hidden min-h-0">
              {/* Left Mini-Sidebar: Sessions & New Chat Button */}
              <AnimatePresence initial={false}>
                {sidebarOpen && (
                  <motion.div
                    initial={{ width: 0, opacity: 0 }}
                    animate={{ width: 240, opacity: 1 }}
                    exit={{ width: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className={`shrink-0 border-r flex flex-col overflow-hidden ${
                      isDark ? "bg-[#14141e] border-white/10" : "bg-slate-50 border-slate-200"
                    }`}
                  >
                    {/* New Chat Button */}
                    <div className="p-3 border-b border-inherit">
                      <button
                        onClick={() => handleNewChat(activeAgentId)}
                        className="w-full flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white text-xs font-bold shadow-md hover:opacity-90 active:scale-95 transition"
                      >
                        <Plus className="w-4 h-4 text-[#ffbf00]" />
                        <span>Chat Baru</span>
                      </button>
                    </div>

                    {/* Sessions List */}
                    <div className="flex-1 overflow-y-auto p-2 space-y-1.5 no-scrollbar">
                      <div className="px-2 py-1 text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Histori Sesi ({sessions.length})
                      </div>
                      {sessions.map((session) => {
                        const isCur = session.id === activeSessionId;
                        const sessionAgent = AI_AGENTS.find((a) => a.id === session.agentId) || AI_AGENTS[0];
                        return (
                          <div
                            key={session.id}
                            onClick={() => setActiveSessionId(session.id)}
                            className={`group relative p-2.5 rounded-xl cursor-pointer transition text-left flex items-start gap-2.5 border ${
                              isCur
                                ? isDark
                                  ? "bg-white/10 border-[#0cc0df]/40 shadow-xs"
                                  : "bg-white border-[#0cc0df]/50 shadow-xs ring-1 ring-[#0cc0df]/20"
                                : isDark
                                ? "border-transparent hover:bg-white/5 text-slate-300"
                                : "border-transparent hover:bg-slate-200/70 text-slate-700"
                            }`}
                          >
                            <img
                              src={sessionAgent.avatar}
                              alt={sessionAgent.name}
                              className="w-7 h-7 rounded-lg object-cover shrink-0 mt-0.5"
                            />
                            <div className="flex-1 min-w-0 pr-5">
                              <h4
                                className={`text-xs font-bold truncate ${
                                  isCur
                                    ? isDark
                                      ? "text-[#0cc0df]"
                                      : "text-cyan-800"
                                    : isDark
                                    ? "text-white"
                                    : "text-slate-900"
                                }`}
                              >
                                {session.title}
                              </h4>
                              <p className="text-[10px] text-slate-400 truncate mt-0.5">
                                {session.messages[session.messages.length - 1]?.text || "Percakapan kosong"}
                              </p>
                              <span className="text-[9px] text-slate-400 block mt-1">
                                {session.createdAt}
                              </span>
                            </div>

                            {/* Delete Session Button */}
                            <button
                              onClick={(e) => handleDeleteSession(session.id, e)}
                              className={`absolute top-2.5 right-2 p-1 rounded-md opacity-0 group-hover:opacity-100 transition ${
                                isDark
                                  ? "hover:bg-rose-500/20 text-slate-400 hover:text-rose-400"
                                  : "hover:bg-rose-100 text-slate-400 hover:text-rose-600"
                              }`}
                              title="Hapus Sesi"
                            >
                              <Trash2 className="w-3.5 h-3.5" />
                            </button>
                          </div>
                        );
                      })}
                    </div>

                    {/* Agent Switcher in Sidebar on Mobile */}
                    <div className="p-2 border-t border-inherit md:hidden">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-1 px-1">
                        Pilih Spesialis:
                      </span>
                      <div className="grid grid-cols-3 gap-1">
                        {AI_AGENTS.map((agent) => (
                          <button
                            key={agent.id}
                            onClick={() => handleChangeAgent(agent.id)}
                            className={`p-1.5 rounded-lg text-[10px] font-bold text-center transition ${
                              activeAgentId === agent.id
                                ? "bg-[#0cc0df] text-white"
                                : isDark
                                ? "bg-white/5 text-slate-300"
                                : "bg-slate-200 text-slate-700"
                            }`}
                          >
                            {agent.name.split(" ")[0]}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Chat Messages + Input Container */}
              <div className="flex-1 flex flex-col overflow-hidden min-w-0">
                {/* Messages Feed */}
                <div
                  className={`flex-1 p-4 sm:p-5 overflow-y-auto space-y-4 ${
                    isDark
                      ? "bg-gradient-to-b from-[#101018] to-[#12121a]"
                      : "bg-gradient-to-b from-slate-50 to-white"
                  }`}
                >
                  {/* Socratic Pedagogy Banner */}
                  <div
                    className={`p-3 rounded-2xl border text-xs flex items-center gap-3 ${
                      isDark
                        ? "bg-white/5 border-white/10 text-slate-300"
                        : "bg-cyan-50 border-cyan-100 text-cyan-900"
                    }`}
                  >
                    <Sparkles className="w-4 h-4 text-[#ffbf00] shrink-0" />
                    <div>
                      <span className="font-bold">Metode Socrates YPI As Sa'adah:</span>{" "}
                      <span className="opacity-90">
                        AI memandu pemahaman konseptual dan penalaran bertahap, bukan sekadar memberikan jawaban instan.
                      </span>
                    </div>
                  </div>

                  {/* Messages Loop */}
                  {activeSession?.messages.map((msg) => {
                    const isUser = msg.sender === "user";
                    const isCopied = copiedId === msg.id;

                    return (
                      <div
                        key={msg.id}
                        className={`flex items-start gap-2.5 sm:gap-3.5 ${
                          isUser ? "flex-row-reverse" : "flex-row"
                        }`}
                      >
                        {/* Avatar */}
                        <div
                          className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold shadow-xs ${
                            isUser
                              ? "bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white"
                              : isDark
                              ? "bg-white/10 text-white border border-white/10"
                              : "bg-slate-200 text-slate-800"
                          }`}
                        >
                          {isUser ? (
                            <User className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#ffbf00]" />
                          ) : (
                            <Bot className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-[#0cc0df]" />
                          )}
                        </div>

                        {/* Bubble */}
                        <div
                          className={`max-w-[85%] sm:max-w-[80%] rounded-2xl p-3.5 sm:p-4 text-xs leading-relaxed space-y-2.5 relative group shadow-sm ${
                            isUser
                              ? isDark
                                ? "bg-gradient-to-r from-cyan-950/80 to-blue-950/80 border border-cyan-500/30 text-cyan-100 rounded-tr-xs"
                                : "bg-slate-900 text-white rounded-tr-xs"
                              : isDark
                              ? "bg-[#1c1c28] border border-white/10 text-slate-200 rounded-tl-xs"
                              : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs shadow-xs"
                          }`}
                        >
                          <div className="flex items-center justify-between gap-4">
                            <span
                              className={`text-[10px] font-bold ${
                                isUser ? "text-cyan-400" : "text-[#0cc0df]"
                              }`}
                            >
                              {isUser ? "Ananda Santri" : activeAgent.name}
                            </span>
                            <span
                              className={`text-[9px] ${
                                isUser ? "text-cyan-200/60" : "text-slate-400"
                              }`}
                            >
                              {msg.timestamp}
                            </span>
                          </div>

                          <p className="font-medium whitespace-pre-wrap">{msg.text}</p>

                          {/* Socratic Steps Guidance */}
                          {msg.steps && msg.steps.length > 0 && (
                            <div
                              className={`p-3 rounded-xl border space-y-2 mt-2 ${
                                isDark
                                  ? "bg-black/30 border-white/10"
                                  : "bg-cyan-50/70 border-cyan-100 text-slate-800"
                              }`}
                            >
                              <div className="flex items-center gap-1.5 font-bold text-[11px] text-[#0cc0df]">
                                <Brain className="w-3.5 h-3.5" />
                                <span>Panduan Konsep & Alur Logika:</span>
                              </div>
                              <div className="space-y-1.5">
                                {msg.steps.map((st, sIdx) => (
                                  <div key={sIdx} className="flex items-start gap-2 text-[11px]">
                                    <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0 mt-0.5" />
                                    <span className="opacity-95">{st}</span>
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {/* Action Toolbar on AI bubble (Copy / Speak) */}
                          {!isUser && (
                            <div className="pt-2 flex items-center justify-end gap-1 border-t border-inherit/40 opacity-80 group-hover:opacity-100 transition">
                              <button
                                onClick={() => handleSpeak(msg.text)}
                                className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                                  isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                }`}
                                title="Dengarkan Suara"
                              >
                                <Volume2 className="w-3 h-3 text-[#0cc0df]" />
                                <span className="hidden sm:inline">Dengar</span>
                              </button>
                              <button
                                onClick={() => handleCopy(msg.text, msg.id, msg.steps)}
                                className={`p-1.5 rounded-lg text-[10px] font-semibold flex items-center gap-1 transition ${
                                  isDark ? "hover:bg-white/10 text-slate-400 hover:text-white" : "hover:bg-slate-100 text-slate-600 hover:text-slate-900"
                                }`}
                                title="Salin Jawaban"
                              >
                                {isCopied ? (
                                  <>
                                    <Check className="w-3 h-3 text-emerald-400" />
                                    <span className="text-emerald-400">Tersalin</span>
                                  </>
                                ) : (
                                  <>
                                    <Copy className="w-3 h-3 text-slate-400" />
                                    <span className="hidden sm:inline">Salin</span>
                                  </>
                                )}
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    );
                  })}

                  {/* Typing Indicator */}
                  {isTyping && (
                    <div className="flex items-start gap-3">
                      <div
                        className={`w-7 h-7 sm:w-8 sm:h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                          isDark ? "bg-white/10 text-white" : "bg-slate-200 text-slate-800"
                        }`}
                      >
                        <Bot className="w-4 h-4 text-[#0cc0df] animate-spin" />
                      </div>
                      <div
                        className={`rounded-2xl px-4 py-3 text-xs flex items-center gap-2 border ${
                          isDark
                            ? "bg-[#1c1c28] border-white/10 text-slate-300"
                            : "bg-white border-slate-200 text-slate-600 shadow-xs"
                        }`}
                      >
                        <span className="w-1.5 h-1.5 bg-[#0cc0df] rounded-full animate-pulse" />
                        <span className="w-1.5 h-1.5 bg-[#0cc0df] rounded-full animate-pulse delay-100" />
                        <span className="w-1.5 h-1.5 bg-[#ffbf00] rounded-full animate-pulse delay-200" />
                        <span className="text-[11px] font-medium ml-1">
                          {activeAgent.name} sedang menyusun penalaran Socrates...
                        </span>
                      </div>
                    </div>
                  )}

                  <div ref={messagesEndRef} />
                </div>

                {/* Quick Prompts Chips */}
                <div
                  className={`px-4 py-2 border-t flex items-center gap-2 overflow-x-auto no-scrollbar shrink-0 ${
                    isDark ? "bg-[#14141e] border-white/10" : "bg-slate-50 border-slate-200"
                  }`}
                >
                  <Lightbulb className="w-3.5 h-3.5 text-[#ffbf00] shrink-0" />
                  <span className="text-[10px] font-bold text-slate-400 shrink-0">
                    Saran Cepat:
                  </span>
                  {activeAgent.samplePrompts.map((prompt, i) => (
                    <button
                      key={i}
                      onClick={() => handleSendMessage(prompt)}
                      disabled={isTyping}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-medium whitespace-nowrap transition shrink-0 border ${
                        isDark
                          ? "bg-white/5 border-white/10 text-slate-300 hover:border-[#0cc0df] hover:text-[#0cc0df]"
                          : "bg-white border-slate-200 text-slate-700 hover:border-[#0cc0df] hover:text-cyan-700"
                      } disabled:opacity-50`}
                    >
                      {prompt}
                    </button>
                  ))}
                  {/* Contextual prompt for Anatomy 3D */}
                  {activeAgentId === "science-expert" && (
                    <button
                      onClick={() => handleSendMessage("Jelaskan fungsi 6 tulang cranium utama manusia")}
                      disabled={isTyping}
                      className="px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap transition shrink-0 bg-cyan-500/10 border border-cyan-500/30 text-cyan-400 hover:bg-cyan-500/20"
                    >
                      💀 Fungsi 6 Tulang Cranium
                    </button>
                  )}
                </div>

                {/* Input Form Bar */}
                <form
                  onSubmit={(e) => {
                    e.preventDefault();
                    handleSendMessage();
                  }}
                  className={`p-3 sm:p-4 border-t flex items-center gap-2 sm:gap-3 shrink-0 ${
                    isDark ? "bg-[#181824] border-white/10" : "bg-white border-slate-200"
                  }`}
                >
                  <input
                    type="text"
                    placeholder={`Ajukan pertanyaan kepada ${activeAgent.name}...`}
                    value={inputMessage}
                    onChange={(e) => setInputMessage(e.target.value)}
                    disabled={isTyping}
                    className={`flex-1 px-4 py-2.5 sm:py-3 rounded-xl border text-xs transition focus:outline-hidden focus:ring-2 focus:ring-[#0cc0df] ${
                      isDark
                        ? "bg-[#101018] border-white/10 text-white placeholder-slate-500 focus:bg-[#12121e]"
                        : "bg-slate-50 border-slate-200 text-slate-900 placeholder-slate-400 focus:bg-white"
                    }`}
                  />
                  <button
                    type="submit"
                    disabled={!inputMessage.trim() || isTyping}
                    className="px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] hover:opacity-95 disabled:opacity-40 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 transition shrink-0"
                  >
                    <span className="hidden sm:inline">Kirim</span>
                    <Send className="w-3.5 h-3.5 text-[#ffbf00]" />
                  </button>
                </form>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
