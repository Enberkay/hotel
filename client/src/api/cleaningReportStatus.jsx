import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createCleaningReportStatus = async (token, form) => {
    return axios.post(`${API_URL}/cleaning-report-statuses`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCleaningReportStatus = async (token) => {
    return axios.get(`${API_URL}/cleaning-report-statuses`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}