"use client";

import React from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { Home, BookOpen, Bot, Gamepad2, Trophy, Camera, Sparkles, Swords } from "lucide-react";

interface BottomNavProps {
  activeTab: number;
  setActiveTab: (tab: number) => void;
}

export default function BottomNav({ activeTab, setActiveTab }: BottomNavProps) {
  const { currentUser, theme } = useEduQuest();
  const isDark = theme === "dark";
  const isTutoring = currentUser?.role === "tutoring" || currentUser?.studentType === "les";

  const tabs = [
    { id: 1, label: "Beranda", icon: Home },
    { id: 2, label: "Materi", icon: BookOpen },
    ...(!isTutoring ? [{ id: 6, label: "Absensi", icon: Camera }] : []),
    { id: 8, label: "Mabar", icon: Swords },
    { id: 4, label: "Arena", icon: Gamepad2 },
    { id: 7, label: "Lab 3D", icon: Sparkles },
    { id: 5, label: "Peringkat", icon: Trophy },
  ];

  return (
    <nav className={`md:hidden fixed bottom-0 left-0 right-0 z-40 backdrop-blur-lg border-t px-2 py-2 shadow-lg transition-colors duration-300 ${
      isDark
        ? "bg-[#14141b]/95 border-white/10 text-white"
        : "bg-white/95 border-slate-200 text-slate-900"
    }`}>
      <div className="flex items-center justify-around">
        {tabs.map((tab) => {
          const Icon = tab.icon;
          const isActive = activeTab === tab.id;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id)}
              className={`flex flex-col items-center justify-center py-1 px-2 rounded-xl transition-all duration-200 ${
                isActive
                  ? isDark ? "text-amber-400 font-bold scale-105" : "text-slate-950 font-bold scale-105"
                  : isDark ? "text-gray-400 hover:text-white font-medium" : "text-slate-400 hover:text-slate-600 font-medium"
              }`}
            >
              <div
                className={`p-1.5 rounded-xl transition-colors ${
                  isActive ? "bg-[#ffbf00] text-slate-950 shadow-sm" : ""
                }`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="text-[10px] mt-0.5">{tab.label}</span>
            </button>
          );
        })}
      </div>
    </nav>
  );
}
