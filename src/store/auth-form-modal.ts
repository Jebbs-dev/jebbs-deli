import {  create } from "zustand"

interface AuthFormModalStore {
  isAuthFormOpen: boolean;
  onAuthFormOpen: () => void;
  onAuthFormClose: () => void;
}

export const useAuthFormModal = create<AuthFormModalStore>((set) => ({
  isAuthFormOpen: false,
  onAuthFormOpen: () => set({ isAuthFormOpen: true }),
  onAuthFormClose: () => set({ isAuthFormOpen: false }),
}))