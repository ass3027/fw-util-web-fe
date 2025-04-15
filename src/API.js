import axios from "axios";

const WS_API_URL = import.meta.env.VITE_WS_API_URL;
const API_URL = import.meta.env.VITE_API_URL;
const API = axios.create({
    baseURL: API_URL,
    timeout: 10000,
    headers: { "Content-Type": "application/json" }
});

export {API, API_URL, WS_API_URL};