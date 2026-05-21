import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

export interface User {
  id: string;
  email: string;
  name: string;
  institution_name?: string;
}

export interface PendingRegister {
  name: string;
  email: string;
  password: string;
  confirm_password: string;
}

type UserRole = "volunteer" | "lembaga" | "super_admin" | null;

interface AuthState {
  token: string | null;
  role: UserRole;
  user: User | null;
  isModalOpen: boolean;
  redirectTo: string | null;
  pendingRegister: PendingRegister | null;

  setAuth: (token: string, role: "volunteer" | "lembaga" | null, user: User) => void;
  clearAuth: () => void;
  openModal: () => void;
  closeModal: () => void;
  setRedirectTo: (path: string) => void;
  clearRedirectTo: () => void;
  setPendingRegister: (data: PendingRegister) => void;
  clearPendingRegister: () => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      token: null,
      role: null,
      user: null,
      isModalOpen: false,
      redirectTo: null,
      pendingRegister: null,

      openModal: () => set({ isModalOpen: true }),
      closeModal: () => set({ isModalOpen: false }),
      setRedirectTo: (path) => set({ redirectTo: path }),
      clearRedirectTo: () => set({ redirectTo: null }),
      setPendingRegister: (data) => set({ pendingRegister: data }),
      clearPendingRegister: () => set({ pendingRegister: null }),

      setAuth: (token, role, user) => {
        set({ token, role, user });
        if (typeof window !== "undefined") {
          document.cookie = `token=${token}; path=/; max-age=86400; SameSite=Lax`;
          if (role) {
            document.cookie = `role=${role}; path=/; max-age=86400; SameSite=Lax`;
          } else {
            document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          }
        }
      },

      clearAuth: () => {
        set({ token: null, role: null, user: null });
        if (typeof window !== "undefined") {
          document.cookie = "token=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          document.cookie = "role=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT";
          localStorage.removeItem("auth-storage");
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage),
    }
  )
);