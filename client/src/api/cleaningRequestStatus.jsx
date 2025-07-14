import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createCleaningRequestStatus = async (token, form) => {
    return axios.post(`${API_URL}/cleaning-request-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCleaningRequestStatus = async (token) => {
    return axios.get(`${API_URL}/cleaning-request-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}