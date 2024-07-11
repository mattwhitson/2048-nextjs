import { create } from "zustand";

type ModalType = "EndGame";

interface ModalStore {
  type: ModalType | null;
  isOpen: boolean;
  onOpen: (type: ModalType, score?: number) => void;
  onClose: () => void;
}

export const useModal = create<ModalStore>((set) => ({
  type: null,
  isOpen: false,
  score: 0,
  onOpen: (type, score?: number) => set({ isOpen: true, type }),
  onClose: () => set({ type: null, isOpen: false }),
}));
