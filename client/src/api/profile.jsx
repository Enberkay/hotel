import axios from "axios"

const API_URL = import.meta.env.VITE_API_URL

export const myProfile = async (token) => {
    return axios.get(`${API_URL}/profile`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
}

export const updateProfile = async (token, form) => {
    return axios.put(`${API_URL}/profile`, form, {
        headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json"
        }
    })
}
