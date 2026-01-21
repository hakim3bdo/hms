'use client';

import React, { useState, useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useRouter } from 'next/navigation';
import { User, Lock, IdCard, Mail, Phone, CreditCard } from 'lucide-react';
import AuthLayout from '@/components/AuthLayout';
import FormInput from '@/components/FormInput';
import AlertBox from '@/components/AlertBox';
import { Button } from '@/components/ui/button';
import { authAPI } from '@/services/api';
import { useAuthContext } from '@/contexts/AuthContext';

// Validation schema
const signupSchema = z.object({
  username: z.string().min(3, 'اسم المستخدم يجب أن يكون 3 أحرف على الأقل'),
  studentId: z.string().min(1, 'الرقم الجامعي مطلوب'),
  password: z.string().min(6, 'كلمة المرور يجب أن تكون 6 أحرف على الأقل'),
  confirmPassword: z.string().min(1, 'تأكيد كلمة المرور مطلوب'),
  fullName: z.string().min(3, 'الاسم الكامل مطلوب'),
  nationalId: z.string()
    .min(1, 'الرقم القومي مطلوب')
    .regex(/^[0-9]{14}$/, 'الرقم القومي يجب أن يكون 14 رقم بالضبط'),
  phoneNumber: z.string()
    .min(1, 'رقم الهاتف مطلوب')
    .regex(/^01[0-9]{9}$/, 'رقم الهاتف يجب أن يكون 11 رقم يبدأ بـ 01'),
  email: z.string().email('البريد الإلكتروني غير صحيح'),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'كلمات المرور غير متطابقة',
  path: ['confirmPassword'],
});

type SignupFormData = z.infer<typeof signupSchema>;

/**
 * Signup Page Component
 * 
 * Student registration page with form validation and API integration.
 */
export default function SignupPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useAuthContext();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<SignupFormData>({
    resolver: zodResolver(signupSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = async (data: SignupFormData) => {
    try {
      setIsSubmitting(true);
      setGeneralError(null);
      
      await authAPI.register({
        userName: data.username,
        password: data.password,
        role: 'student',
        studentId: parseInt(data.studentId) || undefined,
      });
      
      router.push('/login');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setGeneralError(err?.response?.data?.message || err?.message || 'فشل إنشاء الحساب');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="إنشاء حساب جديد"
      subtitle="سجل بياناتك للانضمام إلى منصة المدن الجامعية"
    >
      {/* General Error */}
      {generalError && (
        <div className="mb-6">
          <AlertBox
            type="error"
            title="خطأ في إنشاء الحساب"
            message={generalError}
            onClose={() => setGeneralError(null)}
          />
        </div>
      )}

      {/* Signup Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2 max-h-[70vh] overflow-y-auto">
        {/* Username Field */}
        <FormInput
          label="اسم المستخدم"
          placeholder="أدخل اسم المستخدم"
          icon={<User size={20} />}
          error={errors.username?.message}
          required
          {...register('username')}
        />

        {/* Student ID Field */}
        <FormInput
          label="الرقم الجامعي (Student ID)"
          type="number"
          placeholder="أدخل الرقم الجامعي"
          icon={<IdCard size={20} />}
          error={errors.studentId?.message}
          required
          {...register('studentId')}
        />

        {/* Full Name Field */}
        <FormInput
          label="الاسم الكامل"
          placeholder="أدخل اسمك الكامل"
          icon={<User size={20} />}
          error={errors.fullName?.message}
          required
          {...register('fullName')}
        />

        {/* National ID Field */}
        <FormInput
          label="الرقم القومي"
          placeholder="14 رقم - مثال: 30303030303030"
          icon={<CreditCard size={20} />}
          error={errors.nationalId?.message}
          maxLength={14}
          required
          {...register('nationalId')}
        />

        {/* Phone Number Field */}
        <FormInput
          label="رقم الهاتف"
          placeholder="11 رقم - مثال: 01000000000"
          icon={<Phone size={20} />}
          error={errors.phoneNumber?.message}
          maxLength={11}
          required
          {...register('phoneNumber')}
        />

        {/* Email Field */}
        <FormInput
          label="البريد الإلكتروني"
          type="email"
          placeholder="أدخل البريد الإلكتروني"
          icon={<Mail size={20} />}
          error={errors.email?.message}
          required
          {...register('email')}
        />

        {/* Password Field */}
        <FormInput
          label="كلمة المرور"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={20} />}
          error={errors.password?.message}
          required
          showPasswordToggle
          {...register('password')}
        />

        {/* Confirm Password Field */}
        <FormInput
          label="تأكيد كلمة المرور"
          type="password"
          placeholder="••••••••"
          icon={<Lock size={20} />}
          error={errors.confirmPassword?.message}
          required
          showPasswordToggle
          {...register('confirmPassword')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-linear-to-r from-[#0d3a52] to-[#0d5a7a] hover:from-[#0d5a7a] hover:to-[#0d7a9a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري الإنشاء...' : 'إنشاء حساب'}
        </Button>
      </form>

      {/* Login Link */}
      <div className="mt-6 text-center">
        <p className="text-[#619cba] text-sm">
          لديك حساب بالفعل؟{' '}
          <button
            onClick={() => router.push('/login')}
            className="text-[#0d5a7a] font-semibold hover:underline transition-colors"
          >
            تسجيل الدخول
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
