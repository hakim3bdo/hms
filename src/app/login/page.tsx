'use client';

import AlertBox from '@/components/AlertBox';
import AuthLayout from '@/components/AuthLayout';
import FormInput from '@/components/FormInput';
import { Button } from '@/components/ui/button';
import { useAuthContext } from '@/contexts/AuthContext';
import { authAPI } from '@/services/api';
import { zodResolver } from '@hookform/resolvers/zod';
import { Lock, User } from 'lucide-react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';

// Validation schema
const loginSchema = z.object({
  username: z.string().min(1, 'اسم المستخدم مطلوب'),
  password: z.string().min(1, 'كلمة المرور مطلوبة'),
});

type LoginFormData = z.infer<typeof loginSchema>;

/**
 * Login Page Component
 * 
 * Student login page with form validation and API integration.
 */
export default function LoginPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading, refresh } = useAuthContext();
  const [showPassword, setShowPassword] = useState(false);
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  // Redirect if already authenticated
  useEffect(() => {
    if (!authLoading && isAuthenticated) {
      router.push('/');
    }
  }, [authLoading, isAuthenticated, router]);

  const onSubmit = async (data: LoginFormData) => {
    try {
      setIsSubmitting(true);
      setGeneralError(null);
      
      // Login and store token
      await authAPI.login(data.username, data.password);
      
      // Refresh auth context to read the new token from localStorage
      await refresh();
      
      // Redirect to home page
      router.replace('/');
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setGeneralError(err?.response?.data?.message || err?.message || 'فشل تسجيل الدخول');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AuthLayout
      title="مرحباً بعودتك"
      subtitle="سجل دخولك للوصول إلى حسابك والاستمتاع بخدماتنا"
    >
      {/* General Error */}
      {generalError && (
        <div className="mb-6">
          <AlertBox
            type="error"
            title="خطأ في تسجيل الدخول"
            message={generalError}
            onClose={() => setGeneralError(null)}
          />
        </div>
      )}

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-2">
        {/* Username Field */}
        <FormInput
          label="اسم المستخدم"
          placeholder="أدخل اسم المستخدم"
          icon={<User size={20} />}
          error={errors.username?.message}
          required
          {...register('username')}
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
          onPasswordToggle={setShowPassword}
          {...register('password')}
        />

        {/* Submit Button */}
        <Button
          type="submit"
          disabled={isSubmitting}
          className="w-full mt-6 bg-linear-to-r from-[#0d3a52] to-[#0d5a7a] hover:from-[#0d5a7a] hover:to-[#0d7a9a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
        >
          {isSubmitting ? 'جاري التحميل...' : 'تسجيل الدخول'}
        </Button>
      </form>

      {/* Signup Link */}
      <div className="mt-6 text-center">
        <p className="text-[#619cba] text-sm">
          ليس لديك حساب؟{' '}
          <button
            onClick={() => router.push('/signup')}
            className="text-[#0d5a7a] font-semibold hover:underline transition-colors"
          >
            إنشاء حساب جديد
          </button>
        </p>
      </div>
    </AuthLayout>
  );
}
