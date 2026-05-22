"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import Sidebar from "@/components/organism/Sidebar";
import { MisiService } from "@/services/MisiService";
import { Misi } from "@/types/misi";
import dynamic from "next/dynamic";
import Image from "next/image";

// Import Leaflet map dynamically to avoid SSR issues
const MissionMap = dynamic(
  () => import("@/components/molecules/SingleMissionMap"),
  { 
    ssr: false,
    loading: () => (
      <div className="w-full h-[450px] bg-gray-100 animate-pulse rounded-[10px] flex items-center justify-center">
        <span className="text-gray-400">Memuat peta...</span>
      </div>
    )
  }
);

export default function MissionLocationPage() {
  const params = useParams();
  const router = useRouter();
  const id = params?.id as string;
  
  const [misi, setMisi] = useState<Misi | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;
    
    const fetchMisi = async () => {
      try {
        setLoading(true);
        const data = await MisiService.getById(id);
        setMisi(data);
      } catch (err) {
        console.error("Failed to fetch mission location details:", err);
        setError("Gagal memuat detail lokasi misi.");
      } finally {
        setLoading(false);
      }
    };
    
    fetchMisi();
  }, [id]);

  if (loading) {
    return (
      <div className="flex min-h-screen bg-[#EAF0FA]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8 flex items-center justify-center">
          <div className="w-12 h-12 border-4 border-[#2869CA] border-t-transparent rounded-full animate-spin" />
        </main>
      </div>
    );
  }

  if (error || !misi) {
    return (
      <div className="flex min-h-screen bg-[#EAF0FA]">
        <Sidebar />
        <main className="flex-1 ml-64 p-8">
          <div className="bg-white rounded-[10px] p-8 text-center shadow-sm">
            <p className="text-red-500 font-medium">{error || "Misi tidak ditemukan."}</p>
            <button 
              onClick={() => router.back()}
              className="mt-4 text-[#2869CA] hover:underline"
            >
              Kembali
            </button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-700 mb-6 transition-colors"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7" />
          </svg>
          Kembali ke detail misi
        </button>

        <div className="bg-white rounded-[10px] p-6 shadow-sm border border-[rgba(0,0,0,0.12)]">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-[66px] h-[66px] relative rounded-[6px] overflow-hidden shrink-0 border border-[rgba(0,0,0,0.05)]">
              {misi.foto && misi.foto.length > 0 ? (
                <Image 
                  src={misi.foto[0].startsWith('http') ? misi.foto[0] : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${misi.foto[0]}`} 
                  alt={misi.judul} 
                  fill
                  className="object-cover"
                />
              ) : (
                <div className="w-full h-full bg-gray-200" />
              )}
            </div>
            <div>
              <h1 className="text-[24px] font-semibold text-black font-['Poppins:SemiBold',sans-serif]">{misi.judul}</h1>
              <p className="text-gray-500 text-sm font-['Poppins:Regular',sans-serif]">{misi.alamat}</p>
            </div>
          </div>

          <div className="mb-6">
            <h2 className="text-[18px] font-medium text-black mb-4 font-['Poppins:Medium',sans-serif]">Mission Location</h2>
            <div className="rounded-[10px] overflow-hidden border border-[rgba(0,0,0,0.12)]">
              <MissionMap misi={misi} />
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="bg-[#F8FAFD] p-4 rounded-[10px] border border-[rgba(0,0,0,0.05)]">
              <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-['Poppins:Medium',sans-serif]">Coordinates</h3>
              <p className="text-black font-medium font-['Poppins:Medium',sans-serif]">
                {misi.latitude && misi.longitude 
                  ? `${misi.latitude}, ${misi.longitude}` 
                  : "Koordinat tidak tersedia"}
              </p>
            </div>
            <div className="bg-[#F8FAFD] p-4 rounded-[10px] border border-[rgba(0,0,0,0.05)]">
              <h3 className="text-gray-500 text-xs uppercase tracking-wider mb-2 font-['Poppins:Medium',sans-serif]">Google Maps</h3>
              <a 
                href={`https://www.google.com/maps/search/?api=1&query=${misi.latitude},${misi.longitude}`}
                target="_blank"
                rel="noreferrer"
                className="text-[#2869CA] font-medium font-['Poppins:Medium',sans-serif] hover:underline"
              >
                Open in Google Maps
              </a>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
