"use client";

import { useState, useEffect, useMemo } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Misi, MisiStatus } from "@/types/misi";
import { useAuthStore } from "@/app/store/authStore";
import StatusBadge from "@/components/atoms/StatusBadge";
import MissionSkeleton from "@/components/molecules/MissionSkeleton";
import MissionFilter from "../molecules/MissionFilter";
import MissionDetailCard from "./MissionDetailCard";
import Sidebar from "./Sidebar";
import { MisiService } from "@/services/MisiService";

// Mapping label filter UI → nilai kategori yang dipakai backend
const CATEGORY_MAP: Record<string, string> = {
  "Emergency Response": "Bencana Alam",
  Education: "Edukasi",
  Healthcare: "Kesehatan",
  Environment: "Lingkungan",
  Logistics: "Lainnya",
  Technology: "Lainnya",
  Music: "Lainnya",
  "Elderly Care": "Lainnya",
};

// ─── Card khusus halaman publik ───────────────────────────────────────────────
// MissionCard yang ada di src/components/molecules mengarah ke /dashboard,
// jadi card ini dibuat terpisah khusus untuk halaman publik dengan tombol Apply.
function PublicMissionCard({
  misi,
  onApply,
}: {
  misi: Misi;
  onApply: (misi: Misi) => void;
}) {
  const { token, openModal, setRedirectTo } = useAuthStore();
  const router = useRouter();

  const thumbnail =
    misi.foto && misi.foto.length > 0
      ? misi.foto[0].startsWith("http")
        ? misi.foto[0]
        : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${misi.foto[0]}`
      : null;

  const handleApply = () => {
    if (!token) {
      setRedirectTo(`/dashboard/misi/${misi.id}`);
      openModal();
    } else {
      onApply(misi);
    }
  };

  return (
    <div className="rounded-2xl overflow-hidden border border-gray-100 shadow-sm hover:shadow-md transition-shadow bg-white flex flex-col">
      {/* Thumbnail */}
      <div className="h-40 relative bg-gray-200">
        {thumbnail && (
          <Image
            src={thumbnail}
            alt={misi.judul || 'Misi'}
            fill
            className="object-cover"
          />
        )}
      </div>

      {/* Content */}
      <div className="p-4 flex flex-col flex-1">
        <div className="flex justify-between">
          <h3 className="font-semibold text-sm text-gray-800 mb-3 line-clamp-2">
            {misi.judul}
          </h3>
          <div className="flex gap-2">
            {misi.mode && <StatusBadge status={misi.mode} />}
            <StatusBadge status={misi.status} />
          </div>
        </div>

        <div className="text-xs text-gray-500 flex items-center gap-1 mb-1">
          <Image
            src="/icons/map-pin.svg"
            width={14}
            height={14}
            alt="lokasi"
            style={{ width: "auto" }}
          />
          <span className="line-clamp-1">{misi.alamat}</span>
        </div>

        <p className="text-xs text-gray-500 flex items-center gap-1 mb-4">
          <Image
            src="/icons/users.svg"
            width={14}
            height={14}
            alt="relawan"
            style={{ width: "auto" }}
          />
          {misi.jumlah_relawan} Volunteers
        </p>

        <div className="mt-auto">
          <button
            onClick={handleApply}
            className="w-full bg-primary-normal text-white py-2 rounded-lg text-sm font-semibold hover:bg-primary-normalHover transition-colors"
          >
            Apply
          </button>
        </div>
      </div>
    </div>
  );
}

// ─── MissionSection ───────────────────────────────────────────────────────────
export default function MissionSection() {
  const [missions, setMissions] = useState<Misi[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [location, setLocation] = useState("");
  const [category, setCategory] = useState("");
  const [selectedMisi, setSelectedMisi] = useState<Misi | null>(null);
  const router = useRouter();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        const data = await MisiService.getMisi();
        setMissions(data);
      } catch (error) {
        console.error("Failed to fetch missions:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  const handleSelectMisi = async (misi: Misi) => {
    try {
      const fullMisi = await MisiService.getById(misi.id);
      setSelectedMisi(fullMisi);
    } catch (error) {
      console.error("Failed to fetch full mission details:", error);
      setSelectedMisi(misi);
    }
  };

  const filtered = useMemo(() => {
    return missions.filter((m) => {
      const matchSearch =
        search === "" ||
        m.judul.toLowerCase().includes(search.toLowerCase()) ||
        m.alamat.toLowerCase().includes(search.toLowerCase());

      const matchLocation =
        location === "" ||
        m.alamat.toLowerCase().includes(location.toLowerCase());

      const backendKategori = CATEGORY_MAP[category] ?? category;
      const matchCategory = category === "" || m.kategori === backendKategori;

      return matchSearch && matchLocation && matchCategory;
    });
  }, [missions, search, location, category]);

  // ── Tampilan detail misi full-screen (menggantikan seluruh halaman dashboard) ──
  if (selectedMisi) {
    return (
      <div className="fixed lg:ml-64 inset-0 z-50 bg-[#EAF0FA] overflow-y-auto">
        <div className="hidden lg:block">
           <Sidebar />
        </div>

        <div className="p-4 sm:p-8">
          <MissionDetailCard
            misi={selectedMisi}
            onBack={() => setSelectedMisi(null)}
            onRegister={() => {
              setSelectedMisi(null);
              router.push("/dashboard/relawan/misi");
            }}
          />
        </div>
      </div>
    );
  }

  // ── Tampilan default daftar misi ──────────────────────────────────────────────
  return (
    <div>
      <MissionFilter
        search={search}
        location={location}
        category={category}
        onSearchChange={setSearch}
        onLocationChange={setLocation}
        onCategoryChange={setCategory}
      />

      {loading ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {Array.from({ length: 6 }).map((_, i) => (
            <MissionSkeleton key={i} />
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-gray-400">
          <p className="text-lg font-medium">Tidak ada misi yang ditemukan</p>
          <p className="text-sm mt-1">Coba ubah filter pencarian kamu</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((misi) => (
            <PublicMissionCard
              key={misi.id}
              misi={misi}
              onApply={handleSelectMisi}
            />
          ))}
        </div>
      )}
    </div>
  );
}
