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
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

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

        <div className="p-4 sm:p-8">
          <div className="mb-6 sm:mb-10">
            <h1 className="text-xl sm:text-[24px] font-medium text-black">Overview</h1>
          </div>

          {isLoading ? (
            <div className="space-y-6">
              <div className="grid grid-cols-2 md:flex md:flex-wrap gap-4 sm:gap-6 lg:gap-[40px]">
                {[1, 2, 3, 4, 5].map((i) => (
                  <div key={i} className="h-[157px] flex-1 min-w-[140px] max-w-[200px] bg-white rounded-[14px] animate-pulse shadow-sm" />
                ))}
              </div>
              <div className="h-64 bg-white rounded-xl animate-pulse shadow-sm w-full" />
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
              <div className="bg-white rounded-[10px] overflow-hidden shadow-sm border border-gray-100">
                <div className="p-4 sm:p-6 border-b border-gray-100 bg-gray-50/50 flex justify-between items-center">
                   <h2 className="font-semibold text-gray-800">Recent Missions</h2>
                   <Link href="/dashboard/pelapor/misi" className="text-sm text-blue-600 hover:underline">View All</Link>
                </div>
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
                        <div key={misi.id} className="p-4 sm:p-6 flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center hover:bg-gray-50 transition-all">
                          <div className="w-full sm:w-[102px] h-[120px] sm:h-[87px] relative rounded-lg overflow-hidden shrink-0 shadow-inner">
                            <Image 
                              src={thumbnail} 
                              alt={displayJudul} 
                              fill
                              className="object-cover"
                            />
                          </div>
                          
                          <div className="flex-1 min-w-0 w-full">
                            <p className="text-[12px] font-light text-gray-500 mb-1 truncate">{displayAlamat}</p>
                            <h3 className="text-sm sm:text-[16px] font-medium text-black mb-3 line-clamp-1">{displayJudul}</h3>
                            <div className="flex items-center justify-between sm:justify-start gap-4">
                               <div className="inline-block px-3 py-1 rounded-full border border-blue-100 bg-blue-50 text-blue-600 text-[11px] font-semibold uppercase tracking-wider">
                                  {displayMode}
                               </div>
                               <div className="sm:hidden">
                                  <Link href={`/dashboard/pelapor/misi/${misi.id}`}>
                                     <button className="text-blue-600 text-sm font-semibold">Details →</button>
                                  </Link>
                               </div>
                            </div>
                          </div>

                          <div className="hidden sm:block shrink-0">
                            <Link href={`/dashboard/pelapor/misi/${misi.id}`}>
                              <button className="border border-blue-600 text-blue-600 px-6 py-2 rounded-xl text-[12px] font-bold hover:bg-blue-600 hover:text-white transition-all transform active:scale-95 shadow-sm">
                                View Details
                              </button>
                            </Link>
                          </div>
                        </div>
                      );
                    })
                  ) : (
                    <div className="p-12 text-center">
                      <p className="text-gray-400">You haven&apos;t created any missions yet.</p>
                      <Link href="/dashboard/pelapor/buat-laporan" className="mt-4 inline-block text-[#2869CA] font-medium">
                        Create your first mission →
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
