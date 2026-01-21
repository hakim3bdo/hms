import React from 'react';
import Link from 'next/link';
import { Mail, Phone, MapPin } from 'lucide-react';

/**
 * Footer Component
 * 
 * Application footer with contact information and links.
 */
export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-b from-[#0d1f2d] to-[#0a1520] text-white border-t border-white/10 mt-auto">
      <div className="max-w-7xl mx-auto px-4 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
          {/* About */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#61C9DB]">عن الجامعة</h3>
            <p className="text-sm text-white/80 leading-relaxed">
              جامعة الغردقة توفر منصة متكاملة لإدارة المدن الجامعية وتسهيل عملية التقديم والاستفسار عن الطلبات.
            </p>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#61C9DB]">روابط سريعة</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/instructions" className="text-white/80 hover:text-white transition-colors">
                  التعليمات
                </Link>
              </li>
              <li>
                <Link href="/dates" className="text-white/80 hover:text-white transition-colors">
                  التواريخ المهمة
                </Link>
              </li>
              <li>
                <Link href="/inquiry" className="text-white/80 hover:text-white transition-colors">
                  الاستفسار عن الطلب
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-bold mb-4 text-[#61C9DB]">تواصل معنا</h3>
            <div className="space-y-3 text-sm">
              <div className="flex items-center gap-2 text-white/80">
                <Phone size={16} />
                <span>+20 (65) 3546 000</span>
              </div>
              <div className="flex items-center gap-2 text-white/80">
                <Mail size={16} />
                <span>info@hu.edu.eg</span>
              </div>
              <div className="flex items-start gap-2 text-white/80">
                <MapPin size={16} className="mt-1 flex-shrink-0" />
                <span>الغردقة، البحر الأحمر، مصر</span>
              </div>
            </div>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-white/10 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center text-sm text-white/60">
            <p>&copy; {currentYear} جامعة الغردقة. جميع الحقوق محفوظة.</p>
            <div className="flex gap-6 mt-4 md:mt-0">
              <span className="hover:text-white transition-colors cursor-pointer">سياسة الخصوصية</span>
              <span className="hover:text-white transition-colors cursor-pointer">شروط الاستخدام</span>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
}
