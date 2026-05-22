import axiosInstance from "@/lib/axios";
import { AuthResponse, LoginRequest, RegisterRequest } from "@/types/auth";

export const AuthService = {
  login: async (data: LoginRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/login", data);
    return response.data;
  },

  register: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register", data);
    return response.data;
  },

  registerVolunteer: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register/volunteer", {
      name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      role: 'volunteer'
    });
    return response.data;
  },

  registerLembaga: async (data: RegisterRequest): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/register/lembaga", {
      institution_name: data.name,
      email: data.email,
      password: data.password,
      confirm_password: data.confirm_password,
      role: 'lembaga'
    });
    return response.data;
  },
  updateRole: async (role: "volunteer" | "lembaga"): Promise<AuthResponse> => {
    const response = await axiosInstance.post("/auth/update-role", { role });
    return response.data;
  },

  logout: async (): Promise<void> => {
    await axiosInstance.post("/auth/logout");
  }
};
