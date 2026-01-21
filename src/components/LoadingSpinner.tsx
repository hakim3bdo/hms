import React from 'react';

interface LoadingSpinnerProps {
  size?: 'sm' | 'md' | 'lg';
  message?: string;
  fullScreen?: boolean;
}

/**
 * LoadingSpinner Component
 * 
 * Displays a loading indicator with optional message.
 */
export default function LoadingSpinner({
  size = 'md',
  message,
  fullScreen = false,
}: LoadingSpinnerProps) {
  const sizeClasses = {
    sm: 'w-6 h-6',
    md: 'w-10 h-10',
    lg: 'w-16 h-16',
  };

  const spinner = (
    <div className="flex flex-col items-center justify-center gap-4">
      <div
        className={`
          ${sizeClasses[size]}
          border-4 border-[#E0E0E0] border-t-[#0d5a7a]
          rounded-full animate-spin
        `}
      />
      {message && (
        <p className="text-[#619cba] font-medium text-center">{message}</p>
      )}
    </div>
  );

  if (fullScreen) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-black/20 z-50">
        <div className="bg-white rounded-lg p-8 shadow-lg">
          {spinner}
        </div>
      </div>
    );
  }

  return spinner;
}
