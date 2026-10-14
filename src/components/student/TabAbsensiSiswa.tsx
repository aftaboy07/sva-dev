"use client";

import React, { useState, useEffect } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { StudentAttendanceTimemark } from "@/types";
import {
  Camera,
  RotateCcw,
  CheckCircle2,
  Clock,
  MapPin,
  ShieldCheck,
  Sparkles,
  Flame,
  Scan,
  RefreshCw,
  Award,
  Calendar,
  AlertCircle,
  FileCheck,
} from "lucide-react";

export default function TabAbsensiSiswa() {
  const { currentUser, studentData, checkInAttendance, theme } = useEduQuest();
  const isDark = theme === "dark";

  // Camera simulation states
  const [isCameraActive, setIsCameraActive] = useState(true);
  const [cameraFacing, setCameraFacing] = useState("user");
  const [isCapturing, setIsCapturing] = useState(false);
  const [capturedReceipt, setCapturedReceipt] = useState<StudentAttendanceTimemark | null>(null);
  const [currentTimeStr, setCurrentTimeStr] = useState("");

  // Live ticking clock for HUD
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTimeStr(
        now.toLocaleDateString("id-ID", {
          weekday: "long",
          day: "numeric",
          month: "long",
          year: "numeric",
        }) +
          " • " +
          now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) +
          " WIB"
      );
    };
    updateTime();
    const interval = setInterval(updateTime, 1000);
    return () => clearInterval(interval);
  }, []);

  const handleCaptureTimemark = () => {
    if (studentData.hasCheckedInToday) return;

    setIsCapturing(true);

    setTimeout(() => {
      const result = checkInAttendance({
        location: "Kampus Terpadu YPI As Sa'adah (Zona Absensi Santri)",
        photoSnapshotUrl:
          currentUser?.avatar ||
          "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
        method: "camera",
      });

      setIsCapturing(false);
      if (result.success && result.timemark) {
        setCapturedReceipt(result.timemark);
      }
    }, 900);
  };

  const timemarks = studentData.timemarks || [];

  return (
    <div className="space-y-8 pb-20 md:pb-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-[#0cc0df] text-xs font-bold mb-2">
            <Scan className="w-3.5 h-3.5 text-[#0cc0df]" />
            <span>Presensi Biometrik & Timemark Digital</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Absensi Mandiri Santri
          </h2>
          <p
            className={`text-xs sm:text-sm transition-colors duration-500 ${
              isDark ? "text-gray-400" : "text-slate-600 font-medium"
            }`}
          >
            Validasi kehadiran harian Yayasan Pendidikan Islam (YPI) As Sa&apos;adah menggunakan sensor kamera & verifikasi stempel waktu.
          </p>
        </div>

        {/* Current status pill */}
        <div className="flex items-center gap-2">
          {studentData.hasCheckedInToday ? (
            <div className="flex items-center gap-2 bg-emerald-50 border border-emerald-200 text-emerald-800 px-4 py-2 rounded-2xl text-xs font-bold">
              <CheckCircle2 className="w-4 h-4 text-emerald-600" />
              <span>Sudah Hadir ({studentData.lastCheckInTime || "Tepat Waktu"})</span>
            </div>
          ) : (
            <div className="flex items-center gap-2 bg-amber-50 border border-amber-200 text-amber-900 px-4 py-2 rounded-2xl text-xs font-bold animate-pulse">
              <Clock className="w-4 h-4 text-[#ffbf00]" />
              <span>Menunggu Presensi Hari Ini</span>
            </div>
          )}
        </div>
      </div>

      {/* Main View: Camera Viewfinder + Timemark Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Column: Interactive Camera Viewfinder (7 cols) */}
        <div className="lg:col-span-7 space-y-4">
          <div className="relative rounded-3xl overflow-hidden bg-slate-950 border-2 border-slate-800 shadow-2xl aspect-[4/3] flex flex-col justify-between p-4">
            {/* Camera Video Simulation Preview */}
            {isCameraActive ? (
              <div className="absolute inset-0 z-0">
                {/* Simulated live camera stream */}
                <img
                  src={
                    currentUser?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=800&auto=format&fit=crop&q=80"
                  }
                  alt="Camera feed simulation"
                  className={`w-full h-full object-cover opacity-60 filter contrast-125 ${
                    cameraFacing === "user" ? "scale-x-[-1]" : ""
                  }`}
                />

                {/* Animated Scanner Laser */}
                {!studentData.hasCheckedInToday && (
                  <div className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-transparent via-[#ffbf00] to-transparent shadow-[0_0_15px_#ffbf00] animate-[bounce_3s_infinite]" />
                )}

                {/* Biometric Face Target Reticle */}
                <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                  <div className="relative w-52 h-64 border-2 border-dashed border-[#0cc0df]/70 rounded-3xl flex flex-col justify-between p-3">
                    {/* 4 corner brackets */}
                    <div className="absolute -top-1 -left-1 w-6 h-6 border-t-4 border-l-4 border-[#ffbf00] rounded-tl-lg" />
                    <div className="absolute -top-1 -right-1 w-6 h-6 border-t-4 border-r-4 border-[#ffbf00] rounded-tr-lg" />
                    <div className="absolute -bottom-1 -left-1 w-6 h-6 border-b-4 border-l-4 border-[#ffbf00] rounded-bl-lg" />
                    <div className="absolute -bottom-1 -right-1 w-6 h-6 border-b-4 border-r-4 border-[#ffbf00] rounded-br-lg" />

                    {/* Target tag */}
                    <div className="self-center bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-[#0cc0df]/40 text-[10px] font-bold text-[#0cc0df] flex items-center gap-1.5 shadow">
                      <ShieldCheck className="w-3 h-3 text-[#ffbf00]" />
                      <span>Biometrik: Terkunci (99.8%)</span>
                    </div>

                    <div className="self-center bg-slate-950/80 backdrop-blur-md px-3 py-1 rounded-full border border-emerald-500/40 text-[10px] font-bold text-emerald-300">
                      {currentUser?.name || "Raditya Pratama"}
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div className="absolute inset-0 z-0 flex flex-col items-center justify-center bg-slate-900 text-slate-400 p-6 text-center space-y-3">
                <Camera className="w-12 h-12 text-slate-600" />
                <p className="text-sm font-semibold text-slate-300">Kamera dinonaktifkan</p>
                <p className="text-xs text-slate-500">
                  Nyalakan kamera untuk melakukan verifikasi wajah dan stempel waktu presensi.
                </p>
                <button
                  onClick={() => setIsCameraActive(true)}
                  className="px-4 py-2 rounded-xl bg-[#0cc0df] text-white text-xs font-bold hover:bg-cyan-600 transition"
                >
                  Aktifkan Sensor Kamera
                </button>
              </div>
            )}

            {/* Top HUD bar */}
            <div className="relative z-10 flex items-center justify-between">
              <div className="bg-slate-950/70 backdrop-blur-md border border-white/10 px-3 py-1.5 rounded-xl flex items-center gap-2 text-white">
                <div className="w-2 h-2 rounded-full bg-emerald-400 animate-ping" />
                <span className="text-[11px] font-mono font-bold tracking-tight">
                  LIVE • {currentTimeStr || "Memuat waktu..."}
                </span>
              </div>

              <div className="flex items-center gap-1.5">
                <button
                  onClick={() => setCameraFacing(cameraFacing === "user" ? "environment" : "user")}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 backdrop-blur-md transition text-xs"
                  title="Putar Kamera"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setIsCameraActive(!isCameraActive)}
                  className="p-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-200 border border-white/10 backdrop-blur-md transition text-xs"
                  title="Toggle Kamera"
                >
                  <Camera className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Bottom HUD bar */}
            <div className="relative z-10 flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-slate-950/80 backdrop-blur-md border border-white/10 p-3 rounded-2xl text-xs text-slate-200">
              <div className="flex items-center gap-2">
                <MapPin className="w-4 h-4 text-[#ffbf00] shrink-0" />
                <span className="text-[11px]">
                  <strong>Geofence Radius:</strong> Kampus Terpadu YPI As Sa'adah (Valid &lt; 25m)
                </span>
              </div>
              <div className="flex items-center gap-2 self-end sm:self-auto">
                <span className="text-[10px] text-emerald-400 font-mono font-bold">
                  ● GPS AKURAT (±2m)
                </span>
              </div>
            </div>
          </div>

          {/* Action Trigger Button */}
          <div>
            {studentData.hasCheckedInToday ? (
              <div className="p-4 rounded-2xl bg-emerald-50 border-2 border-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500 text-white flex items-center justify-center font-bold shadow-md">
                    <CheckCircle2 className="w-6 h-6" />
                  </div>
                  <div>
                    <h4 className="text-sm font-extrabold text-emerald-950">
                      Presensi Berhasil Divalidasi Hari Ini!
                    </h4>
                    <p className="text-xs text-emerald-700">
                      Waktu Hadir: <strong>{studentData.lastCheckInTime}</strong> • Stempel Timemark Tersimpan
                    </p>
                  </div>
                </div>
                <span className="text-xs font-bold text-emerald-800 bg-emerald-100 px-3 py-1.5 rounded-xl border border-emerald-200">
                  +50 EXP Diperoleh
                </span>
              </div>
            ) : (
              <button
                disabled={isCapturing || !isCameraActive}
                onClick={handleCaptureTimemark}
                className="w-full py-4 px-6 rounded-2xl font-black text-sm text-slate-950 bg-[#ffbf00] hover:bg-[#e6ac00] active:scale-98 disabled:opacity-50 transition-all shadow-xl shadow-amber-500/25 flex items-center justify-center gap-3 group"
              >
                {isCapturing ? (
                  <>
                    <RefreshCw className="w-5 h-5 text-slate-950 animate-spin" />
                    <span>Merekam Biometrik & Stempel Waktu...</span>
                  </>
                ) : (
                  <>
                    <div className="w-7 h-7 rounded-xl bg-slate-950/10 flex items-center justify-center group-hover:rotate-12 transition-transform">
                      <Camera className="w-4 h-4 text-slate-950" />
                    </div>
                    <span>AMBIL FOTO & CATAT HADIR (TIMEMARK)</span>
                    <span className="text-xs font-bold bg-slate-950 text-[#ffbf00] px-2.5 py-1 rounded-lg ml-2">
                      +50 EXP & +15 Koin
                    </span>
                  </>
                )}
              </button>
            )}
          </div>
        </div>

        {/* Right Column: Digital Timemark Pass & Stats (5 cols) */}
        <div className="lg:col-span-5 space-y-5">
          {/* Card: Digital Timemark Pass / Certificate */}
          <div className="bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] p-[2px] rounded-3xl shadow-xl">
            <div className="bg-white rounded-[22px] p-6 space-y-4">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div className="flex items-center gap-2">
                  <FileCheck className="w-5 h-5 text-[#0cc0df]" />
                  <span className="text-xs font-extrabold uppercase tracking-wider text-slate-800">
                    Tiket Timemark Digital
                  </span>
                </div>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-amber-100 text-amber-900 border border-amber-300">
                  YPI As Sa'adah
                </span>
              </div>

              {/* Identity & Status */}
              <div className="flex items-center gap-3">
                <img
                  src={
                    currentUser?.avatar ||
                    "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
                  }
                  alt={currentUser?.name}
                  className="w-14 h-14 rounded-2xl object-cover border-2 border-[#0cc0df] shadow-sm"
                />
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-bold text-slate-900 truncate">
                    {currentUser?.name || "Raditya Pratama"}
                  </h4>
                  <p className="text-xs text-slate-500">
                    NIS: <strong className="text-slate-800">{currentUser?.identifier || "202409101"}</strong>
                  </p>
                  <p className="text-[11px] text-[#0cc0df] font-semibold truncate">
                    {currentUser?.grade || "Kelas 9 MTs As Sa'adah"}
                  </p>
                </div>
              </div>

              {/* Timemark Details */}
              <div className="p-3.5 bg-slate-50 rounded-2xl border border-slate-200 space-y-2 text-xs">
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Status Hadir:</span>
                  <span className="font-extrabold text-emerald-700 bg-emerald-100 px-2 py-0.5 rounded-md">
                    {studentData.hasCheckedInToday ? "Tepat Waktu" : "Belum Hadir"}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Stempel Jam:</span>
                  <strong className="text-slate-900 font-mono">
                    {studentData.lastCheckInTime || "Menunggu..."}
                  </strong>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-slate-500">Lokasi Presensi:</span>
                  <span className="font-semibold text-slate-700 text-right truncate max-w-[170px]">
                    Kampus YPI As Sa'adah
                  </span>
                </div>
                <div className="flex justify-between items-center border-t border-slate-200 pt-2">
                  <span className="text-slate-500">Kode Verifikasi:</span>
                  <span className="font-mono text-[11px] text-indigo-700 font-bold">
                    {timemarks[0]?.verificationCode || "VERIF-AS-9821-OK"}
                  </span>
                </div>
              </div>

              {/* Streak Info */}
              <div className="p-3 rounded-xl bg-amber-50 border border-amber-200 flex items-center justify-between text-xs">
                <div className="flex items-center gap-2">
                  <Flame className="w-4 h-4 text-[#ffbf00] fill-[#ffbf00]" />
                  <span className="text-amber-950 font-semibold">Streak Kehadiran:</span>
                </div>
                <strong className="text-amber-950 font-black">
                  {studentData.streakDays} Hari Berturut-turut
                </strong>
              </div>
            </div>
          </div>

          {/* Quick Rules Banner */}
          <div className="p-4 rounded-2xl bg-white border border-slate-200/80 shadow-xs space-y-2 text-xs text-slate-600">
            <div className="flex items-center gap-1.5 font-bold text-slate-900">
              <AlertCircle className="w-4 h-4 text-[#0cc0df]" />
              <span>Ketentuan Presensi Santri Yayasan</span>
            </div>
            <ul className="list-disc pl-4 space-y-1 text-[11px] text-slate-500">
              <li>Presensi pagi dibuka mulai pukul 06:30 hingga 07:30 WIB.</li>
              <li>Pastikan wajah tidak tertutup masker saat verifikasi biometrik.</li>
              <li>Setiap presensi tepat waktu memberikan tambahan +50 EXP & +15 Koin.</li>
            </ul>
          </div>
        </div>
      </div>

      {/* SECTION 2: Riwayat Presensi & Log Timemark */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2.5">
            <div className="w-8 h-8 rounded-xl bg-slate-900 text-[#ffbf00] flex items-center justify-center font-bold">
              <Calendar className="w-4 h-4 text-[#ffbf00]" />
            </div>
            <div>
              <h3 className="text-lg font-bold text-slate-900">
                Riwayat Log Presensi & Timemark
              </h3>
              <p className="text-xs text-slate-500">
                Daftar rekaman kehadiran lengkap dengan timestamp, foto snapshot, dan kode pengesahan.
              </p>
            </div>
          </div>
          <span className="text-xs font-semibold text-slate-500 bg-slate-100 px-3 py-1 rounded-full">
            {timemarks.length} Rekaman
          </span>
        </div>

        {/* Table / List */}
        <div className="bg-white rounded-2xl border border-slate-200 overflow-hidden shadow-xs">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-bold uppercase tracking-wider text-[10px]">
                <tr>
                  <th className="py-3.5 px-4">Foto Verifikasi</th>
                  <th className="py-3.5 px-4">Tanggal & Waktu</th>
                  <th className="py-3.5 px-4">Lokasi Presensi</th>
                  <th className="py-3.5 px-4">Status</th>
                  <th className="py-3.5 px-4">Kode Validasi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {timemarks.map((tmk) => (
                  <tr key={tmk.id} className="hover:bg-slate-50/60 transition">
                    <td className="py-3 px-4">
                      <div className="relative w-10 h-10 rounded-xl overflow-hidden border border-slate-200">
                        <img
                          src={tmk.photoSnapshotUrl}
                          alt="Snapshot"
                          className="w-full h-full object-cover"
                        />
                        <div className="absolute inset-0 bg-emerald-500/10" />
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="font-bold text-slate-900">{tmk.date}</div>
                      <div className="font-mono text-[11px] text-slate-500 flex items-center gap-1 mt-0.5">
                        <Clock className="w-3 h-3 text-[#0cc0df]" />
                        <span>{tmk.timestamp}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4 text-slate-700">
                      <div className="flex items-center gap-1.5">
                        <MapPin className="w-3.5 h-3.5 text-slate-400 shrink-0" />
                        <span className="truncate max-w-xs">{tmk.location}</span>
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-[11px] font-bold bg-emerald-100 text-emerald-800">
                        <CheckCircle2 className="w-3 h-3" />
                        <span>{tmk.status}</span>
                      </span>
                    </td>
                    <td className="py-3 px-4 font-mono font-bold text-slate-600 text-[11px]">
                      {tmk.verificationCode}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
}
