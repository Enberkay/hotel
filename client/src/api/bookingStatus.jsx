import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createBookingStatus = async (token, form) => {
    return axios.post(`${API_URL}/booking-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listBookingStatus = async (token) => {
    return axios.get(`${API_URL}/booking-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}