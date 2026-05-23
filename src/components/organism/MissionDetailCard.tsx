"use client";
import React, { useState } from "react";
import Image from "next/image";
import { usePathname, useRouter } from "next/navigation";
import { Misi } from "@/types/misi";
import StatusBadge from "@/components/atoms/StatusBadge";
import FormRegisterMisi from "./FormRegisterMisi";
import DeleteConfirmationModal from "@/components/molecules/DeleteConfirmationModal";

interface MissionDetailCardProps {
  misi: Misi;
  onBack?: () => void; // Diubah menjadi opsional agar halaman pelapor lama tidak error jika belum passing ini
  onRegister?: () => void; // Opsional
  onEdit?: () => void; // Opsional
  onDelete?: () => void; // Opsional
  extraActions?: React.ReactNode;
  applyStatus?: "Pending" | "Approve" | "Reject";
}

export default function MissionDetailCard({
  misi,
  onBack,
  onRegister,
  onEdit,
  onDelete,
  extraActions, 
  applyStatus,
}: MissionDetailCardProps) {
  const pathname = usePathname();
  const router = useRouter();
  const [showRegisterForm, setShowRegisterForm] = useState(false);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);

  // Deteksi role secara aman berdasarkan segmentasi URL path
  const isPelapor = pathname?.includes("/dashboard/pelapor");
  const isRelawan = pathname?.includes("/dashboard/relawan");

  // fallback jika data foto kosong atau tidak terdefinisi
  const photos = misi?.foto || [];
  const mainImage =
    photos.length > 0
      ? photos[0].startsWith('http')
        ? photos[0]
        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${photos[0]}`
      : null;

  const galleryImages = photos.slice(1, 4).map((f: string) =>
    f.startsWith('http') ? f : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${f}`
  );

  const judul = misi?.judul || 'No Title';
  const deskripsi = misi?.deskripsi || 'No Description';
  const alamat = misi?.alamat || 'No Location';
  const start_date = misi?.tanggal_mulai;
  const end_date = misi?.tanggal_selesai;

  // Navigasi tombol kembali dengan fallback jika onBack tidak di-passing dari parent
  const handleBackAction = () => {
    if (onBack) {
      onBack();
    } else {
      router.back(); // Jika tidak ada fungsi onBack, otomatis gunakan history back bawaan browser
    }
  };

  if (showRegisterForm) {
    return (
      <FormRegisterMisi
        misiId={misi.id}
        misiJudul={judul}
        onCancel={() => setShowRegisterForm(false)} // Jika klik batal, set ke false lagi (balik ke detail)
        onSuccess={() => {
          setShowRegisterForm(false);
          if (onRegister) {
            onRegister(); // Menjalankan fungsi redirect dinamis dari parent
          } else {
            router.push(`/dashboard/relawan/misi/${misi.id}`);
          }
        }}
      />
    );
  }

  // Logika aksi tombol utama di bagian bawah
  const handlePrimaryAction = () => {
    if (isPelapor) {
      if (onEdit) {
        onEdit();
      } else {
        // Jika pelapor belum mengimplementasikan fungsi onEdit, arahkan ke rute edit standard
        router.push(`/dashboard/pelapor/misi/${misi.id}/edit`); // Sesuaikan rute edit proyek Anda
      }
    } else if (isRelawan) {
      setShowRegisterForm(true);
    }
  };

  const handleDelete = async () => {
    setIsDeleting(true);
    try {
      if (onDelete) {
        await onDelete();
      }
    } catch (error) {
      console.error("Failed to delete mission:", error);
    } finally {
      setIsDeleting(false);
      setIsDeleteModalOpen(false);
    }
  };

  // Antisipasi jika data `misi` belum masuk atau undefined (mencegah crash saat loading data async)
  if (!misi) {
    return (
      <div className="p-6 text-center text-gray-500">
        Memuat data detail misi...
      </div>
    );
  }

  return (
    <div className="bg-white rounded-2xl p-6 shadow-sm animate-fade-in overflow-hidden relative">
      {/* Tombol Kembali & Status */}
      <div className="flex items-center justify-between mb-6">
        <StatusBadge status={misi.status} />
        <button
          onClick={handleBackAction}
          className="absolute top-4 right-4 w-9 h-9 text-gray-500 hover:text-black hover:shadow-md transition-all text-xl"
          aria-label="Tutup"
        >
          ×
        </button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 min-w-0">
        {/* Main Image */}
        <div className="relative w-full lg:w-[320px] h-[260px] rounded-xl overflow-hidden bg-gray-200 shrink-0">
          {mainImage ? (
            <Image src={mainImage} alt={judul} fill className="object-cover" />
          ) : (
            <div className="w-full h-full flex items-center justify-center text-gray-400">
              <svg
                className="w-12 h-12"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="1.5"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          )}
        </div>

        {/* Info Konten */}
        <div className="flex-1 flex flex-col justify-between min-w-0 w-full">
          <div className="w-full max-w-full">
            <h2 className="text-2xl font-bold text-black mb-3 break-words">{judul}</h2>
            <p className="text-sm text-gray-600 leading-relaxed mb-4 break-words whitespace-pre-wrap w-full">{deskripsi}</p>

            {/* Gallery */}
            {galleryImages.length > 0 && (
              <div className="flex gap-3 mb-4 overflow-x-auto pb-2">
                {galleryImages.map((img: string, idx: number) => (
                  <div key={idx} className="relative w-[90px] h-[90px] rounded-lg overflow-hidden shrink-0">
                    <Image src={img} alt={`Gallery ${idx + 1}`} fill className="object-cover" />
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Metadata Grid */}
          <div className="grid grid-cols-2 gap-x-4 gap-y-3 text-sm border-t border-gray-100 pt-4">
            <div className="min-w-0">
              <p className="text-gray-400 mb-0.5">Category</p>
              <p className="font-semibold text-black break-words">{misi.kategori || 'N/A'}</p>
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 mb-0.5">Number of Volunteers</p>
              <p className="font-semibold text-black">{misi.jumlah_relawan || 0}</p>
            </div>
            <div className="min-w-0">
              <p className="text-gray-400 mb-0.5">Event Mode</p>
              <p className="font-semibold text-black capitalize">{misi.mode || 'offline'}</p>
            </div>
            <div className="col-span-1 min-w-0">
              <p className="text-gray-400 mb-0.5">Location</p>
              <p className="font-semibold text-black break-words">{alamat}</p>
            </div>
            {start_date && (
              <div className="min-w-0">
                <p className="text-gray-400 mb-0.5">Start Date</p>
                <p className="font-semibold text-black">{new Date(start_date).toLocaleDateString()}</p>
              </div>
            )}
            {end_date && (
              <div className="min-w-0">
                <p className="text-gray-400 mb-0.5">End Date</p>
                <p className="font-semibold text-black">{new Date(end_date).toLocaleDateString()}</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Button */}
      <div className="flex justify-end mt-6 border-t border-gray-100 pt-4 gap-4">
        {extraActions ??
          (isPelapor ? (
            <>
              <button
                onClick={() => setIsDeleteModalOpen(true)}
                className="bg-red-50 text-red-600 hover:bg-red-100 font-medium px-8 py-3 rounded-xl transition-all w-full sm:w-auto border border-red-100"
              >
                Hapus Misi
              </button>
              <button
                onClick={handlePrimaryAction}
                className="bg-[#2869CA] hover:bg-[#1E4F98] text-white font-medium px-10 py-3 rounded-xl transition-colors w-full sm:w-auto"
              >
                Edit Misi
              </button>
            </>
          ) : applyStatus === "Pending" ? (
            <div className="bg-[#3349c6] flex items-center justify-center p-[10px] rounded-[10px] w-[293px]">
              <span className="font-['Poppins:Medium',sans-serif] text-[#eaf0fa] text-[16px] whitespace-nowrap">
                Pending
              </span>
            </div>
          ) : (
            <button
              onClick={handlePrimaryAction}
              className="bg-[#2869CA] hover:bg-[#1E4F98] text-white font-medium px-10 py-3 rounded-xl transition-colors w-full sm:w-auto"
            >
              Register
            </button>
          ))}
      </div>

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => setIsDeleteModalOpen(false)}
        onConfirm={handleDelete}
        isLoading={isDeleting}
        title="Hapus Misi"
        description={`Apakah Anda yakin ingin menghapus misi "${judul}"? Semua informasi misi, data relawan, dan gambar akan dihapus secara permanen dan tidak dapat dipulihkan.`}
      />
    </div>
  );
}
