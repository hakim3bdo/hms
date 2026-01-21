'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import FormInput from '@/components/FormInput';
import AlertBox from '@/components/AlertBox';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { applicationAPI } from '@/services/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

interface SearchResult {
  id?: number;
  fullName?: string;
  studentName?: string;
  name?: string;
  nationalId?: string;
  studentId?: string;
  nationalID?: string;
  studentType?: string;
  major?: string;
  department?: string;
  specialization?: string;
  status?: string;
  submittedAt?: string;
  createdAt?: string;
  date?: string;
  submissionDate?: string;
  updatedAt?: string;
  modifiedAt?: string;
  lastUpdate?: string;
  governorate?: string;
  address?: string;
  email?: string;
  phone?: string;
}

/**
 * Inquiry Page Component
 * 
 * Allows students to search for their application status using their national ID.
 */
export default function InquiryPage() {
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const [searchValue, setSearchValue] = useState('');
  const [result, setResult] = useState<SearchResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [hasSearched, setHasSearched] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const isValidNationalId = (id: string): boolean => {
    return /^\d{14}$/.test(id.trim());
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

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setResult(null);
    setHasSearched(true);

    const cleanedValue = searchValue.trim().replace(/\D/g, '');

    if (!cleanedValue) {
      setError('يرجى إدخال الرقم القومي');
      return;
    }

    if (!isValidNationalId(cleanedValue)) {
      setError('الرقم القومي يجب أن يكون 14 رقم');
      return;
    }

    setSearchValue(cleanedValue);
    setIsLoading(true);

    try {
      const applications = await applicationAPI.searchByNationalId(cleanedValue);

      if (!applications || applications.length === 0) {
        setError('عذرًا، لم يتم العثور على طلب بهذا الرقم القومي');
        setResult(null);
        return;
      }

      const sorted = [...applications].sort((a, b) => {
        const appA = a as SearchResult;
        const appB = b as SearchResult;
        const dateA = new Date((appA.submittedAt || appA.createdAt || appA.date || '0') as string).getTime();
        const dateB = new Date((appB.submittedAt || appB.createdAt || appB.date || '0') as string).getTime();
        return dateB - dateA;
      });

      setResult(sorted[0] as SearchResult);
      setError(null);
    } catch (err: unknown) {
      const error = err as { message?: string; response?: { status?: number } };
      console.error('[Inquiry] Error searching:', err);

      let errorMessage = 'فشل الاتصال بالخادم، يرجى المحاولة لاحقاً';

      if (error?.message?.includes('لم يتم العثور')) {
        errorMessage = 'عذرًا، لم يتم العثور على طلب بهذا الرقم القومي';
      } else if (error?.response?.status === 404) {
        errorMessage = 'عذرًا، لم يتم العثور على طلب بهذا الرقم القومي';
      } else if (error?.message) {
        errorMessage = error.message;
      }

      setError(errorMessage);
      setResult(null);
    } finally {
      setIsLoading(false);
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
            <Search size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">الاستفسار عن الطلب</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            ابحث عن حالة طلبك باستخدام الرقم القومي للطالب
          </p>
        </div>

        {/* Search Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <form onSubmit={handleSearch} className="space-y-6">
            <div>
              <FormInput
                label="الرقم القومي للطالب"
                placeholder="أدخل الرقم القومي (14 رقم)"
                value={searchValue}
                onChange={(e) => {
                  const value = e.target.value.replace(/\D/g, '');
                  setSearchValue(value.slice(0, 14));
                }}
                required
                maxLength={14}
              />
              <p className="text-sm text-[#619cba] mt-2">
                أدخل الرقم القومي المصري الخاص بك (14 رقم)
              </p>
            </div>

            {error && (
              <AlertBox
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            )}

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full bg-linear-to-r from-[#0d3a52] to-[#0d5a7a] hover:from-[#0d5a7a] hover:to-[#0d7a9a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isLoading ? 'جاري البحث...' : 'البحث'}
            </Button>
          </form>
        </div>

        {isLoading && <LoadingSpinner message="جاري البحث عن الطلب..." />}

        {result && hasSearched && (
          <div className="bg-white rounded-lg shadow-md p-8 space-y-6">
            <div className="flex items-center justify-between">
              <h2 className="text-2xl font-bold text-[#132a4f]">نتيجة البحث</h2>
              <div
                className={`px-4 py-2 rounded-full font-semibold ${
                  result.status === 'submitted' || result.status === 'تم التقديم'
                    ? 'bg-blue-100 text-blue-700'
                    : result.status === 'review' || result.status === 'قيد المراجعة'
                    ? 'bg-yellow-100 text-yellow-700'
                    : result.status === 'approved' || result.status === 'موافق عليه'
                    ? 'bg-green-100 text-green-700'
                    : result.status === 'rejected' || result.status === 'مرفوض'
                    ? 'bg-red-100 text-red-700'
                    : 'bg-gray-100 text-gray-700'
                }`}
              >
                {result.status ? getStatusLabel(result.status) : 'غير محدد'}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <p className="text-[#619cba] text-sm mb-1">اسم الطالب</p>
                <p className="text-[#132a4f] font-semibold text-lg">
                  {result.fullName || result.studentName || result.name || 'غير متوفر'}
                </p>
              </div>
              <div>
                <p className="text-[#619cba] text-sm mb-1">الرقم القومي</p>
                <p className="text-[#132a4f] font-semibold text-lg">
                  {result.nationalId || result.studentId || result.nationalID || 'غير متوفر'}
                </p>
              </div>
              <div>
                <p className="text-[#619cba] text-sm mb-1">نوع الطالب</p>
                <p className="text-[#132a4f] font-semibold text-lg">
                  {result.studentType === 'new' ? 'طالب مستجد' : result.studentType === 'old' ? 'طالب قديم' : result.studentType || 'غير محدد'}
                </p>
              </div>
              <div>
                <p className="text-[#619cba] text-sm mb-1">التخصص</p>
                <p className="text-[#132a4f] font-semibold text-lg">
                  {result.major || result.department || result.specialization || 'غير متوفر'}
                </p>
              </div>
              <div>
                <p className="text-[#619cba] text-sm mb-1">تاريخ التقديم</p>
                <p className="text-[#132a4f] font-semibold text-lg">
                  {result.submittedAt || result.createdAt || result.date
                    ? new Date(result.submittedAt || result.createdAt || result.date || '').toLocaleDateString('ar-EG')
                    : 'غير متوفر'}
                </p>
              </div>
            </div>
          </div>
        )}

        {hasSearched && !result && !isLoading && !error && (
          <div className="bg-yellow-50 border-r-4 border-yellow-500 rounded-lg p-6">
            <p className="text-yellow-700">
              لم يتم العثور على طلب بهذا الرقم القومي. تأكد من إدخال الرقم بشكل صحيح.
            </p>
          </div>
        )}

        <div className="bg-blue-50 border-r-4 border-[#0292B3] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">معلومات مهمة</h3>
          <p className="text-[#619cba]">
            يتم تحديث حالة الطلب بشكل دوري. إذا لم تجد طلبك، تأكد من إدخال البيانات بشكل صحيح.
            للمزيد من المساعدة، يرجى التواصل مع إدارة المدن الجامعية.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
