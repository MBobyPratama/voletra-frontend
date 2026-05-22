"use client";

import React, { useState, useRef } from "react";
import Button from "@/components/atoms/Button";
import ProgresRegis from "../atoms/ProgresRegis";
import RegistrationSuccess from "./AfterRegistesMisi";
import { MisiService } from "@/services/MisiService";

interface FormRegisterMisiProps {
  misiId: string;
  misiJudul: string;
  onCancel: () => void;
  onSuccess: () => void;
}

export default function FormRegisterMisi({
  misiId,
  misiJudul,
  onCancel,
  onSuccess,
}: FormRegisterMisiProps) {
  const [formData, setFormData] = useState({
    nama: "",
    tanggal_ulang_tahun: "",
    nomor_hp: "",
    domisili: "",
  });

  const [skillFile, setSkillFile] = useState<File | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isSuccess, setIsSuccess] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setSkillFile(e.target.files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    if (
      !formData.nama ||
      !formData.tanggal_ulang_tahun ||
      !formData.nomor_hp ||
      !formData.domisili ||
      !skillFile
    ) {
      setError(
        "Mohon lengkapi seluruh kolom input beserta file bukti skill Anda."
      );
      setIsLoading(false);
      return;
    }

    try {
      const submitData = new FormData();
      submitData.append("mission_id", misiId);
      submitData.append("full_name", formData.nama);
      submitData.append("birth_date", formData.tanggal_ulang_tahun);
      submitData.append("phone_number", formData.nomor_hp);
      submitData.append("domicile", formData.domisili);
      submitData.append("skills", skillFile);

      await MisiService.apply(submitData);

      setIsSuccess(true); // tampilkan popup sukses, JANGAN panggil onSuccess di sini
    } catch (err: any) {
      console.error(err);
      setError(
        err.response?.data?.message || 
        "Terjadi kendala saat mengirim data pendaftaran. Silakan coba kembali."
      );
    } finally {
      setIsLoading(false);
    }
  };

  // ─── Popup sukses ─────────────────────────────────────────────────────────
  if (isSuccess) {
    return <RegistrationSuccess misiJudul={misiJudul} />;
  }

  // ─── Form utama ───────────────────────────────────────────────────────────
  return (
    <main>
      <ProgresRegis currentStep={1} />
      <div className="w-full bg-white rounded-[20px] p-8 shadow-sm border border-gray-100">
        <div className="mb-6 border-b border-gray-100 pb-4">
          <h2 className="text-xl font-bold text-[#122F5B]">
            Form Pendaftaran Relawan
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            Misi:{" "}
            <span className="font-semibold text-[#2869CA]">{misiJudul}</span>
          </p>
        </div>

        {error && (
          <div className="mb-6 bg-red-50 text-red-600 p-4 rounded-[10px] border border-red-200 text-sm font-medium">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <table className="w-full">
            <tbody>
              <tr className="border-b border-gray-100">
                <td className="py-4 pr-6 w-48">
                  <label className="text-[#000000]">Name</label>
                </td>
                <td className="py-4">
                  <input
                    type="text"
                    name="nama"
                    value={formData.nama}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 focus:border-[#2869CA] focus:outline-none text-sm text-black font-medium"
                    disabled={isLoading}
                    required
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 pr-6">
                  <label className="text-[#000000]">Date of birth</label>
                </td>
                <td className="py-4">
                  <input
                    type="date"
                    name="tanggal_ulang_tahun"
                    value={formData.tanggal_ulang_tahun}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 focus:border-[#2869CA] focus:outline-none text-sm text-black font-medium"
                    disabled={isLoading}
                    required
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 pr-6">
                  <label className="text-[#000000]">Phone number</label>
                </td>
                <td className="py-4">
                  <input
                    type="tel"
                    name="nomor_hp"
                    value={formData.nomor_hp}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 focus:border-[#2869CA] focus:outline-none text-sm text-black font-medium"
                    disabled={isLoading}
                    required
                  />
                </td>
              </tr>
              <tr className="border-b border-gray-100">
                <td className="py-4 pr-6">
                  <label className="text-[#000000]">Domicile</label>
                </td>
                <td className="py-4">
                  <input
                    type="text"
                    name="domisili"
                    value={formData.domisili}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-[10px] border border-gray-300 focus:border-[#2869CA] focus:outline-none text-sm text-black font-medium"
                    disabled={isLoading}
                    required
                  />
                </td>
              </tr>
              <tr>
                <td className="py-4 pr-6">
                  <label className="text-[#000000]">Skill</label>
                  <p className="text-xs text-gray-400 mt-1">
                    Unggah Berkas Bukti
                  </p>
                </td>
                <td className="py-4">
                  <div
                    onClick={() => !isLoading && fileInputRef.current?.click()}
                    className={`border-2 border-dashed rounded-[10px] p-6 text-center cursor-pointer transition-colors ${
                      skillFile
                        ? "border-[#2869CA] bg-blue-50/50"
                        : "border-gray-300 hover:border-[#2869CA]"
                    }`}
                  >
                    <input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileChange}
                      accept=".pdf,.doc,.docx,.png,.jpg,.jpeg"
                      className="hidden"
                      disabled={isLoading}
                    />
                    <div className="flex flex-col items-center justify-center gap-2">
                      <svg
                        className={`w-8 h-8 ${
                          skillFile ? "text-[#2869CA]" : "text-gray-400"
                        }`}
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth="2"
                          d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                        />
                      </svg>
                      {skillFile ? (
                        <div className="text-sm">
                          <p className="font-semibold text-[#122F5B]">
                            Berkas terpilih:
                          </p>
                          <p className="text-[#2869CA] font-medium underline mt-0.5">
                            {skillFile.name}
                          </p>
                          <p className="text-xs text-gray-400 mt-1">
                            Klik kembali untuk mengubah berkas
                          </p>
                        </div>
                      ) : (
                        <p className="font-semibold text-gray-400 text-sm">
                          Klik to upload
                        </p>
                      )}
                    </div>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <div className="flex justify-end gap-3 mt-4 border-t border-gray-100 pt-4">
            <button
              type="button"
              onClick={onCancel}
              className="px-6 py-2.5 rounded-[10px] text-sm font-medium text-gray-500 hover:bg-gray-50 transition-colors"
              disabled={isLoading}
            >
              Batal
            </button>
            <Button type="submit" variant="primary" disabled={isLoading}>
              {isLoading ? "Mengolah Pendaftaran..." : "Kirim Pendaftaran"}
            </Button>
          </div>
        </form>
      </div>
    </main>
  );
}
