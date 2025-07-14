import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createCleaningStatus = async (token, form) => {
    return axios.post(`${API_URL}/cleaning-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCleaningStatus = async (token) => {
    return axios.get(`${API_URL}/cleaning-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}