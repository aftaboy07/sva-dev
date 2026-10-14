"use client";

import React, { useState, useRef, useEffect } from "react";
import { useEduQuest } from "@/context/EduQuestContext";
import { AI_AGENTS } from "@/data/mockData";
import { AIAgentId, AIAgent } from "@/types";
import {
  Bot,
  Send,
  MessageSquare,
  Sparkles,
  History,
  Lightbulb,
  CheckCircle2,
  ChevronRight,
  User,
  Clock,
  Compass,
} from "lucide-react";

export default function TabTanyaAI() {
  const {
    selectedAgentId,
    setSelectedAgentId,
    chatMessages,
    sendAiMessage,
    pastTopics,
    isAiResponding,
    theme,
  } = useEduQuest();

  const isDark = theme === "dark";

  const [inputMessage, setInputMessage] = useState("");
  const [historyDrawerOpen, setHistoryDrawerOpen] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const activeAgent =
    AI_AGENTS.find((a) => a.id === selectedAgentId) || AI_AGENTS[1];

  const currentMessages = chatMessages[selectedAgentId] || [];

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [currentMessages, isAiResponding]);

  const handleSendMessage = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputMessage.trim() || isAiResponding) return;

    sendAiMessage(selectedAgentId, inputMessage.trim());
    setInputMessage("");
  };

  const handlePromptClick = (promptText: string) => {
    if (isAiResponding) return;
    sendAiMessage(selectedAgentId, promptText);
  };

  return (
    <div className="space-y-6 pb-20 md:pb-6">
      {/* Header section with Drawer Toggle */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-100 text-cyan-900 text-xs font-semibold mb-2">
            <Bot className="w-3.5 h-3.5 text-[#0cc0df]" />
            <span>Pojok Tanya AI Multi-Agent YPI As Sa'adah</span>
          </div>
          <h2
            className={`text-2xl sm:text-3xl font-extrabold tracking-tight transition-colors duration-500 ${
              isDark ? "text-white" : "text-slate-900"
            }`}
          >
            Konsultasi dengan AI Tutor Ahli
          </h2>
          <p
            className={`text-xs sm:text-sm transition-colors duration-500 ${
              isDark ? "text-slate-400" : "text-slate-600 font-medium"
            }`}
          >
            Pilih tutor spesialis sesuai mata pelajaran. AI kami menggunakan metode Socrates untuk menuntun logika berpikirmu.
          </p>
        </div>

        {/* Toggle Past History Drawer */}
        <button
          onClick={() => setHistoryDrawerOpen(!historyDrawerOpen)}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-xs font-semibold text-slate-700 shadow-xs transition"
        >
          <History className="w-4 h-4 text-[#0cc0df]" />
          <span>Histori Percakapan ({pastTopics.length})</span>
        </button>
      </div>

      {/* 1. AI Agent Selection Grid (Math, Science, Language) */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3.5">
        {AI_AGENTS.map((agent) => {
          const isSelected = selectedAgentId === agent.id;
          return (
            <button
              key={agent.id}
              onClick={() => setSelectedAgentId(agent.id)}
              className={`p-4 rounded-2xl border text-left transition-all duration-200 flex items-start gap-3.5 relative overflow-hidden group ${
                isSelected
                  ? "bg-white border-[#0cc0df] ring-2 ring-[#0cc0df]/20 shadow-md scale-[1.01]"
                  : "bg-white border-slate-200/90 hover:border-[#0cc0df]/50 hover:shadow-xs"
              }`}
            >
              <div className="relative shrink-0">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-12 h-12 rounded-xl object-cover ring-2 ring-slate-100"
                  width={48}
                  height={48}
                />
                {isSelected && (
                  <span className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-white" />
                )}
              </div>
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <h4
                    className={`font-bold text-sm truncate ${
                      isSelected ? "text-violet-800" : "text-slate-900"
                    }`}
                  >
                    {agent.name}
                  </h4>
                  {isSelected && (
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded-md bg-violet-100 text-violet-700">
                      Aktif
                    </span>
                  )}
                </div>
                <p className="text-[11px] font-semibold text-slate-500 truncate mt-0.5">
                  {agent.title}
                </p>
                <p className="text-[10px] text-slate-400 line-clamp-1 mt-1">
                  {agent.specialty}
                </p>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Area: Sidebar Drawer + Active Interactive Chat */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6 items-start">
        {/* Sidebar / Drawer: "Histori Percakapan" */}
        <div
          className={`${
            historyDrawerOpen ? "block" : "hidden lg:block"
          } lg:col-span-1 bg-white rounded-2xl border border-slate-200 p-4 space-y-4 shadow-xs`}
        >
          <div className="flex items-center justify-between border-b border-slate-100 pb-3">
            <div className="flex items-center gap-2">
              <History className="w-4 h-4 text-violet-700" />
              <h4 className="text-xs font-bold text-slate-800 uppercase tracking-wider">
                Histori Topik
              </h4>
            </div>
            <span className="text-[11px] text-slate-400 font-medium">Tersimpan</span>
          </div>

          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1">
            {pastTopics.map((topic) => {
              const matchedAgent = AI_AGENTS.find((a) => a.id === topic.agentId);
              return (
                <button
                  key={topic.id}
                  onClick={() => setSelectedAgentId(topic.agentId)}
                  className="w-full text-left p-3 rounded-xl border border-slate-100 hover:border-violet-200 hover:bg-violet-50/50 transition group space-y-1"
                >
                  <div className="flex items-center justify-between text-[10px] text-slate-400">
                    <span className="font-semibold text-violet-700">
                      {matchedAgent?.name}
                    </span>
                    <span>{topic.lastUpdated}</span>
                  </div>
                  <h5 className="text-xs font-bold text-slate-800 group-hover:text-violet-800 transition line-clamp-1">
                    {topic.title}
                  </h5>
                  <p className="text-[11px] text-slate-500 line-clamp-1">
                    {topic.snippet}
                  </p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Chat Area */}
        <div
          className={`${
            historyDrawerOpen ? "lg:col-span-3" : "lg:col-span-3"
          } col-span-1 bg-white rounded-3xl border border-slate-200 shadow-sm flex flex-col h-[600px] overflow-hidden`}
        >
          {/* Active Agent Banner */}
          <div className="px-6 py-4 bg-slate-50/90 border-b border-slate-200 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <img
                src={activeAgent.avatar}
                alt={activeAgent.name}
                className="w-10 h-10 rounded-xl object-cover ring-2 ring-violet-200"
                width={40}
                height={40}
              />
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-sm text-slate-900">
                    {activeAgent.name}
                  </h3>
                  <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
                  <span className="text-[10px] text-emerald-700 font-bold bg-emerald-50 px-2 py-0.5 rounded-md">
                    Online 24/7
                  </span>
                </div>
                <p className="text-xs text-slate-500">{activeAgent.title}</p>
              </div>
            </div>

            <div className="text-right hidden sm:block">
              <span className="text-[11px] text-slate-400 block font-medium">
                Metode Pembelajaran
              </span>
              <span className="text-xs font-bold text-violet-700">
                Socrates & Penalaran Bertahap
              </span>
            </div>
          </div>

          {/* Messages Scroll Area */}
          <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-gradient-to-b from-slate-50/50 to-white">
            {currentMessages.map((msg) => {
              const isUser = msg.sender === "user";
              return (
                <div
                  key={msg.id}
                  className={`flex items-start gap-3 ${
                    isUser ? "flex-row-reverse" : "flex-row"
                  }`}
                >
                  <div
                    className={`w-8 h-8 rounded-xl shrink-0 flex items-center justify-center text-xs font-bold ${
                      isUser
                        ? "bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] text-white"
                        : "bg-slate-200 text-slate-800"
                    }`}
                  >
                    {isUser ? <User className="w-4 h-4 text-[#ffbf00]" /> : <Bot className="w-4 h-4 text-[#0cc0df]" />}
                  </div>

                  <div
                    className={`max-w-[82%] sm:max-w-[75%] rounded-2xl p-4 text-xs leading-relaxed space-y-2 shadow-xs ${
                      isUser
                        ? "bg-slate-900 text-white rounded-tr-xs"
                        : "bg-white border border-slate-200 text-slate-800 rounded-tl-xs"
                    }`}
                  >
                    <p className="font-medium">{msg.text}</p>

                    {/* Step-by-step Socratic Guidance */}
                    {msg.steps && msg.steps.length > 0 && (
                      <div className="mt-3 pt-3 border-t border-slate-100 space-y-2 bg-cyan-50/50 p-3 rounded-xl border border-cyan-100">
                        <span className="font-bold text-[11px] text-cyan-900 block">
                          💡 Panduan Langkah Konsep:
                        </span>
                        {msg.steps.map((step, sIdx) => (
                          <div
                            key={sIdx}
                            className="flex items-start gap-2 text-[11px] text-slate-700 font-medium"
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#0cc0df] shrink-0 mt-0.5" />
                            <span>{step}</span>
                          </div>
                        ))}
                      </div>
                    )}

                    <span
                      className={`block text-[10px] text-right font-medium ${
                        isUser ? "text-slate-400" : "text-slate-400"
                      }`}
                    >
                      {msg.timestamp}
                    </span>
                  </div>
                </div>
              );
            })}

            {/* AI Typing indicator */}
            {isAiResponding && (
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-slate-200 text-slate-800 flex items-center justify-center">
                  <Bot className="w-4 h-4 text-[#0cc0df] animate-spin" />
                </div>
                <div className="bg-white border border-slate-200 rounded-2xl px-4 py-3 text-xs text-slate-500 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-[#0cc0df] rounded-full animate-pulse" />
                  <span className="w-1.5 h-1.5 bg-[#0cc0df] rounded-full animate-pulse delay-100" />
                  <span className="w-1.5 h-1.5 bg-[#ffbf00] rounded-full animate-pulse delay-200" />
                  <span className="text-[11px] font-medium text-slate-600">
                    {activeAgent.name} sedang menyusun penalaran...
                  </span>
                </div>
              </div>
            )}

            <div ref={messagesEndRef} />
          </div>

          {/* Quick Suggestion Chips */}
          <div className="px-6 py-2 bg-slate-50/90 border-t border-slate-200 flex items-center gap-2 overflow-x-auto no-scrollbar">
            <Lightbulb className="w-4 h-4 text-[#ffbf00] shrink-0" />
            <span className="text-[11px] font-semibold text-slate-500 shrink-0">
              Saran Cepat:
            </span>
            {activeAgent.samplePrompts.map((prompt, i) => (
              <button
                key={i}
                onClick={() => handlePromptClick(prompt)}
                disabled={isAiResponding}
                className="px-3 py-1 rounded-lg bg-white border border-slate-200 hover:border-[#0cc0df] text-[11px] text-slate-700 whitespace-nowrap transition shrink-0 hover:text-cyan-700 disabled:opacity-50"
              >
                {prompt}
              </button>
            ))}
          </div>

          {/* Input Form */}
          <form
            onSubmit={handleSendMessage}
            className="p-4 bg-white border-t border-slate-200 flex items-center gap-3"
          >
            <input
              type="text"
              placeholder={`Tulis pertanyaan matematika/sains/bahasa untuk ${activeAgent.name}...`}
              value={inputMessage}
              onChange={(e) => setInputMessage(e.target.value)}
              disabled={isAiResponding}
              className="flex-1 px-4 py-3 rounded-xl border border-slate-200 bg-slate-50 focus:bg-white text-xs text-slate-900 focus:outline-hidden focus:ring-2 focus:ring-[#0cc0df] transition"
            />
            <button
              type="submit"
              disabled={!inputMessage.trim() || isAiResponding}
              className="px-5 py-3 rounded-xl bg-gradient-to-r from-[#ffbf00] via-black to-[#0cc0df] hover:opacity-95 disabled:opacity-50 text-white font-bold text-xs flex items-center gap-2 shadow-md active:scale-95 transition"
            >
              <span className="text-white">Kirim</span>
              <Send className="w-3.5 h-3.5 text-[#ffbf00]" />
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}
