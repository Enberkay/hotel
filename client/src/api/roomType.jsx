import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const createRoomType = async (token, form) => {
    return axios.post(`${API_URL}/room-types`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listRoomType = async (token) => {
    return axios.get(`${API_URL}/room-types`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readRoomType = async (token, id) => {
    return axios.get(`${API_URL}/room-types/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateRoomType = async (token, id, form) => {
    return axios.put(`${API_URL}/room-types/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const removeRoomType = async (token, id) => {
    return axios.delete(`${API_URL}/room-types/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
