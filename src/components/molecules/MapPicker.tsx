"use client";
import { MapContainer, TileLayer, Marker, useMapEvents, useMap } from "react-leaflet";
import { useState, useEffect } from "react";
import "leaflet/dist/leaflet.css";
import L from "leaflet";

const icon = L.icon({
  iconUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon.png",
  iconRetinaUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-icon-2x.png",
  shadowUrl: "https://unpkg.com/leaflet@1.9.4/dist/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});

interface MapPickerProps {
  onLocationSelect: (lat: number, lng: number, address: string) => void;
  initialLat?: number;
  initialLng?: number;
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, map.getZoom());
  }, [center, map]);
  return null;
}

function LocationMarker({ onLocationSelect, position }: { onLocationSelect: (lat: number, lng: number) => void, position: [number, number] | null }) {
  useMapEvents({
    click(e) {
      onLocationSelect(e.latlng.lat, e.latlng.lng);
    },
  });

  return position === null ? null : (
    <Marker position={position} icon={icon} />
  );
}

export default function MapPicker({ onLocationSelect, initialLat, initialLng }: MapPickerProps) {
  const [position, setPosition] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : [-2.5489, 118.0149]
  );
  const [mapCenter, setMapCenter] = useState<[number, number] | null>(
    initialLat && initialLng ? [initialLat, initialLng] : null
  );

  useEffect(() => {
    if (initialLat && initialLng) {
      // Only re-center the map if the new position is significantly different 
      // from the current position (e.g. from search, not from manual click)
      const isSignificantChange = !position || 
        Math.abs(position[0] - initialLat) > 0.0001 || 
        Math.abs(position[1] - initialLng) > 0.0001;

      if (isSignificantChange) {
        setPosition([initialLat, initialLng]);
        setMapCenter([initialLat, initialLng]);
      }
    }
  }, [initialLat, initialLng]);

  const handleSelect = async (lat: number, lng: number) => {
    setPosition([lat, lng]);
    // Note: We don't setMapCenter here so the map doesn't jump when clicking manually
    
    // Reverse Geocoding using Nominatim (Free)
    try {
      const response = await fetch(`https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}`, {
        headers: { 'Accept-Language': 'id' }
      });
      if (!response.ok) throw new Error('Geocoding service busy');
      const data = await response.json();
      onLocationSelect(lat, lng, data.display_name || `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    } catch (error) {
      console.error("Geocoding error:", error);
      // Fallback to coordinates so the user doesn't get "Address not found"
      onLocationSelect(lat, lng, `${lat.toFixed(6)}, ${lng.toFixed(6)}`);
    }
  };

  return (
    <MapContainer
      center={position || [-2.5489, 118.0149]}
      zoom={position ? 15 : 5}
      style={{ width: "100%", height: "100%" }}
    >
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      {mapCenter && <ChangeView center={mapCenter} />}
      <LocationMarker onLocationSelect={handleSelect} position={position} />
    </MapContainer>
  );
}
