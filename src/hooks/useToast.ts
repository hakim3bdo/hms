import { toast } from 'sonner';

/**
 * useToast Hook
 * Provides a simple interface for showing toast notifications using sonner
 * Replaces traditional alert boxes with modern, non-intrusive toasts
 */
export const useToast = () => {
  return {
    /**
     * Show success toast
     * @param message - Success message to display
     * @param title - Optional title (shown as part of the message)
     */
    success: (message: string, title?: string) => {
      const fullMessage = title ? `${title}: ${message}` : message;
      toast.success(fullMessage, {
        duration: 4000,
        position: 'top-right',
        description: undefined,
      });
    },

    /**
     * Show error toast
     * @param message - Error message to display
     * @param title - Optional title (shown as part of the message)
     */
    error: (message: string, title?: string) => {
      const fullMessage = title ? `${title}: ${message}` : message;
      toast.error(fullMessage, {
        duration: 5000,
        position: 'top-right',
        description: undefined,
      });
    },

    /**
     * Show info toast
     * @param message - Info message to display
     * @param title - Optional title (shown as part of the message)
     */
    info: (message: string, title?: string) => {
      const fullMessage = title ? `${title}: ${message}` : message;
      toast.info(fullMessage, {
        duration: 4000,
        position: 'top-right',
        description: undefined,
      });
    },

    /**
     * Show warning toast
     * @param message - Warning message to display
     * @param title - Optional title (shown as part of the message)
     */
    warning: (message: string, title?: string) => {
      const fullMessage = title ? `${title}: ${message}` : message;
      toast.warning(fullMessage, {
        duration: 4000,
        position: 'top-right',
        description: undefined,
      });
    },

    /**
     * Show loading toast
     * @param message - Loading message
     * @returns Promise that resolves when toast is dismissed
     */
    loading: (message: string) => {
      return toast.loading(message, {
        position: 'top-right',
      });
    },

    /**
     * Show promise-based toast (auto updates based on promise)
     * @param promise - Promise to track
     * @param messages - Object with loading, success, error messages
     */
    promise: (
      promise: Promise<unknown>,
      messages: {
        loading: string;
        success: string;
        error: string;
      }
    ) => {
      return toast.promise(promise, messages);
    },

    /**
     * Dismiss a specific toast by ID
     * @param toastId - ID of the toast to dismiss
     */
    dismiss: (toastId?: string | number) => {
      if (toastId) {
        toast.dismiss(toastId);
      } else {
        toast.dismiss();
      }
    },
  };
};
