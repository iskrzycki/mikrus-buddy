import { create } from "zustand";

interface AppState {
  isValidKey: boolean;
  activeTab: string;
  setIsValidKey: (isValidKey: boolean) => void;
  setActiveTab: (activeTab: string) => void;
  reset: () => void;
}

console.log("store.ts");
// TODO getting false there, but key and serverId already exists in store and seem sto be valid.
const userData = await browser.storage.sync.get(["isValidKey"]);
console.log("userdata", userData);

const initialState = {
  isValidKey: false,
  activeTab: "settings",
};

const useStore = create<AppState>((set) => ({
  isValidKey: userData.isValidKey || false,
  activeTab: userData.isValidKey ? "info" : "settings",
  setIsValidKey: (isValidKey) => set({ isValidKey }),
  setActiveTab: (activeTab) => set({ activeTab }),
  reset: () => set(initialState),
}));

export default useStore;
