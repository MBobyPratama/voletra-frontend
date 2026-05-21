'use client';

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Sidebar from '@/components/organism/Sidebar';
import FormRegisterMisi from '@/components/organism/FormRegisterMisi';
import RegistrationSuccess from '@/components/organism/AfterRegistesMisi';

type Step = 'form' | 'success';

export default function RegisterMisiPage() {
  const params = useParams();
  const misiId = params?.id as string ?? '';

  const [step, setStep] = useState<Step>('form');
  const [misiJudul, setMisiJudul] = useState('');

  if (step === 'success') {
    // Halaman sukses menggantikan seluruh konten
    return <RegistrationSuccess misiJudul={misiJudul} />;
  }

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar />

      <main className="flex-1 ml-64 p-8">
        <FormRegisterMisi
          misiId={misiId}
          misiJudul={misiJudul || 'Misi'}
          onCancel={() => window.history.back()}
          onSuccess={() => setStep('success')}
        />
      </main>
    </div>
  );
}
