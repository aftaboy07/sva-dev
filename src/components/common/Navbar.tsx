"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowRight, Menu, X } from "lucide-react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import ThemeToggle from "@/components/common/ThemeToggle";

export default function Navbar() {
  const [isHidden, setIsHidden] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const { scrollY } = useScroll();

  useMotionValueEvent(scrollY, "change", (latest) => {
    const previous = scrollY.getPrevious() ?? 0;
    if (latest > previous && latest > 50) {
      setIsHidden(true);
    } else {
      setIsHidden(false);
    }
  });

  const navLinks = [
    { href: "#visi-misi", label: "Visi & Misi" },
    { href: "#struktur-organisasi", label: "Struktur Organisasi" },
    { href: "#pilar-keunggulan", label: "Pilar Keunggulan" },
    { href: "#ekosistem", label: "Fitur Portal" },
  ];

  return (
    // 1. FULL-WIDTH CENTERING WRAPPER
    <div className="fixed top-6 left-0 w-full flex justify-center z-[100] px-4 pointer-events-none">
      <motion.nav
        variants={{
          visible: { y: 0, opacity: 1 },
          hidden: { y: "-150%", opacity: 0 },
        }}
        animate={isHidden ? "hidden" : "visible"}
        transition={{ duration: 0.4, ease: "easeInOut" }}
        className="w-full max-w-4xl bg-[#050505]/40 backdrop-blur-2xl border border-white/5 rounded-full px-6 py-3 flex items-center justify-between shadow-[0_8px_32px_0_rgba(0,0,0,0.3)] pointer-events-auto relative"
      >
        {/* LEFT: Branding & Official Logo */}
        <Link href="/" className="flex items-center gap-2.5 group">
          <Image
            src="/logo.png"
            width={28}
            height={28}
            alt="Logo YPI"
            className="object-contain transition-transform duration-300 group-hover:scale-105"
            priority
          />
          <span className="text-white font-semibold text-sm tracking-wide">
            YPI As Sa&apos;adah
          </span>
        </Link>

        {/* CENTER: Navigation Links (Inline-block + Physical Scale & Pill Hover) */}
        <div className="hidden md:flex items-center gap-1">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className="inline-block px-4 py-2 rounded-full text-[13px] font-medium text-gray-400 hover:text-white hover:bg-white/10 transform hover:scale-105 active:scale-95 transition-all duration-300 cursor-pointer"
            >
              {link.label}
            </Link>
          ))}
        </div>

        {/* RIGHT: Action Button (Masuk Portal - Physical Scale + Glow Hover) & Theme Toggle */}
        <div className="flex items-center gap-2.5">
          <ThemeToggle />
          <Link
            href="/login"
            className="flex items-center gap-2 rounded-full bg-white/10 hover:bg-white/25 text-white text-[13px] font-medium px-5 py-2 border border-white/10 transform hover:scale-105 active:scale-95 transition-all duration-300"
          >
            <span>Masuk Portal</span>
            <ArrowRight
              size={14}
              className="text-gray-300 transition-transform duration-300 group-hover:translate-x-0.5"
            />
          </Link>

          {/* Mobile menu toggle */}
          <button
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            className="md:hidden p-1.5 rounded-full text-gray-300 hover:text-white hover:bg-white/10 transition"
            aria-label="Toggle mobile menu"
          >
            {mobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>

        {/* Mobile Dropdown Menu */}
        <AnimatePresence>
          {mobileMenuOpen && (
            <motion.div
              initial={{ opacity: 0, y: -10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -10, scale: 0.98 }}
              transition={{ duration: 0.2 }}
              className="md:hidden absolute top-full left-0 right-0 mt-3 p-5 rounded-3xl bg-[#050505]/95 backdrop-blur-2xl border border-white/10 shadow-2xl flex flex-col gap-2"
            >
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setMobileMenuOpen(false)}
                  className="block px-4 py-2.5 rounded-xl text-sm font-medium text-gray-300 hover:text-white hover:bg-white/10 transition-all duration-200"
                >
                  {link.label}
                </a>
              ))}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>
    </div>
  );
}
