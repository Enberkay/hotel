import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const cleaningRequest = async (token, rooms) => {
    return axios.post(
        `${API_URL}/cleaning-requests`,
        {
            rooms: rooms.map((room) => ({
                roomId: room.roomId,
                description: room.description || ""  // เพิ่ม description ของแต่ละห้อง
            }))
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export const cleaningReport = async (token, requestId, rooms) => {
    return axios.post(
        `${API_URL}/cleaning-reports`,
        {
            requestId,
            rooms
        },
        {
            headers: {
                Authorization: `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        }
    )
}


export const listCleaningRequest = async (token) => {
    return axios.get(
        `${API_URL}/cleaning-requests`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listCleaningReport = async (token) => {
    return axios.get(`${API_URL}/cleaning-reports`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readCleaningRequest = async (token, id) => {
    return axios.get(
        `${API_URL}/cleaning-requests/${id}`,
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export const readCleaningReport = async (token, id) => {
    return axios.get(`${API_URL}/cleaning-report/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const allListCleaningReport = async (token) => {
    return axios.get(`${API_URL}/all-cleaning-reports`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const notedCleaningReport = async (token, reportId) => {
    return axios.put(
        `${API_URL}/cleaning-report-noted`,
        { reportId },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}

export const notedCleaningRequest = async (token, requestId) => {
    return axios.put(
        `${API_URL}/cleaning-request-noted`,
        { requestId },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}