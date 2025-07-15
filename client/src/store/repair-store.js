import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listRepairRequest } from "../api/repair";

const repairStore = (set) => ({
  repairRequests: [],
  getRepairRequest: async (token) => {
    try {
      const res = await listRepairRequest(token);
      set({ repairRequests: res.data });
    } catch (err) {
      console.log(err);
    }
  },
});

const usePersist = {
  name: "repair-store",
  storage: createJSONStorage(() => localStorage),
};

const useRepairStore = create(persist(repairStore, usePersist));
export default useRepairStore; 