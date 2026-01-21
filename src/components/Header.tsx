'use client';

import React, { useState } from 'react';
import { Menu, LogOut } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useRouter } from 'next/navigation';

interface HeaderProps {
  onMenuClick: () => void;
  isSidebarOpen: boolean;
}

/**
 * Header Component
 * 
 * Main navigation header for authenticated pages.
 * Displays logo, navigation, and user menu.
 * 
 * Uses AuthContext to access user data without prop drilling
 */
export default function Header({ onMenuClick, isSidebarOpen }: HeaderProps) {
  const { user, logout } = useAuthContext();
  const router = useRouter();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      await logout();
      router.push('/login');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <header className="bg-white shadow-md border-b border-gray-200">
      <div className="px-4 lg:px-8 py-4 flex items-center justify-between">
        {/* Left: Menu Button & Logo */}
        <div className="flex items-center gap-4">
          <button
            onClick={onMenuClick}
            className="lg:hidden p-2 hover:bg-gray-100 rounded-lg transition-colors"
            aria-label="Toggle sidebar"
          >
            <Menu size={24} className="text-[#132a4f]" />
          </button>

          <div className="flex items-center gap-2">
            <img 
              src="/logo.png" 
              alt="جامعة الغردقة" 
              className="h-10 w-10 object-contain"
            />
            <div>
              <h1 className="text-lg font-bold text-[#132a4f]">جامعة الغردقة</h1>
              <p className="text-xs text-[#619cba]">إدارة المدن الجامعية</p>
            </div>
          </div>
        </div>

        {/* Right: User Menu */}
        <div className="flex items-center gap-4">
          {user && (
            <>
              <div className="text-right hidden sm:block">
                <p className="text-sm font-semibold text-[#132a4f]">{user.name || 'مستخدم'}</p>
                <p className="text-xs text-[#619cba]">{user.email}</p>
              </div>
              
              <button
                onClick={handleLogout}
                disabled={isLoggingOut}
                className="p-2 hover:bg-red-50 rounded-lg transition-colors text-[#E01C46] disabled:opacity-50"
                aria-label="Logout"
              >
                <LogOut size={20} />
              </button>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
