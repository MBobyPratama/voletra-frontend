"use client";
import { useState, useEffect } from "react";
import { useAuthStore } from "@/app/store/authStore";
import { useRouter } from "next/navigation";
import Image from "next/image";
import Link from "next/link";
import { AuthService } from "@/services/AuthService";
import { Suspense } from "react";

function RegisterForm() {
  const { setAuth, token, role: storedRole } = useAuthStore();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [fieldErrors, setFieldErrors] = useState<Record<string, string[]>>({});
  const router = useRouter();

  // Kalau sudah login, langsung redirect
  useEffect(() => {
    if (token && storedRole) {
      router.push(storedRole === "volunteer" ? "/dashboard/relawan" : "/dashboard/pelapor");
    }
  }, [token, storedRole, router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      setFieldErrors({ confirm_password: ["Password tidak cocok"] });
      return;
    }
    setLoading(true);
    setError("");
    setFieldErrors({});
    try {
      const response = await AuthService.register({ name, email, password, confirm_password: confirmPassword });
      if (response.success) {
        setAuth(response.data.token, response.data.role, response.data.user);
        // Role null → belum pilih role → arahkan ke /pilih-role
        router.push(response.data.role ? (response.data.role === "volunteer" ? "/dashboard/relawan" : "/dashboard/pelapor") : "/pilih-role");
      }
    } catch (err: unknown) {
      const e = err as { response?: { data?: { message?: string; errors?: Record<string, string[]> } } };
      if (e.response?.data?.errors) setFieldErrors(e.response.data.errors);
      setError(e.response?.data?.message || "Registrasi gagal. Silakan coba lagi.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen pt-24 pb-12 flex items-center justify-center bg-primary-light px-4">
      <div className="bg-white rounded-3xl shadow-xl w-full max-w-lg p-8 md:p-12">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-black mb-2">Join Voletra</h1>
          <p className="text-gray-500">Create an account to start contributing</p>
        </div>

        {/* Tab toggle */}
        <div className="flex bg-gray-100 rounded-2xl p-1 mb-8">
          <Link
            href="/login"
            className="flex-1 py-3 text-sm font-semibold rounded-xl text-gray-500 hover:text-gray-700 text-center transition-all"
          >
            Login
          </Link>
          <button className="flex-1 py-3 text-sm font-semibold rounded-xl bg-primary-normal text-white shadow-md">
            Sign Up
          </button>
        </div>

        {error && (
          <div className="bg-red-50 text-red-500 text-sm p-4 rounded-xl mb-6 text-center border border-red-100">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          {/* Full Name */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Full Name</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Image src="/icons/user.svg" alt="User" width={20} height={20} className="opacity-40 group-focus-within:opacity-100 transition-opacity" />
              </div>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="John Doe"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-normal focus:border-transparent outline-none transition-all ${fieldErrors.name ? "border-red-500" : "border-gray-200"}`}
              />
            </div>
            {fieldErrors.name && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.name[0]}</p>}
          </div>

          {/* Email */}
          <div className="space-y-2">
            <label className="text-sm font-semibold text-gray-700 ml-1">Email</label>
            <div className="relative group">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Image src="/icons/mail.svg" alt="Mail" width={20} height={20} className="opacity-40 group-focus-within:opacity-100 transition-opacity" />
              </div>
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="example@email.com"
                className={`w-full pl-11 pr-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-normal focus:border-transparent outline-none transition-all ${fieldErrors.email ? "border-red-500" : "border-gray-200"}`}
              />
            </div>
            {fieldErrors.email && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.email[0]}</p>}
          </div>

          {/* Password + Confirm */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Password</label>
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="Min. 8 characters"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-normal focus:border-transparent outline-none transition-all ${fieldErrors.password ? "border-red-500" : "border-gray-200"}`}
              />
              {fieldErrors.password && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.password[0]}</p>}
            </div>
            <div className="space-y-2">
              <label className="text-sm font-semibold text-gray-700 ml-1">Confirm Password</label>
              <input
                type="password"
                required
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
                className={`w-full px-4 py-3 bg-gray-50 border rounded-2xl focus:bg-white focus:ring-2 focus:ring-primary-normal focus:border-transparent outline-none transition-all ${fieldErrors.confirm_password ? "border-red-500" : "border-gray-200"}`}
              />
              {fieldErrors.confirm_password && <p className="text-red-500 text-xs mt-1 ml-1">{fieldErrors.confirm_password[0]}</p>}
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-normal text-white py-4 rounded-2xl font-bold text-lg hover:bg-primary-dark transition-all disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-blue-200 mt-4 transform hover:-translate-y-0.5 active:translate-y-0"
          >
            {loading ? "Creating account..." : "Continue"}
          </button>
        </form>

        <div className="mt-8 flex items-center gap-4">
          <div className="flex-1 h-px bg-gray-200" />
          <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Or Sign Up With</span>
          <div className="flex-1 h-px bg-gray-200" />
        </div>

        <div className="mt-6">
          <button className="w-full flex items-center justify-center gap-4 py-3.5 border border-gray-200 rounded-2xl hover:bg-gray-50 hover:border-gray-300 transition-all font-semibold text-gray-700 group">
            <Image src="/icons/google-icon.svg" alt="Google" width={24} height={24} className="group-hover:scale-110 transition-transform" />
            Continue with Google
          </button>
        </div>

        <p className="mt-8 text-center text-gray-500 text-sm">
          Already have an account?{" "}
          <Link href="/login" className="text-primary-normal font-bold hover:underline">
            Login
          </Link>
        </p>
      </div>
    </main>
  );
}

export default function RegisterPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="w-8 h-8 border-4 border-primary-normal border-t-transparent rounded-full animate-spin" /></div>}>
      <RegisterForm />
    </Suspense>
  );
}
