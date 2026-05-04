import React from 'react';
import toast from 'react-hot-toast';

export const useToast = () => {
  return {
    success: (message) => toast.success(message),
    error: (message) => toast.error(message),
    loading: (message) => toast.loading(message),
    promise: (promise, messages) => toast.promise(promise, messages),
    custom: (component) => toast.custom(component),
    dismiss: (toastId) => toast.dismiss(toastId),
  };
};
