"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { FiX, FiUser, FiMail, FiShield, FiEdit2, FiCheck, FiLoader } from "react-icons/fi";
import { User, useAuthStore } from "@/app/store/authStore";
import { UserService } from "@/services/UserService";

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
  user: User | null;
  role: string | null;
}

export default function ProfileModal({
  isOpen,
  onClose,
  user,
  role,
}: ProfileModalProps) {
  const { setUser } = useAuthStore();
  const [isEditing, setIsEditing] = useState(false);
  const [newName, setNewName] = useState(user?.name || "");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Sync state if user prop changes
  useEffect(() => {
    if (user) {
      setNewName(user.name);
    }
  }, [user]);

  if (!isOpen || !user) return null;

  const handleUpdateName = async () => {
    if (!newName.trim() || newName === user.name) {
      setIsEditing(false);
      return;
    }

    setIsLoading(true);
    setError(null);
    try {
      const response = await UserService.updateName(newName);
      if (response.success) {
        setUser({ ...user, name: newName });
        setIsEditing(false);
      }
    } catch (err: any) {
      console.error("Failed to update name:", err);
      setError(err.response?.data?.message || "Gagal memperbarui nama.");
    } finally {
      setIsLoading(false);
    }
  };

  const getRoleLabel = (r: string | null) => {
    switch (r) {
      case "volunteer":
        return "Volunteer";
      case "lembaga":
        return "Institution / Organizer";
      case "super_admin":
        return "Super Admin";
      default:
        return r || "User";
    }
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 backdrop-blur-sm transition-opacity" 
        onClick={onClose}
      />

      {/* Modal Content */}
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-sm relative z-10 overflow-hidden animate-in fade-in zoom-in duration-200">
        {/* Header with Background */}
        <div className="h-24 bg-primary-normal relative">
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-white/80 hover:text-white transition-colors z-20"
          >
            <FiX className="w-6 h-6" />
          </button>
        </div>

        {/* Profile Image Overlapping Header */}
        <div className="flex flex-col items-center -mt-12 mb-6 px-6">
          <div className="w-24 h-24 rounded-full bg-white p-1.5 shadow-lg relative z-10">
            <div className="w-full h-full rounded-full overflow-hidden relative border border-gray-100">
               <Image 
                src={`https://ui-avatars.com/api/?name=${user.name}&background=2869ca&color=fff&size=128`} 
                alt={user.name} 
                fill
                className="object-cover"
              />
            </div>
          </div>
          
          {isEditing ? (
            <div className="mt-4 flex flex-col items-center w-full px-4">
              <div className="flex items-center w-full gap-2">
                <input
                  type="text"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  className="flex-1 bg-gray-50 border border-gray-200 rounded-lg px-3 py-1.5 text-sm font-semibold text-center focus:border-primary-normal outline-none"
                  autoFocus
                  disabled={isLoading}
                />
                <button 
                  onClick={handleUpdateName}
                  disabled={isLoading || !newName.trim()}
                  className="p-2 bg-primary-normal text-white rounded-lg hover:bg-primary-normalHover transition-colors disabled:opacity-50"
                >
                  {isLoading ? <FiLoader className="animate-spin" /> : <FiCheck />}
                </button>
                <button 
                  onClick={() => { setIsEditing(false); setNewName(user.name); }}
                  disabled={isLoading}
                  className="p-2 bg-gray-100 text-gray-500 rounded-lg hover:bg-gray-200 transition-colors"
                >
                  <FiX />
                </button>
              </div>
              {error && <p className="text-[10px] text-red-500 mt-1 font-medium">{error}</p>}
            </div>
          ) : (
            <div className="mt-4 flex flex-col items-center group">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                <button 
                  onClick={() => setIsEditing(true)}
                  className="text-gray-300 hover:text-primary-normal transition-colors p-1"
                >
                  <FiEdit2 className="w-4 h-4" />
                </button>
              </div>
              <span className="mt-1 px-3 py-1 bg-blue-50 text-primary-normal text-xs font-bold rounded-full uppercase tracking-wider border border-blue-100">
                 {getRoleLabel(role)}
              </span>
            </div>
          )}
        </div>

        {/* Details */}
        <div className="px-8 pb-10 space-y-5">
          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-light group-hover:text-primary-normal transition-colors">
              <FiUser className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">
                {role === 'lembaga' ? 'Institution Name' : 'Full Name'}
              </p>
              <p className="text-sm font-semibold text-gray-800">{user.name}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-light group-hover:text-primary-normal transition-colors">
              <FiMail className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Email Address</p>
              <p className="text-sm font-semibold text-gray-800">{user.email}</p>
            </div>
          </div>

          <div className="flex items-center gap-4 group">
            <div className="w-10 h-10 rounded-xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-primary-light group-hover:text-primary-normal transition-colors">
              <FiShield className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-bold text-gray-400 uppercase tracking-widest">Account Role</p>
              <p className="text-sm font-semibold text-gray-800">{getRoleLabel(role)}</p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="px-8 py-4 bg-gray-50 flex justify-center">
           <button 
             onClick={onClose}
             className="text-primary-normal font-bold text-sm hover:underline"
           >
             Close
           </button>
        </div>
      </div>
    </div>
  );
}
