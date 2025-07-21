import axios from "axios";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import { myProfile } from "../api/profile";
import { jwtDecode } from "jwt-decode";
import { listUser } from "../api/admin";

const API_URL = import.meta.env.VITE_API_URL;

const authStore = (set) => ({
  user: null,
  token: null,
  profile: [],
  users: [],
  hasCheckedToken: false,

  actionLogin: async (form) => {
    try {
      const res = await axios.post(`${API_URL}/login`, form);
      if (res?.data?.token) {
        set({
          user: res.data.payload,
          token: res.data.token,
        });
        return res;
      } else {
        throw new Error("Invalid login response");
      }
    } catch (err) {
      console.error("Login failed:", err);
      throw err;
    }
  },

  logout: () => {
    set({ user: null, token: null });
    localStorage.removeItem("auth-store");
    setTimeout(() => {
      if (window.location.pathname !== "/login") {
        window.location.href = "/login";
      }
    }, 100);
  },

  isTokenExpired: () => {
    const state = useAuthStore.getState();
    const token = state.token;
    if (!token) return true;
    try {
      const decoded = jwtDecode(token);
      return decoded.exp * 1000 < Date.now();
    } catch (error) {
      console.error("Invalid token:", error);
      return true;
    }
  },

  checkAndLogoutIfExpired: () => {
    const state = useAuthStore.getState();
    if (!state.hasCheckedToken && state.isTokenExpired()) {
      set({ hasCheckedToken: true });
      state.logout();
    }
  },

  setupInterceptors: () => {
    axios.interceptors.response.use(
      (response) => response,
      (error) => {
        if (error.response?.status === 401) {
          console.log("Token หมดอายุ → ทำการ Logout");
          useAuthStore.getState().logout();
        }
        return Promise.reject(error);
      }
    );
  },

  getProfile: async (token) => {
    try {
      const res = await myProfile(token);
      set({ profile: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getAllUsers: async (token) => {
    try {
      const res = await listUser(token);
      set({ users: res.data });
    } catch (err) {
      console.error(err);
    }
  },

  getCurrentUser: async (token) => {
    try {
      const res = await axios.post(`${API_URL}/current-user`, {}, {
        headers: { Authorization: `Bearer ${token}` }
      });
      set({ user: res.data.user });
    } catch (err) {
      console.error(err);
    }
  },
});

const usePersist = {
  name: "auth-store",
  storage: createJSONStorage(() => localStorage),
};

const useAuthStore = create(persist(authStore, usePersist));
useAuthStore.getState().setupInterceptors();
export default useAuthStore; 