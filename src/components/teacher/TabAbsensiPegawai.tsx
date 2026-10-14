"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  Clock,
  CheckCircle2,
  AlertCircle,
  Calendar,
  Filter,
  Search,
  UserCheck,
  Building2,
  ShieldCheck,
  MapPin,
  ArrowDownRight,
  ArrowUpRight,
  Check,
  FileSpreadsheet,
} from "lucide-react";
import { StaffAttendanceRecord } from "@/types";
import ModulAbsensiLiveness from "@/components/teacher/ModulAbsensiLiveness";
import { Camera } from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";

export default function TabAbsensiPegawai() {
  const { currentUser, staffAttendance, clockInStaff, clockOutStaff } = useEduQuest();
  const [attendanceViewMode, setAttendanceViewMode] = useState<"liveness" | "recap">("liveness");
  const [clockInNotes, setClockInNotes] = useState("");
  const [actionNotice, setActionNotice] = useState<string | null>(null);

  // Filters for Kepsek / Operator / Yayasan
  const [unitFilter, setUnitFilter] = useState<string>("Semua");
  const [statusFilter, setStatusFilter] = useState<string>("Semua");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);

  const staffRole = currentUser?.staffRole || "guru";
  const userIdentifier = currentUser?.identifier || "";
  const isGuru = staffRole === "guru";
  const isKepsek = staffRole === "kepsek";
  const isOperator = staffRole === "operator";
  const isYayasan = staffRole === "yayasan";

  // Check if current user has clocked in today
  const todayStr = "20 September 2026";
  const safeAttendance = staffAttendance || [];
  const myRecordToday = safeAttendance.find(
    (rec) => rec && rec.staffNip === userIdentifier && (rec.date === todayStr || rec.date.includes("2026"))
  );
  const hasClockedInToday = !!myRecordToday;
  const hasClockedOutToday = !!myRecordToday?.clockOutTime;

  // Filter attendance records based on role
  let visibleRecords = safeAttendance;

  if (isGuru) {
    // Guru: ONLY sees their OWN attendance history
    visibleRecords = safeAttendance.filter((rec) => rec && rec.staffNip === userIdentifier);
  } else if (isKepsek) {
    // Kepsek: Sees own + teachers within their unit level (e.g. SD)
    const kepsekUnit = currentUser?.levelAssignment || "SD";
    visibleRecords = safeAttendance.filter(
      (rec) => rec && (rec.level === kepsekUnit || rec.staffNip === userIdentifier)
    );
  }

  // Apply search and unit/status filters for higher roles
  if (!isGuru) {
    if (unitFilter !== "Semua") {
      visibleRecords = visibleRecords.filter((rec) => rec && rec.level === unitFilter);
    }
    if (statusFilter !== "Semua") {
      visibleRecords = visibleRecords.filter((rec) => rec && rec.status === statusFilter);
    }
    const q = (debouncedSearchQuery || "").toLowerCase();
    if (q.trim()) {
      visibleRecords = visibleRecords.filter(
        (rec) =>
          rec &&
          (rec.staffName?.toLowerCase().includes(q) ||
            rec.staffNip?.toLowerCase().includes(q) ||
            rec.role?.toLowerCase().includes(q))
      );
    }
  }

  const handleClockIn = () => {
    const res = clockInStaff(clockInNotes);
    setActionNotice(res.message);
    setClockInNotes("");
    setTimeout(() => setActionNotice(null), 4000);
  };

  const handleClockOut = () => {
    const res = clockOutStaff();
    setActionNotice(res.message);
    setTimeout(() => setActionNotice(null), 4000);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-[#1a1a24] rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              {isGuru && "Presensi Mandiri Guru"}
              {isKepsek && "Rekapitulasi Presensi Unit " + (currentUser?.levelAssignment || "SD")}
              {isOperator && "Master Presensi Seluruh Pegawai YPI As Sa'adah"}
              {isYayasan && "Monitoring Kehadiran Global Yayasan"}
            </span>
            <span className="text-xs text-gray-400 font-medium">Sistem ERP Terpadu</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5">
            Absensi Pegawai & Pendidik
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            {isGuru && "Catat kehadiran harian masuk dan pulang mengajar secara mandiri sesuai jam kerja YPI As Sa'adah."}
            {isKepsek && `Pantau kehadiran dewan guru unit ${currentUser?.levelAssignment || "SD"} serta lakukan presensi mandiri.`}
            {isOperator && "Kelola dan verifikasi presensi seluruh pegawai lintas unit (RA, SD, MTs) secara terpusat."}
            {isYayasan && "Supervisi komprehensif tingkat disiplin dan kehadiran seluruh pendidik dan tenaga kependidikan yayasan."}
          </p>
        </div>

        {/* Action notification toast */}
        {actionNotice && (
          <div className="bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            <span>{actionNotice}</span>
          </div>
        )}
      </div>

      {/* View Mode Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-[#14141d] border border-white/10 shadow-lg">
        <button
          onClick={() => setAttendanceViewMode("liveness")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            attendanceViewMode === "liveness"
              ? "bg-gradient-to-r from-cyan-400 to-teal-500 text-black shadow-lg shadow-cyan-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <Camera className="w-4 h-4" />
          <span>1. Kamera Presensi Wajah Guru</span>
        </button>

        <button
          onClick={() => setAttendanceViewMode("recap")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            attendanceViewMode === "recap"
              ? "bg-gradient-to-r from-purple-500 to-indigo-600 text-white shadow-lg shadow-purple-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <FileSpreadsheet className="w-4 h-4" />
          <span>2. {isGuru ? "Riwayat Presensi Saya" : "Buku Induk & Rekap Presensi"}</span>
        </button>
      </div>

      {attendanceViewMode === "liveness" ? (
        <ModulAbsensiLiveness />
      ) : (
        <>
          {/* Clock In / Out Panel (Shown for Guru & Kepsek) */}
          {(isGuru || isKepsek) && (
        <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 border border-white/10 text-white shadow-xl backdrop-blur-md">
          <div className="flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
            <div className="space-y-1">
              <div className="flex items-center gap-2 text-xs font-semibold text-[#ffbf00]">
                <Clock className="w-4 h-4" />
                <span>Mesin Presensi Digital • Minggu, 20 September 2026</span>
              </div>
              <h2 className="text-lg font-bold text-white">
                Presensi Mandiri: {currentUser?.name}
              </h2>
              <p className="text-xs text-gray-400">
                Lokasi: Kampus Utama YPI As Sa'adah (Geolokasi Terverifikasi IP Internal)
              </p>
            </div>

            <div className="flex flex-wrap items-center gap-3">
              {/* Status Hari Ini */}
              <div className="bg-[#12121a] border border-white/10 px-4 py-2.5 rounded-xl text-xs">
                <span className="text-gray-400 block text-[10px]">Status Hari Ini:</span>
                <span className="font-bold text-[#ffbf00]">
                  {hasClockedOutToday
                    ? "Selesai (Sudah Clock Out)"
                    : hasClockedInToday
                    ? `Clock In: ${myRecordToday?.clockInTime} WIB`
                    : "Belum Melakukan Presensi"}
                </span>
              </div>

              {/* Action Buttons */}
              {!hasClockedInToday ? (
                <div className="flex items-center gap-2">
                  <input
                    type="text"
                    placeholder="Catatan tugas / mengajar..."
                    value={clockInNotes}
                    onChange={(e) => setClockInNotes(e.target.value)}
                    className="bg-[#12121a] border border-white/10 text-white placeholder:text-gray-500 text-xs px-3 py-2 rounded-xl focus:outline-hidden focus:border-[#ffbf00]"
                  />
                  <button
                    onClick={handleClockIn}
                    className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#ffbf00] hover:bg-[#e6ac00] text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
                  >
                    <ArrowDownRight className="w-4 h-4" />
                    <span>Clock In (Masuk)</span>
                  </button>
                </div>
              ) : !hasClockedOutToday ? (
                <button
                  onClick={handleClockOut}
                  className="flex items-center gap-2 px-5 py-2.5 rounded-xl text-xs font-bold bg-[#0cc0df] hover:bg-[#0aa6c2] text-slate-950 shadow-md transition-all active:scale-95 cursor-pointer"
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Clock Out (Pulang)</span>
                </button>
              ) : (
                <div className="px-4 py-2 rounded-xl bg-emerald-500/20 border border-emerald-500/40 text-emerald-300 text-xs font-bold flex items-center gap-1.5">
                  <Check className="w-4 h-4 text-emerald-400" />
                  <span>Presensi Hari Ini Lengkap ({myRecordToday.clockInTime} - {myRecordToday.clockOutTime})</span>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Summary Metric Cards for Higher Roles */}
      {!isGuru && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Total Pegawai Terdata</span>
            <div className="text-2xl font-black text-white mt-1">42 Pendidik</div>
            <span className="text-[11px] text-emerald-400 font-semibold mt-1 block">Lintas RA, SD, & MTs</span>
          </div>
          <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Tingkat Hadir Hari Ini</span>
            <div className="text-2xl font-black text-emerald-400 mt-1">98.4%</div>
            <span className="text-[11px] text-gray-400 font-semibold mt-1 block">41 Tepat Waktu / Hadir</span>
          </div>
          <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Terlambat / Izin</span>
            <div className="text-2xl font-black text-amber-400 mt-1">1 Pegawai</div>
            <span className="text-[11px] text-amber-300 font-semibold mt-1 block">1 Surat Izin Resmi</span>
          </div>
          <div className="bg-[#1a1a24] p-4 rounded-2xl border border-white/10 shadow-xl backdrop-blur-md hover:border-white/20 transition-all">
            <span className="text-[11px] font-bold text-gray-400 uppercase tracking-wider">Status Sinkronisasi</span>
            <div className="text-2xl font-black text-[#0cc0df] mt-1">Terhubung</div>
            <span className="text-[11px] text-gray-400 font-semibold mt-1 block">Server ERP YPI As Sa'adah</span>
          </div>
        </div>
      )}

      {/* Attendance History & Recap Table */}
      <div className="bg-[#1a1a24] rounded-2xl border border-white/10 shadow-xl backdrop-blur-md overflow-hidden">
        {/* Table Header & Filters */}
        <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div>
            <h3 className="font-bold text-base text-white">
              {isGuru ? "Riwayat Presensi Saya" : isKepsek ? `Rekap Presensi Dewan Guru Unit ${currentUser?.levelAssignment || "SD"}` : "Buku Induk Presensi Pegawai Yayasan"}
            </h3>
            <p className="text-xs text-gray-400">
              {isGuru
                ? "Daftar jam masuk, jam pulang, dan catatan tugas Anda."
                : "Monitoring real-time kedisiplinan dan kepatuhan jam kerja."}
            </p>
          </div>

          {/* Filter Toolbar for Non-Guru */}
          {!isGuru && (
            <div className="flex flex-wrap items-center gap-2.5 w-full md:w-auto">
              {/* Search */}
              <div className="relative flex-1 sm:w-48">
                <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari nama / NIP..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full bg-[#12121a] border border-white/10 pl-8 pr-3 py-1.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-[#0cc0df]"
                />
              </div>

              {/* Unit Filter (Operator & Yayasan only) */}
              {(isOperator || isYayasan) && (
                <select
                  value={unitFilter}
                  onChange={(e) => setUnitFilter(e.target.value)}
                  className="bg-[#12121a] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-[#0cc0df]"
                >
                  <option value="Semua">Semua Unit</option>
                  <option value="RA">Unit RA</option>
                  <option value="SD">Unit SD</option>
                  <option value="MTs">Unit MTs</option>
                </select>
              )}

              {/* Status Filter */}
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="bg-[#12121a] border border-white/10 px-3 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-[#0cc0df]"
              >
                <option value="Semua">Semua Status</option>
                <option value="Hadir Tepat Waktu">Hadir Tepat Waktu</option>
                <option value="Terlambat">Terlambat</option>
                <option value="Izin">Izin</option>
                <option value="Cuti">Cuti</option>
              </select>
            </div>
          )}
        </div>

        {/* Data Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#12121a]/80 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[11px]">
                <th className="py-3 px-4">Tanggal</th>
                <th className="py-3 px-4">Pegawai / Guru</th>
                <th className="py-3 px-4">Unit & Peran</th>
                <th className="py-3 px-4">Jam Masuk</th>
                <th className="py-3 px-4">Jam Pulang</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4">Catatan / Tugas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 font-medium text-gray-300">
              {visibleRecords.length === 0 ? (
                <tr>
                  <td colSpan={7} className="py-8 text-center text-gray-400">
                    Tidak ada catatan presensi yang sesuai kriteria.
                  </td>
                </tr>
              ) : (
                visibleRecords.map((record) => {
                  const isLate = record.status === "Terlambat";
                  const isHadir = record.status === "Hadir Tepat Waktu";
                  const isIzin = record.status === "Izin";

                  return (
                    <tr key={record.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3.5 px-4 font-semibold text-white whitespace-nowrap">
                        {record.date}
                      </td>
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-white">{record.staffName}</div>
                        <div className="text-[10px] text-gray-400">NIP: {record.staffNip}</div>
                      </td>
                      <td className="py-3.5 px-4">
                        <span className="inline-flex items-center px-2 py-0.5 rounded-md text-[10px] font-bold bg-white/5 text-gray-300 border border-white/10">
                          {record.level} • {record.role}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 font-mono font-bold text-white whitespace-nowrap">
                        {record.clockInTime || "-"}
                      </td>
                      <td className="py-3.5 px-4 font-mono text-gray-400 whitespace-nowrap">
                        {record.clockOutTime || (record.clockInTime ? "Sedang Bertugas" : "-")}
                      </td>
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`px-2.5 py-1 rounded-full text-[10px] font-bold inline-flex items-center gap-1 ${
                            isHadir
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/40"
                              : isLate
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/40"
                              : isIzin
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/40"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/40"
                          }`}
                        >
                          <span
                            className={`w-1.5 h-1.5 rounded-full ${
                              isHadir
                                ? "bg-emerald-400"
                                : isLate
                                ? "bg-amber-400"
                                : isIzin
                                ? "bg-blue-400"
                                : "bg-rose-400"
                            }`}
                          />
                          {record.status}
                        </span>
                      </td>
                      <td className="py-3.5 px-4 text-gray-400 max-w-xs truncate">
                        {record.notes || "-"}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Footer */}
        <div className="p-4 bg-[#12121a]/80 border-t border-white/10 flex items-center justify-between text-xs text-gray-400">
          <span>Menampilkan {visibleRecords.length} catatan presensi</span>
          <span className="font-semibold text-gray-300">YPI As Sa'adah ERP Attendance Engine v2.4</span>
        </div>
      </div>
      </>
      )}
    </div>
  );
}
