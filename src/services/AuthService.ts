import axiosInstance from "@/lib/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const AuthService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    // MOCK — hapus blok ini kalau backend sudah siap
    if (data.email === "relawan@test.com") {
      return { success: true, message: "ok", data: { token: "mock-token", role: "volunteer", user: { id: "1", email: data.email, name: "Relawan Test" } } };
    }
    if (data.email === "lembaga@test.com") {
      return { success: true, message: "ok", data: { token: "mock-token", role: "lembaga", user: { id: "2", email: data.email, name: "Lembaga Test" } } };
    }
    // ↓ AKTIFKAN INI saat backend siap — sesuaikan endpoint dengan BE
    const response = await axiosInstance.post("/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    // MOCK — hapus blok ini kalau backend sudah siap
    if (data.email && data.password) {
      return { success: true, message: "ok", data: { token: "mock-token", role: null, user: { id: "3", email: data.email, name: data.name } } };
    }
    // ↓ AKTIFKAN INI saat backend siap — sesuaikan endpoint dengan BE
    const response = await axiosInstance.post("/register", data);
    return response.data;
  },

  updateRole: async (role: "volunteer" | "lembaga"): Promise<AuthResponse> => {
    // MOCK — hapus blok ini kalau backend sudah siap
    return { success: true, message: "ok", data: { token: "mock-token", role, user: { id: "3", email: "test@test.com", name: "Test User" } } };
    // ↓ AKTIFKAN INI saat backend siap — sesuaikan endpoint dengan BE
    // const response = await axiosInstance.post("/auth/update-role", { role });
    // return response.data;
  },

  logout: async () => {
    // ↓ AKTIFKAN INI saat backend siap — sesuaikan endpoint dengan BE
    // const response = await axiosInstance.post("/logout");
    // return response.data;
  },
};