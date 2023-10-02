import { create } from 'zustand';

interface DialogState {
    isModal: boolean;
    toggleModal: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
    isModal: false,
    toggleModal: () => set((state) => ({ isModal: !state.isModal })),
}));

export default useDialogStore;