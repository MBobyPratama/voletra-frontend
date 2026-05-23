"use client";

import Image from "next/image";
import { useState } from "react";
import ProgresRegis from "@/components/atoms/ProgresRegis";
import { MisiService } from "@/services/MisiService";

interface ApprovedRegistrationProps {
  applyId: string;
  misiJudul?: string;
  onDone: () => void; // dipanggil saat klik Done → tampilkan MissionDetailCard versi approved
}

export default function ApprovedRegistration({
  applyId,
  misiJudul,
  onDone,
}: ApprovedRegistrationProps) {
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleEnter = async () => {
    if (!link.trim()) return;
    setIsLoading(true);
    setError(null);
    try {
      await MisiService.submitMaterial(applyId, link);
      setSubmitted(true);
    } catch (err: any) {
      console.error("Failed to submit material:", err);
      setError(err.response?.data?.message || "Gagal mengirim link material.");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <ProgresRegis currentStep={2} />
      <div className="bg-white rounded-2xl border-2 border-primary-normal shadow-sm relative p-8 sm:p-12 flex flex-col items-center justify-center min-h-[500px]">
        
        <div className="flex flex-col items-center w-full max-w-2xl">
          {/* Ilustrasi */}
          <div className="mb-8 relative w-48 h-48 sm:w-64 sm:h-64">
            <Image
              src="/images/registration-success.png"
              alt="Approved"
              fill
              className="object-contain"
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Teks */}
          <h2 className="text-xl sm:text-2xl font-bold text-primary-normal mb-4 text-center leading-tight">
            Congratulations! You are selected to become a volunteer!
          </h2>
          <p className="text-gray-500 text-sm sm:text-base text-center mb-10">
            Please upload materials to proceed with the mission activation
          </p>

          {/* Input link */}
          <div className="flex flex-col sm:flex-row gap-3 w-full">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Insert your link"
              className={`flex-1 px-5 py-3 border rounded-xl text-sm outline-none transition-all ${
                error ? 'border-red-500 bg-red-50' : 'border-gray-200 focus:border-primary-normal'
              }`}
              disabled={isLoading || submitted}
            />
            <button
              onClick={handleEnter}
              disabled={!link.trim() || isLoading || submitted}
              className="px-8 py-3 bg-primary-normal text-white text-sm font-semibold rounded-xl hover:bg-primary-normalHover transition-all shadow-md shadow-blue-100 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center min-w-[120px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Enter"
              )}
            </button>
          </div>

          {error && (
            <p className="text-red-500 text-xs mt-3 font-medium">
              {error}
            </p>
          )}

          {submitted && (
            <div className="flex items-center gap-2 mt-4 bg-green-50 text-green-600 px-4 py-2 rounded-lg border border-green-100">
               <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
               </svg>
               <span className="text-sm font-semibold">Material successfully uploaded!</span>
            </div>
          )}
        </div>

        {/* Tombol Done */}
        <div className="w-full sm:w-auto mt-12 sm:absolute sm:bottom-8 sm:right-12">
          <button
            onClick={onDone}
            className="w-full sm:w-auto bg-primary-normal hover:bg-primary-normalHover text-white font-bold px-12 py-3.5 rounded-xl transition-all shadow-lg shadow-blue-200 transform active:scale-95"
          >
            Done
          </button>
        </div>
      </div>
    </main>
  );
}
