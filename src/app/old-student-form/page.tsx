'use client';

import React, { useState, useEffect, useRef } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { useRouter } from 'next/navigation';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import AlertBox from '@/components/AlertBox';
import FormInput from '@/components/FormInput';
import FormSelect from '@/components/FormSelect';
import { Button } from '@/components/ui/button';
import { FileText, User, IdCard, Mail, Phone, MapPin, GraduationCap, Users, Calendar, Briefcase } from 'lucide-react';
import { applicationAPI } from '@/services/api';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';
import { 
  governorates, 
  genderOptions, 
  religionOptions, 
  guardianRelationOptions, 
  gradeOptions,
  levelOptions,
  oldStudentApplicationSchema, 
  type OldStudentApplicationFormData 
} from '@/lib/applicationConstants';

/**
 * Old Student Application Form Page
 * 
 * Allows existing/continuing students to submit housing applications.
 */
export default function OldStudentFormPage() {
  const router = useRouter();
  const { isAuthenticated, loading: authLoading } = useProtectedRoute();
  const [generalError, setGeneralError] = useState<string | null>(null);
  const [success, setSuccess] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const isMountedRef = useRef(true);

  useEffect(() => {
    return () => {
      isMountedRef.current = false;
    };
  }, []);

  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
    watch,
  } = useForm<OldStudentApplicationFormData>({
    resolver: zodResolver(oldStudentApplicationSchema),
    defaultValues: {
      selectedGuardianRelation: 'father',
    },
  });

  const selectedGuardianRelation = watch('selectedGuardianRelation');

  const onSubmit = async (data: OldStudentApplicationFormData) => {
    try {
      setIsSubmitting(true);
      setGeneralError(null);
      setSuccess(null);

      await applicationAPI.submitApplication({
        studentType: 1, // 1 for old student
        studentInfo: {
          nationalId: data.studentInfo.nationalId,
          fullName: data.studentInfo.fullName,
          birthDate: new Date(data.studentInfo.birthDate).toISOString(),
          birthPlace: data.studentInfo.birthPlace,
          gender: data.studentInfo.gender,
          religion: data.studentInfo.religion,
          governorate: data.studentInfo.governorate,
          city: data.studentInfo.city,
          address: data.studentInfo.address,
          email: data.studentInfo.email,
          phone: data.studentInfo.phone,
          faculty: data.studentInfo.faculty,
          department: data.studentInfo.department,
          level: data.studentInfo.level,
        },
        fatherInfo: {
          fullName: data.fatherInfo.fullName,
          nationalId: data.fatherInfo.nationalId,
          relation: 'father',
          job: data.fatherInfo.job,
          phoneNumber: data.fatherInfo.phoneNumber,
          address: data.fatherInfo.address,
        },
        selectedGuardianRelation: data.selectedGuardianRelation,
        otherGuardianInfo: data.selectedGuardianRelation !== 'father' && data.otherGuardianInfo ? {
          fullName: data.otherGuardianInfo.fullName,
          nationalId: data.otherGuardianInfo.nationalId,
          relation: data.selectedGuardianRelation,
          job: data.otherGuardianInfo.job,
          phoneNumber: data.otherGuardianInfo.phoneNumber,
          address: data.otherGuardianInfo.address,
        } : undefined,
        academicInfo: {
          currentGPA: Number(data.academicInfo.currentGPA),
          lastYearGrade: data.academicInfo.lastYearGrade,
        },
      });

      setSuccess('تم تقديم الطلب بنجاح! سيتم مراجعته والرد عليك قريباً.');
      reset();
      
      // Redirect to my-applications after 2 seconds
      setTimeout(() => {
        if (isMountedRef.current) {
          router.push('/my-applications');
        }
      }, 2000);
    } catch (error: unknown) {
      const err = error as { response?: { data?: { message?: string } }; message?: string };
      setGeneralError(err?.response?.data?.message || err?.message || 'فشل تقديم الطلب');
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
            <FileText size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">طلب إسكان - طالب قديم</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            يرجى ملء جميع البيانات المطلوبة بدقة لتقديم طلب الإسكان
          </p>
        </div>

        {/* Form */}
        <div className="bg-white rounded-lg shadow-md p-8">
          {generalError && (
            <div className="mb-6">
              <AlertBox
                type="error"
                title="خطأ في تقديم الطلب"
                message={generalError}
                onClose={() => setGeneralError(null)}
              />
            </div>
          )}

          {success && (
            <div className="mb-6">
              <AlertBox
                type="success"
                title="تم بنجاح"
                message={success}
                onClose={() => setSuccess(null)}
              />
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            {/* Student Personal Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                <User size={20} className="text-[#0292B3]" />
                البيانات الشخصية للطالب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="الاسم الكامل"
                  placeholder="أدخل الاسم الكامل"
                  error={errors.studentInfo?.fullName?.message}
                  required
                  {...register('studentInfo.fullName')}
                />
                <FormInput
                  label="الرقم القومي"
                  placeholder="14 رقم"
                  icon={<IdCard size={20} />}
                  error={errors.studentInfo?.nationalId?.message}
                  maxLength={14}
                  required
                  {...register('studentInfo.nationalId')}
                />
                <FormInput
                  label="تاريخ الميلاد"
                  type="date"
                  icon={<Calendar size={20} />}
                  error={errors.studentInfo?.birthDate?.message}
                  required
                  {...register('studentInfo.birthDate')}
                />
                <FormInput
                  label="محل الميلاد"
                  placeholder="أدخل محل الميلاد"
                  error={errors.studentInfo?.birthPlace?.message}
                  required
                  {...register('studentInfo.birthPlace')}
                />
                <FormSelect
                  label="النوع"
                  placeholder="اختر النوع"
                  options={genderOptions}
                  error={errors.studentInfo?.gender?.message}
                  required
                  {...register('studentInfo.gender')}
                />
                <FormSelect
                  label="الديانة"
                  placeholder="اختر الديانة"
                  options={religionOptions}
                  error={errors.studentInfo?.religion?.message}
                  required
                  {...register('studentInfo.religion')}
                />
                <FormInput
                  label="البريد الإلكتروني"
                  type="email"
                  placeholder="example@email.com"
                  icon={<Mail size={20} />}
                  error={errors.studentInfo?.email?.message}
                  required
                  {...register('studentInfo.email')}
                />
                <FormInput
                  label="رقم الهاتف"
                  placeholder="01xxxxxxxxx"
                  icon={<Phone size={20} />}
                  error={errors.studentInfo?.phone?.message}
                  maxLength={11}
                  required
                  {...register('studentInfo.phone')}
                />
              </div>
            </div>

            {/* Address Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                <MapPin size={20} className="text-[#0292B3]" />
                بيانات العنوان
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="المحافظة"
                  placeholder="اختر المحافظة"
                  options={governorates}
                  error={errors.studentInfo?.governorate?.message}
                  required
                  {...register('studentInfo.governorate')}
                />
                <FormInput
                  label="المدينة"
                  placeholder="أدخل المدينة"
                  error={errors.studentInfo?.city?.message}
                  required
                  {...register('studentInfo.city')}
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="العنوان التفصيلي"
                    placeholder="الشارع، المنطقة"
                    icon={<MapPin size={20} />}
                    error={errors.studentInfo?.address?.message}
                    required
                    {...register('studentInfo.address')}
                  />
                </div>
              </div>
            </div>

            {/* Academic Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#0292B3]" />
                البيانات الأكاديمية
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="الكلية"
                  placeholder="مثال: كلية الهندسة"
                  error={errors.studentInfo?.faculty?.message}
                  required
                  {...register('studentInfo.faculty')}
                />
                <FormInput
                  label="القسم"
                  placeholder="مثال: قسم الحاسبات"
                  error={errors.studentInfo?.department?.message}
                  required
                  {...register('studentInfo.department')}
                />
                <FormSelect
                  label="المستوى الدراسي"
                  placeholder="اختر المستوى"
                  options={levelOptions}
                  error={errors.studentInfo?.level?.message}
                  required
                  {...register('studentInfo.level')}
                />
              </div>
            </div>

            {/* Previous Academic Performance Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                <GraduationCap size={20} className="text-[#0292B3]" />
                الأداء الأكاديمي
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="المعدل التراكمي الحالي (GPA)"
                  placeholder="مثال: 3.5"
                  type="number"
                  step="0.01"
                  error={errors.academicInfo?.currentGPA?.message}
                  required
                  {...register('academicInfo.currentGPA')}
                />
                <FormSelect
                  label="تقدير العام السابق"
                  placeholder="اختر التقدير"
                  options={gradeOptions}
                  error={errors.academicInfo?.lastYearGrade?.message}
                  required
                  {...register('academicInfo.lastYearGrade')}
                />
              </div>
            </div>

            {/* Father Information Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#0292B3]" />
                بيانات الأب
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormInput
                  label="اسم الأب الكامل"
                  placeholder="أدخل اسم الأب"
                  error={errors.fatherInfo?.fullName?.message}
                  required
                  {...register('fatherInfo.fullName')}
                />
                <FormInput
                  label="الرقم القومي للأب"
                  placeholder="14 رقم"
                  icon={<IdCard size={20} />}
                  error={errors.fatherInfo?.nationalId?.message}
                  maxLength={14}
                  required
                  {...register('fatherInfo.nationalId')}
                />
                <FormInput
                  label="الوظيفة"
                  placeholder="أدخل وظيفة الأب"
                  icon={<Briefcase size={20} />}
                  error={errors.fatherInfo?.job?.message}
                  required
                  {...register('fatherInfo.job')}
                />
                <FormInput
                  label="رقم هاتف الأب"
                  placeholder="01xxxxxxxxx"
                  icon={<Phone size={20} />}
                  error={errors.fatherInfo?.phoneNumber?.message}
                  maxLength={11}
                  required
                  {...register('fatherInfo.phoneNumber')}
                />
                <div className="md:col-span-2">
                  <FormInput
                    label="عنوان الأب"
                    placeholder="العنوان التفصيلي"
                    icon={<MapPin size={20} />}
                    error={errors.fatherInfo?.address?.message}
                    required
                    {...register('fatherInfo.address')}
                  />
                </div>
              </div>
            </div>

            {/* Guardian Selection Section */}
            <div className="border-b border-gray-200 pb-6">
              <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                <Users size={20} className="text-[#0292B3]" />
                ولي الأمر
              </h2>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormSelect
                  label="علاقة ولي الأمر"
                  placeholder="اختر العلاقة"
                  options={guardianRelationOptions}
                  error={errors.selectedGuardianRelation?.message}
                  required
                  {...register('selectedGuardianRelation')}
                />
              </div>
            </div>

            {/* Other Guardian Information Section (conditional) */}
            {selectedGuardianRelation && selectedGuardianRelation !== 'father' && (
              <div className="border-b border-gray-200 pb-6">
                <h2 className="text-xl font-bold text-[#132a4f] mb-4 flex items-center gap-2">
                  <Users size={20} className="text-[#0292B3]" />
                  بيانات ولي الأمر
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormInput
                    label="اسم ولي الأمر الكامل"
                    placeholder="أدخل اسم ولي الأمر"
                    error={errors.otherGuardianInfo?.fullName?.message}
                    required
                    {...register('otherGuardianInfo.fullName')}
                  />
                  <FormInput
                    label="الرقم القومي لولي الأمر"
                    placeholder="14 رقم"
                    icon={<IdCard size={20} />}
                    error={errors.otherGuardianInfo?.nationalId?.message}
                    maxLength={14}
                    required
                    {...register('otherGuardianInfo.nationalId')}
                  />
                  <FormInput
                    label="الوظيفة"
                    placeholder="أدخل وظيفة ولي الأمر"
                    icon={<Briefcase size={20} />}
                    error={errors.otherGuardianInfo?.job?.message}
                    required
                    {...register('otherGuardianInfo.job')}
                  />
                  <FormInput
                    label="رقم هاتف ولي الأمر"
                    placeholder="01xxxxxxxxx"
                    icon={<Phone size={20} />}
                    error={errors.otherGuardianInfo?.phoneNumber?.message}
                    maxLength={11}
                    required
                    {...register('otherGuardianInfo.phoneNumber')}
                  />
                  <div className="md:col-span-2">
                    <FormInput
                      label="عنوان ولي الأمر"
                      placeholder="العنوان التفصيلي"
                      icon={<MapPin size={20} />}
                      error={errors.otherGuardianInfo?.address?.message}
                      required
                      {...register('otherGuardianInfo.address')}
                    />
                  </div>
                </div>
              </div>
            )}

            {/* Submit Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <Button
                type="submit"
                disabled={isSubmitting}
                className="flex-1 bg-gradient-to-r from-[#0d3a52] to-[#0d5a7a] hover:from-[#0d5a7a] hover:to-[#0d7a9a] text-white font-semibold py-3 rounded-lg transition-all duration-200 disabled:opacity-50"
              >
                {isSubmitting ? 'جاري التقديم...' : 'تقديم الطلب'}
              </Button>
              <Button
                type="button"
                variant="outline"
                onClick={() => router.push('/new-application')}
                className="flex-1 border-2 border-[#0d5a7a] text-[#0d5a7a] font-semibold py-3 rounded-lg hover:bg-[#0d5a7a] hover:text-white transition-all duration-200"
              >
                إلغاء
              </Button>
            </div>
          </form>
        </div>

        {/* Info Section */}
        <div className="bg-blue-50 border-r-4 border-[#0292B3] rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">ملاحظة مهمة</h3>
          <p className="text-[#619cba]">
            يرجى التأكد من صحة جميع البيانات المدخلة قبل التقديم. 
            سيتم مراجعة الطلب من قبل إدارة الإسكان والرد عليك في أقرب وقت.
          </p>
        </div>
      </div>
    </MainLayout>
  );
}
