'use client';

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { MisiService } from '@/services/MisiService';
import { CreateMisiRequest, Misi } from '@/types/misi';
import Input from '../atoms/Input';
import TextArea from '../atoms/TextArea';
import FileUpload from '../atoms/FileUpload';
import FormField from '../molecules/FormField';
import axios from 'axios';
import dynamic from 'next/dynamic';
import Image from 'next/image';

// Import MapPicker dynamically to avoid SSR issues with Leaflet
const MapPicker = dynamic(() => import('../molecules/MapPicker'), {
  ssr: false,
  loading: () => <div className="w-full h-full bg-gray-100 animate-pulse flex items-center justify-center">Loading map...</div>
});

const CATEGORY_OPTIONS = [
  { label: 'Bencana Alam', value: 'Bencana' },
  { label: 'Kesehatan', value: 'Medis' },
  { label: 'Edukasi', value: 'Pendidikan' },
  { label: 'Logistik', value: 'Logistik' },
  { label: 'Lainnya', value: 'Lainnya' },
];

interface FormTicketMisiProps {
  isEdit?: boolean;
  initialData?: Misi;
}

const FormTicketMisi: React.FC<FormTicketMisiProps> = ({ isEdit, initialData }) => {
  const router = useRouter();

  // Robustly extract initial values handling both Misi type and potential backend variations
  const getInitialValue = () => {
    const rawData = initialData as any;
    console.log('FormTicketMisi Debug - Initial Data:', initialData);

    if (!isEdit || !initialData) {
      return {
        judul: '',
        deskripsi: '',
        kategori: '',
        alamat: '',
        jumlah_relawan: 1,
        mode: 'Offline' as const,
        tanggal_mulai: '',
        tanggal_selesai: '',
        link_contact: '',
        latitude: undefined,
        longitude: undefined,
      };
    }

    const rawMode = initialData.mode || rawData?.event_mode || rawData?.eventMode || 'Offline';
    const normalizedMode = (rawMode.toLowerCase() === 'online' ? 'Online' : 'Offline') as 'Online' | 'Offline';

    const startDate = initialData.tanggal_mulai || rawData?.start_date || rawData?.startDate;
    const endDate = initialData.tanggal_selesai || rawData?.end_date || rawData?.endDate;

    const volunteerCount = initialData.jumlah_relawan || rawData?.volunteersNeeded || rawData?.volunteers_needed || 1;

    return {
      judul: initialData.judul || rawData?.title || '',
      deskripsi: initialData.deskripsi || rawData?.description || '',
      kategori: initialData.kategori || rawData?.category || '',
      alamat: initialData.alamat || rawData?.location || '',
      jumlah_relawan: Number(volunteerCount),
      mode: normalizedMode,
      tanggal_mulai: startDate ? new Date(startDate).toISOString().split('T')[0] : '',
      tanggal_selesai: endDate ? new Date(endDate).toISOString().split('T')[0] : '',
      link_contact: initialData.link_contact || rawData?.contact_link || '',
      latitude: initialData.latitude,
      longitude: initialData.longitude,
    };
  };

  const [formData, setFormData] = useState<Omit<CreateMisiRequest, 'foto'>>(getInitialValue());
  const [fotos, setFotos] = useState<File[]>([]);
  const [existingPhotos, setExistingPhotos] = useState<string[]>(initialData?.foto || []);
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [isLoading, setIsLoading] = useState(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  const [showLocationPopup, setShowLocationPopup] = useState(false);
  const [showMapSelection, setShowMapSelection] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState<any[]>([]);
  const [isSearching, setIsSearching] = useState(false);
  const [searchTimeout, setSearchTimeout] = useState<NodeJS.Timeout | null>(null);

  // Sync existing photos if initialData changes
  useEffect(() => {
    if (initialData) {
      setExistingPhotos(initialData?.foto || []);
    }
  }, [initialData]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    
    if (searchTimeout) {
      clearTimeout(searchTimeout);
    }

    if (query.length < 3) {
      setSearchResults([]);
      return;
    }

    const timeout = setTimeout(async () => {
      setIsSearching(true);
      try {
        const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(query)}&countrycodes=id`, {
          headers: {
            'Accept-Language': 'id'
          }
        });
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setSearchResults(data);
      } catch (error) {
        console.error("Search error:", error);
        setSearchResults([]);
      } finally {
        setIsSearching(false);
      }
    }, 500); // 500ms debounce

    setSearchTimeout(timeout);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: name === 'jumlah_relawan' ? parseInt(value) || 0 : value,
    }));
    if (errors[name]) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleFileChange = (files: File[]) => {
    setFotos(files);
    if (errors.foto) {
      setErrors((prev) => {
        const newErrors = { ...prev };
        delete newErrors.foto;
        return newErrors;
      });
    }
  };

  const removeExistingPhoto = (url: string) => {
    setExistingPhotos(prev => prev.filter(p => p !== url));
  };

  const validate = () => {
    const newErrors: Record<string, string> = {};
    if (!formData.judul) newErrors.judul = 'Judul misi wajib diisi';
    if (!formData.deskripsi) newErrors.deskripsi = 'Deskripsi wajib diisi';
    if (!formData.kategori) newErrors.kategori = 'Kategori wajib diisi';
    if (!formData.alamat) newErrors.alamat = 'Alamat wajib diisi';
    if (!formData.latitude) newErrors.latitude = 'Latitude wajib diisi';
    if (!formData.longitude) newErrors.longitude = 'Longitude wajib diisi';
    if (!formData.tanggal_mulai) newErrors.tanggal_mulai = 'Tanggal mulai wajib diisi';
    if (!formData.tanggal_selesai) newErrors.tanggal_selesai = 'Tanggal selesai wajib diisi';
    if (!formData.link_contact) newErrors.link_contact = 'Link kontak wajib diisi';
    if (!formData.mode) newErrors.mode = 'Event mode wajib diisi';
    if (formData.jumlah_relawan <= 0) newErrors.jumlah_relawan = 'Jumlah relawan harus lebih dari 0';
    
    // Total photos (existing + new) must be at least 1
    if (existingPhotos.length === 0 && fotos.length === 0) {
      newErrors.foto = 'Foto minimal 1';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError(null);

    if (!validate()) return;

    setIsLoading(true);
    try {
      const payload = {
        ...formData,
        jumlah_relawan: Number(formData.jumlah_relawan),
        latitude: formData.latitude ? Number(formData.latitude) : undefined,
        longitude: formData.longitude ? Number(formData.longitude) : undefined,
        foto: fotos,
        existingPhotos: existingPhotos,
      } as any;

      if (isEdit && initialData?.id) {
        await MisiService.update(initialData.id, payload);
      } else {
        await MisiService.create(payload);
      }
      
      router.push(isEdit ? `/dashboard/pelapor/misi/${initialData?.id}` : '/dashboard/pelapor');
    } catch (error: unknown) {
      if (axios.isAxiosError(error)) {
        setApiError(error.response?.data?.error || `Gagal ${isEdit ? 'memperbarui' : 'membuat'} misi. Silakan coba lagi.`);
      } else {
        setApiError('Terjadi kesalahan yang tidak diketahui.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleAllowAccess = () => {
    setShowLocationPopup(false);
    setShowMapSelection(true);
  };

  const handleLocationSelect = (lat: number, lng: number, address: string) => {
    setFormData((prev) => ({
      ...prev,
      alamat: address,
      latitude: lat,
      longitude: lng,
    }));
  };

  return (
    <form onSubmit={handleSubmit} className="relative bg-white p-10 rounded-[10px] shadow-sm">
      {/* Location Access Warning Popup */}
      {showLocationPopup && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] p-8 max-w-[320px] w-full flex flex-col items-center text-center shadow-lg animate-in fade-in zoom-in duration-300">
            <div className="w-40 h-32 mb-6 relative">
              <div className="w-full h-full bg-blue-50 rounded-full flex items-center justify-center">
                 <svg className="w-16 h-16 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                 </svg>
              </div>
            </div>
            <p className="text-[14px] text-gray-700 mb-8 leading-relaxed font-medium">
              Allow location access to automatically detect your current address
            </p>
            <button
              type="button"
              onClick={handleAllowAccess}
              className="bg-[#2869CA] text-white px-8 py-2.5 rounded-[10px] text-sm font-semibold hover:bg-blue-700 transition-colors w-full shadow-sm"
            >
              Allow Access
            </button>
            <button 
              type="button" 
              onClick={() => setShowLocationPopup(false)}
              className="mt-3 text-sm text-gray-500 hover:text-gray-700"
            >
              Cancel
            </button>
          </div>
        </div>
      )}

      {/* Map Selection Popup */}
      {showMapSelection && (
        <div className="fixed inset-0 bg-black/50 z-[100] flex items-center justify-center p-4">
          <div className="bg-white rounded-[15px] max-w-[800px] w-full h-[600px] overflow-hidden flex flex-col shadow-2xl animate-in fade-in zoom-in duration-300">
            <div className="p-4 border-b flex justify-between items-center bg-gray-50">
              <h3 className="font-semibold text-lg text-gray-800">Select Location</h3>
              <button 
                type="button" 
                onClick={() => setShowMapSelection(false)}
                className="text-gray-400 hover:text-gray-600 p-1"
              >
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
            
            <div className="flex-1 relative flex flex-col">
              <div className="p-4 bg-white shadow-sm z-10">
                <div className="relative">
                  <input 
                    type="text" 
                    placeholder="Search location..." 
                    value={searchQuery}
                    onChange={(e) => handleSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2.5 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                  />
                  <svg className="w-5 h-5 absolute left-3 top-2.5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                  {isSearching && (
                    <div className="absolute right-3 top-3">
                      <div className="w-4 h-4 border-2 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                  )}
                </div>
                
                <div className="mt-3 space-y-1 max-h-[120px] overflow-y-auto">
                  {searchResults.length > 0 ? (
                    searchResults.map((result) => (
                      <button 
                        key={result.place_id}
                        type="button"
                        onClick={() => {
                          handleLocationSelect(parseFloat(result.lat), parseFloat(result.lon), result.display_name);
                          setSearchResults([]);
                          setSearchQuery(result.display_name);
                        }}
                        className="w-full text-left p-3 hover:bg-blue-50 rounded-lg transition-colors flex items-start gap-3 group"
                      >
                        <svg className="w-5 h-5 text-gray-400 group-hover:text-blue-500 mt-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                        </svg>
                        <div>
                          <p className="text-sm font-medium text-gray-800 line-clamp-1">{result.display_name}</p>
                          <p className="text-xs text-gray-500">{result.type || 'Location'}</p>
                        </div>
                      </button>
                    ))
                  ) : searchQuery.length >= 3 && !isSearching ? (
                    <p className="text-sm text-gray-500 p-3">No results found</p>
                  ) : null}
                </div>
              </div>
              
              <div className="flex-1 bg-gray-100 relative overflow-hidden">
                <MapPicker 
                  onLocationSelect={handleLocationSelect}
                  initialLat={formData.latitude}
                  initialLng={formData.longitude}
                />
                
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 w-full max-w-[200px] px-4 z-[1000]">
                   <button 
                    type="button"
                    onClick={() => setShowMapSelection(false)}
                    className="w-full bg-[#2869CA] text-white py-3 rounded-full font-semibold shadow-xl hover:bg-blue-700 transition-all text-sm"
                   >
                     Confirm Location
                   </button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      <div className="absolute right-6 top-6 cursor-pointer text-gray-400 hover:text-gray-600" onClick={() => router.back()}>
        <svg className="w-8 h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12"></path>
        </svg>
      </div>

      <h2 className="text-2xl font-semibold mb-10 text-black">{isEdit ? 'Edit Mission' : 'Add New Mission'}</h2>
      
      {apiError && (
        <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6 border border-red-200">
          {apiError}
        </div>
      )}

      <div className="space-y-6">
        <FormField label="Title" error={errors.judul} required>
          <Input
            name="judul"
            placeholder=""
            value={formData.judul}
            onChange={handleChange}
            error={errors.judul}
          />
        </FormField>

        <FormField label="Description" error={errors.deskripsi} required>
          <TextArea
            name="deskripsi"
            rows={4}
            placeholder=""
            value={formData.deskripsi}
            onChange={handleChange}
            error={errors.deskripsi}
          />
        </FormField>

        <FormField label="Category" error={errors.kategori} required>
          <div className="flex flex-wrap gap-2">
            {CATEGORY_OPTIONS.map((opt) => (
              <button
                key={opt.value}
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, kategori: opt.value }))}
                className={`flex items-center gap-2 px-4 py-1.5 rounded-full border text-[12px] transition-all ${
                  formData.kategori === opt.value
                    ? 'bg-blue-50 border-blue-500 text-blue-700'
                    : 'bg-white border-gray-200 text-gray-700 hover:border-gray-300'
                }`}
              >
                <div className={`w-3 h-3 rounded-full border ${formData.kategori === opt.value ? 'bg-blue-500 border-blue-500' : 'bg-white border-gray-400'}`} />
                {opt.label}
              </button>
            ))}
          </div>
        </FormField>

        <FormField label="Number of Volunteers" error={errors.jumlah_relawan} required>
          <Input
            name="jumlah_relawan"
            type="number"
            min="1"
            value={formData.jumlah_relawan}
            onChange={handleChange}
            error={errors.jumlah_relawan}
          />
        </FormField>

        <FormField label="Event Mode" error={errors.mode} required>
          <div className="flex flex-wrap gap-6">
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mode: 'Offline' }))}
              className={`flex items-center gap-3 px-1 py-1 transition-all group`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.mode === 'Offline' ? 'border-[#2869CA]' : 'border-gray-300'}`}>
                {formData.mode === 'Offline' && <div className="w-2 h-2 rounded-full bg-[#2869CA]" />}
              </div>
              <span className={`text-[14px] font-medium transition-all ${formData.mode === 'Offline' ? 'text-black' : 'text-gray-500 group-hover:text-gray-700'}`}>Offline</span>
            </button>
            <button
              type="button"
              onClick={() => setFormData(prev => ({ ...prev, mode: 'Online' }))}
              className={`flex items-center gap-3 px-1 py-1 transition-all group`}
            >
              <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center transition-all ${formData.mode === 'Online' ? 'border-[#2869CA]' : 'border-gray-300'}`}>
                {formData.mode === 'Online' && <div className="w-2 h-2 rounded-full bg-[#2869CA]" />}
              </div>
              <span className={`text-[14px] font-medium transition-all ${formData.mode === 'Online' ? 'text-black' : 'text-gray-500 group-hover:text-gray-700'}`}>Online</span>
            </button>
          </div>
        </FormField>

        <FormField label="Location" error={errors.alamat} required>
          <div className="relative group">
            <Input
              name="alamat"
              placeholder="Select location or type manually..."
              value={formData.alamat}
              onChange={handleChange}
              className="pr-12 group-hover:border-blue-400 transition-colors"
              error={errors.alamat}
            />
            <div 
              onClick={() => setShowLocationPopup(true)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-400 hover:text-blue-500 transition-colors cursor-pointer"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
          </div>
        </FormField>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <FormField label="Longitude" error={errors.longitude} required>
              <Input 
                name="longitude"
                value={formData.longitude || ''} 
                readOnly 
                placeholder="0.0"
                error={errors.longitude}
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="Latitude" error={errors.latitude} required>
              <Input 
                name="latitude"
                value={formData.latitude || ''} 
                readOnly 
                placeholder="0.0"
                error={errors.latitude}
              />
            </FormField>
          </div>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="flex-1">
            <FormField label="Start Date" error={errors.tanggal_mulai} required>
              <Input 
                name="tanggal_mulai"
                type="date"
                value={formData.tanggal_mulai}
                onChange={handleChange}
                error={errors.tanggal_mulai}
              />
            </FormField>
          </div>
          <div className="flex-1">
            <FormField label="End Date" error={errors.tanggal_selesai} required>
              <Input 
                name="tanggal_selesai"
                type="date"
                value={formData.tanggal_selesai}
                onChange={handleChange}
                error={errors.tanggal_selesai}
              />
            </FormField>
          </div>
        </div>

        <FormField label="Link Contact" error={errors.link_contact} required>
          <Input
            name="link_contact"
            value={formData.link_contact || ''}
            onChange={handleChange}
            placeholder="https://wa.me/..."
            error={errors.link_contact}
          />
        </FormField>

        <FormField label="Image" error={errors.foto} required={!isEdit || (existingPhotos.length === 0)}>
          {/* Existing Photos Display */}
          {isEdit && existingPhotos.length > 0 && (
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
              {existingPhotos.map((url, index) => (
                <div key={index} className="relative aspect-video rounded-lg overflow-hidden group border border-gray-200">
                  <Image
                    src={url.startsWith('http') ? url : `${process.env.NEXT_PUBLIC_API_URL}/uploads/${url}`}
                    alt={`Existing photo ${index + 1}`}
                    fill
                    className="object-cover"
                  />
                  <button
                    type="button"
                    onClick={() => removeExistingPhoto(url)}
                    className="absolute top-2 right-2 bg-red-500 text-white p-1.5 rounded-full shadow-md opacity-0 group-hover:opacity-100 transition-opacity"
                    title="Hapus foto"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              ))}
            </div>
          )}

          <FileUpload onChange={handleFileChange} error={errors.foto} />
          {isEdit && (
            <p className="text-xs text-gray-500 mt-2">
              * Unggah foto baru untuk menambah atau mengganti foto. Hapus foto di atas untuk menghilangkannya.
            </p>
          )}
        </FormField>
      </div>

      <div className="mt-12 flex justify-end">
        <button
          type="submit"
          disabled={isLoading}
          className="bg-[#2869CA] text-[#EAF0FA] px-16 py-3 rounded-[10px] font-medium hover:bg-blue-700 transition-all disabled:opacity-50"
        >
          {isLoading ? (isEdit ? 'Updating...' : 'Submitting...') : (isEdit ? 'Update' : 'Submit')}
        </button>
      </div>
    </form>
  );
};

export default FormTicketMisi;
