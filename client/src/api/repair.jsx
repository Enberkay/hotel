import axios from "axios"
const API_URL = import.meta.env.VITE_API_URL

export const repairRequest = async (token, reportIds, rooms) => {
    console.log("ส่งข้อมูลแจ้งซ่อม:", { reportIds, rooms })
    return axios.post(
        `${API_URL}/repair-requests`,
        { reportIds, rooms },  // ส่ง reportIds พร้อมกับ rooms
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const listRepairRequest = async (token) => {
    return axios.get(`${API_URL}/repair-requests`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const readRepairRequest = async (token, id) => {
    return axios.get(`${API_URL}/repair-requests/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}


export const notedRepairRequest = async (token, requestId) => {
    return axios.put(
        `${API_URL}/repair-requests`,
        { requestId },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}


export const repairReport = async (token, requestId, rooms) => {
    console.log(requestId, rooms)
    return axios.post(
        `${API_URL}/repair-reports`,
        {
            requestId,
            rooms
        },
        {
            headers: {
                Authorization: `Bearer ${token}`
            }
        }
    )
}