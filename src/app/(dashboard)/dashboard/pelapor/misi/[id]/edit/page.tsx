'use client';

import React, { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { MisiService } from '@/services/MisiService';
import { Misi } from '@/types/misi';
import FormTicketMisi from '@/components/organism/FormTicketMisi';
import Sidebar from '@/components/organism/Sidebar';

export default function EditMisiPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [misi, setMisi] = useState<Misi | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [isError, setIsError] = useState<boolean>(false);

  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setIsError(false);
      try {
        const data = await MisiService.getById(id);
        setMisi(data);
      } catch (error) {
        console.error('Failed to fetch mission for edit:', error);
        setIsError(true);
      } finally {
        setIsLoading(false);
      }
    };

    if (id) {
      fetchData();
    }
  }, [id]);

  if (isLoading) {
    return (
      <div className="flex min-h-screen bg-[#EAF0FA]">
        <Sidebar activeTab="mission" />
        <main className="flex-1 ml-64 p-8">
          <div className="animate-pulse flex flex-col gap-6">
            <div className="h-[600px] bg-white rounded-[10px]"></div>
          </div>
        </main>
      </div>
    );
  }

  if (isError || !misi) {
    return (
      <div className="flex min-h-screen bg-[#EAF0FA]">
        <Sidebar activeTab="mission" />
        <main className="flex-1 ml-64 p-8 flex flex-col items-center justify-center">
          <p className="text-red-500 font-medium text-lg mb-4">Gagal memuat data misi untuk diedit.</p>
          <button onClick={() => router.back()} className="text-blue-600 hover:underline">
            Kembali
          </button>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar activeTab="mission" />
      
      <main className="flex-1 ml-64 p-8 overflow-y-auto">
        <div className="max-w-5xl mx-auto">
          <FormTicketMisi isEdit={true} initialData={misi} />
        </div>
      </main>
    </div>
  );
}
