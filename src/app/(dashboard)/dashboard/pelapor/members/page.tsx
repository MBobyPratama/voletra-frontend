'use client';

import React, { useEffect, useState, useCallback } from 'react';
import Image from 'next/image';
import Sidebar from '@/components/organism/Sidebar';
import ApplicantTable from '@/components/organism/ApplicantTable';
import { MisiService } from '@/services/MisiService';
import { Misi, Applicant } from '@/types/misi';
import { FiSearch } from 'react-icons/fi';

interface MissionWithApplicants extends Misi {
  applicants: Applicant[];
}

export default function MembersPage() {
  const [missions, setMissions] = useState<MissionWithApplicants[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [isProcessing, setIsProcessing] = useState(false);

  const fetchMembersData = useCallback(async () => {
    setIsLoading(true);
    setError(null);
    try {
      // 1. Fetch all missions for this pelapor
      const allMissions = await MisiService.getByPelapor('All');
      
      // 2. Fetch applicants for each mission concurrently
      const missionsWithApps = await Promise.all(
        allMissions.map(async (misi) => {
          try {
            const applicants = await MisiService.getApplicants(misi.id);
            return { ...misi, applicants };
          } catch (err) {
            console.error(`Failed to fetch applicants for mission ${misi.id}:`, err);
            return { ...misi, applicants: [] };
          }
        })
      );

      // Only show missions that actually have applicants? 
      // The design seems to show them all, or at least ones with applicants.
      // Let's show all for now, or filter by those with > 0 applicants.
      // We will show all missions but maybe the user wants to see even empty ones to know no one applied.
      setMissions(missionsWithApps);
    } catch (err: unknown) {
      setError('Gagal memuat data member. Silakan coba lagi.');
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchMembersData();
  }, [fetchMembersData]);

  const handleApprove = async (missionId: string, applyId: string) => {
    try {
      setIsProcessing(true);
      await MisiService.approveApplicant(applyId);
      // Update local state
      setMissions((prev) =>
        prev.map((m) =>
          m.id === missionId
            ? {
                ...m,
                applicants: m.applicants.map((app) =>
                  app.apply_id === applyId ? { ...app, status: 'approved' } : app
                ),
              }
            : m
        )
      );
    } catch (error: any) {
      console.error('Failed to approve applicant:', error);
      alert(error.response?.data?.message || 'Gagal menyetujui relawan.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async (missionId: string, applyId: string) => {
    try {
      setIsProcessing(true);
      await MisiService.rejectApplicant(applyId);
      // Update local state
      setMissions((prev) =>
        prev.map((m) =>
          m.id === missionId
            ? {
                ...m,
                applicants: m.applicants.map((app) =>
                  app.apply_id === applyId ? { ...app, status: 'rejected' } : app
                ),
              }
            : m
        )
      );
    } catch (error: any) {
      console.error('Failed to reject applicant:', error);
      alert(error.response?.data?.message || 'Gagal menolak relawan.');
    } finally {
      setIsProcessing(false);
    }
  };

  const filteredMissions = missions.filter(m => 
    m.judul?.toLowerCase().includes(searchQuery.toLowerCase()) || 
    m.applicants.some(app => 
      (app.full_name || app.nama || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      (app.domicile || app.domisili || '').toLowerCase().includes(searchQuery.toLowerCase())
    )
  );

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar />
      <main className="flex-1 ml-64 p-8">
        <div className="mb-8">
          <h1 className="text-[24px] font-medium text-black mb-6 font-['Poppins:Medium',sans-serif]">Manage Members</h1>
          
          {/* Search Bar */}
          <div className="relative max-w-[1091px]">
            <input
              type="text"
              placeholder="Search"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-[43px] bg-white border border-[rgba(0,0,0,0.32)] rounded-[8px] pl-10 pr-4 text-[16px] text-black placeholder:text-[rgba(0,0,0,0.63)] outline-none focus:border-[#2869CA] transition-colors font-['Poppins:Medium',sans-serif]"
            />
            <FiSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-[rgba(0,0,0,0.63)] text-lg" />
          </div>
        </div>

        {isLoading ? (
          <div className="space-y-6">
            {[1, 2].map((i) => (
              <div key={i} className="h-[300px] bg-white rounded-xl animate-pulse shadow-sm border border-[rgba(0,0,0,0.12)]" />
            ))}
          </div>
        ) : error ? (
          <div className="bg-red-50 text-red-600 p-8 rounded-[15px] text-center border border-red-100 shadow-sm">
            <p className="mb-4 font-medium">{error}</p>
            <button 
              onClick={fetchMembersData}
              className="text-[#2869CA] font-medium hover:underline"
            >
              Coba Lagi
            </button>
          </div>
        ) : filteredMissions.length === 0 ? (
          <div className="text-center p-12 bg-white rounded-[10px] shadow-sm border border-[rgba(0,0,0,0.12)] max-w-[1091px]">
            <p className="text-gray-500">Tidak ada data member yang ditemukan.</p>
          </div>
        ) : (
          <div className="space-y-8 max-w-[1091px]">
            {filteredMissions.map((misi) => {
              const photos = misi.foto || [];
              const thumbnail = photos.length > 0 
                ? (photos[0].startsWith('http') ? photos[0] : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${photos[0]}`)
                : 'https://via.placeholder.com/66x66?text=Misi';
              
              const displayJudul = misi.judul || 'No Title';

              return (
                <div key={misi.id} className="bg-white rounded-[10px] shadow-sm overflow-hidden border border-[rgba(0,0,0,0.12)]">
                  {/* Mission Header */}
                  <div className="px-6 py-4 flex items-center gap-4">
                    <div className="w-[66px] h-[66px] relative rounded-[6px] overflow-hidden shrink-0 border border-[rgba(0,0,0,0.05)]">
                      <Image 
                        src={thumbnail} 
                        alt={displayJudul} 
                        fill
                        className="object-cover"
                      />
                    </div>
                    <h2 className="text-[20px] font-semibold text-black font-['Poppins:SemiBold',sans-serif]">{displayJudul}</h2>
                  </div>

                  {/* Applicants Table */}
                  <div className="px-[17px] pb-[17px]">
                    <ApplicantTable 
                      applicants={misi.applicants}
                      onApprove={(applyId) => handleApprove(misi.id, applyId)}
                      onDecline={(applyId) => handleDecline(misi.id, applyId)}
                      isProcessing={isProcessing}
                      hideTitle={true}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
