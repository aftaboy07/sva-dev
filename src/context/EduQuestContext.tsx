"use client";

import React, { createContext, useContext, useState, useEffect } from "react";
import {
  UserProfile,
  UserRole,
  StaffRole,
  StudentGamification,
  StudentAttendanceTimemark,
  UrgentTask,
  LearningHistory,
  CustomTeacherGame,
  AIAgentId,
  ChatMessage,
  PastChatTopic,
  TeachingJournalEntry,
  QRScanRecord,
  StudentMonitoringRecord,
  StaffAttendanceRecord,
  StudentPaymentRecord,
  NewUserRegistration,
  GlobalYayasanMetrics,
  FinanceTransaction,
  TeacherFaceRegistration,
  StudentNotification,
  ModuleItem,
} from "@/types";
import {
  MOCK_STUDENT_USER,
  MOCK_TUTORING_STUDENT_USER,
  MOCK_TEACHER_USER,
  MOCK_KEPSEK_USER,
  MOCK_KEPSEK_SD_USER,
  MOCK_KEPSEK_RA_USER,
  MOCK_KEPSEK_MTS_USER,
  MOCK_OPERATOR_USER,
  MOCK_YAYASAN_USER,
  INITIAL_GAMIFICATION,
  INITIAL_URGENT_TASKS,
  INITIAL_LEARNING_HISTORY,
  INITIAL_CUSTOM_GAMES,
  INITIAL_PAST_CHAT_TOPICS,
  INITIAL_TEACHING_JOURNALS,
  INITIAL_QR_SCANS,
  INITIAL_STUDENT_RECORDS,
  INITIAL_STAFF_ATTENDANCE,
  INITIAL_STUDENT_PAYMENTS,
  GLOBAL_YAYASAN_METRICS,
  INITIAL_FINANCE_TRANSACTIONS,
  INITIAL_TEACHER_FACE_REGISTRATIONS,
  INITIAL_STUDENT_NOTIFICATIONS,
  MOCK_MODULES,
} from "@/data/mockData";

interface EduQuestContextType {
  currentUser: UserProfile | null;
  studentData: StudentGamification;
  urgentTasks: UrgentTask[];
  learningHistory: LearningHistory[];
  learningMaterials: ModuleItem[];
  customGames: CustomTeacherGame[];
  pastTopics: PastChatTopic[];
  selectedAgentId: AIAgentId;
  chatMessages: Record<AIAgentId, ChatMessage[]>;
  teachingJournals: TeachingJournalEntry[];
  qrScans: QRScanRecord[];
  studentRecords: StudentMonitoringRecord[];
  isAiResponding: boolean;

  // ERP Staff States
  staffAttendance: StaffAttendanceRecord[];
  paymentRecords: StudentPaymentRecord[];
  registeredUsers: UserProfile[];
  globalMetrics: GlobalYayasanMetrics;
  financeTransactions: FinanceTransaction[];
  teacherFaceRegistrations: TeacherFaceRegistration[];

  // Actions
  loginAs: (role: UserRole, staffSubRole?: StaffRole, customUser?: UserProfile) => void;
  logout: () => void;
  checkInAttendance: (timemarkOptions?: {
    location?: string;
    photoSnapshotUrl?: string;
    method?: "camera" | "button" | "qr";
  }) => { success: boolean; expGained: number; coinsGained: number; timemark?: StudentAttendanceTimemark };
  completeTask: (taskId: string) => void;
  addUrgentTask: (task: Omit<UrgentTask, "id" | "completed">) => void;
  addLearningMaterial: (material: Omit<ModuleItem, "id" | "createdAt">) => void;
  deleteLearningMaterial: (id: string) => void;
  submitTaskAssignment: (taskId: string, file: { name: string; size: string; type: string }) => void;
  setSelectedAgentId: (id: AIAgentId) => void;
  sendAiMessage: (agentId: AIAgentId, text: string) => void;
  addCustomTeacherGame: (newGame: Omit<CustomTeacherGame, "id" | "creatorName" | "endsInHours" | "isPlayed">) => void;
  submitGameScore: (gameId: string, score: number, exp: number, coins: number) => void;
  addTeachingJournal: (entry: Omit<TeachingJournalEntry, "id">) => void;
  simulateQRScan: (nis: string) => { success: boolean; studentName: string; status: "Tepat Waktu" | "Terlambat" };
  updateStudentNote: (studentId: string, note: string, needsIntervention: boolean) => void;

  // Staff & ERP Actions
  clockInStaff: (
    notes?: string,
    extra?: {
      coordinates?: { lat: number; lng: number; accuracy?: number };
      photoUrl?: string;
      livenessVerified?: boolean;
      auditHash?: string;
    }
  ) => { success: boolean; message: string; record?: StaffAttendanceRecord };
  clockOutStaff: () => { success: boolean; message: string };
  processPayment: (paymentId: string) => void;
  registerNewUser: (newUser: NewUserRegistration) => { success: boolean; message: string };
  addFinanceTransaction: (trx: Omit<FinanceTransaction, "id" | "referenceNo" | "timestamp" | "status" | "auditHash">) => FinanceTransaction;
  registerTeacherFace: (staffNip: string, photoUrl: string, operatorName?: string) => { success: boolean; message: string };
  removeTeacherFace: (staffNip: string) => { success: boolean; message: string };


  // Student Smart Notification States
  notifications: StudentNotification[];
  unreadNotificationsCount: number;
  markNotificationAsRead: (id: string) => void;
  markAllNotificationsAsRead: () => void;
  clearNotification: (id: string) => void;
  addStudentNotification: (notif: Omit<StudentNotification, "id" | "isRead" | "timestamp">) => void;
  focusedTaskId: string | null;
  setFocusedTaskId: (id: string | null) => void;

  // Global Theme
  theme: "dark" | "bright";
  setTheme: React.Dispatch<React.SetStateAction<"dark" | "bright">>;
  toggleTheme: () => void;
}

const EduQuestContext = createContext<EduQuestContextType | undefined>(undefined);

export const EduQuestProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  // Global Theme State: defaults to 'dark'
  const [theme, setTheme] = useState<"dark" | "bright">("dark");

  // Sync theme with localStorage and document data-theme attribute
  useEffect(() => {
    try {
      const savedTheme = localStorage.getItem("eduquest_theme") as "dark" | "bright" | null;
      if (savedTheme === "dark" || savedTheme === "bright") {
        setTheme(savedTheme);
        document.documentElement.setAttribute("data-theme", savedTheme);
      } else {
        document.documentElement.setAttribute("data-theme", "dark");
      }
    } catch {
      document.documentElement.setAttribute("data-theme", "dark");
    }
  }, []);

  const toggleTheme = () => {
    setTheme((prev) => {
      const nextTheme = prev === "dark" ? "bright" : "dark";
      try {
        localStorage.setItem("eduquest_theme", nextTheme);
        document.documentElement.setAttribute("data-theme", nextTheme);
      } catch {}
      return nextTheme;
    });
  };

  const [currentUser, setCurrentUser] = useState<UserProfile | null>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eduquest_current_user");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (
            parsed?.name?.includes("Raditya") ||
            parsed?.name?.includes("Fajar") ||
            parsed?.name?.includes("Dahlan") ||
            parsed?.name?.includes("Sarah") ||
            parsed?.name?.includes("Mahmud")
          ) {
            localStorage.setItem("eduquest_current_user", JSON.stringify(MOCK_OPERATOR_USER));
            return MOCK_OPERATOR_USER;
          }
          return parsed;
        }
      } catch {}
    }
    return MOCK_OPERATOR_USER;
  });
  const [studentData, setStudentData] = useState<StudentGamification>(INITIAL_GAMIFICATION);
  const [urgentTasks, setUrgentTasks] = useState<UrgentTask[]>(INITIAL_URGENT_TASKS);
  const [learningHistory, setLearningHistory] = useState<LearningHistory[]>(INITIAL_LEARNING_HISTORY);
  const [learningMaterials, setLearningMaterials] = useState<ModuleItem[]>(() => {
    if (typeof window !== "undefined") {
      try {
        const saved = localStorage.getItem("eduquest_learning_materials");
        if (saved) {
          const parsed = JSON.parse(saved);
          if (Array.isArray(parsed)) return parsed;
        }
      } catch {}
    }
    return MOCK_MODULES;
  });
  const [customGames, setCustomGames] = useState<CustomTeacherGame[]>(INITIAL_CUSTOM_GAMES);
  const [pastTopics, setPastTopics] = useState<PastChatTopic[]>(INITIAL_PAST_CHAT_TOPICS);
  const [selectedAgentId, setSelectedAgentId] = useState<AIAgentId>("science-expert");
  const [teachingJournals, setTeachingJournals] = useState<TeachingJournalEntry[]>(INITIAL_TEACHING_JOURNALS);
  const [qrScans, setQrScans] = useState<QRScanRecord[]>(INITIAL_QR_SCANS);
  const [studentRecords, setStudentRecords] = useState<StudentMonitoringRecord[]>(INITIAL_STUDENT_RECORDS);
  const [isAiResponding, setIsAiResponding] = useState<boolean>(false);

  // ERP States
  const [staffAttendance, setStaffAttendance] = useState<StaffAttendanceRecord[]>(INITIAL_STAFF_ATTENDANCE);
  const [paymentRecords, setPaymentRecords] = useState<StudentPaymentRecord[]>(INITIAL_STUDENT_PAYMENTS);
  const [globalMetrics, setGlobalMetrics] = useState<GlobalYayasanMetrics>(GLOBAL_YAYASAN_METRICS);
  const [financeTransactions, setFinanceTransactions] = useState<FinanceTransaction[]>(() => {
    try {
      const saved = localStorage.getItem("eduquest_finance_transactions");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (t: any) =>
              t.operatorName?.includes("Fajar") ||
              t.studentName?.includes("Farhan") ||
              t.studentName?.includes("Raditya")
          )
        ) {
          localStorage.removeItem("eduquest_finance_transactions");
          return INITIAL_FINANCE_TRANSACTIONS;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_FINANCE_TRANSACTIONS;
  });
  const [registeredUsers, setRegisteredUsers] = useState<UserProfile[]>([
    MOCK_OPERATOR_USER,
    MOCK_YAYASAN_USER,
    MOCK_KEPSEK_SD_USER,
    MOCK_KEPSEK_RA_USER,
    MOCK_KEPSEK_MTS_USER,
    MOCK_STUDENT_USER,
    MOCK_TUTORING_STUDENT_USER,
  ]);

  const [teacherFaceRegistrations, setTeacherFaceRegistrations] = useState<TeacherFaceRegistration[]>(() => {
    try {
      const saved = localStorage.getItem("eduquest_teacher_faces");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (
          Array.isArray(parsed) &&
          parsed.some(
            (f: any) =>
              f.staffName?.includes("Sarah") ||
              f.staffName?.includes("Dahlan") ||
              f.registeredBy?.includes("Fajar")
          )
        ) {
          localStorage.removeItem("eduquest_teacher_faces");
          return INITIAL_TEACHER_FACE_REGISTRATIONS;
        }
        return parsed;
      }
    } catch {}
    return INITIAL_TEACHER_FACE_REGISTRATIONS;
  });

  // Student Smart Notification States
  const [notifications, setNotifications] = useState<StudentNotification[]>(() => {
    try {
      const saved = localStorage.getItem("eduquest_student_notifications");
      if (saved) return JSON.parse(saved);
    } catch {}
    return INITIAL_STUDENT_NOTIFICATIONS;
  });
  const [focusedTaskId, setFocusedTaskId] = useState<string | null>(null);

  // Sync notifications to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("eduquest_student_notifications", JSON.stringify(notifications));
    } catch {}
  }, [notifications]);

  const unreadNotificationsCount = notifications.filter((n) => !n.isRead).length;

  const markNotificationAsRead = (id: string) => {
    setNotifications((prev) =>
      prev.map((n) => (n.id === id ? { ...n, isRead: true } : n))
    );
  };

  const markAllNotificationsAsRead = () => {
    setNotifications((prev) => prev.map((n) => ({ ...n, isRead: true })));
  };

  const clearNotification = (id: string) => {
    setNotifications((prev) => prev.filter((n) => n.id !== id));
  };

  const addStudentNotification = (
    notif: Omit<StudentNotification, "id" | "isRead" | "timestamp">
  ) => {
    const newNotif: StudentNotification = {
      ...notif,
      id: `notif-${Date.now()}`,
      isRead: false,
      timestamp: "Baru saja",
    };
    setNotifications((prev) => [newNotif, ...prev]);
  };

  // Initial greeting messages for each agent
  const [chatMessages, setChatMessages] = useState<Record<AIAgentId, ChatMessage[]>>({
    "math-expert": [
      {
        id: "msg-m1",
        sender: "ai",
        agentId: "math-expert",
        text: "Halo ananda santri YPI As Sa'adah! Ada soal matematika atau logika yang sedang ingin kamu diskusikan? Coba bagikan, mari kita urai bersama!",
        timestamp: "14:15",
      },
    ],
    "science-expert": [
      {
        id: "msg-s1",
        sender: "ai",
        agentId: "science-expert",
        text: "Salam penjelajah sains! Mari kita eksplorasi hukum alam dan tadabbur ilmu ciptaan Allah. Pertanyaan apa yang ingin kamu bahas hari ini?",
        timestamp: "14:18",
      },
      {
        id: "msg-s2",
        sender: "user",
        agentId: "science-expert",
        text: "Prof, bagaimana cara mudah memahami gaya gesek statis dan kinetik pada balok di bidang miring?",
        timestamp: "14:19",
      },
      {
        id: "msg-s3",
        sender: "ai",
        agentId: "science-expert",
        text: "Pertanyaan yang sangat bagus! Mari kita pahami dengan analogi sederhana:",
        timestamp: "14:20",
        steps: [
          "1. Gaya Gesek Statis (fs): Gaya penahan saat benda masih diam. Nilai maksimumnya adalah fs_max = μs · N.",
          "2. Gaya Gesek Kinetik (fk): Gaya gesek saat benda telah meluncur. Selalu berlaku fk = μk · N (di mana μk < μs).",
          "3. Pada Bidang Miring: Gaya normal N = m · g · cos θ, sedangkan komponen penggerak sejajar bidang adalah Wx = m · g · sin θ."
        ]
      }
    ],
    "lang-expert": [
      {
        id: "msg-l1",
        sender: "ai",
        agentId: "lang-expert",
        text: "Ahlan wa sahlan di ruang literasi YPI As Sa'adah! Ingin menyempurnakan struktur tulisan, kosakata bahasa Arab, atau latihan bahasa Inggris?",
        timestamp: "14:10",
      },
    ],
  });

  const loginAs = (role: UserRole, staffSubRole?: StaffRole, customUser?: UserProfile) => {
    let user: UserProfile;
    if (customUser) {
      user = customUser;
    } else if (role === "student") {
      user = MOCK_STUDENT_USER;
    } else if (role === "tutoring") {
      user = MOCK_TUTORING_STUDENT_USER;
    } else if (role === "kepsek" || staffSubRole === "kepsek") {
      user = MOCK_KEPSEK_SD_USER;
    } else if (role === "operator" || staffSubRole === "operator") {
      user = MOCK_OPERATOR_USER;
    } else if (role === "yayasan" || staffSubRole === "yayasan") {
      user = MOCK_YAYASAN_USER;
    } else {
      user = MOCK_TEACHER_USER;
    }
    setCurrentUser(user);
    try {
      localStorage.setItem("eduquest_current_user", JSON.stringify(user));
    } catch {}
  };

  const logout = () => {
    setCurrentUser(null);
    try {
      localStorage.removeItem("eduquest_current_user");
    } catch {}
  };

  const checkInAttendance = (timemarkOptions?: {
    location?: string;
    photoSnapshotUrl?: string;
    method?: "camera" | "button" | "qr";
  }) => {
    if (studentData.hasCheckedInToday) {
      return { success: false, expGained: 0, coinsGained: 0 };
    }

    const expGained = 50;
    const coinsGained = 15;
    const now = new Date();
    const formattedDate = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const formattedTime = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";

    const activeUser = currentUser || MOCK_STUDENT_USER;
    const newTimemark: StudentAttendanceTimemark = {
      id: `tmk-${Date.now()}`,
      date: formattedDate,
      timestamp: formattedTime,
      location: timemarkOptions?.location || "Kampus Terpadu YPI As Sa'adah",
      status: "Tepat Waktu",
      photoSnapshotUrl:
        timemarkOptions?.photoSnapshotUrl ||
        activeUser.avatar ||
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80",
      verificationCode: `VERIF-AS-${Math.floor(1000 + Math.random() * 9000)}-OK`,
    };

    setStudentData((prev) => {
      const nextExp = prev.currentExp + expGained;
      let nextLevel = prev.level;
      let nextMaxExp = prev.maxExp;

      if (nextExp >= prev.maxExp) {
        nextLevel += 1;
        nextMaxExp = Math.floor(prev.maxExp * 1.25);
      }

      return {
        ...prev,
        currentExp: nextExp,
        maxExp: nextMaxExp,
        level: nextLevel,
        coins: prev.coins + coinsGained,
        streakDays: prev.streakDays + 1,
        hasCheckedInToday: true,
        lastCheckInTime: formattedTime,
        timemarks: [newTimemark, ...(prev.timemarks || [])],
      };
    });

    const newScan: QRScanRecord = {
      id: `qr-auto-${Date.now()}`,
      studentNis: activeUser.identifier,
      studentName: activeUser.name,
      grade: activeUser.grade || "Kelas 9 MTs",
      scanTime: formattedTime,
      status: "Tepat Waktu",
    };
    setQrScans((prev) => [newScan, ...prev]);

    return { success: true, expGained, coinsGained, timemark: newTimemark };
  };

  const completeTask = (taskId: string) => {
    const task = urgentTasks.find((t) => t.id === taskId);
    if (!task || task.completed) return;

    setUrgentTasks((prev) =>
      prev.map((t) => (t.id === taskId ? { ...t, completed: true } : t))
    );

    setStudentData((prev) => ({
      ...prev,
      currentExp: prev.currentExp + task.rewardExp,
      coins: prev.coins + task.rewardCoins,
    }));
  };

  const addUrgentTask = (newTask: Omit<UrgentTask, "id" | "completed">) => {
    const task: UrgentTask = {
      ...newTask,
      id: `task-${Date.now()}`,
      completed: false,
    };
    setUrgentTasks((prev) => [task, ...prev]);

    // Push dynamic real-time notification to Student Portal
    const targetDesc = newTask.targetClasses && newTask.targetClasses.length > 0
      ? ` untuk ${newTask.targetClasses.join(", ")}`
      : "";
    const isQuiz = newTask.type === "kuis";
    const taskNotif: StudentNotification = {
      id: `notif-${Date.now()}`,
      type: "new_task",
      title: `${isQuiz ? "Kuis Baru" : "Tugas Baru"}: ${newTask.title}`,
      message: `Guru telah mempublikasikan ${isQuiz ? "kuis interaktif" : "tugas"} baru '${newTask.title}' (${newTask.subject})${targetDesc}. Batas kumpul: ${newTask.dueDate}.`,
      timestamp: "Baru saja",
      isRead: false,
      taskId: task.id,
      taskTitle: newTask.title,
      subject: newTask.subject,
      dueDate: newTask.dueDate,
    };
    setNotifications((prev) => [taskNotif, ...prev]);
  };

  const addLearningMaterial = (material: Omit<ModuleItem, "id" | "createdAt">) => {
    const newMaterial: ModuleItem = {
      ...material,
      id: `mat-${Date.now()}`,
      createdAt: new Date().toLocaleDateString("id-ID", { day: "numeric", month: "short", year: "numeric" }),
    };
    setLearningMaterials((prev) => {
      const updated = [newMaterial, ...prev];
      try {
        localStorage.setItem("eduquest_learning_materials", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    const targetDesc = material.targetClasses && material.targetClasses.length > 0
      ? ` untuk ${material.targetClasses.join(", ")}`
      : material.grade ? ` untuk ${material.grade}` : "";
    const notif: StudentNotification = {
      id: `notif-${Date.now()}`,
      type: "new_task",
      title: `Materi Baru: ${material.title}`,
      message: `Guru ${material.author || "Pengampu"} mengunggah modul '${material.title}' (${material.subject})${targetDesc}.`,
      timestamp: "Baru saja",
      isRead: false,
      subject: material.subject,
    };
    setNotifications((prev) => [notif, ...prev]);
  };

  const deleteLearningMaterial = (id: string) => {
    setLearningMaterials((prev) => {
      const updated = prev.filter((m) => m.id !== id);
      try {
        localStorage.setItem("eduquest_learning_materials", JSON.stringify(updated));
      } catch {}
      return updated;
    });
  };

  const submitTaskAssignment = (
    taskId: string,
    file: { name: string; size: string; type: string }
  ) => {
    const task = urgentTasks.find((t) => t.id === taskId);
    if (!task) return;

    setUrgentTasks((prev) =>
      prev.map((t) =>
        t.id === taskId
          ? {
              ...t,
              completed: true,
              submittedFile: {
                ...file,
                uploadedAt: "Baru saja (Tervalidasi)",
              },
            }
          : t
      )
    );

    setStudentData((prev) => ({
      ...prev,
      currentExp: prev.currentExp + task.rewardExp,
      coins: prev.coins + task.rewardCoins,
    }));

    // Simulate Teacher grading notification shortly after
    setTimeout(() => {
      const gradeNotif: StudentNotification = {
        id: `notif-${Date.now()}`,
        type: "grade_released",
        title: `Nilai Tugas Diberikan: ${task.title}`,
        message: `Alhamdulillah! Tugas '${task.title}' (${task.subject}) telah diperiksa oleh pengampu. Skor: 96/100 (+${task.rewardExp} EXP, +${task.rewardCoins} Koin).`,
        timestamp: "Baru saja",
        isRead: false,
        taskId: task.id,
        taskTitle: task.title,
        subject: task.subject,
        score: 96,
      };
      setNotifications((prev) => [gradeNotif, ...prev]);
    }, 3500);
  };

  const sendAiMessage = (agentId: AIAgentId, text: string) => {
    const userMsg: ChatMessage = {
      id: `usr-${Date.now()}`,
      sender: "user",
      agentId,
      text,
      timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
    };

    setChatMessages((prev) => ({
      ...prev,
      [agentId]: [...(prev[agentId] || []), userMsg],
    }));

    setIsAiResponding(true);

    setTimeout(() => {
      let replyText = "InsyaAllah pertanyaanmu telah tercatat dengan baik.";
      let replySteps: string[] | undefined;

      if (agentId === "math-expert") {
        replyText = "Langkah penyelesaian sistematis secara matematis:";
        replySteps = [
          "1. Identifikasi variabel yang belum diketahui dan susun ke bentuk aljabar standar.",
          "2. Gunakan metode eliminasi untuk menyederhanakan salah satu variabel secara teratur.",
          "3. Substitusikan kembali nilai yang diperoleh untuk memeriksa keabsahan solusi akhir."
        ];
      } else if (agentId === "science-expert") {
        replyText = "Penjelasan konsep fisika dan sains terpadu:";
        replySteps = [
          "1. Tinjau resultan gaya yang bekerja menggunakan diagram benda bebas (Free Body Diagram).",
          "2. Terapkan Hukum II Newton (ΣF = m · a) pada sumbu gerak yang bersangkutan.",
          "3. Evaluasi satuan SI dari seluruh parameter untuk menjamin hasil perhitungan presisi."
        ];
      } else {
        replyText = "Kaidah kaidah kebahasaan dan literasi komunikatif:";
        replySteps = [
          "1. Perhatikan kedudukan subjek dan predikat dalam struktur kalimat.",
          "2. Gunakan konjungsi penghubung yang tepat antarkalimat untuk memperjelas alur gagasan.",
          "3. Latih pengucapan dan penulisan secara rutin agar semakin fasih dan kaya kosakata."
        ];
      }

      const aiReply: ChatMessage = {
        id: `ai-${Date.now()}`,
        sender: "ai",
        agentId,
        text: replyText,
        steps: replySteps,
        timestamp: new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }),
      };

      setChatMessages((prev) => ({
        ...prev,
        [agentId]: [...(prev[agentId] || []), aiReply],
      }));
      setIsAiResponding(false);
    }, 1200);
  };

  const addCustomTeacherGame = (
    newGame: Omit<CustomTeacherGame, "id" | "creatorName" | "endsInHours" | "isPlayed">
  ) => {
    const created: CustomTeacherGame = {
      ...newGame,
      id: `game-${Date.now()}`,
      creatorName: currentUser?.name || "Merlisa Ayu Dwi",
      endsInHours: 24,
      isPlayed: false,
    };
    setCustomGames((prev) => [created, ...prev]);

    // Push notification to Student Portal
    const targetDesc = created.targetClasses && created.targetClasses.length > 0
      ? ` untuk ${created.targetClasses.join(", ")}`
      : "";
    const gameNotif: StudentNotification = {
      id: `notif-${Date.now()}`,
      type: "new_task",
      title: `Tantangan Game: ${newGame.title}`,
      message: `Tantangan interaktif baru '${newGame.title}' (${newGame.subject})${targetDesc} telah dibuka guru! Menangkan +${newGame.rewardExp} EXP & +${newGame.rewardCoins} Koin.`,
      timestamp: "Baru saja",
      isRead: false,
      subject: newGame.subject,
    };
    setNotifications((prev) => [gameNotif, ...prev]);
  };

  const submitGameScore = (gameId: string, score: number, exp: number, coins: number) => {
    setCustomGames((prev) =>
      prev.map((g) =>
        g.id === gameId ? { ...g, isPlayed: true, lastScore: score } : g
      )
    );

    setStudentData((prev) => ({
      ...prev,
      currentExp: prev.currentExp + exp,
      coins: prev.coins + coins,
    }));
  };

  const addTeachingJournal = (entry: Omit<TeachingJournalEntry, "id">) => {
    const created: TeachingJournalEntry = {
      ...entry,
      id: `jrn-${Date.now()}`,
    };
    setTeachingJournals((prev) => [created, ...prev]);
  };

  const simulateQRScan = (nis: string) => {
    const student = studentRecords.find((s) => s.nis === nis);
    const studentName = student ? student.name : "Santri SVA Dev";
    const grade = student ? student.grade : "Kelas 9 MTs";

    const isLate = Math.random() > 0.75;
    const status: "Tepat Waktu" | "Terlambat" = isLate ? "Terlambat" : "Tepat Waktu";
    const nowTime = new Date().toLocaleTimeString("id-ID", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
    }) + " WIB";

    const newScan: QRScanRecord = {
      id: `scan-${Date.now()}`,
      studentNis: nis,
      studentName,
      grade,
      scanTime: nowTime,
      status,
    };

    setQrScans((prev) => [newScan, ...prev]);
    return { success: true, studentName, status };
  };

  const updateStudentNote = (
    studentId: string,
    note: string,
    needsIntervention: boolean
  ) => {
    setStudentRecords((prev) =>
      prev.map((s) =>
        s.id === studentId ? { ...s, notes: note, needsIntervention } : s
      )
    );
  };

  // ==========================================================================
  // ERP Staff Actions
  // ==========================================================================
  const clockInStaff = (
    notes?: string,
    extra?: {
      coordinates?: { lat: number; lng: number; accuracy?: number };
      photoUrl?: string;
      livenessVerified?: boolean;
      auditHash?: string;
    }
  ) => {
    if (!currentUser) return { success: false, message: "Pengguna tidak terautentikasi." };
    const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";

    const existing = staffAttendance.find(
      (a) => a.staffNip === currentUser.identifier && a.date === todayStr
    );
    if (existing) {
      return { success: false, message: "Anda sudah melakukan Clock In kehadiran hari ini." };
    }

    const newRecord: StaffAttendanceRecord = {
      id: `att-${Date.now()}`,
      staffNip: currentUser.identifier,
      staffName: currentUser.name,
      role: currentUser.staffRole || "guru",
      level: (currentUser.levelAssignment as any) || "MTs",
      date: todayStr,
      clockInTime: timeStr,
      status: "Hadir Tepat Waktu",
      notes: notes || "Absensi mandiri melalui portal staff",
      coordinates: extra?.coordinates,
      photoUrl: extra?.photoUrl,
      livenessVerified: extra?.livenessVerified ?? true,
      auditHash: extra?.auditHash,
    };

    setStaffAttendance((prev) => [newRecord, ...prev]);
    return { success: true, message: `Clock In berhasil tercatat pada pukul ${timeStr}.`, record: newRecord };
  };

  const clockOutStaff = () => {
    if (!currentUser) return { success: false, message: "Pengguna tidak terautentikasi." };
    const todayStr = new Date().toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const timeStr = new Date().toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit", second: "2-digit" }) + " WIB";

    let updated = false;
    setStaffAttendance((prev) =>
      prev.map((a) => {
        if (a.staffNip === currentUser.identifier && a.date === todayStr) {
          updated = true;
          return { ...a, clockOutTime: timeStr };
        }
        return a;
      })
    );

    if (updated) {
      return { success: true, message: `Clock Out kepulangan berhasil dicatat pada ${timeStr}.` };
    } else {
      const newRecord: StaffAttendanceRecord = {
        id: `att-out-${Date.now()}`,
        staffNip: currentUser.identifier,
        staffName: currentUser.name,
        role: currentUser.staffRole || "guru",
        level: (currentUser.levelAssignment as any) || "MTs",
        date: todayStr,
        clockInTime: "07:00:00 WIB",
        clockOutTime: timeStr,
        status: "Hadir Tepat Waktu",
        notes: "Clock Out mandiri",
      };
      setStaffAttendance((prev) => [newRecord, ...prev]);
      return { success: true, message: `Clock Out kepulangan berhasil dicatat pada ${timeStr}.` };
    }
  };

  const processPayment = (paymentId: string) => {
    const now = new Date();
    const dateStr = now.toLocaleDateString("id-ID", { day: "numeric", month: "long", year: "numeric" });
    const timeStr = now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" }) + " WIB";
    const receiptNum = `KWIT-AS-${Math.floor(1000 + Math.random() * 9000)}`;

    setPaymentRecords((prev) =>
      prev.map((p) =>
        p.id === paymentId
          ? {
              ...p,
              status: "Lunas",
              paidAt: `${dateStr} • ${timeStr}`,
              receiptNumber: receiptNum,
            }
          : p
      )
    );
  };

  const registerNewUser = (newUser: NewUserRegistration) => {
    const exists = registeredUsers.some((u) => u.identifier === newUser.identifier);
    if (exists) {
      return { success: false, message: `Nomor Induk ${newUser.identifier} sudah terdaftar dalam sistem.` };
    }

    const avatarUrl =
      newUser.role === "student" || newUser.role === "tutoring"
        ? "https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80"
        : "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80";

    const staffSubRole: StaffRole | undefined =
      newUser.role === "teacher"
        ? "guru"
        : newUser.role === "kepsek"
        ? "kepsek"
        : undefined;

    const createdUser: UserProfile = {
      id: `usr-${Date.now()}`,
      name: newUser.name,
      role: newUser.role,
      staffRole: staffSubRole,
      identifier: newUser.identifier,
      avatar: avatarUrl,
      schoolOrSubject: newUser.gradeOrSubject,
      grade: newUser.levelAssignment === "Semua" ? "Seluruh Unit Yayasan" : `Unit ${newUser.levelAssignment}`,
      levelAssignment: newUser.levelAssignment,
      studentType: newUser.role === "tutoring" ? "les" : newUser.role === "student" ? "yayasan" : undefined,
      phone: newUser.phone || "0812-0000-0000",
    };

    setRegisteredUsers((prev) => [createdUser, ...prev]);
    return {
      success: true,
      message: `Akun ${newUser.name} (${newUser.identifier}) berhasil didaftarkan ke sistem tertutup.`,
    };
  };

  const addFinanceTransaction = (
    newTrx: Omit<FinanceTransaction, "id" | "referenceNo" | "timestamp" | "status" | "auditHash">
  ): FinanceTransaction => {
    const count = financeTransactions.length + 1;
    const year = new Date().getFullYear();
    const referenceNo = `TRX-YYS-${year}-${String(count).padStart(3, "0")}`;
    const now = new Date();
    const timestamp = `${String(now.getHours()).padStart(2, "0")}:${String(now.getMinutes()).padStart(2, "0")} WIB`;

    const rawData = `${referenceNo}_${newTrx.type}_${newTrx.amount}_${newTrx.date}_${newTrx.operatorName}`;
    let hashVal = 0;
    for (let i = 0; i < rawData.length; i++) {
      hashVal = ((hashVal << 5) - hashVal + rawData.charCodeAt(i)) | 0;
    }
    const hexHash = Math.abs(hashVal).toString(16).padStart(8, "0");
    const auditHash = `SHA256: ${hexHash}e81a4b9c021f${Date.now().toString(16)}`;

    const created: FinanceTransaction = {
      ...newTrx,
      id: `trx-${Date.now()}`,
      referenceNo,
      timestamp,
      status: "verified",
      auditHash,
    };

    setFinanceTransactions((prev) => {
      const updated = [created, ...prev];
      try {
        localStorage.setItem("eduquest_finance_transactions", JSON.stringify(updated));
      } catch {}
      return updated;
    });

    return created;
  };

  const registerTeacherFace = (staffNip: string, photoUrl: string, operatorName?: string) => {
    const now = new Date();
    const formatted = `${now.toLocaleDateString("id-ID", { day: "2-digit", month: "long", year: "numeric" })}, ${now.toLocaleTimeString("id-ID", { hour: "2-digit", minute: "2-digit" })} WIB`;
    const op = operatorName || currentUser?.name || "Operator SIM";

    let found = false;
    const updated = teacherFaceRegistrations.map((item) => {
      if (item.staffNip === staffNip) {
        found = true;
        return {
          ...item,
          registeredPhotoUrl: photoUrl,
          registeredAt: formatted,
          registeredBy: op,
          faceDescriptorCount: 128,
          status: "Terdaftar" as const,
        };
      }
      return item;
    });

    if (!found) {
      // Find staff info from registeredUsers or attendance
      const staffInfo = registeredUsers.find((u) => u.identifier === staffNip);
      const newReg: TeacherFaceRegistration = {
        id: `face-${Date.now()}`,
        staffNip,
        staffName: staffInfo?.name || "Dewan Pendidik",
        role: staffInfo?.schoolOrSubject || "Guru Pengampu",
        level: (staffInfo?.levelAssignment as any) || "MTs",
        registeredPhotoUrl: photoUrl,
        registeredAt: formatted,
        registeredBy: op,
        faceDescriptorCount: 128,
        status: "Terdaftar",
      };
      updated.push(newReg);
    }

    setTeacherFaceRegistrations(updated);
    try {
      localStorage.setItem("eduquest_teacher_faces", JSON.stringify(updated));
    } catch {}

    return {
      success: true,
      message: `Data referensi wajah biometrik guru (NIP: ${staffNip}) berhasil didaftarkan.`,
    };
  };

  const removeTeacherFace = (staffNip: string) => {
    const updated = teacherFaceRegistrations.map((item) => {
      if (item.staffNip === staffNip) {
        return {
          ...item,
          registeredPhotoUrl: undefined,
          registeredAt: undefined,
          registeredBy: undefined,
          faceDescriptorCount: 0,
          status: "Belum Terdaftar" as const,
        };
      }
      return item;
    });

    setTeacherFaceRegistrations(updated);
    try {
      localStorage.setItem("eduquest_teacher_faces", JSON.stringify(updated));
    } catch {}

    return {
      success: true,
      message: `Data referensi wajah guru (NIP: ${staffNip}) berhasil dihapus dari basis data AI.`,
    };
  };

  return (
    <EduQuestContext.Provider
      value={{
        currentUser,
        studentData,
        urgentTasks,
        learningHistory,
        learningMaterials,
        customGames,
        pastTopics,
        selectedAgentId,
        chatMessages,
        teachingJournals,
        qrScans,
        studentRecords,
        isAiResponding,

        // ERP
        staffAttendance,
        paymentRecords,
        registeredUsers,
        globalMetrics,
        financeTransactions,
        teacherFaceRegistrations,

        // Actions
        loginAs,
        logout,
        checkInAttendance,
        completeTask,
        addUrgentTask,
        addLearningMaterial,
        deleteLearningMaterial,
        submitTaskAssignment,
        setSelectedAgentId,
        sendAiMessage,
        addCustomTeacherGame,
        submitGameScore,
        addTeachingJournal,
        simulateQRScan,
        updateStudentNote,

        // Staff & ERP Actions
        clockInStaff,
        clockOutStaff,
        processPayment,
        registerNewUser,
        addFinanceTransaction,
        registerTeacherFace,
        removeTeacherFace,

        // Student Smart Notification States
        notifications,
        unreadNotificationsCount,
        markNotificationAsRead,
        markAllNotificationsAsRead,
        clearNotification,
        addStudentNotification,
        focusedTaskId,
        setFocusedTaskId,

        // Global Theme
        theme,
        setTheme,
        toggleTheme,
      }}
    >
      {children}
    </EduQuestContext.Provider>
  );
};

export const useEduQuest = () => {
  const context = useContext(EduQuestContext);
  if (!context) {
    throw new Error("useEduQuest must be used within an EduQuestProvider");
  }
  return context;
};
