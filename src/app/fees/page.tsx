'use client';

import React, { useEffect, useState } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlertBox from '@/components/AlertBox';
import { DollarSign, AlertCircle } from 'lucide-react';
import { studentProfileAPI } from '@/services/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface Fee {
  id: string;
  feeType: string;
  amount: number;
  isPaid: boolean;
  dueDate: string;
}

/**
 * Fees Page Component
 */
export default function FeesPage() {
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const [fees, setFees] = useState<Fee[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchFees = async () => {
      try {
        setIsLoading(true);
        const feesData = await studentProfileAPI.getFees();
        if (Array.isArray(feesData)) {
          setFees(feesData as Fee[]);
        }
      } catch (err) {
        console.error('Error fetching fees:', err);
        setError('فشل تحميل بيانات المصروفات. يرجى المحاولة لاحقاً.');
      } finally {
        setIsLoading(false);
      }
    };

    if (isAuthenticated) {
      fetchFees();
    }
  }, [isAuthenticated]);

  const calculateTotalFees = () => fees.reduce((sum, fee) => sum + (fee.amount ?? 0), 0);
  const calculatePaidFees = () => fees.filter((fee) => fee.isPaid).reduce((sum, fee) => sum + (fee.amount ?? 0), 0);
  const calculatePendingFees = () => fees.filter((fee) => !fee.isPaid).reduce((sum, fee) => sum + (fee.amount ?? 0), 0);

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
            <DollarSign size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">المصروفات</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            عرض مصروفات السكن الجامعي وحالة السداد
          </p>
        </div>

        {error && (
          <AlertBox
            type="error"
            message={error}
            onClose={() => setError(null)}
          />
        )}

        {isLoading ? (
          <LoadingSpinner message="جاري تحميل بيانات المصروفات..." />
        ) : fees.length > 0 ? (
          <>
            {/* Summary Cards */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-[#0292B3]">
                <p className="text-[#619cba] font-semibold mb-2">إجمالي المصروفات</p>
                <p className="text-[#132a4f] text-3xl font-bold">
                  {calculateTotalFees().toFixed(2)} ج.م
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-green-500">
                <p className="text-[#619cba] font-semibold mb-2">المدفوع</p>
                <p className="text-green-600 text-3xl font-bold">
                  {calculatePaidFees().toFixed(2)} ج.م
                </p>
              </div>
              <div className="bg-white rounded-lg shadow-md p-6 border-r-4 border-red-500">
                <p className="text-[#619cba] font-semibold mb-2">المتبقي</p>
                <p className="text-red-600 text-3xl font-bold">
                  {calculatePendingFees().toFixed(2)} ج.م
                </p>
              </div>
            </div>

            {/* Fees List */}
            <div className="bg-white rounded-lg shadow-md p-8">
              <h2 className="text-2xl font-bold text-[#132a4f] mb-6">تفاصيل المصروفات</h2>
              <div className="space-y-4">
                {fees.map((fee) => (
                  <div
                    key={fee.id}
                    className="bg-gray-50 rounded-lg p-4 border-r-4 border-[#0292B3] flex items-center justify-between"
                  >
                    <div>
                      <h3 className="font-bold text-[#132a4f]">{fee.feeType}</h3>
                      <p className="text-[#619cba] text-sm">
                        استحقاق: {new Date(fee.dueDate).toLocaleDateString('ar-EG')}
                      </p>
                    </div>
                    <div className="flex items-center gap-4">
                      <p className="text-[#132a4f] text-lg font-bold">
                        {fee.amount.toFixed(2)} ج.م
                      </p>
                      <span
                        className={`px-3 py-1 rounded-full text-sm font-semibold ${
                          fee.isPaid
                            ? 'bg-green-100 text-green-700'
                            : 'bg-red-100 text-red-700'
                        }`}
                      >
                        {fee.isPaid ? 'مدفوع' : 'غير مدفوع'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        ) : (
          <div className="bg-gray-50 rounded-lg p-8 text-center">
            <AlertCircle size={48} className="text-[#619cba] mx-auto mb-4 opacity-50" />
            <p className="text-[#619cba] text-lg mb-2">لا توجد مصروفات</p>
            <p className="text-[#619cba] text-sm">
              لم يتم تحديد أي مصروفات للطالب حالياً
            </p>
          </div>
        )}

        <div className="bg-blue-50 border-r-4 border-[#0292B3] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">معلومات مهمة</h3>
          <p className="text-[#619cba]">
            تأكد من سداد المصروفات في الموعد المحدد. في حالة وجود استفسارات بخصوص المصروفات،
            يرجى التواصل مع إدارة المدن الجامعية.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
