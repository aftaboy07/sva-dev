export type StaffRole = "guru" | "kepsek" | "operator" | "yayasan";

export type UserRole = "student" | "tutoring" | "teacher" | "kepsek" | "operator" | "yayasan";

export interface UserProfile {
  id: string;
  name: string;
  role: UserRole;
  staffRole?: StaffRole;
  identifier: string; // NIS for Siswa Yayasan, ID Les for Anak Les, NIP for Staff
  avatar: string;
  schoolOrSubject: string;
  grade?: string; // e.g. "Kelas 9 MTs", "Unit SD Islam", "Seluruh Unit Yayasan"
  levelAssignment?: "RA" | "SD" | "MTs" | "Semua";
  studentType?: "yayasan" | "les";
  phone?: string;
  email?: string;
}

export interface StudentAttendanceTimemark {
  id: string;
  date: string;
  timestamp: string;
  location: string;
  status: "Tepat Waktu" | "Terlambat";
  photoSnapshotUrl: string;
  verificationCode: string;
}

export interface StudentGamificationData {
  level: number;
  levelTitle: string;
  currentExp: number;
  maxExp: number;
  coins: number;
  streakDays: number;
  hasCheckedInToday: boolean;
  lastCheckInTime?: string;
  timemarks?: StudentAttendanceTimemark[];
}

export interface StudentGamification {
  level: number;
  levelTitle: string;
  currentExp: number;
  maxExp: number;
  coins: number;
  streakDays: number;
  hasCheckedInToday: boolean;
  lastCheckInTime?: string;
  timemarks?: StudentAttendanceTimemark[];
}

export interface UrgentTaskMaterial {
  id: string;
  title: string;
  type: "pdf" | "doc" | "youtube";
  url?: string;
  size?: string;
}

export interface UrgentTask {
  id: string;
  title: string;
  subject: string;
  dueDate: string;
  deadlineHours: number;
  rewardExp: number;
  rewardCoins: number;
  difficulty: "Mudah" | "Sedang" | "Menantang";
  completed: boolean;
  questionsCount: number;
  questions?: GameQuestion[];
  type?: "kuis" | "tugas";
  instructions?: string;
  materials?: UrgentTaskMaterial[];
  allowedSubmissionTypes?: string[];
  targetClasses?: string[];
  targetAudience?: string;
  submittedFile?: {
    name: string;
    size: string;
    type: string;
    uploadedAt: string;
  };
}

export interface LearningHistory {
  id: string;
  title: string;
  subject: string;
  category: "RA" | "SD" | "MTs";
  lastReadTime: string;
  progressPercentage: number;
  totalChapters: number;
  completedChapters: number;
  thumbnailUrl: string;
}

export interface ModuleItem {
  id: string;
  title: string;
  subject: string;
  level: "RA" | "SD" | "MTs";
  grade: string; // "Kelas RA", "Kelas 5 SD", "Kelas 9 MTs"
  type: "pdf" | "video" | "interactive" | "doc";
  durationOrPages: string;
  author: string;
  description: string;
  downloadUrl?: string;
  fileName?: string;
  fileSize?: string;
  topics: string[];
  targetClasses?: string[];
  createdAt?: string;
}

export type AIAgentId = "math-expert" | "science-expert" | "lang-expert";

export interface AIAgent {
  id: AIAgentId;
  name: string;
  role?: string;
  title: string;
  avatar: string;
  greeting: string;
  specialty: string;
  samplePrompts: string[];
  themeColor: string;
  description?: string;
}

export interface ChatMessage {
  id: string;
  sender: "user" | "ai";
  text: string;
  timestamp: string;
  steps?: string[];
  agentId?: AIAgentId;
}

export interface TopicHistory {
  id: string;
  title: string;
  agentId: AIAgentId;
  lastUpdated: string;
  snippet: string;
}

export type PastChatTopic = TopicHistory;

export interface GameQuestion {
  id: string;
  question: string;
  options: string[];
  correctAnswerIndex: number;
  explanation: string;
}

export type GameTemplateType =
  | "Kuis Real-Time"
  | "Memory Match"
  | "Duel Interaktif"
  | "Kuis Cerdas"
  | "Cocok Kata"
  | "Susun Rumus"
  | "Color Vision"
  | "Color Memory";

export interface CustomTeacherGame {
  id: string;
  title: string;
  subject: string;
  templateType: GameTemplateType;
  creatorName: string;
  targetAudience: string; // "Semua Jenjang" | "Jenjang MTs" | "Jenjang SD" | "Jenjang RA"
  targetClasses?: string[];
  durationMinutes: number;
  rewardExp: number;
  rewardCoins: number;
  endsInHours: number;
  questions: GameQuestion[];
  isPlayed?: boolean;
  lastScore?: number;
}

export interface ArcadeGame {
  id: string;
  title: string;
  category: string;
  description: string;
  icon: string;
  rewardCoins: number;
  playsCount: number;
}

export interface LeaderboardRank {
  rank: number;
  id: string;
  name: string;
  avatar: string;
  grade: string;
  exp: number;
  coins: number;
  badge: string;
  isCurrentUser?: boolean;
}

export interface TeacherAnalyticsMetric {
  label: string;
  value: string;
  subtext: string;
  trend: "up" | "down" | "neutral";
  trendValue: string;
}

export interface AIInsightItem {
  id: string;
  subject: string;
  topic: string;
  percentageStruggling: number;
  severity: "Tinggi" | "Sedang" | "Rendah";
  description: string;
  recommendedAction: string;
}

export interface StudentMonitoringRecord {
  id: string;
  nis: string;
  name: string;
  grade: string;
  avatar: string;
  attendanceRate: number;
  learningProgress: number;
  averageScore: number;
  tasksSubmitted: number;
  tasksTotal: number;
  needsIntervention: boolean;
  notes?: string;
  studentType?: "yayasan" | "les";
}

export interface TeachingJournalEntry {
  id: string;
  date: string;
  timeSlot: string;
  subject: string;
  gradeClass: string;
  chapterTopic: string;
  learningObjectives: string;
  studentObstacles: string;
  attendanceCount: number;
  totalStudents: number;
}

export interface QRScanRecord {
  id: string;
  studentNis: string;
  studentName: string;
  grade: string;
  scanTime: string;
  status: "Tepat Waktu" | "Terlambat";
}

export interface StaffAttendanceRecord {
  id: string;
  staffNip: string;
  staffName: string;
  role: StaffRole;
  level: "RA" | "SD" | "MTs" | "Yayasan";
  date: string;
  clockInTime: string;
  clockOutTime?: string;
  status: "Hadir Tepat Waktu" | "Terlambat" | "Izin" | "Cuti";
  notes?: string;
  coordinates?: { lat: number; lng: number; accuracy?: number };
  photoUrl?: string;
  livenessVerified?: boolean;
  auditHash?: string;
}

export interface StudentPaymentRecord {
  id: string;
  studentNis: string;
  studentName: string;
  level: "RA" | "SD" | "MTs" | "Les";
  grade: string;
  billType: "SPP Bulanan" | "Uang Gedung" | "Paket Bimbel Les";
  period: string; // e.g. "September 2026"
  amount: number;
  status: "Lunas" | "Belum Lunas";
  paidAt?: string;
  receiptNumber?: string;
}

export interface NewUserRegistration {
  name: string;
  identifier: string;
  role: "student" | "tutoring" | "teacher" | "kepsek";
  levelAssignment: "RA" | "SD" | "MTs" | "Semua";
  gradeOrSubject: string;
  phone?: string;
  email?: string;
}

export interface GlobalYayasanMetrics {
  totalActiveStudents: number;
  totalCollectedRevenue: number;
  globalStaffAttendanceRate: number;
  activeClassesCount: number;
  studentsByLevel: {
    ra: number;
    sd: number;
    mts: number;
    les: number;
  };
}

export interface FinanceTransaction {
  id: string;
  referenceNo: string;
  type: "income" | "expense" | "savings";
  category: string;
  amount: number;
  description: string;
  operatorName: string;
  date: string;
  timestamp: string;
  unit: "Yayasan" | "RA" | "SD" | "MTs";
  receiptUrl?: string;
  receiptName?: string;
  receiptSize?: string;
  status: "verified" | "audited" | "pending";
  auditHash: string;
  savingsType?: "deposit" | "withdraw";
  studentId?: string;
  studentName?: string;
  studentNis?: string;
  studentGrade?: string;
}

export interface FinanceSummary {
  totalIncome: number;
  totalExpense: number;
  totalSavings: number;
  netBalance: number;
  transactionCount: number;
  receiptVerifiedCount: number;
  auditPassRate: number;
}

export interface TeacherFaceRegistration {
  id: string;
  staffNip: string;
  staffName: string;
  role: string;
  level: "RA" | "SD" | "MTs" | "Yayasan";
  registeredPhotoUrl?: string;
  registeredAt?: string;
  registeredBy?: string; // Operator name
  faceDescriptorCount?: number;
  status: "Terdaftar" | "Belum Terdaftar";
}

export type NotificationType = "new_task" | "deadline_warning" | "grade_released" | "system_alert";

export interface StudentNotification {
  id: string;
  type: NotificationType;
  title: string;
  message: string;
  timestamp: string;
  isRead: boolean;
  taskId?: string;
  taskTitle?: string;
  subject?: string;
  score?: number; // e.g. 96
  dueDate?: string;
  teacherName?: string;
  actionUrl?: string;
}

export interface TeacherActivityRecord {
  nip: string;
  name: string;
  role: string;
  level: "RA" | "SD" | "MTs" | "Yayasan";
  avatar: string;
  materialsCount: number;
  tasksCount: number;
  attendanceStatus: "Hadir Tepat Waktu" | "Terlambat" | "Izin" | "Belum Hadir";
  clockInTime?: string;
  livenessVerified?: boolean;
  lastActive?: string;
  phone?: string;
}

// ============================================================================
// SOCIAL & MULTIPLAYER ARENA (PASANG KONSEP) TYPES
// ============================================================================
export type SocialConnectionStatus = "mutual" | "following" | "none";

export interface StudentSocialPeer {
  id: string; // e.g. "std-26071"
  nis: string; // "26071"
  name: string;
  grade: string; // "Kelas 7 MTs"
  unit: "MTs" | "SD" | "RA";
  avatar: string;
  hasCompletedLatestTask: boolean;
  latestTaskTitle: string;
  tasksCompletedCount: number;
  gamesPlayedCount: number;
  totalKnowledgeScore: number;
  connectionStatus: SocialConnectionStatus;
  isOnline?: boolean;
}

export interface ConceptCardPair {
  id: string;
  conceptTerm: string; // Left column (Term / Formula)
  explanation: string; // Right column (Definition / Function)
}

export type ArenaTopicId = "sains_ipa" | "matematika" | "agama_umum";

export interface ArenaTopicPack {
  id: ArenaTopicId;
  name: string;
  category: string;
  icon: string;
  badge: string;
  description: string;
  rounds: {
    round: number;
    pairs: ConceptCardPair[];
  }[];
}

export interface ArenaMultiplayerInvite {
  matchId: string;
  fromStudentId: string;
  fromStudentName: string;
  fromStudentAvatar: string;
  fromStudentGrade: string;
  toStudentId: string;
  timestamp: number;
}

