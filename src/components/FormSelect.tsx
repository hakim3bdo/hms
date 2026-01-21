import React, { forwardRef } from 'react';
import { AlertCircle, ChevronDown } from 'lucide-react';

interface FormSelectProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string;
  error?: string;
  required?: boolean;
  options: Array<{ value: string; label: string }>;
  placeholder?: string;
}

/**
 * FormSelect Component
 * 
 * Reusable form select with:
 * - Label
 * - Error message display
 * - Validation styling
 * - Placeholder support
 */
const FormSelect = forwardRef<HTMLSelectElement, FormSelectProps>(
  (
    {
      label,
      error,
      required,
      options,
      placeholder,
      className,
      ...props
    },
    ref
  ) => {
    return (
      <div className="mb-6 w-full">
        {label && (
          <label className="block mb-2 text-sm font-semibold text-[#132a4f]">
            {label}
            {required && <span className="text-[#E01C46] ml-1">*</span>}
          </label>
        )}

        <div className="relative">
          {/* Select */}
          <select
            ref={ref}
            className={`
              w-full px-4 py-3 pr-12 border-2 rounded-lg
              font-medium text-[#132a4f]
              transition-all duration-200
              focus:outline-none focus:ring-0 appearance-none
              ${error
                ? 'border-[#E01C46] bg-red-50 focus:border-[#E01C46]'
                : 'border-[#E0E0E0] bg-[#FAFAFA] focus:border-[#0d5a7a] focus:bg-white'
              }
              ${className || ''}
            `}
            {...props}
          >
            {placeholder && (
              <option value="">
                {placeholder}
              </option>
            )}
            {options.map((option) => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>

          {/* Chevron Icon */}
          <div className="absolute left-3 top-1/2 transform -translate-y-1/2 text-[#619cba] pointer-events-none">
            <ChevronDown size={20} />
          </div>
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

FormSelect.displayName = 'FormSelect';

export default FormSelect;
