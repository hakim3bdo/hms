'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Bell, AlertCircle } from 'lucide-react';
import { studentProfileAPI } from '@/services/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface Notification {
  id: string;
  title: string;
  message: string;
  createdAt: string;
  isRead: boolean;
}

/**
 * Notifications Page Component
 */
export default function NotificationsPage() {
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        setIsLoading(true);
        const data = await studentProfileAPI.getNotifications();
        if (Array.isArray(data)) {
          setNotifications(data as Notification[]);
        }
      } catch (err) {
        console.error('Error fetching notifications:', err);
        setError('فشل تحميل الإشعارات');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchNotifications();
    }
  }, [isAuthenticated]);

  const handleMarkAsRead = async (notificationId: string) => {
    try {
      await studentProfileAPI.markNotificationAsRead(notificationId);
      setNotifications(notifications.map(n => 
        n.id === notificationId ? { ...n, isRead: true } : n
      ));
    } catch (err) {
      console.error('Error marking notification as read:', err);
    }
  };

  if (authLoading) {
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
            <Bell size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">الإشعارات</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            عرض جميع الإشعارات والتنبيهات
          </p>
        </div>

        {/* Notifications List */}
        {isLoading ? (
          <LoadingSpinner message="جاري تحميل الإشعارات..." />
        ) : notifications.length > 0 ? (
          <div className="space-y-4">
            {notifications.map((notification) => (
              <div
                key={notification.id}
                onClick={() => !notification.isRead && handleMarkAsRead(notification.id)}
                className={`bg-white rounded-lg shadow-md p-6 border-r-4 cursor-pointer transition-all ${
                  notification.isRead
                    ? 'border-gray-300 opacity-75'
                    : 'border-[#0292B3] hover:shadow-lg'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <h3 className="font-bold text-[#132a4f] mb-2">
                      {notification.title}
                    </h3>
                    <p className="text-[#619cba] text-sm mb-2">
                      {notification.message}
                    </p>
                    <p className="text-[#619cba] text-xs">
                      {new Date(notification.createdAt).toLocaleDateString('ar-EG', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                        hour: '2-digit',
                        minute: '2-digit',
                      })}
                    </p>
                  </div>
                  {!notification.isRead && (
                    <div className="w-3 h-3 bg-[#0292B3] rounded-full shrink-0 mt-2"></div>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <AlertCircle size={48} className="text-[#619cba] mx-auto mb-4 opacity-50" />
            <p className="text-[#619cba] text-lg mb-2">لا توجد إشعارات</p>
            <p className="text-[#619cba] text-sm">
              ستظهر الإشعارات هنا عند وجود تحديثات جديدة
            </p>
          </div>
        )}
      </div>
    </MainLayout>
  );
}
