'use client';

import Link from 'next/link';
import { Home } from 'lucide-react';
import { Button } from '@/components/ui/button';

export default function NotFound() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-linear-to-b from-[#07172a] via-[#0f3a59] to-[#023b67]">
      <div className="text-center text-white p-8">
        <h1 className="text-9xl font-bold mb-4">404</h1>
        <h2 className="text-3xl font-bold mb-4">الصفحة غير موجودة</h2>
        <p className="text-[#619cba] text-lg mb-8">
          عذراً، الصفحة التي تبحث عنها غير موجودة
        </p>
        <Link href="/">
          <Button className="bg-[#0292B3] hover:bg-[#027A95] text-white font-semibold py-3 px-6 rounded-lg">
            <Home size={20} className="ml-2" />
            العودة للرئيسية
          </Button>
        </Link>
      </div>
    </div>
  );
}
