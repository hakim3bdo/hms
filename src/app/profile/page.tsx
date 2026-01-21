'use client';

import React, { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlertBox from '@/components/AlertBox';
import { Button } from '@/components/ui/button';
import { User, Bell, AlertCircle, FileText, Edit2 } from 'lucide-react';
import { useAuthContext } from '@/contexts/AuthContext';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

/**
 * Profile Page Component
 */
export default function ProfilePage() {
  const router = useRouter();
  const { user } = useAuthContext();
  const { isAuthenticated, loading } = useProtectedRoute();
  const [error, setError] = useState<string | null>(null);

  if (loading) {
    return <LoadingSpinner fullScreen message="جاري التحميل..." />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen message="جاري إعادة التوجيه..." />;
  }

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center gap-3 mb-4">
            <User size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">الملف الشخصي</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            معلومات الحساب والبيانات الشخصية
          </p>
        </div>

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {/* Profile Information */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-2xl font-bold text-[#132a4f]">بيانات الطالب</h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <p className="text-[#619cba] font-semibold mb-2">الاسم الكامل</p>
              <p className="text-[#132a4f] text-lg">
                {user?.fullName || user?.username || '-'}
              </p>
            </div>

            <div>
              <p className="text-[#619cba] font-semibold mb-2">الرقم القومي</p>
              <p className="text-[#132a4f] text-lg">
                {user?.nationalId || '-'}
              </p>
            </div>

            <div>
              <p className="text-[#619cba] font-semibold mb-2">رقم الهاتف</p>
              <p className="text-[#132a4f] text-lg">
                {user?.phoneNumber || '-'}
              </p>
            </div>

            <div>
              <p className="text-[#619cba] font-semibold mb-2">البريد الإلكتروني</p>
              <p className="text-[#132a4f] text-lg">
                {user?.email || '-'}
              </p>
            </div>

            <div>
              <p className="text-[#619cba] font-semibold mb-2">رقم الطالب</p>
              <p className="text-[#132a4f] text-lg">
                {user?.studentId || '-'}
              </p>
            </div>

            <div>
              <p className="text-[#619cba] font-semibold mb-2">اسم المستخدم</p>
              <p className="text-[#132a4f] text-lg">
                {user?.username || '-'}
              </p>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <button
            onClick={() => router.push('/fees')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 text-right"
          >
            <div className="bg-yellow-100 text-yellow-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <FileText size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#132a4f] mb-2">المصروفات</h3>
            <p className="text-[#619cba] text-sm">عرض مصروفات السكن</p>
          </button>

          <button
            onClick={() => router.push('/complaints')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 text-right"
          >
            <div className="bg-red-100 text-red-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <AlertCircle size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#132a4f] mb-2">الشكاوى</h3>
            <p className="text-[#619cba] text-sm">تقديم أو عرض الشكاوى</p>
          </button>

          <button
            onClick={() => router.push('/notifications')}
            className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 text-right"
          >
            <div className="bg-blue-100 text-blue-600 w-12 h-12 rounded-lg flex items-center justify-center mb-4">
              <Bell size={24} />
            </div>
            <h3 className="text-lg font-bold text-[#132a4f] mb-2">الإشعارات</h3>
            <p className="text-[#619cba] text-sm">عرض جميع الإشعارات</p>
          </button>
        </div>
      </div>
    </MainLayout>
  );
}
