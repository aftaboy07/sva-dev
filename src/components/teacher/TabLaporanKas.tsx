"use client";

import React, { useState, useMemo, useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import { FinanceTransaction } from "@/types";
import { useDebounce } from "@/hooks/useDebounce";
import {
  FileSpreadsheet,
  Receipt,
  Search,
  Printer,
  Eye,
  ShieldCheck,
  Calendar,
  X,
  Building,
  TrendingUp,
  TrendingDown,
  ArrowUpRight,
  ArrowDownRight,
  Lock,
  Download,
  Filter,
  ArrowDown,
  CheckCircle2,
  Sparkles,
} from "lucide-react";

interface TabLaporanKasProps {
  setActiveTab?: (tab: string) => void;
}

export default function TabLaporanKas({ setActiveTab }: TabLaporanKasProps) {
  const { financeTransactions } = useEduQuest();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const debouncedSearchQuery = useDebounce(searchQuery, 250);
  const [unitFilter, setUnitFilter] = useState<string>("ALL");
  const [dateFilter, setDateFilter] = useState<string>("ALL");
  const [activePreviewReceipt, setActivePreviewReceipt] = useState<{
    url: string;
    name: string;
    refNo: string;
    hash: string;
  } | null>(null);

  // Baseline Saldo Awal Kas Periode
  const SALDO_AWAL_KAS = 50000000; // Rp 50.000.000

  // Filter ONLY Income and Expense (EXCLUDING SAVINGS as per specification)
  const cashTransactions = useMemo(() => {
    return (financeTransactions || []).filter((trx) => trx && (trx.type === "income" || trx.type === "expense"));
  }, [financeTransactions]);

  // Compute Chronological Running Balance
  const chronologicalCashLedger = useMemo(() => {
    // Sort oldest to newest for balance accumulator
    const sorted = [...cashTransactions].sort(
      (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    let running = SALDO_AWAL_KAS;
    const computedMap = new Map<string, number>();

    for (const trx of sorted) {
      if (trx.type === "income") {
        running += trx.amount;
      } else if (trx.type === "expense") {
        running -= trx.amount;
      }
      computedMap.set(trx.id, running);
    }

    // Return newest to oldest for presentation with calculated running balance
    return [...cashTransactions]
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      .map((trx) => ({
        ...trx,
        runningBalance: computedMap.get(trx.id) ?? running,
      }));
  }, [cashTransactions]);

  // Filtered Ledger based on search and filters
  const filteredLedger = useMemo(() => {
    const q = (debouncedSearchQuery || "").toLowerCase();
    return (chronologicalCashLedger || []).filter((trx) => {
      if (!trx) return false;
      const matchSearch =
        !q.trim() ||
        trx.referenceNo?.toLowerCase().includes(q) ||
        trx.category?.toLowerCase().includes(q) ||
        trx.description?.toLowerCase().includes(q) ||
        trx.operatorName?.toLowerCase().includes(q) ||
        (trx.studentName && trx.studentName.toLowerCase().includes(q)) ||
        (trx.studentNis && trx.studentNis.includes(q));

      const matchUnit = unitFilter === "ALL" || trx.unit === unitFilter;

      let matchDate = true;
      const trxDate = new Date(trx.date);
      const now = new Date();
      if (dateFilter === "TODAY") {
        matchDate = trxDate.toDateString() === now.toDateString();
      } else if (dateFilter === "WEEK") {
        const diffDays = (now.getTime() - trxDate.getTime()) / (1000 * 3600 * 24);
        matchDate = diffDays <= 7;
      } else if (dateFilter === "MONTH") {
        matchDate = trxDate.getMonth() === now.getMonth() && trxDate.getFullYear() === now.getFullYear();
      }

      return matchSearch && matchUnit && matchDate;
    });
  }, [chronologicalCashLedger, searchQuery, unitFilter, dateFilter]);

  // Summary Metrics for Header Cards
  const summaryMetrics = useMemo(() => {
    let totalPendapatan = 0;
    let totalPengeluaran = 0;

    for (const trx of cashTransactions) {
      if (trx.type === "income") {
        totalPendapatan += trx.amount;
      } else if (trx.type === "expense") {
        totalPengeluaran += trx.amount;
      }
    }

    const saldoHariIni = SALDO_AWAL_KAS + totalPendapatan - totalPengeluaran;

    return {
      saldoAwal: SALDO_AWAL_KAS,
      totalPendapatan,
      totalPengeluaran,
      saldoHariIni,
    };
  }, [cashTransactions]);

  // AUTO-SCROLL TO FIRST MATCHED ROW
  const firstMatchedRowRef = useRef<HTMLTableRowElement | null>(null);

  const scrollToFirstMatch = () => {
    if (firstMatchedRowRef.current) {
      firstMatchedRowRef.current.scrollIntoView({ behavior: "smooth", block: "center" });
      firstMatchedRowRef.current.classList.add("ring-2", "ring-cyan-400");
      setTimeout(() => {
        firstMatchedRowRef.current?.classList.remove("ring-2", "ring-cyan-400");
      }, 2000);
    }
  };

  // Helper for Auto-Highlighting search text
  const highlightMatch = (text: string) => {
    if (!searchQuery.trim() || !text) return text;
    const parts = text.split(new RegExp(`(${searchQuery})`, "gi"));
    return (
      <>
        {parts.map((part, index) =>
          part.toLowerCase() === searchQuery.toLowerCase() ? (
            <mark
              key={index}
              className="bg-yellow-400/40 text-yellow-200 px-0.5 rounded font-extrabold"
            >
              {part}
            </mark>
          ) : (
            part
          )
        )}
      </>
    );
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-80 h-80 bg-blue-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 border border-blue-500/40 text-blue-400 text-xs font-bold mb-2">
              <FileSpreadsheet className="w-3.5 h-3.5" />
              <span>Buku Kas Harian Resmi Format Spreadsheet</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Laporan Kas Harian (Pendapatan &amp; Pengeluaran)
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Tabel buku besar harian terpadu yang memadukan seluruh penerimaan kas santri dan belanja operasional yayasan dengan kalkulasi running balance (Saldo Akhir) berurutan.
            </p>
          </div>

          <div className="flex items-center gap-2.5">
            <button
              onClick={() => window.print()}
              className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer active:scale-95"
            >
              <Printer className="w-4 h-4" />
              <span>Cetak / Ekspor PDF</span>
            </button>
          </div>
        </div>
      </div>

      {/* SPEC 3: TOP SUMMARY HEADER CARDS (Saldo Awal, Total Pendapatan, Total Pengeluaran, Saldo Hari Ini) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Saldo Awal */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>SALDO AWAL KAS</span>
            <div className="w-8 h-8 rounded-xl bg-blue-500/20 text-blue-400 flex items-center justify-center border border-blue-500/30">
              <Calendar className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-blue-300 mt-3">
            Rp {summaryMetrics.saldoAwal.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-blue-400 mt-1 block">
            Kas Awal Periode TA 2026/2027
          </span>
        </div>

        {/* Card 2: Total Pendapatan */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-emerald-500/30 shadow-lg backdrop-blur-xl hover:border-emerald-500/50 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL PENDAPATAN (+)</span>
            <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <TrendingUp className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-emerald-400 mt-3">
            Rp {summaryMetrics.totalPendapatan.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-emerald-300 mt-1 block">
            Kas Masuk (SPP, Daftar Ulang, Donatur)
          </span>
        </div>

        {/* Card 3: Total Pengeluaran */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-rose-500/30 shadow-lg backdrop-blur-xl hover:border-rose-500/50 transition-all">
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>TOTAL PENGELUARAN (-)</span>
            <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <TrendingDown className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-rose-400 mt-3">
            Rp {summaryMetrics.totalPengeluaran.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-rose-300 mt-1 block">
            Belanja Operasional &amp; Sarana
          </span>
        </div>

        {/* Card 4: Saldo Hari Ini */}
        <div className="bg-[#1a1a24]/80 p-5 rounded-2xl border border-cyan-500/40 shadow-xl backdrop-blur-xl relative overflow-hidden">
          <div className="absolute top-0 right-0 w-24 h-24 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-gray-400 text-xs font-bold">
            <span>SALDO HARI INI</span>
            <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <ShieldCheck className="w-4 h-4" />
            </div>
          </div>
          <div className="text-2xl font-black text-cyan-300 mt-3">
            Rp {summaryMetrics.saldoHariIni.toLocaleString("id-ID")}
          </div>
          <span className="text-[11px] font-semibold text-cyan-400 mt-1 block">
            Saldo Kas Bersih Riil Berjalan
          </span>
        </div>
      </div>

      {/* Search and Filters Bar with Auto-Highlight & Auto-Scroll notification */}
      <div className="p-4 rounded-2xl bg-[#1a1a24]/80 border border-white/10 shadow-lg flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Interactive Search Input */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-cyan-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
          <input
            type="text"
            placeholder="Cari Transaksi, Nama Santri, Kategori, atau No. Ref..."
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

        {/* Auto-Scroll Jump Button if search query active */}
        {searchQuery.trim() && filteredLedger.length > 0 && (
          <button
            onClick={scrollToFirstMatch}
            className="px-3.5 py-2 rounded-xl bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-xs font-bold flex items-center gap-1.5 hover:bg-cyan-500/30 transition-all cursor-pointer shrink-0"
          >
            <ArrowDown className="w-3.5 h-3.5" />
            <span>Lompat ke Baris Hasil ({filteredLedger.length} ditemukan)</span>
          </button>
        )}

        {/* Unit & Date Filter Dropdowns */}
        <div className="flex items-center gap-2.5 shrink-0">
          <select
            value={unitFilter}
            onChange={(e) => setUnitFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-semibold text-gray-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">Semua Unit</option>
            <option value="Yayasan">Yayasan</option>
            <option value="RA">Unit RA</option>
            <option value="SD">Unit SD</option>
            <option value="MTs">Unit MTs</option>
          </select>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="px-3 py-2 rounded-xl bg-black/40 border border-white/15 text-xs font-semibold text-gray-300 focus:outline-none focus:border-cyan-400 cursor-pointer"
          >
            <option value="ALL">Semua Periode</option>
            <option value="TODAY">Hari Ini</option>
            <option value="WEEK">7 Hari Terakhir</option>
            <option value="MONTH">Bulan Ini</option>
          </select>
        </div>
      </div>

      {/* COMBINED SPREADSHEET DAILY LEDGER TABLE (Horizontal Scrolling min-w-[1250px]) */}
      <div className="bg-[#1a1a24]/80 rounded-2xl border border-white/10 shadow-2xl backdrop-blur-xl overflow-hidden">
        <div className="p-4 border-b border-white/10 flex items-center justify-between bg-black/30">
          <div className="flex items-center gap-2 text-xs font-bold text-gray-300">
            <FileSpreadsheet className="w-4 h-4 text-cyan-400" />
            <span>Rekap Harian Transaksi Kas Terpadu ({filteredLedger.length} Baris Data)</span>
          </div>

          <div className="text-[11px] text-gray-400 font-mono">
            * Kolom Saldo Akhir dihitung berurutan per baris mutasi
          </div>
        </div>

        <div className="overflow-x-auto w-full custom-scrollbar">
          <table className="w-full text-left border-collapse min-w-[1250px]">
            <thead>
              <tr className="bg-[#13131b] border-b border-white/10 text-[11px] uppercase tracking-wider text-gray-400 font-extrabold">
                <th className="py-3.5 px-4">No. Ref Transaksi</th>
                <th className="py-3.5 px-4">Tanggal / Waktu</th>
                <th className="py-3.5 px-5">Nama Siswa / Pembayar</th>
                <th className="py-3.5 px-4">Jenis Pembayaran</th>
                <th className="py-3.5 px-4">Jenis Pengeluaran</th>
                <th className="py-3.5 px-5">Deskripsi</th>
                <th className="py-3.5 px-4 text-right">Nominal Pendapatan</th>
                <th className="py-3.5 px-4 text-right">Nominal Pengeluaran</th>
                <th className="py-3.5 px-5 text-right bg-cyan-950/20 text-cyan-300 border-x border-cyan-500/20">
                  Saldo Akhir
                </th>
                <th className="py-3.5 px-4 text-center">Nota &amp; Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-xs font-medium">
              {filteredLedger.length === 0 ? (
                <tr>
                  <td colSpan={10} className="py-12 text-center text-gray-400 text-sm">
                    Tidak ada transaksi kas yang sesuai dengan filter pencarian.
                  </td>
                </tr>
              ) : (
                filteredLedger.map((trx, idx) => {
                  const isFirstMatch = idx === 0 && searchQuery.trim() !== "";
                  const isIncome = trx.type === "income";

                  return (
                    <tr
                      key={trx.id}
                      ref={isFirstMatch ? firstMatchedRowRef : null}
                      className={`hover:bg-white/[0.04] transition-colors ${
                        isIncome ? "bg-emerald-950/[0.03]" : "bg-rose-950/[0.03]"
                      }`}
                    >
                      {/* 1. No. Ref */}
                      <td className="py-3.5 px-4 font-mono font-bold text-gray-300 whitespace-nowrap">
                        {highlightMatch(trx.referenceNo)}
                      </td>

                      {/* 2. Tanggal / Waktu */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-semibold text-white">{trx.date}</div>
                        <div className="text-[11px] text-gray-400">{trx.timestamp}</div>
                      </td>

                      {/* 3. Nama Siswa / Pembayar */}
                      <td className="py-3.5 px-5">
                        <div className="font-bold text-white flex items-center gap-1.5">
                          <span>{highlightMatch(trx.studentName || (isIncome ? "Donatur / Kas Masuk" : "Operasional Yayasan"))}</span>
                          <span
                            className={`text-[9px] px-1.5 py-0.5 rounded font-bold uppercase ${
                              trx.unit === "Yayasan"
                                ? "bg-purple-500/20 text-purple-300"
                                : trx.unit === "RA"
                                ? "bg-amber-500/20 text-amber-300"
                                : trx.unit === "SD"
                                ? "bg-emerald-500/20 text-emerald-300"
                                : "bg-blue-500/20 text-blue-300"
                            }`}
                          >
                            {trx.unit}
                          </span>
                        </div>
                        {trx.studentNis && (
                          <div className="text-[11px] text-gray-400">
                            NIS: {highlightMatch(trx.studentNis)} • {trx.studentGrade}
                          </div>
                        )}
                      </td>

                      {/* 4. Jenis Pembayaran (for income) */}
                      <td className="py-3.5 px-4">
                        {isIncome ? (
                          <span className="font-bold text-emerald-300">
                            {highlightMatch(trx.category)}
                          </span>
                        ) : (
                          <span className="text-gray-500 font-bold">-</span>
                        )}
                      </td>

                      {/* 5. Jenis Pengeluaran (for expense) */}
                      <td className="py-3.5 px-4">
                        {!isIncome ? (
                          <span className="font-bold text-rose-300">
                            {highlightMatch(trx.category)}
                          </span>
                        ) : (
                          <span className="text-gray-500 font-bold">-</span>
                        )}
                      </td>

                      {/* 6. Deskripsi */}
                      <td className="py-3.5 px-5 max-w-xs truncate text-gray-300 text-[11px]" title={trx.description}>
                        {highlightMatch(trx.description || "-")}
                        <div className="text-[10px] text-gray-500">Opr: {trx.operatorName}</div>
                      </td>

                      {/* 7. Nominal Pendapatan */}
                      <td className="py-3.5 px-4 text-right font-black whitespace-nowrap text-emerald-400">
                        {isIncome ? `+ Rp ${trx.amount.toLocaleString("id-ID")}` : "-"}
                      </td>

                      {/* 8. Nominal Pengeluaran */}
                      <td className="py-3.5 px-4 text-right font-black whitespace-nowrap text-rose-400">
                        {!isIncome ? `- Rp ${trx.amount.toLocaleString("id-ID")}` : "-"}
                      </td>

                      {/* 9. Saldo Akhir (Cyan Highlighted) */}
                      <td className="py-3.5 px-5 text-right font-black whitespace-nowrap text-cyan-300 bg-cyan-950/20 border-x border-cyan-500/20">
                        Rp {trx.runningBalance.toLocaleString("id-ID")}
                      </td>

                      {/* 10. Nota & Audit */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        {trx.receiptUrl ? (
                          <button
                            onClick={() =>
                              setActivePreviewReceipt({
                                url: trx.receiptUrl!,
                                name: trx.receiptName || "Nota_Fisik.jpg",
                                refNo: trx.referenceNo,
                                hash: trx.auditHash,
                              })
                            }
                            className="px-2.5 py-1 rounded-lg bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold inline-flex items-center gap-1 cursor-pointer transition-colors"
                          >
                            <Eye className="w-3.5 h-3.5" />
                            <span>Nota</span>
                          </button>
                        ) : (
                          <span className="text-[10px] text-gray-500 flex items-center justify-center gap-1">
                            <ShieldCheck className="w-3 h-3 text-emerald-500" />
                            <span>Audit SHA-256</span>
                          </span>
                        )}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* RECEIPT PREVIEW LIGHTBOX MODAL */}
      <AnimatePresence>
        {activePreviewReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-2xl bg-[#161622] border border-cyan-500/40 rounded-2xl p-6 shadow-2xl relative overflow-hidden"
            >
              <div className="flex items-center justify-between pb-4 border-b border-white/10">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Receipt className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="text-base font-bold text-white">
                      Arsip Nota &amp; Bukti Kuitansi Digital
                    </h3>
                    <span className="text-xs font-mono text-cyan-400">
                      {activePreviewReceipt.refNo} • {activePreviewReceipt.name}
                    </span>
                  </div>
                </div>

                <button
                  onClick={() => setActivePreviewReceipt(null)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <div className="mt-4 max-h-[65vh] overflow-auto rounded-xl border border-white/10 bg-black/60 flex items-center justify-center p-2">
                <img
                  src={activePreviewReceipt.url}
                  alt={activePreviewReceipt.name}
                  className="max-h-[60vh] max-w-full rounded-lg object-contain shadow-2xl"
                />
              </div>

              <div className="mt-4 flex items-center justify-between text-xs">
                <span className="font-mono text-gray-400 text-[10px] truncate max-w-md">
                  {activePreviewReceipt.hash}
                </span>
                <button
                  onClick={() => setActivePreviewReceipt(null)}
                  className="px-4 py-2 rounded-xl bg-cyan-500 text-black font-bold text-xs hover:bg-cyan-400"
                >
                  Tutup Pratinjau
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
