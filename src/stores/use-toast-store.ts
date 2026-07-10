'use client';

import { create } from 'zustand';

export type ToastType = 'info' | 'warning' | 'success' | 'error';

export interface ToastItem {
  id: string;
  title?: string;
  message: string;
  type: ToastType;
  open: boolean;
}

export interface ToastParams {
  title?: string;
  message: string;
  type?: ToastType;
  duration?: number;
}

let toastId = 0;
const timeouts = new Map<string, ReturnType<typeof setTimeout>>();

interface ToastStore {
  toasts: ToastItem[];
  show: (params: ToastParams) => string;
  hide: (id: string) => void;
  clear: () => void;
}

export const useToastStore = create<ToastStore>((set, get) => ({
  toasts: [],
  show(params) {
    const id = `toast-${++toastId}`;
    const duration = params.duration ?? 5000;
    const item: ToastItem = {
      id,
      title: params.title,
      message: params.message,
      type: params.type ?? 'info',
      open: true,
    };
    set({ toasts: [...get().toasts, item] });
    if (duration > 0) {
      const t = setTimeout(() => {
        get().hide(id);
        timeouts.delete(id);
      }, duration);
      timeouts.set(id, t);
    }
    return id;
  },
  hide(id) {
    const t = timeouts.get(id);
    if (t) {
      clearTimeout(t);
      timeouts.delete(id);
    }
    set({ toasts: get().toasts.filter((x) => x.id !== id) });
  },
  clear() {
    timeouts.forEach((t) => clearTimeout(t));
    timeouts.clear();
    set({ toasts: [] });
  },
}));
