'use client';

import React, { forwardRef } from 'react';
import { Eye, EyeOff, AlertCircle } from 'lucide-react';

interface FormInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  required?: boolean;
  icon?: React.ReactNode;
  showPasswordToggle?: boolean;
  onPasswordToggle?: (show: boolean) => void;
  showPassword?: boolean;
}

/**
 * FormInput Component
 * 
 * Reusable form input with:
 * - Label
 * - Error message display
 * - Icon support
 * - Password toggle
 * - Validation styling
 */
const FormInput = forwardRef<HTMLInputElement, FormInputProps>(
  (
    {
      label,
      error,
      required,
      icon,
      showPasswordToggle,
      onPasswordToggle,
      showPassword,
      type = 'text',
      className,
      ...props
    },
    ref
  ) => {
    const [isPasswordVisible, setIsPasswordVisible] = React.useState(false);

    const handlePasswordToggle = () => {
      const newState = !isPasswordVisible;
      setIsPasswordVisible(newState);
      onPasswordToggle?.(newState);
    };

    const inputType = showPasswordToggle
      ? isPasswordVisible
        ? 'text'
        : 'password'
      : type;

    return (
      <div className="mb-6 w-full">
        {label && (
          <label className="block mb-2 text-sm font-semibold text-[#132a4f]">
            {label}
            {required && <span className="text-[#E01C46] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Input */}
          <input
            ref={ref}
            type={inputType}
            className={`
              w-full px-4 py-3 pr-12 border-2 rounded-lg
              font-medium text-[#132a4f] placeholder-gray-400
              transition-all duration-200
              focus:outline-none focus:ring-0
              ${error
                ? 'border-[#E01C46] bg-red-50 focus:border-[#E01C46]'
                : 'border-[#E0E0E0] bg-[#FAFAFA] focus:border-[#0d5a7a] focus:bg-white'
              }
              ${className || ''}
            `}
            {...props}
          />

          {/* Left Icon */}
          {icon && (
            <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#619cba] text-lg">
              {icon}
            </div>
          )}

          {/* Password Toggle Button */}
          {showPasswordToggle && (
            <button
              type="button"
              onClick={handlePasswordToggle}
              className="absolute right-3 top-1/2 transform -translate-y-1/2 text-[#619cba] hover:text-[#0d5a7a] transition-colors"
              aria-label={isPasswordVisible ? 'Hide password' : 'Show password'}
            >
              {isPasswordVisible ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          )}
        </div>

        {/* Error Message */}
        {error && (
          <div className="mt-2 flex items-center gap-2 text-[#E01C46] text-sm">
            <AlertCircle size={16} />
            <span>{error}</span>
          </div>
        )}
      </div>
    );
  }
);

FormInput.displayName = 'FormInput';

export default FormInput;
