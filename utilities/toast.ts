import React from 'react';
import { toast as sonnerToast } from 'sonner-native';

export function toastSuccess(message: string, description?: string) {
  sonnerToast.success(message, {
    description,
  });
}

export function toastError(message: string, description?: string) {
  sonnerToast.error(message, {
    description,
  });
}

export function toastWarning(message: string, description?: string) {
  sonnerToast.warning(message, {
    description,
  });
}

export function toastInfo(message: string, description?: string) {
  sonnerToast.info(message, {
    description,
  });
}

export function toastPromise<T>(
  promise: Promise<T>,
  messages: {
    loading: string;
    success: (data: T) => string;
    error: (error: unknown) => string;
  },
) {
  sonnerToast.promise(promise, messages);
}

export function toastCustom(
  content: React.ReactElement,
  options?: {
    duration?: number;
    action?: {
      label: string;
      onClick: () => void;
    };
  },
) {
  sonnerToast.custom(content, options);
}

export function toastDismiss(toastId?: string | number) {
  sonnerToast.dismiss(toastId);
}

export function toastDismissAll() {
  sonnerToast.dismiss();
}

export const toast = sonnerToast;
