import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listPaymentMethod } from "../api/paymentMethod";

const paymentStore = (set) => ({
  paymentMethods: [],
  getPaymentMethod: async (token) => {
    try {
      const res = await listPaymentMethod(token);
      set({ paymentMethods: res.data });
    } catch (err) {
      console.log(err);
    }
  },
});

const usePersist = {
  name: "payment-store",
  storage: createJSONStorage(() => localStorage),
};

const usePaymentStore = create(persist(paymentStore, usePersist));
export default usePaymentStore; 