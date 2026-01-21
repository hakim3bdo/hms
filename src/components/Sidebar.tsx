'use client';

import React from 'react';
import { X, Home, FileText, Calendar, HelpCircle, Search, User, DollarSign, AlertCircle, Bell } from 'lucide-react';
import { usePathname, useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';

interface SidebarProps {
  isOpen: boolean;
  onClose: () => void;
}

interface MenuSection {
  title: string;
  items: MenuItem[];
}

interface MenuItem {
  label: string;
  icon: React.ComponentType<{ size?: number }>;
  href: string;
  id: string;
}

/**
 * Sidebar Component
 * 
 * Navigation sidebar for authenticated pages.
 * Shows main navigation menu items including student profile, fees, complaints, and notifications.
 * Navigation is organized into clear sections for better usability.
 * 
 * Uses AuthContext to access user data without prop drilling
 */
export default function Sidebar({ isOpen, onClose }: SidebarProps) {
  const pathname = usePathname();
  const router = useRouter();
  const { user } = useAuthContext();

  const menuSections: MenuSection[] = [
    {
      title: 'الأساسيات',
      items: [
        { label: 'الرئيسية', icon: Home, href: '/dashboard', id: 'dashboard' },
        { label: 'الملف الشخصي', icon: User, href: '/profile', id: 'profile' },
      ],
    },
    {
      title: 'الطلبات',
      items: [
        { label: 'تقديم طلب جديد', icon: FileText, href: '/new-application', id: 'new-app' },
        { label: 'طلباتي', icon: FileText, href: '/my-applications', id: 'my-apps' },
        { label: 'الاستعلام عن الطلب', icon: Search, href: '/inquiry', id: 'inquiry' },
      ],
    },
    {
      title: 'الخدمات',
      items: [
        { label: 'المصروفات', icon: DollarSign, href: '/fees', id: 'fees' },
        { label: 'الإشعارات', icon: Bell, href: '/notifications', id: 'notifications' },
        { label: 'الشكاوى', icon: AlertCircle, href: '/complaints', id: 'complaints' },
      ],
    },
    {
      title: 'معلومات',
      items: [
        { label: 'التواريخ المهمة', icon: Calendar, href: '/dates', id: 'dates' },
        { label: 'التعليمات', icon: HelpCircle, href: '/instructions', id: 'instructions' },
      ],
    },
  ];

  const isActive = (href: string) => pathname === href;

  return (
    <>
      {/* Mobile Overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/50 lg:hidden z-40"
          onClick={onClose}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`fixed lg:static top-0 right-0 h-screen w-64 bg-gradient-to-b from-[#0d1f2d] to-[#0d3a52] text-white transform transition-transform duration-300 z-50 lg:z-auto ${
          isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'
        }`}
      >
        {/* Close Button (Mobile Only) */}
        <div className="lg:hidden p-4 flex justify-between items-center border-b border-white/10">
          <h2 className="font-bold">القائمة</h2>
          <button
            onClick={onClose}
            className="p-1 hover:bg-white/10 rounded transition-colors"
            aria-label="Close sidebar"
          >
            <X size={20} />
          </button>
        </div>

        {/* Navigation Menu - Organized by Sections */}
        <nav className="p-4 space-y-6 overflow-y-auto max-h-[calc(100vh-120px)]">
          {menuSections.map((section, sectionIndex) => (
            <div key={section.title} className={sectionIndex > 0 ? 'pt-4 border-t border-white/10' : ''}>
              {/* Section Title */}
              <h3 className="text-xs font-semibold text-white/60 uppercase tracking-wider px-2 mb-2">
                {section.title}
              </h3>
              
              {/* Section Items */}
              <div className="space-y-1">
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const active = isActive(item.href);

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        router.push(item.href);
                        onClose();
                      }}
                      className={`w-full flex items-center gap-3 px-4 py-3 rounded-lg transition-all duration-200 ${
                        active
                          ? 'bg-[#0292B3] text-white shadow-lg'
                          : 'text-white/80 hover:bg-white/10'
                      }`}
                    >
                      <Icon size={20} />
                      <span className="font-medium text-sm">{item.label}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </nav>

        {/* Footer Info */}
        <div className="absolute bottom-0 left-0 right-0 p-4 border-t border-white/10 text-xs text-white/60">
          <p className="font-semibold text-white mb-2">{user?.name || 'مستخدم'}</p>
          <p>جامعة الغردقة</p>
          <p>إدارة المدن الجامعية</p>
        </div>
      </aside>
    </>
  );
}
