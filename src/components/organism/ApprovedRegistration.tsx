"use client";

import Image from "next/image";
import { useState } from "react";
import ProgresRegis from "@/components/atoms/ProgresRegis";

interface ApprovedRegistrationProps {
  misiJudul?: string;
  onDone: () => void; // dipanggil saat klik Done → tampilkan MissionDetailCard versi approved
}

export default function ApprovedRegistration({
  misiJudul,
  onDone,
}: ApprovedRegistrationProps) {
  const [link, setLink] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleEnter = async () => {
    if (!link.trim()) return;
    setIsLoading(true);
    try {
      // TODO: [BE] kirim link material ke backend
      // await MisiService.submitMaterial(misiId, link);
      await new Promise((r) => setTimeout(r, 600));
      setSubmitted(true);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main>
      <ProgresRegis currentStep={2} />
      <div className="bg-white rounded-2xl border-2 border-primary-normal shadow-sm relative p-12 flex flex-col items-center justify-center min-h-[500px]">
        {/* Progress bar — step 2 aktif */}
        <div className="absolute top-0 left-0 right-0 px-12 pt-8"></div>

        <div className="flex flex-col items-center">
          {/* Ilustrasi */}
          <div className="p-30">
            <Image
              src="/images/registration-success.png"
              alt="Approved"
              width={200}
              height={200}
              style={{ width: "auto" }}
              onError={(e) => {
                (e.target as HTMLImageElement).style.display = "none";
              }}
            />
          </div>

          {/* Teks */}
          <h2 className="text-xl font-bold text-primary-normal mb-2 text-center">
            Congratulations! You are selected to become a volunteer!
          </h2>
          <p className="text-gray-500 text-sm text-center mb-8">
            Please upload materials to proceed with the mission activation
          </p>

          {/* Input link */}
          <div className="flex gap-3 w-full max-w-lg">
            <input
              type="url"
              value={link}
              onChange={(e) => setLink(e.target.value)}
              placeholder="Insert your link"
              className="flex-1 px-4 py-2.5 border border-gray-200 rounded-xl text-sm outline-none focus:border-primary-normal transition-colors"
              disabled={isLoading || submitted}
            />
            <button
              onClick={handleEnter}
              disabled={!link.trim() || isLoading || submitted}
              className="px-6 py-2.5 bg-primary-normal text-white text-sm font-semibold rounded-xl hover:bg-primary-normalHover transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? "..." : "Enter"}
            </button>
          </div>

          {submitted && (
            <p className="text-green-500 text-sm mt-3">
              Link berhasil dikirim ✓
            </p>
          )}
        </div>

        {/* Tombol Done */}
        <div className="absolute bottom-6 right-6">
          <button
            onClick={onDone}
            className="bg-primary-normal hover:bg-primary-normalHover text-white font-semibold px-10 py-3 rounded-xl transition-colors"
          >
            Done
          </button>
        </div>
      </div>
    </main>
  );
}
