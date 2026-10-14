"use client";

import React, { useEffect, useRef, useState, useCallback } from "react";
import Webcam from "react-webcam";
import { motion, AnimatePresence } from "framer-motion";
import { Hands, HAND_CONNECTIONS, Results, NormalizedLandmark } from "@mediapipe/hands";
import { Camera } from "@mediapipe/camera_utils";
import { drawConnectors, drawLandmarks } from "@mediapipe/drawing_utils";
import {
  Camera as CameraIcon,
  RotateCcw,
  Download,
  Trash2,
  CheckCircle2,
  FlipHorizontal,
  Zap,
  Check,
  Award,
} from "lucide-react";

type GamePhase = "camera" | "countdown" | "puzzle" | "result";
type GestureType = "none" | "fist" | "pinch" | "open_palm";

export default function ARPhotobooth() {
  const webcamRef = useRef<Webcam>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // ==========================================================================
  // # 1. FULL CAMERA MODE & 4x4 GRID
  // ==========================================================================
  const [gamePhase, setGamePhase] = useState<GamePhase>("camera");
  const gamePhaseRef = useRef<GamePhase>("camera");
  useEffect(() => {
    gamePhaseRef.current = gamePhase;
  }, [gamePhase]);

  // 16 Pieces Puzzle Grid
  const puzzleGrid = useRef<number[]>(Array.from({ length: 16 }, (_, i) => i));
  const selectedPieceRef = useRef<number | null>(null);
  const currentHoverCellRef = useRef<number | null>(null);

  // Captured Images & 4-Cut Photobooth Strip
  const [capturedImage, setCapturedImage] = useState<string | null>(null);
  const fullImgRef = useRef<HTMLImageElement | null>(null);
  const [savedFrames, setSavedFrames] = useState<string[]>([]);

  // Gesture state (throttled)
  const [gesture, setGesture] = useState<GestureType>("none");
  const lastGestureRef = useRef<GestureType>("none");
  const [isAiLoaded, setIsAiLoaded] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);

  // Mirror view
  const [isMirrored, setIsMirrored] = useState(true);
  const isMirroredRef = useRef(isMirrored);
  useEffect(() => {
    isMirroredRef.current = isMirrored;
  }, [isMirrored]);

  // UI Feedback States
  const [countdown, setCountdown] = useState<number | null>(null);
  const [flash, setFlash] = useState<boolean>(false);
  const [statusMessage, setStatusMessage] = useState<string | null>(null);

  // Timer & Cooldown refs to prevent 60fps re-render lag
  const isCountingDown = useRef(false);
  const countdownIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const flashTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const statusTimeoutRef = useRef<NodeJS.Timeout | null>(null);
  const lastSaveTime = useRef<number>(0);
  const lastFistStartTime = useRef<number>(0);

  // Distance formula utility between two normalized landmarks
  const calculateDistance = (
    p1: NormalizedLandmark,
    p2: NormalizedLandmark
  ): number => {
    const dx = p1.x - p2.x;
    const dy = p1.y - p2.y;
    const dz = (p1.z || 0) - (p2.z || 0);
    return Math.sqrt(dx * dx + dy * dy + dz * dz);
  };

  // ==========================================================================
  // # 2. NEW GESTURE MAP: FIST, PINCH, OPEN PALM
  // ==========================================================================
  const recognizeGesture = (landmarks: NormalizedLandmark[]): GestureType => {
    if (!landmarks || landmarks.length < 21) return "none";

    const wrist = landmarks[0];
    const distToWrist = (idx: number) => calculateDistance(landmarks[idx], wrist);

    // Fingertips (8, 12, 16, 20) and MCP/PIP joints (6, 10, 14, 18)
    const isIndexExtended = distToWrist(8) > distToWrist(6) * 1.15;
    const isMiddleExtended = distToWrist(12) > distToWrist(10) * 1.15;
    const isRingExtended = distToWrist(16) > distToWrist(14) * 1.15;
    const isPinkyExtended = distToWrist(20) > distToWrist(18) * 1.15;

    // Pinch distance: thumb tip (4) to index tip (8)
    const pinchDistance = calculateDistance(landmarks[4], landmarks[8]);

    // 1. OPEN PALM (Telapak Tangan Terbuka):
    // All 4 fingertips extended away from wrist, and thumb is not pinched
    if (
      isIndexExtended &&
      isMiddleExtended &&
      isRingExtended &&
      isPinkyExtended &&
      pinchDistance > 0.11
    ) {
      return "open_palm";
    }

    // 2. PINCH (Cubit):
    // Thumb tip and index tip are touching or very close (< 0.08)
    if (pinchDistance < 0.08) {
      return "pinch";
    }

    // 3. FIST (Genggam):
    // All 4 fingertips folded towards palm / close to wrist
    const isIndexFolded = distToWrist(8) < distToWrist(6);
    const isMiddleFolded = distToWrist(12) < distToWrist(10);
    const isRingFolded = distToWrist(16) < distToWrist(14);
    const isPinkyFolded = distToWrist(20) < distToWrist(18);

    if (isIndexFolded && isMiddleFolded && isRingFolded && isPinkyFolded) {
      return "fist";
    }

    return "none";
  };

  // ==========================================================================
  // CAPTURE FULL PHOTO & SHUFFLE 4x4 PUZZLE (COUNTDOWN -> PUZZLE)
  // ==========================================================================
  const captureFullPhotoAndStartPuzzle = useCallback(() => {
    if (!canvasRef.current) return;
    const canvas = canvasRef.current;

    try {
      // Capture full webcam canvas snapshot (No crop box)
      const fullDataUrl = canvas.toDataURL("image/png");
      setCapturedImage(fullDataUrl);

      // Preload image element for canvas puzzle rendering
      const img = new Image();
      img.src = fullDataUrl;
      fullImgRef.current = img;

      // Shuffle 16 pieces randomly (Fisher-Yates)
      const pieces = Array.from({ length: 16 }, (_, i) => i);
      for (let i = pieces.length - 1; i > 0; i--) {
        const j = Math.floor(Math.random() * (i + 1));
        [pieces[i], pieces[j]] = [pieces[j], pieces[i]];
      }
      puzzleGrid.current = pieces;
      selectedPieceRef.current = null;
      currentHoverCellRef.current = null;
    } catch (err) {
      console.error("Capture photo error:", err);
    }

    // Trigger flash animation for 500ms
    setFlash(true);
    if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
    flashTimeoutRef.current = setTimeout(() => setFlash(false), 500);

    // Transition to 4x4 Puzzle phase
    setGamePhase("puzzle");
    gamePhaseRef.current = "puzzle";
    setStatusMessage("Puzzle 4x4 Aktif! Cubit (🤌) untuk Pindah, Buka Telapak (🖐️) untuk Simpan");
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatusMessage(null), 3500);

    isCountingDown.current = false;
  }, []);

  // Start 3-second countdown
  const startCountdownTimer = useCallback(() => {
    if (isCountingDown.current) return;
    isCountingDown.current = true;

    setGamePhase("countdown");
    gamePhaseRef.current = "countdown";
    setCountdown(3);
    setStatusMessage("Bersiap untuk Foto...");

    let currentCount = 3;
    if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);

    countdownIntervalRef.current = setInterval(() => {
      currentCount -= 1;
      if (currentCount > 0) {
        setCountdown(currentCount);
      } else {
        if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
        countdownIntervalRef.current = null;
        setCountdown(null);
        captureFullPhotoAndStartPuzzle();
      }
    }, 1000);
  }, [captureFullPhotoAndStartPuzzle]);

  // Save current puzzle arrangement & advance to next or result
  const saveCurrentPuzzleAndNext = useCallback(() => {
    if (!canvasRef.current) return;
    try {
      const dataUrl = canvasRef.current.toDataURL("image/png");
      setSavedFrames((prev) => {
        const nextFrames = [...prev, dataUrl];
        if (nextFrames.length >= 4) {
          setGamePhase("result");
          gamePhaseRef.current = "result";
          setStatusMessage("🎉 4 Frame Lengkap! Photobooth Siap.");
        } else {
          setGamePhase("camera");
          gamePhaseRef.current = "camera";
          setStatusMessage(`Frame ${nextFrames.length}/4 Disimpan! Kepalkan Tangan (✊) untuk Foto Berikutnya`);
        }
        return nextFrames;
      });
    } catch (err) {
      console.error("Save puzzle frame error:", err);
    }

    setCapturedImage(null);
    fullImgRef.current = null;
    selectedPieceRef.current = null;
    currentHoverCellRef.current = null;

    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatusMessage(null), 3500);
  }, []);

  // Reset entire game to start
  const resetEntireGame = useCallback(() => {
    setGamePhase("camera");
    gamePhaseRef.current = "camera";
    setSavedFrames([]);
    setCapturedImage(null);
    fullImgRef.current = null;
    selectedPieceRef.current = null;
    currentHoverCellRef.current = null;
    puzzleGrid.current = Array.from({ length: 16 }, (_, i) => i);
    setStatusMessage("Permainan Direset. Kepalkan Tangan (✊) untuk Mulai!");
    if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
    statusTimeoutRef.current = setTimeout(() => setStatusMessage(null), 3000);
  }, []);

  // ==========================================================================
  // MAIN MEDIAPIPE INITIALIZATION
  // ==========================================================================
  useEffect(() => {
    let isSubscribed = true;
    let cameraInstance: Camera | null = null;

    const hands = new Hands({
      locateFile: (file) =>
        `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
    });

    hands.setOptions({
      maxNumHands: 2,
      modelComplexity: 1,
      minDetectionConfidence: 0.5,
      minTrackingConfidence: 0.5,
    });

    hands.onResults((results: Results) => {
      if (!isSubscribed || !canvasRef.current) return;
      const canvas = canvasRef.current;
      const ctx = canvas.getContext("2d");
      if (!ctx) return;

      setIsAiLoaded(true);

      ctx.save();
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Handle horizontal mirroring
      if (isMirroredRef.current) {
        ctx.translate(canvas.width, 0);
        ctx.scale(-1, 1);
      }

      const currentPhase = gamePhaseRef.current;

      // ----------------------------------------------------------------------
      // 1. BACKGROUND RENDERING
      // ----------------------------------------------------------------------
      if (currentPhase === "puzzle" && fullImgRef.current) {
        // Draw 4x4 Drag & Drop Puzzle using full-frame snapshot
        const cellW = canvas.width / 4;
        const cellH = canvas.height / 4;
        const img = fullImgRef.current;
        const srcTileW = img.width / 4;
        const srcTileH = img.height / 4;

        // Draw 16 shuffled pieces
        for (let gridIdx = 0; gridIdx < 16; gridIdx++) {
          const tileIdx = puzzleGrid.current[gridIdx];

          // Source slice coordinates
          const srcCol = tileIdx % 4;
          const srcRow = Math.floor(tileIdx / 4);
          const sx = srcCol * srcTileW;
          const sy = srcRow * srcTileH;

          // Destination grid coordinates
          const dstCol = gridIdx % 4;
          const dstRow = Math.floor(gridIdx / 4);
          const dx = dstCol * cellW;
          const dy = dstRow * cellH;

          // Draw tile
          ctx.drawImage(img, sx, sy, srcTileW, srcTileH, dx, dy, cellW, cellH);

          // Grid line border
          ctx.strokeStyle = "rgba(255, 255, 255, 0.25)";
          ctx.lineWidth = 1.5;
          ctx.strokeRect(dx, dy, cellW, cellH);

          // Tile piece numbering tag (un-mirrored if canvas is mirrored)
          ctx.save();
          if (isMirroredRef.current) {
            ctx.translate(dx + 28, dy + 18);
            ctx.scale(-1, 1);
            ctx.font = "bold 12px monospace";
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillText(`P${tileIdx + 1}`, 0, 0);
          } else {
            ctx.font = "bold 12px monospace";
            ctx.fillStyle = "rgba(255, 255, 255, 0.5)";
            ctx.fillText(`P${tileIdx + 1}`, dx + 8, dy + 18);
          }
          ctx.restore();
        }
      } else if (results.image) {
        // Draw live webcam feed
        ctx.drawImage(results.image, 0, 0, canvas.width, canvas.height);
      }

      // ----------------------------------------------------------------------
      // 2. GESTURE RECOGNITION & ACTIONS
      // ----------------------------------------------------------------------
      let activeGesture: GestureType = "none";

      if (results.multiHandLandmarks && results.multiHandLandmarks.length > 0) {
        for (const landmarks of results.multiHandLandmarks) {
          const detected = recognizeGesture(landmarks);
          if (detected !== "none" && activeGesture === "none") {
            activeGesture = detected;
          }

          // ------------------------------------------------------------------
          // PHASE 1: CAMERA (Listen for Fist ✊ to start countdown)
          // ------------------------------------------------------------------
          if (currentPhase === "camera") {
            if (
              detected === "fist" &&
              !isCountingDown.current &&
              Date.now() - lastFistStartTime.current > 1500
            ) {
              lastFistStartTime.current = Date.now();
              startCountdownTimer();
            }
          }

          // ------------------------------------------------------------------
          // PHASE 3: PUZZLE (Listen for Pinch 🤌 to drag & Open Palm 🖐️ to save)
          // ------------------------------------------------------------------
          else if (currentPhase === "puzzle") {
            const cellW = canvas.width / 4;
            const cellH = canvas.height / 4;

            // A. PINCH: Grab piece under finger
            if (detected === "pinch") {
              const indexTip = landmarks[8];
              const thumbTip = landmarks[4];

              // Calculate which 4x4 cell index finger is over
              const col = Math.floor(indexTip.x * 4);
              const row = Math.floor(indexTip.y * 4);
              const hoverCol = Math.max(0, Math.min(3, col));
              const hoverRow = Math.max(0, Math.min(3, row));
              const hoverIndex = hoverRow * 4 + hoverCol;

              currentHoverCellRef.current = hoverIndex;

              // If not holding a piece yet, grab this cell
              if (selectedPieceRef.current === null) {
                selectedPieceRef.current = hoverIndex;
              }

              // Highlight hovered cell with translucent yellow box
              ctx.save();
              ctx.fillStyle = "rgba(234, 179, 8, 0.4)";
              ctx.strokeStyle = "rgba(234, 179, 8, 0.95)";
              ctx.lineWidth = 3;
              ctx.fillRect(hoverCol * cellW, hoverRow * cellH, cellW, cellH);
              ctx.strokeRect(hoverCol * cellW, hoverRow * cellH, cellW, cellH);

              // Un-mirrored badge inside cell
              if (isMirroredRef.current) {
                ctx.translate(hoverCol * cellW + cellW - 12, hoverRow * cellH + 28);
                ctx.scale(-1, 1);
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 13px sans-serif";
                ctx.fillText(`PINCH: P${puzzleGrid.current[hoverIndex] + 1}`, 0, 0);
              } else {
                ctx.fillStyle = "#ffffff";
                ctx.font = "bold 13px sans-serif";
                ctx.fillText(
                  `PINCH: P${puzzleGrid.current[hoverIndex] + 1}`,
                  hoverCol * cellW + 10,
                  hoverRow * cellH + 28
                );
              }
              ctx.restore();

              // Pinch Energy Nexus Indicator
              const midX = ((thumbTip.x + indexTip.x) / 2) * canvas.width;
              const midY = ((thumbTip.y + indexTip.y) / 2) * canvas.height;

              ctx.save();
              ctx.beginPath();
              ctx.arc(midX, midY, 18, 0, 2 * Math.PI);
              ctx.strokeStyle = "#eab308";
              ctx.lineWidth = 3.5;
              ctx.shadowColor = "#eab308";
              ctx.shadowBlur = 14;
              ctx.stroke();

              ctx.beginPath();
              ctx.arc(midX, midY, 6, 0, 2 * Math.PI);
              ctx.fillStyle = "#ffffff";
              ctx.fill();
              ctx.restore();
            }

            // B. OPEN PALM: Save Arranged Puzzle & Advance
            if (
              detected === "open_palm" &&
              Date.now() - lastSaveTime.current > 2000
            ) {
              lastSaveTime.current = Date.now();
              saveCurrentPuzzleAndNext();
            }
          }

          // Draw skeletal lines
          drawConnectors(ctx, landmarks, HAND_CONNECTIONS, {
            color: "#ffffff",
            lineWidth: 3,
          });

          // Draw landmark dots
          drawLandmarks(ctx, landmarks, {
            color:
              detected === "open_palm"
                ? "#10b981"
                : detected === "pinch"
                ? "#eab308"
                : detected === "fist"
                ? "#06b6d4"
                : "#0cc0df",
            fillColor: "#ffffff",
            lineWidth: 2,
            radius: 4,
          });
        }

        // ====================================================================
        // ZERO DELAY SWAPPING: SWAP IMMEDIATELY UPON PINCH RELEASE
        // ====================================================================
        if (currentPhase === "puzzle" && activeGesture !== "pinch") {
          if (
            selectedPieceRef.current !== null &&
            currentHoverCellRef.current !== null &&
            selectedPieceRef.current !== currentHoverCellRef.current
          ) {
            const fromIdx = selectedPieceRef.current;
            const toIdx = currentHoverCellRef.current;
            const temp = puzzleGrid.current[fromIdx];
            puzzleGrid.current[fromIdx] = puzzleGrid.current[toIdx];
            puzzleGrid.current[toIdx] = temp;
          }
          selectedPieceRef.current = null;
          currentHoverCellRef.current = null;
        }

        // Throttle React state
        if (lastGestureRef.current !== activeGesture) {
          lastGestureRef.current = activeGesture;
          setGesture(activeGesture);
        }
      } else {
        // If hand completely removed during puzzle pinch release
        if (currentPhase === "puzzle") {
          if (
            selectedPieceRef.current !== null &&
            currentHoverCellRef.current !== null &&
            selectedPieceRef.current !== currentHoverCellRef.current
          ) {
            const fromIdx = selectedPieceRef.current;
            const toIdx = currentHoverCellRef.current;
            const temp = puzzleGrid.current[fromIdx];
            puzzleGrid.current[fromIdx] = puzzleGrid.current[toIdx];
            puzzleGrid.current[toIdx] = temp;
          }
          selectedPieceRef.current = null;
          currentHoverCellRef.current = null;
        }

        if (lastGestureRef.current !== "none") {
          lastGestureRef.current = "none";
          setGesture("none");
        }
      }

      ctx.restore();
    });

    // Start Webcam with safety check against memory OOB error
    const startCamera = () => {
      if (!webcamRef.current || !webcamRef.current.video) return;
      const video = webcamRef.current.video;

      const initCamera = () => {
        if (!isSubscribed) return;
        cameraInstance = new Camera(video, {
          onFrame: async () => {
            if (webcamRef.current && webcamRef.current.video && isSubscribed) {
              const currentVideo = webcamRef.current.video;
              if (
                currentVideo.readyState >= 2 &&
                currentVideo.videoWidth > 0 &&
                currentVideo.videoHeight > 0
              ) {
                try {
                  await hands.send({ image: currentVideo });
                } catch (err) {
                  console.warn("MediaPipe frame skipped:", err);
                }
              }
            }
          },
          width: 1280,
          height: 720,
        });
        cameraInstance.start().catch((err) => {
          console.error("Camera start error:", err);
          if (isSubscribed) setCameraError("Gagal mengakses webcam perangkat.");
        });
      };

      if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
        initCamera();
      } else {
        video.onloadeddata = () => {
          if (video.readyState >= 2 && video.videoWidth > 0 && video.videoHeight > 0) {
            initCamera();
          } else {
            video.onloadedmetadata = () => {
              if (video.videoWidth > 0 && video.videoHeight > 0) {
                initCamera();
              }
            };
          }
        };
      }
    };

    const timer = setTimeout(startCamera, 400);

    return () => {
      isSubscribed = false;
      clearTimeout(timer);
      if (countdownIntervalRef.current) clearInterval(countdownIntervalRef.current);
      if (flashTimeoutRef.current) clearTimeout(flashTimeoutRef.current);
      if (statusTimeoutRef.current) clearTimeout(statusTimeoutRef.current);
      if (cameraInstance) {
        cameraInstance.stop();
      }
      hands.close();
    };
  }, [startCountdownTimer, saveCurrentPuzzleAndNext]);

  // Download photo helper
  const handleDownload = (dataUrl: string, name: string) => {
    const a = document.createElement("a");
    a.href = dataUrl;
    a.download = `SVA-AR-${name}.png`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
  };

  return (
    <div className="w-full max-w-5xl mx-auto space-y-6">
      {/* 1. HEADER SECTION */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-slate-900/60 border border-white/10 rounded-2xl p-6 backdrop-blur-xl">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/10 border border-cyan-500/30 text-[#0cc0df] text-xs font-bold mb-2">
            <Zap className="w-3.5 h-3.5" />
            <span>AI AR Computer Vision • Full-Screen Camera & 4x4 Puzzle</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-white tracking-tight">
            AR Gesture Photobooth & 4x4 Puzzle
          </h2>
          <p className="text-xs sm:text-sm text-gray-400 mt-1">
            {gamePhase === "camera"
              ? "Kepalkan Tangan (✊) untuk Mulai Hitung Mundur Foto"
              : gamePhase === "countdown"
              ? "Bersiap untuk Foto..."
              : gamePhase === "puzzle"
              ? "Cubit (🤌) Pindah Puzzle 4x4. Buka Telapak Tangan (🖐️) untuk Simpan"
              : "Selesai! 4 Frame Terkumpul di Strip Photobooth"}
          </p>
        </div>

        {/* Status Indicators & Mode Pills */}
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/5 border border-white/10 text-xs">
            <span
              className={`w-2.5 h-2.5 rounded-full ${
                gamePhase === "result"
                  ? "bg-purple-400 animate-pulse"
                  : gamePhase === "puzzle"
                  ? "bg-amber-400"
                  : gamePhase === "countdown"
                  ? "bg-rose-400 animate-ping"
                  : "bg-cyan-400"
              }`}
            />
            <span className="text-gray-300 font-bold uppercase tracking-wider text-[11px]">
              {gamePhase === "camera"
                ? "Fase: Kamera (Kepal ✊)"
                : gamePhase === "countdown"
                ? "Fase: Hitung Mundur"
                : gamePhase === "puzzle"
                ? "Fase: Puzzle 4x4"
                : "Fase: Hasil 4-Cut"}
            </span>
          </div>

          <div className="px-3 py-1.5 rounded-xl bg-cyan-500/15 border border-cyan-500/30 text-xs text-[#0cc0df] font-bold">
            Frame: {savedFrames.length}/4
          </div>

          <button
            onClick={() => setIsMirrored(!isMirrored)}
            className={`p-2 rounded-xl border text-xs font-semibold flex items-center gap-1.5 transition-all cursor-pointer ${
              isMirrored
                ? "bg-[#0cc0df]/20 text-[#0cc0df] border-[#0cc0df]/40"
                : "bg-white/5 text-gray-400 border-white/10 hover:text-white"
            }`}
            title="Toggle Cermin"
          >
            <FlipHorizontal className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* 2. CAMERA & CANVAS VIEWPORT */}
      <div className="relative aspect-video w-full bg-slate-950 rounded-3xl border border-white/10 overflow-hidden shadow-2xl group">
        <Webcam
          ref={webcamRef}
          audio={false}
          screenshotFormat="image/png"
          className="absolute inset-0 w-full h-full object-cover opacity-0 pointer-events-none"
          videoConstraints={{
            width: 1280,
            height: 720,
            facingMode: "user",
          }}
        />

        <canvas
          ref={canvasRef}
          width={1280}
          height={720}
          className="w-full h-full object-cover block"
        />

        {/* Flash Effect */}
        <div
          className={`absolute inset-0 bg-white z-50 pointer-events-none transition-opacity duration-300 ${
            flash ? "opacity-100" : "opacity-0"
          }`}
        />

        {/* Sci-Fi Corner Brackets */}
        <div className="absolute top-4 left-4 w-8 h-8 border-t-2 border-l-2 border-[#0cc0df]/80 pointer-events-none" />
        <div className="absolute top-4 right-4 w-8 h-8 border-t-2 border-r-2 border-[#0cc0df]/80 pointer-events-none" />
        <div className="absolute bottom-4 left-4 w-8 h-8 border-b-2 border-l-2 border-[#0cc0df]/80 pointer-events-none" />
        <div className="absolute bottom-4 right-4 w-8 h-8 border-b-2 border-r-2 border-[#0cc0df]/80 pointer-events-none" />

        {/* FLOATING TOP BADGE */}
        <div className="absolute top-5 left-1/2 -translate-x-1/2 z-20">
          <div
            className={`px-4 py-2 rounded-full backdrop-blur-xl border text-xs font-bold shadow-lg transition-all duration-300 flex items-center gap-2 ${
              statusMessage
                ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-400 scale-105"
                : gamePhase === "camera"
                ? gesture === "fist"
                  ? "bg-cyan-500/25 border-cyan-500/60 text-cyan-300 scale-105"
                  : "bg-black/60 border-white/15 text-gray-300"
                : gamePhase === "puzzle"
                ? gesture === "pinch"
                  ? "bg-yellow-500/25 border-yellow-500/60 text-yellow-300 scale-105"
                  : gesture === "open_palm"
                  ? "bg-emerald-500/25 border-emerald-500/60 text-emerald-300 scale-105"
                  : "bg-black/60 border-white/15 text-gray-300"
                : "bg-black/60 border-white/15 text-gray-300"
            }`}
          >
            {statusMessage ? (
              <>
                <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                <span>{statusMessage}</span>
              </>
            ) : gamePhase === "camera" ? (
              gesture === "fist" ? (
                <>
                  <span className="text-base">✊</span>
                  <span>Kepalan Terdeteksi • Memulai Hitung Mundur...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping" />
                  <span>Kepalkan Tangan (✊) untuk Mulai Hitung Mundur Foto</span>
                </>
              )
            ) : gamePhase === "countdown" ? (
              <>
                <span className="text-base animate-spin">⏳</span>
                <span>Bersiap untuk Foto...</span>
              </>
            ) : gamePhase === "puzzle" ? (
              gesture === "pinch" ? (
                <>
                  <span className="text-base">🤌</span>
                  <span>Cubit (🤌): Geser / Tukar Potongan Puzzle 4x4</span>
                </>
              ) : gesture === "open_palm" ? (
                <>
                  <span className="text-base">🖐️</span>
                  <span>Telapak Terbuka (🖐️): Menyimpan Frame...</span>
                </>
              ) : (
                <>
                  <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
                  <span>Cubit (🤌) Pindah Puzzle 4x4. Buka Telapak Tangan (🖐️) untuk Simpan</span>
                </>
              )
            ) : (
              <>
                <Award className="w-4 h-4 text-purple-400" />
                <span>🎉 4 Frame Lengkap! Unduh Strip Photobooth Anda</span>
              </>
            )}
          </div>
        </div>

        {/* MASSIVE CENTERED COUNTDOWN NUMBER */}
        <AnimatePresence>
          {countdown !== null && countdown > 0 && (
            <div className="absolute inset-0 z-30 flex flex-col items-center justify-center bg-black/45 backdrop-blur-sm pointer-events-none">
              <motion.div
                key={countdown}
                initial={{ scale: 0.5, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 1.4, opacity: 0 }}
                transition={{ duration: 0.35, ease: "easeOut" }}
                className="text-9xl text-white font-black drop-shadow-[0_0_25px_rgba(255,255,255,0.9)]"
              >
                {countdown}
              </motion.div>
              <motion.p
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-base font-extrabold text-cyan-300 tracking-widest uppercase mt-6"
              >
                Bersiap untuk Foto...
              </motion.p>
            </div>
          )}
        </AnimatePresence>

        {/* Camera Error Message */}
        {cameraError && (
          <div className="absolute inset-0 z-40 flex flex-col items-center justify-center bg-slate-950/90 p-6 text-center">
            <CameraIcon className="w-12 h-12 text-rose-500 mb-3" />
            <p className="text-sm font-bold text-rose-400">{cameraError}</p>
          </div>
        )}

        {/* Bottom HUD Gesture Instructions */}
        <div className="absolute bottom-5 inset-x-5 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-gray-300">
            <span className="text-cyan-400 font-bold">1. Kamera:</span>
            <span>Kepalkan Tangan (✊) untuk Mulai Hitung Mundur Foto</span>
          </div>

          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-black/60 backdrop-blur-md border border-white/10 text-[11px] text-gray-300">
            <span className="text-yellow-400 font-bold">2. Puzzle:</span>
            <span>Cubit (🤌) Pindah 4x4 • Buka Telapak (🖐️) Simpan</span>
          </div>
        </div>
      </div>

      {/* 3. CONTROLS BAR */}
      <div className="flex flex-wrap items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/60 border border-white/10 backdrop-blur-xl">
        <div className="flex items-center gap-3">
          {gamePhase === "camera" && (
            <button
              onClick={startCountdownTimer}
              disabled={countdown !== null}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-slate-950 bg-gradient-to-r from-cyan-400 to-teal-400 hover:from-cyan-300 hover:to-teal-300 shadow-lg shadow-cyan-500/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer disabled:opacity-50"
            >
              <CameraIcon className="w-4 h-4 fill-slate-950 text-slate-950" />
              <span>Mulai Hitung Mundur Foto</span>
            </button>
          )}

          {gamePhase === "puzzle" && (
            <button
              onClick={saveCurrentPuzzleAndNext}
              className="px-5 py-2.5 rounded-xl font-bold text-xs text-white bg-amber-600 hover:bg-amber-500 shadow-lg shadow-amber-600/20 active:scale-98 transition-all flex items-center gap-2 cursor-pointer"
            >
              <Check className="w-4 h-4" />
              <span>Simpan Puzzle Ini (Lanjut ke Frame Berikutnya)</span>
            </button>
          )}

          <button
            onClick={resetEntireGame}
            className="px-4 py-2.5 rounded-xl font-bold text-xs text-white bg-white/10 hover:bg-white/20 border border-white/15 transition-all flex items-center gap-2 cursor-pointer"
          >
            <RotateCcw className="w-4 h-4 text-[#0cc0df]" />
            <span>Mulai Ulang Photobooth</span>
          </button>
        </div>

        {savedFrames.length > 0 && (
          <button
            onClick={() => setSavedFrames([])}
            className="px-3.5 py-2 rounded-xl text-xs text-rose-400 hover:text-rose-300 hover:bg-rose-500/10 border border-rose-500/20 transition-all flex items-center gap-1.5 cursor-pointer ml-auto"
          >
            <Trash2 className="w-3.5 h-3.5" />
            <span>Reset {savedFrames.length} Frame</span>
          </button>
        )}
      </div>

      {/* 4. 4-CUT PHOTOBOOTH RESULT & STRIP GALLERY */}
      {savedFrames.length > 0 && (
        <div className="space-y-4 pt-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-bold text-white flex items-center gap-2">
              <CameraIcon className="w-4 h-4 text-cyan-400" />
              <span>Strip Koleksi Photobooth ({savedFrames.length}/4 Frame)</span>
            </h3>
            <span className="text-xs text-gray-400">
              Kumpulkan 4 frame untuk membentuk strip photobooth lengkap
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {savedFrames.map((frame, idx) => (
              <div
                key={idx}
                className="group relative rounded-2xl overflow-hidden border border-cyan-500/30 bg-slate-900 shadow-xl flex flex-col transition-all hover:scale-[1.02]"
              >
                <div className="relative aspect-square w-full bg-slate-950 overflow-hidden">
                  <img
                    src={frame}
                    alt={`SVA Photobooth Frame ${idx + 1}`}
                    className="w-full h-full object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2 p-2">
                    <button
                      onClick={() => handleDownload(frame, `Frame-${idx + 1}`)}
                      className="p-2 rounded-xl bg-cyan-400 text-slate-950 font-bold hover:bg-cyan-300 transition-colors shadow-lg cursor-pointer"
                      title="Unduh Frame"
                    >
                      <Download className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="p-2.5 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-[11px]">
                  <span className="text-gray-300 font-bold">Frame #{idx + 1}</span>
                  <span className="text-cyan-400 font-semibold">Tersimpan</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
