"use client";

import React, { useState } from "react";
import { TEACHER_ANALYTICS_METRICS, MOCK_AI_INSIGHTS } from "@/data/mockData";
import {
  TrendingUp,
  AlertTriangle,
  Lightbulb,
  Users,
  CheckCircle2,
  Calendar,
  BarChart3,
  BrainCircuit,
  ArrowRight,
  Sparkles,
} from "lucide-react";

export default function TabAnalytics() {
  const [scheduledTopicToast, setScheduledTopicToast] = useState<string | null>(null);

  const handleScheduleSession = (topic: string) => {
    setScheduledTopicToast(topic);
    setTimeout(() => setScheduledTopicToast(null), 3500);
  };

  return (
    <div className="space-y-8 text-white">
      {/* Page Title */}
      <div>
        <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-blue-500/20 text-blue-300 border border-blue-500/30 text-xs font-semibold mb-2">
          <BarChart3 className="w-3.5 h-3.5" />
          <span>Analitika Akademik & Pemantauan Performa</span>
        </div>
        <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
          Dashboard Analytics Pembelajaran
        </h2>
        <p className="text-xs sm:text-sm text-gray-400">
          Ringkasan komprehensif tingkat keaktifan, pencapaian kompetensi, dan diagnosis miskonsepsi siswa berbasis data interaksi AI.
        </p>
      </div>

      {/* 1. METRIC GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {TEACHER_ANALYTICS_METRICS.map((metric, i) => (
          <div
            key={i}
            className="bg-[#1a1a24] rounded-2xl border border-white/10 p-5 shadow-xl backdrop-blur-md flex flex-col justify-between hover:border-white/20 transition-all"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-400">
                  {metric.label}
                </span>
                <span
                  className={`text-[11px] font-bold px-2 py-0.5 rounded-md flex items-center gap-1 ${
                    metric.trend === "up"
                      ? "bg-emerald-500/20 text-emerald-300 border border-emerald-500/30"
                      : metric.trend === "down"
                      ? "bg-blue-500/20 text-blue-300 border border-blue-500/30"
                      : "bg-white/10 text-gray-300 border border-white/10"
                  }`}
                >
                  <TrendingUp className="w-3 h-3" />
                  <span>{metric.trendValue}</span>
                </span>
              </div>
              <h3 className="text-2xl font-black text-white tracking-tight">
                {metric.value}
              </h3>
            </div>
            <p className="text-[11px] text-gray-400 mt-3 pt-3 border-t border-white/5">
              {metric.subtext}
            </p>
          </div>
        ))}
      </div>

      {/* 2. "AI INSIGHTS" ALERT CARD (Aggregated student struggles from AI chat logs) */}
      <div className="bg-gradient-to-br from-amber-500/15 via-purple-500/10 to-blue-500/10 rounded-2xl border border-amber-400/30 p-6 sm:p-8 relative overflow-hidden shadow-xl backdrop-blur-md">
        <div className="flex items-start gap-4">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-amber-500 to-yellow-400 text-amber-950 flex items-center justify-center shrink-0 shadow-lg shadow-amber-500/20">
            <BrainCircuit className="w-6 h-6 animate-pulse" />
          </div>

          <div className="space-y-2 flex-1">
            <div className="flex flex-wrap items-center gap-2">
              <h3 className="text-lg font-extrabold text-white">
                AI Insights: Analisis Miskonsepsi Siswa
              </h3>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-bold bg-amber-400/20 text-amber-300 border border-amber-400/40 uppercase tracking-wider">
                Deteksi Otomatis Log Tanya AI
              </span>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
              Sistem telah menganalisis lebih dari 120 transkrip percakapan siswa di fitur <strong>Tanya AI (Prof. Atomika & Pak Bilangan)</strong> selama 7 hari terakhir dan mengidentifikasi pola keraguan konsep berikut:
            </p>
          </div>
        </div>

        {/* List of Insights */}
        <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          {MOCK_AI_INSIGHTS.map((insight) => (
            <div
              key={insight.id}
              className="bg-[#151520]/95 backdrop-blur-md rounded-2xl border border-white/10 p-5 space-y-3 shadow-lg"
            >
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-violet-300 bg-violet-500/20 border border-violet-500/30 px-2.5 py-0.5 rounded-md">
                  {insight.subject}
                </span>
                <span className="text-xs font-extrabold text-rose-300 bg-rose-500/20 border border-rose-500/30 px-2 py-0.5 rounded-md">
                  {insight.percentageStruggling}% Siswa Kesulitan
                </span>
              </div>

              <div>
                <h4 className="font-bold text-sm text-white">
                  {insight.topic}
                </h4>
                <p className="text-xs text-gray-300 mt-1 leading-relaxed">
                  {insight.description}
                </p>
              </div>

              <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-xs text-blue-200 flex items-start gap-2">
                <Lightbulb className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
                <div>
                  <strong className="text-blue-300">Saran Intervensi Guru:</strong> {insight.recommendedAction}
                </div>
              </div>

              <div className="pt-2 flex justify-end">
                <button
                  onClick={() => handleScheduleSession(insight.topic)}
                  className="px-4 py-2 rounded-xl text-xs font-bold text-white bg-white/10 hover:bg-white/20 border border-white/15 flex items-center gap-1.5 transition shadow-sm cursor-pointer"
                >
                  <Calendar className="w-3.5 h-3.5 text-amber-400" />
                  <span>Jadwalkan Remedial Kelas</span>
                </button>
              </div>
            </div>
          ))}
        </div>

        {scheduledTopicToast && (
          <div className="mt-4 p-3.5 bg-emerald-600 text-white rounded-2xl text-xs font-semibold flex items-center gap-2 animate-fade-in shadow-md">
            <CheckCircle2 className="w-4 h-4 shrink-0" />
            <span>
              Sesi bimbingan konsep untuk materi &quot;{scheduledTopicToast}&quot; telah ditambahkan ke agenda mengajar mendatang!
            </span>
          </div>
        )}
      </div>

      {/* 3. PERFORMANCE DISTRIBUTION BARS */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Score Distribution */}
        <div className="bg-[#1a1a24] rounded-2xl border border-white/10 p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="font-bold text-sm text-white">
                Distribusi Nilai Evaluasi (Kelas 11 MIPA 1)
              </h4>
              <p className="text-xs text-gray-400">
                Berdasarkan 12 modul tugas dan kuis harian
              </p>
            </div>
            <span className="text-xs font-bold text-blue-400">30 Siswa</span>
          </div>

          <div className="space-y-3 pt-2">
            {[
              { range: "Nilai 90 - 100 (Sangat Mahir)", count: 12, percent: 40, color: "bg-emerald-500" },
              { range: "Nilai 80 - 89 (Kompeten)", count: 11, percent: 36, color: "bg-blue-600" },
              { range: "Nilai 70 - 79 (Cukup)", count: 4, percent: 14, color: "bg-amber-500" },
              { range: "Nilai < 70 (Perlu Remedial)", count: 3, percent: 10, color: "bg-rose-500" },
            ].map((item, idx) => (
              <div key={idx} className="space-y-1">
                <div className="flex justify-between text-xs font-semibold text-gray-300">
                  <span>{item.range}</span>
                  <span className="text-gray-400">{item.count} Siswa ({item.percent}%)</span>
                </div>
                <div className="w-full bg-white/10 h-2.5 rounded-full overflow-hidden">
                  <div
                    className={`${item.color} h-full rounded-full transition-all duration-500`}
                    style={{ width: `${item.percent}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Weekly Activity Trends */}
        <div className="bg-[#1a1a24] rounded-2xl border border-white/10 p-6 space-y-4 shadow-xl backdrop-blur-md">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <div>
              <h4 className="font-bold text-sm text-white">
                Keaktifan Belajar Mingguan
              </h4>
              <p className="text-xs text-gray-400">
                Jumlah modul dibaca & waktu penyelesaian tugas
              </p>
            </div>
            <span className="text-xs font-bold text-emerald-400">+12% dari minggu lalu</span>
          </div>

          <div className="grid grid-cols-7 gap-2 pt-4 items-end h-40">
            {[
              { day: "Sen", height: "70%", val: 45 },
              { day: "Sel", height: "85%", val: 62 },
              { day: "Rab", height: "60%", val: 38 },
              { day: "Kam", height: "95%", val: 78 },
              { day: "Jum", height: "80%", val: 56 },
              { day: "Sab", height: "90%", val: 70 },
              { day: "Min", height: "50%", val: 30 },
            ].map((d, i) => (
              <div key={i} className="flex flex-col items-center h-full justify-end group">
                <span className="text-[10px] font-bold text-gray-400 opacity-0 group-hover:opacity-100 transition mb-1">
                  {d.val}
                </span>
                <div
                  className="w-full bg-blue-500/20 group-hover:bg-blue-500 rounded-xl transition-all duration-300"
                  style={{ height: d.height }}
                />
                <span className="text-[11px] font-semibold text-gray-400 mt-2">
                  {d.day}
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
