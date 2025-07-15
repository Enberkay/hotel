import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listCleaningRequest } from "../api/cleaning";
import { listCleaningListItem } from "../api/cleaningListItem";

const cleaningStore = (set) => ({
  cleaningRequests: [],
  cleaningListItems: [],
  getCleaningRequest: async (token) => {
    try {
      const res = await listCleaningRequest(token);
      set({ cleaningRequests: Array.isArray(res.data) ? res.data : [] });
    } catch (error) {
      console.error("Error fetching cleaning requests:", error);
      set({ cleaningRequests: [] });
    }
  },
  getCleaningListItem: async (token) => {
    try {
      const res = await listCleaningListItem(token);
      set({ cleaningListItems: res.data });
    } catch (err) {
      console.log(err);
    }
  },
});

const usePersist = {
  name: "cleaning-store",
  storage: createJSONStorage(() => localStorage),
};

const useCleaningStore = create(persist(cleaningStore, usePersist));
export default useCleaningStore; 