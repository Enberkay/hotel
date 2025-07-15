import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listBooking } from "../api/booking";
import { myBookings } from "../api/myBooking";

const bookingStore = (set) => ({
  bookings: [],
  myBookings: [],
  getBooking: async (token) => {
    try {
      const res = await listBooking(token);
      set({ bookings: res.data });
    } catch (err) {
      console.log(err);
    }
  },
  getMyBookings: async (token) => {
    try {
      const res = await myBookings(token);
      set({ myBookings: res.data });
    } catch (err) {
      console.error(err);
    }
  },
});

const usePersist = {
  name: "booking-store",
  storage: createJSONStorage(() => localStorage),
};

const useBookingStore = create(persist(bookingStore, usePersist));
export default useBookingStore; 