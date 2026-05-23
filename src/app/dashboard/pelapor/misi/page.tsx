'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import Button from '@/components/atoms/Button';
import Sidebar from '@/components/organism/Sidebar';
import StatusBadge from '@/components/atoms/StatusBadge';
import { MisiService } from '@/services/MisiService';
import { Misi } from '@/types/misi';

const TABS = ['All', 'Offline', 'Online', 'Open', 'Ongoing', 'Completed'];

export default function PelaporMisiPage() {
  const [missions, setMissions] = useState<Misi[]>([]);
  const [allMissions, setAllMissions] = useState<Misi[]>([]);
  const [activeTab, setActiveTab] = useState('All');
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const fetchFilteredMissions = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      const data = await MisiService.getByPelapor('All');
      const tabLower = activeTab.toLowerCase();
      
      if (tabLower === 'all') {
        setMissions(data);
      } else {
        const filtered = data.filter(m => {
          const mMode = (m.mode || (m as any).event_mode || (m as any).eventMode || '').toLowerCase();
          const mStatus = (m.status || '').toLowerCase();

          if (tabLower === 'offline' || tabLower === 'online') {
            return mMode === tabLower;
          }

          const statusMap: Record<string, string[]> = {
            'open': ['open', 'menunggu_relawan'],
            'ongoing': ['ongoing', 'sedang_berjalan', 'relawan_terkumpul', 'in progress', 'full'],
            'completed': ['completed', 'selesai']
          };
          const targets = statusMap[tabLower] || [tabLower];
          return targets.includes(mStatus);
        });
        setMissions(filtered);
      }
    } catch (err: unknown) {
      setError('Gagal memuat data misi. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, [activeTab]);

  const fetchAllMissions = useCallback(async () => {
    try {
      const data = await MisiService.getByPelapor('All');
      setAllMissions(data);
    } catch (err) {
      console.error('Failed to fetch global stats:', err);
    }
  }, []);

  useEffect(() => {
    fetchAllMissions();
  }, [fetchAllMissions]);

  useEffect(() => {
    fetchFilteredMissions();
  }, [fetchFilteredMissions]);

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
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8 sm:mb-10">
            <h1 className="text-xl sm:text-[28px] font-bold text-[#122F5B]">Mission</h1>
            <Link href="/dashboard/pelapor/buat-laporan" className="w-full sm:w-auto">
              <button className="w-full sm:w-auto bg-[#2869CA] text-white px-6 py-2.5 rounded-[10px] flex items-center justify-center gap-2 hover:bg-blue-700 transition-all font-medium text-sm shadow-md">
                <span className="text-xl">+</span> Create
              </button>
            </Link>
          </div>

          <div className="flex flex-nowrap overflow-x-auto pb-4 mb-6 sm:mb-8 gap-3 no-scrollbar scroll-smooth">
            {TABS.map((tab) => {
              const count = allMissions.filter(m => {
                const mMode = (m.mode || (m as any).event_mode || (m as any).eventMode || '').toLowerCase();
                const mStatus = (m.status || '').toLowerCase();
                const tabLower = tab.toLowerCase();

                if (tab === 'All') return true;
                if (tabLower === 'offline' || tabLower === 'online') {
                  return mMode === tabLower;
                }
                // Map display status to backend status if necessary
                const statusMap: Record<string, string[]> = {
                  'open': ['open', 'menunggu_relawan'],
                  'ongoing': ['ongoing', 'sedang_berjalan', 'relawan_terkumpul', 'in progress', 'full'],
                  'completed': ['completed', 'selesai']
                };
                const targets = statusMap[tabLower] || [tabLower];
                return targets.includes(mStatus);
              }).length;

              return (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={`whitespace-nowrap px-5 py-2 rounded-full text-xs font-medium transition-all border shrink-0 ${
                    activeTab === tab
                      ? 'bg-[#2869CA] text-white border-[#2869CA] shadow-md'
                      : 'bg-white text-gray-500 border-gray-200 hover:border-gray-300'
                  }`}
                >
                  {tab}({count})
                </button>
              );
            })}
          </div>

          {isLoading ? (
            <div className="space-y-4">
              {[1, 2, 3].map((i) => (
                <div key={i} className="h-32 bg-white rounded-[15px] animate-pulse shadow-sm" />
              ))}
            </div>
          ) : error ? (
            <div className="bg-red-50 text-red-600 p-8 rounded-[15px] text-center border border-red-100 shadow-sm">
              <p className="mb-4 font-medium">{error}</p>
              <Button variant="secondary" onClick={fetchFilteredMissions}>Coba Lagi</Button>
            </div>
          ) : (
            <div className="space-y-4">
              {missions.length > 0 ? (
                missions.map((misi) => {
                  const photos = misi.foto || (misi as any).photos || [];
                  const thumbnail = photos.length > 0 
                    ? (photos[0].startsWith('http') ? photos[0] : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${photos[0]}`)
                    : 'https://via.placeholder.com/200x150?text=No+Image';
                  
                  const displayJudul = misi.judul || (misi as any).title || 'No Title';
                  const displayAlamat = misi.alamat || (misi as any).location || 'No Location';
                  const displayMode = misi.mode || (misi as any).event_mode || (misi as any).eventMode || 'Offline';

                  return (
                    <div key={misi.id} className="bg-white rounded-[15px] p-4 sm:p-5 shadow-sm border border-transparent hover:border-blue-100 transition-all flex flex-col sm:flex-row gap-4 sm:gap-6 items-start sm:items-center">
                      <div className="w-full sm:w-36 h-40 sm:h-24 relative rounded-[10px] overflow-hidden shrink-0 shadow-inner">
                        <Image 
                          src={thumbnail} 
                          alt={displayJudul} 
                          fill
                          className="object-cover"
                        />
                      </div>
                      
                      <div className="flex-1 min-w-0 w-full">
                        <h3 className="text-base sm:text-lg font-bold text-black mb-1 truncate">{displayJudul}</h3>
                        <p className="text-xs sm:text-sm font-light text-gray-500 mb-4 truncate">{displayAlamat}</p>
                        
                        <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                          <div className="px-4 py-1 rounded-lg border border-blue-100 bg-blue-50 text-[#2869CA] text-[11px] font-semibold uppercase tracking-wide">
                            {displayMode}
                          </div>
                          <StatusBadge status={misi.status} />
                        </div>
                      </div>

                      <div className="w-full sm:w-auto shrink-0 mt-2 sm:mt-0 pt-4 sm:pt-0 border-t sm:border-0 border-gray-50">
                        <Link href={`/dashboard/pelapor/misi/${misi.id}`} className="block">
                          <button className="w-full sm:w-auto border border-[#2869CA] text-[#2869CA] px-6 py-2 rounded-xl text-[12px] font-bold hover:bg-blue-50 transition-all transform active:scale-95">
                            View Details
                          </button>
                        </Link>
                      </div>
                    </div>
                  );
                })
              ) : (
                <div className="bg-white p-8 sm:p-16 rounded-[15px] text-center shadow-sm flex flex-col items-center">
                  <div className="w-16 h-16 sm:w-20 sm:h-20 bg-gray-50 rounded-full flex items-center justify-center mb-4">
                     <svg className="w-8 h-8 sm:w-10 sm:h-10 text-gray-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
                     </svg>
                  </div>
                  <p className="text-gray-400 font-medium">No missions found in this category</p>
                  {activeTab === 'All' && (
                    <Link href="/dashboard/pelapor/buat-laporan" className="mt-6">
                      <Button variant="secondary">Create Your First Mission</Button>
                    </Link>
                  )}
                </div>
              )}
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
