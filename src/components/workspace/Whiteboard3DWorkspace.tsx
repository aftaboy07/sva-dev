"use client";

import React, { useState, useEffect, useRef, useCallback, Suspense } from "react";
import { Canvas } from "@react-three/fiber";
import { OrbitControls, useGLTF, Center, Html, Float } from "@react-three/drei";
import { motion, AnimatePresence } from "framer-motion";
import {
  PenTool,
  Eraser,
  RotateCcw,
  RotateCw,
  Trash2,
  MousePointer,
  Download,
  Bot,
  Send,
  X,
  Sparkles,
  Maximize2,
  Minimize2,
  Upload,
  Layers,
  Box,
  Palette,
  Check,
  RefreshCw,
  FileText,
  Volume2,
  VolumeX,
  Grid,
  CircleDot,
  Square,
  HelpCircle,
} from "lucide-react";
import * as THREE from "three";

// =============================================================================
// PRESET 3D MODELS METADATA
// =============================================================================
interface ModelOption {
  id: string;
  name: string;
  category: string;
  url: string;
  scale: number;
  description: string;
  defaultHotspots?: Array<{
    id: string;
    name: string;
    pos: [number, number, number];
    desc: string;
  }>;
}

const PRESET_MODELS: ModelOption[] = [
  {
    id: "digestive",
    name: "Organ Pencernaan Manusia",
    category: "Biologi & Anatomi",
    url: "/anatomy/organ_pencernaan_manusia.glb",
    scale: 1.8,
    description: "Sistem pencernaan lengkap dari rongga mulut, lambung, hepar hingga usus.",
    defaultHotspots: [
      { id: "brain", name: "Otak (Brain)", pos: [0, 1.8, 0], desc: "Pusat sistem saraf & koordinasi motorik." },
      { id: "lungs", name: "Paru-Paru (Lungs)", pos: [0, 0.5, 0], desc: "Pertukaran O2 dan CO2 dalam sistem respirasi." },
      { id: "heart", name: "Jantung (Heart)", pos: [-0.15, 0.6, 0.2], desc: "Memompa darah beroksigen ke seluruh jaringan tubuh." },
      { id: "liver", name: "Hati (Liver)", pos: [0.3, 0.1, 0.15], desc: "Kelenjar metabolisme & detoksifikasi racun darah." },
      { id: "stomach", name: "Lambung (Stomach)", pos: [-0.2, -0.1, 0.2], desc: "Pencernaan enzimatik (HCl & pepsin)." },
      { id: "intestines", name: "Usus Halus & Besar", pos: [0, -0.9, 0], desc: "Penyerapan nutrisi esensial & pembuangan sisa limbah." },
    ],
  },
  {
    id: "skull",
    name: "Tulang Tengkorak Manusia",
    category: "Osteologi & Rangka",
    url: "/anatomy/tulang_tengkorak_manusia.glb",
    scale: 1.4,
    description: "Struktur kranium dan mandibula pelindung sistem saraf pusat manusia.",
    defaultHotspots: [
      { id: "cranium", name: "Kranium (Tempurung)", pos: [0, 0.8, 0], desc: "Melindungi otak besar dan kecil dari benturan eksternal." },
      { id: "maxilla", name: "Maksila (Rahang Atas)", pos: [0, 0.1, 0.6], desc: "Membentuk dasar rongga mata dan penyangga gigi atas." },
      { id: "mandible", name: "Mandibula (Rahang Bawah)", pos: [0, -0.5, 0.6], desc: "Satu-satunya tulang kranium yang dapat digerakkan secara bebas." },
    ],
  },
];

// Preload preset GLTF
useGLTF.preload("/anatomy/organ_pencernaan_manusia.glb");

// =============================================================================
// 3D MODEL RENDERER WITH ERROR BOUNDARY & WIREFRAME SUPPORT
// =============================================================================
function Dynamic3DModel({
  url,
  scale = 1.5,
  wireframe = false,
  hotspots = [],
  onSelectHotspot,
}: {
  url: string;
  scale?: number;
  wireframe?: boolean;
  hotspots?: ModelOption["defaultHotspots"];
  onSelectHotspot?: (hotspot: any) => void;
}) {
  const { scene } = useGLTF(url);

  // Clone scene to allow isolated wireframe / material manipulation
  const processedScene = React.useMemo(() => {
    const clone = scene.clone();
    clone.traverse((child: any) => {
      if (child.isMesh && child.material) {
        child.material = child.material.clone();
        if (wireframe) {
          child.material.wireframe = true;
          child.material.color = new THREE.Color("#22d3ee");
        }
      }
    });
    return clone;
  }, [scene, wireframe]);

  return (
    <Center>
      <primitive object={processedScene} scale={scale} />

      {/* 3D Hotspot Anchors */}
      {hotspots &&
        hotspots.map((h) => (
          <Html key={h.id} position={h.pos} center>
            <button
              onClick={(e) => {
                e.stopPropagation();
                onSelectHotspot?.(h);
              }}
              className="group relative flex items-center justify-center p-1.5 focus:outline-hidden cursor-pointer"
              title={h.name}
            >
              <span className="w-4 h-4 rounded-full bg-cyan-400 border-2 border-black animate-ping absolute" />
              <span className="w-3.5 h-3.5 rounded-full bg-cyan-400 border-2 border-white shadow-[0_0_12px_#22d3ee] relative z-10 group-hover:scale-135 transition-transform" />
            </button>
          </Html>
        ))}
    </Center>
  );
}

function FallbackProceduralModel({ name }: { name: string }) {
  return (
    <Center>
      <Float speed={2} rotationIntensity={0.5} floatIntensity={0.5}>
        <mesh>
          <octahedronGeometry args={[1.5, 2]} />
          <meshStandardMaterial
            color="#22d3ee"
            roughness={0.2}
            metalness={0.8}
            wireframe={true}
          />
        </mesh>
      </Float>
      <Html center position={[0, -2, 0]}>
        <div className="bg-black/80 px-3 py-1.5 rounded-xl border border-cyan-500/40 text-cyan-300 text-xs font-mono whitespace-nowrap shadow-xl">
          3D Objek Kustom: {name}
        </div>
      </Html>
    </Center>
  );
}

function Loader() {
  return (
    <Html center>
      <div className="flex flex-col items-center gap-3 bg-black/85 px-6 py-4 rounded-2xl border border-cyan-500/40 backdrop-blur-xl shadow-2xl text-cyan-400">
        <div className="w-8 h-8 border-3 border-cyan-400 border-t-transparent rounded-full animate-spin" />
        <span className="text-xs font-bold tracking-wider uppercase">
          Memuat Model 3D...
        </span>
      </div>
    </Html>
  );
}

class ThreeErrorBoundary extends React.Component<
  { children: React.ReactNode; fallbackName: string },
  { hasError: boolean }
> {
  constructor(props: any) {
    super(props);
    this.state = { hasError: false };
  }
  static getDerivedStateFromError() {
    return { hasError: true };
  }
  componentDidCatch(error: any) {
    console.warn("Gagal memuat GLTF eksternal:", error);
  }
  render() {
    if (this.state.hasError) {
      return <FallbackProceduralModel name={this.props.fallbackName} />;
    }
    return this.props.children;
  }
}

// =============================================================================
// WHITEBOARD STROKE TYPES & PALETTES
// =============================================================================
interface StrokePoint {
  x: number;
  y: number;
}

interface WhiteboardStroke {
  id: string;
  points?: StrokePoint[];
  color: string;
  width: number;
  isEraser: boolean;
  isHighlighter?: boolean;
}

const COLOR_PALETTE = [
  { name: "Cyan Neon", hex: "#22d3ee" },
  { name: "Emerald", hex: "#34d399" },
  { name: "Amber Gold", hex: "#facc15" },
  { name: "Rose Pink", hex: "#f43f5e" },
  { name: "Violet", hex: "#c084fc" },
  { name: "Pure White", hex: "#ffffff" },
];

const STROKE_WIDTHS = [2, 4, 8, 14, 24];

// =============================================================================
// MAIN WORKSPACE COMPONENT
// =============================================================================
export default function Whiteboard3DWorkspace() {
  // ---------------------------------------------------------------------------
  // 1. TOP-LEVEL VIEW TOGGLE: "Workspace 3D" vs "Papan Tulis Kosong"
  // ---------------------------------------------------------------------------
  const [workspaceView, setWorkspaceView] = useState<"3d" | "whiteboard">("3d");
  const [boardPattern, setBoardPattern] = useState<"dots" | "grid" | "plain">("dots");

  // Mode Toggle within 3D View (Navigate vs Draw)
  const [activeMode, setActiveMode] = useState<"navigate" | "draw">("navigate");
  const [isFullscreen, setIsFullscreen] = useState(false);
  const containerRef = useRef<HTMLDivElement | null>(null);

  // In "Papan Tulis Kosong" mode, drawing mode is ALWAYS active
  const isDrawModeActive = workspaceView === "whiteboard" || activeMode === "draw";

  // ---------------------------------------------------------------------------
  // 2. 3D MODEL & DRAG-AND-DROP STATE
  // ---------------------------------------------------------------------------
  const [currentModel, setCurrentModel] = useState<ModelOption>(PRESET_MODELS[0]);
  const [customModelUrl, setCustomModelUrl] = useState<string | null>(null);
  const [customModelName, setCustomModelName] = useState<string>("");
  const [isDragOver, setIsDragOver] = useState(false);
  const [isWireframe, setIsWireframe] = useState(false);
  const [autoRotate, setAutoRotate] = useState(false);
  const [selectedHotspot, setSelectedHotspot] = useState<any | null>(null);

  const orbitControlsRef = useRef<any>(null);

  // ---------------------------------------------------------------------------
  // 3. FLOATING WHITEBOARD DRAWING ENGINE (TRANSPARENT GLASS OVERLAY)
  // ---------------------------------------------------------------------------
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [strokes, setStrokes] = useState<WhiteboardStroke[]>([]);
  const [redoStack, setRedoStack] = useState<WhiteboardStroke[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const currentStrokeRef = useRef<WhiteboardStroke | null>(null);

  // Tool states
  const [currentTool, setCurrentTool] = useState<"pen" | "highlighter" | "eraser">("pen");
  const [currentColor, setCurrentColor] = useState<string>("#22d3ee");
  const [strokeWidth, setStrokeWidth] = useState<number>(4);

  // ---------------------------------------------------------------------------
  // 4. TOUCHSCREEN / STYLUS SIMULATION STATE (HIDE MOUSE ARROW)
  // ---------------------------------------------------------------------------
  const [stylusPos, setStylusPos] = useState<{ clientX: number; clientY: number } | null>(null);

  // Synchronize canvas size on resize
  useEffect(() => {
    const handleResize = () => {
      const canvas = canvasRef.current;
      const container = containerRef.current;
      if (!canvas || !container) return;

      const dpr = window.devicePixelRatio || 1;
      const rect = container.getBoundingClientRect();

      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      canvas.style.width = `${rect.width}px`;
      canvas.style.height = `${rect.height}px`;

      redrawCanvas();
    };

    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // Redraw all strokes on canvas
  const redrawCanvas = useCallback(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const dpr = window.devicePixelRatio || 1;
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    strokes.forEach((stroke) => {
      if (!stroke?.points || stroke.points.length < 2) return;

      ctx.save();
      ctx.scale(dpr, dpr);

      if (stroke.isEraser) {
        ctx.globalCompositeOperation = "destination-out";
        ctx.lineWidth = stroke.width * 2.8;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
      } else {
        ctx.globalCompositeOperation = "source-over";
        ctx.strokeStyle = stroke.color;
        ctx.lineWidth = stroke.width;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";

        if (stroke.isHighlighter) {
          ctx.globalAlpha = 0.45;
        } else {
          ctx.globalAlpha = 1.0;
          ctx.shadowColor = stroke.color;
          ctx.shadowBlur = stroke.width > 6 ? 6 : 2;
        }
      }

      ctx.beginPath();
      ctx.moveTo(stroke.points[0].x, stroke.points[0].y);

      // Smooth Bezier Curve interpolation
      for (let i = 1; i < stroke.points.length - 1; i++) {
        const p1 = stroke.points[i];
        const p2 = stroke.points[i + 1];
        if (!p1 || !p2) continue;
        const xc = (p1.x + p2.x) / 2;
        const yc = (p1.y + p2.y) / 2;
        ctx.quadraticCurveTo(p1.x, p1.y, xc, yc);
      }

      const last = stroke.points[stroke.points.length - 1];
      if (last) {
        ctx.lineTo(last.x, last.y);
      }
      ctx.stroke();

      ctx.restore();
    });
  }, [strokes]);

  useEffect(() => {
    redrawCanvas();
  }, [strokes, redrawCanvas]);

  // Pointer event handlers for drawing
  const getCanvasCoords = (e: React.PointerEvent<HTMLCanvasElement>): StrokePoint => {
    const rect = canvasRef.current!.getBoundingClientRect();
    return {
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    };
  };

  const handlePointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawModeActive) return;
    e.preventDefault();
    try {
      (e.target as HTMLElement).setPointerCapture(e.pointerId);
    } catch {
      // ignore
    }

    const pt = getCanvasCoords(e);
    setStylusPos({ clientX: e.clientX, clientY: e.clientY });

    const newStroke: WhiteboardStroke = {
      id: `str-${Date.now()}-${Math.random()}`,
      points: [pt, pt],
      color: currentColor,
      width: strokeWidth,
      isEraser: currentTool === "eraser",
      isHighlighter: currentTool === "highlighter",
    };

    currentStrokeRef.current = newStroke;
    setIsDrawing(true);
    setStrokes((prev) => [...prev, newStroke]);
    setRedoStack([]);
  };

  const handlePointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (isDrawModeActive) {
      setStylusPos({ clientX: e.clientX, clientY: e.clientY });
    }

    if (!isDrawing || !currentStrokeRef.current || !isDrawModeActive) return;
    e.preventDefault();

    const pt = getCanvasCoords(e);
    if (!currentStrokeRef.current.points) {
      currentStrokeRef.current.points = [];
    }
    currentStrokeRef.current.points.push(pt);

    setStrokes((prev) => {
      if (prev.length === 0 || !currentStrokeRef.current) return prev;
      const copy = [...prev];
      copy[copy.length - 1] = {
        ...currentStrokeRef.current,
        points: [...(currentStrokeRef.current.points || [])],
      };
      return copy;
    });
  };

  const handlePointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (!isDrawing) return;
    try {
      (e.target as HTMLElement).releasePointerCapture(e.pointerId);
    } catch {
      // ignore
    }
    setIsDrawing(false);
    currentStrokeRef.current = null;
  };

  const handlePointerLeave = () => {
    setStylusPos(null);
  };

  const handleUndo = () => {
    if (strokes.length === 0) return;
    const last = strokes[strokes.length - 1];
    setStrokes((prev) => prev.slice(0, -1));
    setRedoStack((prev) => [last, ...prev]);
  };

  const handleRedo = () => {
    if (redoStack.length === 0) return;
    const next = redoStack[0];
    setRedoStack((prev) => prev.slice(1));
    setStrokes((prev) => [...prev, next]);
  };

  const handleClearBoard = () => {
    if (strokes.length === 0) return;
    setStrokes([]);
    setRedoStack([]);
  };

  const handleExportSnapshot = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const dataUrl = canvas.toDataURL("image/png");
    const link = document.createElement("a");
    link.download = `Anotasi_EduQuest_${Date.now()}.png`;
    link.href = dataUrl;
    link.click();
  };

  // ---------------------------------------------------------------------------
  // 5. DRAG AND DROP HANDLERS FOR .GLB / .GLTF
  // ---------------------------------------------------------------------------
  const handleDragOver = (e: React.DragEvent) => {
    if (workspaceView !== "3d") return;
    e.preventDefault();
    setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    if (workspaceView !== "3d") return;
    e.preventDefault();
    setIsDragOver(false);

    const file = e.dataTransfer.files?.[0];
    if (file) {
      const ext = file.name.toLowerCase();
      if (ext.endsWith(".glb") || ext.endsWith(".gltf")) {
        const objectUrl = URL.createObjectURL(file);
        setCustomModelUrl(objectUrl);
        setCustomModelName(file.name);
        setCurrentModel({
          id: `custom-${Date.now()}`,
          name: file.name,
          category: "Model 3D Lokal",
          url: objectUrl,
          scale: 1.5,
          description: `Berkas kustom ${file.name} dimuat langsung via drag & drop.`,
        });
        setSelectedHotspot(null);
      } else {
        alert("Mohon masukkan berkas 3D dengan format .glb atau .gltf!");
      }
    }
  };

  // ---------------------------------------------------------------------------
  // 6. INTEGRATED COLLAPSIBLE AI CHATBOT PANEL
  // ---------------------------------------------------------------------------
  const [isChatOpen, setIsChatOpen] = useState(false);
  const [chatInput, setChatInput] = useState("");
  const [chatMessages, setChatMessages] = useState<
    Array<{ id: string; sender: "user" | "ai"; text: string; timestamp: string }>
  >([
    {
      id: "ai-welcome",
      sender: "ai",
      text: "Halo Bapak/Ibu Guru! Saya asisten visual AI EduQuest. Anda dapat menanyakan fungsi biologis organ yang sedang diperiksa, meminta materi tulisan papan tulis, atau skema ilustrasi interaktif.",
      timestamp: "Sekarang",
    },
  ]);
  const [isAiTyping, setIsAiTyping] = useState(false);
  const [speechEnabled, setSpeechEnabled] = useState(true);
  const chatBottomRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    chatBottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [chatMessages, isAiTyping]);

  const handleSendChatMessage = (messageText?: string) => {
    const textToSend = messageText || chatInput;
    if (!textToSend.trim()) return;

    const userMsg = {
      id: `user-${Date.now()}`,
      sender: "user" as const,
      text: textToSend,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => [...prev, userMsg]);
    if (!messageText) setChatInput("");
    setIsAiTyping(true);

    setTimeout(() => {
      let reply = "";
      const q = textToSend.toLowerCase();

      if (q.includes("lambung") || q.includes("stomach")) {
        reply = "Lambung (Stomach) memproduksi asam klorida (HCl pH 1.5-2.0) untuk membunuh patogen makanan dan mengaktifkan pepsinogen menjadi enzim pepsin pemecah protein. Anotasikan zona kardiak, fundus, korpus, dan pilorus pada papan tulis!";
      } else if (q.includes("hati") || q.includes("liver") || q.includes("hepar")) {
        reply = "Hati (Hepar) adalah organ metabolik terbesar yang mensekresikan garam empedu untuk mengemulsi lemak, serta menyimpan glikogen dan menyaring toksin sistem vena porta hepatika.";
      } else if (q.includes("tengkorak") || q.includes("skull") || q.includes("kranium")) {
        reply = "Tulang tengkorak manusia tersusun atas 22 tulang yang disatukan oleh sutura (sendi mati), kecuali tulang mandibula (rahang bawah) yang memiliki sendi temporomandibular (TMJ) sehingga dapat digerakkan bebas.";
      } else if (q.includes("anotasi") || q.includes("papan tulis") || q.includes("catatan") || q.includes("rumus")) {
        reply = "Ide Struktur Papan Tulis:\n1. Judul Materi (Warna Cyan #22d3ee)\n2. Diagram Alir / Skema Panah (Warna Emerald #34d399)\n3. Catatan Kritis / Definisi Enzim (Warna Kuning #facc15)\n4. Peringatan / Hal Khusus (Warna Rose #f43f5e).";
      } else {
        reply = `Berdasarkan mode pembelajaran aktif (${workspaceView === "3d" ? "Model 3D: " + currentModel.name : "Papan Tulis Kosong"}), Anda dapat memanfaatkan pena dan stabilo untuk mencatat poin penting materi ajar sambil berdiskusi dengan siswa.`;
      }

      const aiMsg = {
        id: `ai-${Date.now()}`,
        sender: "ai" as const,
        text: reply,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => [...prev, aiMsg]);
      setIsAiTyping(false);
    }, 900);
  };

  const handleResetCamera = () => {
    if (orbitControlsRef.current) {
      orbitControlsRef.current.reset();
    }
  };

  return (
    <div
      ref={containerRef}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative w-full overflow-hidden select-none transition-all duration-300 rounded-3xl border border-white/10 shadow-2xl bg-[#0f0f13] ${
        isFullscreen ? "fixed inset-0 z-50 rounded-none h-screen" : "h-[calc(100vh-100px)] min-h-[640px]"
      }`}
    >
      {/* ===================================================================== */}
      {/* LAYER 0 (z-0): VIEWPORT AREA                                          */}
      {/* - If workspaceView === "3d": Renders R3F 3D Canvas                   */}
      {/* - If workspaceView === "whiteboard": Unmounts 3D, renders Pure Grid   */}
      {/* ===================================================================== */}
      <div className="absolute inset-0 z-0">
        {workspaceView === "3d" ? (
          <Canvas
            camera={{ position: [0, 0, 5.5], fov: 45 }}
            className={`w-full h-full ${
              activeMode === "navigate" ? "cursor-grab active:cursor-grabbing" : ""
            }`}
          >
            <ambientLight intensity={1.2} />
            <directionalLight position={[10, 15, 8]} intensity={1.8} castShadow />
            <directionalLight position={[-10, -10, -8]} intensity={0.6} />
            <pointLight position={[0, 4, 3]} intensity={0.8} color="#22d3ee" />

            <gridHelper args={[20, 20, "#1e293b", "#0f172a"]} position={[0, -2, 0]} />

            <Suspense fallback={<Loader />}>
              <ThreeErrorBoundary fallbackName={currentModel.name}>
                <Dynamic3DModel
                  url={currentModel.url}
                  scale={currentModel.scale}
                  wireframe={isWireframe}
                  hotspots={currentModel.defaultHotspots}
                  onSelectHotspot={(h) => setSelectedHotspot(h)}
                />
              </ThreeErrorBoundary>
            </Suspense>

            <OrbitControls
              ref={orbitControlsRef}
              enablePan={true}
              enableZoom={true}
              minDistance={1.5}
              maxDistance={12}
              autoRotate={autoRotate}
              autoRotateSpeed={1.5}
              makeDefault
            />
          </Canvas>
        ) : (
          /* Pure Whiteboard Background with Customizable Grid */
          <div
            className={`w-full h-full relative transition-colors duration-300 ${
              boardPattern === "dots"
                ? "bg-[#0b0b10] [background-image:radial-gradient(#22d3ee18_1.5px,transparent_1.5px)] [background-size:28px_28px]"
                : boardPattern === "grid"
                ? "bg-[#0b0b10] [background-image:linear-gradient(to_right,#ffffff0a_1px,transparent_1px),linear-gradient(to_bottom,#ffffff0a_1px,transparent_1px)] [background-size:32px_32px]"
                : "bg-[#0b0b10]"
            }`}
          >
            {/* Center Subtle Watermark */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-5">
              <div className="text-center">
                <FileText className="w-36 h-36 mx-auto mb-2 text-white" />
                <span className="text-2xl font-black font-mono tracking-widest text-white">
                  EDUQUEST DIGITAL WHITEBOARD
                </span>
              </div>
            </div>
          </div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* LAYER 10 (z-10): DRAG & DROP OVERLAY INDICATOR (3D VIEW ONLY)         */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isDragOver && workspaceView === "3d" && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-10 bg-cyan-950/70 backdrop-blur-md border-4 border-dashed border-cyan-400 flex flex-col items-center justify-center p-8 pointer-events-none"
          >
            <div className="w-20 h-20 rounded-3xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300 mb-4 animate-bounce">
              <Upload className="w-10 h-10" />
            </div>
            <h3 className="text-xl font-black text-white text-center">
              Lepaskan File .GLB / .GLTF di Sini
            </h3>
            <p className="text-xs text-cyan-200 text-center mt-1">
              Model 3D akan dirender otomatis ke workspace pembelajaran aktif.
            </p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ===================================================================== */}
      {/* LAYER 20 (z-20): FLOATING WHITEBOARD CANVAS OVERLAY                   */}
      {/* MANDATORY TOUCHSCREEN SIMULATION (SPECIFICATION 2):                  */}
      {/* - cursor: none when in drawing mode (no visible mouse arrow!)         */}
      {/* - pointer-events: none in 3D navigate mode                           */}
      {/* - pointer-events: auto in drawing mode                                */}
      {/* ===================================================================== */}
      <canvas
        ref={canvasRef}
        onPointerDown={handlePointerDown}
        onPointerMove={handlePointerMove}
        onPointerUp={handlePointerUp}
        onPointerCancel={handlePointerUp}
        onPointerLeave={handlePointerLeave}
        style={{
          cursor: isDrawModeActive ? "none" : "default",
        }}
        className={`absolute inset-0 z-20 transition-opacity duration-150 ${
          isDrawModeActive
            ? "pointer-events-auto cursor-none select-none"
            : "pointer-events-none"
        }`}
      />

      {/* ===================================================================== */}
      {/* TOUCHSCREEN / STYLUS PEN-TIP POINTER (SPECIFICATION 2)                */}
      {/* Renders a clean, tiny circular dot that follows the pointer coords,   */}
      {/* completely replacing the default mouse arrow during drawing.          */}
      {/* ===================================================================== */}
      {isDrawModeActive && stylusPos && (
        <div
          className="pointer-events-none fixed z-30 transition-transform duration-75 ease-out"
          style={{
            left: stylusPos.clientX,
            top: stylusPos.clientY,
            transform: "translate(-50%, -50%)",
          }}
        >
          {currentTool === "eraser" ? (
            /* Eraser Circle Indicator */
            <div
              className="rounded-full border-2 border-rose-400 bg-rose-500/20 backdrop-blur-xs flex items-center justify-center"
              style={{
                width: strokeWidth * 2.8,
                height: strokeWidth * 2.8,
              }}
            >
              <div className="w-1.5 h-1.5 rounded-full bg-rose-400" />
            </div>
          ) : (
            /* Stylus Digital Pen Tip Dot */
            <div className="relative flex items-center justify-center">
              <div
                className="rounded-full shadow-[0_0_8px_currentColor] transition-all"
                style={{
                  width: Math.max(5, Math.min(strokeWidth * 1.2, 26)),
                  height: Math.max(5, Math.min(strokeWidth * 1.2, 26)),
                  backgroundColor: currentColor,
                  color: currentColor,
                  opacity: currentTool === "highlighter" ? 0.6 : 0.95,
                }}
              />
              <div
                className="absolute rounded-full border border-white/40"
                style={{
                  width: Math.max(12, strokeWidth * 1.5 + 8),
                  height: Math.max(12, strokeWidth * 1.5 + 8),
                  borderColor: currentColor,
                  opacity: 0.35,
                }}
              />
            </div>
          )}
        </div>
      )}

      {/* ===================================================================== */}
      {/* LAYER 30 (z-30): TOP NAVIGATION BAR & VIEW SWITCHER (SPEC 1 & 3)       */}
      {/* ALWAYS CLICKABLE (pointer-events-auto)                                */}
      {/* ===================================================================== */}
      <div className="absolute top-4 inset-x-4 z-30 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        {/* Left Section: Pure Whiteboard vs 3D Segmented Control + Model/Grid Controls */}
        <div className="flex flex-wrap items-center gap-2 pointer-events-auto bg-[#1a1a24]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
          {/* MAIN VIEW TOGGLE (SPECIFICATION 1: Workspace 3D vs Papan Tulis Kosong) */}
          <div className="flex items-center p-0.5 rounded-xl bg-black/60 border border-white/10 mr-1">
            <button
              onClick={() => {
                setWorkspaceView("3d");
                setActiveMode("navigate");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                workspaceView === "3d"
                  ? "bg-gradient-to-r from-cyan-400 to-teal-400 text-black shadow-md shadow-cyan-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <Box className="w-3.5 h-3.5" />
              <span>Workspace 3D</span>
            </button>

            <button
              onClick={() => {
                setWorkspaceView("whiteboard");
                setActiveMode("draw");
              }}
              className={`px-3 py-1.5 rounded-lg text-xs font-black flex items-center gap-1.5 transition-all cursor-pointer ${
                workspaceView === "whiteboard"
                  ? "bg-gradient-to-r from-purple-500 to-indigo-500 text-white shadow-md shadow-purple-500/25"
                  : "text-gray-400 hover:text-white"
              }`}
            >
              <FileText className="w-3.5 h-3.5" />
              <span>Papan Tulis Kosong</span>
            </button>
          </div>

          {/* Conditional Controls depending on Active View */}
          {workspaceView === "3d" ? (
            <>
              {/* Model Dropdown */}
              <select
                value={currentModel.id}
                onChange={(e) => {
                  const selected = PRESET_MODELS.find((m) => m.id === e.target.value);
                  if (selected) {
                    setCurrentModel(selected);
                    setSelectedHotspot(null);
                  }
                }}
                className="bg-black/60 border border-white/15 px-3 py-1.5 rounded-xl text-xs font-bold text-white focus:outline-hidden focus:border-cyan-400 cursor-pointer"
              >
                {PRESET_MODELS.map((m) => (
                  <option key={m.id} value={m.id}>
                    {m.name}
                  </option>
                ))}
                {customModelUrl && (
                  <option value={currentModel.id}>
                    {customModelName} (Kustom)
                  </option>
                )}
              </select>

              {/* 3D Wireframe Toggle */}
              <button
                onClick={() => setIsWireframe(!isWireframe)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  isWireframe
                    ? "bg-cyan-500/20 border-cyan-400 text-cyan-300 shadow-lg shadow-cyan-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
                title={isWireframe ? "Matikan Wireframe" : "Aktifkan Mode Wireframe 3D"}
              >
                <Layers className="w-4 h-4" />
              </button>

              {/* Auto-Rotate Toggle */}
              <button
                onClick={() => setAutoRotate(!autoRotate)}
                className={`p-2 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                  autoRotate
                    ? "bg-emerald-500/20 border-emerald-400 text-emerald-300 shadow-lg shadow-emerald-500/20"
                    : "bg-white/5 border-white/10 text-gray-400 hover:text-white"
                }`}
                title={autoRotate ? "Hentikan Rotasi Otomatis" : "Mulai Rotasi Otomatis"}
              >
                <RefreshCw className={`w-4 h-4 ${autoRotate ? "animate-spin" : ""}`} />
              </button>

              {/* Reset Camera Button */}
              <button
                onClick={handleResetCamera}
                className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-gray-400 hover:text-white transition-all cursor-pointer"
                title="Reset Sudut Pandang Kamera"
              >
                <RotateCcw className="w-4 h-4" />
              </button>
            </>
          ) : (
            /* Pure Whiteboard Background Pattern Switcher */
            <div className="flex items-center gap-1 bg-black/60 p-1 rounded-xl border border-white/10">
              <button
                onClick={() => setBoardPattern("dots")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  boardPattern === "dots"
                    ? "bg-purple-500/30 text-purple-300 border border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Pola Titik / Dots"
              >
                <CircleDot className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Titik Dot</span>
              </button>

              <button
                onClick={() => setBoardPattern("grid")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  boardPattern === "grid"
                    ? "bg-purple-500/30 text-purple-300 border border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Pola Kotak / Grid"
              >
                <Grid className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Grid Matematika</span>
              </button>

              <button
                onClick={() => setBoardPattern("plain")}
                className={`px-2.5 py-1 rounded-lg text-[11px] font-bold flex items-center gap-1 transition-all ${
                  boardPattern === "plain"
                    ? "bg-purple-500/30 text-purple-300 border border-purple-400"
                    : "text-gray-400 hover:text-white"
                }`}
                title="Papan Polos Gelap"
              >
                <Square className="w-3.5 h-3.5" />
                <span className="hidden sm:inline">Polos</span>
              </button>
            </div>
          )}
        </div>

        {/* Center: IN 3D VIEW -> MODE TOGGLE (NAVIGATE vs DRAW) */}
        {workspaceView === "3d" && (
          <div className="flex items-center pointer-events-auto bg-[#1a1a24]/90 backdrop-blur-xl border border-white/10 rounded-2xl p-1.5 shadow-2xl">
            <button
              onClick={() => setActiveMode("navigate")}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeMode === "navigate"
                  ? "bg-gradient-to-r from-emerald-400 to-teal-500 text-black shadow-lg shadow-emerald-500/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <MousePointer className="w-4 h-4" />
              <span>Mode Navigasi 3D</span>
            </button>

            <button
              onClick={() => setActiveMode("draw")}
              className={`px-4 py-2 rounded-xl text-xs font-black flex items-center gap-2 transition-all cursor-pointer ${
                activeMode === "draw"
                  ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black shadow-lg shadow-cyan-500/25"
                  : "text-gray-400 hover:text-white hover:bg-white/5"
              }`}
            >
              <PenTool className="w-4 h-4" />
              <span>Mode Menggambar</span>
            </button>
          </div>
        )}

        {/* Right Section: AI Assistant Trigger & Fullscreen Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
          <button
            onClick={() => setIsChatOpen(!isChatOpen)}
            className={`px-4 py-2.5 rounded-2xl border text-xs font-black flex items-center gap-2 transition-all cursor-pointer shadow-2xl ${
              isChatOpen
                ? "bg-cyan-500 text-black border-cyan-400 shadow-cyan-500/30"
                : "bg-[#1a1a24]/90 backdrop-blur-xl border-cyan-500/40 text-cyan-300 hover:bg-cyan-500/20"
            }`}
          >
            <Bot className="w-4 h-4" />
            <span className="hidden sm:inline">Asisten AI 3D</span>
            <Sparkles className="w-3.5 h-3.5 text-amber-300 animate-pulse" />
          </button>

          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-2.5 rounded-2xl bg-[#1a1a24]/90 backdrop-blur-xl border border-white/10 text-gray-300 hover:text-white hover:bg-white/10 transition-all cursor-pointer shadow-xl"
            title={isFullscreen ? "Keluar Fullscreen" : "Fullscreen Workspace"}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* ===================================================================== */}
      {/* LAYER 40 (z-40): FLOATING SLEEK WHITEBOARD TOOLBAR                    */}
      {/* ALWAYS CLICKABLE (pointer-events-auto)                                */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isDrawModeActive && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="absolute bottom-5 inset-x-0 z-40 flex justify-center pointer-events-none px-4"
          >
            <div className="pointer-events-auto bg-[#161622]/95 backdrop-blur-2xl border border-cyan-500/40 rounded-3xl p-3 sm:p-3.5 shadow-2xl flex flex-wrap items-center gap-3">
              {/* Tool Selection (Pen, Highlighter, Eraser) */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10">
                <button
                  onClick={() => setCurrentTool("pen")}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTool === "pen"
                      ? "bg-cyan-500 text-black shadow-md shadow-cyan-500/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Pena Gambar / Anotasi"
                >
                  <PenTool className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTool("highlighter")}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTool === "highlighter"
                      ? "bg-amber-400 text-black shadow-md shadow-amber-400/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Stabilo Transparan"
                >
                  <Palette className="w-4 h-4" />
                </button>

                <button
                  onClick={() => setCurrentTool("eraser")}
                  className={`p-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    currentTool === "eraser"
                      ? "bg-rose-500 text-white shadow-md shadow-rose-500/30"
                      : "text-gray-400 hover:text-white"
                  }`}
                  title="Penghapus Coretan"
                >
                  <Eraser className="w-4 h-4" />
                </button>
              </div>

              {/* Color Palette (Disabled if Eraser) */}
              {currentTool !== "eraser" && (
                <div className="flex items-center gap-1.5 px-1">
                  {COLOR_PALETTE.map((col) => (
                    <button
                      key={col.hex}
                      onClick={() => setCurrentColor(col.hex)}
                      style={{ backgroundColor: col.hex }}
                      className={`w-6 h-6 rounded-full transition-transform cursor-pointer relative flex items-center justify-center ${
                        currentColor === col.hex ? "scale-125 ring-2 ring-white" : "hover:scale-110 opacity-80"
                      }`}
                      title={col.name}
                    >
                      {currentColor === col.hex && <Check className="w-3.5 h-3.5 text-black stroke-[3]" />}
                    </button>
                  ))}
                </div>
              )}

              {/* Stroke Width Selector */}
              <div className="flex items-center gap-1 bg-black/50 p-1 rounded-2xl border border-white/10">
                {STROKE_WIDTHS.map((w) => (
                  <button
                    key={w}
                    onClick={() => setStrokeWidth(w)}
                    className={`w-7 h-7 rounded-xl flex items-center justify-center transition-all cursor-pointer ${
                      strokeWidth === w
                        ? "bg-cyan-500/30 text-cyan-300 font-bold border border-cyan-400"
                        : "text-gray-400 hover:text-white"
                    }`}
                    title={`Ukuran Garis: ${w}px`}
                  >
                    <div
                      className="rounded-full bg-current"
                      style={{ width: Math.min(16, Math.max(3, w * 1.2)), height: Math.min(16, Math.max(3, w * 1.2)) }}
                    />
                  </button>
                ))}
              </div>

              {/* Undo / Redo / Clear / Export */}
              <div className="flex items-center gap-1 border-l border-white/15 pl-2">
                <button
                  onClick={handleUndo}
                  disabled={strokes.length === 0}
                  className={`p-2 rounded-xl text-xs transition-colors ${
                    strokes.length > 0
                      ? "text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                      : "text-gray-600 cursor-not-allowed"
                  }`}
                  title="Urungkan Coretan (Undo)"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleRedo}
                  disabled={redoStack.length === 0}
                  className={`p-2 rounded-xl text-xs transition-colors ${
                    redoStack.length > 0
                      ? "text-gray-300 hover:text-white hover:bg-white/10 cursor-pointer"
                      : "text-gray-600 cursor-not-allowed"
                  }`}
                  title="Ulangi Coretan (Redo)"
                >
                  <RotateCw className="w-4 h-4" />
                </button>

                <button
                  onClick={handleClearBoard}
                  disabled={strokes.length === 0}
                  className={`p-2 rounded-xl text-xs transition-colors ${
                    strokes.length > 0
                      ? "text-rose-400 hover:bg-rose-500/20 cursor-pointer"
                      : "text-gray-600 cursor-not-allowed"
                  }`}
                  title="Hapus Seluruh Papan Tulis (Clear)"
                >
                  <Trash2 className="w-4 h-4" />
                </button>

                <button
                  onClick={handleExportSnapshot}
                  className="p-2 rounded-xl text-cyan-400 hover:bg-cyan-500/20 transition-colors cursor-pointer"
                  title="Unduh Tangkapan Anotasi (PNG)"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Mode Status Pill (Bottom Left) */}
      <div className="absolute bottom-5 left-5 z-30 pointer-events-none flex flex-col gap-2">
        <div className="px-3.5 py-1.5 rounded-2xl bg-black/75 backdrop-blur-xl border border-white/10 text-[11px] font-bold text-gray-300 shadow-xl flex items-center gap-2">
          <span
            className={`w-2.5 h-2.5 rounded-full ${
              workspaceView === "whiteboard"
                ? "bg-purple-400 animate-pulse"
                : activeMode === "draw"
                ? "bg-cyan-400 animate-pulse"
                : "bg-emerald-400"
            }`}
          />
          <span>
            {workspaceView === "whiteboard"
              ? "Papan Tulis Kosong Aktif: Simulasi Stylus Layar Sentuh Aktif"
              : activeMode === "draw"
              ? "Papan Tulis 3D Aktif: Coretan melayang di atas objek 3D"
              : "Navigasi 3D Aktif: Klik & seret untuk memutar objek"}
          </span>
        </div>

        {selectedHotspot && workspaceView === "3d" && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-3.5 rounded-2xl bg-[#161622]/95 backdrop-blur-xl border border-cyan-500/40 text-xs shadow-2xl max-w-xs pointer-events-auto"
          >
            <div className="flex items-center justify-between pb-1.5 border-b border-white/10">
              <span className="font-black text-cyan-300">{selectedHotspot.name}</span>
              <button
                onClick={() => setSelectedHotspot(null)}
                className="text-gray-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            <p className="text-[11px] text-gray-300 mt-1.5 leading-relaxed">
              {selectedHotspot.desc}
            </p>
            <button
              onClick={() => {
                setIsChatOpen(true);
                handleSendChatMessage(`Jelaskan lebih mendalam tentang ${selectedHotspot.name} dan fungsinya.`);
              }}
              className="mt-2 w-full py-1 rounded-xl bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 font-bold text-[10px] flex items-center justify-center gap-1 border border-cyan-500/30 transition-all cursor-pointer"
            >
              <Bot className="w-3 h-3" />
              <span>Tanyakan ke AI</span>
            </button>
          </motion.div>
        )}
      </div>

      {/* ===================================================================== */}
      {/* LAYER 50 (z-50): COLLAPSIBLE SLIDING AI CHATBOT PANEL (RIGHT SIDE)    */}
      {/* ALWAYS CLICKABLE (pointer-events-auto)                                */}
      {/* ===================================================================== */}
      <AnimatePresence>
        {isChatOpen && (
          <motion.div
            initial={{ x: "100%", opacity: 0.8 }}
            animate={{ x: 0, opacity: 1 }}
            exit={{ x: "100%", opacity: 0.8 }}
            transition={{ type: "spring", damping: 25, stiffness: 240 }}
            className="absolute top-0 right-0 bottom-0 w-full sm:w-96 z-50 bg-[#12121a]/95 backdrop-blur-2xl border-l border-cyan-500/30 shadow-2xl flex flex-col pointer-events-auto"
          >
            {/* Chatbot Header */}
            <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/40">
              <div className="flex items-center gap-2.5">
                <div className="w-10 h-10 rounded-2xl bg-cyan-500/20 border border-cyan-400 flex items-center justify-center text-cyan-300">
                  <Bot className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="text-sm font-black text-white flex items-center gap-1.5">
                    <span>Prof. EduQuest AI</span>
                    <Sparkles className="w-3.5 h-3.5 text-amber-300" />
                  </h4>
                  <div className="flex items-center gap-1.5 text-[10px] text-emerald-400 font-medium">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Mendampingi Sesi Mengajar</span>
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-1">
                <button
                  onClick={() => setSpeechEnabled(!speechEnabled)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white"
                  title={speechEnabled ? "Matikan Efek Suara" : "Aktifkan Efek Suara"}
                >
                  {speechEnabled ? <Volume2 className="w-4 h-4 text-cyan-400" /> : <VolumeX className="w-4 h-4" />}
                </button>
                <button
                  onClick={() => setIsChatOpen(false)}
                  className="p-1.5 rounded-xl text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Quick Suggestion Chips */}
            <div className="p-3 bg-black/20 border-b border-white/5 flex gap-1.5 overflow-x-auto custom-scrollbar">
              <button
                onClick={() => handleSendChatMessage("Jelaskan sistem pencernaan secara sistematis.")}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-gray-300 text-[10px] font-semibold whitespace-nowrap transition-colors"
              >
                Pencernaan Manusia
              </button>
              <button
                onClick={() => handleSendChatMessage("Apa fungsi tulang tengkorak kranial?")}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-gray-300 text-[10px] font-semibold whitespace-nowrap transition-colors"
              >
                Tulang Tengkorak
              </button>
              <button
                onClick={() => handleSendChatMessage("Beri ide catatan papan tulis untuk materi ini.")}
                className="px-2.5 py-1 rounded-xl bg-white/5 hover:bg-cyan-500/20 border border-white/10 text-gray-300 text-[10px] font-semibold whitespace-nowrap transition-colors"
              >
                Ide Papan Tulis
              </button>
            </div>

            {/* Message History Area */}
            <div className="flex-1 p-4 overflow-y-auto space-y-3.5 custom-scrollbar text-xs">
              {chatMessages.map((msg) => (
                <div
                  key={msg.id}
                  className={`flex flex-col ${msg.sender === "user" ? "items-end" : "items-start"}`}
                >
                  <div
                    className={`max-w-[85%] rounded-2xl p-3.5 leading-relaxed shadow-lg ${
                      msg.sender === "user"
                        ? "bg-cyan-500 text-black font-semibold rounded-br-xs"
                        : "bg-[#1a1a24] text-gray-200 border border-white/10 rounded-bl-xs"
                    }`}
                  >
                    {msg.text}
                  </div>
                  <span className="text-[9px] text-gray-500 font-mono mt-1 px-1">
                    {msg.timestamp}
                  </span>
                </div>
              ))}

              {isAiTyping && (
                <div className="flex items-center gap-1.5 p-3 rounded-2xl bg-[#1a1a24] border border-white/10 max-w-[50%]">
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.15s]" />
                  <div className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-bounce [animation-delay:0.3s]" />
                </div>
              )}

              <div ref={chatBottomRef} />
            </div>

            {/* Chatbot Input Box */}
            <div className="p-3.5 border-t border-white/10 bg-black/60">
              <form
                onSubmit={(e) => {
                  e.preventDefault();
                  handleSendChatMessage();
                }}
                className="flex items-center gap-2"
              >
                <input
                  type="text"
                  placeholder="Ketik pertanyaan terkait 3D / materi..."
                  value={chatInput}
                  onChange={(e) => setChatInput(e.target.value)}
                  className="flex-1 bg-[#1a1a24] border border-white/15 px-3.5 py-2.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400"
                />

                <button
                  type="submit"
                  disabled={!chatInput.trim() || isAiTyping}
                  className={`p-2.5 rounded-xl transition-all cursor-pointer ${
                    chatInput.trim() && !isAiTyping
                      ? "bg-cyan-500 hover:bg-cyan-400 text-black shadow-lg shadow-cyan-500/30 active:scale-95"
                      : "bg-gray-800 text-gray-500 cursor-not-allowed"
                  }`}
                >
                  <Send className="w-4 h-4" />
                </button>
              </form>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
