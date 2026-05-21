"use client";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { AuthService } from "@/services/AuthService";
import { useAuthStore } from "@/app/store/authStore";
import { getErrorMessage } from "@/lib/error"; // ← pakai helper yang sudah ada

export default function PilihRolePage() {
  const router = useRouter();
  const { setAuth, token, role, user } = useAuthStore();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!token) {
      router.push("/login");
    } else if (role === "volunteer") {
      router.push("/dashboard/relawan");
    } else if (role === "lembaga") {
      router.push("/dashboard/pelapor");
    }
  }, [token, role, router]);

  const handlePilih = async (selectedRole: "volunteer" | "lembaga") => {
    if (!token || !user) {
      setError("Sesi tidak valid, silakan login ulang.");
      router.push("/login");
      return;
    }

    setIsLoading(true);
    setError("");
    try {
      // ↓ updateRole dipanggil di sini — pastikan endpoint BE sudah sesuai
      const response = await AuthService.updateRole(selectedRole);
      if (response.success) {
        setAuth(token, selectedRole, user);
        router.push(
          selectedRole === "volunteer"
            ? "/dashboard/relawan"
            : "/dashboard/pelapor"
        );
      }
    } catch (err: unknown) {
      setError(getErrorMessage(err, "Gagal memilih role. Silakan coba lagi.")); // ← pakai helper
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <main className="min-h-screen flex items-center justify-center bg-primary-light px-4">
      <div className="bg-white rounded-3xl shadow-xl p-10 w-full max-w-lg">
        <div className="text-center mb-10">
          <h2 className="text-2xl font-bold text-black mb-2">
            Welcome to Voletra
          </h2>
          <p className="text-gray-500 text-sm">
            Pilih role kamu untuk melanjutkan
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-3 rounded-xl mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <div className="flex p-5 gap-10">
          <button
            onClick={() => handlePilih("volunteer")}
            disabled={isLoading}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/icons/volunteer.png"
              alt="Volunteer"
              width={200}
              height={200}
              className="rounded-2xl object-cover"
            />
          </button>

          <button
            onClick={() => handlePilih("lembaga")}
            disabled={isLoading}
            className="group relative overflow-hidden rounded-2xl cursor-pointer transition duration-300 hover:scale-105 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <Image
              src="/icons/organization.png"
              alt="Organization"
              width={200}
              height={200}
              className="rounded-2xl object-cover"
            />
          </button>
        </div>

        {isLoading && (
          <p className="text-center text-sm text-gray-400 mt-6 flex items-center justify-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-primary-normal"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Menyimpan pilihan...
          </p>
        )}
      </div>
    </main>
  );
}
