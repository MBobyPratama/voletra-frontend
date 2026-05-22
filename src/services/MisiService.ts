import axiosInstance from "@/lib/axios";
import { CreateMisiRequest, Misi, Applicant } from "@/types/misi";

export const MisiService = {
  getMisi: async (params?: {
    lat?: number;
    lng?: number;
    radius?: number;
    kategori?: string;
  }): Promise<Misi[]> => {
    const response = await axiosInstance.get("/misi", { params });
    return response.data;
  },

  getAll: async (): Promise<Misi[]> => {
    const response = await axiosInstance.get("/misi");
    return response.data;
  },
  getById: async (id: string): Promise<Misi> => {
    const response = await axiosInstance.get(`/misi/${id}`);
    return response.data;
  },
  getByPelapor: async (status?: string): Promise<Misi[]> => {
    const params = status && status !== "All" ? { status } : {};
    const response = await axiosInstance.get("/misi/pelapor/me", { params });
    return response.data;
  },
  getApplicants: async (id: string): Promise<Applicant[]> => {
    const response = await axiosInstance.get(`/misi/${id}/applicants`);
    return response.data;
  },
  approveApplicant: async (applyId: string): Promise<void> => {
    const response = await axiosInstance.patch(`/apply/${applyId}/approve`);
    return response.data;
  },
  rejectApplicant: async (applyId: string): Promise<void> => {
    const response = await axiosInstance.patch(`/apply/${applyId}/reject`);
    return response.data;
  },
  create: async (data: CreateMisiRequest): Promise<Misi> => {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("deskripsi", data.deskripsi);
    formData.append("kategori", data.kategori);
    formData.append("location", data.alamat); // Backend expects 'location'
    formData.append("jumlah_relawan", data.jumlah_relawan.toString());
    formData.append("event_mode", data.mode.toLowerCase());

    if (data.link_contact) {
      formData.append("contact_link", data.link_contact); // Backend expects 'contact_link'
      formData.append("coordinator_whatsapp", data.link_contact); // Mapping Link Contact to Coordinator WhatsApp as per user request
    }
    if (data.tanggal_mulai) formData.append("start_date", data.tanggal_mulai); // Fixed: Backend expects 'start_date'
    if (data.tanggal_selesai) formData.append("end_date", data.tanggal_selesai); // Fixed: Backend expects 'end_date'

    data.foto.forEach((file) => {
      formData.append("image", file); // Backend expects 'image'
    });

    const response = await axiosInstance.post("/misi", formData);
    return response.data;
  },

  update: async (id: string, data: CreateMisiRequest & { existingPhotos?: string[] }): Promise<Misi> => {
    const formData = new FormData();
    formData.append("judul", data.judul);
    formData.append("deskripsi", data.deskripsi);
    formData.append("kategori", data.kategori);
    formData.append("location", data.alamat);
    formData.append("jumlah_relawan", data.jumlah_relawan.toString());
    formData.append("event_mode", data.mode.toLowerCase());

    if (data.link_contact) {
      formData.append("contact_link", data.link_contact);
      formData.append("coordinator_whatsapp", data.link_contact);
    }
    if (data.tanggal_mulai) formData.append("start_date", data.tanggal_mulai);
    if (data.tanggal_selesai) formData.append("end_date", data.tanggal_selesai);
    if (data.latitude) formData.append("latitude", data.latitude.toString());
    if (data.longitude) formData.append("longitude", data.longitude.toString());

    // Append existing photos to keep
    if (data.existingPhotos) {
      data.existingPhotos.forEach((photo) => {
        formData.append("existing_photos", photo);
      });
    }

    data.foto.forEach((file) => {
      formData.append("image", file);
    });

    const response = await axiosInstance.patch(`/misi/${id}`, formData);
    return response.data;
  },
};
