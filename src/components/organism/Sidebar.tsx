'use client';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import Image from 'next/image';
import { useAuthStore } from '@/app/store/authStore';
import { AuthService } from '@/services/AuthService';
import { useState } from 'react';
import ProfileModal from '@/components/molecules/ProfileModal';

interface SidebarProps {
  activeTab?: string;
  isOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ activeTab, isOpen, onClose }: SidebarProps) => {
  const { role, user, clearAuth } = useAuthStore();
  const pathname = usePathname();
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);

  const handleLogout = async () => {
    clearAuth();
    try {
      await AuthService.logout();
    } catch (error) {
      console.error("Logout failed:", error);
    } finally {
      window.location.href = "/";
    }
  };

  const menuItems = role === 'lembaga' 
  ? [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
      href: '/dashboard/pelapor',
    },
    {
      id: 'mission',
      label: 'Mission',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
      href: '/dashboard/pelapor/misi',
    },
    {
      id: 'members',
      label: 'Members',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"></path>
        </svg>
      ),
      href: '/dashboard/pelapor/members',
    },
    {
      id: 'about',
      label: 'About',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      href: '/dashboard/pelapor/about',
    },
  ]

  // Volunteer
  : [
    {
      id: 'home',
      label: 'Home',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6"></path>
        </svg>
      ),
      href: '/dashboard/relawan',
    },
    {
      id: 'mission',
      label: 'Mission',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2m-3 7h3m-3 4h3m-6-4h.01M9 16h.01"></path>
        </svg>
      ),
      href: '/dashboard/relawan/misi',
    },
    {
      id: 'about',
      label: 'About',
      icon: (
        <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path>
        </svg>
      ),
      href: '/dashboard/relawan/about',
    },
  ];

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div 
          className="fixed inset-0 bg-black/40 z-[90] lg:hidden backdrop-blur-sm transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar Container */}
      <div className={`w-64 bg-white flex flex-col h-screen fixed left-0 top-0 shadow-[0_4px_12px_rgba(0,0,0,0.1)] z-[100] transition-transform duration-300 ease-in-out lg:translate-x-0 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Image
              src="/icons/logo_voletra.png"
              alt="Voletra"
              width={32}
              height={32}
              style={{ width: 'auto' }}
            />
            <span className="text-xl font-bold text-blue-600 tracking-wider font-mono uppercase">VOLETRA</span>
          </div>
          
          {/* Mobile Close Button */}
          <button onClick={onClose} className="lg:hidden p-1 text-gray-400 hover:text-gray-600 hover:bg-gray-100 rounded-lg transition-colors">
             <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
             </svg>
          </button>
        </div>

        <nav className="flex-1 px-4 py-4 space-y-2 overflow-y-auto">
          {menuItems.map((item) => {
            const isActive = activeTab === item.id || (
              (item.href === '/dashboard/pelapor' || item.href === '/dashboard/relawan')
                ? pathname === item.href
                : pathname.startsWith(item.href)
            );

            return (
              <Link
                key={item.id}
                href={item.href}
                onClick={onClose}
                className={`flex items-center gap-4 px-4 py-3 rounded-2xl transition-all font-medium ${
                  isActive
                    ? 'bg-primary-lightActive text-[#122F5B]'
                    : 'text-gray-600 hover:bg-primary-light'
                }`}
              >
                {item.icon}
                <span>{item.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 flex items-center justify-between border-t border-gray-100">
          <div 
            onClick={() => setIsProfileModalOpen(true)}
            className="flex items-center gap-3 min-w-0 cursor-pointer hover:bg-gray-50 p-1.5 rounded-xl transition-all flex-1"
          >
            <div className="w-10 h-10 rounded-full bg-gray-200 overflow-hidden relative shrink-0 border border-gray-100 shadow-sm">
              <Image 
                src={`https://ui-avatars.com/api/?name=${user?.name || 'User'}&background=2869ca&color=fff`} 
                alt="Profile" 
                fill
                className="object-cover"
              />
            </div>
            <div className="min-w-0 flex flex-col">
               <span className="font-semibold text-gray-800 truncate text-sm">{user?.name || 'User'}</span>
               <span className="text-[10px] text-gray-400 font-medium uppercase tracking-tighter">View Profile</span>
            </div>
          </div>
          <button 
            onClick={handleLogout}
            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-all shrink-0 ml-2"
            title="Logout"
          >
            <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1"></path>
            </svg>
          </button>
        </div>
      </div>

      <ProfileModal 
        isOpen={isProfileModalOpen} 
        onClose={() => setIsProfileModalOpen(false)} 
        user={user}
        role={role}
      />
    </>
  );
};

export default Sidebar;
