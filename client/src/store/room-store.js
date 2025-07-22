import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listRoom } from "../api/room";

const roomStore = (set) => ({
  rooms: [],
  getRoom: async (token) => {
    try {
      const res = await listRoom(token);
      set({ rooms: res.data });
    } catch (err) {
      console.log(err);
    }
  },
});

const usePersist = {
  name: "room-store",
  storage: createJSONStorage(() => localStorage),
};

const useRoomStore = create(persist(roomStore, usePersist));
export default useRoomStore; 