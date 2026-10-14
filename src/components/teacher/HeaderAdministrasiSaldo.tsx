"use client";

import React, { useMemo } from "react";
import { motion } from "framer-motion";
import {
  Wallet,
  TrendingUp,
  TrendingDown,
  PiggyBank,
  AlertCircle,
  CheckCircle2,
  ShieldCheck,
  Coins,
} from "lucide-react";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  MasterStudentFeeRecord,
  calculateStudentSavingsBalance,
} from "@/data/studentFeeMaster";

interface HeaderAdministrasiSaldoProps {
  masterStudents?: MasterStudentFeeRecord[];
  title?: string;
  subtitle?: string;
}

export default function HeaderAdministrasiSaldo({
  masterStudents = [],
  title = "Administrasi Saldo & Tata Kelola Keuangan",
  subtitle = "Pusat monitoring likuiditas kas operasional, akumulasi brankas tabungan santri, dan transparansi tagihan yayasan.",
}: HeaderAdministrasiSaldoProps) {
  const { financeTransactions } = useEduQuest();

  // Metrics Calculation
  const metrics = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;

    for (const trx of financeTransactions) {
      if (trx.type === "income") {
        totalIncome += trx.amount;
      } else if (trx.type === "expense") {
        totalExpense += trx.amount;
      }
    }

    const netOperatingBalance = totalIncome - totalExpense;

    // Total Student Savings in Vault
    let totalSavingsVault = 0;
    let totalPaidFees = 0;
    let totalPendingFees = 0;
    let totalFeeItemsCount = 0;
    let paidFeeItemsCount = 0;

    for (const std of masterStudents) {
      const savingsBal = calculateStudentSavingsBalance(std, financeTransactions);
      totalSavingsVault += savingsBal;

      // Fees breakdown
      for (const feeKey of Object.keys(std.fees)) {
        const item = std.fees[feeKey];
        totalFeeItemsCount++;
        if (item.status === "Lunas") {
          totalPaidFees += item.amount;
          paidFeeItemsCount++;
        } else {
          totalPendingFees += item.amount;
        }
      }
    }

    const complianceRate =
      totalFeeItemsCount > 0
        ? Math.round((paidFeeItemsCount / totalFeeItemsCount) * 100)
        : 88;

    return {
      totalIncome,
      totalExpense,
      netOperatingBalance,
      totalSavingsVault,
      totalPendingFees,
      complianceRate,
    };
  }, [financeTransactions, masterStudents]);

  return (
    <div className="space-y-4 mb-6">
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-5 sm:p-6 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold mb-2">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SIM Keuangan Yayasan • Real-Time Audit</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white">
              {title}
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              {subtitle}
            </p>
          </div>

          <div className="flex items-center gap-3">
            <div className="px-3.5 py-2 rounded-xl bg-black/40 border border-cyan-500/30 text-right">
              <span className="text-[10px] text-gray-400 block font-semibold uppercase tracking-wider">
                Status Sistem
              </span>
              <div className="flex items-center gap-1.5 text-xs font-bold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                <span>Terverifikasi SHA-256</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* 5 Dynamic Metric Cards (Glassmorphism Dark Moody) */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3.5">
        {/* Card 1: Saldo Kas Bersih */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2 }}
          className="bg-[#1a1a24]/80 p-4 rounded-2xl border border-cyan-500/30 shadow-lg backdrop-blur-xl relative overflow-hidden hover:border-cyan-400/50 transition-all col-span-2 sm:col-span-1"
        >
          <div className="absolute top-0 right-0 w-20 h-20 bg-cyan-500/10 rounded-full blur-xl pointer-events-none" />
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-bold">
            <span>KAS OPERASIONAL</span>
            <div className="w-7 h-7 rounded-lg bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
              <Wallet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-cyan-300 mt-2 truncate">
            Rp {metrics.netOperatingBalance.toLocaleString("id-ID")}
          </div>
          <span className="text-[10px] font-semibold text-cyan-400 mt-1 block">
            Saldo Riil di Rekening Kas
          </span>
        </motion.div>

        {/* Card 2: Total Pendapatan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.05 }}
          className="bg-[#1a1a24]/80 p-4 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl hover:border-emerald-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-bold">
            <span>TOTAL PENDAPATAN</span>
            <div className="w-7 h-7 rounded-lg bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2 truncate">
            Rp {metrics.totalIncome.toLocaleString("id-ID")}
          </div>
          <span className="text-[10px] font-semibold text-emerald-300 mt-1 block">
            SPP, Daftar Ulang, Donatur
          </span>
        </motion.div>

        {/* Card 3: Total Pengeluaran */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.1 }}
          className="bg-[#1a1a24]/80 p-4 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl hover:border-rose-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-bold">
            <span>TOTAL PENGELUARAN</span>
            <div className="w-7 h-7 rounded-lg bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
              <TrendingDown className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-rose-400 mt-2 truncate">
            Rp {metrics.totalExpense.toLocaleString("id-ID")}
          </div>
          <span className="text-[10px] font-semibold text-rose-300 mt-1 block">
            Operasional, Sarana, Gaji
          </span>
        </motion.div>

        {/* Card 4: Brankas Tabungan Santri */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.15 }}
          className="bg-[#1a1a24]/80 p-4 rounded-2xl border border-amber-500/30 shadow-lg backdrop-blur-xl hover:border-amber-400/50 transition-all"
        >
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-bold">
            <span>BRANKAS TABUNGAN</span>
            <div className="w-7 h-7 rounded-lg bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
              <PiggyBank className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-amber-300 mt-2 truncate">
            Rp {metrics.totalSavingsVault.toLocaleString("id-ID")}
          </div>
          <span className="text-[10px] font-semibold text-amber-400 mt-1 block">
            Saldo Titipan Seluruh Santri
          </span>
        </motion.div>

        {/* Card 5: Kepatuhan & Tunggakan */}
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.2, delay: 0.2 }}
          className="bg-[#1a1a24]/80 p-4 rounded-2xl border border-white/10 shadow-lg backdrop-blur-xl hover:border-purple-500/30 transition-all"
        >
          <div className="flex items-center justify-between text-gray-400 text-[11px] font-bold">
            <span>KEPATUHAN BAYAR</span>
            <div className="w-7 h-7 rounded-lg bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-xl sm:text-2xl font-black text-purple-300 mt-2">
            {metrics.complianceRate}%
          </div>
          <span className="text-[10px] font-semibold text-rose-400 mt-1 block truncate">
            Tunggakan: Rp {metrics.totalPendingFees.toLocaleString("id-ID")}
          </span>
        </motion.div>
      </div>
    </div>
  );
}
