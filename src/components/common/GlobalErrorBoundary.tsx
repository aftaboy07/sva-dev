"use client";

import React, { Component, ErrorInfo, ReactNode } from "react";
import { AlertTriangle, RefreshCw, RotateCcw, Home } from "lucide-react";
import Link from "next/link";

interface Props {
  children?: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
  error: Error | null;
  errorInfo: ErrorInfo | null;
}

export default class GlobalErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
    errorInfo: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error, errorInfo: null };
  }

  public componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error("Uncaught runtime error caught by GlobalErrorBoundary:", error, errorInfo);
    this.setState({ errorInfo });
  }

  private handleReset = () => {
    this.setState({ hasError: false, error: null, errorInfo: null });
  };

  private handleReloadPage = () => {
    if (typeof window !== "undefined") {
      window.location.reload();
    }
  };

  public render() {
    if (this.state.hasError) {
      if (this.props.fallback) {
        return this.props.fallback;
      }

      return (
        <div className="min-h-[500px] w-full flex items-center justify-center p-4 sm:p-6 bg-[#0f0f13]">
          <div className="w-full max-w-xl bg-[#1a1a24]/90 backdrop-blur-2xl border border-white/10 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
            {/* Ambient Cyan/Rose Glow */}
            <div className="absolute -top-24 -right-24 w-48 h-48 bg-rose-500/10 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute -bottom-24 -left-24 w-48 h-48 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

            <div className="relative z-10 flex flex-col items-center text-center">
              {/* Alert Icon Badge */}
              <div className="w-14 h-14 rounded-2xl bg-rose-500/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-5 shadow-lg shadow-rose-950/40">
                <AlertTriangle className="w-7 h-7" />
              </div>

              <h2 className="text-xl sm:text-2xl font-black text-white tracking-tight mb-2">
                Terjadi Kendala pada Komponen
              </h2>
              <p className="text-xs sm:text-sm text-gray-400 mb-5 max-w-md">
                Sistem mendeteksi galat runtime tak terduga. Anda dapat mencoba memuat ulang komponen ini tanpa kehilangan status sesi aplikasi.
              </p>

              {/* Error Message Box */}
              {this.state.error && (
                <div className="w-full text-left bg-black/60 border border-white/10 rounded-xl p-3.5 mb-6 overflow-x-auto text-[11px] font-mono text-rose-300 leading-relaxed max-h-32">
                  <span className="font-bold text-rose-400 block mb-1">
                    {this.state.error.name}: {this.state.error.message}
                  </span>
                  {this.state.error.stack && (
                    <span className="text-gray-500 text-[10px] block line-clamp-3">
                      {this.state.error.stack}
                    </span>
                  )}
                </div>
              )}

              {/* Action Buttons */}
              <div className="flex flex-col sm:flex-row items-center gap-3 w-full justify-center">
                <button
                  type="button"
                  onClick={this.handleReset}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-gradient-to-r from-cyan-500 to-blue-600 hover:from-cyan-400 hover:to-blue-500 text-white shadow-lg shadow-cyan-500/25 transition-all cursor-pointer active:scale-95"
                >
                  <RefreshCw className="w-4 h-4" />
                  <span>Muat Ulang Komponen</span>
                </button>

                <button
                  type="button"
                  onClick={this.handleReloadPage}
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/10 hover:bg-white/15 text-slate-300 border border-white/10 transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Refresh Halaman</span>
                </button>

                <Link
                  href="/"
                  className="w-full sm:w-auto flex items-center justify-center gap-2 px-4 py-2.5 rounded-xl text-xs font-semibold bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/5 transition-all"
                >
                  <Home className="w-3.5 h-3.5" />
                  <span>Beranda</span>
                </Link>
              </div>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}
