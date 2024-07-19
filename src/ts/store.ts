import { create } from 'zustand';
import { IToast } from '../components/Toast/Toast';

type Store = {
    toast: IToast | null;
    setToast: (msg: IToast | null) => void;
};

export default create<Store>((set) => ({
    toast: null,
    setToast: (msg: IToast | null) => set({ toast: msg }),
}));