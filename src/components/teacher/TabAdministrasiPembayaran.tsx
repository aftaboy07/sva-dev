"use client";

import React, { useState, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  CheckSquare,
  Search,
  Filter,
  UserCheck,
  AlertCircle,
  CheckCircle2,
  Clock,
  Printer,
  ChevronDown,
  X,
  CreditCard,
  PiggyBank,
  ArrowRight,
  Sparkles,
  Coins,
  ShieldCheck,
  Calendar,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  MasterStudentFeeRecord,
  getSavedMasterStudentFees,
  saveMasterStudentFees,
  calculateStudentSavingsBalance,
  GFORM_PAYMENT_TYPES,
  getDefaultFeeAmount,
} from "@/data/studentFeeMaster";

interface TabAdministrasiPembayaranProps {
  setActiveTab?: (tab: string) => void;
}

export default function TabAdministrasiPembayaran({
  setActiveTab,
}: TabAdministrasiPembayaranProps) {
  const { currentUser, financeTransactions, addFinanceTransaction } = useEduQuest();

  // Master Student Fee state
  const [masterStudents, setMasterStudents] = useState<MasterStudentFeeRecord[]>([]);

  useEffect(() => {
    setMasterStudents(getSavedMasterStudentFees());
  }, []);

  const updateMasterStudents = (updated: MasterStudentFeeRecord[]) => {
    setMasterStudents(updated);
    saveMasterStudentFees(updated);
  };

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [unitFilter, setUnitFilter] = useState<string>("ALL");
  const [statusFilter, setStatusFilter] = useState<string>("ALL"); // "ALL" | "DUE" | "PAID"

  // Quick Pay Modal State
  const [quickPayStudent, setQuickPayStudent] = useState<MasterStudentFeeRecord | null>(null);
  const [quickPayFeeType, setQuickPayFeeType] = useState<string>("SPP Oktober");
  const [quickPayAmount, setQuickPayAmount] = useState<string>("350.000");
  const [quickPayUseSavings, setQuickPayUseSavings] = useState<boolean>(false);
  const [quickPaySuccessModal, setQuickPaySuccessModal] = useState<any>(null);

  // Digital SPP Card View Modal
  const [viewCardStudent, setViewCardStudent] = useState<MasterStudentFeeRecord | null>(null);

  // Filtered Students List
  const filteredStudents = useMemo(() => {
    const q = (debouncedSearchQuery || "").toLowerCase();
    return (masterStudents || []).filter((std) => {
      if (!std) return false;
      const matchSearch =
        !q.trim() ||
        std.name?.toLowerCase().includes(q) ||
        (std.nis && std.nis.includes(q)) ||
        std.grade?.toLowerCase().includes(q) ||
        std.savingsAccountNo?.toLowerCase().includes(q);

      const matchUnit = unitFilter === "ALL" || std.unit === unitFilter;

      // Calculate dues count defensively
      let pendingCount = 0;
      if (std.fees) {
        for (const key of Object.keys(std.fees)) {
          if (std.fees[key]?.status === "Belum Lunas") {
            pendingCount++;
          }
        }
      }

      let matchStatus = true;
      if (statusFilter === "DUE") {
        matchStatus = pendingCount > 0;
      } else if (statusFilter === "PAID") {
        matchStatus = pendingCount === 0;
      }

      return matchSearch && matchUnit && matchStatus;
    });
  }, [masterStudents, debouncedSearchQuery, unitFilter, statusFilter]);

  // Overall Statistics for Administrasi Pembayaran
  const overallStats = useMemo(() => {
    let totalPaid = 0;
    let totalDue = 0;
    let totalItems = 0;
    let paidItems = 0;

    for (const std of masterStudents) {
      for (const key of Object.keys(std.fees)) {
        totalItems++;
        const item = std.fees[key];
        if (item.status === "Lunas") {
          totalPaid += item.amount;
          paidItems++;
        } else {
          totalDue += item.amount;
        }
      }
    }

    const compliancePercent =
      totalItems > 0 ? Math.round((paidItems / totalItems) * 100) : 0;

    return {
      totalStudents: masterStudents.length,
      totalPaid,
      totalDue,
      compliancePercent,
    };
  }, [masterStudents]);

  // Handle Quick Pay
  const handleProcessQuickPay = (e: React.FormEvent) => {
    e.preventDefault();
    if (!quickPayStudent) return;

    const num = parseInt(quickPayAmount.replace(/\D/g, ""), 10) || 0;
    if (num <= 0) {
      alert("Nominal pembayaran tidak valid.");
      return;
    }

    const currentSavingsBal = calculateStudentSavingsBalance(quickPayStudent, financeTransactions);

    if (quickPayUseSavings && currentSavingsBal < num) {
      alert(
        `Saldo tabungan ${quickPayStudent.name} (Rp ${currentSavingsBal.toLocaleString(
          "id-ID"
        )}) tidak cukup untuk membayar tagihan Rp ${num.toLocaleString("id-ID")}.`
      );
      return;
    }

    const opName = currentUser?.name || "Operator Kasir SIM";
    const dateToday = new Date().toISOString().split("T")[0];

    // If using savings, record withdraw mutation
    if (quickPayUseSavings) {
      addFinanceTransaction({
        type: "savings",
        savingsType: "withdraw",
        category: "Tarik Tabungan (Bayar Sekolah)",
        amount: num,
        description: `Pemotongan otomatis saldo tabungan untuk pembayaran ${quickPayFeeType}`,
        operatorName: opName,
        date: dateToday,
        unit: quickPayStudent.unit === "Les" ? "Yayasan" : quickPayStudent.unit,
        studentId: quickPayStudent.id,
        studentName: quickPayStudent.name,
        studentNis: quickPayStudent.nis,
        studentGrade: quickPayStudent.grade,
      });
    }

    // Record income transaction
    const createdIncomeTrx = addFinanceTransaction({
      type: "income",
      category: quickPayFeeType,
      amount: num,
      description: `Pembayaran ${quickPayFeeType} santri a.n. ${quickPayStudent.name} (${quickPayStudent.grade}) [${quickPayUseSavings ? "Potong Tabungan" : "Kasir Tunai"}]`,
      operatorName: opName,
      date: dateToday,
      unit: quickPayStudent.unit === "Les" ? "Yayasan" : quickPayStudent.unit,
      studentId: quickPayStudent.id,
      studentName: quickPayStudent.name,
      studentNis: quickPayStudent.nis,
      studentGrade: quickPayStudent.grade,
    });

    // Update master fee record
    const updated = masterStudents.map((std) => {
      if (std.nis === quickPayStudent.nis) {
        const fees = { ...std.fees };
        fees[quickPayFeeType] = {
          status: "Lunas",
          amount: num,
          paidAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          receiptNo: createdIncomeTrx.referenceNo,
          paidVia: quickPayUseSavings ? "Saldo Tabungan" : "Kasir Tunai",
        };
        return { ...std, fees };
      }
      return std;
    });

    updateMasterStudents(updated);

    setQuickPaySuccessModal({
      studentName: quickPayStudent.name,
      feeType: quickPayFeeType,
      amount: num,
      refNo: createdIncomeTrx.referenceNo,
      method: quickPayUseSavings ? "Saldo Tabungan" : "Kasir Tunai",
    });

    setQuickPayStudent(null);
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-80 h-80 bg-amber-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 text-xs font-bold mb-2">
              <CheckSquare className="w-3.5 h-3.5" />
              <span>Master Pelacak Tagihan &amp; Administrasi Santri Lintas Unit</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Administrasi Pembayaran Siswa (RA • SD • MTs)
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Tabel komprehensif pelacakan 21 jenis kewajiban pembayaran seluruh santri (Daftar Ulang, Seragam, LKS, UTS/UAS, SPP 12 Bulan) lengkap dengan informasi saldo tabungan aktif per anak.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            {setActiveTab && (
              <button
                onClick={() => setActiveTab("operator_cashier")}
                className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <CreditCard className="w-4 h-4" />
                <span>Buka Kasir Loket</span>
              </button>
            )}
          </div>
        </div>
      </div>

      {/* 4 Summary Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Total Siswa */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>SANTRI TERDATA</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <UserCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-white mt-3">
            {overallStats.totalStudents} Santri
          </div>
          <span className="text-[11px] font-semibold text-cyan-400 mt-1 block">
            Lintas Jenjang RA, SD &amp; MTs
          </span>
        </div>

        {/* Total Terbayar */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-emerald-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL TERBAYAR</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <CheckCircle2 className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">
            Rp {overallStats.totalPaid.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 mt-1 block">
            Kewajiban Telah Dilunasi
          </span>
        </div>

        {/* Total Tunggakan */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-rose-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL TUNGGAKAN</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <AlertCircle className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-3">
            Rp {overallStats.totalDue.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-rose-300 mt-1 block">
            Sisa Tagihan Belum Lunas
          </span>
        </div>

        {/* Persentase Kepatuhan */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-purple-500/30 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>KEPATUHAN PEMBAYARAN</span>
            <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-purple-300 mt-3">
            {overallStats.compliancePercent}%
          </div>
          <span className="text-[11px] font-semibold text-purple-400 mt-1 block">
            Rasio Pelunasan Keseluruhan
          </span>
        </div>
      </div>

      {/* Search & Filters */}
      <div className="p-4 rounded-2xl bg-[#1a1a24]/80 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Fast Student Search Bar */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari Cepat Nama Siswa, NIS, Kelas, atau No. Rekening Tabungan..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-10 pr-10 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-xs sm:text-sm placeholder-gray-500"
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

        {/* Filter Unit & Status */}
        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-semibold text-gray-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">Semua Unit</option>
            <option value="RA">Unit RA</option>
            <option value="SD">Unit SD</option>
            <option value="MTs">Unit MTs</option>
            <option value="Les">Unit Les</option>
          </select>

          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-semibold text-gray-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">Semua Status</option>
            <option value="DUE">Ada Tunggakan Tagihan</option>
            <option value="PAID">Semua Lunas</option>
          </select>
        </div>
      </div>

      {/* MASTER STUDENT FEE TABLE (Horizontal Scrolling min-w-[1300px]) */}
      <div className="bg-[#1a1a24]/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <UserCheck className="w-4 h-4 text-cyan-400" />
            <span>Daftar Pelacakan Tagihan Santri ({filteredStudents.length} Santri)</span>
          </div>

          <div className="text-[11px] text-gray-400 font-mono">
            * Kolom Saldo Tabungan menampilkan dana likuid santri yang dapat dipotong otomatis
          </div>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1300px]">
            <thead>
              <tr className="bg-[#13131b] border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400 font-extrabold">
                <th className="py-3.5 px-4">Santri &amp; Identitas</th>
                <th className="py-3.5 px-3">Unit / Kelas</th>
                <th className="py-3.5 px-4 bg-amber-950/20 text-amber-300 border-x border-amber-500/20">
                  Saldo Tabungan
                </th>
                <th className="py-3.5 px-3 text-center">Daftar Ulang</th>
                <th className="py-3.5 px-3 text-center">Seragam</th>
                <th className="py-3.5 px-3 text-center">LKS (1 &amp; 2)</th>
                <th className="py-3.5 px-3 text-center">UTS / UAS</th>
                <th className="py-3.5 px-3 text-center">Badge &amp; Buku</th>
                <th className="py-3.5 px-4 text-center">Status SPP 12 Bulan</th>
                <th className="py-3.5 px-4 text-right">Total Terbayar</th>
                <th className="py-3.5 px-4 text-right text-rose-400">Tunggakan</th>
                <th className="py-3.5 px-4 text-center">Aksi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-medium">
              {filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan={12} className="py-12 text-center text-gray-400 text-sm">
                    Tidak ada santri yang sesuai kriteria pencarian.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((std) => {
                  const savingsBal = calculateStudentSavingsBalance(std, financeTransactions);

                  // Calculate Student Totals
                  let totalPaid = 0;
                  let totalDue = 0;
                  for (const key of Object.keys(std.fees)) {
                    const item = std.fees[key];
                    if (item.status === "Lunas") {
                      totalPaid += item.amount;
                    } else {
                      totalDue += item.amount;
                    }
                  }

                  // Count Paid SPP Months
                  const sppMonths = [
                    "SPP Juli", "SPP Agustus", "SPP September", "SPP Oktober",
                    "SPP November", "SPP Desember", "SPP Januari", "SPP Februari",
                    "SPP Maret", "SPP April", "SPP Mei", "SPP Juni"
                  ];
                  let paidSppCount = 0;
                  sppMonths.forEach((m) => {
                    if (std.fees[m]?.status === "Lunas") paidSppCount++;
                  });

                  return (
                    <tr key={std.id} className="hover:bg-white/[0.04] transition-colors">
                      {/* 1. Santri & Identitas */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <div className="font-bold text-white text-sm">{std.name}</div>
                            <div className="text-[11px] text-gray-400 font-mono">
                              NIS: {std.nis} • Rek: {std.savingsAccountNo}
                            </div>
                          </div>
                        </div>
                      </td>

                      {/* 2. Unit / Kelas */}
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

                      {/* 3. Saldo Tabungan (Spec 4 requirement) */}
                      <td className="py-3.5 px-4 bg-amber-950/20 border-x border-amber-500/20 whitespace-nowrap">
                        <div className="flex items-center gap-1.5 font-bold text-amber-300">
                          <PiggyBank className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                          <span>Rp {savingsBal.toLocaleString("id-ID")}</span>
                        </div>
                        <span className="text-[10px] text-gray-400 block mt-0.5">
                          {savingsBal >= 350000 ? "Bisa bayar SPP via saldo" : "Saldo terbatas"}
                        </span>
                      </td>

                      {/* 4. Daftar Ulang */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {std.fees["Daftar Ulang"]?.status === "Lunas" ? (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            <CheckCircle2 className="w-3 h-3" />
                            <span>Lunas</span>
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                            <Clock className="w-3 h-3" />
                            <span>Belum</span>
                          </span>
                        )}
                      </td>

                      {/* 5. Seragam */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {std.fees["Seragam"]?.status === "Lunas" ? (
                          <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 text-[10px] font-bold border border-emerald-500/30">
                            Lunas
                          </span>
                        ) : (
                          <span className="px-2 py-0.5 rounded-full bg-rose-500/20 text-rose-300 text-[10px] font-bold border border-rose-500/30">
                            Belum
                          </span>
                        )}
                      </td>

                      {/* 6. LKS (1 & 2) */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            title="LKS Sem 1"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              std.fees["LKS Sem 1"]?.status === "Lunas"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            S1
                          </span>
                          <span
                            title="LKS Sem 2"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              std.fees["LKS Sem 2"]?.status === "Lunas"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            S2
                          </span>
                        </div>
                      </td>

                      {/* 7. UTS / UAS */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1">
                          <span
                            title="Pembayaran UTS"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              std.fees["Pembayaran UTS"]?.status === "Lunas"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            UTS
                          </span>
                          <span
                            title="Pembayaran UAS"
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              std.fees["Pembayaran UAS"]?.status === "Lunas"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-rose-500/20 text-rose-300"
                            }`}
                          >
                            UAS
                          </span>
                        </div>
                      </td>

                      {/* 8. Badge & Buku */}
                      <td className="py-3.5 px-3 text-center whitespace-nowrap">
                        {std.fees["Badge"]?.status === "Lunas" &&
                        std.fees["Buku Tabungan"]?.status === "Lunas" ? (
                          <span className="text-emerald-400 font-bold text-xs">Lengkap</span>
                        ) : (
                          <span className="text-amber-400 font-semibold text-xs">Parsial</span>
                        )}
                      </td>

                      {/* 9. Status SPP 12 Bulan */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="inline-flex items-center gap-1 px-2.5 py-1 rounded-xl bg-black/40 border border-white/10">
                          <span className="font-bold text-emerald-400">{paidSppCount}</span>
                          <span className="text-gray-400">/ 12 Bln</span>
                        </div>
                        <div className="w-24 bg-gray-700 h-1.5 rounded-full overflow-hidden mx-auto mt-1.5">
                          <div
                            className="bg-emerald-400 h-full"
                            style={{ width: `${(paidSppCount / 12) * 100}%` }}
                          />
                        </div>
                      </td>

                      {/* 10. Total Terbayar */}
                      <td className="py-3.5 px-4 text-right font-black text-emerald-400 whitespace-nowrap">
                        Rp {totalPaid.toLocaleString("id-ID")}
                      </td>

                      {/* 11. Tunggakan */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        {totalDue > 0 ? (
                          <span className="font-black text-rose-400">
                            Rp {totalDue.toLocaleString("id-ID")}
                          </span>
                        ) : (
                          <span className="font-bold text-emerald-400 flex items-center justify-end gap-1">
                            <CheckCircle2 className="w-3.5 h-3.5" />
                            <span>Lunas</span>
                          </span>
                        )}
                      </td>

                      {/* 12. Aksi */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <div className="flex items-center justify-center gap-1.5">
                          <button
                            onClick={() => {
                              setQuickPayStudent(std);
                              const def = getDefaultFeeAmount(std.unit, "SPP Oktober");
                              setQuickPayAmount(def.toLocaleString("id-ID"));
                              setQuickPayUseSavings(false);
                            }}
                            className="px-2.5 py-1.5 rounded-lg bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all cursor-pointer flex items-center gap-1 shadow-sm"
                          >
                            <CreditCard className="w-3 h-3" />
                            <span>Bayar</span>
                          </button>

                          <button
                            onClick={() => setViewCardStudent(std)}
                            className="px-2 py-1.5 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 text-xs font-semibold transition-colors cursor-pointer"
                            title="Lihat Rincian Kartu SPP"
                          >
                            Kartu
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* QUICK PAYMENT MODAL (WITH SMART PAYMENT TOGGLE) */}
      <AnimatePresence>
        {quickPayStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#181824] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={quickPayStudent.avatar}
                    alt={quickPayStudent.name}
                    className="w-10 h-10 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div>
                    <h3 className="text-base font-black text-white">
                      Loket Cepat Pembayaran Santri
                    </h3>
                    <div className="text-xs text-cyan-300 font-bold">
                      {quickPayStudent.name} • {quickPayStudent.grade}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setQuickPayStudent(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <form onSubmit={handleProcessQuickPay} className="mt-5 space-y-4">
                {/* Active Savings Balance Pill */}
                {(() => {
                  const sBal = calculateStudentSavingsBalance(quickPayStudent, financeTransactions);
                  const pNum = parseInt(quickPayAmount.replace(/\D/g, ""), 10) || 0;
                  const canDeduct = sBal >= pNum;

                  return (
                    <>
                      <div className="p-3.5 rounded-xl bg-amber-950/20 border border-amber-500/30 flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <PiggyBank className="w-5 h-5 text-amber-400" />
                          <span className="text-xs text-gray-300 font-semibold">
                            Saldo Tabungan Santri Saat Ini:
                          </span>
                        </div>
                        <span className="text-sm font-black text-amber-300">
                          Rp {sBal.toLocaleString("id-ID")}
                        </span>
                      </div>

                      {/* Fee Type Select */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
                          Pilih Tagihan yang Dibayar:
                        </label>
                        <select
                          value={quickPayFeeType}
                          onChange={(e) => {
                            setQuickPayFeeType(e.target.value);
                            const def = getDefaultFeeAmount(quickPayStudent.unit, e.target.value);
                            setQuickPayAmount(def.toLocaleString("id-ID"));
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-xs font-semibold cursor-pointer"
                        >
                          {GFORM_PAYMENT_TYPES.map((type) => {
                            const isPaid = quickPayStudent.fees[type]?.status === "Lunas";
                            return (
                              <option key={type} value={type} className="bg-[#14141d]">
                                {type} {isPaid ? "— (Sudah Lunas)" : "— (Belum Lunas)"}
                              </option>
                            );
                          })}
                        </select>
                      </div>

                      {/* Amount Input */}
                      <div>
                        <label className="block text-xs font-bold uppercase text-gray-300 mb-1.5">
                          Nominal Pembayaran (IDR):
                        </label>
                        <input
                          type="text"
                          value={quickPayAmount}
                          onChange={(e) => {
                            const clean = e.target.value.replace(/\D/g, "");
                            setQuickPayAmount(clean ? parseInt(clean, 10).toLocaleString("id-ID") : "");
                          }}
                          className="w-full px-4 py-2.5 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-emerald-400 font-black text-base"
                        />
                      </div>

                      {/* SPEC 7: Smart Payment Option */}
                      <div className="p-3.5 rounded-xl bg-gradient-to-r from-[#1c1d2b] to-[#161724] border border-cyan-500/40">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <Sparkles className="w-4 h-4 text-cyan-400" />
                            <span className="text-xs font-bold text-white">
                              Potong dari Saldo Tabungan
                            </span>
                          </div>
                          <input
                            type="checkbox"
                            checked={quickPayUseSavings}
                            onChange={(e) => setQuickPayUseSavings(e.target.checked)}
                            className="w-4 h-4 accent-cyan-400 rounded cursor-pointer"
                          />
                        </div>

                        {quickPayUseSavings && (
                          <div className="mt-2 text-[11px] font-semibold">
                            {canDeduct ? (
                              <span className="text-emerald-400">
                                Saldo mencukupi! Sisa tabungan setelah bayar: Rp{" "}
                                {(sBal - pNum).toLocaleString("id-ID")}.
                              </span>
                            ) : (
                              <span className="text-rose-400">
                                Saldo tabungan kurang Rp {(pNum - sBal).toLocaleString("id-ID")}.
                              </span>
                            )}
                          </div>
                        )}
                      </div>

                      {/* Submit Button */}
                      <div className="pt-2 flex items-center justify-end gap-3">
                        <button
                          type="button"
                          onClick={() => setQuickPayStudent(null)}
                          className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-xs text-gray-300 font-bold cursor-pointer"
                        >
                          Batal
                        </button>

                        <button
                          type="submit"
                          disabled={quickPayUseSavings && !canDeduct}
                          className={`px-6 py-2.5 rounded-xl font-black text-xs shadow-lg transition-all cursor-pointer ${
                            quickPayUseSavings && !canDeduct
                              ? "bg-gray-800 text-gray-500 cursor-not-allowed"
                              : "bg-cyan-500 hover:bg-cyan-400 text-black shadow-cyan-500/25 active:scale-95"
                          }`}
                        >
                          Konfirmasi Pelunasan
                        </button>
                      </div>
                    </>
                  );
                })()}
              </form>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* DIGITAL KARTU SPP MODAL */}
      <AnimatePresence>
        {viewCardStudent && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#161622] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative max-h-[85vh] flex flex-col"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <img
                    src={viewCardStudent.avatar}
                    alt={viewCardStudent.name}
                    className="w-12 h-12 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div>
                    <h3 className="text-base font-black text-white">
                      Kartu Pembayaran Santri Resmi
                    </h3>
                    <div className="text-xs text-gray-300">
                      {viewCardStudent.name} (NIS: {viewCardStudent.nis}) • {viewCardStudent.grade}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => window.print()}
                    className="p-2 rounded-lg bg-white/10 hover:bg-white/15 text-gray-300"
                    title="Cetak Kartu SPP"
                  >
                    <Printer className="w-4 h-4" />
                  </button>
                  <button
                    onClick={() => setViewCardStudent(null)}
                    className="p-2 rounded-lg text-gray-400 hover:text-white"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Dues Breakdown Grid */}
              <div className="mt-4 overflow-y-auto flex-1 custom-scrollbar pr-1 space-y-3">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs">
                  {Object.keys(viewCardStudent.fees).map((feeName) => {
                    const item = viewCardStudent.fees[feeName];
                    const isLunas = item.status === "Lunas";

                    return (
                      <div
                        key={feeName}
                        className={`p-3 rounded-xl border flex items-center justify-between ${
                          isLunas
                            ? "bg-emerald-950/20 border-emerald-500/30"
                            : "bg-rose-950/20 border-rose-500/30"
                        }`}
                      >
                        <div>
                          <div className="font-bold text-white">{feeName}</div>
                          <div className="text-[11px] text-gray-400">
                            {isLunas
                              ? `Lunas: ${item.paidAt} (${item.paidVia || "Kasir"})`
                              : `Tagihan: Rp ${item.amount.toLocaleString("id-ID")}`}
                          </div>
                        </div>

                        <span
                          className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                            isLunas
                              ? "bg-emerald-500/20 text-emerald-300"
                              : "bg-rose-500/20 text-rose-300"
                          }`}
                        >
                          {item.status}
                        </span>
                      </div>
                    );
                  })}
                </div>
              </div>

              <div className="mt-4 pt-3 border-t border-white/10 flex justify-end">
                <button
                  onClick={() => setViewCardStudent(null)}
                  className="px-5 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
                >
                  Tutup Kartu
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* QUICK PAY SUCCESS POPUP */}
      <AnimatePresence>
        {quickPaySuccessModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-md bg-[#181824] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl text-center"
            >
              <div className="w-12 h-12 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400 mx-auto mb-3">
                <CheckCircle2 className="w-7 h-7" />
              </div>
              <h3 className="text-lg font-black text-white">Pelunasan Berhasil!</h3>
              <p className="text-xs text-gray-300 mt-1">
                Kewajiban <span className="text-cyan-300 font-bold">{quickPaySuccessModal.feeType}</span> a.n.{" "}
                <span className="text-white font-bold">{quickPaySuccessModal.studentName}</span> sebesar{" "}
                <span className="text-emerald-400 font-bold">
                  Rp {quickPaySuccessModal.amount.toLocaleString("id-ID")}
                </span>{" "}
                telah tercatat lunas.
              </p>
              <div className="mt-3 p-3 bg-black/40 rounded-xl text-xs font-mono text-gray-400">
                Metode: {quickPaySuccessModal.method} • Ref: {quickPaySuccessModal.refNo}
              </div>
              <button
                onClick={() => setQuickPaySuccessModal(null)}
                className="mt-5 w-full py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black font-bold text-xs"
              >
                Selesai
              </button>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
