'use client';

import React from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Calendar, Clock } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

/**
 * Dates Page Component
 * 
 * Displays important dates and deadlines for housing applications.
 */
export default function DatesPage() {
  const { isAuthenticated, loading } = useProtectedRoute();

  const importantDates = [
    {
      title: 'بدء التقديم للطلاب المستجدين',
      date: '15 سبتمبر 2024',
      description: 'يبدأ التقديم للطلاب المستجدين الجدد',
      status: 'upcoming',
    },
    {
      title: 'انتهاء التقديم للطلاب المستجدين',
      date: '30 سبتمبر 2024',
      description: 'آخر موعد للتقديم للطلاب المستجدين',
      status: 'upcoming',
    },
    {
      title: 'بدء التقديم للطلاب القدامى',
      date: '1 أكتوبر 2024',
      description: 'يبدأ التقديم للطلاب القدامى',
      status: 'upcoming',
    },
    {
      title: 'انتهاء التقديم للطلاب القدامى',
      date: '15 أكتوبر 2024',
      description: 'آخر موعد للتقديم للطلاب القدامى',
      status: 'upcoming',
    },
    {
      title: 'إعلان النتائج',
      date: '1 نوفمبر 2024',
      description: 'إعلان نتائج القبول والتوزيع',
      status: 'upcoming',
    },
    {
      title: 'الاستقبال والتسكين',
      date: '10 نوفمبر 2024',
      description: 'استقبال الطلاب والتسكين في المدن الجامعية',
      status: 'upcoming',
    },
  ];

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
            <Calendar size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">التواريخ المهمة</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            تواريخ مهمة تتعلق بعملية التقديم والقبول والتسكين
          </p>
        </div>

        {/* Dates List */}
        <div className="space-y-4">
          {importantDates.map((dateItem, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md p-6 border-r-4 border-[#0292B3] hover:shadow-lg transition-shadow"
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-xl font-bold text-[#132a4f] mb-2">
                    {dateItem.title}
                  </h3>
                  <p className="text-[#619cba] mb-3">{dateItem.description}</p>
                  <div className="flex items-center gap-2 text-[#0292B3] font-semibold">
                    <Clock size={18} />
                    <span>{dateItem.date}</span>
                  </div>
                </div>
                <div
                  className={`px-4 py-2 rounded-full text-sm font-semibold whitespace-nowrap ${
                    dateItem.status === 'upcoming'
                      ? 'bg-yellow-100 text-yellow-700'
                      : 'bg-green-100 text-green-700'
                  }`}
                >
                  {dateItem.status === 'upcoming' ? 'قادم' : 'مكتمل'}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Important Note */}
        <div className="bg-blue-50 border-r-4 border-[#0292B3] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">ملاحظة مهمة</h3>
          <p className="text-[#619cba]">
            تأكد من عدم تفويت مواعيد التقديم. يمكنك التقديم فقط خلال الفترة المحددة لكل فئة من الطلاب.
            للمزيد من المعلومات، يرجى الاتصال بإدارة المدن الجامعية.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
