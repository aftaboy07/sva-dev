"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { UrgentTaskMaterial } from "@/types";
import {
  FileText,
  UploadCloud,
  Youtube,
  Plus,
  Trash2,
  Calendar,
  Clock,
  Sparkles,
  CheckCircle2,
  AlertCircle,
  FileCheck,
  Video,
  Image as ImageIcon,
  FileSpreadsheet,
  Link as LinkIcon,
  Send,
  BookOpen,
} from "lucide-react";

import ClassTargetSelector from "@/components/teacher/ClassTargetSelector";

interface AssignmentCreatorProps {
  onSuccess?: () => void;
}

export default function AssignmentCreator({ onSuccess }: AssignmentCreatorProps) {
  const { addUrgentTask, currentUser, theme } = useEduQuest();
  const isDark = theme === "dark";

  // Form States
  const [title, setTitle] = useState("");
  const [subject, setSubject] = useState("Matematika");
  const [selectedClasses, setSelectedClasses] = useState<string[]>([]);
  const [difficulty, setDifficulty] = useState<"Mudah" | "Sedang" | "Menantang">("Sedang");
  const [deadlineDate, setDeadlineDate] = useState(() => {
    const tomorrow = new Date();
    tomorrow.setDate(tomorrow.getDate() + 1);
    return tomorrow.toISOString().split("T")[0];
  });
  const [deadlineTime, setDeadlineTime] = useState("23:59");
  const [rewardExp, setRewardExp] = useState(150);
  const [rewardCoins, setRewardCoins] = useState(50);
  const [instructions, setInstructions] = useState("");

  // Materials Attachment
  const [materials, setMaterials] = useState<UrgentTaskMaterial[]>([
    {
      id: "mat-default-1",
      title: "Panduan_Studi_Kasus_Mandiri.pdf",
      type: "pdf",
      url: "#",
      size: "2.1 MB",
    },
  ]);
  const [showYoutubeModal, setShowYoutubeModal] = useState(false);
  const [ytUrl, setYtUrl] = useState("");
  const [ytTitle, setYtTitle] = useState("");

  // Allowed Submission Types: "PDF" | "Images (JPG/PNG)" | "Video (MP4)" | "Documents (Word/Excel)"
  const SUBMISSION_OPTIONS = [
    { id: "PDF", label: "PDF", icon: FileText, desc: ".pdf dokumen terenkripsi" },
    { id: "Images (JPG/PNG)", label: "Images (JPG/PNG)", icon: ImageIcon, desc: ".jpg, .jpeg, .png foto hasil tulis tangan" },
    { id: "Video (MP4)", label: "Video (MP4)", icon: Video, desc: ".mp4 rekaman video presentasi" },
    { id: "Documents (Word/Excel)", label: "Documents (Word/Excel)", icon: FileSpreadsheet, desc: ".docx, .xlsx lembar kerja" },
  ];

  const [allowedSubmissionTypes, setAllowedSubmissionTypes] = useState<string[]>([
    "PDF",
    "Documents (Word/Excel)",
  ]);

  // Validation & UI State
  const [validationError, setValidationError] = useState<string | null>(null);
  const [publishSuccess, setPublishSuccess] = useState(false);

  const toggleSubmissionType = (typeId: string) => {
    setAllowedSubmissionTypes((prev) => {
      if (prev.includes(typeId)) {
        return prev.filter((t) => t !== typeId);
      } else {
        return [...prev, typeId];
      }
    });
    setValidationError(null);
  };

  const handleSimulateFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const isPdf = file.name.endsWith(".pdf") || file.type.includes("pdf");
    const newMaterial: UrgentTaskMaterial = {
      id: `mat-${Date.now()}`,
      title: file.name,
      type: isPdf ? "pdf" : "doc",
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      url: "#",
    };

    setMaterials((prev) => [...prev, newMaterial]);
  };

  const handleAddYoutubeLink = (e: React.FormEvent) => {
    e.preventDefault();
    if (!ytUrl.trim()) return;

    const newMaterial: UrgentTaskMaterial = {
      id: `yt-${Date.now()}`,
      title: ytTitle.trim() || "Video Pembahasan & Tutorial Studi",
      type: "youtube",
      url: ytUrl.trim(),
    };

    setMaterials((prev) => [...prev, newMaterial]);
    setYtUrl("");
    setYtTitle("");
    setShowYoutubeModal(false);
  };

  const handleRemoveMaterial = (id: string) => {
    setMaterials((prev) => prev.filter((m) => m.id !== id));
  };

  const handlePublishAssignment = (e: React.FormEvent) => {
    e.preventDefault();

    if (!title.trim()) {
      setValidationError("Judul tugas wajib diisi.");
      return;
    }

    if (!instructions.trim()) {
      setValidationError("Instruksi atau deskripsi tugas santri tidak boleh kosong.");
      return;
    }

    if (selectedClasses.length === 0) {
      setValidationError("Silakan pilih minimal 1 kelas target penerima tugas.");
      return;
    }

    if (allowedSubmissionTypes.length === 0) {
      setValidationError("Guru wajib memilih minimal satu format pengumpulan berkas santri!");
      return;
    }

    setValidationError(null);

    // Format display dueDate
    const dueDateDisplay = `${deadlineDate}, ${deadlineTime} WIB`;

    addUrgentTask({
      title: title.trim(),
      subject,
      dueDate: dueDateDisplay,
      deadlineHours: 24,
      rewardExp,
      rewardCoins,
      difficulty,
      questionsCount: 0,
      type: "tugas",
      instructions: instructions.trim(),
      materials,
      allowedSubmissionTypes,
      targetClasses: selectedClasses,
    });

    setPublishSuccess(true);
    setTimeout(() => {
      setPublishSuccess(false);
      if (onSuccess) onSuccess();
    }, 2800);

    // Reset Form
    setTitle("");
    setInstructions("");
  };

  return (
    <div
      className={`relative w-full rounded-3xl p-6 sm:p-8 backdrop-blur-2xl shadow-2xl space-y-8 animate-fade-in border transition-all duration-500 ease-in-out ${
        isDark
          ? "bg-[#1a1a24] border-white/10 text-white"
          : "bg-white border-slate-200 text-slate-900 shadow-xl"
      }`}
    >
      {/* Header Banner */}
      <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b transition-colors duration-500 ${isDark ? "border-white/10" : "border-slate-200"}`}>
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/15 border border-emerald-500/30 text-emerald-400 text-xs font-bold mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>MODUL GURU • PENUGASAN & LAMPIRAN MATERI</span>
          </div>
          <h2
            className={`text-xl sm:text-2xl font-black tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Buat Tugas Baru & Unggah Materi Studi
          </h2>
          <p
            className={`text-xs sm:text-sm mt-1 transition-colors duration-500 ${
              isDark ? "text-slate-400" : "text-slate-600 font-medium"
            }`}
          >
            Terbitkan tugas mandiri / proyek dengan lampiran referensi (PDF & Video) serta tentukan batasan format pengumpulan berkas santri.
          </p>
        </div>

        {/* Status Pill */}
        <div
          className={`flex items-center gap-2 px-4 py-2 rounded-2xl text-xs shrink-0 transition-colors duration-500 ${
            isDark
              ? "bg-white/5 border border-white/10 text-slate-300"
              : "bg-slate-100 border border-slate-200 text-slate-700 shadow-xs"
          }`}
        >
          <Sparkles className="w-4 h-4 text-[#ffbf00]" />
          <span>Terintegrasi Dasbor Santri</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {publishSuccess && (
        <div className="p-4 bg-emerald-500/20 border border-emerald-500/50 rounded-2xl text-emerald-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-scale-up">
          <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
          <div>
            <p className="font-extrabold text-emerald-200">Tugas Berhasil Diterbitkan! 🎉</p>
            <p className="text-[11px] text-emerald-300/80 font-normal">
              Tugas telah otomatis disematkan pada baris "Tugas & Tantangan Mendesak" santri dengan tombol pengumpulan berkas.
            </p>
          </div>
        </div>
      )}

      {/* Error Alert */}
      {validationError && (
        <div className="p-4 bg-rose-500/20 border border-rose-500/50 rounded-2xl text-rose-300 text-xs sm:text-sm font-bold flex items-center gap-3 animate-fade-in">
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0" />
          <span>{validationError}</span>
        </div>
      )}

      {/* FORM BUILDER */}
      <form onSubmit={handlePublishAssignment} className="space-y-6">
        {/* ROW 1: Judul & Mata Pelajaran */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5">
          <div className="lg:col-span-8 space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>Judul Tugas / Proyek</span>
              <span className="text-rose-400">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Contoh: Studi Kasus & Pemodelan SPLDV pada Koperasi Santri"
              className="w-full px-4 py-3 rounded-2xl bg-[#14141b] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all"
            />
          </div>

          <div className="lg:col-span-4 space-y-2">
            <label className="text-xs font-bold text-slate-300">Mata Pelajaran</label>
            <select
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              className="w-full px-4 py-3 rounded-2xl bg-[#14141b] border border-white/10 text-white text-sm focus:outline-none focus:border-emerald-500/60 transition-all cursor-pointer"
            >
              <option value="Matematika">Matematika</option>
              <option value="IPA Terpadu">IPA Terpadu</option>
              <option value="PAI & Al-Qur'an">PAI & Al-Qur'an</option>
              <option value="Bahasa Inggris">Bahasa Inggris</option>
              <option value="Bahasa Indonesia">Bahasa Indonesia</option>
              <option value="Informatika">Informatika & Robotika</option>
            </select>
          </div>
        </div>

        {/* CLASS TARGET SELECTOR FILTERED BY TEACHER LEVEL */}
        <ClassTargetSelector
          selectedClasses={selectedClasses}
          onChange={setSelectedClasses}
          label="Pilih Target Kelas (Otomatis Sesuai Jenjang Guru)"
        />

        {/* ROW 2: Tenggat Waktu & Rewards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-emerald-400" />
              <span>Tanggal Batas (Deadline)</span>
            </label>
            <input
              type="date"
              value={deadlineDate}
              onChange={(e) => setDeadlineDate(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#ffbf00]" />
              <span>Waktu Batas (WIB)</span>
            </label>
            <input
              type="time"
              value={deadlineTime}
              onChange={(e) => setDeadlineTime(e.target.value)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 transition-all"
            />
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Tingkat Kesulitan</label>
            <select
              value={difficulty}
              onChange={(e) => setDifficulty(e.target.value as any)}
              className="w-full px-4 py-2.5 rounded-2xl bg-[#14141b] border border-white/10 text-white text-xs focus:outline-none focus:border-emerald-500/60 transition-all cursor-pointer"
            >
              <option value="Mudah">Mudah (Dasar)</option>
              <option value="Sedang">Sedang (Standar)</option>
              <option value="Menantang">Menantang (HOTS)</option>
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-xs font-bold text-slate-300">Imbalan Santri (EXP / Koin)</label>
            <div className="grid grid-cols-2 gap-2">
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#14141b] border border-white/10">
                <span className="text-[10px] font-bold text-cyan-400">EXP</span>
                <input
                  type="number"
                  value={rewardExp}
                  onChange={(e) => setRewardExp(Number(e.target.value))}
                  className="w-full bg-transparent text-right text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
              <div className="flex items-center gap-1.5 px-3 py-2 rounded-2xl bg-[#14141b] border border-white/10">
                <span className="text-[10px] font-bold text-amber-400">🪙</span>
                <input
                  type="number"
                  value={rewardCoins}
                  onChange={(e) => setRewardCoins(Number(e.target.value))}
                  className="w-full bg-transparent text-right text-xs font-mono font-bold text-white focus:outline-none"
                />
              </div>
            </div>
          </div>
        </div>

        {/* ROW 3: Rich Text Area for Instructions */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
              <span>Instruksi & Panduan Tugas</span>
              <span className="text-rose-400">*</span>
            </label>
            <span className="text-[11px] text-slate-400">{instructions.length} karakter</span>
          </div>
          <textarea
            rows={5}
            value={instructions}
            onChange={(e) => setInstructions(e.target.value)}
            placeholder="Tuliskan petunjuk pengerjaan yang jelas, rubrik penilaian, dan materi yang harus dipelajari oleh santri sebelum mengumpulkan berkas..."
            className="w-full px-4 py-3.5 rounded-2xl bg-[#14141b] border border-white/10 text-white placeholder-slate-500 text-sm focus:outline-none focus:border-emerald-500/60 focus:ring-2 focus:ring-emerald-500/20 transition-all leading-relaxed"
          />
        </div>

        {/* ROW 4: Material Attachment (PDF/Docs or YouTube) */}
        <div className="space-y-3 p-5 rounded-3xl bg-[#14141b]/80 border border-white/5">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <div>
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <FileCheck className="w-4 h-4 text-emerald-400" />
                <span>Lampiran Materi Studi Santri</span>
              </h4>
              <p className="text-xs text-slate-400">
                Santri dapat mengunduh dokumen panduan atau menonton video YouTube yang disematkan.
              </p>
            </div>

            <div className="flex items-center gap-2.5">
              {/* Upload Document Button */}
              <label className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/15 border border-white/10 text-xs font-bold text-slate-200 hover:text-white cursor-pointer transition-all flex items-center gap-2 active:scale-95">
                <UploadCloud className="w-3.5 h-3.5 text-cyan-400" />
                <span>Upload PDF/Doc</span>
                <input
                  type="file"
                  onChange={handleSimulateFileUpload}
                  accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx"
                  className="hidden"
                />
              </label>

              {/* Embed YouTube Button */}
              <button
                type="button"
                onClick={() => setShowYoutubeModal(true)}
                className="px-3.5 py-2 rounded-xl bg-red-600/20 hover:bg-red-600/30 border border-red-500/30 text-xs font-bold text-red-300 hover:text-white cursor-pointer transition-all flex items-center gap-2 active:scale-95"
              >
                <Youtube className="w-3.5 h-3.5 text-red-400" />
                <span>Sematkan YouTube</span>
              </button>
            </div>
          </div>

          {/* YouTube Embed Modal Dialog */}
          {showYoutubeModal && (
            <div className="p-4 rounded-2xl bg-slate-900 border border-red-500/30 space-y-3 animate-fade-in mt-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-red-400 flex items-center gap-1.5">
                  <Youtube className="w-4 h-4" />
                  <span>Sematkan Video Pembahasan YouTube</span>
                </span>
                <button
                  type="button"
                  onClick={() => setShowYoutubeModal(false)}
                  className="text-xs text-slate-400 hover:text-white"
                >
                  ✕
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <input
                  type="text"
                  value={ytTitle}
                  onChange={(e) => setYtTitle(e.target.value)}
                  placeholder="Judul Video (Contoh: Video Bedah Rumus SPLDV)"
                  className="px-3 py-2 bg-slate-950 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                />
                <input
                  type="url"
                  value={ytUrl}
                  onChange={(e) => setYtUrl(e.target.value)}
                  placeholder="URL YouTube (https://www.youtube.com/watch?v=...)"
                  className="px-3 py-2 bg-slate-950 rounded-xl border border-white/10 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-red-500/50"
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowYoutubeModal(false)}
                  className="px-3 py-1.5 rounded-lg text-xs font-bold text-slate-400 hover:text-white"
                >
                  Batal
                </button>
                <button
                  type="button"
                  onClick={handleAddYoutubeLink}
                  className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white text-xs font-bold shadow-md shadow-red-600/30"
                >
                  Sematkan Video
                </button>
              </div>
            </div>
          )}

          {/* List of Attached Materials */}
          {materials.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-2">
              {materials.map((mat) => {
                const isYt = mat.type === "youtube";
                return (
                  <div
                    key={mat.id}
                    className="p-3.5 rounded-2xl bg-white/5 border border-white/10 flex items-center justify-between gap-3 hover:border-white/20 transition-all group"
                  >
                    <div className="flex items-center gap-3 truncate">
                      <div
                        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
                          isYt ? "bg-red-500/20 text-red-400" : "bg-cyan-500/20 text-cyan-400"
                        }`}
                      >
                        {isYt ? <Youtube className="w-5 h-5" /> : <FileText className="w-5 h-5" />}
                      </div>
                      <div className="truncate">
                        <p className="text-xs font-bold text-slate-200 truncate">{mat.title}</p>
                        <span className="text-[10px] text-slate-400">
                          {isYt ? "Video Link" : mat.size || "Dokumen Referensi"}
                        </span>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={() => handleRemoveMaterial(mat.id)}
                      className="p-1.5 rounded-lg text-slate-500 hover:text-rose-400 hover:bg-rose-500/10 transition-all cursor-pointer shrink-0"
                      title="Hapus lampiran"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                );
              })}
            </div>
          ) : (
            <p className="text-xs text-slate-500 italic py-2">
              Belum ada materi studi yang dilampirkan. Santri hanya akan melihat instruksi teks.
            </p>
          )}
        </div>

        {/* ROW 5: ALLOWED SUBMISSION TYPES (Strictly Required Pill Toggles) */}
        <div className="space-y-3 p-5 rounded-3xl bg-[#14141b]/80 border border-white/5">
          <div className="flex items-center justify-between">
            <div>
              <label className="text-xs font-bold text-slate-300 flex items-center gap-1.5">
                <span>Format Pengumpulan Berkas Santri yang Diizinkan</span>
                <span className="text-rose-400">*</span>
              </label>
              <p className="text-xs text-slate-400">
                Guru wajib memilih minimal satu format berkas. Santri hanya dapat mengunggah file sesuai tipe yang dipilih.
              </p>
            </div>
            <span
              className={`text-xs font-bold px-3 py-1 rounded-full ${
                allowedSubmissionTypes.length > 0
                  ? "bg-emerald-500/20 text-emerald-400 border border-emerald-500/40"
                  : "bg-rose-500/20 text-rose-400 border border-rose-500/40"
              }`}
            >
              {allowedSubmissionTypes.length} Tipe Dipilih
            </span>
          </div>

          {/* Toggle Pills / Checkboxes */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
            {SUBMISSION_OPTIONS.map((opt) => {
              const isSelected = allowedSubmissionTypes.includes(opt.id);
              const Icon = opt.icon;

              return (
                <button
                  key={opt.id}
                  type="button"
                  onClick={() => toggleSubmissionType(opt.id)}
                  className={`p-4 rounded-2xl border text-left transition-all cursor-pointer flex flex-col justify-between gap-3 group ${
                    isSelected
                      ? "bg-emerald-500/15 border-emerald-500 text-white shadow-lg shadow-emerald-500/15 scale-[1.01]"
                      : "bg-[#181822] border-white/10 text-slate-400 hover:border-white/20 hover:text-slate-200"
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div
                      className={`w-8 h-8 rounded-xl flex items-center justify-center ${
                        isSelected
                          ? "bg-emerald-500 text-slate-950 font-bold"
                          : "bg-white/5 text-slate-400 group-hover:text-white"
                      }`}
                    >
                      <Icon className="w-4 h-4" />
                    </div>

                    <div
                      className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all ${
                        isSelected
                          ? "bg-emerald-500 border-emerald-500 text-slate-950"
                          : "border-white/20 bg-transparent"
                      }`}
                    >
                      {isSelected && <CheckCircle2 className="w-3.5 h-3.5" />}
                    </div>
                  </div>

                  <div>
                    <h5 className="font-bold text-xs text-white">{opt.label}</h5>
                    <p className="text-[10px] text-slate-400 mt-0.5 leading-snug">{opt.desc}</p>
                  </div>
                </button>
              );
            })}
          </div>
        </div>

        {/* FOOTER ACTION: Glowing "Terbitkan Tugas" */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 border-t border-white/10">
          <div className="text-xs text-slate-400">
            Tugas yang diterbitkan akan langsung dapat diakses oleh santri dari menu utama portal santri.
          </div>

          <button
            type="submit"
            className="w-full sm:w-auto px-8 py-3.5 rounded-2xl font-black text-sm text-slate-950 bg-gradient-to-r from-emerald-500 via-teal-400 to-cyan-400 hover:from-emerald-400 hover:to-cyan-300 shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2.5 transition-all hover:scale-105 active:scale-95 cursor-pointer"
          >
            <Send className="w-4 h-4" />
            <span>Terbitkan Tugas</span>
          </button>
        </div>
      </form>
    </div>
  );
}
