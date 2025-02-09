import axios from "axios";

// Determine base URL dynamically based on the environment
const baseurl =
    process.env.NODE_ENV === "production"
        ? "https://backend-lms-ftog.onrender.com" // Production backend
        : "http://localhost:3001"; // Local backend

const instance = axios.create({
    baseURL: baseurl,
    //timeout: 60000,
    headers: {
        "Content-Type": "application/json",
    },
    withCredentials: true,
});

instance.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => {
        return Promise.reject(error);
    }
);

export default instance;
