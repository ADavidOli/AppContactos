import axios from "axios";
import type { AxiosInstance } from "axios";

const api:AxiosInstance = axios.create({
    baseURL: "http://localhost:3000/api",
    timeout: 5000,
    headers:{
        'Content-Type': 'application/json',
    },
})

export default api