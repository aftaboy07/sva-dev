"use client";

import React, { useState, useRef, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import { FinanceTransaction } from "@/types";
import {
  Receipt,
  DollarSign,
  TrendingUp,
  TrendingDown,
  ShieldCheck,
  FileSpreadsheet,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  Eye,
  Download,
  Search,
  Calendar,
  Building,
  Printer,
  X,
  FileCheck,
  Lock,
  ArrowUpRight,
  ArrowDownRight,
  Trash2,
  UserCheck,
  ChevronRight,
  Filter,
  Wallet,
  PiggyBank,
  Landmark,
  ArrowRightLeft,
  Coins,
  CreditCard,
  Sparkles,
} from "lucide-react";

// 21 Jenis Pembayaran Resmi Pemasukan Santri
const PAYMENT_TYPES_PEMASUKAN = [
  "Daftar Ulang",
  "Seragam",
  "LKS Sem 1",
  "LKS Sem 2",
  "Pembayaran UTS",
  "Pembayaran UAS",
  "Badge",
  "Buku Tabungan",
  "Karnaval",
  "SPP Juli",
  "SPP Agustus",
  "SPP September",
  "SPP Oktober",
  "SPP November",
  "SPP Desember",
  "SPP Januari",
  "SPP Februari",
  "SPP Maret",
  "SPP April",
  "SPP Mei",
  "SPP Juni",
] as const;

// Kategori Resmi Pengeluaran Operasional
const EXPENSE_TYPES_PENGELUARAN = [
  "Transportasi",
  "Iuran Rapat",
  "Kebutuhan Sekolah",
  "Konsumsi",
  "Listrik",
  "PDAM",
  "Internet & Wi-Fi",
  "Pemeliharaan Sarana",
  "dll.",
] as const;

// Rekomendasi Nominal Standar (Dapat disesuaikan oleh Operator)
const DEFAULT_PEMASUKAN_AMOUNTS: Record<string, number> = {
  "Daftar Ulang": 1500000,
  "Seragam": 450000,
  "LKS Sem 1": 120000,
  "LKS Sem 2": 120000,
  "Pembayaran UTS": 75000,
  "Pembayaran UAS": 75000,
  "Badge": 25000,
  "Buku Tabungan": 20000,
  "Karnaval": 50000,
  "SPP Juli": 350000,
  "SPP Agustus": 350000,
  "SPP September": 350000,
  "SPP Oktober": 350000,
  "SPP November": 350000,
  "SPP Desember": 350000,
  "SPP Januari": 350000,
  "SPP Februari": 350000,
  "SPP Maret": 350000,
  "SPP April": 350000,
  "SPP Mei": 350000,
  "SPP Juni": 350000,
};

export default function TabOperatorFinanceTransparency() {
  const {
    currentUser,
    financeTransactions,
    addFinanceTransaction,
    studentRecords,
    theme,
  } = useEduQuest();

  const isDark = theme !== "bright";

  // Top Controller: View 1 (Form Input) vs View 2 (Buku Kas & Rekap)
  const [activeMainView, setActiveMainView] = useState<"form" | "ledger">("ledger");

  // View 1 Internal Tab: 3 Core Transaction Types (Pemasukan, Pengeluaran, Tabungan)
  const [formTab, setFormTab] = useState<"income" | "expense" | "savings">("income");

  // View 2 Internal Tab: 2 Dedicated Sections
  // "daily_ledger": Rekap Harian Pemasukan & Pengeluaran (Combined Unified Table)
  // "savings": Buku Tabungan Santri (Dedicated Tab)
  const [recapTab, setRecapTab] = useState<"daily_ledger" | "savings">("daily_ledger");

  // ==========================================
  // TAB A: PEMASUKAN STATES
  // ==========================================
  const [incomeStudentSearch, setIncomeStudentSearch] = useState("");
  const [isIncomeStudentDropdownOpen, setIsIncomeStudentDropdownOpen] = useState(false);
  const [selectedIncomeStudent, setSelectedIncomeStudent] = useState<{
    id: string;
    name: string;
    nis: string;
    grade: string;
    avatar?: string;
  } | null>(null);

  const [incomeForm, setIncomeForm] = useState({
    paymentType: PAYMENT_TYPES_PEMASUKAN[0] as string,
    amount: "1.500.000",
    unit: "MTs" as "Yayasan" | "RA" | "SD" | "MTs",
    date: new Date().toISOString().split("T")[0],
    description: "",
    receiptUrl: "",
    receiptName: "",
    receiptSize: "",
  });

  // ==========================================
  // TAB B: PENGELUARAN STATES
  // ==========================================
  const [expenseForm, setExpenseForm] = useState({
    expenseType: EXPENSE_TYPES_PENGELUARAN[0] as string,
    description: "",
    amount: "",
    unit: "Yayasan" as "Yayasan" | "RA" | "SD" | "MTs",
    date: new Date().toISOString().split("T")[0],
    receiptUrl: "",
    receiptName: "",
    receiptSize: "",
  });

  // ==========================================
  // TAB C: TABUNGAN STATES
  // ==========================================
  const [savingsStudentSearch, setSavingsStudentSearch] = useState("");
  const [isSavingsStudentDropdownOpen, setIsSavingsStudentDropdownOpen] = useState(false);
  const [selectedSavingsStudent, setSelectedSavingsStudent] = useState<{
    id: string;
    name: string;
    nis: string;
    grade: string;
    avatar?: string;
  } | null>(null);

  const [savingsForm, setSavingsForm] = useState({
    savingsType: "deposit" as "deposit" | "withdraw",
    amount: "50.000",
    unit: "MTs" as "Yayasan" | "RA" | "SD" | "MTs",
    date: new Date().toISOString().split("T")[0],
    description: "",
  });

  // ==========================================
  // VIEW 2 FILTERS & SEARCH
  // ==========================================
  const [ledgerSearch, setLedgerSearch] = useState("");
  const [ledgerUnitFilter, setLedgerUnitFilter] = useState<"all" | "Yayasan" | "RA" | "SD" | "MTs">("all");
  const [savingsMutationFilter, setSavingsMutationFilter] = useState<"all" | "deposit" | "withdraw">("all");

  // Notifications & Modals
  const [feedbackMessage, setFeedbackMessage] = useState<{
    type: "success" | "error";
    text: string;
  } | null>(null);
  const [previewReceipt, setPreviewReceipt] = useState<FinanceTransaction | null>(null);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format IDR Helper
  const formatIDR = (val: number) => {
    return new Intl.NumberFormat("id-ID", {
      style: "currency",
      currency: "IDR",
      maximumFractionDigits: 0,
    }).format(val);
  };

  // ==========================================
  // COMPUTED STATS & STUDENT BALANCES
  // ==========================================

  // Per-student savings ledger calculation
  const studentSavingsBalances = useMemo(() => {
    const balances: Record<
      string,
      {
        studentId: string;
        name: string;
        nis: string;
        grade: string;
        unit: string;
        totalDeposit: number;
        totalWithdraw: number;
        currentBalance: number;
        lastTransactionDate: string;
        transactionCount: number;
      }
    > = {};

    financeTransactions.forEach((trx) => {
      if (trx.type === "savings") {
        const key = trx.studentNis || trx.studentName || trx.description;
        if (!balances[key]) {
          balances[key] = {
            studentId: trx.studentId || key,
            name: trx.studentName || "Santri",
            nis: trx.studentNis || "-",
            grade: trx.studentGrade || "-",
            unit: trx.unit,
            totalDeposit: 0,
            totalWithdraw: 0,
            currentBalance: 0,
            lastTransactionDate: trx.date,
            transactionCount: 0,
          };
        }

        balances[key].transactionCount += 1;
        balances[key].lastTransactionDate = trx.date;

        if (trx.savingsType === "withdraw") {
          balances[key].totalWithdraw += trx.amount;
          balances[key].currentBalance -= trx.amount;
        } else {
          balances[key].totalDeposit += trx.amount;
          balances[key].currentBalance += trx.amount;
        }
      }
    });

    return balances;
  }, [financeTransactions]);

  // Overall Financial Statistics
  const stats = useMemo(() => {
    let totalIncome = 0;
    let totalExpense = 0;
    let totalSavingsDeposit = 0;
    let totalSavingsWithdraw = 0;
    let verifiedReceiptsCount = 0;

    financeTransactions.forEach((trx) => {
      if (trx.type === "income") {
        totalIncome += trx.amount;
      } else if (trx.type === "expense") {
        totalExpense += trx.amount;
      } else if (trx.type === "savings") {
        if (trx.savingsType === "withdraw") {
          totalSavingsWithdraw += trx.amount;
        } else {
          totalSavingsDeposit += trx.amount;
        }
      }

      if (trx.receiptUrl) {
        verifiedReceiptsCount += 1;
      }
    });

    const totalSavingsBalance = totalSavingsDeposit - totalSavingsWithdraw;
    const netBalance = totalIncome - totalExpense;
    const auditIntegrityRate =
      financeTransactions.length > 0
        ? Math.round((verifiedReceiptsCount / financeTransactions.length) * 100)
        : 100;

    return {
      totalIncome,
      totalExpense,
      totalSavingsDeposit,
      totalSavingsWithdraw,
      totalSavingsBalance,
      netBalance,
      transactionCount: financeTransactions.length,
      verifiedReceiptsCount,
      auditIntegrityRate,
      activeSaversCount: Object.keys(studentSavingsBalances).length,
    };
  }, [financeTransactions, studentSavingsBalances]);

  // Autocomplete Filter for Pemasukan
  const filteredIncomeStudents = useMemo(() => {
    if (!incomeStudentSearch.trim()) {
      return studentRecords.slice(0, 6);
    }
    return studentRecords.filter(
      (s) =>
        s.name.toLowerCase().includes(incomeStudentSearch.toLowerCase()) ||
        s.nis.toLowerCase().includes(incomeStudentSearch.toLowerCase()) ||
        s.grade.toLowerCase().includes(incomeStudentSearch.toLowerCase())
    );
  }, [studentRecords, incomeStudentSearch]);

  // Autocomplete Filter for Tabungan
  const filteredSavingsStudents = useMemo(() => {
    if (!savingsStudentSearch.trim()) {
      return studentRecords.slice(0, 6);
    }
    return studentRecords.filter(
      (s) =>
        s.name.toLowerCase().includes(savingsStudentSearch.toLowerCase()) ||
        s.nis.toLowerCase().includes(savingsStudentSearch.toLowerCase()) ||
        s.grade.toLowerCase().includes(savingsStudentSearch.toLowerCase())
    );
  }, [studentRecords, savingsStudentSearch]);

  // Selected student savings live balance
  const activeStudentSavingsData = useMemo(() => {
    if (!selectedSavingsStudent) return null;
    const key = selectedSavingsStudent.nis || selectedSavingsStudent.name;
    return studentSavingsBalances[key] || {
      currentBalance: 0,
      totalDeposit: 0,
      totalWithdraw: 0,
      transactionCount: 0,
    };
  }, [selectedSavingsStudent, studentSavingsBalances]);

  // =========================================================================
  // COMBINED DAILY LEDGER: UNIFIED PEMASUKAN & PENGELUARAN WITH RUNNING BALANCE
  // =========================================================================
  const chronologicalCashFlow = useMemo(() => {
    // Filter only income and expense transactions that constitute the liquid daily cash ledger
    const list = financeTransactions
      .filter((t) => t.type === "income" || t.type === "expense")
      .slice()
      .sort((a, b) => {
        const dateDiff = new Date(a.date).getTime() - new Date(b.date).getTime();
        if (dateDiff !== 0) return dateDiff;
        return a.referenceNo.localeCompare(b.referenceNo);
      });

    let currentBalance = 0;
    const withRunningBalance = list.map((trx, idx) => {
      if (trx.type === "income") {
        currentBalance += trx.amount;
      } else {
        currentBalance -= trx.amount;
      }

      return {
        ...trx,
        rowNumber: idx + 1,
        runningBalance: currentBalance,
      };
    });

    // Reverse for UI table display (newest transactions at the top)
    return withRunningBalance.reverse();
  }, [financeTransactions]);

  // Filtered Combined Daily Ledger
  const filteredDailyLedger = useMemo(() => {
    return chronologicalCashFlow.filter((trx) => {
      const matchSearch =
        trx.referenceNo.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        trx.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        trx.category.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        (trx.studentName && trx.studentName.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
        (trx.studentNis && trx.studentNis.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
        trx.operatorName.toLowerCase().includes(ledgerSearch.toLowerCase());

      const matchUnit = ledgerUnitFilter === "all" || trx.unit === ledgerUnitFilter;
      return matchSearch && matchUnit;
    });
  }, [chronologicalCashFlow, ledgerSearch, ledgerUnitFilter]);

  // Filtered Savings Transactions for the Dedicated Tab
  const savingsTransactions = useMemo(() => {
    return financeTransactions.filter((trx) => {
      if (trx.type !== "savings") return false;
      const matchSearch =
        trx.referenceNo.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        trx.description.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        trx.category.toLowerCase().includes(ledgerSearch.toLowerCase()) ||
        (trx.studentName && trx.studentName.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
        (trx.studentNis && trx.studentNis.toLowerCase().includes(ledgerSearch.toLowerCase())) ||
        trx.operatorName.toLowerCase().includes(ledgerSearch.toLowerCase());

      const matchUnit = ledgerUnitFilter === "all" || trx.unit === ledgerUnitFilter;
      const matchMutation =
        savingsMutationFilter === "all" || trx.savingsType === savingsMutationFilter;

      return matchSearch && matchUnit && matchMutation;
    });
  }, [financeTransactions, ledgerSearch, ledgerUnitFilter, savingsMutationFilter]);

  // ==========================================
  // EVENT HANDLERS
  // ==========================================

  // Select student for Income
  const handleSelectIncomeStudent = (student: typeof selectedIncomeStudent) => {
    setSelectedIncomeStudent(student);
    setIsIncomeStudentDropdownOpen(false);
    setIncomeStudentSearch(student?.name || "");

    if (student?.grade.includes("RA")) {
      setIncomeForm((prev) => ({ ...prev, unit: "RA" }));
    } else if (student?.grade.includes("SD")) {
      setIncomeForm((prev) => ({ ...prev, unit: "SD" }));
    } else if (student?.grade.includes("MTs")) {
      setIncomeForm((prev) => ({ ...prev, unit: "MTs" }));
    }
  };

  // Select student for Savings
  const handleSelectSavingsStudent = (student: typeof selectedSavingsStudent) => {
    setSelectedSavingsStudent(student);
    setIsSavingsStudentDropdownOpen(false);
    setSavingsStudentSearch(student?.name || "");

    if (student?.grade.includes("RA")) {
      setSavingsForm((prev) => ({ ...prev, unit: "RA" }));
    } else if (student?.grade.includes("SD")) {
      setSavingsForm((prev) => ({ ...prev, unit: "SD" }));
    } else if (student?.grade.includes("MTs")) {
      setSavingsForm((prev) => ({ ...prev, unit: "MTs" }));
    }
  };

  // Change payment type & suggest default amount
  const handlePaymentTypeChange = (type: string) => {
    const suggested = DEFAULT_PEMASUKAN_AMOUNTS[type];
    setIncomeForm((prev) => ({
      ...prev,
      paymentType: type,
      amount: suggested ? suggested.toLocaleString("id-ID") : prev.amount,
    }));
  };

  // File Upload Processor
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>, targetForm: "income" | "expense") => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      const sizeInMB = (file.size / (1024 * 1024)).toFixed(1);

      if (targetForm === "income") {
        setIncomeForm((prev) => ({
          ...prev,
          receiptUrl: result,
          receiptName: file.name,
          receiptSize: `${sizeInMB} MB`,
        }));
      } else {
        setExpenseForm((prev) => ({
          ...prev,
          receiptUrl: result,
          receiptName: file.name,
          receiptSize: `${sizeInMB} MB`,
        }));
      }
    };
    reader.readAsDataURL(file);
  };

  // Mock Receipt Attachment
  const handleAttachMockReceipt = (targetForm: "income" | "expense") => {
    const mockUrl =
      targetForm === "income"
        ? "https://images.unsplash.com/photo-1554224155-6726b3ff858f?w=800&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1607344645866-009c320c5ab8?w=800&auto=format&fit=crop&q=80";

    const mockName =
      targetForm === "income"
        ? "Bukti_Setor_Kasir_SPP.jpg"
        : "Nota_Fisik_Pengeluaran_Sekolah.jpg";

    if (targetForm === "income") {
      setIncomeForm((prev) => ({
        ...prev,
        receiptUrl: mockUrl,
        receiptName: mockName,
        receiptSize: "1.4 MB",
      }));
    } else {
      setExpenseForm((prev) => ({
        ...prev,
        receiptUrl: mockUrl,
        receiptName: mockName,
        receiptSize: "2.1 MB",
      }));
    }
  };

  // 1. Submit Pemasukan (Student Payment)
  const handleSubmitIncome = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    const studentName = selectedIncomeStudent?.name || incomeStudentSearch.trim();
    if (!studentName) {
      setFeedbackMessage({
        type: "error",
        text: "Harap pilih atau masukkan nama santri/siswa pembayar.",
      });
      return;
    }

    const parsedAmount = parseFloat(incomeForm.amount.replace(/\D/g, ""));
    if (!parsedAmount || parsedAmount <= 0) {
      setFeedbackMessage({
        type: "error",
        text: "Nominal pembayaran harus lebih besar dari Rp 0.",
      });
      return;
    }

    const studentInfo = selectedIncomeStudent
      ? `${selectedIncomeStudent.name} (${selectedIncomeStudent.nis} - ${selectedIncomeStudent.grade})`
      : studentName;

    const fullDesc = incomeForm.description.trim()
      ? `Pembayaran ${incomeForm.paymentType} a.n. ${studentInfo}. Catatan: ${incomeForm.description.trim()}`
      : `Pembayaran ${incomeForm.paymentType} santri a.n. ${studentInfo}`;

    const created = addFinanceTransaction({
      type: "income",
      category: incomeForm.paymentType,
      amount: parsedAmount,
      description: fullDesc,
      operatorName: currentUser?.name || "Azidni Taftazani A.I",
      date: incomeForm.date,
      unit: incomeForm.unit,
      studentId: selectedIncomeStudent?.id,
      studentName,
      studentNis: selectedIncomeStudent?.nis,
      studentGrade: selectedIncomeStudent?.grade,
      receiptUrl: incomeForm.receiptUrl || undefined,
      receiptName: incomeForm.receiptName || undefined,
      receiptSize: incomeForm.receiptSize || undefined,
    });

    setFeedbackMessage({
      type: "success",
      text: `Pemasukan berhasil dibukukan! Ref: ${created.referenceNo} (${formatIDR(parsedAmount)} a.n. ${studentName})`,
    });

    // Reset Form
    setSelectedIncomeStudent(null);
    setIncomeStudentSearch("");
    setIncomeForm((prev) => ({
      ...prev,
      description: "",
      receiptUrl: "",
      receiptName: "",
      receiptSize: "",
    }));
  };

  // 2. Submit Pengeluaran (Expense)
  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    const parsedAmount = parseFloat(expenseForm.amount.replace(/\D/g, ""));
    if (!parsedAmount || parsedAmount <= 0) {
      setFeedbackMessage({
        type: "error",
        text: "Nominal pengeluaran harus lebih besar dari Rp 0.",
      });
      return;
    }

    const fullDesc = expenseForm.description.trim()
      ? `${expenseForm.expenseType}: ${expenseForm.description.trim()}`
      : `Biaya operasional ${expenseForm.expenseType}`;

    const created = addFinanceTransaction({
      type: "expense",
      category: expenseForm.expenseType,
      amount: parsedAmount,
      description: fullDesc,
      operatorName: currentUser?.name || "Azidni Taftazani A.I",
      date: expenseForm.date,
      unit: expenseForm.unit,
      receiptUrl: expenseForm.receiptUrl || undefined,
      receiptName: expenseForm.receiptName || undefined,
      receiptSize: expenseForm.receiptSize || undefined,
    });

    setFeedbackMessage({
      type: "success",
      text: `Pengeluaran ${created.referenceNo} berhasil dicatat! Total: ${formatIDR(parsedAmount)} (${expenseForm.expenseType})`,
    });

    // Reset Form
    setExpenseForm((prev) => ({
      ...prev,
      description: "",
      amount: "",
      receiptUrl: "",
      receiptName: "",
      receiptSize: "",
    }));
  };

  // 3. Submit Tabungan (Savings Deposit / Withdraw)
  const handleSubmitSavings = (e: React.FormEvent) => {
    e.preventDefault();
    setFeedbackMessage(null);

    const studentName = selectedSavingsStudent?.name || savingsStudentSearch.trim();
    if (!studentName) {
      setFeedbackMessage({
        type: "error",
        text: "Harap pilih atau masukkan nama santri pemilik rekening tabungan.",
      });
      return;
    }

    const parsedAmount = parseFloat(savingsForm.amount.replace(/\D/g, ""));
    if (!parsedAmount || parsedAmount <= 0) {
      setFeedbackMessage({
        type: "error",
        text: "Nominal tabungan harus lebih besar dari Rp 0.",
      });
      return;
    }

    const isDeposit = savingsForm.savingsType === "deposit";
    const currentBalance = activeStudentSavingsData?.currentBalance || 0;

    // Check withdrawal ceiling
    if (!isDeposit && parsedAmount > currentBalance) {
      if (!confirm(`Perhatian: Nominal penarikan (${formatIDR(parsedAmount)}) melebihi saldo tabungan saat ini (${formatIDR(currentBalance)}). Lanjutkan pembukuan khusus?`)) {
        return;
      }
    }

    const studentNis = selectedSavingsStudent?.nis || "NIS-MANUAL";
    const studentGrade = selectedSavingsStudent?.grade || "Umum";

    const fullDesc = savingsForm.description.trim()
      ? `${isDeposit ? "Setor Tabungan" : "Tarik Tabungan"} a.n. ${studentName} (${studentNis} - ${studentGrade}). Catatan: ${savingsForm.description.trim()}`
      : `${isDeposit ? "Setoran" : "Penarikan"} tabungan santri a.n. ${studentName} (${studentNis} - ${studentGrade})`;

    const created = addFinanceTransaction({
      type: "savings",
      savingsType: savingsForm.savingsType,
      studentId: selectedSavingsStudent?.id || `std-${Date.now()}`,
      studentName,
      studentNis,
      studentGrade,
      category: isDeposit ? "Setor Tabungan" : "Tarik Tabungan",
      amount: parsedAmount,
      description: fullDesc,
      operatorName: currentUser?.name || "Azidni Taftazani A.I",
      date: savingsForm.date,
      unit: savingsForm.unit,
    });

    setFeedbackMessage({
      type: "success",
      text: `Mutasi Tabungan (${isDeposit ? "Setoran +" : "Penarikan -"}) ${created.referenceNo} berhasil dibukukan! Nominal: ${formatIDR(parsedAmount)} a.n. ${studentName}`,
    });

    // Reset Form
    setSavingsForm((prev) => ({
      ...prev,
      description: "",
      amount: "50.000",
    }));
  };

  // Comprehensive Printable PDF Report Action (Mirroring Unified Google Sheets Format)
  const handlePrintPDFReport = () => {
    const printWindow = window.open("", "_blank");
    if (!printWindow) {
      alert("Harap izinkan pop-up peramban untuk mencetak atau mengunduh laporan PDF.");
      return;
    }

    const reportHtml = `
      <!DOCTYPE html>
      <html>
        <head>
          <title>Buku Kas Harian & Rekap Transparansi Keuangan Yayasan</title>
          <style>
            body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; color: #1e293b; padding: 24px; font-size: 10.5px; }
            .header { border-bottom: 2px solid #0284c7; padding-bottom: 12px; margin-bottom: 20px; display: flex; justify-content: space-between; align-items: center; }
            .title { font-size: 18px; font-weight: 900; color: #0f172a; text-transform: uppercase; margin: 0; }
            .subtitle { font-size: 12px; color: #64748b; margin: 2px 0 0 0; }
            .stats-grid { display: grid; grid-template-columns: repeat(4, 1fr); gap: 12px; margin-bottom: 20px; }
            .stat-box { border: 1px solid #cbd5e1; border-radius: 8px; padding: 10px; background: #f8fafc; }
            .stat-label { font-size: 10px; font-weight: bold; text-transform: uppercase; color: #64748b; }
            .stat-val { font-size: 15px; font-weight: 800; margin-top: 4px; }
            .section-title { font-size: 13px; font-weight: 800; text-transform: uppercase; color: #0369a1; border-bottom: 1px solid #cbd5e1; padding-bottom: 4px; margin: 24px 0 8px 0; }
            table { width: 100%; border-collapse: collapse; margin-bottom: 20px; font-size: 10px; }
            th { background: #f1f5f9; color: #334155; font-weight: 700; text-align: left; padding: 6px 8px; border: 1px solid #cbd5e1; }
            td { padding: 6px 8px; border: 1px solid #cbd5e1; }
            .text-right { text-align: right; }
            .text-center { text-align: center; }
            .income { color: #16a34a; font-weight: bold; }
            .expense { color: #dc2626; font-weight: bold; }
            .balance { color: #0284c7; font-weight: bold; }
            .footer-signatures { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; text-align: center; margin-top: 40px; page-break-inside: avoid; }
            .sign-box { border-top: 1px solid #94a3b8; padding-top: 8px; }
            .sign-space { height: 50px; }
          </style>
        </head>
        <body>
          <div class="header">
            <div>
              <h1 class="title">YAYASAN PENDIDIKAN ISLAM AS SA'ADAH</h1>
              <p class="subtitle">Buku Kas Harian &amp; Lembar Rekapitulasi Kasir / Operator Terverifikasi</p>
            </div>
            <div style="text-align: right; font-size: 10px; color: #64748b;">
              Tanggal Cetak: ${new Date().toLocaleDateString("id-ID", { dateStyle: "full" })}<br/>
              Status Audit: <strong>AUDITED (SHA-256)</strong>
            </div>
          </div>

          <div class="stats-grid">
            <div class="stat-box">
              <div class="stat-label">Total Pemasukan</div>
              <div class="stat-val" style="color: #16a34a;">${formatIDR(stats.totalIncome)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Pengeluaran</div>
              <div class="stat-val" style="color: #dc2626;">${formatIDR(stats.totalExpense)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Saldo Kas Bersih</div>
              <div class="stat-val" style="color: #0284c7;">${formatIDR(stats.netBalance)}</div>
            </div>
            <div class="stat-box">
              <div class="stat-label">Total Tabungan Santri</div>
              <div class="stat-val" style="color: #d97706;">${formatIDR(stats.totalSavingsBalance)}</div>
            </div>
          </div>

          <div class="section-title">Rekap Harian Kas (Pemasukan, Pengeluaran &amp; Saldo Akhir)</div>
          <table>
            <thead>
              <tr>
                <th>No. Ref</th>
                <th>Tanggal / Waktu</th>
                <th>Nama Siswa / Pembayar</th>
                <th>Jenis Pembayaran</th>
                <th>Jenis Pengeluaran</th>
                <th>Deskripsi</th>
                <th class="text-right">Pemasukan (IDR)</th>
                <th class="text-right">Pengeluaran (IDR)</th>
                <th class="text-right">Saldo Akhir (IDR)</th>
                <th class="text-center">Audit</th>
              </tr>
            </thead>
            <tbody>
              ${filteredDailyLedger
                .map(
                  (trx) => `
                  <tr>
                    <td style="font-family: monospace; font-weight: bold;">${trx.referenceNo}</td>
                    <td>${trx.date} • ${trx.timestamp}</td>
                    <td><strong>${trx.studentName || (trx.type === "income" ? "Yayasan / Umum" : "-")}</strong></td>
                    <td>${trx.type === "income" ? `<span style="color:#16a34a;font-weight:bold;">${trx.category}</span>` : "-"}</td>
                    <td>${trx.type === "expense" ? `<span style="color:#dc2626;font-weight:bold;">${trx.category}</span>` : "-"}</td>
                    <td>${trx.description || "-"}</td>
                    <td class="text-right income">${trx.type === "income" ? `+ ${formatIDR(trx.amount)}` : "-"}</td>
                    <td class="text-right expense">${trx.type === "expense" ? `- ${formatIDR(trx.amount)}` : "-"}</td>
                    <td class="text-right balance">${formatIDR(trx.runningBalance)}</td>
                    <td class="text-center"><strong style="color: #15803d;">AUDITED</strong></td>
                  </tr>
                `
                )
                .join("")}
            </tbody>
          </table>

          <div class="footer-signatures">
            <div class="sign-box">
              <p>Mengetahui,<br/><strong>Ketua Dewan Pembina</strong></p>
              <div class="sign-space"></div>
              <p><strong>KH. Mahmud Ridwan, Lc., M.A.</strong></p>
            </div>
            <div class="sign-box">
              <p>Verifikator,<br/><strong>Bendahara Yayasan</strong></p>
              <div class="sign-space"></div>
              <p><strong>Hj. Maryam Sholihat, S.E.</strong></p>
            </div>
            <div class="sign-box">
              <p>Pencatat,<br/><strong>Operator Kasir &amp; SIM</strong></p>
              <div class="sign-space"></div>
              <p><strong>${currentUser?.name || "Azidni Taftazani A.I"}</strong></p>
            </div>
          </div>
        </body>
      </html>
    `;

    printWindow.document.open();
    printWindow.document.write(reportHtml);
    printWindow.document.close();
    setTimeout(() => {
      printWindow.focus();
      printWindow.print();
    }, 400);
  };

  return (
    <div className="space-y-6 text-white pb-16">
      {/* 1. TOP HEADER & MAIN VIEW SWITCHER */}
      <div
        className={`rounded-3xl p-6 sm:p-7 border shadow-2xl relative overflow-hidden backdrop-blur-xl transition-colors duration-500 ${
          isDark
            ? "bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#0f0f13] border-white/10 text-white"
            : "bg-white border-slate-200 text-slate-900 shadow-md"
        }`}
      >
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-400 text-xs font-bold mb-2.5">
              <ShieldCheck className="w-4 h-4 text-cyan-400" />
              <span>Modul Terpadu Tata Usaha &amp; Keuangan Yayasan</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-black tracking-tight flex items-center gap-2.5">
              <span>Buku Kas &amp; Rekap Harian Yayasan</span>
            </h1>
            <p
              className={`text-xs sm:text-sm mt-1.5 max-w-2xl leading-relaxed ${
                isDark ? "text-gray-300" : "text-slate-600"
              }`}
            >
              Format pembukuan harian gabungan (Pemasukan, Pengeluaran &amp; Saldo Akhir) sesuai standar spreadsheet resmi yayasan, serta pengelolaan buku tabungan santri.
            </p>
          </div>

          {/* View Switcher Pills */}
          <div
            className={`flex items-center p-1.5 rounded-2xl border backdrop-blur-md shadow-xl shrink-0 ${
              isDark ? "bg-black/60 border-white/15" : "bg-slate-100 border-slate-300"
            }`}
          >
            <button
              onClick={() => {
                setActiveMainView("form");
                setFeedbackMessage(null);
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeMainView === "form"
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                  : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <Receipt className="w-4 h-4" />
              <span>1. Form Input Transaksi</span>
            </button>

            <button
              onClick={() => {
                setActiveMainView("ledger");
                setFeedbackMessage(null);
              }}
              className={`px-4 sm:px-5 py-2.5 rounded-xl text-xs font-extrabold flex items-center gap-2 transition-all cursor-pointer ${
                activeMainView === "ledger"
                  ? "bg-cyan-500 text-black shadow-lg shadow-cyan-500/25"
                  : isDark
                  ? "text-gray-400 hover:text-white"
                  : "text-slate-600 hover:text-slate-900"
              }`}
            >
              <FileSpreadsheet className="w-4 h-4" />
              <span>2. Rekap Harian Spreadsheet</span>
              <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/30">
                {financeTransactions.length}
              </span>
            </button>
          </div>
        </div>
      </div>

      {/* Global Feedback Alert */}
      <AnimatePresence>
        {feedbackMessage && (
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            className={`p-4 rounded-2xl border text-xs font-semibold flex items-center justify-between shadow-xl ${
              feedbackMessage.type === "success"
                ? "bg-emerald-500/15 border-emerald-500/30 text-emerald-400"
                : "bg-rose-500/15 border-rose-500/30 text-rose-400"
            }`}
          >
            <div className="flex items-center gap-2.5">
              {feedbackMessage.type === "success" ? (
                <CheckCircle2 className="w-5 h-5 shrink-0" />
              ) : (
                <AlertCircle className="w-5 h-5 shrink-0" />
              )}
              <span>{feedbackMessage.text}</span>
            </div>
            <button
              onClick={() => setFeedbackMessage(null)}
              className="text-gray-400 hover:text-white cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ========================================================================= */}
      {/* VIEW 1: FORM INPUT TRANSAKSI (3 CORE TRANSACTION TYPES)                   */}
      {/* ========================================================================= */}
      {activeMainView === "form" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          <div
            className={`p-6 sm:p-8 rounded-3xl border shadow-2xl backdrop-blur-xl transition-colors duration-500 ${
              isDark
                ? "bg-[#1a1a24]/90 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* 3 Core Tabs Selector */}
            <div className="flex items-center justify-between pb-6 border-b border-white/10 mb-6 flex-wrap gap-4">
              <div>
                <h2 className="text-xl font-bold flex items-center gap-2">
                  <Receipt className="w-5 h-5 text-cyan-400" />
                  <span>Pencatatan Transaksi Keuangan</span>
                </h2>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  Pilih salah satu dari 3 modul pencatatan: Pemasukan Kasir, Pengeluaran Operasional, atau Mutasi Tabungan Santri.
                </p>
              </div>

              {/* 3-Tab Pills */}
              <div className="grid grid-cols-3 gap-1.5 sm:gap-2 bg-black/40 p-1.5 rounded-2xl border border-white/10 w-full sm:w-auto">
                <button
                  type="button"
                  onClick={() => {
                    setFormTab("income");
                    setFeedbackMessage(null);
                  }}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formTab === "income"
                      ? "bg-emerald-500 text-black font-extrabold shadow-lg shadow-emerald-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ArrowDownRight className="w-4 h-4" />
                  <span>Pemasukan</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormTab("expense");
                    setFeedbackMessage(null);
                  }}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formTab === "expense"
                      ? "bg-rose-500 text-white font-extrabold shadow-lg shadow-rose-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <ArrowUpRight className="w-4 h-4" />
                  <span>Pengeluaran</span>
                </button>

                <button
                  type="button"
                  onClick={() => {
                    setFormTab("savings");
                    setFeedbackMessage(null);
                  }}
                  className={`py-2 px-3 sm:px-4 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    formTab === "savings"
                      ? "bg-amber-500 text-black font-extrabold shadow-lg shadow-amber-500/20"
                      : "text-gray-400 hover:text-white"
                  }`}
                >
                  <PiggyBank className="w-4 h-4" />
                  <span>Tabungan</span>
                </button>
              </div>
            </div>

            {/* TAB 1: FORM PEMASUKAN */}
            {formTab === "income" && (
              <form onSubmit={handleSubmitIncome} className="space-y-6">
                {/* 1. Student Search Bar */}
                <div className="relative">
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDark ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    1. Cari Data Santri / Siswa Pembayar <span className="text-rose-400">*</span>
                  </label>

                  <div className="relative">
                    <Search className="w-4 h-4 text-cyan-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="Ketik nama santri, NIS, atau kelas (misal: NAURA SYARIFAH, 26091, Kelas 9)..."
                      value={incomeStudentSearch}
                      onChange={(e) => {
                        setIncomeStudentSearch(e.target.value);
                        setIsIncomeStudentDropdownOpen(true);
                      }}
                      onFocus={() => setIsIncomeStudentDropdownOpen(true)}
                      className={`w-full border rounded-2xl pl-11 pr-10 py-3 text-xs font-semibold transition-all focus:outline-hidden focus:border-cyan-500 ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white placeholder-gray-500"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      required
                    />

                    {incomeStudentSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setIncomeStudentSearch("");
                          setSelectedIncomeStudent(null);
                        }}
                        className="absolute right-3 top-3 p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown List */}
                  {isIncomeStudentDropdownOpen && (
                    <div
                      className={`absolute left-0 right-0 top-full mt-1.5 rounded-2xl border shadow-2xl z-30 max-h-60 overflow-y-auto backdrop-blur-xl ${
                        isDark
                          ? "bg-[#151520] border-white/20 text-white"
                          : "bg-white border-slate-300 text-slate-900 shadow-xl"
                      }`}
                    >
                      <div className="p-2 border-b border-white/10 text-[11px] text-gray-400 font-bold px-3">
                        Pilih santri dari database terverifikasi:
                      </div>

                      {filteredIncomeStudents.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">
                          <span>Santri tidak ditemukan di database.</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedIncomeStudent({
                                id: `custom-${Date.now()}`,
                                name: incomeStudentSearch,
                                nis: "NIS-MANUAL",
                                grade: "Unit Umum / Les",
                              });
                              setIsIncomeStudentDropdownOpen(false);
                            }}
                            className="block mx-auto mt-2 text-xs text-cyan-400 font-bold hover:underline"
                          >
                            + Gunakan "{incomeStudentSearch}" sebagai nama pembayar
                          </button>
                        </div>
                      ) : (
                        filteredIncomeStudents.map((std) => (
                          <div
                            key={std.id}
                            onClick={() => handleSelectIncomeStudent(std)}
                            className={`p-3 border-b border-white/5 flex items-center justify-between hover:bg-cyan-500/15 cursor-pointer transition-colors ${
                              selectedIncomeStudent?.id === std.id ? "bg-cyan-500/20" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-cyan-500/20 text-cyan-400 flex items-center justify-center font-bold text-xs border border-cyan-500/30">
                                {std.name.charAt(0)}
                              </div>
                              <div>
                                <strong className="text-xs text-white block">{std.name}</strong>
                                <span className="text-[10px] text-gray-400">
                                  NIS: {std.nis} • {std.grade}
                                </span>
                              </div>
                            </div>

                            <span className="text-[11px] text-cyan-400 font-semibold flex items-center gap-1">
                              <span>Pilih</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {/* Selected Student Card Badge */}
                  {selectedIncomeStudent && (
                    <div className="mt-2.5 p-3 rounded-xl bg-cyan-500/10 border border-cyan-500/30 flex items-center justify-between text-xs">
                      <div className="flex items-center gap-2.5">
                        <UserCheck className="w-4 h-4 text-cyan-400" />
                        <span>
                          Santri Terpilih: <strong className="text-white">{selectedIncomeStudent.name}</strong> (NIS: {selectedIncomeStudent.nis} • {selectedIncomeStudent.grade})
                        </span>
                      </div>
                      <span className="text-[10px] px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 font-bold">
                        Verified
                      </span>
                    </div>
                  )}
                </div>

                {/* 2. Jenis Pembayaran & Nominal Input */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      2. Jenis Pembayaran <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={incomeForm.paymentType}
                      onChange={(e) => handlePaymentTypeChange(e.target.value)}
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-bold transition-all focus:outline-hidden focus:border-cyan-500 cursor-pointer ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      {PAYMENT_TYPES_PEMASUKAN.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className={isDark ? "bg-[#1a1a24] text-white" : "bg-white text-slate-900"}
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Nominal Pemasukan (IDR) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-xs font-bold text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="Contoh: 350.000"
                        value={incomeForm.amount}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw
                            ? parseInt(raw, 10).toLocaleString("id-ID")
                            : "";
                          setIncomeForm((prev) => ({ ...prev, amount: formatted }));
                        }}
                        className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs font-extrabold tracking-wider transition-all focus:outline-hidden focus:border-cyan-500 ${
                          isDark
                            ? "bg-black/50 border-white/15 text-emerald-400 placeholder-gray-500"
                            : "bg-white border-slate-300 text-emerald-600"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* 3. Pilihan Unit Lembaga & Tanggal */}
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Unit Lembaga
                    </label>
                    <select
                      value={incomeForm.unit}
                      onChange={(e) =>
                        setIncomeForm((prev) => ({
                          ...prev,
                          unit: e.target.value as "Yayasan" | "RA" | "SD" | "MTs",
                        }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-medium transition-all focus:outline-hidden focus:border-cyan-500 cursor-pointer ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="MTs" className={isDark ? "bg-[#1a1a24]" : ""}>
                        MTs Sains Al-Qur'an
                      </option>
                      <option value="SD" className={isDark ? "bg-[#1a1a24]" : ""}>
                        SD Islam Terpadu
                      </option>
                      <option value="RA" className={isDark ? "bg-[#1a1a24]" : ""}>
                        RA Al-Qur'an
                      </option>
                      <option value="Yayasan" className={isDark ? "bg-[#1a1a24]" : ""}>
                        Yayasan Pusat
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Tanggal Pembayaran <span className="text-rose-400">*</span>
                    </label>
                    <input
                      type="date"
                      value={incomeForm.date}
                      onChange={(e) =>
                        setIncomeForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-medium transition-all focus:outline-hidden focus:border-cyan-500 ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>

                {/* 4. Deskripsi Catatan Tambahan (Opsional) */}
                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDark ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Catatan Tambahan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Titipan orang tua via transfer Bank Syariah / Pelunasan termin 1..."
                    value={incomeForm.description}
                    onChange={(e) =>
                      setIncomeForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className={`w-full border rounded-xl px-4 py-3 text-xs transition-all focus:outline-hidden focus:border-cyan-500 ${
                      isDark
                        ? "bg-black/50 border-white/15 text-white placeholder-gray-500"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                {/* 5. Bukti Slip / Kwitansi (Opsional) */}
                <div className="p-4 rounded-2xl bg-white/5 border border-white/10">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-cyan-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>Lampiran Slip / Kwitansi (Opsional)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAttachMockReceipt("income")}
                      className="text-[11px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      + Pasang Contoh Slip Cepat
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, "income")}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />

                  {incomeForm.receiptUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-emerald-500/40">
                      <div className="flex items-center gap-3">
                        <img
                          src={incomeForm.receiptUrl}
                          alt="Slip"
                          className="w-12 h-12 object-cover rounded-lg border border-white/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{incomeForm.receiptName || "Slip_Pembayaran_Santri.jpg"}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            Ukuran: {incomeForm.receiptSize || "1.2 MB"} • Terlampir
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setIncomeForm((prev) => ({
                            ...prev,
                            receiptUrl: "",
                            receiptName: "",
                            receiptSize: "",
                          }))
                        }
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold cursor-pointer hover:bg-rose-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-white/15 hover:border-cyan-400/60 rounded-xl p-4 text-center cursor-pointer bg-black/20 hover:bg-black/40 transition-all flex items-center justify-center gap-2"
                    >
                      <Upload className="w-4 h-4 text-cyan-400" />
                      <span className="text-xs text-gray-300">
                        Klik untuk unggah foto bukti transfer atau kwitansi fisik
                      </span>
                    </div>
                  )}
                </div>

                {/* Submit Action Button */}
                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-emerald-500 hover:bg-emerald-400 text-black text-xs font-black shadow-xl shadow-emerald-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Terbitkan Kwitansi &amp; Simpan Pemasukan</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 2: FORM PENGELUARAN */}
            {formTab === "expense" && (
              <form onSubmit={handleSubmitExpense} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      1. Jenis Pengeluaran <span className="text-rose-400">*</span>
                    </label>
                    <select
                      value={expenseForm.expenseType}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, expenseType: e.target.value }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-bold transition-all focus:outline-hidden focus:border-cyan-500 cursor-pointer ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      {EXPENSE_TYPES_PENGELUARAN.map((opt) => (
                        <option
                          key={opt}
                          value={opt}
                          className={isDark ? "bg-[#1a1a24] text-white" : "bg-white text-slate-900"}
                        >
                          {opt}
                        </option>
                      ))}
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      2. Nominal Pengeluaran (IDR) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-xs font-bold text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="Contoh: 850.000"
                        value={expenseForm.amount}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw
                            ? parseInt(raw, 10).toLocaleString("id-ID")
                            : "";
                          setExpenseForm((prev) => ({ ...prev, amount: formatted }));
                        }}
                        className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs font-extrabold tracking-wider transition-all focus:outline-hidden focus:border-rose-500 ${
                          isDark
                            ? "bg-black/50 border-white/15 text-rose-400 placeholder-gray-500"
                            : "bg-white border-slate-300 text-rose-600"
                        }`}
                        required
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDark ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    3. Deskripsi / Rincian Pengeluaran (Opsional)
                  </label>
                  <textarea
                    rows={2}
                    placeholder="Contoh: Pembelian bensin kendaraan dinas jemput tamu, snack rapat guru mingguan, atau token listrik lab..."
                    value={expenseForm.description}
                    onChange={(e) =>
                      setExpenseForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className={`w-full border rounded-xl p-4 text-xs leading-relaxed transition-all focus:outline-hidden focus:border-cyan-500 resize-none ${
                      isDark
                        ? "bg-black/50 border-white/15 text-white placeholder-gray-500"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Unit Penanggung Jawab
                    </label>
                    <select
                      value={expenseForm.unit}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({
                          ...prev,
                          unit: e.target.value as "Yayasan" | "RA" | "SD" | "MTs",
                        }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-medium transition-all focus:outline-hidden focus:border-cyan-500 cursor-pointer ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="Yayasan" className={isDark ? "bg-[#1a1a24]" : ""}>
                        Yayasan Pusat
                      </option>
                      <option value="MTs" className={isDark ? "bg-[#1a1a24]" : ""}>
                        MTs Sains Al-Qur'an
                      </option>
                      <option value="SD" className={isDark ? "bg-[#1a1a24]" : ""}>
                        SD Islam Terpadu
                      </option>
                      <option value="RA" className={isDark ? "bg-[#1a1a24]" : ""}>
                        RA Al-Qur'an
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Tanggal Pengeluaran
                    </label>
                    <input
                      type="date"
                      value={expenseForm.date}
                      onChange={(e) =>
                        setExpenseForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-medium transition-all focus:outline-hidden focus:border-cyan-500 ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div className="p-4 rounded-2xl bg-rose-500/5 border border-rose-500/20">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold uppercase tracking-wider text-rose-400 flex items-center gap-1.5">
                      <Camera className="w-4 h-4" />
                      <span>4. Bukti Nota / Foto Kuitansi Fisik (Opsional)</span>
                    </span>
                    <button
                      type="button"
                      onClick={() => handleAttachMockReceipt("expense")}
                      className="text-[11px] text-cyan-400 hover:underline font-semibold cursor-pointer"
                    >
                      + Pasang Contoh Nota Cepat
                    </button>
                  </div>

                  <input
                    type="file"
                    ref={fileInputRef}
                    onChange={(e) => handleFileUpload(e, "expense")}
                    accept="image/*,application/pdf"
                    className="hidden"
                  />

                  {expenseForm.receiptUrl ? (
                    <div className="flex items-center justify-between p-3 rounded-xl bg-black/60 border border-rose-500/40">
                      <div className="flex items-center gap-3">
                        <img
                          src={expenseForm.receiptUrl}
                          alt="Nota"
                          className="w-12 h-12 object-cover rounded-lg border border-white/20"
                        />
                        <div>
                          <div className="text-xs font-bold text-white flex items-center gap-1.5">
                            <FileCheck className="w-3.5 h-3.5 text-emerald-400" />
                            <span>{expenseForm.receiptName || "Nota_Kuitansi_Fisik.jpg"}</span>
                          </div>
                          <span className="text-[10px] text-gray-400">
                            Ukuran: {expenseForm.receiptSize || "2.1 MB"} • Siap diverifikasi audit
                          </span>
                        </div>
                      </div>
                      <button
                        type="button"
                        onClick={() =>
                          setExpenseForm((prev) => ({
                            ...prev,
                            receiptUrl: "",
                            receiptName: "",
                            receiptSize: "",
                          }))
                        }
                        className="p-2 rounded-lg bg-rose-500/20 text-rose-300 text-xs font-semibold cursor-pointer hover:bg-rose-500/30"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  ) : (
                    <div
                      onClick={() => fileInputRef.current?.click()}
                      className="border-2 border-dashed border-rose-500/30 hover:border-rose-400/60 rounded-xl p-5 text-center cursor-pointer bg-black/20 hover:bg-black/40 transition-all flex flex-col items-center justify-center gap-1.5"
                    >
                      <Upload className="w-5 h-5 text-rose-400" />
                      <span className="text-xs font-semibold text-gray-300">
                        Klik untuk unggah foto nota kuitansi fisik (Kamera / File JPG, PNG, PDF)
                      </span>
                      <p className="text-[10px] text-gray-400">
                        Sangat disarankan untuk akuntabilitas Dewan Pembina Yayasan
                      </p>
                    </div>
                  )}
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-rose-500 hover:bg-rose-400 text-white text-xs font-black shadow-xl shadow-rose-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Bukukan Pengeluaran &amp; Enkripsi Audit</span>
                  </button>
                </div>
              </form>
            )}

            {/* TAB 3: FORM TABUNGAN */}
            {formTab === "savings" && (
              <form onSubmit={handleSubmitSavings} className="space-y-6">
                <div className="relative">
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDark ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    1. Cari Data Santri Penabung / Rekening <span className="text-rose-400">*</span>
                  </label>

                  <div className="relative">
                    <Search className="w-4 h-4 text-amber-400 absolute left-4 top-3.5" />
                    <input
                      type="text"
                      placeholder="Ketik nama santri, NIS, atau kelas penabung..."
                      value={savingsStudentSearch}
                      onChange={(e) => {
                        setSavingsStudentSearch(e.target.value);
                        setIsSavingsStudentDropdownOpen(true);
                      }}
                      onFocus={() => setIsSavingsStudentDropdownOpen(true)}
                      className={`w-full border rounded-2xl pl-11 pr-10 py-3 text-xs font-semibold transition-all focus:outline-hidden focus:border-amber-400 ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white placeholder-gray-500"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      required
                    />

                    {savingsStudentSearch && (
                      <button
                        type="button"
                        onClick={() => {
                          setSavingsStudentSearch("");
                          setSelectedSavingsStudent(null);
                        }}
                        className="absolute right-3 top-3 p-1 rounded-lg text-gray-400 hover:text-white cursor-pointer"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    )}
                  </div>

                  {isSavingsStudentDropdownOpen && (
                    <div
                      className={`absolute left-0 right-0 top-full mt-1.5 rounded-2xl border shadow-2xl z-30 max-h-60 overflow-y-auto backdrop-blur-xl ${
                        isDark
                          ? "bg-[#151520] border-white/20 text-white"
                          : "bg-white border-slate-300 text-slate-900 shadow-xl"
                      }`}
                    >
                      <div className="p-2 border-b border-white/10 text-[11px] text-gray-400 font-bold px-3">
                        Pilih rekening santri:
                      </div>

                      {filteredSavingsStudents.length === 0 ? (
                        <div className="p-4 text-center text-xs text-gray-400">
                          <span>Santri tidak ditemukan di database.</span>
                          <button
                            type="button"
                            onClick={() => {
                              setSelectedSavingsStudent({
                                id: `custom-${Date.now()}`,
                                name: savingsStudentSearch,
                                nis: "NIS-MANUAL",
                                grade: "Unit Umum / Les",
                              });
                              setIsSavingsStudentDropdownOpen(false);
                            }}
                            className="block mx-auto mt-2 text-xs text-amber-400 font-bold hover:underline"
                          >
                            + Gunakan "{savingsStudentSearch}" sebagai santri penabung
                          </button>
                        </div>
                      ) : (
                        filteredSavingsStudents.map((std) => (
                          <div
                            key={std.id}
                            onClick={() => handleSelectSavingsStudent(std)}
                            className={`p-3 border-b border-white/5 flex items-center justify-between hover:bg-amber-500/15 cursor-pointer transition-colors ${
                              selectedSavingsStudent?.id === std.id ? "bg-amber-500/20" : ""
                            }`}
                          >
                            <div className="flex items-center gap-3">
                              <div className="w-8 h-8 rounded-full bg-amber-500/20 text-amber-400 flex items-center justify-center font-bold text-xs border border-amber-500/30">
                                {std.name.charAt(0)}
                              </div>
                              <div>
                                <strong className="text-xs text-white block">{std.name}</strong>
                                <span className="text-[10px] text-gray-400">
                                  NIS: {std.nis} • {std.grade}
                                </span>
                              </div>
                            </div>

                            <span className="text-[11px] text-amber-400 font-semibold flex items-center gap-1">
                              <span>Pilih Rekening</span>
                              <ChevronRight className="w-3.5 h-3.5" />
                            </span>
                          </div>
                        ))
                      )}
                    </div>
                  )}

                  {selectedSavingsStudent && (
                    <div className="mt-2.5 p-4 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-xl bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-sm">
                          <PiggyBank className="w-5 h-5" />
                        </div>
                        <div>
                          <div className="font-bold text-white text-sm">
                            {selectedSavingsStudent.name}
                          </div>
                          <span className="text-[11px] text-gray-300">
                            NIS: {selectedSavingsStudent.nis} • {selectedSavingsStudent.grade}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3 sm:border-l sm:border-amber-500/20 sm:pl-4">
                        <div>
                          <span className="text-[10px] text-amber-300 block uppercase font-bold">
                            Saldo Tabungan Saat Ini
                          </span>
                          <strong className="text-base text-amber-400 font-black">
                            {formatIDR(activeStudentSavingsData?.currentBalance || 0)}
                          </strong>
                        </div>
                        <span className="text-[10px] px-2 py-0.5 rounded-full bg-amber-500/20 text-amber-300 font-bold border border-amber-500/30">
                          {activeStudentSavingsData?.transactionCount || 0} Mutasi
                        </span>
                      </div>
                    </div>
                  )}
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      2. Jenis Mutasi Tabungan <span className="text-rose-400">*</span>
                    </label>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        type="button"
                        onClick={() =>
                          setSavingsForm((prev) => ({ ...prev, savingsType: "deposit" }))
                        }
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          savingsForm.savingsType === "deposit"
                            ? "bg-emerald-500 text-black border-emerald-400 font-extrabold shadow-lg shadow-emerald-500/20"
                            : isDark
                            ? "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                            : "bg-slate-100 border-slate-300 text-slate-700"
                        }`}
                      >
                        <ArrowDownRight className="w-4 h-4" />
                        <span>Setor Tabungan (+)</span>
                      </button>

                      <button
                        type="button"
                        onClick={() =>
                          setSavingsForm((prev) => ({ ...prev, savingsType: "withdraw" }))
                        }
                        className={`p-3 rounded-xl border text-xs font-bold flex items-center justify-center gap-2 transition-all cursor-pointer ${
                          savingsForm.savingsType === "withdraw"
                            ? "bg-amber-500 text-black border-amber-400 font-extrabold shadow-lg shadow-amber-500/20"
                            : isDark
                            ? "bg-black/40 border-white/10 text-gray-400 hover:text-white"
                            : "bg-slate-100 border-slate-300 text-slate-700"
                        }`}
                      >
                        <ArrowUpRight className="w-4 h-4" />
                        <span>Tarik Tabungan (-)</span>
                      </button>
                    </div>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Nominal Mutasi (IDR) <span className="text-rose-400">*</span>
                    </label>
                    <div className="relative">
                      <span className="absolute left-4 top-3 text-xs font-bold text-gray-400">
                        Rp
                      </span>
                      <input
                        type="text"
                        placeholder="Contoh: 50.000"
                        value={savingsForm.amount}
                        onChange={(e) => {
                          const raw = e.target.value.replace(/\D/g, "");
                          const formatted = raw
                            ? parseInt(raw, 10).toLocaleString("id-ID")
                            : "";
                          setSavingsForm((prev) => ({ ...prev, amount: formatted }));
                        }}
                        className={`w-full border rounded-xl pl-11 pr-4 py-3 text-xs font-extrabold tracking-wider transition-all focus:outline-hidden focus:border-amber-400 ${
                          savingsForm.savingsType === "deposit"
                            ? "text-emerald-400"
                            : "text-amber-400"
                        } ${
                          isDark
                            ? "bg-black/50 border-white/15 placeholder-gray-500"
                            : "bg-white border-slate-300"
                        }`}
                        required
                      />
                    </div>

                    <div className="flex items-center gap-1.5 mt-2 flex-wrap">
                      <span className="text-[10px] text-gray-400 font-medium">Preset Cepat:</span>
                      {[20000, 50000, 100000, 200000].map((nominal) => (
                        <button
                          key={nominal}
                          type="button"
                          onClick={() =>
                            setSavingsForm((prev) => ({
                              ...prev,
                              amount: nominal.toLocaleString("id-ID"),
                            }))
                          }
                          className="px-2 py-0.5 rounded-md bg-white/5 hover:bg-white/10 border border-white/10 text-[10px] text-gray-300 transition-all cursor-pointer"
                        >
                          +Rp {nominal.toLocaleString("id-ID")}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Unit Penyelenggara
                    </label>
                    <select
                      value={savingsForm.unit}
                      onChange={(e) =>
                        setSavingsForm((prev) => ({
                          ...prev,
                          unit: e.target.value as "Yayasan" | "RA" | "SD" | "MTs",
                        }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-medium transition-all focus:outline-hidden focus:border-amber-400 cursor-pointer ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                    >
                      <option value="MTs" className={isDark ? "bg-[#1a1a24]" : ""}>
                        MTs Sains Al-Qur'an
                      </option>
                      <option value="SD" className={isDark ? "bg-[#1a1a24]" : ""}>
                        SD Islam Terpadu
                      </option>
                      <option value="RA" className={isDark ? "bg-[#1a1a24]" : ""}>
                        RA Al-Qur'an
                      </option>
                      <option value="Yayasan" className={isDark ? "bg-[#1a1a24]" : ""}>
                        Yayasan Pusat
                      </option>
                    </select>
                  </div>

                  <div>
                    <label
                      className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                        isDark ? "text-gray-300" : "text-slate-700"
                      }`}
                    >
                      Tanggal Transaksi Tabungan
                    </label>
                    <input
                      type="date"
                      value={savingsForm.date}
                      onChange={(e) =>
                        setSavingsForm((prev) => ({ ...prev, date: e.target.value }))
                      }
                      className={`w-full border rounded-xl px-4 py-3 text-xs font-medium transition-all focus:outline-hidden focus:border-amber-400 ${
                        isDark
                          ? "bg-black/50 border-white/15 text-white"
                          : "bg-white border-slate-300 text-slate-900"
                      }`}
                      required
                    />
                  </div>
                </div>

                <div>
                  <label
                    className={`block text-xs font-bold uppercase tracking-wider mb-2 ${
                      isDark ? "text-gray-300" : "text-slate-700"
                    }`}
                  >
                    Catatan / Keperluan Tabungan (Opsional)
                  </label>
                  <input
                    type="text"
                    placeholder="Contoh: Tabungan mingguan santri / Penarikan untuk beli seragam renang / Simpanan Idul Fitri..."
                    value={savingsForm.description}
                    onChange={(e) =>
                      setSavingsForm((prev) => ({ ...prev, description: e.target.value }))
                    }
                    className={`w-full border rounded-xl px-4 py-3 text-xs transition-all focus:outline-hidden focus:border-amber-400 ${
                      isDark
                        ? "bg-black/50 border-white/15 text-white placeholder-gray-500"
                        : "bg-white border-slate-300 text-slate-900"
                    }`}
                  />
                </div>

                <div className="flex items-center justify-end gap-3 pt-3 border-t border-white/10">
                  <button
                    type="submit"
                    className="w-full sm:w-auto px-8 py-3 rounded-2xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-black shadow-xl shadow-amber-500/25 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>
                      {savingsForm.savingsType === "deposit"
                        ? "Bukukan Setoran Tabungan Santri"
                        : "Proses Penarikan Tabungan Santri"}
                    </span>
                  </button>
                </div>
              </form>
            )}
          </div>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* VIEW 2: BUKU KAS & REKAP YAYASAN (UNIFIED DAILY LEDGER + TABUNGAN TAB)    */}
      {/* ========================================================================= */}
      {activeMainView === "ledger" && (
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: 15 }}
          transition={{ duration: 0.25 }}
          className="space-y-6"
        >
          {/* 1. SUMMARY CARDS HEADER (INCLUDING DEDICATED TOTAL TABUNGAN CARD) */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
            {/* Total Income */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group ${
                isDark
                  ? "bg-[#1a1a24]/80 border-white/10 hover:border-emerald-500/40"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Total Pemasukan
                </span>
                <div className="w-8 h-8 rounded-xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center border border-emerald-500/30">
                  <ArrowDownRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-emerald-400 mt-2.5">
                {formatIDR(stats.totalIncome)}
              </div>
              <span className="text-[11px] font-semibold text-emerald-300 mt-1 block">
                SPP, BOS &amp; Donasi Kas
              </span>
            </div>

            {/* Total Expense */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group ${
                isDark
                  ? "bg-[#1a1a24]/80 border-white/10 hover:border-rose-500/40"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Total Pengeluaran
                </span>
                <div className="w-8 h-8 rounded-xl bg-rose-500/20 text-rose-400 flex items-center justify-center border border-rose-500/30">
                  <ArrowUpRight className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-rose-400 mt-2.5">
                {formatIDR(stats.totalExpense)}
              </div>
              <span className="text-[11px] font-semibold text-rose-300 mt-1 block">
                Operasional &amp; Sarpras
              </span>
            </div>

            {/* DEDICATED TOTAL TABUNGAN CARD */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group ${
                isDark
                  ? "bg-[#1a1a24]/80 border-white/10 hover:border-amber-500/40"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-amber-400">
                  Total Tabungan Santri
                </span>
                <div className="w-8 h-8 rounded-xl bg-amber-500/20 text-amber-400 flex items-center justify-center border border-amber-500/30">
                  <PiggyBank className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-amber-400 mt-2.5">
                {formatIDR(stats.totalSavingsBalance)}
              </div>
              <span className="text-[11px] font-bold text-amber-300 mt-1 block flex items-center gap-1">
                <span>{stats.activeSaversCount} Rekening Santri Aktif</span>
              </span>
            </div>

            {/* Net Cash Balance */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group ${
                isDark
                  ? "bg-[#1a1a24]/80 border-white/10 hover:border-cyan-500/40"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Saldo Kas Bersih
                </span>
                <div className="w-8 h-8 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                  <DollarSign className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-cyan-400 mt-2.5">
                {formatIDR(stats.netBalance)}
              </div>
              <span className="text-[11px] font-bold text-cyan-300 mt-1 block flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-cyan-400 animate-pulse" />
                Surplus Kas Bebas
              </span>
            </div>

            {/* Audit Integrity Percentage */}
            <div
              className={`p-4 sm:p-5 rounded-2xl border backdrop-blur-xl shadow-xl transition-all relative overflow-hidden group ${
                isDark
                  ? "bg-[#1a1a24]/80 border-white/10 hover:border-purple-500/40"
                  : "bg-white border-slate-200 text-slate-900"
              }`}
            >
              <div className="flex items-center justify-between">
                <span className="text-[11px] font-bold uppercase tracking-wider text-gray-400">
                  Integritas Audit
                </span>
                <div className="w-8 h-8 rounded-xl bg-purple-500/20 text-purple-400 flex items-center justify-center border border-purple-500/30">
                  <Lock className="w-4 h-4" />
                </div>
              </div>
              <div className="text-xl sm:text-2xl font-black text-purple-400 mt-2.5">
                {stats.auditIntegrityRate}%
              </div>
              <span className="text-[11px] font-semibold text-purple-300 mt-1 block">
                {stats.verifiedReceiptsCount} Nota Fisik Terlampir
              </span>
            </div>
          </div>

          {/* 2. SPREADSHEET RECAP CONTAINER */}
          <div
            className={`rounded-3xl border shadow-2xl backdrop-blur-xl overflow-hidden transition-colors duration-500 ${
              isDark
                ? "bg-[#1a1a24]/80 border-white/10 text-white"
                : "bg-white border-slate-200 text-slate-900"
            }`}
          >
            {/* Table Action Bar */}
            <div className="p-6 border-b border-white/10 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
              <div>
                <h3 className="text-lg font-bold flex items-center gap-2">
                  <FileSpreadsheet className="w-5 h-5 text-cyan-400" />
                  <span>Buku Kas &amp; Rekapitulasi Yayasan</span>
                </h3>
                <p
                  className={`text-xs mt-1 ${
                    isDark ? "text-gray-400" : "text-slate-500"
                  }`}
                >
                  Tampilan tabel terpadu sesuai format Google Sheets harian dengan kolom Saldo Akhir berjalan, serta buku tabungan santri.
                </p>
              </div>

              {/* Action Buttons: PDF Export & Quick Form Jump */}
              <div className="flex flex-wrap items-center gap-3">
                <button
                  type="button"
                  onClick={handlePrintPDFReport}
                  className="px-4 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-extrabold shadow-lg shadow-cyan-500/25 flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Printer className="w-4 h-4" />
                  <span>Unduh / Cetak Laporan PDF</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveMainView("form")}
                  className={`px-4 py-2.5 rounded-xl border text-xs font-bold transition-all flex items-center gap-1.5 cursor-pointer ${
                    isDark
                      ? "bg-white/10 hover:bg-white/20 border-white/15 text-white"
                      : "bg-slate-100 hover:bg-slate-200 border-slate-300 text-slate-800"
                  }`}
                >
                  <span>+ Catat Transaksi Baru</span>
                </button>
              </div>
            </div>

            {/* Sub-Tab Navigation: Combined Daily Ledger vs Tabungan Santri */}
            <div className="px-6 pt-4 border-b border-white/10 flex items-center gap-3 overflow-x-auto">
              <button
                type="button"
                onClick={() => setRecapTab("daily_ledger")}
                className={`pb-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  recapTab === "daily_ledger"
                    ? "border-cyan-400 text-cyan-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <FileSpreadsheet className="w-4 h-4" />
                <span>1. Rekap Harian Kas (Pemasukan &amp; Pengeluaran)</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-cyan-500/15 text-cyan-300 font-bold border border-cyan-500/30">
                  {chronologicalCashFlow.length} Baris
                </span>
              </button>

              <button
                type="button"
                onClick={() => setRecapTab("savings")}
                className={`pb-3.5 px-4 text-xs font-bold flex items-center gap-2 border-b-2 transition-all cursor-pointer whitespace-nowrap ${
                  recapTab === "savings"
                    ? "border-amber-400 text-amber-400"
                    : "border-transparent text-gray-400 hover:text-white"
                }`}
              >
                <PiggyBank className="w-4 h-4" />
                <span>2. Buku Tabungan Santri</span>
                <span className="px-2 py-0.5 rounded-full text-[10px] bg-amber-500/15 text-amber-300 font-bold border border-amber-500/30">
                  {savingsTransactions.length} Mutasi
                </span>
              </button>
            </div>

            {/* Filters Bar */}
            <div
              className={`p-4 border-b flex flex-wrap items-center justify-between gap-3 text-xs ${
                isDark ? "bg-black/30 border-white/10" : "bg-slate-50 border-slate-200"
              }`}
            >
              {/* Search */}
              <div className="relative min-w-[240px] flex-1 max-w-md">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-2.5" />
                <input
                  type="text"
                  placeholder="Cari transaksi, santri, kategori, no ref..."
                  value={ledgerSearch}
                  onChange={(e) => setLedgerSearch(e.target.value)}
                  className={`w-full border rounded-xl pl-9 pr-3 py-2 text-xs transition-all focus:outline-hidden focus:border-cyan-500 ${
                    isDark
                      ? "bg-black/50 border-white/15 text-white placeholder-gray-500"
                      : "bg-white border-slate-300 text-slate-900"
                  }`}
                />
              </div>

              {/* Savings Mutation Filter (Active only in Savings tab) */}
              {recapTab === "savings" && (
                <div className="flex items-center rounded-xl p-1 bg-black/40 border border-white/10">
                  <button
                    onClick={() => setSavingsMutationFilter("all")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      savingsMutationFilter === "all"
                        ? "bg-amber-500 text-black font-bold shadow-xs"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Semua Mutasi
                  </button>
                  <button
                    onClick={() => setSavingsMutationFilter("deposit")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      savingsMutationFilter === "deposit"
                        ? "bg-emerald-500 text-black font-bold shadow-xs"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Setor Saja
                  </button>
                  <button
                    onClick={() => setSavingsMutationFilter("withdraw")}
                    className={`px-3 py-1.5 rounded-lg font-semibold transition-all cursor-pointer ${
                      savingsMutationFilter === "withdraw"
                        ? "bg-rose-500 text-white font-bold shadow-xs"
                        : "text-gray-400 hover:text-white"
                    }`}
                  >
                    Tarik Saja
                  </button>
                </div>
              )}

              {/* Unit Filter */}
              <select
                value={ledgerUnitFilter}
                onChange={(e) =>
                  setLedgerUnitFilter(
                    e.target.value as "all" | "Yayasan" | "RA" | "SD" | "MTs"
                  )
                }
                className={`border rounded-xl px-3 py-2 text-xs font-semibold cursor-pointer transition-all focus:outline-hidden focus:border-cyan-500 ${
                  isDark
                    ? "bg-black/50 border-white/15 text-white"
                    : "bg-white border-slate-300 text-slate-900"
                }`}
              >
                <option value="all" className={isDark ? "bg-[#1a1a24]" : ""}>
                  Semua Unit Lembaga
                </option>
                <option value="Yayasan" className={isDark ? "bg-[#1a1a24]" : ""}>
                  Yayasan Pusat
                </option>
                <option value="RA" className={isDark ? "bg-[#1a1a24]" : ""}>
                  RA Al-Qur'an
                </option>
                <option value="SD" className={isDark ? "bg-[#1a1a24]" : ""}>
                  SD Islam Terpadu
                </option>
                <option value="MTs" className={isDark ? "bg-[#1a1a24]" : ""}>
                  MTs Sains Al-Qur'an
                </option>
              </select>
            </div>

            {/* ===================================================================== */}
            {/* RECAP SECTION 1: COMBINED UNIFIED DAILY SPREADSHEET LEDGER TABLE       */}
            {/* ===================================================================== */}
            {recapTab === "daily_ledger" && (
              <div className="overflow-x-auto w-full custom-scrollbar">
                <table className="w-full min-w-[1250px] text-left text-xs border-collapse">
                  <thead>
                    <tr
                      className={`border-b uppercase tracking-wider font-extrabold text-[11px] ${
                        isDark
                          ? "bg-black/40 border-white/10 text-gray-400"
                          : "bg-slate-50 border-slate-200 text-slate-600"
                      }`}
                    >
                      <th className="py-3.5 px-3 whitespace-nowrap">No. Ref</th>
                      <th className="py-3.5 px-3 whitespace-nowrap">Tanggal / Waktu</th>
                      <th className="py-3.5 px-4 min-w-[170px]">Nama Siswa / Pembayar</th>
                      <th className="py-3.5 px-3 min-w-[130px]">Jenis Pembayaran</th>
                      <th className="py-3.5 px-3 min-w-[140px]">Jenis Pengeluaran</th>
                      <th className="py-3.5 px-4 min-w-[200px]">Deskripsi (Opsional)</th>
                      <th className="py-3.5 px-3 text-right whitespace-nowrap text-emerald-400">
                        Nominal Pemasukan
                      </th>
                      <th className="py-3.5 px-3 text-right whitespace-nowrap text-rose-400">
                        Nominal Pengeluaran
                      </th>
                      <th className="py-3.5 px-4 text-right whitespace-nowrap text-cyan-300 bg-cyan-500/10 border-x border-cyan-500/20 font-black">
                        Saldo Akhir
                      </th>
                      <th className="py-3.5 px-3 text-center whitespace-nowrap">Aksi &amp; Status</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-white/5">
                    {filteredDailyLedger.length === 0 ? (
                      <tr>
                        <td colSpan={10} className="py-12 text-center text-gray-400">
                          <p className="font-semibold">Belum ada transaksi kas harian yang cocok.</p>
                        </td>
                      </tr>
                    ) : (
                      filteredDailyLedger.map((trx) => (
                        <tr
                          key={trx.id}
                          className={`transition-colors ${
                            isDark ? "hover:bg-white/5" : "hover:bg-slate-50 text-slate-800"
                          }`}
                        >
                          {/* 1. No. Ref */}
                          <td className="py-3.5 px-3 whitespace-nowrap font-mono font-bold text-cyan-400 text-[11px]">
                            {trx.referenceNo}
                          </td>

                          {/* 2. Tanggal / Waktu */}
                          <td className="py-3.5 px-3 whitespace-nowrap text-[11px]">
                            <div className="flex items-center gap-1.5 text-gray-200 font-semibold">
                              <Calendar className="w-3.5 h-3.5 text-gray-400" />
                              <span>{trx.date}</span>
                            </div>
                            <span className="text-[10px] text-gray-400 block mt-0.5">
                              {trx.timestamp} • {trx.unit}
                            </span>
                          </td>

                          {/* 3. Nama Siswa / Pembayar */}
                          <td className="py-3.5 px-4">
                            {trx.studentName ? (
                              <div>
                                <strong className="text-white text-xs block">{trx.studentName}</strong>
                                <span className="text-[10px] text-gray-400">
                                  NIS: {trx.studentNis || "-"} • {trx.studentGrade || trx.unit}
                                </span>
                              </div>
                            ) : trx.type === "income" ? (
                              <span className="text-gray-300 font-bold text-xs">
                                Yayasan / Donatur
                              </span>
                            ) : (
                              <span className="text-gray-500 italic text-xs">-</span>
                            )}
                          </td>

                          {/* 4. Jenis Pembayaran (for income) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {trx.type === "income" ? (
                              <span className="px-2.5 py-1 rounded-md bg-emerald-500/15 text-emerald-300 border border-emerald-500/30 text-[11px] font-bold">
                                {trx.category}
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs font-mono">-</span>
                            )}
                          </td>

                          {/* 5. Jenis Pengeluaran (for expense) */}
                          <td className="py-3.5 px-3 whitespace-nowrap">
                            {trx.type === "expense" ? (
                              <span className="px-2.5 py-1 rounded-md bg-rose-500/15 text-rose-300 border border-rose-500/30 text-[11px] font-bold">
                                {trx.category}
                              </span>
                            ) : (
                              <span className="text-gray-500 text-xs font-mono">-</span>
                            )}
                          </td>

                          {/* 6. Deskripsi (Opsional) */}
                          <td className="py-3.5 px-4 max-w-xs">
                            <p className="text-[11px] text-gray-300 leading-relaxed line-clamp-2">
                              {trx.description || "-"}
                            </p>
                            <span className="text-[9px] text-gray-500 block mt-0.5">
                              Operator: {trx.operatorName}
                            </span>
                          </td>

                          {/* 7. Nominal Pemasukan (IDR) */}
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            {trx.type === "income" ? (
                              <span className="font-extrabold text-xs text-emerald-400">
                                + {formatIDR(trx.amount)}
                              </span>
                            ) : (
                              <span className="text-gray-600 font-mono text-xs">-</span>
                            )}
                          </td>

                          {/* 8. Nominal Pengeluaran (IDR) */}
                          <td className="py-3.5 px-3 text-right whitespace-nowrap">
                            {trx.type === "expense" ? (
                              <span className="font-extrabold text-xs text-rose-400">
                                - {formatIDR(trx.amount)}
                              </span>
                            ) : (
                              <span className="text-gray-600 font-mono text-xs">-</span>
                            )}
                          </td>

                          {/* 9. Saldo Akhir (IDR) Running Balance Positioned Right Next to Nominals */}
                          <td className="py-3.5 px-4 text-right whitespace-nowrap bg-cyan-500/5 border-x border-cyan-500/20 font-black text-xs text-cyan-300">
                            {formatIDR(trx.runningBalance)}
                          </td>

                          {/* 10. Aksi & Status */}
                          <td className="py-3.5 px-3 text-center whitespace-nowrap">
                            <div className="flex items-center justify-center gap-1.5">
                              {trx.receiptUrl && (
                                <button
                                  type="button"
                                  onClick={() => setPreviewReceipt(trx)}
                                  className="p-1 rounded-lg bg-cyan-500/15 hover:bg-cyan-500/25 text-cyan-300 border border-cyan-500/30 text-[10px] font-semibold transition-all cursor-pointer shadow-xs"
                                  title="Lihat Nota"
                                >
                                  <Eye className="w-3.5 h-3.5" />
                                </button>
                              )}
                              <div
                                className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold"
                                title={`Audit Hash: ${trx.auditHash}`}
                              >
                                <Lock className="w-2.5 h-2.5" />
                                <span>Audited</span>
                              </div>
                            </div>
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            )}

            {/* ===================================================================== */}
            {/* RECAP SECTION 2: DEDICATED TABUNGAN SANTRI TAB                         */}
            {/* ===================================================================== */}
            {recapTab === "savings" && (
              <div className="space-y-6 p-4 sm:p-6">
                {/* Summary Cards of Active Student Savings Accounts */}
                <div>
                  <h4 className="text-xs font-bold uppercase tracking-wider text-amber-400 mb-3 flex items-center gap-2">
                    <PiggyBank className="w-4 h-4" />
                    <span>Daftar Saldo Rekening Tabungan Santri Aktif ({Object.keys(studentSavingsBalances).length})</span>
                  </h4>

                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                    {Object.values(studentSavingsBalances).map((acc) => (
                      <div
                        key={acc.nis}
                        className={`p-3.5 rounded-2xl border flex items-center justify-between ${
                          isDark
                            ? "bg-black/40 border-amber-500/20 hover:border-amber-500/40"
                            : "bg-amber-50 border-amber-200 text-slate-800"
                        }`}
                      >
                        <div>
                          <strong className="text-xs block text-white">{acc.name}</strong>
                          <span className="text-[10px] text-gray-400">
                            NIS: {acc.nis} • {acc.grade}
                          </span>
                        </div>
                        <div className="text-right">
                          <span className="text-[9px] uppercase tracking-wider text-amber-400 font-bold block">
                            Saldo Aktif
                          </span>
                          <span className="text-xs font-black text-amber-300">
                            {formatIDR(acc.currentBalance)}
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Ledger Table of Savings Mutations with Smooth Horizontal Scroll */}
                <div className="border-t border-white/10 pt-4">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-gray-300 mb-3 flex items-center justify-between">
                    <span>Log Mutasi Buku Tabungan (Setoran &amp; Penarikan)</span>
                    <span className="text-[10px] text-gray-400 font-normal">
                      Total {savingsTransactions.length} transaksi mutasi
                    </span>
                  </h4>

                  <div className="overflow-x-auto w-full custom-scrollbar rounded-2xl border border-white/10">
                    <table className="w-full min-w-[1050px] text-left text-xs border-collapse">
                      <thead>
                        <tr
                          className={`border-b uppercase tracking-wider font-extrabold text-[11px] ${
                            isDark
                              ? "bg-black/40 border-white/10 text-gray-400"
                              : "bg-slate-50 border-slate-200 text-slate-600"
                          }`}
                        >
                          <th className="py-3.5 px-3 whitespace-nowrap">No. Ref</th>
                          <th className="py-3.5 px-3 whitespace-nowrap">Tanggal / Waktu</th>
                          <th className="py-3.5 px-4 min-w-[180px]">Santri / Rekening</th>
                          <th className="py-3.5 px-3 whitespace-nowrap">Jenis Mutasi</th>
                          <th className="py-3.5 px-3 whitespace-nowrap">Unit</th>
                          <th className="py-3.5 px-4 min-w-[180px]">Catatan / Keperluan</th>
                          <th className="py-3.5 px-3 whitespace-nowrap">Operator</th>
                          <th className="py-3.5 px-4 text-right whitespace-nowrap">Nominal (IDR)</th>
                          <th className="py-3.5 px-3 text-center whitespace-nowrap">Status Audit</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-white/5">
                        {savingsTransactions.length === 0 ? (
                          <tr>
                            <td colSpan={9} className="py-12 text-center text-gray-400">
                              <p className="font-semibold">Belum ada transaksi tabungan tercatat.</p>
                            </td>
                          </tr>
                        ) : (
                          savingsTransactions.map((trx) => (
                            <tr
                              key={trx.id}
                              className={`transition-colors ${
                                isDark ? "hover:bg-white/5" : "hover:bg-slate-50 text-slate-800"
                              }`}
                            >
                              <td className="py-3.5 px-3 whitespace-nowrap font-mono text-xs font-bold text-amber-400">
                                {trx.referenceNo}
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap text-[11px]">
                                <div className="flex items-center gap-1.5 text-gray-200 font-semibold">
                                  <Calendar className="w-3.5 h-3.5 text-gray-400" />
                                  <span>{trx.date}</span>
                                </div>
                                <span className="text-[10px] text-gray-400">{trx.timestamp}</span>
                              </td>

                              <td className="py-3.5 px-4">
                                <strong className="text-xs text-white block">
                                  {trx.studentName || "Santri"}
                                </strong>
                                <span className="text-[10px] text-gray-400">
                                  NIS: {trx.studentNis || "-"} • {trx.studentGrade || trx.unit}
                                </span>
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span
                                  className={`px-2.5 py-1 rounded-md text-[10px] font-extrabold uppercase border ${
                                    trx.savingsType === "withdraw"
                                      ? "bg-rose-500/15 text-rose-300 border-rose-500/30"
                                      : "bg-emerald-500/15 text-emerald-300 border-emerald-500/30"
                                  }`}
                                >
                                  {trx.savingsType === "withdraw" ? "Tarik Tabungan (-)" : "Setor Tabungan (+)"}
                                </span>
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap">
                                <span className="px-2 py-0.5 rounded text-[10px] font-bold border border-white/10 text-gray-300">
                                  {trx.unit}
                                </span>
                              </td>

                              <td className="py-3.5 px-4 max-w-xs text-gray-300 text-[11px]">
                                {trx.description}
                              </td>

                              <td className="py-3.5 px-3 whitespace-nowrap text-xs text-gray-300 font-medium">
                                {trx.operatorName}
                              </td>

                              <td className="py-3.5 px-4 text-right whitespace-nowrap">
                                <div
                                  className={`font-black text-xs ${
                                    trx.savingsType === "withdraw"
                                      ? "text-rose-400"
                                      : "text-emerald-400"
                                  }`}
                                >
                                  {trx.savingsType === "withdraw" ? "- " : "+ "}
                                  {formatIDR(trx.amount)}
                                </div>
                              </td>

                              <td className="py-3.5 px-3 text-center whitespace-nowrap">
                                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-emerald-500/15 text-emerald-400 border border-emerald-500/30 text-[10px] font-bold">
                                  <Lock className="w-2.5 h-2.5" />
                                  <span>Audited</span>
                                </div>
                              </td>
                            </tr>
                          ))
                        )}
                      </tbody>
                    </table>
                  </div>
                </div>
              </div>
            )}

            {/* Table Footer */}
            <div
              className={`p-4 border-t flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs ${
                isDark
                  ? "bg-black/40 border-white/10 text-gray-400"
                  : "bg-slate-50 border-slate-200 text-slate-600"
              }`}
            >
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>
                  Log Pembukuan Kas Harian Yayasan • Status Audit:{" "}
                  <strong className="text-gray-200">Terverifikasi Digital SHA-256</strong>
                </span>
              </div>
              <div className="font-mono text-[11px] text-cyan-400">
                Audit Hash Ledger: YPI-ASSAADAH-2026-REKAP-HARIAN
              </div>
            </div>
          </div>
        </motion.div>
      )}

      {/* 3. RECEIPT LIGHTBOX MODAL */}
      <AnimatePresence>
        {previewReceipt && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 220 }}
              className={`w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden backdrop-blur-2xl flex flex-col max-h-[90vh] ${
                isDark
                  ? "bg-[#1a1a24] border-white/20 text-white"
                  : "bg-white border-slate-300 text-slate-900"
              }`}
            >
              {/* Modal Header */}
              <div className="p-5 border-b border-white/10 flex items-center justify-between">
                <div>
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-cyan-400">
                      {previewReceipt.referenceNo}
                    </span>
                    <span
                      className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                        previewReceipt.type === "income"
                          ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                          : "bg-rose-500/20 text-rose-300 border border-rose-500/30"
                      }`}
                    >
                      {previewReceipt.type === "income" ? "Pemasukan" : "Pengeluaran"}
                    </span>
                  </div>
                  <h3 className="text-base font-bold mt-1">
                    {previewReceipt.category}
                  </h3>
                </div>

                <button
                  onClick={() => setPreviewReceipt(null)}
                  className={`w-8 h-8 rounded-full flex items-center justify-center border transition-all cursor-pointer ${
                    isDark
                      ? "border-white/10 hover:bg-white/10 text-gray-300"
                      : "border-slate-300 hover:bg-slate-100 text-slate-700"
                  }`}
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* Modal Image */}
              <div className="p-6 overflow-y-auto flex flex-col items-center gap-4">
                <div className="w-full max-h-[400px] bg-black/70 rounded-2xl overflow-hidden border border-white/10 flex items-center justify-center p-2 relative shadow-inner">
                  <img
                    src={previewReceipt.receiptUrl}
                    alt={previewReceipt.receiptName || "Bukti Nota"}
                    className="max-h-[380px] w-auto max-w-full object-contain rounded-lg drop-shadow-xl"
                  />
                  <div className="absolute bottom-3 right-3 bg-black/70 backdrop-blur-md px-3 py-1.5 rounded-lg border border-white/10 text-[10px] text-gray-300">
                    {previewReceipt.receiptName || "Nota_Kuitansi.jpg"}
                  </div>
                </div>

                {/* Details */}
                <div
                  className={`w-full p-4 rounded-2xl border text-xs grid grid-cols-1 sm:grid-cols-2 gap-3 ${
                    isDark
                      ? "bg-white/5 border-white/10 text-gray-300"
                      : "bg-slate-50 border-slate-200 text-slate-700"
                  }`}
                >
                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Nominal Transaksi
                    </span>
                    <strong
                      className={`text-base font-black ${
                        previewReceipt.type === "income"
                          ? "text-emerald-400"
                          : "text-rose-400"
                      }`}
                    >
                      {formatIDR(previewReceipt.amount)}
                    </strong>
                  </div>

                  <div>
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Operator Pencatat
                    </span>
                    <span className="font-semibold text-gray-200">
                      {previewReceipt.operatorName} (NIP Verified)
                    </span>
                  </div>

                  <div className="sm:col-span-2">
                    <span className="text-[10px] text-gray-400 block uppercase font-bold">
                      Uraian Keterangan
                    </span>
                    <p className="mt-0.5 leading-relaxed text-gray-200">
                      {previewReceipt.description}
                    </p>
                  </div>

                  <div className="sm:col-span-2 pt-2 border-t border-white/10">
                    <span className="text-[10px] text-cyan-400 block uppercase font-bold flex items-center gap-1">
                      <Lock className="w-3 h-3" />
                      Anti-Tamper Cryptographic Audit Hash:
                    </span>
                    <code className="font-mono text-[11px] text-gray-400 block mt-0.5 break-all select-all">
                      {previewReceipt.auditHash}
                    </code>
                  </div>
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 border-t border-white/10 flex items-center justify-between">
                <span className="text-[11px] text-gray-400 flex items-center gap-1.5">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
                  <span>Diverifikasi Dewan Pengawas Yayasan</span>
                </span>
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => {
                      const link = document.createElement("a");
                      link.href = previewReceipt.receiptUrl || "";
                      link.download = previewReceipt.receiptName || "Nota_Kuitansi.jpg";
                      link.click();
                    }}
                    className="px-4 py-2 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-bold transition-all shadow-md cursor-pointer flex items-center gap-1.5"
                  >
                    <Download className="w-3.5 h-3.5" />
                    <span>Unduh Nota</span>
                  </button>
                  <button
                    onClick={() => setPreviewReceipt(null)}
                    className="px-4 py-2 rounded-xl bg-white/10 hover:bg-white/20 text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    Tutup
                  </button>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
