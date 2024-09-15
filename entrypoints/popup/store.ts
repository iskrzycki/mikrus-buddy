import { create } from "zustand";

interface AppState {
  isValidKey: boolean;
  activeTab: string;
  setIsValidKey: (isValidKey: boolean) => void;
  setActiveTab: (activeTab: string) => void;
  reset: () => void;
}

const initialState = {
  isValidKey: false,
  activeTab: "settings",
};

const fetchInitialValues = async () => {
  const userData = await browser.storage.sync.get(["isValidKey"]);
  return {
    isValidKey: userData.isValidKey || false,
    activeTab: userData.isValidKey ? "info" : "settings",
  };
};

const useStore = create<AppState>((set) => {
  fetchInitialValues().then((initialValues) => {
    set(initialValues);
  });

  return {
    ...initialState,
    setIsValidKey: (isValidKey) => set({ isValidKey }),
    setActiveTab: (activeTab) => set({ activeTab }),
    reset: () => set(initialState),
  };
});

export default useStore;
