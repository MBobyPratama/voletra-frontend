"use client";

import React from "react";
// import Button from "@/components/atoms/Button";
import Sidebar from "@/components/organism/Sidebar";
// import MissionCard from "@/components/molecules/MissionCard";
// import MissionSkeleton from "@/components/molecules/MissionSkeleton";
// import MissionDetailCard from "@/components/organism/MissionDetailCard"; Kalo BE udah siap
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

  return (
    <div className="ml-64 flex flex-col min-h-screen bg-primary-light">
      <main className="m-25">
        {/* Mengeset sidebar aktif ke menu home */}
        <Sidebar />
        <div className="bg-gray-100 rounded-2xl mb-10 overflow-hidden border border-gray-200">
          <MapWrapper />
        </div>

        <MissionSection />
      </main>
    </div>
  );
}
