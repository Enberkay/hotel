import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { listRoomType } from "../api/roomType";
import { listRoom } from "../api/room";

const roomStore = (set) => ({
  roomTypes: [],
  rooms: [],
  getRoomType: async (token) => {
    try {
      const res = await listRoomType(token);
      set({ roomTypes: res.data });
    } catch (err) {
      console.log(err);
    }
  },
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