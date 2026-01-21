'use client';

import { useRouter } from 'next/navigation';
import { useAuthContext } from '@/contexts/AuthContext';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FileText, Search, Calendar, HelpCircle, Plus } from 'lucide-react';
import { useEffect } from 'react';
import { authAPI } from '@/services/api';

/**
 * Dashboard/Home Page Component
 * 
 * Main dashboard for authenticated users showing quick actions
 */
export default function Home() {
  const { user, loading, isAuthenticated, refresh } = useAuthContext();
  const router = useRouter();

  useEffect(() => {
    const handleAuth = async () => {
      if (!loading && !isAuthenticated) {
        // Check localStorage as fallback in case context hasn't updated yet
        if (authAPI.isAuthenticated()) {
          // User exists in localStorage but context not updated yet, trigger refresh
          await refresh();
        } else {
          router.push('/login');
        }
      }
    };
    handleAuth();
  }, [loading, isAuthenticated, router, refresh]);

  if (loading) {
    return <LoadingSpinner fullScreen message="جاري التحميل..." />;
  }

  if (!isAuthenticated) {
    return <LoadingSpinner fullScreen message="جاري إعادة التوجيه..." />;
  }

  const quickActions = [
    {
      title: 'تقديم طلب جديد',
      description: 'قدم طلب جديد للسكن الجامعي',
      icon: Plus,
      color: 'bg-blue-100 text-blue-600',
      href: '/new-application',
    },
    {
      title: 'تطبيقاتي',
      description: 'عرض جميع طلباتك المقدمة',
      icon: FileText,
      color: 'bg-green-100 text-green-600',
      href: '/my-applications',
    },
    {
      title: 'الاستفسار عن الطلب',
      description: 'ابحث عن حالة طلبك',
      icon: Search,
      color: 'bg-yellow-100 text-yellow-600',
      href: '/inquiry',
    },
    {
      title: 'التواريخ المهمة',
      description: 'تواريخ التقديم والإعلانات',
      icon: Calendar,
      color: 'bg-purple-100 text-purple-600',
      href: '/dates',
    },
    {
      title: 'التعليمات',
      description: 'اقرأ التعليمات والشروط',
      icon: HelpCircle,
      color: 'bg-red-100 text-red-600',
      href: '/instructions',
    },
  ];

  return (
    <MainLayout>
      <div className="space-y-8">
        {/* Welcome Section */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h1 className="text-3xl font-bold text-[#132a4f] mb-2">
            أهلاً وسهلاً، {user?.username || user?.name || 'مستخدم'}
          </h1>
          <p className="text-[#619cba] text-lg">
            مرحباً بك في منصة إدارة المدن الجامعية بجامعة الغردقة
          </p>
        </div>

        {/* Quick Actions */}
        <div>
          <h2 className="text-2xl font-bold text-white mb-6">الإجراءات السريعة</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {quickActions.map((action) => {
              const Icon = action.icon;
              return (
                <button
                  key={action.title}
                  onClick={() => router.push(action.href)}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-all duration-200 text-right"
                >
                  <div className={`${action.color} w-12 h-12 rounded-lg flex items-center justify-center mb-4`}>
                    <Icon size={24} />
                  </div>
                  <h3 className="text-lg font-bold text-[#132a4f] mb-2">{action.title}</h3>
                  <p className="text-[#619cba] text-sm">{action.description}</p>
                </button>
              );
            })}
          </div>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-r-4 border-[#0292B3] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">معلومات مهمة</h3>
          <p className="text-[#619cba]">
            تأكد من قراءة التعليمات والشروط قبل تقديم طلبك. يمكنك متابعة حالة طلبك من خلال صفحة الاستفسار.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
