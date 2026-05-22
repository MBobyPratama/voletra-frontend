export interface LoginRequest {
  email: string;
  password: string; // ← hapus '?' karena password wajib saat login
}

export interface RegisterRequest {
  email: string;
  name: string;
  password: string;         // ← wajib
  confirm_password: string; // ← tambah, biasanya backend butuh ini
}

export interface AuthResponse {
  success: boolean;
  message: string;
  data: {
    token?: string;
    role: 'volunteer' | 'lembaga' | null;
    user?: {
      id: string;
      email: string;
      name: string;
    };
    user_id?: string;
    name?: string;
    email?: string;
    redirect_url?: string;
  };
}