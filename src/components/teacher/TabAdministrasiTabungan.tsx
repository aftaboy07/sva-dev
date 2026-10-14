"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  PiggyBank,
  Search,
  Calendar,
  Printer,
  Download,
  Eye,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  UserCheck,
  CreditCard,
  X,
  FileSpreadsheet,
  Coins,
  ChevronDown,
  Clock,
  Sparkles,
  ArrowRightLeft,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MasterStudentFeeRecord,
  getSavedMasterStudentFees,
  getMonthlyStudentSavingsRecap,
  MonthlyStudentSavingsSummary,
  calculateStudentSavingsBalance,
} from "@/data/studentFeeMaster";

interface TabAdministrasiTabunganProps {
  setActiveTab?: (tab: string) => void;
}

export default function TabAdministrasiTabungan({
  setActiveTab,
}: TabAdministrasiTabunganProps) {
  const { financeTransactions, currentUser } = useEduQuest();

  // Master Students State
  const [masterStudents, setMasterStudents] = useState<MasterStudentFeeRecord[]>([]);

  useEffect(() => {
    setMasterStudents(getSavedMasterStudentFees());
  }, []);

  // Filter States
  const [selectedYearMonth, setSelectedYearMonth] = useState<string>("2026-10");
  const [searchQuery, setSearchQuery] = useState<string>("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [unitFilter, setUnitFilter] = useState<string>("ALL");

  // Passbook Detail Modal State
  const [activePassbookStudent, setActivePassbookStudent] = useState<MasterStudentFeeRecord | null>(null);

  // Available Months for Dropdown
  const monthOptions = [
    { label: "Oktober 2026 (Bulan Berjalan)", value: "2026-10" },
    { label: "September 2026", value: "2026-09" },
    { label: "Agustus 2026", value: "2026-08" },
    { label: "Juli 2026", value: "2026-07" },
  ];

  // Monthly Aggregated Calculations
  const monthlyRecapData = useMemo(() => {
    return getMonthlyStudentSavingsRecap(
      masterStudents,
      financeTransactions as any,
      selectedYearMonth
    );
  }, [masterStudents, financeTransactions, selectedYearMonth]);

  // Filtered List
  const filteredRecap = useMemo(() => {
    const q = (debouncedSearchQuery || "").toLowerCase();
    return (monthlyRecapData || []).filter((item) => {
      const std = item?.student;
      if (!std) return false;
      const matchSearch =
        !q.trim() ||
        std.name?.toLowerCase().includes(q) ||
        (std.nis && std.nis.includes(q)) ||
        std.savingsAccountNo?.toLowerCase().includes(q) ||
        std.grade?.toLowerCase().includes(q);

      const matchUnit = unitFilter === "ALL" || std.unit === unitFilter;

      return matchSearch && matchUnit;
    });
  }, [monthlyRecapData, debouncedSearchQuery, unitFilter]);

  // Overall Statistics for this Month
  const summaryStats = useMemo(() => {
    let totalAllBalances = 0;
    let totalDeposits = 0;
    let totalWithdraws = 0;
    let activeSaversCount = 0;

    for (const item of monthlyRecapData) {
      totalAllBalances += item.currentBalance;
      totalDeposits += item.totalDepositMonth;
      totalWithdraws += item.totalWithdrawMonth;
      if (item.totalDepositMonth > 0) activeSaversCount++;
    }

    const avgBalance =
      monthlyRecapData.length > 0
        ? Math.round(totalAllBalances / monthlyRecapData.length)
        : 0;

    return {
      totalAllBalances,
      totalDeposits,
      totalWithdraws,
      activeSaversCount,
      avgBalance,
    };
  }, [monthlyRecapData]);

  // Passbook Transaction History for selected student
  const passbookMutations = useMemo(() => {
    if (!activePassbookStudent) return [];

    const studentTransactions = financeTransactions.filter((trx) => {
      if (trx.type !== "savings") return false;
      const matchNis = trx.studentNis && trx.studentNis === activePassbookStudent.nis;
      const matchName = trx.studentName && trx.studentName.toLowerCase() === activePassbookStudent.name.toLowerCase();
      return matchNis || matchName;
    });

    // Sort oldest to newest to compute running balance
    const sorted = [...studentTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let running = activePassbookStudent.initialSavingsBalance;
    const items = [];

    // Initial deposit row
    items.push({
      id: "init",
      referenceNo: "SALDO-AWAL",
      date: "01 Juli 2026",
      timestamp: "08:00 WIB",
      type: "deposit",
      category: "Saldo Awal Buku Tabungan",
      description: "Setoran awal pembukaan buku tabungan santri baru",
      operatorName: "Sistem SIM",
      amount: activePassbookStudent.initialSavingsBalance,
      runningBalance: running,
      auditHash: "SHA256: 0000init98a72bcae1823",
    });

    for (const trx of sorted) {
      if (trx.savingsType === "deposit") {
        running += trx.amount;
      } else {
        running -= trx.amount;
      }

      items.push({
        ...trx,
        runningBalance: running,
      });
    }

    // Return newest on top for table view
    return items.reverse();
  }, [activePassbookStudent, financeTransactions]);

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-80 h-80 bg-purple-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-purple-500/20 border border-purple-500/40 text-purple-400 text-xs font-bold mb-2">
              <PiggyBank className="w-3.5 h-3.5" />
              <span>Buku Induk Tabungan Santri (Monthly Savings Recap)</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Administrasi Tabungan Santri Bulanan
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Pantau akumulasi setoran bulanan, penarikan dana, pemotongan otomatis tagihan sekolah, dan saldo akhir tiap anak lintas unit RA, SD, dan MTs secara transparan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-purple-500 hover:bg-purple-400 text-white text-xs font-black shadow-lg shadow-purple-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak Rekap Tabungan</span>
            </button>
          </div>
        </div>
      </div>

      {/* 4 Summary Stat Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Brankas */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-amber-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL BRANKAS TABUNGAN</span>
            <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <PiggyBank className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-amber-300 mt-3">
            Rp {summaryStats.totalAllBalances.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-amber-400 mt-1 block">
            Saldo Keseluruhan Santri Aktif
          </span>
        </div>

        {/* Setoran Bulan Ini */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-emerald-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>SETORAN BULAN INI (+)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">
            Rp {summaryStats.totalDeposits.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 mt-1 block">
            {summaryStats.activeSaversCount} Santri Menabung Periode Ini
          </span>
        </div>

        {/* Penarikan Bulan Ini */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-rose-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>PENARIKAN BULAN INI (-)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-3">
            Rp {summaryStats.totalWithdraws.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-rose-300 mt-1 block">
            Termasuk Pemotongan Bayar SPP
          </span>
        </div>

        {/* Rata-Rata Saldo per Santri */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>RATA-RATA SALDO</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Coins className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-3">
            Rp {summaryStats.avgBalance.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-cyan-400 mt-1 block">
            Akumulasi Rata-Rata per Santri
          </span>
        </div>
      </div>

      {/* Month Selector & Search Filter Bar */}
      <div className="p-4 rounded-2xl bg-[#1a1a24]/80 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Month Dropdown */}
        <div className="flex items-center gap-2 shrink-0">
          <Calendar className="w-4 h-4 text-purple-400" />
          <span className="text-xs font-bold text-gray-300">Pilih Periode Bulan:</span>
          <select
            value={selectedYearMonth}
            onChange={(e) => setSelectedYearMonth(e.target.value)}
            className="px-3.5 py-2 rounded-xl bg-black/40 border border-purple-500/40 text-purple-300 text-xs font-bold focus:outline-none cursor-pointer"
          >
            {monthOptions.map((opt) => (
              <option key={opt.value} value={opt.value} className="bg-[#14141d] text-white">
                {opt.label}
              </option>
            ))}
          </select>
        </div>

        {/* Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-purple-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari Santri, NIS, Kelas, atau Nomor Rekening Tabungan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-purple-400 focus:outline-none text-white text-xs sm:text-sm placeholder-gray-500"
          />
          {searchQuery && (
            <button
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Unit Filter */}
        <div className="shrink-0">
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-semibold text-gray-300 focus:outline-none focus:border-purple-400 cursor-pointer"
          >
            <option value="ALL">Semua Unit Lembaga</option>
            <option value="RA">Unit RA</option>
            <option value="SD">Unit SD</option>
            <option value="MTs">Unit MTs</option>
            <option value="Les">Unit Les</option>
          </select>
        </div>
      </div>

      {/* MONTHLY RECAP SPREADSHEET TABLE */}
      <div className="bg-[#1a1a24]/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <PiggyBank className="w-4 h-4 text-purple-400" />
            <span>
              Rekapitulasi Tabungan Santri Periode{" "}
              {monthOptions.find((m) => m.value === selectedYearMonth)?.label} ({filteredRecap.length} Rekening)
            </span>
          </div>

          <div className="text-[11px] text-gray-400 font-mono">
            * Klik &quot;Buku Tabungan&quot; untuk melihat mutasi detail per transaksi
          </div>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1150px]">
            <thead>
              <tr className="bg-[#13131b] border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400 font-extrabold">
                <th className="py-3.5 px-4">No. Rekening</th>
                <th className="py-3.5 px-5">Nama Santri &amp; Identitas</th>
                <th className="py-3.5 px-3">Unit / Kelas</th>
                <th className="py-3.5 px-4 text-right">Saldo Awal Bulan</th>
                <th className="py-3.5 px-4 text-right text-emerald-400">Total Setor (+)</th>
                <th className="py-3.5 px-4 text-right text-rose-400">Total Tarik (-)</th>
                <th className="py-3.5 px-4 text-right">Mutasi Bersih</th>
                <th className="py-3.5 px-5 text-right bg-purple-950/20 text-purple-300 border-x border-purple-500/20">
                  Saldo Terkini
                </th>
                <th className="py-3.5 px-4 text-center">Status Keaktifan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-medium">
              {filteredRecap.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                    Tidak ada rekening tabungan santri yang sesuai filter.
                  </td>
                </tr>
              ) : (
                filteredRecap.map((item) => {
                  const std = item.student;

                  return (
                    <tr key={std.id} className="hover:bg-white/[0.04] transition-colors">
                      {/* 1. No. Rekening */}
                      <td className="py-3.5 px-4 font-mono font-bold text-amber-300 whitespace-nowrap">
                        {std.savingsAccountNo}
                      </td>

                      {/* 2. Nama Santri */}
                      <td className="py-3.5 px-5 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{std.name}</div>
                            <div className="text-[11px] text-gray-400 font-mono">
                              NIS: {std.nis} • Wali: {std.parentPhone}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 3. Unit / Kelas */}
                      <td className="py-3.5 px-3 whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2 py-0.5 rounded-md font-bold uppercase ${
                            std.unit === "RA"
                              ? "bg-amber-500/20 text-amber-300 border border-amber-500/30"
                              : std.unit === "SD"
                              ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                              : std.unit === "MTs"
                              ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                              : "bg-purple-500/20 text-purple-300 border border-purple-500/30"
                          }`}
                        >
                          {std.unit}
                        </span>
                        <div className="text-[11px] text-gray-300 mt-0.5 font-medium">
                          {std.grade}
                        </div>
                      </td>

                      {/* 4. Saldo Awal Bulan */}
                      <td className="py-3.5 px-4 text-right font-semibold text-gray-300 whitespace-nowrap">
                        Rp {item.startingBalance.toLocaleString("id-ID")}
                      </td>

                      {/* 5. Total Setor Bulan Ini */}
                      <td className="py-3.5 px-4 text-right font-black text-emerald-400 whitespace-nowrap">
                        {item.totalDepositMonth > 0
                          ? `+ Rp ${item.totalDepositMonth.toLocaleString("id-ID")}`
                          : "-"}
                      </td>

                      {/* 6. Total Tarik Bulan Ini */}
                      <td className="py-3.5 px-4 text-right font-black text-rose-400 whitespace-nowrap">
                        {item.totalWithdrawMonth > 0
                          ? `- Rp ${item.totalWithdrawMonth.toLocaleString("id-ID")}`
                          : "-"}
                      </td>

                      {/* 7. Mutasi Bersih */}
                      <td className="py-3.5 px-4 text-right font-bold whitespace-nowrap">
                        {item.netMutationMonth > 0 ? (
                          <span className="text-emerald-400">
                            + Rp {item.netMutationMonth.toLocaleString("id-ID")}
                          </span>
                        ) : item.netMutationMonth < 0 ? (
                          <span className="text-rose-400">
                            - Rp {Math.abs(item.netMutationMonth).toLocaleString("id-ID")}
                          </span>
                        ) : (
                          <span className="text-gray-400">Rp 0</span>
                        )}
                      </td>

                      {/* 8. Saldo Terkini */}
                      <td className="py-3.5 px-5 text-right font-black whitespace-nowrap text-purple-300 bg-purple-950/20 border-x border-purple-500/20">
                        Rp {item.currentBalance.toLocaleString("id-ID")}
                      </td>

                      {/* 9. Status Keaktifan */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`text-[10px] px-2.5 py-1 rounded-full font-bold border ${
                            item.status === "Sangat Aktif"
                              ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/30"
                              : item.status === "Aktif"
                              ? "bg-cyan-500/20 text-cyan-300 border-cyan-500/30"
                              : "bg-gray-700/40 text-gray-400 border-gray-600/30"
                          }`}
                        >
                          {item.status}
                        </span>
                      </td>

                      {/* 10. Aksi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <button
                          onClick={() => setActivePassbookStudent(std)}
                          className="px-3 py-1.5 rounded-lg bg-purple-500/20 hover:bg-purple-500/30 text-purple-300 border border-purple-500/40 text-xs font-bold inline-flex items-center gap-1.5 transition-colors cursor-pointer"
                        >
                          <Eye className="w-3.5 h-3.5" />
                          <span>Buku Tabungan</span>
                        </button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* DETAILED PASSBOOK MUTATION MODAL */}
      <AnimatePresence>
        {activePassbookStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-3xl bg-[#161622] border border-purple-500/40 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              {/* Header Buku Tabungan */}
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-purple-500/20 border border-purple-500/30 flex items-center justify-center text-purple-400">
                    <PiggyBank className="w-6 h-6" />
                  </div>
                  <div>
                    <h3 className="text-base font-black text-white flex items-center gap-2">
                      <span>Buku Tabungan Digital Santri</span>
                      <span className="font-mono text-xs px-2 py-0.5 rounded bg-purple-500/20 text-purple-300 border border-purple-500/40">
                        {activePassbookStudent.savingsAccountNo}
                      </span>
                    </h3>
                    <div className="text-xs text-gray-300 mt-0.5">
                      {activePassbookStudent.name} • {activePassbookStudent.grade} (Unit {activePassbookStudent.unit})
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300"
                    title="Cetak Buku Tabungan"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setActivePassbookStudent(null)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Current Balance Ribbon */}
              <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-purple-950/40 to-black/60 border border-purple-500/30 flex items-center justify-between">
                <div>
                  <span className="text-[11px] text-gray-400 font-bold uppercase block">
                    Saldo Aktif di Buku Tabungan
                  </span>
                  <div className="text-xl sm:text-2xl font-black text-purple-300 mt-0.5">
                    Rp{" "}
                    {calculateStudentSavingsBalance(
                      activePassbookStudent,
                      financeTransactions
                    ).toLocaleString("id-ID")}
                  </div>
                </div>

                <div className="text-right">
                  <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-xs font-bold">
                    <ShieldCheck className="w-3.5 h-3.5" />
                    <span>Terjamin Brankas Yayasan</span>
                  </div>
                  <div className="text-[11px] text-gray-400 mt-1 font-mono">
                    Total {passbookMutations.length} Catatan Mutasi
                  </div>
                </div>
              </div>

              {/* Mutation List Table */}
              <div className="mt-4 overflow-y-auto flex-1 custom-scrollbar pr-1">
                <table className="w-full text-left border-collapse text-xs">
                  <thead>
                    <tr className="bg-[#12121a] border-b border-white/10 text-[10px] uppercase text-gray-400 font-extrabold">
                      <th className="py-2.5 px-3">Tanggal / Waktu</th>
                      <th className="py-2.5 px-3">No. Ref</th>
                      <th className="py-2.5 px-4">Uraian Transaksi</th>
                      <th className="py-2.5 px-3 text-right">Mutasi (IDR)</th>
                      <th className="py-2.5 px-3 text-right text-purple-300">Saldo Akhir</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5 font-medium">
                    {passbookMutations.map((m: any) => {
                      const isDeposit = m.savingsType === "deposit" || m.type === "deposit";

                      return (
                        <tr key={m.id} className="hover:bg-white/[0.04]">
                          <td className="py-2.5 px-3 whitespace-nowrap">
                            <div className="font-semibold text-white">{m.date}</div>
                            <div className="text-[10px] text-gray-500">{m.timestamp}</div>
                          </td>

                          <td className="py-2.5 px-3 font-mono text-gray-400 whitespace-nowrap text-[11px]">
                            {m.referenceNo}
                          </td>

                          <td className="py-2.5 px-4">
                            <div className="font-bold text-white flex items-center gap-1.5">
                              <span>{m.category}</span>
                              <span
                                className={`text-[9px] px-1.5 py-0.2 rounded font-bold ${
                                  isDeposit
                                    ? "bg-emerald-500/20 text-emerald-300"
                                    : "bg-rose-500/20 text-rose-300"
                                }`}
                              >
                                {isDeposit ? "Setor" : "Tarik"}
                              </span>
                            </div>
                            <div className="text-[11px] text-gray-400 mt-0.5">
                              {m.description} • Opr: {m.operatorName}
                            </div>
                          </td>

                          <td className="py-2.5 px-3 text-right font-black whitespace-nowrap">
                            <span className={isDeposit ? "text-emerald-400" : "text-rose-400"}>
                              {isDeposit ? "+" : "-"} Rp {m.amount.toLocaleString("id-ID")}
                            </span>
                          </td>

                          <td className="py-2.5 px-3 text-right font-black text-purple-300 whitespace-nowrap">
                            Rp {m.runningBalance.toLocaleString("id-ID")}
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-500 font-mono">
                  Sistem Validasi Kriptografis SHA-256 Aktif
                </span>
                <button
                  onClick={() => setActivePassbookStudent(null)}
                  className="px-5 py-2 rounded-xl bg-purple-500 hover:bg-purple-400 text-white font-bold text-xs"
                >
                  Tutup Buku
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
