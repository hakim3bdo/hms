import React from 'react';
import { AlertCircle, CheckCircle, Info, X } from 'lucide-react';

type AlertType = 'error' | 'success' | 'info' | 'warning';

interface AlertBoxProps {
  type: AlertType;
  title?: string;
  message: string;
  onClose?: () => void;
  dismissible?: boolean;
}

/**
 * AlertBox Component
 * 
 * Displays alert messages with different types.
 */
export default function AlertBox({
  type,
  title,
  message,
  onClose,
  dismissible = true,
}: AlertBoxProps) {
  const styles = {
    error: {
      bg: 'bg-red-50',
      border: 'border-red-200',
      icon: 'text-red-600',
      title: 'text-red-800',
      text: 'text-red-700',
      Icon: AlertCircle,
    },
    success: {
      bg: 'bg-green-50',
      border: 'border-green-200',
      icon: 'text-green-600',
      title: 'text-green-800',
      text: 'text-green-700',
      Icon: CheckCircle,
    },
    info: {
      bg: 'bg-blue-50',
      border: 'border-blue-200',
      icon: 'text-blue-600',
      title: 'text-blue-800',
      text: 'text-blue-700',
      Icon: Info,
    },
    warning: {
      bg: 'bg-yellow-50',
      border: 'border-yellow-200',
      icon: 'text-yellow-600',
      title: 'text-yellow-800',
      text: 'text-yellow-700',
      Icon: AlertCircle,
    },
  };

  const style = styles[type];
  const Icon = style.Icon;

  return (
    <div
      className={`
        ${style.bg} ${style.border}
        border rounded-lg p-4 flex gap-3
      `}
      role="alert"
    >
      <Icon className={`${style.icon} flex-shrink-0 mt-0.5`} size={20} />

      <div className="flex-1">
        {title && (
          <h3 className={`${style.title} font-semibold mb-1`}>{title}</h3>
        )}
        <p className={`${style.text} text-sm`}>{message}</p>
      </div>

      {dismissible && onClose && (
        <button
          onClick={onClose}
          className={`${style.icon} flex-shrink-0 hover:opacity-70 transition-opacity`}
          aria-label="Close alert"
        >
          <X size={20} />
        </button>
      )}
    </div>
  );
}
