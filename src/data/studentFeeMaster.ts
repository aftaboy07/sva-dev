// Master Student Fee & Savings Data Service
// Manages fee tracking across all units (RA, SD, MTs) and synchronization with finance transactions

export interface FeeItemStatus {
  status: "Lunas" | "Belum Lunas";
  amount: number;
  paidAt?: string;
  receiptNo?: string;
  paidVia?: "Kasir Tunai" | "Saldo Tabungan" | "Transfer Bank";
}

export interface MasterStudentFeeRecord {
  id: string;
  nis: string;
  name: string;
  unit: "RA" | "SD" | "MTs" | "Les";
  grade: string;
  avatar: string;
  parentPhone: string;
  savingsAccountNo: string;
  initialSavingsBalance: number;
  // Breakdown of 21 official payment types
  fees: Record<string, FeeItemStatus>;
}

export const GFORM_PAYMENT_TYPES = [
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

export const EXPENSE_CATEGORIES = [
  "Transportasi",
  "Iuran Rapat",
  "Kebutuhan Sekolah",
  "Konsumsi",
  "Listrik",
  "PDAM",
  "Internet & Wi-Fi",
  "Pemeliharaan Gedung & Sarana",
  "ATK & Fotokopi Modul",
  "Honor & Tunjangan Operasional",
  "dll.",
] as const;

// Default standard amounts based on unit and fee type
export function getDefaultFeeAmount(unit: "RA" | "SD" | "MTs" | "Les", feeType: string): number {
  if (feeType.startsWith("SPP")) {
    switch (unit) {
      case "RA": return 250000;
      case "SD": return 300000;
      case "MTs": return 350000;
      case "Les": return 200000;
      default: return 350000;
    }
  }

  switch (feeType) {
    case "Daftar Ulang":
      return unit === "RA" ? 1000000 : unit === "SD" ? 1250000 : 1500000;
    case "Seragam":
      return unit === "RA" ? 350000 : 450000;
    case "LKS Sem 1":
    case "LKS Sem 2":
      return 120000;
    case "Pembayaran UTS":
    case "Pembayaran UAS":
      return 75000;
    case "Badge":
      return 25000;
    case "Buku Tabungan":
      return 20000;
    case "Karnaval":
      return 50000;
    default:
      return 100000;
  }
}

// Helper to construct fees for mock dataset
function createStudentFees(
  unit: "RA" | "SD" | "MTs",
  sppMonthsPaid: number, // e.g. 3 for Juli, Agustus, September
  hasPaidLKS1: boolean = true,
  hasPaidUTS: boolean = true
): Record<string, FeeItemStatus> {
  const sppAmount = unit === "RA" ? 250000 : unit === "SD" ? 300000 : 350000;
  const daftarUlangAmount = unit === "RA" ? 1000000 : unit === "SD" ? 1250000 : 1500000;
  const seragamAmount = unit === "RA" ? 350000 : 450000;

  const sppMonthNames = [
    "SPP Juli", "SPP Agustus", "SPP September", "SPP Oktober",
    "SPP November", "SPP Desember", "SPP Januari", "SPP Februari",
    "SPP Maret", "SPP April", "SPP Mei", "SPP Juni"
  ];

  const feesObj: Record<string, FeeItemStatus> = {
    "Daftar Ulang": { status: "Lunas", amount: daftarUlangAmount, paidAt: "08 Juli 2026", receiptNo: `KWIT-DU-${Math.floor(100 + Math.random() * 900)}` },
    "Seragam": { status: "Lunas", amount: seragamAmount, paidAt: "10 Juli 2026", receiptNo: `KWIT-SRG-${Math.floor(100 + Math.random() * 900)}` },
    "LKS Sem 1": hasPaidLKS1 ? { status: "Lunas", amount: 120000, paidAt: "15 Juli 2026", receiptNo: `KWIT-LKS1-${Math.floor(100 + Math.random() * 900)}` } : { status: "Belum Lunas", amount: 120000 },
    "LKS Sem 2": { status: "Belum Lunas", amount: 120000 },
    "Pembayaran UTS": hasPaidUTS ? { status: "Lunas", amount: 75000, paidAt: "22 September 2026", receiptNo: `KWIT-UTS-${Math.floor(100 + Math.random() * 900)}` } : { status: "Belum Lunas", amount: 75000 },
    "Pembayaran UAS": { status: "Belum Lunas", amount: 75000 },
    "Badge": { status: "Lunas", amount: 25000, paidAt: "08 Juli 2026", receiptNo: `KWIT-BDG-${Math.floor(100 + Math.random() * 900)}` },
    "Buku Tabungan": { status: "Lunas", amount: 20000, paidAt: "08 Juli 2026", receiptNo: `KWIT-TBG-${Math.floor(100 + Math.random() * 900)}` },
    "Karnaval": { status: "Lunas", amount: 50000, paidAt: "14 Agustus 2026", receiptNo: `KWIT-KRN-${Math.floor(100 + Math.random() * 900)}` },
  };

  sppMonthNames.forEach((month, idx) => {
    if (idx < sppMonthsPaid) {
      feesObj[month] = {
        status: "Lunas",
        amount: sppAmount,
        paidAt: `0${Math.min(idx + 5, 9)} ${idx === 0 ? "Juli" : idx === 1 ? "Agustus" : idx === 2 ? "September" : "Oktober"} 2026`,
        receiptNo: `KWIT-SPP-${idx + 1}${Math.floor(10 + Math.random() * 90)}`,
      };
    } else {
      feesObj[month] = { status: "Belum Lunas", amount: sppAmount };
    }
  });

  return feesObj;
}

// =============================================================================
// EXACT 10 MOCK STUDENTS REQUIRED FOR LIVE DEMONSTRATION:
// 1. AINIYATUL MAFTUHAH (Unit: RA, Class: RA, NIS: 26001)
// 2. AROFATUL JENNAH (Unit: SD, Class: Kelas 1, NIS: 26011)
// 3. MUHAMMAD WAHYU AL AZHARMOH (Unit: SD, Class: Kelas 2, NIS: 26012)
// 4. AL BAHAUDDIN AKBAR (Unit: SD, Class: Kelas 3, NIS: 26013)
// 5. YUSUF PUTRA ARDIANSYAH (Unit: SD, Class: Kelas 4, NIS: 26014)
// 6. ZUNAIRA PUTRI AYU (Unit: SD, Class: Kelas 5, NIS: 26015)
// 7. ALINA HAFSHOHAFIFAH TULJENNAH (Unit: SD, Class: Kelas 6, NIS: 26016)
// 8. MOH. ARIF HIDAYATULLOH (Unit: MTs, Class: Kelas 7, NIS: 26071)
// 9. FATIMATUS AZAHRA (Unit: MTs, Class: Kelas 8, NIS: 26081)
// 10. NAURA SYARIFAH NUR FADHILAH (Unit: MTs, Class: Kelas 9, NIS: 26091)
// =============================================================================
export const INITIAL_MASTER_STUDENT_FEES: MasterStudentFeeRecord[] = [
  {
    id: "std-26001",
    nis: "26001",
    name: "AINIYATUL MAFTUHAH",
    unit: "RA",
    grade: "RA",
    avatar: "https://images.unsplash.com/photo-1543610892-0b1f7e6d8ac1?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0001",
    savingsAccountNo: "TAB-RA-26001",
    initialSavingsBalance: 450000,
    fees: createStudentFees("RA", 4, true, true),
  },
  {
    id: "std-26011",
    nis: "26011",
    name: "AROFATUL JENNAH",
    unit: "SD",
    grade: "Kelas 1",
    avatar: "https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0002",
    savingsAccountNo: "TAB-SD-26011",
    initialSavingsBalance: 600000,
    fees: createStudentFees("SD", 3, true, true),
  },
  {
    id: "std-26012",
    nis: "26012",
    name: "MUHAMMAD WAHYU AL AZHARMOH",
    unit: "SD",
    grade: "Kelas 2",
    avatar: "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0003",
    savingsAccountNo: "TAB-SD-26012",
    initialSavingsBalance: 750000,
    fees: createStudentFees("SD", 4, true, true),
  },
  {
    id: "std-26013",
    nis: "26013",
    name: "AL BAHAUDDIN AKBAR",
    unit: "SD",
    grade: "Kelas 3",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0004",
    savingsAccountNo: "TAB-SD-26013",
    initialSavingsBalance: 500000,
    fees: createStudentFees("SD", 2, true, false),
  },
  {
    id: "std-26014",
    nis: "26014",
    name: "YUSUF PUTRA ARDIANSYAH",
    unit: "SD",
    grade: "Kelas 4",
    avatar: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0005",
    savingsAccountNo: "TAB-SD-26014",
    initialSavingsBalance: 820000,
    fees: createStudentFees("SD", 3, true, true),
  },
  {
    id: "std-26015",
    nis: "26015",
    name: "ZUNAIRA PUTRI AYU",
    unit: "SD",
    grade: "Kelas 5",
    avatar: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0006",
    savingsAccountNo: "TAB-SD-26015",
    initialSavingsBalance: 680000,
    fees: createStudentFees("SD", 4, true, true),
  },
  {
    id: "std-26016",
    nis: "26016",
    name: "ALINA HAFSHOHAFIFAH TULJENNAH",
    unit: "SD",
    grade: "Kelas 6",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0007",
    savingsAccountNo: "TAB-SD-26016",
    initialSavingsBalance: 950000,
    fees: createStudentFees("SD", 3, true, true),
  },
  {
    id: "std-26071",
    nis: "26071",
    name: "MOH. ARIF HIDAYATULLOH",
    unit: "MTs",
    grade: "Kelas 7",
    avatar: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0008",
    savingsAccountNo: "TAB-MTS-26071",
    initialSavingsBalance: 1100000,
    fees: createStudentFees("MTs", 4, true, true),
  },
  {
    id: "std-26081",
    nis: "26081",
    name: "FATIMATUS AZAHRA",
    unit: "MTs",
    grade: "Kelas 8",
    avatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0009",
    savingsAccountNo: "TAB-MTS-26081",
    initialSavingsBalance: 870000,
    fees: createStudentFees("MTs", 2, true, false),
  },
  {
    id: "std-26091",
    nis: "26091",
    name: "NAURA SYARIFAH NUR FADHILAH",
    unit: "MTs",
    grade: "Kelas 9",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
    parentPhone: "0812-3401-0010",
    savingsAccountNo: "TAB-MTS-26091",
    initialSavingsBalance: 1250000,
    fees: createStudentFees("MTs", 4, true, true),
  },
];

// Helper to retrieve saved master student records or initialize
export function getSavedMasterStudentFees(): MasterStudentFeeRecord[] {
  if (typeof window === "undefined") return INITIAL_MASTER_STUDENT_FEES;
  try {
    const raw = localStorage.getItem("eduquest_master_student_fees");
    if (raw) {
      const parsed = JSON.parse(raw);
      // Validate that stored array contains the new 10 students
      if (
        Array.isArray(parsed) &&
        parsed.length === 10 &&
        parsed.some((s: any) => s.nis === "26001" || s.name === "AINIYATUL MAFTUHAH")
      ) {
        return parsed;
      }
    }
  } catch {}

  // Save new dataset to localStorage
  try {
    localStorage.setItem("eduquest_master_student_fees", JSON.stringify(INITIAL_MASTER_STUDENT_FEES));
  } catch {}

  return INITIAL_MASTER_STUDENT_FEES;
}

// Helper to persist master student records
export function saveMasterStudentFees(records: MasterStudentFeeRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem("eduquest_master_student_fees", JSON.stringify(records));
  } catch {}
}

// Calculate real-time active savings balance for a student
export function calculateStudentSavingsBalance(
  student: MasterStudentFeeRecord,
  transactions: { type: string; savingsType?: string; studentNis?: string; studentName?: string; amount: number }[]
): number {
  let balance = student.initialSavingsBalance;

  for (const trx of transactions) {
    if (trx.type === "savings") {
      const matchNis = trx.studentNis && trx.studentNis === student.nis;
      const matchName = trx.studentName && trx.studentName.toLowerCase() === student.name.toLowerCase();
      if (matchNis || matchName) {
        if (trx.savingsType === "deposit") {
          balance += trx.amount;
        } else if (trx.savingsType === "withdraw") {
          balance -= trx.amount;
        }
      }
    }
  }

  return Math.max(0, balance);
}

// Calculate monthly savings mutations for recap table
export interface MonthlyStudentSavingsSummary {
  student: MasterStudentFeeRecord;
  startingBalance: number;
  totalDepositMonth: number;
  totalWithdrawMonth: number;
  netMutationMonth: number;
  currentBalance: number;
  status: "Sangat Aktif" | "Aktif" | "Pasif";
  transactionCountMonth: number;
}

export function getMonthlyStudentSavingsRecap(
  students: MasterStudentFeeRecord[],
  transactions: {
    type: string;
    savingsType?: string;
    studentNis?: string;
    studentName?: string;
    amount: number;
    date: string;
  }[],
  selectedYearMonth: string = "2026-10" // format YYYY-MM
): MonthlyStudentSavingsSummary[] {
  return students.map((student) => {
    let startingBalance = student.initialSavingsBalance;
    let totalDepositMonth = 0;
    let totalWithdrawMonth = 0;
    let transactionCountMonth = 0;

    for (const trx of transactions) {
      if (trx.type === "savings") {
        const matchNis = trx.studentNis && trx.studentNis === student.nis;
        const matchName = trx.studentName && trx.studentName.toLowerCase() === student.name.toLowerCase();
        if (matchNis || matchName) {
          const trxYearMonth = trx.date.slice(0, 7);

          if (trxYearMonth < selectedYearMonth) {
            // Happened before this month -> part of starting balance
            if (trx.savingsType === "deposit") {
              startingBalance += trx.amount;
            } else if (trx.savingsType === "withdraw") {
              startingBalance -= trx.amount;
            }
          } else if (trxYearMonth === selectedYearMonth) {
            // Happened in this month
            transactionCountMonth++;
            if (trx.savingsType === "deposit") {
              totalDepositMonth += trx.amount;
            } else if (trx.savingsType === "withdraw") {
              totalWithdrawMonth += trx.amount;
            }
          }
        }
      }
    }

    const netMutationMonth = totalDepositMonth - totalWithdrawMonth;
    const currentBalance = startingBalance + netMutationMonth;

    let status: "Sangat Aktif" | "Aktif" | "Pasif" = "Pasif";
    if (transactionCountMonth >= 2 || totalDepositMonth >= 300000) {
      status = "Sangat Aktif";
    } else if (transactionCountMonth >= 1 || currentBalance > 0) {
      status = "Aktif";
    }

    return {
      student,
      startingBalance: Math.max(0, startingBalance),
      totalDepositMonth,
      totalWithdrawMonth,
      netMutationMonth,
      currentBalance: Math.max(0, currentBalance),
      status,
      transactionCountMonth,
    };
  });
}
