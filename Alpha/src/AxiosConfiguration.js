import axios from "axios";

const AxiosConfiguration = axios.create({
    baseURL: "http://localhost:8083/api/",
});

axios.interceptors.request.use((config) => {
    const token = localStorage.getItem("authToken");
    if (token) {
        config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default AxiosConfiguration;