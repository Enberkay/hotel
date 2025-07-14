import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const createUser = async (token, form) => {
    return axios.post(`${API_URL}/users`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const listUser = async (token) => {
    return axios.get(`${API_URL}/users`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const readUser = async (token, id) => {
    return axios.get(`${API_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateUser = async (token, id, form) => {
    return axios.put(`${API_URL}/users/${id}`, form, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const deleteUser = async (token, id) => {
    return axios.delete(`${API_URL}/users/${id}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}
