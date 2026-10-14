"use client";

import React, { useState, Suspense, useEffect } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Html } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import { ArrowLeft, Send, Bot, RotateCcw } from "lucide-react";

interface OrganConfig {
  id: string;
  name: string;
  pos: [number, number, number];
  side: "left" | "right";
  desc: string;
  funcs: string[];
}

// Daftar lengkap organ beserta koordinat titik 3D dan posisi label di layar
const organConfigs: OrganConfig[] = [
  {
    id: "brain",
    name: "Otak (Brain)",
    pos: [0, 1.8, 0],
    side: "left",
    desc: "Pusat sistem saraf yang mengendalikan seluruh fungsi tubuh, pikiran, dan kesadaran.",
    funcs: [
      "Kontrol motorik & sensorik",
      "Pusat memori & kognitif",
      "Regulasi fungsi otonom",
    ],
  },
  {
    id: "trachea",
    name: "Tenggorokan / Trakea",
    pos: [0, 1.1, 0.1],
    side: "right",
    desc: "Saluran udara utama yang menghubungkan laring ke bronkus paru-paru.",
    funcs: [
      "Jalur utama aliran udara pernapasan",
      "Penyaringan partikel asing via silia",
    ],
  },
  {
    id: "lungs",
    name: "Paru-Paru (Lungs)",
    pos: [0, 0.5, 0],
    side: "left",
    desc: "Organ utama respirasi tempat terjadinya pertukaran gas oksigen dan karbon dioksida.",
    funcs: [
      "Pertukaran gas pernapasan",
      "Regulasi keseimbangan asam-basa darah",
    ],
  },
  {
    id: "heart",
    name: "Jantung (Heart)",
    pos: [-0.15, 0.6, 0.2],
    side: "right",
    desc: "Organ berotot yang memompa darah ke seluruh tubuh melalui sistem sirkulasi.",
    funcs: [
      "Memompa darah kaya oksigen",
      "Sirkulasi sistemik & pulmonal",
    ],
  },
  {
    id: "liver",
    name: "Hati (Liver / Hepar)",
    pos: [0.3, 0.1, 0.15],
    side: "right",
    desc: "Kelenjar terbesar pengatur metabolisme tubuh dan penetral racun.",
    funcs: [
      "Produksi cairan empedu",
      "Detoksifikasi racun darah",
      "Penyimpanan glikogen",
    ],
  },
  {
    id: "stomach",
    name: "Lambung (Stomach)",
    pos: [-0.2, -0.1, 0.2],
    side: "left",
    desc: "Kantong pencernaan tempat makanan diolah secara mekanis dan kimiawi.",
    funcs: [
      "Pencernaan enzimatik (HCl & pepsin)",
      "Sterilisasi makanan",
    ],
  },
  {
    id: "gallbladder",
    name: "Kantung Empedu",
    pos: [0.2, -0.2, 0.25],
    side: "right",
    desc: "Organ kecil penyimpan cairan empedu sebelum dilepaskan ke usus.",
    funcs: [
      "Menyimpan & pekatnya empedu",
      "Pelepasan cairan pencerna lemak",
    ],
  },
  {
    id: "pancreas",
    name: "Pankreas",
    pos: [0, -0.3, 0.1],
    side: "left",
    desc: "Kelenjar penghasil enzim pencernaan dan hormon pengatur gula darah.",
    funcs: [
      "Produksi insulin & glukagon",
      "Sekresi enzim pencernaan",
    ],
  },
  {
    id: "intestines",
    name: "Usus Halus & Besar",
    pos: [0, -0.9, 0],
    side: "right",
    desc: "Saluran panjang penyerapan nutrisi esensial dan pembuangan sisa limbah.",
    funcs: [
      "Penyerapan nutrisi maksimal (usus halus)",
      "Absorpsi air & feses (usus besar)",
    ],
  },
];

function Model({ onSelect }: { onSelect: (id: string) => void }) {
  const { scene } = useGLTF("/anatomy/organ_pencernaan_manusia.glb");

  return (
    <Center>
      <primitive object={scene} scale={1.8} />

      {/* HTML Markers yang bertindak sebagai jangkar ujung garis penunjuk */}
      {organConfigs.map((org) => (
        <Html
          key={org.id}
          position={org.pos}
          center
        >
          <button
            onClick={(e) => {
              e.stopPropagation();
              onSelect(org.id);
            }}
            className="group relative flex items-center justify-center p-1.5 focus:outline-hidden cursor-pointer"
            title={org.name}
          >
            {/* Titik jangkar berdenyut */}
            <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-black animate-ping absolute"></span>
            <span className="w-3 h-3 rounded-full bg-cyan-400 border-2 border-white shadow-lg relative z-10 group-hover:scale-125 transition-transform"></span>
          </button>
        </Html>
      ))}
    </Center>
  );
}

useGLTF.preload("/anatomy/organ_pencernaan_manusia.glb");

// Komponen loading fallback saat GLB sedang dimuat ke memori WebGL
function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-black/85 px-5 py-4 rounded-2xl border border-cyan-500/40 backdrop-blur-xl shadow-2xl text-cyan-400">
        <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-semibold whitespace-nowrap">
          Memuat Anatomi 3D Terpadu...
        </span>
      </div>
    </Html>
  );
}

interface Anatomy3DProps {
  onBack?: () => void;
}

export default function Anatomy3D({ onBack }: Anatomy3DProps = {}) {
  const { theme } = useEduQuest();
  const isDark = theme !== "bright";

  const [mounted, setMounted] = useState(false);
  const [selectedId, setSelectedId] = useState<string>("overview");
  const [chatInput, setChatInput] = useState("");
  const [chatHistory, setChatHistory] = useState<
    { sender: "user" | "ai"; text: string }[]
  >([]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const activeOrgan = organConfigs.find((o) => o.id === selectedId);

  const handleSendChat = (e: React.FormEvent) => {
    e.preventDefault();
    if (!chatInput.trim()) return;
    const msg = chatInput;
    setChatHistory((prev) => [...prev, { sender: "user", text: msg }]);
    setChatInput("");
    setTimeout(() => {
      setChatHistory((prev) => [
        ...prev,
        {
          sender: "ai",
          text: `Berdasarkan fungsi ${
            activeOrgan?.name || "organ ini"
          }, bagian ini sangat esensial untuk menjaga homeostasis tubuh. Ada pertanyaan klinis lain?`,
        },
      ]);
    }, 700);
  };

  return (
    <div
      className={`relative w-full h-[calc(100vh-80px)] overflow-hidden flex items-center justify-center select-none transition-colors duration-500 rounded-3xl ${
        isDark ? "bg-[#0f0f13] text-white" : "bg-slate-900 text-white"
      }`}
    >
      {/* Tombol Navigasi Kembali */}
      {onBack && (
        <div className="absolute top-6 left-6 z-30">
          <button
            onClick={onBack}
            className="px-3.5 py-2 rounded-xl bg-black/75 hover:bg-black/95 text-white border border-white/20 text-xs font-semibold flex items-center gap-1.5 transition-all shadow-xl backdrop-blur-md cursor-pointer"
            title="Kembali ke Dashboard / Arena"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Kembali</span>
          </button>
        </div>
      )}

      {/* 1. CANVAS 3D INTERAKTIF */}
      {mounted ? (
        <Canvas
          camera={{ position: [0, 0, 6], fov: 45 }}
          className="w-full h-full cursor-grab active:cursor-grabbing"
        >
          <ambientLight intensity={1.4} />
          <directionalLight position={[10, 10, 5]} intensity={1.8} />
          <directionalLight position={[-10, -10, -5]} intensity={0.6} />
          <Suspense fallback={<Loader />}>
            <Model onSelect={(id) => setSelectedId(id)} />
          </Suspense>
          <OrbitControls
            enablePan={true}
            enableZoom={true}
            minDistance={2}
            maxDistance={10}
            makeDefault
          />
        </Canvas>
      ) : (
        <div className="flex flex-col items-center justify-center gap-3 text-cyan-400 text-sm">
          <RotateCcw className="w-8 h-8 animate-spin" />
          <span>Memuat Mesin 3D GPU...</span>
        </div>
      )}

      {/* 2. LABEL GARIS PENUNJUK DI LAYAR (MENGHINDARI MODEL 3D) */}
      <div className="absolute inset-0 pointer-events-none flex justify-between px-6 md:px-12 py-16 items-center">
        {/* Kolom Label Kiri */}
        <div className="flex flex-col gap-4 md:gap-5 z-10 pointer-events-auto">
          {organConfigs
            .filter((o) => o.side === "left")
            .map((org) => (
              <div key={org.id} className="flex items-center gap-3">
                <button
                  onClick={() => setSelectedId(org.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all shadow-xl flex items-center gap-2 cursor-pointer ${
                    selectedId === org.id
                      ? "bg-cyan-500 text-black border-cyan-400 shadow-cyan-500/30 scale-105"
                      : "bg-[#1a1a24]/90 hover:bg-white/10 border-white/15 text-gray-200"
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                  {org.name}
                </button>
                <div className="w-8 md:w-12 h-[1px] bg-cyan-500/40 hidden sm:block"></div>
              </div>
            ))}
        </div>

        {/* Kolom Label Kanan */}
        <div className="flex flex-col gap-4 md:gap-5 z-10 pointer-events-auto items-end">
          {organConfigs
            .filter((o) => o.side === "right")
            .map((org) => (
              <div
                key={org.id}
                className="flex items-center gap-3 flex-row-reverse"
              >
                <button
                  onClick={() => setSelectedId(org.id)}
                  className={`px-3.5 py-2 rounded-xl text-xs font-bold border backdrop-blur-md transition-all shadow-xl flex items-center gap-2 cursor-pointer ${
                    selectedId === org.id
                      ? "bg-cyan-500 text-black border-cyan-400 shadow-cyan-500/30 scale-105"
                      : "bg-[#1a1a24]/90 hover:bg-white/10 border-white/15 text-gray-200"
                  }`}
                >
                  {org.name}
                  <span className="w-2 h-2 rounded-full bg-cyan-400"></span>
                </button>
                <div className="w-8 md:w-12 h-[1px] bg-cyan-500/40 hidden sm:block"></div>
              </div>
            ))}
        </div>
      </div>

      {/* Petunjuk Bawah */}
      <div className="absolute bottom-6 left-1/2 -translate-x-1/2 bg-black/70 backdrop-blur-md px-5 py-2 rounded-full border border-white/10 text-xs text-gray-300 pointer-events-none shadow-xl z-10 whitespace-nowrap text-center max-w-[90vw]">
        💡 Klik titik jangkar pada organ atau tombol di sisi kiri/kanan untuk melihat detail &amp; materi.
      </div>

      {/* 3. PANEL MATERI & CHAT AI DI KANAN */}
      <AnimatePresence>
        {activeOrgan && (
          <motion.div
            initial={{ x: "100%", opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0 }}
            transition={{ type: "spring", damping: 25, stiffness: 200 }}
            className="absolute top-0 right-0 w-full sm:w-[420px] h-full bg-[#1a1a24]/95 backdrop-blur-2xl border-l border-white/10 p-6 flex flex-col justify-between shadow-2xl z-50 pointer-events-auto overflow-y-auto"
          >
            <div className="overflow-y-auto pr-1">
              <div className="flex justify-between items-center mb-4">
                <span className="text-xs uppercase tracking-wider text-cyan-400 font-bold">
                  SVA Dev Medical Lab
                </span>
                <button
                  onClick={() => setSelectedId("overview")}
                  className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 flex items-center justify-center text-sm font-bold text-gray-300 hover:text-white transition-all cursor-pointer"
                  title="Tutup Panel"
                >
                  ✕
                </button>
              </div>

              <h2 className="text-2xl font-extrabold text-white mt-1">
                {activeOrgan.name}
              </h2>
              <p className="text-sm text-gray-300 mt-3 leading-relaxed">
                {activeOrgan.desc}
              </p>

              <div className="mt-6">
                <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-2 text-cyan-400">
                  Fungsi Utama:
                </h4>
                <ul className="space-y-2 text-sm text-gray-200">
                  {activeOrgan.funcs.map((f, idx) => (
                    <li
                      key={idx}
                      className="flex items-center gap-2.5 bg-white/5 p-2.5 rounded-xl border border-white/5"
                    >
                      <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 shrink-0"></span>
                      <span>{f}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>

            {/* Kotak Chat AI */}
            <div className="mt-4 pt-4 border-t border-white/10 flex flex-col gap-2">
              <div className="flex items-center gap-1.5">
                <Bot className="w-4 h-4 text-cyan-400" />
                <span className="text-xs font-semibold text-cyan-400">
                  Tanya AI tentang bagian ini
                </span>
              </div>
              <div className="max-h-32 overflow-y-auto flex flex-col gap-1.5 text-xs pr-1">
                {chatHistory.length === 0 && (
                  <p className="text-gray-500 italic bg-black/30 p-2 rounded-xl border border-white/5">
                    "Ada yang ingin ditanyakan tentang {activeOrgan.name}?"
                  </p>
                )}
                {chatHistory.map((c, i) => (
                  <div
                    key={i}
                    className={`p-2 rounded-xl leading-relaxed ${
                      c.sender === "user"
                        ? "bg-cyan-500/20 text-cyan-200 self-end max-w-[85%] border border-cyan-500/30"
                        : "bg-white/5 text-gray-300 self-start max-w-[85%] border border-white/10"
                    }`}
                  >
                    {c.text}
                  </div>
                ))}
              </div>
              <form onSubmit={handleSendChat} className="flex gap-2 mt-1">
                <input
                  type="text"
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  placeholder="Ketik pertanyaan..."
                  className="flex-1 bg-black/50 border border-white/10 rounded-xl px-3 py-2 text-xs text-white focus:outline-hidden focus:border-cyan-500 transition-all placeholder-gray-500"
                />
                <button
                  type="submit"
                  className="bg-cyan-500 hover:bg-cyan-400 text-black px-4 py-2 rounded-xl text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1 shrink-0"
                >
                  <span>Kirim</span>
                  <Send className="w-3 h-3" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
