import React, { forwardRef } from 'react';
import { AlertCircle } from 'lucide-react';

interface FormTextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string;
  error?: string;
  required?: boolean;
  rows?: number;
}

/**
 * FormTextarea Component
 * 
 * Reusable form textarea with:
 * - Label
 * - Error message display
 * - Validation styling
 */
const FormTextarea = forwardRef<HTMLTextAreaElement, FormTextareaProps>(
  (
    {
      label,
      error,
      required,
      rows = 4,
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

        {/* Textarea */}
        <textarea
          ref={ref}
          rows={rows}
          className={`
            w-full px-4 py-3 border-2 rounded-lg
            font-medium text-[#132a4f] placeholder-gray-400
            transition-all duration-200
            focus:outline-none focus:ring-0 resize-none
            ${error
              ? 'border-[#E01C46] bg-red-50 focus:border-[#E01C46]'
              : 'border-[#E0E0E0] bg-[#FAFAFA] focus:border-[#0d5a7a] focus:bg-white'
            }
            ${className || ''}
          `}
          {...props}
        />

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

FormTextarea.displayName = 'FormTextarea';

export default FormTextarea;
