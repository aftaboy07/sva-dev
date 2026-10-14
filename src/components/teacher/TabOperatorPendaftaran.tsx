"use client";

import React, { useState } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  UserPlus,
  Search,
  CheckCircle2,
  AlertTriangle,
  User,
  Hash,
  Layers,
  Phone,
  ShieldCheck,
} from "lucide-react";
import { NewUserRegistration } from "@/types";

export default function TabOperatorPendaftaran() {
  const { registeredUsers, registerNewUser } = useEduQuest();

  const [formData, setFormData] = useState<NewUserRegistration>({
    name: "",
    identifier: "",
    role: "student",
    levelAssignment: "SD",
    phone: "",
    gradeOrSubject: "Kelas 5 SD",
  });

  const [notification, setNotification] = useState<{ type: "success" | "error"; message: string } | null>(null);
  const [searchFilter, setSearchFilter] = useState("");
  const [roleFilter, setRoleFilter] = useState("Semua");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim() || !formData.identifier.trim()) {
      setNotification({ type: "error", message: "Harap isi Nama Lengkap dan NIS/NIP!" });
      return;
    }

    const res = registerNewUser(formData);
    if (res.success) {
      setNotification({ type: "success", message: res.message });
      setFormData({
        name: "",
        identifier: "",
        role: "student",
        levelAssignment: "SD",
        phone: "",
        gradeOrSubject: "Kelas 5 SD",
      });
      setTimeout(() => setNotification(null), 5000);
    } else {
      setNotification({ type: "error", message: res.message });
    }
  };

  const filteredUsers = registeredUsers.filter((u) => {
    const matchesSearch =
      u.name.toLowerCase().includes(searchFilter.toLowerCase()) ||
      u.identifier.toLowerCase().includes(searchFilter.toLowerCase());

    const matchesRole =
      roleFilter === "Semua" ||
      (roleFilter === "student" && u.role === "student" && u.studentType !== "les") ||
      (roleFilter === "tutoring" && (u.role === "tutoring" || u.studentType === "les")) ||
      (roleFilter === "teacher" && u.role === "teacher") ||
      (roleFilter === "kepsek" && (u.role === "kepsek" || u.staffRole === "kepsek"));

    return matchesSearch && matchesRole;
  });

  return (
    <div className="space-y-6 text-white">
      {/* Header Banner */}
      <div className="bg-[#1a1a24] rounded-2xl p-6 border border-white/10 shadow-xl backdrop-blur-md flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-[#ffbf00] text-slate-950 border border-amber-300">
              Modul Operator SIM
            </span>
            <span className="text-xs text-gray-400 font-medium">Database Tertutup YPI As Sa'adah</span>
          </div>
          <h1 className="text-2xl font-black text-white tracking-tight mt-1.5">
            Pendaftaran Akun Pengguna
          </h1>
          <p className="text-xs text-gray-400 mt-1 max-w-2xl">
            Registrasi akun resmi warga yayasan: Siswa Yayasan, Anak Les Bimbel, Guru Pengampu, dan Kepala Sekolah.
          </p>
        </div>

        {notification && (
          <div
            className={`px-4 py-2.5 rounded-xl text-xs font-bold flex items-center gap-2 shadow-lg animate-in fade-in ${
              notification.type === "success"
                ? "bg-emerald-500/20 border border-emerald-500/40 text-emerald-300"
                : "bg-rose-500/20 border border-rose-500/40 text-rose-300"
            }`}
          >
            {notification.type === "success" ? (
              <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
            ) : (
              <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
            )}
            <span>{notification.message}</span>
          </div>
        )}
      </div>

      {/* Main Content Grid: Form (Left) & Directory (Right) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        {/* Registration Form */}
        <div className="lg:col-span-5 bg-[#1a1a24] rounded-2xl border border-white/10 shadow-xl backdrop-blur-md p-6">
          <div className="flex items-center gap-2.5 pb-4 border-b border-white/10 mb-5">
            <div className="w-9 h-9 rounded-xl bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] flex items-center justify-center text-white shadow-md border border-white/10">
              <UserPlus className="w-4 h-4 text-[#ffbf00]" />
            </div>
            <div>
              <h2 className="font-bold text-sm text-white">Formulir Pendaftaran Akun</h2>
              <p className="text-[11px] text-gray-400">Isi data akun baru untuk akses portal</p>
            </div>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Field: Nama Lengkap */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Nama Lengkap & Gelar *
              </label>
              <div className="relative">
                <User className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: Muhammad Farhan / Ustadz Ridwan"
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full bg-[#12121a] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-hidden focus:border-[#0cc0df]"
                />
              </div>
            </div>

            {/* Field: NIS / NIP */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                NIS / NIP / Nomor Induk *
              </label>
              <div className="relative">
                <Hash className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  required
                  placeholder="Contoh: 20260901 atau 1985031201"
                  value={formData.identifier}
                  onChange={(e) => setFormData({ ...formData, identifier: e.target.value })}
                  className="w-full bg-[#12121a] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs font-mono font-bold text-white placeholder-gray-500 focus:outline-hidden focus:border-[#0cc0df]"
                />
              </div>
            </div>

            {/* Field: Role Dropdown (Siswa Yayasan, Anak Les, Guru, Kepsek) */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Role Pengguna *
              </label>
              <select
                value={formData.role}
                onChange={(e) => {
                  const newRole = e.target.value as any;
                  setFormData({
                    ...formData,
                    role: newRole,
                    gradeOrSubject:
                      newRole === "student"
                        ? "Kelas 5 SD"
                        : newRole === "tutoring"
                        ? "Les Bimbel Intensif MTs"
                        : newRole === "teacher"
                        ? "Guru Mata Pelajaran"
                        : "Kepala Sekolah Unit",
                  });
                }}
                className="w-full bg-[#12121a] border border-white/10 px-3 py-2 rounded-xl text-xs font-bold text-white focus:outline-hidden focus:border-[#0cc0df]"
              >
                <option value="student">Siswa Yayasan (Reguler Full Day)</option>
                <option value="tutoring">Anak Les (Bimbel Privat As Sa'adah)</option>
                <option value="teacher">Guru (Pendidik Pengampu)</option>
                <option value="kepsek">Kepsek (Kepala Sekolah Unit)</option>
              </select>
            </div>

            {/* Field: Unit Penugasan */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Unit Pendidikan YPI As Sa'adah *
              </label>
              <div className="grid grid-cols-4 gap-2">
                {(["RA", "SD", "MTs", "Semua"] as const).map((unit) => (
                  <button
                    key={unit}
                    type="button"
                    onClick={() => setFormData({ ...formData, levelAssignment: unit })}
                    className={`py-2 rounded-xl text-xs font-bold border transition-all cursor-pointer ${
                      formData.levelAssignment === unit
                        ? "bg-[#ffbf00] text-slate-950 border-[#ffbf00] shadow-sm"
                        : "bg-[#12121a] text-gray-300 border-white/10 hover:bg-white/5"
                    }`}
                  >
                    {unit}
                  </button>
                ))}
              </div>
            </div>

            {/* Field: Keterangan Kelas / Penugasan */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                Kelas / Rombel / Bidang Tugas
              </label>
              <div className="relative">
                <Layers className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="Contoh: Kelas 9 MTs (Fase D) / Guru PAI"
                  value={formData.gradeOrSubject}
                  onChange={(e) => setFormData({ ...formData, gradeOrSubject: e.target.value })}
                  className="w-full bg-[#12121a] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-hidden focus:border-[#0cc0df]"
                />
              </div>
            </div>

            {/* Field: WhatsApp / Kontak */}
            <div>
              <label className="block text-xs font-bold text-gray-300 mb-1.5">
                No. WhatsApp / Kontak Orang Tua
              </label>
              <div className="relative">
                <Phone className="w-4 h-4 absolute left-3 top-2.5 text-gray-500" />
                <input
                  type="text"
                  placeholder="0812-xxxx-xxxx"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  className="w-full bg-[#12121a] border border-white/10 pl-9 pr-3 py-2 rounded-xl text-xs font-medium text-white placeholder-gray-500 focus:outline-hidden focus:border-[#0cc0df]"
                />
              </div>
            </div>

            {/* Submit Button with exact gradient */}
            <button
              type="submit"
              className="w-full mt-2 py-3 rounded-xl bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white font-bold text-xs shadow-lg hover:opacity-95 transition-all flex items-center justify-center gap-2 cursor-pointer border border-white/10"
            >
              <UserPlus className="w-4 h-4 text-[#ffbf00]" />
              <span>Daftarkan Akun Pengguna</span>
            </button>
          </form>
        </div>

        {/* Registered Directory Table */}
        <div className="lg:col-span-7 bg-[#1a1a24] rounded-2xl border border-white/10 shadow-xl backdrop-blur-md overflow-hidden flex flex-col">
          <div className="p-4 sm:p-5 border-b border-white/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
            <div>
              <h3 className="font-bold text-sm text-white">
                Direktori Pengguna Terdaftar ({filteredUsers.length})
              </h3>
              <p className="text-[11px] text-gray-400">Akun terverifikasi dalam database tertutup</p>
            </div>

            <div className="flex items-center gap-2 w-full sm:w-auto">
              <div className="relative flex-1 sm:w-40">
                <Search className="w-3.5 h-3.5 absolute left-2.5 top-2 text-gray-400" />
                <input
                  type="text"
                  placeholder="Cari user / NIS..."
                  value={searchFilter}
                  onChange={(e) => setSearchFilter(e.target.value)}
                  className="w-full bg-[#12121a] border border-white/10 pl-8 pr-2.5 py-1.5 rounded-xl text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-[#0cc0df]"
                />
              </div>

              <select
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="bg-[#12121a] border border-white/10 px-2.5 py-1.5 rounded-xl text-xs font-semibold text-white focus:outline-hidden focus:border-[#0cc0df]"
              >
                <option value="Semua">Semua Role</option>
                <option value="student">Siswa Yayasan</option>
                <option value="tutoring">Anak Les</option>
                <option value="teacher">Guru</option>
                <option value="kepsek">Kepsek</option>
              </select>
            </div>
          </div>

          <div className="overflow-x-auto flex-1">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-[#12121a]/80 border-b border-white/10 text-gray-400 font-bold uppercase tracking-wider text-[10px]">
                  <th className="py-2.5 px-4">Pengguna</th>
                  <th className="py-2.5 px-4">NIS / NIP</th>
                  <th className="py-2.5 px-4">Peran & Unit</th>
                  <th className="py-2.5 px-4">Rombel / Penugasan</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium text-gray-300">
                {filteredUsers.map((u) => {
                  const isSiswa = u.role === "student" && u.studentType !== "les";
                  const isLes = u.role === "tutoring" || u.studentType === "les";
                  const isTeacher = u.role === "teacher" && u.staffRole === "guru";
                  const isKepsek = u.role === "kepsek" || u.staffRole === "kepsek";

                  return (
                    <tr key={u.id} className="hover:bg-white/5 transition-colors">
                      <td className="py-3 px-4">
                        <div className="flex items-center gap-2.5">
                          <img
                            src={u.avatar}
                            alt={u.name}
                            className="w-7 h-7 rounded-full object-cover ring-1 ring-white/20"
                          />
                          <span className="font-bold text-white block">{u.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4 font-mono font-semibold text-gray-300 text-[11px]">
                        {u.identifier}
                      </td>
                      <td className="py-3 px-4">
                        <span
                          className={`inline-block px-2 py-0.5 rounded-md text-[10px] font-bold ${
                            isSiswa
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : isLes
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : isTeacher
                              ? "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                              : isKepsek
                              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/30"
                              : "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          }`}
                        >
                          {isSiswa
                            ? "Siswa Yayasan"
                            : isLes
                            ? "Anak Les"
                            : isTeacher
                            ? "Guru"
                            : isKepsek
                            ? "Kepsek"
                            : "Operator"}
                          {" • "}
                          {u.levelAssignment || "Semua"}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-gray-400">
                        {u.schoolOrSubject || u.grade || "-"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <div className="p-3 bg-[#12121a]/80 border-t border-white/10 text-[11px] text-gray-400 flex justify-between">
            <span>Menampilkan {filteredUsers.length} pengguna terverifikasi</span>
            <span className="font-semibold text-gray-300">YPI As Sa'adah Database</span>
          </div>
        </div>
      </div>
    </div>
  );
}
