import { create } from 'zustand';

export const useStore = create((set) => ({
    aboutMe: null,
    setAboutMe: (data) => set({ aboutMe: data }),
    skills: [],
    setSkills: (data) => set({ skills: data }),
    projects: [],
    setProjects: (data) => set({ projects: data }),
    contactInfo: null,
    setContactInfo: (data) => set({ contactInfo: data }),
    socialMedias: [],
    setSocialMedias: (data) => set({ socialMedias: data }),
    toast: null,
    setToast: (msg) => set({ toast: msg }),
}));
