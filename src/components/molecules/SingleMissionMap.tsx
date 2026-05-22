"use client";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import { Misi } from "@/types/misi";

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

interface SingleMissionMapProps {
  misi: Misi;
}

export default function SingleMissionMap({ misi }: SingleMissionMapProps) {
  const center: [number, number] = [
    misi.latitude || -6.200000, 
    misi.longitude || 106.816666
  ];

  return (
    <MapContainer
      center={center}
      zoom={15}
      style={{ width: "100%", height: "450px" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <Marker position={center} icon={icon}>
        <Popup>
          <div className="font-semibold text-sm">{misi.judul}</div>
          <div className="text-xs text-gray-500">{misi.alamat}</div>
        </Popup>
      </Marker>
    </MapContainer>
  );
}
