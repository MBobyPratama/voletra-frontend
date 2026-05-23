'use client';

import React, { useState } from 'react';
import Image from 'next/image';
import EdukasiPage from "@/app/(public)/edukasi/page";
import Sidebar from "@/components/organism/Sidebar";

export default function PelaporAbout() {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <Image src="/icons/logo_voletra.png" alt="Logo" width={24} height={24} />
             <span className="font-bold text-blue-600 text-sm tracking-wider uppercase">VOLETRA</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <EdukasiPage />
        </div>
      </main>
    </div>
  );
}