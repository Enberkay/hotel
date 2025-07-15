import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listAddon } from "../api/addon";

const addonStore = (set) => ({
  addons: [],
  getAddon: async (token) => {
    try {
      const res = await listAddon(token);
      set({ addons: res.data });
    } catch (err) {
      console.log(err);
    }
  },
});

const usePersist = {
  name: "addon-store",
  storage: createJSONStorage(() => localStorage),
};

const useAddonStore = create(persist(addonStore, usePersist));
export default useAddonStore; 