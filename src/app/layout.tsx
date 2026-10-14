import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { EduQuestProvider } from "@/context/EduQuestContext";
import GlobalErrorBoundary from "@/components/common/GlobalErrorBoundary";

const inter = Inter({ subsets: ["latin"], variable: "--font-inter" });

export const metadata: Metadata = {
  title: "SVA Dev | Yayasan Bimbingan Belajar Modern Berbasis AI & Gamifikasi",
  description:
    "Platform EdTech terdepan yang mengintegrasikan kurikulum adaptif, multi-agent AI tutor, arena gamifikasi, dan pemantauan pembelajaran real-time untuk siswa dan guru.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="id" className={inter.variable} data-theme="dark">
      <body className="min-h-screen antialiased selection:bg-[#0cc0df]/30 selection:text-white transition-colors duration-300">
        <GlobalErrorBoundary>
          <EduQuestProvider>{children}</EduQuestProvider>
        </GlobalErrorBoundary>
      </body>
    </html>
  );
}
