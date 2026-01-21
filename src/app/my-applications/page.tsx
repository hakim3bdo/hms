'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { FileText, Loader } from 'lucide-react';
import { applicationAPI } from '@/services/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface Application {
  id: number;
  studentType: string;
  fullName: string;
  studentId: string;
  major: string;
  status: string;
  submittedAt: string;
}

/**
 * My Applications Page Component
 * 
 * Displays the student's submitted applications.
 */
export default function MyApplicationsPage() {
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const [applications, setApplications] = useState<Application[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchApplications = async () => {
      try {
        setIsLoading(true);
        const data = await applicationAPI.getMyApplications();
        setApplications(data as Application[]);
      } catch (err: unknown) {
        const error = err as Error;
        setError(error.message || 'حدث خطأ أثناء تحميل الطلبات');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchApplications();
    }
  }, [isAuthenticated]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'bg-blue-100 text-blue-700';
      case 'review':
        return 'bg-yellow-100 text-yellow-700';
      case 'approved':
        return 'bg-green-100 text-green-700';
      case 'rejected':
        return 'bg-red-100 text-red-700';
      default:
        return 'bg-gray-100 text-gray-700';
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'submitted':
        return 'تم التقديم';
      case 'review':
        return 'قيد المراجعة';
      case 'approved':
        return 'موافق عليه';
      case 'rejected':
        return 'مرفوض';
      default:
        return status;
    }
  };

  const getStudentTypeLabel = (type: string) => {
    return type === 'new' ? 'طالب مستجد' : 'طالب قديم';
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
            <FileText size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">تطبيقاتي</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            عرض جميع الطلبات المقدمة من قبلك
          </p>
        </div>

        {/* Loading State */}
        {isLoading && (
          <div className="bg-white rounded-lg shadow-md p-8 text-center">
            <Loader size={32} className="text-[#0292B3] mx-auto mb-4 animate-spin" />
            <p className="text-[#619cba]">جاري تحميل الطلبات...</p>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="bg-red-50 border-r-4 border-red-500 rounded-lg p-6">
            <h3 className="text-lg font-bold text-red-700 mb-2">حدث خطأ</h3>
            <p className="text-red-600">{error}</p>
          </div>
        )}

        {/* Applications List */}
        {!isLoading && !error && (
          <div className="space-y-4">
            {applications && applications.length > 0 ? (
              applications.map((app) => (
                <div
                  key={app.id}
                  className="bg-white rounded-lg shadow-md p-6 hover:shadow-lg transition-shadow"
                >
                  <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                    <div className="flex-1 min-w-0">
                      <h3 className="text-lg font-bold text-[#132a4f] mb-4">
                        {getStudentTypeLabel(app.studentType)}
                      </h3>
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm">
                        <div className="wrap-break-word">
                          <p className="text-[#619cba] font-semibold mb-1">الاسم الكامل</p>
                          <p className="text-[#132a4f] wrap-break-word">{app.fullName}</p>
                        </div>
                        <div className="wrap-break-word">
                          <p className="text-[#619cba] font-semibold mb-1">الرقم القومي للطالب</p>
                          <p className="text-[#132a4f] break-all">{app.studentId}</p>
                        </div>
                        <div className="wrap-break-word">
                          <p className="text-[#619cba] font-semibold mb-1">التخصص</p>
                          <p className="text-[#132a4f] wrap-break-word">{app.major}</p>
                        </div>
                        <div className="wrap-break-word">
                          <p className="text-[#619cba] font-semibold mb-1">تاريخ التقديم</p>
                          <p className="text-[#132a4f]">
                            {new Date(app.submittedAt).toLocaleDateString('ar-EG')}
                          </p>
                        </div>
                      </div>
                    </div>
                    <div className="shrink-0 lg:ml-4">
                      <div className={`px-4 py-2 rounded-full font-semibold text-center ${getStatusColor(app.status)}`}>
                        {getStatusLabel(app.status)}
                      </div>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="bg-gray-50 rounded-lg p-8 text-center">
                <FileText size={48} className="text-[#619cba] mx-auto mb-4 opacity-50" />
                <p className="text-[#619cba] text-lg mb-2">لم تقدم أي طلبات حتى الآن</p>
                <p className="text-[#619cba] text-sm">
                  ابدأ بتقديم طلب جديد من خلال صفحة "تقديم طلب جديد"
                </p>
              </div>
            )}
          </div>
        )}
      </div>
    </MainLayout>
  );
}
