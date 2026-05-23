"use client";

import React, { useState, useRef } from "react";
import Image from "next/image";
import { useRouter } from "next/navigation";
import Button from "@/components/atoms/Button";
import ProgresRegis from "../atoms/ProgresRegis";
import RegistrationSuccess from "./AfterRegistesMisi";
import { MisiService } from "@/services/MisiService";
import { FiX, FiUploadCloud } from "react-icons/fi";

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
  const router = useRouter();
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

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
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

      setIsSuccess(true);
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

  if (isSuccess) {
    return <RegistrationSuccess misiJudul={misiJudul} />;
  }

  return (
    <main className="w-full max-w-5xl mx-auto">
      <ProgresRegis currentStep={1} />
      
      <div className="bg-white rounded-2xl shadow-sm border border-gray-100 relative overflow-hidden">
        {/* Header */}
        <div className="p-6 sm:p-10 flex justify-between items-start border-b border-gray-50">
          <div>
            <h1 className="text-2xl sm:text-[32px] font-semibold text-black mb-2 font-['Poppins:Medium',sans-serif]">
              Register Mission
            </h1>
            <p className="text-sm text-gray-500">
              Misi: <span className="font-semibold text-primary-normal">{misiJudul}</span>
            </p>
          </div>
          <button 
            onClick={onCancel}
            className="text-gray-400 hover:text-gray-600 p-2 transition-colors"
          >
            <FiX className="w-7 h-7" />
          </button>
        </div>

        {/* Error Message */}
        {error && (
          <div className="mx-6 sm:mx-10 mt-6 bg-red-50 text-red-600 p-4 rounded-xl border border-red-100 text-sm font-medium flex items-center gap-3">
             <svg className="w-5 h-5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
             </svg>
             {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="p-6 sm:p-10 space-y-8">
          <div className="space-y-6">
            {/* Name */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-48 text-base font-medium text-gray-700">Name</label>
              <input
                type="text"
                name="nama"
                value={formData.nama}
                onChange={handleChange}
                placeholder="Full Name"
                className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3 text-sm focus:border-primary-normal focus:ring-1 focus:ring-primary-normal outline-none transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* DOB */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-48 text-base font-medium text-gray-700">Date of Birth</label>
              <input
                type="date"
                name="tanggal_ulang_tahun"
                value={formData.tanggal_ulang_tahun}
                onChange={handleChange}
                className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3 text-sm focus:border-primary-normal focus:ring-1 focus:ring-primary-normal outline-none transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Phone */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-48 text-base font-medium text-gray-700">Phone Number</label>
              <input
                type="tel"
                name="nomor_hp"
                value={formData.nomor_hp}
                onChange={handleChange}
                placeholder="08xxxxxxxxxx"
                className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3 text-sm focus:border-primary-normal focus:ring-1 focus:ring-primary-normal outline-none transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Domicile */}
            <div className="flex flex-col sm:flex-row sm:items-center gap-2 sm:gap-6">
              <label className="sm:w-48 text-base font-medium text-gray-700">Domicile</label>
              <input
                type="text"
                name="domisili"
                value={formData.domisili}
                onChange={handleChange}
                placeholder="City, Province"
                className="flex-1 bg-white border border-gray-300 rounded-xl px-5 py-3 text-sm focus:border-primary-normal focus:ring-1 focus:ring-primary-normal outline-none transition-all"
                disabled={isLoading}
                required
              />
            </div>

            {/* Skill */}
            <div className="flex flex-col sm:flex-row gap-2 sm:gap-6">
              <div className="sm:w-48 pt-2">
                <label className="text-base font-medium text-gray-700 block">Skill</label>
                <p className="text-xs text-gray-400 mt-1">Upload proof document (CV/Portfolio)</p>
              </div>
              <div className="flex-1">
                <div
                  onClick={() => !isLoading && fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all ${
                    skillFile
                      ? "border-primary-normal bg-blue-50/30 shadow-inner"
                      : "border-gray-200 hover:border-primary-normal hover:bg-gray-50"
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
                  <div className="flex flex-col items-center justify-center gap-4">
                    <div className={`w-14 h-14 rounded-full flex items-center justify-center ${skillFile ? 'bg-primary-normal text-white' : 'bg-gray-100 text-gray-400'}`}>
                       <FiUploadCloud className="w-7 h-7" />
                    </div>
                    {skillFile ? (
                      <div className="max-w-xs">
                        <p className="font-bold text-[#122F5B] mb-1">File Selected:</p>
                        <p className="text-primary-normal font-medium truncate underline">
                          {skillFile.name}
                        </p>
                        <p className="text-[11px] text-gray-400 mt-2 italic">
                          Click again to change file
                        </p>
                      </div>
                    ) : (
                      <div>
                        <p className="font-bold text-gray-500 text-lg mb-1">Click to upload</p>
                        <p className="text-xs text-gray-400">PDF, JPG, PNG or DOC (Max. 5MB)</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row justify-end gap-4 pt-6 border-t border-gray-50">
            <button
              type="button"
              onClick={onCancel}
              className="px-8 py-3.5 rounded-xl text-sm font-semibold text-gray-500 hover:bg-gray-50 transition-all border border-gray-100"
              disabled={isLoading}
            >
              Cancel
            </button>
            <button 
              type="submit" 
              disabled={isLoading}
              className="px-12 py-3.5 bg-primary-normal hover:bg-primary-normalHover text-white font-bold rounded-xl transition-all shadow-lg shadow-blue-100 disabled:opacity-50 flex items-center justify-center min-w-[200px]"
            >
              {isLoading ? (
                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
              ) : (
                "Submit"
              )}
            </button>
          </div>
        </form>
      </div>
    </main>
  );
}
