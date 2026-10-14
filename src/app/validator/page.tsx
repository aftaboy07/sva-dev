"use client";

import React from "react";
import CryptoReceiptCameraValidator from "@/components/security/CryptoReceiptCameraValidator";

export default function ValidatorPage() {
  return (
    <main className="min-h-screen bg-[#0f0f13] text-white p-6 sm:p-10">
      <div className="max-w-6xl mx-auto">
        <CryptoReceiptCameraValidator />
      </div>
    </main>
  );
}
