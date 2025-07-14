import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

import { create } from "zustand"
import { persist, createJSONStorage } from "zustand/middleware"

import { listRoomType } from "../api/roomType"
import { listRoom } from "../api/room"
import { listCustomerType } from "../api/customerType"
import { listUser } from "../api/admin"
import { listBooking } from "../api/booking"
import { listRoomStatus } from "../api/roomStatus"
import { listAddon } from "../api/addon"
import { listBookingStatus } from "../api/bookingStatus"
import { listPaymentStatus } from "../api/paymentStatus"
import { myBookings } from "../api/myBooking"
import { listPaymentMethod } from "../api/paymentMethod"
import { myProfile } from "../api/profile"
import { listCleaningRequest } from "../api/cleaning"
import { listCleaningRequestStatus } from "../api/cleaningRequestStatus"
import { listCleaningListItem } from "../api/cleaningListItem"
import { listCleaningReportStatus } from "../api/cleaningReportStatus"
import { listCleaningStatus } from "../api/cleaningStatus"
import { listRepairRequestStatus } from "../api/repairRequestStatus"
import { listRepairStatus } from "../api/repairStatus"
import { listRepairRequest } from "../api/repair"
import { jwtDecode } from "jwt-decode"

// const hotelStore = ()=>({}) ฟังชั่นที่ return ออกไปเป็น object ()=>({}) 
const hotelStore = (set) => ({
    // key:value
    user: null,
    token: null,
    roomTypes: [],
    customertypes: [],
    rooms: [],
    roomStatuses: [],
    users: [],
    bookings: [],
    addons: [],
    bookingStatuses: [],
    paymentStatuses: [],
    myBookings: [],
    paymentMethods: [],
    profile: [],
    hasCheckedToken: false,

    cleaningRequests: [],
    cleaningRequestStatuses: [],
    cleaningListItems: [],
    cleaningReportStatuses: [],
    cleaningStatuses: [],

    repairRequests: [],
    repairRequestStatuses: [],

    repairStatuses: [],

    actionLogin: async (form) => {
        try {
            const res = await axios.post(`${API_URL}/login`, form)
            if (res?.data?.token) {
                set({
                    user: res.data.payload,
                    token: res.data.token
                })
                return res
            } else {
                throw new Error("Invalid login response")
            }
        } catch (err) {
            console.error("Login failed:", err)
            throw err
        }
    },

    logout: () => {
        set({ user: null, token: null })
        localStorage.removeItem("hotel-store")

        //ป้องกัน loop โดยใช้ timeout
        setTimeout(() => {
            if (window.location.pathname !== "/login") {
                window.location.href = "/login"
            }
        }, 100)
    },

    isTokenExpired: () => {
        const state = useHotelStore.getState()
        const token = state.token

        if (!token) return true

        try {
            const decoded = jwtDecode(token);
            return decoded.exp * 1000 < Date.now()
        } catch (error) {
            console.error("Invalid token:", error)
            return true
        }
    },

    checkAndLogoutIfExpired: () => {
        const state = useHotelStore.getState()
        if (!state.hasCheckedToken && state.isTokenExpired()) {
            set({ hasCheckedToken: true }) //ป้องกัน logout ซ้ำ
            state.logout()
        }
    },

    setupInterceptors: () => {
        axios.interceptors.response.use(
            (response) => response,
            (error) => {
                if (error.response?.status === 401) {
                    console.log("Token หมดอายุ → ทำการ Logout")
                    useHotelStore.getState().logout()
                }
                return Promise.reject(error)
            }
        )
    },

    getRoomType: async (token) => {
        try {
            const res = await listRoomType(token)
            set({
                roomTypes: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getCustomerType: async (token) => {
        try {
            const res = await listCustomerType(token)
            set({
                customertypes: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getRoom: async (token) => {
        try {
            const res = await listRoom(token)
            set({
                rooms: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getRoomStatus: async (token) => {
        try {
            const res = await listRoomStatus(token)
            set({
                roomStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getUser: async (token) => {
        try {
            const res = await listUser(token)
            console.log(res)
            set({
                users: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getBooking: async (token) => {
        try {
            const res = await listBooking(token)
            set({
                bookings: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getAddon: async (token) => {
        try {
            const res = await listAddon(token)
            set({
                addons: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getBookingStatus: async (token) => {
        try {
            const res = await listBookingStatus(token)
            set({
                bookingStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getPaymentStatus: async (token) => {
        try {
            const res = await listPaymentStatus(token)
            set({
                paymentStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getMyBookings: async (token) => {
        try {
            const res = await myBookings(token)
            set({
                myBookings: res.data
            })
        } catch (err) {
            console.error(err)
        }
    },
    getPaymentMethod: async (token) => {
        try {
            const res = await listPaymentMethod(token)
            set({
                paymentMethods: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getProfile: async (token) => {
        try {
            const res = await myProfile(token)
            set({
                profile: res.data
            })
        } catch (err) {
            console.error(err)
        }
    },
    getCleaningRequest: async (token) => {
        try {
            const res = await listCleaningRequest(token)
            set({
                cleaningRequests: Array.isArray(res.data) ? res.data : []
            })
        } catch (error) {
            console.error("Error fetching cleaning requests:", error)
            set({ cleaningRequests: [] })
        }
    },
    getCleaningRequestStatus: async (token) => {
        try {
            const res = await listCleaningRequestStatus(token)
            set({
                cleaningRequestStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getCleaningListItem: async (token) => {
        try {
            const res = await listCleaningListItem(token)
            set({
                cleaningListItems: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getCleaningReportStatus: async (token) => {
        try {
            const res = await listCleaningReportStatus(token)
            set({
                cleaningReportStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getCleaningStatus: async (token) => {
        try {
            const res = await listCleaningStatus(token)
            set({
                cleaningStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getRepairRequestStatus: async (token) => {
        try {
            const res = await listRepairRequestStatus(token)
            set({
                repairRequestStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getRepairStatus: async (token) => {
        try {
            const res = await listRepairStatus(token)
            set({
                repairStatuses: res.data
            })
        } catch (err) {
            console.log(err)
        }
    },
    getRepairRequest: async (token) => {
        try {
            const res = await listRepairRequest(token)
            set({
                repairRequests: res.data
            })
        } catch (err) {
            console.log(err)
        }
    }
})

const usePersist = {
    name: "hotel-store",
    storage: createJSONStorage(() => localStorage)
}

const useHotelStore = create(persist(hotelStore, usePersist))

//เรียกใช้ Interceptor เมื่อโหลดแอป
useHotelStore.getState().setupInterceptors()

export default useHotelStore