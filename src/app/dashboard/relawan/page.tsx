"use client";

import React from "react";
// import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organism/Sidebar";
import Image from "next/image";
import { useAuthStore } from "@/app/store/authStore";
import MissionSection from "@/components/organism/MissionSection";
import dynamic from 'next/dynamic';

const MapWrapper = dynamic(
  () => import('@/components/molecules/MapWrapper'),
  {
    ssr: false,
    loading: () => (
      <div className="w-full h-72 bg-gray-100 rounded-2xl flex items-center justify-center">
        <div className="w-8 h-8 border-4 border-primary-normal border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function RelawanDashboard() {
  const { user } = useAuthStore();
  const [isSidebarOpen, setIsSidebarOpen] = React.useState(false);

  return (
    <div className="flex min-h-screen bg-primary-light">
      <Sidebar isOpen={isSidebarOpen} onClose={() => setIsSidebarOpen(false)} />
      
      <main className="flex-1 lg:ml-64 flex flex-col min-w-0">
        {/* Mobile Top Bar */}
        <div className="lg:hidden bg-white px-6 py-4 flex items-center justify-between shadow-sm sticky top-0 z-30">
          <div className="flex items-center gap-2">
             <Image src="/icons/logo_voletra.png" alt="Logo" width={24} height={24} />
             <span className="font-bold text-blue-600 text-sm tracking-wider uppercase font-mono">VOLETRA</span>
          </div>
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
          </button>
        </div>

        <div className="p-4 sm:p-8 md:p-12 lg:p-16">
          <div className="rounded-2xl mb-10 overflow-hidden border border-gray-200 shadow-sm bg-white">
            <MapWrapper height="450px" />
          </div>

          <MissionSection />
        </div>
      </main>
    </div>
  );
}
