"use client";

import React, { useState, useRef, useMemo, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useEduQuest } from "@/context/EduQuestContext";
import {
  CreditCard,
  Receipt,
  PiggyBank,
  Search,
  Upload,
  Camera,
  CheckCircle2,
  AlertCircle,
  X,
  FileCheck,
  Eye,
  Trash2,
  UserCheck,
  Sparkles,
  ArrowRight,
  TrendingDown,
  TrendingUp,
  ShieldCheck,
  Coins,
  Wallet,
  Clock,
  Printer,
  ChevronDown,
} from "lucide-react";
import { useDebounce } from "@/hooks/useDebounce";
import {
  GFORM_PAYMENT_TYPES,
  EXPENSE_CATEGORIES,
  getDefaultFeeAmount,
  MasterStudentFeeRecord,
  getSavedMasterStudentFees,
  saveMasterStudentFees,
  calculateStudentSavingsBalance,
} from "@/data/studentFeeMaster";

interface TabOperatorKasirProps {
  setActiveTab?: (tab: string) => void;
}

export default function TabOperatorKasir({ setActiveTab }: TabOperatorKasirProps) {
  const { currentUser, financeTransactions, addFinanceTransaction } = useEduQuest();

  // 3 Core Sub-Tabs in Kasir
  const [kasirSubTab, setKasirSubTab] = useState<"pendapatan" | "pengeluaran" | "tabungan">("pendapatan");

  // Master Student Fee state (persisted in localStorage)
  const [masterStudents, setMasterStudents] = useState<MasterStudentFeeRecord[]>([]);

  useEffect(() => {
    setMasterStudents(getSavedMasterStudentFees());
  }, []);

  // Update master students & save helper
  const updateMasterStudents = (updated: MasterStudentFeeRecord[]) => {
    setMasterStudents(updated);
    saveMasterStudentFees(updated);
  };

  // =========================================================================
  // SUB-TAB 1: PENDAPATAN (INCOME) STATE
  // =========================================================================
  const [incomeStudentSearch, setIncomeStudentSearch] = useState("");
  const [isIncomeDropdownOpen, setIsIncomeDropdownOpen] = useState(false);
  const [selectedIncomeStudent, setSelectedIncomeStudent] = useState<MasterStudentFeeRecord | null>(null);

  const [incomePaymentType, setIncomePaymentType] = useState<string>(GFORM_PAYMENT_TYPES[0]);
  const [incomeAmount, setIncomeAmount] = useState<string>("1.500.000");
  const [incomeUnit, setIncomeUnit] = useState<"Yayasan" | "RA" | "SD" | "MTs" | "Les">("MTs");
  const [incomeDate, setIncomeDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [incomeDescription, setIncomeDescription] = useState<string>("");

  // Spec 7: Smart Payment (Potong dari Saldo Tabungan)
  const [useSavingsDeduction, setUseSavingsDeduction] = useState<boolean>(false);

  // Success Notification Modal
  const [successReceiptModal, setSuccessReceiptModal] = useState<{
    isOpen: boolean;
    referenceNo: string;
    title: string;
    studentName?: string;
    amount: number;
    paymentType: string;
    method: string;
    remainingSavings?: number;
    auditHash: string;
    timestamp: string;
  } | null>(null);

  // Auto-set standard amount when student or payment type changes
  useEffect(() => {
    const unit = selectedIncomeStudent ? selectedIncomeStudent.unit : "MTs";
    setIncomeUnit(unit);
    const def = getDefaultFeeAmount(unit, incomePaymentType);
    setIncomeAmount(def.toLocaleString("id-ID"));
  }, [incomePaymentType, selectedIncomeStudent]);

  // Debounced search terms for smooth filtering
  const debouncedIncomeSearch = useDebounce(incomeStudentSearch, 200);

  // Filtered students for Income search
  const filteredIncomeStudents = useMemo(() => {
    const list = masterStudents || [];
    if (!debouncedIncomeSearch.trim()) return list.slice(0, 6);
    const q = debouncedIncomeSearch.toLowerCase();
    return list.filter(
      (s) =>
        s?.name?.toLowerCase().includes(q) ||
        (s?.nis && s.nis.includes(q)) ||
        s?.grade?.toLowerCase().includes(q) ||
        s?.unit?.toLowerCase().includes(q)
    );
  }, [masterStudents, debouncedIncomeSearch]);

  // Current savings balance of selected student
  const selectedStudentSavingsBalance = useMemo(() => {
    if (!selectedIncomeStudent) return 0;
    return calculateStudentSavingsBalance(selectedIncomeStudent, financeTransactions);
  }, [selectedIncomeStudent, financeTransactions]);

  const parsedIncomeAmount = useMemo(() => {
    const clean = incomeAmount.replace(/\D/g, "");
    return clean ? parseInt(clean, 10) : 0;
  }, [incomeAmount]);

  // Validation for Smart Payment deduction
  const isSavingsSufficient = selectedStudentSavingsBalance >= parsedIncomeAmount;

  // =========================================================================
  // SUB-TAB 2: PENGELUARAN (EXPENSES) STATE
  // =========================================================================
  const [expenseCategory, setExpenseCategory] = useState<string>(EXPENSE_CATEGORIES[0]);
  const [expenseAmount, setExpenseAmount] = useState<string>("500.000");
  const [expenseUnit, setExpenseUnit] = useState<"Yayasan" | "RA" | "SD" | "MTs">("Yayasan");
  const [expenseDate, setExpenseDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [expenseDescription, setExpenseDescription] = useState<string>("");
  const [expenseReceiptUrl, setExpenseReceiptUrl] = useState<string>("");
  const [expenseReceiptName, setExpenseReceiptName] = useState<string>("");
  const [expenseReceiptSize, setExpenseReceiptSize] = useState<string>("");
  const expenseFileInputRef = useRef<HTMLInputElement>(null);

  // Handle Receipt Upload
  const handleExpenseFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const url = URL.createObjectURL(file);
      setExpenseReceiptUrl(url);
      setExpenseReceiptName(file.name);
      const sizeMb = (file.size / (1024 * 1024)).toFixed(1);
      setExpenseReceiptSize(`${sizeMb} MB`);
    }
  };

  // =========================================================================
  // SUB-TAB 3: TABUNGAN (SAVINGS) STATE
  // =========================================================================
  const [savingsStudentSearch, setSavingsStudentSearch] = useState("");
  const [isSavingsDropdownOpen, setIsSavingsDropdownOpen] = useState(false);
  const [selectedSavingsStudent, setSelectedSavingsStudent] = useState<MasterStudentFeeRecord | null>(null);

  const debouncedSavingsSearch = useDebounce(savingsStudentSearch, 200);

  const [savingsMutationType, setSavingsMutationType] = useState<"deposit" | "withdraw">("deposit");
  const [savingsAmount, setSavingsAmount] = useState<string>("100.000");
  const [savingsDate, setSavingsDate] = useState<string>(new Date().toISOString().split("T")[0]);
  const [savingsNotes, setSavingsNotes] = useState<string>("");

  const filteredSavingsStudents = useMemo(() => {
    const list = masterStudents || [];
    if (!debouncedSavingsSearch.trim()) return list.slice(0, 6);
    const q = debouncedSavingsSearch.toLowerCase();
    return list.filter(
      (s) =>
        s?.name?.toLowerCase().includes(q) ||
        (s?.nis && s.nis.includes(q)) ||
        s?.grade?.toLowerCase().includes(q) ||
        s?.unit?.toLowerCase().includes(q)
    );
  }, [masterStudents, debouncedSavingsSearch]);

  const activeSavingsStudentBalance = useMemo(() => {
    if (!selectedSavingsStudent) return 0;
    return calculateStudentSavingsBalance(selectedSavingsStudent, financeTransactions);
  }, [selectedSavingsStudent, financeTransactions]);

  const parsedSavingsAmount = useMemo(() => {
    const clean = savingsAmount.replace(/\D/g, "");
    return clean ? parseInt(clean, 10) : 0;
  }, [savingsAmount]);

  // =========================================================================
  // HANDLERS
  // =========================================================================

  // Handle Income Submit (Kas Masuk / Pembayaran Siswa + Smart Payment)
  const handleSubmitIncome = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedIncomeStudent) {
      alert("Harap pilih nama siswa / santri terlebih dahulu.");
      return;
    }
    if (parsedIncomeAmount <= 0) {
      alert("Nominal pembayaran harus lebih besar dari 0.");
      return;
    }

    if (useSavingsDeduction && !isSavingsSufficient) {
      alert(
        `Saldo tabungan ${selectedIncomeStudent.name} (Rp ${selectedStudentSavingsBalance.toLocaleString(
          "id-ID"
        )}) tidak mencukupi untuk pembayaran sebesar Rp ${parsedIncomeAmount.toLocaleString("id-ID")}.`
      );
      return;
    }

    const opName = currentUser?.name || "Operator Kasir SIM";
    const paymentMethodLabel = useSavingsDeduction ? "Potong Saldo Tabungan" : "Kasir Tunai";

    // 1. If useSavingsDeduction is checked, record a Savings Withdrawal mutation
    if (useSavingsDeduction) {
      addFinanceTransaction({
        type: "savings",
        savingsType: "withdraw",
        category: "Tarik Tabungan (Bayar Sekolah)",
        amount: parsedIncomeAmount,
        description: `Pemotongan saldo tabungan santri untuk pembayaran ${incomePaymentType}`,
        operatorName: opName,
        date: incomeDate,
        unit: incomeUnit === "Les" ? "Yayasan" : incomeUnit,
        studentId: selectedIncomeStudent.id,
        studentName: selectedIncomeStudent.name,
        studentNis: selectedIncomeStudent.nis,
        studentGrade: selectedIncomeStudent.grade,
      });
    }

    // 2. Record Income Transaction (Laporan Kas)
    const incomeDesc = incomeDescription.trim()
      ? incomeDescription.trim()
      : `Pembayaran ${incomePaymentType} santri a.n. ${selectedIncomeStudent.name} (${selectedIncomeStudent.grade}) [${paymentMethodLabel}]`;

    const createdIncomeTrx = addFinanceTransaction({
      type: "income",
      category: incomePaymentType,
      amount: parsedIncomeAmount,
      description: incomeDesc,
      operatorName: opName,
      date: incomeDate,
      unit: incomeUnit === "Les" ? "Yayasan" : incomeUnit,
      studentId: selectedIncomeStudent.id,
      studentName: selectedIncomeStudent.name,
      studentNis: selectedIncomeStudent.nis,
      studentGrade: selectedIncomeStudent.grade,
    });

    // 3. Update Master Student Fee Record (Mark as Lunas)
    const updatedMaster = masterStudents.map((std) => {
      if (std.nis === selectedIncomeStudent.nis) {
        const updatedFees = { ...std.fees };
        updatedFees[incomePaymentType] = {
          status: "Lunas",
          amount: parsedIncomeAmount,
          paidAt: new Date().toLocaleDateString("id-ID", {
            day: "numeric",
            month: "long",
            year: "numeric",
          }),
          receiptNo: createdIncomeTrx.referenceNo,
          paidVia: useSavingsDeduction ? "Saldo Tabungan" : "Kasir Tunai",
        };
        return {
          ...std,
          fees: updatedFees,
        };
      }
      return std;
    });

    updateMasterStudents(updatedMaster);

    const remainingSavings = useSavingsDeduction
      ? selectedStudentSavingsBalance - parsedIncomeAmount
      : selectedStudentSavingsBalance;

    // Show Success Modal
    setSuccessReceiptModal({
      isOpen: true,
      referenceNo: createdIncomeTrx.referenceNo,
      title: "Transaksi Kasir Berhasil Dicatat",
      studentName: selectedIncomeStudent.name,
      amount: parsedIncomeAmount,
      paymentType: incomePaymentType,
      method: paymentMethodLabel,
      remainingSavings: useSavingsDeduction ? remainingSavings : undefined,
      auditHash: createdIncomeTrx.auditHash,
      timestamp: createdIncomeTrx.timestamp,
    });

    // Reset Form Fields
    setIncomeDescription("");
    setUseSavingsDeduction(false);
  };

  // Handle Expense Submit (Kas Keluar)
  const handleSubmitExpense = (e: React.FormEvent) => {
    e.preventDefault();

    const clean = expenseAmount.replace(/\D/g, "");
    const parsed = clean ? parseInt(clean, 10) : 0;
    if (parsed <= 0) {
      alert("Nominal pengeluaran harus lebih besar dari 0.");
      return;
    }

    const opName = currentUser?.name || "Operator Kasir SIM";
    const desc = expenseDescription.trim()
      ? expenseDescription.trim()
      : `Pengeluaran operasional ${expenseCategory} untuk unit ${expenseUnit}`;

    const createdTrx = addFinanceTransaction({
      type: "expense",
      category: expenseCategory,
      amount: parsed,
      description: desc,
      operatorName: opName,
      date: expenseDate,
      unit: expenseUnit,
      receiptUrl: expenseReceiptUrl || undefined,
      receiptName: expenseReceiptName || undefined,
      receiptSize: expenseReceiptSize || undefined,
    });

    setSuccessReceiptModal({
      isOpen: true,
      referenceNo: createdTrx.referenceNo,
      title: "Pengeluaran Berhasil Dibukukan",
      studentName: `Beban Unit ${expenseUnit}`,
      amount: parsed,
      paymentType: expenseCategory,
      method: "Kas Operasional",
      auditHash: createdTrx.auditHash,
      timestamp: createdTrx.timestamp,
    });

    setExpenseDescription("");
    setExpenseReceiptUrl("");
    setExpenseReceiptName("");
    setExpenseReceiptSize("");
  };

  // Handle Savings Submit (Setor / Tarik Tabungan Manual)
  const handleSubmitSavings = (e: React.FormEvent) => {
    e.preventDefault();

    if (!selectedSavingsStudent) {
      alert("Harap pilih nama santri pemilik rekening tabungan.");
      return;
    }
    if (parsedSavingsAmount <= 0) {
      alert("Nominal mutasi tabungan harus lebih besar dari 0.");
      return;
    }

    if (savingsMutationType === "withdraw" && parsedSavingsAmount > activeSavingsStudentBalance) {
      alert(
        `Saldo tabungan ${selectedSavingsStudent.name} (Rp ${activeSavingsStudentBalance.toLocaleString(
          "id-ID"
        )}) tidak mencukupi untuk ditarik sebesar Rp ${parsedSavingsAmount.toLocaleString("id-ID")}.`
      );
      return;
    }

    const opName = currentUser?.name || "Operator Kasir SIM";
    const category = savingsMutationType === "deposit" ? "Setor Tabungan" : "Tarik Tabungan";
    const desc = savingsNotes.trim()
      ? savingsNotes.trim()
      : `${category} santri a.n. ${selectedSavingsStudent.name} (${selectedSavingsStudent.grade})`;

    const createdTrx = addFinanceTransaction({
      type: "savings",
      savingsType: savingsMutationType,
      category,
      amount: parsedSavingsAmount,
      description: desc,
      operatorName: opName,
      date: savingsDate,
      unit: selectedSavingsStudent.unit === "Les" ? "Yayasan" : selectedSavingsStudent.unit,
      studentId: selectedSavingsStudent.id,
      studentName: selectedSavingsStudent.name,
      studentNis: selectedSavingsStudent.nis,
      studentGrade: selectedSavingsStudent.grade,
    });

    const newBalance =
      savingsMutationType === "deposit"
        ? activeSavingsStudentBalance + parsedSavingsAmount
        : activeSavingsStudentBalance - parsedSavingsAmount;

    setSuccessReceiptModal({
      isOpen: true,
      referenceNo: createdTrx.referenceNo,
      title: `Mutasi Tabungan ${savingsMutationType === "deposit" ? "Setor (+)" : "Tarik (-)"} Sukses`,
      studentName: selectedSavingsStudent.name,
      amount: parsedSavingsAmount,
      paymentType: category,
      method: "Buku Tabungan Santri",
      remainingSavings: newBalance,
      auditHash: createdTrx.auditHash,
      timestamp: createdTrx.timestamp,
    });

    setSavingsNotes("");
  };

  return (
    <div className="space-y-6 text-white">
      {/* Top Banner Kasir */}
      <div className="bg-gradient-to-r from-[#1a1a24] via-[#161622] to-[#12121a] rounded-2xl p-6 border border-white/10 text-white shadow-xl relative overflow-hidden backdrop-blur-md">
        <div className="absolute right-0 top-0 w-80 h-80 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/20 border border-cyan-500/40 text-cyan-400 text-xs font-bold mb-2">
              <CreditCard className="w-3.5 h-3.5" />
              <span>Loket Kasir & Administrasi Keuangan</span>
            </div>
            <h1 className="text-2xl font-black tracking-tight text-white">
              Kasir Pembayaran &amp; Tabungan
            </h1>
            <p className="text-xs sm:text-sm text-gray-300 mt-1 max-w-2xl leading-relaxed">
              Catat penerimaan kas siswa (SPP, Daftar Ulang, dll.), pengeluaran operasional yayasan berbukti nota, serta mutasi setoran &amp; penarikan buku tabungan santri.
            </p>
          </div>

          {/* Quick Direct Links */}
          <div className="flex items-center gap-2.5">
            {setActiveTab && (
              <>
                <button
                  onClick={() => setActiveTab("operator_cash_report")}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <Receipt className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Buka Laporan Kas</span>
                </button>
                <button
                  onClick={() => setActiveTab("operator_fee_admin")}
                  className="px-3.5 py-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/15 text-gray-200 text-xs font-bold flex items-center gap-2 transition-all cursor-pointer"
                >
                  <UserCheck className="w-3.5 h-3.5 text-amber-400" />
                  <span>Cek Tagihan Siswa</span>
                </button>
              </>
            )}
          </div>
        </div>
      </div>

      {/* 3 Main Sub-Tabs Switcher */}
      <div className="flex p-1.5 rounded-2xl bg-[#14141d] border border-white/10 shadow-lg">
        <button
          onClick={() => setKasirSubTab("pendapatan")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            kasirSubTab === "pendapatan"
              ? "bg-gradient-to-r from-emerald-500 to-emerald-600 text-black shadow-lg shadow-emerald-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          <span>1. Pendapatan (Kas Masuk)</span>
        </button>

        <button
          onClick={() => setKasirSubTab("pengeluaran")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            kasirSubTab === "pengeluaran"
              ? "bg-gradient-to-r from-rose-500 to-rose-600 text-white shadow-lg shadow-rose-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          <span>2. Pengeluaran (Belanja Operasional)</span>
        </button>

        <button
          onClick={() => setKasirSubTab("tabungan")}
          className={`flex-1 py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2.5 transition-all cursor-pointer ${
            kasirSubTab === "tabungan"
              ? "bg-gradient-to-r from-amber-500 to-amber-600 text-black shadow-lg shadow-amber-500/25"
              : "text-gray-400 hover:text-white hover:bg-white/5"
          }`}
        >
          <PiggyBank className="w-4 h-4" />
          <span>3. Tabungan Santri (Setor/Tarik)</span>
        </button>
      </div>

      {/* ========================================================================= */}
      {/* SUB-TAB 1: PENDAPATAN (INCOME) */}
      {/* ========================================================================= */}
      {kasirSubTab === "pendapatan" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a24]/80 rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingUp className="w-5 h-5 text-emerald-400" />
                <span>Formulir Penerimaan Kas Masuk Santri</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Pilih santri, tentukan jenis pembayaran resmi, dan aktifkan fitur Smart Payment jika ingin memotong otomatis dari saldo tabungan.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 text-xs font-bold border border-emerald-500/30">
              Kas Masuk (IDR)
            </span>
          </div>

          <form onSubmit={handleSubmitIncome} className="space-y-6">
            {/* Student Search and Selection */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Cari &amp; Pilih Santri / Siswa Pembayar <span className="text-rose-400">*</span>
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ketik Nama Siswa, NIS, atau Kelas..."
                  value={incomeStudentSearch}
                  onChange={(e) => {
                    setIncomeStudentSearch(e.target.value);
                    setIsIncomeDropdownOpen(true);
                  }}
                  onFocus={() => setIsIncomeDropdownOpen(true)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm placeholder-gray-500 transition-all"
                />
                {selectedIncomeStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedIncomeStudent(null);
                      setIncomeStudentSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isIncomeDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-xl bg-[#14141d] border border-white/15 shadow-2xl p-1.5 custom-scrollbar">
                  {filteredIncomeStudents.length === 0 ? (
                    <div className="p-4 text-center text-xs text-gray-400">
                      Siswa tidak ditemukan dalam database.
                    </div>
                  ) : (
                    filteredIncomeStudents.map((std) => {
                      const savingsBal = calculateStudentSavingsBalance(std, financeTransactions);
                      return (
                        <div
                          key={std.id}
                          onClick={() => {
                            setSelectedIncomeStudent(std);
                            setIncomeStudentSearch(`${std.name} (${std.grade})`);
                            setIsIncomeDropdownOpen(false);
                          }}
                          className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={std.avatar}
                              alt={std.name}
                              className="w-9 h-9 rounded-full object-cover border border-white/20"
                            />
                            <div>
                              <div className="text-sm font-bold text-white">{std.name}</div>
                              <div className="text-xs text-gray-400">
                                NIS: {std.nis} • {std.grade} • Unit {std.unit}
                              </div>
                            </div>
                          </div>
                          <div className="text-right">
                            <div className="text-[11px] text-gray-400 font-semibold">Saldo Tabungan</div>
                            <div className="text-xs font-bold text-cyan-300">
                              Rp {savingsBal.toLocaleString("id-ID")}
                            </div>
                          </div>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>

            {/* Selected Student Pill Card */}
            {selectedIncomeStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-cyan-950/30 border border-cyan-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedIncomeStudent.avatar}
                    alt={selectedIncomeStudent.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-cyan-400"
                  />
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>{selectedIncomeStudent.name}</span>
                      <span className="px-2 py-0.5 rounded-md bg-cyan-500/20 text-cyan-300 text-[10px] font-bold border border-cyan-500/30">
                        {selectedIncomeStudent.unit}
                      </span>
                    </div>
                    <div className="text-xs text-gray-300">
                      NIS: {selectedIncomeStudent.nis} • {selectedIncomeStudent.grade} • Rek: {selectedIncomeStudent.savingsAccountNo}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 bg-black/40 px-3.5 py-2 rounded-xl border border-cyan-500/20">
                  <PiggyBank className="w-5 h-5 text-amber-400" />
                  <div>
                    <div className="text-[10px] text-gray-400 font-bold uppercase">Saldo Tabungan Riil</div>
                    <div className="text-sm font-black text-cyan-300">
                      Rp {selectedStudentSavingsBalance.toLocaleString("id-ID")}
                    </div>
                  </div>
                </div>
              </motion.div>
            )}

            {/* Grid 2 Columns: Payment Type & Nominal */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              {/* Dropdown 21 Jenis Pembayaran Resmi */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Jenis Pembayaran (GForm Resmi) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={incomePaymentType}
                    onChange={(e) => setIncomePaymentType(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm appearance-none cursor-pointer"
                  >
                    {GFORM_PAYMENT_TYPES.map((type) => (
                      <option key={type} value={type} className="bg-[#14141d] text-white">
                        {type}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Nominal Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Nominal Pembayaran (IDR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={incomeAmount}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, "");
                      setIncomeAmount(num ? parseInt(num, 10).toLocaleString("id-ID") : "");
                    }}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-emerald-400 font-black text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Quick Amount Suggestion Buttons */}
            <div className="flex flex-wrap items-center gap-2 text-xs">
              <span className="text-gray-400 font-semibold mr-1">Rekomendasi Cepat:</span>
              {[250000, 300000, 350000, 450000, 1500000].map((amt) => (
                <button
                  key={amt}
                  type="button"
                  onClick={() => setIncomeAmount(amt.toLocaleString("id-ID"))}
                  className="px-2.5 py-1 rounded-lg bg-white/5 hover:bg-white/10 border border-white/10 text-gray-300 font-bold transition-colors cursor-pointer"
                >
                  Rp {amt.toLocaleString("id-ID")}
                </button>
              ))}
            </div>

            {/* SPEC 7: SMART PAYMENT TOGGLE ("Potong dari Saldo Tabungan") */}
            <div className="p-4 rounded-xl bg-gradient-to-r from-[#1c1d2b] to-[#161724] border border-cyan-500/40 relative overflow-hidden">
              <div className="flex items-start sm:items-center justify-between gap-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/20 text-cyan-400 flex items-center justify-center border border-cyan-500/30">
                    <Sparkles className="w-5 h-5 text-cyan-400 animate-pulse" />
                  </div>
                  <div>
                    <div className="text-sm font-black text-white flex items-center gap-2">
                      <span>Smart Payment: Potong dari Saldo Tabungan</span>
                      <span className="text-[10px] px-1.5 py-0.5 rounded bg-cyan-500/20 text-cyan-300 font-bold border border-cyan-500/40">
                        Otomatis
                      </span>
                    </div>
                    <p className="text-xs text-gray-300 mt-0.5">
                      Jika aktif, saldo tabungan santri otomatis berkurang dan tagihan siswa langsung lunas tercatat di buku besar.
                    </p>
                  </div>
                </div>

                {/* Toggle Switch */}
                <label className="relative inline-flex items-center cursor-pointer shrink-0">
                  <input
                    type="checkbox"
                    checked={useSavingsDeduction}
                    onChange={(e) => setUseSavingsDeduction(e.target.checked)}
                    className="sr-only peer"
                  />
                  <div className="w-12 h-6 bg-gray-700 peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-cyan-500"></div>
                </label>
              </div>

              {/* Status Message for Smart Payment */}
              {useSavingsDeduction && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: "auto" }}
                  className="mt-4 pt-3 border-t border-white/10"
                >
                  {!selectedIncomeStudent ? (
                    <div className="text-xs text-amber-400 flex items-center gap-1.5 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0" />
                      <span>Pilih santri terlebih dahulu untuk memverifikasi kecukupan saldo tabungan.</span>
                    </div>
                  ) : !isSavingsSufficient ? (
                    <div className="text-xs text-rose-400 bg-rose-950/40 p-3 rounded-lg border border-rose-500/30 flex items-center gap-2 font-semibold">
                      <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                      <span>
                        Saldo tabungan {selectedIncomeStudent.name} (Rp {selectedStudentSavingsBalance.toLocaleString("id-ID")}) TIDAK MENCUKUPI untuk tagihan Rp {parsedIncomeAmount.toLocaleString("id-ID")}. Kurang Rp {(parsedIncomeAmount - selectedStudentSavingsBalance).toLocaleString("id-ID")}.
                      </span>
                    </div>
                  ) : (
                    <div className="text-xs text-emerald-400 bg-emerald-950/40 p-3 rounded-lg border border-emerald-500/30 flex items-center justify-between font-semibold">
                      <div className="flex items-center gap-2">
                        <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                        <span>Saldo mencukupi! Saldo tabungan akan otomatis terpotong Rp {parsedIncomeAmount.toLocaleString("id-ID")}.</span>
                      </div>
                      <span className="text-cyan-300 font-bold">
                        Sisa Tabungan: Rp {(selectedStudentSavingsBalance - parsedIncomeAmount).toLocaleString("id-ID")}
                      </span>
                    </div>
                  )}
                </motion.div>
              )}
            </div>

            {/* Date & Optional Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Tanggal Pencatatan
                </label>
                <input
                  type="date"
                  value={incomeDate}
                  onChange={(e) => setIncomeDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Keterangan / Uraian Tambahan (Opsional)
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Titipan orang tua via kasir tunai"
                  value={incomeDescription}
                  onChange={(e) => setIncomeDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-cyan-400 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={useSavingsDeduction && !isSavingsSufficient}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  useSavingsDeduction && !isSavingsSufficient
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                    : useSavingsDeduction
                    ? "bg-gradient-to-r from-cyan-400 to-blue-500 text-black hover:opacity-95 shadow-cyan-500/25 active:scale-95"
                    : "bg-gradient-to-r from-emerald-500 to-teal-500 text-black hover:opacity-95 shadow-emerald-500/25 active:scale-95"
                }`}
              >
                {useSavingsDeduction ? (
                  <>
                    <Coins className="w-4 h-4" />
                    <span>Bayar &amp; Potong Saldo Tabungan (Rp {parsedIncomeAmount.toLocaleString("id-ID")})</span>
                  </>
                ) : (
                  <>
                    <CheckCircle2 className="w-4 h-4" />
                    <span>Proses Kasir &amp; Terbitkan Kuitansi (Rp {parsedIncomeAmount.toLocaleString("id-ID")})</span>
                  </>
                )}
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 2: PENGELUARAN (EXPENSES) */}
      {/* ========================================================================= */}
      {kasirSubTab === "pengeluaran" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a24]/80 rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <TrendingDown className="w-5 h-5 text-rose-400" />
                <span>Formulir Pengeluaran Kas Operasional Yayasan</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Catat belanja operasional, pembelian sarana, honor, dan tagihan listrik/PDAM lengkap dengan upload foto nota fisik.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-rose-500/20 text-rose-300 text-xs font-bold border border-rose-500/30">
              Kas Keluar (IDR)
            </span>
          </div>

          <form onSubmit={handleSubmitExpense} className="space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
              {/* Category Dropdown */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Jenis Pengeluaran <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <select
                    value={expenseCategory}
                    onChange={(e) => setExpenseCategory(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-sm appearance-none cursor-pointer"
                  >
                    {EXPENSE_CATEGORIES.map((cat) => (
                      <option key={cat} value={cat} className="bg-[#14141d] text-white">
                        {cat}
                      </option>
                    ))}
                  </select>
                  <ChevronDown className="w-4 h-4 text-gray-400 absolute right-4 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>
              </div>

              {/* Unit Beban */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Beban Unit Lembaga <span className="text-rose-400">*</span>
                </label>
                <select
                  value={expenseUnit}
                  onChange={(e) => setExpenseUnit(e.target.value as any)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-sm appearance-none cursor-pointer"
                >
                  <option value="Yayasan" className="bg-[#14141d]">Yayasan (Pusat)</option>
                  <option value="RA" className="bg-[#14141d]">Unit RA</option>
                  <option value="SD" className="bg-[#14141d]">Unit SD</option>
                  <option value="MTs" className="bg-[#14141d]">Unit MTs</option>
                </select>
              </div>

              {/* Nominal Input */}
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Nominal Pengeluaran (IDR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={expenseAmount}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, "");
                      setExpenseAmount(num ? parseInt(num, 10).toLocaleString("id-ID") : "");
                    }}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-rose-400 font-black text-lg"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Date & Description */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Tanggal Pengeluaran
                </label>
                <input
                  type="date"
                  value={expenseDate}
                  onChange={(e) => setExpenseDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-sm cursor-pointer"
                />
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Deskripsi / Rincian Belanja
                </label>
                <input
                  type="text"
                  placeholder="Contoh: Pembelian token listrik 3 meteran unit sekolah"
                  value={expenseDescription}
                  onChange={(e) => setExpenseDescription(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-rose-400 focus:outline-none text-white text-sm"
                />
              </div>
            </div>

            {/* Receipt Upload Zone */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Lampiran Foto Nota / Bukti Kuitansi Fisik (Opsional)
              </label>

              <input
                ref={expenseFileInputRef}
                type="file"
                accept="image/*,.pdf"
                onChange={handleExpenseFileUpload}
                className="hidden"
              />

              {!expenseReceiptUrl ? (
                <div
                  onClick={() => expenseFileInputRef.current?.click()}
                  className="p-6 rounded-2xl border-2 border-dashed border-white/20 hover:border-cyan-400/50 bg-black/30 hover:bg-black/40 flex flex-col items-center justify-center text-center cursor-pointer transition-all group"
                >
                  <div className="w-12 h-12 rounded-2xl bg-white/5 border border-white/10 group-hover:border-cyan-400/40 flex items-center justify-center text-gray-400 group-hover:text-cyan-400 transition-colors mb-3">
                    <Camera className="w-6 h-6" />
                  </div>
                  <div className="text-sm font-bold text-white">
                    Klik untuk Ambil Foto Kamera atau Pilih Berkas Nota
                  </div>
                  <p className="text-xs text-gray-400 mt-1">
                    Mendukung format JPG, PNG, atau PDF (Maksimal 10 MB) untuk transparansi audit.
                  </p>
                </div>
              ) : (
                <div className="p-4 rounded-xl bg-black/40 border border-cyan-500/30 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <img
                      src={expenseReceiptUrl}
                      alt="Pratinjau Nota"
                      className="w-14 h-14 rounded-lg object-cover border border-white/20"
                    />
                    <div>
                      <div className="text-sm font-bold text-white truncate max-w-xs">
                        {expenseReceiptName || "Foto_Nota_Pengeluaran.jpg"}
                      </div>
                      <div className="text-xs text-cyan-400 font-semibold">
                        {expenseReceiptSize || "1.2 MB"} • Siap Diarsip
                      </div>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={() => {
                      setExpenseReceiptUrl("");
                      setExpenseReceiptName("");
                      setExpenseReceiptSize("");
                    }}
                    className="p-2 rounded-lg bg-rose-500/20 text-rose-400 hover:bg-rose-500/30 border border-rose-500/30 transition-colors"
                  >
                    <Trash2 className="w-4 h-4" />
                  </button>
                </div>
              )}
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                className="w-full sm:w-auto px-8 py-3.5 rounded-xl bg-gradient-to-r from-rose-500 to-red-600 text-white font-black text-sm shadow-xl shadow-rose-500/25 hover:opacity-95 flex items-center justify-center gap-2 transition-all cursor-pointer active:scale-95"
              >
                <Receipt className="w-4 h-4" />
                <span>Simpan Transaksi Pengeluaran</span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* SUB-TAB 3: TABUNGAN (SAVINGS) */}
      {/* ========================================================================= */}
      {kasirSubTab === "tabungan" && (
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-[#1a1a24]/80 rounded-2xl p-6 sm:p-8 border border-white/10 shadow-xl backdrop-blur-xl"
        >
          <div className="flex items-center justify-between mb-6 pb-4 border-b border-white/10">
            <div>
              <h2 className="text-lg font-black text-white flex items-center gap-2">
                <PiggyBank className="w-5 h-5 text-amber-400" />
                <span>Formulir Mutasi Buku Tabungan Santri</span>
              </h2>
              <p className="text-xs text-gray-400 mt-0.5">
                Kelola setoran tunai tabungan santri berkala dan penarikan dana tabungan langsung di loket kasir.
              </p>
            </div>
            <span className="px-3 py-1 rounded-full bg-amber-500/20 text-amber-300 text-xs font-bold border border-amber-500/30">
              Buku Tabungan
            </span>
          </div>

          <form onSubmit={handleSubmitSavings} className="space-y-6">
            {/* Student Search */}
            <div className="relative">
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Pilih Santri Pemilik Tabungan <span className="text-rose-400">*</span>
              </label>

              <div className="relative">
                <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                <input
                  type="text"
                  placeholder="Ketik Nama Siswa atau Nomor Rekening Tabungan..."
                  value={savingsStudentSearch}
                  onChange={(e) => {
                    setSavingsStudentSearch(e.target.value);
                    setIsSavingsDropdownOpen(true);
                  }}
                  onFocus={() => setIsSavingsDropdownOpen(true)}
                  className="w-full pl-10 pr-10 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm placeholder-gray-500 transition-all"
                />
                {selectedSavingsStudent && (
                  <button
                    type="button"
                    onClick={() => {
                      setSelectedSavingsStudent(null);
                      setSavingsStudentSearch("");
                    }}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>

              {/* Autocomplete Dropdown */}
              {isSavingsDropdownOpen && (
                <div className="absolute z-30 left-0 right-0 mt-2 max-h-64 overflow-y-auto rounded-xl bg-[#14141d] border border-white/15 shadow-2xl p-1.5 custom-scrollbar">
                  {filteredSavingsStudents.map((std) => {
                    const bal = calculateStudentSavingsBalance(std, financeTransactions);
                    return (
                      <div
                        key={std.id}
                        onClick={() => {
                          setSelectedSavingsStudent(std);
                          setSavingsStudentSearch(`${std.name} (${std.grade})`);
                          setIsSavingsDropdownOpen(false);
                        }}
                        className="flex items-center justify-between p-2.5 rounded-lg hover:bg-white/10 cursor-pointer transition-colors"
                      >
                        <div className="flex items-center gap-3">
                          <img
                            src={std.avatar}
                            alt={std.name}
                            className="w-9 h-9 rounded-full object-cover border border-white/20"
                          />
                          <div>
                            <div className="text-sm font-bold text-white">{std.name}</div>
                            <div className="text-xs text-gray-400">
                              Rek: {std.savingsAccountNo} • {std.grade}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-[11px] text-gray-400 font-semibold">Saldo Terkini</div>
                          <div className="text-xs font-bold text-amber-300">
                            Rp {bal.toLocaleString("id-ID")}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </div>

            {/* Selected Student Card */}
            {selectedSavingsStudent && (
              <motion.div
                initial={{ opacity: 0, scale: 0.98 }}
                animate={{ opacity: 1, scale: 1 }}
                className="p-4 rounded-xl bg-amber-950/20 border border-amber-500/30 flex flex-col sm:flex-row sm:items-center justify-between gap-3"
              >
                <div className="flex items-center gap-3">
                  <img
                    src={selectedSavingsStudent.avatar}
                    alt={selectedSavingsStudent.name}
                    className="w-11 h-11 rounded-full object-cover border-2 border-amber-400"
                  />
                  <div>
                    <div className="text-sm font-black text-white">{selectedSavingsStudent.name}</div>
                    <div className="text-xs text-gray-300">
                      No. Rekening: <span className="font-mono text-amber-300 font-bold">{selectedSavingsStudent.savingsAccountNo}</span> • Unit {selectedSavingsStudent.unit}
                    </div>
                  </div>
                </div>

                <div className="bg-black/40 px-4 py-2 rounded-xl border border-amber-500/30 text-right">
                  <span className="text-[10px] text-gray-400 font-bold uppercase block">
                    Saldo Tabungan Riil
                  </span>
                  <div className="text-lg font-black text-amber-300">
                    Rp {activeSavingsStudentBalance.toLocaleString("id-ID")}
                  </div>
                </div>
              </motion.div>
            )}

            {/* Mutation Type Toggle (Setor vs Tarik) */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Jenis Mutasi Tabungan <span className="text-rose-400">*</span>
              </label>
              <div className="grid grid-cols-2 gap-3 max-w-md">
                <button
                  type="button"
                  onClick={() => setSavingsMutationType("deposit")}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    savingsMutationType === "deposit"
                      ? "bg-emerald-500/20 text-emerald-300 border-emerald-500/50 shadow-lg shadow-emerald-500/10"
                      : "bg-black/30 text-gray-400 border-white/10 hover:bg-white/5"
                  }`}
                >
                  <TrendingUp className="w-4 h-4 text-emerald-400" />
                  <span>Setor Tabungan (+)</span>
                </button>

                <button
                  type="button"
                  onClick={() => setSavingsMutationType("withdraw")}
                  className={`py-3 px-4 rounded-xl font-bold text-xs sm:text-sm flex items-center justify-center gap-2 border transition-all cursor-pointer ${
                    savingsMutationType === "withdraw"
                      ? "bg-rose-500/20 text-rose-300 border-rose-500/50 shadow-lg shadow-rose-500/10"
                      : "bg-black/30 text-gray-400 border-white/10 hover:bg-white/5"
                  }`}
                >
                  <TrendingDown className="w-4 h-4 text-rose-400" />
                  <span>Tarik Tabungan (-)</span>
                </button>
              </div>
            </div>

            {/* Nominal & Date */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Nominal Mutasi (IDR) <span className="text-rose-400">*</span>
                </label>
                <div className="relative">
                  <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-bold text-gray-400">
                    Rp
                  </span>
                  <input
                    type="text"
                    value={savingsAmount}
                    onChange={(e) => {
                      const num = e.target.value.replace(/\D/g, "");
                      setSavingsAmount(num ? parseInt(num, 10).toLocaleString("id-ID") : "");
                    }}
                    placeholder="0"
                    className="w-full pl-11 pr-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-amber-300 font-black text-lg"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                  Tanggal Mutasi
                </label>
                <input
                  type="date"
                  value={savingsDate}
                  onChange={(e) => setSavingsDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm cursor-pointer"
                />
              </div>
            </div>

            {/* Notes */}
            <div>
              <label className="block text-xs font-bold uppercase tracking-wider text-gray-300 mb-2">
                Catatan / Keperluan Tabungan (Opsional)
              </label>
              <input
                type="text"
                placeholder="Contoh: Tabungan mingguan rutin santri"
                value={savingsNotes}
                onChange={(e) => setSavingsNotes(e.target.value)}
                className="w-full px-4 py-3 rounded-xl bg-black/40 border border-white/15 focus:border-amber-400 focus:outline-none text-white text-sm"
              />
            </div>

            {/* Submit Button */}
            <div className="pt-2 flex justify-end">
              <button
                type="submit"
                disabled={savingsMutationType === "withdraw" && parsedSavingsAmount > activeSavingsStudentBalance}
                className={`w-full sm:w-auto px-8 py-3.5 rounded-xl font-black text-sm shadow-xl flex items-center justify-center gap-2 transition-all cursor-pointer ${
                  savingsMutationType === "withdraw" && parsedSavingsAmount > activeSavingsStudentBalance
                    ? "bg-gray-800 text-gray-500 cursor-not-allowed border border-white/5"
                    : "bg-gradient-to-r from-amber-500 to-amber-600 text-black hover:opacity-95 shadow-amber-500/25 active:scale-95"
                }`}
              >
                <Coins className="w-4 h-4" />
                <span>
                  Proses {savingsMutationType === "deposit" ? "Setoran Tabungan" : "Penarikan Tabungan"} (Rp {parsedSavingsAmount.toLocaleString("id-ID")})
                </span>
              </button>
            </div>
          </form>
        </motion.div>
      )}

      {/* ========================================================================= */}
      {/* SUCCESS CONFIRMATION MODAL & LIGHTBOX */}
      {/* ========================================================================= */}
      <AnimatePresence>
        {successReceiptModal?.isOpen && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="w-full max-w-lg bg-[#181824] border border-cyan-500/40 rounded-2xl p-6 sm:p-7 shadow-2xl relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-40 h-40 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none" />

              <div className="flex items-start justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-2xl bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center text-emerald-400">
                    <CheckCircle2 className="w-7 h-7" />
                  </div>
                  <div>
                    <h3 className="text-lg font-black text-white">
                      {successReceiptModal.title}
                    </h3>
                    <div className="font-mono text-xs text-cyan-300 mt-0.5">
                      {successReceiptModal.referenceNo}
                    </div>
                  </div>
                </div>

                <button
                  onClick={() => setSuccessReceiptModal(null)}
                  className="p-1 rounded-lg text-gray-400 hover:text-white hover:bg-white/10"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {/* Receipt Details Box */}
              <div className="mt-5 p-4 rounded-xl bg-black/50 border border-white/10 space-y-3 font-mono text-xs">
                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Nama Santri / Beban:</span>
                  <span className="font-bold text-white text-right">
                    {successReceiptModal.studentName}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Jenis Transaksi:</span>
                  <span className="font-bold text-cyan-300">
                    {successReceiptModal.paymentType}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Metode Pembayaran:</span>
                  <span className="font-bold text-emerald-400">
                    {successReceiptModal.method}
                  </span>
                </div>

                <div className="flex justify-between border-b border-white/10 pb-2">
                  <span className="text-gray-400">Nominal:</span>
                  <span className="font-black text-base text-white">
                    Rp {successReceiptModal.amount.toLocaleString("id-ID")}
                  </span>
                </div>

                {successReceiptModal.remainingSavings !== undefined && (
                  <div className="flex justify-between border-b border-white/10 pb-2 bg-cyan-950/20 p-2 rounded">
                    <span className="text-cyan-300 font-sans font-bold">Sisa Saldo Tabungan:</span>
                    <span className="font-black text-cyan-300">
                      Rp {successReceiptModal.remainingSavings.toLocaleString("id-ID")}
                    </span>
                  </div>
                )}

                <div className="pt-1 text-[10px] text-gray-500 break-all">
                  Integritas Audit: {successReceiptModal.auditHash}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="mt-6 flex items-center justify-end gap-3">
                <button
                  onClick={() => window.print()}
                  className="px-4 py-2.5 rounded-xl bg-white/10 hover:bg-white/15 border border-white/15 text-white text-xs font-bold flex items-center gap-2 cursor-pointer transition-all"
                >
                  <Printer className="w-3.5 h-3.5 text-cyan-400" />
                  <span>Cetak Bukti</span>
                </button>

                <button
                  onClick={() => setSuccessReceiptModal(null)}
                  className="px-6 py-2.5 rounded-xl bg-cyan-500 hover:bg-cyan-400 text-black text-xs font-black shadow-lg shadow-cyan-500/25 cursor-pointer transition-all active:scale-95"
                >
                  Selesai
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}
