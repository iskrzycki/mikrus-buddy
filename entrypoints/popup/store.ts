import { create } from "zustand";

interface AppState {
  isValidKey: boolean;
  activeTab: string;
  setIsValidKey: (isValidKey: boolean) => void;
  setActiveTab: (activeTab: string) => void;
}

const useStore = create<AppState>((set) => ({
  isValidKey: false,
  activeTab: "settings",
  setIsValidKey: (isValidKey) => set({ isValidKey }),
  setActiveTab: (activeTab) => set({ activeTab }),
}));

export default useStore;
