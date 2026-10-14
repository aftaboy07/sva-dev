"use client";

import React, { useState, useEffect } from "react";
import { motion } from "framer-motion";
import CinematicBackground from "@/components/common/CinematicBackground";
import { useRouter } from "next/navigation";
import { useEduQuest } from "@/context/EduQuestContext";
import StudentHeader from "@/components/student/StudentHeader";
import StudentSidebar from "@/components/student/StudentSidebar";
import BottomNav from "@/components/student/BottomNav";
import TabBeranda from "@/components/student/TabBeranda";
import TabRuangMateri from "@/components/student/TabRuangMateri";
import TabTanyaAI from "@/components/student/TabTanyaAI";
import TabArena from "@/components/student/TabArena";
import TabPeringkat from "@/components/student/TabPeringkat";
import TabAbsensiSiswa from "@/components/student/TabAbsensiSiswa";
import TabTemanArena from "@/components/student/TabTemanArena";
import Anatomy3D from "@/components/Anatomy3D";

export default function StudentPortalPage() {
  const router = useRouter();
  const { currentUser, loginAs, setFocusedTaskId, theme } = useEduQuest();
  const isDark = theme === "dark";
  const [activeTab, setActiveTab] = useState(1);

  // Auto-fill student session if accessed directly
  useEffect(() => {
    if (!currentUser) {
      loginAs("student");
    }
  }, [currentUser, loginAs]);

  const handleSelectTask = (taskId: string) => {
    setFocusedTaskId(taskId);
    setActiveTab(1);
  };

  return (
    <CinematicBackground>
      <div
        className={`min-h-screen flex flex-col font-sans transition-colors duration-500 ease-in-out ${
          isDark ? "bg-[#0f0f13] text-white" : "bg-slate-100 text-slate-900"
        }`}
      >
        {/* Gamification Header with Notification Bell */}
        <StudentHeader onSelectTask={handleSelectTask} />

        {/* Parent Flex Container holding Sidebar & Main Content */}
        <div className="flex-1 flex w-full transition-all duration-300">
          {/* Desktop Sidebar */}
          <StudentSidebar activeTab={activeTab} setActiveTab={setActiveTab} />

          {/* Dynamic Main Workspace Tab */}
          <main className="flex-1 w-full max-w-full px-6 py-6 sm:p-6 lg:p-8 transition-all duration-300 overflow-x-hidden min-w-0">
            {activeTab === 1 && <TabBeranda onNavigateToTab={setActiveTab} />}
            {activeTab === 2 && <TabRuangMateri />}
            {activeTab === 3 && <TabTanyaAI />}
            {activeTab === 4 && <TabArena />}
            {activeTab === 5 && <TabPeringkat />}
            {activeTab === 6 && <TabAbsensiSiswa />}
            {activeTab === 7 && <Anatomy3D onBack={() => setActiveTab(4)} />}
            {activeTab === 8 && <TabTemanArena />}
          </main>
        </div>

        {/* Mobile Bottom Navigation */}
        <BottomNav activeTab={activeTab} setActiveTab={setActiveTab} />
      </div>
    </CinematicBackground>
  );
}