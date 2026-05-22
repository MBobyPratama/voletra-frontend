'use client';

import Image from 'next/image';
import { useRouter } from 'next/navigation';
import Sidebar from '@/components/organism/Sidebar';
import ProgresRegis from '@/components/atoms/ProgresRegis';

interface RegistrationSuccessProps {
  misiJudul?: string;
}

export default function RegistrationSuccess({ misiJudul }: RegistrationSuccessProps) {
  const router = useRouter();

  const handleDone = () => {
    router.push('/dashboard/relawan/mission');
  };

  return (
    <div className="flex min-h-screen bg-[#EAF0FA]">
      <Sidebar />

      <main className="flex-1 p-8">
        {/* Progress bar */}
        <ProgresRegis currentStep={2} />

        {/* Card sukses */}
        <div className="bg-white rounded-2xl border-2 border-primary-normal shadow-sm relative p-12 flex flex-col items-center justify-center min-h-[500px]">
          {/* Tombol close */}
          <button
            onClick={handleDone}
            className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 text-xl font-bold transition-colors"
          >
            ×
          </button>

          {/* Ilustrasi */}
          <div className="mb-8">
            <Image
              src="/images/registration-success.png"
              alt="Registration Success"
              width={220}
              height={220}
              style={{ width: 'auto' }}
              onError={(e) => {
                // Fallback jika gambar belum ada
                (e.target as HTMLImageElement).style.display = 'none';
              }}
            />
          </div>

          {/* Teks */}
          <h2 className="text-2xl font-bold text-primary-normal mb-3 text-center">
            Registration Submitted !
          </h2>
          <p className="text-gray-500 text-sm text-center max-w-xs">
            Please wait while we review your application
            {misiJudul && (
              <span className="block mt-1 font-semibold text-gray-700">
                &quot;{misiJudul}&quot;
              </span>
            )}
          </p>

          {/* Tombol Done */}
          <div className="absolute bottom-6 right-6">
            <button
              onClick={handleDone}
              className="bg-primary-normal hover:bg-primary-normalHover text-white font-semibold px-10 py-3 rounded-xl transition-colors"
            >
              Done
            </button>
          </div>
        </div>
      </main>
    </div>
  );
}
