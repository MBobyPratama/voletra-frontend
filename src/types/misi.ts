export type MisiStatus = 'Open' | 'Ongoing' | 'Completed';

export interface Misi {
  id: string;
  judul: string;
  deskripsi: string;
  kategori: string;
  alamat: string;
  longitude?: number;
  latitude?: number;
  link_contact?: string;
  link_lokasi?: string;
  jumlah_relawan: number;
  volunteers_applied?: number;
  pending_applicants_count?: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  foto: string[]; // URLs or file names from backend
  status: MisiStatus;
  mode?: 'Online' | 'Offline';
  coordinator_whatsapp?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Applicant {
  apply_id: string;
  user_id: string;
  full_name?: string; // from backend full_name
  nama?: string; // used by some frontend components
  birth_date?: string; // from backend birth_date
  tanggal_lahir?: string; // used by some frontend components
  phone_number?: string; // from backend phone_number
  phone?: string; // used by some frontend components
  domicile?: string; // from backend domicile
  domisili?: string; // used by some frontend components
  skills_url?: string;
  skill?: string; // for skill label/title
  video_link?: string;
  status: 'pending' | 'approved' | 'rejected';
}

export interface CreateMisiRequest {
  judul: string;
  deskripsi: string;
  kategori: string;
  alamat: string;
  longitude?: number;
  latitude?: number;
  link_contact?: string;
  jumlah_relawan: number;
  tanggal_mulai?: string;
  tanggal_selesai?: string;
  coordinator_whatsapp?: string;
  foto: File[];
  mode: 'Online' | 'Offline';
}
