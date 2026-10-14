"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { StudentMonitoringRecord } from "@/types";
import DebouncedSearchInput from "@/components/common/DebouncedSearchInput";
import {
  Users,
  Search,
  Filter,
  CheckCircle2,
  AlertTriangle,
  FileEdit,
  Sparkles,
  BookOpen,
  CalendarCheck,
  GraduationCap,
} from "lucide-react";

export default function TabPantauSiswa() {
  const { studentRecords, updateStudentNote } = useEduQuest();

  const [searchQuery, setSearchQuery] = useState("");
  const [filterType, setFilterType] = useState<"ALL" | "INTERVENTION" | "LOW_ATTENDANCE">("ALL");
  const [selectedStudentForNote, setSelectedStudentForNote] = useState<StudentMonitoringRecord | null>(null);
  const [noteInput, setNoteInput] = useState("");
  const [interventionCheckbox, setInterventionCheckbox] = useState(false);

  const safeRecords = studentRecords || [];

  const filteredStudents = safeRecords.filter((student) => {
    if (!student) return false;
    const nameMatch = student.name?.toLowerCase().includes((searchQuery || "").toLowerCase()) || false;
    const nisMatch = student.nis ? student.nis.includes(searchQuery || "") : false;
    const matchSearch = nameMatch || nisMatch;

    if (filterType === "INTERVENTION") {
      return matchSearch && !!student.needsIntervention;
    }
    if (filterType === "LOW_ATTENDANCE") {
      return matchSearch && (student.attendanceRate ?? 100) < 85;
    }
    return matchSearch;
  });

  const handleOpenNoteModal = (student: StudentMonitoringRecord) => {
    setSelectedStudentForNote(student);
    setNoteInput(student.notes || "");
    setInterventionCheckbox(student.needsIntervention);
  };

  const handleSaveNote = () => {
    if (selectedStudentForNote) {
      updateStudentNote(selectedStudentForNote.id, noteInput, interventionCheckbox);
      setSelectedStudentForNote(null);
    }
  };

  return (
    <div className="space-y-8 text-white">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 text-xs font-semibold mb-2">
            <Users className="w-3.5 h-3.5" />
            <span>Rekam Akademik Terintegrasi</span>
          </div>
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Pantau Progres & Diagnostik Siswa
          </h2>
          <p className="text-xs sm:text-sm text-gray-400">
            Daftar perkembangan capaian kurikulum, rekam absensi QR, dan status tindak lanjut bimbingan remedial.
          </p>
        </div>

        {/* Debounced Search */}
        <div className="w-full sm:w-72">
          <DebouncedSearchInput
            value={searchQuery}
            onChange={setSearchQuery}
            placeholder="Cari nama atau NIS siswa..."
          />
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2">
        <button
          onClick={() => setFilterType("ALL")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            filterType === "ALL"
              ? "bg-white/20 text-white border border-white/30"
              : "bg-[#1a1a24] border border-white/10 text-gray-400 hover:bg-white/5 hover:text-white"
          }`}
        >
          Semua Siswa ({studentRecords.length})
        </button>
        <button
          onClick={() => setFilterType("INTERVENTION")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 cursor-pointer ${
            filterType === "INTERVENTION"
              ? "bg-rose-500/30 text-rose-200 border border-rose-500/50"
              : "bg-[#1a1a24] border border-white/10 text-rose-400 hover:bg-rose-500/10"
          }`}
        >
          <AlertTriangle className="w-3.5 h-3.5" />
          <span>Perlu Remedial ({studentRecords.filter((s) => s.needsIntervention).length})</span>
        </button>
        <button
          onClick={() => setFilterType("LOW_ATTENDANCE")}
          className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition cursor-pointer ${
            filterType === "LOW_ATTENDANCE"
              ? "bg-amber-500/30 text-amber-200 border border-amber-500/50"
              : "bg-[#1a1a24] border border-white/10 text-amber-400 hover:bg-amber-500/10"
          }`}
        >
          Kehadiran &lt; 85%
        </button>
      </div>

      {/* Searchable Student Records Table */}
      <div className="bg-[#1a1a24]/80 rounded-2xl border border-white/10 overflow-hidden shadow-xl backdrop-blur-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-gray-300">
            <thead className="bg-[#12121a]/80 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
              <tr>
                <th className="py-4 px-6">Identitas Siswa</th>
                <th className="py-4 px-4">Tingkat Kehadiran</th>
                <th className="py-4 px-4">Progres Modul</th>
                <th className="py-4 px-4">Rata-rata Nilai</th>
                <th className="py-4 px-4">Tugas Masuk</th>
                <th className="py-4 px-4">Status & Catatan Tutor</th>
                <th className="py-4 px-6 text-right">Tindakan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredStudents.map((student) => {
                const isNeedHelp = student.needsIntervention;
                return (
                  <tr
                    key={student.id}
                    className="hover:bg-white/5 transition-colors"
                  >
                    {/* Student Info */}
                    <td className="py-4 px-6">
                      <div className="flex items-center gap-3">
                        <img
                          src={student.avatar}
                          alt={student.name}
                          className="w-10 h-10 rounded-xl object-cover ring-1 ring-white/20"
                        />
                        <div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-bold text-white block text-sm">
                              {student.name}
                            </span>
                            <span
                              className={`text-[9px] font-extrabold px-1.5 py-0.5 rounded ${
                                student.studentType === "les"
                                  ? "bg-amber-500/20 text-amber-300 border border-[#ffbf00]/40"
                                  : "bg-cyan-500/20 text-cyan-300 border border-[#0cc0df]/40"
                              }`}
                            >
                              {student.studentType === "les" ? "Anak Les" : "Siswa Yayasan"}
                            </span>
                          </div>
                          <span className="text-[11px] text-gray-400 font-medium">
                            NIS: {student.nis} • {student.grade}
                          </span>
                        </div>
                      </div>
                    </td>

                    {/* Attendance Rate */}
                    <td className="py-4 px-4">
                      <div className="flex items-center gap-2">
                        <span
                          className={`font-black text-xs px-2 py-0.5 rounded-md ${
                            student.attendanceRate >= 90
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : student.attendanceRate >= 80
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                          }`}
                        >
                          {student.attendanceRate}%
                        </span>
                      </div>
                    </td>

                    {/* Learning Progress Bar */}
                    <td className="py-4 px-4 w-44">
                      <div className="space-y-1">
                        <div className="flex justify-between text-[11px] font-semibold text-gray-300">
                          <span>Capaian</span>
                          <span className="font-bold text-blue-400">
                            {student.learningProgress}%
                          </span>
                        </div>
                        <div className="w-full bg-white/10 h-2 rounded-full overflow-hidden">
                          <div
                            className="bg-blue-500 h-full rounded-full transition-all"
                            style={{ width: `${student.learningProgress}%` }}
                          />
                        </div>
                      </div>
                    </td>

                    {/* Average Score */}
                    <td className="py-4 px-4">
                      <span
                        className={`text-xs font-black px-2.5 py-1 rounded-lg ${
                          student.averageScore >= 85
                            ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                            : student.averageScore >= 70
                            ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                            : "bg-rose-500/20 text-rose-300 border border-rose-500/30 font-extrabold"
                        }`}
                      >
                        {student.averageScore} / 100
                      </span>
                    </td>

                    {/* Tasks Submitted */}
                    <td className="py-4 px-4">
                      <span className="text-xs font-semibold text-gray-300">
                        {student.tasksSubmitted} dari {student.tasksTotal} Selesai
                      </span>
                    </td>

                    {/* Notes & Needs Intervention Tag */}
                    <td className="py-4 px-4 max-w-xs">
                      {isNeedHelp && (
                        <span className="inline-flex items-center gap-1 text-[10px] font-bold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded mb-1">
                          <AlertTriangle className="w-3 h-3" />
                          Perlu Remedial
                        </span>
                      )}
                      <p className="text-[11px] text-gray-400 truncate">
                        {student.notes || "Belum ada catatan khusus."}
                      </p>
                    </td>

                    {/* Action Button */}
                    <td className="py-4 px-6 text-right">
                      <button
                        onClick={() => handleOpenNoteModal(student)}
                        className="p-2 rounded-xl text-xs font-semibold text-blue-300 bg-blue-500/20 hover:bg-blue-500/30 border border-blue-500/30 transition inline-flex items-center gap-1 cursor-pointer"
                        title="Beri Catatan Perkembangan"
                      >
                        <FileEdit className="w-3.5 h-3.5" />
                        <span>Catatan</span>
                      </button>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>

      {/* Note / Intervention Action Modal */}
      {selectedStudentForNote && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#1a1a24] rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl space-y-5 border border-white/10 text-white animate-scale-up">
            <div className="flex items-start justify-between border-b border-white/10 pb-3">
              <div>
                <span className="text-xs font-bold text-blue-300 bg-blue-500/20 border border-blue-500/30 px-2.5 py-0.5 rounded">
                  Rekam Tindak Lanjut Guru
                </span>
                <h3 className="text-lg font-bold text-white mt-1">
                  Catatan Perkembangan: {selectedStudentForNote.name}
                </h3>
              </div>
              <button
                onClick={() => setSelectedStudentForNote(null)}
                className="text-gray-400 hover:text-white p-1 cursor-pointer"
              >
                ✕
              </button>
            </div>

            <div className="space-y-4">
              <div>
                <label className="block text-xs font-semibold text-gray-300 mb-1">
                  Catatan Refleksi & Kendala Belajar Siswa
                </label>
                <textarea
                  rows={4}
                  value={noteInput}
                  onChange={(e) => setNoteInput(e.target.value)}
                  placeholder="Tulis evaluasi pemahaman konsep atau rekomendasi tugas tambahan..."
                  className="w-full p-3 rounded-xl border border-white/10 text-xs text-white focus:border-blue-500 bg-[#12121a] focus:bg-[#151520] placeholder-gray-500 focus:outline-hidden"
                />
              </div>

              <div className="flex items-center gap-2 p-3 bg-amber-500/10 rounded-xl border border-amber-500/30 text-xs">
                <input
                  type="checkbox"
                  id="interventionCheck"
                  checked={interventionCheckbox}
                  onChange={(e) => setInterventionCheckbox(e.target.checked)}
                  className="w-4 h-4 text-rose-500 focus:ring-rose-500 rounded cursor-pointer"
                />
                <label
                  htmlFor="interventionCheck"
                  className="font-bold text-amber-300 cursor-pointer"
                >
                  Tandai siswa ini membutuhkan kelas pendampingan intensif / remedial
                </label>
              </div>

              <div className="pt-2 flex justify-end gap-2">
                <button
                  onClick={() => setSelectedStudentForNote(null)}
                  className="px-4 py-2 rounded-xl text-xs font-semibold text-gray-300 hover:bg-white/10 border border-white/10 cursor-pointer transition"
                >
                  Batal
                </button>
                <button
                  onClick={handleSaveNote}
                  className="px-5 py-2 rounded-xl text-xs font-bold text-white bg-blue-600 hover:bg-blue-500 shadow-md shadow-blue-600/20 cursor-pointer transition"
                >
                  Simpan Catatan Guru
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
