import React from "react";
import Link from "next/link";
import Image from "next/image";
import { Mail, Phone, MapPin, Heart, ShieldCheck } from "lucide-react";

export default function Footer() {
  return (
    <footer className="bg-slate-950 text-slate-400 text-sm border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          {/* Brand Info */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center gap-3">
              <Image src="/sva-logo.png" alt="SVA Dev" width={100} height={65} className="w-24 h-auto object-contain" />
              <div>
                <span className="font-black text-xl text-white block">SVA Dev</span>
                <span className="text-xs font-bold text-[#0cc0df] -mt-1 block">YPI As Sa&apos;adah</span>
              </div>
            </div>
            <p className="text-xs text-slate-400 leading-relaxed">
              Yayasan Pendidikan Islam (YPI) As Sa&apos;adah berkomitmen mencetak generasi berkarakter Qur&apos;ani, unggul dalam sains dan teknologi, serta berdaya saing global melalui sistem belajar digital adaptif.
            </p>
            <div className="flex items-center gap-2 text-xs text-emerald-400 font-medium">
              <ShieldCheck className="w-4 h-4 text-[#0cc0df]" />
              <span>NPSN Resmi Terdaftar: 69821401</span>
            </div>
          </div>

          {/* Quick Links */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">Jenjang Lembaga</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Raudhatul Athfal (RA / TK) Islam</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Madrasah Ibtidaiyah (MI / SD) Islam</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Madrasah Tsanawiyah (MTs / SMP) Islam</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Program Tahfidzul Qur&apos;an Intensif</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Klinik Olimpiade Sains & Riset Islam</span></li>
            </ul>
          </div>

          {/* Pillars */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">Layanan Platform</h4>
            <ul className="space-y-2 text-xs">
              <li><span className="hover:text-white transition-colors cursor-pointer">Pojok Tanya AI Multi-Agent</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Laboratorium Sains AR 3D</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Arena Gamifikasi & Tantangan Guru</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Dashboard Analitika Akademik</span></li>
              <li><span className="hover:text-white transition-colors cursor-pointer">Presensi Digital QR Cerdas</span></li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-3">
            <h4 className="text-white font-bold text-xs tracking-wider uppercase">Sekretariat Yayasan</h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-[#0cc0df] mt-0.5 shrink-0" />
                <span>Komplek YPI As Sa&apos;adah, Jl. Saharjo No. 128, Tebet, Jakarta Selatan 12870</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-[#0cc0df] shrink-0" />
                <span>(021) 8370-9921 / 0812-9900-SAADAH</span>
              </div>
              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-[#0cc0df] shrink-0" />
                <span>sekretariat@ypi-assaadah.sch.id</span>
              </div>
            </div>
          </div>
        </div>

        <div className="mt-12 pt-6 border-t border-slate-800/80 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-3">
          <p>© {new Date().getFullYear()} Yayasan Pendidikan Islam (YPI) As Sa&apos;adah. Hak cipta dilindungi undang-undang.</p>
          <div className="text-xs text-slate-400 font-medium">
            Engineered by <span className="text-white font-semibold">SVA Dev.</span>
          </div>
        </div>
      </div>
    </footer>
  );
}
