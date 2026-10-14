"use client";

import React, { useState, useEffect } from "react";
import { Search, X } from "lucide-react";

interface DebouncedSearchInputProps {
  value: string;
  onChange: (debouncedVal: string) => void;
  placeholder?: string;
  delay?: number;
  className?: string;
  inputClassName?: string;
  autoFocus?: boolean;
}

export default function DebouncedSearchInput({
  value,
  onChange,
  placeholder = "Cari data...",
  delay = 300,
  className = "",
  inputClassName = "",
  autoFocus = false,
}: DebouncedSearchInputProps) {
  const [localValue, setLocalValue] = useState(value);

  // Sync if parent updates value directly
  useEffect(() => {
    setLocalValue(value);
  }, [value]);

  // Debounced notification to parent
  useEffect(() => {
    const timer = setTimeout(() => {
      onChange(localValue);
    }, delay);

    return () => {
      clearTimeout(timer);
    };
  }, [localValue, delay, onChange]);

  const handleClear = () => {
    setLocalValue("");
    onChange("");
  };

  return (
    <div className={`relative flex items-center ${className}`}>
      <Search className="w-4 h-4 text-cyan-400/80 absolute left-3.5 top-1/2 -translate-y-1/2 pointer-events-none" />
      <input
        type="text"
        value={localValue}
        onChange={(e) => setLocalValue(e.target.value)}
        placeholder={placeholder}
        autoFocus={autoFocus}
        className={`w-full pl-10 pr-9 py-2.5 rounded-xl border border-white/10 bg-[#12121a] text-xs text-white placeholder-gray-500 focus:outline-hidden focus:border-cyan-400/80 focus:ring-1 focus:ring-cyan-400/30 transition-all shadow-sm ${inputClassName}`}
      />
      {localValue && (
        <button
          type="button"
          onClick={handleClear}
          className="absolute right-3 top-1/2 -translate-y-1/2 p-0.5 rounded-md text-gray-400 hover:text-white hover:bg-white/10 transition cursor-pointer"
          title="Hapus pencarian"
        >
          <X className="w-3.5 h-3.5" />
        </button>
      )}
    </div>
  );
}
