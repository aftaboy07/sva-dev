"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CinematicBackground from "@/components/common/CinematicBackground";
import { useEduQuest } from "@/context/EduQuestContext";
import TeacherHeader from "@/components/teacher/TeacherHeader";
import TeacherSidebar from "@/components/teacher/TeacherSidebar";
import TabAnalytics from "@/components/teacher/TabAnalytics";
import TabKontenGame from "@/components/teacher/TabKontenGame";
import TabPantauSiswa from "@/components/teacher/TabPantauSiswa";
import TabPantauGuru from "@/components/teacher/TabPantauGuru";
import TabAbsensiJurnal from "@/components/teacher/TabAbsensiJurnal";
import TabAbsensiPegawai from "@/components/teacher/TabAbsensiPegawai";
import TabOperatorDashboard from "@/components/teacher/TabOperatorDashboard";
import TabOperatorPendaftaran from "@/components/teacher/TabOperatorPendaftaran";
import TabOperatorKasir from "@/components/teacher/TabOperatorKasir";
import TabLaporanKas from "@/components/teacher/TabLaporanKas";
import TabAdministrasiPembayaran from "@/components/teacher/TabAdministrasiPembayaran";
import TabAdministrasiTabungan from "@/components/teacher/TabAdministrasiTabungan";
import TabOverviewYayasan from "@/components/teacher/TabOverviewYayasan";
import TabManajemenWajahAI from "@/components/teacher/TabManajemenWajahAI";
import Whiteboard3DWorkspace from "@/components/workspace/Whiteboard3DWorkspace";
import AIAssessmentExamEngine from "@/components/assessment/AIAssessmentExamEngine";
import FoundationTaskDelegation from "@/components/foundation/FoundationTaskDelegation";
import CryptoReceiptCameraValidator from "@/components/security/CryptoReceiptCameraValidator";

export default function TeacherPortalPage() {
  const { currentUser, loginAs, theme } = useEduQuest();
  const isDark = theme === "dark";

  // Strict role evaluation
  const staffRole = (currentUser?.staffRole || currentUser?.role || "guru").toLowerCase();
  const isOperator = staffRole === "operator" || currentUser?.role === "operator";
  const isYayasan = staffRole === "yayasan" || currentUser?.role === "yayasan";
  const isKepsek = staffRole === "kepsek" || currentUser?.role === "kepsek";

  // Tab State
  const [activeTab, setActiveTab] = useState<string>(() => {
    if (isOperator) return "operator_dashboard";
    if (isYayasan) return "yayasan_overview";
    return "analytics";
  });

  // Guard only against unauthenticated or pure student accounts entering
  useEffect(() => {
    if (!currentUser) {
      loginAs("teacher", "guru");
    } else if (currentUser.role === "student" || currentUser.role === "tutoring") {
      loginAs("teacher", "guru");
    }
  }, [currentUser, loginAs]);

  // Adjust default tab whenever role switches
  useEffect(() => {
    if (isOperator) {
      setActiveTab("operator_dashboard");
    } else if (isYayasan) {
      setActiveTab("yayasan_overview");
    } else if (isKepsek) {
      setActiveTab("analytics");
    } else {
      setActiveTab("analytics");
    }
  }, [currentUser?.role, currentUser?.staffRole]);

  return (
    <CinematicBackground>
      <div
        className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ease-in-out ${
          isDark ? "bg-[#0f0f13] text-white" : "bg-slate-100 text-slate-900"
        }`}
      >
      {/* Header */}
      <TeacherHeader />

      <div className="flex-1 flex w-full transition-all duration-300">
        {/* Left Sidebar */}
        <TeacherSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

        {/* Main Workspace Tab */}
        <main className="flex-1 w-full max-w-full px-4 sm:px-6 lg:px-8 py-6 transition-all duration-300 overflow-x-hidden min-w-0">
          {/* ========================================================= */}
          {/* 1. OPERATOR SPECIFIC TABS (STRICT 5 MENUS)                */}
          {/* ========================================================= */}
          {isOperator && (
            <>
              {activeTab === "operator_dashboard" && (
                <TabOperatorDashboard setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_cashier" && (
                <TabOperatorKasir setActiveTab={setActiveTab} />
              )}
              {(activeTab === "operator_cash_report" || activeTab === "operator_finance") && (
                <TabLaporanKas setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_fee_admin" && (
                <TabAdministrasiPembayaran setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_savings_admin" && (
                <TabAdministrasiTabungan setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_face_data" && (
                <TabManajemenWajahAI setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_registration" && (
                <TabOperatorPendaftaran />
              )}
              {activeTab === "operator_attendance" && (
                <TabAbsensiPegawai />
              )}
              {activeTab === "crypto_validator" && (
                <CryptoReceiptCameraValidator />
              )}
            </>
          )}

          {/* ========================================================= */}
          {/* 2. GURU SPECIFIC TABS                                     */}
          {/* ========================================================= */}
          {!isOperator && !isYayasan && !isKepsek && (
            <>
              {activeTab === "analytics" && <TabAnalytics />}
              {(activeTab === "content_tasks" || activeTab === "games") && <TabKontenGame />}
              {activeTab === "students" && <TabPantauSiswa />}
              {activeTab === "staff_attendance" && <TabAbsensiPegawai />}
              {activeTab === "workspace_3d" && <Whiteboard3DWorkspace />}
              {activeTab === "ai_assessment" && <AIAssessmentExamEngine />}
              {activeTab === "crypto_validator" && <CryptoReceiptCameraValidator />}
            </>
          )}

          {/* ========================================================= */}
          {/* 3. KEPSEK SPECIFIC TABS                                   */}
          {/* ========================================================= */}
          {isKepsek && (
            <>
              {activeTab === "analytics" && <TabAnalytics />}
              {(activeTab === "teachers" || activeTab === "students") && <TabPantauGuru />}
              {(activeTab === "content_tasks" || activeTab === "games") && <TabKontenGame />}
              {activeTab === "staff_attendance" && <TabAbsensiPegawai />}
              {activeTab === "workspace_3d" && <Whiteboard3DWorkspace />}
              {activeTab === "ai_assessment" && <AIAssessmentExamEngine />}
              {activeTab === "crypto_validator" && <CryptoReceiptCameraValidator />}
            </>
          )}

          {/* ========================================================= */}
          {/* 4. YAYASAN SUPER ADMIN SPECIFIC TABS                      */}
          {/* ========================================================= */}
          {isYayasan && (
            <>
              {activeTab === "yayasan_overview" && (
                <TabOverviewYayasan setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_cashier" && (
                <TabOperatorKasir setActiveTab={setActiveTab} />
              )}
              {(activeTab === "operator_cash_report" || activeTab === "operator_finance") && (
                <TabLaporanKas setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_fee_admin" && (
                <TabAdministrasiPembayaran setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_savings_admin" && (
                <TabAdministrasiTabungan setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_face_data" && (
                <TabManajemenWajahAI setActiveTab={setActiveTab} />
              )}
              {activeTab === "operator_attendance" && <TabAbsensiPegawai />}
              {activeTab === "operator_registration" && <TabOperatorPendaftaran />}
              {activeTab === "teachers" && <TabPantauGuru />}
              {activeTab === "students" && <TabPantauSiswa />}
              {(activeTab === "content_tasks" || activeTab === "games") && <TabKontenGame />}
              {activeTab === "analytics" && <TabAnalytics />}
              {activeTab === "workspace_3d" && <Whiteboard3DWorkspace />}
              {activeTab === "ai_assessment" && <AIAssessmentExamEngine />}
              {activeTab === "yayasan_delegation" && <FoundationTaskDelegation />}
              {activeTab === "crypto_validator" && <CryptoReceiptCameraValidator />}
            </>
          )}
        </main>
      </div>
      </div>
    </CinematicBackground>
  );
}