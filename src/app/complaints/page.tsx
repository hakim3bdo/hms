'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlertBox from '@/components/AlertBox';
import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { AlertCircle } from 'lucide-react';
import { studentComplaintsAPI } from '@/services/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

/**
 * Complaints Page Component
 */
export default function ComplaintsPage() {
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    if (!title.trim() || !description.trim()) {
      setError('يرجى ملء جميع الحقول المطلوبة');
      return;
    }

    try {
      setIsSubmitting(true);
      await studentComplaintsAPI.submitComplaint(title, description);
      setSuccess('تم تقديم الشكوى بنجاح!');
      setTitle('');
      setDescription('');
    } catch (err: unknown) {
      const error = err as Error;
      setError(error.message || 'فشل تقديم الشكوى');
    } finally {
      setIsSubmitting(false);
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
            <AlertCircle size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">الشكاوى والمقترحات</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            تقديم شكوى أو اقتراح لإدارة المدن الجامعية
          </p>
        </div>

        {/* Complaint Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-[#132a4f] mb-6">تقديم شكوى جديدة</h2>

          {error && (
            <div className="mb-4">
              <AlertBox
                type="error"
                message={error}
                onClose={() => setError(null)}
              />
            </div>
          )}

          {success && (
            <div className="mb-4">
              <AlertBox
                type="success"
                message={success}
                onClose={() => setSuccess(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <FormInput
              label="عنوان الشكوى"
              placeholder="أدخل عنوان الشكوى"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              maxLength={100}
              required
            />

            <div className="mb-6">
              <label className="block mb-2 text-sm font-semibold text-[#132a4f]">
                تفاصيل الشكوى <span className="text-[#E01C46]">*</span>
              </label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="اكتب تفاصيل الشكوى هنا..."
                className="w-full px-4 py-3 border-2 rounded-lg font-medium text-[#132a4f] placeholder-gray-400 transition-all duration-200 focus:outline-none focus:ring-0 border-[#E0E0E0] bg-[#FAFAFA] focus:border-[#0d5a7a] focus:bg-white min-h-37.5 resize-none"
                maxLength={500}
                required
              />
              <p className="text-[#619cba] text-sm mt-1">
                {description.length}/500 حرف
              </p>
            </div>

            <Button
              type="submit"
              disabled={isSubmitting}
              className="w-full bg-linear-to-r from-[#0d3a52] to-[#0d5a7a] hover:from-[#0d5a7a] hover:to-[#0d7a9a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
            >
              {isSubmitting ? 'جاري الإرسال...' : 'إرسال الشكوى'}
            </Button>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-r-4 border-[#0292B3] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">معلومات مهمة</h3>
          <p className="text-[#619cba]">
            سيتم مراجعة شكواك والرد عليها في أقرب وقت ممكن. يمكنك متابعة حالة الشكوى من خلال صفحة الإشعارات.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
