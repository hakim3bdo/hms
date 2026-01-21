import React from 'react';

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle: string;
}

/**
 * AuthLayout Component
 * 
 * Provides a consistent layout for authentication pages (Login, Signup).
 * Features a split-screen design with gradient background on one side
 * and form content on the other.
 */
export default function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full overflow-hidden">
      {/* Left Side: Design/Gradient */}
      <div className="hidden lg:flex lg:flex-1.2 flex-col items-center justify-center bg-gradient-to-b from-[#0d1f2d] via-[#0d3a52] to-[#0d5a7a] text-white relative overflow-hidden">
        {/* Wave pattern background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-10"></div>
          <div className="absolute bottom-1/4 right-1/4 w-96 h-96 bg-white rounded-full blur-3xl opacity-5"></div>
        </div>

        {/* Logo */}
        <div className="relative z-10 mb-8">
          <div className="w-56 h-56 bg-white/15 rounded-full flex items-center justify-center backdrop-blur-md border border-white/10">
            <img 
              src="/logo.png" 
              alt="جامعة الغردقة" 
              className="w-4/5 h-4/5 object-contain"
            />
          </div>
        </div>

        {/* University Info */}
        <div className="relative z-10 text-center">
          <h1 className="text-5xl font-bold mb-4 tracking-wide">جامعة الغردقة</h1>
          <p className="text-lg opacity-95 font-light">منصة إدارة المدن الجامعية للطلاب</p>
        </div>
      </div>

      {/* Right Side: Form Content */}
      <div className="flex-1 flex items-center justify-center bg-white p-6 lg:p-10 overflow-y-auto">
        <div className="w-full max-w-md">
          <div className="mb-8">
            <h2 className="text-3xl font-bold text-[#132a4f] mb-2">{title}</h2>
            <p className="text-[#619cba] text-sm font-light">{subtitle}</p>
          </div>
          
          {children}
        </div>
      </div>
    </div>
  );
}
