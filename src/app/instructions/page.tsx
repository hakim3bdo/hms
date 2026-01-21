'use client';

import React, { useState } from 'react';
import MainLayout from '@/components/MainLayout';
import LoadingSpinner from '@/components/LoadingSpinner';
import { HelpCircle, ChevronDown } from 'lucide-react';
import { useProtectedRoute } from '@/hooks/useProtectedRoute';

/**
 * Instructions Page Component
 * 
 * Displays instructions and guidelines for housing applications.
 */
export default function InstructionsPage() {
  const { isAuthenticated, loading } = useProtectedRoute();
  const [expandedSection, setExpandedSection] = useState<number | null>(0);

  const sections = [
    {
      title: 'شروط التقديم',
      content: `
        يجب توفر الشروط التالية للتقديم:
        • أن تكون طالباً منتظماً بالجامعة
        • أن تكون حالتك الأكاديمية جيدة
        • عدم وجود مخالفات تأديبية
        • استيفاء جميع المتطلبات المالية
        • توفير جميع المستندات المطلوبة
      `,
    },
    {
      title: 'خطوات التقديم',
      content: `
        اتبع الخطوات التالية للتقديم:
        1. قم بتسجيل الدخول إلى حسابك
        2. اختر نوع الطلب (مستجد أو قديم)
        3. أكمل البيانات الشخصية
        4. أكمل بيانات الإقامة
        5. أكمل البيانات الأكاديمية
        6. أرفق المستندات المطلوبة
        7. راجع البيانات وأكمل التقديم
      `,
    },
    {
      title: 'المستندات المطلوبة',
      content: `
        يجب إرفاق المستندات التالية:
        • صورة من الهوية الشخصية أو جواز السفر
        • صورة شخصية حديثة
        • شهادة القيد الجامعي
        • كشف الدرجات الأكاديمي
        • شهادة عدم المخالفات التأديبية
        • إقرار من ولي الأمر (للطلاب القصر)
      `,
    },
    {
      title: 'متابعة الطلب',
      content: `
        يمكنك متابعة حالة طلبك من خلال:
        • الدخول إلى حسابك والاطلاع على حالة الطلب
        • استخدام صفحة الاستفسار بإدخال رقم الطلب
        • الاتصال بإدارة المدن الجامعية مباشرة
        • متابعة الإشعارات والرسائل النصية
      `,
    },
    {
      title: 'الرسوم والتكاليف',
      content: `
        معلومات عن الرسوم والتكاليف:
        • رسم التقديم: 100 جنيه مصري (غير مسترجع)
        • رسم السكن: تختلف حسب نوع الغرفة والمدة
        • رسم الخدمات الإضافية: حسب الخدمات المطلوبة
        • يمكن الدفع عن طريق التحويل البنكي أو الدفع المباشر
      `,
    },
    {
      title: 'الأسئلة الشائعة',
      content: `
        س: هل يمكنني التقديم أكثر من مرة؟
        ج: لا، يمكنك التقديم مرة واحدة فقط في كل فترة تقديم.
        
        س: ماذا لو لم أستكمل التقديم؟
        ج: يمكنك العودة لاستكمال التقديم في أي وقت قبل انتهاء فترة التقديم.
        
        س: متى سيتم إعلان النتائج؟
        ج: سيتم إعلان النتائج في التاريخ المحدد في التواريخ المهمة.
      `,
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
            <HelpCircle size={32} className="text-[#0292B3]" />
            <h1 className="text-3xl font-bold text-[#132a4f]">التعليمات والشروط</h1>
          </div>
          <p className="text-[#619cba] text-lg">
            اقرأ التعليمات والشروط بعناية قبل التقديم
          </p>
        </div>

        {/* Sections */}
        <div className="space-y-4">
          {sections.map((section, index) => (
            <div
              key={index}
              className="bg-white rounded-lg shadow-md overflow-hidden"
            >
              <button
                onClick={() =>
                  setExpandedSection(expandedSection === index ? null : index)
                }
                className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-50 transition-colors"
              >
                <h3 className="text-lg font-bold text-[#132a4f] text-right">
                  {section.title}
                </h3>
                <ChevronDown
                  size={24}
                  className={`text-[#0292B3] transition-transform ${
                    expandedSection === index ? 'rotate-180' : ''
                  }`}
                />
              </button>

              {expandedSection === index && (
                <div className="px-6 py-4 border-t border-gray-200 bg-gray-50">
                  <p className="text-[#619cba] whitespace-pre-line leading-relaxed">
                    {section.content}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Contact Info */}
        <div className="bg-green-50 border-r-4 border-green-500 rounded-lg p-6">
          <h3 className="text-lg font-bold text-[#132a4f] mb-2">تحتاج إلى مساعدة؟</h3>
          <p className="text-[#619cba] mb-3">
            إذا كان لديك أي استفسارات، يرجى التواصل مع إدارة المدن الجامعية:
          </p>
          <div className="space-y-2 text-[#619cba]">
            <p>📞 الهاتف: <span dir="ltr">+20 (65) 3546 000</span></p>
            <p>📧 البريد: housing@hurghada.edu.eg</p>
            <p>📍 المكتب: مبنى الإدارة، الطابق الأول</p>
          </div>
        </div>
      </div>
    </MainLayout>
  );
}
