import axios from "axios"

// เขียนแบบไม่มี return และไม่มี {} shorthand นั้นเอง
const API_URL = import.meta.env.VITE_API_URL // ดึงค่าจาก .env

export const currentUser = async (token) =>
    await axios.post(`${API_URL}/current-user`,
        {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )

// แบบมี return และ {} แบบเต็มๆ
export const currentAdmin = async (token) => {
    return await axios.post(`${API_URL}/current-admin`,
        {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )
}

// แบบมี return และ {} แบบเต็มๆ
export const currentCustomer = async (token) => {
    return await axios.post(`${API_URL}/current-customer`,
        {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )
}

export const currentFront = async (token) => {
    return await axios.post(`${API_URL}/current-front`,
        {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )
}

export const currentHousekeeping = async (token) => {
    return await axios.post(`${API_URL}/current-housekeeping`,
        {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )
}
export const currentMaintenance = async (token) => {
    return await axios.post(`${API_URL}/current-maintenance`,
        {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    }
    )
}

export const removeFiles = async (token, filename) => {
    return axios.post(`${API_URL}/removeimages`, { filename }, {
        headers: {
            Authorization: `Bearer ${token}`,
        },
    });
};
