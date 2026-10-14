"use client";

import React, { useEffect, useRef, useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";

interface CinematicBackgroundProps {
  children: React.ReactNode;
  className?: string;
  showSpotlight?: boolean;
}

interface Particle {
  id: number;
  left: string;
  top: string;
  animationDelay: string;
  isGold: boolean;
}

export default function CinematicBackground({
  children,
  className = "",
  showSpotlight = true,
}: CinematicBackgroundProps) {
  let isDark = true;
  try {
    const { theme } = useEduQuest();
    isDark = theme === "dark";
  } catch {
    // In case rendered outside EduQuestProvider
  }

  const spotlightRef = useRef<HTMLDivElement>(null);
  const mousePos = useRef({ x: -1000, y: -1000 });
  const rafIdRef = useRef<number | null>(null);

  // 48 particles: half gold (#ffbf00), half cyan (#0cc0df)
  // Deterministic initial placement for clean SSR match
  const [particles, setParticles] = useState<Particle[]>(() =>
    Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: `${((i * 17 + 7) % 100)}vw`,
      top: `${((i * 23 + 11) % 100)}vh`,
      animationDelay: `${((i * 0.7) % 5).toFixed(2)}s`,
      isGold: i % 2 === 0,
    }))
  );

  // Randomize positions on mount using Math.random() as specified
  useEffect(() => {
    const randomized: Particle[] = Array.from({ length: 48 }, (_, i) => ({
      id: i,
      left: `${(Math.random() * 100).toFixed(2)}vw`,
      top: `${(Math.random() * 100).toFixed(2)}vh`,
      animationDelay: `${(Math.random() * 5).toFixed(2)}s`,
      isGold: i % 2 === 0,
    }));
    setParticles(randomized);
  }, []);

  // Performance-optimized interactive mouse spotlight
  useEffect(() => {
    if (!showSpotlight) return;

    const handleMouseMove = (e: MouseEvent) => {
      mousePos.current = { x: e.clientX, y: e.clientY };

      if (!rafIdRef.current) {
        rafIdRef.current = requestAnimationFrame(() => {
          if (spotlightRef.current) {
            spotlightRef.current.style.transform = `translate3d(${mousePos.current.x}px, ${mousePos.current.y}px, 0) translate(-50%, -50%)`;
            spotlightRef.current.style.opacity = "1";
          }
          rafIdRef.current = null;
        });
      }
    };

    const handleMouseLeave = () => {
      if (spotlightRef.current) {
        spotlightRef.current.style.opacity = "0";
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    document.addEventListener("mouseleave", handleMouseLeave);

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      document.removeEventListener("mouseleave", handleMouseLeave);
      if (rafIdRef.current) {
        cancelAnimationFrame(rafIdRef.current);
      }
    };
  }, [showSpotlight]);

  return (
    <div
      className={`relative min-h-screen transition-colors duration-500 ease-in-out overflow-x-hidden ${
        isDark ? "bg-[#050505] text-slate-100" : "bg-slate-100 text-slate-900"
      } ${className}`}
    >
      {/* ========================================================= */}
      {/* 1. DUST MOTES (FLOATING LIGHT PARTICLES) - Z-INDEX 0 (DARK MODE ONLY) */}
      {/* ========================================================= */}
      {isDark && (
        <div
          className="fixed inset-0 overflow-hidden pointer-events-none"
          style={{ zIndex: 0 }}
          aria-hidden="true"
        >
          {particles.map((p) => (
            <div
              key={p.id}
              className={`absolute w-2 h-2 rounded-full ${
                p.isGold
                  ? "bg-[#ffbf00] shadow-[0_0_8px_#ffbf00]"
                  : "bg-[#0cc0df] shadow-[0_0_8px_#0cc0df]"
              }`}
              style={{
                left: p.left,
                top: p.top,
                animation: "floatUp 15s linear infinite",
                animationDelay: p.animationDelay,
              }}
            />
          ))}

          {/* Ultra-subtle architectural micro-grid overlay */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff03_1px,transparent_1px),linear-gradient(to_bottom,#ffffff03_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_75%_55%_at_50%_40%,#000_65%,transparent_100%)] opacity-40" />
        </div>
      )}

      {/* ========================================================= */}
      {/* 2. INTERACTIVE MOUSE SPOTLIGHT - Z-INDEX 0 (DARK MODE ONLY) */}
      {/* ========================================================= */}
      {showSpotlight && isDark && (
        <div
          ref={spotlightRef}
          aria-hidden="true"
          className="fixed top-0 left-0 w-[550px] h-[550px] rounded-full pointer-events-none transition-opacity duration-300 opacity-0"
          style={{
            zIndex: 0,
            background:
              "radial-gradient(circle, rgba(255, 191, 0, 0.16) 0%, rgba(12, 192, 223, 0.12) 40%, transparent 70%)",
            filter: "blur(60px)",
            willChange: "transform",
          }}
        />
      )}

      {/* ========================================================= */}
      {/* 3. FOREGROUND CONTENT (CHILDREN) - Z-INDEX 10             */}
      {/* ========================================================= */}
      <div className="relative w-full" style={{ zIndex: 10 }}>
        {children}
      </div>
    </div>
  );
}

export { CinematicBackground };
