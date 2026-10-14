"use client";

import React from "react";
import { motion, useReducedMotion } from "framer-motion";

interface ScrollReveal3DProps {
  children: React.ReactNode;
  className?: string;
  delay?: number;
  duration?: number;
  rotateX?: number;
  rotateY?: number;
  y?: number;
  scale?: number;
  viewportMargin?: string;
  once?: boolean;
}

/**
 * ScrollReveal3D Component
 * Applies a luxurious 3D perspective scroll reveal animation.
 * Enters the viewport tilted on X/Y axes, slightly scaled down, translated down,
 * and smoothly eases into its resting state over ~0.8s using a luxurious cubic-bezier.
 */
export default function ScrollReveal3D({
  children,
  className = "",
  delay = 0,
  duration = 0.8,
  rotateX = 12,
  rotateY = -4,
  y = 45,
  scale = 0.95,
  viewportMargin = "-25px",
  once = true,
}: ScrollReveal3DProps) {
  const shouldReduceMotion = useReducedMotion();

  if (shouldReduceMotion) {
    return <div className={className}>{children}</div>;
  }

  return (
    <div
      style={{ perspective: 1200 }}
      className={`transform-gpu ${className}`}
    >
      <motion.div
        initial={{
          opacity: 0,
          y,
          scale,
          rotateX,
          rotateY,
        }}
        whileInView={{
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          rotateY: 0,
        }}
        viewport={{ once, margin: viewportMargin }}
        transition={{
          duration,
          delay,
          ease: [0.16, 1, 0.3, 1],
        }}
        className="h-full"
        style={{
          transformStyle: "preserve-3d",
          willChange: "transform, opacity",
        }}
      >
        {children}
      </motion.div>
    </div>
  );
}
