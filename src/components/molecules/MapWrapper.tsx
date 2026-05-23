"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import { useAuthStore } from "@/app/store/authStore";
import { Misi } from "@/types/misi";
import { MisiService } from "@/services/MisiService";

import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl:
    "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const DEFAULT_CENTER: [number, number] = [-2.5489, 118.0149];
const DEFAULT_ZOOM = 5;

export default function MapWrapper({ height = "500px" }: { height?: string }) {
  const [missions, setMissions] = useState<Misi[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const router = useRouter();
  const { token, role, openModal, setRedirectTo } = useAuthStore();

  useEffect(() => {
    const fetchMissions = async () => {
      try {
        setLoading(true);
        const data = await MisiService.getMisi();
        setMissions(data);
      } catch (err) {
        console.error("Error fetching missions for map:", err);
        setError("Gagal memuat data misi");
      } finally {
        setLoading(false);
      }
    };

    fetchMissions();
  }, []);

  // 🔐 AUTH GATE
  const handleAuthAction = (id: string) => {
    if (!token) {
      setRedirectTo(`/dashboard/relawan/misi/${id}`);
      openModal();
    } else {
      // If user is a volunteer (volunteer/relawan), go to their dashboard version of mission detail
      if (role === 'volunteer') {
        router.push(`/dashboard/relawan/misi/${id}`);
      } else if (role === 'lembaga') {
        router.push(`/dashboard/pelapor/misi/${id}`);
      } else {
        // Fallback or public view if it existed, but for now we follow dashboard paths
        router.push(`/dashboard/relawan/misi/${id}`);
      }
    }
  };

  // UI STATES
  if (loading) {
    return (
      <div className="w-full flex items-center justify-center bg-gray-50" style={{ height }}>
        <div className="w-8 h-8 border-4 border-primary-normal border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (error) return <div className="w-full flex items-center justify-center bg-gray-50 text-red-500" style={{ height }}>{error}</div>;
  if (missions.length === 0) return <div className="w-full flex items-center justify-center bg-gray-50 text-gray-400" style={{ height }}>Belum ada misi tersedia</div>;

  return (
    <MapContainer
      center={DEFAULT_CENTER}
      zoom={DEFAULT_ZOOM}
      style={{ width: "100%", height, borderRadius: "16px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />

      {missions.map((mission) => {
        if (!mission.latitude || !mission.longitude) return null;
        return (
          <Marker
            key={mission.id}
            position={[mission.latitude, mission.longitude]}
            icon={icon}
          >
            <Popup>
              <div className="min-w-[160px] p-1">
                <h3 className="font-semibold text-sm text-gray-800 mb-1 line-clamp-1">
                  {mission.judul}
                </h3>
                <p className="text-xs text-gray-500 mb-3">{mission.kategori}</p>
                <div className="flex flex-col gap-2">
                  <button
                    onClick={() => handleAuthAction(mission.id)}
                    className="w-full bg-primary-normal text-white py-1.5 rounded-lg text-xs font-semibold hover:bg-primary-normalHover transition-colors"
                  >
                    Lihat Detail
                  </button>
                </div>
              </div>
            </Popup>
          </Marker>
        );
      })}
    </MapContainer>
  );
}
