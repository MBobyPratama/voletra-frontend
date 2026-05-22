"use client";
import { useRouter } from "next/navigation";
import { useState, useEffect } from "react";
import Image from "next/image";
import { AuthService } from "@/services/AuthService";
import { useAuthStore } from "@/app/store/authStore";
import { getErrorMessage, getFieldErrors } from "@/lib/error";

export default function PilihRolePage() {
  const router = useRouter();
  const { setAuth, tempSignupData, setTempSignupData } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    // Jika tidak ada data pendaftaran sementara, balikkan ke home
    if (!tempSignupData) {
      router.push("/");
    }
  }, [tempSignupData, router]);

  const handlePilih = async (role: "lembaga" | "volunteer") => {
    if (!tempSignupData) return;

    setIsLoading(true);
    setError("");
    try {
      let response;
      if (role === "volunteer") {
        response = await AuthService.registerVolunteer(tempSignupData);
      } else {
        response = await AuthService.registerLembaga(tempSignupData);
      }

      if (response.success) {
        // Simpan auth ke store dan cookie agar langsung login
        const tokenToStore = response.data.token || 'session';
        const userToStore = response.data.user || {
          id: response.data.user_id || 'unknown',
          email: response.data.email || tempSignupData.email,
          name: response.data.name || tempSignupData.name,
        };

        setAuth(tokenToStore, response.data.role, userToStore);

        // Hapus data pendaftaran sementara
        setTempSignupData(null);
        
        // Langsung arahkan ke dashboard sesuai role (Gunakan window.location untuk memastikan cookie terbaca middleware)
        window.location.href = role === "volunteer" ? "/dashboard/relawan" : "/dashboard/pelapor";
      }
    } catch (err: unknown) {
      const fieldErrors = getFieldErrors(err);
      if (Object.keys(fieldErrors).length > 0) {
        // Flatten and join field errors into a single string
        const allErrors = Object.values(fieldErrors).flat().join(". ");
        setError(allErrors);
      } else {
        setError(getErrorMessage(err, "Gagal melakukan registrasi. Silakan coba lagi."));
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (!tempSignupData) return null;

  return (
    <main className="min-h-screen bg-[#EAF0FA] flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-[566px] rounded-[10px] shadow-[0px_4px_15px_0px_rgba(0,0,0,0.1)] p-10 flex flex-col items-center">
        <h1 className="text-[22px] font-semibold text-black mb-2 text-center">Welcome to Voletra</h1>
        <p className="text-[14px] font-light text-black mb-10 text-center">Select your role to continue</p>

        {error && (
          <div className="bg-red-50 text-red-500 text-[12px] p-3 rounded-lg mb-6 w-full text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="grid grid-cols-1 md:grid-cols-2 gap-10 w-full px-4">
          {/* Volunteer Choice */}
          <button
            disabled={isLoading}
            onClick={() => handlePilih("volunteer")}
            className="group relative h-[250px] flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="relative w-full h-full">
              <Image 
                src="/icons/volunteer.png" 
                alt="Volunteer" 
                fill
                className="object-contain"
              />
            </div>
          </button>

          {/* Organization Choice */}
          <button
            disabled={isLoading}
            onClick={() => handlePilih("lembaga")}
            className="group relative h-[250px] flex items-center justify-center transition-all hover:scale-110 disabled:opacity-50 disabled:hover:scale-100"
          >
            <div className="relative w-full h-full">
              <Image 
                src="/icons/organization.png" 
                alt="Organization" 
                fill
                className="object-contain"
              />
            </div>
          </button>
        </div>

        {isLoading && (
          <div className="mt-10 flex flex-col items-center">
            <div className="w-6 h-6 border-2 border-[#2869CA] border-t-transparent rounded-full animate-spin mb-2"></div>
            <p className="text-sm text-gray-500 font-medium">Creating your account...</p>
          </div>
        )}
      </div>
    </main>
  );
}
