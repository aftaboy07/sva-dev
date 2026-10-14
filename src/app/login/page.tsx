"use client";

import React, { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { useEduQuest } from "@/context/EduQuestContext";
import { motion } from "framer-motion";
import {
  Compass,
  Lock,
  User,
  ShieldCheck,
  ArrowRight,
  KeyRound,
  AlertCircle,
  Eye,
  EyeOff,
  CheckCircle2,
  Check,
  DoorOpen,
} from "lucide-react";

import { AUTHENTICATION_ACCOUNTS } from "@/data/mockData";

export default function LoginPage() {
  const router = useRouter();
  const { loginAs } = useEduQuest();

  // Unified authentication state variables
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const [buttonState, setButtonState] = useState<'idle' | 'loading' | 'success'>('idle');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (buttonState !== 'idle') return;
    setError("");

    const id = identifier.trim().toLowerCase();
    const pwd = password.trim();

    // Multi-User Authentication Mapping:
    // Password universal: "12345678" (or "123456" fallback)
    const match = AUTHENTICATION_ACCOUNTS[id];

    if (match && (pwd === "12345678" || pwd === "123456")) {
      setButtonState('loading');
      setError("");

      setTimeout(() => {
        setButtonState('success');
        setTimeout(() => {
          loginAs(match.role, match.subRole, match.user);
          router.push(match.targetRoute);
        }, 800);
      }, 1000);
    } else {
      setError("Kredensial tidak valid. Silakan periksa nama pengguna dan gunakan kata sandi '12345678'.");
      setButtonState('idle');
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex flex-col justify-between p-4 sm:p-6 text-slate-100 relative overflow-hidden">
      {/* Background glow with exact brand gradient */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-4xl h-72 bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] opacity-25 blur-3xl pointer-events-none" />

      {/* Top Header */}
      <div className="max-w-7xl mx-auto w-full flex items-center justify-between py-2 relative z-10">
        <Link href="/" className="flex items-center gap-3 group">
          <Image
            src="/sva-logo.png"
            alt="SVA Dev"
            width={100}
            height={65}
            className="w-24 h-auto object-contain drop-shadow-md"
          />
          <div>
            <span className="font-black text-2xl text-white tracking-tight block">
              SVA Dev
            </span>
            <span className="text-xs font-bold text-[#0cc0df] tracking-wide block -mt-1">
              YPI As Sa&apos;adah
            </span>
          </div>
        </Link>

        <Link
          href="/"
          className="text-xs font-semibold text-slate-400 hover:text-white transition flex items-center gap-1.5"
        >
          <span>Kembali ke Beranda</span>
        </Link>
      </div>

      {/* Main Login Card Box (Clean, Centered, Symmetrical) */}
      <div className="max-w-md w-full mx-auto my-auto relative z-10">
        <div className="rounded-3xl p-0.5 bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] shadow-2xl shadow-[#0cc0df]/15">
          <div className="bg-white text-slate-900 rounded-[22px] p-6 sm:p-8 space-y-6">
            <div className="text-center space-y-2">
              <div className="w-12 h-12 rounded-2xl bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] p-0.5 mx-auto shadow-md">
                <div className="w-full h-full bg-white rounded-[14px] flex items-center justify-center">
                  <Lock className="w-5 h-5 text-slate-900" />
                </div>
              </div>
              <div>
                <h2 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">
                  Autentikasi Portal Terpadu
                </h2>
                <p className="text-xs text-slate-500 font-medium">
                  Sistem ERP & Akademik Yayasan Pendidikan Islam (YPI) As Sa&apos;adah
                </p>
              </div>
            </div>

            {/* Unified Login Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
              {/* Input 1: Flexible Identifier */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Email / No. HP / NISN / NUPTK / Nama Pengguna
                </label>
                <div className="relative">
                  <User className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type="text"
                    placeholder="Masukkan identitas Anda..."
                    value={identifier}
                    onChange={(e) => {
                      setIdentifier(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs font-semibold text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0cc0df] transition"
                  />
                </div>
              </div>

              {/* Input 2: Password */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1.5">
                  Kata Sandi
                </label>
                <div className="relative">
                  <KeyRound className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
                  <input
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (error) setError("");
                    }}
                    required
                    className="w-full pl-10 pr-10 py-2.5 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0cc0df] transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 p-1"
                    aria-label={showPassword ? "Sembunyikan kata sandi" : "Tampilkan kata sandi"}
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* Error Notification */}
              {error && (
                <div className="p-3 rounded-xl bg-rose-50 text-rose-700 border border-rose-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                  <span>{error}</span>
                </div>
              )}

              {/* Success Notification */}
              {buttonState === "success" && (
                <div className="p-3 rounded-xl bg-emerald-50 text-emerald-700 border border-emerald-200 text-xs font-semibold flex items-center gap-2 animate-fade-in">
                  <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-600" />
                  <span>Autentikasi Berhasil! Mengalihkan...</span>
                </div>
              )}

              {/* Submit Button with 3-stage interactive animation ('idle' -> 'loading' -> 'success') */}
              <button
                type="submit"
                disabled={buttonState !== "idle"}
                className={`w-full h-[50px] px-4 rounded-xl font-black text-xs text-white transition-all duration-300 flex items-center justify-center gap-2.5 overflow-hidden ${
                  buttonState === "success"
                    ? "bg-emerald-500 shadow-lg shadow-emerald-500/30 cursor-default"
                    : "bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] hover:opacity-95 shadow-lg shadow-[#0cc0df]/20 active:scale-98 cursor-pointer disabled:opacity-90 disabled:cursor-wait"
                }`}
              >
                {buttonState === "idle" && (
                  <>
                    <span>Masuk ke Portal</span>
                    <ArrowRight className="w-4 h-4 text-[#ffbf00]" />
                  </>
                )}

                {buttonState === "loading" && (
                  <div className="flex items-center gap-2.5">
                    <span>Memverifikasi...</span>
                    {/* Mini walking figure into door animation scene */}
                    <div className="relative flex items-center w-10 h-6 justify-end overflow-hidden">
                      <motion.div
                        animate={{ x: [-20, 0], opacity: [1, 0] }}
                        transition={{ duration: 1.2, ease: "easeIn", repeat: Infinity }}
                        className="absolute right-3.5"
                      >
                        <User size={18} className="text-white" />
                      </motion.div>
                      <DoorOpen size={20} className="text-[#ffbf00] shrink-0 relative z-10" />
                    </div>
                  </div>
                )}

                {buttonState === "success" && (
                  <motion.div
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ type: "spring", stiffness: 400, damping: 20 }}
                    className="flex items-center justify-center"
                  >
                    <Check className="w-6 h-6 text-white stroke-[3]" />
                  </motion.div>
                )}
              </button>
            </form>

            <div className="text-center pt-1">
              <p className="text-[10px] text-slate-400">
                Layanan bantuan sistem ERP & manajemen Yayasan hubungi Sekretariat di (021) 8370-9921.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Notice */}
      <div className="max-w-md mx-auto text-center text-xs text-slate-400 flex items-center justify-center gap-1.5 relative z-10 py-2">
        <ShieldCheck className="w-4 h-4 text-[#0cc0df]" />
        <span>Sistem Informasi ERP & Presensi Yayasan Pendidikan Islam (YPI) As Sa&apos;adah.</span>
      </div>
    </div>
  );
}
