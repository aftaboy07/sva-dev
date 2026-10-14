"use client";

import React from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { AVAILABLE_CLASSES_BY_LEVEL } from "@/data/mockData";
import { Check, CheckSquare, Square, Layers, Sparkles } from "lucide-react";

interface ClassTargetSelectorProps {
  selectedClasses: string[];
  onChange: (classes: string[]) => void;
  teacherLevel?: "RA" | "SD" | "MTs" | "Semua";
  label?: string;
  helperText?: string;
}

export default function ClassTargetSelector({
  selectedClasses,
  onChange,
  teacherLevel,
  label = "Target Kelas Penerima Tugas / Materi",
  helperText,
}: ClassTargetSelectorProps) {
  const { currentUser, theme } = useEduQuest();
  const isDark = theme === "dark";

  // Determine effective level
  const effectiveLevel: "RA" | "SD" | "MTs" | "Semua" =
    teacherLevel ||
    (currentUser?.levelAssignment as "RA" | "SD" | "MTs" | "Semua") ||
    "Semua";

  // Get available classes strictly filtered by teacher level
  let availableClasses: { level: "RA" | "SD" | "MTs"; classes: string[] }[] = [];

  if (effectiveLevel === "RA") {
    availableClasses = [{ level: "RA", classes: AVAILABLE_CLASSES_BY_LEVEL.RA }];
  } else if (effectiveLevel === "SD") {
    availableClasses = [{ level: "SD", classes: AVAILABLE_CLASSES_BY_LEVEL.SD }];
  } else if (effectiveLevel === "MTs") {
    availableClasses = [{ level: "MTs", classes: AVAILABLE_CLASSES_BY_LEVEL.MTs }];
  } else {
    // Yayasan / Operator / Superadmin can target all levels
    availableClasses = [
      { level: "RA", classes: AVAILABLE_CLASSES_BY_LEVEL.RA },
      { level: "SD", classes: AVAILABLE_CLASSES_BY_LEVEL.SD },
      { level: "MTs", classes: AVAILABLE_CLASSES_BY_LEVEL.MTs },
    ];
  }

  const allAvailableList = availableClasses.flatMap((group) => group.classes);
  const isAllSelected =
    allAvailableList.length > 0 &&
    allAvailableList.every((cls) => selectedClasses.includes(cls));

  const toggleClass = (className: string) => {
    if (selectedClasses.includes(className)) {
      onChange(selectedClasses.filter((c) => c !== className));
    } else {
      onChange([...selectedClasses, className]);
    }
  };

  const handleSelectAll = () => {
    if (isAllSelected) {
      // Unselect only those in available list
      onChange(selectedClasses.filter((c) => !allAvailableList.includes(c)));
    } else {
      // Add all available classes
      const combined = Array.from(new Set([...selectedClasses, ...allAvailableList]));
      onChange(combined);
    }
  };

  return (
    <div
      className={`rounded-2xl border p-4 sm:p-5 transition-all duration-300 ${
        isDark
          ? "bg-[#1a1a24]/80 border-white/10 shadow-lg shadow-black/40"
          : "bg-white border-slate-200 shadow-sm"
      }`}
    >
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2.5 pb-3.5 mb-3.5 border-b border-white/10">
        <div>
          <div className="flex items-center gap-2">
            <Layers className="w-4 h-4 text-cyan-400" />
            <h4
              className={`text-sm font-bold tracking-tight ${
                isDark ? "text-white" : "text-slate-900"
              }`}
            >
              {label}
            </h4>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
              Unit {effectiveLevel}
            </span>
          </div>
          <p
            className={`text-xs mt-0.5 ${
              isDark ? "text-gray-400" : "text-slate-500"
            }`}
          >
            {helperText ||
              (effectiveLevel !== "Semua"
                ? `Opsi kelas dibatasi secara otomatis sesuai jenjang pengampu (${effectiveLevel}).`
                : "Pilih satu atau beberapa kelas target penugasan.")}
          </p>
        </div>

        {/* Quick Select All Toggle Button */}
        <button
          type="button"
          onClick={handleSelectAll}
          className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
            isAllSelected
              ? "bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 hover:bg-cyan-500/30"
              : isDark
              ? "bg-white/5 text-gray-300 border border-white/10 hover:bg-white/10 hover:text-white"
              : "bg-slate-100 text-slate-700 border border-slate-300 hover:bg-slate-200"
          }`}
        >
          {isAllSelected ? (
            <>
              <CheckSquare className="w-3.5 h-3.5 text-cyan-400" />
              <span>Semua Terpilih ({allAvailableList.length})</span>
            </>
          ) : (
            <>
              <Square className="w-3.5 h-3.5 text-gray-400" />
              <span>Pilih Semua Kelas ({allAvailableList.length})</span>
            </>
          )}
        </button>
      </div>

      {/* Class Group Checkbox Grid */}
      <div className="space-y-4">
        {availableClasses.map((group) => (
          <div key={group.level} className="space-y-2">
            {availableClasses.length > 1 && (
              <div className="flex items-center gap-2">
                <span className="text-[11px] font-bold uppercase tracking-wider text-cyan-400">
                  Jenjang {group.level}
                </span>
                <div className="flex-1 h-px bg-white/10" />
              </div>
            )}

            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2.5">
              {group.classes.map((cls) => {
                const isChecked = selectedClasses.includes(cls);
                return (
                  <button
                    type="button"
                    key={cls}
                    onClick={() => toggleClass(cls)}
                    className={`flex items-center gap-2.5 px-3 py-2.5 rounded-xl border text-left transition-all duration-200 group cursor-pointer ${
                      isChecked
                        ? "bg-gradient-to-r from-cyan-500/20 to-blue-500/10 border-cyan-500/50 shadow-md shadow-cyan-500/10 scale-[1.01]"
                        : isDark
                        ? "bg-[#14141b]/70 border-white/5 hover:border-white/20 text-gray-300 hover:text-white"
                        : "bg-slate-50 border-slate-200 hover:border-slate-300 text-slate-700"
                    }`}
                  >
                    <div
                      className={`w-4 h-4 rounded-md flex items-center justify-center transition-all ${
                        isChecked
                          ? "bg-cyan-500 text-slate-950 font-black shadow-xs shadow-cyan-400"
                          : isDark
                          ? "border border-white/20 group-hover:border-cyan-400"
                          : "border border-slate-300 group-hover:border-cyan-500"
                      }`}
                    >
                      {isChecked && <Check className="w-3 h-3 stroke-[3]" />}
                    </div>
                    <span
                      className={`text-xs font-semibold truncate ${
                        isChecked
                          ? "text-cyan-300 font-bold"
                          : isDark
                          ? "text-gray-300"
                          : "text-slate-800"
                      }`}
                    >
                      {cls}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        ))}
      </div>

      {/* Selected Classes Summary Footer */}
      <div className="mt-3.5 pt-3 border-t border-white/5 flex flex-wrap items-center justify-between gap-2 text-xs">
        <div className="flex items-center gap-1.5 text-gray-400">
          <Sparkles className="w-3.5 h-3.5 text-cyan-400" />
          <span>
            {selectedClasses.length === 0 ? (
              <span className="text-amber-400 font-medium">
                Peringatan: Belum ada kelas yang dipilih.
              </span>
            ) : (
              <span className="text-gray-300 font-medium">
                Target:{" "}
                <strong className="text-cyan-300 font-bold">
                  {selectedClasses.length} kelas
                </strong>{" "}
                terpilih ({selectedClasses.join(", ")})
              </span>
            )}
          </span>
        </div>

        {selectedClasses.length > 0 && (
          <button
            type="button"
            onClick={() => onChange([])}
            className="text-[11px] font-semibold text-rose-400 hover:text-rose-300 transition underline underline-offset-2 cursor-pointer"
          >
            Batal Pilih Semua
          </button>
        )}
      </div>
    </div>
  );
}
