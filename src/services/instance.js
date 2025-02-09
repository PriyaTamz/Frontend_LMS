import axios from "axios";

const baseurl = 'https://backend-lms-ftog.onrender.com';
//const baseurl = 'http://localhost:3001';

const instance = axios.create({
    baseURL: baseurl,
    //timeout: 60000,
    headers: {
        'Content-Type': 'application/json',
    },
    withCredentials: true
})

instance.interceptors.request.use((config) => {
    const token = localStorage.getItem('token');
    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
}, (error) => {
    return Promise.reject(error);
});

export default instance;