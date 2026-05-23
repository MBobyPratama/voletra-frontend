'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MisiService } from '@/services/MisiService';
import { Applicant, Misi } from '@/types/misi';
import MissionDetailCard from '@/components/organism/MissionDetailCard';
import ApplicantTable from '@/components/organism/ApplicantTable';
import MaterialTable from '@/components/organism/MaterialTable';
import Sidebar from '@/components/organism/Sidebar';
import Image from 'next/image';
import { FiArrowLeft } from 'react-icons/fi';

export default function MissionDetailPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [misi, setMisi] = useState<Misi | null>(null);
  const [applicants, setApplicants] = useState<Applicant[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);
  const [isProcessing, setIsProcessing] = useState<boolean>(false);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const [misiData, applicantsData] = await Promise.all([
          MisiService.getById(id),
          MisiService.getApplicants(id),
        ]);
        setMisi(misiData);
        setApplicants(applicantsData);
      } catch (error) {
        console.error('Failed to fetch data:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  const handleApprove = async (applyId: string) => {
    try {
      setIsProcessing(true);
      await MisiService.approveApplicant(applyId);
      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app.apply_id === applyId ? { ...app, status: 'approved' } : app
        )
      );
    } catch (error) {
      console.error('Failed to approve applicant:', error);
      alert('Gagal menyetujui relawan.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDecline = async (applyId: string) => {
    try {
      setIsProcessing(true);
      await MisiService.rejectApplicant(applyId);
      // Update local state
      setApplicants((prev) =>
        prev.map((app) =>
          app.apply_id === applyId ? { ...app, status: 'rejected' } : app
        )
      );
    } catch (error) {
      console.error('Failed to reject applicant:', error);
      alert('Gagal menolak relawan.');
    } finally {
      setIsProcessing(false);
    }
  };

  const handleDeleteMisi = async () => {
    try {
      setIsProcessing(true);
      await MisiService.delete(id);
      router.push('/dashboard/pelapor/misi');
    } catch (error) {
      console.error('Failed to delete mission:', error);
      alert('Gagal menghapus misi.');
    } finally {
      setIsProcessing(false);
    }
  };

  if (isLoading) {
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
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
            </button>
          </div>
          <div className="p-4 sm:p-8 animate-pulse flex flex-col gap-6">
            <div className="h-[400px] bg-gray-200 rounded-[10px]"></div>
            <div className="h-[300px] bg-gray-200 rounded-[10px]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !misi) {
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
            <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
               <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
               </svg>
            </button>
          </div>
          <div className="p-4 sm:p-8 flex flex-col items-center justify-center min-h-[60vh]">
            <p className="text-red-500 font-medium text-lg mb-4">Gagal memuat data misi.</p>
            <button onClick={() => router.back()} className="text-blue-600 hover:underline">
              Kembali ke Dashboard
            </button>
          </div>
        </main>
      </div>
    );
  }

  const isOnline = misi.mode === 'Online';

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
          <button onClick={() => setIsSidebarOpen(true)} className="p-2 -mr-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
             </svg>
          </button>
        </div>

        <div className="p-4 sm:p-8">
          <div className="flex flex-col gap-[24px]">
            {/* Mission Detail Card */}
            <MissionDetailCard 
              misi={misi} 
              onEdit={() => router.push(`/dashboard/pelapor/misi/${misi.id}/edit`)} 
              onDelete={handleDeleteMisi}
            />

            {/* Online: Material Table | Offline: Applicant Table */}
            {isOnline ? (
              <MaterialTable 
                applicants={applicants}
                onApprove={handleApprove}
                onDecline={handleDecline}
                isProcessing={isProcessing}
              />
            ) : (
              <ApplicantTable 
                applicants={applicants}
                onApprove={handleApprove}
                onDecline={handleDecline}
                isProcessing={isProcessing}
              />
            )}
          </div>
        </div>
      </main>
    </div>
  );
}
