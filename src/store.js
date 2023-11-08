import { create } from 'zustand';

export const useStore = create((set) => ({
    toast: null,
    setToast: (msg) => set({ toast: msg }),
}));