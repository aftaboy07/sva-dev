"use client";

import React, { useState } from "react";
import { UrgentTask, UrgentTaskMaterial } from "@/types";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  FileText,
  UploadCloud,
  FileCheck,
  CheckCircle2,
  XCircle,
  AlertTriangle,
  Clock,
  Download,
  Youtube,
  Trash2,
  Send,
  Sparkles,
  Award,
  Video,
  Image as ImageIcon,
  FileSpreadsheet,
  ExternalLink,
  ChevronLeft,
} from "lucide-react";

interface TaskSubmissionProps {
  task: UrgentTask;
  onClose: () => void;
  onSuccess?: () => void;
}

export default function TaskSubmission({ task, onClose, onSuccess }: TaskSubmissionProps) {
  const { submitTaskAssignment, theme } = useEduQuest();
  const isDark = theme === "dark";

  // Selected file state
  const [selectedFile, setSelectedFile] = useState<{
    file: File | null;
    name: string;
    size: string;
    type: string;
  } | null>(() => {
    if (task.submittedFile) {
      return {
        file: null,
        name: task.submittedFile.name,
        size: task.submittedFile.size,
        type: task.submittedFile.type,
      };
    }
    return null;
  });

  const [isDragging, setIsDragging] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const [isSubmittedSuccess, setIsSubmittedSuccess] = useState(task.completed);

  // Allowed submission types from teacher (default to PDF & Docs if undefined)
  const allowedTypes = task.allowedSubmissionTypes || ["PDF", "Documents (Word/Excel)"];

  // Helper: map allowed types to acceptable extensions & MIME
  const isFileFormatAllowed = (file: File): boolean => {
    const ext = file.name.split(".").pop()?.toLowerCase() || "";
    const mime = file.type.toLowerCase();

    let allowed = false;

    if (allowedTypes.includes("PDF")) {
      if (ext === "pdf" || mime.includes("pdf")) allowed = true;
    }
    if (allowedTypes.includes("Images (JPG/PNG)")) {
      if (["jpg", "jpeg", "png", "webp"].includes(ext) || mime.startsWith("image/")) allowed = true;
    }
    if (allowedTypes.includes("Video (MP4)")) {
      if (["mp4", "mov", "webm", "mkv"].includes(ext) || mime.startsWith("video/")) allowed = true;
    }
    if (allowedTypes.includes("Documents (Word/Excel)")) {
      if (
        ["doc", "docx", "xls", "xlsx", "ppt", "pptx"].includes(ext) ||
        mime.includes("word") ||
        mime.includes("officedocument") ||
        mime.includes("excel") ||
        mime.includes("powerpoint")
      ) {
        allowed = true;
      }
    }

    return allowed;
  };

  const handleValidateAndSetFile = (file: File) => {
    setErrorMessage(null);

    // Strict validation
    if (!isFileFormatAllowed(file)) {
      setErrorMessage(
        `Berkas "${file.name}" ditolak! Format tidak sesuai ketentuan. Guru hanya mengizinkan: ${allowedTypes.join(", ")}.`
      );
      setSelectedFile(null);
      return;
    }

    // Max 50 MB check
    if (file.size > 50 * 1024 * 1024) {
      setErrorMessage(`Ukuran berkas "${file.name}" terlalu besar! Maksimal 50 MB.`);
      setSelectedFile(null);
      return;
    }

    const fileSizeStr =
      file.size < 1024 * 1024
        ? `${(file.size / 1024).toFixed(1)} KB`
        : `${(file.size / (1024 * 1024)).toFixed(1)} MB`;

    setSelectedFile({
      file,
      name: file.name,
      size: fileSizeStr,
      type: file.type || "Dokumen",
    });
  };

  // Drag and Drop Events
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const files = e.dataTransfer.files;
    if (files && files.length > 0) {
      handleValidateAndSetFile(files[0]);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files;
    if (files && files.length > 0) {
      handleValidateAndSetFile(files[0]);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedFile) return;

    setIsSubmitting(true);
    setUploadProgress(20);

    const interval = setInterval(() => {
      setUploadProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 95;
        }
        return prev + 25;
      });
    }, 150);

    setTimeout(() => {
      clearInterval(interval);
      setUploadProgress(100);

      submitTaskAssignment(task.id, {
        name: selectedFile.name,
        size: selectedFile.size,
        type: selectedFile.type,
      });

      setIsSubmitting(false);
      setIsSubmittedSuccess(true);
      if (onSuccess) onSuccess();
    }, 1200);
  };

  return (
    <div
      className={`relative w-full max-w-4xl mx-auto rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8 animate-scale-up border transition-all duration-500 ease-in-out ${
        isDark
          ? "bg-[#12121a]/95 border-white/10 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-xl"
      }`}
    >
      {/* Top Header Bar */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b transition-colors duration-500 ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div>
          <div className="flex items-center gap-2 mb-2">
            <span className="text-xs font-black px-3 py-1 rounded-lg bg-emerald-600 text-white uppercase tracking-wider shadow-md shadow-emerald-900/30 flex items-center gap-1.5">
              <FileCheck className="w-3.5 h-3.5" />
              <span>TUGAS MANDIRI & PROYEK</span>
            </span>
            <span className={`text-xs transition-colors duration-500 ${isDark ? "text-slate-400" : "text-slate-600 font-semibold"}`}>
              • Mata Pelajaran: {task.subject}
            </span>
          </div>

          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            {task.title}
          </h2>

          <div className="flex flex-wrap items-center gap-3 mt-2 text-xs">
            <span className={`flex items-center gap-1 transition-colors duration-500 ${isDark ? "text-slate-400" : "text-slate-600 font-medium"}`}>
              <Clock className="w-3.5 h-3.5 text-rose-400" />
              <span>Batas Waktu: <strong>{task.dueDate}</strong></span>
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold border transition-colors duration-500 ${
                isDark
                  ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                  : "bg-cyan-100 text-cyan-900 border-cyan-300"
              }`}
            >
              +{task.rewardExp} EXP
            </span>
            <span
              className={`px-2.5 py-0.5 rounded-full font-bold border transition-colors duration-500 ${
                isDark
                  ? "bg-amber-500/20 text-amber-300 border-amber-500/30"
                  : "bg-amber-100 text-amber-900 border-amber-300"
              }`}
            >
              🪙 +{task.rewardCoins} Koin
            </span>
          </div>
        </div>

        <button
          onClick={onClose}
          className={`px-4 py-2 rounded-xl border text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 self-start sm:self-center ${
            isDark
              ? "bg-white/10 hover:bg-white/20 border-white/15 text-slate-300 hover:text-white"
              : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-700 hover:text-slate-900"
          }`}
        >
          <ChevronLeft className="w-4 h-4" />
          <span>✕ Tutup</span>
        </button>
      </div>

      {!isSubmittedSuccess ? (
        <form onSubmit={handleSubmit} className="space-y-6">
          {/* 1. TOP SECTION: MATERI & INSTRUKSI GURU */}
          <div className="space-y-4">
            <div className="flex items-center gap-2 text-sm font-bold text-slate-200">
              <FileText className="w-4 h-4 text-emerald-400" />
              <span>Instruksi & Panduan Pengerjaan</span>
            </div>

            <div className="p-5 rounded-2xl bg-white/5 border border-white/10 text-sm leading-relaxed text-slate-200 whitespace-pre-line shadow-inner">
              {task.instructions ||
                "Pelajari materi studi terlampir dan kerjakan tugas sesuai instruksi guru. Unggah dokumen pengerjaanmu sebelum batas waktu berakhir."}
            </div>

            {/* Attached Study Materials (Clickable Download Cards with Glowing Hover) */}
            {task.materials && task.materials.length > 0 && (
              <div className="space-y-2.5 pt-2">
                <span className="text-xs font-bold uppercase tracking-wider text-slate-400">
                  Materi Studi Terlampir:
                </span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {task.materials.map((mat) => {
                    const isYt = mat.type === "youtube";
                    return (
                      <a
                        key={mat.id}
                        href={mat.url || "#"}
                        target={isYt ? "_blank" : undefined}
                        rel="noreferrer"
                        className="group p-4 rounded-2xl bg-slate-900/80 border border-white/10 hover:border-emerald-400/80 hover:shadow-lg hover:shadow-emerald-500/20 hover:scale-[1.01] transition-all flex items-center justify-between gap-3 cursor-pointer"
                      >
                        <div className="flex items-center gap-3 truncate">
                          <div
                            className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 transition-transform group-hover:scale-110 ${
                              isYt
                                ? "bg-red-500/20 text-red-400 group-hover:bg-red-500 group-hover:text-white"
                                : "bg-emerald-500/20 text-emerald-400 group-hover:bg-emerald-500 group-hover:text-slate-950"
                            }`}
                          >
                            {isYt ? <Youtube className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                          </div>

                          <div className="truncate">
                            <h5 className="font-bold text-xs text-white group-hover:text-emerald-300 transition-colors truncate">
                              {mat.title}
                            </h5>
                            <span className="text-[10px] text-slate-400">
                              {isYt ? "Tonton di YouTube" : mat.size || "Dokumen Referensi"}
                            </span>
                          </div>
                        </div>

                        <div className="p-2 rounded-lg bg-white/5 text-slate-400 group-hover:text-white group-hover:bg-white/10 transition-all shrink-0">
                          {isYt ? <ExternalLink className="w-4 h-4" /> : <Download className="w-4 h-4" />}
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {/* 2. UPLOAD ZONE (DRAG & DROP) */}
          <div className="space-y-3 pt-2">
            <div className="flex items-center justify-between">
              <label className="text-sm font-bold text-slate-200 flex items-center gap-2">
                <UploadCloud className="w-4 h-4 text-cyan-400" />
                <span>Unggah Hasil Pengerjaan Tugas</span>
              </label>
              <span className="text-xs font-bold text-emerald-400 bg-emerald-500/10 border border-emerald-500/30 px-3 py-1 rounded-full">
                Format Diizinkan: {allowedTypes.join(", ")}
              </span>
            </div>

            {/* Error Message Toast */}
            {errorMessage && (
              <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-shake">
                <XCircle className="w-5 h-5 text-rose-400 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Drag & Drop Canvas */}
            <div
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              className={`relative border-2 border-dashed rounded-3xl p-8 sm:p-10 text-center transition-all cursor-pointer flex flex-col items-center justify-center ${
                isDragging
                  ? "border-emerald-400 bg-emerald-500/10 scale-[1.01]"
                  : "border-white/20 bg-slate-900/60 hover:border-emerald-500/50 hover:bg-slate-900/80"
              }`}
            >
              <input
                type="file"
                id="task-file-input"
                onChange={handleFileInputChange}
                className="absolute inset-0 opacity-0 w-full h-full cursor-pointer z-10"
              />

              <div className="w-16 h-16 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-center mb-4 text-emerald-400 group-hover:scale-110 transition-transform">
                <UploadCloud className="w-8 h-8" />
              </div>

              <h4 className="text-base font-bold text-white mb-1">
                Tarik & Lepaskan Berkas di Sini, atau <span className="text-emerald-400 underline">Pilih Berkas</span>
              </h4>

              <p className="text-xs text-slate-400 max-w-md mt-1">
                Hanya menerima format: <strong className="text-slate-200">{allowedTypes.join(", ")}</strong> (Maksimal ukuran 50 MB)
              </p>
            </div>

            {/* Selected File Preview Card */}
            {selectedFile && (
              <div className="p-4 rounded-2xl bg-emerald-500/10 border border-emerald-500/40 flex items-center justify-between gap-4 animate-scale-up">
                <div className="flex items-center gap-3 truncate">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-slate-950 font-bold flex items-center justify-center shrink-0">
                    <FileCheck className="w-5 h-5" />
                  </div>
                  <div className="truncate">
                    <p className="text-xs sm:text-sm font-bold text-white truncate">
                      {selectedFile.name}
                    </p>
                    <span className="text-[11px] text-emerald-300">
                      {selectedFile.size} • Siap Dikirim
                    </span>
                  </div>
                </div>

                <button
                  type="button"
                  onClick={() => setSelectedFile(null)}
                  className="p-2 rounded-xl bg-rose-500/10 text-rose-400 hover:bg-rose-500/20 border border-rose-500/20 transition-all cursor-pointer shrink-0"
                  title="Hapus berkas terpilih"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            )}

            {/* Upload Progress Bar */}
            {isSubmitting && (
              <div className="space-y-2 pt-2 animate-fade-in">
                <div className="flex items-center justify-between text-xs text-slate-300">
                  <span>Mengunggah dan memvalidasi berkas...</span>
                  <span className="font-bold text-emerald-400">{uploadProgress}%</span>
                </div>
                <div className="w-full bg-slate-800 h-2.5 rounded-full overflow-hidden">
                  <div
                    className="bg-gradient-to-r from-emerald-500 to-teal-400 h-full transition-all duration-300 rounded-full"
                    style={{ width: `${uploadProgress}%` }}
                  />
                </div>
              </div>
            )}
          </div>

          {/* 3. SUBMIT BUTTON */}
          <div className="flex items-center justify-between pt-4 border-t border-white/10">
            <span className="text-xs text-slate-400 hidden sm:inline">
              Pastikan berkas telah sesuai dengan instruksi sebelum dikirimkan.
            </span>

            <button
              type="submit"
              disabled={!selectedFile || isSubmitting}
              className={`w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm flex items-center justify-center gap-2.5 transition-all ${
                !selectedFile || isSubmitting
                  ? "bg-slate-800 text-slate-500 cursor-not-allowed opacity-50"
                  : "bg-emerald-600 hover:bg-emerald-500 text-white shadow-xl shadow-emerald-900/30 cursor-pointer hover:scale-105 active:scale-95"
              }`}
            >
              <Send className="w-4 h-4" />
              <span>{isSubmitting ? "Mengirimkan Tugas..." : "Kirim Tugas"}</span>
            </button>
          </div>
        </form>
      ) : (
        /* VICTORY & CONFIRMATION SCREEN */
        <div className="py-10 text-center space-y-6 max-w-lg mx-auto bg-slate-900/80 p-8 rounded-3xl border border-white/10 shadow-2xl">
          <div className="w-20 h-20 bg-emerald-500/20 text-emerald-400 rounded-full flex items-center justify-center mx-auto border border-emerald-400/30 shadow-xl shadow-emerald-500/20 animate-bounce">
            <Award className="w-10 h-10" />
          </div>

          <div>
            <h3 className="text-2xl font-black text-white">Tugas Berhasil Dikumpulkan! 🎉</h3>
            <p className="text-slate-300 text-xs sm:text-sm mt-2">
              Berkas <strong className="text-emerald-400">"{selectedFile?.name || "Tugas"}"</strong> telah diterima oleh sistem dan siap dinilai oleh guru pengampu.
            </p>
          </div>

          <div className="flex justify-center gap-3 pt-2">
            <span className="px-5 py-2 rounded-xl bg-cyan-500/20 border border-cyan-400/30 text-cyan-300 font-bold text-xs">
              +{task.rewardExp} EXP Diperoleh
            </span>
            <span className="px-5 py-2 rounded-xl bg-amber-500/20 border border-amber-400/30 text-amber-300 font-bold text-xs">
              🪙 +{task.rewardCoins} Koin Didapatkan
            </span>
          </div>

          <button
            onClick={onClose}
            className="mt-6 px-8 py-3 rounded-2xl font-black text-xs text-slate-950 bg-emerald-400 hover:bg-emerald-300 transition-all hover:scale-105 active:scale-95 cursor-pointer shadow-lg shadow-emerald-500/25"
          >
            Kembali ke Beranda
          </button>
        </div>
      )}
    </div>
  );
}
