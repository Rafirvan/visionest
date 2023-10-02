import { create } from 'zustand';

interface DialogState {
    isDialog: boolean;
    toggleDialog: () => void;
}

const useDialogStore = create<DialogState>((set) => ({
    isDialog: false,
    toggleDialog: () => set((state) => ({ isDialog: !state.isDialog })),
}));

export default useDialogStore;