'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Sidebar from '@/components/organism/Sidebar';
import StatsOverview from '@/components/molecules/StatsOverview';
import { MisiService } from '@/services/MisiService';
import { Misi } from '@/types/misi';
import Image from 'next/image';

export default function PelaporDashboard() {
  const [missions, setMissions] = useState<Misi[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchDashboardData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MisiService.getByPelapor('All');
      setMissions(data);
    } catch (err: unknown) {
      setError('Gagal memuat data dashboard. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDashboardData();
  }, [fetchDashboardData]);

  const recentMissions = missions.slice(0, 5); // Figma shows a list, let's take up to 5

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-10">
          <h1 className="text-[24px] font-medium text-black">Overview</h1>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            <div className="flex gap-[40px]">
              {[1, 2, 3, 4, 5].map((i) => (
                <div key={i} className="h-[157px] w-[168px] bg-white rounded-[14px] animate-pulse shadow-sm" />
              ))}
            </div>
            <div className="h-64 bg-white rounded-xl animate-pulse shadow-sm" />
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-[15px] text-center border border-red-100 shadow-sm">
            <p className="mb-4 font-medium">{error}</p>
            <button 
              onClick={fetchDashboardData}
              className="text-[#2869CA] font-medium hover:underline"
            >
              Coba Lagi
            </button>
          </div>
        ) : (
          <div className="space-y-10">
            {/* Stats Overview */}
            <StatsOverview missions={missions} />

            {/* Missions List Section */}
            <div className="bg-white rounded-[10px] overflow-hidden shadow-sm">
              <div className="divide-y divide-gray-100">
                {recentMissions.length > 0 ? (
                  recentMissions.map((misi) => {
                    const photos = misi.foto || (misi as any).photos || [];
                    const thumbnail = photos.length > 0 
                      ? (photos[0].startsWith('http') ? photos[0] : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${photos[0]}`)
                      : 'https://via.placeholder.com/200x150?text=No+Image';
                    
                    const displayJudul = misi.judul || (misi as any).title || 'No Title';
                    const displayAlamat = misi.alamat || (misi as any).location || 'No Location';
                    const displayMode = misi.mode || (misi as any).event_mode || (misi as any).eventMode || 'Offline';

                    return (
                      <div key={misi.id} className="p-6 flex gap-6 items-center hover:bg-gray-50 transition-all">
                        <div className="w-[102px] h-[87px] relative rounded-[4px] overflow-hidden shrink-0">
                          <Image 
                            src={thumbnail} 
                            alt={displayJudul} 
                            fill
                            className="object-cover"
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <p className="text-[12px] font-light text-black mb-1 truncate">{displayAlamat}</p>
                          <h3 className="text-[16px] font-medium text-black mb-3 truncate">{displayJudul}</h3>
                          <div className="inline-block px-4 py-1 rounded-[6px] border border-[#2869CA] text-[#2869CA] text-[12px] font-medium">
                            {displayMode}
                          </div>
                        </div>

                        <div className="shrink-0">
                          <Link href={`/dashboard/pelapor/misi/${misi.id}`}>
                            <button className="border border-[#2869CA] text-[#2869CA] px-4 py-1 rounded-[6px] text-[12px] font-medium hover:bg-blue-50 transition-all">
                              View Details
                            </button>
                          </Link>
                        </div>
                      </div>
                    );
                  })
                ) : (
                  <div className="p-12 text-center">
                    <p className="text-gray-400">You haven't created any missions yet.</p>
                    <Link href="/dashboard/pelapor/buat-laporan" className="mt-4 inline-block text-[#2869CA] font-medium">
                      Create your first mission →
                    </Link>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
