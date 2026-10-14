"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  QrCode,
  BookMarked,
  CheckCircle2,
  Clock,
  Camera,
  Calendar,
  Layers,
  Send,
  Sparkles,
  FileCheck,
  AlertCircle,
} from "lucide-react";

export default function TabAbsensiJurnal() {
  const {
    qrScans,
    teachingJournals,
    simulateQRScan,
    addTeachingJournal,
    studentRecords,
  } = useEduQuest();

  // QR Scanner State
  const [selectedNisForScan, setSelectedNisForScan] = useState("26091");
  const [scanToast, setScanToast] = useState<{
    name: string;
    status: "Tepat Waktu" | "Terlambat";
  } | null>(null);

  // Journal Form State
  const [journalSubject, setJournalSubject] = useState("Fisika Mekanika");
  const [journalClass, setJournalClass] = useState("Kelas 11 MIPA 1");
  const [journalTimeSlot, setJournalTimeSlot] = useState("13:30 - 15:30 WIB");
  const [journalTopic, setJournalTopic] = useState("");
  const [journalObjectives, setJournalObjectives] = useState("");
  const [journalObstacles, setJournalObstacles] = useState("");
  const [journalAttendanceCount, setJournalAttendanceCount] = useState(28);
  const [journalSuccessToast, setJournalSuccessToast] = useState(false);

  const handleTriggerScan = () => {
    const res = simulateQRScan(selectedNisForScan);
    setScanToast({ name: res.studentName, status: res.status });
    setTimeout(() => setScanToast(null), 3500);
  };

  const handleSaveJournal = (e: React.FormEvent) => {
    e.preventDefault();
    if (!journalTopic.trim()) return;

    addTeachingJournal({
      date: new Date().toLocaleDateString("id-ID", {
        day: "numeric",
        month: "long",
        year: "numeric",
      }),
      timeSlot: journalTimeSlot,
      subject: journalSubject,
      gradeClass: journalClass,
      chapterTopic: journalTopic,
      learningObjectives: journalObjectives || "Pencapaian tujuan kurikulum fase F.",
      studentObstacles: journalObstacles || "Seluruh kegiatan kelas berjalan kondusif.",
      attendanceCount: Number(journalAttendanceCount),
      totalStudents: 30,
    });

    setJournalSuccessToast(true);
    setJournalTopic("");
    setJournalObjectives("");
    setJournalObstacles("");
    setTimeout(() => setJournalSuccessToast(false), 4000);
  };

  return (
    <div className="space-y-10 pb-16 text-white">
      {/* Header */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-2">
          <QrCode className="w-3.5 h-3.5" />
          <span>Validasi Kehadiran & Tata Kelola Kelas</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Pemindai Absensi QR & Jurnal Harian
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Simulasikan pemindaian kode QR kartu pelajar dan arsipkan jurnal aktivitas belajar mengajar harian secara akuntabel.
        </p>
      </div>

      {/* SECTION 1: QR SCANNER ATTENDANCE VALIDATION BLOCK */}
      <div className="bg-[#1a1a24] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-white/10 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-400 flex items-center justify-center font-bold">
              <QrCode className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-bold text-white">
                Simulator Pemindai QR Presensi Siswa
              </h3>
              <p className="text-xs text-gray-400">
                Kamera gerbang bimbingan belajar mendeteksi QR kartu pelajar secara instan.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-ping" />
            <span className="text-xs font-bold text-emerald-300 bg-emerald-500/20 px-2.5 py-1 rounded-md border border-emerald-500/40">
              Sensor Scanner Siaga
            </span>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
          {/* Camera Viewport Simulation (5 cols) */}
          <div className="lg:col-span-5 relative aspect-square max-w-sm mx-auto w-full bg-black/90 rounded-2xl border border-white/15 overflow-hidden flex flex-col items-center justify-center p-6 shadow-2xl">
            {/* Viewfinder brackets */}
            <div className="absolute top-6 left-6 w-10 h-10 border-t-4 border-l-4 border-emerald-400 rounded-tl-xl" />
            <div className="absolute top-6 right-6 w-10 h-10 border-t-4 border-r-4 border-emerald-400 rounded-tr-xl" />
            <div className="absolute bottom-6 left-6 w-10 h-10 border-b-4 border-l-4 border-emerald-400 rounded-bl-xl" />
            <div className="absolute bottom-6 right-6 w-10 h-10 border-b-4 border-r-4 border-emerald-400 rounded-br-xl" />

            {/* Scanning beam animation */}
            <div className="absolute inset-x-8 top-1/2 -translate-y-1/2 h-0.5 bg-gradient-to-r from-transparent via-emerald-400 to-transparent animate-scan shadow-lg shadow-emerald-400/50" />

            {/* QR Mock Center */}
            <div className="p-4 bg-white rounded-2xl shadow-xl flex flex-col items-center justify-center">
              <QrCode className="w-24 h-24 text-slate-900" />
              <span className="text-[10px] font-mono font-bold text-slate-700 mt-1">
                NIS: {selectedNisForScan}
              </span>
            </div>

            <span className="text-[11px] text-emerald-400 font-bold mt-4 animate-pulse">
              Arahkan Barcode Siswa ke Pusat Lensa
            </span>
          </div>

          {/* Trigger Controller & Live Scanned Table (7 cols) */}
          <div className="lg:col-span-7 space-y-4">
            <div className="p-4 bg-[#12121a] rounded-2xl border border-white/10 space-y-3">
              <label className="block text-xs font-bold text-gray-300">
                Pilih Kartu Siswa untuk Disimulasikan:
              </label>

              <div className="flex flex-col sm:flex-row gap-2.5">
                <select
                  value={selectedNisForScan}
                  onChange={(e) => setSelectedNisForScan(e.target.value)}
                  className="flex-1 p-2.5 rounded-xl border border-white/10 bg-[#1a1a24] text-xs font-bold text-white focus:ring-2 focus:ring-emerald-500 focus:outline-hidden"
                >
                  {studentRecords.map((s) => (
                    <option key={s.id} value={s.nis}>
                      {s.name} (NIS: {s.nis} - {s.grade})
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  onClick={handleTriggerScan}
                  className="px-5 py-2.5 rounded-xl text-xs font-bold text-white bg-emerald-600 hover:bg-emerald-500 shadow-md shadow-emerald-600/20 flex items-center justify-center gap-2 active:scale-95 transition whitespace-nowrap cursor-pointer"
                >
                  <Camera className="w-4 h-4" />
                  <span>Simulasikan Scan QR Siswa</span>
                </button>
              </div>
            </div>

            {scanToast && (
              <div
                className={`p-3.5 rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-lg ${
                  scanToast.status === "Tepat Waktu"
                    ? "bg-emerald-600 text-white"
                    : "bg-amber-600 text-white"
                }`}
              >
                <CheckCircle2 className="w-4 h-4 shrink-0" />
                <span>
                  Presensi Tervalidasi: <strong>{scanToast.name}</strong> • Status Presensi:{" "}
                  <strong>{scanToast.status}</strong>
                </span>
              </div>
            )}

            {/* Live Scans Log */}
            <div className="space-y-2">
              <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
                Log Presensi Hari Ini ({qrScans.length} Terekam):
              </h4>
              <div className="max-h-48 overflow-y-auto space-y-1.5 pr-1">
                {qrScans.map((scan) => (
                  <div
                    key={scan.id}
                    className="p-3 bg-[#12121a] rounded-xl border border-white/10 text-xs flex items-center justify-between shadow-sm hover:border-emerald-500/40 transition"
                  >
                    <div className="flex items-center gap-2.5">
                      <span className="w-2 h-2 rounded-full bg-emerald-400" />
                      <div>
                        <strong className="text-white">{scan.studentName}</strong>
                        <span className="text-gray-400 text-[11px] block">
                          NIS: {scan.studentNis} • {scan.grade}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span
                        className={`text-[10px] font-bold px-2 py-0.5 rounded-md ${
                          scan.status === "Tepat Waktu"
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                        }`}
                      >
                        {scan.status}
                      </span>
                      <span className="text-[10px] text-gray-400 block mt-0.5 font-mono">
                        {scan.scanTime}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 2: INTERACTIVE JURNAL MENGAJAR HARIAN FORM */}
      <div className="bg-[#1a1a24] rounded-2xl border border-white/10 p-6 sm:p-8 space-y-6 shadow-xl backdrop-blur-md">
        <div className="flex items-center gap-3 border-b border-white/10 pb-4">
          <div className="w-10 h-10 rounded-xl bg-blue-500/20 border border-blue-500/40 text-blue-400 flex items-center justify-center font-bold">
            <BookMarked className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-base font-bold text-white">
              Formulir Jurnal Mengajar Harian Guru
            </h3>
            <p className="text-xs text-gray-400">
              Dokumentasi capaian materi, refleksi hambatan belajar siswa, dan rekapitulasi kehadiran per pertemuan.
            </p>
          </div>
        </div>

        <form onSubmit={handleSaveJournal} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Mata Pelajaran
              </label>
              <input
                type="text"
                value={journalSubject}
                onChange={(e) => setJournalSubject(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Rombel / Kelas
              </label>
              <input
                type="text"
                value={journalClass}
                onChange={(e) => setJournalClass(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Waktu Pertemuan
              </label>
              <input
                type="text"
                value={journalTimeSlot}
                onChange={(e) => setJournalTimeSlot(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
            <div className="sm:col-span-3">
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Bab / Topik Pokok Bahasan
              </label>
              <input
                type="text"
                placeholder="Contoh: Termodinamika: Mesin Carnot & Siklus Efisiensi"
                value={journalTopic}
                onChange={(e) => setJournalTopic(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white placeholder-gray-500 focus:bg-[#151520] focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Kehadiran (Siswa)
              </label>
              <input
                type="number"
                value={journalAttendanceCount}
                onChange={(e) => setJournalAttendanceCount(Number(e.target.value))}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white text-center focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Capaian Pembelajaran (Target Kompetensi Hari Ini)
              </label>
              <textarea
                rows={3}
                placeholder="Siswa mampu menghitung efisiensi siklus Carnot..."
                value={journalObjectives}
                onChange={(e) => setJournalObjectives(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white placeholder-gray-500 focus:bg-[#151520] focus:outline-hidden focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1">
                Refleksi Hambatan & Catatan Perilaku Siswa
              </label>
              <textarea
                rows={3}
                placeholder="Tulis kendala konsep yang dialami siswa saat praktikum..."
                value={journalObstacles}
                onChange={(e) => setJournalObstacles(e.target.value)}
                className="w-full p-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white placeholder-gray-500 focus:bg-[#151520] focus:outline-hidden focus:border-blue-500"
              />
            </div>
          </div>

          <div className="flex justify-end pt-2">
            <button
              type="submit"
              disabled={!journalTopic.trim()}
              className="px-6 py-3 rounded-xl font-bold text-xs text-white bg-blue-600 hover:bg-blue-500 disabled:opacity-50 shadow-md shadow-blue-600/20 flex items-center gap-2 transition cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>Simpan & Arsipkan Jurnal Mengajar</span>
            </button>
          </div>

          {journalSuccessToast && (
            <div className="p-3.5 bg-emerald-500 text-white rounded-2xl text-xs font-bold flex items-center gap-2 animate-fade-in shadow-md">
              <CheckCircle2 className="w-4 h-4 shrink-0" />
              <span>
                Jurnal mengajar berhasil disimpan dan terarsip ke pangkalan data akademik yayasan!
              </span>
            </div>
          )}
        </form>

        {/* Saved Teaching Journals History Table */}
        <div className="pt-6 border-t border-white/10 space-y-3">
          <h4 className="text-xs font-bold uppercase tracking-wider text-gray-400">
            Riwayat Jurnal Terakhir ({teachingJournals.length} Entri):
          </h4>

          <div className="space-y-3">
            {teachingJournals.map((j) => (
              <div
                key={j.id}
                className="p-4 rounded-2xl border border-white/10 bg-[#12121a] hover:bg-[#151520] hover:border-blue-500/40 transition space-y-2"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1 text-xs">
                  <div className="flex items-center gap-2">
                    <span className="font-bold text-blue-300 bg-blue-500/20 px-2 py-0.5 rounded border border-blue-500/30">
                      {j.subject}
                    </span>
                    <span className="font-bold text-white">{j.gradeClass}</span>
                  </div>
                  <span className="text-gray-400">
                    {j.date} ({j.timeSlot}) • Hadir: {j.attendanceCount}/{j.totalStudents} Siswa
                  </span>
                </div>

                <h5 className="font-bold text-sm text-white">
                  {j.chapterTopic}
                </h5>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs text-gray-300">
                  <div>
                    <strong className="text-gray-400">Capaian:</strong>{" "}
                    {j.learningObjectives}
                  </div>
                  <div>
                    <strong className="text-gray-400">Refleksi:</strong>{" "}
                    {j.studentObstacles}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
