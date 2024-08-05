import { create } from 'zustand';
import { IToast } from '../components/Toast/Toast';
import { SectionEnum } from './SectionEnum';

type Store = {
    activeSectionIndex: number;
    setActiveSectionIndex: (index: number) => void;
    sectionHashes: string[];
    setSectionHashes: (hashes: SectionEnum[]) => void;
    toast: IToast | null;
    setToast: (msg: IToast | null) => void;

    getIndexOfHash: (hash: string) => number;
};

export default create<Store>((set, get) => ({
    activeSectionIndex: 0,
    setActiveSectionIndex: (index: number) => set({ activeSectionIndex: index }),
    sectionHashes: Object.values(SectionEnum),
    setSectionHashes: (hashes: string[]) => set({ sectionHashes: hashes }),
    toast: null,
    setToast: (msg: IToast | null) => set({ toast: msg }),

    getIndexOfHash: (hash: string) => {
        return get().sectionHashes.indexOf(hash);
    },
}));